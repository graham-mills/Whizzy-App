WHIZZY.namespace("utilities.ActionQueue");

WHIZZY.utilities.ActionQueue = {
	initialise: function() {
		this.Transition = WHIZZY.modules.Transition;
		this.Animation = WHIZZY.modules.Animation;
		this.ProgressBar = WHIZZY.utilities.ProgressBar;
		this.TransitionNode = WHIZZY.modules.TransitionNode;
		this.Controls = WHIZZY.utilities.controls;
		this.Camera = WHIZZY.modules.Camera;

		this.actions = [];
		this.transitionNodes = [];
		this.currentAction = 0;
		this.lastNode = undefined;
		this.direction = 1;
		this.activeAction = undefined;
	},
	addAction: function(action) {
		if (action instanceof this.TransitionNode)
		{
			this.addTransition(action);
		}
		else
		{
			this.actions.push(action);
		}
	},
	addTransition: function(node) {
		this.transitionNodes.push(node);
		if(this.transitionNodes.length == 1)
		{
			this.Camera.scale = node.scale;
			this.Camera.position = node.position.copy();
			this.Camera.rotation = node.rotation;
			this.lastNode = node;
		}
		else
		{
			this.actions.push(new this.Transition({
				startNode: this.transitionNodes[this.transitionNodes.length-2],
				endNode: this.transitionNodes[this.transitionNodes.length-1],
				sequenced: true,
				duration: this.transitionNodes[this.transitionNodes.length-1].duration
			}));
		}
		if (this.ProgressBar) this.ProgressBar.addTransition();
	},
	transitionTo: function(endNode) {
		if(this.activeAction) return;
		var startNode = this.currentNode(),
			deltaPos = endNode.position.subtract(startNode.position),
			greaterDimension = (Math.abs(deltaPos.x) > Math.abs(deltaPos.y) ? Math.abs(deltaPos.x) : Math.abs(deltaPos.y)),
			deltaScale = Math.abs(endNode.scale - startNode.scale),
			deltaTheta = Math.abs(endNode.rotation - startNode.rotation);

		// Check for change
		if(deltaPos.x == 0 && deltaPos.y == 0
			&& deltaScale == 0 && deltaTheta == 0)
			{
				return; 
			}

		deltaScale = deltaScale/5;
		deltaTheta = deltaTheta/3;
		greaterDimension = greaterDimension/2000;

		var duration = (deltaScale > deltaTheta ? deltaScale : deltaTheta);
		duration = (duration > greaterDimension ? duration : greaterDimension);

		this.activeAction = new this.Transition({
			startNode: startNode,
			endNode: endNode,
			sequenced: false,
			duration: duration
		});
		this.activeAction.start(1);
	},
	// Start current action if not-started else
	// Go to next action and start
	nextAction: function() {
		if (this.activeAction) return;

		this.direction = 1;

		if(!this.Camera.atNode(this.lastNode))
		{
			this.transitionTo(this.lastNode);
			return;
		}

		if(this.currentAction >= this.actions.length)
		{
			this.resetPresentation();
			return;
		}

		var nextAction = this.actions[this.currentAction];
		if(nextAction instanceof this.Transition)
		{
			this.nextTransition(nextAction);
			this.currentAction++;
		}
		else if (nextAction instanceof this.Animation)
		{
			this.nextAnimation(nextAction);
			this.currentAction++;
		}
	},
	prevAction: function() {
		if (this.activeAction) return;

		this.direction = -1;

		if(!this.Camera.atNode(this.lastNode))
		{
			this.transitionTo(this.lastNode);
			return;
		}

		if(this.currentAction <= 0)
		{
			return;
		}

		var nextAction = this.actions[this.currentAction-1];
		if(nextAction instanceof this.Transition)
		{
			this.nextTransition(nextAction);
			this.currentAction--;
		}
		else if (nextAction instanceof this.Animation)
		{
			this.nextAnimation(nextAction);
			this.currentAction--;
		}

		if(this.currentAction == 0) this.Controls.disableButton("Prev", true);
	},
	nextTransition: function(nextTransition) {
		this.ProgressBar.nextTransition(this.direction);
		this.lastNode = (this.direction === 1 ? nextTransition.endNode : nextTransition.startNode);
		this.activeAction = nextTransition;
		this.activeAction.start(this.direction);
		this.Controls.disableButton("Prev", false);
	},
	nextAnimation: function(nextAnimation) {
		if (nextAnimation.started)
		{
			this.nextAction();
		}
		else
		{
			this.activeAction = nextAnimation;
			this.activeAction.start(this.direction);
		}
	},
	currentNode: function() {
		return new this.TransitionNode({
			position: this.Camera.position.copy(),
			scale: this.Camera.scale,
			rotation: this.Camera.rotation,
			sequenced: false
		});
	},
	resetPresentation: function() {
		this.ProgressBar.reset(this.direction);
		this.Controls.disableButton("Prev", true);
		if (this.direction === 1)
		{
			this.currentAction = 0;
			this.lastNode = this.transitionNodes[0];
		}
		else
		{
			this.currentAction = this.actions.length;
			this.lastNode = this.transitionNodes[this.transitionNodes.length-1];
		}
		
		for(var a in this.actions)
		{
			this.actions[a].reset(this.direction);
		}
		this.transitionTo(this.lastNode);
	},
	sceneClicked: function(event) {
		console.log("Scene clicked: " + event.detail.id);
		if(!this.activeAction)
		{
			this.transitionTo(event.detail.getNode());
		}
	},
	update: function() {
		if(this.activeAction)
		{
			this.activeAction.update();

			if(this.activeAction instanceof this.Transition &&
				this.activeAction.endNode.sequenced === true)
			{
				this.ProgressBar.updateTransition(this.activeAction.getProgress());
			}

			if(this.activeAction.finished)
			{
				this.activeAction = undefined;
			}
		}
	}
};
WHIZZY.namespace("modules.Transition");

WHIZZY.modules.Transition = ( function() {
	var Debug = WHIZZY.utilities.debugger,
		Vector = WHIZZY.modules.Vector,
		Camera = WHIZZY.modules.Camera;

	function Transition(parameters) {
		this.currentStep = 1;
		this.duration = parameters.duration; // Seconds
		this.keyframes = Math.round(WHIZZY.settings.FPS * this.duration);
		this.state = {pos:{x:0,y:0}, scale:0, theta:0};
		this.started = false;
		this.finished = false;

		this.startNode = parameters.startNode;
		this.endNode = parameters.endNode;
		this.direction = parameters.direction || 1;
		
		this.initialise();
	};

	// Breaks transition into keyframes
	Transition.prototype.initialise = function () {
		var thetaDelta = this.endNode.rotation - this.startNode.rotation;
		var scaleDelta = this.endNode.scale - this.startNode.scale;

		var movementVector = this.endNode.position.subtract(this.startNode.position);
		this.moveStep = movementVector.divide(this.keyframes);
		this.scaleStep = scaleDelta/this.keyframes;
		this.rotateStep = thetaDelta/this.keyframes;
	};

	Transition.prototype.start = function(direction) {
		this.direction = direction;
		this.currentStep = (direction === 1 ? 1 : this.keyframes);
		this.started = true;
		this.finished = false;
	};

	Transition.prototype.reset = function(direction) {
		this.started = false;
		this.finished = false;
	};

	Transition.prototype.update = function() {
		var currentStep = this.currentStep;
		var newPosition = this.moveStep.multiply(currentStep);
		Camera.position = this.startNode.position.add(newPosition);
		Camera.rotation = (this.startNode.rotation + (this.rotateStep * currentStep));
		Camera.scale = (this.startNode.scale + (this.scaleStep * currentStep));

		if (this.direction === 1)
		{
			this.currentStep++;
			if (this.currentStep >= this.keyframes)
			{
				Camera.position = this.endNode.position.copy();
				Camera.rotation = this.endNode.rotation;
				Camera.scale = this.endNode.scale;
				this.finished = true;
			}
		}
		else
		{
			this.currentStep--;
			if(this.currentStep <= 0)
			{
				Camera.position = this.startNode.position.copy();
				Camera.rotation = this.startNode.rotation;
				Camera.scale = this.startNode.scale;
				this.finished = true;
			}
		}
	};

	Transition.prototype.getProgress = function() {
		var percent = this.currentStep/this.keyframes;
		if (this.direction === -1)
		{
			percent = 1 - percent;
		}
		return percent;
	};

	return Transition;
}());


WHIZZY.namespace("modules.TransitionNode");
WHIZZY.modules.TransitionNode = ( function() {

	function TransitionNode(parameters)
	{
		this.position = new WHIZZY.modules.Vector(parameters.position.x, parameters.position.y);
		this.scale = parameters.scale;
		this.rotation = parameters.rotation;
		this.sequenced = parameters.sequenced || false;
		this.duration = parameters.duration;
	};

	return TransitionNode;
}());
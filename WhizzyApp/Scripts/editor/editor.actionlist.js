WHIZZY.namespace("editor.ActionList");

WHIZZY.editor.ActionList = {
	enabled: false,
	ActionQueue: undefined,
	Transformable: undefined,
	ActionPanel: undefined,
	Camera: undefined,
	TransitionNode: undefined,
	Animation: undefined,
	Vector: undefined,
	actions: [],
	selectedAction: undefined,
	transitions: [],
	animations: [],
	listItem: "<li class='sortable select-action sortlist-item' data-id='@id'><span class='glyphicon glyphicon-menu-hamburger'></span>@actionName</li>",
	initialise: function() {
		this.ActionQueue = WHIZZY.utilities.ActionQueue;
		this.Transformable = WHIZZY.editor.Transformable;
		this.ActionPanel = WHIZZY.editor.ActionPanel;
		this.Animation = WHIZZY.editor.Animation;
		this.Camera = WHIZZY.modules.Camera;
		this.TransitionNode = WHIZZY.editor.TransitionNode;
		this.Vector = WHIZZY.modules.Vector;

		this.getActions();

		$(".select-action[data-id='n0']").click(function () {
            WHIZZY.editor.ActionList.actionClicked($(this).data("id"));
        });
        $("#btn_addtransition").click(function() {
			WHIZZY.editor.ActionList.newTransition();
		});
	},
	show: function() {
		$("#panel-transitions-1").css("display", "block");
	},
	hide: function() {
		$("#panel-transitions-1").css("display", "none");
	},
	getActions: function() {
		var transitionCount = 0,
			animationCount = 0,
			name,
			id;

		this.transitions = [];
		this.animations = [];
		this.actions = [];

		this.addTransition(this.ActionQueue.transitionNodes[0], 0); // Add the start node

		for(var a in this.ActionQueue.actions)
		{
			if (this.ActionQueue.actions[a] instanceof WHIZZY.modules.Transition)
			{
				transitionCount++;
				name = "Transition " +transitionCount;
				id = "n"+transitionCount;
				this.addTransition(this.ActionQueue.actions[a].endNode, transitionCount);
				this.addListItemToEnd(name, id);
			}
			else if (this.ActionQueue.actions[a] instanceof WHIZZY.modules.Animation)
			{
				animationCount++;
				name = "Animation " + animationCount; 
				id = "a"+animationCount;
				this.addAnimation(this.ActionQueue.actions[a], animationCount);
				this.addListItemToEnd(name, id);
			}
			this.initialiseSortable(id);
		}
	},
	initialiseSortable: function(id) {
		$("#actionlist").sortable({
            appendTo: "parent",
            axis: "y",
            tolerance: "pointer",
            containment: "parent",
            cursor: "move",
            distance: 5,
            placeholder: "placeholder",
            items: ".sortable",
            stop: function() { WHIZZY.editor.ActionList.onSort();}
        });

        $(".select-action[data-id='"+id+"']").click(function () {
            WHIZZY.editor.ActionList.actionClicked($(this).data("id"));
        });
	},
	addListItem: function(name, id) {
		if (this.selectedAction == undefined)
			this.addListItemToEnd(name, id);
		else if (this.selectedAction instanceof this.TransitionNode && this.selectedAction.id == 0)
			this.addListItemToStart(name, id);
		else
			this.addListItemAfterSelected(name, id);
	},
	addListItemToEnd: function(name, id) {
		$("#actionlist").append(this.listItem.split("@actionName").join(name).split("@id").join(id));
	},
	addListItemToStart: function(name, id) {
		$("#actionlist").prepend(this.listItem.split("@actionName").join(name).split("@id").join(id));
		this.onSort();
	},
	addListItemAfterSelected: function(name, id) {
		$("#actionlist").children(".selected").after(this.listItem.split("@actionName").join(name).split("@id").join(id));
		this.onSort();
	},
	addTransition: function(node, id) {
		var newNode = new this.TransitionNode(node, id);
		this.transitions.push(newNode);
		this.actions.push(newNode);
		return newNode;
	},
	addAnimation: function(animation, id) {
		var newAnim = new this.Animation({
			id: id,
			animation: animation,
			position: animation.endPos.copy(),
			scale: animation.endScale,
			rotation: animation.endTheta,
			size: animation.object.size
		});


		this.animations.push(newAnim);
		this.actions.push(newAnim);
		return newAnim;
	},
	newTransition: function() {
		var newNode = new WHIZZY.modules.TransitionNode({
			position: this.Camera.position,
			scale: this.Camera.scale,
			rotation: this.Camera.rotation,
			sequenced: true,
			duration: 1.0
		});
		var nodeId = WHIZZY.editor.Framework.findFreeId(this.transitions);
		newNode = this.addTransition(newNode, nodeId);

		this.addListItem("Transition " + nodeId, "n"+nodeId);
		this.initialiseSortable("n"+nodeId);
		this.updateActions();
		this.select(newNode);
	},
	newAnimation: function(animation) {
		var id = WHIZZY.editor.Framework.findFreeId(this.animations, 1);
		newAnim = this.addAnimation(animation, id);
		this.addListItem("Animation " + id, "a"+id);
		this.initialiseSortable("a"+id);
		this.updateActions();
		this.select(newAnim);
		return newAnim;
	},
	onSort: function() {
		var sortedIds = $("#actionlist").sortable("toArray", {attribute: 'data-id'});
		var id, action,
			newActions = [],
			newTransitions = [],
			newAnimations = [];

		newActions.push(this.actions[0]);
		newTransitions.push(this.actions[0]);

		for(var e in sortedIds)
		{
			actionType = sortedIds[e].substring(0,1);
			id = sortedIds[e].substring(1, sortedIds[e].length);

			if (actionType == "a")
			{
				action = WHIZZY.editor.Framework.findObjectById(this.animations, id);
				newAnimations.push(action);
			}
			else
			{
				action = WHIZZY.editor.Framework.findObjectById(this.transitions, id);
				newTransitions.push(action);
			}
			newActions.push(action);
		}
		this.actions = newActions;
		this.transitions = newTransitions;
		this.Animations = newAnimations;
	},
	actionClicked: function(id) {
		type = id.substring(0,1);
		id = id.substring(1,id.length);
		var action;
		if (type === "n")
		{
			this.select(WHIZZY.editor.Framework.findObjectById(this.transitions, id));
		}
		else if (type === "a")
		{
			this.select(WHIZZY.editor.Framework.findObjectById(this.animations, id));
		}
	},
	select: function(action) {
		if(!action) return;
		this.deselect();
		if (action instanceof WHIZZY.editor.TransitionNode)
		{
			this.selectedAction = action;
			$(".select-action[data-id='n"+action.id+"']").addClass("selected");
		}
		else if (action instanceof WHIZZY.editor.Animation)
		{
			this.selectedAction = action;
			$(".select-action[data-id='a"+action.id+"']").addClass("selected");
		}
		else
		{
			// Entity selected
			// Attach associated animations
			action.animations = this.getObjectAnimations(action);
		}
		this.ActionPanel.select(action);
		this.Transformable.select(action);
	},
	deselect: function() {
		this.selectedAction = undefined;
		$(".select-action").removeClass("selected");
		this.ActionPanel.deselect();
	},
	getObjectAnimations: function(object) {
		var anims = [];
		for(var a in this.animations)
		{
			if (this.animations[a].object === object)
			{
				anims.push(this.animations[a]);
			}
		}
		return anims;
	},
	deleteAction: function(action) {
		this.actions.splice(this.actions.indexOf(action),1);
		if (action instanceof this.TransitionNode)
		{
			$(".select-action[data-id='n"+action.id+"']").remove();
			this.transitions.splice(this.transitions.indexOf(action), 1);
		}
		else if (action instanceof this.Animation)
		{
			$(".select-action[data-id='a"+action.id+"']").remove();
			this.animations.splice(this.animations.indexOf(action), 1)
		}
		if (this.selectedAction === action) this.selectedAction = undefined;
		this.updateActions();
	},
	updateActions: function() {
		this.ActionQueue.actions = [];
		for(var a in this.actions)
		{
			if (this.actions[a] instanceof this.TransitionNode)
			{
				this.ActionQueue.actions.push(this.actions[a].node);
			}
			else if (this.actions[a] instanceof this.Animation)
			{
				this.ActionQueue.actions.push(this.actions[a].animation);
			}
		}
	},
	draw: function(context) 
	{
		if (!this.enabled) return;
		this.drawAnimations(context);
		this.drawTransitions(context);
	},
	drawAnimations: function(context) 
	{
		context.save();
		for(var a in this.animations)
		{
			this.animations[a].draw(context);
		}
		context.restore();
	},
	drawTransitions: function(context)
	{
		context.save();
		context.strokeStyle = "#00CC66";
		context.fillStyle = "#00CC66";
		this.drawDotToDot(context);
		for(var t in this.transitions)
		{
			this.transitions[t].draw(context);
		}
		context.restore();
	},
	drawDotToDot: function(context) {
		context.save();
		var startPos, endPos, halfway, angle, offset;
		var camScale = 1/WHIZZY.modules.Camera.scale;
		context.scale(1/camScale, 1/camScale);
		context.lineWidth = 1;
		for(var t in this.transitions)
		{
			if (t == 0) continue;
			context.save();
			startPos = this.transitions[t-1].position.copy();
			endPos = this.transitions[t].position.copy();
			halfway = endPos.subtract(startPos).divide(2).multiply(camScale);
			angle = Math.atan2(halfway.y, halfway.x);

			context.beginPath();
			context.moveTo(startPos.x*camScale, startPos.y*camScale);
			context.lineTo(endPos.x*camScale, endPos.y*camScale);
			context.stroke();

			context.beginPath();
			context.translate(startPos.x*camScale + halfway.x, startPos.y*camScale + halfway.y);
			context.rotate(angle);
			context.moveTo(0, 0);
			context.lineTo(0, -3);
			context.lineTo(7, 0);
			context.lineTo(0, 3);
			context.lineTo(0, 0);
			context.fill();
			context.restore();
		}
		
		context.restore();
	},
	mouseHover: function(mouse) {
		hoveredEntities = [];
		if (!this.enabled) return hoveredEntities;

		for(var a in this.animations)
		{
			hoveredEntities.concat(this.animations[a].mouseHover(mouse));
		}
		for(var t in this.transitions)
		{
			if(this.transitions[t].mouseHover(mouse)){
				hoveredEntities.push(this.transitions[t]);
			}
		}

		return hoveredEntities;
	},
	mouseDown: function() {
		if (!this.enabled) return false;
		for(var a in this.actions)
		{
			if (this.actions[a].mouseHovered)
			{
				this.actions[a].mouseDown();
				return true;
			}
		}
		return false;
	}
};

WHIZZY.namespace("WHIZZY.editor.TransitionNode");
WHIZZY.editor.TransitionNode = (function() {

	function TransitionNode(node, id) {
		this.id = id;
		this.label = (id == 0 ? "Start" : "Node " + id);
		this.node = node;
		this.position = node.position;
		this.scale = node.scale;
		this.rotation = node.rotation;
		this.duration = node.duration || 1.0;
		this.size = {x:800, y:450};
		this.mouseHovered = false;
		this.eyeImage = new Image();
		this.eyeImage.src = WHIZZY.editor.settings.EYE_ICON;
	};

	TransitionNode.prototype.draw = function(context) {
		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);

		var camScale = WHIZZY.modules.Camera.scale,
			scale = this.scale/camScale;
		context.scale(camScale, camScale);

		context.beginPath();

		context.lineWidth = 1;
		var width = this.size.x*scale,
			height = this.size.y*scale;

		if(this.mouseHovered)
		{
			context.strokeStyle = WHIZZY.settings.HOVER_STROKE;
			context.shadowColor = WHIZZY.settings.HOVER_SHADOW;
			context.shadowBlur = WHIZZY.settings.HOVER_BLUR;
			context.lineWidth = WHIZZY.settings.HOVER_WIDTH;
		}
		else context.strokeStyle = "grey";
		context.strokeRect(-width/2, -height/2, width, height);
		this.eyeImage.width *= scale;
		this.eyeImage.height *= scale;
		context.drawImage(this.eyeImage, -12, -12, 25, 25);

		context.strokeStyle = 0;
		context.textBaseline = "bottom";
		context.textAlign = "center";
		context.font = WHIZZY.editor.settings.LABEL_FONT;
		context.lineWidth = 3;
		context.strokeStyle = "black";
		context.strokeText(this.label, 0,-10);
		context.fillStyle = "white";
		context.fillText(this.label, 0,-10);
		context.restore();
	};

	TransitionNode.prototype.transformMouse = function(mouse) {
		var newMouse = mouse.copy();
		newMouse.rotate(this.rotation);
		return newMouse;
	};

	TransitionNode.prototype.mouseHover = function(mouse) {
		mouse = this.transformMouse(mouse);
		var halfX = (this.size.x/2)*this.scale,
			halfY = (this.size.y/2)*this.scale;
		
		if(mouse.x > this.position.x - halfX && mouse.x < this.position.x + halfX &&
			mouse.y > this.position.y - halfY && mouse.y < this.position.y + halfY)
		{
			this.mouseHovered = true;
			return true;
		}
		else this.mouseHovered = false;
		return false;
	};

	TransitionNode.prototype.mouseDown = function() {
		document.dispatchEvent(new CustomEvent("nodeClicked", { detail: this }));
	};	

	TransitionNode.prototype.getNode = function() {
		return {
			position: this.position,
			scale: this.scale,
			rotation: this.rotation,
			sequenced: true,
			duration: this.duration
		};
	};

	TransitionNode.prototype.isEntity = function() {
		return false;
	};

	return TransitionNode;
}());

WHIZZY.namespace("WHIZZY.editor.Animation");
WHIZZY.editor.Animation = (function() {
	var Entity = WHIZZY.modules.Entity;

	function Animation(parameters)
	{
		Entity.call(this, parameters);
		this.animation = parameters.animation;
		this.duration = this.animation.duration || 0.5;
		this.object = this.animation.object;
		this.size = this.object.size;
		this.id = parameters.id;
		this.parentObject = this.object.parentObject;
	};

	Animation.prototype = Object.create(Entity.prototype, {
		draw: {
			value: function(context) {
				context.save();
				var posX = this.position.x,
					posY = this.position.y,
					scale = this.scale,
					rotation = this.rotation;

				this.object.ghost = true;

				// Apply the override transforms
				if (this.parentObject)
				{

					context.translate(this.parentObject.position.x, this.parentObject.position.y);
					context.scale(this.parentObject.scale, this.parentObject.scale);
					context.rotate(this.parentObject.rotation);

					context.translate(posX, posY);
					context.rotate(rotation);
					context.scale(scale, scale);
				}
				else
				{
					context.translate(posX, posY);
					context.rotate(rotation, rotation);
					context.scale(scale, scale);
				}
				
				context.globalAlpha = 0.5;
				// Get state of object
				var transforms = {
					position: this.object.position.copy(),
					rotation: this.object.rotation,
					scale: this.object.scale
				}
				// Reset transformations of object
				this.object.position = new WHIZZY.modules.Vector(0,0),
				this.object.scale = 1;
				this.object.rotation = 0;
				this.object.ghost = true;
				// Draw it
				this.object.draw(context);
				// Restore previous transforms
				this.object.position = transforms.position;
				this.object.scale = transforms.scale;
				this.object.rotation = transforms.rotation;
				this.object.ghost = false;

				this.drawHover(context);
				context.restore();
			}
		},
		getAnimation: {
			value: function() {
				var anim = {
					duration: this.duration,
					endPos: this.position,
					endTheta: this.rotation,
					endScale: this.scale,
					endAlpha: this.alpha,
					object: {}
				};

				// Attach some data about the object to create reference from json data onload
				if(this.object instanceof WHIZZY.modules.Scene)
				{
					anim.object.sceneId = this.object.id;
				}
				else
				{
					var	index = 0;
					for(var c in this.parentObject.content)
					{
						if(this.parentObject.content[c] === this.object)
						{
							index = c;
							break;
						}
					}
					anim.object.sceneId = this.object.parentObject.id;
					anim.object.index = index;
				}
				return anim;
			}
		}
	});

	Animation.prototype.constructor = Animation;
	return Animation;
}());
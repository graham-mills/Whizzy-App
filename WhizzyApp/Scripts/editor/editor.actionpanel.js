WHIZZY.namespace("editor.ActionPanel");

WHIZZY.editor.ActionPanel = {
	ActionList: undefined,
	selectedAction: undefined,
	selectedObject: undefined,
	hidden: true,
	animationListItem: '<li class="animation-list-item sortlist-item" data-id="@id">@name</li>',
	initialise: function() {
		this.ActionList = WHIZZY.editor.ActionList;

		$("#btn_deleteaction").click(function() {
			WHIZZY.editor.ActionPanel.delete();
		});

		$("#btn_addanimation").click(function() {
			WHIZZY.editor.ActionPanel.animateObject();
		});

		$("#btn_deleteanimation").click(function() {
			WHIZZY.editor.ActionPanel.deleteAnimation();
		});

		$("#btn_actiondurationadd").click(function() {
			WHIZZY.editor.ActionPanel.iterateDuration(1);
		});

		$("#btn_actiondurationsubtract").click(function() {
			WHIZZY.editor.ActionPanel.iterateDuration(-1);
		});

		$("#action-duration").change(function() {
			WHIZZY.editor.ActionPanel.changeDuration();
		});

	},
	show: function() {
		this.hidden = false;
		$("#panel-transitions-2").css("display", "block");
	},
	hide: function() {
		this.hidden = true;
		$("#panel-transitions-2").css("display", "none");
		$("#animation-title").css("display", "none");
		$("#animation-panel").css("display", "none");
		$("#action-settings").css("display", "none");
		$("#animation-list").css("display", "none");
		$("#btn_deleteaction").css("display", "none");
	},
	select: function(action) {
		this.deselect();
		if(this.hidden && this.enabled) this.show();
		
		if (action instanceof WHIZZY.editor.TransitionNode)
		{
			this.selectTransition(action);
		}
		else if (action instanceof WHIZZY.editor.Animation)
		{
			this.selectAnimation(action);
		}
		else // Entity
		{
			this.selectEntity(action);
		}
	},
	selectTransition: function(transition) {
		this.selectedAction = transition;
		if (transition.id == 0) 
		{
			this.showLabel("Start Node");
			$("#btn_deleteaction").css("display", "none");
		}
		else 
		{
			this.showLabel("Transition " + transition.id);
			$("#btn_deleteaction").css("display", "block");
			$("#action-settings").css("display", "block");
			this.setDuration(transition.duration);
		}
		
	},
	selectAnimation: function(action) {
		this.selectedAction = action;
		if(!this.selectedObject) this.selectEntity(action.object);

		this.setDuration(action.duration);

		$("#animation-list").children(".selected").removeClass("selected");
		$("#animation-list").children('.animation-list-item[data-id="'+action.id+'"]').addClass("selected");
		$("#animation-title").children("h4").text("Animation " + action.id);
		$("#btn_deleteanimation").css("display", "block");
		$("#animation-title").css("display", "block");
		
		$("#action-settings").css("display", "block");
	},
	selectEntity: function(object) {
		this.selectedObject = object;
		this.listAnimations(object.animations);

		$("#animation-panel").css("display", "block");
		if(object.isType("TextObject"))
			this.showLabel("Text Object");
		else if (object.isType("ImageObject"))
			this.showLabel("Image Object");
		else if (object.isType("Arc"))
			this.showLabel("Arc Object");
		else if (object.isType("Rectangle"))
			this.showLabel("Rectangle Object");
		else if (object.isType("Shape"))
			this.showLabel("Shape Object");
		else if (object.isType("Scene"))
			this.showLabel("Scene "+object.id);	
	},
	deselect: function() {
		this.selectedAction = undefined;
		this.selectedObject = undefined;
		WHIZZY.editor.Transformable.deselect();
		this.hide();
	},
	delete: function() {
		this.ActionList.deleteAction(this.selectedAction);
		this.deselect();
	},
	showLabel: function(text) {
		$("#action-title").children("h4").text(text);
	},
	setDuration: function(duration) {
		if(!this.selectedAction || !duration) return;
		this.selectedAction.duration = duration;
		$("#action-duration").val(duration);
	},
	iterateDuration: function(direction) {
		var duration = $("#action-duration").val();
		if(parseFloat(duration) == duration)
		{
			duration = parseFloat(duration);
			duration += 0.1 * direction;
			if (duration < 0.1) duration = 0.1;
			if(duration > 30) duration = 30.0;
		}
		else
		{
			duration = 1.0;
		}
		this.setDuration(duration.toFixed(1));
	},
	changeDuration: function() {
		var duration = $("#action-duration").val();
		if(parseFloat(duration) == duration)
		{
			duration = parseFloat(duration);
			if (duration < 0.1) duration = 0.1;
			if(duration > 30) duration = 30.0;
		}
		else
		{
			duration = 1.0;
		}
		this.setDuration(duration.toFixed(1));
	},
	animateObject: function() {
		if (!this.selectedObject) return;
		var animation = new WHIZZY.modules.Animation({
			object: this.selectedObject,
			duration: 0.5
		});

		var newAnim = this.ActionList.newAnimation(animation);
		this.selectedObject.animations.push(newAnim);
		this.selectEntity(this.selectedObject);
	},
	listAnimations: function(animations) {
		if (!this.selectedObject ||
		 !this.selectedObject.animations ||
		  this.selectedObject.animations.length == 0) return;
		
		$("#animation-list").empty();
		$("#animation-list").css("display", "block");

		for(var a in animations)
		{
			$("#animation-list").append(this.animationListItem.split("@id").join(animations[a].id).split("@name").join("Animation " + animations[a].id));
		}

		if(this.selectedAction instanceof WHIZZY.editor.Animation)
		{
			$(".animation-list-item[data-id='"+this.selectedAction.id+"']").addClass("selected");
		}

		$(".animation-list-item").click(function() {
			WHIZZY.editor.ActionPanel.animationClicked($(this).data("id"));
		});
	},
	animationClicked: function(id) {
		for(var a in this.selectedObject.animations)
		{
			if (this.selectedObject.animations[a].id == id)
			{
				this.ActionList.select(this.selectedObject.animations[a]);
				break;
			}
		}
	},
	deleteAnimation: function() {
		if (!(this.selectedAction instanceof WHIZZY.editor.Animation)) return;
		this.ActionList.deleteAction(this.selectedAction);
		this.ActionList.select(this.selectedObject);
	}
};
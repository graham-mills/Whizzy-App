WHIZZY.namespace("editor.Framework");

WHIZZY.editor.Framework = {
	initialised: false,
	Stage: undefined,
	Camera: undefined,
	ActionQueue: undefined,
	Canvas: undefined,
	TransitionNode: undefined,
	initialise: function() {
		this.initialised = true;

		this.Stage = WHIZZY.modules.Stage;
		this.Camera = WHIZZY.modules.Camera;
		this.ActionQueue = WHIZZY.utilities.ActionQueue;
		this.Canvas = WHIZZY.modules.Canvas;
		this.TransitionNode = WHIZZY.modules.TransitionNode;
	},
	transitionToScene: function(scene) {
		var currentNode = this.ActionQueue.currentNode(),
			targetNode = scene.getNode();

		targetNode.scale += targetNode.scale*WHIZZY.editor.settings.SCENE_SCALE_DIFFERENCE;
		this.ActionQueue.startTransition(currentNode, targetNode);
	},
	transitionTo: function(posX, posY, scale, rotation) {
		var currentNode = this.ActionQueue.currentNode(),
			targetNode = new this.TransitionNode({
				position:{x:posX, y:posY},
				scale: scale,
				rotation: rotation
			});
		targetNode.scale += targetNode.scale*WHIZZY.editor.settings.SCENE_SCALE_DIFFERENCE;
		this.ActionQueue.transitionTo(targetNode);
	},
	findFreeId: function(array, minId) {
		var freeId = false,
			id = (minId ? minId : 0);

		while(!freeId)
		{
			freeId = true;
			for(var i = 0; i < array.length; ++i)
			{
				if (array[i].id == id)
				{
					freeId = false;
					++id;
					break;
				}
			}
		}
		return id;
	},
	findObjectById: function(array, id) {
		for(var o in array)
		{
			if(array[o].id == id)
				return array[o];
		}
		return undefined;
	},
	setCursor: function(style) {
		this.Canvas.setCursorStyle(style);
	},
	save: function() {
		var Presentation = {},
			Settings = {},
			json;

		Settings.Id = $("#presentation-id").val();
		Settings.Title = $("#presentation-title").val();
		Settings.Shared = $("#presentation-shared").prop("checked");
		Settings.IMAGE_PATH = $("#presentation-imagepath").val();
		Settings.PB_FGFILL = WHIZZY.settings.PB_FGFILL;
		Settings.PB_BGFILL = WHIZZY.settings.PB_BGFILL;
		Settings.TOGGLE_SIZE = !($("#presentation-fullscreen").prop("checked"));
		Settings.PB_DISABLED = $("#presentation-progressbar").prop("checked");
		Settings.CONTROLS_DISABLED = $("#presentation-controls").prop("checked");
		Settings.WIDTH = $("#presentation-canvaswidth").val();

		Presentation.stage = this.getStageState();
		Presentation.scenes = this.getSceneStates();
		Presentation.sceneObjects = this.getContentState();
		Presentation.actions = this.getActionStates();
		Settings.Presentation = Presentation;

		json = JSON.stringify(Settings);
		$.ajax({
            url: "/Editor/Save",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: json,
            start: function() {
            	$("#lastsaved").text("Saving..");
            },
            success: function(result) {
            	if (result == "OK")
            	{
            		var date = new Date(),
	            		hours = date.getHours(),
	            		minutes = date.getMinutes();

	      			if(hours < 10) hours = "0" + hours;
	      			if(minutes < 10) minutes = "0" + minutes;
	            	$("#lastsaved").text("Last Saved at " + hours + ":" +minutes);
            	}
            	else $("#lastsaved").text("An error ocurred while saving the presentation");
            },
            error: function() {
            	$("#lastsaved").text("An error ocurred while saving the presentation");
            }
        });


	},
	getStageState: function() {
		var stage = WHIZZY.modules.Stage,
			background = stage.scenes[0].background;

		state = {
			size: stage.size,
			background_params: {}
		}

		if(background.fillStyle != undefined) state.background_params.fillStyle = background.fillStyle;
		if(background.imageSrc != undefined) 
		{
			state.background_params.imageSrc = background.imageSrc;
			if(background.imageX != undefined) state.background_params.imageX = background.imageX;
			if(background.imageY != undefined) state.background_params.imageY = background.imageY;
			if(background.repeat != undefined) state.background_params.imageRepeat = background.repeat;
		}
		if(background.fixed  != undefined) state.background_params.fixed = background.fixed;
		return state;
	},
	getSceneStates: function() {
		var states = [],
			state,
			scene,
			bg,
			stage = WHIZZY.modules.Stage;

		for(var s in stage.scenes)
		{
			if (s == 0) continue;
			scene = stage.scenes[s];
			bg = scene.background;
			state = {
				id: scene.id,
				position: {x:scene.position.x, y:scene.position.y},
				size: scene.size,
				rotation: scene.rotation,
				scale: scene.scale,
				alpha: scene.alpha,
				background_params: {}
			}
			if(bg.fillStyle != undefined) state.background_params.fillStyle = bg.fillStyle;
			if(bg.strokeStyle != undefined) state.background_params.strokeStyle = bg.strokeStyle;
			if(bg.lineWidth != undefined) state.background_params.lineWidth = bg.lineWidth;
			if(bg.imageSrc != undefined) 
			{
				state.background_params.imageSrc = bg.imageSrc;
				if(bg.imageX != undefined) state.background_params.imageX = bg.imageX;
				if(bg.imageY != undefined) state.background_params.imageY = bg.imageY;
				if(bg.imageRepeat != undefined) state.background_params.imageRepeat = bg.imageRepeat;
			}
			if(bg.fixed != undefined) state.background_params.fixed = bg.fixed;
			states.push(state);
		}
		return states;
	},
	getContentState: function() {
		var states = [],
			scene,
			entity,
			stage = WHIZZY.modules.Stage;

		for(var s in stage.scenes)
		{
			scene = stage.scenes[s];
			for(var c in scene.content)
			{
				entity = this.getEntityState(scene.content[c]);
				entity.params.parent = scene.id;
				states.push(entity);
			}
		}
		return states;
	},
	getEntityState: function(entity) {
		var state = {},
			type;

		state.size = { x: entity.size.x, y: entity.size.y};
		state.position = {x: entity.position.x, y:entity.position.y};
		state.scale = entity.scale;
		state.alpha = entity.alpha;
		state.rotation = entity.rotation;

		if(entity.strokeStyle != undefined) state.strokeStyle = entity.strokeStyle;
		if(entity.fillStyle != undefined) state.fillStyle = entity.fillStyle;
		if(entity.lineWidth != undefined) state.lineWidth = entity.lineWidth;

		if(entity instanceof WHIZZY.modules.ImageObject)
		{
			type = "WHIZZY.modules.ImageObject";
			if(entity.crop != undefined) state.crop = entity.crop;
			state.imageSrc = entity.imageSrc;
		}
		else if(entity instanceof WHIZZY.modules.TextObject)
		{
			type = "WHIZZY.modules.TextObject";
			state.paragraphs = entity.paragraphs;
			state.align = entity.align;
			state.font = entity.font;
			state.lineHeight = entity.lineHeight;
			state.textBaseline = entity.textBaseline;
		}
		else if(entity instanceof WHIZZY.modules.Arc)
		{
			type = "WHIZZY.modules.Arc";
			state.startAngle = entity.startAngle;
			state.endAngle = entity.endAngle;
			state.radius = entity.radius;
		}
		else if(entity instanceof WHIZZY.modules.Rectangle)
		{
			type = "WHIZZY.modules.Rectangle";
		}

		return { type:type, params:state};
	},
	getActionStates: function() {
		var actions = WHIZZY.editor.ActionList.actions,
			states = [],
			action,
			state,
			type;

		for(var a in actions)
		{
			state = {};
			action = actions[a];
			if(action instanceof WHIZZY.editor.TransitionNode)
			{
				type = "WHIZZY.modules.TransitionNode";
				state = action.getNode();
			}
			else
			{
				type = "WHIZZY.modules.Animation";
				state = action.getAnimation();
			}
			states.push({type: type, params: state});
		}
		return states;
	}
}
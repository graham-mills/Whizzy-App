WHIZZY.namespace("modules.Stage");

WHIZZY.modules.Stage = {

	Scene: WHIZZY.modules.Scene,
	scenes: [],
	initialise: function(parameters) {
		//Variables
		this.size = parameters.size;
		this.position = {x:0, y:0};

		this.addScene({
			id:0,
			position: {x: this.position.x, y: this.position.y},
			size: this.size,
			scale: 1,
			rotation: 0,
			background_params: {
				fillStyle: parameters.background_params.fillStyle,
				strokeStyle: '#ccc',
				lineWidth: 2,
				imageSrc: parameters.background_params.imageSrc,
				imageX: parameters.background_params.imageX,
				imageY: parameters.background_params.imageY,
				imageRepeat: parameters.background_params.imageRepeat,
				fixed: parameters.background_params.fixed
			}
		});
	},

	addScene: function(scene_params) {
		this.scenes.push(new this.Scene(scene_params));
	},

	addContent: function(content) {
		var scene = this.getSceneById(content.parent);
		if(scene != undefined) scene.addObject(content);
	},

	draw: function(context) {
		context.save();
		this.drawScenes(context);
		context.restore();
	},

	drawScenes: function(context) {
		for(var i in this.scenes)
		{
			this.scenes[i].draw(context);
		}
	},

	getSceneById: function(id) {
		for(var s in this.scenes)
		{
			if (this.scenes[s].id === id)
				return this.scenes[s];
		}
		return undefined;
	},

	mouseHover: function(mouse) {
		var hoveredEntities = [];

		hoveredEntities = hoveredEntities.concat(this.scenes[0].contentHover(mouse));

		// Ignore stage (scene 0)
		for(var i = this.scenes.length; i > 1; --i)
		{
			hoveredEntities = hoveredEntities.concat(this.scenes[i-1].mouseHover(mouse));
		}
		return hoveredEntities;
	}
};
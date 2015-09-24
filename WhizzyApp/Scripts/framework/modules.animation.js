WHIZZY.namespace("modules.Animation");

WHIZZY.modules.Animation = ( function() {
	var Debug = WHIZZY.utilities.debugger,
		Vector = WHIZZY.modules.Vector;


	function Animation(parameters) {
		if(parameters.object.sceneId != undefined)
		{
			var scene;
			for(var s in WHIZZY.modules.Stage.scenes)
			{
				if (WHIZZY.modules.Stage.scenes[s].id == parameters.object.sceneId)
				{
					scene = WHIZZY.modules.Stage.scenes[s];
					break;
				}
			}
			if(parameters.object.index)
				this.object = scene.content[parseInt(parameters.object.index)];
			else this.object = scene;
		}
		else this.object = parameters.object;

		if(parameters.endPos)
		{
			this.endPos = new Vector(parameters.endPos.x, parameters.endPos.y);
		}
		else this.endPos = this.object.position.copy();
		this.endTheta = parameters.endTheta || this.object.rotation;
		this.endScale = parameters.endScale || this.object.scale;
		this.endAlpha = parameters.endAlpha || this.object.alpha;

		this.started = false;
		this.finished = false;
		this.duration = parameters.duration; // Seconds
		this.frames = WHIZZY.settings.FPS*this.duration;
		this.direction = 1;
		this.currentFrame = 1;
		this.initialise();
	};

	Animation.prototype.initialise = function(direction) {
		this.deltaScale = this.endScale - this.object.scale;
		this.deltaTheta = this.endTheta - this.object.rotation;
		this.deltaAlpha = this.endAlpha - this.object.alpha;
		this.deltaPosition = this.endPos.subtract(this.object.position);
		this.scaleStep = this.deltaScale/this.frames;
		this.thetaStep = this.deltaTheta/this.frames;
		this.moveStep = this.deltaPosition.divide(this.frames);
		this.alphaStep = this.deltaAlpha/this.frames;

		this.startScale = this.object.scale;
		this.startTheta = this.object.rotation;
		this.startAlpha = this.object.alpha;
		this.startPosition = this.object.position.copy();
	};

	Animation.prototype.start = function(direction) {
		if(direction === 1 ) this.initialise();
		this.direction = direction;
		this.started = true;
		this.finished = false;
	};

	Animation.prototype.reset = function(direction) {
		this.currentFrame = (direction === 1 ? 1 : this.frames)
		this.started = false;
		this.finished = false;
		this.resetObjectToDefault(direction);
	};

	Animation.prototype.resetObjectToDefault = function(direction) {
		if (direction === -1)
		{
			this.object.position.x = this.object.defaultPosition.x + this.deltaPosition.x;
			this.object.position.y = this.object.defaultPosition.y + this.deltaPosition.y;
			this.object.rotation = this.object.defaultRotation + this.deltaTheta;
			this.object.scale = this.object.defaultScale + this.deltaScale;
			this.object.alpha = this.object.defaultAlpha + this.deltaAlpha;
		}
		else {
			this.object.position.x = this.object.defaultPosition.x;
			this.object.position.y = this.object.defaultPosition.y;
			this.object.rotation = this.object.defaultRotation;
			this.object.scale = this.object.defaultScale;
			this.object.alpha = this.object.defaultAlpha;
		}
	};

	Animation.prototype.resetObject = function(direction) {
		if (direction === -1)
		{
			this.object.position.x = this.startPosition.x + this.deltaPosition.x;
			this.object.position.y = this.startPosition.y + this.deltaPosition.y;
			this.object.rotation = this.startTheta + this.deltaTheta;
			this.object.scale = this.startScale + this.deltaScale;
			this.object.alpha = this.startAlpha + this.deltaAlpha;
		}
		else {
			this.object.position.x = this.startPosition.x;
			this.object.position.y = this.startPosition.y;
			this.object.rotation = this.startTheta;
			this.object.scale = this.startScale;
			this.object.alpha = this.startAlpha;
		}
	};

	Animation.prototype.update = function() {
			this.object.position.x += this.moveStep.x * this.direction;
			this.object.position.y += this.moveStep.y * this.direction;;
			this.object.rotation += this.thetaStep * this.direction;;
			this.object.scale += this.scaleStep * this.direction;;
			this.object.alpha += this.alphaStep * this.direction;;

			if(this.direction === 1)
			{
				if (this.currentFrame === this.frames)
				{
					this.resetObject(-1);
					this.started = false;
					this.finished = true;
				}
				else this.currentFrame++;
			}
			else
			{
				if (this.currentFrame === 1)
				{
					this.resetObject(1);
					this.started = false;
					this.finished = true;
				}
				else this.currentFrame--;
			}
	};

	return Animation;
}());
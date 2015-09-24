WHIZZY.namespace("modules.Entity");

WHIZZY.modules.Entity = ( function() {
	var Vector = WHIZZY.modules.Vector;

	function Entity(parameters) {
		this.mouseHovered = false;

		this.position = new Vector(parameters.position.x, parameters.position.y);
		this.defaultPosition = this.position.copy();

		this.alpha = (typeof parameters.alpha != 'undefined' ? parameters.alpha : 1);
		this.defaultAlpha = this.alpha;

		this.rotation = parameters.rotation || 0;
		this.defaultRotation = this.rotation;

		this.scale = parameters.scale || 1;
		this.defaultScale = this.scale;

		this.size = parameters.size || {x: 600, y:450};
		this.defaultSize = {x:this.size.x,y:this.size.y};

		this.parent = parameters.parent;
		if(this.parent != undefined)
		{
			this.parentObject = WHIZZY.modules.Stage.getSceneById(this.parent);
		}

	};

	Entity.prototype.drawHover = function(context) {
		if (WHIZZY.editor && this.mouseHovered)
		{
			if(this.ghost && !(this.isType("Scene"))) return;
			if(this.isType("Scene") && this.id == 0) return;
			context.save();
			context.globalAlpha = 1;
			context.strokeStyle = WHIZZY.settings.HOVER_STROKE;
			context.shadowColor = WHIZZY.settings.HOVER_SHADOW;
			context.shadowBlur = WHIZZY.settings.HOVER_BLUR;
			context.lineWidth = WHIZZY.settings.HOVER_WIDTH*(WHIZZY.modules.Camera.scale/this.getScale());

			if (this instanceof WHIZZY.modules.Arc)
			{
				context.stroke();
			}
			else context.strokeRect(-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
			context.restore();
		}
	};

	Entity.prototype.mouseHover = function(mouse) {
			this.mouseHovered = false;
			var hoveredEntities = [];

			var mouse = mouse.copy();
			mouse.x -= this.position.x;
			mouse.y -= this.position.y;
			mouse = mouse.rotate(-this.rotation);

			var halfWidth = this.size.x/2 * this.scale,
				halfHeight = this.size.y/2 * this.scale;

			if (mouse.x > -halfWidth && mouse.x < halfWidth &&
				mouse.y > -halfHeight && mouse.y < halfHeight)
			{
				this.mouseHovered = true;
				hoveredEntities.push(this);
			}
			else this.mouseHovered = false;

			if (WHIZZY.editor && this instanceof WHIZZY.modules.Scene && !this.ghost)
			{
				var hoveredContent = this.contentHover(mouse);
				if(hoveredContent != undefined && hoveredContent.length > 0)
				{
					this.mouseHovered = false;
					hoveredEntities = hoveredEntities.concat(hoveredContent);
				}
			}

			return hoveredEntities;
	};

	Entity.prototype.mouseDown = function() {
		if (!this.mouseHovered) return false;
		if (this instanceof WHIZZY.modules.Scene)
		{
			document.dispatchEvent(new CustomEvent("sceneClicked", { detail: this}));
		}
		else if (WHIZZY.editor && this instanceof WHIZZY.editor.Animation)
		{
			document.dispatchEvent(new CustomEvent("animationClicked", {detail: this}));
		}
		else
		{
			document.dispatchEvent(new CustomEvent("contentClicked", { detail: this}));
		}
	};

	Entity.prototype.reset = function() {
		this.position = this.defaultPosition.copy();
		this.rotation = this.defaultRotation;
		this.alpha = this.defaultAlpha;
		this.scale = this.defaultScale;
	};

	Entity.prototype.isType = function(type) {
		if(this instanceof WHIZZY.modules.TextObject && type == "TextObject")
		return true;
		else if (this instanceof WHIZZY.modules.ImageObject && type == "ImageObject")
			return true;
		else if (this instanceof WHIZZY.modules.Arc && type == "Arc")
			return true;
		else if (this instanceof WHIZZY.modules.Rectangle && type == "Rectangle")
			return true;
		else if (this instanceof WHIZZY.modules.Shape && type == "Shape")
			return true;
		else if (this instanceof WHIZZY.modules.Scene && type == "Scene")
			return true;
		else if (this instanceof WHIZZY.editor.Animation && type == "Animation")
			return true;
		else return false;
	};

	Entity.prototype.isEntity = function() {
		if(this instanceof WHIZZY.modules.Entity) return true;
		else return false;
	};

	Entity.prototype.getScale = function() {
		if(this.parentObject)
		{
			return this.scale * this.parentObject.scale;
		}
		else return this.scale;
	};

	Entity.prototype.getPosition = function() {
		if (this.parentObject)
		{
			var x = this.position.x * this.parentObject.getScale(),
				y = this.position.y * this.parentObject.getScale();

			return new WHIZZY.modules.Vector(x + this.parentObject.position.x,
											y + this.parentObject.position.y
				);
		}
		else return this.position.copy();
	};

	Entity.prototype.getRotation = function() {
		if(this.parentObject)
		{
			return this.rotation + this.parentObject.rotation;
		}
		else return this.rotation;
	};

	return Entity;
}());
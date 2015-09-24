WHIZZY.namespace("modules.ImageObject");

WHIZZY.modules.ImageObject = ( function() {
	var Entity = WHIZZY.modules.Entity;

	function ImageObject(parameters)
	{
		Entity.call(this, parameters);
		this.crop = parameters.crop;
		this.image = new Image();
		this.imageSrc = parameters.imageSrc;
		this.image.src = WHIZZY.settings.IMAGE_PATH + parameters.imageSrc;
		this.strokeStyle = parameters.strokeStyle;
	};

	ImageObject.prototype = Object.create(Entity.prototype, {
		draw: {
			value: function(context) {
				context.save();
				context.translate(this.position.x, this.position.y);
				if (this.scale) context.scale(this.scale, this.scale);
				if (this.rotation) context.rotate(this.rotation);
				if (this.alpha != undefined) context.globalAlpha = this.alpha;
				if (this.crop)
				{
					var cropX = this.crop.x,
						cropY = this.crop.y,
						cropWidth = this.size.x/(this.crop.width-cropX) * this.image.width,
						cropHeight = this.size.y/(this.crop.height-cropY) * this.image.height; 

					context.drawImage(this.image, cropX, cropY, cropWidth, cropHeight,
										-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
				}
				else
				{
					context.drawImage(this.image, -this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
				}

				if (this.strokeStyle)
				{
					context.strokeStyle = this.strokeStyle;
					context.strokeRect(this.crop.x,  this.crop.y, this.crop.width, this.crop.height);
				}
				this.drawHover(context);
				context.restore();
			}
		}
	});

	ImageObject.prototype.constructor = ImageObject;
	return ImageObject;
}());
WHIZZY.namespace("modules.Background");

WHIZZY.modules.Background = (function(){
	//Dependencies
	var Debug = WHIZZY.utilities.debugger;

	function Background(parameters) {
		//Variables
		this.size = parameters.size;
		this.position = {x: parameters.position.x, y: parameters.position.y};
		this.fillStyle = parameters.fillStyle;
		this.strokeStyle = parameters.strokeStyle;
		this.lineWidth = parameters.lineWidth;
		this.fixed = parameters.fixed || false;
		this.imageSrc = parameters.imageSrc;

		if (parameters.imageSrc && parameters.imageX && parameters.imageY)
		{
			this.image = new Image();
			this.image.src = parameters.imageSrc;
			this.imageX = parameters.imageX;
			this.imageY = parameters.imageY;
			this.repeat = parameters.imageRepeat;
		}
	};

	Background.prototype.draw = function(context) {
		context.save();
		if (this.fixed) {
			context.setTransform(1,0,0,1,0,0);
		}

		if (this.fillStyle)
		{
			context.fillStyle = this.fillStyle;
			context.fillRect((this.position.x - this.size.x/2), (this.position.y - this.size.y/2), this.size.x, this.size.y);
		}

		if (this.image)
		{
			if (this.repeat)
			{
				this.drawRepeat(context);
			}
			else 
			{
				context.drawImage(this.image, this.position.x - this.size.x/2, this.position.y - this.size.y/2, this.size.x, this.size.y);
			}
		}

		if (this.strokeStyle)
		{
			if (this.lineWidth) context.lineWidth = this.lineWidth;
			context.strokeStyle = this.strokeStyle;
			context.strokeRect(this.position.x - this.size.x/2, this.position.y - this.size.y/2, this.size.x, this.size.y)
		}
		context.restore();
	};

	Background.prototype.drawRepeat = function(context) {
		var repeatX = Math.ceil(this.size.x / this.imageX),
			repeatY = Math.ceil(this.size.y / this.imageY),
			i,
			j,
			x,
			y,
			overflowX,
			overflowY;

		for (var i = 1; i <= repeatY; i++)
		{
			y = this.position.y - this.size.y/2 + ((i-1) * this.imageY);
			for (var j = 1; j <= repeatX; j++)
			{
				x = this.position.x - this.size.x/2 + ((j-1) * this.imageX);
				cropX = 0;
				cropY = 0;
				cropWidth = this.image.width;
				cropHeight = this.image.height;
				overflowX = 0;
				overflowY = 0;


				if (j * this.imageX > this.size.x)
				{
					overflowX =  (j * this.imageX) - this.size.x;
					cropWidth = this.image.width * (1-overflowX/this.imageX);
				}
				if (i * this.imageY > this.size.y)
				{
					overflowY = (i * this.imageY) - this.size.y;
					cropHeight = this.image.height * (1-overflowY/this.imageY);
				}
				context.drawImage(this.image, cropX, cropY, cropWidth, cropHeight, x, y, this.imageX-overflowX, this.imageY-overflowY);
			}
		}

	};

	return Background;
}());
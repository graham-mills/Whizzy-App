WHIZZY.namespace("modules.Button");

WHIZZY.modules.Button = ( function() {
	var Debug = WHIZZY.utilities.debugger;

	function Button(parameters) {
		this.name = parameters.name;
		this.align = parameters.align;
		this.InputHandler = WHIZZY.utilities.InputHandler;
		this.fillStyle = parameters.fillStyle;
		this.hoverFillStyle = '#444';
		this.position = parameters.position || {x:0,y:0};
		this.height = parameters.height;
		this.width = parameters.width;
		this.action = parameters.action;
		this.image = parameters.image;
		this.icon = parameters.icon; // Set to first icon
		this.toggleIcon = parameters.toggleIcon; // Set second icon
		this.disabled = parameters.disabled;
		this.disabledAlpha = 0.3;
		this.hoveredAlpha = 1;
		this.defaultAlpha = 0.7;
		this.mouseHovered = false;
	};

	Button.prototype.draw = function(context) {
		context.save();
		if (this.disabled) context.globalAlpha = this.disabledAlpha;
		else if (this.mouseHovered) context.globalAlpha = this.hoveredAlpha;
		else context.globalAlpha = this.defaultAlpha;

		context.fillStyle = "#333";
		context.fillRect(this.position.x, this.position.y, this.width, this.height);

		var padding = (this.width - this.icon.cropWidth)/2;
		context.drawImage(this.image, this.icon.startCrop, 0, this.icon.cropWidth, this.image.height, this.position.x+padding, this.position.y, this.icon.cropWidth, this.image.height);
		context.restore();
	};

	Button.prototype.mouseOver = function(mouse) {
		if (this.disabled) return false;

		if (mouse.x > this.position.x && mouse.x < this.position.x + this.width &&
			mouse.y > this.position.y && mouse.y < this.position.y + this.height)
		{
			this.mouseHovered = true;
			return true;
		}
		this.mouseHovered = false;
		return false;
	};

	Button.prototype.clicked = function() {
		if (this.disabled) return;
		this.InputHandler.action(this.action);
		// Toggle icons
		if (this.toggleIcon)
		{
			var temp = this.icon;
			this.icon = this.toggleIcon;
			this.toggleIcon = temp;
		}
	};

	return Button;
}());
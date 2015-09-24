WHIZZY.namespace("utilities.controls");

WHIZZY.utilities.controls = { 
	ProgressBar: undefined,
	disabled: false,
	buttonHeight: 30,
	buttonWidth: 40,
	width: 0,
	height: 0,
	innerHeight: 0,
	position: {x:0, y:0},
	image: null,
	icons: [],
	buttons: [],
	mouseHover: false,
	hoveredButton: undefined,

	initialise: function(parameters) {
		this.disabled = WHIZZY.settings.CONTROLS_DISABLED;
		if (this.disabled) return;
		this.ProgressBar = WHIZZY.utilities.ProgressBar;
		this.Canvas = WHIZZY.modules.Canvas;
	
		this.loadIcons();
		this.initialiseButtons();
		
		this.reposition();
	},

	loadIcons: function() {
		this.image = new Image();
		this.image.src = WHIZZY.settings.IMAGE_PATH + "icons.gif";

		var iconSize = WHIZZY.settings.ICON_SIZE;
		this.icons.push({ name: "maximise", startCrop: 0*iconSize, cropWidth: iconSize}); // Max icon
		this.icons.push({ name: "minimise", startCrop: 1*iconSize, cropWidth: iconSize}); // Min icon
		this.icons.push({ name: "next", startCrop: 2*iconSize, cropWidth: iconSize}); // Next icon
		this.icons.push({ name: "prev", startCrop: 3*iconSize, cropWidth: iconSize}); // Prev icon
		this.icons.push({ name: "draw", startCrop: 4*iconSize, cropWidth: iconSize}); // Draw icon
	},

	initialiseButtons: function() {
		var Button = WHIZZY.modules.Button,
			iconSize = WHIZZY.settings.ICON_SIZE;

		// Max/min button
		this.buttons.push(new Button({
			name: "Maximise",
			align: "right",
			image: this.image,
			icon: this.icons[0],
			toggleIcon: this.icons[1],
			fillStyle: this.buttonFillStyle,
			height: this.buttonHeight,
			width: this.buttonWidth,
			action: "TOGGLE_SIZE",
			disabled: !(WHIZZY.settings.TOGGLE_SIZE)
		}));

		// Next button
		this.buttons.push(new Button({
			name: "Next",
			align: "right",
			image: this.image,
			icon: this.icons[2],
			fillStyle: this.buttonFillStyle,
			height: this.buttonHeight,
			width: this.buttonWidth,
			action: "NEXT",
		}));

		// Prev button
		this.buttons.push(new Button({
			name: "Prev",
			align: "right",
			image: this.image,
			icon: this.icons[3],
			fillStyle: this.buttonFillStyle,
			height: this.buttonHeight,
			width: this.buttonWidth,
			action: "PREV",
			disabled: true
		}));

		// Draw button
		this.buttons.push(new Button({
			name: "Draw",
			align: "left",
			image: this.image,
			icon: this.icons[4],
			fillStyle: this.buttonFillStyle,
			height: this.buttonHeight,
			width: this.buttonWidth,
			action: "TOGGLE_DRAW",
		}));

	},

	draw: function(context){
		if (this.disabled) return;
		context.save();
		this.Canvas.resetContext();
		this.ProgressBar.draw(context);

		for(var b in this.buttons)
		{
			this.buttons[b].draw(context);
		}
	
		context.restore();
	},

	update: function() {
		if (this.disabled) return;
	},

	reposition: function() {
		this.width = this.Canvas.innerSize.x;
		this.position.y = (this.Canvas.innerSize.y/2) - this.buttonHeight - this.ProgressBar.height;
		this.ProgressBar.resize(this.position.y + this.buttonHeight, this.width);
		if (this.disabled) return;

		var leftCount = 0,
			rightCount = 0, // Start at 1 because drawn from left corner
			leftPos = this.position.x - this.width/2,
			rightPos = this.position.x + this.width/2;

		for(var i  = 0; i < this.buttons.length ; ++i)
		{
			var button = this.buttons[i];
			button.position.y = this.position.y;	
			if (button.align == "right") {
				rightCount++;
				button.position.x = rightPos - (rightCount * this.buttonWidth);
			}		
			else if (button.align == "left") {
				button.position.x = leftPos + (leftCount * this.buttonWidth);
				leftCount++;
			}
		}

	},

	mouseOver: function(mouse)
	{
		if (this.disabled) return;
		this.hoveredButton = undefined;
		this.mouseHovered = false;
		for(var b in this.buttons)
		{
			if (this.buttons[b].mouseOver(mouse))
			{
				this.hoveredButton = this.buttons[b];
			}
		}
		
		if(this.hoveredButton) this.mouseHovered = true;
		return this.mouseHovered;
	},

	mouseDown: function()
	{
		if (this.disabled) return;
		if (this.hoveredButton)
		{
			this.hoveredButton.clicked();
		}
	},

	disableButton: function(buttonName, bool)
	{
		for(var b in this.buttons)
		{
			if (this.buttons[b].name == buttonName)
			{
				this.buttons[b].disabled = bool;
			}
		}
	}
};
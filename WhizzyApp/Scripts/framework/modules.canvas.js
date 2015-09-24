WHIZZY.namespace("modules.Canvas");

WHIZZY.modules.Canvas = {

	initialise: function (parameters) {
		//Variables
		this.fullsize = false;
		this.margin = {top:0, left:0, right:0, bottom:0};

		this.controls = WHIZZY.utilities.controls;

		this.canvasElement = document.getElementById(parameters.id);
		if (!this.canvasElement || !this.canvasElement.getContext)
		{
			WHIZZY.utilities.debugger.error("Can't get canvas element: " + parameters.id);
			return;
		}

		this.context = this.canvasElement.getContext("2d");
		this.defaultSize = {x: parameters.width, y: this.calculateHeight(parameters.width)}
		this.size = {x: this.defaultSize.x, y: this.defaultSize.y};
		this.resize(this.size.x, this.size.y);
		this.innerRect = {left:0, top:0, right:this.defaultSize.x, bottom:this.defaultSize.y};
		this.innerSize = {x:this.defaultSize.x, y:this.defaultSize.y};
		this.scale = this.size.x/this.defaultSize.x;

		//Set elements dimensions
		this.canvasElement.width= this.defaultSize.x;
		this.canvasElement.height= this.defaultSize.y;

		//Disable right click
		this.canvasElement.oncontextmenu = function(e) {
			if (e.preventDefault())
			{
				e.preventDefault();
			}
		};	
	},


	getContext: function() {
		return this.context;
	},

	updateInnerRect: function() {
		this.innerRect = { top: this.margin.top,
							left: this.margin.left,
							right: this.size.x - this.margin.right,
							bottom: this.size.y - this.margin.bottom
						};
	},

	updateInnerSize: function() {
		this.innerSize = {
							x: this.size.x - this.margin.left - this.margin.right,
							y: this.size.y - this.margin.top - this.margin.top
		};
	},

	resetContext: function() {
		this.resetMatrix();
		this.centreContext();
		this.updateInnerRect();
		this.updateInnerSize();
	},

	resetMatrix: function() {
		this.context.setTransform(1,0,0,1,0,0);
	},

	centreContext: function() {
		this.context.translate(this.size.x/2, this.size.y/2);
	},

	calculateHeight: function(width) {
		return (width / WHIZZY.settings.ASPECT_RATIO);
	},

	calculateWidth: function(height) {
		return (height * WHIZZY.settings.ASPECT_RATIO);
	},

	resize: function (width, height) {
		//Resize canvas dimensions
		this.canvasElement.width = width;
		this.canvasElement.height = height;
		//Store current canvas dimensions
		this.size.x = width;
		this.size.y = height;
	},

	toggleSize: function() {
		if (!this.fullsize)
		{
			this.maximise();
			this.fullsize = true;
			this.resetContext();
		}
		else 
		{
			this.margin = {top:0, left:0, bottom:0, right:0}; //Remove margins
			this.minimise();
			this.fullsize = false;
			this.resetContext();
		}

		this.controls.reposition();
	},

	maximise: function () {
		// Maximise for fullscreen viewing
		// Maintain aspect ratio
		this.canvasElement.style.position = "absolute";
		this.canvasElement.style.top = "0px";
		this.canvasElement.style.left = "0px";

		var marginSize,
			windowX = window.innerWidth,
			windowY = window.innerHeight,
			newWidth = windowX,
			newHeight = this.calculateHeight(windowX);

		if (newHeight > windowY)
		{
			newHeight = windowY;
			newWidth = this.calculateWidth(newHeight);
		}

		// If calculated sizes are smaller than window, apply margins
		if (newHeight < windowY)
		{
			marginSize = windowY - newHeight;
			this.margin.top = marginSize/2;
			this.margin.bottom = marginSize/2;
		}
		if (newWidth < windowX)
		{
			marginSize = windowX - newWidth;
			this.margin.left = marginSize/2;
			this.margin.right = marginSize/2;
		}

		this.resize(windowX, windowY);
		this.scale = newWidth/this.defaultSize.x; // Used by the camera to keep the same zoom level
	},

	minimise: function () {
		this.canvasElement.style.position = "relative";
		this.resize(this.defaultSize.x, this.defaultSize.y);
		this.scale = 1;
	},

	onResize: function () {
		if (this.fullsize)
		{
			this.maximise();
		}
	},

	clear: function(context) {
		context.clearRect(0,0, this.canvasElement.width, this.canvasElement.height);
	},

	drawBackground: function(context) {
		context.save();
		this.resetMatrix();
		context.fillStyle = '#303030';
		context.fillRect(0,0, this.canvasElement.width, this.canvasElement.height);
		context.restore();
	},

	drawMargins: function(context) {
		context.save();
		this.resetMatrix();
		context.fillStyle = 'black';
		if (this.margin.top > 0)
		{
			context.fillRect(0,0,this.canvasElement.width, this.margin.top);
		}
		if (this.margin.bottom > 0)
		{
			context.fillRect(0, this.canvasElement.height - this.margin.bottom, this.canvasElement.width, this.margin.bottom);
		}
		if (this.margin.left > 0)
		{
			context.fillRect(0,0, this.margin.left, this.canvasElement.height);
		}
		if (this.margin.right > 0)
		{
			context.fillRect(this.canvasElement.width - this.margin.right, 0, this.canvasElement.width, this.canvasElement.height);
		}
		context.restore();
	},

	setCursorStyle: function(style) {
		this.canvasElement.style.cursor = style || "default";
	}

};

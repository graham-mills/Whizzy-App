WHIZZY.namespace("utilities.ProgressBar");

WHIZZY.utilities.ProgressBar = {
	disabled: false,
	Canvas: undefined,
	width: 0,
	height: 0,
	position: {x:0, y:0},
	nodes: -1, 
	currentNode: 0,
	currentNodePercent: 0,
	segmentWidth: 0,
	direction: 1,

	initialise: function(parameters) {
		this.disabled = WHIZZY.settings.PB_DISABLED;
		this.Canvas = WHIZZY.modules.Canvas;
		this.height = parameters.height;
		this.width = this.Canvas.innerSize.x;
		this.segmentWidth = this.width;
		this.bgFill = WHIZZY.settings.PB_BGFILL || "#111";
		this.fgFill = WHIZZY.settings.PB_FGFILL || "#1687D1";
	},

	addTransition: function() {
		this.nodes++;
		this.segmentWidth = this.width/(this.nodes+1);
	},

	nextTransition: function(direction) {
		this.direction = direction;
		if(this.direction === 1)
			this.currentNode++;
		else this.currentNode--;
	},

	reset: function(direction) {
		if (direction == 1) // Start
		{
			this.currentNode = 0;
		}
		else { // End
			this.currentNode = this.nodes;
		}
		this.direction = direction;
	},

	updateTransition: function(percent) {
		if(this.direction === -1) percent = 1 - percent;
		this.currentNodePercent = percent;
		WHIZZY.utilities.debugger.display.currentTransition = this.currentNode;
	},

	resize: function(yPos, width) {
		this.position.y = yPos;
		this.width = width;
		this.segmentWidth = this.width/(this.nodes);
	},

	draw: function(context) {
		context.save();
		// Left position
		var posX = this.position.x - this.width/2;

		//Draw background
		context.beginPath();
		context.fillStyle = this.bgFill;
		context.fillRect(posX, this.position.y, this.width, this.height);


		//Draw foreground
		var currentSegment = this.segmentWidth * this.currentNodePercent;
		var completeSegments;
		if (this.direction === -1) completeSegments = (this.currentNode)*this.segmentWidth;
		else completeSegments = (this.currentNode-1)*this.segmentWidth;

		context.beginPath();
		context.fillStyle = this.fgFill;
		context.fillRect(posX, this.position.y, completeSegments + currentSegment, this.height);

		//Draw node segments
		context.beginPath();
		context.lineWidth = 2;
		context.lineCap = "butt";
		context.strokeStyle = '#666';
		for (var i = 1; i < this.nodes; ++i)
		{
			var x = posX + (i * this.segmentWidth);
			context.moveTo(x, this.position.y);
			context.lineTo(x, this.position.y + this.height);
		}
		context.stroke();

		context.restore();
	}
};
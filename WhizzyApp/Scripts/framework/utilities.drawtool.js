WHIZZY.namespace("utilities.drawtool");

WHIZZY.utilities.drawtool = {
	currentDrawing: null,
	enabled: false,
	isDrawing: false,
	mode: "scribble",
	lineCap: "round",
	lineWidth: 1,
	strokeStyle: "black",
	drawings: [],
	mouseDown: {x:0,y:0},
	cursorPos: {x:0, y:0},
	camera: WHIZZY.modules.Camera,

	toggleDraw: function() {
		if (this.enabled) {
			this.enabled = false
			this.endDraw();
		}
		else {
			this.enabled = true;
			this.startDraw();
		}
	},

	penDown: function(mouseX, mouseY) {
		this.isDrawing = true;
		this.currentDrawing.addPoint(mouseX, mouseY);
		if(this.mode === "line") 
		{
			this.mouseDown.x =  mouseX;
			this.mouseDown.y = mouseY;
		}
	},

	penUp: function(mouseX, mouseY) {
		if(this.isDrawing)
		{
			this.isDrawing = false;
			if (this.mode === "scribble")
			{
				this.currentDrawing.addBreak();
			}
			else if (this.mode === "line")
			{
				this.currentDrawing.addPoint(this.mouseDown.x, this.mouseDown.y);
				this.currentDrawing.addPoint(mouseX, mouseY);
				this.currentDrawing.addBreak();
			}
		}
	},

	drawing: function(mouseX, mouseY) {
		if (this.isDrawing)
		{
			if (this.mode === "scribble")
			{
				this.currentDrawing.addPoint(mouseX, mouseY);
			}
			else if (this.mode === "line")
			{
				this.cursorPos.x = mouseX;
				this.cursorPos.y = mouseY;
			}
		}
	},

	startDraw: function() {
		var Drawing = WHIZZY.modules.Drawing;
		this.currentDrawing = new Drawing({
			lineCap: this.lineCap,
			lineWidth: this.lineWidth*this.camera.scale,
			strokeStyle: this.strokeStyle
		});
		this.drawings.push(this.currentDrawing);
		WHIZZY.utilities.debugger.info(this.currentDrawing.scale);
	},

	endDraw: function() {
		this.isDrawing = false;
		if (this.currentDrawing.points.length === 0)
			this.deleteDrawing();
	},

	toggleDrawMode: function() {
		if(this.isDrawing)
		{
			this.penUp();
		}

		if (this.mode === "scribble")
		{
			this.mode = "line";
		}
		else if (this.mode === "line")
		{
			this.mode = "scribble";
		}
	},

	draw: function(context) {
		if(!this.currentDrawing) return;
		for(var d in this.drawings)
		{
			this.drawings[d].draw(context);
		}
		if(this.mode === "line" && this.isDrawing)
		{
			context.beginPath();
			context.strokeStyle = this.strokeStyle;
			context.lineWidth = this.lineWidth*this.camera.scale;
			context.lineCap = this.lineCap;
			context.moveTo(this.mouseDown.x, this.mouseDown.y);
			context.lineTo(this.cursorPos.x, this.cursorPos.y);
			context.stroke();
		}
	},

	undo: function() {
		if (this.isDrawing) return; // Don't undo while drawing

		if(this.currentDrawing.points.length != 0)
		{
			this.currentDrawing.undoToBreak();
			// Delete drawing if no points remain
			if (this.currentDrawing.points.length === 0) this.deleteDrawing();
		}
		else 
		{
			this.deleteDrawing();
		}
	},

	deleteDrawing: function() {
		if (this.drawings.length > 1) // Don't delete first drawing (until disable drawing)
		{
			this.drawings.splice(this.drawings.length-1, 1);
			this.currentDrawing = this.drawings[this.drawings.length-1];
		}
	}



};
WHIZZY.namespace("modules.Drawing");

WHIZZY.modules.Drawing = ( function() {

	function Drawing (parameters) {
		this.points = [];
		this.currentPoint = -1;
		this.lineWidth = parameters.lineWidth;
		this.lineCap = parameters.lineCap;
		this.strokeStyle = parameters.strokeStyle;
	};

	Drawing.prototype.addPoint = function(x, y) {
		this.points.push({x:x, y:y});
		this.currentPoint++;
	};

	Drawing.prototype.addBreak = function() {
		this.points.push("BREAK");
		this.currentPoint++;
	};

	Drawing.prototype.draw = function(context) {
		if (!this.points.length > 0) return;
		context.save();
		context.lineWidth = this.lineWidth;
		context.lineCap = this.lineCap;
		context.strokeStyle = this.strokeStyle;

		context.beginPath();
		context.moveTo(this.points[0].x, this.points[0].y);
		for(var i = 1; i < this.points.length-1; ++i)
		{
			if (this.points[i] === "BREAK" && i < this.points.length-1)
			{
				context.moveTo(this.points[i+1].x, this.points[i+1].y);
			}
			else
			{
				context.lineTo(this.points[i].x, this.points[i].y);
			}
		}

		context.stroke();
		context.restore();
	};

	Drawing.prototype.undoToBreak = function(amount) {
	
		if (!this.points.length > 0) return;
		var breakPoint = 0;
		for(var i = this.points.length - 2; i >= 0; --i) // -2 to skip over the first (ending) 'break'
		{
			if (this.points[i] === "BREAK")
			{
				breakPoint = i+1; // Only delete up to the break, not including
				break;
			}
		}

		this.points.splice(breakPoint, this.points.length-breakPoint);


	};

	return Drawing;
}());
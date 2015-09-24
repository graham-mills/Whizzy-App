WHIZZY.namespace("utilities.debugger");

WHIZZY.utilities.debugger = {
	display: {},
	displayText: "",
	lineHeight: 14,
	font:  "Arial",
	log: function(log_msg) {
		console.log(log_msg);
	},
	warn: function(log_msg) {
		console.warn("Warning: " +log_msg);
	},
	info: function(log_msg) {
		console.info("Info: " +log_msg);
	},
	error: function(log_msg) {
		console.error("Error: " +log_msg);
	},
	draw: function (context) {
		if (!WHIZZY.settings.DEBUG) return;
		context.save();
		context.setTransform(1,0,0,1,0,0);
		context.translate(0, this.lineHeight);
		context.font= this.lineHeight + "px " +this.font;
		var displayText, i = 0;

		context.beginPath();
		context.fillStyle = "lime";
		for (var key in this.display)
		{
			displayText = key +": " +this.display[key];
			context.fillText(displayText,0, i*this.lineHeight);
			++i;
		}
		context.restore();
	},
	update: function () {
		this.displayText = "";

		for (var key in this.display)
		{
			this.displayText += key + ": " + this.display[key] + "\r\n";
		}
	}

};
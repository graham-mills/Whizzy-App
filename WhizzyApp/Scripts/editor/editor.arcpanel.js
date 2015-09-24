WHIZZY.namespace("editor.ArcPanel");

WHIZZY.editor.ArcPanel = {
	ToolPanel: undefined,
	selectedArc: undefined,
	Arc: undefined,
	fillStyle: undefined,
	strokeStyle: undefined,
	strokeWidth: undefined,
	startAngle: 0,
	endAngle: 2*Math.PI,
	startInput: $("#tool-arcstart"),
	endInput: $("#tool-arcend"),
	initialise: function() {
		this.ToolPanel = WHIZZY.editor.ToolPanel;
		this.Arc = WHIZZY.modules.Arc;

		$("#tool-arcstart").change(function() {
			WHIZZY.editor.ArcPanel.startChange();
		});

		$("#tool-arcend").change(function() {
			WHIZZY.editor.ArcPanel.endChange();
		});
	},
	newArc: function(scene) {
		var newArc = new this.Arc({
			position: new WHIZZY.modules.Vector(0,0),
			scale: 1,
			rotation: 0,
			startAngle: 0,
			endAngle: 2*Math.PI,
			radius:40,
			fillStyle: "purple",
			size: {x:0,y:0},
			parent: scene.id
		});

		newArc.size.x = newArc.radius*2;
		newArc.size.y = newArc.size.x;

		scene.addObject(newArc);
		return newArc;
	},
	select: function(object) {
		this.selectedArc = object;
		this.fillStyle = object.fillStyle;
		this.strokeStyle = object.strokeStyle;
		this.strokeWidth = object.lineWidth;
		this.startAngle = object.startAngle;
		this.endAngle = object.endAngle;
		this.setControls();
	},
	setControls: function() {
		this.ToolPanel.showWidget("tool-fill");
		this.ToolPanel.showWidget("tool-stroke");
		this.ToolPanel.showWidget("tool-arc");
		this.ToolPanel.setFill(this.fillStyle);
		this.ToolPanel.setStroke((this.strokeStyle === undefined ? "none" : this.strokeStyle));
		this.ToolPanel.setStrokeWidth(this.strokeWidth);

		this.startInput.val(this.radiansToDegrees(this.startAngle));
		this.endInput.val(this.radiansToDegrees(this.endAngle));
	},
	setFill: function(color) {
		if (!this.selectedArc) return;
		this.fillStyle = color;
		this.selectedArc.fillStyle = color;
	},
	setStroke: function(color) {
		if (!this.selectedArc) return;
		this.strokeStyle = color;
		this.selectedArc.strokeStyle = color;
	},
	setStrokeWidth: function(width) {
		if (!this.selectedArc) return;
		this.strokeWidth = width;
		this.selectedArc.lineWidth = width;
	},
	validateAngle: function(degrees) {
		degrees = parseInt(degrees);
		if (Math.round(degrees) != degrees) return undefined;

		var sign = Math.sign(degrees);
		if (Math.abs(degrees) <= 360)
		{
			return degrees;
		}
		else return sign * 360;
	},
	degreesToRadians: function(degrees) {
		return degrees*(Math.PI/180);
	},
	radiansToDegrees: function(radians) {
		return Math.round(radians*(180/Math.PI));
	},
	startChange: function() {
		var changedStart = this.startInput.val(),
			changedStart = this.validateAngle(changedStart);

		if (changedStart != undefined)
		{
			this.startAngle = changedStart;
			this.selectedArc.startAngle = this.degreesToRadians(changedStart);
		}
		this.startInput.val(this.startAngle);
	},
	endChange: function() {
		var changedEnd = this.endInput.val(),
			changedEnd = this.validateAngle(changedEnd);

		if (changedEnd != undefined)
		{
			this.endAngle = changedEnd;
			this.selectedArc.endAngle = this.degreesToRadians(changedEnd);
		}
		this.endInput.val(this.endAngle);
	}
};
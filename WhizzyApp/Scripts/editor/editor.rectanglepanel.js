WHIZZY.namespace("editor.RectanglePanel");

WHIZZY.editor.RectanglePanel = {
	Rectangle: undefined,
	ToolPanel: undefined,
	selectedRectangle: undefined,
	fillStyle: undefined,
	strokeStyle: undefined,
	strokeWidth: undefined,
	initialise: function() {
		this.Rectangle = WHIZZY.modules.Rectangle;
		this.ToolPanel = WHIZZY.editor.ToolPanel;
	},
	newRectangle: function(scene) {
		var newRect = new this.Rectangle({
			position: new WHIZZY.modules.Vector(0,0),
			scale: 1,
			rotation: 0,
			size: {x:200, y:200},
			fillStyle: "green",
			lineWidth: 2,
			parent: scene.id
		});
		scene.addObject(newRect);
		return newRect;
	},
	select: function(object) {
		this.selectedRectangle = object;
		this.fillStyle = object.fillStyle;
		this.strokeStyle = object.strokeStyle;
		this.strokeWidth = object.lineWidth;
		this.setControls();
	},
	setControls: function() {
		this.ToolPanel.setFill(this.fillStyle);
		this.ToolPanel.setStroke((this.strokeStyle === undefined ? "none" : this.strokeStyle));
		this.ToolPanel.setStrokeWidth(this.strokeWidth);
		this.ToolPanel.showWidget("tool-fill");
		this.ToolPanel.showWidget("tool-stroke");
	},
	setFill: function(color) {
		if (!this.selectedRectangle) return;
		this.fillStyle = color;
		this.selectedRectangle.fillStyle = color;
	},
	setStroke: function(color) {
		if (!this.selectedRectangle) return;
		this.strokeStyle = color;
		this.selectedRectangle.strokeStyle = color;
	},
	setStrokeWidth: function(width) {
		if (!this.selectedRectangle) return;
		this.lineWidth= width;
		this.selectedRectangle.lineWidth = width;
	}
};
WHIZZY.namespace("editor.ToolPanel");

WHIZZY.editor.ToolPanel = {
	Panel: undefined,
	ScenePanel: undefined,
	TextPanel: undefined,
	ArcPanel: undefined,
	RectanglePanel: undefined,
	ImagePanel: undefined,
	Label: $("#toolpanel-label"),
	hidden: true,
	activeTool: undefined,
	colourFor: "fill",
	enabled: false,
	initialise: function() {
		this.Panel = $("toolpanel");
		this.ScenePanel = WHIZZY.editor.ScenePanel;
		this.TextPanel = WHIZZY.editor.TextPanel;
		this.RectanglePanel = WHIZZY.editor.RectanglePanel;
		this.ArcPanel = WHIZZY.editor.ArcPanel;
		this.ImagePanel = WHIZZY.editor.ImagePanel;

		this.initialiseButtons();
	},
	initialiseButtons: function() {
		// Disable bootstrap menu closing unless given .close-menu
		$('.dropdown-menu').children().not(".close-menu").click(function(e) {
          e.stopPropagation(); // Disable menu close on click
   		 });

		$("#colour-picker").on("dragstop.spectrum", function(e, color) {
			WHIZZY.editor.ToolPanel.setColour(color.toHexString());
		});

		$("#btn_colourpicker").click(function() {
			$("#colour-picker").spectrum("set", WHIZZY.editor.ToolPanel.activeTool.fillStyle);
		});

		$("#btn_toolfill").click(function(){
			WHIZZY.editor.ToolPanel.colourFor = "fill";
		});

		$("#btn_toolstroke").click(function(){
			WHIZZY.editor.ToolPanel.colourFor = "stroke";
		});

		$(".tool-colour").click(function(e){ 
			WHIZZY.editor.ToolPanel.setColour($(this).attr("data-id"));
		});

		$("#btn_toolstrokeadd").click(function(){
			WHIZZY.editor.ToolPanel.setStrokeWidth(1);
		});
		$("#btn_toolstrokesubtract").click(function(){
			WHIZZY.editor.ToolPanel.setStrokeWidth(-1);
		});
	},
	show: function() {
		this.Label.css("visibility", "visible");
		this.hidden = false;
	},
	hide: function() {
		this.hideWidgets();
		this.Label.css("visibility", "hidden");
		this.hidden = true;
	},
	select: function(object) {
		if(!this.enabled) return;
		this.hideWidgets();
		if (this.hidden) this.show();
		if (object instanceof WHIZZY.modules.TextObject)
		{
			this.activeTool = this.TextPanel;
			this.TextPanel.select(object);
			this.setLabel("Text Object");
		}
		else if (object instanceof WHIZZY.modules.Scene)
		{
			this.activeTool = this.ScenePanel;
			this.activeTool.select(object);
		}
		else if (object instanceof WHIZZY.modules.Rectangle)
		{
			this.activeTool = this.RectanglePanel;
			this.activeTool.select(object);
			this.setLabel("Rectangle");
		}
		else if (object instanceof WHIZZY.modules.Arc)
		{
			this.activeTool = this.ArcPanel;
			this.activeTool.select(object);
			this.setLabel("Arc Object");
		}
		else if (object instanceof WHIZZY.modules.ImageObject)
		{
			this.activeTool = this.ImagePanel;
			this.activeTool.select(object);
			this.setLabel("Image");
		}
		else this.deselect();
	},
	deselect: function() {
		this.activeTool = undefined;
		this.hide();
	},
	setLabel: function(text) {
		this.Label.text(text);
	},
	showWidget: function(id) {
		$("#"+id).css("visibility", "visible");
		$("#"+id).removeClass("tool-hide");
	},
	hideWidgets: function() {
		$(".toolwidget").css("visibility", "collapse");
		$(".toolwidget").addClass("tool-hide");
	},
	setColour: function(color) {
		switch(this.colourFor)
		{
			case "fill":
				this.setFill(color);
				break;
			case "stroke":
				this.setStroke(color);
				break;
		}
	},
	setFill: function(color) {
		$("#tool-fill").find(".swab").css("background", color);
		if (color == "none")
		{
			$("#tool-fill").find(".swab").text("None");
			color = undefined;
		}
		else $("#tool-fill").find(".swab").text("");
		this.activeTool.setFill(color);
	},
	setStroke: function(color) {
		$("#tool-stroke").find(".swab").css("background", color);
		if (color == "none")
		{
			$("#tool-stroke").find(".swab").text("None");
			color = undefined;
		}
		else $("#tool-stroke").find(".swab").text("");
		this.activeTool.setStroke(color);
	},
	setStrokeWidth: function(direction) {
		var currentWidth = $("#tool-strokeinput").val(),
			newWidth;

		currentWidth = parseInt(currentWidth);
		if (Math.round(currentWidth) != currentWidth)
		{
			$("#tool-strokeinput").val(this.activeTool.lineWidth);
		}
		else
		{
			if (direction * direction === 1) // Is it 1 or -1
			{	
				newWidth = currentWidth + (direction * 1);
			}
			else newWidth = currentWidth;

			if (newWidth < WHIZZY.editor.settings.MIN_STROKE_WIDTH) newWidth = WHIZZY.editor.settings.MIN_STROKE_WIDTH;
			else if (newWidth > WHIZZY.editor.settings.MAX_STROKE_WIDTH) newWidth = WHIZZY.editor.settings.MIN_STROKE_WIDTH;

			$("#tool-strokeinput").val(newWidth);
			this.activeTool.setStrokeWidth(newWidth);
		}
	},
};
WHIZZY.namespace("editor.TextPanel");

WHIZZY.editor.TextPanel = {
	Transformable: undefined,
	ToolPanel: undefined,
	TextObject: undefined,
	TextEditor: undefined,
	selectedText: undefined,
	Framework: undefined,
	scene: undefined,
	fontFamily: undefined,
	fontSize: undefined,
	lineHeight: undefined,
	fontWeight: undefined,
	textAlign: undefined,
	bold: false,
	italic: false,
	fillStyle: undefined,

	initialise: function() {
		this.TextObject = WHIZZY.modules.TextObject;
		this.Framework = WHIZZY.editor.Framework;
		this.ToolPanel = WHIZZY.editor.ToolPanel;
		this.TextEditor = WHIZZY.editor.TextEditor;
		this.Transformable = WHIZZY.editor.Transformable;

		this.initialiseButtons();
	},
	initialiseButtons: function() {
		$("#tool-fontselect").change(function(){
			WHIZZY.editor.TextPanel.setFont();
		});

		$("#tool-fontsizeinput").change(function() {
			WHIZZY.editor.TextPanel.setFontSize();
		});

		$("#btn_fontsizesubtract").click(function() {
			WHIZZY.editor.TextPanel.setFontSize(-1);
		});

		$("#btn_fontsizeadd").click(function() {
			WHIZZY.editor.TextPanel.setFontSize(1);
		});

		$("#btn_tooltext").click(function() {
			WHIZZY.editor.TextPanel.textEdit();
		});
	},
	setControls: function() {
		this.ToolPanel.showWidget("tool-font");
		this.ToolPanel.showWidget("tool-fontsize");
		this.ToolPanel.showWidget("tool-text");
		this.ToolPanel.showWidget("tool-fill");

		if (this.fontFamily) $("#tool-fontselect").val(this.fontFamily);
		if (this.fontSize) $("#tool-fontsizeinput").val(this.fontSize);
		if (this.fill) this.ToolPanel.setFill(this.fill);
	},
	newTextObject: function (scene) {
		this.scene = scene;
		var position = new WHIZZY.modules.Vector(0,0),
			scale = 1,
			rotation = 0,
			width = 450;

		var newText = new this.TextObject({
			align: "left",
			font: WHIZZY.editor.Theme.Font,
			lineHeight: WHIZZY.editor.Theme.LineHeight,
			fillStyle: WHIZZY.editor.Theme.FontColour,
			paragraphs: "Click to edit",
			size: {x:width, y:0},
			textBaseline: "middle",
			position: position,
			scale: scale,
			rotation: rotation,
			parent: scene.id
		});

		this.scene.addObject(newText);
		return newText;
	},
	select: function(textObject) {
		this.selectedText = textObject;
		this.parseFont(textObject.font);
		this.textAlign = textObject.align;
		this.fill = textObject.fillStyle;
		this.setControls();
	},
	parseFont: function(fontString) {
		// Assume syntax:
		// bold italic 20px arial
		var parts = fontString.split(" ");

		for (var p in parts)
		{
			if (parts[p] == "normal")
			{
			}
			else if (parts[p] == "bold")
			{
				this.bold = true;
			}
			else if (parts[p] == "italic")
			{
				this.italic = true;
			}
			else if (parts[p].substring(parts[p].length - 2, parts[p].length) == "px") // Look for 'px'
			{
				this.fontSize = parts[p].substring(0, parts[p].length-2); // Trim off 'px'
				break;
			}
		}
		var fontSize = this.fontSize + "px";
		// Get remainder of font string after fontsize
		var fontFamily = fontString.substring(fontString.indexOf(this.fontSize)+fontSize.length , fontString.length);
		fontFamily = $.trim(fontFamily);
		this.fontFamily = fontFamily;
	},
	setFontSize: function(direction) {
		var currentSize = $("#tool-fontsizeinput").val();
		currentSize = parseInt(currentSize);

		if (Math.round(currentSize) != currentSize)
		{
			$("#tool-fontsizeinput").val(this.fontSize);
		}
		else if (direction)
		{
			currentSize += 1 * direction;
			if(currentSize < 1) currentSize = 1;
			$("#tool-fontsizeinput").val(currentSize);
		}
		else
		{
			if(currentSize < WHIZZY.editor.settings.MIN_FONT_SIZE) currentSize = WHIZZY.editor.settings.MIN_FONT_SIZE;
			if(currentSize > WHIZZY.editor.settings.MAX_FONT_SIZE) currentSize = WHIZZY.editor.settings.MAX_FONT_SIZE;
			$("#tool-fontsizeinput").val(currentSize);
		}
		this.setFont();
	},
	buildFont: function() {
		this.fontFamily = $("#tool-fontselect").val();
		this.fontSize = $("#tool-fontsizeinput").val();
		var fontString = "";
		if (this.italic) fontString = fontString.concat("italic ");
		if (this.bold) fontString = fontString.concat("bold ");
		if (!this.italic && !this.bold) fontString = fontString.concat("normal ");
		if (this.fontSize) fontString = fontString.concat(this.fontSize + "px ");
		if (this.fontFamily) fontString = fontString.concat(this.fontFamily);

		return fontString;
	},
	setFont: function() {
		this.selectedText.font = this.buildFont();
		this.selectedText.lineHeight = this.fontSize;
		this.selectedText.align = this.textAlign;
		this.resize();
	},
	setFill: function(fill) {
		this.fillStyle = fill;
		this.selectedText.fillStyle = fill;
	},
	textEdit: function() {
		this.TextEditor.select(this, this.selectedText.paragraphs);
	},
	setText: function(newText) {
		var newParagraphs,
			paragraphs = newText.paragraphs;

		this.bold = newText.bold;
		this.italic = newText.italic;
		this.textAlign = newText.align;

		// Copy value of array (avoid reference)
		newParagraphs = paragraphs.slice();
		// Remove leading whitespace
		for(var i =0; i < paragraphs.length; ++i)
		{
			if ($.trim(paragraphs[i]).length === 0)
				newParagraphs.splice(0, 1);
			else break;
		}

		// Remove trailing whitespace
		for(var i = paragraphs.length-1; i >= 0; --i)
		{
			if ($.trim(paragraphs[i]).length === 0)
				newParagraphs.splice(newParagraphs.length-1, 1);
			else break;
		}

		this.setFont();
		this.selectedText.paragraphs = newParagraphs.join("\n");
		this.resize();
	},
	resize: function() {
		// Resize text (wrapping)
		this.selectedText.resize();
		this.Transformable.positionRect();
		this.Transformable.positionHandles();
	},

};
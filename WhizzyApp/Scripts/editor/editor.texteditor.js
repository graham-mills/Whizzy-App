WHIZZY.namespace("editor.TextEditor");

WHIZZY.editor.TextEditor = {
	Modal: $("#text-edit-modal"),
	TextArea: $("#text-edit-area"),
	activeTool: undefined,
	align: "left",
	bold: false,
	italic: false,
	bulletList: false,

	initialise: function() {
		$("#btn_texteditsubmit").click(function() {
			WHIZZY.editor.TextEditor.submit();
		});

		$("#btn_texteditbold").click(function(e) {
			WHIZZY.editor.TextEditor.toggleBold();
		});
		$("#btn_textedititalic").click(function(e) {
			WHIZZY.editor.TextEditor.toggleItalic();
		});
		$("#btn_texteditalignleft").click(function(e) {
			WHIZZY.editor.TextEditor.alignText("left");
		});
		$("#btn_texteditalignright").click(function(e) {
			WHIZZY.editor.TextEditor.alignText("right");
		});
		$("#btn_texteditaligncenter").click(function(e) {
			WHIZZY.editor.TextEditor.alignText("center");
		});
		$("#btn_texteditlist").click(function(e) {
			WHIZZY.editor.TextEditor.toggleList();
		});
	},
	select: function(tool, text) {
		this.activeTool = tool;
		if (this.activeTool.bold && !this.bold) this.toggleBold();
		if (this.activeTool.italic && !this.italic) this.toggleItalic();
		this.alignText(this.activeTool.textAlign);
		this.TextArea.val(text);
	},
	submit: function() {
		var lines = this.textToLines(this.TextArea.val());
		this.activeTool.setText({
			paragraphs: lines,
			bold: this.bold,
			italic: this.italic,
			align: this.align
		});
	},
	click: function(e) {
		if (!e) return;

		switch(e.target.id)
		{
			case "btn_texteditbold":
				this.toggleBold();
				break;
			case "btn_textedititalic":
				break;
		}
	},
	toggleBold: function() {
		this.bold = !this.bold;
		if (this.bold)
			this.TextArea.css("font-weight", "bold");
		else
			this.TextArea.css("font-weight", "normal");
	},
	toggleItalic: function() {
		this.italic = !this.italic;
		if (this.italic)
			this.TextArea.css("font-style", "italic");
		else
			this.TextArea.css("font-style", "normal");
	},
	toggleList: function() {
		var cursorLines = this.getLineNumbers(),
			lines = this.textToLines(this.getText()),
			line,
			newLine;

		for (var l in cursorLines)
		{
			newLine = undefined;
			line = lines[cursorLines[l]];
			if (line.indexOf(WHIZZY.editor.settings.BULLET_POINT) != -1)
			{
				if (line.substring(line.indexOf(WHIZZY.editor.settings.BULLET_POINT)+1
					,line.indexOf(WHIZZY.editor.settings.BULLET_POINT)+2) === " ")
				{
					newLine = line.substring(line.indexOf(WHIZZY.editor.settings.BULLET_POINT)+2, line.length);
				}
				else
				{
					newLine = line.substring(line.indexOf(WHIZZY.editor.settings.BULLET_POINT)+1, line.length);
				}
			}
			else
			{
				newLine = WHIZZY.editor.settings.BULLET_POINT + " ";
				newLine = newLine.concat(line);
			}
			if (newLine) lines[cursorLines[l]] = newLine;
		}

		this.setText(this.linesToText(lines));
	},
	alignText: function(side) {
		this.align = side;

		$("#btn_texteditalignleft").removeClass("active");
		$("#btn_texteditaligncenter").removeClass("active");
		$("#btn_texteditalignright").removeClass("active");
		switch(side)
		{
			case "left":
				this.TextArea.css("text-align", "left");
				break;
			case "center":
				this.TextArea.css("text-align", "center");
				break;
			case "right":
				this.TextArea.css("text-align", "right");
				break;
		}
		$("#btn_texteditalign"+side).addClass("active");
	},
	// Convert string array into text lines with \n
	linesToText: function(lines) {
		var text = "";
		for(var l in lines)
		{
			text = text.concat(lines[l]);
			if (l != lines.length-1) text = text.concat("\n");
		}
		return text;
	},
	// Convert text lines to string array
	textToLines: function(text) {
		return text.split("\n");
	},
	setText: function(text) {
		this.TextArea.val(text);
	},
	getText: function() {
		return this.TextArea.val();
	},
	getLineNumbers: function() {
		var selectStart = this.TextArea.prop("selectionStart"),
			selectEnd = this.TextArea.prop("selectionEnd");

		var lines = this.textToLines(this.getText()),
			lineLength;

		var lineStart,
			lineEnd,
			lengthCount = 0;

		// Find line numbers based on cursor positions
		for(var l in lines)
		{
			if (l === lines.length-1) {
				if (!lineStart) lineStart = l;
				if (!lineEnd) lineEnd = l;
				break;
			}
			lengthCount += lines[l].length;

			if (!lineStart && selectStart+1 <= lengthCount) // +1 to ignore EOL cursor
				lineStart = l;
			if (!lineEnd && selectEnd-1 <= lengthCount)	// -1 to ignore start of line cursor
				lineEnd = l;

			lengthCount++; // Iterate as newlines affect cursor position values
		}

		var lineNumbers = [],
			lineDifference = lineEnd - lineStart;

		for(var i = lineStart; i <= lineEnd; ++i)
		{
			lineNumbers.push(i);
		}
		return lineNumbers;
	},


};
WHIZZY.namespace("modules.TextObject");

WHIZZY.modules.TextObject = ( function() {
	//Dependencies
	var Debug = WHIZZY.utilities.debugger,
		Entity = WHIZZY.modules.Entity;

	function TextObject(parameters) {
		Entity.call(this, parameters);
		this.text = parameters.text;
		this.paragraphs = parameters.paragraphs;
		this.align = parameters.align || "left";
		this.font = parameters.font;
		this.lineHeight = parameters.lineHeight;
		this.fillStyle = parameters.fillStyle;
		this.textBaseline = parameters.textBaseline || "top";
		this.offsetY = 0;
		this.offsetX = 0;
		this.minWidth;

		this.size = parameters.size;
		this.resize();
	};

	TextObject.prototype = Object.create(Entity.prototype, {
		resize: {
			value: function() {
				var context = WHIZZY.modules.Canvas.context,
					width = this.size.x,
					paragraphs = this.paragraphs.split("\n"),
					words,
					lengthCount,
					currentLine,
					testLine,
					newLines = [],
					minWidth = 0;

					context.font = this.font;
					for(var l in paragraphs)
					{
						if (l != 0) newLines.push("\n");
						testLine = "";
						words = paragraphs[l].split(" ");
						for(var i = 0; i < words.length; ++i)
						{
							if (testLine != "") testLine += " ";
							testLine = testLine.concat(words[i]);
							lengthCount = context.measureText(testLine).width;
							if(lengthCount > width)
							{
								// Check for single word (can't be split further)
								if (testLine.split(" ").length === 1) 
								{
									newLines.push(testLine);
									if (lengthCount > minWidth) minWidth = lengthCount;
								}
								else // Store current line, and repeat this word on new line 
								{
									newLines.push(currentLine);
									--i;
								}
								testLine = "";
							}
							else {
								currentLine = testLine;
								if (i == words.length-1) newLines.push(currentLine);
							}
						}
					}
					this.text = newLines;
					this.size.y = this.text.length * this.lineHeight *1.2;
					if (this.size.x < minWidth) this.size.x = minWidth;
					this.minWidth = minWidth;
					this.offsetY = -this.lineHeight * Math.floor(this.text.length/2);
					switch(this.align)
					{
						case "left":
							this.offsetX = -width/2;
							break;
						case "right":
							this.offsetX = width/2;
							break;
						default:
							this.offsetX = 0;
					}
			}
		},
		draw: {
			value: function(context) {
				context.save();
				context.translate(this.position.x, this.position.y);
				if (typeof this.alpha != 'undefined') context.globalAlpha = this.alpha;
				if (typeof this.rotation != 'undefined') context.rotate(this.rotation);
				if (typeof this.scale != 'undefined') context.scale(this.scale, this.scale);

				context.font = this.font;
				context.fillStyle = this.fillStyle;
				context.textAlign = this.align;
				context.textBaseline = this.textBaseline;

				for (var i = 0; i < this.text.length; ++i)
				{
					context.fillText(this.text[i], this.offsetX, this.offsetY + (this.lineHeight * i));
				}
				
				this.drawHover(context);
				context.restore();
			}
		}
	});

	TextObject.prototype.constructor = TextObject;
	return TextObject;
}());
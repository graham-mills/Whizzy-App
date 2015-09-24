WHIZZY.namespace("editor.Handle");

WHIZZY.editor.Handle = (function(){

	function Handle(params)
	{
		this.cursor = params.cursor;
		this.action = params.action;
		this.direction = params.direction;
		this.position = params.position;
		this.size = params.size;
		this.colour = params.colour;
		this.disabled = false;
	};

	Handle.prototype.draw = function(context, globalScale)
	{
		if (this.disabled) return;
		context.save();

		var posX = this.position.x - (this.position.x - (this.position.x*globalScale)),
			posY = this.position.y - (this.position.y - (this.position.y*globalScale));

		if (this.action == "rotate")
		{
			context.lineWidth = 3;
			context.beginPath();
			context.moveTo(posX, posY);
			context.lineTo(posX - (40*globalScale), posY);
			context.stroke();
			
			context.arc(posX, posY, (this.size/2), 0, 2*Math.PI);
			context.fill();
		}
		else
		{
			context.fillRect(posX-this.size/2, posY-this.size/2,
								this.size, this.size);
		}
		context.restore();
	};

	return Handle;
}());

WHIZZY.namespace("editor.Transformable");
WHIZZY.editor.Transformable = {
	Framework: undefined,
	Vector: undefined,
	selectedObject: undefined,
	parentObject: undefined,
	Handle: WHIZZY.editor.Handle,
	label: "Label",
	lineColour: "blue",
	fillColour: "blue",
	lineWidth: 3,
	position: {x:0, y:0},
	handles: [],
	hoveredHandle: undefined,
	hoveredBody: false,
	size: {x:0,y:0},
	minSize: {x:0,y:0},
	expandMode: 1, // 1 - expand from one side, 2 - expand equally
	scale: 1,
	rotation: 0,
	transforming: false,
	moving: false,
	grabOffset: {x:0,y:0},
	initialise: function() {
		this.Framework = WHIZZY.editor.Framework;
		this.Vector = WHIZZY.modules.Vector;

		for(var i = 1; i <= 4; ++i)
		{
			this.handles.push(new this.Handle({
				cursor: (i == 1 || i == 3 ? "nw-resize" : "ne-resize"),
				action: "scale",
				position: {x:0, y:0},
				size: 10,
				colour: "blue"
			}));
		}
		for(var i = 1; i <= 4; ++i)
		{
			this.handles.push(new this.Handle({
				cursor: (i == 1 || i == 3 ? "n-resize" : "e-resize"),
				action: "resize",
				position: {x:0, y:0},
				size: 6,
				colour: "blue"
			}));
		}
		this.handles[4].direction = "n";
		this.handles[5].direction = "e";
		this.handles[6].direction = "s";
		this.handles[7].direction = "w";

		this.handles.push(new this.Handle({
				cursor: "move",
				action: "rotate",
				position: {x:0, y:0},
				size: 15,
				colour: "blue",
				rotation:Math.PI/2
			}));
	},
	isEntity: function() {
		return false;
	},
	select: function(object) {
		if (!object || this.selectedObject === object) return;
		this.deselect();
		this.selectedObject = object;
		this.parentObject = object.parentObject;
		this.size = object.size;
		
		if (!object.isEntity())
		{
			this.handles[4].disabled = true;
			this.handles[5].disabled = true;
			this.handles[6].disabled = true;
			this.handles[7].disabled = true;

			if(object instanceof WHIZZY.editor.Animation)
			{
				this.label = "Animation " + object.id;
			}
		}
		else if (object.isEntity())
		{
			if(object.isType("Scene"))
			{
				if(object.id == 0)
				{
					this.deselect();
					return;
				}
				else
				{
					this.expandMode = 2;
					this.label = "Scene " + object.id;
				}
			}
			else if(object.isType("TextObject"))
			{
				this.label = "Text";
				this.handles[4].disabled = true;
				this.handles[6].disabled = true;
			}
			else if (object.isType("ImageObject"))
				this.label = "Image";
			else if (object.isType("Rectangle"))
				this.label = "Rectangle";
			else if (object.isType("Arc"))
			{
				this.label = "Arc";
				this.handles[4].disabled = true;
				this.handles[5].disabled = true;
				this.handles[6].disabled = true;
				this.handles[7].disabled = true;
			}
			else if (object.isType("Shape"))
				this.label = "Shape";
		}
		this.minSize.x = 25;
		this.minSize.y = 25;
		
		this.positionRect();
		this.positionHandles();
	},
	deselect: function() {
		this.selectedObject = undefined;
		this.parentObject = undefined;
		this.expandMode = 2;
		this.label = "";
		for(var h in this.handles)
		{
			this.handles[h].disabled = false;		
		}
	},
	positionRect: function() {
		if (this.selectedObject.isEntity())
		{
			var pos = this.selectedObject.getPosition();
			this.position.x = pos.x;	
			this.position.y = pos.y;
			this.rotation = this.selectedObject.getRotation();
			this.scale = this.selectedObject.getScale();
		}
		else
		{
			this.position = this.selectedObject.position.copy();
			this.scale = this.selectedObject.scale;
			this.rotation = this.selectedObject.rotation;
		}
	},
	positionHandles: function() {
		// Corner handles ABCD (scale)
		this.handles[0].position = {x:-this.size.x/2, y:  -this.size.y/2};
		this.handles[1].position = {x:this.size.x/2, y: -this.size.y/2};
		this.handles[2].position = {x:this.size.x/2, y:  this.size.y/2};
		this.handles[3].position = {x:-this.size.x/2, y: this.size.y/2};

		// Side handles, NESW (size)
		this.handles[4].position = {x: 0, y: -this.size.y/2};
		this.handles[5].position = {x: this.size.x/2, y: 0};
		this.handles[6].position = {x: 0, y: this.size.y/2};
		this.handles[7].position = {x: -this.size.x/2, y: 0};

		// Rotate handle
		this.handles[8].position = {x:this.size.x/2 + 40, y: 0};
	},
	setScale: function(scale) {
		if (!this.selectedObject) return;
		this.scale = scale;
		if(this.parentObject)
		{
			this.selectedObject.scale = scale/this.parentObject.scale;
		}
		else
		{
			this.selectedObject.scale = scale;
		}
	},
	setPosition: function(position) {
		if (!this.selectedObject) return;

		if(position.x - (this.size.x/2)*this.scale < -WHIZZY.modules.Stage.size.x/2)
		{
			position.x = -WHIZZY.modules.Stage.size.x/2 + (this.size.x/2)*this.scale;
		}
		else if(position.x + (this.size.x/2)*this.scale > WHIZZY.modules.Stage.size.x/2)
		{
			position.x = WHIZZY.modules.Stage.size.x/2 - (this.size.x/2)*this.scale;
		}

		if(position.y - (this.size.y/2)*this.scale < -WHIZZY.modules.Stage.size.y/2)
		{
			position.y = - WHIZZY.modules.Stage.size.y/2 + (this.size.y/2)*this.scale;
		}
		else if (position.y + (this.size.y/2)*this.scale > WHIZZY.modules.Stage.size.y/2)
		{
			position.y = WHIZZY.modules.Stage.size.y/2 - (this.size.y/2)*this.scale;
		}

		this.position.x = position.x;
		this.position.y = position.y;
		
		if (this.parentObject)
		{
			this.selectedObject.position.x = (position.x - this.parentObject.position.x)/this.parentObject.scale;
			this.selectedObject.position.y = (position.y - this.parentObject.position.y)/this.parentObject.scale;
		}
		else
		{
			this.selectedObject.position.x = position.x;
			this.selectedObject.position.y = position.y;
		}
		
	},
	setSize: function(width, height) {
		if (!this.selectedObject) return;
		if (width < this.minSize.x) width = this.minSize.x;
		if (height < this.minSize.y) height = this.minSize.y;

		this.selectedObject.size.x = width;
		this.selectedObject.size.y = height;
		if(this.selectedObject.background)
		{
			this.selectedObject.background.size.x = width;
			this.selectedObject.background.size.y = height;
		}
	},
	setRotation: function(theta) {
		if (!this.selectedObject) return;
		this.rotation = theta;
		if(this.parentObject) this.selectedObject.rotation = theta - this.parentObject.rotation;
		else this.selectedObject.rotation = theta;
	},
	draw: function(context) {
		if (!this.selectedObject) return;
		if (this.lineWidth) context.lineWidth = this.lineWidth;

		var camScale = WHIZZY.modules.Camera.scale,
			globalScale = this.scale/camScale;

		context.save();
			
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.scale(camScale, camScale);

		if (this.selectedObject instanceof WHIZZY.editor.TransitionNode)
		{
			context.strokeStyle = "#00CC66";
			context.fillStyle = "#00CC66";
		}
		else {
			context.strokeStyle = this.lineColour;
			context.fillStyle = this.fillColour;
		}

		var rectWidth = this.size.x*globalScale,
			rectHeight = this.size.y*globalScale;
		context.strokeRect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight);

		for(var h in this.handles)
		{
			this.handles[h].draw(context, globalScale);
		}

		if (this.label)
		{
			context.rotate(-this.rotation);
			context.font = WHIZZY.editor.settings.LABEL_FONT;
			var xPos = 0,
				yPos = (-this.size.y/2 - 4)*globalScale;

			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.lineWidth = 3;
			context.strokeStyle = "black";
			context.strokeText(this.label, xPos, yPos - 4);
			context.fillStyle = "white";
			context.fillText(this.label, xPos, yPos - 4);
		}

		context.restore();
	},
	drag: function(mouse) {
		if (this.hoveredHandle)
		{
			this.Framework.setCursor(this.hoveredHandle.cursor);
			switch(this.hoveredHandle.action)
			{
				case "scale":
					this.scaleObject(mouse);
					break;
				case "resize":
					this.resizeObject(mouse);
					break;
				case "rotate":
					this.rotateObject(mouse);
					break;
			}
		}
		else if (this.hoveredBody)
		{
			this.Framework.setCursor("move");
			this.moveObject(mouse);
		}
	},
	scaleObject: function(mouse) {
		mouse = this.transformMouse(mouse);
		var thisWidth = (this.size.x/2)*this.scale,
			newWidth = mouse.x*this.scale,
			newScale = Math.abs(newWidth)/thisWidth;
		
		if(newScale <= 0) {
			return;
		}

		this.setScale(newScale);
	},
	resizeObject: function(mouse) {
		mouse = this.transformMouse(mouse);
		var direction = this.hoveredHandle.direction,
			scaledX = this.size.x * this.scale,
			scaledY = this.size.y * this.scale,
			deltaX,
			deltaY;

		switch(direction)
		{
			case "n":
				deltaY = (-scaledY/2 - mouse.y);
				this.setSize(this.size.x, this.size.y + deltaY/this.scale);
				break;
			case "s":
				deltaY = (mouse.y - scaledY/2);
				this.setSize(this.size.x, this.size.y + deltaY/this.scale);
				break;
			case "e":
				deltaX = (mouse.x - scaledX/2);
				this.setSize(this.size.x + deltaX/this.scale, this.size.y);
				break;
			case "w":
				deltaX = (-scaledX/2 - mouse.x);
				this.setSize(this.size.x + deltaX/this.scale, this.size.y);
				break;
		}

		if (this.selectedObject instanceof WHIZZY.modules.TextObject)
		{
			WHIZZY.editor.TextPanel.resize();
			this.minSize.x = this.selectedObject.minWidth;
		}
		this.positionHandles();
	},
	moveObject: function(mouse) {
		this.setPosition({
			x:mouse.x - this.grabOffset.x,
			y:mouse.y - this.grabOffset.y
		});

		this.positionHandles();
	},
	rotateObject: function(mouse) {
		var dx = (mouse.x - this.position.x),
			dy = (mouse.y - this.position.y);

		var rotation = Math.atan2(dy, dx);

		this.setRotation(rotation);
	},
	transformMouse: function(mouse) {
		mouse = mouse.copy();
		mouse.x -= this.position.x;
		mouse.y -= this.position.y;
		mouse = mouse.rotate(-this.rotation);
		return mouse;
	},
	mouseHover: function(mouse) {
		var hoveredEntities = [];
		mouse = this.transformMouse(mouse);
		if (!this.selectedObject) return hoveredEntities;
		if (this.transforming || this.moving) return hoveredEntities;
		this.hoveredBody = false;
		this.handleHover(mouse.x, mouse.y);

		if (this.hoveredHandle || this.mouseOver(mouse))
		{
			this.hoveredBody = true;
			hoveredEntities.push(this);
		}
		return hoveredEntities;
	},
	mouseOver: function(mouse)
	{
		var halfWidth = (this.size.x/2)*(this.scale),
			halfHeight = (this.size.y/2)*(this.scale);

		if (mouse.x > - halfWidth &&
			mouse.x < + halfWidth &&
			mouse.y > - halfHeight &&
			mouse.y < + halfHeight)
		{
			return true;
		}
		else return false;
	},
	handleHover: function(mouseX, mouseY) {
		// Handle radius for easier handle selection
		var radius = ( 6/this.scale) * WHIZZY.modules.Camera.scale;
		this.hoveredHandle = undefined;
		for(var h in this.handles)
		{
			if (this.handles[h].disabled) continue;
			if (mouseX > (this.handles[h].position.x - radius)*this.scale &&
				mouseX < (this.handles[h].position.x + radius)*this.scale &&
				mouseY > (this.handles[h].position.y - radius)*this.scale &&
				mouseY < (this.handles[h].position.y + radius)*this.scale)
			{
				this.hoveredHandle = this.handles[h];
				return;
			}
		}
	},
	mouseDown: function(mouse) {
		if (this.transforming || this.moving) return;

		if (this.hoveredHandle)
		{
			this.transforming = true;
		}
		else if (this.hoveredBody)
		{
			this.moving = true;
			this.grabOffset.x = mouse.x - this.position.x;
			this.grabOffset.y = mouse.y - this.position.y;
		}
	},
	mouseUp: function() {
		this.transforming = false;
		this.moving = false;
		this.hoveredHandle = undefined;
		this.hoveredBody = false;
	},
	fitToWindow: function() {
		var canvasX = WHIZZY.modules.Canvas.innerSize.x,
			canvasY = WHIZZY.modules.Canvas.innerSize.y,
			scale,
			targetObject;

		if (this.parentObject) targetObject = this.parentObject;
		else targetObject = this.selectedObject;

		if(targetObject.size.x - canvasX > targetObject.size.y - canvasY)
		{
			scale = targetObject.size.x*targetObject.scale/canvasX;
		}
		else scale = targetObject.size.y*targetObject.scale/canvasY;

		this.Framework.transitionTo(targetObject.position.x, targetObject.position.y, scale, targetObject.rotation);
		
	}
};


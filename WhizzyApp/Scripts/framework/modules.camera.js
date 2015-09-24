WHIZZY.namespace("modules.Camera");

WHIZZY.modules.Camera = {
	//Dependencies
	Debug: WHIZZY.utilities.debugger,
	Vector: WHIZZY.modules.Vector,
	scale: undefined,
	rotation: undefined,
	position: undefined,
	context: undefined,
	Canvas: undefined,
	stageSize: undefined,
	minScale: undefined,
	dragStep: 0.025,
	zoomStep: 0.2,
	rotateStep: 2 * (Math.PI/180),

	initialise: function (stageSize) {
		this.Canvas = WHIZZY.modules.Canvas;
		this.context = this.Canvas.getContext();
		this.stageSize = stageSize;

		this.scale = 1;
		this.rotation = 0;
		this.position = new WHIZZY.modules.Vector(0,0);
		this.minScale = this.stageSize.x/this.Canvas.size.x;
	},
	
	transformMouse: function(mouse) {
		var newMouse = new this.Vector(mouse.x, mouse.y);
		newMouse = newMouse.rotate(this.rotation);

		var scale;
		if (this.Canvas.fullsize)
			scale = (this.scale/this.Canvas.scale);		
		else scale = this.scale
		newMouse.x = newMouse.x * scale;
		newMouse.y = newMouse.y * scale;
		
		newMouse.x += this.position.x;
		newMouse.y += this.position.y;
		return newMouse;
	},

	freeZoom: function(direction, mouse)
	{
		var deltaZoom = direction * this.zoomStep * this.scale;
		this.zoom(deltaZoom);
	},

	zoom: function(deltaZoom)
	{
		//Round to first decimal
		var newZoom = this.scale + deltaZoom;

		if (deltaZoom < 0) // Zoom In
		{
			if (newZoom < 1/WHIZZY.settings.MAX_ZOOM) newZoom = 1/WHIZZY.settings.MAX_ZOOM;
		}
		else if (deltaZoom > 0) // Zoom Out
		{
			if (newZoom > this.minScale)
			{
				newZoom = this.minScale;
			}
		}
		this.scale = newZoom;
	},

	dragCamera: function(mouseVector)
	{
		this.move(mouseVector.multiply(this.dragStep));
	},

	// Add vector to camera's position, stay within stage borders
	move: function(movement)
	{
		// TODO: scale movement
		movement = movement.rotate(this.rotation);
		movement = movement.multiply(this.scale);
		var position = this.position.copy(),
			newPosition = position.add(movement);

		var stageX = this.stageSize.x/2,
			stageY = this.stageSize.y/2;

		if (newPosition.x < -stageX)
			newPosition.x = -stageX;
		else if (newPosition.x > stageX)
			newPosition.x = stageX;

		if (newPosition.y < -stageY)
			newPosition.y = -stageY;
		else if (newPosition.y > stageY)
			newPosition.y = stageY;

		this.position = newPosition;
	},

	freeRotate: function(direction)
	{
		this.rotate(this.rotateStep*direction);
	},

	rotate: function(deltaTheta)
	{
		// Reset rotation to zero when full circle
		if (this.rotation + deltaTheta >= 2*Math.PI)
		{
			deltaTheta = deltaTheta - ((2*Math.PI) - this.rotation);
			this.rotation = 0;
		}
		else if (this.rotation + deltaTheta <= -2*Math.PI)
		{
			deltaTheta = deltaTheta - (-(2*Math.PI) - this.rotation);
			this.rotation = 0;
		}
		this.rotation = this.rotation + deltaTheta;
	},

	update: function() {
		WHIZZY.utilities.debugger.display.camPos = "x:"+ Math.round(this.position.x) + " y:" + Math.round(this.position.y);
		WHIZZY.utilities.debugger.display.camScale = this.scale;
		WHIZZY.utilities.debugger.display.camTheta = this.rotation;

		this.Canvas.resetContext();
		this.context.rotate(-this.rotation);
		// Correct zoom level if full size
		var scale;
		if (this.Canvas.fullsize)
			scale = (this.scale/this.Canvas.scale);		
		else scale = this.scale;
		this.context.scale(1/scale, 1/scale);
		this.context.translate(-this.position.x, -this.position.y);
	},

	atNode: function(node) {
		if (this.position.x == node.position.x && this.position.y == node.position.y)
		{
			if (this.scale == node.scale)
			{
				if (this.rotation == node.rotation)
				{
					return true;
				}
			}
		}
		return false;
	}

};
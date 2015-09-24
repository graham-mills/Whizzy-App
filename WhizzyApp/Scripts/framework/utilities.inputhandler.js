WHIZZY.namespace("utilities.InputHandler");

WHIZZY.utilities.InputHandler = {
	//Dependencies
	Debug: WHIZZY.utilities.debugger,
	Vector: WHIZZY.modules.Vector,
	DrawTool: WHIZZY.utilities.drawtool,
	Controls: WHIZZY.utilities.controls,
	Camera: WHIZZY.modules.Camera,
	Canvas: WHIZZY.modules.Canvas,
	ActionQueue: WHIZZY.utilities.ActionQueue,
	Stage: WHIZZY.modules.Stage,

	initialise: function() {
		//Variables
		this.isMouseDown = false;
		this.mouseWheelDelta = 0;
		this.mouse = {canvas: {x:0, y:0}, origin: {x:0, y:0}, world:{x:0,y:0}};
		this.disableDrag = false;
		this.clickFrames = 0;
		this.mouseOver = false;
		this.hoveredEntity = undefined;
	},

	keyDown: function(e) {
		switch(e.keyCode)
		{
			case 37: //Left
				if (WHIZZY.editor) return;
				this.action("PREV");
				break;
			case 39: //Right
				if (WHIZZY.editor) return;
				this.action("NEXT");
				break;
			case 188: // <
				this.action("ROTATE_CCW");
				break;
			case 190: // >
				this.action("ROTATE_CW");
				break;
			case 13: // Enter
				if (WHIZZY.editor) return;
				this.action("TOGGLE_SIZE");
				break;
			case 32: // Space
				if (WHIZZY.editor) return;
				e.preventDefault();
				this.action("NEXT");
				break;
			case 8: // Backspace
				if (WHIZZY.editor) return;
				e.preventDefault();
				this.action("PREV");
				break;
			case 68: // d
				if (WHIZZY.editor) return;
				this.action("TOGGLE_DRAW");
				break;
			case 49: // 1
				if (WHIZZY.editor) return;
				this.action("TOGGLE_DRAWMODE");
				break;
			case 90: // z
				if (WHIZZY.editor) return;
				if (e.ctrlKey) this.action("UNDO"); // If CTRL + z
				break;
		}
	},

	mouseDown: function(e) {
		if (!this.mouseOver) return;
		switch(e.button)
		{
		    case 0://Left mouse button
	   			this.isMouseDown = true;

				break;
			case 1://Middle mouse button
				break;
			case 2://Right mouse button
				break;
		}

		if (this.DrawTool && this.DrawTool.enabled)
		{
			this.DrawTool.penDown(this.mouse.world.x, this.mouse.world.y);
		}

		if(WHIZZY.editor && WHIZZY.editor.Transformable.hoveredBody)
		{
			WHIZZY.editor.Transformable.mouseDown(this.mouse.world);
		}


		if (e.preventDefault())
		{
			e.preventDefault();
		}
		else return false;
	},

	mouseUp: function(e) {
		this.isMouseDown = false;
		this.disableDrag = false;
		switch(e.button)
		{
			case 0://Left mouse button
				if(WHIZZY.editor)
				{
					WHIZZY.editor.Transformable.mouseUp();
				}

				if (this.mouseOver)
				{
					if (this.DrawTool && this.DrawTool.enabled)
					{
						if(this.Controls && this.Controls.hoveredButton && this.Controls.hoveredButton.action == "TOGGLE_DRAW")
							this.Controls.mouseDown();
						else this.DrawTool.penUp(this.mouse.world.x, this.mouse.world.y);
					}
					else {
						if (this.clickFrames < WHIZZY.settings.CLICK_DURATION) this.clicked();
						this.clickFrames = 0;
					}
				}

				break;
			case 1://Middle mouse button
				break;
			case 2://Right mouse button
				break;
		}
	},

	mouseWheel: function(e) {
		if (!this.mouseOver) return;

		var wheelDelta = e.detail ? e.detail * -1 : e.wheelDelta;

		if (wheelDelta > 0) // Zoom in
		{	
			this.action("ZOOM_IN");
		}
		else if (wheelDelta < 0) // Zoom out
		{
			this.action("ZOOM_OUT");
		}

		//Disable page scrolling when over canvas
		if (e.preventDefault())
		{
			e.preventDefault();
		}
		else return false;

	},

	clicked: function() {
		if (this.Controls && this.Controls.mouseHovered)
		{
			this.disableDrag = true;
			this.Controls.mouseDown();
		}	
		else if (this.hoveredEntity)
		{
			this.hoveredEntity.mouseDown();
		}
		else 
		{	
			if (!WHIZZY.editor || !WHIZZY.editor.ActionList.mouseDown())
				document.dispatchEvent(new Event("stageClicked"));
		}
	},

	action: function(action) {
		switch(action) 
		{
			case "ZOOM_OUT":
				if (this.DrawTool && this.DrawTool.enabled) return;
				this.Camera.freeZoom(1, this.mouse.origin);
				break;
			case "ZOOM_IN":
				if (this.DrawTool && this.DrawTool.enabled) return;
				this.Camera.freeZoom(-1, this.mouse.origin);
				break;
			case "NEXT":
				if (WHIZZY.editor) return;
				if (this.DrawTool.enabled) return;
				this.ActionQueue.nextAction();
				break;
			case "PREV":
				if (WHIZZY.editor) return;
				if (this.DrawTool.enabled) return;
				this.ActionQueue.prevAction();
				break;
			case "ROTATE_CW":
				this.Camera.freeRotate(1);
				break;
			case "ROTATE_CCW":
				this.Camera.freeRotate(-1);
				break;
			case "TOGGLE_SIZE":
				if (WHIZZY.editor) return;
				this.Canvas.toggleSize();
				break;
			case "TOGGLE_DRAW":
				if (WHIZZY.editor) return;
				this.DrawTool.toggleDraw();
				break;
			case "TOGGLE_DRAWMODE":
				if (WHIZZY.editor) return;
				this.DrawTool.toggleDrawMode();
				break;
			case "UNDO":
				if (WHIZZY.editor) return;
				this.DrawTool.undo(); //Undo while drawing leads to errors
				break;
			default:
				return;
		}
	},
	mouseMove: function(e) {
        this.updateMouseCoords(e);
	},
	mouseDrag: function() {
		if (WHIZZY.editor && (WHIZZY.editor.Transformable.transforming || WHIZZY.editor.Transformable.moving))
		{
			WHIZZY.editor.Transformable.drag(this.mouse.world);
		}
		else
		{
			this.Camera.dragCamera(this.mouse.origin);
		}
	},
	mouseOverCanvas: function() {
		if (WHIZZY.editor)
		{
			if(WHIZZY.editor.PageEvents.disableMouse()) return false;
		}

		if (this.mouse.canvas.x > this.Canvas.innerRect.left && 
			this.mouse.canvas.x < this.Canvas.innerRect.right)
		{
			if (this.mouse.canvas.y > this.Canvas.innerRect.top && 
				this.mouse.canvas.y < this.Canvas.innerRect.bottom)
			{
			    return true;
			}
		}
		return false;
	},
	// Get mouse coords
	updateMouseCoords: function(e) {

		// Get mouse coords on canvas, from window
		var rect = this.Canvas.canvasElement.getBoundingClientRect();
        this.mouse.canvas.x = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*this.Canvas.size.x);
        this.mouse.canvas.y = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*this.Canvas.size.y);
        this.mouse.canvas = new this.Vector(this.mouse.canvas.x, this.mouse.canvas.y);

        this.mouse.origin = new this.Vector(this.mouse.canvas.x- this.Canvas.size.x/2, this.mouse.canvas.y - this.Canvas.size.y/2);
		this.mouse.world = this.Camera.transformMouse(this.mouse.origin);

		this.Debug.display.mouse_x = this.mouse.world.x;
		this.Debug.display.mouse_y = this.mouse.world.y;
		this.Debug.display.origin_x = this.mouse.origin.x;
		this.Debug.display.origin_y = this.mouse.origin.y;
		
	},

	update: function() {
		this.mouseOver = this.mouseOverCanvas();
		if (this.isMouseDown)
		{
			this.clickFrames++;
			if (!this.disableDrag)
			{
				if (this.DrawTool && this.DrawTool.enabled)
				{
					this.DrawTool.drawing(this.mouse.world.x, this.mouse.world.y);
				}
				else
				{
					if (this.clickFrames > WHIZZY.settings.CLICK_DURATION) this.mouseDrag();
				}
			}
		}

		if (!this.isMouseDown && this.mouseOver) this.mouseHover();
	},

	mouseHover: function() {
		if (this.Controls)
		{
			if (this.Controls.mouseOver(this.mouse.origin))
			{
				this.Canvas.setCursorStyle("pointer");
				return;
			}
		}

		if (this.DrawTool && this.DrawTool.enabled)
		{
			this.Canvas.setCursorStyle("crosshair");
			return;
		}

		var hoveredEntities = [];

		hoveredEntities = hoveredEntities.concat(this.Stage.mouseHover(this.mouse.world));
		if(WHIZZY.editor) hoveredEntities = hoveredEntities.concat(WHIZZY.editor.main.mouseHover(this.mouse.world));

		if(hoveredEntities.length === 0)
		{
			this.hoveredEntity = undefined;
			this.Canvas.setCursorStyle("default");
			return;
		}
		else if (hoveredEntities.length === 1)
		{
			this.hoveredEntity = hoveredEntities[0];
		}
		else if (hoveredEntities.length > 1)
		{
			this.hoveredEntity = this.sortHoveredEntities(hoveredEntities);
		}


		if(WHIZZY.editor && this.hoveredEntity === WHIZZY.editor.Transformable)
		{
			if(WHIZZY.editor.Transformable.hoveredHandle != undefined)
			{
				this.Canvas.setCursorStyle(WHIZZY.editor.Transformable.hoveredHandle.cursor);
			}
			else this.Canvas.setCursorStyle("pointer");
		}
		else this.Canvas.setCursorStyle("pointer");
		
	},

	sortHoveredEntities: function(entities) {
		var selected = entities[0],
			compared;

		for(var e in entities)
		{
			if(e == 0) continue;
			compared = entities[e];

			if(!(selected.isEntity()))
			{
				selectedWidth = selected.size.x*selected.scale;
				selectedHeight = selected.size.y*selected.scale;
				selectedPos = {x:selected.x, y: selected.y};
			}
			else
			{
				selectedWidth = selected.size.x*selected.getScale();
				selectedHeight = selected.size.y*selected.getScale();
				selectedPos = selected.getPosition();
			}

			if(!(compared.isEntity()))
			{
				comparedWidth = compared.size.x*compared.scale;
				comparedHeight = compared.size.y*compared.scale;
				comparedPos = {x:compared.x, y: compared.y};
			}
			else
			{
				comparedWidth = compared.size.x*compared.getScale();
				comparedHeight = compared.size.y*compared.getScale();
				comparedPos = compared.getPosition();
			}

			// Is the compared entity inside of the selected entity and not vice versa?
			if(comparedPos > selectedPos - selectedWidth/2 && comparedPos < selectedPos + selectedWidth/2
				&& comparedPos > selectedPos - selectedHeight/2 && comparedPos < selectedPos + selectedHeight/2
				&& !(selectedPos > comparedPos - comparedWidth/2 && selectedPos < comparedPos + comparedWidth/2
					&& selectedPos > comparedPos - comparedHeight/2 && selectedPos < comparedPos + comparedHeight/2))
			{
				selected = compared;
			}
			else
			{
				if(comparedWidth < selectedWidth && comparedHeight < selectedHeight)
				{
					selected = compared;
				}
			}
		}
		return selected;
	}

};
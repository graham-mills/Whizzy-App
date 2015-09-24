WHIZZY.namespace("utilities.EventHandler");

WHIZZY.utilities.EventHandler = {

	initialise: function() {
		if ((window.addEventListener && document.addEventListener) 
				|| (window.attachEvent && document.attachEvent))
		{
			this.startListeners();
		}
	},
	startListeners: function() {
		if (document.addEventListener) // Current browsers
		{
			document.addEventListener('keydown', function(event){
				if(event) WHIZZY.utilities.InputHandler.keyDown(event);
			}, false);

			document.addEventListener('mousedown', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseDown(event);
			}, false);

			document.addEventListener('mouseup', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseUp(event);
			}, false);

			document.addEventListener('mousewheel', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseWheel(event);
			}, false);

			document.addEventListener('DOMMouseScroll', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseWheel(event);
			}, false);

			document.addEventListener('mousemove', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseMove(event);
			}, false);

			document.addEventListener('sceneClicked', function(event) {
				if(event && !WHIZZY.editor) WHIZZY.utilities.ActionQueue.sceneClicked(event);
			}, false);

			window.addEventListener('resize', function(event){
				console.log("Window resized");
				WHIZZY.modules.Canvas.onResize();
			}, false);
		}
		else if (document.attachEvent) // IE8 and earlier
		{
			document.attachEvent('keydown', function(event){
				if(event) WHIZZY.utilities.InputHandler.keyDown(event);
			}, false);

			document.attachEvent('mousedown', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseDown(event);
			}, false);

			document.attachEvent('mouseup', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseUp(event);
			}, false);

			document.attachEvent('mousewheel', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseWheel(event);
			}, false);

			document.attachEvent('DOMMouseScroll', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseWheel(event);
			}, false);

			document.attachEvent('mousemove', function(event){
				if(event) WHIZZY.utilities.InputHandler.mouseMove(event);
			}, false);

			document.attachEvent('sceneClicked', function(event) {
				if(event && !WHIZZY.editor) WHIZZY.utilities.ActionQueue.sceneClicked(event);
			}, false);

			window.attachEvent('resize', function(event){
				console.log("Window resized");
				WHIZZY.modules.Canvas.onResize();
			}, false);
		}
	}
};
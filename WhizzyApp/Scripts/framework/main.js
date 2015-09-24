WHIZZY.namespace("main");

WHIZZY.main = function () {
	//Dependencies
	var Debug = WHIZZY.utilities.debugger,
		DrawTool = WHIZZY.utilities.drawtool,
		Canvas = WHIZZY.modules.Canvas,
		EventHandler = WHIZZY.utilities.EventHandler,
		InputHandler = WHIZZY.utilities.InputHandler,
		Stage = WHIZZY.modules.Stage,
		Scene = WHIZZY.modules.Scene,
		Background = WHIZZY.modules.Background,
		Camera = WHIZZY.modules.Camera,
		TextObject = WHIZZY.modules.TextObject,
		ImageObject = WHIZZY.modules.ImageObject,
		Shape = WHIZZY.modules.Shape,
		Transition = WHIZZY.modules.Transition,
		TransitionNode = WHIZZY.modules.TransitionNode,
		Vector = WHIZZY.modules.Vector,
		ActionQueue = WHIZZY.utilities.ActionQueue,
		Controls = WHIZZY.utilities.controls,
		ProgressBar = WHIZZY.utilities.ProgressBar,
		Arc = WHIZZY.modules.Arc,
		Rectangle = WHIZZY.modules.Rectangle,
		Animation = WHIZZY.modules.Animation,
		Presentation = undefined,
		Editor = undefined,

		//Variables
		i,
		now,
		then = Date.now(),
		interval = 1000/WHIZZY.settings.FPS,
		delta;

	function initialise() {
		Presentation = WHIZZY.json.Presentation;
		initialiseSettings();

		Stage.initialise(Presentation.stage);
		Canvas.initialise({
			id:WHIZZY.settings.APP_NAME,
			width:WHIZZY.settings.WIDTH
		});

		if (ProgressBar)
		{
			ProgressBar.initialise({
				height:5,
				width:Canvas.size.x
			});
		}

		load();
		if (WHIZZY.editor) {
			Editor = WHIZZY.editor.main;
			Editor.initialise();
		}
		
	};

	function initialiseSettings() {
		if (!WHIZZY.settings.IMAGE_PATH) WHIZZY.settings.IMAGE_PATH = WHIZZY.json.IMAGE_PATH;
		WHIZZY.settings.CAM_START = WHIZZY.json.CAM_START;
		WHIZZY.settings.PB_FGFILL = WHIZZY.json.PB_FGFILL;
		WHIZZY.settings.PB_BGFILL = WHIZZY.json.PB_BGFILL;
		WHIZZY.settings.TOGGLE_SIZE = WHIZZY.json.TOGGLE_SIZE;
	};

	function draw(context) {
		Canvas.clear(context);
		Canvas.drawBackground(context);
		Stage.draw(context);

		if (DrawTool) DrawTool.draw(context);
		if (Controls) Controls.draw(context);
		
		Canvas.drawMargins(context);
		Debug.draw(context);
		if (Editor) Editor.draw(context);
	};

	function update() {
		ActionQueue.update();
		Camera.update();
		InputHandler.update();
		if (Controls) Controls.update();
		Debug.update();
		if (Editor) Editor.update();
	};

	function animationLoop() {

		now = Date.now();
		delta = now - then;
		update();
		if (delta > interval)
		{
			
			draw(Canvas.getContext());
			then = now - (delta % interval);
		}
		requestAnimationFrame(animationLoop);
	};

	function load() {
		Camera.initialise(Stage.size);

		ActionQueue.initialise();

		loadPresentation();

		InputHandler.initialise();
		EventHandler.initialise();

		if (Controls)
		{
			Controls.initialise({
				width:Canvas.size.x,
				height:30
			});
		}
	};

	function loadPresentation() {
		var type;
		for (i = 0; i < Presentation.scenes.length; ++i)
		{
			Stage.addScene(Presentation.scenes[i]);
		}

		for (i = 0; i < Presentation.sceneObjects.length; ++i)
		{
			type = getClass(Presentation.sceneObjects[i].type);
			Stage.addContent(new type(Presentation.sceneObjects[i].params));
		}

		for (i = 0; i < Presentation.actions.length; ++i)
		{
			type = getClass(Presentation.actions[i].type);
			ActionQueue.addAction(new type(Presentation.actions[i].params));
		}
	};

	function getClass(type) {
		switch(type)
		{
			case "WHIZZY.modules.TextObject":
				return WHIZZY.modules.TextObject;
				break;
			case "WHIZZY.modules.ImageObject":
				return WHIZZY.modules.ImageObject;
				break;
			case "WHIZZY.modules.Rectangle":
				return WHIZZY.modules.Rectangle;
				break;
			case "WHIZZY.modules.Arc":
				return WHIZZY.modules.Arc;
				break;
			case "WHIZZY.modules.Shape":
				return WHIZZY.modules.Shape;
				break;
			case "WHIZZY.modules.TransitionNode":
				return WHIZZY.modules.TransitionNode;
				break;
			case "WHIZZY.modules.Animation":
				return WHIZZY.modules.Animation;
				break;
		}
	};

	initialise();
	requestAnimationFrame(animationLoop);
};



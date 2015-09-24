///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Vector");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("add", function( assert ) {
	assert.expect(2);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(50,-25);
	result = newVector.add(newVector);


	assert.equal(result.x, 100, "Pass sum of x component");
	assert.equal(result.y, -50, "Pass sum of y component");
});
QUnit.test("subtract", function( assert ) {
	assert.expect(2);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(50,-25);
	result = newVector.subtract(newVector);


	assert.equal(result.x, 0, "Pass subtract of x component");
	assert.equal(result.y, 0, "Pass subtract of y component");
});
QUnit.test("subtract", function( assert ) {
	assert.expect(2);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(50,-25);
	result = newVector.subtract(newVector);


	assert.equal(result.x, 0, "Pass subtract of x component");
	assert.equal(result.y, 0, "Pass subtract of y component");
});
QUnit.test("divide", function( assert ) {
	assert.expect(2);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(50,-25);
	result = newVector.divide(20);


	assert.equal(result.x, 50/20, "Pass divide of x component");
	assert.equal(result.y, -25/20, "Pass divide of y component");
});
QUnit.test("multiply", function( assert ) {
	assert.expect(2);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(50,-25);
	result = newVector.multiply(0.5);


	assert.equal(result.x, 50*0.5, "Pass divide of x component");
	assert.equal(result.y, -25*0.5, "Pass divide of y component");
});
QUnit.test("rotate", function( assert ) {
	assert.expect(2);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(50,-25);
	result = newVector.rotate(-Math.PI/4);


	assert.equal(parseFloat(result.x.toFixed(5)), 17.67767, "Pass rotate of x component");
	assert.equal(parseFloat(result.y.toFixed(6)), -53.033009, "Pass rotate of y component");
});
QUnit.test("copy", function( assert ) {
	assert.expect(1);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(50,-25);
	result = newVector.copy();

	assert.ok(newVector != result, "Pass vector copy");
});
QUnit.test("scalar", function( assert ) {
	assert.expect(1);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(9,2.5);
	result = newVector.getScalar(new Vector(200,-7));

	assert.equal(result, (9*200)+(2.5*-7), "Equal scalar result");
});
QUnit.test("magnitude", function( assert ) {
	assert.expect(1);
	var Vector = WHIZZY.modules.Vector,
		newVector,
		result;

	newVector = new Vector(9,2.5);
	result = newVector.getMagnitude();

	assert.equal(result, Math.sqrt(87.25), "Equal magnitude result");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Camera");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test( "transformMouse", function( assert ) {
	assert.expect(2);
	var Camera = WHIZZY.modules.Camera,
		startVector = new WHIZZY.modules.Vector(100,100),
		endVector;

	Camera.rotation = Math.PI/2;
	Camera.zoomFactor = 2;
	Camera.position.x = 500;
	Camera.position.y = 500;

	endVector = Camera.transformMouse(startVector);

	startVector = startVector.rotate(-Camera.rotation);
	startVector = startVector.multiply(1/Camera.zoomFactor);
	startVector.x += Camera.position.x;
	startVector.y += Camera.position.y;
	assert.equal(endVector.x, startVector.x, "Equal x position");
	assert.equal(endVector.y, startVector.y, "Equal y position");
});
QUnit.test("zoom", function( assert ) {
	assert.expect(1);
	var Camera = WHIZZY.modules.Camera,
		deltaZoom = 0.9,
		startZoom = Camera.zoomFactor;

	Camera.zoom(deltaZoom);

	assert.equal(Camera.zoomFactor, startZoom + deltaZoom, "Equal zoom var");
});
QUnit.test("move", function( assert ) {
	assert.expect(2);
	var Camera = WHIZZY.modules.Camera,
		movement = new WHIZZY.modules.Vector(251.5, 7),
		expected = Camera.position.add(movement);

	Camera.move(movement);

	assert.ok(expected.x, Camera.position.x, "Equal position x");
	assert.ok(expected.y, Camera.position.y, "Equal position y");
});
QUnit.test("rotate", function( assert ) {
	assert.expect(1);
	var Camera = WHIZZY.modules.Camera,
		rotation = Math.PI/6,
		startRotation = -(Math.PI/4);

	Camera.rotation = startRotation
	Camera.rotate(rotation);

	assert.equal(Camera.rotation, startRotation+rotation, "Equal rotation");
});
QUnit.test("atNode", function( assert ) {
	assert.expect(2);
	var Camera = WHIZZY.modules.Camera,
		node = new WHIZZY.modules.TransitionNode({
			position: {x: -500, y: 351.2},
			scale: 1.3,
			rotation: Math.PI*1.5,
			sequenced: false
		}),
		first,
		second;

	Camera.rotation = 0;
	Camera.zoomFactor = 1;
	Camera.position.x = 0;
	Camera.position.y = 0;

	first = Camera.atNode(node);
	assert.ok(first === false, "Not at node");

	Camera.rotation = -node.rotation;
	Camera.zoomFactor = 1/node.scale;
	Camera.position = node.position;

	second = Camera.atNode(node);
	assert.ok(second === true, "At node");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Canvas");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("resize", function( assert ) {
	assert.expect(2);
	var Canvas = WHIZZY.modules.Canvas;

	Canvas.resize(700, 250);

	assert.equal(700, Canvas.canvasElement.width, "Equal width");
	assert.equal(250, Canvas.canvasElement.height, "Equal height");
});
QUnit.test("maximise", function( assert ) {
	assert.expect(2);
	var Canvas = WHIZZY.modules.Canvas;

	Canvas.maximise();

	assert.equal(window.innerWidth, Canvas.canvasElement.width, "Canvas x === Window x");
	assert.equal(window.innerHeight, Canvas.canvasElement.height, "Canvas y  === Window y");
});
QUnit.test("minimise", function( assert ) {
	assert.expect(3);
	var Canvas = WHIZZY.modules.Canvas;

	Canvas.minimise();

	assert.equal(Canvas.scale, 1, "Scale 1");
	assert.equal(Canvas.canvasElement.width, Canvas.defaultSize.x, "Equal x");
	assert.equal(Canvas.canvasElement.height, Canvas.defaultSize.y, "Equal y");
});
QUnit.test("toggleSize", function( assert ) {
	assert.expect(2);
	var Canvas = WHIZZY.modules.Canvas;

	Canvas.toggleSize();

	assert.equal(window.innerWidth, Canvas.canvasElement.width, "Canvas x === Window x");
	assert.equal(window.innerHeight, Canvas.canvasElement.height, "Canvas y  === Window y");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Entity");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("reset", function( assert ) {
	assert.expect(2);
	var Entity = WHIZZY.modules.Entity,
		newEntity = new Entity({
			position: {x:999, y:-999},
			size: {x: 10, y:10}
		});

	newEntity.position.x = "not a number";
	newEntity.position.y = {banana: true};

	newEntity.reset();
	assert.equal(newEntity.position.x, 999, "Equal x position");
	assert.equal(newEntity.position.y, -999, "Equal y position");
});
QUnit.test("isType", function( assert ) {
	assert.expect(3);
	var newEntity = new WHIZZY.modules.TextObject({
		position: {x:0,y:0},
		size: {x:0,y:0},
		paragraphs: "Test object",
		fillStyle: "white"
	}),
		entityIsText,
		entityIsImage,
		entityIsUnknown;

	entityIsText = newEntity.isType("TextObject");
	entityIsImage = newEntity.isType("ImageObject");
	entityIsUnknown = newEntity.isType("Object");

	assert.equal(entityIsText, true, "Is text");
	assert.equal(entityIsImage, false, "Is not image");
	assert.equal(entityIsUnknown, false, "Is unknown");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Scene");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("constructor", function( assert ) {
	assert.expect(4);
	var Scene = WHIZZY.modules.Scene,
		newScene;

	newScene = new Scene({
		id: 1,
		position: {x:50,y:50},
		size: {x: 300, y:250},
		background_params: {
			fillStyle: "blue",
			fixed: false,
			imageSrc: "image.jpg",
			imageX: 100,
			imageY: 100
		}
	});

	assert.equal(newScene.position.x, 50, "Equal x position");
	assert.ok(newScene.background != undefined, "Background created");
	assert.ok(newScene.background.image != undefined, "Background image created");
	assert.equal(newScene.id, 1, "Equal id attribute");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Stage");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("constructor", function( assert ) {
	assert.expect(3);
	var Stage = WHIZZY.modules.Stage;

	Stage.initialise({
		size: {x: 3000, y:250},
		background_params: {
			fillStyle: "blue",
			fixed: false,
			imageSrc: "image.jpg",
			imageX: 100,
			imageY: 100
		}
	});

	assert.equal(Stage.scenes[0].size.x, 3000, "Equal width");
	assert.ok(Stage.scenes[0].background != undefined, "Background created");
	assert.ok(Stage.scenes[0].background.image != undefined, "Background image created");
	Stage.scenes[0].background = undefined;
});
QUnit.test("addScene", function( assert ) {
	assert.expect(2);
	var Stage = WHIZZY.modules.Stage;

	Stage.addScene({
		id: 1,
		position: {x:0,y:0},
		size: {x: 300, y:250},
		background_params: {
			fillStyle: "blue",
			fixed: false
		}
	});
	Stage.addScene({
		id: 2,
		position: {x:1500,y:-700},
		size: {x: 300, y:250},
		background_params: {
			fillStyle: "blue",
			fixed: false
		}
	});

	assert.equal(Stage.scenes.length, 3, "Equal number of scenes");
	assert.equal(Stage.scenes[Stage.scenes.length-1].id, 2, "Equal id attribute of last scene added");
});
QUnit.test("addContent", function( assert ) {
	assert.expect(2);
	var Stage = WHIZZY.modules.Stage,
		Rectangle = WHIZZY.modules.Rectangle;

	Stage.addContent(new Rectangle({
		parent:0,
		size: {x:100,y:100},
		position: {x:0,y:0}
	}));

	assert.ok(Stage.scenes[0].content.length > 0, "Content added");
	assert.equal(Stage.scenes[0].content[Stage.scenes[0].content.length-1].isType("Rectangle"), true, "Type is rectangle");

	Stage.scenes[0].content = [];
});
QUnit.test("mouseHover", function( assert ) {
	assert.expect(2);
	var Stage = WHIZZY.modules.Stage,
		mouseOn = new WHIZZY.modules.Vector(1500, -700),
		mouseOff = new WHIZZY.modules.Vector(5000, 0);

	Stage.addScene({
		id: 1,
		position: {x:1500,y:-700},
		size: {x: 300, y:250},
		background_params: {
			fillStyle: "blue",
			fixed: false
		}
	});

	mouseOn = Stage.mouseHover(mouseOn);
	mouseOff = Stage.mouseHover(mouseOff);

	assert.ok(mouseOn != undefined, "Mouse is on");
	assert.ok(mouseOff == undefined, "Mouse is off");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("TextObject");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("linebuilder", function( assert ) {
	assert.expect(1);
	var TextObject = WHIZZY.modules.TextObject,
		newText;

	newText = new TextObject({
		position: {x:0,y:0},
		size: {x:1000, y:0},
		paragraphs: "This text has\nthree different\nlines",
		font: "12px Arial"
	});

	assert.equal(newText.text.length, 5, "Text split to 3 lines");
});
QUnit.test("resize", function( assert ) {
	assert.expect(1);
	var TextObject = WHIZZY.modules.TextObject,
		newText;

	newText = new TextObject({
		position: {x:0,y:0},
		size: {x:25, y:0},
		paragraphs: "This text should be split to fit",
		font: "12px Arial"
	});

	assert.ok(newText.text.length > 1, "Text area resized for lines");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("InputHandler");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("mouseOverCanvas", function( assert ) {
	assert.expect(2);
	var InputHandler = WHIZZY.utilities.InputHandler,
		mouseOff,
		mouseOn;

	InputHandler.mouse.canvas.x = 999999;
	InputHandler.mouse.canvas.y = 10;
	mouseOff = InputHandler.mouseOverCanvas();

	InputHandler.mouse.canvas.x = 50;
	InputHandler.mouse.canvas.y = -11.5;
	mouseOn = InputHandler.mouseOverCanvas();

	assert.equal(mouseOff, false, "Pass mouse off");
	assert.equal(mouseOn, true, "Pass mouse on");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Transition");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("constructor", function( assert ) {
	assert.expect(3);
	var Transition = WHIZZY.modules.Transition,
		newTransition;

	newTransition = new Transition({
		startNode: {
			position: new WHIZZY.modules.Vector(0,0),
			scale: 2,
			rotation: Math.PI
		},
		endNode: {
			position: new WHIZZY.modules.Vector(500,200),
			scale: 1,
			rotation: 0
		},
		sequenced: false
	});

	assert.ok(newTransition.zoomStep != undefined, "Pass zoom step");
	assert.ok(newTransition.moveStep != undefined, "Pass move step");
	assert.ok(newTransition.rotateStep != undefined, "Pass rotate step");
});
QUnit.test("update", function( assert ) {
	assert.expect(2);
	var Transition = WHIZZY.modules.Transition,
		newTransition,
		camPos = WHIZZY.modules.Camera.position.x;

	newTransition = new Transition({
		startNode: {
			position: WHIZZY.modules.Camera.position.copy(),
			scale: 1,
			rotation: 0
		},
		endNode: {
			position: new WHIZZY.modules.Vector(500,200),
			scale: 1,
			rotation: 0
		},
		sequenced: false
	});
	newTransition.update();

	assert.ok(newTransition.currentStep > 0, "Pass step iterate");
	assert.equal(WHIZZY.modules.Camera.position.x, camPos+newTransition.moveStep.x, "Pass move camera");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("ActionQueue");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("constructor", function( assert ) {
	assert.expect(2);
	var ActionQueue = WHIZZY.utilities.ActionQueue,
		TransitionNode = WHIZZY.modules.TransitionNode,
		newTransition;

	ActionQueue.actions = [];

	newTransition = new TransitionNode({
		position: new WHIZZY.modules.Vector(999,999),
		scale: 1,
		rotation: 0,
		sequenced: true
	});
	ActionQueue.addAction(newTransition);

	assert.equal(WHIZZY.modules.Camera.position.x, 999, "Pass camera initialise x");
	assert.equal(WHIZZY.modules.Camera.position.y, 999, "Pass camera initialise y");
});
QUnit.test("nextAction", function( assert ) {
	assert.expect(1);
	var ActionQueue = WHIZZY.utilities.ActionQueue;

	ActionQueue.getNextAction(1);

	assert.equal(ActionQueue.currentAction, 0, "Equal next action id");
});
QUnit.test("prevAction", function( assert ) {
	assert.expect(1);
	var ActionQueue = WHIZZY.utilities.ActionQueue;
	
	nextActionId = ActionQueue.getNextAction(-1);

	assert.equal(ActionQueue.currentAction, 0, "Equal prev action id");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("SceneList");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("nextSceneId", function( assert ) {
	assert.expect(1);
	var SceneList = WHIZZY.editor.SceneList,
		id;

	SceneList.initialise();
	id = SceneList.nextSceneId();

	assert.equal(id, 2, "Equal scene id");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Transformable");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("select", function( assert ) {
	assert.expect(1);
	var Transformable = WHIZZY.editor.Transformable;

	Transformable.select(WHIZZY.modules.Stage.scenes[0]);

	assert.ok(Transformable.selectedObject instanceof WHIZZY.modules.Scene, "Pass scene selected");
});
QUnit.test("scale", function( assert ) {
	assert.expect(1);
	var Transformable = WHIZZY.editor.Transformable;

	Transformable.setScale(3.2);

	assert.ok(WHIZZY.modules.Stage.scenes[0].scale == 3.2, "Pass scene scaled");
});
QUnit.test("position", function( assert ) {
	assert.expect(2);
	var Transformable = WHIZZY.editor.Transformable;

	Transformable.select(WHIZZY.modules.Stage.scenes[0]);
	Transformable.setPosition({x:500, y:-500});

	assert.equal(WHIZZY.modules.Stage.scenes[0].position.x, 500, "Pass x position");
	assert.equal(WHIZZY.modules.Stage.scenes[0].position.y, -500, "Pass y position");
});
QUnit.test("size", function( assert ) {
	assert.expect(2);
	var Transformable = WHIZZY.editor.Transformable;

	Transformable.setSize(160, 90);

	assert.equal(WHIZZY.modules.Stage.scenes[0].size.x, 160, "Equal width");
	assert.equal(WHIZZY.modules.Stage.scenes[0].size.y, 90, "Equal height");
});
QUnit.test("rotation", function( assert ) {
	assert.expect(1);
	var Transformable = WHIZZY.editor.Transformable;

	Transformable.setRotation(2*Math.PI);

	assert.equal(WHIZZY.modules.Stage.scenes[0].rotation, 2*Math.PI, "Equal rotation");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("ActionList");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("nextTransitionId", function( assert ) {
	assert.expect(1);
	var ActionList = WHIZZY.editor.ActionList,
		id;

	id = ActionList.getNextTransitionId();

	assert.equal(id, 1, "Equal id result");
});
QUnit.test("nextAnimationId", function( assert ) {
	assert.expect(1);
	var ActionList = WHIZZY.editor.ActionList,
		id;

	id = ActionList.getNextAnimationId();

	assert.equal(id, 1, "Equal id result");
});
QUnit.test("select", function( assert ) {
	assert.expect(1);
	var ActionList = WHIZZY.editor.ActionList,
		id;

	ActionList.select(new WHIZZY.editor.TransitionNode(WHIZZY.utilities.ActionQueue.actions[0], 0));

	assert.ok(ActionList.selectedAction instanceof WHIZZY.editor.TransitionNode, "Pass selected transition node");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("Framework");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("getSceneById", function( assert ) {
	assert.expect(2);
	var Framework = WHIZZY.editor.Framework,
		id = 4,
		scene;

	WHIZZY.modules.Stage.addScene({
		id:id,
		position: new WHIZZY.modules.Vector(0,0),
		size: {x:100,y:100}
	})
	scene = Framework.getSceneById(id);

	assert.ok(scene instanceof WHIZZY.modules.Scene, "Pass instance of scene");
	assert.equal(scene.id, id, "Equal id attribute");
});
QUnit.test("deleteScene", function( assert ) {
	assert.expect(2);
	var Framework = WHIZZY.editor.Framework,
		scene;

	scene = WHIZZY.modules.Stage.scenes[1];
	scene = Framework.deleteScene(scene);

	assert.equal(scene, true, "Equal bool success");
	assert.ok(WHIZZY.modules.Stage.scenes[1] === undefined, "Pass scene undefined");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("TextEditor");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("select", function( assert ) {
	assert.expect(1);
	var TextEditor = WHIZZY.editor.TextEditor;

	TextEditor.select(WHIZZY.editor.TextPanel, "Testing the text editor");

	assert.equal($("#text-edit-area").val(), "Testing the text editor", "Equal text string");
});
QUnit.test("toggleBold", function( assert ) {
	assert.expect(2);
	var TextEditor = WHIZZY.editor.TextEditor,
		bold = true;

	TextEditor.bold = bold;
	TextEditor.toggleBold();

	assert.equal(TextEditor.bold, false, "Equal bold invert");
	assert.equal($("#text-edit-area").css("font-weight"), "400", "Equal bold css style");
});
QUnit.test("toggleItalic", function( assert ) {
	assert.expect(2);
	var TextEditor = WHIZZY.editor.TextEditor,
		italic = false;

	TextEditor.italic = italic;
	TextEditor.toggleItalic();

	assert.equal(TextEditor.italic, true, "Equal italic invert");
	assert.equal($("#text-edit-area").css("font-style"), "italic", "Equal italic css style");
});
QUnit.test("linesToText", function( assert ) {
	assert.expect(1);
	var TextEditor = WHIZZY.editor.TextEditor,
		lines = ["One line", "Two line", "Three line","Four line"],
		text;

	text = TextEditor.linesToText(lines);

	assert.equal(text, "One line\nTwo line\nThree line\nFour line", "Equal lines text");
});
QUnit.test("textToLines", function( assert ) {
	assert.expect(1);
	var TextEditor = WHIZZY.editor.TextEditor,
		lines,
		text = "One line\nTwo line\nThree line\nFour line";

	lines = TextEditor.textToLines(text);

	assert.ok(lines.length === 4, "Equal text lines");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("TextPanel");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("select", function( assert ) {
	assert.expect(4);
	var TextPanel = WHIZZY.editor.TextPanel,
		font = "bold italic 20px Verdana";

	TextPanel.parseFont(font);

	assert.equal(TextPanel.bold, true, "Equal bold attribute");
	assert.equal(TextPanel.italic, true, "Equal italic attribute");
	assert.equal(TextPanel.fontSize, 20, "Equal fontsize attribute");
	assert.equal(TextPanel.fontFamily, "Verdana", "Equal font-family attribute");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("ToolPanel");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("select", function( assert ) {
	assert.expect(2);
	var ToolPanel = WHIZZY.editor.ToolPanel,
		rectangle = new WHIZZY.modules.Rectangle({
			position:{x:0,y:0},
			size:{x:200, y:175},
			fillStyle: "blue"
		});

	ToolPanel.select(rectangle);

	assert.ok(ToolPanel.activeTool === WHIZZY.editor.RectanglePanel, "Pass select tool");
	assert.ok(ToolPanel.activeTool.selectedRectangle === rectangle, "Pass active tool selection");
});
QUnit.test("setFill", function( assert ) {
	assert.expect(1);
	var ToolPanel = WHIZZY.editor.ToolPanel;

	ToolPanel.setFill("blue");

	assert.ok(ToolPanel.activeTool.selectedRectangle.fillStyle, "blue", "Pass object fill");
});
QUnit.test("setStroke", function( assert ) {
	assert.expect(1);
	var ToolPanel = WHIZZY.editor.ToolPanel;

	ToolPanel.setStroke("black")

	assert.ok(ToolPanel.activeTool.selectedRectangle.strokeStyle, "black", "Pass object stroke");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.module("ContentPanel");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("newTextObject", function( assert ) {
	assert.expect(2);
	var ContentPanel = WHIZZY.editor.ContentPanel;

	WHIZZY.modules.Stage.scenes[0].content = [];
	ContentPanel.select(WHIZZY.modules.Stage.scenes[0]);
	ContentPanel.newTextObject();

	assert.equal(WHIZZY.modules.Stage.scenes[0].content.length, 1, "Equal content length");
	assert.ok(WHIZZY.modules.Stage.scenes[0].content[0] instanceof WHIZZY.modules.TextObject, "Pass instance of text");
});
QUnit.test("newRectangle", function( assert ) {
	assert.expect(2);
	var ContentPanel = WHIZZY.editor.ContentPanel;

	WHIZZY.modules.Stage.scenes[0].content = [];
	ContentPanel.select(WHIZZY.modules.Stage.scenes[0]);
	ContentPanel.newRectangle();

	assert.equal(WHIZZY.modules.Stage.scenes[0].content.length, 1, "Equal content length");
	assert.ok(WHIZZY.modules.Stage.scenes[0].content[0] instanceof WHIZZY.modules.Rectangle, "Pass instance of rectangle");
});
QUnit.test("newArc", function( assert ) {
	assert.expect(2);
	var ContentPanel = WHIZZY.editor.ContentPanel;

	WHIZZY.modules.Stage.scenes[0].content = [];
	ContentPanel.select(WHIZZY.modules.Stage.scenes[0]);
	ContentPanel.newArc();

	assert.equal(WHIZZY.modules.Stage.scenes[0].content.length, 1, "Equal content length");
	assert.ok(WHIZZY.modules.Stage.scenes[0].content[0] instanceof WHIZZY.modules.Arc, "Pass instance of arc");
});
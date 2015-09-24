WHIZZY.namespace("editor.ContentPanel");

WHIZZY.editor.ContentPanel = {
	SceneList: undefined,
	ToolPanel: undefined,
	TextPanel: undefined,
	RectanglePanel: undefined,
	ArcPanel: undefined,
	Transformable: undefined,
	selectedScene: undefined,
	listItem: "<li class='sortable sortlist-item' data-id='@number'><span class='glyphicon glyphicon-menu-hamburger'></span>@contentName<button class='btn btn-link btn-xs btn_contentdelete'><span class='glyphicon glyphicon-trash'></span></button></li>",
	strokeColour: undefined,
	fillColour: undefined,
	strokeWidth: 1,
	hidden: true,
	initialise: function() {
		this.SceneList = WHIZZY.editor.SceneList;
		this.ScenePanel = WHIZZY.editor.ScenePanel;
		this.ToolPanel = WHIZZY.editor.ToolPanel;
		this.TextPanel = WHIZZY.editor.TextPanel;
		this.RectanglePanel = WHIZZY.editor.RectanglePanel;
		this.ArcPanel = WHIZZY.editor.ArcPanel;
		this.Transformable = WHIZZY.editor.Transformable;

		$("#btn_deletescene").click(function(){
			WHIZZY.editor.ContentPanel.deleteScene();
		});

		$("#btn_addText").click(function(){
			WHIZZY.editor.ContentPanel.newTextObject();
		});
		$("#btn_addRectangle").click(function(){
			WHIZZY.editor.ContentPanel.newRectangle();
		});
		$("#btn_addArc").click(function(){
			WHIZZY.editor.ContentPanel.newArc();
		});
	},
	show: function() {
		this.hidden = false;
		$("#panel-content-2").css("display", "block");
	},
	hide: function() {
		this.hidden = true;
		$("#panel-content-2").css("display", "none");
	},
	populateContentList: function() {
		var contentlist = $("#contentlist");
		contentlist.empty();
		if (this.selectedScene.content.length === 0)
		{
			contentlist.css("display", "none");
		}
		else contentlist.css("display", "block");

		for(var c in this.selectedScene.content)
		{
			this.addContentToList(this.selectedScene.content[c], c);
		}

		$(".btn_contentdelete").click(function() {
			WHIZZY.editor.ContentPanel.deleteContent($(this).parent().data("id"));
		});

		$("#contentlist").children("li").click(function () {
			WHIZZY.editor.ContentPanel.selectContentId($(this).data("id"));
		});
	},
	initialiseSortable: function() {
		$("#contentlist").last().sortable({
            appendTo: "parent",
            axis: "y",
            tolerance: "pointer",
            containment: "parent",
            cursor: "move",
            distance: 5,
            placeholder: "placeholder",
            items: ".sortable",
            stop: function(e, ui) { WHIZZY.editor.ContentPanel.onSort(e, ui);}
        });
	},
	deleteContent: function(index) {
		if (!this.selectedScene) return;
		if (WHIZZY.editor.Transformable.selectedObject === this.selectedScene.content[index])
			WHIZZY.editor.Transformable.deselect();
		this.selectedScene.content.splice(index, 1);
		this.populateContentList();
	},
	addContentToList: function(content, number) {
		var name;
		if (content.isType("TextObject")) name = "Text";
		else if (content.isType("ImageObject")) name = "Image";
		else if (content.isType("Rectangle")) name = "Rectangle";
		else if (content.isType("Arc")) name = "Arc";
		else name = "Object";
		$("#contentlist").append(this.listItem.split("@contentName").join(name).split("@number").join(number));

		this.initialiseSortable();
	},
	onSort: function(e, ui) {
		var sortedItem = ui.item.data("id"),
			itemList = $("#contentlist").children("li.sortable"),
			count = 0,
			movedItem,
			movedTo;

		itemList.each(function(i) {
			if ($(this).data("id") == sortedItem)
			{
				movedTo = i
				return false;
			}
			return true;
		});
		if (sortedItem != undefined && movedTo != undefined)
		{
			var movedContent = this.selectedScene.content[sortedItem];
       		this.selectedScene.content.splice(sortedItem, 1);
       		this.selectedScene.content.splice(movedTo, 0, movedContent);
       		this.populateContentList();
    	}
	},
	newTextObject: function() {
		var newObj = this.TextPanel.newTextObject(this.selectedScene);
		this.populateContentList();
		this.selectContent(newObj);
		WHIZZY.editor.Transformable.select(newObj);
	},
	newRectangle: function() {
		var newObj = this.RectanglePanel.newRectangle(this.selectedScene);
		this.populateContentList();
		this.selectContent(newObj);
		WHIZZY.editor.Transformable.select(newObj);
	},
	newArc: function() {
		var newObj = this.ArcPanel.newArc(this.selectedScene);
		this.populateContentList();
		this.selectContent(newObj);
		WHIZZY.editor.Transformable.select(newObj);
	},
	select: function(scene) {
		if(!scene) return;
		this.selectedScene = scene;
		if (scene.id != 0) {
			this.setTitle("Scene " + scene.id);
			$('#btn_deletescene').css("display", "block");
		}
		else {
			this.setTitle("Stage");
			$('#btn_deletescene').css("display", "none");
		}

		this.ToolPanel.select(scene);
		this.populateContentList();
		if(this.hidden && this.enabled) this.show();
	},
	selectContent: function(content) {
		if(!content) return;
		if(!this.selectedScene || this.selectedScene.id != content.parent)
		{
			this.SceneList.selectId(content.parent);
		}
		var id = this.getIdByContent(content);
		$("#contentlist").children("li.selected").removeClass("selected");
		$("#contentlist").children("li[data-id='"+id+"']").addClass("selected");
		this.ToolPanel.select(content);
		if(this.hidden && this.enabled) this.show();
	},
	selectContentId: function(id) {
		var entity = this.selectedScene.content[id];
		WHIZZY.editor.Transformable.select(entity);
		this.selectContent(entity);
	},
	getIdByContent: function(content) {
		for(var c in this.selectedScene.content)
		{
			if(content === this.selectedScene.content[c])
				return c;
		}
		return -1;
	},
	deselect: function() {
		this.hide();
		this.ToolPanel.deselect();
		$("#content-list").children("li.selected").removeClass("selected");
	},
	setTitle: function(title) {
		$("#scene-title").children("h4").text(title);
	},
	deleteScene: function() {
		if (!this.selectedScene) return;
		this.SceneList.deleteScene(this.selectedScene);
		this.selectedScene = undefined;
		this.hide();
	}
};
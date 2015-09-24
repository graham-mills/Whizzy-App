WHIZZY.namespace("editor.ScenePanel");

WHIZZY.editor.ScenePanel = {
	ToolPanel: undefined,
	selectedScene: undefined,
	strokeStyle: undefined,
	fillStyle: undefined,
	strokeWidth: 1,
	backgroundFixed: undefined,
	backgroundRepeat: undefined,
	initialise: function() {
		this.ToolPanel = WHIZZY.editor.ToolPanel;

		$("#btn_toolbgimage").click(function() {
			WHIZZY.editor.ScenePanel.bgImageClick();
		});

		$("#tool-bgimage-checkgroup").change(function() {
			WHIZZY.editor.ScenePanel.bgImageChange();
		});

		$("#btn_toolbgimageremove").click(function() {
			WHIZZY.editor.ScenePanel.removeBgImage();
		});
	},
	select: function(scene) {
		this.selectedScene = scene;
		this.fillStyle = scene.background.fillStyle;
		this.strokeStyle = scene.background.strokeStyle;
		this.backgroundFixed = this.selectedScene.background.fixed;
		this.backgroundRepeat = this.selectedScene.background.repeat;
		this.setControls();
	},
	setControls: function() {
		if (this.selectedScene.id == 0)
		{
			this.ToolPanel.setLabel("Stage");
			
		}
		else
		{
			this.ToolPanel.setLabel("Scene " + this.selectedScene.id);
			this.ToolPanel.showWidget("tool-stroke");
		}
		this.ToolPanel.showWidget("tool-fill");
		this.ToolPanel.showWidget("tool-bgimage");

		this.ToolPanel.setFill(this.fillStyle);
		this.ToolPanel.setStroke((this.strokeStyle == undefined ? "none" : this.strokeStyle));

		if (this.selectedScene.background.repeat)
		{
			$("#tool-bgimage-repeat").parent().addClass("active");
			$("#tool-bgimage-repeat").prop("checked", true);
		}
		else
		{
			$("#tool-bgimage-repeat").parent().removeClass("active");
			$("#tool-bgimage-repeat").prop("checked", false);
		}
		if (fixed = this.selectedScene.background.fixed)
		{
			$("#tool-bgimage-fixed").parent().addClass("active");
			$("#tool-bgimage-fixed").prop("checked", true);
		}
		else
		{
			$("#tool-bgimage-fixed").parent().removeClass("active");
			$("#tool-bgimage-fixed").prop("checked", false);
		}
		
	},
	bgImageClick: function() {
		$("#btn_imageselect").off("click");
		$("#btn_imageselect").click( function() {
			WHIZZY.editor.ScenePanel.addBgImage($(".image-select-img.active"));
		});
	},
	bgImageChange: function() {
		var repeat = $("#tool-bgimage-repeat").is(":checked"),
			fixed = $("#tool-bgimage-fixed").is(":checked");

		this.selectedScene.background.repeat = repeat;
		this.selectedScene.background.fixed = fixed;

		if (repeat)
			$("#tool-bgimage-repeat").parent().addClass("active");
		else $("#tool-bgimage-repeat").parent().removeClass("active");

		if (fixed)
			$("#tool-bgimage-fixed").parent().addClass("active");
		else $("#tool-bgimage-fixed").parent().removeClass("active");
	},
	addBgImage: function(activeElement) {
		var imageSource = activeElement.css("background-image"),
			scene = WHIZZY.editor.ContentPanel.selectedScene,
			width = activeElement.data("width"),
			height = activeElement.data("height"),
			filename = activeElement.data("name");

		imageSource = imageSource.substring(4, imageSource.length-1);
		var newImage = new Image();
		newImage.src = imageSource;

		scene.background.image = newImage;
		scene.background.imageSrc = imageSource;
		scene.background.imageX = width;
		scene.background.imageY = height;
	},
	removeBgImage: function() {
		if (!this.selectedScene) return;

		if (this.selectedScene.background.image)
		{
			this.selectedScene.background.image = undefined;
			this.selectedScene.background.imageSrc = undefined;
			this.selectedScene.background.imageX = undefined;
			this.selectedScene.background.imageY = undefined;
			this.selectedScene.background.imageRepeat = undefined;
		}
	},
	setFill: function(hex) {
		if (!this.selectedScene) return;
		this.fillStyle = hex;
		this.selectedScene.background.fillStyle = hex;
	},
	setStroke: function(hex) {
		if (!this.selectedScene) return;
		this.strokeStyle = hex;
		this.selectedScene.background.strokeStyle = hex;
	},
	setStrokeWidth: function(width) {
		if (!this.selectedScene) return;
		this.strokeWidth = width;
		this.selectedScene.background.lineWidth = width;
	},
};
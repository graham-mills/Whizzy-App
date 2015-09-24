WHIZZY.namespace("editor.ImagePanel");

WHIZZY.editor.ImagePanel = { 
	ToolPanel: undefined,
	ImageObject: undefined,
	selectedImage: undefined,
	strokeStyle: undefined,
	strokeWidth: undefined,
	selectLabel: $("#image-select-label"),
	initialise: function() {
		this.ToolPanel = WHIZZY.editor.ToolPanel;
		this.ImageObject = WHIZZY.modules.ImageObject;

		// Ajax image upload
		$("#image-upload-form").on("submit", (function (e) {
			e.preventDefault();
			var formData = new FormData(this);
			$.ajax({
				url: "/Editor/ImageUpload",
				data: formData,
				type: "POST",
				cache: false,
				contentType: false,
				processData: false,
				success: function (partial) {
					$("#image-select-modal").html(partial);
					WHIZZY.editor.ImagePanel.reset();
					$(".image-select-img").last().addClass("active");
				}
			});
		}));

		this.reset();
	},
	reset: function() {
		$('[data-toggle="tooltip"]').tooltip();

		$(".image-select-img").click(function () {
			WHIZZY.editor.ImagePanel.selectImage($(this).data("name"), $(this).data("id"));
		});

		$("#btn_imageselect").off("click");
		$("#btn_imageselect").click( function() {
			WHIZZY.editor.ImagePanel.addNewImage($(".image-select-img.active"));
		});

		$(".btn_imagedelete").click( function() {
			WHIZZY.editor.ImagePanel.deleteImage($(this).parent().parent().data("id"));
		});
	},
	selectImage: function(imageName, imageId) {
		$(".image-select-img").removeClass("active");
		$(".image-select-img[data-id='"+imageId+"']").addClass("active");
		this.selectLabel.text(imageName);
	},
	deleteImage: function(imageId) {
		var presentationId = $("#presentationId").val();
		$.ajax({
				url: "/Editor/ImageDelete",
				type: "GET",
				data: { imageId: imageId, presentationId: presentationId},
				success: function () {
					$('.image-select-img[data-id="'+ imageId+ '"]').remove();
					WHIZZY.editor.ImagePanel.selectLabel.text("");
				}
			});
	},
	addNewImage: function(activeElement) {
		var imageSource = activeElement.css("background-image"),
			scene = WHIZZY.editor.ContentPanel.selectedScene,
			width = activeElement.data("width"),
			height = activeElement.data("height");

		//imageSource = imageSource.substring(4, imageSource.length-1);
		var imageSourceParts = imageSource.split('/');
		imageSource = imageSourceParts[imageSourceParts.length-1];
		
		var newImage = new this.ImageObject({
			imageSrc: imageSource,
			position: new WHIZZY.modules.Vector(0,0),
			parent: WHIZZY.editor.ContentPanel.selectedScene.id,
			scale: 1,
			rotation: 0,
			size: {x: width, y:height}
		});

		scene.addObject(newImage);
		return newImage;
	},
	select: function(object) {
		this.selectedImage = object;
		this.strokeStyle = object.strokeStyle;
		this.strokeWidth = object.lineWidth;

		this.setControls();
	},
	setControls: function() {
		this.ToolPanel.showWidget("tool-image");
		this.ToolPanel.showWidget("tool-stroke");
	}

};
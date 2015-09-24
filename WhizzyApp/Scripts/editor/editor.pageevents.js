WHIZZY.namespace("editor.PageEvents");

WHIZZY.editor.PageEvents = {
	modalOpen: false,
    menuOpen: false,
    panelView: "presentation",
	initialise: function()
	{
		$('.togglepanels').click(function () {
            WHIZZY.editor.PageEvents.togglePanels($(this).data("id"));
        });

		// Canvas interactions
		document.addEventListener('sceneClicked', function(event) {
			WHIZZY.editor.PageEvents.sceneClicked(event.detail);
            console.log("Scene selected");
		}, false);

		document.addEventListener('stageClicked', function(event) {
			WHIZZY.editor.PageEvents.stageClicked(event.detail);
            console.log("Stage selected");
		}, false);

		document.addEventListener('contentClicked', function(event) {
			WHIZZY.editor.PageEvents.contentClicked(event.detail);
            console.log("Entity selected");
		}, false);

        document.addEventListener('nodeClicked', function(event) {
            WHIZZY.editor.PageEvents.nodeClicked(event.detail);
            console.log("Node selected");
        }, false);

        document.addEventListener("animationClicked", function(event) {
            WHIZZY.editor.PageEvents.animationClicked(event.detail);
            console.log("Animation selected");
        }, false);

		// Modal detect
		$(".modal").on("hidden.bs.modal", function() {
			WHIZZY.editor.PageEvents.modalOpen = false;
            console.log("Modal closed");
		});

		$(".modal").on("show.bs.modal", function() {
			WHIZZY.editor.PageEvents.modalOpen = true;
            console.log("Modal opened");
		});

		$(".dropdown-menu").parent().on("show.bs.dropdown", function() {
			WHIZZY.editor.PageEvents.menuOpen = true;
		});

		$(".dropdown-menu").parent().on("hide.bs.dropdown", function() {
			WHIZZY.editor.PageEvents.menuOpen = false;
		});
	},
    sceneClicked: function(scene) {
        WHIZZY.editor.Transformable.select(scene);
        WHIZZY.editor.SceneList.select(scene);
        WHIZZY.editor.ActionList.select(scene);
    },
    stageClicked: function(stage) {
        WHIZZY.editor.Transformable.deselect();
        WHIZZY.editor.ActionList.deselect();
        WHIZZY.editor.SceneList.deselect();
    },
    contentClicked: function(object) {
        WHIZZY.editor.Transformable.select(object);
        WHIZZY.editor.ContentPanel.selectContent(object);
        WHIZZY.editor.ActionList.select(object);
    },
    nodeClicked: function(object) {
        WHIZZY.editor.Transformable.select(object);
        if (this.panelView == "transitions") WHIZZY.editor.ActionList.select(object);
    },
    animationClicked: function(animation) {
        WHIZZY.editor.Transformable.select(animation);
        if (this.panelView == "transitions") WHIZZY.editor.ActionList.select(animation);
    },
    togglePanels: function(page) {
        WHIZZY.editor.ActionList.hide();
        WHIZZY.editor.ActionPanel.hide();
        WHIZZY.editor.SceneList.hide();
        WHIZZY.editor.ContentPanel.hide();
        WHIZZY.editor.ToolPanel.hide();
        WHIZZY.editor.SettingsPanel.hide();
        WHIZZY.editor.Transformable.deselect();

        WHIZZY.editor.ActionList.enabled = false;
        WHIZZY.editor.ActionPanel.enabled = false;
        WHIZZY.editor.ContentPanel.enabled = false;
        WHIZZY.editor.ToolPanel.enabled = false;

        switch(page)
        {
            case "content":
                WHIZZY.editor.SceneList.show();
                WHIZZY.editor.ContentPanel.enabled = true;
                WHIZZY.editor.ToolPanel.enabled = true;
            break;
            case "transitions":
                WHIZZY.editor.ActionList.show();
                WHIZZY.editor.ActionList.enabled = true;
                WHIZZY.editor.ActionPanel.enabled = true;
            break;
            case "presentation":
                WHIZZY.editor.SettingsPanel.show();
            default:
            break;
        }

        $(".togglepanels").removeClass("active");
        $(".togglepanels[data-id='"+page+"']").addClass("active");
        this.panelView = page;
    },
    disableMouse: function() {
        if(this.modalOpen || this.menuOpen) return true;
        else return false;
    }
};
WHIZZY.namespace("editor.SettingsPanel");

WHIZZY.editor.SettingsPanel = {
	initialise: function() {
		if(WHIZZY.json.Shared != undefined) $("#presentation-shared").prop("checked", WHIZZY.json.Shared);
        if(WHIZZY.json.TOGGLE_SIZE != undefined) $("#presentation-fullscreen").prop("checked", !(WHIZZY.json.TOGGLE_SIZE));
        if(WHIZZY.json.PB_DISABLED != undefined) $("#presentation-progressbar").prop("checked", WHIZZY.json.PB_DISABLED);
        if(WHIZZY.json.CONTROLS_DISABLED != undefined) $("#presentation-controls").prop("checked");
        if(WHIZZY.json.IMAGE_PATH != undefined) $("#presentation-imagepath").val(WHIZZY.json.IMAGE_PATH);
        if(WHIZZY.json.WIDTH != undefined) $("#presentation-canvaswidth").val(WHIZZY.json.WIDTH);
	},

	show: function() {
		$("#panel-presentation-1").css("display", "block");
		$("#panel-presentation-2").css("display", "block");
	},

	hide: function() {
		$("#panel-presentation-1").css("display", "none");
		$("#panel-presentation-2").css("display", "none");
	}
};
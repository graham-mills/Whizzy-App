WHIZZY.namespace("editor.Alert");

WHIZZY.editor.Alert = {
	alertPanel: undefined,
	alertText: undefined,
	visible: false,
	initialise: function() {
		this.alertPanel = $("#alert");
		this.alertText = $("p").parent("#alert");
	},
	alert: function(text) {
		this.alertText.text = text;
		if (!this.visible) this.showPanel();
	}
};
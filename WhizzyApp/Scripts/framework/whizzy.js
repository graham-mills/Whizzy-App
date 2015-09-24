// A Whizzy Presentation Medium //
// Author: Graham Mills         //
// Version: 1.1					//
var WHIZZY = WHIZZY || {};
// Namespacing function
WHIZZY.namespace = function (namespacePath) {
	var parts = namespacePath.split('.'),
		parent = WHIZZY,
		i;

		for (i = 0; i < parts.length; ++i)
		{
			if (typeof parent[parts[i]] === "undefined")
			{
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parent;
};

WHIZZY.namespace("settings");
WHIZZY.namespace("settings.Presentation");
WHIZZY.settings.APP_NAME = "whizzy";
WHIZZY.settings.ASPECT_RATIO = 16/9;
WHIZZY.settings.SCENE_RATIO = 4/3;
WHIZZY.settings.FPS = 30;
WHIZZY.settings.MAX_ZOOM = 500;
WHIZZY.settings.DEBUG = false;
WHIZZY.settings.WIDTH = parseInt(document.getElementById(WHIZZY.settings.APP_NAME).getAttribute("width")) || 800;
WHIZZY.settings.ICON_SIZE = 26;
WHIZZY.settings.HOVER_STROKE = "cyan";
WHIZZY.settings.HOVER_WIDTH = 4;
WHIZZY.settings.HOVER_SHADOW = "rgba(0,0,0, 0.75)";
WHIZZY.settings.HOVER_BLUR = 10;
WHIZZY.settings.CLICK_DURATION = Math.round(WHIZZY.settings.FPS/4);
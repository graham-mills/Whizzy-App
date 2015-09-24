WHIZZY.namespace("editor.main");
WHIZZY.editor.main = {
    Components: [   
                    WHIZZY.editor.Transformable,
                    WHIZZY.editor.Framework,
                    WHIZZY.editor.PageEvents,
                    WHIZZY.editor.ContentPanel,
                    WHIZZY.editor.ScenePanel,
                    WHIZZY.editor.TextPanel,
                    WHIZZY.editor.ToolPanel,
                    WHIZZY.editor.TextEditor,
                    WHIZZY.editor.RectanglePanel,
                    WHIZZY.editor.ArcPanel,
                    WHIZZY.editor.ImagePanel,
                    WHIZZY.editor.ActionList,
                    WHIZZY.editor.ActionPanel,
                    WHIZZY.editor.SceneList,
                    WHIZZY.editor.SettingsPanel
                ],
    then: undefined,
    initialise: function() {
        for(var c in this.Components)
        {
            this.Components[c].initialise();
        }

        // Spectrum.js Colour Picker
        $("#colour-picker").spectrum({
            showAlpha: false,
            flat: true,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: 'hex',
            containerClassName: 'colour-picker'
        });

        // Bootstrap Tooltips
        $('[data-toggle="tooltip"]').tooltip();

        $("#preview").click(function () {
            WHIZZY.editor.Framework.save();
        });
        $("#btn_export").click(function () {
            WHIZZY.editor.Framework.save();
        });

        this.then = Date.now();
    },
    update: function() {
        var now = Date.now(),
            elapsedTime = Date.now() - this.then;
        if(elapsedTime > WHIZZY.editor.settings.SAVE_FREQUENCY)
        {
            this.then = now;
            WHIZZY.editor.Framework.save();
        }
    },
    draw: function(context) {
        WHIZZY.editor.ActionList.draw(context);
        WHIZZY.editor.Transformable.draw(context);
    },
    mouseDown: function(mouse) {
        WHIZZY.editor.Transformable.mouseDown(mouse);
    },
    mouseUp: function() {
        WHIZZY.editor.Transformable.mouseUp();
    },
    mouseHover: function(mouse) {
        var hoveredEntities = [];
        hoveredEntities = hoveredEntities.concat(WHIZZY.editor.ActionList.mouseHover(mouse));
        hoveredEntities = hoveredEntities.concat(WHIZZY.editor.Transformable.mouseHover(mouse));
        return hoveredEntities;
    }
};

WHIZZY.namespace("editor.settings");
WHIZZY.editor.settings = {
    MAX_STROKE_WIDTH: 100,
    MIN_STROKE_WIDTH: 1,
    MAX_FONT_SIZE: 400,
    MIN_FONT_SIZE: 5,
    SCENE_HEIGHT: 450,
    SCENE_SCALE_DIFFERENCE: 0.1, // Scale out by this for scene overview
    MIN_SCALE: 0.01,
    RESIZING_LIMIT: 10, // Pixels
    LABEL_FONT: "15px Arial",
    DEFAULT_FONT: "15px Arial",
    BULLET_POINT: "•",
    EYE_ICON: "Content/img/eye.png",
    SAVE_FREQUENCY: 30000, // (30 sec) 1000ms to 1sec,
    DOUBLE_CLICK_DURATION: 500
};
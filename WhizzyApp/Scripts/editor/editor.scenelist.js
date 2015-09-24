WHIZZY.namespace("editor.SceneList");
WHIZZY.editor.SceneList = {
    Stage: undefined,
    Camera: undefined,
    Scene: undefined,
    selectedScene: undefined,
    scenes: [],
    listItem: "<li class='sortable select-scene sortlist-item' data-id='@id'><span class='glyphicon glyphicon-menu-hamburger'></span>Scene @id</li>",
    initialise: function () 
    {
        this.Stage = WHIZZY.modules.Stage;
        this.Camera = WHIZZY.modules.Camera;
        this.Scene = WHIZZY.modules.Scene;
        this.scenes = this.Stage.scenes;
        this.populateList();

        $("#btn_addscene").click(function() {
            WHIZZY.editor.SceneList.createScene();
        });

        $(".select-scene[data-id='0']").click(function (event) {
            WHIZZY.editor.SceneList.selectId(0);
        });
    },
    show: function() {
        $("#panel-content-1").css("display", "block");
    },
    hide: function() {
        $("#panel-content-1").css("display", "none");
    },
    addSortable: function(id) {
        $("#scenelist").sortable({
            appendTo: "parent",
            axis: "y",
            tolerance: "pointer",
            containment: "parent",
            cursor: "move",
            distance: 5,
            placeholder: "placeholder",
            items: ".sortable",
            stop: function() { WHIZZY.editor.SceneList.onSort();}
        });

        $(".select-scene[data-id='"+id+"']").click(function (event) {
            WHIZZY.editor.SceneList.selectId($(this).data("id"));
        });
    },
    populateList: function() {
        for(var i in this.scenes)
        {
            if (i == 0) continue; // Skip stage scene
            this.addSceneEnd(this.listItem.split("@id").join(this.scenes[i].id));
            this.addSortable(this.scenes[i].id);
        }
    },
    selectId: function(id) {
        var scene = WHIZZY.editor.Framework.findObjectById(this.scenes, id);
        WHIZZY.editor.Transformable.select(scene);
        this.select(scene);
    },
    select: function (scene) {
        if (!scene) return;
        this.deselect();
        $(".select-scene[data-id='"+scene.id+"']").addClass("selected");
        this.selectedScene = scene;
        WHIZZY.editor.ContentPanel.select(scene);
        WHIZZY.editor.ToolPanel.select(scene);
    },
    deselect: function() {
        this.selectedScene = undefined;
        $(".select-scene.selected").removeClass("selected");
        WHIZZY.editor.ContentPanel.deselect();
    },
    createScene: function() {
        var id = WHIZZY.editor.Framework.findFreeId(this.scenes);
        this.Stage.addScene({
                id: id,
                position: this.Camera.position.copy(),
                scale: this.Camera.scale,
                rotation: this.Camera.rotation,
                background_params: {
                    fillStyle: "navy",
                    lineWidth: 4
                }
        });

        this.addListItem(this.listItem.split("@id").join(id));
        this.addSortable(id);
        this.selectId(id);
    },
    addListItem: function(listItem) {
        if (this.selectedScene === undefined) // Insert at end
            this.addSceneEnd(listItem);
        else if (this.selectedScene.id == 0) // Insert at end
           this.addSceneEnd(listItem);
        else // Insert after selected
            this.addSceneAfter(listItem);
    },
    addSceneStart: function(listItem) {
        $("#scenelist").prepend(listItem);
    },
    addSceneEnd: function(listItem) {
        $("#scenelist").append(listItem);
    },
    addSceneAfter: function(listItem) {
        $(".select-scene[data-id='"+this.selectedScene.id+"']").after(listItem);
    },
    onSort: function() {
        // Get list item ids
        var sortedIds = $("#scenelist").sortable( "toArray", { attribute: "data-id"} );
        if(sortedIds.length <= 1) return;

        this.sortScenes(sortedIds);
    },
    sortScenes: function(sortedIds) {
        var sortedScenes = [];
        sortedScenes.push(this.scenes[0]); // Add stage scene to new array
        for(var i in sortedIds)
        {
            var s = WHIZZY.editor.Framework.findObjectById(this.scenes, sortedIds[i]);
            sortedScenes.push(s);
        }
        // Set old array to new sorted array
        this.Stage.scenes = sortedScenes;
    },
    deleteScene: function(scene) {
        WHIZZY.editor.Transformable.deselect();
        var listItem = $(".select-scene[data-id='"+scene.id+"']");
            previousScene = listItem.prev();
        listItem.remove();

        //Select previous scene, otherwise select stage
        if(previousScene.size() == 0)
            this.select(this.scenes[0]);
        else this.selectId(previousScene.data("id"));

        this.Stage.scenes.splice(this.Stage.scenes.indexOf(scene), 1);
    }
}
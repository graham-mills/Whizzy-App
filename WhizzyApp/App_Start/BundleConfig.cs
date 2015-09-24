using System.Web;
using System.Web.Optimization;

namespace WhizzyApp
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-1.11.2.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/framework").Include(
                        "~/Scripts/framework/whizzy.js",
                        "~/Scripts/framework/utilities.debugger.js",
                        "~/Scripts/framework/modules.vector.js",
                        "~/Scripts/framework/modules.camera.js",
                        "~/Scripts/framework/modules.animation.js",
                        "~/Scripts/framework/modules.transition.js",
                        "~/Scripts/framework/modules.background.js",
                        "~/Scripts/framework/modules.entity.js",
                        "~/Scripts/framework/modules.shapes.js",
                        "~/Scripts/framework/modules.imageobject.js",
                        "~/Scripts/framework/modules.textobject.js",
                        "~/Scripts/framework/modules.canvas.js",
                        "~/Scripts/framework/modules.scene.js",
                        "~/Scripts/framework/modules.stage.js",
                        "~/Scripts/framework/modules.camera.js",
                        "~/Scripts/framework/modules.drawing.js",
                        "~/Scripts/framework/utilities.drawtool.js",
                        "~/Scripts/framework/modules.button.js",
                        "~/Scripts/framework/utilities.progressbar.js",
                        "~/Scripts/framework/utilities.controls.js",
                        "~/Scripts/framework/modules.animation.js",
                        "~/Scripts/framework/modules.transition.js",
                        "~/Scripts/framework/utilities.actionqueue.js",
                        "~/Scripts/framework/utilities.inputhandler.js",
                        "~/Scripts/framework/utilities.eventhandler.js",
                        "~/Scripts/framework/main.js"));

            bundles.Add(new ScriptBundle("~/bundles/editor").Include(
                         "~/Scripts/editor/spectrum.js",

                        "~/Scripts/framework/whizzy.js",
                        "~/Scripts/framework/utilities.debugger.js",
                        "~/Scripts/framework/modules.vector.js",
                        "~/Scripts/framework/modules.camera.js",
                        "~/Scripts/framework/modules.animation.js",
                        "~/Scripts/framework/modules.transition.js",
                        "~/Scripts/framework/modules.background.js",
                        "~/Scripts/framework/modules.entity.js",
                        "~/Scripts/framework/modules.shapes.js",
                        "~/Scripts/framework/modules.imageobject.js",
                        "~/Scripts/framework/modules.textobject.js",
                        "~/Scripts/framework/modules.canvas.js",
                        "~/Scripts/framework/modules.scene.js",
                        "~/Scripts/framework/modules.stage.js", 
                        "~/Scripts/framework/utilities.actionqueue.js",
                        "~/Scripts/framework/utilities.inputhandler.js",
                        "~/Scripts/framework/utilities.eventhandler.js",

                        "~/Scripts/editor/editor.theme.js",
                        "~/Scripts/editor/editor.texteditor.js",
                        "~/Scripts/editor/editor.textpanel.js",
                        "~/Scripts/editor/editor.toolpanel.js",
                        "~/Scripts/editor/editor.imagepanel.js",
                        "~/Scripts/editor/editor.scenepanel.js",
                        "~/Scripts/editor/editor.rectanglepanel.js",
                        "~/Scripts/editor/editor.arcpanel.js",
                        "~/Scripts/editor/editor.transformable.js",
                        "~/Scripts/editor/editor.actionpanel.js",
                        "~/Scripts/editor/editor.actionlist.js",
                        "~/Scripts/editor/editor.scenelist.js",
                        "~/Scripts/editor/editor.contentpanel.js",
                        "~/Scripts/editor/editor.settingspanel.js",
                        "~/Scripts/editor/editor.framework.js",
                        "~/Scripts/editor/editor.pageevents.js",
                        "~/Scripts/editor/editor.js",
                        "~/Scripts/framework/main.js"));

            bundles.Add(new ScriptBundle("~/bundles/testing").Include(
                        "~/Scripts/testing/qunit-1.17.1",
                        "~/Scripts/testing/framework-tests.js",

                        "~/Scripts/framework/whizzy.js",
                        "~/Scripts/framework/utilities.debugger.js",
                        "~/Scripts/framework/modules.vector.js",
                        "~/Scripts/framework/modules.camera.js",
                        "~/Scripts/framework/modules.animation.js",
                        "~/Scripts/framework/modules.transition.js",
                        "~/Scripts/framework/modules.background.js",
                        "~/Scripts/framework/modules.entity.js",
                        "~/Scripts/framework/modules.shapes.js",
                        "~/Scripts/framework/modules.imageobject.js",
                        "~/Scripts/framework/modules.textobject.js",
                        "~/Scripts/framework/modules.canvas.js",
                        "~/Scripts/framework/modules.scene.js",
                        "~/Scripts/framework/modules.stage.js",
                        "~/Scripts/framework/utilities.actionqueue.js",
                        "~/Scripts/framework/utilities.inputhandler.js",
                        "~/Scripts/framework/utilities.eventhandler.js",

                        "~/Scripts/editor/editor.theme.js",
                        "~/Scripts/editor/editor.alert.js",
                        "~/Scripts/editor/editor.texteditor.js",
                        "~/Scripts/editor/editor.textpanel.js",
                        "~/Scripts/editor/editor.toolpanel.js",
                        "~/Scripts/editor/editor.imagepanel.js",
                        "~/Scripts/editor/editor.scenepanel.js",
                        "~/Scripts/editor/editor.rectanglepanel.js",
                        "~/Scripts/editor/editor.arcpanel.js",
                        "~/Scripts/editor/editor.transformable.js",
                        "~/Scripts/editor/editor.actionpanel.js",
                        "~/Scripts/editor/editor.actionlist.js",
                        "~/Scripts/editor/editor.scenelist.js",
                        "~/Scripts/editor/editor.contentpanel.js",
                        "~/Scripts/editor/editor.framework.js",
                        "~/Scripts/editor/editor.pageevents.js",
                        "~/Scripts/editor/editor.js"

                ));



            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap.css",
                                                                 "~/Content/bootstrap-theme.css",
                                                                 "~/Content/whizzy.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}
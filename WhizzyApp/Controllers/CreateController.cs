using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Script.Serialization;
using WhizzyApp.Models;

namespace WhizzyApp.Controllers
{
    public class CreateController : Controller
    {
        //
        // GET: /Create/

        [Authorize]
        [HttpGet]
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                List<Models.Presentation> presentations = Presentation.GetUserPresentations(User.Identity.Name);
                return View(presentations);
            }
            else return RedirectToAction("Login", "User");
        }

        [Authorize]
        [HttpPost]
        public ActionResult New(string title)
        {
            Models.Presentation presentation = Presentation.CreatePresentation(title, User.Identity.Name);
            UserData.CreatePresentationDirectory(Server, presentation.Author, presentation.URL);
            Session.Add("Presentation", presentation);
            return RedirectToAction("Index", "Editor");
        }

        [Authorize]
        [HttpGet]
        public ActionResult Open(int id)
        {
            Presentation presentation = Presentation.GetPresentation(id);
            Session.Add("Presentation", presentation);
            return RedirectToAction("Index", "Editor");
        }

        [Authorize]
        [HttpDelete]
        public void Delete(int id)
        {
            Presentation p = Presentation.GetPresentation(id);
            p.DeletePresentation(Server);
            UserData.DeletePresentationDirectory(Server, p.Author, p.URL);
        }

    }
}

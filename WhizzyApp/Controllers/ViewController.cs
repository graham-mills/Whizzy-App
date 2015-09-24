using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WhizzyApp.Models;

namespace WhizzyApp.Controllers
{
    public class ViewController : Controller
    {
        //
        // GET: /View/

        [HttpGet]
        public ActionResult Index(string p)
        {
            Presentation presentation = Presentation.GetPresentation(p);
            ViewBag.UserOwned = false;
            if (User.Identity.IsAuthenticated)
            {
                int user = Models.User.GetUser(User.Identity.Name).Id;
                if (presentation.Author == user)
                {
                    ViewBag.UserOwned = true;
                }
            }
            return View(presentation);
        }

    }
}

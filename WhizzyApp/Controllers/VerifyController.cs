using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WhizzyApp.Models;

namespace WhizzyApp.Controllers
{
    public class VerifyController : Controller
    {
        //
        // GET: /Verify/

        public ActionResult Index()
        {
            return RedirectToAction("Index", "Home");
        }

        public ActionResult Sent(string user)
        {
            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.user = user;
            return View();
        }

        public ActionResult Confirm(string token)
        {
            if (token != null)
            {
                if (Models.User.VerifyAccount(token))
                {
                    ViewBag.confirmed = true;
                    return View();
                }
                else
                {
                    ViewBag.confirmed = false;
                    return View();
                }
            }
            return RedirectToAction("Index", "Home");
        }

        public ActionResult Resend(string user)
        {
            string url = Request.Url.Scheme + "://" + Request.Url.Host
                            + (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port);
            Email.ResendVerification(user, url);
            return RedirectToAction("Sent", "Verify", new { user = user });
        }

    }
}

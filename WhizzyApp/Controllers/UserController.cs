using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using WebMatrix.WebData;
using WhizzyApp.Models;

namespace WhizzyApp.Controllers
{
    public class UserController : Controller
    {
        //
        // GET: /User/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public ActionResult Login(string ReturnUrl)
        {
            ViewBag.returnUrl = ReturnUrl;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Models.LoginModel user, string returnUrl)
        {
            if (ModelState.IsValid && user.IsValid())
            {

                if (user.IsVerified())
                {
                    FormsAuthentication.SetAuthCookie(user.EmailAddress, user.RememberMe);
                    if (Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    return RedirectToAction("Unverified", "User", new RouteValueDictionary(user));
                }
            }
            else
            {
                ModelState.AddModelError("modelerror", "Incorrect Email/Password combination");
            }

            return View(user);
        }

        public ActionResult Unverified(Models.LoginModel user)
        {
            ViewBag.unverifiedLogin = true;
            ViewBag.userEmail = user.EmailAddress;
            return View();
        }

        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Register(Models.RegisterModel user)
        {
            User newUser;
            if (ModelState.IsValid)
            {
                if (user.IsValid())
                {
                    if ((newUser = Models.User.CreateAccount(user.EmailAddress, user.Password)) != null)
                    {

                        UserData.CreateUserDirectory(Server, newUser.Id);
                        string url = Request.Url.Scheme + "://" + Request.Url.Host
                            + (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port);
                        string token = newUser.VerificationCode;
                        Email.SendVerification(user.EmailAddress, token, url);
                        return RedirectToAction("Sent", "Verify", new { user = user.EmailAddress });
                    }
                    else
                    {
                        ModelState.AddModelError("failed", "There was an error during account creation");
                    }
                }
                else
                {
                    ModelState.AddModelError("EmailAddress", "User email already exists");
                }
            }
            return View(user);
        }

    }
}

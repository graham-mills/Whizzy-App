using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WhizzyApp.Models;

namespace WhizzyApp.Controllers
{
    public class EditorController : Controller
    {
        //
        // GET: /Editor/

        public ActionResult Index()
        {
            Models.Presentation presentation = (Models.Presentation)Session["Presentation"];
           
            return View(presentation);
        }

        [Authorize]
        [HttpGet]
        public PartialViewResult ToggleLeftPanel(string page)
        {
            switch (page)
            {
                case "content":
                    return PartialView("_Edit_Content_1");
                case "transitions":
                    return PartialView("_Edit_Transitions_1");
                case "presentation":
                    return PartialView("_Edit_Presentation_1");
            }
            throw new Exception();
        }

        [Authorize]
        [HttpGet]
        public PartialViewResult ToggleRightPanel(string page)
        {
            switch (page)
            {
                case "content":
                    return PartialView("_Edit_Content_2");
                case "transitions":
                    return PartialView("_Edit_Transitions_2");
                case "presentation":
                    return PartialView("_Edit_Presentation_2");
            }
            throw new Exception();
        }

        [HttpPost]
        public PartialViewResult ImageUpload(int presentationId, HttpPostedFileBase image)
        {
            Presentation p = Presentation.GetPresentation(presentationId);
            if (image != null && Image.IsValid(image))
            {
                Image newImage = Image.AddImage(image, p);
                UserData.AddImageToPresentation(image, Server, p, newImage);
                p.Images.Add(newImage);
            }
            return PartialView("_Images", p);
        }

        [HttpGet]
        public void ImageDelete(int imageId, int presentationId)
        {
            UserData.DeleteImage(Server, imageId, Presentation.GetPresentation(presentationId));
            Image.DeleteImage(imageId);
        }

        [HttpPost]
        public HttpStatusCode Save()
        {
            int id = 0;
            HttpRequestBase resolveRequest = HttpContext.Request;
            resolveRequest.InputStream.Seek(0, SeekOrigin.Begin);
            string jsonString = new StreamReader(resolveRequest.InputStream).ReadToEnd();
            JObject json = JObject.Parse(jsonString);
            id = (int)json["Id"];
            if (id > 0)
            {
                Presentation p = Presentation.GetPresentation(id);
                p.Title = json["Title"].ToString();
                p.Shared = (bool)json["Shared"];
                p.JSON = jsonString;
                if (p.JSON != jsonString) p.Modified = DateTime.Now;
                if (p.Save())
                {
                    Session["Presentation"] = p;
                    return HttpStatusCode.OK;
                }
            }
            return HttpStatusCode.InternalServerError;
        }

        [HttpGet]
        public ActionResult Download(int id)
        {
            Presentation p = Presentation.GetPresentation(id);
            string zipFile = p.GetFiles(Server);
            return File(zipFile, "application/zip", "Presentation.zip");
        }
    }
}

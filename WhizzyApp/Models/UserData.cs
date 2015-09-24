using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace WhizzyApp.Models
{
    public class UserData
    {
        private const string userDataPath = "~/Content/User_Data/";

        public static void CreateUserDirectory(HttpServerUtilityBase Server, int userId)
        {
            string path = userDataPath + "u" + userId;
            string mapPath = Server.MapPath(path);
            Directory.CreateDirectory(mapPath);
        }

        public static void CreatePresentationDirectory(HttpServerUtilityBase Server, int userId, string pUrl)
        {
            string presentationPath = Server.MapPath(GetPresentationFolderPath(userId, pUrl));
            Directory.CreateDirectory(presentationPath);
            Directory.CreateDirectory(presentationPath+"img/");
            Directory.CreateDirectory(presentationPath+"js/");
        }

        public static void DeletePresentationDirectory(HttpServerUtilityBase Server, int userId, string pUrl)
        {
            string presentationPath = Server.MapPath(GetPresentationFolderPath(userId, pUrl));
            Directory.Delete(presentationPath, true);
        }

        public static string GetPresentationFolderPath(int userId, string pUrl)
        {
            return userDataPath + "u" + userId + "/p" + pUrl + "/" ;
        }

        public static void AddImageToPresentation(HttpPostedFileBase imageFile, HttpServerUtilityBase Server, Presentation presentation, Image image)
        {
            string filePath = Server.MapPath(GetImagePath(presentation, image));
            imageFile.SaveAs(filePath);
        }

        public static string GetImagePath(Presentation presentation, Image image)
        {
            return GetPresentationFolderPath(presentation.Author, presentation.URL) + "img/image" + image.Id + image.Extension;
        }

        public static void DeleteImage(HttpServerUtilityBase Server, int imageId, Presentation presentation)
        {
            Image matchedImage = presentation.Images.Find(i => i.Id == imageId);
            string mapPath = Server.MapPath(GetImagePath(presentation, matchedImage));
            File.Delete(mapPath);
        }
    }
}
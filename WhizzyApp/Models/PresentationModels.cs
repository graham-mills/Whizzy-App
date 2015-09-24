using Ionic.Zip;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace WhizzyApp.Models
{
    public class PresentationModels : DbContext
    {
        public PresentationModels()
            : base("WhizzyDatabase")
        {
        }

        public DbSet<Presentation> Presentations { get; set; }
    }

    [Table("Presentations")]
    public class Presentation
    {
        public int Id;
        public int Author;
        public string Title;

        public string URL;
        public bool Shared;

        public string Filepath;
        public string JSON;
        public DateTime Modified;

        public List<Image> Images;

        public static Presentation CreatePresentation(string title, string user)
        {
            Presentation newPresentation = new Presentation();
            newPresentation.Images = new List<Image>();
            newPresentation.Author = Models.User.GetUser(user).Id;
            newPresentation.URL = Helpers.Token.Generate(8);
            newPresentation.Shared = false;
            newPresentation.Title = title;
            newPresentation.JSON = GetBlankJSON();
            newPresentation.Modified = DateTime.Now;
            newPresentation.Filepath = UserData.GetPresentationFolderPath(newPresentation.Author, newPresentation.URL);

            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string insertQuery = @"INSERT INTO [dbo].[Presentations] ([Author], [Title], [URL], [Shared], [Filepath], [JSON], [Modified]) OUTPUT INSERTED.[Id] VALUES (@author, @title, @url, @shared, @filepath, @json, @time)";
                SqlCommand cmd = new SqlCommand(insertQuery, con);
                cmd.Parameters.Add(new SqlParameter("@author", SqlDbType.Int)).Value = newPresentation.Author;
                cmd.Parameters.Add(new SqlParameter("@title", SqlDbType.NVarChar)).Value = newPresentation.Title;
                cmd.Parameters.Add(new SqlParameter("@url", SqlDbType.NVarChar)).Value = newPresentation.URL;
                cmd.Parameters.Add(new SqlParameter("@shared", SqlDbType.Bit)).Value = newPresentation.Shared;
                cmd.Parameters.Add(new SqlParameter("@filepath", SqlDbType.NVarChar)).Value = newPresentation.Filepath;
                cmd.Parameters.Add(new SqlParameter("@json", SqlDbType.NVarChar)).Value = newPresentation.JSON;
                cmd.Parameters.Add(new SqlParameter("@time", SqlDbType.DateTime)).Value = newPresentation.Modified;

                con.Open();
                newPresentation.Id = (int)cmd.ExecuteScalar();
                cmd.Dispose();
                if (newPresentation.Id != 0)
                    return newPresentation;
                else return null;
            }
        }

        public static Presentation GetPresentation(int presentationId)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            Presentation presentation = new Presentation();
            presentation.Id = presentationId;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT * FROM [dbo].[Presentations] WHERE [Id] = @pId";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add("@pId", SqlDbType.Int).Value = presentation.Id;
                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    reader.Read();
                    presentation.Author = (int)reader["Author"];
                    presentation.Title = reader["Title"].ToString();
                    presentation.URL = reader["URL"].ToString();
                    presentation.Shared = (bool)reader["Shared"];
                    presentation.Filepath = reader["Filepath"].ToString();
                    presentation.JSON = reader["JSON"].ToString();
                    presentation.Modified = DateTime.Parse(reader["Modified"].ToString());
                    presentation.Images = Image.GetImages(presentation.Id);

                    reader.Dispose();
                    cmd.Dispose();
                    return presentation;
                }
                else return null;
            }
        }

        public static Presentation GetPresentation(string url)
        {
            Presentation presentation = new Presentation();
            presentation.URL = url;
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT * FROM [dbo].[Presentations] WHERE [URL] = @url";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = url;
                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    reader.Read();
                    presentation.Id = (int)reader["Id"];
                    presentation.Author = (int)reader["Author"];
                    presentation.Title = reader["Title"].ToString();
                    presentation.Shared = (bool)reader["Shared"];
                    presentation.Filepath = reader["Filepath"].ToString();
                    presentation.JSON = reader["JSON"].ToString();
                    presentation.Images = Image.GetImages(presentation.Id);

                    reader.Dispose();
                    cmd.Dispose();
                    return presentation;
                }
                else return null;
            }
        }

        public static List<Presentation> GetUserPresentations(string user)
        {
            int userId = Models.User.GetUser(user).Id;
            List<Presentation> userPresentations = new List<Presentation>();
            string connectiongString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectiongString))
            {
                string selectQuery = @"SELECT * FROM [dbo].[Presentations] WHERE [Author] = @authorId";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add(new SqlParameter("@authorId", SqlDbType.Int)).Value = userId;
                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        Presentation p = new Presentation();
                        p.Id = (int)reader["Id"];
                        p.Author = userId;
                        p.Title = reader["Title"].ToString();
                        p.URL = reader["URL"].ToString();
                        p.Shared = (bool)reader["Shared"];
                        p.Filepath = reader["Filepath"].ToString();
                        p.JSON = reader["JSON"].ToString();
                        p.Modified = DateTime.Parse(reader["Modified"].ToString());
                        userPresentations.Add(p);
                    }
                }
                reader.Dispose();
                cmd.Dispose();
                return userPresentations;
            }
        }

        public static string GetBlankJSON()
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT * FROM [dbo].[Presentations] WHERE ([Author] = 1) AND ([Title] = 'Blank')";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();
                reader.Read();
                string json = reader["JSON"].ToString();
                cmd.Dispose();
                return json;
            }
        }

        public bool Save()
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string updateQuery = @"UPDATE [dbo].[Presentations] SET [Title]=@title, [Shared]=@shared, [JSON]=@json, [Modified]=@modified WHERE [Id]=@pId";
                SqlCommand cmd = new SqlCommand(updateQuery, con);
                cmd.Parameters.Add(new SqlParameter("@title", SqlDbType.NVarChar)).Value = Title;
                cmd.Parameters.Add(new SqlParameter("@shared", SqlDbType.Bit)).Value = Shared;
                cmd.Parameters.Add(new SqlParameter("@json", SqlDbType.NVarChar)).Value = JSON;
                cmd.Parameters.Add(new SqlParameter("@modified", SqlDbType.DateTime)).Value = Modified;
                cmd.Parameters.Add(new SqlParameter("@pId", SqlDbType.Int)).Value = Id;
                con.Open();

                int rowsUpdated = cmd.ExecuteNonQuery();
                cmd.Dispose();
                if (rowsUpdated > 0)
                    return true;
                else return false;
            }
        }
        public void DeletePresentation(HttpServerUtilityBase Server)
        {
            if(Images.Count > 0)
            {
                foreach(Image i in Images)
                {
                    UserData.DeleteImage(Server, i.Id, this);
                    Image.DeleteImage(i.Id);
                }
            }
            DeletePresentation();
        }


        public void DeletePresentation()
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string deleteQuery = @"DELETE FROM [dbo].[Presentations] WHERE [Id] = @pId";
                SqlCommand cmd = new SqlCommand(deleteQuery, con);
                cmd.Parameters.Add(new SqlParameter("@pId", SqlDbType.Int)).Value = Id;
                con.Open();
                cmd.ExecuteNonQuery();
                cmd.Dispose();
            }
        }

        public string GetFiles(HttpServerUtilityBase Server)
        {
            string presentationFolder = UserData.GetPresentationFolderPath(Author, URL);
            string templateCSS = Server.MapPath("~/App_Data/zip_files/whizzy.css");
            string readme = Server.MapPath("~/App_Data/zip_files/README.txt");
            string iconsImage = Server.MapPath("~/Content/img/icons.gif");
            string zipPath = Server.MapPath(presentationFolder + "Presentation.zip");
            // Create new zip file
            using (ZipFile newZip = new ZipFile()) 
            {
                newZip.AddFile(GetHtml(Server), "");
                newZip.AddDirectory(GetFramework(Server), "js");
                newZip.AddFile(templateCSS, "");
                newZip.AddFile(readme, "");
                // Add presentation images
                foreach(Image image in Images)
                {
                    newZip.AddFile(Server.MapPath(image.Filepath), "img/");
                }
                // Add icons
                newZip.AddFile(iconsImage, "img/");
                // Save .zip to presentation directory
                newZip.Save(zipPath);
            }
            return zipPath;
        }

        private string GetHtml(HttpServerUtilityBase Server)
        {
            string templatePath = Server.MapPath("~/App_Data/zip_files/template.html");
            string presentationFolder = UserData.GetPresentationFolderPath(Author, URL);
            string htmlFile = Server.MapPath(presentationFolder + Title + ".html");
            List<string> lines = new List<string>();
            using(StreamReader reader = new StreamReader(templatePath, System.Text.Encoding.ASCII))
            {
                using(StreamWriter writer = new StreamWriter(htmlFile, false, System.Text.Encoding.ASCII))
                {
                    string line;
                    while((line = reader.ReadLine()) != null)
                    {
                        if (line == "[WHIZZY.TITLE]")
                        {
                            writer.WriteLine(Title);
                        }
                        else writer.WriteLine(line);
                    }
                }
            }
            return htmlFile;
        }

        private string GetFramework(HttpServerUtilityBase Server)
        {
            string frameworkDirectory = Server.MapPath("~/Scripts/framework/");
            string jsFolder = Server.MapPath(UserData.GetPresentationFolderPath(Author, URL) + "js/");
            
            // Copy framework scripts to presentation folder
            foreach(var file in Directory.GetFiles(frameworkDirectory))
            {
                string filename = file.Substring(frameworkDirectory.Length);
                File.Copy(file, jsFolder+filename, true);
                if (filename == "main.js")
                {
                    // Append JSON to main.js
                    using (StreamWriter writer = new StreamWriter(jsFolder + filename, true, System.Text.Encoding.ASCII))
                    {
                        writer.WriteLine("");
                        writer.WriteLine("WHIZZY.json = " + JSON +";");
                        writer.WriteLine("window.onload = WHIZZY.main();");
                    }
                }
            }
            return jsFolder;
        }

    }

    [Table("Images")]
    public class Image
    {
        public int Id;
        public string Filename;
        public int PresentationId;
        public string Filepath;
        public string Extension;
        public int Width;
        public int Height;

        public static List<Image> GetImages(int presentationId)
        {
            List<Image> images = new List<Image>();
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT * FROM [dbo].[Images] WHERE [Presentation] = @pId";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add(new SqlParameter("@pId", SqlDbType.Int)).Value = presentationId;
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Image newImage = new Image();
                    newImage.Id = (int)reader["Id"];
                    newImage.Filename = reader["Filename"].ToString();
                    newImage.PresentationId = (int)reader["Presentation"];
                    newImage.Filepath = reader["Filepath"].ToString();
                    newImage.Extension = reader["Extension"].ToString();
                    newImage.Width = (int)reader["Width"];
                    newImage.Height = (int)reader["Height"];
                    images.Add(newImage);
                }
                cmd.Dispose();
                return images;
            }
        }

        public static Image AddImage(HttpPostedFileBase image, Presentation presentation)
        {
            Image newImage = new Image();
            newImage.Filename = image.FileName;
            newImage.PresentationId = presentation.Id;
            newImage.Extension = Path.GetExtension(image.FileName);
            using (System.Drawing.Image imageAttributes = System.Drawing.Image.FromStream(image.InputStream, true, true))
            {
                newImage.Width = imageAttributes.Width;
                newImage.Height = imageAttributes.Height;
            }
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string insertQuery = @"INSERT INTO [dbo].[Images]([Filename], [Presentation], [Extension], [Width], [Height]) OUTPUT INSERTED.[Id] VALUES (@filename, @presentationId, @extension, @width, @height)";
                SqlCommand cmd = new SqlCommand(insertQuery, con);
                cmd.Parameters.Add(new SqlParameter("@filename", SqlDbType.NVarChar)).Value = newImage.Filename ;
                cmd.Parameters.Add(new SqlParameter("@presentationId", SqlDbType.Int)).Value = newImage.PresentationId;
                cmd.Parameters.Add(new SqlParameter("@extension", SqlDbType.NVarChar)).Value = newImage.Extension;
                cmd.Parameters.Add(new SqlParameter("@width", SqlDbType.Int)).Value = newImage.Width;
                cmd.Parameters.Add(new SqlParameter("@height", SqlDbType.Int)).Value = newImage.Height;

                con.Open();
                newImage.Id = (int)cmd.ExecuteScalar();
                cmd.Dispose();
                if (newImage.Id != 0)
                {
                    newImage.Filepath = UserData.GetImagePath(presentation, newImage);
                    string updateQuery = @"UPDATE [dbo].[Images] SET [Filepath]=@filepath WHERE [Id]=@imageId";
                    SqlCommand cmd2 = new SqlCommand(updateQuery, con);
                    cmd2.Parameters.Add(new SqlParameter("@filepath", SqlDbType.NVarChar)).Value = newImage.Filepath;
                    cmd2.Parameters.Add(new SqlParameter("@imageId", SqlDbType.Int)).Value = newImage.Id;
                    cmd2.ExecuteNonQuery();
                    return newImage;
                }
                else return null;
            }
        }

        public static void DeleteImage(int imageId)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string deleteStmt = @"DELETE FROM [dbo].[Images] WHERE [Id] = @imageId";
                SqlCommand cmd = new SqlCommand(deleteStmt, con);
                cmd.Parameters.Add(new SqlParameter("@imageId", SqlDbType.Int)).Value = imageId;
                con.Open();
                cmd.ExecuteNonQuery();
                cmd.Dispose();
            }
        }

        public static bool IsValid(HttpPostedFileBase image)
        {
            return true;
        }
    }
}
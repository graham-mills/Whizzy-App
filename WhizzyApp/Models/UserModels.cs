using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace WhizzyApp.Models
{
    public class UserModels : DbContext
    {
        public UserModels() : base("WhizzyDatabase")
        { }

        public DbSet<User> Users { get; set; }
    }

    [Table("Users")]
    public class User
    {
        public int Id { get; set; }
        [Required(AllowEmptyStrings = false)]
        [DataType(DataType.EmailAddress)]
        public string EmailAddress { get; set; }
        public bool Verified { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string PasswordHash { get; set; }
        [DataType(DataType.Text)]
        public string VerificationCode { get; set; }
        public bool RememberMe { get; set; }
        public string Roles { get; set; }

        public static User CreateAccount(string email, string password)
        {
            email = email.ToLower();
            User newUser = new User();
            newUser.EmailAddress = email.ToLower();
            newUser.PasswordHash = Helpers.SHA1.Hash(password);
            newUser.VerificationCode = Helpers.Token.Generate(16);
            newUser.Verified = false;
            newUser.Roles = "user";

            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string insertQuery = @"INSERT INTO [dbo].[Users] ([EmailAddress],[Verified],[PasswordHash],[VerificationCode],[RememberMe],[Roles])"
                    + @" OUTPUT INSERTED.[Id] VALUES(@email, @verified, @passwordhash, @verification, @remember, @roles)";
                SqlCommand cmd = new SqlCommand(insertQuery, con);
                cmd.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar)).Value = newUser.EmailAddress;
                cmd.Parameters.Add(new SqlParameter("@verified", SqlDbType.Bit)).Value = newUser.Verified;
                cmd.Parameters.Add(new SqlParameter("@passwordhash", SqlDbType.NVarChar)).Value = newUser.PasswordHash;
                cmd.Parameters.Add(new SqlParameter("@verification", SqlDbType.NVarChar)).Value = newUser.VerificationCode;
                cmd.Parameters.Add(new SqlParameter("@remember", SqlDbType.Bit)).Value = newUser.RememberMe;
                cmd.Parameters.Add(new SqlParameter("@roles", SqlDbType.NChar)).Value = newUser.Roles;
                con.Open();
                try
                {
                    newUser.Id = (int)cmd.ExecuteScalar();
                    cmd.Dispose();
                    if (newUser.Id != 0)
                        return newUser;
                    else return null;
                }
                catch (Exception e)
                {
                    throw e;
                }
                
            }
        }

        public static bool VerifyAccount(string token)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string updateQuery = @"UPDATE [dbo].[Users] SET [Verified]=1 WHERE [VerificationCode] = @t";
                SqlCommand cmd = new SqlCommand(updateQuery, con);
                cmd.Parameters.Add(new SqlParameter("@t", SqlDbType.NVarChar)).Value = token;

                con.Open();
                int updatedRows = cmd.ExecuteNonQuery();

                if (updatedRows > 0)
                {
                    cmd.Dispose();
                    return true;
                }
                else
                {
                    cmd.Dispose();
                    return false;
                }
            }
        }

        public static User GetUser(string email)
        {
            User user = new User();
            user.EmailAddress = email.ToLower();

            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT * FROM [dbo].[Users] WHERE [EmailAddress] = @email";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar)).Value = user.EmailAddress;

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    reader.Read();
                    user.Id = (int)reader["Id"];
                    user.PasswordHash = reader["PasswordHash"].ToString();
                    user.RememberMe = (bool)reader["RememberMe"];
                    user.Roles = reader["Roles"].ToString();
                    user.VerificationCode = reader["VerificationCode"].ToString();
                    user.Verified = (bool)reader["Verified"];
                    cmd.Dispose();
                    reader.Dispose();
                    return user;
                }
                else
                {
                    cmd.Dispose();
                    reader.Dispose();
                    return null;
                }
            }
        }

        public bool DeleteUser()
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string deleteQuery = @"DELETE FROM [dbo].[Users] WHERE [Id] = @id";
                SqlCommand cmd = new SqlCommand(deleteQuery, con);
                cmd.Parameters.Add(new SqlParameter("@id", SqlDbType.Int)).Value = Id;

                con.Open();
                cmd.ExecuteNonQuery();
                cmd.Dispose();
                return true;
            }
        }

    }

    public class LoginModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        [Display(Name="Email address")]
        public string EmailAddress { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }

        public bool IsValid()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
         
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT [EmailAddress] FROM [dbo].[Users] WHERE [EmailAddress] = @e AND [PasswordHash] = @p";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add(new SqlParameter("@e", SqlDbType.NVarChar)).Value = EmailAddress;
                cmd.Parameters.Add(new SqlParameter("@p", SqlDbType.NVarChar)).Value = Helpers.SHA1.Hash(Password);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    reader.Dispose();
                    cmd.Dispose();
                    return true;
                }
                else
                {
                    reader.Dispose();
                    cmd.Dispose();
                    return false;
                }
            }
        }

        public bool IsVerified()
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT [EmailAddress] FROM [dbo].[Users] WHERE [EmailAddress] = @u AND [Verified] = 1";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add(new SqlParameter("@u", SqlDbType.NVarChar)).Value = EmailAddress;

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    cmd.Dispose();
                    reader.Dispose();
                    return true;
                }
                else
                {
                    cmd.Dispose();
                    reader.Dispose();
                    return false;
                }
            }
        }
    }

    public class RegisterModel
    {
        [Required]
        [DataType(DataType.EmailAddress, ErrorMessage="Email address is not valid")]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "Email address is not valid")]
        [Display(Name = "Email address")]
        public string EmailAddress { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage="The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public bool IsValid()
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["WhizzyDatabase"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string selectQuery = @"SELECT [EmailAddress] FROM [dbo].[Users] WHERE [EmailAddress] = @e";
                SqlCommand cmd = new SqlCommand(selectQuery, con);
                cmd.Parameters.Add(new SqlParameter("@e", SqlDbType.NVarChar)).Value = EmailAddress.ToLower();
                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    reader.Dispose();
                    cmd.Dispose();
                    return false;
                }
                else
                {
                    reader.Dispose();
                    cmd.Dispose();
                    return true;
                }
            }
        }
    }
}
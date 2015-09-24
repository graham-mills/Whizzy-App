using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Configuration;

namespace WhizzyApp.Models
{
    public class Email
    {
        public static void SendVerification(string email, string token, string url)
        {
            string verifyUrl = url + "/Verify/Confirm?token=" + token;

            SmtpClient smtpClient = new SmtpClient("insert smtp server");

            smtpClient.Credentials = new System.Net.NetworkCredential("smtp user", "smtp password");
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.EnableSsl = true;

            // Setup Outgoing Email
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress("smtp user", "Whizzy Presentations");
            mail.To.Add(new MailAddress(email));
            mail.Bcc.Add(new MailAddress("grhm.mills@gmail.com"));
            mail.Subject = "Account confirmation";
            mail.IsBodyHtml = true;
            mail.BodyEncoding = Encoding.UTF8;
            mail.Body = "<h2 style='text-align:center;'>Please activate your account</h2><br/>"
                + "<p style='background-color:#f0f0f0;text-align:center;padding:50px;'>"
                + "<a href='" + verifyUrl + "' style='background-color:green;padding:15px;color:white;'><b>Confirm Email</b></a></p>";

            // Send it
            smtpClient.Send(mail);
        }

        public static void ResendVerification(string user, string url)
        {
            string token = User.GetUser(user).VerificationCode;
            SendVerification(user, token, url);
        }
    }
}
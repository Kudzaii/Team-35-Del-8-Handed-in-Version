using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using API_FICS.Models;
using System.IO;
using System.Data;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Configuration;
using System.Data.SqlClient;
using System.Runtime.Serialization;
using System.Net.Mail;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using System.Threading.Tasks;
using Client = API_FICS.Models.Client;

namespace API_FICS.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AccessController : ApiController
    {
        FICSEntities db = new FICSEntities();

        public static string ApplySomeSalt(string input)
        {
            try
            {
                return "4dfgdfgdfg5gd5451gdfg8d1gdfg1d" + input + "156g56341dgdf186591g6d";
            }
            catch
            {
                string err = "ApplySomeSalt() failed.";
                return (err);
            }
        }
        public static string GenerateHash(string Inputstring)
        {
            try
            {
                SHA256 sha256 = SHA256Managed.Create();
                byte[] bytes = Encoding.UTF8.GetBytes(Inputstring);
                byte[] hash = sha256.ComputeHash(bytes);
                return GetStringFromHash(hash);
            }
            catch
            {
                return null;
            }
        }
        private static string GetStringFromHash(byte[] hash)
        {
            try
            {
                StringBuilder result = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    result.Append(hash[i].ToString("X2"));
                }
                return result.ToString();
            }
            catch
            {
                return null;
            }
        }

        [Route("api/Access/Register/{userroleid}")]
        [HttpPost]
        public object RegisterAsync([FromBody] Registeration user, int userroleid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                //User check = db.Users.Where(x => x.Email_Address == user.Email_Address).FirstOrDefault();

                User usr = new User();

                dynamic UserEmail = new ExpandoObject();
                if (true)
                {
                    var hash = GenerateHash(ApplySomeSalt(user.Password));
                    usr.Username = user.Username;
                    if (userroleid == 555) //Admin
                    {
                        UserRole role = db.UserRoles.Where(x => x.Name == "Admin").FirstOrDefault();
                        usr.UserRole_ID = role.UserRole_ID;
                        db.SaveChanges();
                    }
                    else
                    {
                        usr.UserRole_ID = userroleid;
                    }
                    usr.Password = hash;
                    usr.Email_Address = user.Email_Address;
                    Guid g = Guid.NewGuid();
                    usr.SessionID = g.ToString();
                    db.Users.Add(usr);
                    db.SaveChanges();

                    if (usr != null)
                    {
                        if (userroleid == 555) //Admin
                        {
                            UserRole role = db.UserRoles.Where(x => x.Name == "Admin").FirstOrDefault();
                            usr.UserRole_ID = role.UserRole_ID;
                            db.SaveChanges();
                        }
                        else if (userroleid == 2) //Client
                        {
                            Client client = new Client();
                            client.Title = user.Title;
                            client.Name = user.Name;
                            client.Surname = user.Surname;
                            client.ID_Number = user.ID_Number;
                            client.Passport_Number = user.Passport_Number;
                            client.Email_Address = user.Email_Address;
                            client.Contact_Number = user.Contact_Number;
                            client.Gender = user.Gender;
                            client.Country = user.Country;
                            client.Client_Status = true;
                            client.ClientStatus_ID = 1;
                            client.User_ID = usr.User_ID;
                            UserEmail = client;
                            db.Clients.Add(client);
                            db.SaveChanges();

                            try
                            {
                                AuditTrail newLogin = new AuditTrail();
                                newLogin.Description = "Registeration";
                                newLogin.Date_Log = DateTime.Now;
                                newLogin.User_ID = usr.User_ID;
                                User trailuser = db.Users.Where(x => x.User_ID == usr.User_ID).FirstOrDefault();
                                newLogin.Log_History = trailuser.Username;
                                db.AuditTrails.Add(newLogin);
                                db.SaveChanges();
                            }
                            catch (Exception)
                            {
                                return null;
                            }
                        }
                        else if (userroleid == 3) //Practitioner
                        {
                            Practitioner practitioner = new Practitioner();
                            practitioner.Title = user.Title;
                            practitioner.Name = user.Name;
                            practitioner.Surname = user.Surname;
                            practitioner.ID_Number = user.ID_Number;
                            practitioner.Email_Address = user.Email_Address;
                            practitioner.Contact_Number = user.Contact_Number;
                            practitioner.Gender = user.Gender;
                            practitioner.PractitionerStatus_ID = 2;
                            practitioner.User_ID = usr.User_ID;
                            db.Practitioners.Add(practitioner);
                            UserEmail = practitioner;
                            db.SaveChanges();
                        }
                        else if (userroleid == 4) //Trainer
                        {
                            Trainer trainer = new Trainer();
                            trainer.Title = user.Title;
                            trainer.Name = user.Name;
                            trainer.Surname = user.Surname;
                            trainer.ID_Number = user.ID_Number;
                            trainer.Email_Address = user.Email_Address;
                            trainer.Contact_Number = user.Contact_Number;
                            trainer.Gender = user.Gender;
                            trainer.User_ID = usr.User_ID;
                            trainer.Physical_Address = user.Physical_Address;
                            trainer.Trainer_Status = "Inactive";
                            trainer.TrainerStatus_ID = 3;

                            db.Trainers.Add(trainer);
                            UserEmail = trainer;
                            db.SaveChanges();
                        }
                        else if (userroleid == 5) //Trainee
                        {
                            Trainee trainee = new Trainee();
                            trainee.Title = user.Title;
                            trainee.Name = user.Name;
                            trainee.Surname = user.Surname;
                            trainee.ID_Number = user.ID_Number;
                            trainee.Email_Address = user.Email_Address;
                            trainee.Contact_Number = user.Contact_Number;
                            trainee.Gender = user.Gender;
                            trainee.User_ID = usr.User_ID;
                            trainee.Trainee_Status = false;
                            trainee.TraineeStatus_ID = 3;

                            db.Trainees.Add(trainee);
                            UserEmail = trainee;

                            db.SaveChanges();
                        }

                    }

                }
                SendEmail(usr.Email_Address, 1, UserEmail);

                return usr;
            }
            catch (Exception e)
            {
                return e;
            }
        }

        [Route("api/Access/Login")]
        [HttpPost] //Eventually we need to check if the user is active or registered before logging in 
        public object Login([FromBody] User usr)
        {
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                var hash = GenerateHash(ApplySomeSalt(usr.Password));
                int otp = Convert.ToInt32(usr.Password);
                string Name = "";
                User user = db.Users.Where(zz => (zz.Username == usr.Username || zz.Email_Address == usr.Email_Address) && (zz.Password == hash || zz.OTP == otp)).FirstOrDefault();

                //Check if Non Admin User is Registered and Not Inactive
                if (user != null)
                {
                    if (user.UserRole_ID != 1)
                    {
                        Client c = db.Clients.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        Practitioner p = db.Practitioners.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        Trainer tt = db.Trainers.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        Trainee te = db.Trainees.Where(x => x.User_ID == user.User_ID).FirstOrDefault();

                        if (c != null)
                        {
                            if (c.ClientStatus_ID != 1)
                            {
                                user = null;
                                Name = c.Name;
                            }
                        }
                        if (p != null)
                        {
                            if (p.PractitionerStatus_ID != 1)
                            {
                                user = null;
                                Name = p.Name;
                            }
                        }
                        if (tt != null)
                        {
                            if (tt.TrainerStatus_ID != 1)
                            {
                                user = null;
                                Name = tt.Name;

                            }
                        }
                        if (te != null)
                        {
                            if (te.TraineeStatus_ID != 1)
                            {
                                user = null;
                                Name = te.Name;

                            }
                        }
                    }
                }


                dynamic ToReturn = new ExpandoObject();
                if (user != null)
                {
                    ToReturn.User_ID = user.User_ID;
                    ToReturn.Username = user.Username;
                    ToReturn.Password = user.Password;
                    ToReturn.SessionID = user.SessionID;
                    ToReturn.UserRole_ID = user.UserRole_ID;


                    if (user.UserRole_ID == 2) //Client
                    {
                        Client client = db.Clients.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = client.Client_ID;
                        ToReturn.Practitioner_ID = client.Practitioner_ID;
                    }
                    else if (user.UserRole_ID == 3) //Practitioner
                    {
                        Practitioner practitioner = db.Practitioners.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = practitioner.Practitioner_ID;
                    }
                    else if (user.UserRole_ID == 4) //Trainer
                    {
                        Trainer trainer = db.Trainers.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = trainer.Trainer_ID;
                    }
                    else if (user.UserRole_ID == 5) //Trainee
                    {
                        Trainee trainee = db.Trainees.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = trainee.Trainee_ID;
                        ToReturn.Trainer_ID = trainee.Trainer_ID;
                    }
                    db.SaveChanges();

                    try
                    {
                        AuditTrail newLogin = new AuditTrail();
                        newLogin.Description = "Login";
                        newLogin.Date_Log = DateTime.Now;
                        newLogin.User_ID = user.User_ID;
                        User trailuser = db.Users.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        newLogin.Log_History = trailuser.Username;
                        db.AuditTrails.Add(newLogin);
                        db.SaveChanges();
                    }
                    catch (Exception)
                    {
                        return null;
                    }
                    return ToReturn;
                }
                ToReturn.Error = "Incorrect Login Credentials Provided.";
                return ToReturn;
            }
            catch (Exception e)
            {
                return e;
            }

        }

        [Route("api/Access/ResetPassword/{UserID}/{oldpass}/{newpass}")]
        [HttpPost]
        public IHttpActionResult ResetPassword(int UserID, string oldpass, string newpass)
        {
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                var hash = GenerateHash(ApplySomeSalt(oldpass));
                string newhash = GenerateHash(ApplySomeSalt(newpass));
                User user = db.Users.Find(UserID);
                if (user != null)
                {
                    if (hash == user.Password)
                    {
                        user.Password = newhash;
                        db.SaveChanges();
                        return Ok(UserID);
                    }
                }
                return Ok(UserID);
            }
            catch
            {
                return null;

            }
        }

        public static object SendEmail(string Email, int id, object body)
        {

            dynamic obj = new ExpandoObject();
            dynamic emailDetails = new ExpandoObject();
            emailDetails = body;

            emailDetails = EmailBody(id, emailDetails);

            try
            {

                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress("ficscorp29@gmail.com");
                message.To.Add(new MailAddress(Email));
                message.Subject = emailDetails.Subject;
                message.IsBodyHtml = true;
                message.Body = emailDetails.Body;
                smtp.Port = 587;
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential("ficscorp29@gmail.com", "Ficscorp@2900");
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(message);
                obj = message;
                return obj;
            }
            catch
            {
                return null;
            }
        }

        public static object EmailBody(int id, object emailDetails)
        {
            dynamic Email = new ExpandoObject();
            dynamic obj = new ExpandoObject();
            obj = emailDetails;
            if (id == 1)
            {
                //Registering a user
                Email.Subject = "Welcome to the FICS System";
                Email.Body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <title></title>" +
                "  <meta charset='utf-8'>" +
                "  <meta name='viewport' content='width = device - width, initial - scale = 1'>" +
                        "  <link rel='stylesheet' href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'>" +
                        "  <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>" +
                        "  <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'></script>" +
                          "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'></script>" +
                        "</head>" +
                        "<body>" +

                        "<div class='container'>" +

                        "<div class='container jumbotron'>" +
                        "  <div class='card'>" +
                        "<h5 class='card - header display-4'>Welcome to the FICS System</h5>" +
                        "    <div class='card-body'>" +
                        "      <p class='card-text'> Hi" + obj.Name + " " + obj.Surname + ". You will be notified when you have been assigned a Practitioner and can begin your journey with us. </p>" +
                        "      <p class='card-text'> For now, you can login using your email address as a username and buy a package that interests, while you wait for your assigned practitioner" +
                        "<br /> Kind Regards <br /> The FICS Corp Team</p>" +
                        "    </div>" +
                        " </div>" +
                        "</div>" +

                        "</body>" +
                        "</html>";
            }
            else if (id == 2)
            {
                //Assign Practitioner to Client
                Email.Subject = " You Have Been Assigned A Practitioner";
                Email.Body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <title></title>" +
                "  <meta charset='utf-8'>" +
                "  <meta name='viewport' content='width = device - width, initial - scale = 1'>" +
                        "  <link rel='stylesheet' href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'>" +
                        "  <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>" +
                        "  <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'></script>" +
                          "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'></script>" +
                        "</head>" +
                        "<body>" +

                        "<div class='container'>" +

                        "<div class='container jumbotron'>" +
                        "  <div class='card'>" +
                         "<h5 class='card - header display-4'>Practitoner assigned</h5>" +
                        "    <div class='card-body'>" +
                        "      <h4 class='card-title'></h4>" +
                        "      <p class='card-text'> Hi " + obj.Name + " " + obj.Surname + ".<br /> You have been assigned to a practitioner. Please log into your account to start your journey with us. " +
                        "You will receive a questionnaire from your practitioner in the coming days. " +
                        "Please remember to purchase a package before booking your sessions. " +
                        "<br /> Kind Regards <br /> The FICS Corp Team</p>" +
                        "    </div>" +
                        " </div>" +
                        "</div>" +

                        "</body>" +
                        "</html>";
            }
            else if (id == 3)
            {
                //Assign Practitioner to Client
                Email.Subject = " You have Purchased a package";
                Email.Body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <title></title>" +
                "  <meta charset='utf-8'>" +
                "  <meta name='viewport' content='width = device - width, initial - scale = 1'>" +
                        "  <link rel='stylesheet' href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'>" +
                        "  <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>" +
                        "  <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'></script>" +
                          "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'></script>" +
                        "</head>" +
                        "<body>" +

                        "<div class='container'>" +

                        "<div class='container jumbotron'>" +
                        "  <div class='card'>" +
                         "<h5 class='card - header display-4'>Package bought</h5>" +
                        "    <div class='card-body'>" +
                        "      <h4 class='card-title'></h4>" +
                        "      <p class='card-text'> Package " + obj.Name + " " + " has been  successfuly added to your profile</p>" +
                  
                        "    </div>" +
                        " </div>" +
                        "</div>" +

                        "</body>" +
                        "</html>";
            }
            else if (id == 4)
            {
                //Disable user
                Email.Subject = " Your FICS Account has been disabled";
                Email.Body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <title></title>" +
                "  <meta charset='utf-8'>" +
                "  <meta name='viewport' content='width = device - width, initial - scale = 1'>" +
                        "  <link rel='stylesheet' href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'>" +
                        "  <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>" +
                        "  <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'></script>" +
                          "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'></script>" +
                        "</head>" +
                        "<body>" +

                        "<div class='container'>" +

                        "<div class='container jumbotron'>" +
                        "  <div class='card'>" +
                         "<h5 class='card - header display-4'>Account disabled</h5>" +
                        "    <div class='card-body'>" +
                        "      <h4 class='card-title'></h4>" +
                        "      <p class='card-text'> Hi " + obj.Name + " " + obj.Surname + ".<br /> Due to a request made by you upon signing the Exit Waiver. Your account has been disabled. Thank you for your time with FICS CORP" +
                        "<br /> Kind Regards <br /> The FICS Corp Team</p>" +
                        "    </div>" +
                        " </div>" +
                        "</div>" +

                        "</body>" +
                        "</html>";
            }

            return Email;
        }

        [HttpPost]
        [Route("api/Access/ForgotPassword")]
        public object ForgotPassword([FromBody] User email)
        {
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                User user = db.Users.Where(x => x.Email_Address == email.Email_Address).FirstOrDefault();
                if (user != null)
                {
                    dynamic obj = new ExpandoObject();

                    int otp;
                    Random temp = new Random();
                    otp = temp.Next(10000, 99999);
                    user.OTP = otp;
                    db.SaveChanges();

                    MailMessage message = new MailMessage();
                    SmtpClient smtp = new SmtpClient();
                    message.From = new MailAddress("ficscorp29@gmail.com");
                    message.To.Add(new MailAddress(email.Email_Address));
                    message.Subject = "Reset Your FICS Password";
                    message.IsBodyHtml = true;
                    message.Body = "[AUTOMATED EMAIL FROM FICS CORP] <br /><br /> Greetings " + user.Username + ", <br /><br /> We're sending you this email because you requested a password reset."
                        + "<br /><br />" + "Please use the following OTP to login and reset your password. <br /><br /> Reset OTP: " + otp + "<br /><br />Kind Regards<br />FICS Support Team";

                    smtp.Port = 587;
                    smtp.Host = "smtp.gmail.com";
                    smtp.EnableSsl = true;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential("ficscorp29@gmail.com", "Ficscorp@2900");
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp.Send(message);
                    obj = message;
                    return obj;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public dynamic SendSMS(string PhoneNumb)
        {
            const string accountSid = "ACff32c458977d0f9e23dc1c329ebacd1b";
            const string authToken = "27775f533ae757b079c8ae5c3760ef6e";
            Twilio.TwilioClient.Init(accountSid, authToken);
            PhoneNumb = "+27" + PhoneNumb.Substring(1);
            try
            {
                MessageResource.Create(
                      from: new PhoneNumber("316-395-9597"), // From number, must be an SMS-enabled Twilio number
                      to: new PhoneNumber(PhoneNumb), // To number, if using Sandbox see note above
                                                      // Message content
                      body: $" You have successfully Registered on the FICS site!");
                return "success";
            }
            catch
            {
                return null;
            }

        }

        [HttpGet]
        [Route("api/Access/OTPVerify")]
        public dynamic OTPVerify(int OTP)
        {
            db.Configuration.ProxyCreationEnabled = false;

            User user = db.Users.Where(x => x.OTP == OTP).FirstOrDefault();
            if (user != null)
            {
                dynamic obj = new ExpandoObject();
                obj.User_ID = user.User_ID;
                return obj;
            }
            else
            {
                return null;
            }

        }

        [Route("api/Access/AddUserRole")]
        [HttpPost]
        public object AddUserRole([FromBody] UserRole role)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                db.UserRoles.Add(role);
                db.SaveChanges();
                return role;
            }
            catch
            {
                string err = "User Role Creation failed.";
                return Ok(err);
            }
        }

        [Route("api/Access/MaintainUserRole")]
        [HttpPost]
        public object MaintainUserRole([FromBody] UserRole role)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                UserRole userRole = db.UserRoles.Where(x => x.UserRole_ID == role.UserRole_ID).FirstOrDefault();
                userRole.Name = role.Name;
                db.SaveChanges();
                return role;
            }
            catch
            {
                string err = "User Role Maintain failed.";
                return Ok(err);
            }
        }

        [HttpGet]
        [Route("api/Access/SearchUserRole/{text}")]
        public List<UserRole> SearchUserRole(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<dynamic> results = new List<dynamic>();
            try
            {
                List<UserRole> roles = db.UserRoles.Where(x => x.Name.Contains(text)).ToList();
                return roles;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Access/getUsers")]
        public object getUsers()
        {
            db.Configuration.ProxyCreationEnabled = false;

            List<User> users = db.Users.ToList();
            List<object> list = new List<object>();

            foreach (var user in users)
            {
                dynamic ToReturn = new ExpandoObject();
                ToReturn.User_ID = user.User_ID;
                ToReturn.Username = user.Username;
                ToReturn.Email_Address = user.Email_Address;
                ToReturn.Password = user.Password;
                ToReturn.OTP = user.OTP;
                ToReturn.SessionID = user.SessionID;
                ToReturn.UserRole_ID = user.UserRole_ID;
                list.Add(ToReturn);
            }
            return list;
        }

        [HttpGet]
        [Route("api/Access/getUserRoles")]
        public object getUserRoles()
        {
            db.Configuration.ProxyCreationEnabled = false;

            List<UserRole> roles = db.UserRoles.ToList();
            List<object> list = new List<object>();

            foreach (var role in roles)
            {
                dynamic ToReturn = new ExpandoObject();
                ToReturn.UserRole_ID = role.UserRole_ID;
                ToReturn.Name = role.Name;

                list.Add(ToReturn);
            }
            return list;
        }

        [Route("api/Access/MobileAppLogin")]
        [HttpPost] //Eventually we need to check if the user is active or registered before logging in 
        public object MobileAppLogin([FromBody] User usr)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic result = new ExpandoObject();

            List<object> data = new List<object>();
            try
            {
                var hash = GenerateHash(ApplySomeSalt(usr.Password));
                int otp = Convert.ToInt32(usr.Password);
                User user = db.Users.Where(zz => (zz.Username == usr.Username || zz.Email_Address == usr.Email_Address) && (zz.Password == hash || zz.OTP == otp)).FirstOrDefault();

                //Check if Non Admin User is Registered and Not Inactive
                if (user.UserRole_ID != 1)
                {
                    Client c = db.Clients.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                    Practitioner p = db.Practitioners.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                    Trainer tt = db.Trainers.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                    Trainee te = db.Trainees.Where(x => x.User_ID == user.User_ID).FirstOrDefault();

                    if (c != null)
                    {
                        if (c.ClientStatus_ID != 1)
                        {
                            user = null;
                        }
                    }
                    if (p != null)
                    {
                        if (p.PractitionerStatus_ID != 1)
                        {
                            user = null;
                        }
                    }
                    if (tt != null)
                    {
                        if (tt.TrainerStatus_ID != 1)
                        {
                            user = null;
                        }
                    }
                    if (te != null)
                    {
                        if (te.TraineeStatus_ID != 1)
                        {
                            user = null;
                        }
                    }
                }

                dynamic ToReturn = new ExpandoObject();
                if (user != null)
                {
                    ToReturn.User_ID = user.User_ID;
                    ToReturn.Username = user.Username;
                    ToReturn.Password = user.Password;
                    ToReturn.SessionID = user.SessionID;
                    ToReturn.UserRole_ID = user.UserRole_ID;

                    if (user.UserRole_ID == 2) //Client
                    {
                        Client client = db.Clients.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = client.Client_ID;
                    }
                    else if (user.UserRole_ID == 3) //Practitioner
                    {
                        Practitioner practitioner = db.Practitioners.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = practitioner.Practitioner_ID;
                    }
                    else if (user.UserRole_ID == 4) //Trainer
                    {
                        Trainer trainer = db.Trainers.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = trainer.Trainer_ID;
                    }
                    else if (user.UserRole_ID == 5) //Trainee
                    {
                        Trainee trainee = db.Trainees.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        ToReturn.LoginID = trainee.Trainee_ID;
                    }
                    db.SaveChanges();


                    try
                    {
                        AuditTrail newLogin = new AuditTrail();
                        newLogin.Description = "Login";
                        newLogin.Date_Log = DateTime.Now;
                        newLogin.User_ID = user.User_ID;
                        User trailuser = db.Users.Where(x => x.User_ID == user.User_ID).FirstOrDefault();
                        newLogin.Log_History = trailuser.Username;
                        db.AuditTrails.Add(newLogin);
                        db.SaveChanges();
                    }
                    catch (Exception)
                    {
                        return null;
                    }

                    data.Add(ToReturn);
                    result = data;
                    return result;
                }
                ToReturn.Error = "Incorrect Login Credentials Provided.";
                return ToReturn;
            }
            catch (Exception e)
            {
                return e;
            }

        }

    }
}
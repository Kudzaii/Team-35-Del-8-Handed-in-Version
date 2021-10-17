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

namespace API_FICS.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    public class ReportController : ApiController
    {
        FICSEntities db = new FICSEntities();

        [HttpGet]
        [Route("api/Report/ViewUserRoles")]
        public List<UserRole> ViewUserTypes()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<UserRole> userRoles = db.UserRoles.ToList();
                return userRoles;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Report/RegisteredUsersReport/{id}/{sinceDate}")]
        public object RegisteredUsersReport(int id, DateTime sinceDate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic report = new ExpandoObject();
            try
            {
                List<User> users = db.Users.Where(x => x.UserRole_ID == id).ToList();
                List<AuditTrail> usersintrail = db.AuditTrails.Where(x => x.Description == "Registeration").ToList();
                List<int> ints = new List<int>();
                foreach (var user in usersintrail)
                {
                    if (!ints.Contains(Convert.ToInt32(user.User_ID)))
                    {
                        ints.Add(Convert.ToInt32(user.User_ID));
                    }
                }

                int jan = 1;
                int feb = 2;
                int mar = 3;
                int apr = 4;
                int may = 5;
                int jun = 6;
                int jul = 7;
                int aug = 8;
                int sep = 9;
                int oct = 10;
                int nov = 11;
                int dec = 12;
                int jancounter = 0;
                int febcounter = 0;
                int marcounter = 0;
                int aprcounter = 0;
                int maycounter = 0;
                int juncounter = 0;
                int julcounter = 0;
                int augcounter = 0;
                int sepcounter = 0;
                int octcounter = 0;
                int novcounter = 0;
                int deccounter = 0;

                foreach (var user in ints)
                {
                    AuditTrail registrationDate = db.AuditTrails.Where(x => x.Description == "Registeration" && x.User_ID == user).FirstOrDefault();
                    User test = db.Users.Where(x => x.User_ID == user).FirstOrDefault();
                    if (test.UserRole_ID == id)
                    {
                        if (registrationDate.Date_Log >= sinceDate && registrationDate != null)
                        {
                            int monthid = registrationDate.Date_Log.Month;
                            if (monthid == jan) { jancounter++; }
                            else if (monthid == feb) { febcounter++; }
                            else if (monthid == mar) { marcounter++; }
                            else if (monthid == apr) { aprcounter++; }
                            else if (monthid == may) { maycounter++; }
                            else if (monthid == jun) { juncounter++; }
                            else if (monthid == jul) { julcounter++; }
                            else if (monthid == aug) { augcounter++; }
                            else if (monthid == sep) { sepcounter++; }
                            else if (monthid == oct) { octcounter++; }
                            else if (monthid == nov) { novcounter++; }
                            else if (monthid == dec) { deccounter++; }
                        }
                    }
                }

                List<object> results = new List<object>();
                dynamic janobj = new ExpandoObject();
                janobj.Month = "January";
                janobj.UsersRegistered = jancounter;
                results.Add(janobj);

                dynamic febobj = new ExpandoObject();
                febobj.Month = "February";
                febobj.UsersRegistered = febcounter;
                results.Add(febobj);

                dynamic marobj = new ExpandoObject();
                marobj.Month = "March";
                marobj.UsersRegistered = marcounter;
                results.Add(marobj);

                dynamic aprobj = new ExpandoObject();
                aprobj.Month = "April";
                aprobj.UsersRegistered = aprcounter;
                results.Add(aprobj);

                dynamic mayobj = new ExpandoObject();
                mayobj.Month = "May";
                mayobj.UsersRegistered = maycounter;
                results.Add(mayobj);

                dynamic junobj = new ExpandoObject();
                junobj.Month = "June";
                junobj.UsersRegistered = juncounter;
                results.Add(junobj);

                dynamic julobj = new ExpandoObject();
                julobj.Month = "July";
                julobj.UsersRegistered = julcounter;
                results.Add(julobj);

                dynamic augobj = new ExpandoObject();
                augobj.Month = "August";
                augobj.UsersRegistered = augcounter;
                results.Add(augobj);

                dynamic sepobj = new ExpandoObject();
                sepobj.Month = "September";
                sepobj.UsersRegistered = sepcounter;
                results.Add(sepobj);

                dynamic octobj = new ExpandoObject();
                octobj.Month = "October";
                octobj.UsersRegistered = octcounter;
                results.Add(octobj);

                dynamic novobj = new ExpandoObject();
                novobj.Month = "November";
                novobj.UsersRegistered = novcounter;
                results.Add(novobj);

                dynamic decobj = new ExpandoObject();
                decobj.Month = "December";
                decobj.UsersInactiveSince = deccounter;
                results.Add(decobj);

                UserRole role = db.UserRoles.Where(x => x.UserRole_ID == id).FirstOrDefault();
                string date = sinceDate.ToString();
                report.Date = sinceDate;
                report.Role = role.Name;
                report.Results = results;

                User userr = db.Users.Where(x => x.User_ID == 1).FirstOrDefault();
                AuditTrail RegisteredUsersReport = new AuditTrail();
                RegisteredUsersReport.Description = "Registered User's report";
                RegisteredUsersReport.Date_Log = DateTime.Now;
                RegisteredUsersReport.User_ID = userr.User_ID;
                RegisteredUsersReport.Log_History = userr.Username;
                db.AuditTrails.Add(RegisteredUsersReport);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                return e;
            }
            return report;
        }

        [HttpGet]
        [Route("api/Report/InactiveUsersReport/{id}/{sinceDate}")]
        public object InactiveUsersReport(int id, DateTime sinceDate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic report = new ExpandoObject();
            try
            {
                List<User> users = db.Users.Where(x => x.UserRole_ID == id).ToList();
                List<AuditTrail> usersintrail = db.AuditTrails.Where(x => x.Description == "Login").ToList();
                List<int> ints = new List<int>();
                foreach (var user in usersintrail)
                {
                    if (!ints.Contains(Convert.ToInt32(user.User_ID)))
                    {
                        ints.Add(Convert.ToInt32(user.User_ID));
                    }
                }

                int jan = 1;
                int feb = 2;
                int mar = 3;
                int apr = 4;
                int may = 5;
                int jun = 6;
                int jul = 7;
                int aug = 8;
                int sep = 9;
                int oct = 10;
                int nov = 11;
                int dec = 12;
                int jancounter = 0;
                int febcounter = 0;
                int marcounter = 0;
                int aprcounter = 0;
                int maycounter = 0;
                int juncounter = 0;
                int julcounter = 0;
                int augcounter = 0;
                int sepcounter = 0;
                int octcounter = 0;
                int novcounter = 0;
                int deccounter = 0;

                foreach (var user in ints)
                {
                    User test = db.Users.Where(x => x.User_ID == user).FirstOrDefault();
                    if (test.UserRole_ID == id)
                    {
                        AuditTrail lastLogin = db.AuditTrails.Where(x => x.Description == "Login" && x.User_ID == user).OrderByDescending(x => x.AuditTrailLogID).FirstOrDefault();
                        if (lastLogin.Date_Log >= sinceDate && lastLogin != null)
                        {
                            int monthid = lastLogin.Date_Log.Month;
                            if (monthid == jan) { jancounter++; }
                            else if (monthid == feb) { febcounter++; }
                            else if (monthid == mar) { marcounter++; }
                            else if (monthid == apr) { aprcounter++; }
                            else if (monthid == may) { maycounter++; }
                            else if (monthid == jun) { juncounter++; }
                            else if (monthid == jul) { julcounter++; }
                            else if (monthid == aug) { augcounter++; }
                            else if (monthid == sep) { sepcounter++; }
                            else if (monthid == oct) { octcounter++; }
                            else if (monthid == nov) { novcounter++; }
                            else if (monthid == dec) { deccounter++; }
                        }

                    }
                }

                List<object> results = new List<object>();
                dynamic janobj = new ExpandoObject();
                janobj.Month = "January";
                janobj.UsersInactiveSince = jancounter;
                results.Add(janobj);

                dynamic febobj = new ExpandoObject();
                febobj.Month = "February";
                febobj.UsersInactiveSince = febcounter;
                results.Add(febobj);

                dynamic marobj = new ExpandoObject();
                marobj.Month = "March";
                marobj.UsersInactiveSince = marcounter;
                results.Add(marobj);

                dynamic aprobj = new ExpandoObject();
                aprobj.Month = "April";
                aprobj.UsersInactiveSince = aprcounter;
                results.Add(aprobj);

                dynamic mayobj = new ExpandoObject();
                mayobj.Month = "May";
                mayobj.UsersInactiveSince = maycounter;
                results.Add(mayobj);

                dynamic junobj = new ExpandoObject();
                junobj.Month = "June";
                junobj.UsersInactiveSince = juncounter;
                results.Add(junobj);

                dynamic julobj = new ExpandoObject();
                julobj.Month = "July";
                julobj.UsersInactiveSince = julcounter;
                results.Add(julobj);

                dynamic augobj = new ExpandoObject();
                augobj.Month = "August";
                augobj.UsersInactiveSince = augcounter;
                results.Add(augobj);

                dynamic sepobj = new ExpandoObject();
                sepobj.Month = "September";
                sepobj.UsersInactiveSince = sepcounter;
                results.Add(sepobj);

                dynamic octobj = new ExpandoObject();
                octobj.Month = "October";
                octobj.UsersInactiveSince = octcounter;
                results.Add(octobj);

                dynamic novobj = new ExpandoObject();
                novobj.Month = "November";
                novobj.UsersInactiveSince = novcounter;
                results.Add(novobj);

                dynamic decobj = new ExpandoObject();
                decobj.Month = "December";
                decobj.UsersInactiveSince = deccounter;
                results.Add(decobj);

                UserRole role = db.UserRoles.Where(x => x.UserRole_ID == id).FirstOrDefault();
                report.Title = role.Name + " user's Inactive since " + sinceDate + " Report";
                report.Results = results;

                User userr = db.Users.Where(x => x.User_ID == 1).FirstOrDefault();
                AuditTrail InactiveUsersReport = new AuditTrail();
                InactiveUsersReport.Description = report.Title;
                InactiveUsersReport.Date_Log = DateTime.Now;
                InactiveUsersReport.User_ID = userr.User_ID;
                InactiveUsersReport.Log_History = userr.Username;
                db.AuditTrails.Add(InactiveUsersReport);
            }
            catch (Exception e)
            {
                return e;
            }
            return report;
        }

        [HttpGet]
        [Route("api/Report/BookingsPerPackage/{sinceDate}")]
        public object BookingsPerPackage(DateTime sinceDate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic report = new ExpandoObject();
            try
            {
                List<Package> packages = db.Packages.ToList();

                List<object> list = new List<object>();
                if (packages != null)
                {
                    foreach (var package in packages)
                    {
                        dynamic packageObj = new ExpandoObject();
                        packageObj.PackageName = package.Name;
                        List<Booking> bookings = db.Bookings.Where(x => x.Package_ID == package.Package_ID && x.Date > sinceDate).ToList();
                        packageObj.Count = bookings.Count;
                        list.Add(packageObj);
                    }
                    report.Title = "Bookings since " + sinceDate + " Per Package Report";
                    report.Data = list;

                    User userr = db.Users.Where(x => x.User_ID == 1).FirstOrDefault();
                    AuditTrail BookingsPerPackage = new AuditTrail();
                    BookingsPerPackage.Description = "Bookings Per Package Report";
                    BookingsPerPackage.Date_Log = DateTime.Now;
                    BookingsPerPackage.User_ID = userr.User_ID;
                    BookingsPerPackage.Log_History = userr.Username;
                    db.AuditTrails.Add(BookingsPerPackage);
                }


            }
            catch (Exception)
            {
                return null;
            }
            return report;
        }

        [HttpGet]
        [Route("api/Report/ViewTrainees")]
        public List<Trainee> ViewTrainees()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<Trainee> trainees = db.Trainees.ToList();
                return trainees;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Report/TraineePerformanceReport/{traineeid}")] // tasks
        public object TraineePerformanceReport(int traineeid)
        {
            dynamic report = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == traineeid).FirstOrDefault();
                Trainer trainer = db.Trainers.Where(x => x.Trainer_ID == trainee.Trainee_ID).FirstOrDefault();
                if (trainee != null)
                {
                    report.TraineeName = trainee.Name + " " + trainee.Surname;
                    if (trainer != null)
                    {
                        report.Trainer = trainer.Name + " " + trainer.Surname;
                    }
                    else if (trainer == null)
                    {
                        report.Trainer = "None Currently Assigned.";
                    }

                    List<Task> tasks1 = db.Tasks.Where(x => x.Trainee_ID == traineeid).ToList();
                    report.AssignmentsAssigned = tasks1.Count;
                    List<Task> tasks2 = db.Tasks.Where(x => x.Trainee_ID == traineeid && x.TaskStatus_ID == 2).ToList();
                    report.AssignmentsSubmitted = tasks2.Count;
                    List<Task> tasks3 = db.Tasks.Where(x => x.Trainee_ID == traineeid && x.TaskStatus_ID == 3).ToList();
                    report.AssignmentsCompleted = tasks3.Count;

                    report.PercentageSubmitted = (tasks2.Count / tasks1.Count) * 100;
                    report.PercentageCompleted = (tasks3.Count / tasks1.Count) * 100;

                    report.Conclusion1 = trainee.Name + " " + trainee.Surname + " has completed " + tasks3.Count + " out of " + tasks1.Count + " assignments.";
                    report.Conclusion2 = trainee.Name + " " + trainee.Surname + " has " + (tasks1.Count - tasks3.Count) + " more assignments to complete.";

                    User userrr = db.Users.Where(x => x.User_ID == 1).FirstOrDefault();
                    User userr = db.Users.Where(x => x.User_ID == trainee.User_ID).FirstOrDefault();
                    AuditTrail TraineePerformanceReport = new AuditTrail();
                    TraineePerformanceReport.Description = report.Conclusion1;
                    TraineePerformanceReport.Date_Log = DateTime.Now;
                    TraineePerformanceReport.User_ID = userrr.User_ID;
                    TraineePerformanceReport.Log_History = userr.Username;
                    db.AuditTrails.Add(TraineePerformanceReport);

                }
                return report;
            }
            catch (Exception)
            {
                return null;
            }

        }

        [HttpGet]
        [Route("api/Report/ViewClients")]
        public List<Client> ViewClients()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<Client> clients = db.Clients.ToList();
                return clients;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Report/ClientAuditReport/{clientid}")]
        public object ClientAuditReport(int clientid)
        {
            dynamic report = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                List<object> lis = new List<object>();
                dynamic obj = new ExpandoObject();

                Client client = db.Clients.Where(x => x.Client_ID == clientid).FirstOrDefault();
                Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == client.Practitioner_ID).FirstOrDefault();
                if (client != null)
                {
                    obj.ClientName = client.Name + " " + client.Surname;
                    if (practitioner != null)
                    {
                        obj.Practitioner = practitioner.Name + " " + practitioner.Surname;
                    }
                    else if (practitioner == null)
                    {
                        obj.Practitioner = "None Currently Assigned.";
                    }
                    User user = db.Users.Where(x => x.User_ID == client.User_ID).FirstOrDefault();
                    AuditTrail audit = db.AuditTrails.Where(x => x.User_ID == user.User_ID && x.Description == "Registeration").FirstOrDefault();
                    obj.DateRegistered = audit.Date_Log;
                    Result result = db.Results.Where(x => x.Client_ID == clientid).FirstOrDefault();
                    if (result != null)
                    {
                        if (result.QuestionBankType_ID == 1)
                        {
                            obj.Result = "Cactus";
                        }
                        else if (result.QuestionBankType_ID == 2)
                        {
                            obj.Result = "Fern";
                        }
                        else if (result.QuestionBankType_ID == 3)
                        {
                            obj.Result = "Sunflower";
                        }
                        else if (result.QuestionBankType_ID == 4)
                        {
                            obj.Result = "Impatients";
                        }
                    }
                    else if (result == null)
                    {
                        obj.Result = "No Score Calculated Yet.";
                    }
                    lis.Add(obj);

                    User userr = db.Users.Where(x => x.User_ID == 1).FirstOrDefault();
                    AuditTrail TraineePerformanceReport = new AuditTrail();
                    TraineePerformanceReport.Description = "Client Audit Report";
                    TraineePerformanceReport.Date_Log = DateTime.Now;
                    TraineePerformanceReport.User_ID = userr.User_ID;
                    TraineePerformanceReport.Log_History = user.Username;
                    db.AuditTrails.Add(TraineePerformanceReport);
                }

                report = lis;
                return report;
            }
            catch (Exception)
            {
                return null;
            }

        }


    }
}
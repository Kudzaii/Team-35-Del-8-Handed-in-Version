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
using System.Linq.Expressions;


namespace API_FICS.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ClientController : ApiController
    {
        FICSEntities db = new FICSEntities();

        [HttpGet]
        [Route("api/Client/TrialQuestionnaire")]
        public List<object> TrialQuestionnaire()
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> results = new List<object>();
            try
            {
                List<QuestionTitle> titles = db.QuestionTitles.ToList();
                List<QuestionTitle> trial = new List<QuestionTitle>();
                foreach (var title in titles)
                {
                    if (title.QuestionTitle_ID == 1 || title.QuestionTitle_ID == 2 || title.QuestionTitle_ID == 3)
                    {
                        trial.Add(title);
                    }
                }
                foreach (var title in trial)
                {
                    dynamic obj = new ExpandoObject();
                    obj.QuestionTitle_ID = title.QuestionTitle_ID;
                    obj.QuestionTitle = title.Description;
                    List<object> questions = new List<object>();
                    List<QuestionDetail> details = db.QuestionDetails.Where(x => x.QuestionTitle_ID == title.QuestionTitle_ID).ToList();

                    foreach (var detail in details)
                    {
                        dynamic obje = new ExpandoObject();
                        obje.Question_ID = detail.Question_ID;
                        obje.Question = detail.Question;
                        obje.Question_Image = detail.Question_Image;
                        questions.Add(obje);
                    }
                    obj.Questions = questions;
                    results.Add(obj);
                }
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/CompleteTrialQuestionnare/{questionnaireID}/{clientid}/{answer}")]
        public object CompleteTrialQuestionnare(int questionnaireID, int clientid, int answer)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic questionnares = new ExpandoObject();

            try
            {
                QuestionAnswer a = db.QuestionAnswers.Where(x => x.Question_ID == questionnaireID && x.Client_ID == clientid).LastOrDefault();
                if (a != null)
                {
                    a.Answer = answer;
                    db.SaveChanges();
                    questionnares = a;
                }
            }
            catch (Exception)
            {
                return null;
            }
            return questionnares;
        }

        [HttpGet]
        [Route("api/Client/ViewClientQuestionnares/{clientid}")] //View All Questionnares linked to a Client
        public object ViewClientQuestionnares(int clientid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic questionnares = new ExpandoObject();

            try
            {
                List<QuestionAnswer> unanswered = db.QuestionAnswers.Where(x => x.Client_ID == clientid && x.Answer == null).ToList();
                List<QuestionAnswer> answered = db.QuestionAnswers.Where(x => x.Client_ID == clientid && x.Answer != null).ToList();

                List<object> UA_questions = new List<object>();
                List<object> A_questions = new List<object>();
                foreach (var q in unanswered)
                {
                    QuestionDetail detail = db.QuestionDetails.Where(x => x.Question_ID == q.Question_ID).FirstOrDefault();
                    QuestionTitle title = db.QuestionTitles.Where(x => x.QuestionTitle_ID == detail.QuestionTitle_ID).FirstOrDefault();

                    dynamic obj = new ExpandoObject();
                    obj.QuestionTitle_ID = title.QuestionTitle_ID;
                    obj.QuestionTitle_Description = title.Description;
                    obj.QuestionID = q.Question_ID;
                    obj.Question = detail.Question;
                    UA_questions.Add(obj);
                }
                foreach (var q in answered)
                {
                    QuestionDetail detail = db.QuestionDetails.Where(x => x.Question_ID == q.Question_ID).FirstOrDefault();
                    QuestionTitle title = db.QuestionTitles.Where(x => x.QuestionTitle_ID == detail.QuestionTitle_ID).FirstOrDefault();

                    dynamic obj = new ExpandoObject();
                    obj.QuestionTitle_ID = title.QuestionTitle_ID;
                    obj.QuestionTitle_Description = title.Description;
                    obj.QuestionID = q.Question_ID;
                    obj.Question = detail.Question;
                    obj.Answer = q.Answer;

                    A_questions.Add(obj);
                }
                questionnares.Answered = A_questions;
                questionnares.Unanswered = UA_questions;
            }
            catch (Exception)
            {
                return null;
            }
            return questionnares;
        }

        [HttpPost]
        [Route("api/Client/CompleteQuestionnare/")]
        public object CompleteQuestionnare([FromBody] List<List<int>> questions)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic questionnares = new ExpandoObject();

            //[ ALGORITHM STRUCTURE
            // {
            //  "ClientID": 1,
            //  "QuestionID": 5,
            //  "Answers" : [1 , 3 , 2 ,4]
            // },
            // {
            //  "ClientID": 1,
            //  "QuestionID": 6,
            //  "Answers" : [2, 2 , 2 ,4]
            // }
            //]
            //[1,5,1,3,2,4], [1,6,2,2,2,4]
            //]
            int c_id = 0;
            try
            {
                foreach (List<int> question in questions)
                {
                    if (question.Count == 6)
                    {
                        int[] intarray = question.ToArray();

                        foreach (var q in question)
                        {
                            int t_id = intarray[1];
                            List<QuestionDetail> details = db.QuestionDetails.Where(x => x.QuestionTitle_ID == t_id).ToList();
                            List<int> find = new List<int>();
                            foreach (var detail in details)
                            {
                                find.Add(detail.Question_ID);
                            }
                            int[] intarray2 = find.ToArray();
                            int loop = 1;
                            foreach (int f in intarray2)
                            {
                                if (loop != 1)
                                {
                                    loop++;
                                }
                                c_id = intarray[0];
                                QuestionAnswer a = db.QuestionAnswers.Where(x => x.Question_ID == f && x.Client_ID == c_id && x.Answer == null).FirstOrDefault();
                                if (a != null)
                                {
                                    int a_id = 0;
                                    if (Array.IndexOf(intarray2, f) == 0)
                                    {
                                        a_id = intarray[2];
                                    }
                                    else if (Array.IndexOf(intarray2, f) == 1)
                                    {
                                        a_id = intarray[3];
                                    }
                                    else if (Array.IndexOf(intarray2, f) == 2)
                                    {
                                        a_id = intarray[4];
                                    }
                                    else if (Array.IndexOf(intarray2, f) == 3)
                                    {
                                        a_id = intarray[5];
                                    }
                                    a.Answer = a_id;
                                    db.SaveChanges();
                                }
                            }
                        }
                    }
                    else if (question.Count == 3) //5 = NO & 6 = YES
                    {
                        int[] intarray = question.ToArray();

                        foreach (var q in question)
                        {
                            int t_id = intarray[1];
                            List<QuestionDetail> details = db.QuestionDetails.Where(x => x.QuestionTitle_ID == t_id).ToList();
                            List<int> find = new List<int>();
                            foreach (var detail in details)
                            {
                                find.Add(detail.QuestionTitle_ID);
                            }
                            int[] intarray2 = find.ToArray();
                            int loop = 1;
                            foreach (int f in intarray2)
                            {
                                if (loop != 1)
                                {
                                    loop++;
                                }
                                c_id = intarray[0];
                                QuestionAnswer a = db.QuestionAnswers.Where(x => x.Question_ID == f && x.Client_ID == c_id && x.Answer == null).FirstOrDefault();
                                if (a != null)
                                {
                                    int a_id = 0;
                                    a_id = intarray[2];
                                    a.Answer = a_id;
                                    db.SaveChanges();
                                }
                            }
                        }
                    }
                }
                CalculateScore(c_id);
            }
            catch (Exception)
            {
                return null;
            }
            return questionnares;
        }


        public object CalculateScore(int clientid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic obj = new ExpandoObject();

            try
            {
                QuestionBankType cactus = db.QuestionBankTypes.Where(x => x.Description == "Cactus").FirstOrDefault();
                QuestionBankType fern = db.QuestionBankTypes.Where(x => x.Description == "Fern").FirstOrDefault();
                QuestionBankType sunflower = db.QuestionBankTypes.Where(x => x.Description == "Sunflower").FirstOrDefault();
                QuestionBankType impatients = db.QuestionBankTypes.Where(x => x.Description == "Impatients").FirstOrDefault();

                int c = 0;
                int f = 0;
                int s = 0;
                int i = 0;

                List<QuestionAnswer> questionAnswers = db.QuestionAnswers.Where(x => x.Client_ID == clientid).ToList();
                List<int> answers = new List<int>();
                foreach (var qA in questionAnswers)
                {
                    answers.Add(Convert.ToInt32(qA.Answer));
                }
                foreach (var a in answers)
                {
                    if (cactus.QuestionBankType_ID == 1 && fern.QuestionBankType_ID == 2 && sunflower.QuestionBankType_ID == 3 && impatients.QuestionBankType_ID == 4)
                    {
                        if (a == cactus.QuestionBankType_ID)
                        {
                            c++;
                        }
                        else if (a == fern.QuestionBankType_ID)
                        {
                            f++;
                        }
                        else if (a == sunflower.QuestionBankType_ID)
                        {
                            s++;
                        }
                        else if (a == impatients.QuestionBankType_ID)
                        {
                            i++;
                        }
                        else if (a == 5)
                        {
                            s++;
                        }
                        else if (a == 6)
                        {
                            c++;
                        }
                    }
                }
                List<int> ids = new List<int>();
                ids.Add(c);
                ids.Add(f);
                ids.Add(s);
                ids.Add(i);
                int[] intarray = ids.ToArray();
                int largest = intarray[0];

                List<string> names = new List<string>();
                foreach (var ii in ids)
                {
                    if (ii > largest)
                    {
                        largest = ii;
                    }
                    else if (ii == largest)
                    {
                        largest = ii;
                    }
                }
                int score = 0;
                if (largest == c)
                {
                    score = cactus.QuestionBankType_ID;
                }
                if (largest == f)
                {
                    score = fern.QuestionBankType_ID;
                }
                if (largest == s)
                {
                    score = sunflower.QuestionBankType_ID;
                }
                if (largest == i)
                {
                    score = impatients.QuestionBankType_ID;
                }

                Result result = db.Results.Where(x => x.Client_ID == clientid).FirstOrDefault();
                if (result != null)
                {
                    result.QuestionBankType_ID = score;
                    db.SaveChanges();
                }
                else if (result == null)
                {
                    Result r = new Result();
                    r.Client_ID = clientid;
                    r.QuestionBankType_ID = score;
                    db.Results.Add(r);
                    db.SaveChanges();
                }

                obj = result;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/ViewPackages")]
        public object ViewPackages()
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic packages = new ExpandoObject();
            try
            {
                List<Package> p = db.Packages.ToList();

                List<object> list = new List<object>();
                if (packages != null)
                {
                    foreach (var package in p)
                    {
                        Price price = db.Prices.Where(x => x.Package_ID == package.Package_ID).FirstOrDefault();
                        dynamic obj = new ExpandoObject();
                        obj.Package_ID = package.Package_ID;
                        obj.Name = package.Name;
                        obj.Description = package.Description;
                        obj.Image = package.Image;
                        obj.Purchase_Date = package.Purchase_Date;
                        //obj.Price = price.Amount;
                        obj.Quantity = package.Quantity;
                        list.Add(obj);
                    }

                    packages.Questions = list;
                }
            }
            catch (Exception c)
            {
                return c;
            }
            return packages;
        }

        [HttpPost]
        [Route("api/Client/PurchasePackages/{packageid}/{clientid}/{quantity}")]
        public object PurchasePackages(int packageid, int clientid, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic package = new ExpandoObject();
            try
            {
                Package p = db.Packages.Where(x => x.Package_ID == packageid).FirstOrDefault();
                Price price = db.Prices.Where(x => x.Package_ID == p.Package_ID).FirstOrDefault();
                Client client = db.Clients.Where(x => x.Client_ID == clientid).FirstOrDefault();

                Sale sale = new Sale();
                sale.Description = p.Name + " Sale: " + client.Name + " " + client.Surname;
                sale.PaymentType = "EFT";
                sale.Date = DateTime.Now;
                sale.Total = price.Amount * quantity;
                sale.Client_ID = client.Client_ID;
                db.Sales.Add(sale);
                db.SaveChanges();

                Sale sl = db.Sales.Find(sale.Sale_ID);

                if (sl != null)
                {
                    SaleLine saleLine = new SaleLine();
                    saleLine.Package_ID = p.Package_ID;
                    saleLine.Sale_ID = sl.Sale_ID;
                    saleLine.Quantity = quantity;
                    db.Entry(saleLine).State = System.Data.Entity.EntityState.Unchanged;
                    db.SaleLines.Add(saleLine);
                    db.SaveChanges();

                    package.Saleline = saleLine;
                }

                User userr = db.Users.Where(x => x.User_ID == client.User_ID).FirstOrDefault();
                AuditTrail PurchasePackages = new AuditTrail();
                PurchasePackages.Description = sale.Description;
                PurchasePackages.Date_Log = DateTime.Now;
                PurchasePackages.User_ID = userr.User_ID;
                PurchasePackages.Log_History = userr.Username;
                db.AuditTrails.Add(PurchasePackages);
                AccessController.SendEmail(client.Email_Address, 3, package);
                package.Sale = sale;
            }
            catch (Exception c)
            {
                return c;
            }
            return package;
        }

        [HttpGet]
        [Route("api/Client/ViewClientProfile/{id}")]
        public object ViewClientProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic client = new ExpandoObject();
            try
            {
                Client c = db.Clients.Where(x => x.User_ID == id).FirstOrDefault();

                if (c != null)
                {
                    client.Client_ID = c.Client_ID;
                    client.Title = c.Title;
                    client.Name = c.Name;
                    client.Surname = c.Surname;
                    client.ID_Number = c.ID_Number;
                    client.Passport_Number = c.Passport_Number;
                    client.Email_Address = c.Email_Address;
                    client.Contact_Number = c.Contact_Number;
                    client.Gender = c.Gender;
                    client.Country = c.Country;
                    client.Client_Status = c.Client_Status;
                }
            }
            catch (Exception)
            {
                return null;
            }
            return client;
        }

        [HttpPost]
        [Route("api/Client/MaintainClientProfile")]
        public object MaintainClientProfile([FromBody] Client c)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic data = new ExpandoObject();

            try
            {
                Client client = db.Clients.Where(x => x.Client_ID == c.Client_ID).FirstOrDefault();
                if (c != null)
                {
                    client.Client_ID = c.Client_ID;
                    client.Title = c.Title;
                    client.Name = c.Name;
                    client.Surname = c.Surname;
                    client.ID_Number = c.ID_Number;
                    client.Passport_Number = c.Passport_Number;
                    client.Email_Address = c.Email_Address;
                    client.Contact_Number = c.Contact_Number;
                    client.Gender = c.Gender;
                    client.Country = c.Country;
                    client.Client_Status = c.Client_Status;
                    db.SaveChanges();
                    data = client;
                }
                return data;
            }
            catch
            {
                string err = "Client Maintain failed.";
                return Ok(err);
            }
        }

        [HttpGet]
        [Route("api/Client/GetSessions/{id}")]
        public object GetSessions(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic data = new ExpandoObject();
            try
            {
                List<Session> session = db.Sessions.Where(x => x.Client_ID == id).ToList();
                data = session;
                return data;
            }
            catch
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/ReviewSessionFeedback/{id}")]
        public object ReviewSessionFeedback(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic data = new ExpandoObject();

            try
            {
                Session session = db.Sessions.Where(x => x.Session_ID == id).FirstOrDefault();
                if (session != null)
                {
                    data.Feedback = session.Feedback;
                }
                else if (session == null)
                {
                    data.Feedback = "No Feedback on this session yet.";
                }
                return data;
            }
            catch
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/ViewTasks/{clientID}")]
        public List<object> ViewTasks(int clientID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> data = new List<object>();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Client_ID == clientID && x.TaskStatus_ID == 1).ToList();
                foreach (var task in tasks)
                {
                    TaskType taskType = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                    TaskStatu taskStatus = db.TaskStatus.Where(x => x.TaskStatus_ID == task.TaskStatus_ID).FirstOrDefault();
                    Practitioner p = db.Practitioners.Where(x => x.Practitioner_ID == task.Practitioner_ID).FirstOrDefault();
                    dynamic obj = new ExpandoObject();
                    obj.Task_ID = task.Task_ID;
                    obj.Description = task.Description;
                    obj.Feedback = task.Feedback;
                    obj.StartDate = task.StartDate;
                    obj.DueDate = task.DueDate;
                    obj.TaskTypeName = taskType.Name;
                    obj.TaskTypeDescription = taskType.Description;
                    obj.TaskStatus = taskStatus.Description;
                    obj.Practitioner = p.Name + " " + p.Surname;
                    data.Add(obj);
                }
                return data;
            }
            catch
            {
                return null;
            }
        }
        [HttpGet]
        [Route("api/Client/ViewTask/{taskid}")]
        public object ViewTask(int taskid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            object data = new ExpandoObject();
            List<object> results = new List<object>();
            try
            {
                Task task = db.Tasks.Where(x => x.Task_ID == taskid).FirstOrDefault();

                TaskType taskType = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                TaskStatu taskStatus = db.TaskStatus.Where(x => x.TaskStatus_ID == task.TaskStatus_ID).FirstOrDefault();
                Practitioner p = db.Practitioners.Where(x => x.Practitioner_ID == task.Practitioner_ID).FirstOrDefault();

                dynamic obj = new ExpandoObject();
                obj.Task_ID = task.Task_ID;
                obj.Description = task.Description;
                obj.Feedback = task.Feedback;
                obj.StartDate = task.StartDate;
                obj.DueDate = task.DueDate;
                obj.TaskTypeName = taskType.Name;
                obj.TaskTypeDescription = taskType.Description;
                obj.TaskStatus = taskStatus.Description;
                obj.Practitioner = p.Name + " " + p.Surname;
                data = obj;
                results.Add(obj);

                data = results;
                return data;
            }
            catch
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/GetAvailableDates")]
        public object GetAvailableDates()
        {

            object avail = new ExpandoObject();
            List<object> list = new List<object>();

            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<Date> dates = db.Dates.ToList();
                foreach (var date in dates)
                {
                    dynamic obj = new ExpandoObject();
                    obj.Date_ID = date.Date_ID;
                    obj.Date = date.Date1;

                    list.Add(obj);
                }
                avail = list;
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/GetPractitionerAvailableDates/{id}")]
        public object GetPractitionerAvailableDates(int id)
        {

            object avail = new ExpandoObject();
            List<object> list = new List<object>();

            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<Availability> availabilities = db.Availabilities.Where(rs => rs.Practitioner_ID == id && rs.Client_ID == null).ToList();
                foreach (var aval in availabilities)
                {
                    List<Date> dates = db.Dates.ToList();
                    foreach (var date in dates)
                    {
                        dynamic obj = new ExpandoObject();
                        obj.Date_ID = date.Date_ID;
                        obj.Date = date.Date1;

                        if (aval.Date_ID == obj.Date_ID && !list.Contains(obj))
                            list.Add(obj);
                    }
                }

                avail = list;
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }


        [HttpGet]
        [Route("api/Client/GetDateAvailability/{date}")] //gets available slots for selected day, remember to send the id to boooking as the {availabilityid}
        public object GetDateAvailability(DateTime date)
        {
            object avail = new ExpandoObject();
            List<object> list = new List<object>();

            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Date day = db.Dates.Where(x => x.Date1 == date).FirstOrDefault();
                if (day != null)
                {
                    List<Availability> availabilities = db.Availabilities.Where(x => x.Date_ID == day.Date_ID && x.Practitioner_ID != null && x.Client_ID == null).ToList();
                    foreach (var a in availabilities)
                    {
                        dynamic obj = new ExpandoObject();
                        obj.Availability_ID = a.Availability_ID;
                        obj.Date = day.Date1;
                        obj.Practitioner_ID = a.Practitioner_ID;
                        TimeSlot slot = db.TimeSlots.Where(x => x.TimeSlot_ID == a.TimeSlot_ID).FirstOrDefault();
                        obj.Time = slot.StartTime + " - " + slot.EndTime;
                        obj.TimeSlot_ID = slot.TimeSlot_ID;
                        if (a.Practitioner_ID != null)
                        {
                            Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == a.Practitioner_ID).FirstOrDefault();
                            obj.Practitioner = practitioner.Title + ". " + practitioner.Name + " " + practitioner.Surname;
                        }
                        list.Add(obj);
                    }

                    avail = list;
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/GetSessionTypes/")]
        public object GetSessionTypes()
        {
            object avail = new ExpandoObject();
            List<object> list = new List<object>();

            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<SessionType> types = db.SessionTypes.ToList();
                if (types != null)
                {
                    foreach (var type in types)
                    {
                        list.Add(type);
                    }
                    avail = list;
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }


        [HttpGet]
        [Route("api/Client/GetClientPackages/{clientId}")] //gets available slots for selected day, remember to send the id to boooking as the {availabilityid}
        public object GetClientPackages(int clientId)
        {
            object avail = new ExpandoObject();
            List<object> list = new List<object>();

            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<Sale> sales = db.Sales.Where(zz => zz.Client_ID == clientId).ToList();

                if (sales != null)
                {
                    foreach (var sale in sales)
                    {
                        SaleLine saleLine = db.SaleLines.Where(zz => zz.Sale_ID == sale.Sale_ID).FirstOrDefault();
                        Package package = db.Packages.Where(x => x.Package_ID == saleLine.Package_ID).FirstOrDefault();
                        Price price = db.Prices.Where(x => x.Package_ID == package.Package_ID).FirstOrDefault();

                        //add price


                        list.Add(package);
                    }
                    avail = list;
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Client/BookSession/{availabilityid}")]
        public object BookSession([FromBody] SessionBooking book, int availabilityid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic bookedsession = new ExpandoObject();
            try
            {
                TimeSlot slot = db.TimeSlots.Where(x => x.TimeSlot_ID == book.Slot_ID).FirstOrDefault();
                Client client = db.Clients.Where(x => x.Client_ID == book.Client_ID).FirstOrDefault();
                Package package = db.Packages.Where(x => x.Package_ID == book.Package_ID).FirstOrDefault();
                Booking prevCheck = new Booking();
                prevCheck = null;
                if (db.Bookings.Count() > 0)
                {
                    List<Booking> bookings = db.Bookings.Where(x => x.Package_ID == book.Package_ID && x.Client_ID == book.Client_ID).ToList();
                    prevCheck = bookings.LastOrDefault();
                }

                Booking slotBooked = db.Bookings.Where(x => x.Start_Time == slot.StartTime && x.Date == book.Date).FirstOrDefault();

                if ((slot != null && client != null && package != null) && slotBooked == null && book.Date >= DateTime.Now)
                {
                    if (prevCheck == null || prevCheck.Date < book.Date)
                    {
                        List<Session> s = db.Sessions.Where(x => x.Client_ID == client.Client_ID && x.Package_ID == book.Package_ID).ToList();
                        int booked = s.Count;
                        int total = package.Quantity;
                        if (booked < total)
                        {
                            Booking booking = new Booking();
                            booking.Date = book.Date;
                            booking.Start_Time = slot.StartTime;
                            booking.End_Time = slot.EndTime;
                            User user = db.Users.Where(x => x.User_ID == client.User_ID).FirstOrDefault();
                            booking.User_ID = user.User_ID;
                            booking.BookingStatus_ID = 1;
                            booking.Client_ID = client.Client_ID;
                            booking.Package_ID = package.Package_ID;
                            booking.SessionType_ID = book.SessionType_ID;
                            db.Bookings.Add(booking);
                            db.SaveChanges();

                            if (booking != null)
                            {
                                Session session = new Session();
                                session.Description = "Session " + (booked + 1) + "/" + total + " - " + client.Title + " " + client.Name.Substring(0, 1) + "." + client.Surname;
                                session.Start_Time = slot.StartTime;
                                session.End_Time = slot.EndTime;
                                session.Date = book.Date;
                                session.Package_ID = package.Package_ID;
                                session.Client_ID = client.Client_ID;
                                session.TimeSlot_ID = slot.TimeSlot_ID;
                                session.Booking_ID = booking.Booking_ID;
                                session.Session_Number = booked + 1;
                                db.Sessions.Add(session);
                                db.SaveChanges();

                                bookedsession.Booking = booking;
                                bookedsession.Session = session;

                                AuditTrail sessionBooking = new AuditTrail();
                                sessionBooking.Description = "Session " + (booked + 1) + "/" + total + " - " + client.Title + " " + client.Name.Substring(0, 1) + "." + client.Surname;
                                sessionBooking.Date_Log = DateTime.Now;
                                sessionBooking.User_ID = user.User_ID;
                                sessionBooking.Log_History = user.Username;
                                db.AuditTrails.Add(sessionBooking);
                                db.SaveChanges();

                                BookOutAvailability(availabilityid, book.Client_ID); //When Availability is confirmed with client
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return e;
            }
            return bookedsession;
        }
        public object BookOutAvailability(int availabilityid, int clientid)
        {
            object avail = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Availability available = db.Availabilities.Where(x => x.Availability_ID == availabilityid).FirstOrDefault();
                if (available != null)
                {
                    available.Client_ID = clientid;
                    db.SaveChanges();
                    avail = available;
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Client/RescheduleSession/{availabilityid}")]
        public object RescheduleSession([FromBody] SessionBooking book, int availabilityid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic bookedsession = new ExpandoObject();
            try
            {
                Booking booking = db.Bookings.Where(x => x.Booking_ID == book.Booking_ID).FirstOrDefault();
                TimeSlot slot = db.TimeSlots.Where(x => x.TimeSlot_ID == book.Slot_ID).FirstOrDefault();
                Client client = db.Clients.Where(x => x.Client_ID == booking.Client_ID).FirstOrDefault();
                Package package = db.Packages.Where(x => x.Package_ID == booking.Package_ID).FirstOrDefault();
                Booking prevCheck = new Booking();
                prevCheck = null;
                if (db.Bookings.Count() > 0)
                {
                    List<Booking> bookings = db.Bookings.Where(x => x.Package_ID == booking.Package_ID && x.Client_ID == booking.Client_ID).ToList();
                    prevCheck = bookings.LastOrDefault();
                }

                Booking slotBooked = db.Bookings.Where(x => x.Start_Time == slot.StartTime && x.Date == book.Date).FirstOrDefault();

                List<Session> sessions = db.Sessions.Where(x => x.Client_ID == client.Client_ID && x.Package_ID == book.Package_ID).ToList();

                int before, after;
                Session s = db.Sessions.Where(x => x.Booking_ID == book.Booking_ID).FirstOrDefault();
                int current = s.Session_ID;
                List<int> find = new List<int>();
                Session sBefore = null;
                Session sAfter = null;
                int booked = 0;
                foreach (var sess in sessions)
                {
                    find.Add(sess.Session_ID);
                }
                int[] intarray = find.ToArray();
                foreach (var iter in intarray)
                {
                    if (iter == current)
                    {
                        booked = Array.IndexOf(intarray, iter) + 1;
                        before = Array.IndexOf(intarray, iter);
                        int indexBefore = 0;
                        if (before > 0)
                        {
                            indexBefore = before - 1;
                        }
                        else if (before == 0)
                        {
                            indexBefore = before;
                        }


                        after = Array.IndexOf(intarray, iter);
                        int indexAfter = 0;
                        if (intarray.Length != 1)
                        {
                            indexAfter = after;
                        }


                        int b = intarray[indexBefore];
                        int a = intarray[indexAfter];

                        sBefore = db.Sessions.Where(x => x.Session_ID == b).FirstOrDefault();
                        sAfter = db.Sessions.Where(x => x.Session_ID == a).FirstOrDefault();
                    }
                }

                if ((slot != null && client != null && package != null) && slotBooked == null && booking.Date >= DateTime.Now)
                {
                    if (book.Date <= sAfter.Date && book.Date >= sBefore.Date)
                    {
                        List<Session> sess = db.Sessions.Where(x => x.Client_ID == client.Client_ID && x.Package_ID == booking.Package_ID).ToList();
                        int total = package.Quantity;

                        booking.Date = book.Date;
                        booking.Start_Time = slot.StartTime;
                        booking.End_Time = slot.EndTime;
                        db.SaveChanges();

                        Session session = db.Sessions.Where(x => x.Booking_ID == book.Booking_ID).FirstOrDefault();
                        session.Description = "Rescheduled " + booked + "/" + total + " - " + client.Title + " " + client.Name.Substring(0, 1) + "." + client.Surname;
                        session.Start_Time = slot.StartTime;
                        session.End_Time = slot.EndTime;
                        session.Date = book.Date;
                        session.TimeSlot_ID = slot.TimeSlot_ID;
                        db.SaveChanges();

                        bookedsession.Booking = booking;
                        bookedsession.Session = session;

                        RescheduleAvailability(availabilityid, book.Client_ID); //When Availability is confirmed with client
                    }
                }
            }
            catch (Exception e)
            {
                return e;
            }
            return bookedsession;
        }
        public object RescheduleAvailability(int availabilityid, int clientid)
        {
            object avail = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Availability available = db.Availabilities.Where(x => x.Availability_ID == availabilityid).FirstOrDefault();
                if (available != null)
                {
                    available.Client_ID = clientid;
                    db.SaveChanges();
                    avail = available;
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/ViewSchedule/{clientID}")]
        public object ViewSchedule(int clientID) //get session that gets future sessions
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic schedule = new ExpandoObject();
            Client client = db.Clients.Where(x => x.Client_ID == clientID).FirstOrDefault();

            try
            {
                List<Session> sessions = db.Sessions.Where(x => x.Client_ID == clientID && x.Date > DateTime.Now).ToList();
                List<object> list = new List<object>();
                if (sessions != null)
                {
                    foreach (var session in sessions)
                    {
                        dynamic obj = new ExpandoObject();
                        obj.Session_ID = session.Session_ID;
                        obj.Description = session.Description;
                        obj.Date = session.Date;
                        obj.Start_Time = session.Start_Time;
                        obj.End_Time = session.End_Time;
                        Package package = db.Packages.Where(x => x.Package_ID == session.Package_ID).FirstOrDefault();
                        Booking booking = db.Bookings.Where(x => x.Booking_ID == session.Booking_ID).FirstOrDefault();
                        TimeSlot timeSlot = db.TimeSlots.Where(x => x.TimeSlot_ID == session.TimeSlot_ID).FirstOrDefault();
                        obj.Package_ID = package.Package_ID;
                        obj.Booking_ID = booking.Booking_ID;
                        obj.Slot_ID = timeSlot.TimeSlot_ID;
                        obj.PackageName = package.Name;
                        list.Add(obj);
                    }
                    schedule = list;
                }
                else if (sessions == null)
                {
                    schedule = "No sessions booked " + client.Name + " " + client.Surname + ".";
                }
            }
            catch (Exception e)
            {
                return e;
            }
            return schedule;
        }
        [HttpGet]
        [Route("api/Client/ViewSession/{sessionid}")]
        public object ViewSession(int sessionid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            object data = new ExpandoObject();

            try
            {
                Session session = db.Sessions.Where(x => x.Session_ID == sessionid).FirstOrDefault();

                dynamic obj = new ExpandoObject();
                obj.Session_ID = session.Session_ID;
                obj.Description = session.Description;
                obj.Date = session.Date;
                obj.Start_Time = session.Start_Time;
                obj.End_Time = session.End_Time;
                Package package = db.Packages.Where(x => x.Package_ID == session.Package_ID).FirstOrDefault();
                Booking booking = db.Bookings.Where(x => x.Booking_ID == session.Booking_ID).FirstOrDefault();
                TimeSlot timeSlot = db.TimeSlots.Where(x => x.TimeSlot_ID == session.TimeSlot_ID).FirstOrDefault();
                obj.Package_ID = package.Package_ID;
                obj.Booking_ID = booking.Booking_ID;
                obj.Slot_ID = timeSlot.TimeSlot_ID;
                obj.PackageName = package.Name;
                data = obj;

            }
            catch (Exception e)
            {
                return e;
            }
            return data;
        }

        [HttpGet]
        [Route("api/Client/ViewProgressReport/{clientID}")]
        public object ViewProgressReport(int clientID)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic progress = new ExpandoObject();

            try
            {
                Client client = db.Clients.Where(x => x.Client_ID == clientID).FirstOrDefault();
                ClientProgress p = db.ClientProgresses.Where(x => x.ClientProgress_ID == client.ClientProgress_ID).FirstOrDefault();

                if (p != null)
                {
                    progress.Description = p.Description;
                    progress.Feedback = p.Feedback;
                }
                else if (p == null)
                {
                    progress.Description = "No Provided Feedback Yet";
                    progress.Feedback = "No Provided Feedback Yet";
                }

            }
            catch
            {
                return null;
            }
            return progress;
        }

        [HttpGet]
        [Route("api/Client/GetTasks/{clientid}")]
        public object GetTasks(int clientid)
        {
            object data = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            List<object> objects = new List<object>();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Client_ID == clientid && x.TaskStatus_ID == 1).ToList();
                foreach (var task in tasks)
                {
                    dynamic obj = new ExpandoObject();

                    Task t = db.Tasks.Where(x => x.Task_ID == task.Task_ID).FirstOrDefault();
                    obj.Task_ID = task.Task_ID;
                    obj.Description = task.Description;
                    obj.DueDate = t.DueDate;
                    obj.Feedback = task.Feedback;
                    Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == task.Practitioner_ID).FirstOrDefault();
                    obj.Practitioner = practitioner.Title + ". " + practitioner.Name + " " + practitioner.Surname;
                    TaskType type = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                    obj.TaskType = type.Name;
                    objects.Add(obj);
                }
                data = objects;
                return data;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Client/CompleteTask/{taskid}")]
        public object CompleteTask([FromBody] TaskDocument task, int taskid)
        {
            object tasks = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                Task t = db.Tasks.Where(x => x.Task_ID == taskid).FirstOrDefault();
                t.TaskStatus_ID = 2;
                t.StartDate = DateTime.Now;
                db.SaveChanges();

                TaskDocument taskDocument = new TaskDocument();
                taskDocument = task;
                taskDocument.Task_ID = t.Task_ID;
                db.TaskDocuments.Add(taskDocument);
                db.SaveChanges();

                tasks = task;

                return tasks;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Client/ViewFeedbackNotes/{clientid}")]
        public object ViewFeedbackNotes(int clientid)
        {
            object data = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            List<object> objects = new List<object>();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Client_ID == clientid && x.Feedback != null && x.TaskStatus_ID == 3).ToList();
                foreach (var task in tasks)
                {
                    dynamic obj = new ExpandoObject();

                    Task t = db.Tasks.Where(x => x.Task_ID == task.Task_ID).FirstOrDefault();
                    obj.Task_ID = task.Task_ID;
                    obj.StartDate = t.StartDate;
                    obj.DueDate = t.DueDate;
                    obj.Feedback = task.Feedback;
                    Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == task.Practitioner_ID).FirstOrDefault();
                    obj.Practitioner = practitioner.Title + ". " + practitioner.Name + " " + practitioner.Surname;
                    TaskType type = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                    obj.TaskType = type.Name;
                    TaskDocument taskDocument = db.TaskDocuments.Where(x => x.Task_ID == task.Task_ID).FirstOrDefault();
                    obj.TaskDescription = taskDocument.Description;
                    if (taskDocument.Image != null)
                    {
                        obj.TaskImage = taskDocument.Image;
                    }
                    else if (taskDocument.Image == null)
                    {
                        obj.TaskImage = null;
                    }
                    if (taskDocument.PDF != null)
                    {
                        obj.TaskPDF = taskDocument.PDF;
                    }
                    else if (taskDocument.PDF == null)
                    {
                        obj.TaskPDF = null;
                    }
                    objects.Add(obj);
                }
                data = objects;
                return data;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        //[HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("api/Client/UploadExitWaiver/{clientid}")]
        public IHttpActionResult UploadExitWaiver(byte[] file, [FromUri] int clientid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Client client = db.Clients.Where(x => x.Client_ID == clientid).FirstOrDefault();
                User user = db.Users.Where(x => x.User_ID == client.User_ID).FirstOrDefault();

                DocumentType documentType = db.DocumentTypes.Where(x => x.Description == "Exit Waiver").FirstOrDefault();

                //string f = file.file;
                Document exitWaiver = new Document();
                exitWaiver.DocumentType_ID = documentType.DocumentType_ID;
                exitWaiver.User_ID = user.User_ID;
                //exitWaiver.Document1 = file.Document1; 
                db.Documents.Add(exitWaiver);
                db.SaveChanges();

                return Ok(documentType);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet]
        [Route("api/Client/ViewPerformanceReport/{clientid}")]
        public object ViewPerformanceReport(int clientid)
        {
            dynamic report = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                Client client = db.Clients.Where(x => x.Client_ID == clientid).FirstOrDefault();
                Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == client.Practitioner_ID).FirstOrDefault();
                if (client != null)
                {
                    report.ClientName = client.Name + " " + client.Surname;
                    if (practitioner != null)
                    {
                        report.Practitioner = practitioner.Name + " " + practitioner.Surname;
                    }
                    else if (practitioner == null)
                    {
                        report.Practitioner = "None Currently Assigned.";
                    }
                    User user = db.Users.Where(x => x.User_ID == client.User_ID).FirstOrDefault();
                    AuditTrail audit = db.AuditTrails.Where(x => x.User_ID == user.User_ID && x.Description == "Registeration").FirstOrDefault();
                    report.DateRegistered = audit.Date_Log;
                    Result result = db.Results.Where(x => x.Client_ID == clientid).FirstOrDefault();
                    if (result != null)
                    {
                        if (result.QuestionBankType_ID == 1)
                        {
                            report.Result = "Cactus";
                        }
                        else if (result.QuestionBankType_ID == 2)
                        {
                            report.Result = "Fern";
                        }
                        else if (result.QuestionBankType_ID == 3)
                        {
                            report.Result = "Sunflower";
                        }
                        else if (result.QuestionBankType_ID == 4)
                        {
                            report.Result = "Impatients";
                        }
                    }
                    else if (result == null)
                    {
                        report.Result = "No Score Calculated Yet.";
                    }

                }


                return report;
            }
            catch (Exception)
            {
                return null;
            }

        }
    }
}
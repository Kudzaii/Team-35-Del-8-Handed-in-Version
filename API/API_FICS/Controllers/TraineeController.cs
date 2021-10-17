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
using System.Data.Entity.Infrastructure;

namespace API_FICS.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class TraineeController : ApiController
    {
        FICSEntities db = new FICSEntities();
        [HttpGet]
        [Route("api/Trainee/ViewTraineeProfile/{id}")]
        public object ViewTraineeProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic prac = new ExpandoObject();
            try
            {
                Trainee p = db.Trainees.Where(x => x.User_ID == id).FirstOrDefault();
                if (p != null)
                {
                    prac.Trainee_ID = p.Trainee_ID;
                    prac.User_ID = p.User_ID;
                    prac.Title = p.Title;
                    prac.Name = p.Name;
                    prac.Surname = p.Surname;
                    prac.ID_Number = p.ID_Number;
                    prac.Email_Address = p.Email_Address;
                    prac.Contact_Number = p.Contact_Number;
                    prac.Gender = p.Gender;
                    prac.TraineeStatus = p.TraineeStatu;
                    prac.TraineeStatus_ID = p.TraineeStatus_ID;

                }
            }
            catch (Exception)
            {
                return null;
            }
            return prac;
        }

        [HttpGet]
        [Route("api/Trainee/ViewSchedule/{traineeID}")]
        public object ViewSchedule(int traineeID) //get session that gets future sessions
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic schedule = new ExpandoObject();
            Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == traineeID).FirstOrDefault();

            try
            {
                //Missing Field
                List<Session> sessions = db.Sessions.Where(x => x.Trainee_ID == traineeID && x.Date > DateTime.Now).ToList();
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
                    schedule = "No sessions booked " + trainee.Name + " " + trainee.Surname + ".";
                }
            }
            catch (Exception e)
            {
                return e;
            }
            return schedule;
        }
        [HttpPost]
        [Route("api/Trainee/MantainTrainee/{id}")]
        public object MaintainTrainee([FromBody] Trainee c, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic data = new ExpandoObject();
            try
            {

                Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == c.Trainee_ID).FirstOrDefault();
                if (trainee != null)
                {
                    trainee.Title = c.Title;
                    trainee.Name = c.Name;
                    trainee.Surname = c.Surname;
                    trainee.ID_Number = c.ID_Number;
                    trainee.Email_Address = c.Email_Address;
                    trainee.Contact_Number = c.Contact_Number;
                    trainee.Gender = c.Gender;
                    db.SaveChanges();
                    data = trainee;
                }
                return data;
            }
            catch
            {
                string err = "Client Maintain failed.";
                return Ok(err);
            }
        }
        private bool TraineeExists(int id)
        {
            return db.Trainees.Count(e => e.Trainee_ID == id) > 0;
        }

        [HttpGet]
        [Route("api/Trainee/ViewTraineeQuestionnares/{Traineeid}")] //View All Questionnares linked to a Trainee
        public object ViewTraineeQuestionnares(int Traineeid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic questionnares = new ExpandoObject(); ;

            try
            {
                List<QuestionAnswer> unanswered = db.QuestionAnswers.Where(x => x.Trainee_ID == Traineeid && x.Answer == null).ToList();
                List<QuestionAnswer> answered = db.QuestionAnswers.Where(x => x.Trainee_ID == Traineeid && x.Answer != null).ToList();

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
        [Route("api/Trainee/CompleteQuestionnare/")]
        public object CompleteQuestionnare([FromBody] List<List<int>> questions)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic questionnares = new ExpandoObject();

            //[ ALGORITHM STRUCTURE
            // {
            //  "TranieeID": 1,
            //  "QuestionID": 5,
            //  "Answers" : [1 , 3 , 2 ,4]
            // },
            // {
            //  "TranieeID": 1,
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
                                QuestionAnswer a = db.QuestionAnswers.Where(x => x.Question_ID == f && x.Trainee_ID == c_id && x.Answer == null).FirstOrDefault();
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
                    else if (question.Count == 3) //5 = NO && 6 = YES
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
                                QuestionAnswer a = db.QuestionAnswers.Where(x => x.Question_ID == f && x.Trainee_ID == c_id && x.Answer == null).FirstOrDefault();
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
        public object CalculateScore(int traineeid)
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

                List<QuestionAnswer> questionAnswers = db.QuestionAnswers.Where(x => x.Trainee_ID == traineeid).ToList();
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

                Result result = db.Results.Where(x => x.Trainee_ID == traineeid).FirstOrDefault();
                if (result != null)
                {
                    result.QuestionBankType_ID = score;
                    db.SaveChanges();
                }
                else if (result == null)
                {
                    Result r = new Result();
                    r.Trainee_ID = traineeid;
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
        [Route("api/Trainee/GetAvailableDates")]
        public object GetAvailableDates()
        {
            db.Configuration.ProxyCreationEnabled = false;

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
        [Route("api/Trainee/GetDateAvailabilitys/{date}")]
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
                    List<Availability> availabilities = db.Availabilities.Where(x => x.Date_ID == day.Date_ID && x.Trainer_ID != null && x.Trainee_ID == null).ToList();
                    foreach (var a in availabilities)
                    {
                        dynamic obj = new ExpandoObject();
                        obj.Availability_ID = a.Availability_ID;
                        obj.Date = day.Date1;
                        TimeSlot slot = db.TimeSlots.Where(x => x.TimeSlot_ID == a.TimeSlot_ID).FirstOrDefault();
                        obj.Time = slot.StartTime + " - " + slot.EndTime;
                        if (a.Trainer_ID != null)
                        {
                            Trainer trainer = db.Trainers.Where(x => x.Trainer_ID == a.Trainer_ID).FirstOrDefault();
                            obj.Trainer = trainer.Title + ". " + trainer.Name + " " + trainer.Surname;
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

        [HttpPost]
        [Route("api/Trainee/BookTrainingSession/{availabilityid}/{traineeid}")]
        public object BookTrainingSession(int availabilityid, int traineeid)
        {
            object avail = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Availability available = db.Availabilities.Where(x => x.Availability_ID == availabilityid).FirstOrDefault();
                if (available != null)
                {
                    available.Trainee_ID = traineeid;
                    db.SaveChanges();
                    avail = available;

                    Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == traineeid).FirstOrDefault();
                    User user = db.Users.Where(x => x.User_ID == trainee.User_ID).FirstOrDefault();
                    AuditTrail BookTrainingSession = new AuditTrail();
                    BookTrainingSession.Description = "BookTrainingSession: " + trainee.Title + " " + trainee.Name.Substring(0, 1) + "." + trainee.Surname;
                    BookTrainingSession.Date_Log = DateTime.Now;
                    BookTrainingSession.User_ID = user.User_ID;
                    BookTrainingSession.Log_History = user.Username;
                    db.AuditTrails.Add(BookTrainingSession);
                    db.SaveChanges();
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Trainee/GetTasks/{traineeid}")]
        public object GetTasks(int traineeid)
        {
            object data = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            List<object> objects = new List<object>();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Trainee_ID == traineeid && x.TaskStatus_ID == 1).ToList();
                foreach (var task in tasks)
                {
                    dynamic obj = new ExpandoObject();

                    Task t = db.Tasks.Where(x => x.Task_ID == task.Task_ID).FirstOrDefault();
                    obj.Task_ID = task.Task_ID;
                    obj.Description = task.Description;
                    obj.DueDate = t.DueDate;
                    Trainer trainer = db.Trainers.Where(x => x.Trainer_ID == task.Trainer_ID).FirstOrDefault();
                    obj.Trainer = trainer.Title + ". " + trainer.Name + " " + trainer.Surname;
                    TaskType type = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                    obj.TaskType = "";
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
        [Route("api/Trainee/CompleteTask/{taskid}")]
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
        [Route("api/Trainee/ViewFeedbackNotes/{traineeid}")]
        public object ViewFeedbackNotes(int traineeid)
        {
            object data = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            List<object> objects = new List<object>();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Trainee_ID == traineeid && x.Feedback != null && x.TaskStatus_ID == 3).ToList();
                foreach (var task in tasks)
                {
                    dynamic obj = new ExpandoObject();

                    Task t = db.Tasks.Where(x => x.Task_ID == task.Task_ID).FirstOrDefault();
                    obj.Task_ID = task.Task_ID;
                    obj.StartDate = t.StartDate;
                    obj.DueDate = t.DueDate;
                    obj.Feedback = task.Feedback;
                    Trainer trainer = db.Trainers.Where(x => x.Trainer_ID == task.Trainer_ID).FirstOrDefault();
                    obj.Trainer = trainer.Title + ". " + trainer.Name + " " + trainer.Surname;
                    TaskType type = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                    obj.TaskType = "type.Name";
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
    }
}
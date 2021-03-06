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

    public class TrainerController : ApiController
    {
        FICSEntities db = new FICSEntities();

        [HttpPost]
        [Route("api/Trainer/MaintainTrainer/{id}")]
        public object MaintainTrainer([FromBody] Trainer trainer, int id)
        {
            List<object> maintain = new List<object>();
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != trainer.Trainer_ID)
            {
                return BadRequest();
            }

            db.Entry(trainer).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrainerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }
        private bool TrainerExists(int id)
        {
            return db.Trainers.Count(e => e.Trainer_ID == id) > 0;
        }

        [HttpGet]
        [Route("api/Trainer/ViewTrainerProfile/{id}")]
        public object ViewTrainerProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic prac = new ExpandoObject();
            try
            {
                Trainer p = db.Trainers.Where(x => x.User_ID == id).FirstOrDefault();
                if (p != null)
                {
                    prac.Trainer_ID = p.Trainer_ID;
                    prac.Title = p.Title;
                    prac.Name = p.Name;
                    prac.Surname = p.Surname;
                    prac.ID_Number = p.ID_Number;
                    prac.Email_Address = p.Email_Address;
                    prac.Contact_Number = p.Contact_Number;
                    prac.Gender = p.Gender;
                    prac.PractitionerStatus = p.TrainerStatu;
                }
            }
            catch (Exception)
            {
                return null;
            }
            return prac;
        }

        [HttpPost]
        [Route("api/Trainer/SetTrainerAvailability")]
        public object SetTrainerAvailability([FromBody] SetAvailability availability)
        {
            object avail = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Date date = db.Dates.Where(x => x.Date1 == availability.AvailabilityDate).FirstOrDefault();
                if (date == null)
                {
                    Date newDate = new Date();
                    newDate.Date1 = availability.AvailabilityDate;
                    db.Dates.Add(newDate);
                    db.SaveChanges();
                }
                Date reCheckDate = db.Dates.Where(x => x.Date1 == availability.AvailabilityDate).FirstOrDefault();
                if (reCheckDate != null)
                {
                    Availability available = db.Availabilities.Where(x => x.Date_ID == reCheckDate.Date_ID && x.TimeSlot_ID == availability.TimeSlot_ID).FirstOrDefault();
                    if (available == null && availability.AvailabilityDate >= DateTime.Now)
                    {
                        Availability slot = new Availability();
                        slot.Date_ID = reCheckDate.Date_ID;
                        slot.TimeSlot_ID = availability.TimeSlot_ID;
                        if (availability.Client_ID != null)
                        {
                            slot.Client_ID = availability.Client_ID;
                        }
                        else if (availability.Trainee_ID != null)
                        {
                            slot.Trainee_ID = availability.Trainee_ID;
                        }
                        else if (availability.Practitioner_ID != null)
                        {
                            slot.Practitioner_ID = availability.Practitioner_ID;
                        }
                        else if (availability.Trainer_ID != null)
                        {
                            slot.Trainer_ID = availability.Trainer_ID;
                        }
                        db.Availabilities.Add(slot);
                        db.SaveChanges();
                        avail = slot;
                    }
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Trainer/RescheduleTrainerAvailability")]
        public object RescheduleTrainerAvailability([FromBody] SetAvailability availability)
        {
            object avail = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Date date = db.Dates.Where(x => x.Date1 == availability.AvailabilityDate).FirstOrDefault();
                if (date == null)
                {
                    Date newDate = new Date();
                    newDate.Date1 = availability.AvailabilityDate;
                    db.Dates.Add(newDate);
                    db.SaveChanges();
                }
                Date reCheckDate = db.Dates.Where(x => x.Date1 == availability.AvailabilityDate).FirstOrDefault();
                if (reCheckDate != null)
                {
                    Availability available = db.Availabilities.Where(x => x.Date_ID == reCheckDate.Date_ID && x.TimeSlot_ID == availability.TimeSlot_ID).FirstOrDefault();
                    if (available == null && availability.AvailabilityDate >= DateTime.Now)
                    {
                        Availability slot = db.Availabilities.Where(x => x.Availability_ID == availability.Availability_ID).FirstOrDefault();
                        slot.Date_ID = reCheckDate.Date_ID;
                        slot.TimeSlot_ID = availability.TimeSlot_ID;
                        if (availability.Client_ID != null)
                        {
                            slot.Client_ID = availability.Client_ID;
                        }
                        else if (availability.Trainee_ID != null)
                        {
                            slot.Trainee_ID = availability.Trainee_ID;
                        }
                        else if (availability.Practitioner_ID != null)
                        {
                            slot.Practitioner_ID = availability.Practitioner_ID;
                        }
                        else if (availability.Trainer_ID != null)
                        {
                            slot.Trainer_ID = availability.Trainer_ID;
                        }
                        db.SaveChanges();
                        avail = slot;
                    }
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Trainer/SendTasks/{trainerid}/{traineeid}")]
        public object SendTasks([FromBody] Task newTask, int trainerid, int traineeid)
        {
            object tasks = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                Task task = new Task();
                task.Trainer_ID = trainerid;
                task.Trainee_ID = traineeid;
                task.Description = newTask.Description;
                task.DueDate = newTask.DueDate;
                task.TaskStatus_ID = 1;
                task.TaskType_ID = newTask.TaskType_ID;
                db.Tasks.Add(task);
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
        [Route("api/Trainer/TraineesAssignedToTrainer/{trainerid}")] //clients assigned to prac
        public object TraineesAssignedToTrainer(int trainerid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic trainees = new ExpandoObject();
            try
            {
                List<Trainee> clients = db.Trainees.Where(x => x.Trainer_ID == trainerid).ToList();
                List<object> trainees_assigned = new List<object>();

                foreach (var client in clients)
                {
                    dynamic c = new ExpandoObject();

                    c.Trainee_ID = client.Trainee_ID;
                    c.Title = client.Title;
                    c.Name = client.Name;
                    c.Surname = client.Surname;
                    c.ID_Number = client.ID_Number;
                    c.Email_Address = client.Email_Address;
                    c.Contact_Number = client.Contact_Number;
                    c.Gender = client.Gender;
                    db.SaveChanges();

                    trainees_assigned.Add(c);
                }

                trainees = trainees_assigned;
            }
            catch (Exception)
            {
                return null;
            }
            return trainees;
        }

        [HttpGet]
        [Route("api/Trainer/GetFeedbackTasks/{trainerid}")]
        public object GetFeedbackTasks(int trainerid)
        {
            object t = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            List<object> objects = new List<object>();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Trainer_ID == trainerid && x.Feedback == null && x.TaskStatus_ID == 2).ToList();
                foreach (var task in tasks)
                {
                    dynamic obj = new ExpandoObject();
                    obj.Task_ID = task.Task_ID;
                    obj.Description = task.Description;
                    obj.StartDate = task.StartDate;
                    Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == task.Trainee_ID).FirstOrDefault();
                    obj.Trainee = trainee.Title + ". " + trainee.Name + " " + trainee.Surname;
                    TaskType type = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                    obj.TaskType = "type.Name";
                    obj.Task_ID = task.Task_ID;
                    obj.TaskStatus = "Awaiting Feedback";
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
                t = objects;
                return t;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Trainer/TasksForEachTrainee/{TraineeId}")] //gets tasks for each client + completed or not field
        public object TasksForEachTrainee(int TraineeId)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic t = new ExpandoObject();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Trainee_ID == TraineeId).ToList();
                List<object> tasks_assigned = new List<object>();

                foreach (var task in tasks)
                {
                    dynamic c = new ExpandoObject();

                    c.Client_ID = task.Trainee_ID;
                    c.Task_ID = task.Task_ID;
                    c.Description = task.Description;
                    c.StartDate = task.StartDate;
                    c.DueDate = task.DueDate;

                    TaskStatu taskStatus = db.TaskStatus.Where(x => x.TaskStatus_ID == task.TaskStatus_ID).FirstOrDefault();
                    TaskType taskType = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();

                    c.Status = taskStatus.Description;
                    c.Type = "";

                    tasks_assigned.Add(c);
                }

                t = tasks_assigned;
            }
            catch (Exception)
            {
                return null;
            }
            return t;
        }

        [HttpPost]
        [Route("api/Trainer/SendFeedback/{taskid}/{feedback}")]
        public object SendFeedback(int taskid, string feedback)
        {
            object tasks = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                Task task = db.Tasks.Where(x => x.Task_ID == taskid).FirstOrDefault();
                task.Feedback = feedback;
                task.TaskStatus_ID = 3;
                db.SaveChanges();
                tasks = task;

                Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == task.Trainee_ID).FirstOrDefault();
                Trainer trainer = db.Trainers.Where(x => x.Trainer_ID == task.Trainer_ID).FirstOrDefault();

                List<Task> taskslist = db.Tasks.Where(x => x.Trainee_ID == trainee.Trainer_ID && x.TaskStatus_ID == 3).ToList();

                //PROMOTE USER
                if (taskslist.Count >= 8)
                {
                    User user = db.Users.Where(x => x.User_ID == trainee.User_ID).FirstOrDefault();
                    user.UserRole_ID = 4;
                    db.SaveChanges();

                    User traineruser = db.Users.Where(x => x.User_ID == trainer.User_ID).FirstOrDefault();


                    dynamic obj = new ExpandoObject();

                    MailMessage message = new MailMessage();
                    SmtpClient smtp = new SmtpClient();
                    message.From = new MailAddress("ficscorp29@gmail.com");
                    message.To.Add(new MailAddress(user.Email_Address));
                    message.Subject = "You are now a Trainer!";
                    message.IsBodyHtml = true;
                    message.Body = "[AUTOMATED EMAIL FROM FICS CORP] <br /><br /> Greetings " + user.Username + ", <br /><br /> We're sending you this email to notify you that you are now a FICS Trainer."
                        + "<br /><br />" + "Congratulations on your achievement. <br /><br /> Kind Regards<br />FICS Support Team";

                    smtp.Port = 587;
                    smtp.Host = "smtp.gmail.com";
                    smtp.EnableSsl = true;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential("ficscorp29@gmail.com", "Ficscorp@2900");
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp.Send(message);
                    obj = message;

                    dynamic obj2 = new ExpandoObject();

                    MailMessage message2 = new MailMessage();
                    SmtpClient smtp2 = new SmtpClient();
                    message.From = new MailAddress("ficscorp29@gmail.com");
                    message.To.Add(new MailAddress(traineruser.Email_Address));
                    message.Subject = trainee.Name + " " + trainee.Surname + " is now a FICS Trainer!";
                    message.IsBodyHtml = true;
                    message.Body = "[AUTOMATED EMAIL FROM FICS CORP] <br /><br /> Greetings " + traineruser.Username + ", <br /><br /> We're sending you this email to notify you that " + trainee.Name + " " + trainee.Surname + " is now a FICS Trainer."
                        + "<br /><br />" + "Congratulations on training them! <br /><br /> Kind Regards<br />FICS Support Team";

                    smtp2.Port = 587;
                    smtp2.Host = "smtp.gmail.com";
                    smtp2.EnableSsl = true;
                    smtp2.UseDefaultCredentials = false;
                    smtp2.Credentials = new NetworkCredential("ficscorp29@gmail.com", "Ficscorp@2900");
                    smtp2.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp2.Send(message2);
                    obj2 = message2;
                }

                return tasks;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Trainer/ViewTraineeAnswers/{traineeid}")]
        public List<object> ViewTraineeAnswers(int traineeid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> results = new List<object>();
            try
            {
                List<QuestionAnswer> answers = db.QuestionAnswers.Where(x => x.Trainee_ID == traineeid).ToList();

                foreach (var answer in answers)
                {
                    List<QuestionDetail> qdetails = db.QuestionDetails.Where(x => x.QuestionTitle_ID == answer.Question_ID).ToList();

                    dynamic obj = new ExpandoObject();
                    QuestionTitle title = db.QuestionTitles.Where(x => x.QuestionTitle_ID == answer.Question_ID).FirstOrDefault();
                    obj.QuestionTitle_ID = title.QuestionTitle_ID;
                    obj.QuestionTitle = title.Description;
                    List<object> questions = new List<object>();
                    List<QuestionDetail> details = db.QuestionDetails.Where(x => x.QuestionTitle_ID == title.QuestionTitle_ID).ToList();

                    foreach (var detail in details)
                    {
                        dynamic obje = new ExpandoObject();
                        obje.Question_ID = detail.Question_ID;
                        obje.Question = detail.Question;
                        obje.Answer = answer.Answer;
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


    }
}
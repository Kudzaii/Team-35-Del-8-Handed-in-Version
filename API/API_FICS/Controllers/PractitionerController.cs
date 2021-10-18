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
    public class PractitionerController : ApiController
    {
        FICSEntities db = new FICSEntities();

        [HttpGet]
        [Route("api/Practitioner/ClientsAssignedToPractitoner/{practitionerid}")] //clients assigned to prac
        public object ClientsAssignedToPractitoner(int practitionerid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic prac = new ExpandoObject();
            try
            {
                List<Client> clients = db.Clients.Where(x => x.Practitioner_ID == practitionerid).ToList();
                List<object> clients_assigned = new List<object>();

                foreach (var client in clients)
                {
                    dynamic c = new ExpandoObject();

                    c.Client_ID = client.Client_ID;
                    c.Title = client.Title;
                    c.Name = client.Name;
                    c.Surname = client.Surname;
                    c.ID_Number = client.ID_Number;
                    c.Email_Address = client.Email_Address;
                    c.Contact_Number = client.Contact_Number;
                    c.Gender = client.Gender;
                    c.Country = client.Country;
                    db.SaveChanges();

                    clients_assigned.Add(c);
                }

                prac = clients_assigned;
            }
            catch (Exception)
            {
                return null;
            }
            return prac;
        }

        [HttpGet]
        [Route("api/Practitioner/TasksForEachClient/{clientid}")] //gets tasks for each client + completed or not field
        public object TasksForEachClient(int clientid)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic t = new ExpandoObject();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Client_ID == clientid).ToList();
                List<object> tasks_assigned = new List<object>();

                foreach (var task in tasks)
                {
                    dynamic c = new ExpandoObject();

                    c.Client_ID = task.Client_ID;
                    c.Task_ID = task.Task_ID;
                    c.Description = task.Description;
                    c.StartDate = task.StartDate;
                    c.DueDate = task.DueDate;

                    TaskStatu taskStatus = db.TaskStatus.Where(x => x.TaskStatus_ID == task.TaskStatus_ID).FirstOrDefault();
                    TaskType taskType = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();

                    c.Status = taskStatus.Description;
                    c.Type = taskType.Description;

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

        [HttpGet]
        [Route("api/Practitioner/ViewPractitionerProfile/{id}")]
        public object ViewPractitionerProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic prac = new ExpandoObject();
            try
            {
                Practitioner p = db.Practitioners.Where(x => x.User_ID == id).FirstOrDefault();
                if (p != null)
                {
                    prac = p;
                }
            }
            catch (Exception)
            {
                return null;
            }
            return prac;
        }

        //get time slots
        [HttpPost]
        [Route("api/Practitioner/MaintainPractitioner/{id}")]
        public object MaintainPractitioner([FromBody] Practitioner practitioner, int id)
        {
            List<object> maintain = new List<object>();
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != practitioner.Practitioner_ID)
            {
                return BadRequest();
            }

            db.Entry(practitioner).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PractitionExisits(id))
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
        private bool PractitionExisits(int id)
        {
            return db.Practitioners.Count(e => e.Practitioner_ID == id) > 0;
        }

        [HttpPost]
        [Route("api/Practitioner/SetPractitionerAvailability")]
        public object SetPractitionerAvailability([FromBody] List<SetAvailability> availabilities)
        {
            object avail = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                foreach (var availability in availabilities)
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
                }
                return avail;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Practitioner/ReschedulePractitionerAvailability")]
        public object ReschedulePractitionerAvailability([FromBody] SetAvailability availability)
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

        [HttpGet]
        [Route("api/Practitioner/getMyAvailability/{practitionerID}")] //gets  practitioner availabilities
        public object getMyAvailability(int practitionerID)
        {
            db.Configuration.ProxyCreationEnabled = false;

            List<object> objects = new List<object>();
            try
            {
                List<Availability> availabilities = db.Availabilities.Where(x => x.Practitioner_ID == practitionerID).ToList();
                foreach (var availability in availabilities)
                {
                    TimeSlot timeslot = db.TimeSlots.Where(x => x.TimeSlot_ID == availability.TimeSlot_ID).FirstOrDefault();
                    Date date = db.Dates.Where(x => x.Date_ID == availability.Date_ID).FirstOrDefault();
                    Client client = db.Clients.Where(x => x.Client_ID == availability.Client_ID).FirstOrDefault();
                    dynamic obj = new ExpandoObject();
                    obj.Availability_ID = availability.Availability_ID;
                    obj.TimeSlot_ID = timeslot.TimeSlot_ID;
                    obj.Date_ID = date.Date_ID;
                    obj.StartTime = timeslot.StartTime;
                    obj.EndTime = timeslot.EndTime;
                    obj.Date = date.Date1;
                    obj.Email = client != null ? client.Email_Address : "None";
                    obj.Client = client != null ? client.Name + " " + client.Surname : "None";
                    objects.Add(obj);

                }
                return objects;
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Practitioner/SendTasks/{practitionerid}/{clientid}")]
        public object SendTasks([FromBody] Task newTask, int practitionerid, int clientid)
        {
            object tasks = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            try
            {
                Task task = new Task();
                task.Practitioner_ID = practitionerid;
                task.Client_ID = clientid;
                task.Description = newTask.Description;
                task.DueDate = newTask.DueDate;
                task.TaskStatus_ID = 1;
                task.TaskType_ID = 3;
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
        [Route("api/Practitioner/getTimeSlots")]
        public List<TimeSlot> getTimeSlots()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<TimeSlot> timeslots = db.TimeSlots.ToList();
                return timeslots;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Practitioner/GetFeedbackTasks/{practitionerid}")]
        public object GetFeedbackTasks(int practitionerid)
        {
            object t = new ExpandoObject();
            db.Configuration.ProxyCreationEnabled = false;

            List<object> objects = new List<object>();
            try
            {
                List<Task> tasks = db.Tasks.Where(x => x.Practitioner_ID == practitionerid && x.Feedback == null && x.TaskStatus_ID == 2).ToList();
                foreach (var task in tasks)
                {
                    dynamic obj = new ExpandoObject();
                    obj.Task_ID = task.Task_ID;
                    obj.Description = task.Description;
                    obj.StartDate = task.StartDate;
                    Client client = db.Clients.Where(x => x.Client_ID == task.Client_ID).FirstOrDefault();
                    obj.Client = client.Title + ". " + client.Name + " " + client.Surname;
                    TaskType type = db.TaskTypes.Where(x => x.TaskType_ID == task.TaskType_ID).FirstOrDefault();
                    obj.TaskType = type.Name;
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

        [HttpPost]
        [Route("api/Practitioner/SendFeedback/{taskid}/{feedback}")]
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

                return tasks;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Practitioner/ViewClientAnswers/{clientid}")]
        public List<object> ViewClientAnswers(int clientid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> results = new List<object>();
            try
            {
                List<QuestionAnswer> answers = db.QuestionAnswers.Where(x => x.Client_ID == clientid).ToList();

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
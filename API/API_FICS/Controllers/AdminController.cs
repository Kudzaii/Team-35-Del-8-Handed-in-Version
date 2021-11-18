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
    public class AdminController : ApiController
    {
        FICSEntities db = new FICSEntities();

        [HttpGet]
        [Route("api/Admin/SearchClient/{text}")]
        public object SearchClient(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<Client> clientNames = db.Clients.Where(x => x.Name.Contains(text)).ToList();
                List<Client> clientSurnames = db.Clients.Where(x => x.Surname.Contains(text)).ToList();

                results.Data = clientNames.Concat(clientSurnames).ToList();
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/ViewClientSessions/{id}")]
        public List<object> ViewClientSessions(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> results = new List<object>();
            try
            {
                List<Session> sessions = db.Sessions.Where(x => x.Date >= DateTime.Now && x.Client_ID == id).OrderBy(x => x.Date).ToList();

                foreach (var session in sessions)
                {
                    dynamic obj = new ExpandoObject();
                    obj.SessionNo = session.Session_ID;
                    obj.Session = session.Description;
                    obj.Date = session.Date;
                    obj.Time = session.Start_Time + " - " + session.End_Time;
                    Client client = db.Clients.Where(x => x.Client_ID == session.Client_ID).FirstOrDefault();
                    obj.Client = client.Title + " " + client.Name + " " + client.Surname;
                    Practitioner prac = db.Practitioners.Where(res => res.Practitioner_ID == client.Practitioner_ID).FirstOrDefault();
                    obj.Practitioner = prac.Title + " " + prac.Name + " " + prac.Surname;
                    results.Add(obj);
                }

                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet] //step 1
        [Route("api/Admin/ViewClients")]
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



        [HttpGet] //step 2
        [Route("api/Admin/GetAllQuestions")]
        public List<object> GetAllQuestions()
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> results = new List<object>();
            try
            {
                List<QuestionTitle> titles = db.QuestionTitles.ToList();

                foreach (var title in titles)
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

        //step 3
        [HttpPost]//foreach selected title, assign the list of questions associated with each title to the respective client
        [Route("api/Admin/AssignClientQuestionnaires/{clientid}")]
        public List<object> AssignClientQuestionnaires(int clientid, [FromBody] List<int> Questions)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> results = new List<object>();
            try
            {
                foreach (int i in Questions)
                {
                    List<QuestionDetail> details = db.QuestionDetails.Where(x => x.QuestionTitle_ID == i).ToList();

                    foreach (var detail in details)
                    {
                        QuestionAnswer question = new QuestionAnswer();
                        if (details.Count != 1)
                        {
                            question.Question_ID = detail.Question_ID;
                        }
                        else if (details.Count == 1)
                        {
                            question.Question_ID = detail.QuestionTitle_ID;
                        }
                        question.Client_ID = clientid;
                        db.QuestionAnswers.Add(question);
                        db.SaveChanges();
                    }
                }

                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }


        [HttpPost]//foreach selected title, assign the list of questions associated with each title to the respective trainee
        [Route("api/Admin/AssignTraineeQuestionnaires/{traineeid}")]
        public List<object> AssignTraineeQuestionnaires(int traineeid, [FromBody] List<int> Questions)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<object> results = new List<object>();
            try
            {
                foreach (int i in Questions)
                {
                    List<QuestionDetail> details = db.QuestionDetails.Where(x => x.QuestionTitle_ID == i).ToList();

                    foreach (var detail in details)
                    {
                        QuestionAnswer question = new QuestionAnswer();
                        if (details.Count != 1)
                        {
                            question.Question_ID = detail.Question_ID;
                        }
                        else if (details.Count == 1)
                        {
                            question.Question_ID = detail.QuestionTitle_ID;
                        }
                        question.Trainee_ID = traineeid;
                        db.QuestionAnswers.Add(question);
                        db.SaveChanges();
                    }
                }

                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SendClientTasks/{id}")]
        public object SendClientTasks(Task t, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Task task = new Task();
                task = t;
                task.Client_ID = id;
                db.Tasks.Add(task);
                db.SaveChanges();
                obj = task;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/SendClientTasks/{id}")]
        public object MaintainClientTasks(Task t, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Task task = db.Tasks.Where(x => x.Task_ID == id).FirstOrDefault();
                task = t;
                task.TaskStatus_ID = id;
                db.SaveChanges();
                obj = task;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/DisableClientProfile/{id}")]
        public Client DisableClientProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Client client = db.Clients.Where(x => x.Client_ID == id).FirstOrDefault();
                client.Client_Status = false;
                ClientStatu status = db.ClientStatus.Where(x => x.Description == "Disabled").FirstOrDefault();
                if (status != null)
                {
                    client.ClientStatus_ID = 2;
                    db.SaveChanges();

                    User user = db.Users.Where(x => x.User_ID == client.User_ID).FirstOrDefault();
                    AuditTrail DisableClientProfile = new AuditTrail();
                    DisableClientProfile.Description = "DisableClientProfile: " + client.Title + " " + client.Name.Substring(0, 1) + "." + client.Surname;
                    DisableClientProfile.Date_Log = DateTime.Now;
                    DisableClientProfile.User_ID = user.User_ID;
                    DisableClientProfile.Log_History = user.Username;
                    db.AuditTrails.Add(DisableClientProfile);
                    db.SaveChanges();

                }
                return client;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/PractitionerRegistrationRequest")]
        public object PractitionerRegistrationRequest()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                PractitionerStatu status = db.PractitionerStatus.Where(x => x.Description == "Inactive").FirstOrDefault();
                List<Practitioner> practitioners = db.Practitioners.Where(x => x.PractitionerStatus_ID == status.PractitionerStatus_ID).ToList();

                List<object> list = new List<object>();

                foreach (var practitioner in practitioners)
                {
                    dynamic ToReturn = new ExpandoObject();
                    ToReturn.Practitioner_ID = practitioner.Practitioner_ID;
                    ToReturn.PractitionerStatus_ID = practitioner.PractitionerStatus_ID;
                    ToReturn.Title = practitioner.Title;
                    ToReturn.Name = practitioner.Name;
                    ToReturn.Surname = practitioner.Surname;
                    ToReturn.ID_Number = practitioner.ID_Number;
                    ToReturn.Profile_Picture = practitioner.Profile_Picture;
                    ToReturn.Email_Address = practitioner.Email_Address;
                    ToReturn.Contact_Number = practitioner.Contact_Number;
                    ToReturn.Gender = practitioner.Gender;
                    ToReturn.User_ID = practitioner.User_ID;
                    list.Add(ToReturn);
                }
                return list;
            }
            catch (Exception)
            {
                return null;
            }

        }

        [HttpPost]
        [Route("api/Admin/AcceptorDeclinePractitionerRequest/{prac}/{acceptordecline}")]
        public Practitioner AcceptorDeclinePractitionerRequest(Practitioner prac, int acceptordecline)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == prac.Practitioner_ID).FirstOrDefault();
                if (acceptordecline == 0)
                {
                    PractitionerStatu status = db.PractitionerStatus.Where(x => x.Description == "Disabled").FirstOrDefault();
                    practitioner.PractitionerStatus_ID = status.PractitionerStatus_ID;
                    db.SaveChanges();
                }
                else if (acceptordecline == 1)
                {
                    PractitionerStatu status = db.PractitionerStatus.Where(x => x.Description == "Registered").FirstOrDefault();
                    practitioner.PractitionerStatus_ID = status.PractitionerStatus_ID;
                    try
                    {
                        User user = db.Users.Where(x => x.User_ID == prac.User_ID).FirstOrDefault();
                        AuditTrail newLogin = new AuditTrail();
                        newLogin.Description = "Registeration";
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
                    db.SaveChanges();
                }
                return practitioner;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/DisablePractitionerProfile/{id}")]
        public Practitioner DisablePractitionerProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == id).FirstOrDefault();

                PractitionerStatu status = db.PractitionerStatus.Where(x => x.Description == "Disabled").FirstOrDefault();
                practitioner.PractitionerStatus_ID = status.PractitionerStatus_ID;
                db.SaveChanges();

                User user = db.Users.Where(x => x.User_ID == practitioner.User_ID).FirstOrDefault();
                AuditTrail DisablePractitionerProfile = new AuditTrail();
                DisablePractitionerProfile.Description = "DisablePractitionerProfile: " + practitioner.Title + " " + practitioner.Name.Substring(0, 1) + "." + practitioner.Surname;
                DisablePractitionerProfile.Date_Log = DateTime.Now;
                DisablePractitionerProfile.User_ID = user.User_ID;
                DisablePractitionerProfile.Log_History = user.Username;
                db.AuditTrails.Add(DisablePractitionerProfile);
                db.SaveChanges();

                return practitioner;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/TraineeRegistrationRequest")]
        public object TraineeRegistrationRequest()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                TraineeStatu status = db.TraineeStatus.Where(x => x.Description == "Inactive").FirstOrDefault();
                List<Trainee> trainees = db.Trainees.Where(x => x.TraineeStatus_ID == status.TraineeStatus_ID).ToList();

                List<object> list = new List<object>();

                foreach (var trainee in trainees)
                {
                    dynamic ToReturn = new ExpandoObject();
                    ToReturn.Trainee_ID = trainee.Trainee_ID;
                    ToReturn.TraineeStatus_ID = trainee.TraineeStatus_ID;
                    ToReturn.Title = trainee.Title;
                    ToReturn.Name = trainee.Name;
                    ToReturn.Surname = trainee.Surname;
                    ToReturn.ID_Number = trainee.ID_Number;
                    ToReturn.Profile_Picture = trainee.Profile_Picture;
                    ToReturn.Email_Address = trainee.Email_Address;
                    ToReturn.Contact_Number = trainee.Contact_Number;
                    ToReturn.Gender = trainee.Gender;
                    ToReturn.User_ID = trainee.User_ID;
                    list.Add(ToReturn);
                }
                return list;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/AcceptorDeclineTraineeRequest/{trainee}/{acceptordecline}")]
        public Trainee AcceptorDeclineTraineeRequest(Trainee t, int acceptordecline)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == t.Trainee_ID).FirstOrDefault();
                if (acceptordecline == 0)
                {
                    TraineeStatu status = db.TraineeStatus.Where(x => x.Description == "Disabled").FirstOrDefault();
                    trainee.TraineeStatus_ID = status.TraineeStatus_ID;
                    db.SaveChanges();
                }
                else if (acceptordecline == 1)
                {
                    TraineeStatu status = db.TraineeStatus.Where(x => x.Description == "Registered").FirstOrDefault();
                    trainee.TraineeStatus_ID = status.TraineeStatus_ID;
                    trainee.Trainee_Status = true;
                    db.SaveChanges();

                    try
                    {
                        User user = db.Users.Where(x => x.User_ID == t.User_ID).FirstOrDefault();
                        AuditTrail newLogin = new AuditTrail();
                        newLogin.Description = "Registeration";
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
                }
                return trainee;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/TrainerRegistrationRequest")]
        public object TrainerRegistrationRequest()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                TrainerStatu status = db.TrainerStatus.Where(x => x.Description == "Inactive").FirstOrDefault();
                List<Trainer> trainers = db.Trainers.Where(x => x.TrainerStatus_ID == status.TrainerStatus_ID).ToList();

                List<object> list = new List<object>();

                foreach (var trainer in trainers)
                {
                    dynamic ToReturn = new ExpandoObject();
                    ToReturn.Trainer_ID = trainer.Trainer_ID;
                    ToReturn.TrainerStatus_ID = trainer.TrainerStatus_ID;
                    ToReturn.Title = trainer.Title;
                    ToReturn.Name = trainer.Name;
                    ToReturn.Surname = trainer.Surname;
                    ToReturn.ID_Number = trainer.ID_Number;
                    ToReturn.Profile_Picture = trainer.Profile_Picture;
                    ToReturn.Email_Address = trainer.Email_Address;
                    ToReturn.Contact_Number = trainer.Contact_Number;
                    ToReturn.Gender = trainer.Gender;
                    ToReturn.User_ID = trainer.User_ID;
                    list.Add(ToReturn);
                }
                return list;
            }
            catch (Exception)
            {
                return null;
            }

        }

        [HttpPost]
        [Route("api/Admin/AcceptorDeclineTrainerRequest/{trainer}/{acceptordecline}")]
        public Trainer AcceptorDeclineTrainerRequest(Trainer t, int acceptordecline)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Trainer trainer = db.Trainers.Where(x => x.Trainer_ID == t.Trainer_ID).FirstOrDefault();
                if (acceptordecline == 0)
                {
                    TrainerStatu status = db.TrainerStatus.Where(x => x.Description == "Disabled").FirstOrDefault();
                    trainer.TrainerStatus_ID = status.TrainerStatus_ID;
                    db.SaveChanges();
                }
                else if (acceptordecline == 1)
                {
                    TrainerStatu status = db.TrainerStatus.Where(x => x.Description == "Registered").FirstOrDefault();
                    trainer.Trainer_Status = "Registered";
                    trainer.TrainerStatus_ID = status.TrainerStatus_ID;
                    db.SaveChanges();

                    try
                    {
                        User user = db.Users.Where(x => x.User_ID == t.User_ID).FirstOrDefault();
                        AuditTrail newLogin = new AuditTrail();
                        newLogin.Description = "Registeration";
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
                }
                return trainer;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchTrainee/{text}")]
        public object SearchTrainee(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<Trainee> TraineeNames = db.Trainees.Where(x => x.Name.Contains(text)).ToList();
                List<Trainee> TraineeSurnames = db.Trainees.Where(x => x.Surname.Contains(text)).ToList();

                results.Data = TraineeNames.Concat(TraineeSurnames).ToList();
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/DisableTraineeProfile/{id}")] //Done
        public Trainee DisableTraineeProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == id).FirstOrDefault();

                TraineeStatu status = db.TraineeStatus.Where(x => x.Description == "Disabled").FirstOrDefault();
                trainee.TraineeStatus_ID = status.TraineeStatus_ID;
                db.SaveChanges();

                User user = db.Users.Where(x => x.User_ID == trainee.User_ID).FirstOrDefault();
                AuditTrail DisableTraineeProfile = new AuditTrail();
                DisableTraineeProfile.Description = "DisablePractitionerProfile: " + trainee.Title + " " + trainee.Name.Substring(0, 1) + "." + trainee.Surname;
                DisableTraineeProfile.Date_Log = DateTime.Now;
                DisableTraineeProfile.User_ID = user.User_ID;
                DisableTraineeProfile.Log_History = user.Username;
                db.AuditTrails.Add(DisableTraineeProfile);
                db.SaveChanges();

                return trainee;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/AddQuestionnaireTitle")]
        public object AddQuestionnaireTitle(QuestionTitle q)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionTitle questionnaire = new QuestionTitle();
                questionnaire = q;
                db.QuestionTitles.Add(questionnaire);
                db.SaveChanges();
                obj = questionnaire;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/AddQuestionsToTitle/{titleID}")]
        public object AddQuestionsToTitle(int titleID, [FromBody]string details)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionDetail questionnaire = new QuestionDetail();
                questionnaire.QuestionTitle_ID = titleID;
                questionnaire.Question = details;
                db.QuestionDetails.Add(questionnaire);
                db.SaveChanges();
                obj = questionnaire;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/MaintainQuestionnaireTitle/{id}")]
        public object MaintainQuestionnaireTitle(QuestionTitle q, int id) //titles mantain
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionTitle questionnaire = db.QuestionTitles.Where(x => x.QuestionTitle_ID == id).FirstOrDefault();
                questionnaire.Description = q.Description;
                db.SaveChanges();
                obj = questionnaire;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/RemoveQuestionnaireTitle/{id}")]
        public object RemoveQuestionnaireTitle(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionTitle type = db.QuestionTitles.Where(re => re.QuestionTitle_ID == id).FirstOrDefault();
                QuestionDetail questionnaire = db.QuestionDetails.Where(x => x.Question_ID == id).FirstOrDefault();

                db.QuestionTitles.Remove(type);
                db.QuestionDetails.Remove(questionnaire);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/RemoveQuestion/{id}")]
        public object RemoveQuestion(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionDetail questionnaire = db.QuestionDetails.Where(x => x.Question_ID == id).FirstOrDefault();

                db.QuestionDetails.Remove(questionnaire);
                db.SaveChanges();
                obj = questionnaire;
                return obj;

            }
            catch (Exception e)
            {
                var message = e.Message;
                return null;
            }
        }



        [HttpPost]
        [Route("api/Admin/MaintainQuestionnaireTitleDetails/{id}")]
        public object MaintainQuestionnaireTitleDetails(QuestionDetail q, int id) //Mantain details
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionDetail questionnaire = db.QuestionDetails.Where(x => x.Question_ID == id).FirstOrDefault();
                questionnaire.Question = q.Question;
                db.SaveChanges();
                obj = questionnaire;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchQuestionnaire/{text}")]
        public object SearchQuestionnaire(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<QuestionDetail> questions = db.QuestionDetails.Where(x => x.Question.Contains(text)).ToList();

                results.Data = questions;
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchQuestionnaireTitles/{text}")]
        public object SearchQuestionnaireTitles(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<QuestionTitle> questions = db.QuestionTitles.Where(x => x.Description.Contains(text)).ToList();

                results.Data = questions;
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/ViewQuestionnaireTitles/")]
        public List<QuestionTitle> ViewQuestionnaireTitles() //1
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<QuestionTitle> questions = db.QuestionTitles.ToList();

                return questions;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/ViewQuestionnaireDetails/{id}")]
        public List<QuestionDetail> ViewQuestionnaireDetails(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<QuestionDetail> question = db.QuestionDetails.Where(x => x.QuestionTitle_ID == id).ToList();
                return question;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchPractitioner/{text}")]
        public object SearchPractitioner(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<Practitioner> PractitionerNames = db.Practitioners.Where(x => x.Name.Contains(text)).ToList();
                List<Practitioner> PractitionerSurnames = db.Practitioners.Where(x => x.Surname.Contains(text)).ToList();

                results.Data = PractitionerNames.Concat(PractitionerSurnames).ToList();
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/GetPractitioners/")]
        public List<Practitioner> GetPractitioners()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<Practitioner> practitioners = db.Practitioners.ToList();
                return practitioners;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/AssignPractitionertoClient/{clientid}/{pracid}")] //+ Reassign
        public object AssignPractitionertoClient(int clientid, int pracid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Client client = db.Clients.Where(x => x.Client_ID == clientid).FirstOrDefault();
                client.Practitioner_ID = pracid;
                AccessController.SendEmail(client.Email_Address, 2, client);
                db.SaveChanges();
                obj = client;
                return obj;
            }
            catch (Exception c)
            {
                return c;
            }
        }

        [HttpGet]
        [Route("api/Admin/GetTrainers/")]
        public List<Trainer> GetTrainers()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<Trainer> trainers = db.Trainers.ToList();
                return trainers;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/GetTrainees/")]
        public List<Trainee> GetTrainees()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
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

        [HttpPost]
        [Route("api/Admin/AssignTrainertoTrainee/{traineeid}/{trainerid}")] //+ Reassign
        public object AssignTrainertoTrainee(int traineeid, int trainerid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Trainee trainee = db.Trainees.Where(x => x.Trainee_ID == traineeid).FirstOrDefault();
                trainee.Trainer_ID = trainerid;
                db.SaveChanges();
                obj = trainee;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/DisableTrainerProfile/{id}")]
        public Trainer DisableTrainerProfile(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                Trainer trainer = db.Trainers.Where(x => x.Trainer_ID == id).FirstOrDefault();

                TrainerStatu status = db.TrainerStatus.Where(x => x.Description == "Disabled").FirstOrDefault();
                trainer.TrainerStatus_ID = status.TrainerStatus_ID;
                db.SaveChanges();

                return trainer;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchTrainer/{text}")]
        public object SearchTrainer(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<Trainer> TrainerNames = db.Trainers.Where(x => x.Name.Contains(text)).ToList();
                List<Trainer> TrainerSurnames = db.Trainers.Where(x => x.Surname.Contains(text)).ToList();

                results.Data = TrainerNames.Concat(TrainerSurnames).ToList();
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/AddQuestionnaireType")]
        public object AddQuestionnaireType(QuestionBankType q)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionBankType type = new QuestionBankType();
                type = q;
                db.QuestionBankTypes.Add(type);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/MaintainQuestionnaireType/{id}")]
        public object MaintainQuestionnaireType(QuestionBankType q, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                QuestionBankType questionnaire = db.QuestionBankTypes.Where(x => x.QuestionBankType_ID == id).FirstOrDefault();
                questionnaire.Description = q.Description;
                db.SaveChanges();
                obj = questionnaire;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/removeQuestionnaireType/{id}")]
        public object removeQuestionnaireType(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                QuestionBankType questions = db.QuestionBankTypes.Where(x => x.QuestionBankType_ID == id).FirstOrDefault();
                db.QuestionBankTypes.Remove(questions);

                return "removed";
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/GetTypes/{id}")]
        public object GetTypes(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                if (id == 1)
                {
                    List<QuestionBankType> QuestionBankTypes = db.QuestionBankTypes.ToList();
                    results = QuestionBankTypes;
                }
                else if (id == 2)
                {
                    List<SessionType> SessionTypes = db.SessionTypes.ToList();
                    results = SessionTypes;
                }
                else if (id == 3)
                {
                    List<DocumentType> DocumentTypes = db.DocumentTypes.ToList();
                    results = DocumentTypes;
                }
                else if (id == 4)
                {
                    List<PackageType> PackageTypes = db.PackageTypes.ToList();
                    results = PackageTypes;
                }
                else if (id == 5)
                {
                    List<EventType> EventTypes = db.EventTypes.ToList();
                    results = EventTypes;
                }
                else if (id == 6)
                {
                    List<ClientType> ClientTypes = db.ClientTypes.ToList();
                    results = ClientTypes;
                }
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }


        [HttpPost]
        [Route("api/Admin/AddSessionType")]
        public object AddSessionType(SessionType session)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                SessionType type = new SessionType();
                type = session;
                db.SessionTypes.Add(type);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/MaintainSessionType/{id}")]
        public object MaintainSessionType(SessionType session, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                SessionType type = db.SessionTypes.Where(x => x.SessionType_ID == id).FirstOrDefault();
                type.Name = session.Name;
                type.Description = session.Description;
                db.SaveChanges();
                obj = type;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchSessionType/{text}")]
        public object SearchSessionType(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<SessionType> sessionNames = db.SessionTypes.Where(x => x.Name.Contains(text)).ToList();
                List<SessionType> sessionTypes = db.SessionTypes.Where(x => x.Description.Contains(text)).ToList();

                results.Data = sessionNames.Concat(sessionTypes).ToList();
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/AddPackageType")]
        public object AddPackageType(PackageType p)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                PackageType type = new PackageType();
                type = p;
                db.PackageTypes.Add(type);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/MaintainPackageType/{id}")]
        public object MaintainPackageType(PackageType p, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                PackageType type = db.PackageTypes.Where(x => x.PackageType_ID == id).FirstOrDefault();
                type.Name = p.Name;
                db.SaveChanges();
                obj = type;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/removePackageType/{id}")]
        public object removePackageType(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                PackageType type = db.PackageTypes.Where(re => re.PackageType_ID == id).FirstOrDefault();
                db.PackageTypes.Remove(type);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/AddClientType")]
        public object AddClientType(ClientType c)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                ClientType type = new ClientType();
                type = c;
                db.ClientTypes.Add(type);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/removeClientType/{id}")]
        public object removeClientType(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                ClientType type = db.ClientTypes.Where(re => re.ClientType_ID == id).FirstOrDefault();

                db.ClientTypes.Remove(type);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/MaintainClientType/{id}")]
        public object MaintainClientType(ClientType c, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                ClientType type = db.ClientTypes.Where(x => x.ClientType_ID == id).FirstOrDefault();
                type.ClientType_Name = c.ClientType_Name;
                db.SaveChanges();
                obj = type;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchClientType/{text}")]
        public object SearchClientType(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<ClientType> clientTypes = db.ClientTypes.Where(x => x.ClientType_Name.Contains(text)).ToList();

                results.Data = clientTypes;
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet] 
        [Route("api/Admin/GetPackages")]
        public object GetPackages()
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
                        //obj.Price = price.Amount;
                        obj.Quantity = package.Quantity;
                        list.Add(obj);
                    }

                    packages.Questions = list;
                }
            }
            catch (Exception e)
            {
                var message = e.Message;
                return e;
            }
            return packages;
        }

        [HttpPost]
        [Route("api/Admin/AddPackage")]
        public object AddPackage(Package pc)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Package package = new Package();
                package = pc;
                db.Packages.Add(pc);
                db.SaveChanges();
                obj = package;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/removePackage/{id}")]
        public object removePackage(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Package package = db.Packages.Where(re => re.Package_ID == id).FirstOrDefault();

                db.Packages.Remove(package);
                db.SaveChanges();
                obj = package;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/MaintainPackage/{id}")]
        public object MaintainPackage(Package c, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Package package = db.Packages.Where(x => x.Package_ID == id).FirstOrDefault();
                package.Name = c.Name;
                package.Description = c.Description;
                package.Prices = c.Prices;
                db.SaveChanges();
                obj = package;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/GetAuditTrail/")]
        public object GetAuditTrail()
        {
            db.Configuration.ProxyCreationEnabled = false;

            List<object> list = new List<object>();
            try
            {
                List<AuditTrail> auditTrails = db.AuditTrails.ToList();

                foreach (AuditTrail trail in auditTrails)
                {
                    dynamic result = new ExpandoObject();
                    DateTime dt = trail.Date_Log;
                    result.time = dt.ToString("H:mm");
                    result.Date_Log = trail.Date_Log;
                    result.Description = trail.Description;
                    result.Log_History = trail.Log_History;
                    list.Add(result);

                }
                return list;
            }
            catch (Exception)
            {
                return null;
            }
        }


        [HttpPost]
        [Route("api/Admin/UpdateTimer/{time}")]
        public object UpdateTimer(int time)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                Timer timer = db.Timers.FirstOrDefault();
                timer.TimeLength = time;
                db.SaveChanges();
                obj = timer;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }
        [HttpGet]
        [Route("api/Admin/getTimer/")]
        public object getTimer()
        {
            db.Configuration.ProxyCreationEnabled = false;
            int results;
            try
            {
                Timer timer = db.Timers.FirstOrDefault();

                results = timer.TimeLength;
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/ViewClientsWithPractitioner")]
        public object ViewClientsWithPractitioner()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                List<Client> clients = db.Clients.ToList();
                List<object> list = new List<object>();
                foreach (var client in clients)
                {
                    Practitioner practitioner = db.Practitioners.Where(x => x.Practitioner_ID == client.Practitioner_ID).FirstOrDefault();
                    if (practitioner != null)
                    {
                        dynamic ToReturn = new ExpandoObject();
                        ToReturn.Practitioner_ID = practitioner.Practitioner_ID;
                        ToReturn.PractitionerName = practitioner.Name;
                        ToReturn.PractitionerSurname = practitioner.Surname;

                        ToReturn.Client_ID = client.Client_ID;
                        ToReturn.ClientTitle = client.Title;
                        ToReturn.ClientName = client.Name;
                        ToReturn.ClientSurname = client.Surname;
                        ToReturn.ClientID_Number = client.ID_Number;
                        ToReturn.ClientProfile_Picture = client.Profile_Picture;
                        ToReturn.ClientEmail_Address = client.Email_Address;
                        ToReturn.ClientContact_Number = client.Contact_Number;
                        ToReturn.ClientGender = client.Gender;
                        ToReturn.ClientUser_ID = client.User_ID;
                        list.Add(ToReturn);
                    }

                }
                return list;
            }
            catch (Exception)
            {
                return null;
            }

        }
        [HttpPost]
        [Route("api/Admin/AddUserRole")]
        public object AddUserRole(UserRole role)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                UserRole type = new UserRole();
                type = role;
                db.UserRoles.Add(role);
                db.SaveChanges();
                obj = type;
                return obj;

            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/Admin/MaintainUserRole/{id}")]
        public object MaintainUserRole(UserRole role, int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic obj = new ExpandoObject();
            try
            {
                UserRole type = db.UserRoles.Where(x => x.UserRole_ID == id).FirstOrDefault();
                type.Name = role.Name;
                db.SaveChanges();
                obj = type;
                return obj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Admin/SearchUserRole/{text}")]
        public object SearchUserRole(string text)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<UserRole> roles = db.UserRoles.Where(x => x.Name.Contains(text)).ToList();

                results.Data = roles;
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }


        [HttpGet]
        [Route("api/Admin/GetAllUserRoles")]
        public object GetAllUserRoles()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                List<UserRole> roles = db.UserRoles.ToList();
                results.Data = roles;
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }
        //Promote User Role
        [HttpPost]
        [Route("api/Admin/PromoteUserRole/{user}/{newrole}")]
        public object PromoteUserRole(int userid, int newrole)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic results = new ExpandoObject();
            try
            {
                User user = db.Users.Where(x => x.User_ID == userid).FirstOrDefault();
                user.UserRole_ID = newrole;
                db.SaveChanges();
                results = user;
                return results;
            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}
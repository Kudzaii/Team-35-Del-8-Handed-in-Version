using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_FICS.Models
{
    public class Registeration
    {
        //User
        public int User_ID { get; set; }
        public string SessionID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email_Address { get; set; }
        public int OTP { get; set; }

        //Client
        //Practitioner
        public string Title { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string ID_Number { get; set; }
        public string Passport_Number { get; set; }
        public byte[] Profile_Picture { get; set; }
        public string Contact_Number { get; set; }
        public string Gender { get; set; }
        public string Country { get; set; }
        public Boolean Client_Status { get; set; }

        //Trainer
        public string Physical_Address { get; set; }
        public string Trainer_Status { get; set; }


    }
}
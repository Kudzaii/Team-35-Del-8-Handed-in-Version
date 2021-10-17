using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_FICS.Models
{
    public class SetAvailability
    {
        public int Availability_ID { get; set; }
        public int TimeSlot_ID { get; set; }
        public int Date_ID { get; set; }
        public Nullable<int> Trainee_ID { get; set; }
        public Nullable<int> Client_ID { get; set; }
        public Nullable<int> Practitioner_ID { get; set; }
        public Nullable<int> Trainer_ID { get; set; }
        public System.DateTime AvailabilityDate { get; set; }

        public virtual Client Client { get; set; }
        public virtual Date Date { get; set; }
        public virtual Practitioner Practitioner { get; set; }
        public virtual TimeSlot TimeSlot { get; set; }
        public virtual Trainee Trainee { get; set; }
        public virtual Trainer Trainer { get; set; }
    }
}
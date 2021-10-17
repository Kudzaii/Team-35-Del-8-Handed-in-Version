using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_FICS.Models
{
    public class SessionBooking
    {
        public System.DateTime Date { get; set; }
        public int Slot_ID { get; set; }
        public int Client_ID { get; set; }
        public int Package_ID { get; set; }
        public int Booking_ID { get; set; } //only sent for reschedule
        public int SessionType_ID { get; set; } //f2f etc

    }
}
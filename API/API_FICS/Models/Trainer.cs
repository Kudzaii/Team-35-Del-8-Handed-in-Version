//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace API_FICS.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Trainer
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Trainer()
        {
            this.Availabilities = new HashSet<Availability>();
            this.Sessions = new HashSet<Session>();
            this.Tasks = new HashSet<Task>();
            this.Trainees = new HashSet<Trainee>();
            this.UserDaySlots = new HashSet<UserDaySlot>();
            this.UserQuestionnaires = new HashSet<UserQuestionnaire>();
        }
    
        public int Trainer_ID { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string ID_Number { get; set; }
        public string Profile_Picture { get; set; }
        public string Email_Address { get; set; }
        public string Contact_Number { get; set; }
        public string Gender { get; set; }
        public string Physical_Address { get; set; }
        public string Trainer_Status { get; set; }
        public Nullable<int> User_ID { get; set; }
        public Nullable<int> Role_ID { get; set; }
        public Nullable<int> TrainingStatus_ID { get; set; }
        public Nullable<int> TrainerStatus_ID { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Availability> Availabilities { get; set; }
        public virtual Role Role { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Session> Sessions { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Task> Tasks { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Trainee> Trainees { get; set; }
        public virtual TrainerStatu TrainerStatu { get; set; }
        public virtual TrainingStatu TrainingStatu { get; set; }
        public virtual User User { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserDaySlot> UserDaySlots { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserQuestionnaire> UserQuestionnaires { get; set; }
    }
}

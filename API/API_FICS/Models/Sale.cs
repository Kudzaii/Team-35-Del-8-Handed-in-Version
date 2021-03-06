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
    
    public partial class Sale
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Sale()
        {
            this.AuditTrails = new HashSet<AuditTrail>();
            this.SaleLines = new HashSet<SaleLine>();
            this.SaleLineServices = new HashSet<SaleLineService>();
        }
    
        public int Sale_ID { get; set; }
        public string Description { get; set; }
        public string PaymentType { get; set; }
        public System.DateTime Date { get; set; }
        public decimal Total { get; set; }
        public Nullable<int> Client_ID { get; set; }
        public Nullable<int> User_ID { get; set; }
        public Nullable<int> PractitionerStatus_ID { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AuditTrail> AuditTrails { get; set; }
        public virtual Client Client { get; set; }
        public virtual PractitionerStatu PractitionerStatu { get; set; }
        public virtual User User { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SaleLine> SaleLines { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SaleLineService> SaleLineServices { get; set; }
    }
}

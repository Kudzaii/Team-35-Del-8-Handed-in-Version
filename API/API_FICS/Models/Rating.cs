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
    
    public partial class Rating
    {
        public int Rating_ID { get; set; }
        public byte Description { get; set; }
        public Nullable<int> Client_ID { get; set; }
        public Nullable<int> Session_ID { get; set; }
    
        public virtual Client Client { get; set; }
        public virtual Session Session { get; set; }
    }
}

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
    
    public partial class Price
    {
        public int Price_ID { get; set; }
        public System.DateTime Date { get; set; }
        public Nullable<System.TimeSpan> Time { get; set; }
        public decimal Amount { get; set; }
        public Nullable<int> Package_ID { get; set; }
    
        public virtual Package Package { get; set; }
    }
}

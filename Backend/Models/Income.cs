namespace Backend.Models
{
    public class Income
    {
        public int Income_id { get; set; } // Primary Key
        public int Hiring_id { get; set; } // Foreign Key referencing Hiring
        public DateTime? Payment_date { get; set; } // Payment date
        public decimal? Amount { get; set; } // Payment amount
    }
}

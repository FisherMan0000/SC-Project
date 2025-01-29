namespace Backend.Models
{
    public class Hiring
    {
        public int Hiring_id { get; set; }
        public int Customer_id { get; set; } // foreing key with id in Customer table
        public int Guard_id { get; set; } //foreing key of Guard_id in Guard table
        public decimal? Price { get; set; }
        public DateTime? Start_date { get; set; }
        public DateTime? End_date { get; set; }
    }
}
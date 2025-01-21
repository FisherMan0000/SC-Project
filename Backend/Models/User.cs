// using System.ComponentModel.DataAnnotations;

// namespace Backend.Models
// {
//     public class User
//     {
//         [Key]
//         public int Id { get; set; }
//         public string Username { get; set; } = string.Empty;
//         public string Password { get; set; } = string.Empty;
//         public string Role { get; set; } = string.Empty;
//     }
// }

// User.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Manager")]
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}

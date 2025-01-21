using Microsoft.EntityFrameworkCore;
using Backend.Models; // Ensure this is included

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Manager { get; set; } = null!;
    }
}

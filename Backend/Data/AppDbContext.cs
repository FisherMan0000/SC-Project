// AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using Backend.Models; // Ensure this is included

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Manager { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Guard> Guards { get; set; } = null!;
        public DbSet<Hiring> Hirings { get; set; } = null!;
        public DbSet<Income> Incomes { get; set; } = null!;
    }
}

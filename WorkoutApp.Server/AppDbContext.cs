using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "Admin", Email = "admin@jym.com" },
                new User { Id = 2, Name = "Guest", Email = "guest@jym.com" },
                new User { Id = 3, Name = "Sample User", Email = "user@jym.com" }
            );
        }
    }
}

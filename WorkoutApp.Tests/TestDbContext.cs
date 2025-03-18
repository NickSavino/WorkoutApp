using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server.WorkoutApp.Tests
{
    public class TestDbContext : AppDbContext
    {
        public TestDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Use in-memory database for testing
            optionsBuilder.UseInMemoryDatabase("TestDatabase");
        }
    }
}
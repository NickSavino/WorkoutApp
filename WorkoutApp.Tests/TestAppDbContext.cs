using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Tests
{
    public class TestAppDbContext : AppDbContext
    {
        public TestAppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Use in-memory database for testing
            optionsBuilder.UseInMemoryDatabase("TestDatabase");
        }
    }
}
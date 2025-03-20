using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WorkoutApp.Server;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Tests
{
    public class TestAppDbContext : AppDbContext
    {
        private readonly IConfiguration _configuration;

        public TestAppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Retrieve the connection string from appsettings.json
            var connectionString = _configuration.GetConnectionString("WorkoutApp_Test");

            // Use SQL Server with the connection string from appsettings.json
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
}

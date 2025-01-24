using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server
{
    public class AppDbContext: DbContext
    {
        private IConfiguration config { get; set; }

        public AppDbContext(IConfiguration config)
        {
            this.config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(config.GetConnectionString("WorkoutApp_Dev"));
        }

        public DbSet<User> Users { get; set; }
    }
}

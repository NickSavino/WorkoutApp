using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server;
using WorkoutApp.Server.Model;
using System.Text;
using System.Security.Cryptography;

namespace WorkoutApp.Tests
{
    public abstract class BaseTest
    {
        protected TestAppDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestWorkoutDB")
                .Options;

            _context = new TestAppDbContext(options);
            _context.Database.EnsureDeleted(); // Reset DB before each test
            _context.Database.EnsureCreated();
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        protected static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}

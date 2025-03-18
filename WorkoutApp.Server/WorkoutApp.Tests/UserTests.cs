using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server;
using WorkoutApp.Server.Model;
using System.Linq;

namespace WorkoutApp.Tests
{
    [TestClass]
    public class UserTests
    {
        private TestAppDbContext _context;

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

        [TestMethod]
        public void AddUser_ShouldIncreaseCount()
        {
            var user = new User { Name = "Test User", Email = "test@example.com" };
            _context.User.Add(user);
            _context.SaveChanges();

            Assert.AreEqual(1, _context.User.Count());
        }

        [TestMethod]
        public void GetUser_ShouldReturnCorrectUser()
        {
            var user = new User { Name = "Test User", Email = "test@example.com" };
            _context.User.Add(user);
            _context.SaveChanges();

            var fetchedUser = _context.User.FirstOrDefault(u => u.Email == "test@example.com");
            Assert.IsNotNull(fetchedUser);
            Assert.AreEqual("Test User", fetchedUser.Name);
        }
    }
}

using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server;
using WorkoutApp.Server.Model;

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
    }
}

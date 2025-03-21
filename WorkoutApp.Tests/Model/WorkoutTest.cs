using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WorkoutApp.Server;
using WorkoutApp.Server.Enums;
using WorkoutApp.Server.Model;
using System.Linq;

namespace WorkoutApp.Tests.Model
{
    [TestClass]
    public class WorkoutTest
    {

        public WorkoutTest()
        {
            // Initialize configuration to read appsettings.json
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            _configuration = builder.Build();
        }
        private AppDbContext _context;
        private IConfiguration _configuration;

        [TestInitialize]
        public void Setup()
        {
            // Get the connection string from the configuration
            var connectionString = _configuration.GetConnectionString("WorkoutApp_Test");

            // Configure DbContext to use SQL Server
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(connectionString)
                .Options;

            _context = new TestAppDbContext(options, _configuration);

            // Reset the database before each test
            _context.Database.EnsureDeleted();

            // Apply migrations and seed data
            _context.Database.EnsureCreated();

            // Add a User to the database (let SQL Server generate the Id)
            var user = new User { Name = "Test User", Email = "test@example.com", PasswordHash = "hashedpassword" };
            _context.User.Add(user);
            _context.SaveChanges();
        }

        [TestMethod]
        public void AddWorkout_ShouldIncreaseCount()
        {
            // Get the user created in Setup
            var user = _context.User.First();

            // Add a Workout associated with the User
            var workout = new Workout { Name = "Morning Routine", UserId = user.Id };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            // Verify that the Workout count has increased
            Assert.AreEqual(1, _context.Workout.Count());
        }


        [TestMethod]
        public void AddWorkoutExercise_ShouldIncreaseCount()
        {
            // Get the user created in Setup
            var user = _context.User.First();

            // Add a Workout
            var workout = new Workout { Name = "Morning Routine", UserId = user.Id };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            // Add an Exercise
            var exercise = new Exercise { Name = "Push-up", Type = ExerciseType.Core };
            _context.Exercise.Add(exercise);
            _context.SaveChanges();

            // Add a WorkoutExercise relationship
            var workoutExercise = new WorkoutExercise { WorkoutId = workout.Id, ExerciseId = exercise.Id };
            _context.WorkoutExercise.Add(workoutExercise);
            _context.SaveChanges();

            // Verify that the WorkoutExercise count has increased
            Assert.AreEqual(1, _context.WorkoutExercise.Count());
        }

        [TestMethod]
        public void AddWorkout_WithInvalidUserId_ShouldThrowException()
        {
            // Attempt to add a Workout with an invalid UserId
            var workout = new Workout { Name = "Invalid Workout", UserId = 999 }; // UserId 999 does not exist
            _context.Workout.Add(workout);

            // Verify that a DbUpdateException is thrown
            Assert.ThrowsException<DbUpdateException>(() => _context.SaveChanges());
        }
    }
}
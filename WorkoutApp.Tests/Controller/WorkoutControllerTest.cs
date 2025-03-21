using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.Controllers;
using WorkoutApp.Server.Model;
using WorkoutApp.Server.Services;
using WorkoutApp.Server.DTO.Workout;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkoutApp.Tests.Controller
{
    [TestClass]
    public class WorkoutControllerTest : BaseTest
    {
        private WorkoutController _controller;
        private WorkoutService _workoutService;

        [TestInitialize]
        public void Initialize()
        {
            _workoutService = new WorkoutService(_context);
            _controller = new WorkoutController(_workoutService);
        }

        [TestMethod]
        public async Task GetWorkoutById_ReturnsWorkout()
        {
            // Arrange
            var user = new User { Name = "Test User", Email = "user@email.com", PasswordHash = "password" };
            _context.User.Add(user);
            _context.SaveChanges();

            var workout = new Workout { Name = "Test Workout", UserId = user.Id };
            _context.Workout.Add(workout);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetWorkoutById(workout.Id);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.IsInstanceOfType(okResult.Value, typeof(Workout));
        }


        [TestMethod]
        public async Task GetWorkoutById_ReturnsNotFound()
        {
            // Act: Fetch non-existent workout
            var result = await _controller.GetWorkoutById(999);

            // Assert: Validate response
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task GetWorkoutByUserId_ReturnsWorkouts()
        {
            // Arrange: Insert a valid user and workouts
            var user = new User { Name = "Test User", Email = "user@email.com", PasswordHash = "password" };
            _context.User.Add(user);
            _context.SaveChanges();

            _context.Workout.Add(new Workout { Name = "Workout 1", UserId = user.Id });
            _context.Workout.Add(new Workout { Name = "Workout 2", UserId = user.Id });
            await _context.SaveChangesAsync();

            // Act: Fetch workouts by user ID
            var result = await _controller.GetWorkoutByUserId(user.Id);

            // Assert: Validate response
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result.Result;
            Assert.IsInstanceOfType(okResult.Value, typeof(IEnumerable<WorkoutUpdateModel>));
            Assert.AreEqual(2, ((IEnumerable<WorkoutUpdateModel>)okResult.Value).Count());
        }

        [TestMethod]
        public async Task CreateWorkout_ReturnsCreatedWorkout()
        {
            // Arrange: Insert a valid user
            var user = new User { Name = "Test User", Email = "user@email.com", PasswordHash = "password" };
            _context.User.Add(user);
            _context.SaveChanges();

            var newWorkout = new WorkoutUpdateModel { Name = "New Workout", UserId = user.Id };

            // Act: Create workout
            var result = await _controller.CreateWorkout(newWorkout);

            // Assert: Validate response
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result.Result;
            Assert.IsInstanceOfType(okResult.Value, typeof(WorkoutUpdateModel));
            Assert.AreEqual(newWorkout.Name, ((WorkoutUpdateModel)okResult.Value).Name);
        }

        [TestMethod]
        public async Task UpdateWorkout_ReturnsUpdatedWorkout()
        {
            // Arrange: Insert a valid user and workout
            var user = new User { Name = "Test User", Email = "user@email.com", PasswordHash = "password" };
            _context.User.Add(user);
            _context.SaveChanges();

            var workout = new Workout { Name = "Old Workout", UserId = user.Id };
            _context.Workout.Add(workout);
            await _context.SaveChangesAsync();

            var updatedWorkout = new WorkoutUpdateModel { Id = workout.Id, Name = "Updated Workout", UserId = user.Id };

            // Act: Update workout
            var result = await _controller.UpdateWorkout(updatedWorkout);

            // Assert: Validate response
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result.Result;
            Assert.AreEqual("Updated Workout", ((WorkoutUpdateModel)okResult.Value).Name);
        }

        [TestMethod]
        public async Task DeleteWorkout_ReturnsNoContent()
        {
            // Arrange: Insert a valid user and workout
            var user = new User { Name = "Test User", Email = "user@email.com", PasswordHash = "password" };
            _context.User.Add(user);
            _context.SaveChanges();

            var workout = new Workout { Name = "Workout to Delete", UserId = user.Id };
            _context.Workout.Add(workout);
            await _context.SaveChangesAsync();

            // Act: Delete workout
            var result = await _controller.DeleteWorkout(workout.Id);

            // Assert: Validate response
            Assert.IsInstanceOfType(result, typeof(NoContentResult));

            // Verify workout is deleted
            var deletedWorkout = await _context.Workout.FindAsync(workout.Id);
            Assert.IsNull(deletedWorkout);
        }

        [TestMethod]
        public async Task DeleteWorkout_ReturnsNotFound()
        {
            // Act: Try to delete non-existent workout
            var result = await _controller.DeleteWorkout(999);

            // Assert: Validate response
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }
    }
}

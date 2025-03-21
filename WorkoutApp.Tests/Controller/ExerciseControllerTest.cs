using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server;
using WorkoutApp.Server.Controllers;
using WorkoutApp.Server.Model;
using WorkoutApp.Server.Services;
using WorkoutApp.Server.DTO.Exercise;
using WorkoutApp.Server.Enums;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WorkoutApp.Tests.Controller
{
    [TestClass]
    public class ExerciseControllerTest : BaseTest
    {
        private ExerciseController _controller;
        private ExerciseService _exerciseService;

        [TestInitialize]
        public void Initialize()
        {
            // Initialize ExerciseService with test database context
            _exerciseService = new ExerciseService(_context);
            _controller = new ExerciseController(_exerciseService);
        }


        [TestMethod]
        public async Task GetExerciseById_ReturnsNotFound_WhenExerciseDoesNotExist()
        {
            // Act: Call the controller method with a non-existing ID
            var result = await _controller.GetExerciseById(999);

            // Assert: Validate the response
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }



        [TestMethod]
        public async Task DeleteExercise_ReturnsNoContent_WhenDeleted()
        {
            // Arrange: Add test data to the database
            var exercise = new Exercise { Name = "Push-up", Type = ExerciseType.Chest };
            _context.Exercise.Add(exercise);
            await _context.SaveChangesAsync();

            // Act: Call the controller method to delete the exercise
            var result = await _controller.DeleteExercise(exercise.Id);

            // Assert: Validate the response
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        [TestMethod]
        public async Task DeleteExercise_ReturnsNotFound_WhenExerciseDoesNotExist()
        {
            // Act: Call the controller method with a non-existing ID
            var result = await _controller.DeleteExercise(999);

            // Assert: Validate the response
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }
    }
}

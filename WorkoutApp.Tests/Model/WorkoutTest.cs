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
    public class WorkoutTest: BaseTest
    {
        
        [TestMethod]
        public void AddWorkout_ShouldIncreaseCount()
        {
            //Setup new user
            var user = new User { Name = "Test User", Email = "test@example.com", PasswordHash = "hashedpassword" };
            _context.User.Add(user);
            _context.SaveChanges();

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
            var user = new User { Name = "Test User", Email = "test@example.com", PasswordHash = "hashedpassword" };
            _context.User.Add(user);
            _context.SaveChanges();

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
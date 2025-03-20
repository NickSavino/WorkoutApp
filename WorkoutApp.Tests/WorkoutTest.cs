using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using WorkoutApp.Server.Enums;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Tests
{
    [TestClass]
    public class WorkoutTest : BaseTest
    {
        [TestMethod]
        public void AddWorkout_ShouldIncreaseCount()
        {
            var workout = new Workout { Name = "Morning Routine", UserId = 1 };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            Assert.AreEqual(1, _context.Workout.Count());
        }

        [TestMethod]
        public void GetWorkout_ShouldReturnCorrectWorkout()
        {
            var workout = new Workout { Name = "Cardio Blast", UserId = 1 };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            var fetchedWorkout = _context.Workout.FirstOrDefault(w => w.Name == "Cardio Blast");
            Assert.IsNotNull(fetchedWorkout);
            Assert.AreEqual("Cardio Blast", fetchedWorkout.Name);
        }

        [TestMethod]
        public void Workout_ShouldHaveCorrectUserAssociation()
        {
            var user = new User { Name = "John Doe", Email = "john@example.com", PasswordHash = HashPassword("securepassword") };
            _context.User.Add(user);
            _context.SaveChanges();

            var workout = new Workout { Name = "Strength Training", UserId = user.Id };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            var fetchedWorkout = _context.Workout.FirstOrDefault(w => w.Name == "Strength Training");
            Assert.IsNotNull(fetchedWorkout);
            Assert.AreEqual(user.Id, fetchedWorkout.UserId);
        }

        [TestMethod]
        public void Workout_ShouldHaveWorkoutExercises()
        {
            // Create Workout
            var workout = new Workout { Name = "Full Body", UserId = 1 };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            // Create Exercises with required Type field
            var exercise1 = new Exercise { Name = "Push-up", Type = ExerciseType.Core };
            var exercise2 = new Exercise { Name = "Squat", Type = ExerciseType.Legs };

            _context.Exercise.AddRange(exercise1, exercise2);
            _context.SaveChanges();

            // Link Exercises to Workout
            var workoutExercise1 = new WorkoutExercise { WorkoutId = workout.Id, ExerciseId = exercise1.Id };
            var workoutExercise2 = new WorkoutExercise { WorkoutId = workout.Id, ExerciseId = exercise2.Id };

            _context.WorkoutExercise.AddRange(workoutExercise1, workoutExercise2);
            _context.SaveChanges();

            // Fetch Workout and Include Exercises
            var fetchedWorkout = _context.Workout
                .Where(w => w.Id == workout.Id)
                .Select(w => new { w.Id, Exercises = w.WorkoutExercises.Select(we => we.Exercise) })
                .FirstOrDefault();

            Assert.IsNotNull(fetchedWorkout);
            Assert.AreEqual(2, fetchedWorkout.Exercises.Count());
        }

        [TestMethod]
        public void AddDuplicateWorkout_ShouldNotIncreaseCount()
        {
            var workout = new Workout { Name = "Morning Routine", UserId = 1 };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            var duplicateWorkout = new Workout { Name = "Morning Routine", UserId = 1 };
            _context.Workout.Add(duplicateWorkout);
            Assert.ThrowsException<Exception>(() => _context.SaveChanges());

            Assert.AreEqual(1, _context.Workout.Count());
        }

        [TestMethod]
        public void AddWorkout_WithInvalidUserId_ShouldThrowException()
        {
            var workout = new Workout { Name = "Invalid Workout", UserId = 999 };
            _context.Workout.Add(workout);
            Assert.ThrowsException<Exception>(() => _context.SaveChanges());
        }

        [TestMethod]
        public void GetNonExistentWorkout_ShouldReturnNull()
        {
            var fetchedWorkout = _context.Workout.FirstOrDefault(w => w.Name == "NonExistentWorkout");
            Assert.IsNull(fetchedWorkout);
        }

        [TestMethod]
        public void UpdateWorkout_ShouldModifyWorkoutDetails()
        {
            var workout = new Workout { Name = "Morning Routine", UserId = 1 };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            workout.Name = "Evening Routine";
            _context.Workout.Update(workout);
            _context.SaveChanges();

            var updatedWorkout = _context.Workout.FirstOrDefault(w => w.Name == "Evening Routine");
            Assert.IsNotNull(updatedWorkout);
            Assert.AreEqual("Evening Routine", updatedWorkout.Name);
        }

        [TestMethod]
        public void DeleteWorkout_ShouldDecreaseCount()
        {
            var workout = new Workout { Name = "Morning Routine", UserId = 1 };
            _context.Workout.Add(workout);
            _context.SaveChanges();

            _context.Workout.Remove(workout);
            _context.SaveChanges();

            Assert.AreEqual(0, _context.Workout.Count());
        }

        [TestMethod]
        public void DeleteNonExistentWorkout_ShouldNotAffectCount()
        {
            var initialCount = _context.Workout.Count();
            var nonExistentWorkout = new Workout { Id = 999, Name = "NonExistentWorkout", UserId = 1 };
            _context.Workout.Remove(nonExistentWorkout);
            Assert.ThrowsException<Exception>(() => _context.SaveChanges());

            Assert.AreEqual(initialCount, _context.Workout.Count());
        }
    }
}

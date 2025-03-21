using Microsoft.VisualStudio.TestTools.UnitTesting;
using WorkoutApp.Server.Enums;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Tests.Model
{
    [TestClass]
    public class WorkoutExerciseTests : BaseTest
    {
        [TestMethod]
        public void WorkoutExercise_Properties_InitializedCorrectly()
        {
            // Arrange
            var workoutExercise = new WorkoutExercise
            {
                Id = 1,
                WorkoutId = 10,
                ExerciseId = 20,
                Sets = 3,
                Reps = 12,
                Weight = 50.5f,
                Notes = "Test Notes"
            };

            // Assert
            Assert.AreEqual(1, workoutExercise.Id);
            Assert.AreEqual(10, workoutExercise.WorkoutId);
            Assert.AreEqual(20, workoutExercise.ExerciseId);
            Assert.AreEqual(3, workoutExercise.Sets);
            Assert.AreEqual(12, workoutExercise.Reps);
            Assert.AreEqual(50.5f, workoutExercise.Weight);
            Assert.AreEqual("Test Notes", workoutExercise.Notes);
        }

        [TestMethod]
        public void WorkoutExercise_NullableProperties_CanBeNull()
        {
            // Arrange
            var workoutExercise = new WorkoutExercise
            {
                Id = 1,
                WorkoutId = 10,
                ExerciseId = 20,
                Sets = 3,
                Reps = 12,
                Weight = null, // Nullable property
                Notes = null  // Nullable property
            };

            // Assert
            Assert.IsNull(workoutExercise.Weight);
            Assert.IsNull(workoutExercise.Notes);
        }


        [TestMethod]
        public void WorkoutExercise_NavigationProperties_InitializedCorrectly()
        {
            // Arrange
            var workout = new Workout { Id = 10, Name = "Morning Routine" };
            var exercise = new Exercise { Id = 20, Name = "Push-up", Type = ExerciseType.Core };

            var workoutExercise = new WorkoutExercise
            {
                Id = 1,
                WorkoutId = 10,
                ExerciseId = 20,
                Workout = workout,
                Exercise = exercise
            };

            // Assert
            Assert.IsNotNull(workoutExercise.Workout);
            Assert.AreEqual("Morning Routine", workoutExercise.Workout.Name);

            Assert.IsNotNull(workoutExercise.Exercise);
            Assert.AreEqual("Push-up", workoutExercise.Exercise.Name);
        }

    }



}


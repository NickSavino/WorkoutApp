using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using WorkoutApp.Server.Enums;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Tests
{
    [TestClass]
    public class ExerciseTest : BaseTest
    {
        [TestMethod]
        public void AddExercise_ShouldIncreaseCount()
        {
            var exercise = new Exercise { Name = "Push-up", Type = ExerciseType.Core };
            _context.Exercise.Add(exercise);
            _context.SaveChanges();

            Assert.AreEqual(1, _context.Exercise.Count());
        }

        [TestMethod]
        public void GetExercise_ShouldReturnCorrectExercise()
        {
            var exercise = new Exercise { Name = "Squat", Type = ExerciseType.Legs };
            _context.Exercise.Add(exercise);
            _context.SaveChanges();

            var fetchedExercise = _context.Exercise.FirstOrDefault(e => e.Name == "Squat");
            Assert.IsNotNull(fetchedExercise);
            Assert.AreEqual("Squat", fetchedExercise.Name);
        }

        [TestMethod]
        public void UpdateExercise_ShouldModifyExerciseDetails()
        {
            var exercise = new Exercise { Name = "Plank", Type = ExerciseType.Core };
            _context.Exercise.Add(exercise);
            _context.SaveChanges();

            exercise.Name = "Side Plank";
            _context.Exercise.Update(exercise);
            _context.SaveChanges();

            var updatedExercise = _context.Exercise.FirstOrDefault(e => e.Name == "Side Plank");
            Assert.IsNotNull(updatedExercise);
            Assert.AreEqual("Side Plank", updatedExercise.Name);
        }

        [TestMethod]
        public void DeleteExercise_ShouldDecreaseCount()
        {
            var exercise = new Exercise { Name = "Lunge", Type = ExerciseType.Legs };
            _context.Exercise.Add(exercise);
            _context.SaveChanges();

            _context.Exercise.Remove(exercise);
            _context.SaveChanges();

            Assert.AreEqual(0, _context.Exercise.Count());
        }

        [TestMethod]
        public void Exercise_ShouldHaveCorrectType()
        {
            var exercise = new Exercise { Name = "Bench Press", Type = ExerciseType.Chest };
            _context.Exercise.Add(exercise);
            _context.SaveChanges();

            var fetchedExercise = _context.Exercise.FirstOrDefault(e => e.Name == "Bench Press");
            Assert.IsNotNull(fetchedExercise);
            Assert.AreEqual(ExerciseType.Chest, fetchedExercise.Type);
        }

        [TestMethod]
        public void AddDuplicateExercise_ShouldNotIncreaseCount()
        {
            var exercise = new Exercise { Name = "Push-up", Type = ExerciseType.Core };
            _context.Exercise.Add(exercise);
            _context.SaveChanges();

            var duplicateExercise = new Exercise { Name = "Push-up", Type = ExerciseType.Core };
            _context.Exercise.Add(duplicateExercise);
            Assert.ThrowsException<Exception>(() => _context.SaveChanges());

            Assert.AreEqual(1, _context.Exercise.Count());
        }

        [TestMethod]
        public void AddExercise_WithInvalidType_ShouldThrowException()
        {
            var exercise = new Exercise { Name = "Invalid Exercise", Type = (ExerciseType)999 };
            _context.Exercise.Add(exercise);
            Assert.ThrowsException<Exception>(() => _context.SaveChanges());
        }

        [TestMethod]
        public void GetNonExistentExercise_ShouldReturnNull()
        {
            var fetchedExercise = _context.Exercise.FirstOrDefault(e => e.Name == "NonExistentExercise");
            Assert.IsNull(fetchedExercise);
        }



        [TestMethod]
        public void AddExercise_WithEmptyName_ShouldThrowException()
        {
            var exercise = new Exercise { Name = "", Type = ExerciseType.Core };
            _context.Exercise.Add(exercise);
            Assert.ThrowsException<Exception>(() => _context.SaveChanges());
        }
    }
}

using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.DTO.Exercise;
using WorkoutApp.Server.Enums;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server.Services
{
    public class ExerciseService
    {

        private readonly AppDbContext _context;

        public ExerciseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExerciseRowModel>> GetExercises()
        {
            return await _context.Exercise
                .Select(e => new ExerciseRowModel
                {
                    Id = e.Id,
                    Name = e.Name,
                    Type = e.Type,
                    Description = e.Description,
                })
                .ToListAsync();
        }

        public async Task<ExerciseRowModel?> GetExerciseById(int id)
        {
            return await _context.Exercise
                .Where(e => e.Id == id)
                .Select(e => new ExerciseRowModel
                {
                    Id = e.Id,
                    Name = e.Name,
                    Type = e.Type,
                })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ExerciseRowModel>> GetExercisesByType(ExerciseType type)
        {
            return await _context.Exercise
                .Where(e => e.Type == type)
                .Select(e => new ExerciseRowModel
                {
                    Id = e.Id,
                    Name = e.Name,
                    Type = e.Type,
                })
                .ToListAsync();
        }

        public async Task<ExerciseUpdateModel> AddOrUpdateExercise(ExerciseUpdateModel exerciseModel)
        {
            if (exerciseModel.Id > 0)
            {
                // Updating an existing exercise
                var existingExercise = await _context.Exercise.FindAsync(exerciseModel.Id);
                if (existingExercise == null) throw new Exception("Exercise not found.");

                existingExercise.Name = exerciseModel.Name;
                existingExercise.Type = exerciseModel.Type;
                existingExercise.Description = exerciseModel.Description;
            }
            else
            {
                // Creating a new exercise
                var newExercise = new Exercise
                {
                    Name = exerciseModel.Name,
                    Type = exerciseModel.Type,
                    Description = exerciseModel.Description
                };
                _context.Exercise.Add(newExercise);
            }

            await _context.SaveChangesAsync();

            return exerciseModel;
        }
        public async Task<bool> DeleteExercise(int id)
        {
            var exercise = await _context.Exercise.FindAsync(id);
            if (exercise == null) return false;

            _context.Exercise.Remove(exercise);
            await _context.SaveChangesAsync();
            return true;
        }

        internal async Task<object?> GetExercisesByType(string type)
        {
            throw new NotImplementedException();
        }
    }
}

using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<Exercise>> GetExercises()
        {
            return await _context.Exercise.ToListAsync();
        }

        public async Task<Exercise?> GetExerciseById(int id)
        {
            return await _context.Exercise.FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Exercise> CreateExercise(Exercise exercise)
        {
            _context.Exercise.Add(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task<bool> DeleteExercise(int id)
        {
            var exercise = await _context.Exercise.FindAsync(id);
            if (exercise == null) return false;

            _context.Exercise.Remove(exercise);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

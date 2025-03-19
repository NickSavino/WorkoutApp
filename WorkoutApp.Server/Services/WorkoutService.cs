using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server.Services
{
    public class WorkoutService
    {

        private readonly AppDbContext _context;

        public WorkoutService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Workout>> GetWorkouts()
        {
            return await _context.Workout.Include(w => w.WorkoutExercises).ToListAsync();
        }

        public async Task<Workout?> GetWorkoutById(int id)
        {
            return await _context.Workout
                .Include(w => w.WorkoutExercises)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<Workout?> GetWorkoutByUserId(int userId)
        {
            return await _context.Workout
                    .Include(w => w.WorkoutExercises)
                    .FirstOrDefaultAsync(w => w.Id == userId);
        }

        public async Task<Workout> CreateWorkout(Workout workout)
        {
            _context.Workout.Add(workout);
            await _context.SaveChangesAsync();
            return workout;
        }

        public async Task<bool> DeleteWorkout(int id)
        {
            var workout = await _context.Workout.FindAsync(id);
            if (workout == null) return false;

            _context.Workout.Remove(workout);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

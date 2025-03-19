using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.DTO.Exercise;
using WorkoutApp.Server.DTO.Workout;
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

        public async Task<IEnumerable<WorkoutUpdateModel>> GetWorkoutsByUserId(int userId)
        {
            var workouts = await _context.Workout
                .Where(w => w.UserId == userId)
                .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise)
                .ToListAsync();

            return workouts.Select(w => new WorkoutUpdateModel
            {
                Name = w.Name,
                UserId = w.UserId,
                Exercises = w.WorkoutExercises.Select(we => new ExerciseRowModel
                {
                    Id = we.ExerciseId,
                    Notes = null
                }).ToList()
            });
        }

        public async Task<WorkoutUpdateModel> CreateWorkout(WorkoutUpdateModel workoutModel)
        {
            var newWorkout = new Workout
            {
                Name = workoutModel.Name,
                UserId = workoutModel.UserId,
                WorkoutExercises = workoutModel.Exercises.Select(e => new WorkoutExercise
                {
                    ExerciseId = e.Id
                }).ToList()
            };

            _context.Workout.Add(newWorkout);
            await _context.SaveChangesAsync();

            return new WorkoutUpdateModel
            {
                Name = newWorkout.Name,
                UserId = newWorkout.UserId,
                Exercises = newWorkout.WorkoutExercises.Select(we => new ExerciseRowModel
                {
                    Id = we.ExerciseId,
                    Notes = null
                }).ToList()
            };
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

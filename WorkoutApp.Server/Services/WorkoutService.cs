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
                Id = w.Id,
                Name = w.Name,
                UserId = w.UserId,
                WorkoutExercises = w.WorkoutExercises.Select(we => new WorkoutExerciseRowModel
                {
                    ExerciseId = we.ExerciseId,
                    ExerciseName = we.Exercise.Name,
                    Sets = we.Sets,
                    Reps = we.Reps,
                    Weight = we.Weight,
                    Notes = we.Notes
                }).ToList()
            });
        }

        public async Task<WorkoutUpdateModel> CreateWorkout(WorkoutUpdateModel workoutModel)
        {
            var newWorkout = new Workout
            {
                Name = workoutModel.Name,
                UserId = workoutModel.UserId,
                WorkoutExercises = workoutModel.WorkoutExercises.Select(e => new WorkoutExercise
                {
                    ExerciseId = e.ExerciseId,
                    Sets = e.Sets,
                    Reps = e.Reps,
                    Weight = e.Weight,
                    Notes = e.Notes
                }).ToList()
            };

            _context.Workout.Add(newWorkout);
            await _context.SaveChangesAsync();

            return new WorkoutUpdateModel
            {
                Name = newWorkout.Name,
                UserId = newWorkout.UserId,
                WorkoutExercises = newWorkout.WorkoutExercises.Select(we => new WorkoutExerciseRowModel
                {
                    ExerciseId = we.ExerciseId,
                    ExerciseName = we.Exercise?.Name ?? "Unknown Exercise",
                    Sets = we.Sets,
                    Reps = we.Reps,
                    Weight = we.Weight,
                    Notes = we.Notes
                }).ToList()
            };
        }


        public async Task<WorkoutUpdateModel?> UpdateWorkout(WorkoutUpdateModel workoutModel)
        {
            var workout = await _context.Workout
                .Include(w => w.WorkoutExercises)
                .FirstOrDefaultAsync(w => w.Id == workoutModel.Id);

            if (workout == null) return null;

            workout.Name = workoutModel.Name;

            _context.WorkoutExercise.RemoveRange(workout.WorkoutExercises);

            workout.WorkoutExercises = workoutModel.WorkoutExercises.Select(e => new WorkoutExercise
            {
                WorkoutId = workoutModel.Id,
                ExerciseId = e.ExerciseId,
                Sets = e.Sets,
                Reps = e.Reps,
                Weight = e.Weight,
                Notes = e.Notes
            }).ToList();

            await _context.SaveChangesAsync();

            return new WorkoutUpdateModel
            {
                Name = workout.Name,
                UserId = workout.UserId,
                WorkoutExercises = workout.WorkoutExercises.Select(we => new WorkoutExerciseRowModel
                {
                    ExerciseId = we.ExerciseId,
                    ExerciseName = we.Exercise?.Name,
                    Sets = we.Sets,
                    Reps = we.Reps,
                    Weight = we.Weight,
                    Notes = we.Notes
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

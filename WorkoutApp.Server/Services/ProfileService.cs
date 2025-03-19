using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server.DTO.Profile;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server.Services
{
    public class ProfileService
    {
        private readonly AppDbContext _context;

        public ProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProfileStatsModel> GetUserStats(int userId)
        {
            var workouts = await _context.Workout
                .Where(w => w.UserId == userId)
                .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise)
                .ToListAsync();

            if (!workouts.Any()) return new ProfileStatsModel();

            int totalWorkouts = workouts.Count;
            int totalExercises = workouts.Sum(w => w.WorkoutExercises.Count);
            int totalReps = workouts.Sum(w => w.WorkoutExercises.Sum(we => we.Reps));
            int totalSets = workouts.Sum(w => w.WorkoutExercises.Sum(we => we.Sets));
            
            double averageWeight = workouts
                .SelectMany(w => w.WorkoutExercises)
                .Where(we => we.Weight.HasValue)
                .Select(we => we.Weight.Value)
                .DefaultIfEmpty(0)
                .Average();

            var muscleGroupCounts = workouts
                .SelectMany(w => w.WorkoutExercises)
                .GroupBy(we => we.Exercise.Type)
                .ToDictionary(g => g.Key.ToString(), g => g.Count());

            int streak = CalculateWorkoutStreak(workouts);

            return new ProfileStatsModel
            {
                TotalWorkouts = totalWorkouts,
                TotalExercises = totalExercises,
                TotalReps = totalReps,
                TotalSets = totalSets,
                AverageWeight = averageWeight,
                MuscleGroupCounts = muscleGroupCounts,
                WorkoutStreak = streak
            };
        }

        private int CalculateWorkoutStreak(List<Workout> workouts)
        {
            var orderedDates = workouts
                .Select(w => w.CreatedAt.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToList();

            if (!orderedDates.Any()) return 0;

            int streak = 1;
            for (int i = 1; i < orderedDates.Count; i++)
            {
                if (orderedDates[i] == orderedDates[i - 1].AddDays(-1))
                    streak++;
                else
                    break;
            }

            return streak;
        }
    }

}

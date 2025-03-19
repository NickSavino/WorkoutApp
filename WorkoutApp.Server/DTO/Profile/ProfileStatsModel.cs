namespace WorkoutApp.Server.DTO.Profile
{
    public class ProfileStatsModel
    {

        public int TotalWorkouts { get; set; }

        public int TotalExercises { get; set; }

        public int TotalReps { get; set; }

        public int TotalSets { get; set; }

        public double AverageWeight { get; set; }

        public Dictionary<string, int> MuscleGroupCounts { get; set; } = new();

        public int WorkoutStreak { get; set; }
    }
}

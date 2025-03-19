namespace WorkoutApp.Server.DTO.Workout
{
    public class WorkoutExerciseRowModel
    {
        public int ExerciseId { get; set; }
        public string ExerciseName { get; set; } = string.Empty;
        public int Sets { get; set; }
        public int Reps { get; set; }
        public float? Weight { get; set; }
        public string? Notes { get; set; }
    }
}

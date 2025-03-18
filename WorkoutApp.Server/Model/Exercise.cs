namespace WorkoutApp.Server.Model
{
    public class Exercise : BaseEntity
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Type { get; set; }

        public float Measurement { get; set; }

        // Navigation Property
        public List<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    }
}

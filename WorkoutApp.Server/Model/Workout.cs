namespace WorkoutApp.Server.Model
{
    public class Workout : BaseEntity
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        // Foreign Keys
        public int UserId { get; set; }
        public User? User { get; set; }

        // Navigation Property
        public List<WorkoutExercise> WorkoutExercises { get; set; } = new();
    }
}

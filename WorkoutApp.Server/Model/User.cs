namespace WorkoutApp.Server.Model
{
    public class User: BaseEntity
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Email { get; set; }

        public required string PasswordHash { get; set; }

        // Navigation Property
        public List<Workout> Workouts { get; set; } = new List<Workout>();
    }
}

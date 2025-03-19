namespace WorkoutApp.Server.Model
{
    // Junction Table between Workouts and Exercises
    public class WorkoutExercise : BaseEntity
    {
        public int Id { get; set; }

        public int WorkoutId { get; set; }
        public Workout Workout { get; set; } = null;

        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null;
    }
}

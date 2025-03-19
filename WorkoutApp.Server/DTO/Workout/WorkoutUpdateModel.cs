using WorkoutApp.Server.DTO.Exercise;

namespace WorkoutApp.Server.DTO.Workout
{
    public class WorkoutUpdateModel
    {
        public required string Name { get; set; }

        public required int UserId { get; set; }

        public List<ExerciseRowModel> Exercises { get; set; } = new();
    }
}

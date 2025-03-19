using WorkoutApp.Server.DTO.Exercise;

namespace WorkoutApp.Server.DTO.Workout
{
    public class WorkoutUpdateModel
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public required int UserId { get; set; }

        public List<WorkoutExerciseRowModel> WorkoutExercises { get; set; } = new();
    }
}

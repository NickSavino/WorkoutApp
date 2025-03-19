using WorkoutApp.Server.Enums;

namespace WorkoutApp.Server.DTO.Exercise
{
    public class ExerciseUpdateModel
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required ExerciseType Type { get; set; }

        public string? Description { get; set; }
    }
}

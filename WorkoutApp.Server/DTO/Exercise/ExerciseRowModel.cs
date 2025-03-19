using WorkoutApp.Server.Enums;

namespace WorkoutApp.Server.DTO.Exercise
{
    public class ExerciseRowModel
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public ExerciseType Type { get; set; }

        public string? Description { get; set; }
    }
}

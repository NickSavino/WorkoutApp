using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutApp.Server.Model
{
public abstract class BaseEntity
    {
        //[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedAt { get; set; } // Non-nullable

        //[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime UpdatedAt { get; set; } // Non-nullable
    }
}

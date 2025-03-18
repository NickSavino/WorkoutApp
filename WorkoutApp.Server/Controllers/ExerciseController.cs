using Microsoft.AspNetCore.Mvc;
using WorkoutApp.Server.Model;
using WorkoutApp.Server.Services;

namespace WorkoutApp.Server.Controllers
{
    [Route("api/exercise")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {

        private readonly ExerciseService _exerciseService;

        public ExerciseController(ExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        [HttpGet("get")]
        public async Task<IEnumerable<Exercise>> GetExercises()
        {
            return await _exerciseService.GetExercises();
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<Exercise>> GetExerciseById(int id)
        {
            var exercise = await _exerciseService.GetExerciseById(id);
            if (exercise == null) return NotFound();
            return Ok(exercise);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Exercise>> CreateExercise([FromBody] Exercise exercise)
        {
            var createdExercise = await _exerciseService.CreateExercise(exercise);
            return CreatedAtAction(nameof(GetExerciseById), new { id = createdExercise.Id }, createdExercise);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            var success = await _exerciseService.DeleteExercise(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}

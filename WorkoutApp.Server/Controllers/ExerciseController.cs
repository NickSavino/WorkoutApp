using Microsoft.AspNetCore.Mvc;
using WorkoutApp.Server.DTO.Exercise;
using WorkoutApp.Server.Enums;
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
        public async Task<ActionResult<IEnumerable<ExerciseRowModel>>> GetExercises()
        {
            return Ok(await _exerciseService.GetExercises());
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<Exercise>> GetExerciseById(int id)
        {
            var exercise = await _exerciseService.GetExerciseById(id);
            if (exercise == null) return NotFound();
            return Ok(exercise);
        }

        [HttpGet("get/type/{type}")]
        public async Task<ActionResult<IEnumerable<ExerciseRowModel>>> GetExercisesByType(ExerciseType type)
        {
            return Ok(await _exerciseService.GetExercisesByType(type));
        }


        [HttpPost("addOrUpdate")]
        public async Task<ActionResult<ExerciseUpdateModel>> AddOrUpdateExercise([FromBody] ExerciseUpdateModel exercise)
        {
            var result = await _exerciseService.AddOrUpdateExercise(exercise);
            return Ok(result);
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

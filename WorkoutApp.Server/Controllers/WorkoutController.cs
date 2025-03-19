using Microsoft.AspNetCore.Mvc;
using WorkoutApp.Server.Model;
using WorkoutApp.Server.Services;

namespace WorkoutApp.Server.Controllers
{
    [Route("api/workout")]
    [ApiController]
    public class WorkoutController : ControllerBase
    {

        private readonly WorkoutService _workoutService;

        public WorkoutController(WorkoutService workoutService)
        {
            _workoutService = workoutService;
        }

        [HttpGet("get")]
        public async Task<IEnumerable<Workout>> GetWorkouts()
        {
            return await _workoutService.GetWorkouts();
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<Workout>> GetWorkoutById(int id)
        {
            var workout = await _workoutService.GetWorkoutById(id);
            if (workout == null) return NotFound();
            return Ok(workout);
        }

        [HttpGet("get/userid/{userId}")]
        public async Task<ActionResult<Workout>> GetWorkoutByUserId(int userId)
        {
            var workout = await _workoutService.GetWorkoutByUserId(userId);
            if (workout == null) return NotFound();
            return Ok(workout);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Workout>> CreateWorkout([FromBody] Workout workout)
        {
            var createdWorkout = await _workoutService.CreateWorkout(workout);
            return CreatedAtAction(nameof(GetWorkoutById), new { id = createdWorkout.Id }, createdWorkout);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            var success = await _workoutService.DeleteWorkout(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}

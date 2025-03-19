using Microsoft.AspNetCore.Mvc;
using WorkoutApp.Server.DTO.Profile;
using WorkoutApp.Server.Services;

namespace WorkoutApp.Server.Controllers
{
    
    [Route("api/profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _profileService;

        public ProfileController(ProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("stats/{userId}")]
        public async Task<ActionResult<ProfileStatsModel>> GetProfileStats(int userId)
        {
            var stats = await _profileService.GetUserStats(userId);
            return Ok(stats);
        }
    }

}

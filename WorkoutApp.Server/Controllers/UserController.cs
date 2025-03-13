using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Server;
using WorkoutApp.Server.Model;
using WorkoutApp.Server.Services;

namespace WorkoutApp.Server.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserService userService;

        public UserController(UserService userService)
        {
            this.userService = userService;
        }

        [HttpGet("get")]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await userService.GetUsers();
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] string nameOrEmail)
        {
            var user = await userService.AuthenticateUser(nameOrEmail);
            if (user == null) return NotFound("User not found");

            return Ok(user);
        }
    }
}

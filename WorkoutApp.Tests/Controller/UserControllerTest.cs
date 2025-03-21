using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using WorkoutApp.Server.Controllers;
using WorkoutApp.Server.Model;
using WorkoutApp.Server.DTO.User;
using WorkoutApp.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace WorkoutApp.Tests.Controller
{
    [TestClass]
    public class UserControllerTest : BaseTest
    {
        private UserController _controller;
        private UserService _userService;

        [TestInitialize]
        public void Initialize()
        {
            // Initialize UserService with the test database context
            _userService = new UserService(_context);
            _controller = new UserController(_userService);
        }

        [TestMethod]
        public async Task GetUsers_ReturnsListOfUsers()
        {
            // Arrange: Add test data to the database
            _context.User.Add(new User { Name = "Test User", Email = "testuser@email.com", PasswordHash = "password" });
            await _context.SaveChangesAsync();

            // Act: Call the controller method
            var result = await _controller.GetUsers();

            // Assert: Validate the response type and count
            Assert.IsInstanceOfType(result, typeof(IEnumerable<User>));
            Assert.AreEqual(1, result.Count());
        }



        [TestMethod]
        public async Task Login_ReturnsNotFound_WhenInvalidCredentials()
        {
            // Arrange: Add a user to the database
            var user = new User { Name = "Test User", Email = "testuser@email.com", PasswordHash = "password" };
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            // Create login model with incorrect password
            var loginModel = new UserLoginRequestModel { NameOrEmail = "testuser@email.com", Password = "wrongpassword" };

            // Act: Call the controller method
            var result = await _controller.Login(loginModel);

            // Assert: Ensure the response is NotFound with the message "User not found"
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundObjectResult)); // Check if the result is NotFoundObjectResult

            var notFoundResult = result.Result as NotFoundObjectResult; // Access the Result property and cast it
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual("User not found", notFoundResult.Value); // Check the error message
        }

        [TestMethod]
        public async Task Register_ReturnsUser_WhenValidData()
        {
            // Arrange: Create a register model with valid data
            var registerModel = new UserRegisterRequestModel
            {
                Username = "New User",
                Email = "newuser@email.com",
                Password = "password"
            };

            // Act: Call the controller method to register the user
            var result = await _controller.Register(registerModel);

            // Assert: Ensure the response is OK and contains the user object
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if the result is OkObjectResult

            var okResult = result.Result as OkObjectResult; // Access the Result property and cast it
            Assert.IsNotNull(okResult);
            var returnedUser = okResult.Value as User; // Access the Value property of OkObjectResult
            Assert.IsNotNull(returnedUser);
            Assert.AreEqual(registerModel.Email, returnedUser.Email);
        }

    }
}

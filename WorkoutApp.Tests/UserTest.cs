using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using WorkoutApp.Server.Model;
using System.Security.Cryptography;
using System.Text;

namespace WorkoutApp.Tests
{
    [TestClass]
    public class UserTest : BaseTest
    {


        [TestMethod]
        public void AddUser_ShouldIncreaseCount()
        {
            var user = new User
            {
                Name = "Test User",
                Email = "test@example.com",
                PasswordHash = HashPassword("securepassword")
            };
            _context.User.Add(user);
            _context.SaveChanges();

            Assert.AreEqual(1, _context.User.Count());
        }

        [TestMethod]
        public void GetUser_ShouldReturnCorrectUser()
        {
            var user = new User
            {
                Name = "Test User",
                Email = "test@example.com",
                PasswordHash = HashPassword("securepassword")
            };
            _context.User.Add(user);
            _context.SaveChanges();

            var fetchedUser = _context.User.FirstOrDefault(u => u.Email == "test@example.com");
            Assert.IsNotNull(fetchedUser);
            Assert.AreEqual("Test User", fetchedUser.Name);
            Assert.AreEqual(user.PasswordHash, fetchedUser.PasswordHash);
        }
    }
}

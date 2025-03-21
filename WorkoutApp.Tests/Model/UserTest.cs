using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Tests.Model
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

        [TestMethod]
        public void UpdateUser_ShouldModifyUserDetails()
        {
            var user = new User
            {
                Name = "Test User",
                Email = "test@example.com",
                PasswordHash = HashPassword("securepassword")
            };
            _context.User.Add(user);
            _context.SaveChanges();

            user.Name = "Updated User";
            user.Email = "updated@example.com";
            _context.User.Update(user);
            _context.SaveChanges();

            var updatedUser = _context.User.FirstOrDefault(u => u.Email == "updated@example.com");
            Assert.IsNotNull(updatedUser);
            Assert.AreEqual("Updated User", updatedUser.Name);
        }

        [TestMethod]
        public void DeleteUser_ShouldDecreaseCount()
        {
            var user = new User
            {
                Name = "Test User",
                Email = "test@example.com",
                PasswordHash = HashPassword("securepassword")
            };
            _context.User.Add(user);
            _context.SaveChanges();

            _context.User.Remove(user);
            _context.SaveChanges();

            Assert.AreEqual(0, _context.User.Count());
        }

        //[TestMethod]
        //public void AddUser_WithDuplicateEmail_ShouldThrowException()
        //{
        //    var user1 = new User
        //    {
        //        Name = "Test User 1",
        //        Email = "duplicate@example.com",
        //        PasswordHash = HashPassword("securepassword")
        //    };
        //    _context.User.Add(user1);
        //    _context.SaveChanges();

        //    var user2 = new User
        //    {
        //        Name = "Test User 2",
        //        Email = "duplicate@example.com",
        //        PasswordHash = HashPassword("securepassword")
        //    };
        //    _context.User.Add(user2);
        //    Assert.ThrowsException<Exception>(() => _context.SaveChanges());
        //}

        [TestMethod]
        public void GetNonExistentUser_ShouldReturnNull()
        {
            var fetchedUser = _context.User.FirstOrDefault(u => u.Email == "nonexistent@example.com");
            Assert.IsNull(fetchedUser);
        }

        //[TestMethod]
        //public void AddUser_WithEmptyName_ShouldThrowException()
        //{
        //    var user = new User
        //    {
        //        Name = "",
        //        Email = "test@example.com",
        //        PasswordHash = HashPassword("securepassword")
        //    };
        //    _context.User.Add(user);
        //    Assert.ThrowsException<Exception>(() => _context.SaveChanges());
        //}

        //[TestMethod]
        //public void AddUser_WithInvalidEmail_ShouldThrowException()
        //{
        //    var user = new User
        //    {
        //        Name = "Test User",
        //        Email = "invalid-email",
        //        PasswordHash = HashPassword("securepassword")
        //    };
        //    _context.User.Add(user);
        //    Assert.ThrowsException<Exception>(() => _context.SaveChanges());
        //}
    }
}

using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using WorkoutApp.Server.Controllers;
using WorkoutApp.Server.DTO.User;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> AuthenticateUser(UserLoginRequestModel model)
        {
            var user = await _context.User.FirstOrDefaultAsync(
                u => u.Name == model.NameOrEmail || u.Email == model.NameOrEmail
            );

            if (user == null || !VerifyPassword(model.Password, user.PasswordHash))
            {
                return null;
            }

            return user;
        }

        public async Task<User?> RegisterUser(UserRegisterRequestModel model)
        {
            if (await _context.User.AnyAsync(u => u.Email == model.Email))
            {
                throw new Exception("Email is already registered.");
            }

            var user = new User
            {
                Name = model.Username,
                Email = model.Email,
                PasswordHash = HashPassword(model.Password)
            };

            _context.User.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return HashPassword(password) == storedHash;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.User.ToListAsync() ?? new List<User>();
        }
    }
}

using Microsoft.EntityFrameworkCore;
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

        public async Task<User?> AuthenticateUser(string nameOrEmail)
        {
            return await _context.Users.FirstOrDefaultAsync(
                u => u.Name == nameOrEmail || u.Email == nameOrEmail
            );
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.ToListAsync() ?? new List<User>();
        }
    }
}

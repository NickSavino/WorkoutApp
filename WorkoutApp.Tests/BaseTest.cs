using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WorkoutApp.Server;
using WorkoutApp.Server.Model;
using System;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using System.Net;

namespace WorkoutApp.Tests
{
    public abstract class BaseTest
    {
        protected TestAppDbContext _context;
        private IConfiguration _configuration;

        public BaseTest()
        {
            var machineName = Dns.GetHostName();
            // Initialize configuration to read appsettings.json
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.test.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{machineName}.json", optional: true, reloadOnChange: true);

            _configuration = builder.Build();
        }

        [TestInitialize]
        public void Setup()
        {
            // Get the connection string from the configuration
            var connectionString = _configuration.GetConnectionString("WorkoutApp_Test");

            // Configure DbContext to use SQL Server
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(connectionString)
                .Options;

            _context = new TestAppDbContext(options, _configuration);
            _context.Database.EnsureDeleted(); // Reset DB before each test
            _context.Database.EnsureCreated();
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        protected static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}

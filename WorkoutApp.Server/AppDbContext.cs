using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using WorkoutApp.Server.Enums;
using WorkoutApp.Server.Model;

namespace WorkoutApp.Server
{
    // This class defines the database and its relations based on our defined models
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        // Define Database Tables Here
        public DbSet<User> User { get; set; }

        public DbSet<Workout> Workout { get; set; }

        public DbSet<Exercise> Exercise { get; set; }

        public DbSet<WorkoutExercise> WorkoutExercise { get; set; }

        // Data seeding and Defining relationships

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSeeding((context, _) =>
            {
                SeedData(context);
            });
        }

        private void SeedData(DbContext context)
        {
            // Seed Users
            var dbUsers = context.Set<User>();

            if (!dbUsers.Any())
            {
                var usersToAdd = new List<User>
                {
                    new() { Name = "Admin", Email = "admin@jym.com", PasswordHash = HashPassword("Admin") },
                    new() { Name = "Guest", Email = "guest@jym.com", PasswordHash = HashPassword("Guest") },
                    new() { Name = "Sample User", Email = "user@jym.com", PasswordHash = HashPassword("123") }
                };
                dbUsers.AddRange(usersToAdd);
                context.SaveChanges();

            }

            // Seed Exercises

            var dbExercises = context.Set<Exercise>();

            if (!dbExercises.Any())
            {
                var exercises = new List<Exercise>
                {
                    new() { Name = "Bench Press", Type = ExerciseType.Chest },
                    new() { Name = "Squat", Type = ExerciseType.Legs},
                    new() { Name = "Deadlift", Type = ExerciseType.Legs },
                    new() { Name = "Running", Type = ExerciseType.Cardio }
                };  
                dbExercises.AddRange(exercises);
                context.SaveChanges();

            }

            // Seed Workouts
            var dbWorkouts = context.Set<Workout>();

            if (!dbWorkouts.Any())
            {
                var workouts = new List<Workout>
                {
                    new() { Name = "Full Body Workout", User = dbUsers.FirstOrDefault(u => u.Email == "admin@jym.com") },
                    new() { Name = "Leg Day", User = dbUsers.FirstOrDefault(u => u.Email == "user@jym.com") }
                };
                dbWorkouts.AddRange(workouts);
                context.SaveChanges();

            }

            // Seed Workout-Exercise Relationships
            var dbWorkoutExercises = context.Set<WorkoutExercise>();

            if (!dbWorkoutExercises.Any())
            {
                var workouts = dbWorkouts.ToList();
                var exercises = dbExercises.ToList();

                var workoutExercises = new List<WorkoutExercise>
                {
                    new() { Workout = workouts.First(w => w.Name == "Full Body Workout"), Exercise = exercises.First(e => e.Name == "Bench Press") },
                    new() { Workout = workouts.First(w => w.Name == "Full Body Workout"), Exercise = exercises.First(e => e.Name == "Squat") },
                    new() { Workout = workouts.First(w => w.Name == "Leg Day"), Exercise = exercises.First(e => e.Name == "Squat") },
                    new() { Workout = workouts.First(w => w.Name == "Leg Day"), Exercise = exercises.First(e => e.Name == "Deadlift") }
                };
                dbWorkoutExercises.AddRange(workoutExercises);
                context.SaveChanges();

            }

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WorkoutExercise>()
                .HasOne(we => we.Workout)
                .WithMany(w => w.WorkoutExercises)
                .HasForeignKey(we => we.WorkoutId);

            modelBuilder.Entity<WorkoutExercise>()
                .HasOne(we => we.Exercise)
                .WithMany(e => e.WorkoutExercises)
                .HasForeignKey(we => we.ExerciseId);

            modelBuilder.Entity<Workout>()
                .HasOne(w => w.User)
                .WithMany(u => u.Workouts)
                .HasForeignKey(w => w.UserId);
        }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return await base.SaveChangesAsync();
        }

        // Update timestamps when changes are made to object
        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {
                var now = DateTime.UtcNow;

                if (entity.State == EntityState.Added)
                {
                    ((BaseEntity)entity.Entity).CreatedAt = now;
                }
                ((BaseEntity)entity.Entity).UpdatedAt = now;
            }
        }
        private static string HashPassword(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}

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
                    new() { Name = "Running", Type = ExerciseType.Cardio },

                    // Arms
                    new() { Name = "Bicep Curls", Type = ExerciseType.Arms },
                    new() { Name = "Tricep Dips", Type = ExerciseType.Arms },
                    new() { Name = "Hammer Curls", Type = ExerciseType.Arms },
                    new() { Name = "Skull Crushers", Type = ExerciseType.Arms },
                    new() { Name = "Preacher Curls", Type = ExerciseType.Arms },
                    new() { Name = "Concentration Curls", Type = ExerciseType.Arms },
                    new() { Name = "Zottman Curls", Type = ExerciseType.Arms },
                    new() { Name = "Close-Grip Bench Press", Type = ExerciseType.Arms },
                    new() { Name = "Cable Tricep Pushdowns", Type = ExerciseType.Arms },
                    new() { Name = "Reverse Curls", Type = ExerciseType.Arms },
                    new() { Name = "Kickbacks", Type = ExerciseType.Arms },
                    new() { Name = "Overhead Tricep Extensions", Type = ExerciseType.Arms },
                    // Chest
                    new() { Name = "Bench Press", Type = ExerciseType.Chest },
                    new() { Name = "Incline Dumbbell Press", Type = ExerciseType.Chest },
                    new() { Name = "Chest Flys", Type = ExerciseType.Chest },
                    new() { Name = "Cable Crossovers", Type = ExerciseType.Chest },
                    new() { Name = "Push-Ups", Type = ExerciseType.Chest },
                    new() { Name = "Decline Bench Press", Type = ExerciseType.Chest },
                    new() { Name = "Dumbbell Pullover", Type = ExerciseType.Chest },
                    new() { Name = "Pec Deck Machine", Type = ExerciseType.Chest },
                    new() { Name = "Dips", Type = ExerciseType.Chest },
                    new() { Name = "Svend Press", Type = ExerciseType.Chest },
                    new() { Name = "Landmine Press", Type = ExerciseType.Chest },
                    // Back
                    new() { Name = "Deadlifts", Type = ExerciseType.Back },
                    new() { Name = "Pull-Ups", Type = ExerciseType.Back },
                    new() { Name = "Bent-Over Rows", Type = ExerciseType.Back },
                    new() { Name = "Lat Pulldown", Type = ExerciseType.Back },
                    new() { Name = "Face Pulls", Type = ExerciseType.Back },
                    new() { Name = "T-Bar Rows", Type = ExerciseType.Back },
                    new() { Name = "Seal Rows", Type = ExerciseType.Back },
                    new() { Name = "Reverse Flys", Type = ExerciseType.Back },
                    new() { Name = "Single-Arm Dumbbell Row", Type = ExerciseType.Back },
                    new() { Name = "Good Mornings", Type = ExerciseType.Back },
                    new() { Name = "Shrugs", Type = ExerciseType.Back },
                    // Legs
                    new() { Name = "Squats", Type = ExerciseType.Legs },
                    new() { Name = "Leg Press", Type = ExerciseType.Legs },
                    new() { Name = "Lunges", Type = ExerciseType.Legs },
                    new() { Name = "Romanian Deadlifts", Type = ExerciseType.Legs },
                    new() { Name = "Calf Raises", Type = ExerciseType.Legs },
                    new() { Name = "Bulgarian Split Squats", Type = ExerciseType.Legs },
                    new() { Name = "Sissy Squats", Type = ExerciseType.Legs },
                    new() { Name = "Step-Ups", Type = ExerciseType.Legs },
                    new() { Name = "Hack Squat Machine", Type = ExerciseType.Legs },
                    new() { Name = "Hip Thrusts", Type = ExerciseType.Legs },
                    new() { Name = "Nordic Curls", Type = ExerciseType.Legs },
                    // Core
                    new() { Name = "Planks", Type = ExerciseType.Core },
                    new() { Name = "Hanging Leg Raises", Type = ExerciseType.Core },
                    new() { Name = "Russian Twists", Type = ExerciseType.Core },
                    new() { Name = "Bicycle Crunches", Type = ExerciseType.Core },
                    new() { Name = "Ab Rollouts", Type = ExerciseType.Core },
                    new() { Name = "Hanging Knee Raises", Type = ExerciseType.Core },
                    new() { Name = "Dead Bug", Type = ExerciseType.Core },
                    new() { Name = "Side Planks", Type = ExerciseType.Core },
                    new() { Name = "Weighted Sit-Ups", Type = ExerciseType.Core },
                    new() { Name = "Woodchoppers", Type = ExerciseType.Core },
                    new() { Name = "Cable Twists", Type = ExerciseType.Core },
          
                    // Cardio
                    new() { Name = "Treadmill Sprints", Type = ExerciseType.Cardio },
                    new() { Name = "Jump Rope", Type = ExerciseType.Cardio },
                    new() { Name = "Rowing Machine", Type = ExerciseType.Cardio },
                    new() { Name = "Stair Climber", Type = ExerciseType.Cardio },
                    new() { Name = "Cycling", Type = ExerciseType.Cardio },
                    new() { Name = "Battle Ropes", Type = ExerciseType.Cardio },
                    new() { Name = "Rowing Sprints", Type = ExerciseType.Cardio },
                    new() { Name = "Box Jumps", Type = ExerciseType.Cardio },
                    new() { Name = "Hill Sprints", Type = ExerciseType.Cardio },
                    new() { Name = "Burpees", Type = ExerciseType.Cardio },
                    new() { Name = "Shadow Boxing", Type = ExerciseType.Cardio },
          
                    // Shoulders
                    new() { Name = "Overhead Press", Type = ExerciseType.Shoulders },
                    new() { Name = "Lateral Raises", Type = ExerciseType.Shoulders },
                    new() { Name = "Front Raises", Type = ExerciseType.Shoulders },
                    new() { Name = "Arnold Press", Type = ExerciseType.Shoulders },
                    new() { Name = "Face Pulls", Type = ExerciseType.Shoulders },
                    new() { Name = "Upright Rows", Type = ExerciseType.Shoulders },
                    new() { Name = "Cuban Press", Type = ExerciseType.Shoulders },
                    new() { Name = "Reverse Pec Deck", Type = ExerciseType.Shoulders },
                    new() { Name = "Behind-the-Neck Press", Type = ExerciseType.Shoulders },
                    new() { Name = "Snatch-Grip High Pull", Type = ExerciseType.Shoulders },
                    new() { Name = "Dumbbell Y Raises", Type = ExerciseType.Shoulders }
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

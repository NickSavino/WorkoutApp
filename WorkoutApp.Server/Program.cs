using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Net;
using WorkoutApp.Server;
using WorkoutApp.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://jym.azurewebsites.net")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register Services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ExerciseService>();
builder.Services.AddScoped<WorkoutService>();
builder.Services.AddScoped<ProfileService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WorkoutApp API",
        Version = "v1",
        Description = "API documentation for WorkoutApp",
    });
});

// Load Configuration
string machineName = Dns.GetHostName();
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{machineName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Register Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("WorkoutApp_Prod")));

var app = builder.Build();

// Apply CORS Middleware before Routing
app.UseCors("AllowFrontend");

app.UseRouting();
app.UseDefaultFiles();
app.UseStaticFiles();

// Enable Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "WorkoutApp API v1");
    c.RoutePrefix = "swagger";
});

// Database Migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();

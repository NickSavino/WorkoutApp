using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Net;
using WorkoutApp.Server;
using WorkoutApp.Server.Services;

var builder = WebApplication.CreateBuilder(args);

    // Add CORS Policy
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend",
            builder => builder.WithOrigins("https://localhost:61526", "https://webappapi-a9c4fpcqdtbzb5an.westus-01.azurewebsites.net", "https://blue-glacier-08eb66f0f.6.azurestaticapps.net")
                              .AllowAnyMethod()
                              .AllowAnyHeader()
                              .AllowCredentials());
    });


    // Add services to the container.
    builder.Services.AddScoped<UserService>();
    builder.Services.AddScoped<ExerciseService>();
    builder.Services.AddScoped<WorkoutService>();
    builder.Services.AddScoped<ProfileService>();

    builder.Services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

    string machineName = Dns.GetHostName();

    builder.Configuration
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{machineName}.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables();

    // Register DBContext
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("SQLAZURECONNSTR_WorkoutAppDev")));

    var app = builder.Build();

    app.UseCors("AllowFrontend");
    app.UseRouting();

    app.UseDefaultFiles();
    app.UseStaticFiles();



    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "WorkoutApp API v1");
            c.RoutePrefix = "swagger"; // Swagger will be accessible at /swagger
        });
    }

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

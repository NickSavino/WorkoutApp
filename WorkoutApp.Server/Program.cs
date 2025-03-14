using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using WorkoutApp.Server;
using WorkoutApp.Server.Services;

var builder = WebApplication.CreateBuilder(args);

    // Add CORS Policy
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend",
            builder => builder.WithOrigins("https://localhost:61526")
                              .AllowAnyMethod()
                              .AllowAnyHeader()
                              .AllowCredentials());
    });


    // Add services to the container.
    builder.Services.AddScoped<UserService>();

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

    // Register DBContext
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("WorkoutApp_Dev")));

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

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.MapFallbackToFile("/index.html");

    app.Run();

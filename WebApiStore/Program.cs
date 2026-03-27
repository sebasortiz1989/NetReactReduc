using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.Entities;
using WebApiStore.Middleware;
using WebApiStore.RequestHelpers;
using WebApiStore.Services;

var builder = WebApplication.CreateBuilder(args);
var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(defaultConnection);
});
builder.Services.AddCors();
builder.Services.AddAutoMapper(_ => { }, AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddTransient<ExceptionMiddleWare>();
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddScoped<ImageService>();
builder.Services.AddIdentityApiEndpoints<User>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<StoreContext>();

var app = builder.Build();
var startupLogger = app.Logger;

startupLogger.LogInformation("Application starting in {Environment}. DefaultConnection configured: {HasDefaultConnection}", app.Environment.EnvironmentName, !string.IsNullOrWhiteSpace(defaultConnection));

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleWare>();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(
        "https://localhost:3000",
        "http://localhost:3000",
        "https://192.168.0.234:3000",
        "http://192.168.0.234:3000"
    );
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>(); // With this I add endpoints. api/login
app.MapFallbackToController("Index", "Fallback");

try
{
    startupLogger.LogInformation("Starting database initialization");
    await DbInitializer.InitDb(app);
    startupLogger.LogInformation("Database initialization completed successfully");
}
catch (Exception ex)
{
    startupLogger.LogError(ex, "Database initialization failed during startup in {Environment}", app.Environment.EnvironmentName);
    throw;
}

app.Run();
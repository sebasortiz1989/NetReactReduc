using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleWare>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleWare>();
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(
        "https://localhost:3000",
        "http://localhost:3000",
        "https://192.168.0.234:3000",
        "http://192.168.0.234:3000"
    );
});

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
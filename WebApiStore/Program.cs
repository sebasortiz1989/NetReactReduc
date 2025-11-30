using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins(
        "https://localhost:3000", 
        "http://192.168.0.108:3000" 
    );
});

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
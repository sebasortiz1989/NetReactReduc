using System.Reflection;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.Entities;
using WebApiStore.Middleware;
using WebApiStore.RequestHelpers;
using WebApiStore.Services;

var builder = WebApplication.CreateBuilder(args);
var defaultConnection = ResolveConnectionString(builder.Configuration);

// Managed Postgres hosts (Neon, Railway, Heroku, Supabase) publish a
// postgres:// URI rather than an ADO.NET connection string, so accept either.
// The unpooled host is preferred: Neon's pooled endpoint runs PgBouncer in
// transaction mode, which does not support the prepared statements Npgsql uses.
static string? ResolveConnectionString(IConfiguration config)
{
    var configured = config.GetConnectionString("DefaultConnection");
    if (!string.IsNullOrWhiteSpace(configured)) return configured;

    var uri = config["DATABASE_URL_UNPOOLED"]
              ?? config["POSTGRES_URL_NON_POOLING"]
              ?? config["DATABASE_URL"]
              ?? config["POSTGRES_URL"];

    return string.IsNullOrWhiteSpace(uri) ? null : BuildNpgsqlConnectionString(uri);
}

static string BuildNpgsqlConnectionString(string uri)
{
    var parsed = new Uri(uri);
    var credentials = parsed.UserInfo.Split(':', 2);

    var connectionStringBuilder = new Npgsql.NpgsqlConnectionStringBuilder
    {
        Host = parsed.Host,
        Port = parsed.IsDefaultPort ? 5432 : parsed.Port,
        Database = parsed.AbsolutePath.TrimStart('/'),
        Username = Uri.UnescapeDataString(credentials[0]),
        Password = credentials.Length > 1 ? Uri.UnescapeDataString(credentials[1]) : null,
        SslMode = ParseSslMode(parsed.Query),
    };

    return connectionStringBuilder.ConnectionString;
}

// Honour ?sslmode= from the URI; managed hosts require SSL, a local container
// usually has none, and hardcoding either one breaks the other.
static Npgsql.SslMode ParseSslMode(string query)
{
    var value = System.Web.HttpUtility.ParseQueryString(query)["sslmode"];

    return value?.ToLowerInvariant() switch
    {
        "disable" => Npgsql.SslMode.Disable,
        "allow" => Npgsql.SslMode.Allow,
        "prefer" => Npgsql.SslMode.Prefer,
        "verify-ca" => Npgsql.SslMode.VerifyCA,
        "verify-full" => Npgsql.SslMode.VerifyFull,
        _ => Npgsql.SslMode.Require,
    };
}

// Add services to the container.
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseNpgsql(defaultConnection);
});
builder.Services.AddCors();
var mapsterConfig = TypeAdapterConfig.GlobalSettings;
mapsterConfig.Scan(Assembly.GetExecutingAssembly());
mapsterConfig.Compile(); // fail fast on a bad mapping instead of on first request
builder.Services.AddSingleton(mapsterConfig);
builder.Services.AddScoped<IMapper, ServiceMapper>();
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

// Origins come from configuration (Cors:AllowedOrigins) so a machine-specific LAN
// address lives in appsettings.Development.json rather than in committed source.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                     ?? ["https://localhost:3000", "http://localhost:3000"];

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(allowedOrigins);
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
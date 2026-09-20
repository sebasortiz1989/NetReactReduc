# Web API

- Create a project Web API and not use **minimal APIs** and **Use Controllers**

# Migrations

The Entity Framework Core tools help with design-time development tasks. They're primarily used to manage Migrations and to scaffold a DbContext and entity types by reverse engineering the schema of a database.

This package, dotnet-ef is for cross-platform command line tooling that can be used anywhere.

We use dotnet-ef to create and manage migrations.

It can be installed from this site: <br>
https://www.nuget.org/packages/dotnet-ef

And in the terminal we run this command:
```
dotnet tool install --global dotnet-ef --version 10.0.0
```

To create a migration we run this command in the terminal:
```
dotnet ef migrations add InitialCreate -o Data/Migrations
```

This basically createds the Database schema based on the Models we have created automatically.

To apply the migration to the database we run this command in the terminal:
```
dotnet ef database update
```

This will create the database if it does not exist and apply the migration to it.

If you want to delete de database you can run this command in the terminal:

```
dotnet ef database drop
```

# Running locally

Prerequisites: .NET 10 SDK, Node 20+, Docker (OrbStack or Docker Desktop).

**1. Start PostgreSQL** (runs in a container; nothing to install):

```
docker compose up -d
```

The connection string in `WebApiStore/appsettings.Development.json` points at
`localhost:5432` with the password from `docker-compose.yml`. The container keeps
its data in the `pg_data` volume, so the database survives restarts.

**2. Supply your own secrets.** No credentials are committed to this repository.
Stripe and Cloudinary keys are read from .NET user secrets, which live outside the
repo in your user profile:

```
cd WebApiStore
dotnet user-secrets set "StripeSettings:SecretKey"      "sk_test_..."
dotnet user-secrets set "StripeSettings:PublishableKey" "pk_test_..."
dotnet user-secrets set "StripeSettings:WhSecret"       "whsec_..."
dotnet user-secrets set "CloudinarySettings:CloudName"  "your-cloud-name"
dotnet user-secrets set "CloudinarySettings:ApiKey"     "your-api-key"
dotnet user-secrets set "CloudinarySettings:ApiSecret"  "your-api-secret"
```

Get Stripe test keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys)
and Cloudinary keys from your [Cloudinary console](https://console.cloudinary.com/).
Both offer free accounts. Stripe is only needed for checkout, Cloudinary only for
uploading product images from the admin Inventory page.

`WebApiStore/appsettings.Development.json.example` shows the non-secret settings,
including `Cors:AllowedOrigins` — add your LAN address there if you run the client
on another device.

**3. Start the API** (applies EF migrations and seeds on startup):

```
cd WebApiStore && dotnet run --launch-profile https
```

- API: https://localhost:5005 (also http://0.0.0.0:5010 for LAN)
- Seeded accounts: `admin@test.com` / `seba@test.com`, password `Pa$$w0rd`

**4. Start the React client:**

```
cd websitestorereact
cp .env.example .env     # then paste your Stripe publishable key
npm install && npm run dev
```

- Client: https://localhost:3000 (`npm run lan` for plain HTTP on the network)

To reset the database completely: `docker compose down -v`, then start again.

Test checkout uses Stripe's test card `4242 4242 4242 4242`, any future expiry
and any CVC. No real money moves.

# Hot reload

if you use `dotnet watch` to run the project, you can take advantage of hot reload.

1. You run dotnet watch.
2. The app starts up.
3. You edit a line of code and press Save.
4. dotnet watch detects the file change.
5. It applies the change immediately (or restarts if necessary).
6. You see the result instantly in the browser.

if you user `dotnet run` to run the project, you will need to stop and restart the application to see any changes you make to the code.
# Deploying to Vercel

The app deploys as a **single container**: `Dockerfile.vercel` builds the React
client into `WebApiStore/wwwroot`, and ASP.NET Core serves both the SPA and the
API from one origin. That keeps the auth and basket cookies first-party.

Build and run it locally exactly as Vercel does:

```
docker build -f Dockerfile.vercel -t restore .
docker run -p 8080:80 \
  -e "ConnectionStrings__DefaultConnection=Host=...;Database=...;Username=...;Password=..." \
  restore
```

**No secrets are baked into the image** - `.dockerignore` keeps
`appsettings.Development.json`, `.env` and local databases out of the build
context. Supply these as Vercel environment variables instead:

| Variable | Notes |
|---|---|
| `ConnectionStrings__DefaultConnection` | Postgres connection string (e.g. Neon) |
| `StripeSettings__SecretKey` | Checkout only |
| `StripeSettings__WhSecret` | Webhook signature verification |
| `CloudinarySettings__CloudName` / `__ApiKey` / `__ApiSecret` | Admin image upload only |

Double underscores map to nested configuration keys. Cloudinary is optional: when
it is not configured the catalogue still works and only image uploads are refused.

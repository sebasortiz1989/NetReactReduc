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

**1. Start SQL Server** (the app has no local SQL Server; it runs in a container):

```
docker compose up -d
```

The connection string in `WebApiStore/appsettings.Development.json` points at
`localhost,1433` with the `sa` password from `docker-compose.yml`. The container
keeps its data in the `sql_data` volume, so the database survives restarts.

**2. Start the API** (applies EF migrations and seeds on startup):

```
cd WebApiStore && dotnet run --launch-profile https
```

- API: https://localhost:5005 (also http://0.0.0.0:5010 for LAN)
- Seeded accounts: `admin@test.com` / `seba@test.com`, password `Pa$$w0rd`

**3. Start the React client:**

```
cd websitestorereact && npm install && npm run dev
```

- Client: https://localhost:3000 (`npm run lan` for plain HTTP on the network)

To reset the database completely: `docker compose down -v`, then start again.

# Hot reload

if you use `dotnet watch` to run the project, you can take advantage of hot reload.

1. You run dotnet watch.
2. The app starts up.
3. You edit a line of code and press Save.
4. dotnet watch detects the file change.
5. It applies the change immediately (or restarts if necessary).
6. You see the result instantly in the browser.

if you user `dotnet run` to run the project, you will need to stop and restart the application to see any changes you make to the code.
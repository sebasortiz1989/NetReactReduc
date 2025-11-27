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

# Running the project

if you use `dotnet watch` to run the project, you can take advantage of hot reload.

1. You run dotnet watch.
2. The app starts up.
3. You edit a line of code and press Save.
4. dotnet watch detects the file change.
5. It applies the change immediately (or restarts if necessary).
6. You see the result instantly in the browser.

if you user `dotnet run` to run the project, you will need to stop and restart the application to see any changes you make to the code.
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Entities;

namespace WebApiStore.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<IdentityRole>().HasData(
            new IdentityRole { Name = "Member", NormalizedName = "MEMBER", Id = "d1f2e8c4-5b6a-4c3a-9f1e-1a2b3c4d5e6f", ConcurrencyStamp = "d1f2e8c4-5b6a-4c3a-9f1e-1a2b3c4d5e6f" },
            new IdentityRole { Name = "Admin", NormalizedName = "ADMIN", Id = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", ConcurrencyStamp = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" }
            );
    }
}
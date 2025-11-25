using Microsoft.EntityFrameworkCore;
using WebApiStore.Entities;

namespace WebApiStore.Data;

public class StoreContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Products> Products => Set<Products>();
}
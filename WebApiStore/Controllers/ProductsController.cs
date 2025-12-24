using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.Entities;
using WebApiStore.Extensions;

namespace WebApiStore.Controllers;

// https://localhost:5000/api/products
public class ProductsController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts(string orderBy)
    {
        var query = context.Products.Sort(orderBy).AsQueryable();
        return await query.ToListAsync();
    }

    [HttpGet("{id}")] // https://localhost:5000/api/products/3
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await context.Products.FindAsync(id);
        return product != null ? product : NotFound();
    }
}
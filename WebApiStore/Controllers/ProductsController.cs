using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.Entities;

namespace WebApiStore.Controllers;

[Route("api/[controller]")] // https://localhost:5002/api/products
[ApiController]
public class ProductsController(StoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
        return await context.Products.ToListAsync();
    }

    [HttpGet("{id}")] // https://localhost:5002/api/products/3
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await context.Products.FindAsync(id);
        return product != null ? product : NotFound();
    }
}
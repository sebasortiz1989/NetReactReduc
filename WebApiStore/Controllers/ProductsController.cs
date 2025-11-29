using Microsoft.AspNetCore.Mvc;
using WebApiStore.Data;
using WebApiStore.Entities;

namespace WebApiStore.Controllers;

[Route("api/[controller]")] // http://localhost:5002/api/products
[ApiController]
public class ProductsController(StoreContext context) : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Product>> GetProducts()
    {
        return context.Products.ToList();
    }

    [HttpGet("{id}")] // http://localhost:5002/api/products/3
    public ActionResult<Product> GetProduct(int id)
    {
        var product = context.Products.Find(id);
        return product != null ? product : NotFound();
    }
}
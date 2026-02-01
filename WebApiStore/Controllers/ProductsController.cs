using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.DTOs;
using WebApiStore.Entities;
using WebApiStore.Extensions;
using WebApiStore.RequestHelpers;

namespace WebApiStore.Controllers;

// https://localhost:5000/api/products
public class ProductsController(StoreContext context, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts([FromQuery]ProductParams productParams)
    {
        var query = context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();
        
        var products = await PagedList<Product>.ToPagedListAsync(query, productParams.PageNumber, productParams.PageSize);
        
        Response.AddPaginationHeader(products.Metadata);
        return products;
    }

    [HttpGet("{id}")] // https://localhost:5000/api/products/3
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await context.Products.FindAsync(id);
        return product != null ? product : NotFound();
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var brands = await context.Products.Select(p => p.Brand).Distinct().ToListAsync();
        var types = await context.Products.Select(p => p.Type).Distinct().ToListAsync();
        return Ok(new { brands, types });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
    {
        var product = mapper.Map<Product>(productDto);
        
        context.Products.Add(product);
        var result = await context.SaveChangesAsync() > 0;

        if (result)
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);

        return BadRequest("Problem creating new product");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
    {
        var product = await context.Products.FindAsync(updateProductDto.Id);
        if (product == null) return NotFound();

        mapper.Map(updateProductDto, product);

        var result = await context.SaveChangesAsync() > 0;
        if (result) return NoContent();

        return BadRequest("Problem updating product");
    }
    
}
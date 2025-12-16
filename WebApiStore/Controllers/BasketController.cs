using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.DTOs;
using WebApiStore.Entities;

namespace WebApiStore.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basketId = Request.Cookies["basketId"];
        if (string.IsNullOrEmpty(basketId))
        {
            return BadRequest("BasketId is required.");
        }

        var basket = await RetrieveBasket(basketId);
        
        if (basket == null)
        {
            return NoContent();
        }

        return Ok(new BasketDto
        {
            Id = basket.BasketId,
            Items = basket.Items.Select(item => new BasketItemDto
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                Quantity = item.Quantity,
                PictureUrl = item.Product.PictureUrl,
                Brand = item.Product.Brand,
                Type = item.Product.Type
            }).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
    {
        if (quantity <= 0)
        {
            return BadRequest("Quantity must be greater than zero.");
        }

        var basketId = Request.Cookies["basketId"];

        Basket basket;
        if (basketId == null)
        {
            basket = CreateBasket();
        }
        else
        {
            basket = await RetrieveBasket(basketId) ?? CreateBasket();
        }

        var product = await context.Products.FindAsync(productId);
        if (product == null)
            return BadRequest("Product not found.");

        var item = basket.Items.FirstOrDefault(x => x.ProductId == product.Id);
        if (item == null)
        {
            basket.Items.Add(new BasketItem
            {
                Product = product,
                ProductId = product.Id,
                Quantity = quantity
            });
        }
        else
        {
            item.Quantity += quantity;
        }

        var result = await context.SaveChangesAsync();
        return result > 0 ? CreatedAtAction(nameof(GetBasket), new BasketDto
        {
            Id = basket.BasketId,
            Items = basket.Items.Select(i => new BasketItemDto
            {
                ProductId = i.ProductId,
                Name = i.Product.Name,
                Price = i.Product.Price,
                Quantity = i.Quantity,
                PictureUrl = i.Product.PictureUrl,
                Brand = i.Product.Brand,
                Type = i.Product.Type
            }).ToList()
        }) : BadRequest("Problem saving item to basket.");
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
    {
        if (quantity <= 0)
        {
            return BadRequest("Quantity must be greater than zero.");
        }

        var basketId = Request.Cookies["basketId"];
        if (string.IsNullOrEmpty(basketId))
        {
            return BadRequest("BasketId is required.");
        }

        var basket = await RetrieveBasket(basketId);
        
        if (basket == null)
        {
            return NoContent();
        }

        // Remove item from basket or just reduce quantity
        var item = basket.Items.FirstOrDefault(x => x.ProductId == productId);
        if (item == null)
        {
            return NotFound();
        }

        if (item.Quantity <= quantity)
        {
            basket.Items.Remove(item);
        }
        else
        {
            item.Quantity -= quantity;
        }

        await context.SaveChangesAsync();
        return Ok();
    }

    private async Task<Basket?> RetrieveBasket(string basketId)
    {
        return await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BasketId == basketId);
    }

    private Basket CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30),
        };

        Response.Cookies.Append("basketId", basketId, cookieOptions);
        var basket = new Basket
        {
            BasketId = basketId
        };

        context.Baskets.Add(basket);
        return basket;
    }
}
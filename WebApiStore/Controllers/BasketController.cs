using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.DTOs;
using WebApiStore.Entities;
using WebApiStore.Extensions;

namespace WebApiStore.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basketId = Request.Cookies["basketId"];
        if (string.IsNullOrEmpty(basketId))
        {
            return NoContent();
        }

        var basket = await context.Baskets.GetBasketWithItems(basketId);
        
        if (basket == null)
        {
            return NoContent();
        }

        return Ok(basket.ToDto());
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
            basket = await context.Baskets.GetBasketWithItems(basketId) ?? CreateBasket();
        }

        var product = await context.Products.FindAsync(productId);
        if (product == null)
            return BadRequest("Product not found.");

        basket.AddItem(product, quantity);
        var result = await context.SaveChangesAsync();
        return result > 0 ?
            CreatedAtAction(nameof(GetBasket), basket.ToDto()) :
            BadRequest("Problem saving item to basket.");
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

        var basket = await context.Baskets.GetBasketWithItems(basketId);
        
        if (basket == null)
        {
            return NoContent();
        }

        basket.RemoveItem(productId, quantity);
        var result = await context.SaveChangesAsync();
        return result > 0 ?
            Ok() :
            BadRequest("Problem removing item from basket.");
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
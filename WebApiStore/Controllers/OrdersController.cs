using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.DTOs;
using WebApiStore.Entities;
using WebApiStore.Entities.OrderAggregate;
using WebApiStore.Extensions;

namespace WebApiStore.Controllers;

[Authorize]
public class OrdersController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var orders = await context.Orders
            .ProjectToOrderDto()
            .Where(y => y.BuyerEmail == User.GetUserName())
            .ToListAsync();

        return orders;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
    {
        var order = await context.Orders
            .ProjectToOrderDto()
            .Where(x => x.BuyerEmail == User.GetUserName() && x.Id == id)
            .FirstOrDefaultAsync();

        if (order == null) return NotFound();

        return order;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto orderDto)
    {
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);
        if (basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            return BadRequest(new ProblemDetails { Title = "Basket is empty" });
        }

        var items = CreateOrderItems(basket.Items);
        if (items == null)
        {
            return BadRequest("Some products are out of stock");
        }
        
        var subtotal = items.Sum(item => item.Price * item.Quantity);
        var deliveryFee = CalculateDeliveryFee(subtotal);
        var order = new Order
        {
            BuyerEmail = User.GetUserName(),
            OrderItems = items,
            ShippingAddress = orderDto.ShippingAddress,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,
            PaymentSummary = orderDto.PaymentSummary,
            PaymentIntentId = basket.PaymentIntentId,
        };

        context.Orders.Add(order);
        context.Baskets.Remove(basket);
        Response.Cookies.Delete("basketId");
        var result = await context.SaveChangesAsync() > 0;
        if (!result)
        {
            return BadRequest("Problem creating order");
        }

        return CreatedAtAction(nameof(GetOrderDetails), new { id = order.Id }, order.ToDto());
    }

    private long CalculateDeliveryFee(long subtotal)
    {
        var deliveryFee = subtotal > 100 * 100 ? 0 : 500;
        return deliveryFee;
    }

    private List<OrderItem>? CreateOrderItems(List<BasketItem> basketItems)
    {
        var orderItems = new List<OrderItem>();
        foreach (var item in basketItems)
        {
            if (item.Product.QuantityInStock < item.Quantity)
                return null;
            
            var orderItem = new OrderItem
            {
                ItemOrdered = new ProductItemOrdered
                {
                    ProductId = item.Product.Id,
                    Name = item.Product.Name,
                    PictureUrl = item.Product.PictureUrl,
                },
                Price = item.Product.Price,
                Quantity = item.Quantity,
            };

            orderItems.Add(orderItem);
            item.Product.QuantityInStock -= item.Quantity;
        }

        return orderItems;
    }
}
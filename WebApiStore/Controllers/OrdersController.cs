using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.Data;
using WebApiStore.Entities.OrderAggregate;
using WebApiStore.Extensions;

namespace WebApiStore.Controllers;

[Authorize]
public class OrdersController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Order>>> GetOrders()
    {
        var orders = await context.Orders
            .Include(x => x.OrderItems)
            .Where(y => y.BuyerEmail == User.GetUserName())
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrderDetails(int id)
    {
        var order = await context.Orders
            .Where(x => x.BuyerEmail == User.GetUserName() && x.Id == id)
            .FirstOrDefaultAsync();

        if (order == null) return NotFound();

        return Ok(order);
    }
}
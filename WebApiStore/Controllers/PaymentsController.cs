using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using WebApiStore.Data;
using WebApiStore.DTOs;
using WebApiStore.Entities.OrderAggregate;
using WebApiStore.Extensions;
using WebApiStore.Services;

namespace WebApiStore.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext context, IConfiguration config, ILogger<PaymentsController> logger) : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        var basketId = Request.Cookies["basketId"];
        if (string.IsNullOrEmpty(basketId))
        {
            return BadRequest("No basketId cookie found");
        }

        var basket = await context.Baskets.GetBasketWithItems(basketId);
        if (basket == null)
        {
            return BadRequest("Problem with the basket");
        }
       
        var intent =  await paymentsService.CreateOrUpdatePaymentIntent(basket);
        if (intent == null)
        {
            return BadRequest("Problem with the payment intent");
        }

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        if (context.ChangeTracker.HasChanges())
        {
            var result = await context.SaveChangesAsync() > 0;
            if (!result)
            {
                return BadRequest("Problem updating basket with intent");
            }
        }

        return basket.ToDto();
    }
    
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = ConstructStripeEvent(json);
            if (stripeEvent.Data.Object is not PaymentIntent intent)
                return BadRequest("Invalid event data");
            
            if (intent.Status == "succeeded")
            {
                await HandlePaymentIntentSucceeded(intent);
            }
            else if (intent.Status == "payment_failed")
            {
                await HandlePaymentIntentFailed(intent);
            }

            return Ok();
        }
        catch (StripeException e)
        {
            logger.LogError(e, "Stripe Webhook failed");
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Unexpected error has occurred");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error");
        }
    }

    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstAsync(y => y.PaymentIntentId == intent.Id)
            .ConfigureAwait(false) ?? throw new Exception("Order not found");

        foreach (var orderOrderItem in order.OrderItems)
        {
            var productItem = await context.Products.FindAsync(orderOrderItem.ItemOrdered.ProductId)
                .ConfigureAwait(false) ?? throw new Exception("Problem updating order stock");

            productItem.QuantityInStock += orderOrderItem.Quantity;
        }

        order.Status = OrderStatus.PaymentFailed;
        await context.SaveChangesAsync().ConfigureAwait(false);
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await context.Orders
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
            .ConfigureAwait(false) ?? throw new Exception("Order not found");

        order.Status = order.GetTotal() != intent.Amount ? OrderStatus.PaymentMismatch : OrderStatus.PaymentReceived;
        var basket = await context.Baskets.FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id);
        if (basket != null)
        {
            context.Baskets.Remove(basket);
        }

        await context.SaveChangesAsync().ConfigureAwait(false);
    }

    private Event ConstructStripeEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], config["StripeSettings:WhSecret"]);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to construct stripe event");
            throw new StripeException("Invalid Signature");
        }
    }
}
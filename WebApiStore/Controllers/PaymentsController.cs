using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApiStore.Data;
using WebApiStore.DTOs;
using WebApiStore.Extensions;
using WebApiStore.Services;

namespace WebApiStore.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext context) : BaseApiController
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
}
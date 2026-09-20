using Stripe;
using WebApiStore.Entities;

namespace WebApiStore.Services;

public class PaymentsService(IConfiguration config)
{
    public async Task<PaymentIntent?> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        var service = new PaymentIntentService();
        var subTotal = basket.Items.Sum(item => item.Product.Price * item.Quantity);
        var deliveryFee = subTotal > 10000 ? 0 : 500; // matches OrdersController.CalculateDeliveryFee

        PaymentIntent intent;
        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subTotal + deliveryFee,
                Currency = "usd", // must match currencyFormat() on the client (lib/util.ts)
                PaymentMethodTypes = ["card"],
            };

            intent = await service.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subTotal + deliveryFee,
            };

            intent = await service.UpdateAsync(basket.PaymentIntentId, options);
        }

        return intent;
    }
}
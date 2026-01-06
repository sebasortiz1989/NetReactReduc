using Stripe;
using WebApiStore.Entities;

namespace WebApiStore.Services;

public class PaymentsService(IConfiguration config)
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        var service = new PaymentIntentService();
        var intent = new PaymentIntent();
        var subTotal = basket.Items.Sum(item => item.Product.Price * item.Quantity);
        var deliveryFee = subTotal >= 10000 ? 0 : 500;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subTotal + deliveryFee,
                Currency = "brl",
                PaymentMethodTypes = ["card", "pix"],
            };

            intent = await service.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subTotal + deliveryFee,
            };

            await service.UpdateAsync(basket.PaymentIntentId, options);
        }

        return intent;
    }
}
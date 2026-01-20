using Microsoft.EntityFrameworkCore;

namespace WebApiStore.Entities.OrderAggregate;

[Owned]
public class PaymentSummary
{
    public int Last4Digits { get; set; }
    public required string CardBrand { get; set; }
    public int ExpiryMonth { get; set; }
    public int ExpiryYear { get; set; }
}
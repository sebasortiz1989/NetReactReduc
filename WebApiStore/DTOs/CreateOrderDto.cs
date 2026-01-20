using WebApiStore.Entities.OrderAggregate;

namespace WebApiStore.DTOs;

public class CreateOrderDto
{
    public required ShippingAddress ShippingAddress { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
}
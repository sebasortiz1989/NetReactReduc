namespace WebApiStore.Entities.OrderAggregate;

public class OrderItem
{
    public int Id { get; set; }
    public required ProductItemOrdered ItemOrdered { get; set; }
    public long price { get; set; }
    public int quantity { get; set; }
}
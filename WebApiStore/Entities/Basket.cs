namespace WebApiStore.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; } = string.Empty;
    public List<BasketItem> Items { get; set; } = [];

    public string? ClientSecret { get; set; }

    public string? PaymentIntentId { get; set; }

    public void AddItem(Product product, int quantity)
    {
        ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0 )
            throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be greater than zero");

        var existingItem = Items.FirstOrDefault(i => i.ProductId == product.Id);
        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            Items.Add(new BasketItem
            {
                Product = product,
                ProductId = product.Id,
                Quantity = quantity
            });
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0 )
            throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be greater than zero");

        var existingItem = Items.FirstOrDefault(i => i.ProductId == productId);
        if (existingItem == null)
            return;

        existingItem.Quantity -= quantity;
        if (existingItem.Quantity <= 0)
        {
            Items.Remove(existingItem);
        }
    }
}
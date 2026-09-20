namespace WebApiStore.DTOs;

public class BasketDto
{
    public string Id { get; set; } = string.Empty;

    public List<BasketItemDto> Items { get; set; } = [];

    public string? ClientSecret { get; set; }

    public string? PaymentIntentId { get; set; }
}
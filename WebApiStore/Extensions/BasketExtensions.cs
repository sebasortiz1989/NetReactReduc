using WebApiStore.DTOs;
using WebApiStore.Entities;

namespace WebApiStore.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            Id = basket.BasketId,
            Items = basket.Items.Select(item => new BasketItemDto
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                PictureUrl = item.Product.PictureUrl,
                Brand = item.Product.Brand,
                Type = item.Product.Type,
                Quantity = item.Quantity
            }).ToList()
        };
    }
}
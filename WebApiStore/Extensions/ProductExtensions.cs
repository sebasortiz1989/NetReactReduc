using WebApiStore.Entities;

namespace WebApiStore.Extensions;

public static class ProductExtensions
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        if (string.IsNullOrEmpty(orderBy)) return query.OrderBy(p => p.Name);

        return orderBy.ToLower() switch
        {
            "price" => query.OrderBy(p => p.Price),
            "pricedesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)
        };
    }
}
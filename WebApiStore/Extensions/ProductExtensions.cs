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

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        if (string.IsNullOrEmpty(searchTerm))
            return query;

        var lowerCaseTerm = searchTerm.Trim().ToLower();
        return query.Where(p => p.Name.ToLower().Contains(lowerCaseTerm));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? types)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();
        if (!string.IsNullOrEmpty(brands))
            brandList.AddRange(brands.ToLower().Split(',').ToList());

        if (!string.IsNullOrEmpty(types))
            typeList.AddRange(types.ToLower().Split(',').ToList());

        if (brandList.Count > 0)
            query = query.Where(p => brandList.Contains(p.Brand.ToLower()));

        if (typeList.Count > 0)
            query = query.Where(p => typeList.Contains(p.Type.ToLower()));

        return query;
    }
}
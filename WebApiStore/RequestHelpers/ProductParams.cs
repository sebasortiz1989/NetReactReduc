namespace WebApiStore.RequestHelpers;

public class ProductParams
{
    private const int MaxPageSize = 50;
    private int _pageSize = 8;
    public string? Brands { get; set; }
    public string? Types { get; set; }
    public string? OrderBy { get; set; }
    public string? SearchTerm { get; set; }
    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}
using System.Security.Claims;

namespace WebApiStore.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserName(this ClaimsPrincipal user) => user.Identity?.Name ?? throw new UnauthorizedAccessException();
}
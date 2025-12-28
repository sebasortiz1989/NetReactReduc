using Microsoft.AspNetCore.Identity;

namespace WebApiStore.Entities;

public class User : IdentityUser
{
    public int? AddressId { get; set; }
    public Address? Address { get; set; }
}
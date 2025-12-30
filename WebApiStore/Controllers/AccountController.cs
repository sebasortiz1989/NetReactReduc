using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiStore.DTOs;
using WebApiStore.Entities;

namespace WebApiStore.Controllers;

public class AccountController(SignInManager<User> signInManager) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        var user = new User { UserName = registerDto.Email, Email = registerDto.Email };
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        await signInManager.UserManager.AddToRoleAsync(user, "Member");
        return Ok();
    }

    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false)
        {
            return NoContent();
        }

        var user = await signInManager.UserManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var roles = await signInManager.UserManager.GetRolesAsync(user);
        return Ok(new
        {
            user.Email,
            user.UserName,
            Roles = roles
        });
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult> CreateOrUpdateAddress(Address address)
    {
        var user = await signInManager.UserManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        user.Address = address;
        var result = await signInManager.UserManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest("Problem updating the user address");
        }

        return Ok(address);
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult> GetUserAddress()
    {
        var address = await signInManager.UserManager.Users
            .Where(u => User.Identity != null && u.UserName == User.Identity.Name)
            .Select(u => u.Address)
            .FirstOrDefaultAsync();

        if (address == null)
        {
            return NoContent();
        }

        return Ok(address);
    }
}
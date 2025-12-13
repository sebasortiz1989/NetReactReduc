using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace WebApiStore.Middleware;

public class ExceptionMiddleWare(IHostEnvironment env, ILogger<ExceptionMiddleWare> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            await HandleException(context, e);
        }
    }

    private async Task HandleException(HttpContext context, Exception exception)
    {
        logger.LogError(exception, exception.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        var response = new ProblemDetails
        {
            Status = context.Response.StatusCode,
            Detail = env.IsDevelopment() ? exception.StackTrace : null,
            Title = "An error occurred while processing your request.",
        };

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);
    }
}
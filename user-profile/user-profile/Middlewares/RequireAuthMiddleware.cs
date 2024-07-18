using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class RequireAuthMiddleware
{
    private readonly RequestDelegate _next;

    public RequireAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Method == HttpMethods.Get)
        {
            // Allow GET requests to pass through
            await _next(context);
            return;
        }

        if (!context.Request.Cookies.ContainsKey("SessionCookie"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        var token = context.Request.Cookies["SessionCookie"];
        if (token == null || !ValidateToken(token))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Invalid session");
            return;
        }

        await _next(context);
    }

    private bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Environment.GetEnvironmentVariable("JWT_KEY");

        if (string.IsNullOrEmpty(key))
        {
            throw new Exception("JWT key is not found.");
        }

        var keyBytes = Encoding.ASCII.GetBytes(key);

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                ValidateIssuer = false,
                ValidateAudience = false,
                // Set clockskew to zero so tokens expire exactly at token expiration time
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch
        {
            return false;
        }
    }
}


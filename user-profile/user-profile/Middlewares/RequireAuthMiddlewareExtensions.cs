namespace user_profile.Middlewares
{
    public static class RequireAuthMiddlewareExtensions
    {
        public static IApplicationBuilder UseRequireAuthMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequireAuthMiddleware>();
        }
    }
}

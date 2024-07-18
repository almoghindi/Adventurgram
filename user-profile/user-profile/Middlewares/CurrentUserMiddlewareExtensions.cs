namespace user_profile.Middlewares
{
    public static class CurrentUserMiddlewareExtensions
    {
        public static IApplicationBuilder UseCurrentUserMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CurrentUserMiddleware>();
        }
    }
}

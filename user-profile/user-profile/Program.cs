using Microsoft.EntityFrameworkCore;
using user_profile;
using user_profile.DAL.Data;
using user_profile.DAL.Repositories;
using user_profile.Services;

class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

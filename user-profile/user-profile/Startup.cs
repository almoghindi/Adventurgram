
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.OpenApi.Models;
using user_profile.DAL.Data;
using user_profile.DAL.Repositories;
using user_profile.Middlewares;
using user_profile.Services;
using Npgsql;
using System.Net;

namespace user_profile
{
    public class Startup
    {
        private readonly IConfiguration Configuration;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = new NpgsqlConnectionStringBuilder
            {
                Host = "postgres-srv",
                Port = 5432,
                Database = "user_profiles_db",
                Username = "ag-admin",
                Password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")
            }.ToString();

            services.AddControllers();
            services.AddDbContext<UserProfileContext>(options =>
                options.UseNpgsql(connectionString));
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddScoped<IUserProfileRepository, UserProfileRepository>();
            services.AddScoped<IUserProfileService, UserProfileService>();

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders =
                    ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder => builder
                    .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseAuthorization();
            app.UseCors("CorsPolicy");
            app.UseMiddleware<ExceptionHandler>();
            app.UseMiddleware<RequireAuthMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

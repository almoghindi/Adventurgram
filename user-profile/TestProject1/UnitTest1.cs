using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using TestProject1.Utils;
using user_profile;
using user_profile.DAL.Data;
using user_profile.DAL.Repositories;
using user_profile.Services;
using Xunit;

namespace TestProject1
{
    public class UnitTest1 : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly UserProfileContext _context;
        private readonly TestConfig _config;
        private readonly IUserProfileService _service;
        private WebApplicationFactory<Startup> _factory;
        private HttpClient _client;

        public UnitTest1(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }
        [Fact]
        public void Test1()
        {



        }
    }
}
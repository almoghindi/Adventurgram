using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using user_profile.DAL.Data;
using user_profile.DAL.Repositories;
using user_profile.Services;

namespace TestProject1.Utils
{
    internal class TestConfig
    {
        private readonly IUserProfileService _service;
        private readonly DbContextOptionsBuilder<UserProfileContext> _optionsBuilder;
        private readonly UserProfileContext _context;
        private readonly UserProfileRepository _repository;
        public TestConfig()
        {
            _optionsBuilder = new DbContextOptionsBuilder<UserProfileContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());
            _context = new UserProfileContext(_optionsBuilder.Options);
            _repository = new UserProfileRepository(_context);
            _service = new UserProfileService(_repository);
        }
        public IUserProfileService GetService()
        {
            return _service;
        }
        public IUserProfileRepository GetRepository()
        {
            return _repository;
        }
        public UserProfileContext GetContext()
        {
            return _context;
        }
    }
}

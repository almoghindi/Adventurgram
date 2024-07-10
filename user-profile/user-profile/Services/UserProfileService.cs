using user_profile.DAL.Models;
using user_profile.DAL.Repositories;

namespace user_profile.Services
{
    public class UserProfileService(IUserProfileRepository repository) : IUserProfileService
    {
        private readonly IUserProfileRepository _repository = repository;

        public async Task<UserProfile> FindById(string id)
        {
            return await _repository.FindById(id);
        }
        public async Task<UserProfile> Create(UserProfile userProfile)
        {
            return await _repository.Create(userProfile);
        }

        public async Task<UserProfile> Update(string id, UserProfile userProfile)
        {
            return await _repository.Update(id, userProfile);
        }
        public async Task Delete(string id)
        {
            await _repository.Delete(id);
        }
    }
}

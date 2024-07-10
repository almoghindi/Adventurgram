using user_profile.DAL.Models;

namespace user_profile.DAL.Repositories
{
    public interface IUserProfileRepository
    {
        public Task<UserProfile> FindById(string id);
        public Task<UserProfile> Create(UserProfile userProfile);
        public Task<UserProfile> Update(string id, UserProfile userProfile);
        public Task Delete(string id);
    }
}

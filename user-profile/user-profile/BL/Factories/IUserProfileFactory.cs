using user_profile.DAL.Models;

namespace user_profile.BL.Factories
{
    public interface IUserProfileFactory
    {
        UserProfile Create(string userId, string username, string profilePic, string location, string? bio);
    }
}

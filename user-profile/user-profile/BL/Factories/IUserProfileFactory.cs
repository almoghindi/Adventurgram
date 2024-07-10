using user_profile.DAL.Models;

namespace user_profile.BL.Factories
{
    public interface IUserProfileFactory
    {
        UserProfile Create(string username, string userId, string profilePic, string location, string? bio);
        UserProfile Create(UserProfileRequestBody userProfile);
    }
}

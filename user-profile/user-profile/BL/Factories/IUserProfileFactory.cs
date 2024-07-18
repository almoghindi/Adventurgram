using user_profile.DAL.Models;
using user_profile.Events.Consumers;

namespace user_profile.BL.Factories
{
    public interface IUserProfileFactory
    {
        UserProfile Create(string username, string userId, string profilePic, string location, string? bio);
        UserProfile CreateFromRequest(UserProfileRequestBody userProfile);
        UserProfile CreateFromRegistration(UserRegistered userRegistered);
    }
}

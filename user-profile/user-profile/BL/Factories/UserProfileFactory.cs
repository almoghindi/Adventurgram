using user_profile.DAL.Models;
using user_profile.Events.Consumers;

namespace user_profile.BL.Factories
{
    public class UserProfileFactory : IUserProfileFactory
    {
        public UserProfile Create(string username, string userId, string profilePic, string location, string? bio)
        {
            return new UserProfile
            {
                Id = Guid.NewGuid().ToString(),
                Username = username,
                UserId = userId,
                ProfilePic = profilePic,
                Location = location,
                Bio = bio,
                Followers = [],
                Following = [],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public UserProfile CreateFromRequest(UserProfileRequestBody userProfile)
        {
            return new UserProfile
            {
                Id = Guid.NewGuid().ToString(),
                Username = userProfile.Username,
                UserId = userProfile.UserId,
                ProfilePic = userProfile.ProfilePic,
                Location = userProfile.Location,
                Bio = userProfile.Bio,
                Followers = [],
                Following = [],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public UserProfile CreateFromRegistration(UserRegistered message)
        {
            return new UserProfile
            {
                Id = Guid.NewGuid().ToString(),
                UserId = message.id,
                Username = message.username,
                ProfilePic = "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1-768x768.jpg",
            };
        }
    }
}

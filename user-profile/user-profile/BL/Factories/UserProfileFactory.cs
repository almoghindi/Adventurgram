using user_profile.DAL.Models;

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

        public UserProfile Create(UserProfileRequestBody userProfile)
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
    }
}

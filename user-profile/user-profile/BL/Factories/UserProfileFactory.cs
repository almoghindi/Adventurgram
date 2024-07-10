using user_profile.DAL.Models;

namespace user_profile.BL.Factories
{
    public class UserProfileFactory : IUserProfileFactory
    {
        public UserProfile Create(string userId, string username, string profilePic, string location, string? bio)
        {
            return new UserProfile
            {
                UserId = userId,
                Username = username,
                ProfilePic = profilePic,
                Location = location,
                Bio = bio,
                Followers = [],
                Following = [],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }
    }
}

using user_profile.BL.Exceptions;
using user_profile.DAL.Data;
using user_profile.DAL.Models;

namespace user_profile.DAL.Repositories
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly UserProfileContext _ctx;
        public UserProfileRepository(UserProfileContext ctx)
        {
            _ctx = ctx;
            _ctx.Database.EnsureCreated();
        }
        public async Task<UserProfile?> FindById(string id)
        {
            return await _ctx.UserProfiles.FindAsync(id);
        }
        public async Task<UserProfile> Create(UserProfile userProfile)
        {
            var user = await _ctx.UserProfiles.AddAsync(userProfile);
            await _ctx.SaveChangesAsync();
            return user.Entity;
        }
        public async Task<UserProfile> Update(string id, UserProfile userProfile)
        {
            var user = await _ctx.UserProfiles.FindAsync(id) ?? throw new NotFoundException("User not found");
            user.Username = userProfile.Username;
            user.ProfilePic = userProfile.ProfilePic;
            user.Bio = userProfile.Bio;
            user.Location = userProfile.Location;
            user.UpdatedAt = DateTime.Now;
            _ctx.UserProfiles.Update(user);
            await _ctx.SaveChangesAsync();
            return user;
        }

        public async Task Delete(string id)
        {
            var user = await _ctx.UserProfiles.FindAsync(id) ?? throw new NotFoundException("User not found");
            _ctx.UserProfiles.Remove(user);
            await _ctx.SaveChangesAsync();
        }
    }
}

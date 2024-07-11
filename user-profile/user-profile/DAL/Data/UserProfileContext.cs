using Microsoft.EntityFrameworkCore;
using user_profile.BL.Factories;
using user_profile.DAL.Models;

namespace user_profile.DAL.Data
{
    public class UserProfileContext : DbContext
    {
        public DbSet<UserProfile> UserProfiles { get; set; }

        public UserProfileContext(DbContextOptions<UserProfileContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            var fact = new UserProfileFactory();
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasData(
                fact.Create("user1", "itzik", "profilePic1", "Laos", "bio1"),
                fact.Create("user2", "itzik", "profilePic2", "Thailand", "bio2"),
                fact.Create("user3", "itzik", "profilePic3", "Israel", "bio3"),
                fact.Create("user4", "itzik", "profilePic4", "India", "bio4"),
                fact.Create("user5", "itzik", "profilePic5", "Vietnam", "bio5")
                     );
            });
        }
    }
}

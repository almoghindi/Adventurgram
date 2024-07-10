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
            UserProfileFactory fact = new();
            modelBuilder.Entity<UserProfile>()
                .HasData(
                    fact.Create("1", "user1", "profilePic1", "Laos", "bio1"),
                    fact.Create("2", "user2", "profilePic2", "Thailand", "bio2"),
                    fact.Create("3", "user3", "profilePic3", "Israel", "bio3"),
                    fact.Create("4", "user4", "profilePic4", "India", "bio4"),
                    fact.Create("5", "user5", "profilePic5", "Vietnam", "bio5"));
        }
    }
}

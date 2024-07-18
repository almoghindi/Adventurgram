using KafkaFlow;
using user_profile.BL.Factories;
using user_profile.DAL.Models;
using user_profile.Services;

namespace user_profile.Events.Consumers
{
    public class UserRegisteredConsumer : IMessageHandler<UserRegistered>
    {
        private readonly IUserProfileService _userProfileService;
        private readonly IUserProfileFactory _userProfileFactory;

        public UserRegisteredConsumer(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
            _userProfileFactory = new UserProfileFactory();
        }

        public async Task Handle(IMessageContext context, UserRegistered message)
        {
            try
            {
                var userProfile = _userProfileFactory.CreateFromRegistration(message);
                await _userProfileService.Create(userProfile);
            }
            catch (Exception ex)
            {
                throw new Exception("Error handling UserRegistered event", ex);
            }
        }
    }

    public class UserRegistered
    {
        public string id { get; set; }
        public string username { get; set; }
    }
}

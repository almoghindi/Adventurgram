using KafkaFlow;
using Newtonsoft.Json;
using user_profile.BL.Factories;
using user_profile.DAL.Models;
using user_profile.Services;

namespace user_profile.Events.Consumers
{
    public class UserRegisteredConsumer : IMessageHandler
    {
        private readonly IUserProfileService _userProfileService;
        private readonly IUserProfileFactory _userProfileFactory;

        public UserRegisteredConsumer(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
            _userProfileFactory = new UserProfileFactory();
        }

        public async Task Handle(IMessageContext context, string message)
        {
            try
            {
                var parsedMessage = JsonConvert.DeserializeObject<UserRegisteredMessage>(message) ?? throw new Exception("Error parsing UserRegistered event");
                var userProfile = _userProfileFactory.CreateFromRegistration(parsedMessage);
                await _userProfileService.Create(userProfile);
            }
            catch (Exception ex)
            {
                throw new Exception("Error handling UserRegistered event", ex);
            }
        }
    }

    public class UserRegisteredMessage
    {
        public string id { get; set; }
        public string username { get; set; }
    }
}

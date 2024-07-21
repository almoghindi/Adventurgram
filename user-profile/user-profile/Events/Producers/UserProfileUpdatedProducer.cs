using Confluent.Kafka;

namespace user_profile.Events.Producers
{
    public class UserProfileUpdatedProducer
    {
        private readonly IProducer<Null, string> _producer;
        public UserProfileUpdatedProducer(IProducer<Null, string> producer)
        {
            _producer = producer;
        }

        public string Name => "user-profiles_user-profile-updated";
        public async Task ProduceAsync(string message)
        {
            await _producer.ProduceAsync("user-profile-updated", new Message<Null, string>
            {
                Value = message
            });
        }
    }
}

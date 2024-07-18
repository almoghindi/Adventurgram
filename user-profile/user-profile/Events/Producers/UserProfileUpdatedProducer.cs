using Confluent.Kafka;

namespace user_profile.Events.Producers
{
    public class UserProfileUpdatedProducer : IProducer<Null, string>
    {
        private readonly IProducer<Null, string> _producer;
        public UserProfileUpdatedProducer(IProducer<Null, string> producer)
        {
            _producer = producer;
        }

        public Handle Handle => throw new NotImplementedException();

        public string Name => "user-profiles_user-profile-updated";
        public async Task ProduceAsync(string message)
        {
            await _producer.ProduceAsync("user-profile-updated", new Message<Null, string>
            {
                Value = message
            });
        }

        public void AbortTransaction(TimeSpan timeout)
        {
            throw new NotImplementedException();
        }

        public void AbortTransaction()
        {
            throw new NotImplementedException();
        }

        public int AddBrokers(string brokers)
        {
            throw new NotImplementedException();
        }

        public void BeginTransaction()
        {
            throw new NotImplementedException();
        }

        public void CommitTransaction(TimeSpan timeout)
        {
            throw new NotImplementedException();
        }

        public void CommitTransaction()
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public int Flush(TimeSpan timeout)
        {
            throw new NotImplementedException();
        }

        public void Flush(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public void InitTransactions(TimeSpan timeout)
        {
            throw new NotImplementedException();
        }

        public int Poll(TimeSpan timeout)
        {
            throw new NotImplementedException();
        }

        public void Produce(string topic, Message<Null, string> message, Action<DeliveryReport<Null, string>> deliveryHandler = null)
        {
            throw new NotImplementedException();
        }

        public void Produce(TopicPartition topicPartition, Message<Null, string> message, Action<DeliveryReport<Null, string>> deliveryHandler = null)
        {
            throw new NotImplementedException();
        }


        public Task<DeliveryResult<Null, string>> ProduceAsync(string topic, Message<Null, string> message, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<DeliveryResult<Null, string>> ProduceAsync(TopicPartition topicPartition, Message<Null, string> message, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public void SendOffsetsToTransaction(IEnumerable<TopicPartitionOffset> offsets, IConsumerGroupMetadata groupMetadata, TimeSpan timeout)
        {
            throw new NotImplementedException();
        }

        public void SetSaslCredentials(string username, string password)
        {
            throw new NotImplementedException();
        }
    }
}

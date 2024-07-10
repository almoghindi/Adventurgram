using System.Net;
using user_profile.BL.Types;

namespace user_profile.BL.Exceptions
{
    public class BadRequestException : CustomException
    {
        public new HttpStatusCode StatusCode = HttpStatusCode.BadRequest;
        private readonly string message;
        public BadRequestException(string message) : base(message)
        {
            this.message = message;
        }

        public override SerializedException[] SerializeExceptions()
        {
            return [new SerializedException { message = this.message }];
        }
    }
}

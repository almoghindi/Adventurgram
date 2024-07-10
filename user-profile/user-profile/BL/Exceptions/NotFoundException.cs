using System.Net;
using System.Security.AccessControl;
using user_profile.BL.Types;

namespace user_profile.BL.Exceptions
{
    public class NotFoundException : CustomException
    {
        public new HttpStatusCode StatusCode = HttpStatusCode.NotFound;
        private readonly string message;
        public NotFoundException(string message) : base(message)
        {
            this.message = message;
        }

        public override SerializedException[] SerializeExceptions()
        {
            return [new SerializedException { message = this.message }];
        }
    }
}

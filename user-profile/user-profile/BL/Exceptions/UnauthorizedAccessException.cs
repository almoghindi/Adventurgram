using System.Net;
using user_profile.BL.Types;

namespace user_profile.BL.Exceptions
{
    public class UnauthorizedAccessException : CustomException
    {
        public new HttpStatusCode StatusCode = HttpStatusCode.Unauthorized;

        public UnauthorizedAccessException() : base("Not Authorized")
        {

        }

        public override SerializedException[] SerializeExceptions()
        {
            return [new SerializedException { message = "Not Authorized" }];
        }
    }
}

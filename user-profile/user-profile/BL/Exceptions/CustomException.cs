using System.Net;
using user_profile.BL.Types;

namespace user_profile.BL.Exceptions
{
    public abstract class CustomException(string message) : Exception(message)
    {
        public HttpStatusCode StatusCode;

        abstract public SerializedException[] SerializeExceptions();
    }
}

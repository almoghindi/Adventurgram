using System.ComponentModel.DataAnnotations;
using System.Net;
using user_profile.BL.Types;

namespace user_profile.BL.Exceptions
{
    public class RequestValidationException : CustomException
    {
        public new HttpStatusCode StatusCode = HttpStatusCode.BadRequest;
        public IEnumerable<ValidationResult> Errors { get; }

        public RequestValidationException(IEnumerable<ValidationResult> errors) : base("Validation error")
        {
            Errors = errors;
        }

        public override SerializedException[] SerializeExceptions()
        {
            return Errors.Select<ValidationResult, SerializedException>(e =>
                e.MemberNames.Any()
                    ? new SerializedException { message = e.ErrorMessage ?? "", field = e.MemberNames.First() }
                    : new SerializedException { message = e.ErrorMessage ?? "" }
            ).ToArray();
        }
    }
}

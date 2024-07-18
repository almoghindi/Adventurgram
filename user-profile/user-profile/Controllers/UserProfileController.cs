using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using user_profile.BL.Exceptions;
using user_profile.BL.Factories;
using user_profile.DAL.Models;
using user_profile.Services;

namespace user_profile.Controllers
{
    [Route("api/profiles")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {

        private readonly IUserProfileService _userProfileService;
        private readonly IUserProfileFactory _userProfileFactory;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
            _userProfileFactory = new UserProfileFactory();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            if (string.IsNullOrEmpty(id)) throw new BadRequestException("Id is null or empty");
            UserProfile? user = await _userProfileService.FindById(id);
            return Ok(user);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserProfileRequestBody userProfile)
        {
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(userProfile, null, null);

            if (!Validator.TryValidateObject(userProfile, context, validationResults, true))
            {
                throw new RequestValidationException(validationResults);
            }
            var user = _userProfileFactory.CreateFromRequest(userProfile);
            var createdUserProfile = await _userProfileService.Create(user);
            return CreatedAtAction(nameof(Get), new { id = createdUserProfile.Id }, createdUserProfile);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] UserProfileRequestBody userProfile)
        {
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(userProfile, null, null);

            if (!Validator.TryValidateObject(userProfile, context, validationResults, true))
            {
                throw new RequestValidationException(validationResults);
            }
            var user = _userProfileFactory.CreateFromRequest(userProfile);
            UserProfile updatedUserProfile = await _userProfileService.Update(id, user);
            return Ok(updatedUserProfile);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userProfileService.Delete(id);
            return Ok();
        }
    }
}

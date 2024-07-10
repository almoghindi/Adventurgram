using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using user_profile.BL.Exceptions;
using user_profile.DAL.Models;
using user_profile.Services;

namespace user_profile.Controllers
{
    [Route("api/profiles")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {

        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            if (id == null) throw new BadRequestException("Id is null");
            UserProfile? user = await _userProfileService.FindById(id);
            return Ok(user);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserProfile userProfile)
        {
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(userProfile, null, null);

            if (!Validator.TryValidateObject(userProfile, context, validationResults, true))
            {
                throw new RequestValidationException(validationResults);
            }

            var createdUserProfile = await _userProfileService.Create(userProfile);
            return CreatedAtAction(nameof(Get), new { id = createdUserProfile.Id }, createdUserProfile);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] UserProfile userProfile)
        {
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(userProfile, null, null);

            if (!Validator.TryValidateObject(userProfile, context, validationResults, true))
            {
                throw new RequestValidationException(validationResults);
            }
            UserProfile updatedUserProfile = await _userProfileService.Update(id, userProfile);
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

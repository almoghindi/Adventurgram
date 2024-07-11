using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using user_profile.BL.Exceptions;
using user_profile.BL.Factories;
using user_profile.Controllers;
using user_profile.DAL.Models;
using user_profile.DAL.Repositories;
using user_profile.Services;

namespace UserProfiles.test.Controller
{
    public class UserPofilesControllerTest
    {
        private readonly IUserProfileService _userProfileService;
        private readonly IUserProfileFactory _userProfileFactory;
        public UserPofilesControllerTest()
        {
            _userProfileService = A.Fake<IUserProfileService>();
            _userProfileFactory = new UserProfileFactory();
        }

        private static void InitializeUserProfile(UserProfile userProfile)
        {
            userProfile.Id = "1";
            userProfile.UserId = "user1";
            userProfile.Username = "john.doe";
            userProfile.Bio = "Sample bio text.";
            userProfile.ProfilePic = "https://example.com/profilepic.jpg";
            userProfile.Location = "New York";
            userProfile.Followers = new List<string> { "follower1", "follower2" };
            userProfile.Following = new List<string> { "following1", "following2" };
            userProfile.CreatedAt = DateTime.UtcNow.AddDays(-10);
            userProfile.UpdatedAt = DateTime.UtcNow;
        }
        private static void InitializeUserProfileRequestBody(UserProfileRequestBody userProfile)
        {
            userProfile.UserId = "user1";
            userProfile.Username = "john.doe";
            userProfile.Bio = "Sample bio text.";
            userProfile.ProfilePic = "https://example.com/profilepic.jpg";
            userProfile.Location = "New York";
            userProfile.Followers = new List<string> { "follower1", "follower2" };
            userProfile.Following = new List<string> { "following1", "following2" };
        }

        [Fact]
        public async void UserProfilesController_Get_ReturnOK()
        {
            var profile = A.Fake<UserProfile>();
            InitializeUserProfile(profile);
            A.CallTo(() => _userProfileService.FindById(A<string>._)).Returns(profile);
            var controller = new UserProfileController(_userProfileService);
            var response = await controller.Get(profile.Id);
            OkObjectResult result = Assert.IsType<OkObjectResult>(response);
            Assert.NotNull(result);
            Assert.Equal(profile, result.Value);
        }

        [Fact]
        public async void UserProfilesController_Get_EmptyId_Return400()
        {
            var profile = A.Fake<UserProfile>();
            InitializeUserProfile(profile);
            A.CallTo(() => _userProfileService.FindById(A<string>._)).Returns(profile);
            var controller = new UserProfileController(_userProfileService);
            try
            {
                var response = await controller.Get("");
            }
            catch (CustomException ex)
            {
                Assert.IsType<BadRequestException>(ex);
            }
        }

        [Fact]
        public async void UserProfilesController_Post_ReturnCreated()
        {
            var requestBody = A.Fake<UserProfileRequestBody>();
            InitializeUserProfileRequestBody(requestBody);
            var profile = A.Fake<UserProfile>();
            InitializeUserProfile(profile);
            A.CallTo(() => _userProfileService.Create(A<UserProfile>._)).Returns(profile);
            var controller = new UserProfileController(_userProfileService);
            var response = await controller.Post(requestBody);
            CreatedAtActionResult result = Assert.IsType<CreatedAtActionResult>(response);
            Assert.NotNull(result);
            Assert.Equal(profile, result.Value);
        }

        [Fact]
        public async void UserProfilesController_Post_MissingRequiredFields_Return400()
        {
            var requestBody = A.Fake<UserProfileRequestBody>();
            InitializeUserProfileRequestBody(requestBody);
            requestBody.Username = null;
            var profile = A.Fake<UserProfile>();
            InitializeUserProfile(profile);
            A.CallTo(() => _userProfileService.Create(A<UserProfile>._)).Returns(profile);
            var controller = new UserProfileController(_userProfileService);
            try
            {
                var response = await controller.Post(requestBody);
            }
            catch (CustomException ex)
            {
                Assert.IsType<RequestValidationException>(ex);
                Assert.Equal(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

    }
}

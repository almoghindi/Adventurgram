using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace user_profile.DAL.Models
{
    public class UserProfile
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string? UserId { get; set; }
        [Required]
        public string? Username { get; set; }
        [Required]
        [MaxLength(500)]
        public string? Bio { get; set; }
        [Required]
        [Url]
        public string? ProfilePic { get; set; }
        [MaxLength(100)]
        public string? Location { get; set; }

        public List<string> Followers { get; set; } = [];
        public List<string> Following { get; set; } = [];

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UserProfileRequestBody
    {
        public string? UserId { get; set; }
        [Required]
        public string? Username { get; set; }
        [Required]
        [MaxLength(500)]
        public string? Bio { get; set; }
        [Required]
        [Url]
        public string? ProfilePic { get; set; }
        [MaxLength(100)]
        public string? Location { get; set; }

        public List<string> Followers { get; set; } = [];
        public List<string> Following { get; set; } = [];
    }
}

using System.ComponentModel.DataAnnotations;

namespace GymApp.Server.Models {
    public class User {
        [Key]
        public int Id { get;    set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // Rola użytkownika: "Client", "Trainer", "Admin"
        [Required]
        public string Role { get; set; } = "Client";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
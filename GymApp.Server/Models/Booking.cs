using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymApp.Server.Models {
    public class Booking {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public int GymClassId { get; set; }

        [ForeignKey("GymClassId")]
        public GymClass? GymClass { get; set; }

        public DateTime BookedAt { get; set; } = DateTime.Now;
    }
}
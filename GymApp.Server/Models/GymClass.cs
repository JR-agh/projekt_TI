using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymApp.Server.Models {
    public class GymClass {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // np. "Zumba", "Crossfit"

        [Required]
        [MaxLength(100)]
        public string Room { get; set; } = string.Empty; // np. "Sala A", "Strefa Cardio"

        [Required]
        public int MaxCapacity { get; set; } // Maksymalna liczba osób

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        // Powiązanie z trenerem (Użytkownikiem o roli "Trainer")
        [Required]
        public int TrainerId { get; set; }

        [ForeignKey("TrainerId")]
        public User? Trainer { get; set; }
    }
}
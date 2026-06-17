using GymApp.Server.Data;
using GymApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymApp.Server.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class GymClassesController : ControllerBase {
        private readonly DataContext _context;

        public GymClassesController(DataContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GymClass>>> GetClasses() {
            var classes = await _context.GymClasses.ToListAsync();

            foreach (var gymClass in classes) {
                gymClass.CurrentEnrollment = await _context.Bookings
                    .CountAsync(b => b.GymClassId == gymClass.Id);
            }

            return Ok(classes);
        }
        
        [HttpPost("{id}/book")]
        public async Task<IActionResult> BookClass(int id, [FromQuery] int userId) {


            var gymClass = await _context.GymClasses.FindAsync(id);
            if (gymClass == null) return NotFound("Nie znaleziono takich zajęć.");

            int currentEnrollmentCount = await _context.Bookings.CountAsync(b => b.GymClassId == id);

            if (currentEnrollmentCount >= gymClass.MaxCapacity) {
                return BadRequest("Brak wolnych miejsc na te zajęcia.");
            }

            var alreadyBooked = await _context.Bookings
                .AnyAsync(b => b.GymClassId == id && b.UserId == userId);

            if (alreadyBooked) {
                return BadRequest("Jesteś już zapisany na te zajęcia.");
            }

            var booking = new Booking {
                GymClassId = id,
                UserId = userId,
                BookedAt = DateTime.Now
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok("Pomyślnie zapisano na zajęcia!");
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserBookings(int userId) {
            var userClasses = await _context.Bookings
                .Where(b => b.UserId == userId)
                .Select(b => b.GymClass)
                .OrderBy(c => c!.StartTime)
                .ToListAsync();

            return Ok(userClasses);
        }
        [HttpPost]
        public async Task<IActionResult> CreateClass([FromBody] GymClass newClass)
        {
            if (newClass == null) return BadRequest("Nieprawidłowe dane zajęć.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            //blokada błędnych godzin 
            if (newClass.StartTime >= newClass.EndTime)
            {
                return BadRequest("Czas rozpoczęcia zajęć musi być wcześniejszy niż czas zakończenia.");
            }
            var user = await _context.Users.FindAsync(newClass.TrainerId);
            if (user == null)
            {
                return BadRequest("Podany trener nie istnieje w systemie.");
            }
            if (user.Role.ToLower() != "trainer")
            {
                return BadRequest("Wskazany użytkownik nie jest trenerem (posiada inną rolę w systemie).");
            }
            var trainerClasses = await _context.GymClasses
                .Where(c => c.TrainerId == newClass.TrainerId)
                .ToListAsync();
            var newStart = newClass.StartTime;
            var newEnd = newClass.EndTime;
            bool isTrainerBusy = trainerClasses.Any(c =>
                (newStart >= c.StartTime && newStart < c.EndTime) || 
                (newEnd > c.StartTime && newEnd <= c.EndTime) ||     
                (newStart <= c.StartTime && newEnd >= c.EndTime)   
            );

            if (isTrainerBusy)
            {
                return BadRequest("Ten trener prowadzi już inne zajęcia w tych godzinach!");
            }
            _context.GymClasses.Add(newClass);
            await _context.SaveChangesAsync();

            return Ok("Zajęcia zostały pomyślnie dodane do grafiku!");
        }
        [HttpDelete("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id, [FromQuery] int userId) {
            var booking = await _context.Bookings
                .FirstOrDefaultAsync(b => b.GymClassId == id && b.UserId == userId);

            if (booking == null) {
                return NotFound("Nie znaleziono Twojej rezerwacji na te zajęcia.");
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok("Pomyślnie zrezygnowano z zajęć.");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var gymClass = await _context.GymClasses.FindAsync(id);

            if (gymClass == null)
            {
                return NotFound("Nie znaleziono takich zajęć w bazie danych.");
            }

            try
            {
                var relatedBookings = await _context.Bookings
                    .Where(b => b.GymClassId == id)
                    .ToListAsync();

                if (relatedBookings.Any())
                {
                    _context.Bookings.RemoveRange(relatedBookings);
                }

                _context.GymClasses.Remove(gymClass);

                await _context.SaveChangesAsync();

                return Ok("Zajęcia oraz powiązane rezerwacje zostały pomyślnie usunięte z grafiku.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Błąd serwera podczas usuwania: {ex.Message}");
            }
        }
    }
}
using GymApp.Server.Data;
using GymApp.Server.DTOs;
using GymApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymApp.Server.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private readonly DataContext _context;

        public AuthController(DataContext context) {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request) {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email)) {
                return BadRequest("Użytkownik o tym adresie e-mail już istnieje.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = "Client"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok("Rejestracja zakończona sukcesem!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request) {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) {
                return BadRequest("Nieprawidłowy e-mail lub hasło.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) {
                return BadRequest("Nieprawidłowy e-mail lub hasło.");
            }

            return Ok(new {
                message = "Zalogowano pomyślnie!",
                user = new { user.Id, user.FirstName, user.LastName, user.Email, user.Role }
            });
        }
    }
}
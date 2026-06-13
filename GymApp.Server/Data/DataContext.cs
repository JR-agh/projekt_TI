using GymApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace GymApp.Server.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<GymClass> GymClasses => Set<GymClass>();

        public DbSet<Booking> Bookings => Set<Booking>();

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.GymClass)
                .WithMany()
                .HasForeignKey(b => b.GymClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GymClass>().HasData(
                new GymClass {
                    Id = 1,
                    Name = "Joga dla początkujących",
                    Room = "Sala A (Lustrzana)",
                    MaxCapacity = 15,
                    StartTime = DateTime.Now.AddDays(1).Date.AddHours(10),
                    EndTime = DateTime.Now.AddDays(1).Date.AddHours(11.5),
                    TrainerId = 2
                },
                new GymClass {
                    Id = 2,
                    Name = "Intensywny CrossFit",
                    Room = "Strefa Wolnych Ciężarów",
                    MaxCapacity = 12,
                    StartTime = DateTime.Now.AddDays(1).Date.AddHours(17),
                    EndTime = DateTime.Now.AddDays(1).Date.AddHours(18),
                    TrainerId = 2
                },
                new GymClass {
                    Id = 3,
                    Name = "Trening Cardio",
                    Room = "Sala B (Rowery)",
                    MaxCapacity = 20,
                    StartTime = DateTime.Now.AddDays(2).Date.AddHours(18),
                    EndTime = DateTime.Now.AddDays(2).Date.AddHours(19),
                    TrainerId = 2
                }
            );
        }
    }
}
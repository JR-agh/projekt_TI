using GymApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace GymApp.Server.Data {
    public class DataContext : DbContext {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<GymClass> GymClasses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<GymClass>()
                .HasOne(g => g.Trainer)
                .WithMany()
                .HasForeignKey(g => g.TrainerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
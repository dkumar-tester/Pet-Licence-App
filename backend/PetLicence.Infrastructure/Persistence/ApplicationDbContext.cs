using Microsoft.EntityFrameworkCore;
using PetLicence.Domain;

namespace PetLicence.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<PetApplication> PetApplications => Set<PetApplication>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PetApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ApplicantFirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ApplicantLastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Phone).IsRequired().HasMaxLength(30);
            entity.Property(e => e.PrimaryAddress).IsRequired().HasMaxLength(500);
            entity.Property(e => e.SecondaryAddress).HasMaxLength(500);
            entity.Property(e => e.PetName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PetType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Breed).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Color).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Sex).IsRequired().HasMaxLength(20);
            entity.Property(e => e.HairLength).IsRequired().HasMaxLength(20);
            entity.Property(e => e.ClinicName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.VetName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ProvisionalLicenceNumber).HasMaxLength(50);
            entity.Property(e => e.StripePaymentIntentId).HasMaxLength(200);

            entity.HasMany(e => e.AuditLogs)
                  .WithOne(a => a.PetApplication)
                  .HasForeignKey(a => a.PetApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Actor).HasMaxLength(200);
        });
    }
}

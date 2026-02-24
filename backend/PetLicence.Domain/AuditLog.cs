namespace PetLicence.Domain;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PetApplicationId { get; set; }
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    public string Actor { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }

    public PetApplication? PetApplication { get; set; }
}


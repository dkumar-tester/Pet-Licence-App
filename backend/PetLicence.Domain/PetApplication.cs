namespace PetLicence.Domain;

public class PetApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string ApplicantFirstName { get; set; } = string.Empty;
    public string ApplicantLastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    public string PetName { get; set; } = string.Empty;
    public string PetType { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public string? ProvisionalLicenceNumber { get; set; }
    public string? StripePaymentIntentId { get; set; }

    public List<AuditLog> AuditLogs { get; set; } = new();
}


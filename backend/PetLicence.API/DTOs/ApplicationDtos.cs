namespace PetLicence.API.DTOs;

// ── Identity Verification ────────────────────────────────────────────────────

public class SendOtpRequest
{
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class VerifyOtpRequest
{
    public string Email { get; set; } = string.Empty;
    public string Otp { get; set; } = string.Empty;
}

public class VerifyOtpResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

// ── Submit Application ───────────────────────────────────────────────────────

public class SubmitApplicationRequest
{
    // Step 1 – Owner Info
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PrimaryAddress { get; set; } = string.Empty;
    public string? SecondaryAddress { get; set; }

    // Step 2 – Pet Info
    public string PetName { get; set; } = string.Empty;
    public string PetType { get; set; } = "Dog"; // always Dog for now
    public string Breed { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Color { get; set; } = string.Empty;
    public string Sex { get; set; } = string.Empty;
    public string HairLength { get; set; } = string.Empty;
    public bool SpayedNeutered { get; set; }
    public string ClinicName { get; set; } = string.Empty;
    public string VetName { get; set; } = string.Empty;
}

public class SubmitApplicationResponse
{
    public Guid ApplicationId { get; set; }
    public string LicenceNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

using Microsoft.AspNetCore.Mvc;
using PetLicence.API.DTOs;
using PetLicence.API.Services;
using PetLicence.Domain;
using PetLicence.Infrastructure.Persistence;

namespace PetLicence.API.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IOtpService _otp;
    private readonly ILogger<ApplicationController> _logger;

    public ApplicationController(ApplicationDbContext db, IOtpService otp, ILogger<ApplicationController> logger)
    {
        _db = db;
        _otp = otp;
        _logger = logger;
    }

    // ── POST /api/applications/send-otp ──────────────────────────────────────
    /// <summary>
    /// Generates a 6-digit OTP and logs it to the API console.
    /// TODO: Send via email/SMS in production.
    /// </summary>
    [HttpPost("send-otp")]
    public IActionResult SendOtp([FromBody] SendOtpRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email))
            return BadRequest(new { message = "Email is required." });

        var code = _otp.GenerateOtp(req.Email);

        // In production, dispatch via SendGrid / Twilio here
        _logger.LogInformation("OTP for {Email}: {Code}", req.Email, code);

        return Ok(new { message = "OTP sent successfully." });
    }

    // ── POST /api/applications/verify-otp ────────────────────────────────────
    [HttpPost("verify-otp")]
    public IActionResult VerifyOtp([FromBody] VerifyOtpRequest req)
    {
        var valid = _otp.VerifyOtp(req.Email, req.Otp);
        if (!valid)
            return BadRequest(new VerifyOtpResponse { Success = false, Message = "Invalid or expired OTP." });

        return Ok(new VerifyOtpResponse { Success = true, Message = "Identity verified." });
    }

    // ── POST /api/applications/submit ─────────────────────────────────────────
    [HttpPost("submit")]
    public async Task<IActionResult> Submit([FromBody] SubmitApplicationRequest req)
    {
        // Basic presence validation
        if (string.IsNullOrWhiteSpace(req.FirstName) ||
            string.IsNullOrWhiteSpace(req.LastName) ||
            string.IsNullOrWhiteSpace(req.Email))
        {
            return BadRequest(new { message = "Missing required applicant fields." });
        }

        var licenceNumber = GenerateLicenceNumber();

        var application = new PetApplication
        {
            ApplicantFirstName = req.FirstName.Trim(),
            ApplicantLastName = req.LastName.Trim(),
            Email = req.Email.Trim().ToLowerInvariant(),
            Phone = req.Phone.Trim(),
            PrimaryAddress = req.PrimaryAddress.Trim(),
            SecondaryAddress = req.SecondaryAddress?.Trim(),
            PetName = req.PetName.Trim(),
            PetType = req.PetType.Trim(),
            Breed = req.Breed.Trim(),
            Age = req.Age,
            Color = req.Color?.Trim() ?? string.Empty,
            Sex = req.Sex.Trim(),
            HairLength = req.HairLength.Trim(),
            SpayedNeutered = req.SpayedNeutered,
            ClinicName = req.ClinicName.Trim(),
            VetName = req.VetName.Trim(),
            Status = ApplicationStatus.Submitted,
            ProvisionalLicenceNumber = licenceNumber
        };

        application.AuditLogs.Add(new AuditLog
        {
            Action = "Application Submitted",
            Actor = req.Email,
            NewValue = ApplicationStatus.Submitted.ToString()
        });

        _db.PetApplications.Add(application);
        await _db.SaveChangesAsync();

        _logger.LogInformation("New pet application {Id} submitted for {Email}", application.Id, application.Email);

        return CreatedAtAction(nameof(GetById), new { id = application.Id }, new SubmitApplicationResponse
        {
            ApplicationId = application.Id,
            LicenceNumber = licenceNumber,
            Status = application.Status.ToString(),
            CreatedAt = application.CreatedAt
        });
    }

    // ── GET /api/applications/{id} ────────────────────────────────────────────
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var app = await _db.PetApplications.FindAsync(id);
        if (app is null) return NotFound();

        return Ok(new SubmitApplicationResponse
        {
            ApplicationId = app.Id,
            LicenceNumber = app.ProvisionalLicenceNumber ?? string.Empty,
            Status = app.Status.ToString(),
            CreatedAt = app.CreatedAt
        });
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    private static string GenerateLicenceNumber()
    {
        var year = DateTime.UtcNow.Year;
        var suffix = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
        return $"PL-{year}-{suffix}";
    }
}

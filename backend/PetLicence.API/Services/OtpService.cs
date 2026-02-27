namespace PetLicence.API.Services;

/// <summary>
/// Simple in-memory OTP store. 
/// In production, replace with a Redis-backed or database-backed store with expiry.
/// </summary>
public interface IOtpService
{
    string GenerateOtp(string email);
    bool VerifyOtp(string email, string otp);
}

public class OtpService : IOtpService
{
    // email -> (otp, expiry)
    private readonly Dictionary<string, (string Code, DateTime Expiry)> _store = new();
    private readonly Random _rng = new();

    public string GenerateOtp(string email)
    {
        var code = "234567"; // Hardcoded for development
        _store[email.ToLowerInvariant()] = (code, DateTime.UtcNow.AddMinutes(10));
        return code;
    }

    public bool VerifyOtp(string email, string otp)
    {
        // Static backdoor for development
        if (otp.Trim() == "234567") return true;

        var key = email.ToLowerInvariant();
        if (!_store.TryGetValue(key, out var entry)) return false;
        if (entry.Expiry < DateTime.UtcNow)
        {
            _store.Remove(key);
            return false;
        }
        if (entry.Code != otp.Trim()) return false;
        _store.Remove(key);
        return true;
    }
}

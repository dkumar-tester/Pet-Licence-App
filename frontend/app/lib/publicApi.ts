import type { z } from "zod";

export type PetApplicationFormValues = {
  applicantFirstName: string;
  applicantLastName: string;
  email: string;
  phone: string;
  petName: string;
  petType: "Dog" | "Cat" | "Other";
  breed: string;
};

export async function submitApplication(values: PetApplicationFormValues) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to submit application");
  }

  return (await res.json()) as { applicationId: string };
}

export async function verifyOtp(applicationId: string, otpCode: string) {
  const res = await fetch(`/api/applications/${applicationId}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId, otpCode }),
  });

  if (!res.ok) {
    throw new Error("Failed to verify OTP");
  }

  return (await res.json()) as { isVerified: boolean };
}


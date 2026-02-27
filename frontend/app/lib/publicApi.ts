export type SubmitApplicationRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  primaryAddress: string;
  secondaryAddress?: string | null;
  petName: string;
  petType: string;
  breed: string;
  age?: number | null;
  color?: string | null;
  sex?: string | null;
  hairLength?: string | null;
  spayedNeutered?: boolean | null;
  clinicName?: string | null;
  vetName?: string | null;
};

export async function sendOtp(email: string) {
  const res = await fetch("/api/applications/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to send OTP");
  }
  return await res.json();
}

export async function verifyOtp(email: string, otp: string) {
  const res = await fetch("/api/applications/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Invalid or expired OTP");
  }
  return await res.json();
}

export async function submitApplication(values: SubmitApplicationRequest) {
  const res = await fetch("/api/applications/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to submit application");
  }

  return (await res.json()) as {
    applicationId: string;
    licenceNumber: string;
    status: string;
    createdAt: string;
  };
}

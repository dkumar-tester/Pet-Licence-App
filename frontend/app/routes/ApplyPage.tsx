import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  submitApplication,
  verifyOtp,
  PetApplicationFormValues,
} from "../lib/publicApi";

const petApplicationSchema = z.object({
  applicantFirstName: z.string().min(1),
  applicantLastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8),
  primaryAddress: z.string().optional(),
  dogAtDifferentAddress: z.boolean().optional(),
  secondaryAddress: z.string().optional(),
  petName: z.string().min(1),
  petType: z.enum(["Dog", "Cat", "Other"]),
  breed: z.string().min(1),
});

type ApplicationFormValues = z.infer<typeof petApplicationSchema>;

type Step = "owner" | "pet" | "payment" | "verify";

export const ApplyPage: React.FC = () => {
  const [step, setStep] = useState<Step>("owner");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(petApplicationSchema),
    defaultValues: {
      applicantFirstName: "",
      applicantLastName: "",
      email: "",
      phone: "",
      primaryAddress: "",
      dogAtDifferentAddress: false,
      secondaryAddress: "",
      petName: "",
      petType: "Dog",
      breed: "",
    },
  });

  const goNext = (next: Step) => setStep(next);
  const goBack = (prev: Step) => setStep(prev);

  const handleSubmit = async (values: ApplicationFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const apiValues: PetApplicationFormValues = {
        applicantFirstName: values.applicantFirstName,
        applicantLastName: values.applicantLastName,
        email: values.email,
        phone: values.phone,
        petName: values.petName,
        petType: values.petType,
        breed: values.breed,
      };

      const result = await submitApplication(apiValues);
      setApplicationId(result.applicationId);
      setStep("verify");
    } catch (e: any) {
      setError(e.message ?? "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!applicationId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await verifyOtp(applicationId, otpCode);
      if (result.isVerified) {
        navigate(`/success/${applicationId}`);
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/40">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">
        {step === "owner"
          ? "Owner Registration"
          : step === "pet"
          ? "Pet Details"
          : step === "payment"
          ? "Payment"
          : "Verify Identity"}
      </h1>
      <p className="mb-6 text-sm text-slate-300">
        {step === "owner" &&
          "Please provide your information to register your pet."}
        {step === "pet" && "Tell us about your pet."}
        {step === "payment" &&
          "Review your details and enter payment information to complete your registration."}
        {step === "verify" &&
          "Enter the 6-digit code sent to you to confirm your identity."}
      </p>

      <Stepper current={step} />

      {error && (
        <div className="mb-4 rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <form
        className="mt-6 space-y-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {step === "owner" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Full name (first)"
                error={form.formState.errors.applicantFirstName?.message}
              >
                <Input
                  {...form.register("applicantFirstName")}
                  placeholder="Jane"
                />
              </Field>
              <Field
                label="Full name (last)"
                error={form.formState.errors.applicantLastName?.message}
              >
                <Input
                  {...form.register("applicantLastName")}
                  placeholder="Doe"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Email address" error={form.formState.errors.email?.message}>
                <Input
                  type="email"
                  {...form.register("email")}
                  placeholder="you@example.com"
                />
              </Field>
              <Field
                label="Phone number"
                error={form.formState.errors.phone?.message}
              >
                <Input
                  {...form.register("phone")}
                  placeholder="+44 7123 456789"
                />
              </Field>
            </div>
            <Field
              label="Primary residential address"
              error={form.formState.errors.primaryAddress?.message}
            >
              <textarea
                {...form.register("primaryAddress")}
                className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                placeholder="123 Example Street, City, Postcode"
              />
            </Field>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900"
                  {...form.register("dogAtDifferentAddress")}
                />
                <span>Is the dog kept at a different address?</span>
              </label>
              {form.watch("dogAtDifferentAddress") && (
                <Field
                  label="Secondary address"
                  error={form.formState.errors.secondaryAddress?.message}
                >
                  <textarea
                    {...form.register("secondaryAddress")}
                    className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                    placeholder="Where your dog is usually kept"
                  />
                </Field>
              )}
            </div>
          </div>
        )}

        {step === "pet" && (
          <div className="space-y-4">
            <Field
              label="Pet name"
              error={form.formState.errors.petName?.message}
            >
              <Input {...form.register("petName")} placeholder="Luna" />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Pet type"
                error={form.formState.errors.petType?.message}
              >
                <select
                  className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-50"
                  {...form.register("petType")}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field
                label="Breed"
                error={form.formState.errors.breed?.message}
              >
                <Input {...form.register("breed")} placeholder="Mixed" />
              </Field>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            <div className="space-y-4 text-sm">
              <p className="text-slate-300">
                Review your application details and enter payment information to
                complete your registration.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ReviewRow
                  label="Applicant"
                  value={`${form.getValues(
                    "applicantFirstName"
                  )} ${form.getValues("applicantLastName")}`}
                />
                <ReviewRow label="Email" value={form.getValues("email")} />
                <ReviewRow label="Phone" value={form.getValues("phone")} />
                <ReviewRow label="Pet name" value={form.getValues("petName")} />
                <ReviewRow label="Pet type" value={form.getValues("petType")} />
                <ReviewRow label="Breed" value={form.getValues("breed")} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Cardholder name">
                  <Input placeholder="Jane Doe" />
                </Field>
                <Field label="Card number">
                  <Input placeholder="1234 5678 9012 3456" />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Expiry date (MM/YY)">
                  <Input placeholder="12/34" />
                </Field>
                <Field label="CVV">
                  <Input placeholder="123" />
                </Field>
              </div>
              <Field label="Billing address">
                <textarea
                  className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                  placeholder="Billing address (or same as residential)"
                />
              </Field>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Registration fee</span>
                  <span className="font-medium text-slate-50">£50.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              We&apos;ve sent a 6-digit verification code to your contact
              details. Enter it below to confirm your identity.
            </p>
            <div className="max-w-xs">
              <Field label="OTP code">
                <Input
                  value={otpCode}
                  maxLength={6}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                />
              </Field>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (step === "pet") goBack("owner");
              else if (step === "payment") goBack("pet");
              else if (step === "verify") goBack("payment");
            }}
            disabled={step === "owner" || loading}
          >
            Back
          </Button>

          {step !== "verify" && (
            <Button
              type={step === "payment" ? "submit" : "button"}
              onClick={
                step === "payment"
                  ? undefined
                  : () => {
                      if (step === "owner") goNext("pet");
                      else if (step === "pet") goNext("payment");
                    }
              }
              disabled={loading}
            >
              {step === "owner"
                ? "Verify identity"
                : step === "pet"
                ? "Next: Payment"
                : "Complete registration"}
            </Button>
          )}

          {step === "verify" && (
            <Button type="button" onClick={handleVerifyOtp} disabled={loading}>
              Verify code
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

const StepLabel: React.FC<{
  state: "completed" | "active" | "upcoming";
  label: string;
  index: number;
}> = ({ state, label, index }) => {
  const isActive = state === "active";
  const isCompleted = state === "completed";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
          isActive || isCompleted
            ? "bg-slate-50 text-slate-900"
            : "bg-slate-800 text-slate-400"
        }`}
      >
        {index}
      </div>
      <span
        className={`text-xs uppercase tracking-wide ${
          isActive || isCompleted ? "text-slate-50" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const Stepper: React.FC<{ current: Step }> = ({ current }) => {
  const stage: "owner" | "pet" | "payment" =
    current === "owner" ? "owner" : current === "pet" ? "pet" : "payment";

  const steps: { id: "owner" | "pet" | "payment"; label: string }[] = [
    { id: "owner", label: "Owner" },
    { id: "pet", label: "Pet" },
    { id: "payment", label: "Payment" },
  ];

  const getState = (
    id: "owner" | "pet" | "payment"
  ): "completed" | "active" | "upcoming" => {
    if (id === stage) return "active";
    if (stage === "pet" && id === "owner") return "completed";
    if (stage === "payment" && (id === "owner" || id === "pet"))
      return "completed";
    return "upcoming";
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <StepLabel state={getState(s.id)} label={s.label} index={idx + 1} />
          {idx < steps.length - 1 && (
            <div className="h-px flex-1 bg-gradient-to-r from-slate-700/40 to-slate-700/0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <label className="block text-sm">
    <span className="mb-1 block text-slate-200">{label}</span>
    {children}
    {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
  </label>
);

const ReviewRow: React.FC<{ label: string; value: string | undefined }> = ({
  label,
  value,
}) => (
  <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
    <div className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </div>
    <div className="mt-1 text-sm text-slate-50">{value}</div>
  </div>
);


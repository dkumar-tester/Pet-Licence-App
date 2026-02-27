import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Home,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  Heart,
  Stethoscope,
  DollarSign,
  CreditCard,
  Lock,
  Calendar,
  ChevronRight,
  Hash,
  Activity,
  Droplet,
  Sparkles
} from "lucide-react";
import {
  submitApplication,
  verifyOtp,
  sendOtp,
  SubmitApplicationRequest,
} from "../lib/publicApi";
import { cn } from "../lib/utils";

const petApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  primaryAddress: z.string().min(1, "Address is required"),
  dogAtDifferentAddress: z.boolean().optional(),
  secondaryAddress: z.string().optional(),
  petName: z.string().min(1, "Pet name is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().optional(),
  color: z.string().optional(),
  sex: z.string().optional(),
  hairLength: z.string().optional(),
  spayedNeutered: z.boolean().optional(),
  clinicName: z.string().optional(),
  vetName: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof petApplicationSchema>;

type Step = "owner" | "pet" | "payment" | "verify";

export const ApplyPage: React.FC = () => {
  const [step, setStep] = useState<Step>("owner");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const isValid = await form.trigger([
      "fullName", "primaryAddress", "dogAtDifferentAddress", "secondaryAddress", "email", "phone"
    ]);
    if (!isValid) return;

    try {
      setLoading(true);
      setError(null);
      await sendOtp(form.getValues("email"));
      setStep("verify");
    } catch (e: any) {
      setError(e.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(petApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      primaryAddress: "",
      dogAtDifferentAddress: false,
      secondaryAddress: "",
      petName: "",
      breed: "",
      age: "Select",
      color: "Select",
      sex: "Male",
      hairLength: "Short",
      spayedNeutered: false,
      clinicName: "",
      vetName: "",
    },
  });

  const handleSubmit = async (values: ApplicationFormValues) => {
    if (step !== "payment") return;

    try {
      setLoading(true);
      setError(null);

      const nameParts = values.fullName.trim().split(" ");
      const parsedAge = values.age === "1 Year" ? 1 : values.age === "2 Years" ? 2 : values.age === "3+ Years" ? 3 : null;

      const req: SubmitApplicationRequest = {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "Unknown",
        email: values.email || "",
        phone: values.phone || "",
        primaryAddress: values.primaryAddress || "",
        secondaryAddress: values.dogAtDifferentAddress ? (values.secondaryAddress || "") : null,
        petName: values.petName || "",
        petType: "Dog", // Hardcoded for this wizard flow
        breed: values.breed || "",
        age: parsedAge || 0,
        color: values.color !== "Select" ? (values.color || "") : "",
        sex: values.sex || "",
        hairLength: values.hairLength || "",
        spayedNeutered: values.spayedNeutered || false,
        clinicName: values.clinicName || "",
        vetName: values.vetName || "",
      };

      const result = await submitApplication(req);
      navigate(`/success/${result.applicationId}`);

    } catch (e: any) {
      setError(e.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      await verifyOtp(form.getValues("email"), otpCode);
      setStep("pet");
    } catch (e: any) {
      setError(e.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f0f4ff] via-[#fdfdff] to-[#e6faf5] py-12 px-4 flex flex-col items-center font-sans text-slate-800">

      {/* Stepper Component Matches the Top Header */}
      <div className="mb-8 w-full max-w-sm">
        <Stepper current={step} />
      </div>

      <div className="w-full max-w-[440px] rounded-[24px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">

        {/* Step 1: Owner */}
        {step === "owner" && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-[#6c3bed] p-2 text-white shadow-sm">
                  <User size={20} className="stroke-[2.5]" />
                </div>
                <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Owner Registration</h1>
              </div>
              <p className="text-[13px] text-slate-500">
                Please provide your information to register your pet
              </p>
            </div>

            <form className="space-y-4">
              <Field
                icon={<User size={16} className="text-[#a085fe]" />}
                label="Full Name"
                error={form.formState.errors.fullName?.message}
              >
                <input
                  {...form.register("fullName")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c3bed] focus:ring-1 focus:ring-[#6c3bed]"
                  placeholder="John Doe"
                />
              </Field>

              <Field
                icon={<Home size={16} className="text-[#719dfc]" />}
                label="Primary Residential Address"
                error={form.formState.errors.primaryAddress?.message}
              >
                <input
                  {...form.register("primaryAddress")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c3bed] focus:ring-1 focus:ring-[#6c3bed]"
                  placeholder="123 Main St, City, State, ZIP"
                />
              </Field>

              <label className="flex items-center gap-2 rounded-lg bg-[#f0f5fc] px-4 py-3 cursor-pointer group hover:bg-[#eaf1fa] transition-colors border border-transparent">
                <input
                  type="checkbox"
                  {...form.register("dogAtDifferentAddress")}
                  className="h-4 w-4 rounded border-slate-300 text-[#6c3bed] focus:ring-[#6c3bed]"
                />
                <MapPin size={16} className="text-[#0ea5e9]" />
                <span className="text-[13px] font-medium text-slate-700 select-none">
                  Is the dog kept at a different address?
                </span>
              </label>

              {form.watch("dogAtDifferentAddress") && (
                <Field
                  icon={<MapPin size={16} className="text-[#0ea5e9]" />}
                  label="Secondary Address"
                  error={form.formState.errors.secondaryAddress?.message}
                >
                  <input
                    {...form.register("secondaryAddress")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c3bed] focus:ring-1 focus:ring-[#6c3bed]"
                    placeholder="456 Oak Ave, City, State, ZIP"
                  />
                </Field>
              )}

              <Field
                icon={<Mail size={16} className="text-[#f472b6]" />}
                label="Email Address"
                error={form.formState.errors.email?.message}
              >
                <input
                  type="email"
                  {...form.register("email")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c3bed] focus:ring-1 focus:ring-[#6c3bed]"
                  placeholder="john.doe@example.com"
                />
              </Field>

              <Field
                icon={<Phone size={16} className="text-[#10b981]" />}
                label="Phone Number"
                error={form.formState.errors.phone?.message}
              >
                <input
                  {...form.register("phone")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c3bed] focus:ring-1 focus:ring-[#6c3bed]"
                  placeholder="(555) 123-4567"
                />
              </Field>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6c3bed] py-3 text-[14px] font-semibold text-white shadow-md shadow-[#6c3bed]/30 transition-all hover:bg-[#5b2bd4] hover:shadow-lg hover:shadow-[#6c3bed]/30 active:scale-[0.98] disabled:opacity-70"
              >
                <ShieldCheck size={18} />
                Verify Identity
              </button>
            </form>
          </>
        )}

        {/* Step 2: Pet */}
        {step === "pet" && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-[#f97316] p-2 text-white shadow-sm">
                  <Activity size={20} className="stroke-[2.5]" />
                </div>
                <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Tell us about your dog</h1>
              </div>
              <p className="text-[13px] text-slate-500">
                Help us create your pet's profile
              </p>
            </div>

            <form className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="flex h-[100px] w-[100px] cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-[#fbbf24] bg-[#fffbeb] text-[#f59e0b] hover:bg-[#fef3c7] transition-colors">
                  <Camera size={24} />
                  <span className="mt-1 text-[11px] font-semibold">Add Photo</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field icon={<User size={14} className="text-[#fbbf24]" />} label="Dog's Name" error={form.formState.errors.petName?.message}>
                  <input {...form.register("petName")} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] outline-none focus:border-[#f97316]" placeholder="Max" />
                </Field>
                <Field icon={<User size={14} className="text-[#fbbf24]" />} label="Breed" error={form.formState.errors.breed?.message}>
                  <input {...form.register("breed")} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] outline-none focus:border-[#f97316]" placeholder="Golden Retriever" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field icon={<Calendar size={14} className="text-[#60a5fa]" />} label="Age">
                  <select {...form.register("age")} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] bg-white outline-none focus:border-[#f97316]">
                    <option>Select</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3+ Years</option>
                  </select>
                </Field>
                <Field icon={<Droplet size={14} className="text-[#c084fc]" />} label="Color">
                  <select {...form.register("color")} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] bg-white outline-none focus:border-[#f97316]">
                    <option>Select</option>
                    <option>Golden</option>
                    <option>Black</option>
                    <option>Brown</option>
                  </select>
                </Field>
              </div>

              <Field icon={<Heart size={14} className="text-[#f472b6]" />} label="Sex">
                <div className="flex gap-3">
                  <label className="flex flex-1 cursor-pointer justify-center items-center gap-2 rounded-lg border border-slate-200 py-2.5 text-[14px]">
                    <input type="radio" value="Male" {...form.register("sex")} className="text-[#f97316] focus:ring-[#f97316]" />
                    <span>Male</span>
                  </label>
                  <label className="flex flex-1 cursor-pointer justify-center items-center gap-2 rounded-lg border border-slate-200 py-2.5 text-[14px]">
                    <input type="radio" value="Female" {...form.register("sex")} className="text-[#f97316] focus:ring-[#f97316]" />
                    <span>Female</span>
                  </label>
                </div>
              </Field>

              <Field icon={<Activity size={14} className="text-[#34d399]" />} label="Hair Length">
                <div className="flex gap-2">
                  <Controller
                    name="hairLength"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        {["Short", "Med", "Long"].map((len) => (
                          <button
                            key={len}
                            type="button"
                            onClick={() => field.onChange(len)}
                            className={cn(
                              "flex-1 rounded-full border py-2 text-[13px] font-medium transition-colors",
                              field.value === len
                                ? "border-[#f97316] text-[#f97316] bg-[#fff7ed]"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {len}
                          </button>
                        ))}
                      </>
                    )}
                  />
                </div>
              </Field>

              <div className="flex items-center justify-between rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] px-4 py-3 mt-2">
                <div className="flex items-center gap-2 text-[#059669]">
                  <Heart size={16} />
                  <span className="text-[14px] font-semibold">Spayed/Neutered</span>
                </div>
                <Controller
                  name="spayedNeutered"
                  control={form.control}
                  render={({ field }) => (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        field.value ? "bg-[#059669]" : "bg-slate-300"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          field.value ? "translate-x-5" : "translate-x-0.5"
                        )}
                      />
                    </button>
                  )}
                />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-4 text-[#0284c7]">
                  <div className="rounded-full bg-[#e0f2fe] p-1.5">
                    <Stethoscope size={16} />
                  </div>
                  <span className="text-[14px] font-bold">Veterinary Information</span>
                </div>

                <div className="space-y-3">
                  <Field icon={<Home size={14} className="text-[#38bdf8]" />} label="Clinic Name">
                    <input {...form.register("clinicName")} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-[#f97316]" placeholder="Happy Paws Veterinary Clinic" />
                  </Field>
                  <Field icon={<User size={14} className="text-[#38bdf8]" />} label="Vet Name">
                    <input {...form.register("vetName")} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-[#f97316]" placeholder="Dr. Sarah Johnson" />
                  </Field>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger([
                    "petName",
                    "breed",
                    "age",
                    "color",
                    "sex",
                    "hairLength",
                    "spayedNeutered",
                    "clinicName",
                    "vetName",
                  ]);
                  if (isValid) {
                    setStep("payment");
                  }
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ea580c] py-3 text-[14px] font-semibold text-white shadow-md shadow-[#ea580c]/30 transition-all hover:bg-[#c2410c] hover:shadow-lg active:scale-[0.98]"
              >
                Proceed to Payment
                <ChevronRight size={18} />
              </button>
            </form>
          </>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-[#10b981] p-2 text-white shadow-sm">
                  <DollarSign size={20} className="stroke-[2.5]" />
                </div>
                <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Registration Fee</h1>
              </div>
              <p className="text-[13px] text-slate-500">
                Complete your payment to finalize registration
              </p>
            </div>

            <form className="space-y-5">
              <div className="relative overflow-hidden rounded-xl border border-[#a7f3d0] bg-gradient-to-r from-[#ecfdf5] to-[#f0fdf4] p-5 shadow-sm">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#10b981]/10 blur-xl"></div>
                <div className="flex items-center gap-1.5 text-[#059669] mb-1">
                  <Sparkles size={14} className="fill-current" />
                  <span className="text-[13px] font-bold">Annual Pet License</span>
                </div>
                <div className="flex items-baseline text-[#059669]">
                  <span className="text-3xl font-bold tracking-tight">$15</span>
                  <span className="text-sm font-semibold ml-0.5">.00</span>
                </div>
                <p className="mt-1 text-[11px] text-[#059669]/80 font-medium">Valid for 12 months from registration date</p>
              </div>

              <Field icon={<CreditCard size={14} className="text-[#a78bfa]" />} label="Cardholder Name">
                <input className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] uppercase outline-none focus:border-[#10b981]" placeholder="JOHN DOE" defaultValue="JOHN DOE" />
              </Field>

              <Field icon={<CreditCard size={14} className="text-[#60a5fa]" />} label="Card Number">
                <div className="relative">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] outline-none focus:border-[#10b981] tracking-widest font-mono" placeholder="1234 5678 9012 3456" />
                  <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field icon={<Calendar size={14} className="text-[#fb923c]" />} label="Expiry (MM/YY)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] outline-none focus:border-[#10b981]" placeholder="12/26" />
                </Field>
                <Field icon={<Lock size={14} className="text-[#34d399]" />} label="CVC">
                  <input type="password" maxLength={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] outline-none focus:border-[#10b981] tracking-widest" placeholder="123" />
                </Field>
              </div>

              <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4 text-[12px]">
                <div className="flex items-center gap-2 mb-3 text-[#10b981]">
                  <div className="rounded-full bg-[#10b981] p-0.5 text-white">
                    <ShieldCheck size={12} />
                  </div>
                  <span className="font-semibold text-slate-700">Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="h-5 w-8 rounded bg-[#1e40af] flex items-center justify-center text-[7px] font-bold text-white">VISA</div>
                    <div className="h-5 w-8 rounded bg-[#ea580c] flex items-center justify-center text-[7px] font-bold text-white">MC</div>
                    <div className="h-5 w-8 rounded bg-[#0284c7] flex items-center justify-center text-[7px] font-bold text-white">AMEX</div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <Lock size={10} />
                    256-bit SSL Encrypted
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] py-3 text-[15px] font-bold text-white shadow-md shadow-[#059669]/30 transition-all hover:bg-[#047857] hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
              >
                <Lock size={16} className="mb-0.5" />
                {loading ? "Processing..." : "Pay $15.00"}
              </button>
            </form>
          </>
        )}

        {/* Step 4: Verify */}
        {step === "verify" && (
          <div className="space-y-4 text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e0e7ff] text-[#4f46e5]">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-bold">Secure Identity Verification</h2>
            <p className="text-sm text-slate-500">
              We&apos;ve sent a 6-digit verification code to your contact details. Enter it below to confirm your identity.
            </p>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <div className="pt-4">
              <input
                value={otpCode}
                maxLength={6}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-48 rounded-lg border border-slate-200 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-[#4f46e5] font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otpCode.length !== 6}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4f46e5] py-3 text-[15px] font-bold text-white shadow-md transition-all hover:bg-[#4338ca] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* Stepper Shared Components */

const Stepper: React.FC<{ current: Step }> = ({ current }) => {
  const steps = [
    { id: "owner", label: "Owner", index: 1 },
    { id: "pet", label: "Pet", index: 2 },
    { id: "payment", label: "Payment", index: 3 },
  ] as const;

  const currentIdx = steps.findIndex(s => s.id === (current === "verify" ? "payment" : current));

  return (
    <div className="flex items-center justify-center">
      {steps.map((stage, i) => {
        const isActiveOrCompleted = i <= currentIdx;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-300",
                  isActiveOrCompleted
                    ? "bg-[#6c3bed] text-white shadow-md shadow-[#6c3bed]/40"
                    : "bg-white text-slate-400 border-2 border-slate-200"
                )}
              >
                {stage.index}
              </div>
              <span
                className={cn(
                  "mt-2 text-[11px] font-semibold tracking-wide",
                  isActiveOrCompleted ? "text-[#6c3bed]" : "text-slate-400"
                )}
              >
                {stage.label}
              </span>
            </div>
            {!isLast && (
              <div className="mx-2 mb-5 h-[2px] w-12 rounded-full overflow-hidden bg-slate-200">
                <div
                  className="h-full bg-[#6c3bed] transition-all duration-500"
                  style={{ width: i < currentIdx ? "100%" : "0%" }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Field: React.FC<{
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}> = ({ label, icon, error, children }) => (
  <label className="block text-sm">
    <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
      {icon}
      <span>{label}</span>
    </div>
    {children}
    {error && <p className="mt-1 text-[11px] font-medium text-red-500">{error}</p>}
  </label>
);

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "react-router-dom";

export const SuccessPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const licenceNumber = applicationId ?? "";
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify-licence/${licenceNumber}`
      : `https://example.com/verify-licence/${licenceNumber}`;

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-8 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Payment successful
      </h1>
      <p className="text-sm text-slate-300">
        Your pet&apos;s licence is now active. Save or screenshot this QR code
        to quickly verify the licence in the future.
      </p>
      <div className="flex justify-center">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <QRCodeSVG value={url} size={200} />
        </div>
      </div>
      <div className="space-y-1 text-sm text-slate-300">
        <p>
          <span className="font-medium text-slate-100">
            Provisional licence:
          </span>{" "}
          {licenceNumber}
        </p>
        <p className="text-xs text-slate-400">
          Verification URL:{" "}
          <span className="font-mono text-slate-300">{url}</span>
        </p>
      </div>
    </div>
  );
};


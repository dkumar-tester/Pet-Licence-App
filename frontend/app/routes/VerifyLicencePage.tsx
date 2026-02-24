import * as React from "react";
import { useParams } from "react-router-dom";

export const VerifyLicencePage: React.FC = () => {
  const { licenceNumber } = useParams<{ licenceNumber: string }>();

  // TODO: call backend verification endpoint once implemented

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        Licence verification
      </h1>
      <p className="mb-4 text-sm text-slate-300">
        Verifying provisional licence{" "}
        <span className="font-mono">{licenceNumber}</span>.
      </p>
      <p className="text-sm text-slate-400">
        Once the backend verification endpoint is available, this page will
        show the pet&apos;s status and key licence details.
      </p>
    </div>
  );
};


import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";

type ApplicationDetail = {
  id: string;
  applicantFirstName: string;
  applicantLastName: string;
  email: string;
  phone: string;
  petName: string;
  petType: string;
  breed: string;
  status: string;
  createdAt: string;
};

export const AdminApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/applications/${id}`);
        if (!res.ok) throw new Error("Failed to load application");
        setDetail(await res.json());
      } catch (e: any) {
        setError(e.message ?? "Failed to load application");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const transition = async (kind: "review" | "approve" | "reject") => {
    if (!id) return;
    try {
      setActionLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/applications/${id}/${kind}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to update application");
      const updated = await res.json();
      setDetail(updated);
    } catch (e: any) {
      setError(e.message ?? "Failed to update application");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !detail) {
    return <div className="text-sm text-slate-300">Loading…</div>;
  }

  if (error && !detail) {
    return (
      <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (!detail) {
    return null;
  }

  const applicantName = `${detail.applicantFirstName} ${detail.applicantLastName}`;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Application detail
        </h1>
        <p className="text-sm text-slate-300">
          {applicantName} — {detail.petName} ({detail.petType})
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard title="Applicant">
          <DetailRow label="Name" value={applicantName} />
          <DetailRow label="Email" value={detail.email} />
          <DetailRow label="Phone" value={detail.phone} />
        </DetailCard>
        <DetailCard title="Pet">
          <DetailRow label="Name" value={detail.petName} />
          <DetailRow label="Type" value={detail.petType} />
          <DetailRow label="Breed" value={detail.breed} />
        </DetailCard>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
        <div className="space-y-1 text-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Status
          </div>
          <div className="text-base font-semibold text-slate-50">
            {detail.status}
          </div>
          <div className="text-xs text-slate-400">
            Created {new Date(detail.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={actionLoading}
            onClick={() => transition("review")}
          >
            Move to review
          </Button>
          <Button
            variant="outline"
            disabled={actionLoading}
            onClick={() => transition("reject")}
          >
            Reject
          </Button>
          <Button disabled={actionLoading} onClick={() => transition("approve")}>
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

const DetailCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm">
    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
      {title}
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-4">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-50">{value}</span>
  </div>
);


import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

type AdminApplicationListItem = {
  id: string;
  applicantName: string;
  petName: string;
  status: string;
  createdAt: string;
};

export const AdminApplicationsPage: React.FC = () => {
  const [items, setItems] = useState<AdminApplicationListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = statusFilter ? `?status=${statusFilter}` : "";
        const res = await fetch(`/api/admin/applications${params}`);
        if (!res.ok) throw new Error("Failed to load applications");
        const data = (await res.json()) as AdminApplicationListItem[];
        setItems(data);
      } catch (e: any) {
        setError(e.message ?? "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Applications
          </h1>
          <p className="text-sm text-slate-300">
            Review, approve, or reject incoming pet licence applications.
          </p>
        </div>
        <select
          className="h-9 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-50"
          value={statusFilter ?? ""}
          onChange={(e) =>
            setStatusFilter(e.target.value || undefined)
          }
        >
          <option value="">All statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="UnderReview">Under review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Paid">Paid</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-950/60">
            <tr>
              <Th>Applicant</Th>
              <Th>Pet</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {items.map((app) => (
              <tr key={app.id} className="hover:bg-slate-900/60">
                <Td>{app.applicantName}</Td>
                <Td>{app.petName}</Td>
                <Td>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs capitalize">
                    {app.status.toLowerCase()}
                  </span>
                </Td>
                <Td>{new Date(app.createdAt).toLocaleString()}</Td>
                <Td className="text-right">
                  <Link
                    to={`/admin/applications/${app.id}`}
                    className="text-xs text-slate-200 underline-offset-2 hover:underline"
                  >
                    Open
                  </Link>
                </Td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <Td colSpan={5} className="py-6 text-center text-slate-400">
                  No applications yet.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Th: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => (
  <th
    className={"px-4 py-2 text-left text-xs font-semibold text-slate-300 " + (className ?? "")}
    {...props}
  />
);

const Td: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => (
  <td
    className={"px-4 py-2 align-middle text-sm text-slate-100 " + (className ?? "")}
    {...props}
  />
);


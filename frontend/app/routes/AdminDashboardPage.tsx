import * as React from "react";
import { useEffect, useState } from "react";

type StatusSummaryDto = {
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  paid: number;
  completed: number;
};

type MonthlyMetric = {
  month: string;
  count: number;
};

export const AdminDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<StatusSummaryDto | null>(null);
  const [monthly, setMonthly] = useState<MonthlyMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [summaryRes, monthlyRes] = await Promise.all([
          fetch("/api/admin/analytics/summary"),
          fetch("/api/admin/analytics/monthly"),
        ]);
        if (!summaryRes.ok || !monthlyRes.ok) {
          throw new Error("Failed to load analytics");
        }
        setSummary(await summaryRes.json());
        setMonthly(await monthlyRes.json());
      } catch (e: any) {
        setError(e.message ?? "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Analytics dashboard
        </h1>
        <p className="text-sm text-slate-300">
          Monitor application volume and status breakdown over time.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Submitted"
          value={summary?.submitted ?? 0}
          tone="neutral"
        />
        <MetricCard
          label="Under review"
          value={summary?.underReview ?? 0}
          tone="accent"
        />
        <MetricCard
          label="Approved"
          value={summary?.approved ?? 0}
          tone="positive"
        />
        <MetricCard
          label="Rejected"
          value={summary?.rejected ?? 0}
          tone="negative"
        />
        <MetricCard
          label="Paid"
          value={summary?.paid ?? 0}
          tone="neutral"
        />
        <MetricCard
          label="Completed"
          value={summary?.completed ?? 0}
          tone="positive"
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">
          Monthly applications
        </h2>
        <div className="flex items-end gap-2">
          {monthly.map((m) => (
            <div
              key={m.month}
              className="flex flex-1 flex-col items-center gap-1 text-xs"
            >
              <div
                className="w-full rounded-t-md bg-slate-400/70"
                style={{
                  height: `${Math.max(8, m.count * 6)}px`,
                }}
              />
              <span className="text-slate-400">{m.month}</span>
              <span className="text-slate-200">{m.count}</span>
            </div>
          ))}
          {monthly.length === 0 && !loading && (
            <div className="py-8 text-sm text-slate-400">
              No data yet. Data will appear once applications start flowing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: number;
  tone: "neutral" | "positive" | "negative" | "accent";
}> = ({ label, value, tone }) => {
  const color =
    tone === "positive"
      ? "from-emerald-400/40"
      : tone === "negative"
      ? "from-red-400/40"
      : tone === "accent"
      ? "from-sky-400/40"
      : "from-slate-400/40";

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-4">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${color} to-transparent opacity-40`}
      />
      <div className="relative space-y-1">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </div>
        <div className="text-2xl font-semibold text-slate-50">{value}</div>
      </div>
    </div>
  );
};


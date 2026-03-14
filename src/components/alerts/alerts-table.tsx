import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

import type { AlertListItem } from "@/services/alerts";

import { AlertBadge } from "./alert-badge";

type AlertsTableProps = {
  alerts: AlertListItem[];
};

export function AlertsTable({ alerts }: AlertsTableProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.035] p-6 text-sm leading-6 text-slate-400">
        No alerts match the current filters. Change the status or severity
        filters, or generate more alerts from the dashboard.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur">
      <div className="grid grid-cols-[1.45fr_1fr_0.8fr_0.8fr_0.6fr_0.8fr] gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
        <span>Alert</span>
        <span>Source</span>
        <span>Severity</span>
        <span>Status</span>
        <span>Risk</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-white/8">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className="grid grid-cols-[1.45fr_1fr_0.8fr_0.8fr_0.6fr_0.8fr] gap-3 px-5 py-4 text-sm"
          >
            <div>
              <p className="font-medium text-white">{alert.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                {alert.reason}
              </p>
              <div className="mt-2">
                <AlertBadge
                  value={alert.blocked ? "blocked" : "clear"}
                  kind="block"
                />
              </div>
            </div>
            <div>
              <p className="text-white">{alert.sourceNumber}</p>
              <p className="mt-1 text-xs text-slate-400">
                {formatDistanceToNowStrict(new Date(alert.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center">
              <AlertBadge value={alert.severity} kind="severity" />
            </div>
            <div className="flex items-center">
              <AlertBadge value={alert.status} kind="status" />
            </div>
            <div className="flex items-center text-lg font-semibold text-white">
              {Math.round(alert.riskScore)}
            </div>
            <div className="flex items-center">
              <Link
                href={`/alerts/${alert.id}`}
                className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/18"
              >
                Investigate
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

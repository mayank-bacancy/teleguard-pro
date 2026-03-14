import { AlertBadge } from "@/components/alerts/alert-badge";
import type { RevenueAssuranceSnapshot } from "@/services/revenue-assurance";

export function ExposureAlertsTable({
  alerts,
}: {
  alerts: RevenueAssuranceSnapshot["topExposureAlerts"];
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur">
      <div className="flex items-end justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
            Executive watchlist
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Highest financial exposure alerts
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Ranked by estimated exposure
        </p>
      </div>

      <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr] gap-3 border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
        <span>Alert</span>
        <span>Source</span>
        <span>Severity</span>
        <span>Exposure</span>
      </div>
      <div className="divide-y divide-white/8">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr] gap-3 px-5 py-4 text-sm"
          >
            <div className="font-medium text-white">{alert.title}</div>
            <div className="text-slate-300">{alert.sourceNumber}</div>
            <div className="flex items-center">
              <AlertBadge value={alert.severity} kind="severity" />
            </div>
            <div className="font-semibold text-white">
              {formatCurrency(alert.exposure)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

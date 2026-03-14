import { AlertBadge } from "@/components/alerts/alert-badge";
import type { NetworkSecuritySnapshot } from "@/services/network-security";

export function RouteRiskTable({
  routes,
}: {
  routes: NetworkSecuritySnapshot["routeRisks"];
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur">
      <div className="flex items-end justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
            Route intelligence
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            High-risk traffic corridors
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Ranked by suspicious concentration and average risk
        </p>
      </div>

      <div className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.7fr_0.7fr] gap-3 border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
        <span>Route</span>
        <span>Risk level</span>
        <span>Calls</span>
        <span>Suspicious</span>
        <span>Avg risk</span>
        <span>Profile</span>
      </div>
      <div className="divide-y divide-white/8">
        {routes.map((route) => (
          <article
            key={route.id}
            className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.7fr_0.7fr] gap-3 px-5 py-4 text-sm"
          >
            <div>
              <p className="font-medium text-white">
                {route.sourceCountry} to {route.destinationCountry}
              </p>
              <p className="mt-1 text-xs text-slate-400">{route.id}</p>
            </div>
            <div className="flex items-center">
              <AlertBadge
                value={mapRiskToSeverity(route.riskLevel)}
                kind="severity"
              />
            </div>
            <div className="text-slate-300">{route.totalCalls}</div>
            <div className="text-slate-300">{route.suspiciousCalls}</div>
            <div className="text-slate-300">{route.averageRisk.toFixed(1)}</div>
            <div className="text-slate-400">
              {route.sourceCountry === route.destinationCountry
                ? "Domestic"
                : "Cross-border"}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function mapRiskToSeverity(level: string) {
  switch (level) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    default:
      return "medium";
  }
}

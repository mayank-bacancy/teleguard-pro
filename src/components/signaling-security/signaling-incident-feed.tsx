import { formatDistanceToNowStrict } from "date-fns";

import { AlertBadge } from "@/components/alerts/alert-badge";
import type { SignalingSecuritySnapshot } from "@/services/signaling-security";

export function SignalingIncidentFeed({
  incidents,
}: {
  incidents: SignalingSecuritySnapshot["incidents"];
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        Incident feed
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        SS7 and signaling anomalies
      </h2>
      <div className="mt-5 space-y-4">
        {incidents.map((incident) => (
          <article
            key={incident.id}
            className="rounded-[24px] border border-white/10 bg-black/10 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-white">{incident.incidentType}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {incident.sourceNetwork} targeting {incident.targetElement}
                </p>
              </div>
              <div className="flex gap-2">
                <AlertBadge value={incident.severity} kind="severity" />
                <AlertBadge value={mapStatus(incident.status)} kind="status" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {incident.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>
                {incident.relatedAlertId
                  ? `Linked alert: ${incident.relatedAlertId}`
                  : "No linked alert"}
              </span>
              <span>
                {formatDistanceToNowStrict(new Date(incident.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function mapStatus(status: string) {
  switch (status) {
    case "contained":
      return "resolved";
    case "investigating":
      return "acknowledged";
    default:
      return "open";
  }
}

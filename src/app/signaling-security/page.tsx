import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { RealtimeControl } from "@/components/realtime/realtime-control";
import { ResponseContextPanel } from "@/components/signaling-security/response-context-panel";
import { SignalingIncidentFeed } from "@/components/signaling-security/signaling-incident-feed";
import { SignalingOverviewCard } from "@/components/signaling-security/signaling-overview-card";
import { SignalingRiskPanel } from "@/components/signaling-security/signaling-risk-panel";
import { createClient } from "@/lib/supabase/server";
import { getSignalingSecuritySnapshot } from "@/services/signaling-security";

export default async function SignalingSecurityPage() {
  const supabase = await createClient();
  const snapshot = await getSignalingSecuritySnapshot(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Signaling Security
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                SS7 and protocol anomaly simulation
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                This surface extends the fraud platform into telecom protocol
                security, showing how signaling-plane anomalies can be monitored,
                triaged, and connected back to the same analyst workflow.
              </p>
            </div>
            <ControlShellNav current="signaling-security" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SignalingOverviewCard
            label="Signaling incidents"
            value={String(snapshot.summary.totalIncidents)}
          />
          <SignalingOverviewCard
            label="Critical"
            value={String(snapshot.summary.criticalIncidents)}
          />
          <SignalingOverviewCard
            label="Active anomalies"
            value={String(snapshot.summary.activeAnomalies)}
          />
          <SignalingOverviewCard
            label="Location abuse"
            value={String(snapshot.summary.suspiciousLocationRequests)}
          />
        </section>

        <section className="mt-6">
          <RealtimeControl surface="signaling security" compact />
        </section>

        <section className="mt-6">
          <ResponseContextPanel signals={snapshot.responseSignals} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SignalingIncidentFeed incidents={snapshot.incidents} />
          <div className="grid gap-6">
            <SignalingRiskPanel
              eyebrow="Severity mix"
              title="Protocol incident severity"
              rows={snapshot.severityMix}
            />
            <SignalingRiskPanel
              eyebrow="Target elements"
              title="Most targeted telecom nodes"
              rows={snapshot.targetElements}
            />
            <SignalingRiskPanel
              eyebrow="Suspicious networks"
              title="Top suspicious source networks"
              rows={snapshot.suspiciousNetworks}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

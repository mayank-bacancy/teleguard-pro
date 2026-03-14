import { RealtimeControl } from "@/components/realtime/realtime-control";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { StatusMetricCard } from "@/components/control-center/status-metric-card";
import { RouteRiskTable } from "@/components/network-security/route-risk-table";
import { SecuritySignalsPanel } from "@/components/network-security/security-signals-panel";
import { TopologyMap } from "@/components/network-security/topology-map";
import { createClient } from "@/lib/supabase/server";
import { getNetworkSecuritySnapshot } from "@/services/network-security";

export default async function NetworkSecurityPage() {
  const supabase = await createClient();
  const snapshot = await getNetworkSecuritySnapshot(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Telecom Security Surface
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Network security and route intelligence
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                This surface reframes the fraud platform around telecom routes,
                cross-border risk, and suspicious network corridors so the demo
                feels domain-specific rather than generic.
              </p>
            </div>
            <ControlShellNav current="network-security" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusMetricCard
            label="Observed Routes"
            value={String(snapshot.summary.totalRoutes)}
          />
          <StatusMetricCard
            label="High-Risk Routes"
            value={String(snapshot.summary.highRiskRoutes)}
          />
          <StatusMetricCard
            label="Suspicious Traffic"
            value={`${snapshot.summary.suspiciousTrafficShare.toFixed(1)}%`}
          />
          <StatusMetricCard
            label="Cross-Border Risk"
            value={String(snapshot.summary.internationalRiskPairs)}
          />
        </section>

        <section className="mt-6">
          <RealtimeControl surface="network security" compact />
        </section>

        <section className="mt-6">
          <SecuritySignalsPanel
            signals={snapshot.securitySignals}
            scenarios={snapshot.scenarioSignals}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <TopologyMap topology={snapshot.topology} />
          <RouteRiskTable routes={snapshot.routeRisks.slice(0, 10)} />
        </section>
      </div>
    </main>
  );
}

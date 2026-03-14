import { AnalyticsBarChart } from "@/components/analytics/analytics-bar-chart";
import { AnalyticsKpiCard } from "@/components/analytics/analytics-kpi-card";
import { AnalyticsTrendChart } from "@/components/analytics/analytics-trend-chart";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { RealtimeControl } from "@/components/realtime/realtime-control";
import { createClient } from "@/lib/supabase/server";
import { getAnalyticsSnapshot } from "@/services/analytics";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const analytics = await getAnalyticsSnapshot(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Fraud Intelligence Board
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Analytics and historical trends
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                This board connects operational activity to historical movement,
                so judges and operators can see not only what happened, but how
                risk and response changed over time.
              </p>
            </div>
            <ControlShellNav current="analytics" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AnalyticsKpiCard
            label="CDR Volume"
            value={String(analytics.summary.totalCalls)}
            subtext="Total seeded call detail records currently visible in the platform."
          />
          <AnalyticsKpiCard
            label="Suspicious Rate"
            value={`${analytics.summary.suspiciousRate.toFixed(1)}%`}
            subtext="Share of total calls currently flagged by risk thresholds."
          />
          <AnalyticsKpiCard
            label="Alert Load"
            value={String(analytics.summary.totalAlerts)}
            subtext="Total generated incidents across the current fraud workflow."
          />
          <AnalyticsKpiCard
            label="Active Blocks"
            value={String(analytics.summary.activeBlocks)}
            subtext="Numbers still under containment after alert-driven blocking."
          />
          <AnalyticsKpiCard
            label="Average Risk"
            value={analytics.summary.averageRiskScore.toFixed(1)}
            subtext="Average CDR risk score across the loaded traffic history."
          />
        </section>

        <section className="mt-6">
          <RealtimeControl surface="analytics board" compact />
        </section>

        <section className="mt-6">
          <AnalyticsTrendChart data={analytics.trends} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-3">
          <AnalyticsBarChart
            eyebrow="Alert mix"
            title="Alerts by severity"
            data={analytics.severityDistribution}
            color="#fb7185"
          />
          <AnalyticsBarChart
            eyebrow="Fraud patterns"
            title="Suspicious scenarios"
            data={analytics.scenarioDistribution}
            color="#f59e0b"
          />
          <AnalyticsBarChart
            eyebrow="Traffic routes"
            title="Top route pairs"
            data={analytics.routeDistribution}
            color="#38bdf8"
          />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <SignalPanel
            title="Open vs resolved"
            description={`${analytics.summary.openAlerts} open incidents against ${analytics.summary.resolvedAlerts} resolved incidents.`}
          />
          <SignalPanel
            title="Containment coverage"
            description={`${analytics.summary.containmentCoverage.toFixed(1)}% of generated alerts currently map to an active block.`}
          />
          <SignalPanel
            title="Operational reading"
            description="Use this board to explain risk concentration, response pressure, and how current controls are performing."
          />
        </section>
      </div>
    </main>
  );
}

function SignalPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        Performance signal
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}

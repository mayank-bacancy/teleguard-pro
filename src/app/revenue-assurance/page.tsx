import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { RealtimeControl } from "@/components/realtime/realtime-control";
import { ExposureAlertsTable } from "@/components/revenue-assurance/exposure-alerts-table";
import { RevenueImpactTable } from "@/components/revenue-assurance/revenue-impact-table";
import { RevenueKpiCard } from "@/components/revenue-assurance/revenue-kpi-card";
import { createClient } from "@/lib/supabase/server";
import { getRevenueAssuranceSnapshot } from "@/services/revenue-assurance";

export default async function RevenueAssurancePage() {
  const supabase = await createClient();
  const snapshot = await getRevenueAssuranceSnapshot(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Business Impact Layer
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Revenue assurance
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Translate telecom fraud signals into business impact so the demo
                shows not only detection quality, but also why operators should
                care financially.
              </p>
            </div>
            <ControlShellNav current="revenue-assurance" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {snapshot.signalCards.map((card) => (
            <RevenueKpiCard
              key={card.title}
              label={card.title}
              value={card.value}
              description={card.description}
              tone={card.tone}
            />
          ))}
        </section>

        <section className="mt-6">
          <RealtimeControl surface="revenue assurance" compact />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <RevenueImpactTable
            eyebrow="Scenario economics"
            title="Estimated fraud cost by scenario"
            rows={snapshot.scenarioImpact}
          />
          <RevenueImpactTable
            eyebrow="Route exposure"
            title="Estimated route-level exposure"
            rows={snapshot.routeImpact}
          />
        </section>

        <section className="mt-6">
          <ExposureAlertsTable alerts={snapshot.topExposureAlerts} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-4">
          <SignalPanel
            label="Revenue at risk"
            value={formatCurrency(snapshot.summary.revenueAtRisk)}
          />
          <SignalPanel
            label="Protected revenue"
            value={formatCurrency(snapshot.summary.protectedRevenue)}
          />
          <SignalPanel
            label="High-risk traffic share"
            value={`${snapshot.summary.highRiskTrafficShare.toFixed(1)}%`}
          />
          <SignalPanel
            label="Blocked-loss prevention"
            value={formatCurrency(snapshot.summary.blockedLossPrevention)}
          />
        </section>
      </div>
    </main>
  );
}

function SignalPanel({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </article>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

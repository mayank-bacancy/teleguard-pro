import { AlertBadge } from "@/components/alerts/alert-badge";
import { AlertFilters } from "@/components/alerts/alert-filters";
import { AlertsTable } from "@/components/alerts/alerts-table";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { RealtimeControl } from "@/components/realtime/realtime-control";
import { createClient } from "@/lib/supabase/server";
import { getAlertsPageData } from "@/services/alerts";

type AlertsPageProps = {
  searchParams?: Promise<{
    status?: string;
    severity?: string;
  }>;
};

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const params = (await searchParams) ?? {};
  const supabase = await createClient();
  const data = await getAlertsPageData(supabase, {
    status: params.status,
    severity: params.severity,
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
              Alert Command Center
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Fraud alert queue
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Review every generated incident, filter by analyst priority, and
              open individual investigations with CDR and rule context.
            </p>
          </div>
          <ControlShellNav current="alerts" />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Total Alerts" value={String(data.counts.total)} />
          <MetricCard label="Open" value={String(data.counts.open)} />
          <MetricCard
            label="Acknowledged"
            value={String(data.counts.acknowledged)}
          />
          <MetricCard label="Resolved" value={String(data.counts.resolved)} />
          <MetricCard label="Critical" value={String(data.counts.critical)} />
        </section>

        <section className="mt-6">
          <RealtimeControl surface="alert queue" compact />
        </section>

        <section className="mt-6">
          <AlertFilters
            selectedStatus={data.filters.status}
            selectedSeverity={data.filters.severity}
          />
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <AlertBadge value={data.filters.status} kind="status" />
            <AlertBadge value={data.filters.severity} kind="severity" />
          </div>
          <AlertsTable alerts={data.alerts} />
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
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

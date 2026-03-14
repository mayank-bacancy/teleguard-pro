import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { ReportExportCard } from "@/components/reports/report-export-card";
import { ReportHighlightCard } from "@/components/reports/report-highlight-card";
import { TopCasesPanel } from "@/components/reports/top-cases-panel";
import { createClient } from "@/lib/supabase/server";
import { getReportsSnapshot } from "@/services/reports";

export default async function ReportsPage() {
  const supabase = await createClient();
  const snapshot = await getReportsSnapshot(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Reporting Center
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Export and reporting
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                This surface turns the platform into something operators,
                executives, and judges can export, share, and review without
                walking through every screen manually.
              </p>
            </div>
            <ControlShellNav current="reports" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {snapshot.executiveHighlights.map((item) => (
            <ReportHighlightCard
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-3">
          {snapshot.exports.map((item) => (
            <ReportExportCard
              key={item.title}
              title={item.title}
              description={item.description}
              href={item.href}
            />
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
              Executive summary
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Report-ready product state
            </h2>
            <div className="mt-5 grid gap-4">
              <SummaryRow
                label="Fraud alerts tracked"
                value={String(snapshot.summary.alerts)}
              />
              <SummaryRow
                label="Active blocked numbers"
                value={String(snapshot.summary.blockedNumbers)}
              />
              <SummaryRow
                label="Investigation cases"
                value={String(snapshot.summary.cases)}
              />
              <SummaryRow
                label="Protected revenue estimate"
                value={formatCurrency(snapshot.summary.protectedRevenueEstimate)}
              />
              <SummaryRow
                label="Suspicious traffic share"
                value={`${snapshot.summary.suspiciousTrafficShare.toFixed(1)}%`}
              />
            </div>
          </section>

          <TopCasesPanel cases={snapshot.topCases} />
        </section>
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

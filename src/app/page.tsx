import { formatDistanceToNowStrict } from "date-fns";

import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { RealtimeControl } from "@/components/realtime/realtime-control";
import { WorkflowTrigger } from "@/components/workflow-trigger";
import { createClient } from "@/lib/supabase/server";
import { getDashboardSnapshot } from "@/services/fraud-workflow";

export default async function Home() {
  const supabase = await createClient();
  const dashboard = await getDashboardSnapshot(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#17324a_0%,#08131b_38%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(140deg,rgba(15,31,45,0.94)_0%,rgba(6,12,16,0.9)_45%,rgba(4,8,10,0.98)_100%)] p-6 shadow-[0_40px_140px_-55px_rgba(7,20,28,0.95)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                TeleGuard Pro
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Telecom fraud operations with seeded risk telemetry and live
                response controls.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                The dashboard is now wired to Supabase. It surfaces live counts
                from your seeded call records, fraud rules, alerts, and active
                blocks, then lets you trigger the first alert-generation cycle
                directly from the app.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="mb-5">
                <ControlShellNav current="dashboard" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
                System posture
              </p>
              <div className="mt-5 grid gap-4">
                <SignalRow
                  label="Fraud rules active"
                  value={String(dashboard.activeRules.length)}
                />
                <SignalRow
                  label="High-risk calls queued"
                  value={String(dashboard.counts.suspiciousCalls)}
                />
                <SignalRow
                  label="Open response surface"
                  value={String(dashboard.counts.alerts)}
                />
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-300">
                Recommended next move: run the workflow once after every seed
                refresh so `fraud_alerts` and `blocked_numbers` stay aligned
                with suspicious CDR activity.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardStatCard
              eyebrow="Traffic"
              title="Total Call Records"
              value={compactNumber(dashboard.counts.totalCalls)}
              tone="cyan"
            />
            <DashboardStatCard
              eyebrow="Risk"
              title="Suspicious Calls"
              value={compactNumber(dashboard.counts.suspiciousCalls)}
              tone="amber"
            />
            <DashboardStatCard
              eyebrow="Response"
              title="Fraud Alerts"
              value={compactNumber(dashboard.counts.alerts)}
              tone="red"
            />
            <DashboardStatCard
              eyebrow="Containment"
              title="Blocked Numbers"
              value={compactNumber(dashboard.counts.blockedNumbers)}
              tone="emerald"
            />
          </div>
        </section>

        <section className="mt-6">
          <RealtimeControl surface="dashboard" />
        </section>

        <section className="mt-6">
          <WorkflowTrigger />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
                  Inbound risk stream
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Recent call detail records
                </h2>
              </div>
              <p className="text-sm text-slate-400">
                Latest 8 rows from `call_detail_records`
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
              <div className="grid grid-cols-[1.25fr_1fr_1fr_0.8fr_0.7fr] gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                <span>Source</span>
                <span>Route</span>
                <span>Status</span>
                <span>Risk</span>
                <span>Age</span>
              </div>
              <div className="divide-y divide-white/8">
                {dashboard.recentCalls.map((call) => (
                  <div
                    key={call.id}
                    className="grid grid-cols-[1.25fr_1fr_1fr_0.8fr_0.7fr] gap-3 px-4 py-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {call.caller_number}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        to {call.receiver_number}
                      </p>
                    </div>
                    <div className="text-slate-300">
                      {call.source_country} to {call.destination_country}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getCallTone(call)}`}
                      >
                        {call.is_suspicious ? "Suspicious" : "Normal"}
                      </span>
                    </div>
                    <div className="text-white">{Math.round(call.risk_score)}</div>
                    <div className="text-slate-400">
                      {formatAge(call.call_start)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
                Alert queue
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Recent fraud alerts
              </h2>
              <div className="mt-5 space-y-3">
                {dashboard.recentAlerts.length === 0 ? (
                  <EmptyStateCopy text="No alerts yet. Run the workflow to convert suspicious CDRs into active incidents." />
                ) : (
                  dashboard.recentAlerts.map((alert) => (
                    <article
                      key={alert.id}
                      className="rounded-[24px] border border-white/10 bg-black/10 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-white">{alert.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {alert.sourceNumber}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${getSeverityTone(alert.severity)}`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {alert.reason}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span>{alert.status}</span>
                        <span>{formatAge(alert.createdAt)}</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
                Rules engine
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Active fraud rules
              </h2>
              <div className="mt-5 space-y-3">
                {dashboard.activeRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rounded-[24px] border border-white/10 bg-black/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-white">{rule.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${getSeverityTone(rule.severity)}`}
                      >
                        {rule.severity}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                      <span>{rule.ruleType}</span>
                      <span>
                        Threshold:{" "}
                        {rule.thresholdValue === null ? "N/A" : rule.thresholdValue}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}

function EmptyStateCopy({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 p-5 text-sm leading-6 text-slate-400">
      {text}
    </div>
  );
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatAge(timestamp: string) {
  return formatDistanceToNowStrict(new Date(timestamp), {
    addSuffix: true,
  });
}

function getCallTone(call: { is_suspicious: boolean; risk_score: number }) {
  if (call.risk_score >= 90) {
    return "bg-rose-400/12 text-rose-200";
  }

  if (call.is_suspicious) {
    return "bg-amber-400/12 text-amber-200";
  }

  return "bg-emerald-400/12 text-emerald-200";
}

function getSeverityTone(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-rose-400/14 text-rose-200";
    case "high":
      return "bg-amber-400/14 text-amber-200";
    case "medium":
      return "bg-cyan-400/14 text-cyan-200";
    default:
      return "bg-slate-400/14 text-slate-200";
  }
}

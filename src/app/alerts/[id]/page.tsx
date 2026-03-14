import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";

import { AlertBadge } from "@/components/alerts/alert-badge";
import { CaseCreateButton } from "@/components/cases/case-create-button";
import { AlertStatusForm } from "@/components/alerts/alert-status-form";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { createClient } from "@/lib/supabase/server";
import { getAlertInvestigation } from "@/services/alerts";
import { getCaseByAlertId } from "@/services/cases";

type AlertDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AlertDetailPage({
  params,
}: AlertDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const [investigation, existingCase] = await Promise.all([
    getAlertInvestigation(supabase, id),
    getCaseByAlertId(supabase, id),
  ]);

  if (!investigation) {
    notFound();
  }

  const { alert, cdr, rule, blockedNumber } = investigation;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
              Investigation
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              {alert.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {alert.reason}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <ControlShellNav current="alerts" />
            <div className="flex gap-3">
            <Link
              href="/alerts"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Back to alerts
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/18"
            >
              Dashboard
            </Link>
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-4">
          <SurfaceMetric label="Severity" value={<AlertBadge value={alert.severity} kind="severity" />} />
          <SurfaceMetric label="Status" value={<AlertBadge value={alert.status} kind="status" />} />
          <SurfaceMetric label="Risk score" value={<span>{Math.round(alert.risk_score)}</span>} />
          <SurfaceMetric
            label="Created"
            value={
              <span>
                {formatDistanceToNowStrict(new Date(alert.created_at), {
                  addSuffix: true,
                })}
              </span>
            }
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <SectionCard
              eyebrow="Alert summary"
              title="Incident overview"
              rows={[
                ["Alert ID", alert.id],
                ["Source number", alert.source_number],
                ["Description", alert.description ?? "No description recorded."],
                ["Acknowledged at", alert.acknowledged_at ?? "Not acknowledged"],
                ["Resolved at", alert.resolved_at ?? "Not resolved"],
              ]}
            />

            <SectionCard
              eyebrow="Related CDR"
              title="Call detail context"
              rows={
                cdr
                  ? [
                      ["Caller", cdr.caller_number],
                      ["Receiver", cdr.receiver_number],
                      [
                        "Route",
                        `${cdr.source_country} to ${cdr.destination_country}`,
                      ],
                      ["Call type", cdr.call_type],
                      ["Duration", `${cdr.duration_seconds} seconds`],
                      ["Status", cdr.status],
                    ]
                  : [["CDR", "No related call record found."]]
              }
            />

            <SectionCard
              eyebrow="Rule intelligence"
              title="Matched fraud rule"
              rows={
                rule
                  ? [
                      ["Rule name", rule.name],
                      ["Rule type", rule.rule_type],
                      ["Severity", rule.severity],
                      [
                        "Threshold",
                        rule.threshold_value === null
                          ? "N/A"
                          : String(rule.threshold_value),
                      ],
                      [
                        "Configuration",
                        JSON.stringify(rule.configuration, null, 2),
                      ],
                    ]
                  : [["Rule", "No matched rule linked to this alert."]]
              }
            />
          </div>

          <div className="grid gap-6">
            <AlertStatusForm alertId={alert.id} currentStatus={alert.status} />

            {existingCase ? (
              <section className="rounded-[24px] border border-white/10 bg-black/10 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Case management
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  This alert is already linked to an active investigation case.
                </p>
                <Link
                  href={`/cases/${existingCase.id}`}
                  className="mt-4 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/18"
                >
                  Open Linked Case
                </Link>
              </section>
            ) : (
              <CaseCreateButton alertId={alert.id} />
            )}

            <SectionCard
              eyebrow="Containment"
              title="Blocked number state"
              rows={
                blockedNumber
                  ? [
                      ["Phone number", blockedNumber.phone_number],
                      ["Reason", blockedNumber.reason],
                      ["Active", blockedNumber.is_active ? "Yes" : "No"],
                      ["Blocked at", blockedNumber.blocked_at],
                    ]
                  : [["State", "No blocked number linked to this alert."]]
              }
            />

            <SectionCard
              eyebrow="Analyst notes"
              title="Investigation hints"
              rows={[
                [
                  "Suggested action",
                  blockedNumber
                    ? "Review if the active block should remain in place after investigation."
                    : "Acknowledge the alert, verify the CDR pattern, and block if the risk signal persists.",
                ],
                [
                  "Next verification",
                  cdr
                    ? "Compare this call with adjacent traffic from the same caller."
                    : "Confirm upstream data integrity for the missing related CDR.",
                ],
              ]}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function SurfaceMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <div className="mt-4 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
    </article>
  );
}

function SectionCard({
  eyebrow,
  title,
  rows,
}: {
  eyebrow: string;
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-4">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {label}
            </p>
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-slate-200">
              {value}
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";

import { AlertBadge } from "@/components/alerts/alert-badge";
import { CaseBadge } from "@/components/cases/case-badge";
import { CaseNoteForm } from "@/components/cases/case-note-form";
import { CaseStatusForm } from "@/components/cases/case-status-form";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { createClient } from "@/lib/supabase/server";
import { getCaseDetail } from "@/services/cases";

type CaseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const detail = await getCaseDetail(supabase, id);

  if (!detail) {
    notFound();
  }

  const { caseItem, alert, notes } = detail;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
              Case Detail
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              {caseItem.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {caseItem.summary ?? "No case summary recorded."}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <ControlShellNav current="cases" />
            <div className="flex gap-3">
              <Link
                href="/cases"
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Back to cases
              </Link>
              {alert ? (
                <Link
                  href={`/alerts/${alert.id}`}
                  className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/18"
                >
                  Open linked alert
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-4">
          <Metric label="Owner" value={<span>{caseItem.owner_name}</span>} />
          <Metric label="Status" value={<CaseBadge value={caseItem.status} kind="status" />} />
          <Metric label="Priority" value={<CaseBadge value={caseItem.priority} kind="priority" />} />
          <Metric
            label="Updated"
            value={
              <span>
                {formatDistanceToNowStrict(new Date(caseItem.updated_at), {
                  addSuffix: true,
                })}
              </span>
            }
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <SectionCard
              eyebrow="Case overview"
              title="Investigation summary"
              rows={[
                ["Case ID", caseItem.id],
                ["Owner", caseItem.owner_name],
                ["Summary", caseItem.summary ?? "No summary recorded."],
                ["Created at", caseItem.created_at],
                ["Updated at", caseItem.updated_at],
              ]}
            />

            <SectionCard
              eyebrow="Linked incident"
              title="Source alert"
              rows={
                alert
                  ? [
                      ["Alert title", alert.title],
                      ["Severity", alert.severity],
                      ["Status", alert.status],
                      ["Source number", alert.source_number],
                      ["Reason", alert.reason],
                    ]
                  : [["Alert", "No linked alert found."]]
              }
            />

            <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                Activity trail
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Analyst notes
              </h2>
              <div className="mt-5 space-y-4">
                {notes.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 p-5 text-sm leading-6 text-slate-400">
                    No notes yet. Add the first investigative note to capture reasoning and evidence.
                  </div>
                ) : (
                  notes.map((note) => (
                    <article
                      key={note.id}
                      className="rounded-[24px] border border-white/10 bg-black/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-white">{note.author_name}</p>
                        <p className="text-xs text-slate-400">
                          {formatDistanceToNowStrict(new Date(note.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {note.note}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="grid gap-6">
            <CaseStatusForm caseId={caseItem.id} currentStatus={caseItem.status} />
            <CaseNoteForm caseId={caseItem.id} />

            <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                Workflow hints
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Analyst guidance
              </h2>
              <div className="mt-5 space-y-3">
                <HintItem text="Capture telecom routing evidence, caller behavior, and mitigation decisions in the notes." />
                <HintItem text="Move the case to in_review once the analyst starts validating the alert." />
                <HintItem text="Resolve the case only after notes clearly record the outcome and containment decision." />
              </div>
            </section>

            {alert ? (
              <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                  Alert reference
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <AlertBadge value={alert.severity} kind="severity" />
                  <AlertBadge value={alert.status} kind="status" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Keep the alert and case statuses aligned so the operator view stays coherent.
                </p>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({
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

function HintItem({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-slate-300">
      {text}
    </div>
  );
}

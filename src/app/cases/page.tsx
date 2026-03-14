import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

import { CaseBadge } from "@/components/cases/case-badge";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { StatusMetricCard } from "@/components/control-center/status-metric-card";
import { createClient } from "@/lib/supabase/server";
import { getCasesPageData } from "@/services/cases";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const supabase = await createClient();
  const data = await getCasesPageData(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Analyst Workflow
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Investigation cases
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Track ownership, workflow progression, and documentation for the
                alerts that turned into formal investigations.
              </p>
            </div>
            <ControlShellNav current="cases" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusMetricCard label="Total Cases" value={String(data.counts.total)} />
          <StatusMetricCard label="Open" value={String(data.counts.open)} />
          <StatusMetricCard label="In Review" value={String(data.counts.inReview)} />
          <StatusMetricCard label="Resolved" value={String(data.counts.resolved)} />
        </section>

        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr_0.8fr] gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
            <span>Case</span>
            <span>Linked alert</span>
            <span>Owner</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-white/8">
            {data.cases.map((caseItem) => (
              <article
                key={caseItem.id}
                className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr_0.8fr] gap-3 px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium text-white">{caseItem.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Updated{" "}
                    {formatDistanceToNowStrict(new Date(caseItem.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="text-slate-300">
                  {caseItem.linkedAlertTitle ?? caseItem.linkedAlertId}
                </div>
                <div className="text-slate-300">{caseItem.ownerName}</div>
                <div className="flex items-center">
                  <CaseBadge value={caseItem.status} kind="status" />
                </div>
                <div className="flex items-center">
                  <CaseBadge value={caseItem.priority} kind="priority" />
                </div>
                <div className="flex items-center">
                  <Link
                    href={`/cases/${caseItem.id}`}
                    className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/18"
                  >
                    Open Case
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

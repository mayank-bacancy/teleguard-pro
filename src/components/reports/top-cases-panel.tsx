import { CaseBadge } from "@/components/cases/case-badge";
import type { ReportsSnapshot } from "@/services/reports";

export function TopCasesPanel({
  cases,
}: {
  cases: ReportsSnapshot["topCases"];
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        Investigation reporting
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Case summary snapshot
      </h2>
      <div className="mt-5 space-y-3">
        {cases.map((caseItem) => (
          <article
            key={caseItem.id}
            className="rounded-[24px] border border-white/10 bg-black/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-medium text-white">{caseItem.title}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Owner: {caseItem.ownerName}
                </p>
              </div>
              <CaseBadge value={caseItem.status} kind="status" />
            </div>
            <div className="mt-3 text-sm text-slate-300">
              Notes recorded: {caseItem.noteCount}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useActionState } from "react";

import {
  type CaseActionState,
  updateCaseStatusAction,
} from "@/app/actions/cases";

const initialState: CaseActionState = {
  status: "idle",
  message: "Move the case through the analyst workflow.",
};

const statuses = [
  { label: "Open", value: "open" },
  { label: "Review", value: "in_review" },
  { label: "Resolve", value: "resolved" },
] as const;

export function CaseStatusForm({
  caseId,
  currentStatus,
}: {
  caseId: string;
  currentStatus: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateCaseStatusAction,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-[24px] border border-white/10 bg-black/10 p-5">
      <input type="hidden" name="caseId" value={caseId} />
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
        Case progression
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {statuses.map((status) => {
          const active = currentStatus === status.value;

          return (
            <button
              key={status.value}
              type="submit"
              name="status"
              value={status.value}
              disabled={pending || active}
              className={`inline-flex items-center justify-center rounded-full border px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border-white/15 bg-white/10 text-white"
                  : "border-cyan-300/25 bg-cyan-300/10 text-cyan-50 hover:bg-cyan-300/18"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {status.label}
            </button>
          );
        })}
      </div>
      <p
        className={`mt-4 text-sm ${
          state.status === "error" ? "text-rose-300" : "text-slate-300"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}

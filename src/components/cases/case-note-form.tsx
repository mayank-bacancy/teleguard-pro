"use client";

import { useActionState } from "react";

import { addCaseNoteAction, type CaseActionState } from "@/app/actions/cases";

const initialState: CaseActionState = {
  status: "idle",
  message: "Capture analyst notes and reasoning for this case.",
};

export function CaseNoteForm({ caseId }: { caseId: string }) {
  const [state, formAction, pending] = useActionState(
    addCaseNoteAction,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-[24px] border border-white/10 bg-black/10 p-5">
      <input type="hidden" name="caseId" value={caseId} />
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
        Analyst notes
      </p>
      <div className="mt-4 grid gap-4">
        <input
          name="authorName"
          defaultValue="Fraud Analyst"
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          placeholder="Author"
        />
        <textarea
          name="note"
          rows={5}
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          placeholder="Document investigative findings, routing anomalies, customer impact, or remediation steps."
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-fit rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving note..." : "Add Note"}
        </button>
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

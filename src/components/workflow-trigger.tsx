"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  runFraudWorkflowAction,
  type FraudWorkflowActionState,
} from "@/app/actions/fraud-workflow";

const initialState: FraudWorkflowActionState = {
  status: "idle",
  message: "Generate alerts from suspicious CDRs seeded in Supabase.",
};

export function WorkflowTrigger() {
  const [state, formAction] = useActionState(
    runFraudWorkflowAction,
    initialState,
  );

  return (
    <div className="rounded-[28px] border border-cyan-400/20 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
            Live Workflow
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Run the first fraud response cycle
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This scans suspicious seeded call records, creates new fraud alerts,
            and auto-blocks the highest-risk numbers.
          </p>
        </div>
        <form action={formAction}>
          <SubmitButton />
        </form>
      </div>
      <p
        className={`mt-4 text-sm ${
          state.status === "error" ? "text-rose-300" : "text-slate-300"
        }`}
      >
        {state.message}
      </p>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-w-52 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/12 px-5 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Running workflow..." : "Generate Alerts"}
    </button>
  );
}

"use client";

import { useActionState } from "react";

import {
  type AlertStatusActionState,
  updateAlertStatusAction,
} from "@/app/actions/alerts";

const initialState: AlertStatusActionState = {
  status: "idle",
  message: "Update the alert status as investigation progresses.",
};

type AlertStatusFormProps = {
  alertId: string;
  currentStatus: string;
};

const statuses = [
  { label: "Open", value: "open" },
  { label: "Acknowledge", value: "acknowledged" },
  { label: "Resolve", value: "resolved" },
] as const;

export function AlertStatusForm({
  alertId,
  currentStatus,
}: AlertStatusFormProps) {
  const [state, formAction, pending] = useActionState(
    updateAlertStatusAction,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-[24px] border border-white/10 bg-black/10 p-5">
      <input type="hidden" name="alertId" value={alertId} />
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
        Analyst action
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {statuses.map((status) => {
          const active = status.value === currentStatus;

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
              {active ? `${status.label}ed` : status.label}
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

"use client";

import { useActionState } from "react";

import {
  type ControlCenterActionState,
  unblockNumberAction,
} from "@/app/actions/control-center";

const initialState: ControlCenterActionState = {
  status: "idle",
  message: "",
};

export function UnblockNumberForm({
  blockedNumberId,
  isActive,
}: {
  blockedNumberId: string;
  isActive: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    unblockNumberAction,
    initialState,
  );

  if (!isActive) {
    return <span className="text-xs text-slate-500">Released</span>;
  }

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input type="hidden" name="blockedNumberId" value={blockedNumberId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-300/18 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Updating..." : "Unblock"}
      </button>
      {state.message ? (
        <span
          className={`text-[11px] ${
            state.status === "error" ? "text-rose-300" : "text-slate-400"
          }`}
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}

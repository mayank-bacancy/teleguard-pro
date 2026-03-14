"use client";

import { useActionState } from "react";

import {
  type ControlCenterActionState,
  toggleRuleAction,
} from "@/app/actions/control-center";

const initialState: ControlCenterActionState = {
  status: "idle",
  message: "",
};

export function ToggleRuleForm({
  ruleId,
  isActive,
}: {
  ruleId: string;
  isActive: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    toggleRuleAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input type="hidden" name="ruleId" value={ruleId} />
      <input type="hidden" name="isActive" value={String(!isActive)} />
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isActive
            ? "border-amber-300/25 bg-amber-300/10 text-amber-100 hover:bg-amber-300/18"
            : "border-cyan-300/25 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/18"
        }`}
      >
        {pending ? "Updating..." : isActive ? "Disable" : "Enable"}
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

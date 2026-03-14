"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  createCaseFromAlertAction,
  type CaseActionState,
} from "@/app/actions/cases";

const initialState: CaseActionState = {
  status: "idle",
  message: "Create an investigation case to document analyst workflow.",
};

export function CaseCreateButton({ alertId }: { alertId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createCaseFromAlertAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state]);

  return (
    <form action={formAction} className="rounded-[24px] border border-white/10 bg-black/10 p-5">
      <input type="hidden" name="alertId" value={alertId} />
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
        Case management
      </p>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating case..." : "Create Investigation Case"}
      </button>
      <p
        className={`mt-3 text-sm ${
          state.status === "error" ? "text-rose-300" : "text-slate-400"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}

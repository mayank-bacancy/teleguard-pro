"use client";

import { useActionState, useEffect, useEffectEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  runSimulationAction,
  type SimulationActionState,
} from "@/app/actions/simulation";

const initialState: SimulationActionState = {
  status: "idle",
  message: "Inject fresh telecom traffic and keep this surface warm with live refresh.",
};

export function RealtimeControl({
  surface,
  compact = false,
}: {
  surface: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [batchSize, setBatchSize] = useState("6");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [state, formAction, isSimulating] = useActionState(
    runSimulationAction,
    initialState,
  );

  const refreshFromEffect = useEffectEvent(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  });

  const refreshNow = () => {
    startRefreshTransition(() => {
      router.refresh();
    });
  };

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const intervalId = window.setInterval(() => {
      refreshFromEffect();
    }, 8000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoRefresh]);

  return (
    <div
      className={`rounded-[28px] border border-cyan-400/20 bg-white/[0.035] p-5 backdrop-blur ${
        compact ? "" : "shadow-[0_32px_120px_-60px_rgba(0,0,0,0.9)]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
            Realtime simulation
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Live {surface} feed
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Inject a fresh batch of call records, run the fraud workflow
            automatically, and keep this page refreshed without manual reloads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => refreshNow()}
            disabled={isRefreshing}
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? "Refreshing..." : "Refresh Now"}
          </button>

          <label className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent"
            />
            Auto refresh
          </label>
        </div>
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end">
        <label className="flex max-w-52 flex-col gap-2 text-sm text-slate-300">
          <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
            Batch size
          </span>
          <select
            name="batchSize"
            value={batchSize}
            onChange={(event) => setBatchSize(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="4">4 events</option>
            <option value="6">6 events</option>
            <option value="8">8 events</option>
            <option value="10">10 events</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isSimulating}
          className="inline-flex min-w-56 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/12 px-5 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSimulating ? "Simulating..." : "Inject Live Traffic"}
        </button>
      </form>

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

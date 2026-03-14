"use client";

import { useActionState } from "react";

import {
  ingestCsvAction,
  type IngestionActionState,
} from "@/app/actions/ingestion";

const initialState: IngestionActionState = {
  status: "idle",
  message: "Upload a CDR CSV to ingest external telecom traffic into the platform.",
};

export function CsvUploadForm() {
  const [state, formAction, pending] = useActionState(
    ingestCsvAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur"
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        CSV ingestion
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Upload call detail records
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Expected headers: `caller_number`, `receiver_number`, `call_start`,
        `duration_seconds`, `source_country`, `destination_country`. Optional
        fields include `risk_score`, `is_suspicious`, and network names.
      </p>

      <div className="mt-5 grid gap-4">
        <input
          type="file"
          name="csvFile"
          accept=".csv,text/csv"
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cyan-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-fit rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Uploading..." : "Upload CSV"}
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

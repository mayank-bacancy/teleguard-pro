import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { StatusMetricCard } from "@/components/control-center/status-metric-card";
import { CsvUploadForm } from "@/components/ingestion/csv-upload-form";
import { createClient } from "@/lib/supabase/server";
import { getIngestionPageData } from "@/services/ingestion";

export default async function IngestionPage() {
  const supabase = await createClient();
  const data = await getIngestionPageData(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Live Data Intake
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                CDR ingestion
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Move beyond seed-only data by accepting external CDR batches
                through CSV upload or the ingestion API. Imported rows feed the
                same detection, alerting, and analytics pipeline.
              </p>
            </div>
            <ControlShellNav current="ingestion" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <StatusMetricCard
            label="Total CDRs"
            value={String(data.counts.totalCalls)}
          />
          <StatusMetricCard
            label="Suspicious CDRs"
            value={String(data.counts.suspiciousCalls)}
          />
          <StatusMetricCard label="Alerts" value={String(data.counts.alerts)} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <CsvUploadForm />

          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
              API ingestion
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Batch CDR endpoint
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Send JSON batches to `/api/ingestion/cdr`. Valid rows are inserted
              into `call_detail_records`, then the fraud workflow can run
              automatically.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/templates/cdr-ingestion-template.csv"
                className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/18"
              >
                Download CSV Template
              </Link>
              <p className="text-sm text-slate-400">
                Includes fake rows so users can understand the expected format immediately.
              </p>
            </div>
            <pre className="mt-5 overflow-x-auto rounded-[24px] border border-white/8 bg-black/20 p-4 font-mono text-xs leading-6 text-slate-200">
{`POST /api/ingestion/cdr
{
  "sourceType": "partner_feed",
  "triggerWorkflow": true,
  "rows": [
    {
      "caller_number": "+12025550111",
      "receiver_number": "+442071838750",
      "call_start": "2026-03-14T10:15:00.000Z",
      "duration_seconds": 240,
      "source_country": "United States",
      "destination_country": "United Kingdom",
      "risk_score": 78,
      "is_suspicious": false
    }
  ]
}`}
            </pre>
          </section>
        </section>

        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur">
          <div className="flex items-end justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                Recent intake
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Latest processed CDR rows
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Source tag is taken from row metadata
            </p>
          </div>
          <div className="grid grid-cols-[1fr_1fr_0.9fr_0.8fr_0.8fr] gap-3 border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
            <span>Call pair</span>
            <span>Route</span>
            <span>Source</span>
            <span>Risk</span>
            <span>Age</span>
          </div>
          <div className="divide-y divide-white/8">
            {data.recentRows.map((row) => (
              <article
                key={row.id}
                className="grid grid-cols-[1fr_1fr_0.9fr_0.8fr_0.8fr] gap-3 px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium text-white">{row.callerNumber}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    to {row.receiverNumber}
                  </p>
                </div>
                <div className="text-slate-300">
                  {row.sourceCountry} to {row.destinationCountry}
                </div>
                <div className="text-slate-400">{row.sourceType}</div>
                <div className="text-slate-300">{row.riskScore.toFixed(1)}</div>
                <div className="text-slate-400">
                  {formatDistanceToNowStrict(new Date(row.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

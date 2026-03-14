import { formatDistanceToNowStrict } from "date-fns";

import { AlertBadge } from "@/components/alerts/alert-badge";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { StatusMetricCard } from "@/components/control-center/status-metric-card";
import { UnblockNumberForm } from "@/components/control-center/unblock-number-form";
import { createClient } from "@/lib/supabase/server";
import { getBlockedNumbersPageData } from "@/services/control-center";

export default async function BlockedNumbersPage() {
  const supabase = await createClient();
  const data = await getBlockedNumbersPageData(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Containment Layer
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Blocked numbers
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Review active containment actions, see which alert or rule caused
                them, and release numbers when investigation determines the risk
                is no longer valid.
              </p>
            </div>
            <ControlShellNav current="blocked-numbers" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <StatusMetricCard label="Total" value={String(data.counts.total)} />
          <StatusMetricCard label="Active" value={String(data.counts.active)} />
          <StatusMetricCard
            label="Released"
            value={String(data.counts.inactive)}
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur">
          <div className="grid grid-cols-[1fr_1.3fr_1fr_1fr_0.9fr_0.8fr_0.9fr] gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
            <span>Number</span>
            <span>Reason</span>
            <span>Source alert</span>
            <span>Rule</span>
            <span>Age</span>
            <span>State</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-white/8">
            {data.blockedNumbers.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-[1fr_1.3fr_1fr_1fr_0.9fr_0.8fr_0.9fr] gap-3 px-5 py-4 text-sm"
              >
                <div className="font-medium text-white">{item.phoneNumber}</div>
                <div className="text-slate-300">{item.reason}</div>
                <div className="text-slate-400">
                  {item.sourceAlertTitle ?? "Manual or unavailable"}
                </div>
                <div className="text-slate-400">{item.ruleName ?? "N/A"}</div>
                <div className="text-slate-400">
                  {formatDistanceToNowStrict(new Date(item.blockedAt), {
                    addSuffix: true,
                  })}
                </div>
                <div className="flex items-center">
                  <AlertBadge
                    value={item.isActive ? "blocked" : "clear"}
                    kind="block"
                  />
                </div>
                <div className="flex items-center">
                  <UnblockNumberForm
                    blockedNumberId={item.id}
                    isActive={item.isActive}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

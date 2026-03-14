import { formatDistanceToNowStrict } from "date-fns";

import { AlertBadge } from "@/components/alerts/alert-badge";
import { ControlShellNav } from "@/components/control-center/control-shell-nav";
import { StatusMetricCard } from "@/components/control-center/status-metric-card";
import { ToggleRuleForm } from "@/components/control-center/toggle-rule-form";
import { createClient } from "@/lib/supabase/server";
import { getRulesPageData } from "@/services/control-center";

export default async function RulesPage() {
  const supabase = await createClient();
  const data = await getRulesPageData(supabase);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#162d42_0%,#08131a_40%,#04070a_100%)] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">
                Detection Layer
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Fraud rules
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Review the active detection logic that powers alert generation,
                then enable or disable rules as operators tune the system.
              </p>
            </div>
            <ControlShellNav current="rules" />
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusMetricCard label="Total" value={String(data.counts.total)} />
          <StatusMetricCard label="Active" value={String(data.counts.active)} />
          <StatusMetricCard
            label="Inactive"
            value={String(data.counts.inactive)}
          />
          <StatusMetricCard
            label="Critical"
            value={String(data.counts.critical)}
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] backdrop-blur">
          <div className="grid grid-cols-[1.3fr_0.9fr_0.8fr_0.8fr_1.3fr_0.8fr_0.8fr] gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
            <span>Rule</span>
            <span>Type</span>
            <span>Severity</span>
            <span>Threshold</span>
            <span>Description</span>
            <span>Age</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-white/8">
            {data.rules.map((rule) => (
              <article
                key={rule.id}
                className="grid grid-cols-[1.3fr_0.9fr_0.8fr_0.8fr_1.3fr_0.8fr_0.8fr] gap-3 px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium text-white">{rule.name}</p>
                  <div className="mt-2">
                    <AlertBadge
                      value={rule.isActive ? "open" : "resolved"}
                      kind="status"
                    />
                  </div>
                </div>
                <div className="text-slate-300">{rule.ruleType}</div>
                <div className="flex items-center">
                  <AlertBadge value={rule.severity} kind="severity" />
                </div>
                <div className="text-slate-300">
                  {rule.thresholdValue === null ? "N/A" : rule.thresholdValue}
                </div>
                <div className="text-slate-400">
                  {rule.description ?? "No description provided."}
                </div>
                <div className="text-slate-400">
                  {formatDistanceToNowStrict(new Date(rule.createdAt), {
                    addSuffix: true,
                  })}
                </div>
                <div className="flex items-center">
                  <ToggleRuleForm ruleId={rule.id} isActive={rule.isActive} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

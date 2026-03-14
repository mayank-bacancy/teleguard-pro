import type { NetworkSecuritySnapshot } from "@/services/network-security";

export function SecuritySignalsPanel({
  signals,
  scenarios,
}: {
  signals: NetworkSecuritySnapshot["securitySignals"];
  scenarios: NetworkSecuritySnapshot["scenarioSignals"];
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4 md:grid-cols-3">
        {signals.map((signal) => (
          <article
            key={signal.title}
            className={`rounded-[28px] border p-5 backdrop-blur ${getSignalTone(
              signal.tone,
            )}`}
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">
              Security signal
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              {signal.title}
            </h2>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-white">
              {signal.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {signal.description}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
          Scenario pressure
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Suspicious pattern mix
        </h2>
        <div className="mt-5 space-y-3">
          {scenarios.map((scenario) => (
            <div
              key={scenario.label}
              className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm capitalize text-slate-200">
                  {scenario.label}
                </span>
                <span className="text-lg font-semibold text-white">
                  {scenario.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getSignalTone(tone: "cyan" | "amber" | "rose") {
  switch (tone) {
    case "rose":
      return "border-rose-400/20 bg-rose-400/10";
    case "amber":
      return "border-amber-400/20 bg-amber-400/10";
    default:
      return "border-cyan-400/20 bg-cyan-400/10";
  }
}

import type { NetworkSecuritySnapshot } from "@/services/network-security";

export function TopologyMap({
  topology,
}: {
  topology: NetworkSecuritySnapshot["topology"];
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        Topology simulation
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Telecom node pressure map
      </h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-3">
          {topology.nodes.map((node) => (
            <article
              key={node.id}
              className={`rounded-[24px] border p-4 ${getNodeTone(node.riskLevel)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-white">{node.label}</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                  {node.riskLevel}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-white/60">Suspicious volume</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {node.suspiciousVolume}
                  </p>
                </div>
                <div className="h-3 w-full max-w-28 overflow-hidden rounded-full bg-black/20">
                  <div
                    className="h-full rounded-full bg-white/70"
                    style={{
                      width: `${Math.min(
                        100,
                        node.totalVolume === 0
                          ? 0
                          : (node.suspiciousVolume / node.totalVolume) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Critical route links
          </p>
          <div className="mt-4 space-y-3">
            {topology.links.map((link) => (
              <div
                key={link.id}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">
                      {link.source} to {link.target}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {link.suspiciousCalls} suspicious of {link.totalCalls} calls
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${getLinkTone(
                      link.riskLevel,
                    )}`}
                  >
                    {link.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getNodeTone(level: string) {
  switch (level) {
    case "critical":
      return "border-rose-400/20 bg-rose-400/10";
    case "high":
      return "border-amber-400/20 bg-amber-400/10";
    case "medium":
      return "border-cyan-400/20 bg-cyan-400/10";
    default:
      return "border-white/10 bg-white/[0.03]";
  }
}

function getLinkTone(level: string) {
  switch (level) {
    case "critical":
      return "bg-rose-400/14 text-rose-200";
    case "high":
      return "bg-amber-400/14 text-amber-200";
    case "medium":
      return "bg-cyan-400/14 text-cyan-200";
    default:
      return "bg-slate-400/14 text-slate-200";
  }
}

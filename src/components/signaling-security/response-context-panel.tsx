import type { SignalingSecuritySnapshot } from "@/services/signaling-security";

export function ResponseContextPanel({
  signals,
}: {
  signals: SignalingSecuritySnapshot["responseSignals"];
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {signals.map((signal) => (
        <article
          key={signal.title}
          className={`rounded-[28px] border p-5 backdrop-blur ${getTone(signal.tone)}`}
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">
            Response signal
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            {signal.title}
          </h2>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-white">
            {signal.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/75">
            {signal.description}
          </p>
        </article>
      ))}
    </section>
  );
}

function getTone(tone: "cyan" | "amber" | "rose" | "emerald") {
  switch (tone) {
    case "amber":
      return "border-amber-400/20 bg-amber-400/10";
    case "rose":
      return "border-rose-400/20 bg-rose-400/10";
    case "emerald":
      return "border-emerald-400/20 bg-emerald-400/10";
    default:
      return "border-cyan-400/20 bg-cyan-400/10";
  }
}

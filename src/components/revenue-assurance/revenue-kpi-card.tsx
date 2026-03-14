export function RevenueKpiCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: "cyan" | "amber" | "rose" | "emerald";
}) {
  return (
    <article className={`rounded-[28px] border p-5 backdrop-blur ${getTone(tone)}`}>
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-white/75">{description}</p>
    </article>
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

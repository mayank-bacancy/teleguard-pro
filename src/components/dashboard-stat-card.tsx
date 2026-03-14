type DashboardStatCardProps = {
  eyebrow: string;
  title: string;
  value: string;
  tone: "cyan" | "amber" | "red" | "emerald";
};

const toneStyles: Record<DashboardStatCardProps["tone"], string> = {
  cyan: "border-cyan-400/25 bg-cyan-400/8 text-cyan-100",
  amber: "border-amber-400/25 bg-amber-400/8 text-amber-100",
  red: "border-rose-400/25 bg-rose-400/8 text-rose-100",
  emerald: "border-emerald-400/25 bg-emerald-400/8 text-emerald-100",
};

export function DashboardStatCard({
  eyebrow,
  title,
  value,
  tone,
}: DashboardStatCardProps) {
  return (
    <article
      className={`rounded-[28px] border p-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur ${toneStyles[tone]}`}
    >
      <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
        {eyebrow}
      </p>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-white/70">{title}</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className="h-14 w-14 rounded-2xl border border-white/10 bg-black/20" />
      </div>
    </article>
  );
}

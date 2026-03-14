export function AnalyticsKpiCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{subtext}</p>
    </article>
  );
}

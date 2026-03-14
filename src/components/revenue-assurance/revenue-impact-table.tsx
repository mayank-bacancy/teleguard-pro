type ImpactRow = {
  label: string;
  value: number;
};

export function RevenueImpactTable({
  title,
  eyebrow,
  rows,
}: {
  title: string;
  eyebrow: string;
  rows: ImpactRow[];
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
          >
            <span className="text-sm text-slate-300">{row.label}</span>
            <span className="text-sm font-semibold text-white">
              {formatCurrency(row.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

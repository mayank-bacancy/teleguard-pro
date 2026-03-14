type MarketingCardGridProps = {
  items: readonly {
    title: string;
    text: string;
  }[];
  columns?: "three" | "four";
  tone?: "default" | "muted";
};

export function MarketingCardGrid({
  items,
  columns = "three",
  tone = "default",
}: MarketingCardGridProps) {
  const gridClass =
    columns === "four"
      ? "md:grid-cols-2 xl:grid-cols-4"
      : "md:grid-cols-2 xl:grid-cols-3";
  const cardClass =
    tone === "muted"
      ? "rounded-[28px] border border-white/10 bg-white/5 p-6"
      : "rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_90px_-55px_rgba(2,6,23,0.65)]";

  return (
    <div className={`grid gap-5 ${gridClass}`}>
      {items.map((item) => (
        <article key={item.title} className={cardClass}>
          <h2 className="text-xl font-semibold text-white">{item.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

type MarketingSectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function MarketingSectionIntro({
  eyebrow,
  title,
  description,
}: MarketingSectionIntroProps) {
  return (
    <div className="max-w-3xl">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
        {eyebrow}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        {description}
      </p>
    </div>
  );
}

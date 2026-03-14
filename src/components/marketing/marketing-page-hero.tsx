type MarketingPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function MarketingPageHero({
  eyebrow,
  title,
  description,
}: MarketingPageHeroProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 text-center sm:px-6 lg:px-8">
      <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
        {eyebrow}
      </span>
      <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        {description}
      </p>
    </section>
  );
}

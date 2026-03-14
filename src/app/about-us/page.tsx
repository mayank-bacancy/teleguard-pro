import Link from "next/link";

import { companyPoints } from "@/components/marketing/marketing-data";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export default function AboutUsPage() {
  return (
    <MarketingShell>
      <MarketingPageHero
        eyebrow="About Us"
        title="We design telecom-first fraud products, not generic SOC pages."
        description="TeleGuard Pro is positioned for fraud teams, network defenders, revenue assurance leaders, and security operations groups that need one clear narrative from suspicious traffic to executive reporting."
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {companyPoints.map((point) => (
            <article
              key={point.title}
              className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7"
            >
              <h2 className="text-xl font-semibold text-white">{point.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{point.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,31,45,0.98),rgba(7,20,28,0.94))] p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            What makes the product different
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            The product surface is built to feel telecom-specific: fraud rules,
            investigations, blocked numbers, signaling security, route risk,
            revenue assurance, ingestion, reporting, and live simulation all
            work together instead of sitting in separate silos.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/solutions"
              className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/8"
            >
              View Solutions
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              Open Product
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

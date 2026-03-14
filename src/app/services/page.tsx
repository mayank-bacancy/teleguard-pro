import Link from "next/link";

import { MarketingCardGrid } from "@/components/marketing/marketing-card-grid";
import { serviceCards } from "@/components/marketing/marketing-data";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export default function ServicesPage() {
  return (
    <MarketingShell>
      <MarketingPageHero
        eyebrow="Services"
        title="Service lines that support telecom fraud defense beyond monitoring."
        description="We provide the operating model around fraud detection, investigation, telecom visibility, reporting, and revenue-risk communication so teams can work faster and leadership can see what is protected."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <MarketingCardGrid items={serviceCards} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Typical service outcomes
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/75">
                Faster triage
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Less time spent switching between disconnected tools and manual review steps.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/75">
                Better visibility
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Clearer understanding of suspicious traffic, route exposure, and operator response posture.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/75">
                Stronger reporting
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Cleaner outputs for leadership, fraud teams, and telecom stakeholders.
              </p>
            </div>
          </div>
          <div className="mt-7">
            <Link
              href="/contact-us"
              className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

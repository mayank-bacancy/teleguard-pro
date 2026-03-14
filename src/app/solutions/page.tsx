import Link from "next/link";

import { MarketingCardGrid } from "@/components/marketing/marketing-card-grid";
import { solutionCards } from "@/components/marketing/marketing-data";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export default function SolutionsPage() {
  return (
    <MarketingShell>
      <MarketingPageHero
        eyebrow="Solutions"
        title="Telecom fraud solutions that connect detection, response, and business trust."
        description="TeleGuard Pro helps operators identify suspicious telecom activity, investigate incidents faster, contain risk, and explain business impact with clarity."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <MarketingCardGrid items={solutionCards} columns="four" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-cyan-300/12 bg-[linear-gradient(145deg,rgba(15,31,45,0.98),rgba(7,20,28,0.94))] p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            What customers get
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            A cleaner operating model for suspicious traffic, alert triage,
            analyst workflows, telecom network visibility, reporting, and
            revenue-risk visibility.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              Sign Up
            </Link>
            <Link
              href="/contact-us"
              className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/8"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

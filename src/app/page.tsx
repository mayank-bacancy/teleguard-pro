import Link from "next/link";

import { MarketingCardGrid } from "@/components/marketing/marketing-card-grid";
import {
  serviceCards,
  solutionCards,
} from "@/components/marketing/marketing-data";
import { MarketingSectionIntro } from "@/components/marketing/marketing-section-intro";
import { MarketingShell } from "@/components/marketing/marketing-shell";

const metrics = [
  { label: "Workflow", value: "Detection to response" },
  { label: "Coverage", value: "Fraud, signaling, revenue" },
  { label: "Audience", value: "Operators and risk teams" },
];

export default function LandingPage() {
  return (
    <MarketingShell>
      <main>
        <section className="marketing-grid overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="fade-in-up">
              <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100 shadow-sm">
                Telecom Fraud Defense Platform
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Detect, investigate, and shut down telecom fraud before it
                becomes revenue loss.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                TeleGuard Pro helps telecom operators and risk teams monitor
                suspicious activity, investigate incidents, contain threats, and
                explain business impact clearly.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
                >
                  Start with TeleGuard
                </Link>
                <Link
                  href="/contact-us"
                  className="rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Request a walkthrough
                </Link>
              </div>
              <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_-55px_rgba(2,6,23,0.65)] backdrop-blur"
                  >
                    <p className="text-lg font-semibold text-white">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-in-up-delay relative">
              <div className="float-slow absolute -left-4 top-8 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />
              <div className="absolute -right-6 top-24 h-36 w-36 rounded-full bg-orange-400/12 blur-3xl" />
              <div className="relative space-y-4 rounded-[34px] border border-cyan-300/12 bg-[linear-gradient(160deg,rgba(15,31,45,0.98),rgba(6,12,16,0.96))] p-6 text-white shadow-[0_45px_140px_-60px_rgba(15,23,42,0.92)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">
                      Why teams use it
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Built for telecom risk operations
                    </h2>
                  </div>
                  <div className="pulse-ring rounded-full border border-emerald-300/30 bg-emerald-300/15 px-4 py-2 text-xs uppercase tracking-[0.26em] text-emerald-100">
                    Ready
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">
                    Who it is for
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Telecom operators, fraud teams, network risk teams, and
                    revenue assurance leaders.
                  </p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">
                    What it solves
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Monitoring, investigations, containment, network
                    intelligence, and reporting in one clear operating model.
                  </p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">
                    What customers get
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Cleaner workflows for suspicious traffic, analyst cases,
                    reporting, and revenue-risk visibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <MarketingSectionIntro
              eyebrow="Solutions"
              title="Core product solutions"
              description="A focused product surface for telecom fraud detection, investigation, signaling visibility, and revenue protection."
            />
            <div className="mt-8">
              <MarketingCardGrid items={solutionCards.slice(0, 3)} />
            </div>
            <div className="mt-7">
              <Link
                href="/solutions"
                className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/8"
              >
                View all solutions
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-[linear-gradient(140deg,rgba(15,31,45,0.94)_0%,rgba(6,12,16,0.9)_45%,rgba(4,8,10,0.98)_100%)] px-8 py-10 text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)]">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <MarketingSectionIntro
                  eyebrow="Services"
                  title="Support beyond monitoring"
                  description="Services around fraud detection, telecom visibility, reporting, and revenue-risk communication so teams can work faster and leadership can see what is protected."
                />
                <div className="mt-7">
                  <Link
                    href="/services"
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Explore services
                  </Link>
                </div>
              </div>
              <MarketingCardGrid items={serviceCards} tone="muted" />
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                About us
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Telecom-first product thinking.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                TeleGuard Pro is positioned for fraud teams, network defenders,
                revenue assurance leaders, and security operations groups that
                need one narrative from suspicious traffic to executive reporting.
              </p>
              <div className="mt-7">
                <Link
                  href="/about-us"
                  className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/8"
                >
                  Learn more
                </Link>
              </div>
            </article>

            <article className="rounded-[34px] border border-cyan-300/12 bg-[linear-gradient(145deg,rgba(15,31,45,0.98),rgba(7,20,28,0.94))] p-8">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
                Contact us
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Ready for a product conversation?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                Start with contact, signup, or login. The next auth step will
                connect public entry points to the secured operator workspace.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href="/contact-us"
                  className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
                >
                  Contact us
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/8"
                >
                  Login
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

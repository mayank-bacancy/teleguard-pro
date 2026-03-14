import Link from "next/link";

import { contactPoints } from "@/components/marketing/marketing-data";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export default function ContactUsPage() {
  return (
    <MarketingShell>
      <MarketingPageHero
        eyebrow="Contact Us"
        title="Talk to the team behind the telecom fraud operating model."
        description="Use this route for demos, product walkthroughs, operator conversations, and implementation planning around fraud response and telecom security visibility."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {contactPoints.map((point) => (
            <article
              key={point.title}
              className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7"
            >
              <h2 className="text-xl font-semibold text-white">{point.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-cyan-300/12 bg-[linear-gradient(145deg,rgba(15,31,45,0.98),rgba(7,20,28,0.94))] p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Ready for a product conversation?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Use signup and login as the public entry points. The next auth step
            will connect them to the secured operator workspace.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/8"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

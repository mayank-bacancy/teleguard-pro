import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { MarketingShell } from "@/components/marketing/marketing-shell";

const sections = [
  {
    title: "Platform use",
    text: "The public routes are intended for evaluation, product walkthroughs, and demo usage. Operational access controls will be enforced during the dedicated auth step.",
  },
  {
    title: "Demo environment",
    text: "Current product flows are designed around seeded, simulated, or manually ingested CDR data for evaluation and hackathon demonstration.",
  },
  {
    title: "Future production controls",
    text: "Production deployment should include authentication, authorization, operator review, and environment-specific compliance requirements.",
  },
];

export default function TermsOfServicePage() {
  return (
    <MarketingShell>
      <MarketingPageHero
        eyebrow="Terms of Service"
        title="Terms that keep the public platform surface complete and ready for production hardening."
        description="This route gives the marketing site a standard trust layer while leaving room for stricter production terms after authentication is implemented."
      />

      <section className="mx-auto max-w-5xl space-y-5 px-4 pb-20 sm:px-6 lg:px-8">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[30px] border border-slate-900/10 bg-white/80 p-8"
          >
            <h2 className="text-2xl font-semibold text-slate-950">
              {section.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {section.text}
            </p>
          </article>
        ))}
      </section>
    </MarketingShell>
  );
}

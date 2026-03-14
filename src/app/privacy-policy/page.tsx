import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { MarketingShell } from "@/components/marketing/marketing-shell";

const sections = [
  {
    title: "Information handling",
    text: "TeleGuard Pro is presented as a telecom fraud operations platform. Demo environments should use simulated, seeded, or explicitly approved data sources only.",
  },
  {
    title: "Operational visibility",
    text: "Platform analytics, alerts, cases, and reports are intended for authorized operator and security workflows once authentication is enabled.",
  },
  {
    title: "Policy updates",
    text: "This public policy route exists so the marketing surface remains complete and trust-oriented during demo and evaluation flows.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell>
      <MarketingPageHero
        eyebrow="Privacy Policy"
        title="A clear privacy surface for public-facing evaluation and product trust."
        description="This policy page completes the public site and provides a clean place for future production privacy details."
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

import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/solutions", label: "Solutions" },
      { href: "/services", label: "Services" },
      { href: "/about-us", label: "About Us" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
  {
    title: "Access",
    links: [
      { href: "/dashboard", label: "Product Workspace" },
      { href: "/login", label: "Login" },
      { href: "/signup", label: "Sign Up" },
    ],
  },
  {
    title: "Policy",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-slate-900/10 bg-slate-950 px-4 py-14 text-slate-200 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_repeat(3,0.8fr)]">
        <div>
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,#1f495f_0%,#08131b_70%,#05080b_100%)]">
              <span className="h-3.5 w-3.5 rounded-full bg-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.65)]" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/70">
                TeleGuard Pro
              </p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-slate-400">
                Modern telecom fraud defense for operators that need one clear
                surface for monitoring, investigation, reporting, and business
                protection.
              </p>
            </div>
          </div>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.26em] text-white/70">
              {group.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              {group.links.map((link) => (
                <Link
                  key={`${group.title}-${link.label}`}
                  href={link.href}
                  className="block transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500">
        <p>Copyright 2026 TeleGuard Pro. All rights reserved.</p>
        <p>Built for telecom operators, fraud teams, and security response units.</p>
      </div>
    </footer>
  );
}

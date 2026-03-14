import Link from "next/link";

const sectionLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/services", label: "Services" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 shadow-[0_28px_80px_-45px_rgba(2,6,23,0.85)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,#1b4d66_0%,#0b1721_68%,#05080b_100%)]">
            <span className="h-3.5 w-3.5 rounded-full bg-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.55)]" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.26em] text-slate-300">
              TeleGuard Pro
            </span>
            <span className="block text-sm text-slate-400">
              Telecom fraud intelligence
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-300">
          {sectionLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            Product
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/8"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-teal-500 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-teal-400"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

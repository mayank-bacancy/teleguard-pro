import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#1b4564_0%,#0a1522_28%,#040814_62%,#020307_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%,transparent_78%,rgba(255,255,255,0.015))]" />
      <div className="absolute left-[6%] top-14 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute right-[8%] top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-8 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cyan-400/7 blur-3xl" />
      <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-indigo-500/7 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
        <section className="auth-card-glow fade-in-up w-full overflow-hidden rounded-[34px] border border-sky-300/24 bg-[#040b14] p-7 shadow-[0_60px_180px_-70px_rgba(2,6,23,1),0_24px_60px_-40px_rgba(14,165,233,0.14),inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-9">
          <div className="flex flex-col items-center text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,#1b4d66_0%,#0b1721_68%,#05080b_100%)]">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_14px_rgba(45,212,191,0.6)]" />
              </span>
              TeleGuard Pro
            </Link>

            <span className="mt-7 inline-flex rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
              {eyebrow}
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-[2.1rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>

          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}

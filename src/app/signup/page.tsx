import Link from "next/link";

import { signupAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Sign Up"
      title="Create account"
      description="Start with your workspace access."
    >
      <form action={signupAction} className="mx-auto grid max-w-lg gap-5">
        {params.error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {params.error}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="text-sm font-medium text-slate-200"
            >
              First name
            </label>
            <input
              id="first-name"
              name="first_name"
              type="text"
              placeholder="Asha"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
            />
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="text-sm font-medium text-slate-200"
            >
              Last name
            </label>
            <input
              id="last-name"
              name="last_name"
              type="text"
              placeholder="Sharma"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="signup-email"
            className="text-sm font-medium text-slate-200"
          >
            Work email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="ops@carrier.com"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="text-sm font-medium text-slate-200"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Telecom operator or partner"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="signup-password"
              className="text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition hover:text-cyan-200"
            >
              Have an account
            </Link>
          </div>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
          />
        </div>
        <button type="submit" className="auth-primary-button">
          <span className="auth-primary-button__border" />
          <span className="auth-primary-button__label">Sign Up</span>
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-white transition hover:text-cyan-200"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

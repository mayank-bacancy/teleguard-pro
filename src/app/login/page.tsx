import Link from "next/link";

import { loginAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Login"
      title="Welcome back"
      description="Sign in to continue."
    >
      <form action={loginAction} className="mx-auto max-w-lg space-y-5">
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />

        {params.error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {params.error}
          </div>
        ) : null}

        {params.message ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {params.message}
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-200">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="team@teleguardpro.com"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <Link
              href="/signup"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition hover:text-cyan-200"
            >
              Need access
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
          />
        </div>
        <button type="submit" className="auth-primary-button">
          <span className="auth-primary-button__border" />
          <span className="auth-primary-button__label">Login</span>
        </button>
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-white transition hover:text-cyan-200"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

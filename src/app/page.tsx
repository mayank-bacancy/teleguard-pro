export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#123042_0%,#08141b_42%,#05080b_100%)] px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm tracking-[0.2em] text-cyan-200 uppercase">
            TeleGuard Pro
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Telecom fraud detection workspace is ready for the next build step.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              The base Next.js app, Tailwind, Supabase helpers, and health
              endpoints are in place. Add Supabase credentials in `.env.local`
              before testing backend connectivity.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Project base</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Next.js App Router with TypeScript, Tailwind CSS, ESLint, and the
              recommended source layout from the setup guide.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Health checks</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              `GET /api/health` and `GET /api/health/db` are scaffolded for app
              and Supabase connectivity verification.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Next action</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Populate `.env.local`, connect Supabase, and move into schema and
              dashboard development.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

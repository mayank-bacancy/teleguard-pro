# Supabase Connection Step

This is the next step after project setup.

Goal:

- connect the Next.js app to Supabase
- verify environment variables
- keep reusable Supabase clients in the correct folders
- expose health endpoints for app and database checks
- make the connection easy to test before building the schema

## Current Project Structure

This guide matches the current project inside:

```text
tele-guard-pro/
```

Relevant files:

```text
src/lib/supabase/browser.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
src/app/api/health/route.ts
src/app/api/health/db/route.ts
src/types/database.ts
supabase/health-check.sql
```

## 1. Environment Variables

Verify `.env.local` exists in the project root:

```text
tele-guard-pro/.env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used by browser and server clients
- `SUPABASE_SERVICE_ROLE_KEY` is only for trusted server-side operations
- never expose the service role key in client components

## 2. Supabase Client Files

### `src/lib/supabase/browser.ts`

Use this in client components.

Purpose:

- browser-safe Supabase client
- uses `NEXT_PUBLIC_*` environment variables

### `src/lib/supabase/server.ts`

Use this in:

- server components
- route handlers
- server actions

Purpose:

- creates a server client with cookie support

### `src/lib/supabase/admin.ts`

Use this only when you need:

- elevated server-side operations
- admin scripts
- trusted inserts or maintenance jobs

Do not import this into client code.

## 3. Health Endpoints

### App Health

Path:

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Database Health

Path:

```text
GET /api/health/db
```

Behavior:

- checks whether Supabase env vars exist
- tries to run `public.health_check()` using Supabase RPC
- falls back to a REST reachability probe if the SQL function does not exist yet

Possible successful responses:

RPC mode:

```json
{
  "status": "ok",
  "database": "reachable",
  "mode": "rpc",
  "result": {
    "status": "ok",
    "checked_at": "2026-03-14T00:00:00+00:00"
  }
}
```

Fallback mode:

```json
{
  "status": "ok",
  "database": "reachable",
  "mode": "rest-probe",
  "message": "Supabase is reachable. Create the public.health_check() SQL function to enable query-based verification."
}
```

## 4. Create the SQL Health Function

Open Supabase SQL Editor and run:

```sql
create or replace function public.health_check()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'status', 'ok',
    'checked_at', now()
  );
$$;

grant execute on function public.health_check() to anon, authenticated;
```

This SQL is also stored in:

[health-check.sql](/home/bacancy/Desktop/hackathon-project/tele-guard-pro/supabase/health-check.sql)

Why this helps:

- gives you a real query-based health check
- does not depend on application tables existing yet
- is safe for early-stage setup

## 5. How to Test Locally

Run the app:

```bash
npm run dev
```

Test:

```text
http://localhost:3000/api/health
http://localhost:3000/api/health/db
```

What success means:

- `/api/health` returns `status: ok`
- `/api/health/db` returns `database: reachable`
- after creating the SQL function, `/api/health/db` should return `mode: rpc`

## 6. Troubleshooting

If `/api/health/db` returns `unconfigured`:

- check `.env.local`
- restart the dev server after editing env values

If `/api/health/db` returns `rest-probe`:

- Supabase is reachable
- run the SQL in `supabase/health-check.sql`

If `/api/health/db` returns `unreachable`:

- verify the project URL
- verify the anon key
- check whether the Supabase project is active

## 7. What Is Complete in This Step

This step is complete when:

- env variables are set
- browser and server clients are in place
- health endpoints respond correctly
- database health works in `rpc` mode

## Next Step

After this, create the first database schema for:

- `call_detail_records`
- `fraud_rules`
- `fraud_alerts`
- `blocked_numbers`

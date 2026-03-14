create table if not exists public.investigation_cases (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null unique references public.fraud_alerts(id) on delete cascade,
  title text not null,
  owner_name text not null default 'Unassigned',
  status text not null default 'open',
  priority text not null default 'medium',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investigation_cases_status_check
    check (status in ('open', 'in_review', 'resolved')),
  constraint investigation_cases_priority_check
    check (priority in ('low', 'medium', 'high', 'critical'))
);

create table if not exists public.case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.investigation_cases(id) on delete cascade,
  author_name text not null default 'Analyst',
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_investigation_cases_status_updated
  on public.investigation_cases (status, updated_at desc);

create index if not exists idx_investigation_cases_priority
  on public.investigation_cases (priority, created_at desc);

create index if not exists idx_case_notes_case_id_created
  on public.case_notes (case_id, created_at desc);

create or replace function public.set_case_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_investigation_cases_updated_at on public.investigation_cases;

create trigger trg_investigation_cases_updated_at
before update on public.investigation_cases
for each row
execute function public.set_case_updated_at();

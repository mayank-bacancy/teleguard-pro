create extension if not exists pgcrypto;

create table if not exists public.call_detail_records (
  id uuid primary key default gen_random_uuid(),
  caller_number text not null,
  receiver_number text not null,
  call_start timestamptz not null,
  call_end timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  call_type text not null default 'voice',
  source_country text not null,
  destination_country text not null,
  source_network text,
  destination_network text,
  cost numeric(12, 4) not null default 0,
  status text not null default 'completed',
  risk_score numeric(5, 2) not null default 0,
  is_suspicious boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.fraud_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  rule_type text not null,
  severity text not null default 'medium',
  threshold_value numeric(12, 2),
  configuration jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.fraud_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  severity text not null default 'medium',
  status text not null default 'open',
  reason text not null,
  risk_score numeric(5, 2) not null default 0,
  cdr_id uuid references public.call_detail_records(id) on delete set null,
  rule_id uuid references public.fraud_rules(id) on delete set null,
  source_number text not null,
  created_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz
);

create table if not exists public.blocked_numbers (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null unique,
  reason text not null,
  source_alert_id uuid references public.fraud_alerts(id) on delete set null,
  blocked_by_rule_id uuid references public.fraud_rules(id) on delete set null,
  is_active boolean not null default true,
  blocked_at timestamptz not null default now(),
  unblocked_at timestamptz
);

create index if not exists idx_cdr_caller_number
  on public.call_detail_records (caller_number);

create index if not exists idx_cdr_call_start
  on public.call_detail_records (call_start desc);

create index if not exists idx_cdr_suspicious
  on public.call_detail_records (is_suspicious, risk_score desc);

create index if not exists idx_alert_status_created
  on public.fraud_alerts (status, created_at desc);

create index if not exists idx_alert_source_number
  on public.fraud_alerts (source_number);

create index if not exists idx_blocked_numbers_active
  on public.blocked_numbers (is_active, blocked_at desc);

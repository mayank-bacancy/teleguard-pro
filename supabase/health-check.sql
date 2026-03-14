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

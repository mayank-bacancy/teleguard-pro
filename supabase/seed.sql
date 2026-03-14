insert into public.fraud_rules (
  name,
  description,
  rule_type,
  severity,
  threshold_value,
  configuration
)
values
  (
    'Burst Call Volume',
    'Trigger when one number makes too many calls in a short time window.',
    'burst_calls',
    'high',
    10,
    '{"window_minutes": 5, "threshold": 10}'::jsonb
  ),
  (
    'Multi Country Routing',
    'Trigger when one number calls too many countries in a short period.',
    'country_spread',
    'medium',
    3,
    '{"window_minutes": 15, "distinct_countries": 3}'::jsonb
  ),
  (
    'High Duration Usage',
    'Trigger when call duration crosses an unusual threshold.',
    'duration_spike',
    'medium',
    1800,
    '{"duration_seconds": 1800}'::jsonb
  )
on conflict (name) do update
set
  description = excluded.description,
  rule_type = excluded.rule_type,
  severity = excluded.severity,
  threshold_value = excluded.threshold_value,
  configuration = excluded.configuration,
  is_active = true;

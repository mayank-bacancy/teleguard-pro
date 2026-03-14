# Fake CDR Seed Data Step

This step starts after the schema in [DATABASE_SCHEMA.md](/home/bacancy/Desktop/hackathon-project/tele-guard-pro/DATABASE_SCHEMA.md).

Goal:

- insert realistic sample call detail records
- mix normal and suspicious traffic
- make the dashboard and fraud logic testable immediately

## What To Run

After running the schema migration, run:

[seed-cdr.sql](/home/bacancy/Desktop/hackathon-project/tele-guard-pro/supabase/seed-cdr.sql)

You can run it in Supabase SQL Editor.

## What This Seed Adds

The file inserts:

- normal domestic calls
- normal international calls
- burst-call suspicious activity
- high-duration suspicious activity
- multi-country suspicious activity

## Why This Step Matters

Without fake CDR data:

- dashboard cards stay empty
- alert generation cannot be tested
- blocking logic has nothing to evaluate

With seeded CDR data:

- you can build charts and tables immediately
- you can test one fraud rule at a time
- you can create alerts from known bad scenarios

## Recommended Validation

After running the seed:

1. Open Supabase Table Editor
2. Check `call_detail_records`
3. Confirm rows were inserted
4. Verify some rows have:
   - `is_suspicious = true`
   - higher `risk_score`
   - suspicious metadata tags

## Suggested Next Build Step

After seed data, implement:

- one fraud detection service
- one alert creation flow

Best first rule:

- if a record has `risk_score >= 80` or `is_suspicious = true`, generate an alert

## Next Step

After this, I should create:

- a simple fraud detection service in `src/services/`
- an API or server action to generate alerts from suspicious CDRs

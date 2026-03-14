# Case Management Schema Step

This is the first step for [CASE_MANAGEMENT_STEP.md](/home/bacancy/Desktop/hackathon-project/tele-guard-pro/CASE_MANAGEMENT_STEP.md).

## Goal

Create the minimum database structure required for analyst case management.

After this step, the database will support:

- creating an investigation case from an alert
- assigning ownership
- tracking case status
- storing analyst notes

## Why This Step Comes First

The case-management UI should not be built before the database model exists.

This step gives the app a proper backend structure for:

- case records
- note history
- alert-to-case linkage

## Tables To Create

### `investigation_cases`

Purpose:

- one record per investigation workflow
- linked to one source fraud alert
- tracks owner, status, and summary

Recommended fields:

- `id`
- `alert_id`
- `title`
- `owner_name`
- `status`
- `priority`
- `summary`
- `created_at`
- `updated_at`

### `case_notes`

Purpose:

- stores analyst notes for each case
- creates a simple activity trail

Recommended fields:

- `id`
- `case_id`
- `author_name`
- `note`
- `created_at`

## SQL File

Run this file in Supabase SQL Editor:

[case-management-schema.sql](/home/bacancy/Desktop/hackathon-project/tele-guard-pro/supabase/case-management-schema.sql)

## What The SQL Does

It creates:

- `public.investigation_cases`
- `public.case_notes`
- foreign keys to `fraud_alerts`
- indexes for common case and note lookups
- an `updated_at` trigger for cases

## Data Rules

- one alert can be linked to at most one investigation case
- one case can have many notes
- status should start simple:
  - `open`
  - `in_review`
  - `resolved`
- priority should stay simple:
  - `low`
  - `medium`
  - `high`
  - `critical`

## Success Criteria

This step is complete when:

- `investigation_cases` exists in Supabase
- `case_notes` exists in Supabase
- a case can be inserted with an `alert_id`
- a note can be inserted with a `case_id`

## Next Step

After this schema step, the next implementation step is:

- case service layer
- `/cases`
- `/cases/[id]`
- case creation from alert detail

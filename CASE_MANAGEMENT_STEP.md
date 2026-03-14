# Case Management And Analyst Workflow Step

This is the next step after:

- setup
- Supabase connection
- database schema
- seed data
- dashboard
- fraud workflow generation
- alert management
- investigation workflow
- blocked numbers management
- rules management
- analytics
- realtime simulation

## Why This Step Is Next

The product now has:

- live monitoring
- alert generation
- investigation views
- containment controls
- analytics
- realtime simulation

That is already strong for a hackathon.

But one major gap remains:

there is no persistent analyst workflow.

Right now an alert can be viewed and updated, but the system does not support:

- investigation notes
- analyst ownership
- case progression
- audit-style incident tracking

That makes the product feel less complete than a real telecom fraud operations platform.

## Goal

Build a case management layer on top of alerts.

After this step, the app should support:

- creating or linking an investigation case from an alert
- assigning case ownership
- adding analyst notes
- tracking case status
- showing a case timeline or activity feed

## Why It Matters For The Hackathon

This step makes the platform feel like an actual operations product instead of only a detection console.

Judges should be able to see:

- risk is detected
- incidents are investigated
- actions are documented
- ownership exists
- workflow is traceable

That is much closer to enterprise SOC tooling.

## Scope For This Step

Build these routes:

- `/cases`
- `/cases/[id]`

Optional integration:

- link alert detail pages to case detail pages

## Required Data Layer

This step will likely need at least one new table:

- `investigation_cases`

Recommended optional supporting table:

- `case_notes`

## Suggested Schema Shape

### `investigation_cases`

Fields:

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

Fields:

- `id`
- `case_id`
- `author_name`
- `note`
- `created_at`

## Required UI Modules

### 1. Cases List Page

Purpose:

- show all open and historical cases
- display ownership and status
- link back to source alert

Columns:

- case title
- linked alert
- owner
- status
- priority
- updated at

### 2. Case Detail Page

Purpose:

- view the case summary
- view the linked alert
- add notes
- change case status
- see the case activity flow

Sections:

- case overview
- linked alert reference
- analyst notes
- status controls
- activity timeline

### 3. Case Creation From Alert

Add a control from alert detail to:

- create a case if none exists
- open the existing case if already linked

## Required Backend Work

Create service responsibilities for:

- creating a case from an alert
- fetching all cases
- fetching one case with notes
- adding case notes
- updating case status

Suggested files:

```text
src/services/cases.ts
src/app/cases/page.tsx
src/app/cases/[id]/page.tsx
src/app/actions/cases.ts
src/components/cases/
```

## UX Standard For This Step

The case workflow should feel disciplined and operational.

Requirements:

- clear ownership indicators
- clear case status progression
- notes should be readable and timestamped
- activity should feel chronological
- layout should stay consistent with the SOC visual language

## Build Order Inside This Step

Implement in this order:

1. schema update for cases and notes
2. case service layer
3. cases list page
4. case detail page
5. note creation action
6. case creation link from alert detail

## Success Criteria

This step is successful when:

- user can open `/cases`
- user can open `/cases/[id]`
- user can create a case from an alert
- user can add notes
- user can change case status
- system shows a documented analyst workflow

## What This Step Adds To The Story

After this step, the product story becomes:

`detect -> alert -> investigate -> document -> contain -> analyze`

That is a much stronger enterprise-style narrative for a hackathon demo.

## What Likely Comes After

After case management, the next strong candidate will be:

- telecom-specific network topology/security view
- SS7 / signaling simulation layer
- executive reporting export

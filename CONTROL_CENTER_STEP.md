# Blocked Numbers And Rules Management Step

This is the next step after:

- project setup
- Supabase connection
- database schema
- seed data
- dashboard
- fraud workflow trigger
- alert management
- investigation detail view

## Why This Step Is Next

The app now supports:

- CDR visibility
- fraud alert generation
- alert queue
- alert investigation
- alert status updates

But it still lacks operator control surfaces.

Right now analysts can see and review incidents, but they cannot properly manage:

- blocked numbers
- fraud rules

That makes the product feel incomplete.

## Goal

Build the control center modules that let operators manage containment and detection logic.

After this step, the app should support:

- viewing blocked numbers
- seeing why a number is blocked
- manually unblocking a number
- viewing active fraud rules
- enabling or disabling a rule
- reviewing rule thresholds and configuration

## Why It Matters For The Hackathon

This step adds the product behavior judges expect from a real telecom fraud operations platform:

- analysts can investigate alerts
- operators can contain threats
- admins can tune detection logic

Without this step, the system is still mostly read-only.

With this step, the product becomes operational.

## Scope For This Step

Build these routes:

- `/blocked-numbers`
- `/rules`

Keep `/` and `/alerts` as already implemented.

## Required UI Modules

### 1. Blocked Numbers Page

Purpose:

- list all blocked numbers
- show block source and reason
- show active or inactive state
- allow unblocking for active entries

Columns:

- phone number
- reason
- source alert
- blocked by rule
- blocked at
- state
- action

### 2. Rules Page

Purpose:

- list all fraud rules
- show severity and threshold
- show active state
- allow enable/disable

Columns:

- name
- rule type
- severity
- threshold
- active state
- created at
- action

## Required Backend Work

Create service responsibilities for:

- fetching blocked numbers
- updating blocked number active state
- fetching fraud rules
- toggling fraud rule active state

Suggested files:

```text
src/services/control-center.ts
src/app/blocked-numbers/page.tsx
src/app/rules/page.tsx
src/app/actions/control-center.ts
src/components/control-center/
```

## Data Rules

Use existing tables only:

- `blocked_numbers`
- `fraud_rules`
- `fraud_alerts`

No schema change is required for this step.

## UX Standard For This Step

The interface should feel like a telecom SOC control layer.

Requirements:

- dense operational layout
- clear state indicators
- strong action hierarchy
- no generic admin-panel feel
- support both desktop and mobile use

## Build Order Inside This Step

Implement in this order:

1. blocked numbers service and page
2. unblock action
3. rules service and page
4. rule toggle action
5. navigation from dashboard and alerts views

## Success Criteria

This step is successful when:

- user can open `/blocked-numbers`
- user can unblock an active number
- user can open `/rules`
- user can enable or disable a fraud rule
- control actions update Supabase and reflect in the UI

## What Will Be Complete After This Step

After this step, the MVP will have:

- monitoring
- alerting
- investigation
- blocking visibility
- rule control

That is a much stronger hackathon story because the product will show a full security workflow:

`detect -> alert -> investigate -> contain -> tune rules`

## What Likely Comes After

After this step, the next strong candidate will be:

- analytics and historical trends
- realtime refresh
- investigation notes or case management

# Alert Management And Investigation Step

This is the next step after:

- project setup
- Supabase connection
- database schema
- seed data
- initial dashboard
- basic fraud alert generation

## Why This Step Is Next

Right now the product has:

- one main dashboard
- a fraud workflow trigger
- alert creation in the backend
- auto-blocking for high-risk numbers

But it still does not feel like a complete telecom fraud operations system because there is no dedicated operational surface for analysts to work with alerts.

This step fixes that.

## Goal

Build a real alert management and investigation workflow.

After this step, the app should support:

- browsing all alerts
- filtering alerts by severity and status
- opening one alert in detail
- seeing the related CDR and rule context
- updating alert status
- reviewing blocked-number impact

## Why It Matters For The Hackathon

This is the step that turns the app from:

`dashboard demo`

into:

`usable fraud operations product`

Judges will expect more than charts. They need to see a clear analyst workflow.

## Scope For This Step

Build these routes:

- `/`
  keep the dashboard as command center
- `/alerts`
  alert queue and filtering
- `/alerts/[id]`
  alert detail and investigation view

## Required UI Modules

### 1. Alerts List Page

Purpose:

- show all fraud alerts
- filter by `status`
- filter by `severity`
- sort by latest first

Columns:

- title
- source number
- severity
- status
- risk score
- created at

### 2. Alert Detail Page

Purpose:

- inspect one alert deeply
- connect alert to the related call record
- show the matched fraud rule
- show block status

Sections:

- alert summary
- related CDR details
- matched rule details
- block status
- timeline metadata

### 3. Alert Status Actions

Allow these actions:

- `open`
- `acknowledged`
- `resolved`

Use:

- server actions
- Supabase update queries

## Required Backend Work

Create these service responsibilities:

- fetch alerts list
- fetch single alert detail
- update alert status
- fetch related CDR
- fetch related rule
- fetch related blocked number

Suggested files:

```text
src/services/alerts.ts
src/app/alerts/page.tsx
src/app/alerts/[id]/page.tsx
src/app/actions/alerts.ts
src/components/alerts/
```

## Data Rules

Use the existing tables:

- `fraud_alerts`
- `call_detail_records`
- `fraud_rules`
- `blocked_numbers`

No new tables are required for this step.

## UX Standard For This Step

The product should feel like a SOC console, not a CRUD admin panel.

Requirements:

- dark visual language
- dense but readable information
- strong severity coloring
- clear analyst actions
- useful empty states
- mobile-safe layout

## What Will Be Complete After This Step

After this step, the project will have:

- dashboard overview
- alert generation
- alert queue
- alert detail view
- status updates
- blocking visibility

At that point, the MVP will feel much more complete.

## What Remains After This Step

Then the next likely steps will be:

- blocked numbers management page
- fraud rules management page
- historical analytics widgets
- optional realtime refresh

## Build Order Inside This Step

Implement in this order:

1. alerts service layer
2. alerts list page
3. alert detail page
4. status update action
5. navigation from dashboard to alerts

## Success Criteria

This step is successful when:

- user can open `/alerts`
- user can open `/alerts/[id]`
- user can change alert status
- alert detail clearly shows why the alert exists
- product feels like an investigation workflow, not just a chart dashboard

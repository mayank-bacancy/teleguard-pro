# Analytics And Historical Trends Step

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

## Why This Step Is Next

The product now supports the operational workflow:

- monitor
- detect
- alert
- investigate
- contain
- tune rules

That is good for product depth.

But to stand out in a hackathon, the app also needs a strong executive and analytical layer.

Judges should be able to see:

- trend movement
- risk concentration
- fraud impact
- detection efficiency

Without analytics, the platform still feels tactical only.

## Goal

Build a dedicated analytics surface showing historical fraud and operational performance trends.

After this step, the app should support:

- historical call volume trends
- suspicious activity trends
- alert volume trends
- blocked number trends
- risk distribution snapshots
- simple fraud impact metrics

## Route To Build

Create:

- `/analytics`

## Required UI Modules

### 1. Trend Overview Cards

Show:

- total CDR volume
- suspicious call percentage
- total alerts
- active blocks
- average risk score

### 2. Historical Trend Charts

At minimum:

- call volume over time
- suspicious calls over time
- alerts created over time

These can be built from seeded timestamps already stored in Supabase.

### 3. Distribution Panels

Show:

- alerts by severity
- calls by country pair
- suspicious scenarios by type

### 4. Performance Signals

Show simple system signals such as:

- open vs resolved alerts
- response workload
- containment coverage

## Required Backend Work

Create service responsibilities for:

- aggregating CDR counts by time bucket
- aggregating suspicious counts by time bucket
- aggregating alert counts by time bucket
- summarizing severity distribution
- summarizing scenario distribution from CDR metadata

Suggested files:

```text
src/services/analytics.ts
src/app/analytics/page.tsx
src/components/analytics/
```

## Data Rules

Use existing tables:

- `call_detail_records`
- `fraud_alerts`
- `blocked_numbers`
- `fraud_rules`

Do not change schema for this step.

If a complex SQL query is needed, keep it inside the service layer.

## UX Standard For This Step

This page should feel like a serious fraud intelligence board, not a generic BI dashboard.

Requirements:

- strong visual hierarchy
- clear chart labeling
- meaningful color system
- concise KPI explanations
- responsive chart layout

## Build Order Inside This Step

Implement in this order:

1. analytics service aggregations
2. KPI summary cards
3. trend charts
4. distribution panels
5. add navigation to analytics

## Success Criteria

This step is successful when:

- user can open `/analytics`
- page shows historical metrics from Supabase data
- charts are readable and useful
- trends help explain the system state
- the app feels broader than a CRUD security console

## What This Step Adds To The Hackathon Story

After this step, the project will show both:

- operational workflow
- analytical insight

That makes the demo much stronger because it serves:

- analysts
- operators
- decision-makers

## What Likely Comes After

After analytics, the next strong candidate will be:

- realtime simulation and auto-refresh
- case management notes
- telecom-specific network security simulation

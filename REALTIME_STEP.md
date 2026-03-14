# Realtime Simulation And Live Refresh Step

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

## Why This Step Is Next

The product now has strong breadth:

- dashboard
- alerts
- investigation
- blocked numbers
- rule control
- analytics

But it still behaves like a mostly static system unless the operator manually refreshes or reruns actions.

For a hackathon demo, that weakens the perception of “real-time telecom fraud detection”.

This step improves that.

## Goal

Build a realtime simulation layer and live refresh experience.

After this step, the app should support:

- simulated new CDR activity generation
- visible data changes without manual page reload
- near-live alert and dashboard updates
- a stronger “SOC in motion” feeling during demo

## Why It Matters For The Hackathon

Judges respond strongly to movement and feedback loops.

If the app shows:

- new events coming in
- metrics changing
- alerts appearing
- blocks updating

then the product feels much more like a real monitoring system.

## Scope For This Step

Add:

- a simulation trigger
- optional auto-refresh controls
- live-refresh behavior on key pages

Primary pages to support:

- `/`
- `/alerts`
- `/analytics`

## Required Features

### 1. Simulation Trigger

Create a control that can:

- insert a small batch of new simulated CDR rows
- optionally include a mix of normal and suspicious traffic

Suggested route or action:

- server action
- or `/api/simulation/run`

### 2. Live Refresh

Use one of these approaches:

- periodic client refresh
- server action result with route revalidation
- Supabase realtime if practical

For hackathon speed, a controlled polling or refresh strategy is acceptable.

### 3. Activity Feedback

The UI should show:

- when a simulation batch was generated
- how many new rows were inserted
- how many alerts were created
- whether blocks changed

## Required Backend Work

Create service responsibilities for:

- generating simulated CDR batches
- returning summary stats from the simulation run
- reusing existing fraud workflow generation after inserts

Suggested files:

```text
src/services/simulation.ts
src/app/actions/simulation.ts
src/components/realtime/
```

## Data Rules

Use the existing schema.

Do not change tables unless absolutely necessary.

Generated CDRs should:

- look realistic
- include timestamps close to now
- include a mix of low-risk and high-risk cases

## UX Standard For This Step

The experience should feel deliberate, not gimmicky.

Requirements:

- clear operator control
- visible results after simulation
- no noisy or distracting animations
- pages should still feel professional

## Build Order Inside This Step

Implement in this order:

1. simulation service
2. simulation server action
3. realtime control component
4. refresh integration on dashboard and alerts
5. optional analytics refresh integration

## Success Criteria

This step is successful when:

- user can trigger a simulation run
- new CDR data is inserted
- fraud workflow can run on the new data
- dashboard and alerts reflect changes without full manual workflow
- demo feels closer to real-time monitoring

## What This Step Adds To The Story

After this step, the product story becomes:

`simulate telecom activity -> detect risk -> generate alerts -> investigate -> contain -> analyze trends`

That is much stronger in a live demo than a static seeded database.

## What Likely Comes After

After realtime support, the next strong candidate will be:

- case management notes
- investigation assignments
- telecom-specific security simulation views

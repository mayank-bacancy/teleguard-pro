# Live Data Ingestion Step

This is the next step after:

- setup
- Supabase connection
- schema
- seed data
- dashboard
- alerts
- investigation
- control center
- analytics
- realtime simulation
- case management
- network security

## Why This Step Is Next

The product now has strong UI and workflow coverage.

What it still lacks is a stronger answer to:

- where does new telecom data come from
- how does it enter the system
- how do we move beyond static seed-only records

For a hackathon, even a simulated ingestion pipeline is valuable because it shows the platform can accept live traffic instead of only displaying preloaded data.

## Goal

Build a usable ingestion layer for live or near-live CDR data.

After this step, the app should support:

- manual CSV upload
- API-based CDR ingestion
- normalization into `call_detail_records`
- automatic downstream fraud workflow triggering

## Route To Build

Create:

- `/ingestion`

## Required Features

### 1. CSV Upload

Allow an operator to upload a CDR CSV file.

Expected behavior:

- parse rows
- validate required fields
- insert valid rows into Supabase
- report success and failed rows

### 2. API Ingestion Endpoint

Add an ingestion endpoint for external systems.

Suggested route:

- `/api/ingestion/cdr`

Expected behavior:

- accept batched CDR payloads
- validate request body
- insert normalized rows
- optionally trigger fraud workflow after insert

### 3. Ingestion Status UI

Show:

- last ingestion time
- rows processed
- rows rejected
- source type

## Suggested Files

```text
src/services/ingestion.ts
src/app/ingestion/page.tsx
src/app/api/ingestion/cdr/route.ts
src/components/ingestion/
```

## Data Rules

Use existing `call_detail_records` schema.

Do not add unnecessary tables unless you need a small ingestion log table later.

## Success Criteria

This step is successful when:

- user can upload a CSV
- API can insert CDR batches
- inserted rows appear in dashboard/alerts/network-security
- system feels capable of handling live inbound telecom data

## What This Adds To The Story

After this step, the product story becomes:

`ingest telecom traffic -> detect -> alert -> investigate -> contain -> analyze`

That is stronger than saying the platform only works with manually seeded data.

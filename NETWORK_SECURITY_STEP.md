# Network Security And Telecom Topology Step

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
- case management

## Why This Step Is Next

The product now has strong workflow depth:

- detection
- alerting
- investigation
- containment
- analytics
- realtime activity
- case documentation

But it still looks close to a strong generic fraud/SOC platform.

To stand out in a telecom hackathon, the product now needs a telecom-specific security layer.

## Goal

Build a telecom-focused network security and route intelligence surface.

After this step, the app should support:

- route-level telecom risk visibility
- topology-style network overview
- suspicious international route highlighting
- protocol/security simulation framing

## Route To Build

Create:

- `/network-security`

## Required UI Modules

### 1. Network Topology Panel

Purpose:

- visually represent telecom traffic paths
- show high-risk route concentration
- highlight suspicious regions or nodes

### 2. Route Risk Table

Purpose:

- show source country
- destination country
- call volume
- suspicious call count
- average risk score

### 3. Security Signals Panel

Purpose:

- simulate telecom protocol monitoring concepts
- present signals such as:
  - suspicious roaming activity
  - route abuse
  - signaling anomaly indicators

## Required Backend Work

Create service responsibilities for:

- aggregating route pairs from CDRs
- calculating route risk scores
- summarizing suspicious country paths
- preparing topology-style node/link data

Suggested files:

```text
src/services/network-security.ts
src/app/network-security/page.tsx
src/components/network-security/
```

## Data Rules

Use current CDR and alert data.

Do not add real SS7 integrations.

Keep this as a telecom-security simulation layer built from:

- call routes
- suspicious scenarios
- alert data

## UX Standard For This Step

This page should feel distinctly telecom-specific.

Requirements:

- route-centric visual language
- strong geographic/network framing
- clear risk concentration signals
- no generic admin-table-only look

## Build Order Inside This Step

Implement in this order:

1. route aggregation service
2. route risk table
3. topology visualization
4. security signals panel
5. navigation integration

## Success Criteria

This step is successful when:

- user can open `/network-security`
- the app shows risky route pairs clearly
- telecom context is obvious from the UI
- the product feels more domain-specific than a generic SOC dashboard

## What This Step Adds To The Story

After this step, the product story becomes:

`telecom traffic -> route risk -> alerting -> investigation -> containment -> analyst case workflow`

That is a stronger hackathon story because it makes the domain specificity much clearer.

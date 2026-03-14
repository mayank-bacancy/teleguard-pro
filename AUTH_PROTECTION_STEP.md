# Auth And Protected Routes Step

This step adds real authentication with Supabase and protects the product
workspace so public users cannot access operational routes without logging in.

## Current Status

### Done

- project setup
- Supabase connection
- database schema
- seed data
- dashboard
- alert generation
- alert management
- blocked numbers management
- rules management
- analytics
- realtime simulation
- case management
- network security
- live ingestion
- revenue assurance
- SS7 signaling simulation
- export and reporting
- marketing landing page
- public pages:
  - `/`
  - `/solutions`
  - `/services`
  - `/about-us`
  - `/contact-us`
  - `/login`
  - `/signup`
  - `/privacy-policy`
  - `/terms-of-service`
- auth page UI

### Not Done

- Supabase Auth signup
- Supabase Auth login
- logout flow
- session-aware header / redirects
- route protection for product pages
- route protection for sensitive APIs
- unauthorized redirect handling
- auth-aware dashboard entry

## Status Against Requirement

### Covered Well

- real-time CDR analysis
- basic fraud rule engine
- automated blocking
- alert management system
- fraud investigation workflows
- network topology / telecom security flavor
- historical analytics
- revenue assurance dashboard
- API integration capability
- reporting

### Covered In MVP Form

- SS7 protocol security monitoring
- threshold-based monitoring
- geo / route fraud detection
- whitelist / blacklist style block management

### Still Missing Or Not Yet Complete

- authentication and protected operator access
- escalation / notification channels
- full multi-tenancy support
- roaming fraud specific flows
- SIM box specific detection logic
- rate plan validation
- compliance reporting depth
- custom report builder
- broader telecom protocol coverage like Diameter / SMPP

## Why This Step Matters Now

The product already looks like a working telecom fraud platform. The biggest
operational gap now is access control.

Right now:
- public users can still open product routes directly
- login and signup are UI only
- the app does not yet behave like a secured operator product

After this step:
- public pages stay open
- product pages require authentication
- operators can sign up, log in, and log out
- protected APIs can trust the user session

## Scope Of This Step

### Public Routes That Stay Open

- `/`
- `/solutions`
- `/services`
- `/about-us`
- `/contact-us`
- `/login`
- `/signup`
- `/privacy-policy`
- `/terms-of-service`

### Product Routes That Must Be Protected

- `/dashboard`
- `/alerts`
- `/alerts/[id]`
- `/blocked-numbers`
- `/rules`
- `/analytics`
- `/cases`
- `/cases/[id]`
- `/network-security`
- `/ingestion`
- `/revenue-assurance`
- `/signaling-security`
- `/reports`

### API Surfaces To Review For Protection

- `/api/alerts/generate`
- `/api/ingestion/cdr`
- `/api/reports/alerts.csv`
- `/api/reports/cases.csv`
- `/api/reports/blocked-numbers.csv`

Health endpoints can remain open for now:
- `/api/health`
- `/api/health/db`

## Expected Deliverables

1. Supabase Auth integration for signup
2. Supabase Auth integration for login
3. logout action
4. middleware-based route protection
5. redirect unauthenticated users to `/login`
6. redirect authenticated users away from `/login` and `/signup`
7. session-aware product navigation entry
8. protect sensitive API endpoints

## Suggested Implementation Order

1. create auth server actions
2. wire signup form to Supabase Auth
3. wire login form to Supabase Auth
4. add logout action
5. add middleware for route protection
6. protect API endpoints that mutate or export sensitive data
7. update landing/header behavior for logged-in users

## Notes

- keep the current public marketing pages open
- do not add complex RBAC in this step
- do not add multi-tenant auth in this step
- focus on one clean operator auth flow first

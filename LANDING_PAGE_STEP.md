# Landing Page Step

This step creates the public-facing marketing surface for TeleGuard Pro and moves
the operational product workspace to a dedicated route.

## Goals

- move the product dashboard from `/` to `/dashboard`
- create a modern landing page at `/`
- add a strong header and footer
- add working marketing routes linked from the landing page
- add login and signup routes so the public surface feels complete
- add privacy and terms routes for trust and completeness

## Routes In Scope

- `/`
- `/dashboard`
- `/product`
- `/services`
- `/about`
- `/contact`
- `/login`
- `/signup`
- `/privacy-policy`
- `/terms-of-service`

## Landing Page Requirements

- clean, modern, marketing-friendly layout
- clear hero with product value proposition
- feature highlights tied to actual product capabilities
- sections for product, services, about, and contact
- strong calls to action
- subtle motion and animation without hurting clarity
- links to the working product experience

## Header Requirements

- brand
- product links
- section anchors or route links
- login link
- signup link
- primary CTA to open the product workspace

## Footer Requirements

- product links
- service links
- company links
- policy links
- copyright line with `2026`

## Notes

- auth pages in this step are route-complete but not yet wired to Supabase Auth
- actual auth integration should happen in the next dedicated auth step
- every link exposed on the landing page should resolve to a working route

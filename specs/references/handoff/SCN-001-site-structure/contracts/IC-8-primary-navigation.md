---
id: IC-8
title: Primary navigation shell
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-03
---

## Purpose
Provide consistent access to key areas (Products, Dealers, Support, Blog, Brand) across desktop and mobile while keeping dealer discovery one click away.

## Layout
- Desktop: horizontal bar with logo left, nav links centered, CTAs right (`Find a Dealer`, language toggle `IC-6`, theme toggle).
- Mobile: hamburger menu reveals drawer containing same links in priority order plus support contact summary.

## Links (order & labels)
1. `Bicycles` → `/catalog`
2. `Models` → `/models`
3. `Brand` → `/brand-story`
4. `Blog` → `/blog`
5. `Support` → `/support`
6. Primary CTA button: `Find a Dealer` → `/dealers`

## Behaviour
- Dealer CTA remains visible on all breakpoints and triggers analytics `event_name=dealer_directions_click`.
- Focus trap inside mobile drawer; ESC closes. Support for keyboard navigation with visible focus styles.
- Current page indicates active state via underline + `aria-current="page"`.
- Links hydrate from `nav.config.ts` (frozen JSON/TS config reviewed alongside this contract).

## Empty/error states
- If navigation config missing a link slug, component throws build-time error (static validation).
- On GA4 failure, CTA navigation still proceeds; analytics failure logged as warning.

## Events / Analytics
- Emits `site.interaction.analytics.v1` with:
  - `event_name` in `{dealer_directions_click, support_whatsapp_click, support_email_click, primary_nav_click}`
  - `cta_id` matching slug (e.g. `dealers`, `support_whatsapp`)
  - `locale`, `theme`, `position` (`top_nav`, `drawer`).

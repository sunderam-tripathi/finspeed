---
id: IC-16
title: Support hub & contact channels
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Centralize Finspeed support options (WhatsApp, email, phone, knowledge base) with clear expectations on response times, multilingual FAQs, and escalation guidance.

## Layout
- Overview card summarizing support hours, SLA, and emergency guidance.
- Channel tiles for WhatsApp, phone, email, dealer support, each with CTA button and availability indicator.
- FAQ accordion grouped by topic (orders, service, bikes) with search bar.
- Status bar for live incident banner fed by status JSON (`status/support.json`).
- Contact form fallback (Formspree) for less urgent inquiries, referencing `IC-7`.

## Inputs
- Support config `support-channels.json` specifying channel metadata (id, label, description, SLA, icon, destination).
- FAQ content stored as MDX (`content/support/faq/{locale}.mdx`).
- Incident feed `public/status/support.json` maintained by ops.
- Consent state to enable analytics and WhatsApp deep links.

## Behaviors
- Renders contact tiles with real-time availability (e.g., offline status disables CTA with tooltip).
- WhatsApp CTA opens `https://wa.me/{number}` with prefilled message containing locale + page context.
- Email CTA opens `mailto:` with subject template referencing selected reason.
- Support form posts to Formspree (`IC-7`) and shows success/failure inline.
- Search filters FAQs locally and highlights matching text.
- Tracks SLA counters (countdown to support hours close) using local timezone.

## Error & empty states
- If incident feed unreachable, hides status bar and logs `support-status-miss`.
- Missing FAQ content displays fallback message and link to PDF manual.
- Form submission failure guides user to alternate channels.

## Accessibility
- CTA buttons include `aria-label` describing channel and expected response time.
- FAQ accordions follow WAI-ARIA authoring practices with `aria-expanded`, `aria-controls`.
- Provides skip link to jump directly to FAQ search results.

## Data sources
- `public/data/support/support-channels.json`.
- `public/data/support/faq/{locale}.json`.
- Incident status JSON from `status/support.json`.

## Events / Analytics
- Emits `site.interaction.analytics.v1` events:
  - `support_channel_click` with `channel_id`, `locale`, `consent_granted`.
  - `support_faq_search` with `query`, `result_count`.
  - `support_incident_banner_view` with `banner_id`.

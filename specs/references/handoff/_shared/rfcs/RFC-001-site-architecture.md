---
id: RFC-001
title: Finspeed marketing site architecture
status: Accepted
owner: Finspeed Product Owner
last_reviewed: 2025-11-04
---

## Summary
Stand up a bilingual, low-cost marketing site for Finspeed using Next.js static export, Git-based content, and lightweight third-party services (GA4, Formspree, Leaflet/OSM).

## Goals
- Showcase product catalog, dealer locator, blog, and brand story with professional, marine-inspired UI.
- Ensure content parity across English and Hindi with simple developer-maintained workflow.
- Track key engagements (directions, support, subscriptions) without adding paid tooling.

## Architecture decisions
- **Framework**: Next.js with `next export`; static assets served via Vercel/Netlify free tier (DR-005).
- **i18n**: JSON locale files under `public/locales/{lang}` with header toggle component (IC-6).
- **Data sources**: Markdown/CSV in repo for catalog, dealers, blog; GA4 + Formspree for analytics/subscriptions.
- **Maps**: Leaflet + OpenStreetMap tiles (DR-003) to avoid licensing fees.
- **Styling**: Space Grotesk / Orbitron, marine gradient theme, light/dark support.

## Page modules & interfaces
| Requirement | Interface IDs | Notes |
|-------------|---------------|-------|
| REQ-001 Site shell | IC-6, IC-8 | Shared layout, locale/theme toggles, global navigation. |
| REQ-002 Catalog | IC-9, IC-10 | Listing grid + comparison drawer backed by `CATALOG-001`. |
| REQ-003 Model detail | IC-11 | Model hero, specs, sizing, JSON-LD, dealer CTA deep link. |
| REQ-004 Dealer locator | IC-12 | Search panel, Leaflet map, directions & contact CTAs consuming `DEALER-001`. |
| REQ-005 Brand story | IC-13 | Narrative MDX page with timeline, metrics, community carousel. |
| REQ-006 Testimonials | IC-14 | Reusable testimonial carousel embedded across pages. |
| REQ-007 Blog | IC-15 | Listing, tag filters, article rendering, subscription banner leveraging `IC-7`. |
| REQ-008 Support hub | IC-16 | Channel tiles, FAQ search, Formspree fallback using `CONTACT-001`. |

Interfaces are versioned under `61-interfaces/ui-forms/` and copied verbatim into slice handoff packs.

## Content & data sources
- `CATALOG-001` (CSV) → JSON for catalog and model detail slices.
- `DEALER-001` (CSV) → GeoJSON for locator map; includes service tags and SLA notes.
- `CONTACT-001` (YAML) → support channel JSON powering IC-16.
- Brand story MDX (`content/brand-story/{locale}.mdx`), testimonials JSON, and blog MDX compiled via build step (see `60-architecture/C4/container.mmd`).
- Incident status JSON (`status/support.json`) manually curated by support ops for surfacing outages.

All content transformations run in the static build pipeline with schema validation (see `62-data-contracts/json`).

## Observability & events
- Single analytics schema `site.interaction.analytics.v1` extended to cover dealer searches, model interactions, brand storytelling, testimonials, blog engagement, and support usage.
- Consent gating enforced before emitting events; payloads avoid raw PII (hashed email optional on Formspree submission).
- Page-level SLOs: LCP ≤ 2.5s (mobile), CLS < 0.1, JS bundle per route < 180KB gzip (see `NFR-002`).

## Security & privacy
- Support hub limits WhatsApp deep link when consent missing; fallback to email form.
- Dealer search stores only coarse postal prefix for analytics, no precise coordinates.
- JSON-LD validation errors logged client-side without sending raw schema payload.

## Risks & mitigations
- **Translation drift**: Add CI lint to ensure locale keys match (`20-requirements/data/i18n-structure.md`).
- **Formspree quota (50/mo)**: Monitor via weekly runbook; plan upgrade if exceeded.
- **Performance regressions**: Enforce Lighthouse CI budgets (`NFR-002`).
- **Analytics consent**: Cookie banner gating + event schema `site.interaction.analytics.v1` ensure compliance (NFR-001).

## Open questions
- _None — palette frozen (2025-11-04) and Git/Markdown workflow confirmed as long-term publishing model._

## Next steps
- Implement Next.js repo scaffolding with locale structure.
- Automate Playwright/Lighthouse pipelines per `../_shared/tests/test-plan.md`.
- Finalize legal text review before launch.

---
rfc: 0001
title: Site structure, navigation, and localization
status: Accepted
owner: Finspeed Product Owner
last_reviewed: 2025-11-03
links:
  requirements: [REQ-001]
  decisions: [DR-004, DR-005]
  apis: [IC-6, IC-8]
  data_contracts: []
  event_contracts: [site.interaction.analytics.v1]
  runbooks: [RUN-001]
---
## Summary
Publish a bilingual, high-performance marketing site that highlights Finspeed’s product families, keeps dealer access prominent, and respects consent-aware analytics. We will ship a static Next.js build backed by Git-managed content, a frozen navigation contract, and a locale toggle component so implementers can deliver predictable behaviour while meeting NFR budgets and accessibility targets.

## Context
- **Business drivers.** Prospects must quickly understand Finspeed’s offerings, find their nearest dealer, and contact support. Marketing wants English/Hindi parity and future content agility without paying for a CMS today.
- **Scope.** REQ-001 covers landing experience, global navigation, language/theme toggles, dealer/support discoverability, and performance guardrails. Catalog, blog, and support flows have dedicated requirements but rely on the same shell.
- **Assumptions.**
  - Next.js static export deployed to Vercel edge network (per DR-005) with CDN caching.
  - Content (copy, navigation labels, hero assets) remains developer-managed in Git until CMS decision is revisited.
  - GA4 and Formspree integrations are consent-gated via existing privacy notices (NFR-001).
- **Known constraints.** Formspree free tier (50 submissions/mo), Lighthouse budgets from NFR-002, and WCAG 2.1 AA baseline from NFR-003.

## Design
- **Architecture.**
  - `app/` routes static-exported; hero, navigation, dealer CTA, and footer orchestrated in shared layout.
  - Middleware inspects `Accept-Language` and persisted cookie to determine locale; falls back to English when keys missing while logging warnings.
  - Client bundles hydrate lightweight navigation atoms (nav, language toggle, theme toggle). Third-party scripts (`gtag.js`, Formspree) loaded asynchronously after consent.
- **C4 updates.**
  - Context diagram captures visitors, marketing admins, GA4, Formspree, and OpenStreetMap tile service.
  - Container diagram differentiates Edge CDN, Next.js static assets, analytics, and configuration repository.
  - Component diagram freezes contracts for navigation presenter, locale manager, hero module, and dealer CTA.
- **Visual system.** Apply the shared palette, typography, and flow guidance from `../ui-ux-aesthetics.md` so the shell stays consistent with downstream slices.
- **Interfaces.**
  - `IC-6` Language Toggle (status: Frozen, v1.0) defines states, ARIA behaviour, persistence rules, and analytics naming.
  - `IC-8` Primary Navigation (status: Frozen, v1.0) enumerates top-level links, responsive behaviour, and dealer CTA placement.
  - Dealer CTA deep-links to `/dealers`; permanent redirect maintained from `/find-dealer` per DR-007.
- **Data model.** Locale JSON namespaces (`public/locales/{lang}/home.json`) act as immutable assets per build. No runtime PII storage beyond optional locale cookie (non-PII).
- **Events.** `site.interaction.analytics.v1` carries `event_name`, `cta_id`, `from_locale`, `to_locale`, `theme`, guarding against duplicate sends via event-source + timestamp.
- **Security & privacy.** No authenticated surfaces. Respect consent banner before loading analytics. Cookie contains only locale code with 180-day TTL; ignore if consent absent.
- **Observability.** Frontend emits GA4 custom events for dealer clicks, support contacts, theme and locale toggles. Use Web Vitals reporting (`reportWebVitals`) to GA4 for LCP/FID/CLS.
- **Performance budgets.** Ship hero imagery via `next/image` responsive variants; inline critical CSS; lazy-load non-essential sections. Budget: LCP ≤ 2.5s on throttled 4G, CLS < 0.1, TTI < 3.5s.

## Alternatives
- **Headless CMS now.** Rejected due to licensing/onboarding overhead; Git-based content keeps costs near zero until traffic justifies investment.
- **Server-side rendering.** Rejected; static export + CDN meets performance while avoiding runtime hosting complexity.
- **Locale-specific domains.** Rejected; increases SEO management overhead. Locale segmented via path (`/hi`) with hreflang metadata instead.

## Rollout / Migration
1. Freeze navigation and toggle contracts; update locale JSON structure.
2. Implement Next.js layout shell with shared components behind feature branch.
3. Integrate GA4 and Formspree via environment-configured keys, guarded by consent gate.
4. Run Playwright acceptance suite (TST-E2E-001, TST-E2E-007) and Lighthouse CI; remediate regressions.
5. Tag design artifact `design-0.1-REQ-001`, populate handoff pack, and brief engineering on contracts.

## Testability
- Acceptance scenarios encoded in `../_shared/tests/e2e/acceptance.feature` (navigation, hero, language/theme toggles, dealer link).
- Contract coverage: Snapshot/axe audits for `IC-6` and `IC-8`; locale fallbacks verified via unit tests.
- Performance suite: `../_shared/tests/performance/load-plan.md` updated to include home-page Lighthouse budgets.

## Build-Ready Checklist
- RFC accepted: ✅ this document.
- Interfaces frozen: `61-interfaces/ui-forms/language-toggle.md`, `61-interfaces/ui-forms/primary-navigation.md`.
- Data/event contracts: `../_shared/events/site.interaction.analytics.v1.json`.
- Tests: `../_shared/tests/e2e/acceptance.feature`, `../_shared/tests/performance/load-plan.md`.
- Runbook: `67-runbooks/finspeed-launch-checklist.md` (status: Ready).
- Traceability: `traceability/requirements-to-design.md` updated for REQ-001.
- Handoff pack: `handoff/SCN-001-site-structure/` populated with diagrams, contracts, and checklist.

## Open Questions
- Provide brand-approved Hindi copy for hero CTA before engineering handoff.

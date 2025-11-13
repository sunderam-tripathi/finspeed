# Web Handoff Spec Checklist

Source of truth: `specs/references/handoff/README.md` and the SCN-00x packs inside that directory. Every slice below maps directly to the accepted client handoff and must cite the referenced assets, analytics contract (`_shared/contracts/site-interaction-ga4.md`), and deployment runbooks.

## SCN-001 — Site Structure (REQ-001)
**Focus:** Marketing shell (hero, navigation, dealer CTA, locale toggle).  
**Key inputs:** `content/design/hero-copy.md`, `data/locales/{en,hi}/home.json`, `content/design/blueprints/brand-style-guide.md`, analytics contract, deployment spec.

### Execution checklist
- [ ] Implement hero + nav exactly as IC-6/IC-8 with "Turning Pedals into Power" tagline and theme toggle honoring system preference.
- [ ] Wire bilingual shell using the provided locale JSON files; document the content workflow for translations.
- [ ] Surface dealer CTA in the hero and ensure it still links even if client-side navigation dies (provide static anchor fallback).
- [ ] Instrument GA4 events per `site-interaction-ga4.md`, including locale toggle, dealer CTA, and consent gating.
- [ ] Validate UI tokens (Space Grotesk, palette) via lint/a11y sweeps and capture proof screenshots + telemetry.
- [ ] Reference deployment + launch runbook for perf budgets and add the resulting logs to `specs/proofs/web/REQ-001/`.

## SCN-002 — Product Catalog (REQ-002)
**Focus:** Catalog listing with discipline filter, comparison flows, trust badges.  
**Key inputs:** `data/product-catalog.csv`, `asset-manifest.csv`, IC-9/IC-10 contracts, analytics contract.

### Execution checklist
- [ ] Render all eight seed models grouped by discipline and expose the frozen comparison CTA set.
- [ ] Display warranty, service, and EMI value props on every card, pulled from catalog data to avoid divergence.
- [ ] Implement client-side filters + sorting per IC-9/10, with empty-state copy from design pack.
- [ ] Emit GA4 catalog events (filter change, comparison start, card view) behind consent.
- [ ] Cover flows with Playwright/a11y tests plus JSON schema validation for catalog data.
- [ ] Capture parity + production evidence (screenshots, curl, telemetry) in the REQ-002 proof bundle.

## SCN-003 — Model Detail (REQ-003)
**Focus:** Deep detail pages with JSON-LD, sizing guide, dealer CTA failover.  
**Key inputs:** `data/product-catalog.csv`, `content/design/blueprints/llm-search-strategy.md`, IC-11 contract, contact data.

### Execution checklist
- [ ] Drive the entire page (specs, gallery, warranty/EMI badges) from catalog data so JSON-LD stays in sync.
- [ ] Generate Product JSON-LD exactly as described in the LLM search blueprint and validate via schema tests.
- [ ] Keep dealer CTAs functional with outage fallback messaging + analytics logging when locator is down.
- [ ] Expose sizing + financing guidance per IC-11 above the fold.
- [ ] Record GA4 detail page events (gallery, CTA, spec accordion) with consent gating.
- [ ] Add screenshots, schema validation logs, and curl evidence into the REQ-003 proof directory.

## SCN-004 — Dealer Locator (REQ-004)
**Focus:** Postal-code search, Leaflet map, outage simulation, consent-aware analytics.  
**Key inputs:** `data/dealer-locations.csv`, `data/contact-points.yaml`, IC-12 contract, analytics contract.

### Execution checklist
- [ ] Default to radius 20 km with sample postal `201306`; persist user postal entry and validate 6-digit format.
- [ ] Hydrate dealers from `/api/dealers` with fallback to static bundle when fetch fails.
- [ ] Sync results grid with Leaflet map pins; selecting either scrolls/highlights the matching card.
- [ ] Provide outage toggle and inline validation/error states referencing support channels.
- [ ] Send GA4 events (`dealer_search_submitted`, `dealer_map_pin_select`, outage/failure events) only after consent is granted.
- [ ] Package axe + Playwright results, parity/production curl output, and map screenshots in WEB-017 proofs (current slice).

## SCN-005 — Brand Story (REQ-005)
**Focus:** Narrative page with mission, timeline, metrics, CTA strip fallback.  
**Key inputs:** BRAND-001 schema, `content/design/brand-style-guide.md`, IC-13 contract.

### Execution checklist
- [ ] Render mission headline, founders’ story, and sustainability commitments above the first scroll depth using provided copy/assets.
- [ ] Build timeline + impact metrics from BRAND-001 so content updates stay data-driven.
- [ ] Keep CTA strip at the end functional even if global navigation JS fails (static anchors + progressive enhancement).
- [ ] Log GA4 events for timeline interactions and CTA clicks with consent gating.
- [ ] Run SEO/perf audits (lighthouse, structured data) and file artefacts under REQ-005 proofs.
- [ ] Capture bilingual copy review sign-off and uploaded imagery hash references.

## SCN-006 — Testimonials (REQ-006)
**Focus:** Reusable testimonial carousel with autoplay toggle and accessibility compliance.  
**Key inputs:** TESTIMONIAL-001 dataset (`data/testimonials-en.json`), IC-14 contract, accessibility notes.

### Execution checklist
- [ ] Seed carousel with rider, athlete, and dealer quotes; show “Coming Soon” placeholders when a cohort lacks content.
- [ ] Respect `prefers-reduced-motion` by forcing autoplay off + showing the accessibility notice even if users toggle it.
- [ ] Provide keyboard navigation and focus management per IC-14; include Playwright a11y coverage.
- [ ] Emit analytics for slide view, autoplay toggle, and CTA clicks (consent-aware).
- [ ] Package snapshot of testimonial dataset checksum + UI screenshots in REQ-006 proofs.
- [ ] Document reusable component API so other pages can consume it without duplicating logic.

## SCN-007 — Blog (REQ-007)
**Focus:** Bilingual blog listing + article rendering with subscription banner.  
**Key inputs:** BLOG-001 schema, `data/blog/daily-commute-cycling-safety.md`, IC-15 & IC-7 contracts, Formspree config.

### Execution checklist
- [ ] Render listing with tag filters and highlight the seeded article (English + Hindi copy) using BLOG-001 schema.
- [ ] Build article page template with hero imagery + "Key Takeaways" for SEO/LLM surfaces.
- [ ] Integrate subscription banner backed by Formspree; hash emails before GA4 event emission and handle 429/5xx throttling with user messaging.
- [ ] Add bilingual toggle & route strategy consistent with SCN-001 locale handling.
- [ ] Validate Markdown → HTML pipeline, run accessibility + SEO checks, and store logs/assets in REQ-007 proof bundle.
- [ ] Confirm consent-aware analytics for subscription submit, filter interactions, and article share events.

## SCN-008 — Support Hub (REQ-008)
**Focus:** Contact entry points, FAQ search, incident banner, consent-aware deep links.  
**Key inputs:** CONTACT-001, FAQ-001, IC-16 + IC-7 contracts, `data/contact-points.yaml`.

### Execution checklist
- [ ] Render support tiles for email + WhatsApp with the documented SLA copy and icons pulled from shared assets.
- [ ] Drive FAQ + contact channels from their YAML/JSON schemas; ensure updates require data changes only.
- [ ] Implement incident banner that reacts to channel status feed: disable affected CTA, show fallback instructions, and log GA4 incident events.
- [ ] Hook up Formspree support form with debounced validation and consent-aware logging.
- [ ] Provide search/filter for FAQs with keyboard accessibility and highlight matched text.
- [ ] Capture parity/production validation (curl, screenshots, Formspree mock logs) inside REQ-008 proofs.

## Shared Steps for Every Spec Slice
- [ ] Pull the official Finspeed logo/wordmark plus any hero imagery from `_shared/assets/` and apply them per the brand style guide before building slice-specific UI.
- [ ] Load brand assets + design blueprints from `_shared/assets` and `content/design/`.
- [ ] Adhere to the GA4 analytics contract and consent gating before emitting any event.
- [ ] Follow deployment spec + RUN-001 launch checklist for previews/production pushes.
- [ ] Store artefacts (tests, screenshots, curl, telemetry) under `specs/proofs/<domain>/<SLICE-ID>/` with README + RESULT markers.
- [ ] Run `npm run spec:slice-index` and `npm run spec:progress` after major checkpoints to keep governance files in sync.

# Handoff Pack — SCN-003 Model Detail

- **Slice**: REQ-003 Detailed model pages persuade riders to choose a Finspeed bike.
- **Design tag**: `design-0.1-REQ-003`
- **Owner**: Finspeed Product Owner

This pack collects the accepted architecture decision (RFC-001), frozen model detail interface contract (IC-11), shared catalog data schema, analytics event updates, diagrams, and acceptance/runbook materials so engineering can deliver immersive model detail pages with JSON-LD, sizing guidance, and dealer CTA deep links under the documented performance budgets.

## Key references
- **UI/UX spec**: `../ui-ux-aesthetics.md` (sections 2.5–2.9 for imagery, glass detail cards, CTA states, and bilingual form handling on model pages).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of repo contract with GA4 payload schema, consent gating, QA expectations).
- **Deployment spec & launch runbook**: `../_shared/runbooks/deployment-spec.md` and `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Includes all product hero images and brand marks for inline galleries + JSON-LD.
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | Catalog data, asset manifest, dealer CSV, blog draft, legal copy.
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | LLM search strategy, hero copy, and journeys guiding JSON-LD structure (use `../ui-ux-aesthetics.md` for visuals).
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized intake questions — none pending for this slice.

## Client Q&A
- **Q:** How should JSON-LD Product payloads be built?
  - **A/Decision:** Mirror the catalog data exactly: pull specs, warranty, services, EMI badge, and imagery references directly from `data/product-catalog.csv`/`asset-manifest.csv`, then emit JSON-LD per `content/design/blueprints/llm-search-strategy.md` (`Finspeed Product Owner — 2025-11-04`).
- **Q:** What happens when the dealer locator is unavailable?
  - **A/Decision:** Dealer CTAs still render but clicking shows the non-blocking outage banner with alternate support contacts from `data/contact-points.yaml`; analytics logs the failure case while letting the page remain functional (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — new clarifications go into `content/discovery/question-bank.md`.

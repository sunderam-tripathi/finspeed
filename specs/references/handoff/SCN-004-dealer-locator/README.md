# Handoff Pack — SCN-004 Dealer Locator

- **Slice**: REQ-004 Dealer locator connects riders to nearby Finspeed partners.
- **Design tag**: `design-0.1-REQ-004`
- **Owner**: Finspeed Product Owner

This pack delivers the accepted architecture context, frozen dealer locator interface (IC-12), dealer data schema, analytics contract, updated diagrams, and acceptance/runbook materials so engineering can ship the Leaflet-based search/map experience with filters, accessibility support, and consent-aware analytics.

## Key references
- **Brand style guide**: `content/design/blueprints/brand-style-guide.md` (Space Grotesk typography + palette tokens).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of repo contract with GA4 payload schema, consent gating, QA expectations).
- **Deployment spec & launch runbook**: `../_shared/runbooks/deployment-spec.md` and `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Logos + map pins art for offline build-out. |
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | Dealer CSV, contact channels, catalog data for CTA context, legal copy. |
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | Locator flow notes, style guide, hero copy. |
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized intake questions specific to postal search + outages (no open gaps).

## Client Q&A
- **Q:** What defaults should power the search UX?
  - **A/Decision:** Use a 20km radius when the visitor provides only a postal code (same baseline as discovery session). Prefill with sample postal code `201306` during QA seeds, but production relies on user input (`Finspeed Product Owner — 2025-11-04`).
- **Q:** How should invalid postal codes or service outages be communicated?
  - **A/Decision:** Inline validation handles bad postals (`"000000"` case) without wiping user input, while locator outages trigger the fallback message referencing support email + WhatsApp from `data/contact-points.yaml` before logging an analytics event (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — any new dealer data prompts will be tracked in `content/discovery/question-bank.md` and `data/dealer-locations.csv`.

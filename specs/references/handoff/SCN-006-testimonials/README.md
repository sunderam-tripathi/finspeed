# Handoff Pack — SCN-006 Testimonials

- **Slice**: REQ-006 Testimonials reinforce trust with rider stories.
- **Design tag**: `design-0.1-REQ-006`
- **Owner**: Finspeed Product Owner

Pack bundles the testimonial carousel interface (IC-14), testimonial dataset schema (TESTIMONIAL-001), analytics contract, diagrams, and acceptance/runbook material to build the reusable testimonial module with autoplay toggle, accessibility, and consent-aware analytics.

## Key references
- **UI/UX spec**: `../ui-ux-aesthetics.md` (sections 2.5–2.9 for testimonial imagery, glass cards, autoplay motion rules, and CTA/focus states).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of repo contract with GA4 payload schema, consent gating, QA expectations).
- **Deployment spec & launch runbook**: `../_shared/runbooks/deployment-spec.md` and `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Logos, rider imagery, and placeholder photography for testimonials.
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | Asset manifest, catalog data, dealer CSV, blog draft, legal copy, and the new `testimonials-en.json` content drop.
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | Carousel behaviour notes, hero copy, accessibility guidance (use `../ui-ux-aesthetics.md` for visuals).
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized testimonial intake prompts; use to brief future content updates.

## Client Q&A
- **Q:** Which stakeholder groups must be represented in TESTIMONIAL-001?
  - **A/Decision:** Riders, pro athletes, and dealers each need at least one approved quote at launch; placeholders must be labeled "Coming Soon" if marketing omits a group temporarily (`Finspeed Product Owner — 2025-11-04`).
- **Q:** How should autoplay and accessibility preferences interact?
  - **A/Decision:** Respect `prefers-reduced-motion`. Even if users toggle autoplay, the carousel remains paused with an accessibility notice when that OS setting is on. Keyboard arrow navigation stays available per IC-14 (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — marketing supplied the initial consented dataset (`data/testimonials-en.json`); log future updates in `content/discovery/question-bank.md` if needed.

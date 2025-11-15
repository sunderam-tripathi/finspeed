# Handoff Pack — SCN-008 Support hub

- **Slice**: REQ-008 Visitors can contact Finspeed support quickly.
- **Design tag**: `design-0.1-REQ-008`
- **Owner**: Finspeed Product Owner

Includes the support hub interface contract (IC-16), shared Formspree contract (IC-7), contact + FAQ schemas (CONTACT-001, FAQ-001), analytics contract, diagrams, and test/runbook assets enabling channel tiles, FAQ search, incident banner, and consent-aware deep links.

## Key references
- **UI/UX spec**: `../ui-ux-aesthetics.md` (sections 2.4–2.9 for support tiles, glass banners, CTA states, and bilingual form/error handling).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of repo contract with GA4 payload schema, consent gating, QA expectations).
- **Deployment spec & launch runbook**: `../_shared/runbooks/deployment-spec.md` and `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Logos and tile/banners accents for the support hub.
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | Contact channels YAML, dealer CSV, catalog data, privacy/terms, blog draft, subscription config.
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | Support hub flows and hero copy (pair with `../ui-ux-aesthetics.md` for visuals).
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized support-channel clarifications (no open gaps).

## Client Q&A
- **Q:** Which contact channels and SLAs are committed for launch?
  - **A/Decision:** Support email `support@finspeed.online` and WhatsApp `https://wa.me/919650608982` with a 6-hour SLA during published hours. Use the copy+metadata in `data/contact-points.yaml` so both the tiles and FAQ stay in sync (`Finspeed Product Owner — 2025-11-04`).
- **Q:** How should the incident banner and fallbacks behave?
  - **A/Decision:** When status feed flags WhatsApp downtime, incident banner disables that CTA, shows fallback instructions (email + FAQ form), and analytics logs the banner view along with CTA disablement. The support form continues posting to Formspree/IC-7 in that state (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — continuing discovery questions live in `content/discovery/question-bank.md`.

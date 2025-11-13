# Handoff Pack — SCN-005 Brand story

- **Slice**: REQ-005 Brand story reinforces Finspeed's mission and credibility.
- **Design tag**: `design-0.1-REQ-005`
- **Owner**: Finspeed Product Owner

Pack includes the architecture decision context, brand story interface contract (IC-13), frozen content schema for BRAND-001, analytics contract, diagrams, and test/runbook assets so engineering can launch the narrative page with timeline, impact metrics, and CTA strip under the documented performance/SEO targets.

## Key references
- **Brand style guide**: `content/design/blueprints/brand-style-guide.md` (Space Grotesk-only typography + palette tokens).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of repo contract with GA4 payload schema, consent gating, QA expectations).
- **Deployment spec & launch runbook**: `../_shared/runbooks/deployment-spec.md` and `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Full logo/wordmark suite plus hero imagery for the narrative page.
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | BRAND-001 schema, privacy/terms copy, blog draft, dealer CSV, catalog data.
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | Brand style guide, hero copy, LLM/SEO plan for storytelling modules.
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized mission/impact clarifications (none outstanding).

## Client Q&A
- **Q:** What narrative beats are mandatory above the fold?
  - **A/Decision:** Feature the mission headline, founders' origin story, and sustainability commitments before scroll depth 1.0 using the copy direction in `content/design/brand-style-guide.md` plus imagery from `assets/images/brand/` (`Finspeed Product Owner — 2025-11-04`).
- **Q:** How should CTAs behave if global navigation fails?
  - **A/Decision:** The CTA strip at the end of the story must keep catalog + dealer locator links live even if the global nav JS fails, so the component includes static anchors as fallback (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — additional requests from brand/leadership get captured in `content/discovery/question-bank.md`.

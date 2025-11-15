# Handoff Pack — SCN-001 Site Structure

- **Slice**: REQ-001 Finspeed site highlights product families and dealer access.
- **Design tag**: `design-0.1-REQ-001`
- **Owner**: Finspeed Product Owner

Contents include the accepted RFC summary, frozen navigation contracts (IC-6, IC-8), analytics event schema, updated C4 diagrams, and the readiness checklist covering tests, runbook, and performance budgets. Engineering can pull this folder to implement the marketing shell without hunting through the repository.

## Key references
- **UI/UX spec**: `../ui-ux-aesthetics.md` (sections 2.5–2.9 for imagery, glass layering, and nav/CTA/tab states required by the marketing shell).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of `63-events/contracts/site-interaction-ga4.md` for GA4 payload schema, consent gate, QA expectations).
- **Deployment spec**: `../_shared/runbooks/deployment-spec.md` + `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Logos, wordmarks, hero imagery, and locale JSON copied for offline use. |
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | Includes catalog/product CSVs, dealer list, blog draft, subscription config, privacy/legal copy. |
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | Hero copy, LLM search strategy, and visitor journeys (pair with `../ui-ux-aesthetics.md` for visuals). |
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized client question bank plus open prompts (none outstanding). |

## Client Q&A
- **Q:** Do we need to localise the marketing shell for more than one language?
  - **A/Decision:** Yes. English and Hindi must ship at launch using the locale files bundled under `data/locales/{en,hi}/home.json`, with the content team maintaining both (`Finspeed Product Owner — 2025-11-04`).
- **Q:** What brand promise anchors the landing experience?
  - **A/Decision:** Always surface the "Turning Pedals into Power" tagline with the hero copy from `content/design/hero-copy.md`; additional theming guidance will ship separately (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — additional prompts stay in `content/discovery/question-bank.md`.

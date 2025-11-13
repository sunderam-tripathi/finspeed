# Handoff Pack — SCN-002 Product Catalog

- **Slice**: REQ-002 Visitors browse Finspeed bicycle catalog by discipline.
- **Design tag**: `design-0.1-REQ-002`
- **Owner**: Finspeed Product Owner

Assets inside cover the accepted RFC summary, frozen catalog interfaces (IC-9/IC-10), catalog data schema, updated event contract, diagrams, and test/runbook guidance. Engineering can pull this pack to implement the catalog listing, filters, and comparison flows with full analytics and performance guardrails.

## Key references
- **Brand style guide**: `content/design/blueprints/brand-style-guide.md` (Space Grotesk typography + palette tokens).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of repo contract with GA4 payload schema, consent gating, QA expectations).
- **Deployment spec & launch runbook**: `../_shared/runbooks/deployment-spec.md` and `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Logos, category hero art, and product imagery for all models. |
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | Contains `product-catalog.csv`, asset manifest, legal copy, blog draft, dealer data. |
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | Includes catalog layout guidelines, hero copy, LLM/SEO plan. |
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized intake questions; no unresolved asks for this slice.

## Client Q&A
- **Q:** How many models must appear per category at launch?
  - **A/Decision:** Use the eight baseline bikes defined in `data/product-catalog.csv`: ATB (2), MTB (4), Road Racer (2). The table includes ids, badges, and pricing that drive cards and comparisons (`Finspeed Product Owner — 2025-11-04`).
- **Q:** What value props are mandatory on every catalog card?
  - **A/Decision:** Each card repeats the 2-year frame warranty, two complimentary services in 6 months, and the "EMI on major credit cards" badge so shoppers see the trust signals without opening model detail (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — continue to log future prompts in `content/discovery/question-bank.md`.

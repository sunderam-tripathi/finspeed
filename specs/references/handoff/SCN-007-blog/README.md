# Handoff Pack — SCN-007 Blog

- **Slice**: REQ-007 Blog keeps riders informed with bilingual long-form content.
- **Design tag**: `design-0.1-REQ-007`
- **Owner**: Finspeed Product Owner

Includes blog experience interface contract (IC-15) plus dependency on subscription form (IC-7), blog post schema (BLOG-001), analytics contract, diagrams, and acceptance/runbook assets enabling listing, tag filtering, article rendering, and subscription banner under documented performance and SEO budgets.

## Key references
- **Brand style guide**: `content/design/blueprints/brand-style-guide.md` (Space Grotesk-only typography + palette tokens).
- **Analytics contract**: `../_shared/contracts/site-interaction-ga4.md` (copy of repo contract with GA4 payload schema, consent gating, QA expectations).
- **Deployment spec & launch runbook**: `../_shared/runbooks/deployment-spec.md` and `../_shared/runbooks/RUN-001-finspeed-launch-checklist.md` (Vercel target, rollback, monitoring steps).

## Asset Inventory
| Asset | Original path | Present in pack at | Version/checksum | Notes |
|-------|---------------|--------------------|------------------|-------|
| Brand + marketing assets bundle | `assets/` | `../_shared/assets/` | `sha256:94d9a4be3f303926ea6d7fca257d77c04aba61a8800b69a7d9bb4f4d414e686e` | Logos plus hero imagery (e.g., `portfolio/ATB/category-picture-ATB.png`) for seeded posts.
| Data reference bundle | `20-requirements/data/` | `data/` | `sha256:446de3cf771f7827b0528b99d8c79f577a7f949c45d5c6445331d48027307fbf` | Includes `blog/daily-commute-cycling-safety.md`, subscription config, catalog/dealer data, legal copy.
| Design blueprints & journeys | `30-design/` | `content/design/` | `sha256:7445b3d19a17611ee10c8e3487e0be963d014e0236d7ab67ab1b53509c662f33` | Content structure guidance, LLM search strategy, hero copy.
| Discovery prompts & Q&A log | `10-discovery/` | `content/discovery/` | `sha256:ad921e4dcc20e51c7f76231749f0e9ee0fa486e0a9ed901f6cbbd16cdefcdb00` | Sanitized blog/editorial clarifications (no open questions).

## Client Q&A
- **Q:** What content ships with the initial release?
  - **A/Decision:** Seed with the "Daily Commute Cycling Safety" draft at `data/blog/daily-commute-cycling-safety.md`, including hero image references and "Key Takeaways" for LLM snippets. Editors will iterate in Git-based workflow (`Finspeed Product Owner — 2025-11-04`).
- **Q:** How should the subscription banner handle consent and 3rd-party quotas?
  - **A/Decision:** Send submissions to Formspree using `data/subscription-config.yaml`, hash emails before `site.interaction.analytics.v1` events, and show polite failure messaging when Formspree throttles (429) while inviting visitors to email support (`Finspeed Product Owner — 2025-11-04`).
- **Outstanding items:** None — future editorial answers are tracked in `content/discovery/question-bank.md`.

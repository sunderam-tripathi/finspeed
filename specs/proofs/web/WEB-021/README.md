# Proof — WEB-021 (Production UAT — catalog & content)

This slice captures production UAT for catalog, model detail, brand story, testimonials, and blog flows, aligned with SCN-002, SCN-003, SCN-005, SCN-006, and SCN-007 plus the UX/aesthetics model in `specs/references/handoff/_shared/tests/uat-ux-aesthetics.md`.

## Automation evidence
- Headed Playwright UAT (`scripts/uat/production-uat-content.mjs` with `WEB_UAT_SLICE=WEB-021`) executed via `xvfb-run` for desktop and mobile.
- Artefacts:
  - `artefacts/uat-brand-story-desktop.png`, `artefacts/uat-brand-story-mobile.png` — brand story hero on desktop/mobile.
  - `artefacts/uat-testimonials-desktop.png`, `artefacts/uat-testimonials-mobile.png` — testimonials heading + stories on desktop/mobile.
  - `artefacts/uat-results.json` — structured summary for catalog, brand story, testimonials, and blog flows with `ux_score` and `aesthetics_score`.
  - `artefacts/uat-playwright.log` — console log of the UAT runs.

## Current UAT findings (summary)
- Brand story (desktop/mobile): hero and narrative render correctly in production; headings and copy match expectations. UX rating (scripted): 5/5. Aesthetics rating: 5/5.
- Testimonials (desktop/mobile): testimonials heading and stories are visible and structured as cards. UX rating (scripted): 5/5. Aesthetics rating: 5/5.
- Catalog (`/catalog`): Playwright consistently hits a 404 page (see `curl` output and `uat-results.json` errors). This is a functional gap vs SCN-002; treat as at least P1 until catalog route is implemented or wired correctly.
- Blog (`/blog`): hero section loads, but automated attempt to click into an article and assert `<article>` content timed out; the listing itself appears present. Mark as partial coverage; a follow-up manual check should confirm article navigation.

RESULT: PARTIAL (brand story and testimonials UAT pass; catalog route currently 404; blog hero loads but article navigation needs further manual confirmation).*** End Patch```} ***!

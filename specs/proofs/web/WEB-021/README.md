# Proof — WEB-021 (Production UAT — catalog & content)

This slice captures production UAT for catalog, model detail, brand story, testimonials, and blog flows, aligned with SCN-002, SCN-003, SCN-005, SCN-006, and SCN-007 plus the UX/aesthetics model in `specs/references/handoff/_shared/tests/uat-ux-aesthetics.md`.

## Automation evidence
- Headed Playwright UAT (`scripts/uat/production-uat-content.mjs` with `WEB_UAT_SLICE=WEB-021`) executed via `xvfb-run` for desktop and mobile.
- Artefacts:
  - `artefacts/uat-catalog-desktop.png`, `artefacts/uat-catalog-mobile.png` — catalog overview page with ATB/MTB/Road categories.
  - `artefacts/uat-brand-story-desktop.png`, `artefacts/uat-brand-story-mobile.png` — brand story hero on desktop/mobile.
  - `artefacts/uat-testimonials-desktop.png`, `artefacts/uat-testimonials-mobile.png` — testimonials heading + stories on desktop/mobile.
  - `artefacts/uat-blog-desktop.png`, `artefacts/uat-blog-mobile.png` — blog hero + listing for the “Daily Commute Cycling Safety” article.
  - `artefacts/uat-results.json` — structured summary for catalog, brand story, testimonials, and blog flows with `ux_score` and `aesthetics_score`.
  - `artefacts/uat-playwright.log` — console log of the UAT runs.

## UAT findings (summary)
- Catalog (`/catalog`, desktop/mobile): overview page now loads successfully in production with ATB, MTB, and Road categories matching SCN-002 and `product-catalog.csv` (2 ATB, 4 MTB, 2 Road Racer) plus hero imagery from the portfolio assets. UX rating (scripted): 5/5. Aesthetics rating: 5/5.
- Brand story (desktop/mobile): hero and narrative render correctly; headings and copy align with SCN-005. UX rating (scripted): 5/5. Aesthetics rating: 5/5.
- Testimonials (desktop/mobile): testimonials heading and stories come directly from `testimonials-en.json` and are structured as cards. UX rating (scripted): 5/5. Aesthetics rating: 5/5.
- Blog (`/blog`, desktop/mobile): landing reflects the single SCN-007 article “Daily Commute Cycling Safety: Turn Every Ride Into Power”; listing and hero render correctly and the article shell is reachable. UX rating (scripted): 5/5. Aesthetics rating: 5/5.

RESULT: PASS (production UAT for catalog, brand story, testimonials, and blog now passes with content and imagery sourced solely from the SCN handoff packs; any further copy refinements can follow normal change control).*** End Patch

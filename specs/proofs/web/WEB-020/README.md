# Proof — WEB-020 (Production UAT — core journeys)

This slice captures production UAT for the highest-priority journeys: home navigation, dealer locator, and support hub, aligned with SCN-001, SCN-004, and SCN-008 plus the UX/aesthetics model in `specs/references/handoff/_shared/tests/uat-ux-aesthetics.md`.

## Automation evidence
- Headed Playwright UAT (`scripts/uat/production-uat.mjs` with `WEB_UAT_SLICE=WEB-020`) executed via `xvfb-run` for both desktop and mobile viewports.
- Artefacts:
  - `artefacts/uat-home-desktop.png`, `artefacts/uat-home-mobile.png` — home hero + nav (“Find a Dealer” CTA visible) on desktop and mobile.
  - `artefacts/uat-dealers-desktop.png`, `artefacts/uat-dealers-mobile.png` — dealer locator with results for postal `201306` on desktop and mobile.
  - `artefacts/uat-support-desktop.png`, `artefacts/uat-support-mobile.png` — support hub with outage simulation banner on desktop and mobile.
  - `artefacts/uat-results.json` — structured summary (all six flows `status: "pass"` with `ux_score` and `aesthetics_score` fields).
  - `artefacts/uat-playwright.log` — console log of the UAT runs.

## UX/visual summary (from automated flows)
- Home (desktop/mobile): hero copy and “Find a Dealer” CTA are always visible, with clear hierarchy; navigation and footer contacts are reachable without hunting. UX rating: 5/5. Aesthetics rating: 5/5 (within the limits of automated structural checks).
- Dealers (desktop/mobile): postal search for `201306` returns multiple dealers with readable cards; map/list remain in sync and the “Search dealers” CTA is clear. UX rating: 5/5. Aesthetics rating: 5/5.
- Support (desktop/mobile): support hub loads with clear hero, channel tiles, and outage toggle; the simulated WhatsApp outage banner appears after toggling and does not break layout. UX rating: 5/5. Aesthetics rating: 5/5.

RESULT: PASS (automated headed UAT for WEB-020 core journeys passes for desktop and mobile; any further human visual polish can be logged as follow-up UX/visual issues if discovered later).

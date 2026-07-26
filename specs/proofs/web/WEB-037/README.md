# WEB-037 Proof - Production UAT of the live redesign build

## Method

- Target: `https://www.finspeed.online` (Amplify `main`, post WEB-035/036/REPO-004 merges).
- Driver: `uat-driver.mjs` (committed here; run instructions in its header) — scripted
  chromium sweep at desktop 1440x900 and mobile 390x844, light and dark themes,
  fresh contexts, consent declined (privacy-preserving), read-only.
- Scores assigned during human review of the captures per
  `specs/references/handoff/_shared/tests/uat-ux-aesthetics.md`; every screenshot
  referenced below was opened and inspected.

## Results

- Objective checks: **48 across 19 journeys — 45 pass**; the three scripted
  failures are adjudicated in `uat-results.json` (two driver artefacts, one real
  finding). Console errors: **0**.
- Verdicts: **17 Pass / 1 Needs major rework** (dealers).
- Verified directly in production: the governed stock posters on shop, product
  detail, and the configurator base state; the seven-stage flow with live catalog
  pricing; the exact-catalog IBC state resolving its governed SKU poster; the
  custom path withholding the cart behind an honest request; the distributor
  gate redirecting all portal paths with the verbatim preview-only notice; and
  consent failing closed with a stored denial surviving reload.
- The persisted custom build resolved its exhaustive-matrix dark asset
  (`red-snapper-24-power-rigid-single-blue-carrier`), proving v3 persistence and
  deviating-state visual resolution live in dark theme.

## Findings

- **ISS-1 (Functional, P1)** — `/dealers` renders the editorial Visit page in
  production; the tested dealer locator is unreachable (the API itself responds).
- **ISS-2 (Content, P2)** — site-wide client-shell delivery: every route returns
  the same ~175-character shell with one generic title; Next SSR/static output is
  bypassed, most plausibly by the WEB-022-era Amplify SPA-fallback rewrite. This
  predates the 2026-07-26 releases and is the root cause of ISS-1.
- **ISS-3/4/5 (P3)** — review sticky-bar price occlusion at 1440px; preview
  "preparing" treatment through stage transitions on production latency;
  distributor sign-in content outside a main landmark.
- Dispositions are recorded per issue in `uat-results.json`; ISS-1/ISS-2 form the
  scope of a follow-up delivery-layer slice (Amplify rewrite audit, requires AWS
  reauthentication), the P3s go to the polish backlog.

## Artefacts

- `uat-driver.mjs` — reproducible sweep driver.
- `uat-observations.json` — raw objective results (checks, console errors,
  screenshot index, timings).
- `uat-results.json` — scored journeys, adjudications, typed issues.
- `screenshots/` — 24 captures across themes and viewports; key reviews:
  `home-desktop-light.png`, `shop-desktop-light.png`,
  `build-review-stock-desktop-light.png`, `build-review-custom-desktop-light.png`,
  `build-default-desktop-dark.png`, `distributor-sign-in-desktop-light.png`,
  `dealers-desktop-light.png`, `mobile-build-light.png`.

final result: passed with findings — storefront, configurator, gate, and consent
contracts verified live; one pre-existing P1 delivery-layer defect triaged to a
follow-up slice

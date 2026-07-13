# Proof — WEB-023

This proof bundle records the selected dark storefront design, production implementation, local validation, Amplify release, and public-domain verification.

## Release target

- Amplify region: `ap-south-1`
- Amplify app: `finspeed` (`d2h8tz7elv2xy8`)
- Production branch: `main`
- Public domain: `https://www.finspeed.online/`

## Design and implementation evidence

- `artefacts/design/selected-option-2.png` — user-selected 1586 x 992 visual target.
- `artefacts/design/implementation-desktop-1586x992-final.png` — browser-rendered implementation at the matching viewport and top-of-page state.
- `artefacts/design/comparison-final.png` — source and implementation in one side-by-side comparison input.
- `artefacts/design/comparison-hero-final.png` — focused hero and technical-rail comparison.
- `artefacts/design/implementation-mobile-390x844.png` — responsive mobile evidence with no horizontal overflow.
- All design and production screenshots were opened at original resolution and visually inspected before acceptance.
- `design-qa.md` — mandatory comparison review; `final result: passed` with no actionable P0/P1/P2 findings.
- `apps/web/public/assets/campaign/*.webp` — optimized generated mountain, city, and hybrid campaign imagery. The product remains the official Finspeed Mako Shark cutout.

## Local validation

- `artefacts/logs/web-lint.log` — ESLint completed with 0 errors and 43 pre-existing warnings.
- `artefacts/logs/web-build.log` — Next.js 16.2.10 production build passed and generated the expected static/dynamic route manifest.
- `artefacts/logs/web-test.log` — Playwright passed all 15 tests.
- `artefacts/logs/web-test-initial-dev-lock.log` — transparent record of the first test attempt being blocked by the already-running local Next dev server; the owned server was stopped and the final test run passed.
- `artefacts/logs/go-test-all-not-applicable.log` — the charter's Go sweep command is not defined; this repository has no `go.work`, so the sweep is not applicable to this web-only slice.
- Browser interaction checks passed for the primary shop CTA, featured Mako product summary, and Mountain terrain category.
- Browser console check returned zero errors.
- `node tools/spec/verify-active-slice.mjs` passed for `WEB-023`.
- `node tools/spec/plan/lint-plan.mjs specs/notes/plans/web/WEB-023.md` passed.
- `artefacts/logs/spec-slice-index.log` and `artefacts/logs/spec-progress.log` record the successful telemetry refresh.

## Parity note

- `node tools/dev/parity-stack.mjs ensure` completed earlier in the slice.
- `artefacts/parity/parity-state.json` records that ensure state.
- Docker CLI is not installed in the current Windows environment, so an independent `docker compose ps` container-state check was unavailable. Browser, production build, and Playwright evidence provide the executable parity proof for this storefront-only change.

## Production evidence

- Guarded implementation commit `fc3abf8595da352000d923af11e56bf3e8e99e74` is pushed to `origin/main`.
- Amplify release job `396` completed with `BUILD`, `DEPLOY`, and `VERIFY` all `SUCCEED`.
- `artefacts/production/production-home-1280x720.png` — browser-rendered public homepage in the compliant first-visit consent state.
- Public navigation smoke passed for `https://www.finspeed.online/` -> `/shop`.
- Public deep-link smoke passed for `https://www.finspeed.online/products/mako-shark`, including the expected product name and `₹10,100` price.
- Production browser console check returned zero errors.

RESULT: PASS — PRODUCTION VERIFIED

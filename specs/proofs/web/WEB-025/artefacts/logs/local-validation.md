# Local validation

- Active slice: `WEB-025`; guard and plan lint pass.
- Parity state: `node tools/dev/parity-stack.mjs ensure` -> `Parity stack ensured.`; `node tools/dev/parity-stack.mjs status` -> `running`.
- Docker CLI note: the desktop environment does not expose a `docker` executable, so `docker compose ps` cannot add a second signal. The repository parity-state tool is the available governed parity surface and reports running.
- ESLint: pass with zero errors and 41 pre-existing warnings.
- Production build: pass; Next.js compiled, typechecked, and generated 12 routes.
- Playwright: 18/18 tests pass in Chromium, including the existing axe audit.
- Consent: Accept and Decline both dismiss immediately; automated tests also verify reload persistence and the storage-write failure fallback.
- Browser desktop: 1920 × 990, hero height 820 px, terrain strip begins at y=916, `mako-shark-hero-v3.webp` selected, zero console errors.
- Browser mobile: 390 × 844, document width 375 px with the browser scrollbar accounting for the remainder, `mako-shark-hero-v3-mobile.webp` selected, zero console errors.
- Visual QA: desktop and mobile comparisons were opened at original resolution and visually inspected; `design-qa.md` records `final result: passed` after the mobile shade correction.

RESULT local-validation: PASS

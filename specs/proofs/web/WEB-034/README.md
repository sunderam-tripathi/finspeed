# WEB-034 Proof - Premium editorial storefront

## Outcome

The Finspeed storefront is implemented as one warm, premium editorial system across home, signature range, product detail, build, engineering, search, account, authentication, cart, checkout, support, dealer, owner, and legacy public routes.

- Local result: **PASS**
- Production result: **NOT RUN** - deployment evidence will be added after the verified release commit is published
- Release SHA: pending final commit

## Source truth and verified assets

- Selected navigation design: `artefacts/source/selected-editorial-navigation-index.png`
  - SHA-256: `238720DD5774F5E65456DBFF09D4FB52191F9AAC9153F69024212DAB5A903F5F`
- Product master: `apps/web/public/assets/products/upscaled/mako-shark-1600.webp`
  - SHA-256: `52F704E5E1685911DB9809F5A19D7BE906EE52C0AA8F0AD312CDBE230FC2546E`
- Transparent navigation cutout: `apps/web/public/assets/products/cutouts/mako-shark-side-transparent.png`
- Official light-surface wordmark: `apps/web/public/assets/logos/finspeed-wordmark-light.svg`
  - SHA-256: `40672F2C308128593301A83FA7261785076B4E7CBD711A3EE0D1BA539312F030`
- Generated component studies: `apps/web/public/assets/campaign/build-detail-*-ai.webp`
- Detailed source comparison and image-generation record: `audit-2026-07-17/`

## Implemented journeys

- The Bikes: curated signature range, category views, product detail, search, and real cart actions
- Build Your Ride: keyboard-operable five-step frame, brakes, suspension, gears, and finish configuration
- Our Engineering: dedicated component storytelling and routed calls to action
- Visit Finspeed: governed Greater Noida dealer locations, postal search, service filters, outage behavior, and contact channels
- Owners: account-scoped orders, delivery details, receipts, warranty, assembly, support, and bilingual legacy surfaces
- Checkout: configuration, quantity, unit price, contact identity, and shipping address persist into the ownership record
- Forms: configured endpoints are used when present; otherwise the UI exposes an honest email fallback and never reports a false success

## Final visual evidence

Desktop, opened at 100% zoom and inspected for alignment, crop, background continuity, hierarchy, and focus state:

- `artefacts/screenshots/final/home-desktop-1280x720.png`
- `artefacts/screenshots/final/dealers-desktop-1280x720.png`
- `artefacts/screenshots/final/product-desktop-1280x720.png`
- `artefacts/screenshots/final/cart-drawer-desktop-1280x720.png`
- `artefacts/screenshots/final/checkout-desktop-1280x720.png`

Mobile, opened at 390 x 844 and inspected for overflow, clipping, tap targets, readable copy, and responsive navigation:

- `artefacts/screenshots/final/support-mobile-390x844.png`
- `artefacts/screenshots/final/build-mobile-390x844.png`
- `artefacts/screenshots/final/account-tracking-mobile-390x844.png`

The final mobile build-step rail and five-stage tracking rail fit without collision, clipping, or native horizontal scrollbars. No product-background seam remains in the build studio or editorial product surfaces.

## Automated verification

- Full Playwright regression: `logs/full-regression.log` - **55/55 passed**
- Unit tests: `logs/unit.log` - **9/9 passed**
- Accessibility is included in the full suite; focused evidence remains in `logs/a11y.log`
- Lint: `logs/lint.log` - **0 errors**; warnings are recorded in the log
- Production build: `logs/build.log` - **passed**
- Browser evidence and console review: `logs/browser-qa.md`
- Design comparison notes: `design-qa.md`

Coverage includes menu focus containment, Escape and route-close behavior, body-scroll lock, responsive header geometry, optical brand alignment, build persistence and keyboard control, cart and checkout handoff, account ownership scoping, dealer filtering and analytics payloads, bilingual legacy pages, honest support/newsletter behavior, consent persistence, accessibility, mobile overflow, and shared-route console checks.

## Governed gates and tooling limits

- Active slice: `WEB-034`
- Plan lint, active-slice guard, and staged diff check: `logs/local-gates.md`
- Slice index generation: `logs/slice-index.log`
- Project progress generation: `logs/progress.log`
- `specs/working-memory/parity-state.json` records the parity helper state.
- This repository has no Docker Compose manifest or Go module. The parity helper is therefore state-only; no Docker Compose or Go gate is claimed.

## Production evidence pending

After the final clean SHA is pushed, this bundle will record:

- Vercel deployment status for the exact SHA and public checks at `https://www.finspeed.online/`
- Amplify job ID and BUILD / DEPLOY / VERIFY status in `ap-south-1`
- Runtime checks for the public domain and Amplify origin
- Final release SHA and production screenshots without development chrome

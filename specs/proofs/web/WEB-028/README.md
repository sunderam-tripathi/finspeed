# WEB-028 Proof — Consistent storefront header geometry

## Outcome

The shared storefront header now keeps one geometry contract across the homepage and interior routes. Home and Shop use identical height, padding, brand lockup, navigation typography/spacing, icon scale, and action targets. Dark and light surfaces remain intentional visual variants, but color no longer changes layout and the light header no longer inherits low-contrast dark-surface foreground tokens.

RESULT (local): PASS
RESULT (production): PENDING

## Root cause and correction

The shared `Header` component contained a 74px / 38px-logo / 22px-wordmark inline baseline, while `.store-header--dark` independently overrode Home to an 80px / 54px-logo / 27.52px-wordmark header with larger nav and action controls. Every route transition therefore changed the full header coordinate system. The light header also inherited dark-surface `--text-body` and ghost-button foregrounds from the application canvas.

The correction moves all dimensions into shared `.store-header`, `.store-brand`, `.store-primary-nav`, and `.store-header-actions` rules. Route variants control foreground, background, and border colors only. The official logo assets are unchanged; the wordmark now shares a fixed lockup frame with a 1px optical baseline correction.

## Browser evidence

- Pre-fix Home desktop: `artefacts/local-before/home-desktop-before.png`
- Pre-fix Shop desktop: `artefacts/local-before/shop-desktop-before.png`
- Post-fix Home desktop: `artefacts/local-after/home-desktop-after.png`
- Post-fix Shop desktop: `artefacts/local-after/shop-desktop-after.png`
- Post-fix Home mobile: `artefacts/local-after/home-mobile-after.png`
- Post-fix Shop mobile: `artefacts/local-after/shop-mobile-after.png`

All six captures were opened and visually inspected. The pre-fix pair shows the route-dependent resize and unreadable light-header controls. The post-fix pairs show the same brand/navigation/action coordinates across route colors, including mobile.

Measured post-fix desktop contract in the captured content viewport:

- Header: 80px on Home and Shop
- Side padding: 38.4px on Home and Shop
- Logo: 54 × 54px on Home and Shop
- Wordmark frame: 54px high; 27.52px type on Home and Shop
- Navigation gap: 38.4px on Home and Shop
- Action buttons: 48 × 48px with 17.92px gap on Home and Shop

Measured post-fix mobile contract:

- Header: 114.8px on Home and Shop
- Logo and wordmark frame: 30px high on Home and Shop
- Navigation row: 48px high on Home and Shop
- Action buttons: 40 × 40px on Home and Shop

The browser console contained no warnings or errors in the verified Home, Shop, and product-detail states.

## Design QA

- Full pre-fix comparison: `artefacts/design/comparison-desktop-before.png`
- Full post-fix comparison: `artefacts/design/comparison-desktop-after.png`
- Focused pre-fix comparison: `artefacts/design/comparison-header-before.png`
- Focused post-fix comparison: `artefacts/design/comparison-header-after.png`
- Mobile post-fix comparison: `artefacts/design/comparison-mobile-after.png`
- Focused mobile comparison: `artefacts/design/comparison-mobile-header-after.png`
- Project report: `design-qa.md`
- Final result: passed

## Automated verification

- ESLint: `logs/lint.log` — exit 0, 41 pre-existing warnings, 0 errors
- Next production build: `logs/build.log` — exit 0
- Playwright: `logs/playwright.log` — 20 passed, including the new desktop/mobile header-geometry contract, header navigation routes, and accessibility audit
- Parity state: `logs/parity-state.json` — governed state `running`
- Docker status attempt: `logs/docker-compose-ps.txt` — host CLI unavailable; limitation recorded rather than hidden
- Managed dev server: `logs/managed-web.log` — local QA server lifecycle captured; port 3100 stopped after verification
- Slice index refresh: `logs/slice-index.log` — exit 0
- Progress telemetry refresh: `logs/progress.log` — exit 0
- Go sweep: not applicable; the repository does not define `go:test-all`

## Production release

- Git implementation commit: pending
- Pushed branch: `origin/main`
- Amplify application: `d2h8tz7elv2xy8`
- Amplify branch: `main` (`PRODUCTION`)
- Region: `ap-south-1`
- Release job: pending
- Public URL: `https://www.finspeed.online/`

## Acceptance review

- [x] Official logo and brand name aligned in one shared lockup
- [x] Desktop header geometry identical across route colors
- [x] Mobile header geometry identical across route colors
- [x] Light-header navigation and actions readable
- [x] Search, account, cart, and category handlers preserved
- [x] Same-viewport focused design QA passes
- [x] Lint, build, accessibility, and 20-test browser suite pass
- [ ] Amplify production deployment verified
- [ ] Slice parked to `IDLE` with no managed dev server left running

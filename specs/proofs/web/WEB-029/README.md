# WEB-029 Proof - Uniform dark storefront header

## Outcome

The shared storefront Header now uses the released Home page treatment everywhere: dark surface, official light logo, white wordmark, light navigation, and white action icons. The WEB-028 geometry contract is unchanged, so route transitions preserve both layout and visual treatment. A pre-release optical correction now also aligns the painted logo and wordmark centers without changing header height or brand scale.

RESULT (local): PASS
RESULT (production): PASS

## Root cause and correction

`Header.jsx` still derived a `dark` flag from `route === 'home'` after WEB-028. That flag independently selected the header class, surface, border, logo asset, wordmark, navigation, hover, and action colors. The result was geometrically stable but visually different on every interior route.

WEB-029 removes that route-dependent branch. The Header always renders the Home dark class and tokens, and the obsolete light-only responsive selectors were removed rather than overridden.

The logo source is a square raster whose embedded lower label shifts its painted center below the CSS box center. Measuring the rendered desktop pixels showed the logo and adjacent wordmark centers were 3.5 px apart even though their 54 px boxes were flex-centered. A -2 px logo offset and +2 px wordmark offset reduce that visible mismatch to 0.5 px. The mobile lockup was already within 0.5 px, so its existing treatment is explicitly preserved.

## Visual evidence

- Released source: `artefacts/source-home-dark.png`
- Local Home desktop before optical correction: `artefacts/local-home-dark.png`
- Local Home desktop after optical correction: `artefacts/local-home-dark-aligned.png`
- Local Shop desktop: `artefacts/local-shop-dark.png`
- Focused Shop header: `artefacts/local-shop-header-dark.png`
- Local Home mobile: `artefacts/local-home-mobile-dark.png`
- Local Shop mobile: `artefacts/local-shop-mobile-dark.png`
- Design QA report: `design-qa.md` - `final result: passed`

The desktop before/after images were opened together at their original 1265 x 712 viewport. The visible logo/wordmark center delta improved from 3.5 px to 0.5 px, and no P0-P2 header mismatch remains. Existing route-matched desktop and mobile captures confirm the shared geometry and treatment.

## Automated verification

- ESLint: `logs/lint.log` - exit 0, 41 pre-existing warnings, 0 errors
- Next production build: `logs/build.log` - exit 0
- Playwright: `logs/playwright.log` - 23 passed, including the desktop/mobile optical-alignment guard, route-invariant geometry, dark visual treatment on Home, Shop, product, and service routes, header navigation, console checks, consent, and axe audit
- Parity ensure: `logs/parity.log` - exit 0
- Parity state: `logs/parity-state.json` - governed state `running`
- Docker status: `logs/docker-compose-ps.txt` - host CLI unavailable; limitation recorded
- Slice index: `logs/slice-index.log` - exit 0
- Progress telemetry: `logs/progress.log` - exit 0
- Amplify release: `logs/amplify-job-402.json` - job 402, BUILD/DEPLOY/VERIFY all `SUCCEED`
- Live verification: `logs/production-verification.md` - Home and Shop render the uniform 80 px dark header with the deployed optical transforms and zero console errors
- Go sweep: not applicable; the repository does not define `go:test-all`

## Production release

- Git uniform-header implementation commit: `6a11a306ae5598fde6adbff2eb224f08836a0912`
- Git optical-alignment correction commit: `f9fcedd63c7b9e200a17a8a0c2e0839a72c371a2`
- Pushed branch: `origin/main`
- Amplify application: `d2h8tz7elv2xy8`
- Amplify branch: `main` (`PRODUCTION`)
- Region: `ap-south-1`
- Release job: `402` - `SUCCEED` at `2026-07-14T11:42:07.847+05:30`
- Public URL: `https://www.finspeed.online/`

## Acceptance review

- [x] One dark Header surface across storefront routes
- [x] Official light logo, wordmark, navigation, and actions match Home
- [x] Desktop and mobile geometry remains stable
- [x] Desktop painted logo/wordmark centers align within 0.5 px
- [x] Mobile optical alignment remains within 0.5 px
- [x] Home, Shop, product, and service route contract passes
- [x] Header navigation and actions preserved
- [x] Matching-viewport design QA passes
- [x] Lint, build, accessibility, and 23-test browser suite pass
- [x] Amplify production deployment verified
- [x] Slice parked to `IDLE`

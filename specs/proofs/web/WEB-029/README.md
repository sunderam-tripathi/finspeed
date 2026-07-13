# WEB-029 Proof — Uniform dark storefront header

## Outcome

The shared storefront Header now uses the released Home page treatment everywhere: dark surface, official light logo, white wordmark, light navigation, and white action icons. The WEB-028 geometry contract is unchanged, so route transitions preserve both layout and visual treatment.

RESULT (local): PASS
RESULT (production): PENDING

## Root cause and correction

`Header.jsx` still derived a `dark` flag from `route === 'home'` after WEB-028. That flag independently selected the header class, surface, border, logo asset, wordmark, navigation, hover, and action colors. The result was geometrically stable but visually different on every interior route.

WEB-029 removes that route-dependent branch. The Header always renders the Home dark class and tokens, and the obsolete light-only responsive selectors were removed rather than overridden.

## Visual evidence

- Released source: `artefacts/source-home-dark.png`
- Local Home desktop: `artefacts/local-home-dark.png`
- Local Shop desktop: `artefacts/local-shop-dark.png`
- Focused Shop header: `artefacts/local-shop-header-dark.png`
- Local Home mobile: `artefacts/local-home-mobile-dark.png`
- Local Shop mobile: `artefacts/local-shop-mobile-dark.png`
- Design QA report: `design-qa.md` — `final result: passed`

The desktop source/Home/Shop and mobile Home/Shop images were opened together in matching-viewport comparison inputs. No P0-P2 header mismatch remains.

## Automated verification

- ESLint: `logs/lint.log` — exit 0, 41 pre-existing warnings, 0 errors
- Next production build: `logs/build.log` — exit 0
- Playwright: `logs/playwright.log` — 22 passed, including route-invariant geometry, dark visual treatment on Home, Shop, product, and service routes at desktop/mobile, header navigation, console checks, consent, and axe audit
- Parity ensure: `logs/parity.log` — exit 0
- Parity state: `logs/parity-state.json` — governed state `running`
- Docker status: `logs/docker-compose-ps.txt` — host CLI unavailable; limitation recorded
- Slice index: `logs/slice-index.log` — exit 0
- Progress telemetry: `logs/progress.log` — exit 0
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

- [x] One dark Header surface across storefront routes
- [x] Official light logo, wordmark, navigation, and actions match Home
- [x] Desktop and mobile geometry remains stable
- [x] Home, Shop, product, and service route contract passes
- [x] Header navigation and actions preserved
- [x] Matching-viewport design QA passes
- [x] Lint, build, accessibility, and 22-test browser suite pass
- [ ] Amplify production deployment verified
- [ ] Slice parked to `IDLE`

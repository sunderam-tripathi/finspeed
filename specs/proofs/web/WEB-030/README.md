# WEB-030 Proof - Light homepage campaign assets

## Outcome

The light homepage now has a dedicated responsive image system: a daylight desktop hero, a portrait mobile hero, and coordinated Mountain, City, and Hybrid panels. The live copy and controls remain HTML, the left hero region stays text-safe, and the existing dark campaign sources remain available behind the dark-theme selectors.

RESULT (local): PASS
RESULT (production): NOT DEPLOYED

## Root cause and correction

The homepage rendered the dark Quiet Summit artwork and night-oriented terrain images in every theme. Light tokens changed the surrounding surfaces, but the campaign imagery and shade layer still belonged to the dark composition.

WEB-030 adds separate light sources instead of trying to recolor the dark files with CSS. `Home.jsx` renders paired light/dark image sources, while `responsive.css` selects the correct set from `data-theme` and supplies a light-specific text shade. The desktop and mobile heroes use separate crops so the live headline and complete bicycle remain legible at both breakpoints.

## Production assets

| Asset | Output size | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `light-summit-hero.webp` | 2880 x 1801 | 399,978 | `9d1a4f6910b52ee7ceb75cb79a19ae161655619795ee496a4f795114d9ce551f` |
| `light-summit-hero-mobile.webp` | 1440 x 1920 | 232,802 | `5da6919ce4b4d5d4cbb08175f0728e7eb5a410765234fc46be66a5948a80b251` |
| `light-terrain-city.webp` | 1920 x 960 | 113,536 | `a06a6c5fd4a96ccc06415043f7ab12ba6c9b3a8f5445a971cd1cbf3d4c47c40e` |
| `light-terrain-hybrid.webp` | 1920 x 960 | 421,260 | `2cb568213faba6b395a7f367619141e5bd03b6f5ba0d4455258a6fe09afa6c74` |
| `light-terrain-mountain.webp` | 1920 x 960 | 194,272 | `ff58704154eddf2f8c49a8149eb1d94cb53d28cd326b92323625c63d439dae53` |

The untouched generated PNG masters and the exact shared art direction are stored in `artefacts/design/`. `scripts/build-light-home-assets.py` deterministically creates the responsive WebP outputs.

## Visual evidence

- Before desktop: `artefacts/before/desktop-1586x992.png`
- Before mobile: `artefacts/before/mobile-390x844.png`
- Final desktop: `artefacts/after/desktop-1586x992.png`
- Final mobile: `artefacts/after/mobile-390x844.png`
- Design review: repository-root `design-qa.md` - `final result: passed`

The final captures came from a clean Next production build. At 1586 x 992, the desktop hero retains a calm left copy zone and places the rider and full bicycle on the right. At 390 x 844, the portrait source keeps the full bicycle in frame below the copy and CTA. The three shallow desktop terrain crops remain distinct and their labels stay readable.

## Automated verification

- ESLint: `logs/lint.log` - exit 0, 42 existing warnings, 0 errors
- Next production build: `logs/build.log` - exit 0
- Focused Playwright contract: `logs/contract-focused.log` - 13 passed, including desktop/mobile light source selection and dark-source preservation
- Complete Playwright suite: `logs/test-all.log` - 24 passed, including interaction and axe accessibility coverage
- Production-build browser check: zero console errors or warnings
- Managed production start: `logs/production-start.log` - served the final visual QA build successfully
- Parity ensure: `logs/parity.log` - exit 0; `logs/parity-state.json` records governed state `running`
- Slice index and progress telemetry: `logs/slice-index.log` and `logs/progress.log` - exit 0
- Docker status: `logs/docker-compose-ps.txt` - host CLI unavailable; limitation recorded
- Production status: `logs/production-status.md` - public homepage reachable, new asset absent, no deployment initiated
- Go sweep: not applicable because the repository does not define `go:test-all`

The first focused run exposed an existing cold-font timing race in the route-geometry test. `logs/contract-initial-font-race.log` records it; the test now waits for `document.fonts.ready`, after which both focused and complete suites pass.

## Acceptance review

- [x] Dedicated desktop and mobile light heroes
- [x] Dedicated Mountain, City, and Hybrid light panels
- [x] No baked text, controls, logos, borders, or watermarks
- [x] Responsive source selection verified
- [x] Existing dark campaign source selection preserved
- [x] Desktop and mobile visual QA passed
- [x] Lint, build, accessibility, interaction, and console checks passed
- [x] Production remains unchanged pending separate deployment authorization

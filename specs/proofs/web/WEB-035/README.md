# WEB-035 Proof - Product-true configurator and storefront refinements

## Exhaustive Build Your Ride coverage

The configurator now resolves a product-true preview for every selectable state across the full Finspeed range.

- Products: **11**
- Physical SKUs: **18**
- Fit and wheel states: **14**
- Selectable visual states: **1,120**
- Light and dark themed states: **2,240**
- Responsive WebP assets at 480, 960, and 1600 pixels: **6,720**
- Governed physical masters: **224**
- Missing selectable visual classes: **0**

Every product exposes both brake choices, both fork choices, both drivetrain choices, five finishes, and both carrier states where the public domain permits them. Red Snapper, Sea Breeze, and Tiger Shark additionally resolve their separate wheel-fit families. The runtime resolver, manifest hashes, encoded pixel metrics, canonical subject scale, baseline, and safety margins are validated fail-closed before a matrix can become active.

### Catalog-state visual correction (2026-07-26)

Running the full regression for close-out surfaced nine contract failures: the exhaustive pass had made every state — including untouched catalog defaults on the shop grid, product detail, editorial menu, engineering hero, and build detail crops — resolve to AI-assisted matrix renders instead of the governed Tier A stock photography. Per the asset contract (Tier A verified source covers stock product, catalog, and configurator base), the resolver now keeps the governed stock poster for the exact catalog state of every SKU and uses the exhaustive matrix for every deviating selection. The eighteen hash-bound stock registrations the manifest rewrite had dropped were restored verbatim from the committed manifest as `stockFamilies`, and the validator enforces the split exactly: 2,204 themed matrix states plus 36 stock-shadowed themed catalog states cover the 2,240-state contract.

### Final local verification (close-out gates, 2026-07-26)

- ESLint: **0 errors** (`close-out-gates-2026-07-26/lint.txt`)
- TypeScript: **clean** (`close-out-gates-2026-07-26/typecheck.txt`)
- Configurator domain tests: **24 passed, 0 failed** (`close-out-gates-2026-07-26/unit-tests.txt`)
- Master fidelity audit: **192 passed, 0 failed** assisted masters; governed stock masters remain provenance-bound
- Asset validator: **PASS** across 6,884 checked files, including all 108 governed stock poster assets hash-verified (`close-out-gates-2026-07-26/asset-validator.txt`)
- Runtime resolver states matched to manifest: **2,276** (2,204 matrix + 36 stock-shadowed catalog + 36 per-SKU states)
- Full Playwright regression: **68 passed, 0 failed** (`close-out-gates-2026-07-26/playwright-regression.txt`)
- Production build: **clean** (`close-out-gates-2026-07-26/build.txt`)
- Theme/viewport QA: same-day light and dark captures of `/build` at tablet and mobile in `close-out-gates-2026-07-26/`, visually inspected; desktop and route-sweep evidence in `audit-2026-07-21/`
- In-app browser walkthrough: **PASS** for product, fit, brakes, suspension, gears, finish, carrier, review, light/dark theme, mobile, tablet, and desktop states
- Browser runtime errors: **0**
- Deployment: **not performed**

The authoritative counts and per-product breakdown are in `configurator-matrix-coverage.json`; master fidelity evidence is in `configurator-matrix-master-fidelity.json`; the enforced visual geometry and provenance rules are in `asset-contract.md`; the stock-registration restoration script is `close-out-gates-2026-07-26/restore-stock-family-registrations.py`.

## Homepage city-story theme pair

The homepage city-story section now belongs to the same visual system as the selected site theme instead of presenting one fixed campaign treatment in both modes.

- Focused visual result: **PASS**
- Product shown: Red Snapper city bicycle
- Light theme: warm daylight brick-and-stone residence scene with porcelain-toned copy treatment
- Dark theme: dusk city-residence scene with the existing carbon overlay and illuminated product treatment
- Theme behavior: the source photograph, overlay, typography, rules, and calls to action resolve from the active editorial theme
- Keyboard treatment: both calls to action use the strong editorial cyan focus ring on porcelain and carbon surfaces

## Responsive treatment

- Desktop keeps the complete bicycle on the right and a copy-safe architectural field on the left.
- The headline, supporting copy, and two calls to action remain aligned to the shared editorial section gutter.
- At mobile width, the composition becomes a stacked image band so the complete bicycle remains visible instead of being enlarged, clipped, or forced behind the copy.
- Both theme variants preserve the same hierarchy and interaction geometry while changing only the visual temperature and contrast treatment.

## Visual evidence

- Light desktop: `screenshots/home-city-story-light-desktop-final.png`
- Dark desktop: `screenshots/home-city-story-dark-desktop-final.png`
- Light mobile: `screenshots/home-city-story-light-mobile-final.png`
- Dark mobile: `screenshots/home-city-story-dark-mobile-final.png`
- Reference, dark, and light side-by-side: `screenshots/home-city-story-theme-comparison-final.png`

The desktop captures were reviewed at the same viewport for product scale, full-bicycle framing, copy contrast, gutter alignment, background continuity, and theme coherence. The mobile pair verifies the dedicated lower image band and unclipped bicycle composition.

## Editorial-menu pointer intent

The open menu now keeps the last intentionally selected journey active while the cursor crosses from the left index into the right feature pane.

- Interaction result: **PASS**
- Selection model: established preview is latched until menu close or route change
- Hover intent: 120 ms, cancellable when the pointer exits the journey index
- Keyboard model: focus changes the preview immediately; blur does not cause fallback
- Reset model: closing/reopening restores the route-appropriate default
- Regression: `apps/web/tests/contract.spec.ts` covers Engineering selection and pointer travel into the feature pane

### Evidence

- Stable Engineering state: `screenshots/menu-hover-stable-light.png`
- Reported state versus stable state: `screenshots/menu-hover-reference-vs-stable.png`

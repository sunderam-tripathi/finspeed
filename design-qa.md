# Design QA - menu bicycle scale normalization

## Comparison target

- Source visual truth: the four user-provided menu screenshots combined in `tmp/menu-scale-reference-vs-fixed.webp`, plus the clipping report compared in `tmp/menu-clipping-reference-vs-fixed.webp`.
- Rendered implementation: the lower row of `tmp/menu-scale-reference-vs-fixed.webp` and the complete state grid in `tmp/menu-scale-all-states.webp`.
- Route checked: `/` with the global menu open.
- Viewport: in-app Browser desktop capture, 1264 x 711. The supplied 1920 x 1140 references use the same 16:9 layout state.
- States checked: The Bikes, Build Your Ride, Our Engineering, and Visit Finspeed in dark and light themes.
- Full-view comparison evidence: `tmp/menu-scale-reference-vs-fixed.webp` places the four supplied screenshots directly above the matching corrected states.
- Focused-region evidence: `tmp/menu-scale-all-states.webp` isolates the menu product stage across all eight theme/state combinations, so wheel-to-wheel width, handlebar height, baseline, clipping, and edge blending can be compared directly.
- Clipping regression evidence: `tmp/menu-unclipped-light-engineering-2.png`, `tmp/menu-unclipped-dark-engineering.png`, `tmp/menu-unclipped-light-visit.png`, and `tmp/menu-unclipped-dark-visit.png` verify complete handlebars, cables, wheels, and stands for the two tallest silhouettes in both themes.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: unchanged. Menu hierarchy, line wrapping, active-state color, and optical alignment remain consistent in both themes.
- Spacing and layout rhythm: every product now uses one shared image-stage geometry. The bicycle occupies approximately the same proportion of the right panel in every checked state; the earlier dark/light jump is removed.
- Colors and visual tokens: unchanged. Light assets retain the warm porcelain canvas; dark assets retain the seamless black studio field.
- Image quality and asset fidelity: no product pixels were regenerated or stretched in this pass. `object-fit: contain` preserves the original aspect ratio, while a shared stage scale aligns the visible bicycle footprint. The dark generated images remain complete and borderless.
- Copy and content: unchanged.
- Responsive behavior: the image stage now keeps a 1:1 contained scale at every breakpoint, so neither desktop nor mobile states enlarge the render beyond the measured product well.
- Product-stage clipping: removed by constraining the image to the exact bounds of its well (`max-width` and `max-height` at 100%) and containing any asset canvas overflow inside the reserved product stage.
- Browser diagnostics: no runtime errors were introduced. Existing development-only Lucide icon hydration warnings remain outside this image-scale change.

## Comparison history

1. Earlier finding - P1: light-theme bicycles used an enlarged 126% image box and an additional transform, while dark-theme bicycles used a 100% untransformed box. The same product therefore appeared dramatically larger in light mode than in dark mode.
2. Fix: replaced theme-dependent geometry with one centered, bottom-anchored image stage; retained normal blending for the AI dark studio scenes.
3. Post-fix evidence: `tmp/menu-scale-reference-vs-fixed.webp` shows the supplied mismatch above the corrected parity, and `tmp/menu-scale-all-states.webp` verifies all four products in both themes.
4. Follow-up finding - P1: after scale normalization, the image well still used `overflow: hidden`, so the blue engineering bike's handlebar and cables could be cut by the nominal stage boundary.
5. Fix: removed the transform enlargement, constrained both themes to the same measured well, and preserved aspect ratio without model-specific exceptions.
6. Post-fix evidence: `tmp/menu-clipping-reference-vs-fixed.webp` shows the supplied crop beside the corrected light state; the four unclipped screenshots listed above verify both tall silhouettes in light and dark themes.

## Implementation checklist

- [x] Use identical image-stage geometry in light and dark themes.
- [x] Preserve bicycle aspect ratio and full product identity.
- [x] Normalize all four menu product states without per-model exceptions.
- [x] Keep the same fully contained product scale at tablet and mobile widths.
- [x] Verify keyboard focus state changes the menu preview.
- [x] Verify all eight desktop theme/state combinations visually.
- [x] Verify the engineering and visit silhouettes have complete handlebars and wheel outlines in both themes.
- [x] Run the production build.

## Follow-up polish

- None required for this scale correction.

## WEB-035 Mako Shark exhaustive configurator matrix addendum

### Comparison target

- Route checked: `/build`, Build Your Ride wizard.
- Product identity: Mako Shark side-right configurator preview.
- Matrix proof: `specs/proofs/web/WEB-035/mako-exhaustive-r01/mako-exhaustive-catalog-contact-sheet.jpg`.
- Live wizard proof: `specs/proofs/web/WEB-035/mako-exhaustive-r01/build-wizard-mako-matrix-final.png`.
- Generated inventory: `apps/web/public/assets/configurator/v1/mako-shark/side-r/matrix/mako-exhaustive-r01.inventory.json`.

### Findings

- The Mako Shark wizard is now selection-driven rather than static.
- Setup choices expose brake, fork, and drivetrain alternatives; Finish exposes five finish states; Extras exposes no add-ons and IBC carrier.
- The selected image resolves through the generated matrix. A verified live state resolved to `mako-power-front-single-red-carrier-r01-w960.webp` after selecting Power brake, Front suspension, Single speed, Signal red, and IBC frame-mounted carrier.
- The matrix covers 80 combinations: 2 brakes x 2 forks x 2 drivetrains x 5 finishes x 2 carrier states, with light and dark responsive assets generated for each.
- Validation confirmed all referenced assets exist, image hashes match the manifest inventory, responsive sources resolve, and the runtime resolver maps matrix states correctly.

### Verification

- `node --test apps\web\src\design\data\configurator.test.mjs` passed.
- `node scripts\validate-configurator-assets.mjs` passed.
- `npm run build -w web` passed.

final result: passed

## WEB-035 homepage city-story theme-pair addendum

### Comparison target

- Route checked: `/`, homepage city-story section.
- Product identity: Red Snapper city bicycle in both themes.
- Light-theme evidence: `specs/proofs/web/WEB-035/screenshots/home-city-story-light-desktop-final.png`.
- Dark-theme evidence: `specs/proofs/web/WEB-035/screenshots/home-city-story-dark-desktop-final.png`.
- The final captures use the same desktop viewport so product scale, composition, gutter alignment, and contrast can be compared directly.

### Findings

- No actionable P0, P1, or P2 visual finding remains in the focused city-story comparison.
- Theme coherence: light mode uses a warm daylight residential scene, porcelain-compatible overlay, and dark editorial ink; dark mode uses the dusk counterpart, carbon overlay, and light editorial ink.
- Product fidelity and scale: the Red Snapper remains the subject in both variants, with the complete bicycle visible and comparably sized rather than changing footprint between themes.
- Background continuity: theme-aware gradients bridge the copy field into each photograph without a hard image boundary or isolated banner effect.
- Typography and spacing: the headline, supporting line, and calls to action share the established editorial gutter and hierarchy.
- Responsive behavior: below the mobile breakpoint, the photograph becomes a lower image band and the overlay transitions vertically, keeping the full bicycle visible without clipping while retaining readable copy above it.

final result: passed

## WEB-035 editorial-menu viewport-containment addendum

### Comparison target

- Reported source visual: `specs/proofs/web/WEB-035/screenshots/menu-viewport-source-1920x1140.png`.
- Implemented light state: `specs/proofs/web/WEB-035/screenshots/menu-viewport-light-1920x1140-final.png`, route `/`, menu open, 1920 x 1140 viewport.
- Implemented dark state: `specs/proofs/web/WEB-035/screenshots/menu-viewport-dark-1536x912-final.png`, route `/`, menu open, 1536 x 912 viewport.
- Full-view comparison input: `specs/proofs/web/WEB-035/screenshots/menu-viewport-comparison-1920x1140.png`.
- Focused product-stage comparison input: `specs/proofs/web/WEB-035/screenshots/menu-viewport-focused-comparison.png`.
- Additional responsive states checked in the in-app Browser: 1280 x 720 desktop and 390 x 844 mobile.

### Findings

- P1 resolved: the transformed bicycle render previously extended beyond the right and bottom edges of the measured product well. At 1920 x 1140, the image was approximately 1024 x 801 inside a 868 x 679 stage.
- P1 resolved: the final 1920 x 1140 image and well share the same 906 x 681 geometry, leaving the complete handlebars, wheels, mudguards, cables, and floor contact visible.
- P1 resolved: at 1536 x 912 in dark mode, the image and well share the same 707 x 516 geometry and the owner rail ends at y=892, inside the 912px viewport.
- P1 resolved: at 1280 x 720, the image remains fully contained at 579 x 324 and the owner rail ends at y=700, inside the 720px viewport.
- Typography and hierarchy: unchanged; all four journeys remain readable and retain the established active-state treatment.
- Spacing and proportions: the split now gives the product pane slightly more width, while vertical padding and row gaps use viewport-height-aware clamps for compact laptop screens.
- Theme parity: light and dark assets use identical stage geometry and containment behavior.
- Mobile: the menu becomes a vertical scroll surface; navigation remains first, feature content follows, and the image stays horizontally contained without transform clipping.
- Interaction: Escape-to-close and pointer transfer into the feature pane remain intact.
- Browser diagnostics: no new runtime errors were observed during the final light and dark captures.

### Comparison history

1. Before: a 1.18 image transform enlarged the bicycle beyond its own layout box, causing the product to be cut at the viewport edges.
2. Fix: removed transform enlargement at every breakpoint, constrained the render to 100% of the well in both axes, contained asset overflow, widened the product pane from 50% to 52%, and made vertical spacing height-aware.
3. After: the full-view and focused comparisons show the complete product with deliberate breathing room and a visible owner rail in the exact reported viewport.

### Verification

- [x] Production build completed successfully.
- [x] Three editorial-menu regression tests passed, including hover transfer and Escape close.
- [x] New geometry contract passed at 1920 x 1140, 1536 x 912, and 1280 x 720.
- [x] Visual QA completed in the in-app Browser for light, dark, compact desktop, and mobile states.

final result: passed

## WEB-035 editorial-menu pointer-intent addendum

### Comparison target

- Reported source: `C:/Users/SUNDER~1/AppData/Local/Temp/codex-clipboard-971a8f2a-f8eb-4eea-a42e-087f33589425.png`, light theme with the full editorial menu open.
- Implemented state: `specs/proofs/web/WEB-035/screenshots/menu-hover-stable-light.png`, captured from `/` with `Our Engineering` intentionally selected and the pointer transferred into the right feature pane.
- Combined evidence: `specs/proofs/web/WEB-035/screenshots/menu-hover-reference-vs-stable.png`.
- Implementation viewport: in-app Browser desktop capture, 1280 x 720. The supplied reference includes browser chrome; the page composition and open-menu state are otherwise equivalent.

### Findings

- P1 resolved: leaving the left navigation no longer clears the established preview and falls back to the route-default item.
- P1 resolved: row changes now use a cancellable 120 ms pointer-intent delay, preventing incidental diagonal travel across neighboring rows from replacing the selected context.
- Pointer transfer proof: a real in-app Browser pointer event selected `Our Engineering`, then entered the right feature pane; after 260 ms the row retained `is-active`, the eyebrow remained `Built around the rider.`, and the Shark Blue product image remained selected.
- Keyboard behavior: focus still selects a journey immediately, and blur no longer discards the context before the user reaches the feature actions.
- Lifecycle behavior: closing and reopening the menu resets to the route-appropriate journey, and route navigation also clears pending hover intent.
- Visual design: no geometry, color, typography, image scale, or spacing changed in this interaction pass.
- Regression coverage: `apps/web/tests/contract.spec.ts` now includes a pointer-transfer contract for the Engineering journey and right feature pane.

### Comparison history

1. Before: `onMouseLeave` on the left navigation and `onBlur` on each row immediately cleared preview state; moving toward the feature pane restored the route-default content.
2. Fix: latch the last established preview for the lifetime of the open menu, introduce cancellable hover intent, and clear only pending intent when the pointer exits the navigation or enters the feature pane.
3. After: the selected journey remains stable throughout left-to-right cursor travel, while deliberate row changes and close/reopen behavior still work.

final result: passed

## WEB-035 close-out gates and catalog-visual correction addendum (2026-07-26)

### Comparison target

- Route checked: `/build` default state plus the catalog surfaces asserted by `apps/web/tests/contract.spec.ts` and `apps/web/tests/product-detail-editorial.spec.ts`.
- Gate evidence: `specs/proofs/web/WEB-035/close-out-gates-2026-07-26/`.
- Same-day captures: `light-build-tablet-2026-07-26.png`, `dark-build-tablet-2026-07-26.png` (768 x 1024), `light-build-mobile-2026-07-26.png`, `dark-build-mobile-2026-07-26.png` (375 x 812), all visually inspected.

### Findings

- P0 resolved: the exhaustive matrix pass had redirected every catalog surface and untouched configurator default to AI-assisted matrix renders. The shop grid, product detail pages, editorial menu, engineering hero, build detail crops, and the configurator base state now serve the governed Tier A stock photography again, while every deviating selection still resolves through the exhaustive matrix.
- Manifest governance restored: the eighteen per-SKU stock poster registrations (hashes, pixel metrics, generation records) are back in the manifest as `stockFamilies`; the validator hash-verifies all 108 stock assets and enforces exactly 36 stock-shadowed themed catalog states alongside 2,204 runtime-matched themed matrix states.
- Spec repairs: one array-form `toContainText` assertion that could never match a single panel, and one unscoped disclosure lookup that broke under the now-duplicated Bull Shark identity note (blocking alert plus honest preview caption), were tightened.
- Default-state preview verified live in both themes: the resolver returned `mako-shark-27-5-geared-r01-w1600.webp` from the light and dark poster roots during the capture run.

### Verification

- `npm run lint -w web` passed with 0 errors.
- `npm run typecheck -w web` passed.
- `npm run test:unit -w web` passed 24/24.
- `node scripts/validate-configurator-assets.mjs` passed across 6,884 files.
- `npm run test -w web` passed 68/68.
- `npm run build -w web` passed.

final result: passed

## WEB-037 production UAT addendum (2026-07-26)

### Comparison target

- Route checked: the live production build on `https://www.finspeed.online` (Amplify `main` after the WEB-035/036/REPO-004 merges).
- Evidence: `specs/proofs/web/WEB-037/` (driver, observations, scored results, 24 captures across desktop/mobile and light/dark).

### Findings

- Storefront, configurator (stock and custom paths), distributor gate, and consent fail-closed all verified directly in production; 45/48 objective checks pass with 0 console errors, and the three scripted failures are adjudicated in the proof (two driver artefacts, one real defect).
- P1 (pre-existing): `/dealers` serves the editorial Visit page because production delivers the client shell for every route (suspected WEB-022-era Amplify SPA rewrite); the tested dealer locator and all per-route SSR titles/meta are bypassed site-wide. Triaged to a follow-up delivery-layer slice.
- P3 polish: review sticky-bar price occlusion at 1440px; preview "preparing" treatment through stage transitions; distributor sign-in content outside a main landmark.

final result: passed with findings

## WEB-038 delivery-metadata fix addendum (2026-07-26)

### Comparison target

- Route checked: `https://www.finspeed.online` before and after the PR #9
  release (Amplify `main` build of `511b04e`).
- Evidence: `specs/proofs/web/WEB-038/` (before-captures, parity logs,
  production driver results, inspected locator screenshot).

### Findings

- WEB-037's P1 is re-adjudicated: the dealer locator was already live at
  `/dealers` — the scripted marker word "dealer" no longer exists in the
  redesigned copy, and the screenshot review misread the locator hero for the
  Stores page. The real gaps were discoverability (nothing linked `/dealers`)
  and server metadata (client-only shell with one generic title everywhere;
  unknown paths returned 200). The suspected Amplify SPA rewrite is refuted by
  origin evidence; a confirmatory CLI audit of the app's custom rules remains
  pending AWS reauthentication.
- Fixed in production and verified live (11/11 driver checks): per-route
  server titles/descriptions from a single shared map (client and server
  cannot drift), real product-name titles, HTTP 404 plus a branded not-found
  page for unknown paths, distributor portal noindex, and locator entry
  points (footer "Dealer locator", Stores-page CTA) with the header
  "Visit Finspeed" narrative deliberately kept on `/stores`.
- The home title stays the indexed brand title in both layers, removing the
  post-hydration title flip.

final result: passed — production verified; Amplify rule audit pending
credentials

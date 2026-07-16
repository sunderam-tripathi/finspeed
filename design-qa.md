# Design QA - WEB-031 responsive product imagery

## Comparison target

- Source visual truth: `C:\Users\SunderamTripathi\OneDrive - Archetype Consulting\_Archive\Documents\Picture upscale\outputs\delivery\Finspeed-Upscaled-Final\04-qa-and-documentation\production-overview.png`
- Source manifest SHA-256: `212ACC9E20540A10EFB63195AF5DDD8907807E1755425A7DB56BA0809D0FC850`
- Implementation route: `http://127.0.0.1:3100/shop`
- Viewports: 1440 x 900 desktop and 390 x 844 mobile.
- State: light catalog pages 1 and 2; Mako Shark product detail in light and dark themes.

## Evidence

- Full-view catalog: `specs/proofs/web/WEB-031/artefacts/after/shop-side-profile-desktop-1440x900.png`
- Full-view page 2: `specs/proofs/web/WEB-031/artefacts/after/shop-side-profile-page-2-desktop-1440x900.png`
- Focused lower row: `specs/proofs/web/WEB-031/artefacts/after/shop-side-profile-page-2-lower-desktop-1440x900.png`
- Mobile: `specs/proofs/web/WEB-031/artefacts/after/shop-side-profile-mobile-390x844.png`
- Product detail light: `specs/proofs/web/WEB-031/artefacts/after/product-detail-side-profile-desktop-1440x900.png`
- Product detail dark: `specs/proofs/web/WEB-031/artefacts/after/product-detail-side-profile-dark-desktop-1440x900.png`
- Browser interaction and console proof: `specs/proofs/web/WEB-031/logs/browser-qa.md`

The production overview and the final catalog screenshots were opened together in one comparison input. The page-2 upper and lower captures provide focused evidence because they make the remaining five product silhouettes readable at card scale.

## Findings

- No actionable P0, P1, or P2 product-image findings remain.
- Image quality and asset fidelity: all 11 products use verified high-resolution delivery masters and responsive WebP derivatives. The selected sources form the closest available side-profile family without altering product geometry, branding, drivetrain, wheels, or colorways.
- Spacing and layout rhythm: the existing card grid, image wells, product scale, and whitespace remain unchanged. Images are fully framed and do not overlap or clip at either viewport.
- Fonts and typography: the existing display/body/mono hierarchy and wrapping are preserved. The dark product-title token regression found during pass 1 is fixed.
- Colors and visual tokens: catalog wells remain neutral white for reliable product comparison. Light/dark semantic text tokens now keep the product title readable without changing the imagery.
- Copy and content: product names, series, prices, labels, and descriptions remain unchanged.
- Responsiveness: desktop and 390-pixel mobile layouts preserve the product silhouette and readable catalog hierarchy.
- P3 accepted source constraint: Sunset Marlin remains mildly three-quarter because its delivery contains only two three-quarter views. `angle-1` is the less distorted and closest side-facing source; generating a replacement would risk changing the product.

## Comparison history

- Pass 1: the catalog comparison confirmed consistent side-profile selection, but dark-theme product-detail QA exposed an invisible Mako Shark title (`--ink-900` on the dark page). Result blocked by one P2 color-token issue.
- Fix: the product title, section headings, and related-product names in `ProductDetail.jsx` now use semantic `--text-strong`.
- Pass 2: the final dark capture shows the title in white (`rgb(255, 255, 255)`), all product images remain unchanged, source selection is correct, and the console is clean. No P0/P1/P2 findings remain.

## Implementation checklist

- [x] Compare every available product angle in the delivery overview.
- [x] Select the closest available side profile per product rather than relying on filename order.
- [x] Verify all 11 cards across both catalog pages.
- [x] Verify desktop and mobile responsive source selection.
- [x] Verify product-detail image selection in light and dark themes.
- [x] Fix the dark-theme semantic title token found during QA.
- [x] Verify pagination, theme toggle, semantic names, and console errors.

Residual test gap: the standalone Playwright accessibility/regression suite was not run under the selected-browser constraint. This does not leave a visible design mismatch in the tested flow.

final result: passed

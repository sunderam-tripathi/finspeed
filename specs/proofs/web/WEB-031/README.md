# WEB-031 Proof - High-resolution storefront asset integration

## Outcome

The verified `Finspeed-Upscaled-Final` delivery now supplies the storefront's product photography and light/dark campaign derivatives. The 4x PNG masters remain outside the application; the browser receives responsive WebP assets generated at controlled dimensions and quality. The approved homepage layout, live copy, controls, theme behavior, and commerce routes are unchanged.

RESULT (local): PASS
RESULT (production): NOT DEPLOYED

## Source and provenance

- Source package: `Finspeed-Upscaled-Final`
- Delivery manifest SHA-256: `212ACC9E20540A10EFB63195AF5DDD8907807E1755425A7DB56BA0809D0FC850`
- Source verification: every selected input hash is checked against `DELIVERY-MANIFEST.json` before encoding.
- Production provenance: `apps/web/public/assets/asset-provenance-upscaled.json`
- Rebuild script: `scripts/build-upscaled-web-assets.py`
- Encoder: Pillow 12.2.0, LANCZOS downsampling, WebP quality 82-86, method 6.

The product map chooses the closest available clean side profile for all eleven catalog models instead of assuming every `angle-1` file has the same camera position. The `great-white-shark` application id maps to the delivery's `great-white` product directory. The corrected Bull Shark 3x7 drivetrain and the region-corrected Red Snapper wordmark remain authoritative; superseded delivery references are excluded.

| Product | Selected source |
| --- | --- |
| Bull Shark | `angle-1` |
| Great White Shark | `angle-1` |
| Hammerhead | `angle-3` |
| Lemon Shark | `angle-3` |
| Lightning Marlin | `angle-2` |
| Mako Shark | `angle-2` |
| Red Snapper | corrected `angle-1` |
| Sea Breeze | `angle-1` |
| Shark Blue | `angle-1` |
| Sunset Marlin | `angle-1` (closest available side view; no true side profile is present in the delivery) |
| Tiger Shark | `angle-3` |

## Browser assets

- 33 product derivatives: 480, 960, and 1600-pixel widths for eleven catalog models.
- 8 responsive summit hero derivatives: light/dark desktop and mobile at 1x/2x sizes.
- 12 terrain derivatives: light/dark Mountain, City, and Hybrid at 960 and 1920-pixel widths.
- Total output: 53 files, 5,368,204 bytes.
- Largest file: `light-summit-hero.webp`, 532,630 bytes.
- Print-scale PNG masters served by the application: none.

## Implementation

- Catalog cards select 480/960/1600 WebPs using `srcset` and layout-aware `sizes`.
- Product detail pages expose the 1600-pixel source with responsive fallback candidates.
- Cart, checkout, account, and related-product thumbnails use the 480-pixel derivative.
- Distributor product thumbnails use the same verified 480-pixel catalog derivatives.
- Homepage desktop/mobile heroes use responsive light/dark source sets.
- Terrain panels use responsive 960/1920 source sets; the dark Mountain panel now uses the delivery's authoritative terrain master.
- Image decoding and lazy loading are applied where appropriate without changing visible layout or interaction semantics.

## Verification

- Asset provenance verification: `logs/asset-verification.md` - PASS.
- ESLint: `logs/lint.md` - exit 0, 0 errors, 42 existing warnings.
- Next production build: `logs/build.md` - exit 0.
- In-app browser QA: `logs/browser-qa.md` - PASS for both catalog pages at 1440 x 900, the catalog at 390 x 844, product detail in light/dark themes, responsive source selection, pagination, theme toggle, and console errors.
- Automated Playwright accessibility/regression suite: not run; the Product Design browser contract required using the user's selected in-app browser. Semantic names, image alt text, and control states were inspected through the browser accessibility snapshot.
- Production status: `logs/production-status.md` - no deployment initiated.

## Acceptance review

- [x] Authoritative product masters mapped to every storefront model
- [x] Corrected Bull Shark and Red Snapper production sources used
- [x] Responsive product and campaign WebPs generated
- [x] Print-scale masters excluded from browser payloads
- [x] Deterministic source/output provenance recorded
- [x] Existing layout, copy, theme, and commerce behavior preserved in code
- [x] Desktop/mobile catalog and light/dark product-detail rendered QA passed
- [x] Product-card and product-detail browser source selection passed
- [x] Pagination, theme toggle, semantic snapshot, and console checks passed
- [ ] Standalone automated Playwright accessibility/regression suite (not run under the selected-browser constraint)
- [x] Lint and production build passed
- [x] Production remains unchanged pending separate deployment authorization

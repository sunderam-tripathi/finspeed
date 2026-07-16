# WEB-032 Proof - Updated Red Snapper product master

## Outcome

Red Snapper now uses the supplied `side-clean.png` cycle master in its catalog card, product-detail gallery, related products, search, cart, checkout, account, and distributor thumbnails through the existing shared responsive product-image mapping.

RESULT (local): PASS
RESULT (production): PASS

## Source and outputs

- Source: `01-raster-masters-4x/products/red-snapper/side-clean.png`
- Source SHA-256: `BF5CE4CE5E8436202EDF07532EA01760967551D2B9A1BAB15466672919BD34FD`
- Current delivery manifest SHA-256: `B9042B97CB67D7771B84ADA1D20D6FD85B9263102E1350F9BDF2B224D74F27DC`
- 480 px WebP: 20,566 bytes, SHA-256 `FC02FD46772584AC0FC0C4E6514B103FD656BF96D90032AC060402EED4943CB0`
- 960 px WebP: 59,218 bytes, SHA-256 `24C3BA058AB15CC77441F670EABA642DC306CBEC693665DA357CB9C4135CF058`
- 1600 px WebP: 121,022 bytes, SHA-256 `B3A2A0FE498C88B1BFF75A205F6C7271B1E44E9BF85A97AD7A4AD0852696B0BE`

The delivery manifest changed with the newer Red Snapper master. Only the three Red Snapper derivatives, their provenance records, the delivery-manifest provenance hash, and the deterministic source mapping changed in the application. All other generated asset hashes remain stable.

## Verification

- Asset/provenance verification: `logs/asset-verification.md` - PASS.
- In-app browser QA: `logs/browser-qa.md` - PASS.
- ESLint: `logs/lint.md` - exit 0, 0 errors, 42 existing warnings.
- Next production build: `logs/build.md` - exit 0.
- Design QA: project-root `design-qa.md` - `final result: passed`.
- Amplify release: `logs/amplify-job-403.json` - job 403, BUILD/DEPLOY/VERIFY all `SUCCEED`.
- Production verification: `logs/production-status.md` - public routes, exact asset hash, rendered image, responsive source selection, layout width, and browser console all pass.

## Acceptance review

- [x] New Red Snapper source verified against the delivery manifest
- [x] Responsive 480/960/1600 WebPs regenerated
- [x] Catalog card selects the 480 px derivative
- [x] Product detail selects the 960 px derivative at 1440 x 900
- [x] Product remains fully framed and sharp in both contexts
- [x] Layout, copy, price, controls, and other product assets remain unchanged
- [x] Browser console is clean
- [x] Lint and production build pass
- [x] Amplify production deployment succeeds on job 403
- [x] Public Red Snapper 1600 px asset matches the expected SHA-256
- [x] Public product page renders the new master without clipping, broken images, horizontal overflow, or console errors

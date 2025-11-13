# Contract Test Plan — SCN-003

- **Data**: Validate `CATALOG-001` slice using `contracts/catalog-item.schema.json` before build; fail if warranty, sizing, or finance fields missing. Add Playwright check to ensure localized copy renders for `en` and `hi`.
- **UI**: Snapshot and accessibility tests for `IC-11` covering hero, gallery, spec tabs, CTA disabled state, and dealer outage banner. Verify Next.js route builds with no hydration mismatches.
- **Events**: Contract-test `site.interaction.analytics.v1` events (`model_dealer_cta_click`, `model_gallery_interaction`, `model_specs_copy`) asserting payload keys (`model_slug`, `asset_type`, `section`) and consent gating.
  - Reference: `../_shared/contracts/site-interaction-ga4.md`.
  - Playwright GA4 fixture posts consented event + captures DebugView screenshot before release.
- **Error paths**: Simulate missing catalog record to ensure 404 page appears; assert JSON-LD validator failure surfaces toast and emits `model_jsonld_validation_error` without blocking navigation.

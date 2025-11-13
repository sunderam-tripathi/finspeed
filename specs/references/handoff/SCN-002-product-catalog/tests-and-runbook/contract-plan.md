# Contract Test Plan — design-0.1-REQ-002

## UI interfaces
- **IC-9 Catalog listing & filter UI**
  - Visual regression (desktop + mobile) to capture value badges and empty state.
  - Accessibility checks ensuring filter focus management and screen-reader friendly messaging.
  - Unit test verifying query string state sync and `catalog_filter_applied` payload map.
- **IC-10 Comparison drawer**
  - Snapshot test for 1, 2, 3 model selections highlighting difference rows.
  - Interaction test confirming selection cap with inline notice.
  - Accessibility audit validating focus trap and live region announcements.

## Data contracts
- `catalog-item.schema.json` validated against CSV on every build; tests fail on extra columns or missing mandatory fields.

## Events
- `site.interaction.analytics.v1`
  - Reference contract: `../_shared/contracts/site-interaction-ga4.md` (envelope + payload fields).
  - Ensure new events (`catalog_filter_applied`, `catalog_compare_opened`, `catalog_compare_removed`) include `filter_id`, `filter_value`, `results_count`, `comparison_models`, `removed_model` (as applicable).
  - Playwright GA4 fixture posts consented event and captures DebugView screenshot before each release.
  - Negative test: Attempt to send event without consent flag → blocked.

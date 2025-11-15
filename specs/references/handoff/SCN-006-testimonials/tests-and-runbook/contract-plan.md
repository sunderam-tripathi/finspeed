# Contract Test Plan — SCN-006

- **Data**: Validate TESTIMONIAL-001 JSON via `contracts/testimonial.schema.json`; ensure consent flag recorded and optional media fields validated.
- **Interface**: Component tests for `IC-14` verifying keyboard navigation, autoplay toggle states, pagination dots, and reduced motion fallback.
- **Events**: Unit tests to assert `testimonial_slide_view`, `testimonial_autoplay_toggled`, `testimonial_category_filter` payloads (id, position, enabled, category).
  - Reference: `../_shared/contracts/site-interaction-ga4.md`.
  - Playwright GA4 fixture posts consented events + captures DebugView screenshot before release.
- **Integration**: Ensure module exports both standalone and slot usage (home/catalog); confirm GA4 stub receives events only post consent.

# Contract Test Plan — SCN-004

- **Data**: Convert `DEALER-001` CSV to GeoJSON and validate with `contracts/dealer-locations.schema.json`; enforce required coordinates/services and radius-friendly postal code format.
- **Interface**: Component contract tests for `IC-12` verifying postal validation, filter chips, synchronized map focus, and outage banner state. Accessibility assertions (keyboard nav, aria labels) captured via Playwright axe.
- **Events**: Automated GA4 stub tests ensuring `dealer_search_submitted`, `dealer_directions_click`, and `dealer_contact_action` payloads include postal prefix/radius/channel and respect consent.
  - Reference: `../_shared/contracts/site-interaction-ga4.md`.
  - Playwright GA4 fixture posts consented events + captures DebugView screenshot before release.
- **Failure behaviours**: Chaos test toggles `dealerLocator.enableWhatsApp` off and simulates map tile failure to ensure fallback list renders without JS errors.

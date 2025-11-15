# Contract Test Plan — design-0.1-REQ-001

## Interface contracts
- **IC-6 Language toggle**
  - Storybook visual regression + axe audit for English ↔ Hindi.
  - Unit test asserting consent gate prevents cookie write when denied.
  - Fallback path: simulate missing key, expect English copy + console warning.
- **IC-8 Primary navigation**
  - Snapshot test covering desktop + mobile drawer states.
  - Tab order contract: keyboard traversal enumerated and asserted.
  - Dealer CTA instrumentation: intercept analytics payload contains `event_name=dealer_directions_click` and `cta_id=dealers`.

## Events
- `site.interaction.analytics.v1`
  - Reference contract: `../_shared/contracts/site-interaction-ga4.md` (envelope + payload fields).
  - Schema validated via JSON schema test harness.
  - Playwright GA4 fixture posts consented event and captures DebugView screenshot before each release.
  - Negative case: missing `locale` fails validation; missing optional fields allowed.
  - Idempotency: event-source composed of route + element ID; duplicate toggles within 200ms are deduped in test harness.

# Contract Test Plan — SCN-005

- **Content**: Validate BRAND-001 JSON using `contracts/brand-story.schema.json` (hero, timeline, metrics length). Ensure localized MDX compiles for `en` and `hi`.
- **UI**: Visual regression + axe checks for `IC-13` verifying timeline accessibility, counter animation fallback, CTA strip behaviour, and community carousel controls.
- **Events**: Stub GA4 tests covering `brand_timeline_scroll_depth`, `brand_metric_hover`, `brand_cta_click` payloads and consent gating.
  - Reference: `../_shared/contracts/site-interaction-ga4.md`.
  - Playwright GA4 fixture posts consented events + captures DebugView screenshot before release.
- **Integrations**: Confirm CTA destinations align with navigation config; verify `brand_story` page registers in sitemap and canonical tags.

# Contract Test Plan — SCN-008

- **Data**: Validate CONTACT-001 and FAQ-001 using `support-channels.schema.json` and `faq-entry.schema.json`; ensure SLA format and FAQ lengths correct.
- **Interface**: Component tests for `IC-16` covering channel availability toggles, consent gating, incident banner, FAQ search behaviour, and keyboard navigation.
- **Events**: Assert `support_channel_click`, `support_faq_search`, `support_incident_banner_view` payloads with channel id, query, banner id, consent flags.
  - Reference: `../_shared/contracts/site-interaction-ga4.md`.
  - Playwright GA4 fixture posts consented events + captures DebugView screenshot before release.
- **Form**: Reuse IC-7 contract tests; ensure hashed emails + message length constraints before hitting Formspree and verify fallback copy when disabled.

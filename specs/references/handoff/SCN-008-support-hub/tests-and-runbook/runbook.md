# Runbook — SCN-008 Support hub

## Deploy
- Validate CONTACT-001 and FAQ-001 schemas, update incident banner copy if needed.
- Run Playwright `TST-E2E-006` (desktop/mobile) focusing on consent gating and FAQ search.
- Enable `supportHub.enable` flag and deploy static build; confirm Formspree key present.

## Rollback
- Disable `supportHub.enable` and redirect `/support` to anchor on `/`.
- Remove status banner entries referencing current release if inaccurate.
- Purge CDN caches for `/support` to deliver fallback experience.

## First response
- **Channel outage**: Update `status/support.json` with outage message, disable affected CTA via feature flag, and notify support ops.
- **Form failures**: Inspect Formspree status; if failing, hide form and promote email CTA; re-enable after resolution.
- **Analytics missing**: Check consent manager + GA4 debug; ensure event emitter capturing `support_*` events post consent.

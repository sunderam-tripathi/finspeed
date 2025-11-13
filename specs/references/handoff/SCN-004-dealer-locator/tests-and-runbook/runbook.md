# Runbook — SCN-004 Dealer locator

## Deploy
- Validate `DEALER-001` schema and ensure service tags populated for each dealer.
- Run Playwright `TST-E2E-004` (desktop/mobile) and Lighthouse map performance check.
- Toggle `dealerLocator.enable=true` and `dealerLocator.enableWhatsApp` based on support readiness; deploy static build.

## Rollback
- Disable `dealerLocator.enable` flag and redeploy previous static assets.
- Remove `/dealers` link from navigation config if the page must be hidden entirely.
- Clear CDN cache for `/dealers` to ensure fallback page is served.

## First response
- **Search failures**: Inspect console for validation errors, confirm schema pipeline succeeded; if data issue, revert to last known good GeoJSON.
- **Map outage**: Notify support ops, enable outage banner via `status/support.json`, and flip flag to hide map while keeping list active.
- **Analytics gaps**: Check consent manager and network logs; if GA4 offline, queue events locally and report to growth analyst.

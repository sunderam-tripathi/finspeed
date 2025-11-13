# Proof — WEB-005 (Dealer locator analytics)

Scope:
- Analytics dispatcher (`apps/web/src/lib/analytics.ts`) now pushes consent-aware payloads into `window.dataLayer` + console fallback with postal prefix/radius metadata.
- `/dealers` page emits GA-like events on search, directions, and WhatsApp interactions.
- Playwright test (`apps/web/tests/dealer-locator.spec.ts`) inspects `window.dataLayer` to verify payload structure and consent flag.

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`
- Telemetry snapshots: `artefacts/slice-index.log`, `artefacts/progress.log`

RESULT: PASS (local). CI guard already installs browsers and runs Playwright.

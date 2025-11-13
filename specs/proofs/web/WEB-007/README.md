# Proof — WEB-007 (Consent + GA4 integration)

Scope:
- Consent banner (`apps/web/src/components/consent-banner.tsx`) + hook ensure users opt-in/out; preference persisted to localStorage and piped to analytics dispatcher.
- Analytics dispatcher now respects consent and enriches GA payloads; Playwright tests assert dataLayer entries only exist after accepting consent.

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local). CI guard runs lint/tests automatically.

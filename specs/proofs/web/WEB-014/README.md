# Proof — WEB-014 (Dealer locator outage automation)

Implementation:
- Outage toggle now logs `dealer_locator_outage` GA events (with throttling) and banner references fallback contact info (`apps/web/src/app/dealers/page.tsx`).
- Analytics dispatcher already supports the new event; Playwright test `apps/web/tests/outage.spec.ts` confirms event emission.

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local).

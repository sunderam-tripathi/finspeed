# Proof — WEB-015 (Dealer locator data API)

Implementation:
- Created Next.js API route `apps/web/src/app/api/dealers/route.ts` that serves the SCN-004 dealer dataset.
- `/dealers` now fetches this endpoint (with fallback + loading message) and logs GA events when pins/CTAs are triggered (`apps/web/src/app/dealers/page.tsx`).

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local).

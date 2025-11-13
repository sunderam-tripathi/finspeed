# Proof — WEB-011 (Support hub)

Implementation:
- Support data derived from SCN-008 encoded in `apps/web/src/data/support.ts`.
- `/support` route renders bilingual hero, contact tiles, and FAQ accordions (`apps/web/src/app/support/page.tsx`).
- Playwright spec `apps/web/tests/support.spec.ts` verifies bilingual hero + contact visibility.

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local).

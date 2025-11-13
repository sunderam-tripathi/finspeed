# Proof — WEB-008 (Brand story page)

Implementation:
- Brand story data derived from SCN-005 references (`apps/web/src/data/brand.ts`).
- `/brand-story` route renders mission pillars, timeline, bilingual hero, and CTA strip referencing catalog/dealer links (`apps/web/src/app/brand-story/page.tsx`).
- Playwright spec `apps/web/tests/brand-story.spec.ts` asserts hero copy and CTA visibility.

Verification:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local). Page ready for further styling or CMS hookup.

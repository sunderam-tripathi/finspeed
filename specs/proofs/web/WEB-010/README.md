# Proof — WEB-010 (Blog landing)

Implementation:
- Blog data derived from SCN-007 references captured in `apps/web/src/data/blog.ts`.
- `/blog` page renders bilingual hero, featured article, recent posts grid, and newsletter CTA (`apps/web/src/app/blog/page.tsx`).
- Playwright spec `apps/web/tests/blog.spec.ts` verifies hero headings for EN/HI locales.

Verification:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local).

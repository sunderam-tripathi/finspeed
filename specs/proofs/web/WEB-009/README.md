# Proof — WEB-009 (Testimonials page)

Implementation:
- Testimonial data drawn from SCN-006 pack encoded in `apps/web/src/data/testimonials.ts`.
- `/testimonials` page renders bilingual hero, quote cards, CTA block referencing support channels (`apps/web/src/app/testimonials/page.tsx`).
- Playwright test `apps/web/tests/testimonials.spec.ts` verifies hero headings toggle between locales.

Verification:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local).

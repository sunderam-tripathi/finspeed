# Proof — WEB-003 (Dealer locator shell)

Implementation notes:
- `/dealers` route renders postal search form, filter chips, outage banner, and dealer list seeded from SCN-004 data (`apps/web/src/app/dealers/page.tsx`, `src/data/dealers.ts`).
- Analytics stub logs `dealer_search_submitted`, `dealer_directions_click`, and `dealer_contact_action` to the console via `src/lib/analytics.ts`.
- Default radius = 20km; postal validation enforces 6-digit requirement with inline error.

Verification steps:
- Manual run: `npm run dev -w web` then visit `/dealers` to exercise search/filter/outage states.
- `npm run lint -w web` → `artefacts/lint.log`.
- `npm run test -w web` (SCN-001 suite) → `artefacts/playwright.log`.

Artifacts:
- Screenshots/logs: `artefacts/`
- Telemetry logs after completion: `artefacts/slice-index.log`, `artefacts/progress.log`.

RESULT: PARTIAL (local). Locator backend + map integration to follow in REQ-004 slices.

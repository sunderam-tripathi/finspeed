# Proof — WEB-013 (Dealer locator analytics enrichment)

Implementation:
- GA dispatcher now accepts `dealer_map_pin_select` events plus latitude/longitude metadata (`apps/web/src/lib/analytics.ts`).
- Map component emits events with geoJSON coordinates (`apps/web/src/components/dealer-map.tsx`), and `/dealers` propagates them to analytics and cards (`apps/web/src/app/dealers/page.tsx`).
- Playwright test `apps/web/tests/dealer-locator.spec.ts` validates map pin interactions emit payloads with coordinates.

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local).

# Proof — WEB-006 (Dealer locator map)

Scope:
- Added `DealerMap` component rendering pin-based map placeholder with radius visualization and card ↔ pin sync.
- `/dealers` now highlights active dealer, scrolls into view on pin click, and hides the map during outage simulation.

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log` (SCN-004 suite checks map/outage behaviours)
- Manual: run `npm run dev -w web` and inspect `/dealers` map interactions (documented in plan).

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local). Map ready for future Leaflet integration.

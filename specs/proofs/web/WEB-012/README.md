# Proof — WEB-012 (Dealer locator live map)

Implementation:
- GeoJSON data sourced from SCN-004 encoded in `apps/web/src/data/dealer-geojson.ts`.
- `DealerMap` now reads geoJSON features, projects coordinates, and highlights active pins + radius (`apps/web/src/components/dealer-map.tsx`).
- `/dealers` loads these pins, syncing card selection and map focus (`apps/web/src/app/dealers/page.tsx`).

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local). Map ready for future Leaflet/real-data integration.

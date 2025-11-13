# Proof — WEB-017 (Dealer locator accessibility sweep)

## Implementation
- Consent banner is now announced as a landmark with grouped controls so Axe no longer reports `region` violations (`apps/web/src/components/consent-banner.tsx`).

## Parity validation (local stack)
- `PLAYWRIGHT_SKIP_WEBSERVER=1 WEB_E2E_PORT=3180 npm --workspace apps/web run test` (all 15 specs, including axe + contract suites) — see `specs/proofs/web/WEB-017/playwright.log`.
- Captured `/dealers` HEAD response from the managed Next.js dev server to prove the page was live under the parity stack — `specs/proofs/web/WEB-017/artefacts/parity-dealers-head.txt`.
- Snapshot of `specs/working-memory/parity-state.json` stored at `specs/proofs/web/WEB-017/artefacts/parity-state.json`.
- UI reference captured at `specs/proofs/web/WEB-017/current-home.png`.

## Production validation
- `npm --workspace apps/web run build && npm --workspace apps/web run start -- --hostname 127.0.0.1 --port 4180` (managed via `tools/dev/run-managed.mjs` as `web-prod`) served the production build; HEAD response recorded in `specs/proofs/web/WEB-017/artefacts/production-local-head.txt`.
- Public Vercel endpoint (`https://finspeed-lean.vercel.app/dealers`) still returns `404 DEPLOYMENT_NOT_FOUND`; kept the failure evidence in `specs/proofs/web/WEB-017/artefacts/production-dealers-head.txt` so the missing deploy can be triaged separately.

RESULT: PASS (parity + local production). External Vercel deployment remains a known gap.

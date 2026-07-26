# WEB-039 Proof - Distributor pricing behind a server boundary

## The honest limit, stated first

The distributor sign-in remains an unverified preview (declared in the portal
UI), so a session token is minted for any caller and **this slice is a data
boundary and an auth-ready seam, not access control**. What changed is real
nonetheless: dealer prices, margins, and portal records no longer exist in any
served client chunk; the only path to them is an observable, no-store API
behind a token; and `POST /api/distributor/session` is now the single place
where genuine credential verification attaches once dealer accounts exist.

## The boundary

- `apps/web/src/server/distributor-portal-data.js` - the 2024/25 Consolidated
  Pricing Matrix dataset, server-only.
- `apps/web/src/server/distributor-session.js` - HMAC-SHA256 session tokens,
  per-boot secret, 4-hour expiry, timing-safe verification. Per-boot is by
  design: client sessions are in-memory and drop on reload, and the client
  re-establishes a session transparently on 401.
- `POST /api/distributor/session` and `GET /api/distributor/portal` - both
  force-dynamic and `Cache-Control: no-store`; the portal route returns 401
  without a valid bearer token.
- `apps/web/src/design/data/distributor.js` - reduced to presentation helpers
  (image path, INR formatting, tracking stages); the seven portal screens now
  receive a fetched `portal` prop, alias-destructured so screen bodies are
  unchanged. Loading and failure render honest states with retry; sign-out
  clears the session; the apply form's GSTIN placeholder no longer echoes the
  sample account's GSTIN.

## Enforcement

- `apps/web/src/design/data/distributor-boundary.test.mjs` - fails the unit
  gate if the client module regains price fields, or if any built client chunk
  under `.next/static` contains a dataset sentinel (PAN, invoice number,
  ticket id, representative name, dealer-price pair). CI builds before unit
  tests, so the chunk scan always runs there. It caught a real finding during
  development: the apply form's placeholder GSTIN, now generalized.
- `apps/web/tests/distributor-access.spec.ts` (+3): unauthenticated and
  forged-token requests receive 401; a minted token unlocks the dataset with
  no-store semantics; and with the portal API blocked, the signed-in UI shows
  the honest failure state with no client-side pricing fallback, then recovers
  through Try again once the API returns.

## Parity evidence (recorded parity session, this workstation)

- ESLint: 0 errors (37 pre-existing warnings, unchanged).
- `tsc --noEmit`: clean.
- Production build: clean; boundary chunk scan runs against its output.
- Unit tests: **26/26** including both boundary contracts.
- Full Playwright suite: **76/76** (5 original access contracts unchanged,
  3 new boundary contracts).

## Production verification

Merging to protected `main` releases via Amplify. `production-check.mjs`
(committed here, re-runnable) verifies the deployed behaviour: 401 without a
session, token flow serving dealer rows, served-chunk sentinel scan, and the
signed-in price list rendering API-served pricing. Its results land in
`production-results.json` in the closing commit.

final result: pending release — all local gates passed

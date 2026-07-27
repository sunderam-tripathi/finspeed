# WEB-040 Proof - Invited-access verification for the distributor portal

## What this is, and is not

The WEB-039 session seam now verifies a steward-managed invitation passphrase:
wrong passphrases are genuinely rejected, server-side, with scrypt and
timing-safe comparison. It is **one shared invitation secret, not per-dealer
accounts** — dealer accounts still do not exist as a business fact, dealer IDs
remain unlinked, and the portal still shows sample data and says so. The
sign-in notice states the new truth, deliberately replacing the WEB-036
"credentials are not verified" statement that this slice makes false.

## The mechanism

- `DISTRIBUTOR_ACCESS_HASH` env var: `scrypt$N$r$p$salt$hash` (base64url).
  Missing or malformed configuration **fails closed**: the session endpoint
  answers 503 with an honest not-configured error — never silently open.
- `POST /api/distributor/session` verifies the JSON-body passphrase: 401 with
  a 300ms delay on mismatch (per-instance guessing blunt — an accepted
  limitation recorded in the plan), token on success, no-store throughout.
- The client carries the passphrase from the sign-in form (controlled field,
  pending state, inline `role=alert` rejection) and keeps it in memory only,
  for transparent re-session on token expiry; sign-out and reload drop it.
- `scripts/set-distributor-access.mjs` (steward-run): hidden input, 12-char
  floor, fresh 16-byte salt, plaintext never printed or transmitted;
  `--apply` **fetches and merges** the Amplify app's existing environment
  variables (keys logged, values never) because `update-app` replaces the map
  and the app already carries sensitive variables (WEB-022).
- Dev/CI use the deliberately public passphrase `preview` whose hash is
  committed in `playwright.config.ts`; it gates nothing outside local and CI
  web servers.

## Parity evidence (recorded parity session, this workstation)

- ESLint: 0 errors. `tsc --noEmit`: clean. Production build: clean.
- Unit: **30/30**, including four new verifier contracts (fail-closed on
  missing and malformed config — which caught a real off-by-one in the hash
  parser during development — correct/wrong verification, and the dev-hash
  binding to exactly `preview`).
- Full Playwright: recorded in the close-out commit — includes the updated
  invited-access notice contract, the passphrase-carrying sign-in helper, a
  new wrong-passphrase rejection contract (API 401 for wrong and bodiless
  requests; UI inline alert, signed out, no pricing), and the unchanged
  WEB-039 boundary contracts.

## Production verification (two states, drivers committed)

- `production-check.mjs --state unconfigured` — after the merge deploys and
  before the steward sets the secret: session 503 with the honest error,
  portal 401 without a token, invited-access notice live.
- `production-check.mjs --state configured` — after the steward runs
  `scripts/set-distributor-access.mjs --apply` (authenticated via `aws login`)
  and redeploys: wrong and bodiless requests 401, UI inline rejection, portal
  401 without a token. The positive case — the real passphrase entering — is
  confirmed by the steward in a browser and recorded here; automation never
  holds the passphrase.

final result: pending release — all local gates passed

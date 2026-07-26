# WEB-038 Proof — Per-route server titles, honest 404s, locator discoverability

## What WEB-037 recorded, and what was actually wrong

WEB-037 triaged two delivery findings: ISS-1 (P1 — `/dealers` serves the
editorial Visit page, locator unreachable) and ISS-2 (P2 — one generic title
and the same ~175-visible-char client shell on every route), with a suspected
WEB-022-era Amplify SPA-fallback rewrite as the root cause. This slice began by
testing that hypothesis against production and the code:

- **Per-path routing reaches Next in production.** `artefacts/before/` holds
  the raw production HTML captured 2026-07-26 before this fix: the `/dealers`
  document carries the `dealers` route segment in its RSC payload,
  `unknown.html` (`/definitely-not-a-route`) uniquely carries the
  `designPath` catch-all marker, and byte sizes differ per route. A CDN
  rewrite serving one shell for all paths would produce identical documents
  and could not mark only the unknown route with `designPath`. **The Amplify
  SPA-rewrite hypothesis is refuted at the origin.**
- **The locator was already live at `/dealers`.** Verified in a real browser
  against production before any change: search field ("Location, area or PIN
  code"), Sales/Service/Test-rides filters, "02 locations", the map with two
  pins, and both location cards (Sarin Farm, Krystal Height). WEB-037's
  scripted check failed because it required the literal word "dealer" in the
  page text — the redesigned locator copy legitimately says "locations" and
  "stops" — and the screenshot adjudication misread the locator's
  "Visit Finspeed / Meet the bikes in Greater Noida." hero as the `Stores`
  page (whose hero is "Meet the bikes in person."). **ISS-1 is re-adjudicated
  as a driver artefact plus a real discoverability gap:** nothing in the
  storefront linked to `/dealers` (header "Visit Finspeed" and footer
  "Find a store" both target `/stores`).
- **ISS-2 is real but lives in the app.** Every route page mounted the
  client-only `DesignApp` (`ssr: false`) and only the root layout exported
  metadata, so every route legitimately served the same near-empty shell with
  one title, and unknown paths returned 200 through the catch-all.

## The fix

- `apps/web/src/design/route-metadata.js` — single source of truth for route
  paths, title labels, descriptions, `routeName()` and product lookup, shared
  by the design client and the server so the layers cannot drift.
- `StorefrontApp` now derives `document.title` from that module (including
  real product names, previously "Finspeed — Product") and the home label was
  aligned to the indexed brand title "Finspeed — Ride Beyond Boundaries",
  removing the post-hydration flip to "Performance bicycles".
- Every static route page (`/`, `/blog`, `/brand-story`, `/catalog`,
  `/models`, `/support`, `/testimonials`, `/dealers`) exports per-route
  `metadata`; `/catalog` and `/models` declare `canonical: /shop`; the layout
  gained `metadataBase`.
- `[...designPath]/page.tsx` gained `generateMetadata` (known design routes,
  product names from the catalog data, distributor portal with `noindex`) and
  returns `notFound()` for unknown paths; a root `not-found.tsx` serves a
  branded 404 whose title matches the client router's not-found view.
- Locator entry points: footer "Visit & Support" gained "Dealer locator" →
  `/dealers`; the Stores page gained a "Open the dealer locator" CTA.
  **Decision:** the header "Visit Finspeed" journey keeps the editorial
  `/stores` narrative; the locator is one click away from every page (footer)
  and from the visit narrative (CTA), so the tested tool is discoverable
  without demoting the redesign's information architecture.

## Parity evidence (this workstation, recorded parity session)

- `artefacts/logs/web-lint.txt` — ESLint 0 errors (38 warnings, all
  pre-existing `<img>`/idiom notices; counts verified unchanged at HEAD for
  every touched file).
- `artefacts/logs/web-typecheck.txt` — `tsc --noEmit` clean.
- `artefacts/logs/web-unit.txt` — design data unit tests pass.
- `artefacts/logs/web-build.txt` — production build green; route manifest
  shows all static routes prerendered, the catch-all dynamic, and
  `/_not-found`.
- `artefacts/logs/web-e2e.txt` — full Playwright suite (73 tests including the
  new `tests/route-metadata.spec.ts`: server titles without JavaScript,
  product titles, 404 semantics, distributor noindex, client/server title
  alignment; and the extended footer contract).
- `specs/working-memory/parity-state.json` — parity session ensured for this
  run.

## Production evidence (release merged 2026-07-26, PR #9, main `511b04e`)

- `production-check.mjs` — committed re-runnable driver: per-route titles in
  raw production HTML, 404 for unknown paths, and the corrected locator check
  (form, filters, cards, map pins) with screenshot.
- `production-results.json` — **11/11 pass** against
  `https://www.finspeed.online` after the Amplify `main` build of PR #9:
  distinct titles for `/`, `/dealers`, `/blog`, `/shop`, `/stores`, and
  `/products/bull-shark` (real product name); `/definitely-not-a-route`
  returns HTTP 404 with the not-found title; the locator serves its search
  form, service filters, two location cards, and two map pins.
- `screenshots/dealers-locator-production.png` — visually inspected (opened
  and zoomed): search section ("Choose the right stop."), input with PIN
  placeholder, Search locations CTA, Sales/Service/Test-rides chips,
  "02 locations / Greater Noida", map with the Krystal Height pin, and the
  Sarin Farm card with address, service tags, WhatsApp and Directions —
  the locator running in production, fresh context with the consent banner
  undecided (fail-closed contract untouched).
- Home title fingerprint unchanged before/after release
  (`Finspeed — Ride Beyond Boundaries`), per the recorded home-title
  decision.

## Amplify delivery audit (run 2026-07-26 under refreshed credentials)

- Credential note: this workstation authenticates with the AWS CLI v2
  browser flow `aws login` (config `login_session`, account root), not
  `aws sso login` as the release runbook stated.
- `amplify-audit.mjs` — captures `get-app`/`get-branch` delivery configuration
  with environment variables deliberately stripped.
- `amplify-rules-before.json` — the audit DID find the WEB-022-era rule:
  `/<*> → /index.html (404-200)` — the **conditional** fallback variant, not
  the rewrite-everything `200` rule. Consistent with the origin evidence, it
  was dormant: it never fired for known routes, could not fire pre-WEB-038
  (the catch-all answered every path 200), and measurably did not fire
  post-WEB-038 either (unknown page paths and `/_next/static/nope.js` both
  returned real 404s with the rule still present). It therefore caused
  neither ISS-1 nor ISS-2.
- Steward decision: **remove** (approved interactively 2026-07-26) — as a
  legacy remnant it could only ever mask hard static-layer misses as
  `200 /index.html`. Applied via
  `aws amplify update-app --custom-rules '[]'` (delivery config only, no
  rebuild).
- `amplify-rules.json` — post-change capture: `customRules: []`, platform
  `WEB_COMPUTE`, framework "Next.js - SSR", branch auto-build on.
- Post-change verification: `production-check.mjs` re-run **11/11 pass**;
  missing-asset probe still 404. No behavior change, config now honest.

RESULT: PASS — parity gates green (73/73); production verification green
(11/11 before and after the rule removal, screenshot inspected); Amplify
delivery audit captured with the dormant WEB-022-era rule removed under
explicit steward approval

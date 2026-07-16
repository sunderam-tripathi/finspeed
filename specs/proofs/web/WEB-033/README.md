# WEB-033 Proof - Branded browser favicon

## Outcome

The default framework triangle is replaced by a browser icon derived from the official Finspeed cyan-and-white mark. The emblem sits on a stable dark field so it remains legible in light and dark browser chrome, while the full wordmark is intentionally omitted because it is unreadable at favicon scale.

RESULT (local): PASS
RESULT (production): PASS

## Source and outputs

- Official source: `apps/web/public/assets/logos/finspeed-mark-light.png`
- Source SHA-256: `F79C256161F45BD364E9FB330F3D65294DA6224DE328C1AA375EE1E53545A9D1`
- Replaced default favicon SHA-256: `2B8AD2D33455A8F736FC3A8EBF8F0BDEA8848AD4C0DB48A2833BD0F9CD775932`
- Multi-frame ICO: `apps/web/src/app/favicon.ico` - 16, 32, 48, and 64 px; SHA-256 `411B18567C46BD62CBE3718ADFA5E2F4857AE38B2332C69D57D984AC2B703695`
- Application icon: `apps/web/src/app/icon.png` - 512 x 512; SHA-256 `B1E39D5FE223F8EED214D6513A45AB340D086364742244D91CBA034342776B48`
- Apple icon: `apps/web/src/app/apple-icon.png` - 180 x 180; SHA-256 `50CD71AA725C040BC71A9208E91B2D303B3963517C30F4D3244253D10C2AD0E4`

## Visual evidence

- `artefacts/favicon-scale-preview.png` shows the final asset at 512, 64, 48, 32, and 16 px.
- The preview was opened at original resolution and visually inspected. The cyan arch, white outer stroke, and sail remain identifiable at 16 px; no wordmark detail is forced into the favicon.

## Verification

- Local metadata and HTTP verification: `logs/local-verification.md` - PASS.
- Focused Playwright favicon test: `logs/test-sweep.md` - 1 passed.
- ESLint: exit 0 with 42 existing warnings and no errors.
- Next production build: exit 0; `/icon.png` and `/apple-icon.png` are emitted static metadata routes.
- Full Playwright sweep: 25 passed, 1 unrelated responsive-image intrinsic-width assertion failed; favicon test and all other scenarios passed.
- Parity stack: `node tools/dev/parity-stack.mjs ensure` passed; snapshot archived at `logs/parity-state.json`.
- Amplify release: `logs/amplify-job-404.json` - job 404, BUILD/DEPLOY/VERIFY all `SUCCEED`.
- Production verification: `logs/production-verification.md` - public icon bytes, HTML metadata, browser metadata, and console diagnostics pass.

## Acceptance review

- [x] Default framework triangle removed
- [x] Official Finspeed mark used as the source
- [x] Dark field provides light/dark browser-chrome contrast
- [x] 16/32/48/64 px ICO frames verified
- [x] 512 px application and 180 px Apple icons generated
- [x] Next metadata advertises all three icon resources
- [x] Local responses match the exact source-tree hashes
- [x] Focused browser test, lint, and production build pass
- [x] Amplify production release succeeds
- [x] Public favicon responses and metadata match the released hashes

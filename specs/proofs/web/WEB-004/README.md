# Proof — WEB-004 (Dealer locator contract tests)

Scope:
- Schema validation for dealer data (`apps/web/tests/dealer-data.spec.ts`) ensures SCN-004 dataset matches required fields/postal patterns.
- Playwright suite (`apps/web/tests/dealer-locator.spec.ts`) asserts postal validation, filter chips, outage banner, support fallback, and analytics stubs on the `/dealers` route.
- Existing SCN-001 tests continue to run, providing regression coverage for the site shell.

Verification steps:
- `npm run lint -w web` → `artefacts/lint.log`
- `npm run test -w web` → `artefacts/playwright.log`

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local). CI Guard workflow already installs browsers and executes Playwright.

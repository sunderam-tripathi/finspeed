# Proof — WEB-002 (Contract tests)

Guard additions:
- Playwright config (`apps/web/playwright.config.ts`) launches the web shell and codifies SCN-001 scenarios.
- Tests live in `apps/web/tests/contract.spec.ts` covering hero copy, language toggle, dealer CTA, and support footer per IC-6/IC-8.
- CI workflow now installs Playwright browsers and runs `npm run test -w web`.

Verification steps:
- `npm run test -w web` (chromium) → `artefacts/playwright.log`.

Telemetry:
- `artefacts/slice-index.log`, `artefacts/progress.log`.

RESULT: PASS (local). CI enforces via Guard & CI workflow.

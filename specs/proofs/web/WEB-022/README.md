# Proof — WEB-022

This proof bundle records the redesign integration, local parity checks, Amplify release, public-domain verification, and duplicate-stack cleanup.

## Release target

- AWS account: `660883642048`
- Amplify region: `ap-south-1`
- Amplify app: `finspeed` (`d2h8tz7elv2xy8`)
- Production branch: `main`
- Public domain: `https://finspeed.online`

## Implementation evidence

- The approved React storefront and distributor design modules are mounted within the existing Next.js application under `apps/web/src/design`.
- Next.js remains the hosting boundary; the redesign is client-loaded through `DesignApp` and the dynamic catch-all route.
- Existing `/catalog`, `/dealers`, `/support`, `/brand-story`, `/blog`, and `/testimonials` routes remain distinct Next routes.
- Storefront product assets are served from `apps/web/public/assets`.
- The previous static-export setting was removed so the catch-all design routes can run on the existing Amplify `WEB_COMPUTE` platform.

## Validation evidence

- `artefacts/logs/web-lint.log` — ESLint completed with zero errors. Imported SPA modules retain non-blocking optimization warnings for standard `<img>` usage and JavaScript callback idioms.
- `artefacts/logs/web-build.log` — Next.js `16.2.10` production build passed; the route manifest includes the root redesign, dynamic design routes, retained content routes, and dealer API.
- `artefacts/logs/web-e2e.log` — Playwright passed all 15 tests with two workers, including the dealer locator contract and axe accessibility audit.
- `artefacts/logs/managed-runner-windows-smoke.log` — repaired managed-process runner executes Windows command shims without the previous `spawn EINVAL` failure or shell-injection warning.
- `artefacts/logs/spec-slice-index.log` and `artefacts/logs/spec-progress.log` — repository slice index and progress telemetry refreshed successfully.
- `artefacts/amplify-main-buildspec.yml` — branch-specific Amplify build contract for the current `apps/web` workspace; the admin branch retains its existing configuration.
- `artefacts/amplify-ssr-trust-policy.json` and `artefacts/amplify-ssr-logs-policy.json` — restored the deleted SSR logging role with account-scoped Amplify trust and only the CloudWatch Logs permissions required by AWS.
- `artefacts/production-release.md` — immutable release identifiers, failed-attempt diagnosis, successful Amplify job, public-domain smoke results, and duplicate-stack cleanup state.
- `specs/working-memory/parity-state.json` — parity session recorded by the repository guard.

## Security review

- Next.js upgraded from `16.0.2` to patched stable `16.2.10`, clearing the critical framework advisory.
- Root `minimatch` and safe transitive updates were applied.
- `npm audit` now reports two moderate PostCSS advisories nested under the latest stable Next.js. npm's proposed forced remediation would downgrade Next to `9.3.3`; that unsafe downgrade was rejected and the residual findings are accepted for this release pending an upstream stable patch.
- No production secrets were copied into source or proof artefacts.

## Production evidence

- Guarded implementation commit `5c305831a1c6187f4559399d8d4c825e83d09d18` is pushed to `origin/main`.
- Amplify job `395` completed with `BUILD`, `DEPLOY`, and `VERIFY` all `SUCCEED`.
- The Amplify branch URL and the public `https://www.finspeed.online` domain render the redesign.
- Browser smoke passed for `/`, `/shop`, `/products/mako-shark`, `/dealers`, and `/distributor`; all checked pages had zero broken images and the browser console had zero warnings or errors.
- Public deep-link smoke passed at `https://www.finspeed.online/products/mako-shark`.

- The duplicate `finspeed-web-app` CloudFormation stack and its S3/CloudFront resources were deleted after production verification.

RESULT: PASS — PRODUCTION VERIFIED AND DUPLICATE STACK REMOVED

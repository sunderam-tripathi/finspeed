# Release Runbook — finspeed.online

## Production identity

- Host: AWS Amplify, app `finspeed` (`d2h8tz7elv2xy8`), region `ap-south-1`,
  account `660883642048`, platform `WEB_COMPUTE` (Next.js SSR).
- Public domain: `https://finspeed.online` (redirects to `https://www.finspeed.online`).
- Production branch: `main`, auto-build ON — established by WEB-022, which also
  removed the legacy CloudFront/S3 stack.

## Release path: merging to main IS the deploy

Adopted as deliberate policy on 2026-07-26 (after the WEB-035/036 merges were
observed live through this path while the disarmed CI deploy job pointed at the
wrong host).

1. All work lands via pull request. Branch protection on `main` requires a green
   `guard` check (lint, production build, typecheck, unit tests, full Playwright
   regression, reference validation) and applies to admins.
2. On merge, Amplify auto-builds `main` and releases to production. There is no
   separate deploy command, and deliberately no deploy job in CI.
3. Treat every merge to `main` as a production release when proposing or
   approving it.

## Post-release verification

- `https://www.finspeed.online/` returns 200.
- Spot-check a content fingerprint of the release (e.g. an asset path introduced
  by the merged change) rather than trusting the homepage alone; the WEB-035
  release was confirmed via
  `/assets/configurator/v1/bull-shark/side-r/light/poster/bull-shark-29-r01-w480.webp`.
- The fuller smoke set from the original release is recorded in
  `specs/proofs/web/WEB-022/artefacts/production-release.md`.

## Rollback

Requires AWS credentials (`aws sso login`; local sessions expire).

```powershell
aws amplify list-jobs --app-id d2h8tz7elv2xy8 --branch-name main --region ap-south-1 --max-items 10
```

Identify the last good job, then redeploy it from the Amplify console ("Redeploy
this version") or via `aws amplify start-job --job-type RETRY --job-id <id>` with
the same app/branch/region. Rolling back the deployment does not revert `main`;
follow up with a revert PR so the branch and production reconverge.

## Previews and non-production surfaces

- The Vercel GitHub integration builds preview deployments for pull requests.
  It is not the production path and deploys nothing to `finspeed.online`; it can
  be uninstalled from the GitHub repository settings if unwanted.
- The GitHub `Production` environment previously referenced by the deleted CI
  deploy job is unused and may be removed in repository settings (owner action).

## History

- Legacy static SPA on CloudFront/S3 — replaced and removed by WEB-022.
- Amplify `main` release established by WEB-022 (2026-07).
- Disarmed Vercel `deploy-web` CI job added during the guard-restoration work and
  removed by REPO-004 (2026-07-26) after the host contradiction surfaced.
- Branch protection (PR + `guard` + admins) added 2026-07-26.

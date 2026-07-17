# WEB-034 production release

Verified on 2026-07-18 (Asia/Calcutta).

## Release identity

- Git release SHA: `84f83455737086a66826a419c38da67822b34171`
- Branch: `main`
- Commit: `WEB-034 implement premium editorial storefront`
- GitHub push: completed successfully

## Vercel public deployment

- Surface: `https://www.finspeed.online/`
- Commit status context: `Vercel`
- Commit status: `success`
- Status description: `Deployment has completed`
- Deployment target: `https://vercel.com/sunderam-tripathis-projects/finspeed-web/5aC6476dpCv8K9pVWHrmsvuqEAwS`

The repository's GitHub Actions `guard` job failed before `deploy-web` because the clean CI checkout does not contain the ignored `specs/working-memory/active-slice.json` file. The failure was `Guard: missing active-slice.json`; `deploy-web` was skipped. This is an existing CI guard-bootstrap issue, not an application build failure. The independent Vercel Git integration deployed the exact release SHA successfully.

## AWS Amplify deployment

- Account: `660883642048`
- Region: `ap-south-1`
- App: `finspeed` (`d2h8tz7elv2xy8`)
- Branch: `main` (PRODUCTION)
- Origin: `https://main.d2h8tz7elv2xy8.amplifyapp.com/`
- Job: `405`
- Commit ID: `84f83455737086a66826a419c38da67822b34171`
- Overall status: `SUCCEED`
- BUILD: `SUCCEED`
- DEPLOY: `SUCCEED`
- VERIFY: `SUCCEED`

## Runtime UAT

After allowing client hydration to settle, the expected page identity was verified on both production surfaces:

| Surface | Route | Expected identity | Result |
| --- | --- | --- | --- |
| Public | `/` | Ride Beyond Boundaries | PASS |
| Public | `/build` | Build Your Ride | PASS |
| Public | `/products/mako-shark` | Mako Shark | PASS |
| Public | `/stores` | Visit Finspeed | PASS |
| Public | `/support` | Support Hub | PASS |
| Amplify | `/` | Ride Beyond Boundaries | PASS |
| Amplify | `/build` | Build Your Ride | PASS |
| Amplify | `/products/mako-shark` | Mako Shark | PASS |
| Amplify | `/stores` | Visit Finspeed | PASS |
| Amplify | `/support` | Support Hub | PASS |

Browser console warnings/errors after the settled route sweep: none.

## Visual acceptance

- `../artefacts/screenshots/production/public-home-desktop-1280x720.png`
- `../artefacts/screenshots/production/public-build-mobile-390x844.png`
- `../artefacts/screenshots/production/amplify-home-desktop-1280x720.png`

All three captures were opened and inspected. The two desktop production surfaces are visually equivalent; the hero image is seamless; the official mark and wordmark are optically aligned; and the mobile five-step build rail fits without horizontal overflow.

final result: passed

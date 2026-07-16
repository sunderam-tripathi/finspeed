# Production status

Result: PASS

## Immutable target

- AWS account: `660883642048`
- Amplify app: `finspeed` (`d2h8tz7elv2xy8`)
- Region: `ap-south-1`
- Branch: `main` (`PRODUCTION`)
- Source implementation commit: `886110c` (`WEB-032: use updated Red Snapper product master`)
- Public URL: `https://www.finspeed.online/`

## Release execution

- Pushed the five validated WEB-030 through WEB-032 commits from local `main` to `origin/main`.
- Amplify release job: `403`
- Job window: `2026-07-16T18:25:11.671+05:30` to `2026-07-16T18:28:23.517+05:30`
- Step result: `BUILD=SUCCEED`, `DEPLOY=SUCCEED`, `VERIFY=SUCCEED`
- Concise AWS job record: `amplify-job-403.json`

## Public HTTP and asset verification

- `https://www.finspeed.online/`: HTTP 200 and Home marker present.
- `https://www.finspeed.online/shop?category=hybrid`: HTTP 200.
- `https://www.finspeed.online/products/red-snapper`: HTTP 200.
- `https://www.finspeed.online/assets/products/upscaled/red-snapper-1600.webp`: 121,022 bytes.
- Live asset SHA-256: `B3A2A0FE498C88B1BFF75A205F6C7271B1E44E9BF85A97AD7A4AD0852696B0BE`.
- Expected WEB-032 asset SHA-256: `B3A2A0FE498C88B1BFF75A205F6C7271B1E44E9BF85A97AD7A4AD0852696B0BE`.
- Hash comparison: exact match.

## Public browser verification

Verified in the Codex in-app Browser at a 1280 x 720 viewport after job 403 completed:

- Route: `https://www.finspeed.online/products/red-snapper`.
- H1: `Red Snapper`.
- The responsive image selected `red-snapper-960.webp`.
- Selected image natural size: 614 x 412; rendered size: 468 x 314.
- Complete bicycle, wheels, handlebar, fenders, and kickstand remain visible without clipping.
- Broken images: 0.
- Horizontal overflow: 0 (`scrollWidth=clientWidth=1265`).
- Browser console entries: 0.

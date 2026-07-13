# WEB-022 production release evidence

## Immutable target

- AWS account: `660883642048`
- Amplify app: `finspeed` (`d2h8tz7elv2xy8`)
- Region: `ap-south-1`
- Branch: `main`
- Source commit: `5c305831a1c6187f4559399d8d4c825e83d09d18`
- Amplify branch URL: `https://main.d2h8tz7elv2xy8.amplifyapp.com`
- Public URL: `https://www.finspeed.online`

## Release execution

- Job `392`: failed before checkout because the configured SSR logging role had been deleted.
- Job `393`: failed during initial IAM propagation.
- Job `394`: passed IAM and checkout, then exposed the stale app-level monorepo root (`frontend`).
- Job `395`: succeeded after restoring the least-privilege logging role and aligning the app-level root to `apps/web`.
- Job `395` step result: `BUILD=SUCCEED`, `DEPLOY=SUCCEED`, `VERIFY=SUCCEED`.
- Job `395` completion time: `2026-07-13T14:52:14.389+05:30`.

## Live browser verification

Verified with a real browser after job `395` completed:

| URL/path | Expected evidence | Result |
| --- | --- | --- |
| Amplify `/` | `Ride Beyond Boundaries` | PASS |
| Amplify `/shop` | `Shop all cycles` | PASS |
| Amplify `/products/mako-shark` | `Mako Shark` | PASS |
| Amplify `/dealers` | `Find a Finspeed dealer` | PASS |
| Amplify `/distributor` | `Dashboard` | PASS |
| Public `/` | `Ride Beyond Boundaries` | PASS |
| Public `/products/mako-shark` | `Mako Shark` | PASS |

- Broken images across checked routes: `0`.
- Browser console warnings/errors across checked routes: `0`.
- The apex domain redirected to `https://www.finspeed.online/` as expected.

## Corrective AWS cleanup

- Duplicate CloudFormation stack: `finspeed-web-app` (`us-east-1`).
- Duplicate resources were limited to S3 bucket `finspeed-web-app-660883642048-us-east-1`, CloudFront distribution `E399AV8MF28X2Y`, its origin access control, and the bucket policy.
- Deletion was initiated only after the existing Amplify app and public domain passed browser verification.
- Initial deletion attempt correctly retained the non-empty S3 bucket and ended `DELETE_FAILED`; stack events identified that single blocker.
- The bucket contained only the temporary static build (3.75 MB) and had no versioning enabled. Those objects were removed from the explicitly named duplicate bucket.
- Final stack deletion status: `DELETE_COMPLETE`.

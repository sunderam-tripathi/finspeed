# Production verification

Result: PASS

## Immutable target

- AWS account: `660883642048`
- Amplify app: `finspeed` (`d2h8tz7elv2xy8`)
- Region: `ap-south-1`
- Branch: `main` (`PRODUCTION`)
- Source commit: `937fe71` (`WEB-033: add branded browser favicon`)
- Public URL: `https://www.finspeed.online/`

## Release

- Amplify job: `404`
- Job window: `2026-07-16T19:11:22.359+05:30` to `2026-07-16T19:14:41.621+05:30`
- Step result: `BUILD=SUCCEED`, `DEPLOY=SUCCEED`, `VERIFY=SUCCEED`
- Concise AWS job record: `amplify-job-404.json`

## Public icon responses

| Resource | Status | Content type | Bytes | SHA-256 | Match |
| --- | ---: | --- | ---: | --- | --- |
| `/favicon.ico` | 200 | `image/vnd.microsoft.icon` | 11,373 | `411B18567C46BD62CBE3718ADFA5E2F4857AE38B2332C69D57D984AC2B703695` | PASS |
| `/icon.png` | 200 | `image/png` | 42,307 | `B1E39D5FE223F8EED214D6513A45AB340D086364742244D91CBA034342776B48` | PASS |
| `/apple-icon.png` | 200 | `image/png` | 17,219 | `50CD71AA725C040BC71A9208E91B2D303B3963517C30F4D3244253D10C2AD0E4` | PASS |

Cache-busting query parameters were used for all three checks. Each public response exactly matched the committed source-tree file.

## Public HTML and browser metadata

- Public Home returned HTTP 200.
- Server-rendered HTML includes `favicon.ico`, `icon.png`, and `apple-icon.png` metadata.
- The Codex in-app Browser resolved:
  - `rel=icon`, `type=image/x-icon`, path `/favicon.ico`
  - `rel=icon`, `type=image/png`, path `/icon.png`
  - `rel=apple-touch-icon`, `type=image/png`, path `/apple-icon.png`
- Production browser warning/error entries: 0.


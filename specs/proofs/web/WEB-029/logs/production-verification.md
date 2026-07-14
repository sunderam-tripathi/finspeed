# WEB-029 Production verification

RESULT: PASS

## Release

- Amplify app: `d2h8tz7elv2xy8`
- Branch: `main` (`PRODUCTION`)
- Job: `402`
- Release reason: `WEB-029 optical alignment f9fcedd proof 6547025`
- BUILD: `SUCCEED`
- DEPLOY: `SUCCEED`
- VERIFY: `SUCCEED`
- Completed: `2026-07-14T11:42:07.847+05:30`

## Public-domain inspection

The deployed Home and Shop routes were inspected in the in-app browser after job 402 completed.

| Signal | Home | Shop |
| --- | --- | --- |
| URL | `https://www.finspeed.online/` | `https://www.finspeed.online/shop` |
| Header height | 80 px | 80 px |
| Header surface | dark shared treatment | `rgba(2, 5, 8, 0.96)` |
| Logo asset | official light mark | `/assets/logos/finspeed-mark-light.png` |
| Logo transform | `translateY(-2px)` | `translateY(-2px)` |
| Wordmark transform | `translateY(2px)` | `translateY(2px)` |
| Box-center delta | -4 px | -4 px |
| Console errors | none | none |

The production values match the tested desktop optical-correction contract. Home and Shop both rendered their expected main content after hydration.

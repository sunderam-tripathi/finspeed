# Finspeed production verification - 2026-07-21

## Release identity

- Production: https://www.finspeed.online/
- AWS Amplify app: `d2h8tz7elv2xy8`
- Branch: `main`
- Amplify job: `408`
- Result: `SUCCEED`
- Commit: `590d9e821976beabd99fd9b29006f07dbd9a092a`
- Commit message: `WEB-035 complete storefront visual audit`
- Completed: `2026-07-21T03:50:28.280000+05:30`
- Local `HEAD`, `origin/main`, and the deployed Amplify commit matched exactly at verification time.

## Production checks

- Rechecked home, menu, shop, Red Snapper, and Build Your Ride in both light and dark themes on desktop.
- Rechecked home, menu, shop, Red Snapper, and Build Your Ride at a 390 x 844 mobile viewport.
- Confirmed that the menu opens at the top of its mobile viewport, remains usable, and does not overflow horizontally.
- Confirmed that Red Snapper uses the corrected light product image and the v4 dark studio image with contained, coherent scaling.
- Confirmed that the build preview uses the current configurator asset and stacks without horizontal clipping on mobile.
- Confirmed no horizontal document overflow on the inspected desktop or mobile states.
- Confirmed no visible broken images on the inspected production states.
- Confirmed zero production browser console errors during the final pass.
- Confirmed HTTP 200 `image/webp` delivery for the approved Red Snapper editorial pair, corrected light product image, v4 dark product image, and configurator poster.

## Production screenshots

- `production-home-light-viewport.png`
- `production-home-dark-viewport.png`
- `production-menu-light.png`
- `production-menu-dark.png`
- `production-shop-light.png`
- `production-shop-dark.png`
- `production-red-snapper-light.png`
- `production-red-snapper-dark.png`
- `production-build-light.png`
- `production-build-dark.png`
- `production-mobile-home-dark.png`
- `production-mobile-menu-light-fresh.png`
- `production-mobile-menu-dark.png`
- `production-mobile-shop-light.png`
- `production-mobile-red-snapper-light.png`
- `production-mobile-build-light.png`
- `production-deliverable-home.png`

## Release decision

**Accepted.** The deployed storefront matches the audited release candidate on the primary journeys and is suitable to remain live.

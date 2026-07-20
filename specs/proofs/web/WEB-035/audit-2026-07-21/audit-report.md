# Finspeed release audit — 2026-07-21

## Health

**Release candidate: healthy.** The local parity build is visually coherent in light and dark themes, canonical product photography remains readable and contained, the menu and configurator behave across the reviewed viewports, and the production build completes successfully.

## Audit procedure

1. Grounded the review in the current WEB-035 slice, product registry, theme tokens, image manifest, and the running parity build.
2. Reviewed 32 route and state entries across light and dark themes, including home, all shop collections, eleven product routes, build, engineering, stores, account, checkout, support, policy, and editorial pages.
3. Rechecked the primary journeys at desktop, tablet, and mobile widths: home, menu, shop, Mako Shark, Red Snapper, build, engineering, and stores.
4. Tested the menu hover corridor, Escape close, keyboard focus, category navigation, theme switching, product routing, cart actions, checkout preview, configurator persistence, and consent persistence.
5. Verified that each reviewed product image decoded, remained inside its intended stage, and used the registered light or dark asset family without theme inversion.
6. Repaired cached configurator-image loading, stacked build-stage containment, mobile collection-filter overflow, light-theme primary-button contrast, and stale automated contracts.
7. Ran the complete automated release gate:
   - 62/62 Playwright browser tests passed.
   - 25/25 storefront shell contract tests passed.
   - 19/19 domain-model tests passed.
   - 3/3 Axe accessibility audits passed.
   - ESLint completed with 0 errors and 37 pre-existing warnings.
   - WEB-035 active-slice verification passed.
   - The optimized Next.js production build passed.

## Accepted visual evidence

- Desktop: `final-home-light.png`, `final-home-dark.png`, `final-shop-light.png`, `final-shop-dark.png`
- Product: `final-product-mako-light.png`, `final-product-mako-dark.png`, `final-product-red-snapper-light.png`, `final-product-red-snapper-dark.png`
- Build: `final-build-light.png`, `final-build-dark-fixed-r2.png`, `final-tablet-build-light-flow-fixed.png`, `final-tablet-build-dark-fixed.png`
- Mobile: `final-mobile-home-light.png`, `final-mobile-home-dark.png`, `final-mobile-menu-light.png`, `final-mobile-menu-dark.png`, `final-mobile-shop-light-fixed.png`, `final-mobile-shop-dark.png`, `final-mobile-build-light-fixed.png`, `final-mobile-build-dark.png`
- Supporting routes: `final-engineering-dark.png`, `final-stores-light.png`, `final-stores-dark.png`
- Measurements: `light-metrics.json`, `dark-metrics.json`, `mobile-light-metrics.json`, `mobile-dark-metrics.json`

## Evidence limits and release notes

- This report covers the local parity build. Production routing, asset delivery, theme persistence, and key screenshots must be rechecked after Amplify publishes the exact commit.
- No external WhatsApp, email, newsletter, payment, or order was submitted during the audit. The storefront intentionally presents honest email or preview fallbacks where a live backend is not configured.
- Bull Shark remains deliberately blocked from direct configured-cart purchase because its product-identity evidence still requires confirmation. The UI exposes that limitation instead of silently treating the photograph as authoritative.
- Unused Red Snapper architecture-background experiments were excluded from the release; only the approved editorial pair and canonical product assets are in scope.

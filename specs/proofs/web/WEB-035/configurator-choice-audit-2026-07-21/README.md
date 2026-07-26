# WEB-035 configurator choice repair proof — 2026-07-21

## First-principles finding

The seven-stage wizard only offered meaningful choice on Ride type and Bicycle. Fit was limited by audited physical SKUs, while Setup, Finish, and Add-ons were rendered as read-only summaries. The result looked exhaustive but behaved like a preselected product form.

## Repaired interaction contract

- Ride type: 3 selectable intents.
- Bicycle: all 11 model families, filtered by ride type.
- Fit: audited wheel sizes for the selected model.
- Setup: 6 choices across 3 independent groups (brakes, fork, gears).
- Finish: 1 verified catalog finish plus 4 clearly labelled colour requests.
- Add-ons: no add-ons or IBC frame-mounted carrier.
- Review: one resolved summary with either direct cart handoff for a verified SKU or a request handoff for a custom combination.

Verified wheel/carrier combinations resolve to the matching catalog SKU, price, and exact theme-paired product image. Non-stock combinations remain saved, but are marked as custom requests, use the base bicycle price as a qualifier, disclose that the image is a reference, and cannot enter the cart as a verified product.

## Automated evidence

- `node --test apps/web/src/design/data/configurator.test.mjs` — 16 passed, 0 failed.
- `npm run build -w web` — production build completed successfully.
- `npm run test -w web -- --list tests/configurator.spec.ts` — 4 focused browser scenarios discovered and compiled.
- Targeted ESLint — 0 errors; one existing `next/no-img-element` performance warning remains on the product detail strip.

## Browser evidence

- `08-custom-review.jpg` — custom choices retained at Review with `Request this build` and base-price qualification.
- `11-component-choices-compact.jpg` — responsive component group controls at the compact desktop viewport.
- `12-component-choices-dark.jpg` — the same component controls and exact dark studio image in dark theme.
- `13-stock-red-snapper-dark-review.jpg` — Red Snapper 24-inch IBC resolves to the verified dark SKU image, ₹5,000 price, and `Add selected build`.

## Release boundary

No push, publish, or deployment was performed. The repair remains local until the user explicitly requests deployment.

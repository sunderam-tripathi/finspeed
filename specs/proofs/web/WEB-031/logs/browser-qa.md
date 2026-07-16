# Browser QA

Result: PASS

Browser: Codex in-app Browser
Local URL: `http://127.0.0.1:3100`

## Rendered states

- `/shop`, page 1, light theme, 1440 x 900: `../artefacts/after/shop-side-profile-desktop-1440x900.png`
- `/shop`, page 2 upper row, light theme, 1440 x 900: `../artefacts/after/shop-side-profile-page-2-desktop-1440x900.png`
- `/shop`, page 2 lower row, light theme, 1440 x 900: `../artefacts/after/shop-side-profile-page-2-lower-desktop-1440x900.png`
- `/shop`, page 1, light theme, 390 x 844: `../artefacts/after/shop-side-profile-mobile-390x844.png`
- `/products/mako-shark`, light theme, 1440 x 900: `../artefacts/after/product-detail-side-profile-desktop-1440x900.png`
- `/products/mako-shark`, dark theme, 1440 x 900: `../artefacts/after/product-detail-side-profile-dark-desktop-1440x900.png`

## Checks

- All 11 catalog product images completed successfully and resolved to `assets/products/upscaled/*-480.webp` at the mobile catalog width.
- The Mako Shark product-detail hero resolved to `mako-shark-960.webp` at 1440 x 900; related cards resolved to 480-pixel derivatives.
- Both pagination controls and the light/dark theme toggle were exercised successfully.
- Accessibility snapshots exposed named navigation, buttons, product headings, product-image alt text, active/pressed states, disabled pagination, and the catalog structure.
- Browser console error logs were empty.
- The initial dark-theme product title used the light-only `--ink-900` token. `ProductDetail.jsx` now uses semantic `--text-strong` for the title and related headings; the final computed title color is `rgb(255, 255, 255)`.

Residual test gap: the standalone Playwright accessibility/regression suite was not run because Product Design QA required the user's selected in-app browser.

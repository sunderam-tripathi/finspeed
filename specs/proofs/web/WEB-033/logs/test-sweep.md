# Test sweep

## Focused favicon contract

Command: `npm run test -w web -- --grep "Finspeed favicon metadata"`

Result: PASS - 1 passed.

The test verifies the generated icon link metadata, HTTP success, content types, and exact SHA-256 bytes for the ICO, application icon, and Apple icon.

## Lint

Command: `npm run lint -w web`

Result: PASS - exit 0, 0 errors, 42 existing warnings.

## Production build

Command: `npm run build -w web`

Result: PASS - exit 0. Next compiled, typechecked, prerendered 14 routes, and emitted the application and Apple metadata image routes.

## Full browser suite

Command: `npm run test -w web`

Result: 25 passed, 1 failed.

The sole failure is the pre-existing responsive product-image assertion in `tests/contract.spec.ts`: the test expects `naturalWidth >= 960`, while Chromium reports the density-corrected intrinsic width of 691 px for a `sizes="48vw"` image at a 1440 px viewport. The underlying `bull-shark-1600.webp` file is 1600 x 1075 and no product code or asset changed in WEB-033. All remaining browser scenarios, including the focused favicon contract, pass.


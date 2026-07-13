# Design QA — WEB-028

## Comparison target

- Source visual truth: `specs/proofs/web/WEB-028/artefacts/local-before/home-desktop-before.png` — preferred Home header scale and spacing
- Pre-fix interior state: `specs/proofs/web/WEB-028/artefacts/local-before/shop-desktop-before.png`
- Rendered desktop implementation: `specs/proofs/web/WEB-028/artefacts/local-after/home-desktop-after.png` and `shop-desktop-after.png`
- Rendered mobile implementation: `specs/proofs/web/WEB-028/artefacts/local-after/home-mobile-after.png` and `shop-mobile-after.png`
- Desktop state: browser override 1586 × 992 at 1.25 OS scaling, captured content viewport approximately 1265 × 710, consent resolved
- Mobile state: browser override 390 × 844, captured content width 375px, consent resolved

## Comparison evidence

- Full pre-fix comparison: `specs/proofs/web/WEB-028/artefacts/design/comparison-desktop-before.png`
- Full post-fix comparison: `specs/proofs/web/WEB-028/artefacts/design/comparison-desktop-after.png`
- Focused pre-fix header comparison: `specs/proofs/web/WEB-028/artefacts/design/comparison-header-before.png`
- Focused post-fix header comparison: `specs/proofs/web/WEB-028/artefacts/design/comparison-header-after.png`
- Mobile post-fix comparison: `specs/proofs/web/WEB-028/artefacts/design/comparison-mobile-after.png`
- Focused mobile header comparison: `specs/proofs/web/WEB-028/artefacts/design/comparison-mobile-header-after.png`

The focused comparisons are required because the decisive defects concern the logo/wordmark optical baseline, header height, nav spacing, icon scale, and action-target geometry.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: Home and interior routes now share the same body-font wordmark, 600 weight, responsive size, line height, tracking, and navigation typography. The wordmark occupies the same 54px desktop / 30px mobile lockup frame as the official mark, with a 1px optical baseline correction.
- Spacing and layout rhythm: desktop Home and Shop now both measure 80px high in the captured viewport, with the same 38.4px side padding, 54px mark, 54px wordmark frame, 38.4px nav gap, 48px actions, and 17.92px action gap. Mobile states both measure 114.8px high with the same 30px mark, 30px wordmark frame, 40px actions, and 48px navigation row.
- Colors and tokens: dark and light surfaces remain intentional variants. The light header now explicitly uses `--ink-700` navigation and `--ink-900` actions instead of inheriting low-contrast dark-surface tokens.
- Image quality and asset fidelity: the official Finspeed mark assets are unchanged. No logo, wordmark, or icon was replaced with CSS art, custom SVG, or generated imagery.
- Copy and content: brand and navigation labels are unchanged. The brand control now exposes the concise accessible name `Finspeed home` instead of duplicating the image alt and visible wordmark.
- Icons and controls: all routes use the same 22px Lucide icons, 48px desktop targets, and 40px mobile targets. Search, account, cart, and category controls retain their existing handlers.
- Responsiveness: Home and Shop header geometry is identical at desktop and mobile. The automated contract also compares both routes at 1440 × 900 and 390 × 844.

## Comparison history

1. Pre-fix focused comparison found a P1 route-transition shift: Home used an 80px header, 54px mark, 27.52px wordmark, 38.4px nav gap, and 48px actions; Shop used a 74px header, 38px mark, 22px wordmark, 24px nav gap, and 44px actions.
2. Pre-fix comparison also found a P1 contrast regression in the light state: navigation resolved to `#c4ced6` and action icons to white on an 86% white surface.
3. Fix: all geometry moved into shared `.store-header`, `.store-brand`, `.store-primary-nav`, and `.store-header-actions` contracts. Route variants now control colors only, and light-state foreground colors are explicit.
4. Post-fix full and focused comparisons show identical route geometry and readable controls. Mobile Home and Shop also match exactly. No visual change was made after the passing comparison.

## Browser verification

- Home and Shop screenshots were captured and opened at matching desktop and mobile viewport overrides.
- Browser geometry reads confirm identical Home/Shop header, brand, logo, wordmark, navigation, action-group, and button dimensions.
- Product detail uses the same shared Header component and measured desktop geometry.
- Browser console: no errors or warnings during the verified route states.
- Automated interaction contracts: shared header geometry passes at both 1440 × 900 and 390 × 844, and Shop, Home, Search, and Account routes remain connected.

## Follow-up polish

- P3: none required for the shared header correction.

final result: passed

# Design QA — WEB-029 Uniform dark storefront header

## Comparison target

- Source visual truth: `specs/proofs/web/WEB-029/artefacts/source-home-dark.png`
- Rendered implementation:
  - `specs/proofs/web/WEB-029/artefacts/local-home-dark.png`
  - `specs/proofs/web/WEB-029/artefacts/local-shop-dark.png`
  - `specs/proofs/web/WEB-029/artefacts/local-home-mobile-dark.png`
  - `specs/proofs/web/WEB-029/artefacts/local-shop-mobile-dark.png`
- Desktop viewport: 1280 × 720
- Mobile viewport: 390 × 844
- States: released Home source; local Home and Shop implementations; default, no hover or focus

## Comparison evidence

- Full-view desktop comparison: the released Home source and local Shop implementation were opened together in one comparison input at the same 1280 × 720 viewport.
- Full-view mobile comparison: local Home and Shop were opened together in one comparison input at the same 390 × 844 viewport.
- Focused header evidence: `specs/proofs/web/WEB-029/artefacts/local-shop-header-dark.png`; the full-view captures were also inspected at native size because the header controls remain clearly readable there.
- The Shop page body is outside the WEB-029 header target and is unchanged by this slice.

## Findings

No actionable P0, P1, or P2 header differences remain.

- Fonts and typography: the logo wordmark, navigation labels, and action controls retain the Home header family, weight, size, line height, and letter spacing on Shop.
- Spacing and layout rhythm: header height, side padding, logo lockup, navigation gaps, and action positions match across Home and Shop at desktop and mobile.
- Colors and visual tokens: every storefront Header state uses the same dark surface, light wordmark, light navigation, and white actions; obsolete light-route selectors were removed.
- Image quality and asset fidelity: the official light Finspeed logo asset is used unchanged on every route; no generated, redrawn, or substitute brand asset was introduced.
- Copy and content: header labels and category order are unchanged.
- Icons and behavior: the existing Lucide search, account, and cart icons remain aligned and the navigation handlers pass automated route checks.
- Accessibility: visible targets preserve the established 48px desktop and 40px mobile geometry; the complete axe audit passes after the test waits for the persisted theme to finish hydrating.

## Comparison history

### Pass 1

- Earlier finding: the released Shop header used a light surface while Home used a dark surface, so route transitions still felt like a different header despite matched geometry.
- Fix: removed the route-dependent color branch and obsolete light-only responsive rules; the shared Header now always uses the Home dark treatment and official light logo.
- Post-fix evidence: the desktop and mobile Home/Shop captures listed above show identical header treatment and coordinates. No further P0-P2 fix was required.

## Open questions

None for the header target.

## Implementation checklist

- [x] One dark Header treatment across routes
- [x] Official light logo retained
- [x] WEB-028 geometry contract preserved
- [x] Desktop and mobile visual comparisons pass
- [x] Home, Shop, product, and service route contract passes
- [x] Navigation, console, lint, build, accessibility, and 22-test browser suite pass

final result: passed

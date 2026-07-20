# WEB-035 Proof - Product-true configurator and storefront refinements

## Homepage city-story theme pair

The homepage city-story section now belongs to the same visual system as the selected site theme instead of presenting one fixed campaign treatment in both modes.

- Focused visual result: **PASS**
- Product shown: Red Snapper city bicycle
- Light theme: warm daylight brick-and-stone residence scene with porcelain-toned copy treatment
- Dark theme: dusk city-residence scene with the existing carbon overlay and illuminated product treatment
- Theme behavior: the source photograph, overlay, typography, rules, and calls to action resolve from the active editorial theme
- Keyboard treatment: both calls to action use the strong editorial cyan focus ring on porcelain and carbon surfaces

## Responsive treatment

- Desktop keeps the complete bicycle on the right and a copy-safe architectural field on the left.
- The headline, supporting copy, and two calls to action remain aligned to the shared editorial section gutter.
- At mobile width, the composition becomes a stacked image band so the complete bicycle remains visible instead of being enlarged, clipped, or forced behind the copy.
- Both theme variants preserve the same hierarchy and interaction geometry while changing only the visual temperature and contrast treatment.

## Visual evidence

- Light desktop: `screenshots/home-city-story-light-desktop-final.png`
- Dark desktop: `screenshots/home-city-story-dark-desktop-final.png`
- Light mobile: `screenshots/home-city-story-light-mobile-final.png`
- Dark mobile: `screenshots/home-city-story-dark-mobile-final.png`
- Reference, dark, and light side-by-side: `screenshots/home-city-story-theme-comparison-final.png`

The desktop captures were reviewed at the same viewport for product scale, full-bicycle framing, copy contrast, gutter alignment, background continuity, and theme coherence. The mobile pair verifies the dedicated lower image band and unclipped bicycle composition.

## Editorial-menu pointer intent

The open menu now keeps the last intentionally selected journey active while the cursor crosses from the left index into the right feature pane.

- Interaction result: **PASS**
- Selection model: established preview is latched until menu close or route change
- Hover intent: 120 ms, cancellable when the pointer exits the journey index
- Keyboard model: focus changes the preview immediately; blur does not cause fallback
- Reset model: closing/reopening restores the route-appropriate default
- Regression: `apps/web/tests/contract.spec.ts` covers Engineering selection and pointer travel into the feature pane

### Evidence

- Stable Engineering state: `screenshots/menu-hover-stable-light.png`
- Reported state versus stable state: `screenshots/menu-hover-reference-vs-stable.png`

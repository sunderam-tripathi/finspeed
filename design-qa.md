# Design QA — WEB-026

## Comparison target

- Source visual truth: `specs/proofs/web/WEB-026/artefacts/source/production-failure-content-2048x990.png`
- Generated desktop art target: `specs/proofs/web/WEB-026/artefacts/design/mako-shark-hero-v4-desktop.png`
- Generated mobile art target: `specs/proofs/web/WEB-026/artefacts/design/mako-shark-hero-v4-mobile.png`
- Rendered desktop implementation: `specs/proofs/web/WEB-026/artefacts/local/desktop-2048x990-final.png`
- Rendered mobile implementation: `specs/proofs/web/WEB-026/artefacts/local/mobile-390x844-final.png`
- Desktop viewport/state: 2048 × 990, homepage, dark theme, consent preference already resolved
- Mobile viewport/state: 390 × 844 browser viewport (375px content width with scrollbar), homepage, dark theme

## Comparison evidence

- Full-view normalized comparison: `specs/proofs/web/WEB-026/artefacts/design/comparison-full-pass1.png`
- Focused bicycle comparison: `specs/proofs/web/WEB-026/artefacts/design/comparison-bike-pass1.png`
- A focused comparison was required because the decisive defect concerned spoke detail, frame edges, lighting, tire contact, and product/background coherence that are not reliably judged from a reduced full-page board.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: the existing display face, mono eyebrow/price treatment, body hierarchy, wrapping, and optical weights remain consistent with the approved dark storefront direction. The shortened hero does not create title, body, or commerce collisions.
- Spacing and layout rhythm: the 96px header, 744px hero, and 136px terrain strip end at y=976 in the 990px reference viewport. Copy, commerce, full bicycle, specification rail, and all three terrain destinations are visible with 14px remaining.
- Colors and tokens: the near-black, graphite, cyan, white, and mint palette remains coherent. The reduced shade overlay protects copy contrast without flattening the newly generated lighting.
- Image quality and asset fidelity: the final desktop/mobile heroes are complete generated photographs. The low-resolution cutout is not overlaid or upscaled. The bicycle has crisp frame edges, circular wheels, plausible fork/drivetrain/brake geometry, coherent atmosphere, and direct tire contact shadows with no matte halo.
- Copy and content: the approved headline, support copy, offer, specifications, and terrain labels are unchanged and remain readable.
- Icons and controls: the Lucide action/specification icons remain aligned and visually consistent; no visible asset is replaced by CSS or handcrafted SVG art.
- Responsiveness and accessibility: desktop has no horizontal overflow; mobile uses the dedicated portrait art, retains full-width navigation and 44px header actions, and shows the complete bicycle horizontally without clipping. Semantic region, navigation, complementary, button, and heading roles remain intact.

## Comparison history

1. Pre-pass mobile capture (`artefacts/local/mobile-390x844.png`) exposed a P2 horizontal bicycle crop caused by applying the portrait asset through a cover crop.
2. Fix: the phone breakpoint now sizes the dedicated portrait art to 130% width, preserves its intrinsic aspect ratio, centers it, and anchors it to the hero floor. This keeps the complete bicycle horizontally visible while retaining dark copy-safe space.
3. Post-fix evidence: `artefacts/local/mobile-390x844-final.png` shows the full front and rear bicycle geometry across the phone width without horizontal page overflow.
4. Formal desktop full-view and focused pass (`comparison-full-pass1.png`, `comparison-bike-pass1.png`) found no remaining P0/P1/P2 mismatch. No visual change was made after that pass.

## Browser verification

- Primary CTA: “Shop the fleet” opened `/shop` with the `Shop all cycles` heading.
- Product CTA: “View Mako Shark details” opened `/products/mako-shark` with the `Mako Shark` heading.
- Brand control returned to the homepage after each path.
- Browser console: no errors or warnings recorded during the tested flow.

## Follow-up polish

- P3: none required for the current correction.

final result: passed

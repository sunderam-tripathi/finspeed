# Design QA — WEB-027

## Comparison target

- Selected direction: `specs/proofs/web/WEB-027/artefacts/source/selected-quiet-summit.png`
- Clean desktop photograph: `specs/proofs/web/WEB-027/artefacts/design/quiet-summit-clean-desktop.png`
- Clean mobile photograph: `specs/proofs/web/WEB-027/artefacts/design/quiet-summit-clean-mobile.png`
- Rendered desktop implementation: `specs/proofs/web/WEB-027/artefacts/local/desktop-1586x992-pass2.png`
- Rendered mobile implementation: `specs/proofs/web/WEB-027/artefacts/local/mobile-390x844-final.png`
- Desktop state: 1586 × 992 browser viewport, homepage, dark theme, consent resolved
- Mobile state: 390 × 844 browser viewport (375px content width with scrollbar), homepage, dark theme

## Comparison evidence

- Full-view normalized comparison: `specs/proofs/web/WEB-027/artefacts/design/comparison-full-pass2.png`
- Focused photographic comparison: `specs/proofs/web/WEB-027/artefacts/design/comparison-subject-pass2.png`
- The focused comparison verifies the decisive issue: bicycle frame detail, spoke clarity, rider contact, lighting, and the absence of an extraction halo.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Composition: the homepage now leads with a brand moment rather than an offer. The rider and bicycle form one believable photographic subject, while the left third retains dark copy-safe space.
- Typography: the campaign headline uses the selected uppercase treatment, three-line wrap, strong display face, cyan mono eyebrow, and compact supporting copy.
- Viewport fit: at 1586 × 992 the 82px header, 752px hero, and full 152px terrain strip are all visible without horizontal overflow. The CTA and complete bicycle remain inside the hero.
- Image quality: the desktop WebP is 2880 × 1801 and the mobile WebP is 1440 × 1920. Both are complete photographs; there is no enlarged transparent product cutout or separately composited shadow.
- Product fidelity: the bicycle retains the mint-and-graphite Finspeed identity and the campaign context without presenting false price, specification, or offer claims in the hero.
- Responsiveness: the phone breakpoint uses dedicated portrait art, a compact two-row header, an entirely visible CTA, and a horizontally scrollable terrain strip beginning immediately after the hero.
- Controls and accessibility: the CTA and all terrain destinations remain real buttons with semantic region/navigation labels. The visible controls have accessible names and there are no browser-console warnings or errors in the tested path.

## Comparison history

1. Desktop pass 1 confirmed that the clean photograph removed the pixelated cutout and fit the hero without upscaling; it exposed a softer title-case campaign treatment.
2. The headline was changed to the selected uppercase treatment and optical tracking was tightened.
3. Mobile pass 1 exposed a three-row, 185px header caused by high-specificity desktop action sizing.
4. The mobile brand and action selectors were made breakpoint-specific, reducing the header to 115px and bringing the entire hero to the first viewport boundary.
5. Final desktop and mobile captures found no remaining P0/P1/P2 mismatch.

## Browser verification

- “Find your ride” opened `/shop` with the `Shop all cycles` heading.
- The Mountain terrain destination opened `/shop?category=mountain` with the Mountain filter pressed and five matching cycles.
- Browser console: no errors or warnings during the tested homepage and navigation flow.

## Follow-up polish

- P3: none required for the current hero correction.

final result: passed

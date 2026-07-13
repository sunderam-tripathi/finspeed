# WEB-024 Design QA

## Evidence

- Source visual truth: `specs/proofs/web/WEB-024/artefacts/design/approved-dark-hero-reference.png`
- User-reported production failure: `specs/proofs/web/WEB-024/artefacts/design/production-layout-failure.png`
- Browser-rendered implementation: `specs/proofs/web/WEB-024/artefacts/screenshots/final-local-desktop-1280x720-v2.png`
- Same-state full-view comparison: `specs/proofs/web/WEB-024/artefacts/design/design-comparison-1280x720-v2.png`
- Focused product comparison: `specs/proofs/web/WEB-024/artefacts/design/product-focus-comparison.png`
- Large desktop evidence: `specs/proofs/web/WEB-024/artefacts/screenshots/final-local-desktop-1920x990.png`
- Mobile evidence: `specs/proofs/web/WEB-024/artefacts/screenshots/final-local-mobile-390x844.png`
- Comparison viewport/state: 1280 x 720, homepage, dark storefront, scrollY 0, first-visit analytics notice visible.
- Large desktop viewport/state: 1920 x 990, homepage, dark storefront, scrollY 0, first-visit analytics notice visible.
- Mobile viewport/state: 390 x 844, homepage, dark storefront, scrollY 0, first-visit analytics notice visible.

## Mandatory comparison pass

- Fonts and typography: the existing display/body/mono families, three-line headline, uppercase eyebrow, cyan price hierarchy, line-height, and letter spacing preserve the source design's optical hierarchy. No wrapping or truncation defects remain.
- Spacing and layout rhythm: the header, copy anchor, CTA/product-summary pairing, integrated bicycle stage, and right specification rail retain the source's three-zone structure. The final copy group is shifted 24 px upward at desktop to keep the commerce row clear at short viewports.
- Colors and tokens: near-black, graphite, white, muted steel blue, and restrained cyan stay within the existing storefront token system. The generated environment adds depth without introducing a new visual language.
- Image quality and asset fidelity: the environment is generated separately. The official 1200 x 900 Mako Shark source is composited at native 1:1 size; only the elongated neutral studio-floor residue is removed. Every RGBA pixel outside that mask remains byte-identical to the source. Desktop and mobile use purpose-composed assets rather than responsive scaling of an independent product layer.
- Copy and content: all existing Finspeed hero, product, pricing, specification, navigation, and consent copy is unchanged and coherent.
- Icons: existing Lucide storefront icons remain complete, aligned, and consistent in the header and technical rail.
- Responsiveness: desktop and mobile art direction use separate precomposed crops. The desktop CTA and price are visible at the reported production viewport; mobile no longer applies the desktop bicycle scaling rules and has no product-layer collision.
- Accessibility: semantic heading/navigation/aside structure, labelled controls, focus styles, and practical tap targets remain intact. The decorative campaign picture has an empty alternative.
- Interactions: verified the Mako product summary routes to `/products/mako-shark` and the Shop control routes to `/shop`.
- Browser console: zero error entries after the interaction pass.

## Findings

- P3 source limitation: the official product PNG contains light edge pixels and lower-resolution wheel detail. Those pixels are intentionally preserved because the user required the bicycle itself to remain unchanged.
- P3 expected state difference: the global analytics notice overlays the bottom edge on a first visit. At the reported 1920 x 990 desktop viewport the CTA and price remain fully readable above it; the notice is not part of the hero design.

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial production capture: the independently scaled bicycle was oversized, retained a bright studio-floor streak, appeared pasted onto the mountain background, and the viewport-height composition obscured commerce content.
2. Initial integrated-image capture (`design-comparison-1280x720.png`): the product/background separation was resolved, but the copy block sat roughly 24 px lower than the source at the short desktop viewport (P2 spacing drift).
3. Final capture (`design-comparison-1280x720-v2.png`): moved the desktop copy group up 24 px, kept the CTA clear, preserved the price hierarchy, and reconfirmed the full product stage. No P0/P1/P2 differences remain.

final result: passed

# WEB-023 Design QA

## Evidence

- Source design: `specs/proofs/web/WEB-023/artefacts/design/selected-option-2.png`
- Browser-rendered implementation: `specs/proofs/web/WEB-023/artefacts/design/implementation-desktop-1586x992-final.png`
- Comparison: `specs/proofs/web/WEB-023/artefacts/design/comparison-final.png`
- Focused hero comparison: `specs/proofs/web/WEB-023/artefacts/design/comparison-hero-final.png`
- Responsive evidence: `specs/proofs/web/WEB-023/artefacts/design/implementation-mobile-390x844.png`
- Desktop viewport/state: 1586 x 992, homepage, scrollY 0, analytics consent already answered so the persistent notice is not present.
- Mobile viewport/state: 390 x 844, homepage, scrollY 0, no horizontal overflow (`scrollWidth` 375 at a 390 CSS-pixel viewport with browser scrollbar).

## Mandatory comparison pass

- Typography: the display face, weight, line breaks, uppercase eyebrow, price hierarchy, and body-copy measure follow the selected design. The implemented title is slightly more compact optically, but retains the same hierarchy and three-line composition.
- Spacing and layout: header height, left hero anchor, CTA/product pairing, bicycle footprint, right specification rail, and terrain-strip reveal align closely with the source. No collisions or clipped controls remain.
- Viewport resilience: desktop and mobile were rendered in the in-app browser. The mobile header reflows into two rows, the hero becomes a readable single-column composition, and the bicycle continues below the fold without horizontal overflow.
- Colors and tokens: the near-black shell, cyan accents, white display type, muted copy, and low-contrast mountain atmosphere match the intended palette and use the existing storefront token system.
- Image quality and asset fidelity: the hero uses an intentionally generated mountain background plus the official transparent Mako Shark product cutout. City and hybrid terrain imagery uses generated campaign assets sized for their slots. No placeholder boxes, CSS art, handcrafted SVG art, or stretched screenshots are present.
- Copy and content: all hero, product, category, engineering, newsletter, and footer copy is coherent in the Finspeed storefront context.
- Icons: existing Lucide storefront icons render consistently in the header and specification rail. All visible icons are present and aligned.
- States and interactions: verified `Shop the fleet` -> `/shop`, featured Mako summary -> `/products/mako-shark`, and terrain Mountain -> `/shop?category=mountain`.
- Accessibility: semantic headings/navigation/aside labels, descriptive bicycle alt text, labelled controls, visible focus styles, reduced-motion handling, and practical mobile tap targets are retained.
- Browser console: checked after the interaction pass; zero error entries.

## Findings

- P3 imagery: the official Mako Shark cutout has a different camera angle and a light studio-ground edge compared with the generated source mock. Keeping the real product asset is preferable to inventing or distorting the bicycle.
- P3 icons: the existing Lucide wheel/brake/terrain glyphs are simpler than the bespoke technical line icons in the source, but they are complete, consistent, and production-safe.

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial browser capture (`implementation-desktop-1586x992.png`): title scale and bicycle placement drifted, the specification rail lacked supported icons, and the unhandled consent state obscured the storefront.
2. Intermediate pass (`implementation-desktop-1586x992-v3.png`): corrected title scale, hero spacing, and bicycle footprint; captured the normal answered-consent state and replaced unsupported icon names with the project's existing Lucide set.
3. Final pass (`implementation-desktop-1586x992-final.png`): aligned the specification rail to the source, stacked its icon treatment vertically, moved the official bicycle into the target footprint, and verified desktop/mobile states and primary navigation.

final result: passed

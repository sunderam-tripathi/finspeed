# Design QA — WEB-025

## Comparison target

- Source visual truth: `specs/proofs/web/WEB-025/artefacts/design/mako-shark-hero-v3.png`, `specs/proofs/web/WEB-025/artefacts/design/mako-shark-hero-v3-mobile.png`, and the user-reported production failure at `specs/proofs/web/WEB-025/artefacts/screenshots/production-reported-failure.png`.
- Browser implementation: `specs/proofs/web/WEB-025/artefacts/screenshots/local-desktop-1920x990.png` and `specs/proofs/web/WEB-025/artefacts/screenshots/local-mobile-390x844.png`.
- Viewports: desktop 1920 × 990; mobile 390 × 844.
- State: homepage, dark storefront, consent notice dismissed after an explicit choice.
- Full-view comparison: `specs/proofs/web/WEB-025/artefacts/design/design-comparison-desktop.png`.
- Focused product comparison: `specs/proofs/web/WEB-025/artefacts/design/product-focus-comparison.png`.
- Mobile art-direction comparison: `specs/proofs/web/WEB-025/artefacts/design/design-comparison-mobile.png`.

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: the display face, body hierarchy, line breaks, weights, and cyan commerce emphasis remain consistent with the selected dark storefront. Desktop and mobile wrapping are deliberate and readable.
- Spacing and layout rhythm: header, copy, CTA, price, product stage, and specification rail retain clear separation. At 390 × 844, the copy ends before the product begins and there is no horizontal overflow.
- Colors and visual tokens: near-black surfaces, restrained petrol-blue atmosphere, cyan controls, and white copy maintain the intended performance palette and accessible hierarchy.
- Image quality and asset fidelity: the official Mako Shark geometry, branding, component placement, proportions, mint frame, and yellow accent are preserved. Bright matte contamination and neutral highlights are scene-matched; both wheels receive perspective-aware contact shadows; the background has compatible grain, light direction, and ground scale. No generated product substitute or code-drawn image is used.
- Copy and content: homepage copy, price, specifications, and CTA remain unchanged and coherent.
- Icons and controls: existing Lucide storefront icons remain aligned and consistent. Consent actions are semantic buttons with practical touch targets and visible focus treatment.
- Interaction and accessibility: Accept and Decline dismiss immediately; automated checks cover persistence and storage failure. Browser console errors are zero in both reviewed viewports.

## Comparison history

1. Initial WEB-024 production evidence showed a P1 image-quality mismatch: bright neutral edges and spokes, incompatible background lighting, oversized product presentation, and no convincing wheel contact. The correction uses a quieter ground plane, protected photometric cleanup, reduced product scale, matched neutral lighting, and wheel-specific shadows. Post-fix evidence: `product-focus-comparison.png` and `local-desktop-1920x990.png`.
2. First WEB-025 mobile capture showed a P2 issue: the responsive shade reduced product visibility too heavily below the commerce block. The lower-half overlay was reduced while the copy-safe upper zone remained dark. Post-fix evidence: `design-comparison-mobile.png` and `local-mobile-390x844.png`.

## Follow-up polish

- P3: the supplied product photograph is lower-resolution than the generated environment, so very close inspection still reveals source softness. Further improvement would require a higher-resolution official product photograph rather than redrawing the bicycle.

## Implementation checklist

- [x] Desktop crop and hierarchy match the corrected campaign direction.
- [x] Product matte, neutral lighting, scale, and contact shadows are integrated.
- [x] Mobile art direction avoids copy/product overlap and horizontal overflow.
- [x] Consent choices dismiss immediately and preserve accessibility semantics.
- [x] Desktop and mobile console checks report zero errors.

final result: passed

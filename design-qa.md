# Design QA - WEB-034 seamless build studio

## Comparison target

- Source visual truth: `specs/proofs/web/WEB-034/audit-2026-07-17/00-reference.png`
- Implementation: `http://127.0.0.1:3100/build`
- Matched desktop viewport: `1486 x 1059`
- Responsive viewport: `390 x 844`
- Matched state: light theme, `02 Brakes`, Power Brakes selected

## Evidence

- Final desktop: `specs/proofs/web/WEB-034/audit-2026-07-17/15-final-webpack-matched.png`
- Source and implementation side by side: `specs/proofs/web/WEB-034/audit-2026-07-17/16-reference-vs-final.png`
- Mobile controls: `specs/proofs/web/WEB-034/audit-2026-07-17/17-final-mobile.png`
- Mobile product blend: `specs/proofs/web/WEB-034/audit-2026-07-17/18-final-mobile-bike.png`
- Generated component source sheet: `specs/proofs/web/WEB-034/audit-2026-07-17/19-ai-detail-assets.png`
- Final generated detail strip on desktop: `specs/proofs/web/WEB-034/audit-2026-07-17/21-ai-detail-strip-refined.png`
- Final generated detail strip on mobile: `specs/proofs/web/WEB-034/audit-2026-07-17/22-ai-detail-strip-mobile.png`
- Focused generated-source vs rendered-card comparison: `specs/proofs/web/WEB-034/audit-2026-07-17/23-ai-detail-source-vs-implementation.png`
- Menu-open regression report: `C:/Users/SUNDER~1/AppData/Local/Temp/codex-clipboard-b7925367-30b5-4a24-bbf3-4ee62270e88e.png`

## Findings

- No actionable P0, P1, or P2 visual findings remain for the requested background and product integration.
- Canvas continuity: the controls and product stage now share one warm porcelain gradient. The former bright rectangular product-image well is gone.
- Product fidelity: the verified 1600-pixel Mako Shark side-profile master is unchanged. Multiply blending integrates its near-white source canvas without recoloring or redrawing the bicycle.
- Composition: the desktop studio uses the reference's `38 / 62` split and 672-pixel height, exposing the complete detail rail in the first viewport.
- Color: the gradient progresses from warm ivory through neutral porcelain to a slightly warmer right edge, matching the supplied reference direction.
- Configurator fidelity: the Brakes state now selects Power Brakes first and uses the reference descriptions and pricing hierarchy.
- Responsive behavior: mobile keeps the same uninterrupted porcelain surface, stacks both actions within 390 pixels, and preserves the full bicycle without clipping.
- Component storytelling: four distinct AI-generated macro studies now replace the repeated hero crop. Brakes, suspension, drivetrain, and frame each use purpose-built 1200 x 675 WebP art with a shared porcelain studio treatment and copy-safe negative space.
- Component crops: desktop preserves approximately 97% of every generated frame; the 390-pixel mobile treatment keeps the central 82%, with every mechanical subject still recognizable.
- Navigation: the previously approved centered editorial header is intentionally retained; this pass only changes the studio treatment beneath it.
- Menu surface continuity: the right feature pane now paints the same `--menu-bg` porcelain surface as the full navigation. The image well no longer creates a nested stacking context, so the existing multiply blend reaches that porcelain backdrop instead of rendering the source image's opaque near-white canvas.
- Accessibility: the cyan eyebrow token was adjusted from `#087f9f` to `#087a99`, clearing WCAG AA on the warm background without changing the visual direction.
- Runtime: the production build succeeds, lint reports zero errors, the generated-image contract checks pass, and all 55 browser tests pass.
- Follow-up verification: the in-app browser returned HTTP 200 at `/build` and the saved 390 x 844 capture confirms the shared porcelain background, collision-free five-step rail, stacked actions, complete option copy, and no horizontal overflow. The corresponding account capture confirms all five tracking stages fit without clipping or a native scrollbar.

## Required fidelity surfaces

- Fonts and typography: the existing compact mono headings and neutral body copy remain unchanged; generated images contain no user-facing text, and all overlay copy remains real accessible HTML.
- Spacing and layout rhythm: the four-column desktop, two-column tablet, and one-column mobile structures are preserved. Purpose-built 16:9 art removes the former 2.35x crop while retaining the original 206/240-pixel card rhythm.
- Colors and visual tokens: every generated study uses the same warm porcelain, mint, graphite, black, and restrained yellow language. The right-edge fades map back to `#f7f3ef`, while the adjusted small cyan token clears AA contrast.
- Image quality and asset fidelity: all four sources are distinct 1200 x 675 WebPs with crisp component detail, clean edges, no watermarks, and no visible generated lettering. The focused comparison verifies that the browser crop retains each intended subject.
- Copy and content: Stop stronger, Smooth control, Shift precise, and Built to last remain intact, legible, and correctly paired with their component study at desktop and mobile sizes.

No P0, P1, or P2 mismatch remains in the focused source-to-render comparison. The generated studies are intentionally editorial component visualizations rather than documentary photographs of exact component makes or model labels.

## Iteration history

- Audit: the original implementation used a different page surface, an opaque near-white image rectangle, excess hero height, a smaller bicycle, and reversed brake options.
- Canvas pass: introduced one shared porcelain gradient and made the controls, visual, and product stage transparent.
- Product pass: used `mix-blend-mode: multiply` with the existing verified product master, then tuned its scale and position without modifying the bicycle.
- Geometry pass: matched the desktop studio height and split so the detail strip enters the first viewport.
- Responsive pass: stacked actions on mobile and verified the same seamless product treatment below the controls.
- Component-art pass: generated four coordinated photoreal component studies from the Mako Shark reference, removed stray generated lettering from the suspension image, optimized all four to 1200 x 675 WebP, and replaced the repeated crop implementation.
- Render comparison pass: strengthened the porcelain copy fade after the first browser capture so drivetrain and frame copy stays legible without obscuring the component subject; the post-fix desktop and mobile evidence passes.
- Menu blend pass: removed the image well's `z-index: 0` stacking context and moved the blend boundary to the feature pane, allowing the opaque near-white product master to multiply into the same porcelain canvas without altering the bicycle.
- Runtime pass: switched local development to webpack after a Turbopack-only CSS chunk loading fault; the production build and full browser suite remain green.

final result: passed

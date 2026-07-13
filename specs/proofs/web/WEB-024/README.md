# WEB-024 proof

## Scope

Replace the separated mountain background and responsive Mako product cutout with a campaign-ready integrated hero image while preserving the official bicycle.

## Local parity evidence

- Production failure: `artefacts/design/production-layout-failure.png`
- Approved visual target: `artefacts/design/approved-dark-hero-reference.png`
- Generated empty environment: `artefacts/design/environment-plate-source.png`
- Exact product after studio-floor removal: `artefacts/design/mako-shark-exact-minus-studio-ground.png`
- Final desktop composition: `artefacts/design/integrated-mako-hero-v2.png`
- Final mobile composition: `artefacts/design/integrated-mako-hero-v2-mobile.png`
- Full-view final comparison: `artefacts/design/design-comparison-1280x720-v2.png`
- Focused product comparison: `artefacts/design/product-focus-comparison.png`
- Large desktop render: `artefacts/screenshots/final-local-desktop-1920x990.png`
- Mobile render: `artefacts/screenshots/final-local-mobile-390x844.png`
- Generation record: `artefacts/design/generation-record.md`
- Product invariance: `artefacts/design/product-invariance.md`
- Validation log: `artefacts/logs/local-validation.md`

All screenshots and comparison images above were opened at original resolution and visually inspected. The bicycle is grounded, the white studio sweep is absent, the product silhouette is complete, copy and specification rails do not collide, and the desktop CTA/price remain readable at the reported production viewport.

RESULT local-parity: PASS

## Production evidence

- Release commit: `6d293a7a26b2452754b0ebbbe7803ec4724daca3`
- AWS Amplify app/branch: `d2h8tz7elv2xy8` / `main`
- Amplify job: `397`, `SUCCEED` at 2026-07-13 19:26:15 +05:30
- Public URL: `https://www.finspeed.online/`
- Reported-size production render: `artefacts/production/production-desktop-1920x990.png`
- Short desktop production render: `artefacts/production/production-desktop-1280x720.png`
- Production validation details: `artefacts/production/production-validation.md`

Both production screenshots were opened at original resolution and inspected. At 1920 x 990, the integrated product is grounded with no white studio sweep; the CTA, price, and four-item spec rail are visible and do not collide. The deployed mobile breakpoint selects the dedicated mobile campaign asset and has no horizontal overflow.

RESULT production: PASS

## Acceptance

Acceptance is approved: the generated imagery changes only the environment, the official product pixels remain invariant outside the removed studio-floor mask, responsive layouts pass visual QA, repository gates pass, Amplify job 397 succeeded, and the public site serves the verified desktop/mobile assets with working conversion paths and no browser console errors.

# WEB-025 proof

## Scope

Replace the visibly pasted WEB-024 Mako hero with a product-preserving photographic composite and repair the consent notice so either decision dismisses immediately.

## Local parity evidence

- User-reported production failure: `artefacts/screenshots/production-reported-failure.png`
- Generated desktop environment: `artefacts/design/environment-plate-desktop-source.png`
- Generated mobile environment: `artefacts/design/environment-plate-mobile-source.png`
- Scene-matched transparent product: `artefacts/design/mako-shark-scene-matched.png`
- Final desktop composition: `artefacts/design/mako-shark-hero-v3.png`
- Final mobile composition: `artefacts/design/mako-shark-hero-v3-mobile.png`
- Desktop before/after: `artefacts/design/design-comparison-desktop.png`
- Focused bicycle before/after: `artefacts/design/product-focus-comparison.png`
- Mobile art-direction comparison: `artefacts/design/design-comparison-mobile.png`
- Desktop browser render: `artefacts/screenshots/local-desktop-1920x990.png`
- Mobile browser render: `artefacts/screenshots/local-mobile-390x844.png`
- Consent notice before dismissal: `artefacts/screenshots/local-desktop-consent-before.png`
- Image generation record: `artefacts/design/generation-record.md`
- Product invariance: `artefacts/design/product-invariance.md`
- Local validation: `artefacts/logs/local-validation.md`

All final compositions, browser screenshots, and combined comparisons were opened at original resolution and visually inspected. The product silhouette and identity are preserved; neutral contamination is suppressed; the light direction, atmosphere, ground scale, and wheel contact agree; desktop copy/specifications remain separated; mobile copy ends before the product begins; and the consent notice no longer covers the page after a decision.

RESULT local-parity: PASS

## Production evidence

- Release commit: `7651b5388bad88100b387841b0a7f364cba150de`
- AWS Amplify app/branch: `d2h8tz7elv2xy8` / `main`
- Amplify job: `398`, `SUCCEED` at 2026-07-13 20:50:54 +05:30
- Public URL: `https://www.finspeed.online/`
- Desktop production render: `artefacts/production/production-desktop-1920x990.png`
- Mobile production render: `artefacts/production/production-mobile-390x844.png`
- Production validation: `artefacts/production/production-validation.md`

Both public-domain screenshots were opened at original resolution and inspected. The deployed site selects the v3 desktop and mobile assets, preserves the approved composition, has no horizontal overflow or browser console errors, and keeps the product/copy separation proven locally. The Amplify branch origin independently showed the consent notice, dismissed it immediately after Accept, and kept it dismissed after reload.

RESULT production: PASS

## Acceptance

Acceptance is approved: the bicycle identity and silhouette are preserved, the supplied product is scene-matched without generative redrawing, desktop/mobile design QA passes, the consent notice dismisses reliably, all 18 automated tests pass, Amplify job 398 succeeded, and the public domain serves the verified assets with zero browser console errors.

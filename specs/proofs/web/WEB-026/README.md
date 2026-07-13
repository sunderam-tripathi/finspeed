# WEB-026 Proof — Fully generated Mako hero and viewport-fit campaign

## Outcome

The homepage now uses complete generated desktop and mobile campaign photographs. The bicycle and alpine environment are rendered together; the final v4 assets do not overlay or upscale the low-resolution product cutout. At the 2048 × 990 reference content viewport, the 96px header, 744px hero, and 136px terrain strip end at y=976, so the complete hero and all terrain destinations are visible before the fold.

RESULT (local): PASS
RESULT (production): PENDING DEPLOYMENT

## Source and generated assets

- User-observed failure: `artefacts/source/production-failure.png`
- Viewport-normalized failure: `artefacts/source/production-failure-content-2048x990.png`
- Product cue reference: `artefacts/source/mako-shark-reference.png`
- Generated desktop source (1672 × 941): `artefacts/design/mako-shark-hero-v4-desktop.png`
- Generated mobile source (1122 × 1402): `artefacts/design/mako-shark-hero-v4-mobile.png`
- Shipped desktop WebP: `apps/web/public/assets/campaign/mako-shark-hero-v4.webp`
- Shipped mobile WebP: `apps/web/public/assets/campaign/mako-shark-hero-v4-mobile.webp`

The generated sources were opened at original resolution. The bicycle has two circular wheels, coherent frame/fork alignment, plausible brakes/drivetrain, sharp spoke and tire detail, an accurate visible FINSPEED down-tube wordmark, consistent scene lighting, and direct contact shadows. No cutout halo or bright studio floor remains.

## Browser evidence

- Desktop 1920 × 990: `artefacts/local/desktop-1920x990.png`
- User-sized desktop 2048 × 990: `artefacts/local/desktop-2048x990-final.png`
- Mobile 390 × 844 before crop correction: `artefacts/local/mobile-390x844.png`
- Mobile 390 × 844 after correction: `artefacts/local/mobile-390x844-final.png`

All four captures were opened and visually inspected. The final 2048px desktop capture keeps the full bicycle, copy, CTA, price, technical rail, and three terrain destinations in view. The final phone capture retains the complete bicycle horizontally without page overflow.

Primary interaction checks in the in-app browser:

- “Shop the fleet” → `/shop`, heading `Shop all cycles`
- “View Mako Shark details” → `/products/mako-shark`, heading `Mako Shark`
- Brand control → `/`, heading `Ride Beyond Boundaries`
- Console entries after the flow: none

## Design QA

- Full-view comparison: `artefacts/design/comparison-full-pass1.png`
- Focused bicycle comparison: `artefacts/design/comparison-bike-pass1.png`
- Project report: `design-qa.md`
- Final result: passed

The focused comparison confirms the correction to edge sharpness, natural lighting, tire grounding, scene coherence, and mechanical detail. The full-view comparison confirms the viewport-fit correction.

## Automated verification

- ESLint: `logs/lint.log` — exit 0
- Next production build: `logs/build.log` — exit 0
- Playwright: `logs/playwright.log` — 18 passed
- Targeted axe retry after light-panel token correction: `logs/a11y.log` — 1 passed
- Parity state: `logs/parity-state.json` — governed state `running`
- Docker status attempt: `logs/docker-compose-ps.txt` — host CLI unavailable; limitation recorded rather than hidden

## Acceptance review

- [x] Complete generated desktop and mobile photographs used
- [x] No low-resolution cutout pixels used in the final hero assets
- [x] Bicycle sharp, plausible, fully visible, and naturally integrated
- [x] Desktop header + hero + terrain strip fit the reference viewport
- [x] Mobile art direction avoids horizontal bicycle clipping
- [x] Core navigation and conversion paths work
- [x] Browser console clean
- [x] Accessibility, lint, build, and 18-test browser suite pass
- [x] Side-by-side design QA passes
- [ ] Amplify production deployment verified

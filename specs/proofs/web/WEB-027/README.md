# WEB-027 Proof — Brand-led Quiet Summit homepage hero

## Outcome

The homepage now opens with one continuous, high-resolution rider-at-summit photograph instead of an enlarged product cutout. The product price and technical specification rail have been removed from the permanent brand hero. The headline, primary CTA, and terrain destinations remain responsive live UI.

RESULT (local): PASS
RESULT (production): PENDING

## Source and generated assets

- Selected direction: `artefacts/source/selected-quiet-summit.png`
- Generated clean desktop source: `artefacts/design/quiet-summit-clean-desktop.png`
- Generated clean mobile source: `artefacts/design/quiet-summit-clean-mobile.png`
- Shipped desktop WebP: `apps/web/public/assets/campaign/quiet-summit-hero.webp` — 2880 × 1801, 374,568 bytes
- Shipped mobile WebP: `apps/web/public/assets/campaign/quiet-summit-hero-mobile.webp` — 1440 × 1920, 280,358 bytes

Both generated sources were opened at original resolution. The photograph contains the rider, bicycle, terrain, and contact lighting in one rendered scene; no separately enlarged product extraction, CSS shadow, or matte halo is used.

## Local browser evidence

- Desktop pass 1: `artefacts/local/desktop-1586x992-pass1.png`
- Desktop final: `artefacts/local/desktop-1586x992-pass2.png`
- Mobile pre-header correction: `artefacts/local/mobile-390x844-pass1.png`
- Mobile final: `artefacts/local/mobile-390x844-final.png`

At 1586 × 992, the 82px header, 752px hero, and 152px terrain strip end at y=986.5 with no horizontal page overflow. At 390 × 844, the compact 115px header and 720px hero end at y=834.8, with the terrain strip beginning at the viewport boundary.

Primary interaction checks in the in-app browser:

- “Find your ride” → `/shop`, heading `Shop all cycles`
- Mountain terrain destination → `/shop?category=mountain`, Mountain filter pressed, five matching cycles
- Consent acceptance dismisses the banner and persists for the session
- Browser console entries after the flow: none

## Design QA

- Full-view normalized comparison: `artefacts/design/comparison-full-pass2.png`
- Focused photographic comparison: `artefacts/design/comparison-subject-pass2.png`
- Project report: `design-qa.md`
- Final result: passed

The focused comparison confirms natural integration, usable bicycle detail, consistent scene lighting, direct rider/bicycle contact, and the absence of the pixelated cutout edge. The full-view comparison confirms campaign hierarchy and viewport fit.

## Automated verification

- ESLint: `logs/lint-final.log` — exit 0, 41 pre-existing warnings, 0 errors
- Next production build: `logs/build-final.log` — exit 0
- Playwright: `logs/playwright.log` — 18 passed, including accessibility audit
- Parity state: `logs/parity-state.json` — governed state `running`
- Docker status attempt: `logs/docker-compose-ps.txt` — host CLI unavailable; limitation recorded rather than hidden

## Production release

- Git implementation commit: pending
- Pushed branch: `origin/main`
- Amplify application: `d2h8tz7elv2xy8`
- Amplify branch: `main` (`PRODUCTION`)
- Region: `ap-south-1`
- Release job: pending
- Public URL: `https://www.finspeed.online/`

## Acceptance review

- [x] Brand-led rider story replaces the single-SKU product promotion
- [x] Complete desktop and mobile photographs replace the enlarged product cutout
- [x] Product price and specification rail removed from the homepage hero
- [x] Desktop hero and terrain strip fit the selected reference viewport
- [x] Dedicated mobile art and compact navigation fit the phone viewport
- [x] Core CTA and terrain navigation paths work
- [x] Browser console clean
- [x] Lint, build, accessibility, and 18-test browser suite pass
- [x] Same-viewport design QA passes
- [ ] Amplify production deployment verified
- [ ] Slice parked to `IDLE` with no managed dev server left running

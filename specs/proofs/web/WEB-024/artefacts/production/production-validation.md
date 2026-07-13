# Production validation

## Deployment

- Commit: `6d293a7a26b2452754b0ebbbe7803ec4724daca3`
- Amplify app: `d2h8tz7elv2xy8`
- Branch: `main`
- Job: `397`
- Status: `SUCCEED`
- Started: 2026-07-13 19:22:50 +05:30
- Ended: 2026-07-13 19:26:15 +05:30

## Asset delivery

- `https://www.finspeed.online/assets/campaign/mako-shark-hero-v2.webp` -> HTTP 200, 1,775,076 bytes
- `https://www.finspeed.online/assets/campaign/mako-shark-hero-v2-mobile.webp` -> HTTP 200, 1,313,298 bytes

## Desktop layout at 1920 x 990

- Hero: y=96, height=820, bottom=916
- Title: y=228, height=287, bottom=514
- Commerce row: y=673, height=97, bottom=770
- CTA: y=686, height=72, bottom=758
- Product summary/price: y=673, height=97, bottom=770
- Specification rail: y=152, height=600, bottom=752
- Selected background asset: `mako-shark-hero-v2.webp`

The CTA, price, title, and rail are within the visible 990 px viewport and above the analytics notice. No hero control overlaps the specification rail.

## Mobile layout at 390 x 844

- CSS viewport: 390 x 844
- Document scroll width: 375 px (browser scrollbar accounts for the remaining width; no horizontal overflow)
- Hero height: 760 px
- Selected background asset: `mako-shark-hero-v2-mobile.webp`

## Live interactions

- Featured Mako summary -> `https://www.finspeed.online/products/mako-shark`
- Shop navigation -> `https://www.finspeed.online/shop`
- Browser console error entries after the production interaction pass: 0

RESULT production-validation: PASS

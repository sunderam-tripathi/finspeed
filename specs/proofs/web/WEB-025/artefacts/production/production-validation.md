# Production validation

## Deployment

- Release commit: `7651b5388bad88100b387841b0a7f364cba150de`
- Amplify app: `d2h8tz7elv2xy8`
- Branch: `main`
- Job: `398`
- Status: `SUCCEED`
- Started: 2026-07-13 20:47:09 +05:30
- Ended: 2026-07-13 20:50:54 +05:30

## Asset delivery

- `https://www.finspeed.online/` -> HTTP 200, 12,431 bytes
- `https://www.finspeed.online/assets/campaign/mako-shark-hero-v3.webp` -> HTTP 200, 313,178 bytes
- `https://www.finspeed.online/assets/campaign/mako-shark-hero-v3-mobile.webp` -> HTTP 200, 270,320 bytes

## Desktop at 1920 × 990

- Hero height: 820 px
- Terrain strip top: y=916
- Document scroll width: 1,905 px for a 1,920 px viewport; the browser scrollbar accounts for the remainder.
- Selected art: `mako-shark-hero-v3.webp`
- Console errors: 0

The title, description, CTA, price, bicycle, and four-item specification rail are visible and separated. The bicycle has compatible light, edge treatment, ground perspective, and wheel contact.

## Mobile at 390 × 844

- Hero height: 760 px
- Copy bottom: y=597.24
- Document scroll width: 375 px for a 390 px viewport; the browser scrollbar accounts for the remainder.
- Selected art: `mako-shark-hero-v3-mobile.webp`
- Console errors: 0

The copy and commerce block end before the product focal area, the bicycle uses the dedicated mobile art direction, and there is no horizontal overflow.

## Consent and navigation

- Fresh Amplify branch origin: consent notice visible before choice.
- Accept: notice hidden immediately.
- Reload: notice remains hidden.
- Public Shop CTA: `https://www.finspeed.online/shop`; heading `Shop all cycles` present.
- Browser console errors after production interactions: 0.

RESULT production-validation: PASS

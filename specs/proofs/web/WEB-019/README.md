# Proof — WEB-019 (Sitewide light theme)

## Scope
- Introduce a sitewide light/dark theme system with system-preference default and user override.
- Roll out semantic `fs-*` tokens across key SCN surfaces (home shell, blog, dealers, support, consent banner, dealer map).
- Expose an accessible theme toggle alongside the bilingual locale switch on primary pages.

## Implementation Notes
- Added a client `ThemeProvider` (`apps/web/src/components/theme-provider.tsx`) that seeds from a server-safe dark default, hydrates to the stored/system preference, writes `data-theme` + `color-scheme`, and persists the choice in `localStorage` (`finspeed-theme`).
- Introduced a shared `SiteHeader` (nav + locale + theme toggle) across marketing surfaces (home, blog, dealers, support, brand story, testimonials); removed duplicate banner landmarks.
- Extended `globals.css` with paired dark/light tokens for surfaces, text, glass, gradients, shadows, and light overrides for muted text contrast.
- Converted hero wrappers to labeled regions (`section` + `aria-labelledby`), restored gradient/noise textures, and replaced hard-coded colors with semantic tokens across dealer cards/map, support/FAQ tiles, and landing/blog cards.

## Validation
- Parity stack: `node tools/dev/parity-stack.mjs ensure`.
- Lint: `npm --workspace apps/web run lint` → PASS.
- Playwright/axe: `WEB_E2E_PORT=3431 npm --workspace apps/web run test -- --timeout=80000 --workers=1` → PASS (SCN-001/004/005/006/007/008 + outage analytics + axe).
- Parity screenshots captured: `artefacts/parity-home.png`, `artefacts/parity-dealers.png`, `artefacts/parity-blog.png`, `artefacts/parity-support.png` (docker web @127.0.0.1:3430).

## Result
- RESULT: PASS
- Notes:
  - Light/dark tokens now drive all marketing surfaces with hydrated theme toggle + locale switch in the shared header.
  - Landmark/hydration issues resolved (single banner, `html` suppression), axe clean on dealer locator.
  - Production screenshots not captured in this session (no production endpoint provided). 

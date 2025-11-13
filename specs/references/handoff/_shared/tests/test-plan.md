# Test Plan — Finspeed Web

## Strategy
- Prioritize automated end-to-end coverage for critical user journeys using Playwright.
- Run tests on pull requests (CI) and nightly against staging build.
- Use Lighthouse CI for performance budgets (see `NFR-002`).

## Test Types
- **E2E smoke (Playwright)**: navigation, language toggle, catalog filtering/comparison, model detail, dealer locator, brand story, testimonials carousel, blog subscription, support CTAs.
- **Accessibility audit**: axe-core via Playwright on home, catalog, dealer, blog pages.
- **Performance audit**: Lighthouse CI thresholds as defined in `NFR-002`.
- **Analytics contract & consent**: Validate GA4 payloads against `../_shared/events/site.interaction.analytics.v1.json` + rules in `../_shared/contracts/site-interaction-ga4.md`, using fixtures + GA4 DebugView; assert events fire only after consent flag.

## Environments
- `staging` (Vercel preview / Netlify deploy preview) — runs automated suites.
- `production` — smoke tests triggered post-deploy.

## Ownership
- Automated tests owned by frontend dev team.
- Product owner reviews weekly GA4 reports for success metrics.

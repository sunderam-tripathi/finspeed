# Runbook — SCN-006 Testimonials

## Deploy
- Validate TESTIMONIAL-001 dataset and image assets.
- Run Playwright `TST-E2E-007` focusing on carousel interactions and accessibility.
- Enable `testimonials.enable` flag on pages (home/catalog/brand) and deploy static build.

## Rollback
- Disable `testimonials.enable` flag to hide carousel and show static quote fallback.
- Revert testimonial JSON to prior version if data issue.
- Clear CDN caches for sections embedding the carousel.

## First response
- **Autoplay bugs**: Toggle autoplay off globally via feature flag, capture console errors, and coordinate fix.
- **Broken media**: Swap failing asset references in dataset and purge CDN path.
- **Analytics drop**: Inspect consent manager + GA4 debug; ensure event queue flushes on route change.

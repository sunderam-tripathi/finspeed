# Runbook — SCN-005 Brand story

## Deploy
- Confirm BRAND-001 content passes schema validation and localized MDX renders without build warnings.
- Run Playwright `TST-E2E-007` and Lighthouse SEO audit to ensure structured metadata present.
- Enable `brandStory.enable` feature flag and deploy static build.

## Rollback
- Disable `brandStory.enable` flag and redeploy last known good assets.
- Restore previous MDX commit if storytelling content introduced layout regressions.
- Update navigation to hide `/brand-story` link if removal needed.

## First response
- **Translation drift**: Compare MDX diff, escalate to marketing to patch missing Hindi copy; redeploy after fix.
- **Broken media**: Replace missing assets in `assets/brand-story/` and purge CDN path.
- **Counter malfunction**: Disable animation flag and capture console errors; ensure metrics displayed as static values.

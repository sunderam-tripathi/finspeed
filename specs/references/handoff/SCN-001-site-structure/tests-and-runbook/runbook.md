id: RUN-001
title: Finspeed site launch & health checks
last_reviewed: 2025-11-03
status: Ready
owner: Finspeed Product Owner

## Pre-deploy checklist
- Verify latest content translations in `public/locales/en|hi` are complete.
- Run `npm run test:e2e` (Playwright) ensuring TST-E2E-001…007 pass.
- Execute Lighthouse CI; confirm metrics within `NFR-002` budgets.
- Validate structured data via Google Rich Results Test for one model page.
- Confirm Formspree endpoint set via `FORMSPREE_ENDPOINT` env var.
- Clear caches and re-run nav snapshot test to ensure `IC-6` and `IC-8` match frozen contracts.

## Post-deploy (production)
- Trigger smoke tests (`npm run test:e2e -- --project=production`).
- Spot-check GA4 debug view for `site.interaction.analytics.v1` events.
- Validate locale toggle writes cookie only when consent present.
- Ensure sitemap and robots accessible.
- Verify legal pages load and footer links present.

## Weekly monitoring
- Review GA4 weekly email summary (directions, support, subscription events).
- Check Formspree submission quota usage.
- Confirm dealer directions clicks ≥ 100/month (rolling 30 days).
- Inspect accessibility scan reports; address new issues.

## Incident response
- If Formspree quota exceeded, upgrade plan or temporarily disable form with notice.
- If GA4 events missing for >1 hour, roll back to last working deploy (see `../_shared/runbooks/deployment-spec.md`).
- If locale warnings appear in logs (`i18n-miss`), notify content owner and patch within 1 business day.
- Document issues in incident log and schedule fix follow-up.

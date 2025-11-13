# Runbook — SCN-007 Blog

## Deploy
- Validate BLOG-001 content and rebuild static pages; ensure drafts excluded.
- Run Playwright `TST-E2E-005` and Lighthouse SEO checks (structured data, crawl budget).
- Configure Formspree endpoint + environment, deploy static build, and update sitemap.

## Rollback
- Revert blog content commit or disable blog route via redirect to `/`.
- Disable subscription banner flag to remove Formspree dependency.
- Purge CDN caches for `/blog*` routes to serve prior snapshot.

## First response
- **Broken article**: Identify slug via GA4 or Sentry, revert MDX or patch content quickly and redeploy.
- **Formspree outage**: Hide banner and surface support email fallback; notify marketing.
- **Analytics gap**: Confirm consent manager, check GA4 debug, and ensure `blog_article_read` timer not throttled by browser policies.

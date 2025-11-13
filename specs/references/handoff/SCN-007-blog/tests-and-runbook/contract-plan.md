# Contract Test Plan — SCN-007

- **Content**: Validate BLOG-001 front-matter via `contracts/blog-post.schema.json`; ensure only `status: published` posts ship.
- **UI**: Component tests for `IC-15` verifying tag filters, pagination/infinite scroll, subscription banner states, article TOC highlighting.
- **Events**: GA4 stub tests for `blog_tag_filter`, `blog_article_read`, `blog_subscription_banner` payloads (tag, result_count, read_percent, slug, action).
  - Reference: `../_shared/contracts/site-interaction-ga4.md`.
  - Playwright GA4 fixture posts consented events + captures DebugView screenshot before release.
- **Form**: Reuse IC-7 contract tests to ensure hashed emails + consent gating before posting to Formspree.

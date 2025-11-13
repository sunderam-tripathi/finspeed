# Frozen Contracts — SCN-007

| Contract | Purpose | Notes |
|----------|---------|-------|
| IC-15-blog-experience.md | Defines listing/article UX, analytics, subscription banner placements | Mirrors `61-interfaces/ui-forms/blog-experience.md`; Frozen v1.0. |
| IC-7-formspree-submission.md | Newsletter subscription form contract (shared) | Same as `61-interfaces/http-openapi/formspree-submission.md`; ensures payload hashing + consent notes. |
| blog-post.schema.json | Validates BLOG-001 front-matter (slug, tags, publish date, status) | Enforced in content pipeline before build. |

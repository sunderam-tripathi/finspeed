# SCN-007 / REQ-007 — Blog experience

## Outcome (why)
Deliver discoverable, bilingual blog content that keeps riders engaged and captures subscriptions.

## Scope (this slice)
- In: Blog listing page, tag filters, article view with table of contents, subscription banner (`IC-7`), JSON-LD, analytics.
- Out: CMS integration, RSS feed automation, comment system.

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-15 | ui | Blog listing + article experience | contracts/IC-15-blog-experience.md | v1.0 | Selecting tag `Tech` filters listing and emits `blog_tag_filter` |
| IC-7 | http | Newsletter subscription submission (shared) | contracts/http-openapi/service.openapi.yaml* | v1 | `POST https://formspree.io/...` with hashed email |

## Acceptance checks
```gherkin
Scenario: Blog listing shows featured story and latest articles
Scenario: Tag filters refine articles without reload
Scenario: Article page renders table of contents and reading time
Scenario: Subscription banner posts via Formspree and shows confirmation
Scenario: Article structured data validates against schema.org BlogPosting
```

## Non-functional & security
- p95 TTFB ≤ 400ms on CDN, LCP ≤ 2.8s on article view, incremental static regeneration within 60s of new post.
- Subscription banner logs hashed emails only, respecting consent.
- Markdown sanitized to block script injection; external embeds behind consent gate.

## Rollout/rollback
- Rollout: Validate BLOG-001 front-matter, run Playwright `TST-E2E-005`, publish sitemap updates, enable `blog.enableSearch` if stable.
- Rollback: Revert blog MDX commit, disable subscription banner via flag, clear CDN caches for blog routes.

## Links
- RFC (Accepted): 40-decisions/RFC-001-site-architecture.md
- Traceability: traceability/requirements-to-design.md (REQ-007 row)
- Design tag: contents of `TAG.txt`

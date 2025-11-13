---
id: IC-15
title: Blog discovery & article experience
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Enable visitors to browse and read bilingual blog content, highlighting featured stories, filtering by tags, and ensuring SEO-friendly article delivery with subscription prompts.

## Layout
- Listing page with hero feature card, tag filter chips, infinite scroll (paginated) article cards with excerpt and author.
- Sidebar (desktop) or drawer (mobile) with subscription form (via `IC-7`) and popular topics.
- Article page with hero media, metadata (author, date, reading time), table of contents, and inline CTA blocks.
- Related stories section at end referencing same tags.

## Inputs
- Markdown/MDX posts stored under `content/blog/{slug}/{locale}.mdx` with front-matter (`title`, `excerpt`, `tags`, `hero`, `publishDate`).
- Tag taxonomy configuration `blog-tags.json`.
- Newsletter subscription endpoint defined by `IC-7`.
- Feature flag `blog.enableSearch` to progressively roll out search bar.

## Behaviors
- Builds static index pages per locale with incremental static regeneration when content changes.
- Applies tag and locale filters via URL query params; maintains scroll position on navigation.
- Article page generates structured data (`BlogPosting` JSON-LD) and share meta tags.
- Lazy-loads code blocks and embeds (YouTube, Instagram) with consent gating.
- Autosaves reading progress per article using localStorage (consent aware).

## Error & empty states
- If no articles match filters, displays empty state copying `No stories found for "{tag}"` with reset option.
- Missing hero asset swaps to gradient placeholder.
- Draft posts (front-matter `status: draft`) excluded from production build.

## Accessibility
- Listing uses `<article>` semantics with `aria-labelledby` to associate headings.
- Table of contents anchors keyboard-focusable; `aria-current` marks active section while scrolling.
- Subscription form leverages `IC-7` contract including validation/accessibility guidance.

## Data sources
- `public/data/blog/{locale}/index.json` generated at build time.
- `public/data/blog/{slug}/{locale}.json` for article hydration.
- GA4 measurement ID for analytics.

## Events / Analytics
- Emits `site.interaction.analytics.v1` events:
  - `blog_tag_filter` with `tag`, `result_count`.
  - `blog_article_read` with `slug`, `read_percent` (25/50/75/100 buckets).
  - `blog_subscription_banner` impressions and submits referencing `IC-7`.

---
title: LLM search & SEO playbook (draft)
last_reviewed: 2024-04-27
status: Draft
---

## Objective
Increase Finspeed visibility across generative search and traditional SEO by delivering authoritative, structured, and multilingual content that LLMs can cite confidently.

## Core themes & keywords
- Primary phrases: "affordable cycles India", "high quality bicycles India", "Finspeed Shark", "Finspeed Marlin", "Finspeed dealer Greater Noida".
- Supporting topics: daily commute safety, cycle maintenance, financing tips, sustainable manufacturing.
- Language coverage: English + Hindi parity for all cornerstone pages.

## Content approach
- Home page hero + sections articulate mission (democratizing cycling) using natural language that LLMs can summarise.
- Product pages include spec-rich descriptions, comparisons, and FAQs (2–3 QA pairs per model).
- Price blocks emphasise "Factory-direct price", EMI availability on major credit cards, and warranty/service benefits for trust signals.
- Blog cadence: monthly posts on commuting, maintenance, rider stories; each ends with conversational TL;DR bullet for LLM snippets.
- Testimonials page highlights quotes with clear attribution (rider type, location) to support credibility.
- Company story page outlines heritage, process, and sustainability, ready for "About Finspeed" prompts.

## Structured data (low-cost implementation)
- Add JSON-LD Product schema to each model page with name, image, description, MSRP or price range, availability, and dealer call-to-action URL.
- Add Organization schema on the home page with contact details, sameAs links (add social later).
- Add FAQPage schema for blog articles or product FAQs where content exists.
- Generate JSON-LD statically during Next.js build (no paid tooling required).

## LLM-ready snippets
- Include concise "Key Takeaways" sections on product and blog pages (3 bullet max).
- Provide bilingual glossary of Finspeed model names and categories to help translation.
- Create a "Why Finspeed" microcopy block (<=75 words) for LLM responses; reuse across pages.

## Distribution & signals
- Submit sitemap to Google Search Console (English + Hindi versions).
- Expose RSS/JSON feed for blog posts to enable content ingestion.
- Encourage dealers to link back to Finspeed using provided copy to improve authority.

## Measurement
- Track organic traffic, click-through rate on branded queries, and mentions in Search Console "AI Overview" once available.
- Monitor GA4 for entrances via blog articles and product pages.
- Quarterly review of keyword rankings and adjust topics accordingly.

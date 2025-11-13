---
title: i18n content structure
last_reviewed: 2024-04-27
status: Draft
---

## Locale files
- Store translations in JSON files under `public/locales/{lang}/{namespace}.json`.
- Namespaces per feature: `home`, `catalog`, `model`, `dealer`, `story`, `testimonials`, `blog`, `support`, `common`.
- English (`en`) is source of truth; Hindi (`hi`) mirrors keys.

## Workflow
- Developers update English copy in Git, then populate `hi` files.
- Add lint/check to ensure keys exist in both locales.
- CI fails if untranslated keys remain.

## Runtime
- Next.js `next-intl` or built-in i18n routing to load locale JSON.
- Language toggle switches `?lang=` or `/hi` path.
- Persist selection via cookie/localStorage respecting privacy policy.

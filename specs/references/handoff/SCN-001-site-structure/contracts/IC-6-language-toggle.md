---
id: IC-6
title: Language toggle component
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-03
---

## Purpose
Allow visitors to switch between English (`en`) and Hindi (`hi`) locales from the site header.

## Inputs
- Default locale: `en`.
- Browser preference (`Accept-Language` header).
- Persisted choice (cookie `locale=hi|en`, 180-day TTL) only after consent banner accepted.

## States
- Dropdown (or segmented control) showing `English / हिन्दी`.
- Selected state highlighted via accent color.

## Behaviors
- On selection, updates locale-aware route (`/hi/...`) without full reload using Next.js router.
- Falls back to English string if requested key missing and logs `console.warn('i18n-miss', key)`.
- Persists choice to cookie/localStorage only if user granted consent; otherwise session-only.
- Announces change to screen readers via `aria-live="polite"` region stating `"Language changed to Hindi"` etc.

## Data sources
- Reads translation keys from `public/locales/{locale}/common.json`.

## Events / Analytics
- Emits `site.interaction.analytics.v1` with `event_name=language_change`, `from_locale`, `to_locale`, `consent_granted` boolean.

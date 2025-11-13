---
title: Deployment spec — Finspeed Next.js site
last_reviewed: 2025-11-05
status: Ready
---

## Overview
- Framework: Next.js (app router) with static export (`next export`) to keep runtime dependency-free.
- Hosting: Vercel production project (`finspeed-marketing`) with matching staging preview; Netlify retained only as contingency.
- Repository: `github.com/finspeed/site` (private) mirrored from this requirements repo’s handoff tag `design-0.1-*`.
- Branch strategy: `main` → production, `preview/*` feature branches → Vercel previews. Merge to `main` gated by Build-Ready assets in this repo.

## Build pipeline
1. Push to any branch triggers GitHub Actions workflow `ci.yml`.
2. Workflow steps:
   - `npm ci`
   - `npm run lint` + `npm run test:e2e -- --project=ci`
   - `npm run build && npm run export`
   - Archive static export (`out/`) and publish build artefact.
3. Successful `main` build triggers Vercel production deployment via deploy hook.
4. Preview deploys use the same workflow but target Vercel preview environment; blocked from promoting if acceptance checklist fails.

## Environments
| Environment | URL | Source branch | Notes |
|-------------|-----|---------------|-------|
| Preview      | auto-generated Vercel preview URLs | `preview/*`, PR branches | QA verifies acceptance scenarios before merge. |
| Staging      | `https://staging.finspeed.online`  | `release/*` (optional)   | Used for stakeholder sign-off when required. |
| Production   | `https://www.finspeed.online`      | `main`                   | Mirrors artefacts from accepted Build-Ready tag. |

## Environment variables
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID (stored in Vercel Project → Environment Variables).
- `FORMSPREE_ENDPOINT` — secure URL per `20-requirements/data/subscription-config.yaml`; rotate quarterly or on Formspree key reset.
- `SITE_DEFAULT_LOCALE` — `en`.
- `SUPPORTED_LOCALES` — `en,hi`.
- `STATUS_BANNER_URL` — optional JSON feed powering support incident banner.

## Responsibilities
- Deployment owner: Finspeed Product Owner (approves promotion to production, ensures `RUN-001` executed).
- Frontend Engineering: maintain build pipeline, keep contracts/tests in sync, coordinate translations.
- Analytics Engineer: monitors GA4 instrumentation & consent gating each release.
- No runtime auth; access control limited to GitHub, Vercel, and Formspree credentials (see `../_shared/infra/secrets-handling.md`).

## Promotion flow
1. Confirm latest tag (e.g., `design-0.1-REQ-008`) assembled in `handoff/`.
2. Run `RUN-001` pre-deploy checks on preview/staging.
3. Product Owner approves PR merge → GitHub Actions pipeline runs.
4. Verify Vercel deployment health, GA4 DebugView, and Lighthouse reports.
5. Announce release in stakeholder channel with links to handoff pack and monitoring dashboards.

## Release checklist
- [x] Lighthouse CI passing performance budgets (`tests-and-runbook/load-plan.md`).
- [x] GA4 events verified (dealer directions, support clicks, support hub interactions).
- [x] Formspree endpoint tested with non-production payload (hash-only email).
- [x] Content reviewed in English & Hindi by Marketing approver.
- [x] Legal pages accessible from footer (`20-requirements/data/terms-of-use.md`, `20-requirements/data/privacy-policy.md`).
- [x] Support incident banner + status feed validated (if enabled).

## Rollback
- Use Vercel Deployment history to promote last known-good build (retains prior 10 deploys).
- If configuration regression (env var) caused the issue, reset to previous secret version and redeploy.
- Maintain offline backup of `out/` artefact for each release in secure storage; restore by uploading via Vercel CLI if dashboard unavailable.
- Document trigger, impact, and resolution in `67-runbooks/incident-playbook.md` and update `PROGRESS.md`.

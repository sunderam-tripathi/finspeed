# DR & BCDR Plan — Finspeed Marketing Site

## Scope & Assumptions
- Static Next.js export hosted on Vercel with CDN-backed edge network.
- Source of truth for content (catalog, dealers, blog, brand story) lives in Git (`20-requirements/data/*` + CMS content folders) with reviews in GitHub.
- Third-party services: GA4 analytics, Formspree contact/subscription forms, GeoJSON tile service (OpenStreetMap).

## Recovery Objectives
| Asset | RTO | RPO | Notes |
|-------|-----|-----|-------|
| Public site availability | 30 minutes | 15 minutes | Achieved by redeploying previous artefact via Vercel CLI or dashboard. |
| Content datasets (`product-catalog.csv`, dealer/contact YAML, MDX content) | 2 hours | < 1 commit | Git history provides immutable backup; restore by reverting commit or cherry-picking. |
| Formspree submissions export | 4 hours | 24 hours | Export daily CSV from Formspree dashboard; stored in secure shared drive. |
| Analytics configuration (GA4 custom dimensions) | 1 business day | 1 day | Configuration snapshot stored in `../_shared/events/ga4-dimension-setup.md`. |

## Backups & Replication
- **Static artefacts.** Each production deployment archives `out/` bundle to secure cloud storage (`s3://finspeed-handoff/releases/<tag>.zip`), encrypted with SSE-S3. Retain last 10 releases + quarterly snapshot.
- **Content.** GitHub repository replicates to secondary remote (`git@gitlab.com:finspeed/site-mirror.git`) nightly via scheduled action.
- **Secrets.** Stored in 1Password vault (`Finspeed Marketing`) with version history and audit log; export discouraged, but emergency CSV escrow encrypted using PGP is held by CTO.
- **Form submissions.** Daily automation pulls CSV via Formspree API token and stores in encrypted S3 bucket with 30-day retention; long-term archival after consent review handled by marketing ops.

## Failover & Rollback
1. Detect outage via uptime monitor alert (see `66-observability/alerts.md`).
2. Evaluate scope: if build regression, promote previous Vercel deployment; if platform outage, shift DNS CNAME to Netlify contingency project (`finspeed-netlify-backup`) hosting last known-good artefact.
3. Validate site functionality via `RUN-001` smoke steps.
4. Announce status in #finspeed-status Slack channel and update support incident banner.

## DR Testing Cadence
- **Quarterly.** Execute tabletop exercise: simulate Vercel outage, perform DNS swing to Netlify, restore within 30 minutes, record findings in `67-runbooks/incident-playbook.md`.
- **Semi-annual.** Full restore test: delete production deployment, redeploy from archived artefact, verify GA4 + Formspree integration.
- Log outcomes and remediation tasks in `PROGRESS.md` under Readiness summary notes.

## Roles & Contacts
- Incident commander: Product Owner (backup: Engineering Lead).
- DNS access: Ops Engineer (Cloudflare account).
- Secret escrow custodian: CTO.

## Review & Continuous Improvement
- Revisit plan whenever new third-party dependency added or major traffic change expected.
- Update RTO/RPO table after each exercise with real performance numbers.

# Secrets Handling — Finspeed Marketing Site

## Storage & Access
- Primary vault: 1Password Business → Vault `Finspeed Marketing`.
- Backup: Vercel project-level environment variable store (production/staging separately). Values pulled from 1Password via CLI during CI deployment; no manual entry except initial bootstrap.
- Access granted to: Product Owner, Frontend Engineering Lead, Analytics Engineer, Ops Engineer. All access requires SSO + 2FA; changes logged automatically.

## Secret Inventory
| Secret | Purpose | Owner | Rotation cadence |
|--------|---------|-------|------------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 instrumentation | Analytics Engineer | Annual or on GA property change |
| `FORMSPREE_ENDPOINT` | Support/contact form submission URL | Product Owner | Quarterly or when Formspree key rotated |
| `STATUS_BANNER_URL` | Optional support incident feed endpoint | Ops Engineer | When endpoint changes |
| `MAP_TILE_API_KEY` (reserved) | Future map provider key if Leaflet tiles require auth | Ops Engineer | Per provider policy |
| Vercel deploy hook token | CI → Vercel production promotion | Frontend Engineering Lead | 6 months or personnel change |

## Rotation Procedure
1. Owner updates value in 1Password vault, adding context note + expiry.
2. Notify engineering in #finspeed-infra channel; schedule deployment window if change impacts runtime.
3. Update Vercel env vars via CLI (`vercel env pull`) or dashboard; ensure preview/staging/production all updated.
4. Trigger smoke deployment to confirm secret usage (Playwright scenario + GA4 DebugView).
5. Document rotation timestamp in `PROGRESS.md` under relevant requirement row.

## Onboarding & Offboarding
- Onboarding: Product Owner submits access request; Ops Engineer grants 1Password vault access and Vercel role. New members must review this document and `../_shared/runbooks/deployment-spec.md` before receiving credentials.
- Offboarding: Immediately revoke 1Password + Vercel access, rotate any secrets the individual had access to, and log completion in `71-governance/approval-matrix.md` audit section.

## Incident Response
- If secret suspected compromised:
  1. Rotate secret immediately following procedure above.
  2. Invalidate cached deployments (Vercel redeploy) to ensure new secret active.
  3. Update `67-runbooks/incident-playbook.md` with root cause and mitigation.
  4. If user data potentially exposed (Formspree), coordinate disclosure per privacy policy.

## Prohibitions
- Never embed secrets in the repository, static config files, or client-side code.
- Do not transmit secrets via email, chat DMs, or ticket comments; use 1Password secure sharing.

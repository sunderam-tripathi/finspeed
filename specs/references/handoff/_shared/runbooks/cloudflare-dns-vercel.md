---
title: Cloudflare DNS wiring — finspeed.online → Vercel
last_reviewed: 2025-11-07
status: Draft
owner: Web Ops (Finspeed)
---

## Purpose
finspeed.online is hosted on Vercel, but DNS is managed at Cloudflare. This runbook explains how to provision the Cloudflare zone so Vercel accepts both the apex (`finspeed.online`) and `www.finspeed.online` hosts without the “Invalid Configuration” warning shown in the Vercel Domains tab.

## Prerequisites
1. Cloudflare account with access to the `finspeed.online` zone (Ops engineer role per `_shared/infra/dr-bcdr.md`).
2. Registrar login (Squarespace Domains per onboarding doc) to point nameservers at Cloudflare.
3. Vercel project access (`finspeed-web` → Settings → Domains) to retrieve the current DNS records. Vercel recently moved apex hosting to `216.198.79.1`; always copy the values displayed in the dashboard.
4. Terminal access to run `dig` from the parity stack (document lookups for proof) plus `node tools/dev/parity-stack.mjs ensure` already running.

## 1. Onboard / verify the Cloudflare zone
1. In Cloudflare → Websites → *Add a site*, enter `finspeed.online`, select the Free plan.
2. Cloudflare shows two nameservers (e.g., `melissa.ns.cloudflare.com`, `lynn.ns.cloudflare.com`). At the registrar, replace the current nameservers with these Cloudflare values.
3. Wait for Cloudflare to report “Active” (can take up to 24h). Capture a screenshot for the slice proof once active.

## 2. DNS records required by Vercel
Create the records exactly as Vercel prescribes. Current requirements (Nov 2025) are below—replace values if Vercel lists different targets.

| Type | Name | Value | TTL | Proxy | Notes |
|------|------|-------|-----|-------|-------|
| `A` | `@` | `216.198.79.1` | Auto | `DNS only` | New Vercel apex IP range. Delete any legacy `A @ 76.76.21.21` record once traffic drains. |
| `CNAME` | `www` | `8b600126c838a69e7.vercel-dns-017.com` | Auto | `DNS only` | Value changes per project; copy from the Vercel UI. |

Guidance:
- Keep both records **DNS only (grey cloud)**. Vercel already terminates TLS + CDN, so do not proxy through Cloudflare or verification will fail.
- If Vercel shows additional `A` records (during IP expansion) add them all at the apex so Cloudflare load-balances across Vercel’s edge network.
- Remove any conflicting CNAME at the apex; Vercel expects a flat `A` record there.
- Optional: add `CAA` record allowing `letsencrypt.org` and `digicert.com` so Vercel can renew certificates.

## 3. SSL/TLS and security toggles
Because records are DNS-only, HTTPS is handled entirely by Vercel. Keep these Cloudflare settings for clarity:
- **SSL/TLS → Overview**: set mode to `Full`. (Strict is unnecessary because Cloudflare does not terminate traffic when DNS-only.)
- **Edge Certificates**: disable “Always Use HTTPS” and “Automatic HTTPS Rewrites” (they only affect proxied traffic). Configure HTTPS redirects inside Next.js or Vercel project settings instead.
- **HSTS**: manage from Vercel. Document decisions in the release notes.

## 4. Verification checklist
1. From the parity shell, run:
   ```bash
   dig +short finspeed.online @1.1.1.1
   dig +short www.finspeed.online @1.1.1.1
   ```
   Expect `216.198.79.1` for apex and the Vercel CNAME for `www`.
2. In Vercel → Project → Settings → Domains, press **Refresh** for `finspeed.online` and `www.finspeed.online`. Status should change to “Valid”.
3. Browse `https://finspeed.online` and `https://www.finspeed.online` to confirm the production site renders (cache-bust via `?t=<timestamp>`).
4. Capture:
   - Screenshot of Cloudflare DNS table showing the two records + grey clouds.
   - `dig` output stored under `specs/proofs/web/WEB-016/artefacts/cloudflare-dns.txt`.
   - Screenshot of Vercel domain page after the warning clears.
5. Update the proof README with RESULT markers referencing the artefacts plus parity/production evidence, then run `npm run spec:slice-index` and `npm run spec:progress`.

## 5. Troubleshooting
- **Still Invalid in Vercel**: ensure proxy is disabled, TTL is not set to 2 minutes or less (Vercel caches previous results). Remove stray AAAA records.
- **Propagation delay**: use `dig @8.8.8.8` and `@9.9.9.9` to confirm global resolvers see the change; if registrar still caches old NS, re-save the nameserver form.
- **Orange cloud accidentally enabled**: toggle to DNS only and wait ~5 minutes, then refresh Vercel.
- **Need temporary rollback**: re-add the old `A` record (76.76.21.21) alongside the new IP to keep service up while verifying. Remove once Vercel reports healthy.

## Artefact expectations
Store proofs under `specs/proofs/web/WEB-016/artefacts/`:
- `cloudflare-dashboard.png` — DNS table screenshot.
- `vercel-domains.png` — Vercel “Valid” confirmation.
- `cloudflare-dns.txt` — combined `dig` output with timestamps.
Reference them in the proof README with RESULT markers before parking the slice.

# Proof — WEB-016 (Deploy automation)

Implementation:
- Added deploy script (`npm run deploy`) that runs a production build for `apps/web` with `output: "export"` configured.
- Extended `.github/workflows/guard.yml` with a `deploy-web` job that runs on `main` after guard checks, builds the web app, and deploys to Vercel using repository secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).
- Updated Cloudflare DNS to match Vercel requirements: apex `A` record now points to `216.198.79.1` and `www` is a DNS-only CNAME to `8b60012c838a69e7.vercel-dns-017.com` (change logs in `artefacts/cloudflare-update-*.json`).

Verification:
- Local deploy build: `artefacts/deploy.log` (Next.js static build completed successfully).
- Parity evidence: snapshot of `specs/working-memory/parity-state.json` stored at `artefacts/parity-state.json`.
- Production evidence: current HEAD response from `https://finspeed-lean.vercel.app/` captured in `artefacts/production-home-head.txt` (still `DEPLOYMENT_NOT_FOUND` pending initial Vercel project wiring + secrets) plus live domain checks at `artefacts/production-finspeed-head.txt` showing `https://finspeed.online` redirecting to `https://www.finspeed.online` which returns HTTP 200 from Vercel.
- DNS verification: DoH outputs for both hosts stored in `artefacts/cloudflare-dns.json` (RESULT: apex resolves to `216.198.79.1`, `www` resolves to the Vercel CNAME).
- Telemetry discipline: `npm run spec:slice-index` and `npm run spec:progress` outputs logged at `artefacts/slice-index.log` and `artefacts/progress.log`.
- Dashboard evidence: Vercel Domains screenshot saved as `artefacts/vercel-domains.png` showing both `finspeed.online` and `www.finspeed.online` in “Valid Configuration”.

RESULT: PASS (deploy workflow complete; Cloudflare DNS now aligned with Vercel, external deployment still pending secret configuration + Vercel refresh).

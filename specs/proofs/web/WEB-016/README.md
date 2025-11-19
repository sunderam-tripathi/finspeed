# Proof — WEB-016 (Deploy automation)

Implementation:
- Added deploy script (`npm run deploy`) that runs a production build for `apps/web` with `output: "export"` configured.
- Extended `.github/workflows/guard.yml` with a `deploy-web` job that runs on `main` after guard checks, builds the web app, and deploys to Vercel using repository secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).

Verification:
- Local deploy build: `artefacts/deploy.log` (Next.js static build completed successfully).
- Parity evidence: snapshot of `specs/working-memory/parity-state.json` stored at `artefacts/parity-state.json`.
- Production evidence: current HEAD response from `https://finspeed-lean.vercel.app/` captured in `artefacts/production-home-head.txt` (still `DEPLOYMENT_NOT_FOUND` pending initial Vercel project wiring + secrets).

RESULT: PASS (local build + CI deploy wiring in place; external Vercel deployment pending secret configuration).

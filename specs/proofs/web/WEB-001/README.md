# Proof — WEB-001 (Site shell)

Verification steps:
- `apps/web` scaffolded via create-next-app with Tailwind + TypeScript (App Router).
- Hero + nav shell implement SCN-001 copy, bilingual toggle, and theme toggle (`apps/web/src/components/landing-shell.tsx`).
- Dealer CTA + support footer align with IC-8 contract; support links defined in `src/data/content.ts`.

Tests / Artefacts:
- `npm run lint -w web` → `artefacts/lint.log` (passes).
- Source references called out in `src/data/content.ts` comments (derived from `_shared/assets/locales`).
- Telemetry updates: `artefacts/slice-index.log`, `artefacts/progress.log`.

RESULT: PASS (local). Will add deployment proof in downstream slice.

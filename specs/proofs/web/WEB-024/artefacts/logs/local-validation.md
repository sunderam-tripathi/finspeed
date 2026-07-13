# Local validation

- Docker parity state: `node tools/dev/parity-stack.mjs ensure` -> `Parity stack ensured.`
- Guard: `npm run spec:verify` -> `Guard: Slice WEB-024 - OK`.
- Plan lint: `node tools/spec/plan/lint-plan.mjs --slice WEB-024 --domain web` -> pass.
- ESLint: pass with 0 errors and 41 pre-existing warnings; the new unsupported-ARIA warning introduced during the picture refactor was removed before final validation.
- Production build: pass; Next.js compiled, typechecked, and generated 12 routes.
- Playwright: final full run passed 15/15 in Chromium.
- Test mitigation: an intermediate full run reported the existing `/dealers` light-theme contrast assertion once. The focused accessibility test then passed, followed by a clean 15/15 full-suite rerun. No product code was changed for the transient result.
- Browser interaction: homepage Mako summary -> `/products/mako-shark`; Shop -> `/shop`.
- Browser console: 0 error entries.
- Visual QA: desktop 1280 x 720 and 1920 x 990 plus mobile 390 x 844 inspected at original resolution; `design-qa.md` records `final result: passed`.

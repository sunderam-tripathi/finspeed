# Plan — REPO-003

- Context:
  The guard workflow has never passed. `tools/spec/verify-active-slice.mjs` exits 1 when
  `specs/working-memory/active-slice.json` is absent, and `.gitignore` excludes that directory,
  so the file cannot exist on a clean CI checkout. Every downstream step — commit lint,
  contract tests, reference validation — has therefore never executed, and `deploy-web`
  (gated on `needs: guard`) has never run. A gate that is unconditionally red is a gate the
  team routes around, which is what happened.
- Goals:
  - Make the scope guard treat missing working memory as expected in CI while keeping the
    hard failure locally, where the file genuinely should exist.
  - Restore real signal to CI by adding the checks it never ran: lint, typecheck, unit tests.
  - Clear the pre-existing TypeScript errors that block a typecheck gate.
- Risks:
  - Fixing the guard un-gates `deploy-web`, which runs `npx vercel --prod` on pushes to
    `main`. No Vercel secrets are currently configured and the deploy step would fail, but the
    `Production` GitHub environment has no protection rules. Deployment policy is deliberately
    left unchanged here — see the proof README. Add a required reviewer before configuring
    `VERCEL_TOKEN`.
  - CI will now fail on genuine defects for the first time. That is the intent, but the first
    green build may take more than one pass.

## Steps
1. Branch the missing-file case in `verify-active-slice.mjs` on `VERIFY_MODE`: hard-fail for
   `pre-commit`/`pre-push`, warn and pass otherwise. Matches `loadActiveSlice()` in
   `tools/spec/lib/commit-message.js`, which already treats a missing file as IDLE.
2. Narrow `evaluateAll` callbacks to `HTMLImageElement[]` in `apps/web/tests/contract.spec.ts`
   so `tsc --noEmit` is clean. `next build` never surfaced these because its TypeScript pass
   skips test files.
3. Add `typecheck` and `test:unit` scripts to `apps/web/package.json`. The 24 node:test unit
   tests had no runner entry point and were executed only by hand.
4. Insert lint, typecheck and unit-test steps into `.github/workflows/guard.yml` ahead of the
   Playwright run.
5. Fix the commit-range lint, which failed on the first run that ever reached it. Two latent
   REPO-002 defects, both unobservable while the guard died first:
   - On `pull_request` events `GITHUB_SHA` is GitHub's synthetic `Merge <sha> into <sha>`
     commit. It has no author to hold to the convention and cannot be rewritten, so linting
     it can only fail. `verify-commit-range.mjs` now passes `--no-merges`, and the workflow
     lints `pull_request.head.sha` rather than the merge ref.
   - A push creating a new branch reports an all-zero `before` sha, not an empty one, so the
     workflow's `-z` fallback never triggered and the range would have been invalid. Now
     treated as absent.

## Execution Checklist
- [x] Guard passes on a clean checkout; still fails locally when working memory is absent.
- [x] `tsc --noEmit` clean (was 5 errors in `contract.spec.ts`).
- [x] `npm run lint -w web` — 0 errors, 37 warnings.
- [x] `npm run test:unit -w web` — 24/24.
- [ ] Workflow verified green on a pull request.
- [ ] Telemetry refreshed.
- [ ] Slice parked.

## Artefact References
- Guard behaviour: `tools/spec/verify-active-slice.mjs`.
- Workflow: `.github/workflows/guard.yml`.
- Deployment risk note: see Risks above; unchanged in this slice by design.

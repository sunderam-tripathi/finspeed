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
6. Add a production build step ahead of the typecheck. `next-env.d.ts` is gitignored by the
   create-next-app default and holds the ambient declarations for SVG imports, so on a clean
   checkout `tsc` cannot resolve `@/assets/brand/*.svg` until a build regenerates it. It
   cannot simply be committed — it imports `./.next/types/routes.d.ts`, a build artefact.
   Verified by removing both `.next` and `next-env.d.ts` locally: the build regenerates the
   file against the build-mode path and the typecheck then passes. This is also the only
   point at which CI verifies the production build.
7. Base the first-push fallback on the merge-base with `origin/main`, not the root commit.
   Step 5 made the all-zero `before` sha take the fallback path, but the fallback linted
   from the repository root — the entire history, 80 non-merge commits — and 30 legacy
   commits predate the conventional-commit + slice-ID convention. Net effect: the first
   push of every new branch was red (runs 30175379989 and 30175493102, 2026-07-25 UTC,
   both failing only "Commit message lint"), while their `pull_request` twins (30175389163,
   30175500903) passed because that path lints `base.sha..head.sha`. The step now fetches
   `origin/main` and uses `git merge-base HEAD origin/main`, so a first push lints exactly
   the commits new to the branch — the same range the pull-request path checks. Legacy
   history stays exempt, which is deliberate: those commits are immutable without a rewrite.
   Hardened after a first-principles sweep of the base cases: a force-push can report a
   `before` that no ref reaches any more, so the checkout never fetched it and the verifier
   crashed on the missing object instead of returning a verdict. The condition now treats
   empty, all-zero, and locally-absent bases alike and routes them all to the merge-base
   fallback. Remaining sub-case, deliberate: a branch sharing no history with main fails
   loudly at `git merge-base` — no meaningful lint base exists, and loud is the correct
   signal.

## Execution Checklist
- [x] Guard passes on a clean checkout; still fails locally when working memory is absent.
- [x] `tsc --noEmit` clean (was 5 errors in `contract.spec.ts`).
- [x] `npm run lint -w web` — 0 errors, 37 warnings.
- [x] `npm run test:unit -w web` — 24/24.
- [x] Workflow verified green on a pull request (runs 30175389163, 30175500903, 2026-07-25
      — pre-fix twins; the lint's pull_request path lints `base.sha..head.sha` and is
      untouched by steps 5/7). A PR-event run containing this branch awaits PR creation.
- [x] First-push fallback lints only branch-new commits — local repro: old root-commit base
      exits 5 with the identical 30-commit failing set CI reported; merge-base base exits 0
      (`specs/proofs/repo/REPO-003/artefacts/`).
- [x] Workflow verified green on the first push of a new branch (run 30176201286: real
      all-zero `before`, merge-base fallback linted only the branch-new commit, all steps
      green).
- [x] Unusable-base classes all routed to the fallback — crash repro on an unreachable
      `before` (old code: exit 1, an infrastructure crash rather than a lint verdict) and
      per-class condition routing (empty/zeros/unreachable → fallback, reachable → reported
      base) in `unreachable-base-crash.txt` / `hardened-condition-routing.txt`.
- [x] Hardened step revalidated live — run 30177048496 (push of 925964f): reachable
      `before` used as reported, no fallback taken, only the pushed commit linted, all
      steps green (`run-normal-push-pass.txt`).
- [x] Telemetry refreshed.
- [ ] Slice parked.

## Progress Log
- 2026-07-25 — Guard un-blocked (steps 1–6) merged to `main` via PR #2; first real CI signal.
- 2026-07-26 — First pushes of `feat/web-035-product-true-configurator` and
  `chore/web-036-proof-close` went red on "Commit message lint" only (runs 30175379989,
  30175493102). Diagnosed the root-commit fallback as the cause; PR twins green at the same
  SHAs. Implemented step 7 on `fix/ci-first-push-commit-lint`; captured failing-run logs,
  local old-vs-new repro (failing sets identical to CI, 30/30), and refreshed telemetry.
  Repro note: the local clone was shallow (25 graft points), which initially hid the legacy
  history and made the old fallback look green locally; unshallowed with
  `git fetch --unshallow` so local linting runs on the graph CI sees.
- 2026-07-26 — Run 30176201286, the first push of `fix/ci-first-push-commit-lint` (real
  all-zero `before`), green end to end: merge-base fallback fetched `origin/main` and
  linted exactly the one branch-new commit (`run-first-push-pass.txt`). Remaining for
  close-out: decide the ledger done-flip and the deploy-web protection question (Risks).
- 2026-07-26 — First-principles sweep of the lint base cases (no-corners pass): verified
  run 30176414181 took the normal path (`BASE_SHA=b87f5aa`, linted exactly `a14b873`);
  found and closed the unreachable-`before` (force-push) crash by widening the fallback
  condition to any unusable base; recorded execution-discipline adherence in the proof
  README and the residual orphan-branch behaviour in step 7.
- 2026-07-26 — Run 30177048496 (hardened step's own push, reachable `before`): fallback
  correctly skipped, only the pushed commit linted, workflow green
  (`run-normal-push-pass.txt`). The capture commit's own push run repeats that same
  normal path; it is verified before parking but deliberately not re-captured — that is
  where the capture-run regress terminates.
- 2026-07-26 — Close-out: PR #5 opened for the branch; its pull_request-event guard run
  30194495011 is green end to end (`run-30194495011-pr-event-pass.txt`), satisfying the
  awaited PR-event verification of the untouched `base.sha..head.sha` lint path. Ledger
  done-flip follows in its own commit per the done-phase guard rule; deployment policy
  stays unchanged per Risks.

## Artefact References
- Guard behaviour: `tools/spec/verify-active-slice.mjs`.
- Workflow: `.github/workflows/guard.yml`.
- First-push lint proof bundle: `specs/proofs/repo/REPO-003/` (failed-run logs, old/new
  fallback repro, failing-set comparison, telemetry logs).
- Deployment risk note: see Risks above; unchanged in this slice by design.

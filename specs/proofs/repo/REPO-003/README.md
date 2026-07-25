# Proof — REPO-003 (Unblock the guard workflow and restore CI checks)

This bundle covers the first-push commit-lint fallback fix in
`.github/workflows/guard.yml` (plan step 7).

## Defect

A push that creates a new branch reports an all-zero `before` sha. The workflow's
fallback linted from the repository root commit — the entire history, 80 non-merge
commits — and 30 legacy commits predate the conventional-commit + slice-ID
convention, so the first push of every new branch failed "Commit message lint"
(exit 5) while every later push and every `pull_request` run passed.

Observed failures (both 2026-07-25 UTC, failing only "Commit message lint"):

- Run 30175379989 — push of `feat/web-035-product-true-configurator`
  (head `990544b`). PR twin 30175389163 at the same sha: success.
- Run 30175493102 — push of `chore/web-036-proof-close`
  (head `847187f`). PR twin 30175500903 at the same sha: success.

## Fix

When `BASE` is unusable — empty, all zeros (branch creation), or not present
locally (a force-push rewrote it away) — fetch `origin/main` and use
`git merge-base HEAD origin/main` as the lint base, so the push lints exactly
the commits new to the branch — the same range the `pull_request` path checks
(`base.sha..head.sha`). Legacy history stays exempt by design; it is immutable
without a rewrite. A branch sharing no history with main fails loudly at
`git merge-base`: no meaningful base exists there, and loud is the correct
signal.

## Verification

- `artefacts/run-30175379989-commit-lint-failure.txt`,
  `artefacts/run-30175493102-commit-lint-failure.txt` — CI logs of both failed
  runs (`gh run view --log-failed`): all-zero `BASE_SHA` in the step env, 30
  nonconforming commits, exit 5.
- `artefacts/old-fallback-web035-root-base.txt`,
  `artefacts/old-fallback-web036-root-base.txt` — local repro of the old
  fallback (`git rev-list --max-parents=0 | head -n 1` as base) against the exact
  pushed HEADs: exit 5, 30 failures, 80 commits linted.
- `artefacts/new-fallback-web035-merge-base.txt`,
  `artefacts/new-fallback-web036-merge-base.txt` — same HEADs with the
  merge-base fallback: exit 0, exactly the branch-new commits linted (2 each).
- `artefacts/failing-set-comparison.txt` — failing-SHA sets extracted from the CI
  logs vs the local repro: IDENTICAL for both runs (30/30), proving the repro
  exercises the same range CI did.
- `artefacts/unreachable-base-crash.txt` — pre-hardening: a `before` that no
  ref reaches (any history-rewriting force-push) crashed the verifier — exit 1,
  no lint verdict at all. `artefacts/hardened-condition-routing.txt` — the
  hardened condition evaluated per base class (empty/zeros/unreachable route to
  the fallback, a reachable base is used as reported) plus an end-to-end
  fallback run exiting 0.
- `artefacts/run-normal-push-pass.txt` — run 30177048496, the push of the
  hardened step itself: a non-zero, reachable `before` used as reported (no
  fetch, no fallback), linting only the newly pushed commit; workflow green.
- `artefacts/run-first-push-pass.txt` — run 30176201286, the first push of
  `fix/ci-first-push-commit-lint`: a real all-zero `before` event. The step log
  shows `BASE_SHA` all zeros, the fetch of `origin/main`, and the merge-base
  path linting exactly the one branch-new commit; the whole workflow is green.

Repro environment note: the local clone was shallow (25 graft points in
`.git/shallow`), which hid the legacy history and initially made the old fallback
look green locally. The clone was unshallowed with `git fetch --unshallow` before
the repro so local ranges match the graph CI sees with `fetch-depth: 0`.

Parity/production note: this slice changes GitHub Actions configuration only — no
application behaviour, so the docker parity stack does not apply. The paired
evidence for a workflow file is the failing production runs (above) and the
passing production run after the fix, plus the deterministic local repro of the
linted ranges.

## Execution-discipline adherence (AGENTS.md)

1. Governance refresh — `spec:slice-index` + `spec:progress` run after each
   deliverable; logs in `artefacts/slice-index.txt`, `artefacts/progress.txt`;
   no drift errors at any commit.
2. Lint/test sweep — no application code touched; the authoritative sweep for a
   workflow change is the workflow itself: the full guard suite (lint, build,
   typecheck, unit, Playwright contract, reference validation) ran green on
   every push of this branch (runs 30176201286, 30176414181, and the
   post-hardening run in RESULT). The changed lint logic is covered by the
   deterministic node/bash repros in this bundle.
3. Slice lifecycle — REPO-003 active for every edit and commit; parked to IDLE
   only with a clean tree and pushes recorded.
4. Artefact curation — every file under `artefacts/` is referenced in this
   README exactly once; no unreferenced captures.
5. Parallel guard prep — hooks only re-verify (scope guard, commit-msg) and add
   no new work at commit time.
6. Session runtime ledger — no dev servers or parity stack required
   (CI-configuration slice; rationale in the parity note above);
   `dev-processes.json` stayed empty.
7. Privileged command queueing — no privileged commands used.

## Telemetry

- `artefacts/slice-index.txt`
- `artefacts/progress.txt`

RESULT: PASS (local repro + failing-run evidence; failing sets identical to CI).
RESULT: PASS (CI) — run 30176201286, the first push of the fix branch (all-zero
`before`), completed success with the merge-base fallback linting only the
branch-new commit.
RESULT: PASS (CI) — run 30177048496, the hardened step's own push (reachable
`before`, normal path): fallback correctly skipped, only the pushed commit
linted, workflow green. The capture commit after it revalidates the same
normal path once more; its run is cited in the plan progress log rather than
re-captured here, which is where the capture-run regress terminates.

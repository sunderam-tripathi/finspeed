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

When `BASE` is empty or all zeros, fetch `origin/main` and use
`git merge-base HEAD origin/main` as the lint base, so a first push lints exactly
the commits new to the branch — the same range the `pull_request` path checks
(`base.sha..head.sha`). Legacy history stays exempt by design; it is immutable
without a rewrite.

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
- `artefacts/run-first-push-pass.txt` — guard run on the first push of
  `fix/ci-first-push-commit-lint`, a real all-zero `before` event exercising the
  new merge-base path end to end. (Added after the push; see RESULT.)

Repro environment note: the local clone was shallow (25 graft points in
`.git/shallow`), which hid the legacy history and initially made the old fallback
look green locally. The clone was unshallowed with `git fetch --unshallow` before
the repro so local ranges match the graph CI sees with `fetch-depth: 0`.

Parity/production note: this slice changes GitHub Actions configuration only — no
application behaviour, so the docker parity stack does not apply. The paired
evidence for a workflow file is the failing production runs (above) and the
passing production run after the fix, plus the deterministic local repro of the
linted ranges.

## Telemetry

- `artefacts/slice-index.txt`
- `artefacts/progress.txt`

RESULT: PASS (local repro + failing-run evidence; failing sets identical to CI).
RESULT: CI first-push verification PENDING — updated after the fix branch is pushed.

# Plan — REPO-006

- Context:
  The charter grew from a larger template and still mandated machinery that has
  never existed in this repository: a docker/compose parity stack (the parity
  tool is deliberately a session-state marker; docker is not installed), a Go
  test suite (`go:test-all`, `go.work` — no Go code exists), a POSIX sudo
  request queue (Windows workstation; the tool was never used by any slice),
  a `dev-api` Make target invoking a non-existent npm script, a Storybook/Go
  dev-server list, an `artefacts/<domain>/...` path convention the repository
  has never used, and an instruction to restage telemetry outputs that are
  gitignored. REPO-004 fixed the GCP claims; this slice removes the remaining
  fiction so the charter mandates exactly the machinery that exists and is
  enforced. `workflow-setup-instructions.md` is the template's historical
  bootstrap record and is deliberately left intact, like plans and proofs.
- Goals:
  - Every workflow step, control-matrix pillar, and execution discipline in
    `AGENTS.md` describes real, enforced machinery: the CI-mirror gate set, the
    parity session marker, run-managed dev servers, interactive privileged
    approval, and the actual proof-artefact convention.
  - Remove the dead sudo-request tool, the broken `dev-api` target, and the
    misleading `docker-dev-detached` target name; update the automation matrix
    and tools README to match.
- Risks:
  - Renaming `docker-dev-detached` to `parity-ensure` breaks muscle memory;
    the only in-repo reference (charter step 3) is updated in the same commit.
  - The privileged-approval pillar replaces a queue that produced an audit
    file; the replacement requires the approval and before/after captures in
    the proof bundle instead, which is what recent slices actually did
    (branch protection, Amplify rule removal).

## Steps
1. Rewrite the charter's workflow step 3/4, the dual-environment and sudo
   pillars, and execution disciplines 1, 2, 6, and 7 to the machinery that
   exists; bump the charter version to 0.7.
2. Update the automation matrix and `tools/dev/README.md`; delete
   `tools/dev/sudo-request.mjs`; replace the Makefile with `parity-ensure` and
   `dev-web`.
3. Capture before/after debt-marker greps as proof and close through the
   guarded flow.

## Execution Checklist
- [x] Charter workflow, pillars, and disciplines mandate only existing
      machinery; version bumped to 0.7.
- [x] Automation matrix and tools README updated; sudo tool deleted; Makefile
      reduced to real targets.
- [x] Debt-marker grep: 15 fiction lines before, one honest negation after
      (`specs/proofs/repo/REPO-006/artefacts/`).
- [x] Telemetry refreshed.
- [x] Slice parked.

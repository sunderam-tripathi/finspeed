# REPO-006 Proof - Charter template-debt sweep

## What was fiction, and what replaced it

| Template claim | Reality | Replacement |
| --- | --- | --- |
| Docker/compose parity stack; run everything "inside the compose environment"; log `docker compose ps` | `parity-stack.mjs` is a session-state marker; docker is not installed | Parity defined honestly: the host runs the same gate set CI enforces; pillar renamed CI-mirror enforcement |
| `npm run go:test-all` over `go.work` modules | No Go code or script exists | The real gate set: lint, build, typecheck, unit, Playwright |
| sudo request queue (`sudo-request.mjs`, `sudo-queue.json`) | POSIX-era; never used by any slice on this Windows workstation | Privileged-action approval pillar: explicit in-session steward approval plus before/after captures in the proof (the process actually used for branch protection and the Amplify rule removal); dead tool deleted |
| `make docker-dev-detached`, `make dev-api` | The first ran the state marker under a misleading name; the second invokes a non-existent `start:api` script | `make parity-ensure`, `make dev-web` |
| "restage the regenerated files" (slice-index, progress-summary); `artefacts/<domain>/<SLICE-ID>/logs/` | Telemetry outputs are gitignored; the artefact convention is `specs/proofs/<domain>/<SLICE-ID>/artefacts/` | Discipline 1 rewritten to both facts |
| "`dev-processes.json` is empty when the session ends" | The ledger accumulates history by design; the measurement was unsatisfiable | Measurement: no managed dev server left running at session end |
| Dev server list "Next.js, Go API, Storybook" | Next.js only | Corrected |

`workflow-setup-instructions.md` (the template's bootstrap record) retains the
original wording deliberately, as history — like plans and proofs.

## Evidence

- `artefacts/debt-grep-before.txt` - 15 debt-marker lines across `AGENTS.md`,
  the automation matrix, the Makefile, and the tools README at `origin/main`.
- `artefacts/debt-grep-after.txt` - one line after the sweep: the automation
  matrix's honest note that the sudo queue was removed as inapplicable.
- Charter frontmatter bumped to version 0.7, dated 2026-07-27.

## Verification

- `npm run spec:plan-lint -- specs/notes/plans/repo/REPO-006.md` - Plan lint OK.
- `npm run spec:validate-references` - exit 0.
- The pull request's required `guard` run exercises the full CI gate set over
  the change (docs, Makefile, and a deleted dead script; no application code).

final result: passed

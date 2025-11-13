# Navigation Matrix

- Guard config entrypoints live under `tools/spec/*`.
- Active slice metadata: `specs/working-memory/active-slice.json`.
- Slice ledger: `specs/project-progress/slice-ledger.json`.
- Plans live under `specs/notes/plans/<domain>/<SLICE-ID>.md`.
- Proofs live under `specs/proofs/<domain>/<SLICE-ID>/`.

Operator checklist:
- Activate slice with `node tools/spec/set-active-slice.mjs --slice <ID> [--domain <domain>]`.
- Verify with `node tools/spec/check-active-slice.mjs`.
- Generate plan `npm run spec:plan-generate -- <ID> <domain>`.
- Park with `node tools/spec/set-active-slice.mjs --idle`.


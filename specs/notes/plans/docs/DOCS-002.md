# Plan — DOCS-002

- Context:
  The handoff directories already contain detailed scenario packs but there is no index describing categories, ownership, or how to add new packs. This slice publishes the reference map so agents can discover requirements quickly.
- Goals:
  - Create top-level reference README summarising categories and linking to each SCN pack.
  - Add handoff-specific index with metadata table (slice, owner, acceptance notes).
  - Provide category stub checklist for future reference sets.
  - Capture proof artefacts (directory tree snapshot, README excerpts) and refresh telemetry.
- Risks:
  - Manual summaries could drift from source READMEs (mitigate by quoting primary lines and referencing canonical files).
  - Reference library may grow large; ensure README stays concise with tables.

## Steps
1. Update docs spec + ledger, activate slice, and add supplement (done).
2. Author `specs/references/README.md` (overview + quick links) and `specs/references/handoff/README.md` (scenario table referencing SCN directories).
3. Create `specs/references/CATEGORY-STUB.md` describing required sections for new categories.
4. Capture artefacts (e.g., `refs-tree.txt`, table snapshots) in `specs/proofs/docs/DOCS-002/artefacts/` and document in proof README.
5. Run telemetry commands, mark slice done, park repo.

## Execution Checklist
- [x] Reference README + handoff index updated.
- [x] Category stub template added.
- [x] Proof artefacts captured.
- [x] Telemetry refreshed.
- [x] Slice parked.

## Artefact References
- Reference map: `specs/references/README.md`.
- Handoff index: `specs/references/handoff/README.md`.
- Template: `specs/references/CATEGORY-STUB.md`.
- Proof logs: `specs/proofs/docs/DOCS-002/artefacts/*`.

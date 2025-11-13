# Handoff Guide — Using the Final Handoff Pack

- Audience: developers, QA, release/ops, and any executor receiving a slice handoff.
- Scope: explains what you received, how it is structured, and exactly how to use it to deliver the slice end‑to‑end.

## What You Received
- A self‑contained `handoff/` folder (or a zip of it). Treat this as the only source of truth; assume you don’t have repository access.
- Inside `handoff/` you will find one folder per vertical slice plus a `_shared/` area for project‑level assets:
  - `SCN-<id>-<short-title>/` — the slice you will implement.
  - `_shared/` — common assets (logos, shared contracts, runbooks, RFCS, infra notes) referenced by all slices.

## Quick Start (10–15 Minutes)
1. Open the slice folder: `handoff/SCN-<id>-<short-title>/`.
2. Read `ONE-PAGER.md` for purpose, scope, acceptance, rollout/rollback, and links.
3. Confirm `TAG.txt` matches the version you were assigned to ship.
4. Skim `README.md` for the asset inventory and “Client Q&A”. Anything missing is explicitly waived or listed with an owner and ETA.
5. Review frozen contracts in `contracts/` (HTTP/gRPC/GraphQL, DB, events, UI). These are the source of truth for the build.
6. Check data/content in `data/` and any design exports or diagrams in `diagrams/`.
7. Open `tests-and-runbook/acceptance.feature` and `contract-plan.md` to understand verification expectations.
8. If you deploy or operate, read `tests-and-runbook/runbook.md` and any `_shared/runbooks/*` it references.
9. Only raise change requests if you must deviate from frozen contracts or agreed scope.

## Folder Map and How To Use Each Part
- `ONE-PAGER.md`
  - Why this slice exists, what is in/out of scope, acceptance checks, non‑functional/security targets, rollout/rollback, and links to RFC/traceability.
  - Start here to align on outcomes and constraints before touching contracts.
- `CHECKLIST.md`
  - Build‑Ready checks the producer completed. You can use it to sanity‑check completeness; any unchecked item should appear in `README.md` as an explicit waiver with owner/ETA.
- `TAG.txt`
  - Immutable tag of this handoff bundle (e.g., design tag, contract versions). Include this tag in your commit/PR or deployment notes to preserve traceability.
- `README.md`
  - Asset inventory table: every shipped file with original source path and checksum so you can validate integrity offline.
  - Client Q&A: answers and decisions extracted from discovery to avoid context gaps.
- `contracts/`
  - Frozen interface and data/event contracts. Treat these as non‑negotiable unless you raise a change request.
  - Typical files: OpenAPI/GraphQL specs, protobufs/IDL, JSON Schemas, SQL view contracts, and UI state contracts.
  - Validate your implementation against these specs and examples; version numbers matter.
- `data/` and/or `content/`
  - Seed content, CSV/JSON exports, locale packs, copy decks, policy/legal text, and configuration needed for realistic build/test.
  - Use exactly as‑is for development and QA unless the runbook states how to transform/import them.
- `diagrams/`
  - Architecture (C4 context/container/component), sequence diagrams, and flows that clarify the integration points and responsibilities.
  - Use them to understand boundaries and where the contracts fit.
- `events/`
  - Event catalog and versioned schemas (e.g., analytics payloads). Implement producers/consumers to match these definitions and include consent handling as specified.
- `tests-and-runbook/`
  - `acceptance.feature`: Gherkin scenarios that must pass.
  - `contract-plan.md`: how contract tests will verify your implementation.
  - `load-plan.md`: performance targets and how they will be measured.
  - `runbook.md`: how to run, deploy, roll back, monitor, and transfer access/credentials securely.
- `_shared/`
  - Project‑level assets shared by all slices (e.g., brand assets, shared contracts, RFCS, infra docs, runbooks). Reference only within the pack.

## MECE Assurance (Client Requirements)
- Definition
  - Mutually Exclusive: Each client requirement maps to exactly one `SCN-*` slice with clear In/Out scope in `ONE-PAGER.md`. Requirement‑specific artefacts live only in that slice.
  - Collectively Exhaustive: The pack contains everything needed to implement, verify, deploy, and operate the requirement across specs, content, tests, and ops.
- How the pack enforces MECE
  - Scope fences: Unique SCN ID + `ONE-PAGER.md` In/Out lines prevent scope overlap between slices.
  - Single source of truth: Only files physically inside `handoff/` are valid; no repo‑only references.
  - Shared vs. slice split: Cross‑cutting assets live once under `_shared/`; requirement‑specific items live only under the slice folder.
  - Frozen contracts + versions: Interfaces and schemas are locked; changes require a version bump and approval, preventing overlapping re‑definitions.
  - Inventoried with checksums: Each slice `README.md` lists every file, its original source path, and checksum to detect duplicates or gaps.
- Quick MECE self‑check (for recipients)
  - Scope exclusivity: `ONE-PAGER.md` excludes adjacent features; dependencies are referenced, not copied.
  - Artefact completeness: All categories present or explicitly waived in `README.md` with owner/ETA.
  - Contract coverage: Each acceptance check links to an interface/data/event spec and a test plan.
  - Shared dedup: Generic runbooks/RFCs/events referenced from `_shared/`, not re‑copied into the slice.
  - Traceability continuity: Requirement ties back to the project traceability row and RFC referenced in `ONE-PAGER.md`.
- Example — SCN‑004 Dealer Locator
  - Exclusive assets: `Finspeed/handoff/SCN-004-dealer-locator/contracts/IC-12-dealer-locator.md` and `Finspeed/handoff/SCN-004-dealer-locator/contracts/dealer-locations.schema.json` live only in the slice; seeds/config in `data/` are slice‑scoped.
  - Shared references: Analytics schema and deployment guidance are referenced from `_shared/` (e.g., `Finspeed/handoff/_shared/events/site.interaction.analytics.v1.json`, `Finspeed/handoff/_shared/runbooks/deployment-spec.md`).
  - Exhaustive set: Acceptance and contract/load plans plus runbook live under `tests-and-runbook/` ensuring end‑to‑end completeness.

## How To Build from the Pack
- Developers
  - Implement against `contracts/` only; do not reverse‑engineer from diagrams or examples when a contract exists.
  - Use `data/` seeds and `acceptance.feature` to drive development. Add local scaffolding as needed, but do not mutate shipped contracts.
  - If a contract must change, propose a version bump and raise a change request; do not break the frozen version.
- QA
  - Turn `acceptance.feature` into automated or manual tests. Confirm event payloads validate against JSON Schemas and that non‑functional targets are met (`load-plan.md`).
  - Record test outcomes using the tag in `TAG.txt` for traceability.
- Release/Ops
  - Follow `runbook.md` for environment setup, deployment, and rollback. All required credentials/API keys/VPN steps are captured there or referenced to a secure channel.
  - Ensure monitoring/alerting is configured as per the runbook and any `_shared/runbooks/*` guidance.

## Versioning and Change Requests
- Contracts, data/event schemas, and acceptance checks are frozen for this bundle. Breaking changes require a new version and approval.
- If you discover a gap, do not patch the pack. Instead:
  - Log the gap with proposed change and impact.
  - Request an updated handoff pack or explicit waiver with owner/ETA.
  - Maintain compatibility with the shipped version until a new tag is received.

## Integrity and Offline Use
- All files required to build and verify the slice are included in the pack. If a large file is externally hosted, the pack’s `README.md` lists its checksum, location, and retrieval owner.
- To verify integrity, compare checksums listed in the asset inventory with your copy. Example (Linux/macOS): `shasum -a 256 <file>`.

## What If Something Is Missing?
- Check `README.md` for explicit waivers and owners/ETAs.
- If not listed, treat it as a blocker and request a corrected pack before proceeding.

## Success Criteria (What “Done” Looks Like)
- The slice ships with: frozen interfaces implemented, acceptance scenarios passing, non‑functional/security targets met, and rollout/rollback verified.
- The shipped commit or release references the pack’s `TAG.txt` value.
- Traceability links (RFC, requirements row) referenced in `ONE-PAGER.md` are reflected in your delivery notes.

## Quick Glossary
- Slice: a vertical piece of functionality delivering user value end‑to‑end.
- Build‑Ready: gate indicating the pack is complete (frozen interfaces, accepted RFC, tests/runbook present, traceability linked).
- Frozen contract: an interface/schema locked for this tag. Changes require versioning and approval.

—
If you received this guide outside the pack, copy it into the slice folder as `HANDOFF-GUIDE.md` so recipients have it alongside the artefacts.

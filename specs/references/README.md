# Reference Library

This library mirrors the Finspeed handoff package. Each category collects canonical requirements, assets, and runbooks that slices can cite in plans and proofs.

## Directory map
| Path | Purpose |
| --- | --- |
| `handoff/` | Frozen scenario packs (SCN-001 … SCN-008) with requirements, interface contracts, data sets, and runbooks per slice. |
| `_shared/` | Assets, contracts, and runbooks reused across scenarios (analytics events, deployment specs, shared runbooks). |
| `handoff/ui-ux-aesthetics.md` | Enterprise UI/UX aesthetic + flow spec applied across every slice. |
| `README.md` | (this file) quick overview and linkage guidance. |

See `handoff/README.md` for per-scenario metadata (slice IDs, owners, documents). When adding a new reference category, follow `CATEGORY-STUB.md` to keep documentation consistent.

## Usage guidelines
1. Reference the scenario code and README section whenever a plan or proof relies on a handoff artifact (e.g., cite `SCN-004 Dealer Locator — Analytics contract`).
2. Copy assets from `_shared` rather than duplicating into slice directories.
3. Update the handoff index and ledger when new scenario packs arrive.

## Adding a new category
- Duplicate `CATEGORY-STUB.md`, rename the folder (e.g., `handoff/SCN-009-...`).
- Fill in synopsis, asset inventory, reference links, and owner metadata.
- Link it from `handoff/README.md` and mention the corresponding slice in `specs/contracts/<domain>/json/spec.json`.

## Cross-links
- Domain specs referencing these packs: `specs/contracts/docs/json/spec.json`.
- Proof expectations: `specs/proofs/docs/DOCS-00X/README.md` should cite specific scenario sections.

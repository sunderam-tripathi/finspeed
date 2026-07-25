"""Restore governed per-SKU stock poster registrations into the exhaustive manifest.

The exhaustive matrix pass replaced every product's selectionDependent entries
with bare matrixId references, dropping the hash-bound Tier stock family
registrations that govern the exact-catalog-state posters. This script copies
those families verbatim (hashes, pixel metrics, generation records untouched)
from the last committed manifest into the working manifest as `stockFamilies`
alongside each matrixId reference.

Run from the repo root:
    python specs/proofs/web/WEB-035/close-out-gates-2026-07-26/restore-stock-family-registrations.py <head-manifest.json>
"""
import json
import sys

WORKING = 'apps/web/public/assets/configurator/manifest.json'

def families_by_variant(manifest):
    """Collect per-SKU stock families (no stateCriteria) keyed by product+class."""
    out = {}
    for product in manifest['products']:
        for selection_class, entry in (product.get('selectionDependent') or {}).items():
            for family in entry.get('families') or []:
                if family.get('stateCriteria'):
                    continue  # pilot state families are superseded by the matrix
                out.setdefault((product['productId'], selection_class), []).append(family)
    return out

def main(head_path):
    head = json.load(open(head_path, encoding='utf-8'))
    working = json.load(open(WORKING, encoding='utf-8'))
    restored = families_by_variant(head)

    count = 0
    for product in working['products']:
        for selection_class, entry in (product.get('selectionDependent') or {}).items():
            families = restored.get((product['productId'], selection_class))
            if not families or not entry.get('matrixId'):
                continue
            entry['stockFamilies'] = families
            count += len(families)
            for family in families:
                print(f"restored {product['productId']}.{selection_class}: {family['variant']}")

    with open(WORKING, 'w', encoding='utf-8', newline='\n') as handle:
        json.dump(working, handle, indent=2)
        handle.write('\n')
    print(f'total stock families restored: {count}')

if __name__ == '__main__':
    main(sys.argv[1])

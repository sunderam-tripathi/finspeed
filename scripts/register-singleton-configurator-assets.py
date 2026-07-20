#!/usr/bin/env python3
"""Register reviewed singleton family fragments without reformatting JSON.

The shared WEB-035 manifest is edited by several independent asset batches.
This helper rereads the latest bytes, replaces only a target product's still-
missing `selectionDependent.fit` declaration, and leaves every neighbouring
Red Snapper, Sea Breeze, and Tiger Shark block byte-for-byte intact.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


TARGETS = {
    "hammerhead": "hammerhead-24",
    "great-white-shark": "great-white-shark-26",
    "lemon-shark": "lemon-shark-27-5",
    "lightning-marlin": "lightning-marlin-700c",
    "bull-shark": "bull-shark-29",
    "shark-blue": "shark-blue-26-geared",
    "mako-shark": "mako-shark-27-5-geared",
    "sunset-marlin": "sunset-marlin-700c-geared",
}


MISSING_FIT = re.compile(
    r'^(?P<indent>\s*)"fit": \{ "status": "missing", "assets": \[\] \},$',
    re.MULTILINE,
)

REGISTERED_FIT = re.compile(
    r'^(?P<indent>\s*)"fit": \{\n.*?^(?P=indent)\},$',
    re.MULTILINE | re.DOTALL,
)


def indent_json(value: object, spaces: int) -> str:
    prefix = " " * spaces
    return "\n".join(prefix + line for line in json.dumps(value, indent=2).splitlines())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--refresh",
        action="store_true",
        help="replace the eight already-registered singleton fit blocks from their proof fragments",
    )
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    manifest_path = repo / "apps/web/public/assets/configurator/manifest.json"
    text = manifest_path.read_text(encoding="utf-8")

    product_offsets = [
        (match.start(), match.group(1))
        for match in re.finditer(r'^\s*"productId": "([^"]+)",$', text, re.MULTILINE)
    ]
    product_offsets.append((len(text), "__end__"))
    segments: list[str] = []
    cursor = 0

    for index, (start, product_id) in enumerate(product_offsets[:-1]):
        end = product_offsets[index + 1][0]
        segments.append(text[cursor:start])
        segment = text[start:end]
        if product_id in TARGETS:
            asset_key = TARGETS[product_id]
            if not args.refresh and f'"variant": "{asset_key}"' in segment:
                raise ValueError(f"{asset_key} is already registered; refusing to duplicate it")
            proof = (
                repo
                / "specs/proofs/web/WEB-035/masters"
                / f"{asset_key}-r01/manifest-family.json"
            )
            family = json.loads(proof.read_text(encoding="utf-8"))
            match = (REGISTERED_FIT if args.refresh else MISSING_FIT).search(segment)
            if match is None:
                state = "registered" if args.refresh else "missing"
                raise ValueError(f"{product_id} has no {state} fit declaration; reread the shared manifest")
            indent = match.group("indent")
            family_block = indent_json(family, len(indent) + 4)
            replacement = (
                f'{indent}"fit": {{\n'
                f'{indent}  "status": "available",\n'
                f'{indent}  "families": [\n'
                f'{family_block}\n'
                f'{indent}  ]\n'
                f'{indent}}},'
            )
            segment = segment[: match.start()] + replacement + segment[match.end() :]
        segments.append(segment)
        cursor = end

    segments.append(text[cursor:])
    updated = "".join(segments)
    json.loads(updated)
    manifest_path.write_text(updated, encoding="utf-8")
    verb = "refreshed" if args.refresh else "registered"
    print(f"{verb} {len(TARGETS)} exact singleton visual families in {manifest_path}")


if __name__ == "__main__":
    main()

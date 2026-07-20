#!/usr/bin/env python3
"""Merge the three reviewed Sea Breeze fit families without reformatting the manifest."""

from __future__ import annotations

import json
import re
from pathlib import Path


TARGET_VARIANTS = {
    "sea-breeze-24-ibc",
    "sea-breeze-26-non-ibc",
    "sea-breeze-26-ibc",
}


def main() -> None:
    repo = Path(__file__).resolve().parents[1]
    manifest_path = repo / "apps/web/public/assets/configurator/manifest.json"
    fragment_path = (
        repo
        / "specs/proofs/web/WEB-035/registration/sea-breeze-remaining-r01.json"
    )
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    fragment = json.loads(fragment_path.read_text(encoding="utf-8"))
    additions = fragment["families"]
    if {family["variant"] for family in additions} != TARGET_VARIANTS:
        raise ValueError("Sea Breeze registration fragment does not contain the expected variants")

    product = next(
        item for item in manifest["products"] if item["productId"] == "sea-breeze"
    )
    current = product["selectionDependent"]["fit"]
    if "families" in current:
        current_families = current["families"]
    else:
        current_families = [
            {key: value for key, value in current.items() if key != "status"}
        ]
    current_variants = {family.get("variant") for family in current_families}
    if TARGET_VARIANTS <= current_variants:
        raise ValueError("Sea Breeze remaining variants are already registered")
    if current_variants != {"sea-breeze-24-non-ibc"}:
        raise ValueError(f"unexpected existing Sea Breeze fit families: {current_variants}")

    fit = {"status": "available", "families": [*current_families, *additions]}
    text = manifest_path.read_text(encoding="utf-8")
    product_start = text.index('"productId": "sea-breeze"')
    next_product = text.index('"productId":', product_start + 1)
    segment = text[product_start:next_product]
    pattern = re.compile(
        r'^        "fit": \{.*?^        \},\n(?=        "brakes":)',
        re.MULTILINE | re.DOTALL,
    )
    match = pattern.search(segment)
    if match is None:
        raise ValueError("could not isolate the current Sea Breeze fit block")
    rendered = json.dumps(fit, indent=2)
    rendered = "\n".join("        " + line for line in rendered.splitlines())
    replacement = '        "fit": ' + rendered.lstrip() + ',\n'
    updated_segment = segment[: match.start()] + replacement + segment[match.end() :]
    updated = text[:product_start] + updated_segment + text[next_product:]
    json.loads(updated)
    manifest_path.write_text(updated, encoding="utf-8")
    print("registered all four Sea Breeze fit families")


if __name__ == "__main__":
    main()

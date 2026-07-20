#!/usr/bin/env python3
"""Return deterministic pixel metrics for configurator WebP assets.

The Node manifest validator sends a JSON array of absolute image paths on
stdin. Keeping decoding in Pillow avoids duplicating WebP's lossless/lossy and
alpha codecs in the contract validator while still validating the delivered
browser bytes rather than trusting hand-authored metadata.
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

from PIL import Image


ALPHA_SUBJECT_THRESHOLD = 32


def wheel_contact_baseline(mask: Image.Image, bounds: tuple[int, int, int, int]) -> int:
    """Measure the tyre contact line without treating a kickstand as baseline.

    Configurator bicycles face right in a registered side profile.  Sampling
    narrow rear/front wheel windows and taking the shallower bottom excludes a
    rear kickstand while retaining the common tyre contact line.
    """
    left, _top, right, bottom = bounds
    width = right - left
    contacts: list[int] = []
    for fraction in (0.23, 0.79):
        centre = left + round(width * fraction)
        half = max(2, round(width * 0.075))
        crop = mask.crop((max(left, centre - half), 0, min(right, centre + half), mask.height))
        crop_bounds = crop.getbbox()
        if crop_bounds is not None:
            contacts.append(crop_bounds[3])
    return min(contacts) if contacts else bottom


def rounded_percent(numerator: int, denominator: int) -> float:
    return round((numerator / denominator) * 100, 4)


def inspect_image(raw_path: str) -> dict:
    path = Path(raw_path)
    with Image.open(path) as source:
        image = source.convert("RGBA")
        alpha = image.getchannel("A")
        alpha_min, alpha_max = alpha.getextrema()
        threshold_mask = alpha.point(
            lambda value: 255 if value >= ALPHA_SUBJECT_THRESHOLD else 0
        )
        bounds = threshold_mask.getbbox()

        result = {
            "path": str(path),
            "width": image.width,
            "height": image.height,
            "alpha": {
                "min": alpha_min,
                "max": alpha_max,
                "subjectThreshold": ALPHA_SUBJECT_THRESHOLD,
            },
            "subjectBounds": None,
        }

        if bounds is not None:
            left, top, right, bottom = bounds
            baseline = wheel_contact_baseline(threshold_mask, bounds)
            result["subjectBounds"] = {
                "left": left,
                "top": top,
                "right": right,
                "bottom": bottom,
                "leftSafetyPercent": rounded_percent(left, image.width),
                "rightSafetyPercent": rounded_percent(image.width - right, image.width),
                "topSafetyPercent": rounded_percent(top, image.height),
                "baselinePercent": rounded_percent(baseline, image.height),
                "subjectBottomPercent": rounded_percent(bottom, image.height),
                "subjectWidthPercent": rounded_percent(right - left, image.width),
                "subjectHeightPercent": rounded_percent(bottom - top, image.height),
            }

        return result


def verify_manifest(manifest_path: Path) -> None:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    repo_root = Path(__file__).resolve().parent.parent
    public_root = (repo_root / manifest.get("publicRoot", "apps/web/public")).resolve()
    expected_threshold = manifest.get("pixelValidation", {}).get("alphaSubjectThreshold")
    if expected_threshold != ALPHA_SUBJECT_THRESHOLD:
        raise ValueError(
            f"manifest alpha threshold {expected_threshold} differs from inspector {ALPHA_SUBJECT_THRESHOLD}"
        )

    failures: list[str] = []
    checked = 0
    metric_fields = (
        "leftSafetyPercent",
        "rightSafetyPercent",
        "topSafetyPercent",
        "baselinePercent",
        "subjectWidthPercent",
        "subjectHeightPercent",
    )

    for product in manifest.get("products", []):
        for selection_class, entry in product.get("selectionDependent", {}).items():
            if entry.get("status") == "missing":
                continue
            families = entry.get("families") or [entry]
            for family in families:
                for asset in family.get("assets", []):
                    label = f"{product['productId']}.{selection_class}.{family.get('variant')}.{asset.get('theme')}.w{asset.get('width')}"
                    asset_path = (public_root / asset["path"].lstrip("/")).resolve()
                    metrics = inspect_image(str(asset_path))
                    checked += 1
                    alpha_mode = asset.get("alphaMode")

                    if alpha_mode == "transparent":
                        recorded = asset.get("pixelMetrics") or {}
                        if metrics["alpha"]["min"] != 0 or metrics["alpha"]["max"] != 255:
                            failures.append(f"{label}: expected full alpha range 0..255")
                        if recorded.get("subjectThreshold") != ALPHA_SUBJECT_THRESHOLD:
                            failures.append(f"{label}: missing alpha threshold {ALPHA_SUBJECT_THRESHOLD}")
                        if recorded.get("alphaMin") != metrics["alpha"]["min"] or recorded.get("alphaMax") != metrics["alpha"]["max"]:
                            failures.append(f"{label}: recorded alpha extrema differ from delivered pixels")
                        expected_bounds = recorded.get("subjectBounds") or {}
                        actual_bounds = metrics.get("subjectBounds") or {}
                        for field in metric_fields:
                            if not math.isclose(
                                float(expected_bounds.get(field, math.inf)),
                                float(actual_bounds.get(field, -math.inf)),
                                abs_tol=0.0001,
                            ):
                                failures.append(
                                    f"{label}: {field} recorded {expected_bounds.get(field)}; actual {actual_bounds.get(field)}"
                                )
                    elif alpha_mode == "opaque":
                        if metrics["alpha"]["min"] != 255 or metrics["alpha"]["max"] != 255:
                            failures.append(f"{label}: opaque poster contains transparency")
                    else:
                        failures.append(f"{label}: alphaMode must be transparent or opaque")

    if failures:
        raise ValueError("pixel contract failed:\n- " + "\n- ".join(failures))
    print("Configurator pixel validation PASSED")
    print(f"- delivered custom assets decoded: {checked}")
    print(f"- alpha subject threshold: {ALPHA_SUBJECT_THRESHOLD}")


def main() -> None:
    if len(sys.argv) == 3 and sys.argv[1] == "--verify-manifest":
        verify_manifest(Path(sys.argv[2]).resolve())
        return
    if len(sys.argv) != 1:
        raise ValueError("usage: inspect-configurator-images.py [--verify-manifest manifest.json]")
    payload = json.load(sys.stdin)
    if not isinstance(payload, list) or not all(isinstance(item, str) for item in payload):
        raise ValueError("stdin must be a JSON array of image paths")
    json.dump([inspect_image(item) for item in payload], sys.stdout)


if __name__ == "__main__":
    main()

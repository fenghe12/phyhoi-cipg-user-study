#!/usr/bin/env python3
"""Create the public study manifest without internal paths or answer-bearing prompts."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


STUDY_PROMPTS = {
    "bamboo_cutting": "A person cuts a bamboo or woven plant material.",
    "beer_pouring": "A person pours beer into a container.",
    "brick_smashing": "A person strikes or breaks a masonry object by hand.",
    "car_wash": "A person washes a vehicle with visible foam or water.",
    "drawer_table": "A person opens a drawer, compartment, or folding surface.",
    "fabric_folding": "A person folds or arranges fabric.",
    "foamy_beverage": "A person pours a foamy or carbonated drink.",
    "fried_food": "A person retrieves fried food from hot oil.",
    "glass_breaking": "A person strikes and breaks glass.",
    "granular_material": "A person digs, cuts, or moves granular material.",
    "hair_styling": "A person arranges, ties, or braids hair.",
    "ignition": "A person lights or ignites an object.",
    "meat_cutting": "A person cuts or saws meat.",
    "plant_leaves": "A person picks or eats a plant leaf.",
    "plant_watering": "A person waters or sprays a plant.",
    "smoke": "A human-object interaction involves visible smoke.",
    "smoke_diffusion": "Smoke disperses through the surrounding air.",
    "smoke_emission": "A human-object interaction produces visible smoke.",
    "sparks": "A human-object interaction produces visible sparks.",
    "sports": "A person strikes or propels sports equipment.",
    "throw_catch": "A person throws and catches an object.",
    "vegetable_cutting": "A person cuts a vegetable or fruit.",
    "vehicle_opening": "A person opens a vehicle door or compartment.",
    "watermelon_cutting": "A person cuts a watermelon.",
    "writing_surface": "A person writes or draws on a surface.",
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("data/selected_300.json"))
    parser.add_argument("--output", type=Path, default=Path("data/samples.json"))
    args = parser.parse_args()

    source = json.loads(args.input.read_text())
    samples = []
    for item in source["samples"]:
        samples.append(
            {
                "sample_id": item["study_id"],
                "media_id": item["sample_id"],
                "category": item["category"],
                "category_label": item["category_label"],
                "study_prompt": STUDY_PROMPTS[item["category"]],
                "video": f"./{item['media_file']}",
                "activation": item.get("activation", {}),
            }
        )

    public_manifest = {
        "schema_version": "phyhoi-study-manifest-v1",
        "title": source["title"],
        "metric": source["metric"],
        "sample_total": len(samples),
        "samples": samples,
    }
    args.output.write_text(json.dumps(public_manifest, ensure_ascii=True, indent=2) + "\n")
    print(f"Wrote {len(samples)} samples to {args.output}")


if __name__ == "__main__":
    main()

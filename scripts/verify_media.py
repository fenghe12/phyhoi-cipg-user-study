#!/usr/bin/env python3
"""Validate every selected study video with ffprobe and a full ffmpeg decode."""

from __future__ import annotations

import argparse
import csv
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


def parse_rate(value: str) -> float:
    numerator, denominator = value.split("/", 1)
    return float(numerator) / float(denominator) if float(denominator) else 0.0


def inspect_video(video_path: Path) -> dict:
    probe = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=codec_name,width,height,avg_frame_rate,nb_frames:format=duration,size",
            "-of",
            "json",
            str(video_path),
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    record = {
        "file": video_path.name,
        "path": str(video_path),
        "probe_ok": probe.returncode == 0,
        "decode_ok": False,
        "error": probe.stderr.strip(),
    }
    if probe.returncode != 0:
        return record

    payload = json.loads(probe.stdout)
    streams = payload.get("streams", [])
    if not streams:
        record["error"] = "No video stream"
        return record

    stream = streams[0]
    media_format = payload.get("format", {})
    record.update(
        {
            "codec": stream.get("codec_name"),
            "width": int(stream.get("width") or 0),
            "height": int(stream.get("height") or 0),
            "fps": round(parse_rate(stream.get("avg_frame_rate", "0/1")), 4),
            "frames": int(stream["nb_frames"]) if stream.get("nb_frames", "").isdigit() else None,
            "duration_seconds": round(float(media_format.get("duration") or 0), 4),
            "size_bytes": int(media_format.get("size") or video_path.stat().st_size),
        }
    )

    decode = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(video_path), "-map", "0:v:0", "-f", "null", "-"],
        check=False,
        capture_output=True,
        text=True,
    )
    record["decode_ok"] = decode.returncode == 0
    if decode.returncode != 0:
        record["error"] = decode.stderr.strip()
    return record


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path("data/selected_300.json"))
    parser.add_argument("--media-dir", type=Path, default=Path("media"))
    parser.add_argument("--json-output", type=Path, default=Path("data/media_verification.json"))
    parser.add_argument("--csv-output", type=Path, default=Path("data/media_verification.csv"))
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text())
    samples = manifest["samples"]
    expected = {Path(sample["media_file"]).name for sample in samples}
    actual = {path.name for path in args.media_dir.glob("*.mp4")}

    if expected != actual:
        missing = sorted(expected - actual)
        extra = sorted(actual - expected)
        raise SystemExit(f"Media mismatch. Missing={missing}; extra={extra}")

    records = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(inspect_video, args.media_dir / filename): filename
            for filename in sorted(expected)
        }
        for index, future in enumerate(as_completed(futures), 1):
            record = future.result()
            records.append(record)
            status = "ok" if record["probe_ok"] and record["decode_ok"] else "failed"
            print(f"[{index:03d}/{len(futures)}] {record['file']} {status}", flush=True)

    records.sort(key=lambda item: item["file"])
    failures = [
        record
        for record in records
        if not record["probe_ok"]
        or not record["decode_ok"]
        or record.get("width", 0) <= 0
        or record.get("height", 0) <= 0
        or record.get("duration_seconds", 0) <= 0
    ]
    report = {
        "sample_total": len(samples),
        "verified_total": len(records),
        "failure_total": len(failures),
        "total_size_bytes": sum(record.get("size_bytes", 0) for record in records),
        "records": records,
    }
    args.json_output.write_text(json.dumps(report, ensure_ascii=True, indent=2) + "\n")

    fieldnames = [
        "file",
        "codec",
        "width",
        "height",
        "fps",
        "frames",
        "duration_seconds",
        "size_bytes",
        "probe_ok",
        "decode_ok",
        "error",
    ]
    with args.csv_output.open("w", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=fieldnames,
            extrasaction="ignore",
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(records)

    print(
        json.dumps(
            {
                "sample_total": report["sample_total"],
                "failure_total": report["failure_total"],
                "total_size_bytes": report["total_size_bytes"],
            }
        )
    )
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

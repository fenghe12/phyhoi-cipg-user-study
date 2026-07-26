# PhyHOI-Bench user study

Static GitHub Pages study interface for collecting CIPG node-wise judgments.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Data layout

- `data/samples.json`: final reviewed 300-video manifest.
- `media/<sample_id>.mp4`: reviewed LTX videos.
- `config.js`: manifest path, assignment size, and optional result endpoint.

The static site saves progress in browser local storage and exports JSON/CSV.
Each export contains raw verdicts, causally gated verdicts, per-node evidence
notes, the first failed node, and the per-video CIPG score.
Set `submissionEndpoint` in `config.js` when a collection backend is available.

## Media verification

```bash
python3 scripts/verify_media.py --workers 8
```

The generated `data/media_verification.json` and CSV record codec, resolution,
frame rate, duration, size, probe status, and full-decode status for all videos.

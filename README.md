# PhyHOI-Bench user study

Static GitHub Pages interface for the PhyHOI-Bench human-alignment study.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Data layout

- `data/samples.json`: final reviewed 300-video manifest.
- `media/<sample_id>.mp4`: reviewed LTX videos.
- `config.js`: manifest path, planned method quotas, and optional result endpoint.

Every participant receives all 300 videos in a deterministic, independently
randomized order. The interface first collects a 1--5 overall physical-
plausibility rating and then independent Yes/No/Unobservable labels for every
active D0--D6 node. Causal gating is applied only in the exported post-processed
labels; the raw human labels are retained.

The static site saves progress in browser local storage and exports JSON/CSV.
The anonymous internal session identifier is never shown in the interface.
Set `submissionEndpoint` in `config.js` when a collection backend is available.

The method quota entries for LongCat-Video-Avatar and InteractAvatar are
explicit placeholders. Do not begin the formal study until the reviewed
100-video sets for all three methods have replaced the staging manifest.

## Media verification

```bash
python3 scripts/verify_media.py --workers 8
```

The generated `data/media_verification.json` and CSV record codec, resolution,
frame rate, duration, size, probe status, and full-decode status for all videos.

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

The static site automatically saves every selection in browser local storage.
Refreshing or reopening the page in the same browser restores the randomized
assignment, current video, partial answers, and completion state. The final
page exports one JSON result file whose filename contains the anonymous
internal session identifier. The identifier is never shown in the interface.
During the study, participants may also export an in-progress JSON checkpoint.
The checkpoint contains only started response records and reports the completed,
assigned, and current video counts. Exporting a checkpoint does not alter the
browser's saved progress or the final result format.

The method quota entries for LongCat-Video-Avatar and InteractAvatar are
explicit placeholders. Do not begin the formal study until the reviewed
100-video sets for all three methods have replaced the staging manifest.

## Media verification

```bash
python3 scripts/verify_media.py --workers 8
```

The generated `data/media_verification.json` and CSV record codec, resolution,
frame rate, duration, size, probe status, and full-decode status for all videos.

## Independent overall-rating review (2026-10-30)

The original entry above remains the D0–D6 study. The new local review entry is
[holistic.html](./holistic.html). It contains all 300 current videos with complete
Chinese, English, and Japanese case-specific guidance and five rating descriptions.
Every case has six numbered detailed instructions covering the task, body action,
contact, object changes, consequences, and the overall decision with its own
insufficient-information condition. It
reuses the original page's stylesheet, colors, header, language controls, and
progress components. A case selector supports direct inspection of any entry.

This entry is marked **author acceptance, not formal collection**. It collects
one direct 1–5 rating or “Unable to judge”, with no selected default. An answered
unknown is saved as `answered: true, score: null`; an unanswered case is saved as
`answered: false, score: null`. Playback coverage must reach 95%, including the
beginning and end, before answering. This does not establish attention or
frame-perfect viewing. Progress, reasons, viewing ranges, and language are saved
under a separate browser storage name. No node labels or automatic scores are
read by the new page.

- `holistic_data.js`: 300 trilingual records, P001–P300, using the current media.
- `data/holistic_allocation.json` and CSV: separate 10-person allocation, 150 cases
  per person and 5 assignments per video, independently randomized orders and
  50-case segments. This does not alter the older method/category allocation.
- `holistic.html?participant=H01` through `H10`: assignment previews, still marked
  as author review and saved separately from the full review and old study.
- `data/holistic_response_schema.json`: overall-rating review export structure.
- `study_work/逐条工作清单.csv` and `study_work/内容来源记录.json`: per-case internal
  sources and review status; these are not loaded by the participant page.
- `study_work/内容来源与检查.md`: actual checks and remaining browser acceptance.

All 300 complete temporal frame sheets were inspected and all content fields,
IDs, paths, and allocation counts were checked. JavaScript syntax and
source-level event simulations passed. Actual browser rendering, playback,
downloads, refresh, and narrow-screen acceptance have **not** been completed:
the browser tool rejected access to the local entry. Source simulations are not
reported as browser acceptance. No formal participant results or correlations
have been created. The user authorized publishing this trilingual update to the existing GitHub
repository. The entry remains a review page; formal collection has not started.

The Japanese authoring source contains 276 independently written task profiles
and 24 exact shared-task translations. The build requires all 300 cases in all
three languages and does not fall back to Chinese or English when Japanese is
selected. Answer language is retained in the export, including `ja`. Older
answers keep their recorded content version rather than being relabeled as v3.

Public entry after the GitHub Pages update:
[Overall-rating page](https://fenghe12.github.io/phyhoi-cipg-user-study/holistic.html).

const NODE_DEFINITIONS = [
  ["D0", "Object Integrity", "Objects and people remain identifiable and structurally consistent."],
  ["D1", "Contact", "Required contact or support is physically established."],
  ["D2", "Contact Region", "The force acts on the correct functional surface or region."],
  ["D3", "Kinematic Execution", "The action mechanism and completion are physically valid."],
  ["D4", "Causal Physical Effect", "The action produces the expected visible physical effect."],
  ["D5", "Temporal Persistence", "The effect appears, persists, dissipates, or rebounds in a valid order."],
  ["D6", "Human Biomechanical Response", "Posture and body response are consistent with the applied force."],
];

const DESCENDANTS = {
  D0: ["D1", "D2", "D3", "D4", "D5", "D6"],
  D1: ["D2", "D3", "D4", "D5", "D6"],
  D2: ["D3", "D4", "D5", "D6"],
  D3: ["D4", "D5", "D6"],
  D4: ["D5"],
  D5: [],
  D6: [],
};

const state = {
  manifest: null,
  assignment: [],
  ratings: {},
  participantId: "",
  currentIndex: 0,
  startedAt: null,
};

const $ = (selector) => document.querySelector(selector);

function anonymousCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint8Array(8));
  return `P-${Array.from(values, (value) => alphabet[value % alphabet.length]).join("")}`;
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function balancedAssignment(samples, count, participantId) {
  const random = seededRandom(hashString(participantId));
  const byCategory = new Map();
  samples.forEach((sample) => {
    if (!byCategory.has(sample.category)) byCategory.set(sample.category, []);
    byCategory.get(sample.category).push(sample);
  });
  const queues = shuffle(
    Array.from(byCategory.values(), (items) => shuffle(items, random)),
    random,
  );
  const selected = [];
  while (selected.length < count && queues.some((queue) => queue.length)) {
    queues.forEach((queue) => {
      if (selected.length < count && queue.length) selected.push(queue.shift());
    });
  }
  return shuffle(selected, random);
}

function recordKey() {
  return `phyhoi-study:${state.participantId}`;
}

function savedRecord() {
  try {
    return JSON.parse(localStorage.getItem(recordKey()) || "null");
  } catch {
    return null;
  }
}

function persist() {
  if (!state.participantId) return;
  localStorage.setItem(
    recordKey(),
    JSON.stringify({
      participantId: state.participantId,
      assignmentIds: state.assignment.map((sample) => sample.sample_id),
      ratings: state.ratings,
      currentIndex: state.currentIndex,
      startedAt: state.startedAt,
    }),
  );
  $("#saveState").textContent = "Saved locally";
}

function blockedNodes(verdicts, active) {
  const blocked = new Set();
  NODE_DEFINITIONS.forEach(([node]) => {
    if (!active[node]) return;
    if (verdicts[node] === "no") {
      DESCENDANTS[node].forEach((descendant) => blocked.add(descendant));
    }
  });
  return blocked;
}

function activeMap(sample) {
  const activation = sample.activation || {};
  const hasExplicitActivation = Object.keys(activation).length > 0;
  return Object.fromEntries(
    NODE_DEFINITIONS.map(([node]) => [node, hasExplicitActivation ? Boolean(activation[node]) : true]),
  );
}

function currentRating() {
  const sample = state.assignment[state.currentIndex];
  if (!state.ratings[sample.sample_id]) {
    state.ratings[sample.sample_id] = {
      verdicts: {},
      reasons: {},
      viewedAt: new Date().toISOString(),
    };
  }
  if (!state.ratings[sample.sample_id].reasons) {
    state.ratings[sample.sample_id].reasons = {};
  }
  return state.ratings[sample.sample_id];
}

function firstFailedNode(verdicts, active) {
  return NODE_DEFINITIONS.map(([node]) => node).find(
    (node) => active[node] && verdicts[node] === "no",
  );
}

function renderNodes() {
  const sample = state.assignment[state.currentIndex];
  const rating = currentRating();
  const active = activeMap(sample);
  const blocked = blockedNodes(rating.verdicts, active);
  const container = $("#nodeList");
  container.innerHTML = "";

  NODE_DEFINITIONS.forEach(([node, name, description]) => {
    const row = document.createElement("div");
    row.className = "node-row";
    const isActive = active[node];
    const isBlocked = blocked.has(node);
    const verdict = rating.verdicts[node];
    if (!isActive) row.classList.add("inactive");
    if (isBlocked) row.classList.add("blocked");

    const copy = document.createElement("div");
    copy.innerHTML = `
      <div class="node-name"><b>${node}</b><span>${name}</span></div>
      <div class="node-description">${description}</div>
    `;
    row.appendChild(copy);

    if (!isActive || isBlocked) {
      const label = document.createElement("div");
      label.className = "blocked-label";
      label.textContent = isActive ? "Blocked by an upstream failure" : "Not active for this scenario";
      row.appendChild(label);
    } else {
      const control = document.createElement("div");
      control.className = "verdict-control";
      [
        ["yes", "Yes"],
        ["no", "No"],
        ["unobservable", "Unobservable"],
      ].forEach(([value, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.value = value;
        button.textContent = label;
        if (rating.verdicts[node] === value) button.classList.add("selected");
        button.addEventListener("click", () => {
          if (rating.verdicts[node] !== value) delete rating.reasons[node];
          rating.verdicts[node] = value;
          const newlyBlocked = blockedNodes(rating.verdicts, active);
          newlyBlocked.forEach((blockedNode) => {
            delete rating.verdicts[blockedNode];
            delete rating.reasons[blockedNode];
          });
          renderNodes();
          persist();
        });
        control.appendChild(button);
      });
      row.appendChild(control);

      if (verdict) {
        const reason = document.createElement("label");
        reason.className = "node-reason";
        const requirement = verdict === "yes" ? "optional" : "required";
        reason.innerHTML = `
          <span>Visible evidence <small>${requirement}</small></span>
          <input
            type="text"
            maxlength="240"
            value="${escapeHtml(rating.reasons[node] || "")}"
            placeholder="${verdict === "yes" ? "Optional supporting evidence" : "Briefly describe the visible evidence"}"
          >
        `;
        reason.querySelector("input").addEventListener("input", (event) => {
          rating.reasons[node] = event.target.value;
          persist();
        });
        row.appendChild(reason);
      }
    }
    container.appendChild(row);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function promptForStudy(sample) {
  return sample.study_prompt || sample.category_label || sample.prompt || "";
}

function renderCurrent() {
  const sample = state.assignment[state.currentIndex];
  const rating = currentRating();
  $("#sampleIndex").textContent = `Video ${state.currentIndex + 1} of ${state.assignment.length}`;
  $("#sampleCategory").textContent = sample.category_label;
  $("#samplePrompt").textContent = promptForStudy(sample);
  $("#studyVideo").src = sample.video;
  $("#studyVideo").load();
  $("#previousButton").disabled = state.currentIndex === 0;
  $("#nextButton").innerHTML =
    state.currentIndex === state.assignment.length - 1
      ? 'Complete study <i data-lucide="check"></i>'
      : 'Save and continue <i data-lucide="arrow-right"></i>';
  renderNodes();
  updateProgress();
  if (window.lucide) lucide.createIcons();
}

function requiredNodesAnswered(sample, rating) {
  const active = activeMap(sample);
  const blocked = blockedNodes(rating.verdicts, active);
  return NODE_DEFINITIONS.every(([node]) => (
    !active[node] || blocked.has(node) || Boolean(rating.verdicts[node])
  ));
}

function ratingComplete(sample, rating) {
  if (!rating || !requiredNodesAnswered(sample, rating)) return false;
  const active = activeMap(sample);
  const blocked = blockedNodes(rating.verdicts, active);
  return NODE_DEFINITIONS.every(([node]) => {
    const verdict = rating.verdicts[node];
    return (
      !active[node]
      || blocked.has(node)
      || verdict === "yes"
      || (verdict && Boolean((rating.reasons?.[node] || "").trim()))
    );
  });
}

function validateCurrent() {
  const sample = state.assignment[state.currentIndex];
  const rating = currentRating();
  if (!requiredNodesAnswered(sample, rating)) {
    $("#saveState").textContent = "Complete all visible nodes";
    return false;
  }
  const active = activeMap(sample);
  const blocked = blockedNodes(rating.verdicts, active);
  for (const [node] of NODE_DEFINITIONS) {
    const verdict = rating.verdicts[node];
    if (
      active[node]
      && !blocked.has(node)
      && verdict
      && verdict !== "yes"
      && !(rating.reasons[node] || "").trim()
    ) {
      const input = document.querySelector(`.node-row:nth-child(${Number(node.slice(1)) + 1}) .node-reason input`);
      input?.focus();
      $("#saveState").textContent = `Add visible evidence for ${node}`;
      return false;
    }
  }
  return true;
}

function updateProgress() {
  const completed = state.assignment.filter((sample) => {
    const rating = state.ratings[sample.sample_id];
    return ratingComplete(sample, rating);
  }).length;
  $("#progressLabel").textContent = `${completed} / ${state.assignment.length}`;
  $("#progressFill").style.width = `${state.assignment.length ? (completed / state.assignment.length) * 100 : 0}%`;
}

function resultPayload() {
  const assignments = state.assignment.map((sample, order) => {
    const rating = state.ratings[sample.sample_id] || { verdicts: {}, reasons: {} };
    const active = activeMap(sample);
    const blocked = blockedNodes(rating.verdicts, active);
    const effectiveVerdicts = Object.fromEntries(
      NODE_DEFINITIONS.map(([node]) => {
        if (!active[node]) return [node, "inactive"];
        if (blocked.has(node)) return [node, "gated_no"];
        return [node, rating.verdicts[node] || null];
      }),
    );
    const scored = Object.values(effectiveVerdicts).filter(
      (verdict) => verdict === "yes" || verdict === "no" || verdict === "gated_no",
    );
    const passed = scored.filter((verdict) => verdict === "yes").length;
    return {
      order,
      sample_id: sample.sample_id,
      media_id: sample.media_id,
      category: sample.category,
      raw_verdicts: rating.verdicts,
      effective_verdicts: effectiveVerdicts,
      reasons: rating.reasons || {},
      first_failed_node: firstFailedNode(rating.verdicts, active) || null,
      cipg_score: scored.length ? Number((passed / scored.length).toFixed(6)) : null,
    };
  });
  const dimensionPassRates = Object.fromEntries(
    NODE_DEFINITIONS.map(([node]) => {
      const verdicts = assignments
        .map((item) => item.effective_verdicts[node])
        .filter((verdict) => verdict === "yes" || verdict === "no" || verdict === "gated_no");
      const passed = verdicts.filter((verdict) => verdict === "yes").length;
      return [node, verdicts.length ? Number((passed / verdicts.length).toFixed(6)) : null];
    }),
  );
  const videoScores = assignments
    .map((item) => item.cipg_score)
    .filter((score) => score !== null);
  return {
    schema_version: "phyhoi-user-study-v2",
    participant_id: state.participantId,
    started_at: state.startedAt,
    completed_at: new Date().toISOString(),
    summary: {
      dimension_pass_rates: dimensionPassRates,
      overall_cipg_score: videoScores.length
        ? Number((videoScores.reduce((sum, score) => sum + score, 0) / videoScores.length).toFixed(6))
        : null,
    },
    assignment: assignments,
  };
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toCsv(payload) {
  const nodeColumns = NODE_DEFINITIONS.flatMap(([node]) => [`${node}_verdict`, `${node}_reason`]);
  const rows = [["participant_id", "order", "sample_id", "media_id", "category", ...nodeColumns, "first_failed_node", "cipg_score"]];
  payload.assignment.forEach((item) => {
    rows.push([
      payload.participant_id,
      item.order + 1,
      item.sample_id,
      item.media_id,
      item.category,
      ...NODE_DEFINITIONS.flatMap(([node]) => [
        item.effective_verdicts[node] || "",
        item.reasons[node] || "",
      ]),
      item.first_failed_node || "",
      item.cipg_score ?? "",
    ]);
  });
  return rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
}

function completeStudy() {
  persist();
  $("#studyView").hidden = true;
  $("#completeView").hidden = false;
  $("#completionSummary").textContent =
    `${state.assignment.length} videos were rated under participant code ${state.participantId}.`;
  const endpoint = window.PHYHOI_CONFIG?.submissionEndpoint;
  $("#submitResults").hidden = !endpoint;
  updateProgress();
  if (window.lucide) lucide.createIcons();
}

async function submitResults() {
  const endpoint = window.PHYHOI_CONFIG?.submissionEndpoint;
  if (!endpoint) return;
  const button = $("#submitResults");
  button.disabled = true;
  $("#submitStatus").textContent = "Submitting...";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultPayload()),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    $("#submitStatus").textContent = "Responses submitted.";
  } catch (error) {
    $("#submitStatus").textContent = `Submission failed: ${error.message}`;
    button.disabled = false;
  }
}

async function initialize() {
  $("#participantId").value = localStorage.getItem("phyhoi-study:last-participant") || anonymousCode();
  const manifestPath = window.PHYHOI_CONFIG?.sampleManifest || "./data/samples.json";
  const response = await fetch(manifestPath);
  if (!response.ok) throw new Error(`Unable to load sample manifest: ${response.status}`);
  state.manifest = await response.json();
  $("#sampleCount").value = String(window.PHYHOI_CONFIG?.defaultAssignmentSize || 30);

  $("#setupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.participantId = $("#participantId").value.trim();
    localStorage.setItem("phyhoi-study:last-participant", state.participantId);
    const saved = savedRecord();
    if (saved?.assignmentIds?.length) {
      const byId = new Map(state.manifest.samples.map((sample) => [sample.sample_id, sample]));
      state.assignment = saved.assignmentIds.map((id) => byId.get(id)).filter(Boolean);
      if (state.assignment.length) {
        state.ratings = saved.ratings || {};
        state.currentIndex = Math.min(saved.currentIndex || 0, state.assignment.length - 1);
        state.startedAt = saved.startedAt || new Date().toISOString();
      }
    }
    if (!state.assignment.length) {
      const count = Math.min(Number($("#sampleCount").value), state.manifest.samples.length);
      state.assignment = balancedAssignment(state.manifest.samples, count, state.participantId);
      state.ratings = {};
      state.currentIndex = 0;
      state.startedAt = new Date().toISOString();
    }
    $("#setupView").hidden = true;
    $("#studyView").hidden = false;
    renderCurrent();
    persist();
  });

  $("#regenerateId").addEventListener("click", () => {
    $("#participantId").value = anonymousCode();
  });
  $("#replayButton").addEventListener("click", () => {
    $("#studyVideo").currentTime = 0;
    $("#studyVideo").play();
  });
  $("#previousButton").addEventListener("click", () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderCurrent();
      persist();
    }
  });
  $("#ratingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateCurrent()) return;
    if (state.currentIndex === state.assignment.length - 1) {
      completeStudy();
      return;
    }
    state.currentIndex += 1;
    renderCurrent();
    persist();
  });
  $("#downloadJson").addEventListener("click", () => {
    download(
      `${state.participantId}.json`,
      JSON.stringify(resultPayload(), null, 2),
      "application/json",
    );
  });
  $("#downloadCsv").addEventListener("click", () => {
    download(`${state.participantId}.csv`, toCsv(resultPayload()), "text/csv");
  });
  $("#submitResults").addEventListener("click", submitResults);
  if (window.lucide) lucide.createIcons();
}

initialize().catch((error) => {
  document.body.innerHTML = `<main><h1>Study unavailable</h1><p>${error.message}</p></main>`;
});

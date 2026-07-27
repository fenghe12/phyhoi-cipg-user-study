const NODE_DEFINITIONS = [
  {
    id: "D0",
    name: { en: "Object Integrity", zh: "对象完整性" },
    description: {
      en: "Do the person and objects remain recognizable, intact, and consistent over time?",
      zh: "人物与物体是否始终可识别、完整，并保持前后一致？",
    },
  },
  {
    id: "D1",
    name: { en: "Contact", zh: "接触有效性" },
    description: {
      en: "Does the contact or support required by the action actually occur?",
      zh: "动作所需的接触或支撑是否实际发生？",
    },
  },
  {
    id: "D2",
    name: { en: "Contact Region", zh: "接触区域" },
    description: {
      en: "Does contact occur on the correct functional part or surface?",
      zh: "接触是否发生在正确的功能部位或表面？",
    },
  },
  {
    id: "D3",
    name: { en: "Kinematic Execution", zh: "运动学执行" },
    description: {
      en: "Is the action performed and completed with physically possible body and object motion?",
      zh: "动作是否通过物理上可能的人体与物体运动执行并完成？",
    },
  },
  {
    id: "D4",
    name: { en: "Causal Physical Effect", zh: "因果物理效应" },
    description: {
      en: "Does the action visibly produce the expected physical result?",
      zh: "动作是否明显产生预期的物理结果？",
    },
  },
  {
    id: "D5",
    name: { en: "Temporal Persistence", zh: "时序与持续性" },
    description: {
      en: "Does the result appear at the correct time and persist, dissipate, or rebound naturally?",
      zh: "结果是否在正确时间出现，并自然地持续、消退或回弹？",
    },
  },
  {
    id: "D6",
    name: { en: "Human Biomechanical Response", zh: "人体生物力学响应" },
    description: {
      en: "Do posture, joint motion, effort, recoil, and balance match the applied force?",
      zh: "人体姿态、关节运动、用力、反冲与平衡是否同作用力相符？",
    },
  },
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

const PROMPT_ZH = {
  bamboo_cutting: "一名人物正在切割竹子或编织植物材料。",
  beer_pouring: "一名人物正在将啤酒倒入容器。",
  brick_smashing: "一名人物徒手击打或破坏砖块等砌体物体。",
  car_wash: "一名人物正在使用可见泡沫或水清洗车辆。",
  drawer_table: "一名人物正在打开抽屉、储物格或折叠台面。",
  fabric_folding: "一名人物正在折叠或整理织物。",
  foamy_beverage: "一名人物正在倾倒泡沫或碳酸饮料。",
  fried_food: "一名人物正在从热油中捞取油炸食物。",
  glass_breaking: "一名人物正在击打并破坏玻璃。",
  granular_material: "一名人物正在挖掘、切削或移动颗粒材料。",
  hair_styling: "一名人物正在整理、扎起或编织头发。",
  ignition: "一名人物正在点燃物体。",
  meat_cutting: "一名人物正在切割或锯开肉类。",
  plant_leaves: "一名人物正在摘取或食用植物叶片。",
  plant_watering: "一名人物正在给植物浇水或喷水。",
  smoke: "人体-物体交互过程中出现了可见烟雾。",
  smoke_diffusion: "烟雾正在周围空气中扩散。",
  smoke_emission: "人体-物体交互过程产生了可见烟雾。",
  sparks: "人体-物体交互过程产生了可见火花。",
  sports: "一名人物正在击打或推动运动器材。",
  throw_catch: "一名人物正在抛出并接住物体。",
  vegetable_cutting: "一名人物正在切割蔬菜或水果。",
  vehicle_opening: "一名人物正在打开车门或车辆储物空间。",
  watermelon_cutting: "一名人物正在切割西瓜。",
  writing_surface: "一名人物正在板面或玻璃表面书写或绘画。",
};

const TRANSLATIONS = {
  en: {
    languageLabel: "Language / 语言",
    studyTitle: "Human Physical-Plausibility Study",
    notStarted: "Not started",
    anonymousEvaluation: "Anonymous blinded evaluation",
    setupHeading: "Physical plausibility of generated human-object interactions",
    setupIntro: "You will evaluate 300 generated videos. The generating method, automatic scores, and reference answers are concealed. Video order is randomized.",
    protocolHeading: "Evaluation protocol",
    protocolWatch: "Watch the complete video before rating it.",
    protocolLikert: "Rate overall physical plausibility from 1 to 5.",
    protocolNodes: "Label every listed D0-D6 node using only visible evidence.",
    protocolSessions: "You may complete the study in multiple sessions; progress is stored in this browser.",
    yes: "Yes",
    no: "No",
    unobservable: "Unobservable",
    unobservableShort: "U",
    yesDefinition: "physically valid",
    noDefinition: "visible physical violation",
    unobservableDefinition: "insufficient visible evidence",
    videos: "videos",
    categories: "interaction categories",
    dimensions: "CIPG dimensions",
    consent: "I consent to the anonymous research use of these ratings.",
    startEvaluation: "Start evaluation",
    continueEvaluation: "Continue evaluation",
    instructions: "Evaluation instructions",
    instructionScope: "Judge physical plausibility only, not visual quality, aesthetics, or prompt alignment. The guide defines all D0-D6 dimensions; the response form shows only dimensions relevant to this interaction.",
    instructionWatch: "Watch the complete video at least once before answering.",
    instructionRate: "Rate overall physical plausibility from 1 to 5: 1 means evidently implausible and 5 means physically plausible.",
    instructionLabel: "Then answer each displayed dimension independently; do not infer one answer from another dimension.",
    instructionEvidence: "Yes = physically valid; No = a visible violation; Unobservable = insufficient visible evidence. Do not infer events that are not shown.",
    blinded: "Method and automatic results hidden",
    scenario: "Scenario",
    overallPlausibility: "Overall physical plausibility",
    likertPrompt: "How physically plausible is the complete interaction process?",
    evidentlyImplausible: "Evidently implausible",
    physicallyPlausible: "Physically plausible",
    cipgDimensions: "CIPG dimensions",
    nodeVerdicts: "Node-wise judgments",
    rateOverallFirst: "Select the overall rating first",
    replayVideo: "Replay video",
    previous: "Previous",
    saveContinue: "Save and continue",
    completeStudy: "Complete study",
    evaluationComplete: "Evaluation complete",
    downloadJson: "Download JSON",
    downloadCsv: "Download CSV",
    submitResponses: "Submit responses",
    savedLocally: "Saved in this browser",
    completeOverall: "Select an overall rating",
    completeNodes: "Label every listed node",
    videoOf: (current, total) => `Video ${current} of ${total}`,
    completionSummary: (total) => `${total} videos were evaluated. Download the response file before closing this page.`,
    submitting: "Submitting...",
    submitted: "Responses submitted.",
    submissionFailed: (message) => `Submission failed: ${message}`,
  },
  zh: {
    languageLabel: "语言 / Language",
    studyTitle: "人体-物体交互物理合理性人工评估",
    notStarted: "尚未开始",
    anonymousEvaluation: "匿名盲评",
    setupHeading: "生成式人体-物体交互视频的物理合理性评估",
    setupIntro: "你将评估 300 个生成视频。生成方法、自动评分结果和参考答案均被隐藏，视频顺序随机排列。",
    protocolHeading: "评估流程",
    protocolWatch: "完整观看视频后再开始评分。",
    protocolLikert: "使用 1–5 分评价视频整体物理合理性。",
    protocolNodes: "仅依据可见证据标注页面列出的 D0–D6 节点。",
    protocolSessions: "可分多次完成；进度会保存在当前浏览器中。",
    yes: "是",
    no: "否",
    unobservable: "不可观察",
    unobservableShort: "不可观察",
    yesDefinition: "符合物理规律",
    noDefinition: "存在可见物理违例",
    unobservableDefinition: "可见证据不足",
    videos: "个视频",
    categories: "类交互场景",
    dimensions: "个 CIPG 维度",
    consent: "我同意将这些匿名评分用于学术研究。",
    startEvaluation: "开始评估",
    continueEvaluation: "继续评估",
    instructions: "评估说明",
    instructionScope: "只判断物理合理性，不评价画质、美观程度或提示词一致性。下方定义完整 D0–D6；作答区只显示与当前交互相关的维度。",
    instructionWatch: "作答前至少完整观看一次视频。",
    instructionRate: "先评价整体物理合理性：1 分表示明显不合理，5 分表示符合物理规律。",
    instructionLabel: "再独立回答作答区显示的每个维度，不要根据其他维度的答案推断本维度。",
    instructionEvidence: "“是”表示符合物理规律；“否”表示存在可见违例；“不可观察”表示可见证据不足。不要推断视频未展示的事件。",
    blinded: "生成方法与自动评分结果已隐藏",
    scenario: "场景",
    overallPlausibility: "整体物理合理性",
    likertPrompt: "该视频中的完整交互过程在物理上是否合理？",
    evidentlyImplausible: "明显不符合物理规律",
    physicallyPlausible: "符合物理规律",
    cipgDimensions: "CIPG 评估维度",
    nodeVerdicts: "逐节点判断",
    rateOverallFirst: "请先完成整体评分",
    replayVideo: "重新播放视频",
    previous: "上一个",
    saveContinue: "保存并继续",
    completeStudy: "完成评估",
    evaluationComplete: "评估完成",
    downloadJson: "下载 JSON",
    downloadCsv: "下载 CSV",
    submitResponses: "提交结果",
    savedLocally: "已保存在当前浏览器",
    completeOverall: "请选择整体评分",
    completeNodes: "请标注页面列出的所有节点",
    videoOf: (current, total) => `第 ${current} / ${total} 个视频`,
    completionSummary: (total) => `已完成 ${total} 个视频的评估。关闭页面前请下载结果文件。`,
    submitting: "正在提交……",
    submitted: "结果已提交。",
    submissionFailed: (message) => `提交失败：${message}`,
  },
};

const state = {
  manifest: null,
  assignment: [],
  ratings: {},
  sessionId: "",
  currentIndex: 0,
  startedAt: null,
  language: localStorage.getItem("phyhoi-human-alignment:language") || "en",
};

const $ = (selector) => document.querySelector(selector);
const t = (key, ...args) => {
  const value = TRANSLATIONS[state.language]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
};

function anonymousCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
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

function randomizedAssignment(samples, sessionId) {
  return shuffle(samples, seededRandom(hashString(sessionId)));
}

function recordKey() {
  return `phyhoi-human-alignment:v3:${state.sessionId}`;
}

function savedRecord() {
  try {
    return JSON.parse(localStorage.getItem(recordKey()) || "null");
  } catch {
    return null;
  }
}

function persist() {
  if (!state.sessionId) return;
  localStorage.setItem(
    recordKey(),
    JSON.stringify({
      sessionId: state.sessionId,
      assignmentIds: state.assignment.map((sample) => sample.sample_id),
      ratings: state.ratings,
      currentIndex: state.currentIndex,
      startedAt: state.startedAt,
      language: state.language,
    }),
  );
  $("#saveState").textContent = t("savedLocally");
}

function activeMap(sample) {
  const activation = sample.activation || {};
  const hasExplicitActivation = Object.keys(activation).length > 0;
  return Object.fromEntries(
    NODE_DEFINITIONS.map(({ id }) => [id, hasExplicitActivation ? Boolean(activation[id]) : true]),
  );
}

function blockedNodes(verdicts, active) {
  const blocked = new Set();
  NODE_DEFINITIONS.forEach(({ id }) => {
    if (active[id] && verdicts[id] === "no") {
      DESCENDANTS[id].forEach((descendant) => {
        if (active[descendant]) blocked.add(descendant);
      });
    }
  });
  return blocked;
}

function currentRating() {
  const sample = state.assignment[state.currentIndex];
  if (!state.ratings[sample.sample_id]) {
    state.ratings[sample.sample_id] = {
      overallPlausibility: null,
      verdicts: {},
      viewedAt: new Date().toISOString(),
    };
  }
  return state.ratings[sample.sample_id];
}

function firstFailedNode(verdicts, active) {
  return NODE_DEFINITIONS.map(({ id }) => id).find(
    (node) => active[node] && verdicts[node] === "no",
  );
}

function renderLikert() {
  const rating = currentRating();
  const scale = $("#likertScale");
  scale.innerHTML = "";
  for (let value = 1; value <= 5; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "likert-button";
    button.textContent = String(value);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(rating.overallPlausibility === value));
    if (rating.overallPlausibility === value) button.classList.add("selected");
    button.addEventListener("click", () => {
      rating.overallPlausibility = value;
      renderLikert();
      renderNodes();
      persist();
    });
    scale.appendChild(button);
  }
}

function renderNodes() {
  const sample = state.assignment[state.currentIndex];
  const rating = currentRating();
  const active = activeMap(sample);
  const container = $("#nodeList");
  container.innerHTML = "";

  if (!rating.overallPlausibility) {
    const notice = document.createElement("div");
    notice.className = "rating-notice";
    notice.innerHTML = `<i data-lucide="arrow-up"></i><span>${t("rateOverallFirst")}</span>`;
    container.appendChild(notice);
  }

  NODE_DEFINITIONS.forEach(({ id, name, description }) => {
    if (!active[id]) return;
    const row = document.createElement("div");
    row.className = "node-row";
    if (!rating.overallPlausibility) row.classList.add("awaiting-overall");

    const copy = document.createElement("div");
    copy.innerHTML = `
      <div class="node-name"><b>${id}</b><span>${name[state.language]}</span></div>
      <div class="node-description">${description[state.language]}</div>
    `;
    row.appendChild(copy);

    const control = document.createElement("div");
    control.className = "verdict-control";
    [
      ["yes", t("yes")],
      ["no", t("no")],
      ["unobservable", t("unobservableShort")],
    ].forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = value;
      button.textContent = label;
      if (value === "unobservable") {
        button.title = t("unobservable");
        button.setAttribute("aria-label", t("unobservable"));
      }
      button.disabled = !rating.overallPlausibility;
      if (rating.verdicts[id] === value) button.classList.add("selected");
      button.addEventListener("click", () => {
        rating.verdicts[id] = value;
        renderNodes();
        persist();
      });
      control.appendChild(button);
    });
    row.appendChild(control);
    container.appendChild(row);
  });

  if (window.lucide) lucide.createIcons();
}

function renderDimensionGuide() {
  const guide = $("#dimensionGuide");
  if (!guide) return;
  guide.innerHTML = "";
  NODE_DEFINITIONS.forEach(({ id, name, description }) => {
    const item = document.createElement("div");
    item.className = `dimension-guide-item dimension-${id.toLowerCase()}`;
    item.innerHTML = `
      <div class="dimension-guide-name"><b>${id}</b><span>${name[state.language]}</span></div>
      <p>${description[state.language]}</p>
    `;
    guide.appendChild(item);
  });
}

function promptForStudy(sample) {
  if (state.language === "zh" && PROMPT_ZH[sample.category]) {
    return PROMPT_ZH[sample.category];
  }
  return sample.study_prompt || sample.prompt || sample.category_label || "";
}

function renderCurrent() {
  const sample = state.assignment[state.currentIndex];
  $("#sampleIndex").textContent = t("videoOf", state.currentIndex + 1, state.assignment.length);
  $("#samplePrompt").textContent = promptForStudy(sample);
  $("#studyVideo").src = sample.video;
  $("#studyVideo").load();
  $("#previousButton").disabled = state.currentIndex === 0;
  $("#nextButton").innerHTML =
    state.currentIndex === state.assignment.length - 1
      ? `<span>${t("completeStudy")}</span><i data-lucide="check"></i>`
      : `<span>${t("saveContinue")}</span><i data-lucide="arrow-right"></i>`;
  renderLikert();
  renderNodes();
  updateProgress();
  applyTranslations();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function ratingComplete(sample, rating) {
  if (!rating?.overallPlausibility) return false;
  const active = activeMap(sample);
  return NODE_DEFINITIONS.every(({ id }) => !active[id] || Boolean(rating.verdicts[id]));
}

function validateCurrent() {
  const sample = state.assignment[state.currentIndex];
  const rating = currentRating();
  if (!rating.overallPlausibility) {
    $("#saveState").textContent = t("completeOverall");
    $(".likert-panel").scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  if (!ratingComplete(sample, rating)) {
    $("#saveState").textContent = t("completeNodes");
    $("#nodeList").scrollIntoView({ behavior: "smooth", block: "start" });
    return false;
  }
  return true;
}

function updateProgress() {
  const completed = state.assignment.filter((sample) => (
    ratingComplete(sample, state.ratings[sample.sample_id])
  )).length;
  const total = state.assignment.length || state.manifest?.sample_total || 300;
  $("#progressLabel").textContent = `${completed} / ${total}`;
  $("#progressFill").style.width = `${total ? (completed / total) * 100 : 0}%`;
}

function resultPayload() {
  const assignments = state.assignment.map((sample, order) => {
    const rating = state.ratings[sample.sample_id] || {
      overallPlausibility: null,
      verdicts: {},
    };
    const active = activeMap(sample);
    const blocked = blockedNodes(rating.verdicts, active);
    const postGatedVerdicts = Object.fromEntries(
      NODE_DEFINITIONS.map(({ id }) => {
        if (!active[id]) return [id, "inactive"];
        if (blocked.has(id)) return [id, "gated_no"];
        return [id, rating.verdicts[id] || null];
      }),
    );
    return {
      order: order + 1,
      sample_id: sample.sample_id,
      media_id: sample.media_id,
      category: sample.category,
      overall_physical_plausibility: rating.overallPlausibility,
      raw_node_labels: rating.verdicts,
      post_gated_node_labels: postGatedVerdicts,
      first_failed_node: firstFailedNode(rating.verdicts, active) || null,
    };
  });
  const overallRatings = assignments
    .map((item) => item.overall_physical_plausibility)
    .filter((value) => Number.isInteger(value));
  return {
    schema_version: "phyhoi-human-alignment-v3",
    anonymous_session_id: state.sessionId,
    language: state.language,
    started_at: state.startedAt,
    completed_at: new Date().toISOString(),
    summary: {
      completed_videos: assignments.filter((item) => item.overall_physical_plausibility).length,
      mean_overall_physical_plausibility: overallRatings.length
        ? Number((overallRatings.reduce((sum, value) => sum + value, 0) / overallRatings.length).toFixed(6))
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
  const nodeColumns = NODE_DEFINITIONS.flatMap(({ id }) => [
    `${id}_raw`,
    `${id}_post_gated`,
  ]);
  const rows = [[
    "anonymous_session_id",
    "order",
    "sample_id",
    "media_id",
    "category",
    "overall_physical_plausibility",
    ...nodeColumns,
    "first_failed_node",
  ]];
  payload.assignment.forEach((item) => {
    rows.push([
      payload.anonymous_session_id,
      item.order,
      item.sample_id,
      item.media_id,
      item.category,
      item.overall_physical_plausibility ?? "",
      ...NODE_DEFINITIONS.flatMap(({ id }) => [
        item.raw_node_labels[id] || "",
        item.post_gated_node_labels[id] || "",
      ]),
      item.first_failed_node || "",
    ]);
  });
  return rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function completeStudy() {
  persist();
  $("#studyView").hidden = true;
  $("#completeView").hidden = false;
  $("#completionSummary").textContent = t("completionSummary", state.assignment.length);
  const endpoint = window.PHYHOI_CONFIG?.submissionEndpoint;
  $("#submitResults").hidden = !endpoint;
  updateProgress();
  applyTranslations();
}

async function submitResults() {
  const endpoint = window.PHYHOI_CONFIG?.submissionEndpoint;
  if (!endpoint) return;
  const button = $("#submitResults");
  button.disabled = true;
  $("#submitStatus").textContent = t("submitting");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultPayload()),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    $("#submitStatus").textContent = t("submitted");
  } catch (error) {
    $("#submitStatus").textContent = t("submissionFailed", error.message);
    button.disabled = false;
  }
}

function applyTranslations() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.language === state.language);
  });
  renderDimensionGuide();
  const saved = state.sessionId ? savedRecord() : null;
  $("#startButtonLabel").textContent =
    saved?.assignmentIds?.length ? t("continueEvaluation") : t("startEvaluation");
  if (!$("#studyView").hidden && state.assignment.length) {
    $("#sampleIndex").textContent = t("videoOf", state.currentIndex + 1, state.assignment.length);
    $("#samplePrompt").textContent = promptForStudy(state.assignment[state.currentIndex]);
    $("#nextButton").innerHTML =
      state.currentIndex === state.assignment.length - 1
        ? `<span>${t("completeStudy")}</span><i data-lucide="check"></i>`
        : `<span>${t("saveContinue")}</span><i data-lucide="arrow-right"></i>`;
  }
  if (!$("#completeView").hidden && state.assignment.length) {
    $("#completionSummary").textContent = t("completionSummary", state.assignment.length);
  }
  if (window.lucide) lucide.createIcons();
}

async function initialize() {
  state.sessionId =
    localStorage.getItem("phyhoi-human-alignment:session-id") || anonymousCode();
  localStorage.setItem("phyhoi-human-alignment:session-id", state.sessionId);

  const manifestPath = window.PHYHOI_CONFIG?.sampleManifest || "./data/samples.json";
  const response = await fetch(manifestPath);
  if (!response.ok) throw new Error(`Unable to load sample manifest: ${response.status}`);
  state.manifest = await response.json();
  updateProgress();

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = button.dataset.language;
      localStorage.setItem("phyhoi-human-alignment:language", state.language);
      applyTranslations();
      if (!$("#studyView").hidden && state.assignment.length) {
        renderLikert();
        renderNodes();
      }
      persist();
    });
  });

  $("#setupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const saved = savedRecord();
    if (saved?.assignmentIds?.length) {
      const byId = new Map(state.manifest.samples.map((sample) => [sample.sample_id, sample]));
      state.assignment = saved.assignmentIds.map((id) => byId.get(id)).filter(Boolean);
      state.ratings = saved.ratings || {};
      state.currentIndex = Math.min(saved.currentIndex || 0, state.assignment.length - 1);
      state.startedAt = saved.startedAt || new Date().toISOString();
    }
    if (!state.assignment.length) {
      state.assignment = randomizedAssignment(state.manifest.samples, state.sessionId);
      state.ratings = {};
      state.currentIndex = 0;
      state.startedAt = new Date().toISOString();
    }
    $("#setupView").hidden = true;
    $("#studyView").hidden = false;
    renderCurrent();
    persist();
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
      `phyhoi-response-${state.sessionId}.json`,
      JSON.stringify(resultPayload(), null, 2),
      "application/json",
    );
  });
  $("#downloadCsv").addEventListener("click", () => {
    download(`phyhoi-response-${state.sessionId}.csv`, toCsv(resultPayload()), "text/csv");
  });
  $("#submitResults").addEventListener("click", submitResults);
  applyTranslations();
}

initialize().catch((error) => {
  document.body.innerHTML = `<main><h1>Study unavailable</h1><p>${error.message}</p></main>`;
});

const CORE_SYSTEM_PROMPT = `You are RoLLM1, a character roleplay assistant.

CORE BEHAVIOR
- You are the character/persona described by the current persona card.
- The user is a separate player, not you.
- Stay in character unless the user asks for technical help, settings, or out-of-character clarification.
- Respond naturally as the character.
- You may describe your own actions, thoughts, expressions, emotions, and dialogue.
- Do not control the user's character.
- Do not decide the user's actions, thoughts, feelings, dialogue, success, failure, injury, escape, or outcome.
- React to what the user does, then leave the next move open.

USER AGENCY RULES
Allowed:
- "I glance toward the door."
- "I lower my voice."
- "The corridor ahead is dark."
- "What do you do?"

Not allowed:
- "You feel scared."
- "You step forward."
- "You realize the truth."
- "You successfully escape."
- "You grab the weapon."

SAFETY RULES
- Refuse illegal, dangerous, or harmful real-world instructions.
- Refuse requests for making weapons, explosives, malware, ransomware, phishing, stealing passwords, breaking into accounts, evading police, poisoning, or real-world violence.
- Keep refusals brief.
- Offer safe alternatives such as fictional scenes, cybersecurity defense, worldbuilding, or non-actionable explanation.

ADULT CONTENT GATE
- If ADULT_CONTENT_ALLOWED=false, refuse adult/NSFW roleplay.
- If ADULT_CONTENT_ALLOWED=false, offer non-explicit romance, drama, friendship, adventure, or normal roleplay instead.
- Do not produce adult/NSFW content unless the system prompt explicitly says ADULT_CONTENT_ALLOWED=true.
- Never include minors in sexual or romantic-adult contexts.

STYLE
- Be vivid but concise.
- Avoid repetitive refusal wording.
- Do not over-explain policies.
- For roleplay, use immersive character dialogue and actions.`;

const MODEL_OPTIONS = [
  {
    label: "RoLLM1 Mini",
    model_id: "RoLLM1-mini",
    model: "./models/RoLLM1-mini/",
    model_lib: "./models/RoLLM1-mini/RoLLM1-mini.wasm",
  },
  {
    label: "RoLLM1 Pro",
    model_id: "RoLLM1-pro",
    model: "./models/RoLLM1-pro/",
    model_lib: "./models/RoLLM1-pro/RoLLM1-pro.wasm",
  },
];

const AGE_GATE_MINIMUM = 25;
const MOBILEAGENET_INPUT_SIZE = 224;
const MOBILEAGENET_MAX_AGE = 116;
const MOBILEAGENET_MODEL_URL = "./assets/mobileagenet/mobileagenet.onnx";
const ONNX_RUNTIME_URL = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js";
const ONNX_RUNTIME_WASM_PATH = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
const AGE_GATE_DEFAULT = {
  verified: false,
  nsfwEnabled: false,
  estimatedAge: null,
  checkedAt: null,
  threshold: AGE_GATE_MINIMUM,
  lastError: "",
};

const DEFAULT_CHARACTERS = [
  {
    id: "new-persona",
    name: "New Persona",
    description: "",
    personality: "",
    scenario: "",
    keywords: "",
    thumbnail: "",
    opening: "",
    systemPromptExtra: "",
    adultContentAllowed: false,
  },
];

const STORAGE_KEYS = {
  characters: "talk2me.characters.v1",
  chats: "talk2me.chats.v1",
  activeCharacterId: "talk2me.activeCharacterId.v1",
  ageGate: "talk2me.ageGate.v1",
};

const elements = {
  activeCharacterName: document.querySelector("#activeCharacterName"),
  adultGateValue: document.querySelector("#adultGateValue"),
  ageCanvas: document.querySelector("#ageCanvas"),
  ageGateStatus: document.querySelector("#ageGateStatus"),
  ageVideo: document.querySelector("#ageVideo"),
  cacheSelect: document.querySelector("#cacheSelect"),
  captureAgeButton: document.querySelector("#captureAgeButton"),
  characterDescription: document.querySelector("#characterDescription"),
  characterKeywords: document.querySelector("#characterKeywords"),
  characterList: document.querySelector("#characterList"),
  characterName: document.querySelector("#characterName"),
  characterOpening: document.querySelector("#characterOpening"),
  characterPersonality: document.querySelector("#characterPersonality"),
  characterScenario: document.querySelector("#characterScenario"),
  characterThumbnail: document.querySelector("#characterThumbnail"),
  chatLog: document.querySelector("#chatLog"),
  clearChatButton: document.querySelector("#clearChatButton"),
  composerForm: document.querySelector("#composerForm"),
  copyPromptButton: document.querySelector("#copyPromptButton"),
  downloadChatButton: document.querySelector("#downloadChatButton"),
  loadRepositoryButton: document.querySelector("#loadRepositoryButton"),
  loadModelButton: document.querySelector("#loadModelButton"),
  loadProgress: document.querySelector("#loadProgress"),
  maxTokensInput: document.querySelector("#maxTokensInput"),
  messageInput: document.querySelector("#messageInput"),
  modelSelect: document.querySelector("#modelSelect"),
  modelStatus: document.querySelector("#modelStatus"),
  newCharacterButton: document.querySelector("#newCharacterButton"),
  nsfwModeLabel: document.querySelector("#nsfwModeLabel"),
  nsfwToggleButton: document.querySelector("#nsfwToggleButton"),
  personaForm: document.querySelector("#personaForm"),
  promptPreview: document.querySelector("#promptPreview"),
  repositoryCharacterList: document.querySelector("#repositoryCharacterList"),
  repositoryForm: document.querySelector("#repositoryForm"),
  repositoryMeta: document.querySelector("#repositoryMeta"),
  repositoryStatus: document.querySelector("#repositoryStatus"),
  repositoryUrl: document.querySelector("#repositoryUrl"),
  resetAgeGateButton: document.querySelector("#resetAgeGateButton"),
  resetCharacterButton: document.querySelector("#resetCharacterButton"),
  sendButton: document.querySelector("#sendButton"),
  startAgeCheckButton: document.querySelector("#startAgeCheckButton"),
  stopButton: document.querySelector("#stopButton"),
  temperatureInput: document.querySelector("#temperatureInput"),
  temperatureValue: document.querySelector("#temperatureValue"),
  topPInput: document.querySelector("#topPInput"),
  topPValue: document.querySelector("#topPValue"),
};

let engine = null;
let worker = null;
let isGenerating = false;
let webllmModulePromise = null;
let ageStream = null;
let onnxRuntimePromise = null;
let mobileAgeNetSessionPromise = null;

const state = {
  activeCharacterId: readJson(STORAGE_KEYS.activeCharacterId, DEFAULT_CHARACTERS[0].id),
  ageGate: readJson(STORAGE_KEYS.ageGate, AGE_GATE_DEFAULT),
  characters: readJson(STORAGE_KEYS.characters, DEFAULT_CHARACTERS),
  chats: readJson(STORAGE_KEYS.chats, {}),
  repository: null,
};

if (!Array.isArray(state.characters) || state.characters.length === 0) {
  state.characters = structuredClone(DEFAULT_CHARACTERS);
  state.activeCharacterId = DEFAULT_CHARACTERS[0].id;
}

if (!state.ageGate || typeof state.ageGate !== "object") {
  state.ageGate = structuredClone(AGE_GATE_DEFAULT);
}

state.ageGate = {
  ...AGE_GATE_DEFAULT,
  ...state.ageGate,
  threshold: AGE_GATE_MINIMUM,
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function activeCharacter() {
  return state.characters.find((character) => character.id === state.activeCharacterId) ?? state.characters[0];
}

function activeChat() {
  const character = activeCharacter();
  if (!state.chats[character.id]) {
    state.chats[character.id] = character.opening
      ? [{ role: "assistant", content: character.opening }]
      : [];
  }
  return state.chats[character.id];
}

function saveAll() {
  writeJson(STORAGE_KEYS.characters, state.characters);
  writeJson(STORAGE_KEYS.chats, state.chats);
  writeJson(STORAGE_KEYS.activeCharacterId, state.activeCharacterId);
  writeJson(STORAGE_KEYS.ageGate, state.ageGate);
}

function isAgeVerified() {
  return state.ageGate.verified === true && Number(state.ageGate.estimatedAge) >= AGE_GATE_MINIMUM;
}

function adultContentAllowed() {
  return state.ageGate.nsfwEnabled === true && isAgeVerified();
}

function buildPersonaPrompt(character) {
  const extra = character.systemPromptExtra
    ? `

ADDITIONAL CHARACTER INSTRUCTIONS:
${character.systemPromptExtra}`
    : "";

  return `PERSONA CARD
DESCRIPTION:
${character.description}

PERSONALITY:
${character.personality}

SCENARIO:
${character.scenario}

KEYWORDS:
${character.keywords}
${extra}

ADULT_CONTENT_ALLOWED=${adultContentAllowed() ? "true" : "false"}`;
}

function buildSystemPrompt(character = activeCharacter()) {
  return `${CORE_SYSTEM_PROMPT}

${buildPersonaPrompt(character)}`;
}

function chatMessages() {
  return [{ role: "system", content: buildSystemPrompt() }, ...activeChat()];
}

function setStatus(text, progress = elements.loadProgress.value) {
  elements.modelStatus.textContent = text;
  elements.loadProgress.value = Number(progress) || 0;
}

function loadWebLLMModule() {
  webllmModulePromise ??= import("https://esm.run/@mlc-ai/web-llm");
  return webllmModulePromise;
}

function loadONNXRuntime() {
  if (window.ort) {
    window.ort.env.wasm.wasmPaths = ONNX_RUNTIME_WASM_PATH;
    return Promise.resolve(window.ort);
  }

  onnxRuntimePromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = ONNX_RUNTIME_URL;
    script.async = true;
    script.onload = () => {
      if (!window.ort) {
        reject(new Error("ONNX Runtime did not initialize."));
        return;
      }
      window.ort.env.wasm.wasmPaths = ONNX_RUNTIME_WASM_PATH;
      resolve(window.ort);
    };
    script.onerror = () => reject(new Error("Could not load ONNX Runtime Web."));
    document.head.append(script);
  });

  return onnxRuntimePromise;
}

async function loadMobileAgeNetSession() {
  const ort = await loadONNXRuntime();

  mobileAgeNetSessionPromise ??= fetch(MOBILEAGENET_MODEL_URL, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`MobileAgeNet model missing at ${MOBILEAGENET_MODEL_URL}`);
      }
      return response.arrayBuffer();
    })
    .then((modelBuffer) =>
      ort.InferenceSession.create(modelBuffer, {
        executionProviders: ["wasm"],
      }),
    );

  return {
    ort,
    session: await mobileAgeNetSessionPromise,
  };
}

async function startAgeCheck() {
  if (!navigator.mediaDevices?.getUserMedia) {
    state.ageGate.lastError = "Camera access is not available in this browser.";
    saveAll();
    renderAgeGate();
    return;
  }

  stopAgeCamera();
  elements.ageGateStatus.textContent = "Starting local camera check...";

  try {
    ageStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 640 },
      },
    });
    elements.ageVideo.srcObject = ageStream;
    elements.ageVideo.hidden = false;
    elements.ageCanvas.hidden = true;
    await elements.ageVideo.play();
    elements.captureAgeButton.disabled = false;
    elements.ageGateStatus.textContent = "Camera ready. Center your face, then verify.";
  } catch (error) {
    console.error(error);
    state.ageGate.lastError = "Camera permission was denied or unavailable.";
    saveAll();
    renderAgeGate();
  }
}

function stopAgeCamera() {
  if (ageStream) {
    for (const track of ageStream.getTracks()) {
      track.stop();
    }
  }
  ageStream = null;
  elements.ageVideo.srcObject = null;
  elements.ageVideo.hidden = true;
  elements.captureAgeButton.disabled = true;
}

function drawAgeFrame() {
  const video = elements.ageVideo;
  if (!video.videoWidth || !video.videoHeight) {
    throw new Error("Camera frame is not ready.");
  }

  const canvas = elements.ageCanvas;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const sourceSize = Math.min(video.videoWidth, video.videoHeight);
  const sourceX = Math.floor((video.videoWidth - sourceSize) / 2);
  const sourceY = Math.floor((video.videoHeight - sourceSize) / 2);

  canvas.width = MOBILEAGENET_INPUT_SIZE;
  canvas.height = MOBILEAGENET_INPUT_SIZE;
  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    MOBILEAGENET_INPUT_SIZE,
    MOBILEAGENET_INPUT_SIZE,
  );

  canvas.hidden = false;
  video.hidden = true;
  return canvas;
}

function preprocessAgeCanvas(canvas) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const pixels = context.getImageData(0, 0, MOBILEAGENET_INPUT_SIZE, MOBILEAGENET_INPUT_SIZE).data;
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];
  const area = MOBILEAGENET_INPUT_SIZE * MOBILEAGENET_INPUT_SIZE;
  const tensorData = new Float32Array(3 * area);

  for (let index = 0; index < area; index += 1) {
    const pixelOffset = index * 4;
    tensorData[index] = (pixels[pixelOffset] / 255 - mean[0]) / std[0];
    tensorData[area + index] = (pixels[pixelOffset + 1] / 255 - mean[1]) / std[1];
    tensorData[area * 2 + index] = (pixels[pixelOffset + 2] / 255 - mean[2]) / std[2];
  }

  return tensorData;
}

async function estimateAge(canvas) {
  const { ort, session } = await loadMobileAgeNetSession();
  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];
  const tensor = new ort.Tensor("float32", preprocessAgeCanvas(canvas), [
    1,
    3,
    MOBILEAGENET_INPUT_SIZE,
    MOBILEAGENET_INPUT_SIZE,
  ]);
  const output = await session.run({ [inputName]: tensor });
  const rawAge = Number(output[outputName].data[0]);
  const scaledAge = rawAge >= 0 && rawAge <= 1 ? rawAge * MOBILEAGENET_MAX_AGE : rawAge;

  if (!Number.isFinite(scaledAge)) {
    throw new Error("MobileAgeNet returned an invalid age estimate.");
  }

  return Math.max(0, Math.min(MOBILEAGENET_MAX_AGE, scaledAge));
}

async function verifyAge() {
  elements.captureAgeButton.disabled = true;
  elements.ageGateStatus.textContent = "Running MobileAgeNet locally...";

  try {
    const canvas = drawAgeFrame();
    const estimatedAge = await estimateAge(canvas);
    const passed = estimatedAge >= AGE_GATE_MINIMUM;

    state.ageGate = {
      verified: passed,
      nsfwEnabled: passed,
      estimatedAge: Math.round(estimatedAge * 10) / 10,
      checkedAt: new Date().toISOString(),
      threshold: AGE_GATE_MINIMUM,
      lastError: "",
    };
  } catch (error) {
    console.error(error);
    state.ageGate = {
      ...AGE_GATE_DEFAULT,
      lastError: `NSFW mode locked. ${error.message}`,
    };
  } finally {
    stopAgeCamera();
    saveAll();
    render();
  }
}

async function toggleNsfwMode() {
  if (adultContentAllowed()) {
    state.ageGate.nsfwEnabled = false;
    saveAll();
    render();
    return;
  }

  if (isAgeVerified()) {
    state.ageGate.nsfwEnabled = true;
    saveAll();
    render();
    return;
  }

  await startAgeCheck();
}

function resetAgeGate() {
  stopAgeCamera();
  mobileAgeNetSessionPromise = null;
  state.ageGate = structuredClone(AGE_GATE_DEFAULT);
  saveAll();
  render();
}

function normalizeGithubRawUrl(url) {
  if (url.hostname !== "github.com") {
    return url.href;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const blobIndex = parts.indexOf("blob");
  if (parts.length >= 5 && blobIndex === 2) {
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");
    const branch = parts[3];
    const filePath = parts.slice(4).join("/");
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  }

  return url.href;
}

function resolveAssetUrl(value, baseUrl) {
  if (!value) {
    return "";
  }

  try {
    return normalizeGithubRawUrl(new URL(String(value), baseUrl));
  } catch {
    return "";
  }
}

function repositoryIndexCandidates(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    return [];
  }

  const url = new URL(trimmed);
  if (url.hostname === "github.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      throw new Error("Use a GitHub repository URL with owner and repo.");
    }

    const [owner, repo] = parts;
    const treeIndex = parts.indexOf("tree");
    const blobIndex = parts.indexOf("blob");

    if (blobIndex === 2) {
      return [normalizeGithubRawUrl(url)];
    }

    if (treeIndex === 2 && parts.length >= 4) {
      const branch = parts[3];
      const folder = parts.slice(4).join("/");
      const prefix = folder ? `${folder}/` : "";
      return [`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${prefix}index.json`];
    }

    return [
      `https://raw.githubusercontent.com/${owner}/${repo}/main/index.json`,
      `https://raw.githubusercontent.com/${owner}/${repo}/master/index.json`,
    ];
  }

  if (url.hostname === "raw.githubusercontent.com" || url.pathname.endsWith("/index.json")) {
    return [url.href];
  }

  const folderUrl = new URL(url.href);
  if (!folderUrl.pathname.endsWith("/")) {
    folderUrl.pathname += "/";
  }
  return [new URL("index.json", folderUrl).href];
}

async function fetchJsonFromCandidates(candidates) {
  let lastError = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return {
        data: await response.json(),
        url,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Could not load repository index.");
}

function normalizeRepositoryIndex(index, indexUrl) {
  const entries = index.items ?? index.characters ?? index.entries ?? [];
  if (!Array.isArray(entries)) {
    throw new Error("Repository index must include an items, characters, or entries array.");
  }

  const items = entries.map((entry, indexNumber) => {
    const characterPath = entry.character ?? entry.json ?? entry.file ?? entry.url ?? entry.href;
    return {
      id: `${indexUrl}#${indexNumber}`,
      name: entry.name ?? entry.title ?? `Character ${indexNumber + 1}`,
      description: entry.description ?? entry.shortDescription ?? entry.short_desc ?? "",
      thumbnail: resolveAssetUrl(entry.thumbnail ?? entry.thumb ?? entry.image, indexUrl),
      characterUrl: resolveAssetUrl(characterPath, indexUrl),
    };
  });

  return {
    name: index.name ?? index.repoName ?? index.title ?? "Character Repository",
    author: index.author ?? index.authorName ?? index.owner ?? "Unknown author",
    itemCount: Number(index.itemCount ?? index.count ?? items.length),
    indexUrl,
    items,
  };
}

function normalizeKeywords(value) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "");
}

function firstText(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) {
      return value.join(", ");
    }
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function normalizeImportedCharacter(data, sourceUrl, fallbackItem) {
  const prompt = data.systemPrompt ?? data.prompt ?? data.persona ?? data.card ?? {};
  const name = firstText(data.name, prompt.name, fallbackItem.name, "Imported Persona");
  const keywords = firstText(prompt.keywords, data.keywords, fallbackItem.keywords);
  const extra = firstText(
    prompt.instructions,
    prompt.extra,
    prompt.notes,
    data.instructions,
    data.systemPromptExtra,
  );

  return {
    id: `repo-character-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    description: firstText(prompt.description, data.description, fallbackItem.description),
    personality: firstText(prompt.personality, data.personality),
    scenario: firstText(prompt.scenario, data.scenario),
    keywords: normalizeKeywords(keywords),
    thumbnail: resolveAssetUrl(data.thumbnail ?? data.image ?? fallbackItem.thumbnail, sourceUrl),
    opening: firstText(prompt.opening, data.opening, data.firstMessage, data.greeting),
    systemPromptExtra: extra,
    sourceUrl,
    adultContentAllowed: false,
  };
}

function createThumbnail(url, label, className) {
  const thumb = document.createElement("div");
  thumb.className = className;

  if (url) {
    const image = document.createElement("img");
    image.src = url;
    image.alt = "";
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";
    thumb.append(image);
  } else {
    thumb.textContent = (label || "?").slice(0, 2).toUpperCase();
  }

  return thumb;
}

async function loadRepository(event) {
  event.preventDefault();
  const input = elements.repositoryUrl.value.trim();
  if (!input) {
    elements.repositoryStatus.textContent = "Enter a repository URL.";
    return;
  }

  elements.loadRepositoryButton.disabled = true;
  elements.repositoryStatus.textContent = "Looking for index.json...";
  elements.repositoryCharacterList.replaceChildren();
  elements.repositoryMeta.hidden = true;

  try {
    const candidates = repositoryIndexCandidates(input);
    const { data, url } = await fetchJsonFromCandidates(candidates);
    state.repository = normalizeRepositoryIndex(data, url);
    elements.repositoryStatus.textContent = `Loaded ${state.repository.itemCount} character${state.repository.itemCount === 1 ? "" : "s"}.`;
    renderRepository();
  } catch (error) {
    console.error(error);
    state.repository = null;
    elements.repositoryStatus.textContent = `Could not load repository: ${error.message}`;
    renderRepository();
  } finally {
    elements.loadRepositoryButton.disabled = false;
  }
}

async function importRepositoryCharacter(item) {
  if (!item.characterUrl) {
    elements.repositoryStatus.textContent = "That entry does not include a character JSON link.";
    return;
  }

  elements.repositoryStatus.textContent = `Loading ${item.name}...`;

  try {
    const response = await fetch(item.characterUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const character = normalizeImportedCharacter(await response.json(), item.characterUrl, item);
    state.characters.push(character);
    state.activeCharacterId = character.id;
    state.chats[character.id] = character.opening
      ? [{ role: "assistant", content: character.opening }]
      : [];
    saveAll();
    render();
    elements.repositoryStatus.textContent = `Imported ${character.name}.`;
  } catch (error) {
    console.error(error);
    elements.repositoryStatus.textContent = `Could not import character: ${error.message}`;
  }
}

function renderModelOptions() {
  elements.modelSelect.replaceChildren(
    ...MODEL_OPTIONS.map((model) => {
      const option = document.createElement("option");
      option.value = model.model_id;
      option.textContent = model.label;
      return option;
    }),
  );
}

function renderCharacters() {
  elements.characterList.replaceChildren(
    ...state.characters.map((character) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "character-card";
      button.setAttribute("aria-pressed", String(character.id === state.activeCharacterId));

      const summary = document.createElement("div");
      summary.className = "character-summary";

      const title = document.createElement("strong");
      title.textContent = character.name || "Untitled character";

      const subtitle = document.createElement("span");
      subtitle.textContent = character.keywords || character.description || "No keywords yet";

      summary.append(title, subtitle);
      button.append(createThumbnail(character.thumbnail, character.name, "character-thumb"), summary);
      button.addEventListener("click", () => {
        state.activeCharacterId = character.id;
        saveAll();
        render();
      });
      return button;
    }),
  );
}

function renderRepository() {
  if (!state.repository) {
    elements.repositoryMeta.hidden = true;
    elements.repositoryCharacterList.replaceChildren();
    return;
  }

  elements.repositoryMeta.hidden = false;
  elements.repositoryMeta.textContent = `${state.repository.name} by ${state.repository.author} - ${state.repository.itemCount} item${state.repository.itemCount === 1 ? "" : "s"}`;
  elements.repositoryCharacterList.replaceChildren(
    ...state.repository.items.map((item) => {
      const card = document.createElement("article");
      card.className = "repo-character-card";

      const summary = document.createElement("div");
      summary.className = "character-summary";

      const title = document.createElement("strong");
      title.textContent = item.name;

      const description = document.createElement("span");
      description.textContent = item.description || "No description";

      const importButton = document.createElement("button");
      importButton.type = "button";
      importButton.className = "text-button secondary";
      importButton.textContent = "Import";
      importButton.addEventListener("click", () => importRepositoryCharacter(item));

      summary.append(title, description);
      card.append(createThumbnail(item.thumbnail, item.name, "repo-thumb"), summary, importButton);
      return card;
    }),
  );
}

function renderPersonaForm() {
  const character = activeCharacter();
  elements.characterName.value = character.name ?? "";
  elements.characterDescription.value = character.description ?? "";
  elements.characterPersonality.value = character.personality ?? "";
  elements.characterScenario.value = character.scenario ?? "";
  elements.characterKeywords.value = character.keywords ?? "";
  elements.characterThumbnail.value = character.thumbnail ?? "";
  elements.characterOpening.value = character.opening ?? "";
  elements.activeCharacterName.textContent = character.name || "Untitled character";
  elements.promptPreview.textContent = buildSystemPrompt(character);
}

function renderChat() {
  const messages = activeChat();
  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "empty-chat";
    empty.textContent = "No messages yet.";
    elements.chatLog.replaceChildren(empty);
    return;
  }

  elements.chatLog.replaceChildren(
    ...messages.map((message) => {
      const row = document.createElement("article");
      row.className = `message ${message.role}`;

      const meta = document.createElement("div");
      meta.className = "message-meta";
      meta.textContent = message.role === "user" ? "Player" : activeCharacter().name;

      const bubble = document.createElement("div");
      bubble.className = "message-bubble";
      bubble.textContent = message.content;

      row.append(meta, bubble);
      return row;
    }),
  );
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

function renderSettings() {
  elements.temperatureValue.textContent = elements.temperatureInput.value;
  elements.topPValue.textContent = elements.topPInput.value;
}

function renderAgeGate() {
  const verified = isAgeVerified();
  const allowed = adultContentAllowed();
  const estimate = Number(state.ageGate.estimatedAge);
  const hasEstimate = Number.isFinite(estimate);

  elements.adultGateValue.textContent = allowed ? "true" : "false";
  elements.nsfwModeLabel.textContent = allowed ? "Enabled" : verified ? "Verified, off" : "Locked";
  elements.nsfwToggleButton.textContent = allowed ? "Disable" : verified ? "Enable" : "Verify";

  if (allowed) {
    elements.ageGateStatus.textContent = `NSFW mode enabled. Local estimate: ${estimate.toFixed(1)}. Threshold: ${AGE_GATE_MINIMUM}.`;
  } else if (verified) {
    elements.ageGateStatus.textContent = `Verified locally. Local estimate: ${estimate.toFixed(1)}. NSFW mode is off.`;
  } else if (hasEstimate) {
    elements.ageGateStatus.textContent = `Locked. Last local estimate: ${estimate.toFixed(1)}. Required: ${AGE_GATE_MINIMUM} or older.`;
  } else if (state.ageGate.lastError) {
    elements.ageGateStatus.textContent = state.ageGate.lastError;
  } else {
    elements.ageGateStatus.textContent = `Requires local MobileAgeNet age estimate of ${AGE_GATE_MINIMUM} or older. No image is stored.`;
  }
}

function render() {
  renderCharacters();
  renderRepository();
  renderPersonaForm();
  renderChat();
  renderSettings();
  renderAgeGate();
}

async function loadModel() {
  const selectedModel = elements.modelSelect.value;

  if (!("gpu" in navigator)) {
    setStatus("WebGPU is not available in this browser. Use a recent Chromium-based browser over localhost or HTTPS.");
    return;
  }

  elements.loadModelButton.disabled = true;
  setStatus(`Loading ${selectedModel}...`, 0);

  try {
    const { CreateWebWorkerMLCEngine, prebuiltAppConfig } = await loadWebLLMModule();

    if (worker) {
      worker.terminate();
    }

    worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

    const appConfig = {
      ...prebuiltAppConfig,
      model_list: MODEL_OPTIONS,
      cacheBackend: elements.cacheSelect.value,
    };

    engine = await CreateWebWorkerMLCEngine(worker, selectedModel, {
      appConfig,
      initProgressCallback: (progress) => {
        const report = progress.text || "Preparing model files...";
        setStatus(report, progress.progress ?? 0);
      },
    });

    setStatus(`${selectedModel} is ready.`, 1);
  } catch (error) {
    engine = null;
    console.error(error);
    setStatus(`Could not load ${selectedModel}. Add the MLC model files, then try again.`);
  } finally {
    elements.loadModelButton.disabled = false;
  }
}

async function sendMessage(event) {
  event.preventDefault();

  const content = elements.messageInput.value.trim();
  if (!content || isGenerating) {
    return;
  }

  if (!engine) {
    setStatus("Load RoLLM1-mini or RoLLM1-pro before sending.");
    return;
  }

  const messages = activeChat();
  messages.push({ role: "user", content });
  const assistantMessage = { role: "assistant", content: "" };
  messages.push(assistantMessage);
  elements.messageInput.value = "";
  isGenerating = true;
  elements.sendButton.disabled = true;
  elements.stopButton.disabled = false;
  saveAll();
  renderChat();

  try {
    const chunks = await engine.chat.completions.create({
      messages: chatMessages(),
      temperature: Number(elements.temperatureInput.value),
      top_p: Number(elements.topPInput.value),
      max_tokens: Number(elements.maxTokensInput.value),
      stream: true,
      stream_options: { include_usage: true },
    });

    for await (const chunk of chunks) {
      const delta = chunk.choices?.[0]?.delta?.content ?? "";
      if (delta) {
        assistantMessage.content += delta;
        saveAll();
        renderChat();
      }
    }
  } catch (error) {
    console.error(error);
    assistantMessage.content ||= "[Generation stopped or failed.]";
    setStatus("Generation stopped or failed.");
  } finally {
    isGenerating = false;
    elements.sendButton.disabled = false;
    elements.stopButton.disabled = true;
    saveAll();
    renderChat();
  }
}

function stopGeneration() {
  if (engine?.interruptGenerate) {
    engine.interruptGenerate();
  }
  setStatus("Stopping generation...");
}

function updateCharacterFromForm() {
  const character = activeCharacter();
  character.name = elements.characterName.value.trim() || "Untitled character";
  character.description = elements.characterDescription.value.trim();
  character.personality = elements.characterPersonality.value.trim();
  character.scenario = elements.characterScenario.value.trim();
  character.keywords = elements.characterKeywords.value.trim();
  character.thumbnail = elements.characterThumbnail.value.trim();
  character.opening = elements.characterOpening.value.trim();
  character.adultContentAllowed = false;
  saveAll();
  renderCharacters();
  renderPersonaForm();
  renderChat();
}

function newCharacter() {
  const id = `character-${Date.now()}`;
  state.characters.push({
    id,
    name: "New Persona",
    description: "",
    personality: "",
    scenario: "",
    keywords: "",
    thumbnail: "",
    opening: "",
    systemPromptExtra: "",
    adultContentAllowed: false,
  });
  state.activeCharacterId = id;
  saveAll();
  render();
}

function resetActiveCharacter() {
  const original = DEFAULT_CHARACTERS.find((character) => character.id === state.activeCharacterId);
  if (!original) {
    return;
  }

  const index = state.characters.findIndex((character) => character.id === state.activeCharacterId);
  state.characters[index] = structuredClone(original);
  delete state.chats[original.id];
  saveAll();
  render();
}

function clearChat() {
  const character = activeCharacter();
  state.chats[character.id] = character.opening
    ? [{ role: "assistant", content: character.opening }]
    : [];
  saveAll();
  renderChat();
}

function downloadChat() {
  const character = activeCharacter();
  const transcript = activeChat()
    .map((message) => `${message.role === "user" ? "Player" : character.name}: ${message.content}`)
    .join("\n\n");
  const blob = new Blob([transcript], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${character.name.replaceAll(/\W+/g, "-").toLowerCase()}-chat.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyPrompt() {
  await navigator.clipboard.writeText(buildSystemPrompt());
  elements.copyPromptButton.textContent = "Copied";
  window.setTimeout(() => {
    elements.copyPromptButton.textContent = "Copy";
  }, 1200);
}

elements.composerForm.addEventListener("submit", sendMessage);
elements.captureAgeButton.addEventListener("click", verifyAge);
elements.copyPromptButton.addEventListener("click", copyPrompt);
elements.clearChatButton.addEventListener("click", clearChat);
elements.downloadChatButton.addEventListener("click", downloadChat);
elements.loadModelButton.addEventListener("click", loadModel);
elements.newCharacterButton.addEventListener("click", newCharacter);
elements.nsfwToggleButton.addEventListener("click", toggleNsfwMode);
elements.personaForm.addEventListener("input", updateCharacterFromForm);
elements.repositoryForm.addEventListener("submit", loadRepository);
elements.resetAgeGateButton.addEventListener("click", resetAgeGate);
elements.resetCharacterButton.addEventListener("click", resetActiveCharacter);
elements.startAgeCheckButton.addEventListener("click", startAgeCheck);
elements.stopButton.addEventListener("click", stopGeneration);
elements.temperatureInput.addEventListener("input", renderSettings);
elements.topPInput.addEventListener("input", renderSettings);

renderModelOptions();
render();

if (!("gpu" in navigator)) {
  setStatus("WebGPU is not available here. Open this page in a recent Chromium-based browser.");
}

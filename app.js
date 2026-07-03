const SYSTEM_PROMPT_FILES = {
  standard: "./systemprompt.json",
  adult: "./systemprompt-adult.json",
};

const SYSTEM_PROMPT_FALLBACKS = {
  standard: {
    lines: [
      "You are RoLLM1, a character roleplay assistant.",
      "Stay in character as {NAME}. Do not control the user's character.",
      "Description: {DESCRIPTION}",
      "Personality: {PERSONALITY}",
      "Scenario: {SCENARIO}",
      "Keywords: {KEYWORDS}",
      "{SYSTEM_PROMPT_EXTRA}",
      "ADULT_CONTENT_ALLOWED={ADULT_CONTENT_ALLOWED}",
      "USER PROFILE",
      "{PROFILE}",
    ],
  },
  adult: {
    lines: [
      "You are RoLLM1, an adult-capable character roleplay assistant.",
      "Stay in character as {NAME}. Do not control the user's character.",
      "Never include minors in sexual or romantic-adult contexts.",
      "Description: {DESCRIPTION}",
      "Personality: {PERSONALITY}",
      "Scenario: {SCENARIO}",
      "Keywords: {KEYWORDS}",
      "{SYSTEM_PROMPT_EXTRA}",
      "ADULT_CONTENT_ALLOWED={ADULT_CONTENT_ALLOWED}",
      "USER PROFILE",
      "{PROFILE}",
    ],
  },
};

const ROLLM_RELEASE_BASE = "https://github.com/ExoCore-Kernel/RoLLM1-models/releases/download/v0.2-beta";
const WLLAMA_VERSION = "3.5.1";
const WLLAMA_MODULE_URL = `https://cdn.jsdelivr.net/npm/@wllama/wllama@${WLLAMA_VERSION}/esm/index.js`;
const WLLAMA_WASM_URL = `https://cdn.jsdelivr.net/npm/@wllama/wllama@${WLLAMA_VERSION}/esm/wasm/wllama.wasm`;
const WLLAMA_WASM_CONFIG = { default: WLLAMA_WASM_URL };

const MODEL_OPTIONS = [
  {
    label: "RoLLM-Pro",
    model_id: "RoLLM1-pro",
    promptKey: "standard",
    firstShard: `${ROLLM_RELEASE_BASE}/RoLLM1-pro-Q4_K_M-00001-of-00005.gguf`,
    shardPrefix: "RoLLM1-pro-Q4_K_M",
    shards: 5,
  },
  {
    label: "RoLLM-Pro-adult",
    model_id: "RoLLM1-pro-adult",
    promptKey: "adult",
    firstShard: `${ROLLM_RELEASE_BASE}/RoLLM1-pro-adult-Q4_K_M-00001-of-00005.gguf`,
    shardPrefix: "RoLLM1-pro-adult-Q4_K_M",
    shards: 5,
  },
];

const ADULT_CHECK_DEFAULT = {
  checked: false,
};
const PROFILE_DEFAULT = {
  name: "",
  pronouns: "",
  about: "",
  preferences: "",
  boundaries: "",
};

const THEME_DEFAULT = {
  mode: "dark",
  accent: "#7c4de3",
};

const CONTEXT_SIZE_DEFAULT = 2048;
const CONTEXT_SIZE_MIN = 512;
const CONTEXT_SIZE_MAX = 8192;

const DEFAULT_CHARACTERS = [];

const STORAGE_KEYS = {
  characters: "talk2me.characters.v2",
  chats: "talk2me.chats.v2",
  activeCharacterId: "talk2me.activeCharacterId.v2",
  adultCheck: "talk2me.adultCheck.v1",
  contextSize: "talk2me.contextSize.v1",
  profile: "talk2me.profile.v1",
  theme: "talk2me.theme.v1",
};

const elements = {
  activeCharacterAvatar: document.querySelector("#activeCharacterAvatar"),
  activeCharacterName: document.querySelector("#activeCharacterName"),
  adultCheck: document.querySelector("#adultCheck"),
  adultStatus: document.querySelector("#adultStatus"),
  accentColorInput: document.querySelector("#accentColorInput"),
  backButton: document.querySelector("#backButton"),
  characterDescription: document.querySelector("#characterDescription"),
  characterKeywords: document.querySelector("#characterKeywords"),
  characterList: document.querySelector("#characterList"),
  characterName: document.querySelector("#characterName"),
  characterOpening: document.querySelector("#characterOpening"),
  characterPersonality: document.querySelector("#characterPersonality"),
  characterScenario: document.querySelector("#characterScenario"),
  characterThumbnail: document.querySelector("#characterThumbnail"),
  chatList: document.querySelector("#chatList"),
  chatLog: document.querySelector("#chatLog"),
  clearProfileButton: document.querySelector("#clearProfileButton"),
  closeProfileButton: document.querySelector("#closeProfileButton"),
  composerForm: document.querySelector("#composerForm"),
  contextSizeInput: document.querySelector("#contextSizeInput"),
  disclaimerAcceptButton: document.querySelector("#disclaimerAcceptButton"),
  disclaimerModal: document.querySelector("#disclaimerModal"),
  loadRepositoryButton: document.querySelector("#loadRepositoryButton"),
  darkThemeButton: document.querySelector("#darkThemeButton"),
  deleteAllChatsButton: document.querySelector("#deleteAllChatsButton"),
  deleteCurrentChatButton: document.querySelector("#deleteCurrentChatButton"),
  downloadModelButton: document.querySelector("#downloadModelButton"),
  exportAllChatsButton: document.querySelector("#exportAllChatsButton"),
  exportCurrentChatButton: document.querySelector("#exportCurrentChatButton"),
  explorePanel: document.querySelector("#explorePanel"),
  chatsView: document.querySelector("#chatsView"),
  lightThemeButton: document.querySelector("#lightThemeButton"),
  loadModelButton: document.querySelector("#loadModelButton"),
  loadProgress: document.querySelector("#loadProgress"),
  maxTokensInput: document.querySelector("#maxTokensInput"),
  messageInput: document.querySelector("#messageInput"),
  modelDebugLog: document.querySelector("#modelDebugLog"),
  modelDownloadLinks: document.querySelector("#modelDownloadLinks"),
  modelFilesInput: document.querySelector("#modelFilesInput"),
  modelSelect: document.querySelector("#modelSelect"),
  modelShardInputs: Array.from(document.querySelectorAll(".model-shard-input")),
  modelShardNames: Array.from(document.querySelectorAll(".shard-file-name")),
  modelStatus: document.querySelector("#modelStatus"),
  moreButton: document.querySelector("#moreButton"),
  mobileNavButtons: Array.from(document.querySelectorAll("[data-mobile-target]")),
  newCharacterButton: document.querySelector("#newCharacterButton"),
  newChatButton: document.querySelector("#newChatButton"),
  personaForm: document.querySelector("#personaForm"),
  profileAbout: document.querySelector("#profileAbout"),
  profileBoundaries: document.querySelector("#profileBoundaries"),
  profileButton: document.querySelector("#profileButton"),
  profileForm: document.querySelector("#profileForm"),
  profileInitials: document.querySelector("#profileInitials"),
  profileModal: document.querySelector("#profileModal"),
  profileName: document.querySelector("#profileName"),
  profilePreferences: document.querySelector("#profilePreferences"),
  profilePronouns: document.querySelector("#profilePronouns"),
  repositoryCharacterList: document.querySelector("#repositoryCharacterList"),
  repositoryForm: document.querySelector("#repositoryForm"),
  repositoryMeta: document.querySelector("#repositoryMeta"),
  repositoryStatus: document.querySelector("#repositoryStatus"),
  repositoryUrl: document.querySelector("#repositoryUrl"),
  rememberModelFilesButton: document.querySelector("#rememberModelFilesButton"),
  resetCharacterButton: document.querySelector("#resetCharacterButton"),
  restoreModelFilesButton: document.querySelector("#restoreModelFilesButton"),
  searchButton: document.querySelector("#searchButton"),
  sendButton: document.querySelector("#sendButton"),
  settingsView: document.querySelector("#settingsView"),
  stopButton: document.querySelector("#stopButton"),
  swatchButtons: Array.from(document.querySelectorAll(".swatch")),
  systemThemeButton: document.querySelector("#systemThemeButton"),
  temperatureInput: document.querySelector("#temperatureInput"),
  temperatureValue: document.querySelector("#temperatureValue"),
  topPInput: document.querySelector("#topPInput"),
  topPValue: document.querySelector("#topPValue"),
};

let engine = null;
let isGenerating = false;
let isModelLoading = false;
let activeMobileView = "chats";
let wllamaModulePromise = null;
let generationAbortController = null;
let streamingRenderFrame = null;
const systemPromptTemplates = new Map();
let systemPromptTemplatePromise = null;

const state = {
  activeCharacterId: readJson(STORAGE_KEYS.activeCharacterId, null),
  adultCheck: readJson(STORAGE_KEYS.adultCheck, ADULT_CHECK_DEFAULT),
  characters: readJson(STORAGE_KEYS.characters, DEFAULT_CHARACTERS),
  chats: readJson(STORAGE_KEYS.chats, {}),
  contextSize: readJson(STORAGE_KEYS.contextSize, CONTEXT_SIZE_DEFAULT),
  profile: readJson(STORAGE_KEYS.profile, PROFILE_DEFAULT),
  repository: null,
  theme: readJson(STORAGE_KEYS.theme, THEME_DEFAULT),
};

if (!Array.isArray(state.characters)) {
  state.characters = structuredClone(DEFAULT_CHARACTERS);
}

if (!state.characters.some((character) => character.id === state.activeCharacterId)) {
  state.activeCharacterId = state.characters[0]?.id ?? null;
}

if (!state.adultCheck || typeof state.adultCheck !== "object") {
  state.adultCheck = structuredClone(ADULT_CHECK_DEFAULT);
}

state.adultCheck = {
  ...ADULT_CHECK_DEFAULT,
  ...state.adultCheck,
};

state.contextSize = normalizeContextSize(state.contextSize);

state.profile = {
  ...PROFILE_DEFAULT,
  ...(state.profile && typeof state.profile === "object" ? state.profile : {}),
};

state.theme = {
  ...THEME_DEFAULT,
  ...(state.theme && typeof state.theme === "object" ? state.theme : {}),
};

let rememberedModelFiles = [];

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

function normalizeContextSize(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return CONTEXT_SIZE_DEFAULT;
  }

  const clamped = Math.min(CONTEXT_SIZE_MAX, Math.max(CONTEXT_SIZE_MIN, number));
  return Math.round(clamped);
}

function formatContextSize(value) {
  return normalizeContextSize(value).toLocaleString("en-US");
}

function currentContextSize() {
  return normalizeContextSize(elements.contextSizeInput?.value ?? state.contextSize);
}

function activeCharacter() {
  return state.characters.find((character) => character.id === state.activeCharacterId) ?? null;
}

function activeChat({ create = true } = {}) {
  const character = activeCharacter();
  if (!character) {
    return [];
  }
  if (!state.chats[character.id]) {
    if (!create) {
      return [];
    }
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
  writeJson(STORAGE_KEYS.adultCheck, state.adultCheck);
  writeJson(STORAGE_KEYS.contextSize, state.contextSize);
  writeJson(STORAGE_KEYS.profile, state.profile);
  writeJson(STORAGE_KEYS.theme, state.theme);
}

function adultContentAllowed() {
  return state.adultCheck.checked === true;
}


function hexToRgbTriplet(hex) {
  const normalized = String(hex || THEME_DEFAULT.accent).replace("#", "").trim();
  const value = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;
  const number = Number.parseInt(value, 16);
  if (!Number.isFinite(number)) {
    return "124 77 227";
  }
  return `${(number >> 16) & 255} ${(number >> 8) & 255} ${number & 255}`;
}

function resolvedThemeMode() {
  if (state.theme.mode === "system") {
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return state.theme.mode === "light" ? "light" : "dark";
}

function applyTheme() {
  document.documentElement.dataset.theme = resolvedThemeMode();
  document.documentElement.style.setProperty("--accent", state.theme.accent);
  document.documentElement.style.setProperty("--accent-rgb", hexToRgbTriplet(state.theme.accent));

  if (elements.accentColorInput) {
    elements.accentColorInput.value = state.theme.accent;
  }

  const buttons = [elements.lightThemeButton, elements.darkThemeButton, elements.systemThemeButton].filter(Boolean);
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.theme.mode);
    button.setAttribute("aria-pressed", String(button.dataset.mode === state.theme.mode));
  });

  elements.swatchButtons?.forEach((button) => {
    button.classList.toggle("active", button.dataset.accent?.toLowerCase() === state.theme.accent.toLowerCase());
  });
}

function setThemeMode(mode) {
  state.theme.mode = ["light", "dark", "system"].includes(mode) ? mode : "dark";
  saveAll();
  applyTheme();
}

function setAccentColor(accent) {
  if (!/^#[0-9a-f]{6}$/i.test(accent)) {
    return;
  }
  state.theme.accent = accent.toLowerCase();
  saveAll();
  applyTheme();
}

function renderSidebarModelState(text) {
  const sidebarModelState = document.querySelector("#sidebarModelState");
  if (sidebarModelState) {
    sidebarModelState.textContent = text;
  }
}

function renderAdultCheck() {
  elements.adultCheck.checked = adultContentAllowed();
  elements.adultStatus.textContent = adultContentAllowed()
    ? "Adult checkbox is on for debugging. No camera gate is used."
    : "Adult checkbox is off. Toggle it if you need to debug adult mode.";
}

function setAdultCheck() {
  state.adultCheck.checked = elements.adultCheck.checked;
  saveAll();
  renderAdultCheck();
}

function buildUserProfileText() {
  const profileLines = [
    ["Name or nickname", state.profile.name],
    ["Pronouns", state.profile.pronouns],
    ["About the user", state.profile.about],
    ["Roleplay preferences", state.profile.preferences],
    ["User boundaries", state.profile.boundaries],
  ]
    .filter(([, value]) => String(value ?? "").trim())
    .map(([label, value]) => `${label}: ${String(value).trim()}`);

  return profileLines.length
    ? profileLines.join("\n")
    : "No user profile details saved.";
}

function selectedPromptKey() {
  return selectedModelConfig().promptKey ?? "standard";
}

function promptTemplateText(template) {
  if (Array.isArray(template?.lines)) {
    return template.lines.join("\n");
  }
  if (typeof template?.prompt === "string") {
    return template.prompt;
  }
  throw new Error("Prompt template must include a lines array or prompt string.");
}

async function loadPromptTemplate(promptKey) {
  if (systemPromptTemplates.has(promptKey)) {
    return systemPromptTemplates.get(promptKey);
  }

  const file = SYSTEM_PROMPT_FILES[promptKey] ?? SYSTEM_PROMPT_FILES.standard;
  try {
    const response = await fetch(file, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const template = await response.json();
    systemPromptTemplates.set(promptKey, template);
    return template;
  } catch (error) {
    console.warn(`Using fallback ${promptKey} prompt template.`, error);
    const fallback = SYSTEM_PROMPT_FALLBACKS[promptKey] ?? SYSTEM_PROMPT_FALLBACKS.standard;
    systemPromptTemplates.set(promptKey, fallback);
    return fallback;
  }
}

function loadSystemPromptTemplates() {
  systemPromptTemplatePromise ??= Promise.all(Object.keys(SYSTEM_PROMPT_FILES).map((promptKey) => loadPromptTemplate(promptKey)));
  return systemPromptTemplatePromise;
}

function injectPromptPlaceholders(templateText, character) {
  const replacements = {
    "{NAME}": displayCharacterName(character),
    "{DESCRIPTION}": character.description || "No description provided.",
    "{PERSONALITY}": character.personality || "No personality provided.",
    "{SCENARIO}": character.scenario || "No scenario provided.",
    "{KEYWORDS}": character.keywords || "No keywords provided.",
    "{SYSTEM_PROMPT_EXTRA}": character.systemPromptExtra
      ? `ADDITIONAL CHARACTER INSTRUCTIONS:\n${character.systemPromptExtra}`
      : "",
    "{PROFILE}": buildUserProfileText(),
    "{ADULT_CONTENT_ALLOWED}": adultContentAllowed() ? "true" : "false",
  };

  return Object.entries(replacements).reduce(
    (text, [placeholder, value]) => text.split(placeholder).join(value),
    templateText,
  );
}

async function buildSystemPrompt(character = activeCharacter()) {
  if (!character) {
    throw new Error("Create a persona before sending a message.");
  }

  const template = await loadPromptTemplate(selectedPromptKey());
  return injectPromptPlaceholders(promptTemplateText(template), character);
}

async function chatMessages() {
  return [{ role: "system", content: await buildSystemPrompt() }, ...activeChat({ create: false })];
}

function appendModelDebug(message, details = {}) {
  const timestamp = new Date().toLocaleTimeString();
  const detailEntries = Object.entries(details).filter(([, value]) => value !== undefined && value !== null && value !== "");
  const detailText = detailEntries.length
    ? ` ${detailEntries.map(([key, value]) => `${key}=${value}`).join(" ")}`
    : "";
  const line = `[${timestamp}] ${message}${detailText}`;
  console.debug(`[Talk2Me model] ${message}`, details);

  if (!elements.modelDebugLog) {
    return;
  }

  const previous = elements.modelDebugLog.textContent === "Waiting for shard selection..."
    ? ""
    : elements.modelDebugLog.textContent.trimEnd();
  elements.modelDebugLog.textContent = previous ? `${previous}\n${line}` : line;
  elements.modelDebugLog.scrollTop = elements.modelDebugLog.scrollHeight;
}

function setStatus(text, progress = elements.loadProgress?.value ?? 0) {
  if (elements.modelStatus) {
    elements.modelStatus.textContent = text;
  }
  if (elements.loadProgress) {
    elements.loadProgress.value = Number(progress) || 0;
  }
  renderSidebarModelState(progress >= 1 ? "Model ready" : text.includes("No local") || text.includes("Choose") ? "No model loaded" : "Loading / setup");
  appendModelDebug(text, { progress: elements.loadProgress?.value ?? 0 });
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return minutes ? `${minutes}m ${String(seconds).padStart(2, "0")}s` : `${seconds}s`;
}

function loadWllamaModule() {
  wllamaModulePromise ??= import(WLLAMA_MODULE_URL);
  return wllamaModulePromise;
}

function loadWllamaWasmConfig() {
  return WLLAMA_WASM_CONFIG;
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

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");
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

function initialsFor(value) {
  const parts = String(value || "Untitled")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return (parts[0]?.[0] ?? "U").concat(parts[1]?.[0] ?? "").toUpperCase();
}

function displayCharacterName(character) {
  return String(character?.name ?? "").trim() || "Untitled character";
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

function cleanAssistantContent(content) {
  return content.replace(/^assistant\s*\n/i, "");
}

function createEmptyState(title, detail, actionLabel, action) {
  const empty = document.createElement("div");
  empty.className = "empty-state";

  const heading = document.createElement("strong");
  heading.textContent = title;

  const copy = document.createElement("span");
  copy.textContent = detail;

  empty.append(heading, copy);

  if (actionLabel && action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "text-button secondary";
    button.textContent = actionLabel;
    button.addEventListener("click", action);
    empty.append(button);
  }

  return empty;
}

function renderCharacters() {
  if (!state.characters.length) {
    elements.characterList.replaceChildren(
      createEmptyState("No personas yet", "Create a persona manually or import one from Explore.", "New persona", newCharacter),
    );
    return;
  }

  elements.characterList.replaceChildren(
    ...state.characters.map((character) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "character-card";
      button.setAttribute("aria-pressed", String(character.id === state.activeCharacterId));

      const summary = document.createElement("div");
      summary.className = "character-summary";

      const title = document.createElement("strong");
      title.textContent = displayCharacterName(character);

      const subtitle = document.createElement("span");
      subtitle.textContent = character.keywords || character.description || "No keywords yet";

      summary.append(title, subtitle);
      button.append(createThumbnail(character.thumbnail, displayCharacterName(character), "character-thumb"), summary);
      button.addEventListener("click", () => {
        state.activeCharacterId = character.id;
        saveAll();
        render();
      });
      return button;
    }),
  );
}


function chatPreviewFor(character) {
  const messages = state.chats[character.id] || [];
  const last = [...messages].reverse().find((message) => message.content?.trim());
  if (!last) {
    return "No messages yet";
  }
  const prefix = last.role === "user" ? "You: " : `${displayCharacterName(character)}: `;
  return `${prefix}${last.content}`;
}

function renderChatList() {
  if (!elements.chatList) {
    return;
  }

  const charactersWithChats = state.characters.filter((character) => (state.chats[character.id] || []).length);
  if (!charactersWithChats.length) {
    elements.chatList.replaceChildren(
      createEmptyState("No chats yet", "Create a persona and send a message to start a chat.", "New persona", newCharacter),
    );
    return;
  }

  elements.chatList.replaceChildren(
    ...charactersWithChats.map((character) => {
      const item = document.createElement("article");
      item.className = `chat-item${character.id === state.activeCharacterId ? " active" : ""}`;
      item.dataset.chatId = character.id;

      const main = document.createElement("button");
      main.type = "button";
      main.className = "chat-main";

      const title = document.createElement("span");
      title.className = "chat-title-text";
      title.textContent = displayCharacterName(character);

      const preview = document.createElement("span");
      preview.className = "chat-preview";
      preview.textContent = chatPreviewFor(character);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-chat-button";
      deleteButton.title = "Delete chat";
      deleteButton.setAttribute("aria-label", `Delete chat with ${displayCharacterName(character)}`);
      deleteButton.textContent = "×";

      main.append(title, preview);
      item.append(createThumbnail(character.thumbnail, displayCharacterName(character), "character-thumb"), main, deleteButton);
      return item;
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
  const fields = [
    elements.characterName,
    elements.characterDescription,
    elements.characterPersonality,
    elements.characterScenario,
    elements.characterKeywords,
    elements.characterThumbnail,
    elements.characterOpening,
  ];

  if (!character) {
    fields.forEach((field) => {
      field.value = "";
      field.disabled = true;
    });
    elements.activeCharacterName.textContent = "No persona selected";
    elements.activeCharacterAvatar.replaceChildren();
    elements.activeCharacterAvatar.textContent = "NP";
    elements.messageInput.disabled = true;
    elements.messageInput.placeholder = "Create a persona first";
    elements.sendButton.disabled = true;
    elements.deleteCurrentChatButton.disabled = true;
    elements.moreButton.disabled = true;
    elements.exportCurrentChatButton.disabled = true;
    elements.resetCharacterButton.disabled = true;
    return;
  }

  fields.forEach((field) => {
    field.disabled = false;
  });
  elements.characterName.value = character.name ?? "";
  elements.characterDescription.value = character.description ?? "";
  elements.characterPersonality.value = character.personality ?? "";
  elements.characterScenario.value = character.scenario ?? "";
  elements.characterKeywords.value = character.keywords ?? "";
  elements.characterThumbnail.value = character.thumbnail ?? "";
  elements.characterOpening.value = character.opening ?? "";
  renderActiveCharacterHeader();
  elements.messageInput.disabled = false;
  elements.sendButton.disabled = !engine || isModelLoading || isGenerating;
  elements.deleteCurrentChatButton.disabled = false;
  elements.moreButton.disabled = false;
  elements.exportCurrentChatButton.disabled = !(state.chats[character.id] || []).length;
  elements.resetCharacterButton.disabled = !DEFAULT_CHARACTERS.some((item) => item.id === character.id);
}

function renderActiveCharacterHeader() {
  const character = activeCharacter();
  if (!character) {
    elements.activeCharacterName.textContent = "No persona selected";
    elements.activeCharacterAvatar.replaceChildren();
    elements.activeCharacterAvatar.textContent = "NP";
    elements.messageInput.placeholder = "Create a persona first";
    return;
  }

  const displayName = displayCharacterName(character);
  elements.activeCharacterName.textContent = displayName;
  elements.activeCharacterAvatar.replaceChildren(
    ...createThumbnail(character.thumbnail, displayName, "active-avatar-inner").childNodes,
  );
  if (!elements.activeCharacterAvatar.hasChildNodes()) {
    elements.activeCharacterAvatar.textContent = initialsFor(displayName);
  }
  elements.messageInput.placeholder = `Message ${displayName}...`;
}

function renderChat() {
  const character = activeCharacter();
  if (!character) {
    const empty = createEmptyState("Create a persona", "Talk2Me starts empty now. Add a persona manually, then load a model and begin chatting.", "New persona", newCharacter);
    empty.classList.add("empty-chat");
    elements.chatLog.replaceChildren(empty);
    return;
  }

  const messages = activeChat({ create: false });
  if (!messages.length) {
    const empty = createEmptyState("No messages yet", "Load a model, then send the first message for this persona.");
    empty.classList.add("empty-chat");
    elements.chatLog.replaceChildren(empty);
    return;
  }

  elements.chatLog.replaceChildren(
    ...messages.map((message) => {
      const row = document.createElement("article");
      row.className = `message ${message.role}`;

      const meta = document.createElement("div");
      meta.className = "message-meta";
      meta.textContent = message.role === "user" ? "Player" : displayCharacterName(character);

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
  const contextSize = normalizeContextSize(state.contextSize);
  elements.contextSizeInput.value = String(contextSize);
  elements.temperatureValue.textContent = elements.temperatureInput.value;
  elements.topPValue.textContent = elements.topPInput.value;
}

function updateContextSize() {
  const previousContextSize = state.contextSize;
  state.contextSize = currentContextSize();
  writeJson(STORAGE_KEYS.contextSize, state.contextSize);
  renderSettings();

  if (engine && !isModelLoading && state.contextSize !== previousContextSize) {
    setStatus(`Context size set to ${formatContextSize(state.contextSize)} tokens. Reload the model for it to take effect.`, 1);
  }
}

function renderExportControls() {
  const character = activeCharacter();
  const currentMessages = character ? state.chats[character.id] || [] : [];
  const hasAnyChats = Object.values(state.chats).some((messages) => Array.isArray(messages) && messages.length);

  elements.exportCurrentChatButton.disabled = !currentMessages.length;
  elements.moreButton.disabled = !character || !currentMessages.length;
  elements.exportAllChatsButton.disabled = !hasAnyChats;
  elements.deleteAllChatsButton.disabled = !hasAnyChats;
}

function renderProfile() {
  elements.profileName.value = state.profile.name;
  elements.profilePronouns.value = state.profile.pronouns;
  elements.profileAbout.value = state.profile.about;
  elements.profilePreferences.value = state.profile.preferences;
  elements.profileBoundaries.value = state.profile.boundaries;
  elements.profileInitials.textContent = initialsFor(state.profile.name);
}

function render() {
  applyTheme();
  renderCharacters();
  renderChatList();
  renderRepository();
  renderPersonaForm();
  renderChat();
  renderSettings();
  renderExportControls();
  renderAdultCheck();
  renderProfile();
}

function renderStreamingChat() {
  if (streamingRenderFrame) {
    return;
  }

  streamingRenderFrame = window.requestAnimationFrame(() => {
    streamingRenderFrame = null;
    renderChat();
    renderChatList();
    renderExportControls();
  });
}

function selectedModelConfig() {
  return MODEL_OPTIONS.find((model) => model.model_id === elements.modelSelect.value) ?? MODEL_OPTIONS[0];
}

function shardUrls(model) {
  return Array.from({ length: model.shards }, (_, index) => {
    const shard = String(index + 1).padStart(5, "0");
    return `${ROLLM_RELEASE_BASE}/${model.shardPrefix}-${shard}-of-00005.gguf`;
  });
}

function expectedShardName(model, shardNumber) {
  return `${model.shardPrefix}-${String(shardNumber).padStart(5, "0")}-of-${String(model.shards).padStart(5, "0")}.gguf`;
}

function shardInfoFromName(fileName) {
  const match = fileName.match(/^(.+)-(\d{5})-of-(\d{5})\.gguf$/i);
  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    shardNumber: Number(match[2]),
    shardTotal: Number(match[3]),
  };
}

function shardNumberFromName(fileName) {
  return shardInfoFromName(fileName)?.shardNumber ?? null;
}

function isExpectedModelShard(file, model) {
  const info = file ? shardInfoFromName(file.name) : null;
  return isGgufFile(file)
    && info?.prefix === model.shardPrefix
    && info.shardTotal === model.shards
    && info.shardNumber >= 1
    && info.shardNumber <= model.shards;
}

function isGgufFile(file) {
  return file?.name?.toLowerCase().endsWith(".gguf");
}


const SHARD_HANDLE_DB_NAME = "talk2me-shard-handles";
const SHARD_HANDLE_STORE = "models";

function openShardHandleDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SHARD_HANDLE_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(SHARD_HANDLE_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveRememberedShardHandles(modelId, handles) {
  const db = await openShardHandleDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(SHARD_HANDLE_STORE, "readwrite");
    tx.objectStore(SHARD_HANDLE_STORE).put(handles, modelId);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function readRememberedShardHandles(modelId) {
  const db = await openShardHandleDb();
  const handles = await new Promise((resolve, reject) => {
    const tx = db.transaction(SHARD_HANDLE_STORE, "readonly");
    const request = tx.objectStore(SHARD_HANDLE_STORE).get(modelId);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return Array.isArray(handles) ? handles : [];
}

async function permissionForHandle(handle, ask = false) {
  if (!handle?.queryPermission) {
    return "granted";
  }
  const query = await handle.queryPermission({ mode: "read" });
  if (query === "granted" || !ask || !handle.requestPermission) {
    return query;
  }
  return handle.requestPermission({ mode: "read" });
}

async function chooseAndRememberModelFiles() {
  if (!window.showOpenFilePicker) {
    setStatus("This browser cannot remember huge local GGUF files by handle. Use Chrome or Edge, or choose the shards manually each time.");
    return;
  }

  const model = selectedModelConfig();
  try {
    const handles = await window.showOpenFilePicker({
      multiple: true,
      types: [{ description: "GGUF model shards", accept: { "application/octet-stream": [".gguf"] } }],
      excludeAcceptAllOption: false,
    });

    const files = [];
    for (const handle of handles) {
      const file = await handle.getFile();
      if (isExpectedModelShard(file, model)) {
        files.push(file);
      }
    }

    if (files.length !== model.shards) {
      setStatus(`Selected ${files.length}/${model.shards} matching ${model.label} shards. Pick the exact five ${model.label} .gguf shards.`);
      return;
    }

    await saveRememberedShardHandles(model.model_id, handles);
    rememberedModelFiles = files;
    describeSelectedModelFiles();
    setStatus(`Remembered ${files.length} ${model.label} shard handles. The browser stores file handles, not the huge model bytes.`, 1);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      setStatus(`Could not remember shard files: ${error.message}`);
    }
  }
}

async function restoreRememberedModelFiles({ askPermission = true } = {}) {
  const model = selectedModelConfig();
  if (!indexedDB) {
    return;
  }

  try {
    const handles = await readRememberedShardHandles(model.model_id);
    if (!handles.length) {
      rememberedModelFiles = [];
      describeSelectedModelFiles();
      return;
    }

    const files = [];
    for (const handle of handles) {
      const permission = await permissionForHandle(handle, askPermission);
      if (permission !== "granted") {
        setStatus(`Remembered ${handles.length} shard handles, but the browser needs permission again. Click Restore remembered shards.`);
        return;
      }
      const file = await handle.getFile();
      if (isExpectedModelShard(file, model)) {
        files.push(file);
      }
    }

    rememberedModelFiles = files;
    describeSelectedModelFiles();
    if (files.length) {
      setStatus(`Restored ${files.length}/${model.shards} remembered ${model.label} shards without storing the huge files in localStorage.`, files.length / model.shards);
    }
  } catch (error) {
    console.error(error);
    setStatus(`Could not restore remembered shards: ${error.message}`);
  }
}

function allSelectedGgufFiles() {
  return [
    ...rememberedModelFiles.filter(isGgufFile),
    ...elements.modelShardInputs.map((input) => input.files?.[0]).filter(isGgufFile),
    ...Array.from(elements.modelFilesInput.files ?? []).filter(isGgufFile),
  ];
}

function groupedSelectedShards(model) {
  const groups = new Map();

  allSelectedGgufFiles().forEach((file) => {
    const info = shardInfoFromName(file.name);
    if (!info || info.shardNumber < 1 || info.shardNumber > info.shardTotal) {
      return;
    }

    const key = `${info.prefix}|${info.shardTotal}`;
    const group = groups.get(key) ?? {
      prefix: info.prefix,
      shardTotal: info.shardTotal,
      filesByShard: new Map(),
    };

    if (!group.filesByShard.has(info.shardNumber)) {
      group.filesByShard.set(info.shardNumber, file);
    }

    groups.set(key, group);
  });

  const matchingModelGroup = groups.get(`${model.shardPrefix}|${model.shards}`);
  if (matchingModelGroup) {
    return matchingModelGroup;
  }

  return Array.from(groups.values()).find((group) => group.shardTotal === model.shards && group.filesByShard.size === model.shards)
    ?? null;
}

function selectedModelFiles(model) {
  const group = groupedSelectedShards(model);
  if (!group) {
    return [];
  }

  return Array.from({ length: group.shardTotal }, (_, index) => group.filesByShard.get(index + 1)).filter(Boolean);
}

function selectedModelMissingShards(model) {
  const group = groupedSelectedShards(model);

  if (!group) {
    return Array.from({ length: model.shards }, (_, index) => expectedShardName(model, index + 1));
  }

  return Array.from({ length: group.shardTotal }, (_, index) => `${group.prefix}-${String(index + 1).padStart(5, "0")}-of-${String(group.shardTotal).padStart(5, "0")}.gguf`)
    .filter((_, index) => !group.filesByShard.has(index + 1));
}

function updateShardFileNames() {
  const model = selectedModelConfig();
  const selectedGroup = groupedSelectedShards(model);

  elements.modelShardInputs.forEach((input, index) => {
    const selectedShardNumber = index + 1;
    const file = selectedGroup?.filesByShard.get(selectedShardNumber) ?? input.files?.[0];
    const label = elements.modelShardNames[index];
    if (!label) {
      return;
    }

    label.textContent = file ? file.name : `Needs ${expectedShardName(model, selectedShardNumber)}`;
  });
}

function describeSelectedModelFiles() {
  const model = selectedModelConfig();
  updateShardFileNames();
  const files = selectedModelFiles(model);
  const missingShards = selectedModelMissingShards(model);

  appendModelDebug("Shard selection changed", { selected: files.length, missing: missingShards.length });

  if (!files.length) {
    const selectedGgufCount = allSelectedGgufFiles().length;
    const statusPrefix = selectedGgufCount
      ? `${selectedGgufCount} GGUF file${selectedGgufCount === 1 ? "" : "s"} selected, but no complete ${model.label} shard set was found.`
      : `No local ${model.label} files selected yet.`;
    setStatus(`${statusPrefix} Click Download GGUF Files, then choose shards 1-${model.shards}.`);
    return;
  }

  if (missingShards.length) {
    setStatus(`Selected ${files.length}/${model.shards} ${model.label} GGUF files. Missing: ${missingShards.join(", ")}`, files.length / model.shards);
    return;
  }

  setStatus(`Selected all ${model.shards} ${model.label} GGUF shards. Ready to load.`, 1);
}

function renderModelDownloadLinks() {
  const model = selectedModelConfig();
  elements.modelDownloadLinks.replaceChildren(
    ...shardUrls(model).map((url, index) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop();
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = `Shard ${index + 1}`;
      return link;
    }),
  );
}

function downloadSelectedModelFiles() {
  const model = selectedModelConfig();
  const urls = shardUrls(model);
  renderModelDownloadLinks();
  setStatus(`Download links are ready for ${model.label}. Click each shard link if your browser blocks automatic multiple downloads.`, 0);

  urls.forEach((url, index) => {
    window.setTimeout(() => {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop();
      link.rel = "noopener";
      document.body.append(link);
      link.click();
      link.remove();
      setStatus(`Started download ${index + 1}/${urls.length}: ${link.download}`, (index + 1) / urls.length);
    }, index * 350);
  });
}

async function loadModel() {
  if (isModelLoading) {
    setStatus("A RoLLM GGUF model is already loading. Wait for the ready message before sending.");
    return;
  }

  const selectedModel = selectedModelConfig();
  const contextSize = currentContextSize();
  state.contextSize = contextSize;
  writeJson(STORAGE_KEYS.contextSize, state.contextSize);
  renderSettings();
  await restoreRememberedModelFiles({ askPermission: false });
  const shardFiles = selectedModelFiles(selectedModel);

  const missingNames = selectedModelMissingShards(selectedModel);

  if (shardFiles.length !== selectedModel.shards || missingNames.length) {
    setStatus(`Choose all ${selectedModel.shards} downloaded ${selectedModel.label} GGUF shards before loading. Selected ${shardFiles.length}. Missing: ${missingNames.join(", ") || "unknown shard order"}`);
    return;
  }

  engine = null;
  isModelLoading = true;
  elements.loadModelButton.disabled = true;
  elements.downloadModelButton.disabled = true;
  elements.sendButton.disabled = true;
  const loadStartedAt = Date.now();
  let latestProgress = 0.05;
  const setLoadingStatus = (message, progress = latestProgress) => {
    latestProgress = progress;
    setStatus(`${message} Elapsed: ${formatDuration(Date.now() - loadStartedAt)}. Large 5-shard GGUF models can take several minutes to load.`, progress);
  };
  const loadingHeartbeat = window.setInterval(() => {
    setLoadingStatus(`Still loading ${selectedModel.label}...`);
  }, 15000);

  setLoadingStatus(`Loading ${selectedModel.label} from selected GGUF files...`, latestProgress);

  try {
    appendModelDebug("Loading Wllama runtime", { files: shardFiles.map((file) => file.name).join(",") });
    const [{ Wllama }, wasmConfig] = await Promise.all([loadWllamaModule(), loadWllamaWasmConfig()]);

    if (engine?.exit) {
      await engine.exit();
    }

    appendModelDebug("Wllama runtime ready; starting GGUF load", { shards: shardFiles.length, contextSize });
    const loadedEngine = new Wllama(wasmConfig, { parallelDownloads: 5 });
    await loadedEngine.loadModel(shardFiles, {
      n_ctx: contextSize,
      n_batch: 128,
      progressCallback: ({ loaded, total }) => {
        const progress = total ? loaded / total : latestProgress;
        setLoadingStatus(`Loading selected GGUF files: ${Math.round(progress * 100)}%.`, progress);
      },
    });

    engine = loadedEngine;
    setStatus(`${selectedModel.label} is ready with ${formatContextSize(contextSize)} token context from selected GGUF files.`, 1);
  } catch (error) {
    engine = null;
    console.error(error);
    appendModelDebug("Model load failed", { error: error.message, stack: error.stack });
    setStatus(`Could not load ${selectedModel.label}: ${error.message}`);
  } finally {
    window.clearInterval(loadingHeartbeat);
    isModelLoading = false;
    elements.loadModelButton.disabled = false;
    elements.downloadModelButton.disabled = false;
    elements.sendButton.disabled = !activeCharacter();
  }
}

async function sendMessage(event) {
  event.preventDefault();

  const content = elements.messageInput.value.trim();
  if (!content || isGenerating) {
    return;
  }

  if (!activeCharacter()) {
    setStatus("Create a persona before sending.");
    render();
    return;
  }

  if (isModelLoading) {
    setStatus("RoLLM is still loading. Wait for the ready message before sending.");
    return;
  }

  if (!engine) {
    setStatus("Load a RoLLM GGUF model before sending.");
    return;
  }

  const messages = activeChat();
  messages.push({ role: "user", content });
  const completionMessages = await chatMessages();
  const assistantMessage = { role: "assistant", content: "" };
  messages.push(assistantMessage);
  elements.messageInput.value = "";
  isGenerating = true;
  generationAbortController = new AbortController();
  elements.sendButton.disabled = true;
  elements.stopButton.disabled = false;
  saveAll();
  renderChat();
  renderChatList();
  renderExportControls();

  try {
    let receivedStreamingContent = false;
    await engine.createChatCompletion({
      messages: completionMessages,
      stream: true,
      abortSignal: generationAbortController.signal,
      temperature: Number(elements.temperatureInput.value),
      top_p: Number(elements.topPInput.value),
      max_tokens: Number(elements.maxTokensInput.value),
      onData: (chunk) => {
        const delta = chunk.choices?.[0]?.delta?.content ?? "";
        if (!delta) {
          return;
        }
        receivedStreamingContent = true;
        assistantMessage.content += delta;
        renderStreamingChat();
      },
    });

    if (!receivedStreamingContent) {
      assistantMessage.content = "[No response generated.]";
    }
    saveAll();
    renderChat();
    renderChatList();
    renderExportControls();
  } catch (error) {
    if (error?.name === "AbortError") {
      assistantMessage.content ||= "[Generation stopped.]";
      setStatus("Generation stopped.");
      return;
    }

    console.error(error);
    const errorMessage = error?.message || String(error);
    appendModelDebug("Generation failed", { error: errorMessage, stack: error?.stack });
    assistantMessage.content ||= `[Generation stopped or failed: ${errorMessage}]`;
    setStatus(`Generation stopped or failed: ${errorMessage}`);
  } finally {
    if (streamingRenderFrame) {
      window.cancelAnimationFrame(streamingRenderFrame);
      streamingRenderFrame = null;
    }
    generationAbortController = null;
    isGenerating = false;
    elements.sendButton.disabled = !engine || !activeCharacter();
    elements.stopButton.disabled = true;
    saveAll();
    renderChat();
    renderChatList();
    renderExportControls();
  }
}

function stopGeneration() {
  if (generationAbortController) {
    generationAbortController.abort();
    setStatus("Stopping generation...");
    return;
  }

  isModelLoading = false;
  setStatus("No generation is running.");
}

function updateCharacterFromForm() {
  const character = activeCharacter();
  if (!character) {
    return;
  }
  character.name = elements.characterName.value;
  character.description = elements.characterDescription.value;
  character.personality = elements.characterPersonality.value;
  character.scenario = elements.characterScenario.value;
  character.keywords = elements.characterKeywords.value;
  character.thumbnail = elements.characterThumbnail.value.trim();
  character.opening = elements.characterOpening.value;
  character.adultContentAllowed = false;
  saveAll();
  renderActiveCharacterHeader();
  renderCharacters();
  renderChatList();
  renderChat();
}

function newCharacter() {
  const id = `character-${Date.now()}`;
  state.characters.push({
    id,
    name: "",
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
  elements.characterName.focus();
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

function clearChat(characterId = state.activeCharacterId) {
  const character = state.characters.find((item) => item.id === characterId) || activeCharacter();
  if (!character) {
    return;
  }
  state.chats[character.id] = character.opening
    ? [{ role: "assistant", content: character.opening }]
    : [];
  saveAll();
  renderChat();
  renderChatList();
}

function newChat() {
  if (!activeCharacter()) {
    newCharacter();
    return;
  }
  clearChat(state.activeCharacterId);
}

function deleteCurrentChat() {
  const character = activeCharacter();
  if (!character) {
    return;
  }
  if (!window.confirm(`Delete the chat with ${displayCharacterName(character)}?`)) {
    return;
  }
  clearChat(character.id);
}

function deleteAllChats() {
  const hasChats = Object.values(state.chats).some((messages) => Array.isArray(messages) && messages.length);
  if (!hasChats) {
    setStatus("No chats to delete.");
    return;
  }
  if (!window.confirm("Delete all chats? This cannot be undone.")) {
    return;
  }
  state.chats = {};
  saveAll();
  renderChat();
  renderChatList();
}

function selectChat(characterId) {
  if (!state.characters.some((character) => character.id === characterId)) {
    return;
  }
  state.activeCharacterId = characterId;
  saveAll();
  render();
}

function deleteChatByCharacterId(characterId) {
  const character = state.characters.find((item) => item.id === characterId);
  if (!character) {
    return;
  }
  if (!window.confirm(`Delete the chat with ${displayCharacterName(character)}?`)) {
    return;
  }
  clearChat(characterId);
}

function downloadChat() {
  exportCurrentChat();
}

function safeFilePart(value, fallback = "talk2me") {
  return String(value || fallback)
    .trim()
    .replaceAll(/\W+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .toLowerCase() || fallback;
}

function downloadBlob(content, filename, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatChatTranscript(character, messages) {
  return messages
    .map((message) => `${message.role === "user" ? "Player" : displayCharacterName(character)}: ${message.content}`)
    .join("\n\n");
}

function exportCurrentChat() {
  const character = activeCharacter();
  if (!character) {
    setStatus("Create a persona before exporting a chat.");
    return;
  }

  const messages = state.chats[character.id] || [];
  if (!messages.length) {
    setStatus("No messages to export for the current persona.");
    return;
  }

  downloadBlob(
    formatChatTranscript(character, messages),
    `${safeFilePart(displayCharacterName(character))}-chat.txt`,
  );
  setStatus(`Exported chat with ${displayCharacterName(character)}.`);
}

function exportAllChats() {
  const chats = state.characters
    .map((character) => ({
      character: {
        id: character.id,
        name: displayCharacterName(character),
        description: character.description || "",
        personality: character.personality || "",
        scenario: character.scenario || "",
        keywords: character.keywords || "",
      },
      messages: state.chats[character.id] || [],
    }))
    .filter((entry) => entry.messages.length);

  if (!chats.length) {
    setStatus("No chats to export yet.");
    return;
  }

  const exported = {
    exportedAt: new Date().toISOString(),
    app: "Talk2Me",
    chats,
  };
  const datePart = new Date().toISOString().slice(0, 10);
  downloadBlob(
    JSON.stringify(exported, null, 2),
    `talk2me-chats-${datePart}.json`,
    "application/json",
  );
  setStatus(`Exported ${chats.length} chat${chats.length === 1 ? "" : "s"}.`);
}

function openProfile() {
  renderProfile();
  elements.profileModal.hidden = false;
  elements.profileName.focus();
}

function closeProfile() {
  elements.profileModal.hidden = true;
}

function closeDisclaimer() {
  elements.disclaimerModal.hidden = true;
}

function saveProfile(event) {
  event.preventDefault();
  state.profile = {
    name: elements.profileName.value.trim(),
    pronouns: elements.profilePronouns.value.trim(),
    about: elements.profileAbout.value.trim(),
    preferences: elements.profilePreferences.value.trim(),
    boundaries: elements.profileBoundaries.value.trim(),
  };
  saveAll();
  renderProfile();
  closeProfile();
}

function clearProfile() {
  state.profile = structuredClone(PROFILE_DEFAULT);
  saveAll();
  renderProfile();
}

function focusRepositorySearch() {
  elements.explorePanel.open = true;
  elements.repositoryUrl.focus();
  elements.repositoryUrl.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setMobileNavTarget(target) {
  activeMobileView = target;
  elements.mobileNavButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mobileTarget === activeMobileView);
    button.setAttribute("aria-current", button.dataset.mobileTarget === activeMobileView ? "page" : "false");
  });
}

function navigateMobile(target) {
  setMobileNavTarget(target);

  if (target === "profile") {
    openProfile();
    return;
  }

  const scrollOptions = { behavior: "smooth", block: "start" };
  if (target === "chats") {
    elements.chatsView.scrollIntoView(scrollOptions);
    return;
  }

  if (target === "explore") {
    elements.explorePanel.open = true;
    elements.explorePanel.scrollIntoView(scrollOptions);
    return;
  }

  elements.settingsView.scrollIntoView(scrollOptions);
}

elements.composerForm?.addEventListener("submit", sendMessage);
elements.backButton?.addEventListener("click", () => elements.characterList?.scrollIntoView({ behavior: "smooth" }));
elements.clearProfileButton?.addEventListener("click", clearProfile);
elements.closeProfileButton?.addEventListener("click", closeProfile);
elements.deleteAllChatsButton?.addEventListener("click", deleteAllChats);
elements.deleteCurrentChatButton?.addEventListener("click", deleteCurrentChat);
elements.disclaimerAcceptButton?.addEventListener("click", closeDisclaimer);
elements.downloadModelButton?.addEventListener("click", downloadSelectedModelFiles);
elements.exportAllChatsButton?.addEventListener("click", exportAllChats);
elements.exportCurrentChatButton?.addEventListener("click", exportCurrentChat);
elements.loadModelButton?.addEventListener("click", loadModel);
elements.modelFilesInput?.addEventListener("change", describeSelectedModelFiles);
elements.modelShardInputs.forEach((input) => input.addEventListener("change", describeSelectedModelFiles));
elements.modelSelect?.addEventListener("change", () => {
  if (!isModelLoading) {
    engine = null;
  }
  rememberedModelFiles = [];
  renderModelDownloadLinks();
  loadPromptTemplate(selectedPromptKey());
  restoreRememberedModelFiles({ askPermission: false });
  describeSelectedModelFiles();
});
elements.moreButton?.addEventListener("click", downloadChat);
elements.mobileNavButtons.forEach((button) => {
  button.addEventListener("click", () => navigateMobile(button.dataset.mobileTarget));
});
elements.newCharacterButton?.addEventListener("click", newCharacter);
elements.newChatButton?.addEventListener("click", newChat);
elements.adultCheck?.addEventListener("change", setAdultCheck);
elements.personaForm?.addEventListener("input", updateCharacterFromForm);
elements.profileButton?.addEventListener("click", openProfile);
elements.profileForm?.addEventListener("submit", saveProfile);
elements.profileModal?.addEventListener("click", (event) => {
  if (event.target === elements.profileModal) {
    closeProfile();
  }
});
elements.repositoryForm?.addEventListener("submit", loadRepository);
elements.resetCharacterButton?.addEventListener("click", resetActiveCharacter);
elements.searchButton?.addEventListener("click", focusRepositorySearch);
elements.stopButton?.addEventListener("click", stopGeneration);
elements.contextSizeInput?.addEventListener("change", updateContextSize);
elements.temperatureInput?.addEventListener("input", renderSettings);
elements.topPInput?.addEventListener("input", renderSettings);
elements.lightThemeButton?.addEventListener("click", () => setThemeMode("light"));
elements.darkThemeButton?.addEventListener("click", () => setThemeMode("dark"));
elements.systemThemeButton?.addEventListener("click", () => setThemeMode("system"));
elements.accentColorInput?.addEventListener("input", (event) => setAccentColor(event.target.value));
elements.swatchButtons?.forEach((button) => button.addEventListener("click", () => setAccentColor(button.dataset.accent)));
elements.rememberModelFilesButton?.addEventListener("click", chooseAndRememberModelFiles);
elements.restoreModelFilesButton?.addEventListener("click", () => restoreRememberedModelFiles({ askPermission: true }));
elements.chatList?.addEventListener("click", (event) => {
  const item = event.target.closest("[data-chat-id]");
  if (!item) {
    return;
  }

  if (event.target.closest(".delete-chat-button")) {
    deleteChatByCharacterId(item.dataset.chatId);
    return;
  }

  selectChat(item.dataset.chatId);
});

window.matchMedia?.("(prefers-color-scheme: light)").addEventListener?.("change", applyTheme);

renderModelOptions();
renderModelDownloadLinks();
setMobileNavTarget("chats");
loadSystemPromptTemplates();
applyTheme();
render();
restoreRememberedModelFiles({ askPermission: false });

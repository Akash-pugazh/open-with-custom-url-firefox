const DEFAULT_URL = "https://removepaywalls.com/";

const input = document.getElementById("baseUrl");
const previewBase = document.getElementById("previewBase");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

function normalizeBaseUrl(rawValue) {
  const trimmed = String(rawValue || "").trim();
  const withDefault = trimmed || DEFAULT_URL;
  const parsed = new URL(withDefault);

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Base URL must use http or https.");
  }

  return withDefault.endsWith("/") ? withDefault : `${withDefault}/`;
}

function showToast(msg = "Saved") {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

async function loadSavedValue() {
  try {
    const result = await browser.storage.local.get("baseUrl");
    const value = normalizeBaseUrl(result.baseUrl);
    input.value = value;
    updatePreview(value);
  } catch (error) {
    console.error("Failed to load saved URL:", error);
    input.value = DEFAULT_URL;
    updatePreview(DEFAULT_URL);
    showToast("Using default URL");
  }
}

input.addEventListener("input", () => {
  updatePreview(input.value);
});

function updatePreview(val) {
  let base = val.trim();
  if (base && !base.endsWith("/")) base += "/";
  previewBase.textContent = base || DEFAULT_URL;
}

saveBtn.addEventListener("click", async () => {
  try {
    const value = normalizeBaseUrl(input.value);
    input.value = value;
    updatePreview(value);
    await browser.storage.local.set({ baseUrl: value });
    showToast("Saved");
  } catch (error) {
    console.error("Failed to save URL:", error);
    showToast("Invalid URL");
  }
});

resetBtn.addEventListener("click", async () => {
  input.value = DEFAULT_URL;
  updatePreview(DEFAULT_URL);
  try {
    await browser.storage.local.set({ baseUrl: DEFAULT_URL });
    showToast("Reset");
  } catch (error) {
    console.error("Failed to reset URL:", error);
    showToast("Reset failed");
  }
});

loadSavedValue();

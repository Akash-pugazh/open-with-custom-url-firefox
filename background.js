const MENU_ID = "open-with-custom-url";
const DEFAULT_BASE_URL = "https://removepaywalls.com/";

let baseUrl = DEFAULT_BASE_URL;

function normalizeBaseUrl(rawValue) {
  const trimmed = String(rawValue || "").trim();
  const withDefault = trimmed || DEFAULT_BASE_URL;
  const parsed = new URL(withDefault);

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Base URL must use http or https.");
  }

  return withDefault.endsWith("/") ? withDefault : `${withDefault}/`;
}

function trimLabel(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
  } catch (error) {
    console.warn("Failed to parse base URL for menu label:", error);
    return url.length > 30 ? `${url.slice(0, 30)}…` : url;
  }
}

async function createMenu() {
  await browser.contextMenus.removeAll();
  await browser.contextMenus.create({
    id: MENU_ID,
    title: `Open with: ${trimLabel(baseUrl)}`,
    contexts: ["link"],
  });
}

async function initialize() {
  try {
    const result = await browser.storage.local.get("baseUrl");
    baseUrl = normalizeBaseUrl(result.baseUrl);
  } catch (error) {
    console.error("Failed to initialize extension settings:", error);
    baseUrl = DEFAULT_BASE_URL;
  }

  try {
    await createMenu();
  } catch (error) {
    console.error("Failed to create context menu:", error);
  }
}

browser.storage.onChanged.addListener((changes) => {
  if (!changes.baseUrl) {
    return;
  }

  try {
    baseUrl = normalizeBaseUrl(changes.baseUrl.newValue);
    browser.contextMenus.update(MENU_ID, {
      title: `Open with: ${trimLabel(baseUrl)}`,
    });
  } catch (error) {
    console.error("Invalid base URL update ignored:", error);
  }
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID || !info.linkUrl) {
    return;
  }

  const finalUrl = `${baseUrl}${info.linkUrl}`;
  browser.tabs.create({ url: finalUrl }).catch((error) => {
    console.error("Failed to open redirected URL:", error);
  });
});

initialize();

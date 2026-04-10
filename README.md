# Open With Custom URL (Firefox Extension)

Right-click any link and open it through a custom base URL prefix.

Example:

- Base URL: `https://removepaywalls.com/`
- Link: `https://example.com/article`
- Final URL: `https://removepaywalls.com/https://example.com/article`

## Features

- Context menu entry for all links: **Open with: <your base URL>**
- Popup UI for setting and saving your base URL
- Input validation (http/https only)
- Persistent local storage for settings

## Install (Temporary for local testing)

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json` from this project

## Build release package

```bash
zip -r open-with-custom-url-firefox-1.1.0.zip manifest.json background.js popup.html popup.js icons
```

## Permissions

- `contextMenus`: adds right-click menu item on links
- `storage`: stores configured base URL
- `tabs`: opens transformed URL in a new tab

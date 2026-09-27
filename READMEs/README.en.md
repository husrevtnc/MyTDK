<div align="center">
  <h1>MyTDK</h1>
  <p><strong>A modern dictionary interface for Turkish words, idioms, and proverbs.</strong></p>
  <p>Powered by TDK dictionary services · Turkish UI · Self-hostable</p>
  <p><a href="../README.md">Türkçe</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a></p>
</div>

---

## Overview

MyTDK is a Node.js web application for looking up Turkish word definitions, idioms, and proverbs in one place. It retrieves live results from TDK's online dictionary services and includes a bundled local word list for quick suggestions.

> **Data source:** Live dictionary results come from TDK services. `autocomplete.json` is a local suggestion list bundled with the app. TDK does not publish or endorse this project. The server needs internet access for live searches and audio features.

## Features

- Live word suggestions and scrollable results
- Word, idiom, and proverb searches
- TDK word recordings and Turkish text-to-speech
- Responsive red and white interface with a red and black dark theme
- Simple Node.js server; no frontend build step

## Quick start

### Requirements

- **Node.js 18 or later**
- npm (included with Node.js)
- Internet access for live TDK searches and audio services

### Install and run

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Open **http://localhost:4173**. If the `PORT` environment variable is set, the server uses that port; otherwise it listens on `4173`.

## API endpoints

| Request | Purpose |
| --- | --- |
| `GET /healthz` | Health check: `{"status":"ok"}` |
| `GET /api/autocomplete` | Returns local suggestions from `autocomplete.json` |
| `GET /api/suggestions?ara=...` | Fetches matching TDK word suggestions; requires at least two characters |
| `GET /api/gts?ara=...` | Searches the TDK Current Turkish Dictionary |
| `GET /api/atasozu?ara=...` | Searches TDK idioms and proverbs |
| `GET /api/ses/{code}.wav` | Proxies a TDK word recording |
| `POST /api/tts` | Converts the JSON `text` field to MP3; up to 3,000 characters |

## Dependencies and layout

The frontend uses plain HTML, CSS, and JavaScript. The server uses Node.js built-in modules for HTTP, files, paths, and streams.

The only direct npm dependency in `package.json` is [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api). It is declared but not directly imported by the current `server.js`. `npm ci` installs the dependency tree pinned in `package-lock.json`.

```text
MyTDK/
├── index.html          # UI and browser application
├── server.js           # HTTP server, TDK proxy, and audio endpoints
├── autocomplete.json   # Local search suggestions
├── package.json        # npm scripts and dependencies
├── package-lock.json   # Locked npm dependency tree
├── LICENSE             # MIT license
└── READMEs/            # Translated README files
```

## External services and privacy

- `api.sozluk.gov.tr` provides dictionary results, suggestions, and word recordings.
- Text-to-speech sends text from the server to Google Translate's TTS endpoint (`translate.google.com/translate_tts`). Its availability and terms are controlled by the external provider.
- Search text is sent to the relevant service when the feature is used. No API key or `.env` file is required.

Live searches or audio may be temporarily unavailable if an upstream service cannot be reached. Local suggestions require `autocomplete.json`.

## License

The source code is released under the [MIT License](../LICENSE). MIT does not automatically apply to TDK dictionary content, TDK-derived data in the local list, or third-party audio services; those may have separate rights and terms.

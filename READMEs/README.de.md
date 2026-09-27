<div align="center">
  <h1>MyTDK</h1>
  <p><strong>Eine moderne Wörterbuchoberfläche für türkische Wörter, Redewendungen und Sprichwörter.</strong></p>
  <p>Wörterbuchdienste des TDK · Türkische Oberfläche · Selbst hostbar</p>
  <p><a href="../README.md">Türkçe</a> · <a href="README.en.md">English</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a></p>
</div>

---

## Überblick

MyTDK ist eine Node.js-Webanwendung, mit der sich türkische Wortbedeutungen, Redewendungen und Sprichwörter über eine Oberfläche suchen lassen. Die Anwendung ruft Live-Ergebnisse von den Online-Wörterbuchdiensten des TDK ab und enthält eine lokale Wortliste für schnelle Vorschläge.

> **Datenquelle:** Live-Wörterbuchergebnisse stammen von TDK-Diensten. `autocomplete.json` ist eine mitgelieferte lokale Vorschlagsliste. Dieses Projekt wird nicht vom TDK veröffentlicht oder unterstützt. Für Live-Suche und Audio benötigt der Server Internetzugang.

## Funktionen

- Live-Wortvorschläge und scrollbar angezeigte Treffer
- Suche nach Wörtern, Redewendungen und Sprichwörtern
- TDK-Wortaufnahmen und türkische Text-to-Speech-Funktion
- Responsive rot-weiße Oberfläche mit rot-schwarzem dunklem Design
- Einfacher Node.js-Server ohne Frontend-Build-Schritt

## Schnellstart

### Voraussetzungen

- **Node.js 18 oder neuer**
- npm (in Node.js enthalten)
- Internetzugang für Live-Suchen bei TDK und Audiodienste

### Installation und Start

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Öffne **http://localhost:4173** im Browser. Wenn `PORT` gesetzt ist, verwendet der Server diesen Port; andernfalls lauscht er auf `4173`.

## API-Endpunkte

| Anfrage | Zweck |
| --- | --- |
| `GET /healthz` | Statusprüfung: `{"status":"ok"}` |
| `GET /api/autocomplete` | Gibt lokale Vorschläge aus `autocomplete.json` zurück |
| `GET /api/suggestions?ara=...` | Ruft passende TDK-Wortvorschläge ab; mindestens zwei Zeichen erforderlich |
| `GET /api/gts?ara=...` | Suche im aktuellen türkischen Wörterbuch des TDK |
| `GET /api/atasozu?ara=...` | Suche nach TDK-Redewendungen und Sprichwörtern |
| `GET /api/ses/{code}.wav` | Gibt eine TDK-Wortaufnahme weiter |
| `POST /api/tts` | Wandelt das JSON-Feld `text` in MP3 um; höchstens 3000 Zeichen |

## Abhängigkeiten und Aufbau

Das Frontend verwendet unverändertes HTML, CSS und JavaScript. Der Server nutzt integrierte Node.js-Module für HTTP, Dateien, Pfade und Streams.

Die einzige direkte npm-Abhängigkeit in `package.json` ist [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api). Sie ist deklariert, wird aber vom aktuellen `server.js` nicht direkt importiert. `npm ci` installiert den in `package-lock.json` festgelegten Abhängigkeitsbaum.

```text
MyTDK/
├── index.html          # Oberfläche und Browseranwendung
├── server.js           # HTTP-Server, TDK-Zugriff und Audio-Endpunkte
├── autocomplete.json   # Lokale Suchvorschläge
├── package.json        # npm-Skripte und Abhängigkeiten
├── package-lock.json   # Fixierter npm-Abhängigkeitsbaum
├── LICENSE             # MIT-Lizenz
└── READMEs/            # Übersetzte README-Dateien
```

## Externe Dienste und Datenschutz

- `api.sozluk.gov.tr` liefert Wörterbuchergebnisse, Vorschläge und Wortaufnahmen.
- Für die Sprachausgabe sendet der Server den Text an den TTS-Endpunkt von Google Translate (`translate.google.com/translate_tts`). Verfügbarkeit und Bedingungen bestimmt der externe Anbieter.
- Bei der Nutzung einer Funktion wird der Suchtext an den jeweiligen Dienst übermittelt. Ein API-Schlüssel oder eine `.env`-Datei ist nicht erforderlich.

Live-Suche und Audio können vorübergehend ausfallen, wenn ein externer Dienst nicht erreichbar ist. Lokale Vorschläge benötigen `autocomplete.json`.

## Lizenz

Der Quellcode steht unter der [MIT-Lizenz](../LICENSE). Diese gilt nicht automatisch für TDK-Wörterbuchinhalte, von TDK abgeleitete Daten in der lokalen Liste oder Audioangebote Dritter; dafür können eigene Rechte und Bedingungen gelten.

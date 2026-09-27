# MyTDK — Akıllı Türkçe Sözlük

[Türkçe](#türkçe) · [English](#english) · [Español](#español) · [Deutsch](#deutsch) · [Français](#français)

---

## Türkçe

MyTDK; Türkçe kelimeleri, deyimleri ve atasözlerini aramak için hazırlanmış, TDK sözlük servislerini kullanan bir web uygulamasıdır. Arayüz; arama önerileri, aydınlık/koyu tema ve ses özellikleri sunar.

### Özellikler

- TDK Güncel Türkçe Sözlük'te kelime ve anlam arama
- TDK arama servisi üzerinden kelime önerileri
- Atasözü ve deyim arama
- TDK tarafından sunulan kelime seslerini oynatma
- Metni Türkçe seslendirme
- Aydınlık ve koyu tema
- Yerel öneriler için projeyle gelen `autocomplete.json`
- Render gibi ortamlarda `PORT` ortam değişkeni ve `/healthz` sağlık kontrolü

> Kelime ve ifade sonuçları TDK'nin çevrimiçi servislerinden alınır; uygulama TDK tarafından yayımlanmış veya desteklenmiş değildir. `autocomplete.json` yerel bir listedir ve TDK arama servisiyle aynı kapsamda ya da güncellikte olmayabilir. Canlı arama için internet bağlantısı gerekir.

### Gereksinimler

- Node.js **18 veya üzeri** (yerleşik `fetch`, `AbortSignal.timeout` ve `node:` modülleri kullanılır)
- npm (Node.js ile birlikte gelir)
- Canlı sözlük araması ve ses servisleri için sunucunun internet erişimi

### Kurulum ve çalıştırma

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Tarayıcıda `http://localhost:4173` adresini açın. Sunucu, Render gibi ortamlarda verilen `PORT` değerini kullanır; yerel ortamda `PORT` ayarlanmamışsa `4173` portunu kullanır.

### Render'da dağıtım

Depoyu Render'da bir **Web Service** olarak dağıtın:

- **Build command:** `npm ci`
- **Start command:** `npm start`
- **Health check path (isteğe bağlı):** `/healthz`

Uygulama `0.0.0.0` adresinde ve platformun sağladığı `PORT` üzerinde dinler. Render için ayrıca sabit bir port tanımlamayın. Sürekli erişilebilirlik, seçilen Render planına bağlıdır.

### Bağımlılıklar

`package.json` içindeki doğrudan npm bağımlılığı:

- [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api) (`^1.0.0`): manifestte tanımlıdır ancak mevcut `server.js` bu paketi doğrudan içe aktarmaz. `npm ci`, tam bağımlılık ağacını `package-lock.json` dosyasına göre kurar.

Sunucu HTTP, dosya sistemi, yol ve akış işlemlerinde Node.js'in `node:http`, `node:fs`, `node:path` ve `node:stream` yerleşik modüllerini kullanır. Ön yüz HTML/CSS/JavaScript'tir; React, derleme aracı veya ek tarayıcı paketi gerekmez. `autocomplete.json` dosyası depo kökünde bulunmalıdır.

### Dış servisler ve sunucu uçları

- `api.sozluk.gov.tr`: kelime anlamları, deyim/atasözü araması, öneriler ve TDK kelime sesleri.
- `translate.google.com/translate_tts`: “Oku” özelliği için Türkçe MP3 üretir. Harici bir servistir; erişilebilirliği ve kullanım koşulları sağlayıcıya bağlıdır.

| Uç | Açıklama |
| --- | --- |
| `GET /healthz` | Sağlık kontrolü; `{"status":"ok"}` döndürür. |
| `GET /api/autocomplete` | Yerel `autocomplete.json` listesini döndürür. |
| `GET /api/suggestions?ara=...` | TDK'den kelime önerileri alır; en az iki karakter gerekir. |
| `GET /api/gts?ara=...` | TDK Güncel Türkçe Sözlük araması. |
| `GET /api/atasozu?ara=...` | TDK atasözü/deyim araması. |
| `GET /api/ses/{kod}.wav` | TDK ses kaydını sunar. |
| `POST /api/tts` | `{"text":"Seslendirilecek metin"}` gövdesiyle MP3 üretir; en fazla 3000 karakter. |

TDK veya ses servisine erişilemiyorsa canlı arama ya da seslendirme geçici olarak çalışmayabilir. Yerel öneriler, `autocomplete.json` mevcut olduğu sürece sunulur.

### Proje yapısı

```text
.
├── index.html          # Arayüz ve tarayıcı tarafı kodu
├── server.js           # HTTP sunucusu ve TDK/ses servislerine geçit
├── autocomplete.json   # Yerel arama öneri listesi
├── package.json        # npm komutları ve doğrudan bağımlılıklar
└── package-lock.json   # Kilitlenmiş npm bağımlılık ağacı
```

### Lisans ve içerik

Depoda `LICENSE` dosyası yoksa kaynak kod için belirli bir açık kaynak lisansı varsaymayın. TDK sözlük içerikleri, `autocomplete.json` verileri ve harici ses servisleri bu projenin kaynak kodundan ayrı hak ve koşullara tabi olabilir.

---

## English

MyTDK is a web application for searching Turkish words, idioms, and proverbs through TDK dictionary services. Its Turkish interface includes search suggestions, light and dark themes, and audio features.

### Features

- Search words and definitions in the TDK Current Turkish Dictionary
- Get word suggestions from TDK's search service
- Search for proverbs and idioms
- Play word recordings provided by TDK
- Read text aloud in Turkish
- Light and dark themes
- Bundled local suggestions in `autocomplete.json`
- `PORT` environment variable and `/healthz` health check for platforms such as Render

> Word and expression results come from TDK's online services. This project is not published or endorsed by TDK. The bundled `autocomplete.json` is a local list and may differ in coverage or freshness from TDK search. Internet access is required for live searches.

### Requirements

- Node.js **18 or later** (uses built-in `fetch`, `AbortSignal.timeout`, and `node:` modules)
- npm (included with Node.js)
- Server internet access for live dictionary searches and audio services

### Install and run

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Open `http://localhost:4173` in your browser. The server uses the `PORT` value supplied by platforms such as Render. If it is not set, the default is `4173`.

### Deploy on Render

Deploy the repository as a Render **Web Service**:

- **Build command:** `npm ci`
- **Start command:** `npm start`
- **Health check path (optional):** `/healthz`

The app listens on `0.0.0.0` and the platform-provided `PORT`. Do not hard-code a separate port for Render. Continuous availability depends on the selected Render plan.

### Dependencies

The direct npm dependency in `package.json` is:

- [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api) (`^1.0.0`): declared in the manifest, but not directly imported by the current `server.js`. `npm ci` installs the dependency tree recorded in `package-lock.json`.

The server uses Node.js built-in modules (`node:http`, `node:fs`, `node:path`, and `node:stream`). The frontend is plain HTML/CSS/JavaScript; no React, build tool, or additional browser package is required. `autocomplete.json` must be present in the repository root.

### External services and server endpoints

- `api.sozluk.gov.tr`: definitions, idiom/proverb searches, suggestions, and TDK word recordings.
- `translate.google.com/translate_tts`: generates Turkish MP3 audio for the “Read aloud” feature. This is an external service; availability and terms are controlled by its provider.

| Endpoint | Description |
| --- | --- |
| `GET /healthz` | Health check; returns `{"status":"ok"}`. |
| `GET /api/autocomplete` | Returns the local `autocomplete.json` list. |
| `GET /api/suggestions?ara=...` | Fetches word suggestions from TDK; requires at least two characters. |
| `GET /api/gts?ara=...` | Searches the TDK Current Turkish Dictionary. |
| `GET /api/atasozu?ara=...` | Searches TDK proverbs and idioms. |
| `GET /api/ses/{code}.wav` | Serves a TDK audio recording. |
| `POST /api/tts` | Generates MP3 from `{"text":"Text to read"}`; maximum 3,000 characters. |

Live search or audio may be temporarily unavailable if TDK or the speech provider cannot be reached. Local suggestions remain available as long as `autocomplete.json` is present.

### Project structure

```text
.
├── index.html          # UI and browser-side code
├── server.js           # HTTP server and TDK/audio service proxy
├── autocomplete.json   # Local search suggestions
├── package.json        # npm scripts and direct dependencies
└── package-lock.json   # Locked npm dependency tree
```

### License and content

If this repository has no `LICENSE` file, do not assume a particular open-source license applies to the source code. TDK dictionary content, `autocomplete.json` data, and external audio services may be subject to terms and rights separate from this project's source code.

---

## Español

MyTDK es una aplicación web para buscar palabras turcas, modismos y proverbios mediante los servicios de diccionario de TDK. Su interfaz en turco incluye sugerencias de búsqueda, temas claro y oscuro y funciones de audio.

### Funciones

- Buscar palabras y definiciones en el Diccionario Actual de Turco de TDK
- Obtener sugerencias de palabras del servicio de búsqueda de TDK
- Buscar proverbios y modismos
- Reproducir grabaciones de palabras proporcionadas por TDK
- Escuchar texto leído en turco
- Temas claro y oscuro
- Sugerencias locales incluidas en `autocomplete.json`
- Variable `PORT` y comprobación `/healthz` para plataformas como Render

> Los resultados proceden de los servicios en línea de TDK. TDK no publica ni respalda este proyecto. `autocomplete.json` es una lista local y puede diferir en cobertura o actualización del buscador de TDK. Las búsquedas en directo requieren Internet.

### Requisitos

- Node.js **18 o posterior** (usa `fetch`, `AbortSignal.timeout` y módulos `node:` integrados)
- npm (incluido con Node.js)
- Acceso a Internet desde el servidor para las búsquedas y los servicios de audio

### Instalación y ejecución

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Abre `http://localhost:4173` en el navegador. El servidor utiliza el valor de `PORT` de plataformas como Render; si no está definido, usa `4173`.

### Despliegue en Render

Despliega el repositorio como **Web Service** de Render:

- **Build command:** `npm ci`
- **Start command:** `npm start`
- **Health check path (opcional):** `/healthz`

La aplicación escucha en `0.0.0.0` y en el `PORT` proporcionado por la plataforma. No configures un puerto fijo para Render. La disponibilidad continua depende del plan elegido.

### Dependencias

La dependencia npm directa declarada en `package.json` es:

- [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api) (`^1.0.0`): figura en el manifiesto, pero el `server.js` actual no la importa directamente. `npm ci` instala el árbol fijado en `package-lock.json`.

El servidor usa módulos integrados de Node.js (`node:http`, `node:fs`, `node:path` y `node:stream`). La interfaz usa HTML/CSS/JavaScript, sin React, herramienta de compilación ni paquetes adicionales de navegador. `autocomplete.json` debe estar en la raíz del repositorio.

### Servicios externos y endpoints

- `api.sozluk.gov.tr`: definiciones, búsquedas de modismos y proverbios, sugerencias y grabaciones de TDK.
- `translate.google.com/translate_tts`: genera audio MP3 en turco para la lectura en voz alta. Es un servicio externo; su disponibilidad y condiciones dependen del proveedor.

| Endpoint | Descripción |
| --- | --- |
| `GET /healthz` | Comprobación de estado; devuelve `{"status":"ok"}`. |
| `GET /api/autocomplete` | Devuelve la lista local `autocomplete.json`. |
| `GET /api/suggestions?ara=...` | Obtiene sugerencias de TDK; requiere al menos dos caracteres. |
| `GET /api/gts?ara=...` | Busca en el Diccionario Actual de Turco de TDK. |
| `GET /api/atasozu?ara=...` | Busca proverbios y modismos de TDK. |
| `GET /api/ses/{código}.wav` | Sirve una grabación de audio de TDK. |
| `POST /api/tts` | Genera MP3 desde `{"text":"Texto para leer"}`; máximo 3000 caracteres. |

La búsqueda o el audio pueden no estar disponibles temporalmente si TDK o el proveedor de voz no responde. Las sugerencias locales funcionan mientras exista `autocomplete.json`.

### Estructura del proyecto

```text
.
├── index.html          # Interfaz y código del navegador
├── server.js           # Servidor HTTP y acceso a servicios TDK/audio
├── autocomplete.json   # Sugerencias locales
├── package.json        # Scripts npm y dependencias directas
└── package-lock.json   # Árbol de dependencias bloqueado
```

### Licencia y contenido

Si el repositorio no contiene un archivo `LICENSE`, no se debe asumir una licencia concreta para el código fuente. Los contenidos del diccionario de TDK, los datos de `autocomplete.json` y los servicios de audio externos pueden estar sujetos a derechos y condiciones independientes.

---

## Deutsch

MyTDK ist eine Webanwendung zur Suche nach türkischen Wörtern, Redewendungen und Sprichwörtern über die Wörterbuchdienste des TDK. Die türkischsprachige Oberfläche bietet Suchvorschläge, helle und dunkle Darstellung sowie Audiofunktionen.

### Funktionen

- Wörter und Bedeutungen im aktuellen türkischen Wörterbuch des TDK suchen
- Wortvorschläge über den Suchdienst des TDK erhalten
- Sprichwörter und Redewendungen suchen
- Vom TDK bereitgestellte Wortaufnahmen abspielen
- Türkischen Text vorlesen lassen
- Helles und dunkles Design
- Lokale Vorschlagsliste `autocomplete.json`
- `PORT`-Umgebungsvariable und `/healthz`-Statusprüfung für Plattformen wie Render

> Ergebnisse stammen aus den Onlinediensten des TDK. Dieses Projekt wird nicht vom TDK veröffentlicht oder unterstützt. `autocomplete.json` ist eine lokale Liste und kann sich in Umfang oder Aktualität von der TDK-Suche unterscheiden. Für Live-Suchen ist eine Internetverbindung erforderlich.

### Voraussetzungen

- Node.js **18 oder neuer** (verwendet integriertes `fetch`, `AbortSignal.timeout` und `node:`-Module)
- npm (in Node.js enthalten)
- Internetzugang für Live-Suchen und Audiodienste

### Installation und Start

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Öffne `http://localhost:4173` im Browser. Der Server verwendet auf Plattformen wie Render den Wert von `PORT`; ohne diese Variable gilt der Standardport `4173`.

### Bereitstellung auf Render

Stelle das Repository als Render **Web Service** bereit:

- **Build command:** `npm ci`
- **Start command:** `npm start`
- **Health check path (optional):** `/healthz`

Die Anwendung lauscht auf `0.0.0.0` und dem von der Plattform vorgegebenen `PORT`. Lege für Render keinen zusätzlichen festen Port fest. Die dauerhafte Verfügbarkeit hängt vom gewählten Render-Tarif ab.

### Abhängigkeiten

Die direkte npm-Abhängigkeit in `package.json` lautet:

- [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api) (`^1.0.0`): im Manifest eingetragen, wird aber vom aktuellen `server.js` nicht direkt importiert. `npm ci` installiert den in `package-lock.json` festgelegten Abhängigkeitsbaum.

Der Server nutzt integrierte Node.js-Module (`node:http`, `node:fs`, `node:path` und `node:stream`). Das Frontend besteht aus HTML/CSS/JavaScript; React, Build-Werkzeug oder zusätzliche Browserpakete sind nicht erforderlich. `autocomplete.json` muss im Stammverzeichnis liegen.

### Externe Dienste und Endpunkte

- `api.sozluk.gov.tr`: Wortbedeutungen, Suchen nach Redewendungen und Sprichwörtern, Vorschläge und TDK-Wortaufnahmen.
- `translate.google.com/translate_tts`: erzeugt türkische MP3-Ausgabe für die Vorlesefunktion. Verfügbarkeit und Nutzungsbedingungen bestimmt der externe Anbieter.

| Endpunkt | Beschreibung |
| --- | --- |
| `GET /healthz` | Statusprüfung; liefert `{"status":"ok"}`. |
| `GET /api/autocomplete` | Gibt die lokale Liste `autocomplete.json` zurück. |
| `GET /api/suggestions?ara=...` | Ruft Wortvorschläge vom TDK ab; mindestens zwei Zeichen erforderlich. |
| `GET /api/gts?ara=...` | Suche im aktuellen türkischen Wörterbuch des TDK. |
| `GET /api/atasozu?ara=...` | Suche nach TDK-Sprichwörtern und Redewendungen. |
| `GET /api/ses/{code}.wav` | Stellt eine TDK-Audioaufnahme bereit. |
| `POST /api/tts` | Erzeugt MP3 aus `{"text":"Vorlesetext"}`; maximal 3000 Zeichen. |

Live-Suche oder Audio können vorübergehend ausfallen, wenn TDK oder der Sprachdienst nicht erreichbar sind. Lokale Vorschläge funktionieren, solange `autocomplete.json` vorhanden ist.

### Projektstruktur

```text
.
├── index.html          # Oberfläche und Browsercode
├── server.js           # HTTP-Server und Zugriff auf TDK-/Audiodienste
├── autocomplete.json   # Lokale Suchvorschläge
├── package.json        # npm-Skripte und direkte Abhängigkeiten
└── package-lock.json   # Gesperrter npm-Abhängigkeitsbaum
```

### Lizenz und Inhalte

Enthält das Repository keine `LICENSE`-Datei, sollte keine bestimmte Open-Source-Lizenz für den Quellcode angenommen werden. TDK-Wörterbuchinhalte, Daten in `autocomplete.json` und externe Audiodienste können eigenen Rechten und Bedingungen unterliegen.

---

## Français

MyTDK est une application web permettant de rechercher des mots turcs, des expressions idiomatiques et des proverbes à l’aide des services de dictionnaire du TDK. Son interface en turc propose des suggestions, des thèmes clair et sombre et des fonctions audio.

### Fonctionnalités

- Rechercher des mots et définitions dans le dictionnaire actuel du turc du TDK
- Obtenir des suggestions via le service de recherche du TDK
- Rechercher des proverbes et des expressions idiomatiques
- Écouter les enregistrements de mots fournis par le TDK
- Faire lire un texte en turc
- Thèmes clair et sombre
- Suggestions locales fournies dans `autocomplete.json`
- Variable `PORT` et contrôle de santé `/healthz` pour des plateformes comme Render

> Les résultats proviennent des services en ligne du TDK. Ce projet n’est ni publié ni approuvé par le TDK. `autocomplete.json` est une liste locale dont la couverture ou l’actualité peut différer de la recherche du TDK. Une connexion Internet est nécessaire pour les recherches en direct.

### Prérequis

- Node.js **18 ou version ultérieure** (utilise `fetch`, `AbortSignal.timeout` et les modules intégrés `node:`)
- npm (fourni avec Node.js)
- Accès Internet du serveur pour les recherches et services audio

### Installation et démarrage

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Ouvrez `http://localhost:4173` dans votre navigateur. Sur Render, le serveur utilise la valeur de `PORT` fournie par la plateforme ; sans cette variable, le port `4173` est utilisé.

### Déploiement sur Render

Déployez le dépôt comme **Web Service** Render :

- **Build command :** `npm ci`
- **Start command :** `npm start`
- **Health check path (facultatif) :** `/healthz`

L’application écoute sur `0.0.0.0` et sur le `PORT` fourni par la plateforme. Ne définissez pas de port fixe supplémentaire pour Render. La disponibilité continue dépend de l’offre choisie.

### Dépendances

La dépendance npm directe déclarée dans `package.json` est :

- [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api) (`^1.0.0`) : déclarée dans le manifeste, mais non importée directement par le `server.js` actuel. `npm ci` installe l’arbre verrouillé dans `package-lock.json`.

Le serveur utilise les modules intégrés de Node.js (`node:http`, `node:fs`, `node:path` et `node:stream`). L’interface utilise HTML/CSS/JavaScript sans React, outil de compilation ni paquet navigateur supplémentaire. `autocomplete.json` doit être à la racine du dépôt.

### Services externes et routes

- `api.sozluk.gov.tr` : définitions, recherches de proverbes et d’expressions, suggestions et enregistrements audio du TDK.
- `translate.google.com/translate_tts` : génère l’audio MP3 en turc pour la lecture à voix haute. Sa disponibilité et ses conditions dépendent du fournisseur externe.

| Route | Description |
| --- | --- |
| `GET /healthz` | Contrôle de santé ; renvoie `{"status":"ok"}`. |
| `GET /api/autocomplete` | Renvoie la liste locale `autocomplete.json`. |
| `GET /api/suggestions?ara=...` | Récupère les suggestions du TDK ; deux caractères minimum. |
| `GET /api/gts?ara=...` | Recherche dans le dictionnaire actuel du turc du TDK. |
| `GET /api/atasozu?ara=...` | Recherche des proverbes et expressions du TDK. |
| `GET /api/ses/{code}.wav` | Sert un enregistrement audio du TDK. |
| `POST /api/tts` | Génère un MP3 depuis `{"text":"Texte à lire"}` ; 3 000 caractères maximum. |

La recherche ou l’audio peuvent être temporairement indisponibles si le TDK ou le fournisseur vocal ne répond pas. Les suggestions locales restent disponibles tant que `autocomplete.json` est présent.

### Structure du projet

```text
.
├── index.html          # Interface et code du navigateur
├── server.js           # Serveur HTTP et accès aux services TDK/audio
├── autocomplete.json   # Suggestions locales
├── package.json        # Scripts npm et dépendances directes
└── package-lock.json   # Arbre des dépendances verrouillé
```

### Licence et contenu

Si le dépôt ne contient pas de fichier `LICENSE`, ne supposez pas qu’une licence open source particulière s’applique au code source. Les contenus du dictionnaire du TDK, les données de `autocomplete.json` et les services audio tiers peuvent être soumis à des droits et conditions distincts.

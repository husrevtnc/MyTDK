<div align="center">
  <h1>MyTDK</h1>
  <p><strong>Une interface moderne pour rechercher des mots turcs, des expressions et des proverbes.</strong></p>
  <p>Services de dictionnaire du TDK · Interface en turc · Hébergeable chez soi</p>
  <p><a href="../README.md">Türkçe</a> · <a href="README.en.md">English</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a></p>
</div>

---

## Présentation

MyTDK est une application web Node.js qui permet de rechercher des définitions turques, des expressions idiomatiques et des proverbes dans une seule interface. Elle récupère les résultats en direct auprès des services de dictionnaire en ligne du TDK et fournit une liste locale de mots pour les suggestions rapides.

> **Source des données :** Les résultats en direct proviennent des services du TDK. `autocomplete.json` est une liste locale fournie avec l’application. Ce projet n’est ni publié ni approuvé par le TDK. Le serveur doit accéder à Internet pour les recherches et l’audio en direct.

## Fonctionnalités

- Suggestions de mots en direct et résultats défilables
- Recherche de mots, d’expressions et de proverbes
- Enregistrements audio du TDK et synthèse vocale en turc
- Interface responsive rouge et blanche, avec thème sombre rouge et noir
- Serveur Node.js simple, sans compilation du frontend

## Démarrage rapide

### Prérequis

- **Node.js 18 ou version ultérieure**
- npm (fourni avec Node.js)
- Internet pour les recherches auprès du TDK et les services audio

### Installation et lancement

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Ouvrez **http://localhost:4173** dans votre navigateur. Si la variable `PORT` est définie, le serveur utilise ce port ; sinon, il écoute sur `4173`.

## Routes API

| Requête | Fonction |
| --- | --- |
| `GET /healthz` | Contrôle de santé : `{"status":"ok"}` |
| `GET /api/autocomplete` | Renvoie les suggestions locales de `autocomplete.json` |
| `GET /api/suggestions?ara=...` | Récupère les suggestions du TDK ; deux caractères minimum |
| `GET /api/gts?ara=...` | Recherche dans le dictionnaire actuel du turc du TDK |
| `GET /api/atasozu?ara=...` | Recherche d’expressions et de proverbes du TDK |
| `GET /api/ses/{code}.wav` | Transmet un enregistrement de mot du TDK |
| `POST /api/tts` | Convertit le champ JSON `text` en MP3 ; 3 000 caractères maximum |

## Dépendances et structure

Le frontend utilise HTML, CSS et JavaScript sans framework. Le serveur utilise les modules intégrés de Node.js pour HTTP, les fichiers, les chemins et les flux.

L’unique dépendance npm directe de `package.json` est [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api). Elle est déclarée, mais n’est pas importée directement par le `server.js` actuel. `npm ci` installe l’arbre verrouillé dans `package-lock.json`.

```text
MyTDK/
├── index.html          # Interface et application navigateur
├── server.js           # Serveur HTTP, accès au TDK et routes audio
├── autocomplete.json   # Suggestions locales
├── package.json        # Scripts npm et dépendances
├── package-lock.json   # Arbre des dépendances verrouillé
├── LICENSE             # Licence MIT
└── READMEs/            # README traduits
```

## Services externes et confidentialité

- `api.sozluk.gov.tr` fournit les résultats du dictionnaire, les suggestions et les enregistrements de mots.
- Pour la lecture vocale, le serveur envoie le texte au point d’accès TTS de Google Traduction (`translate.google.com/translate_tts`). Sa disponibilité et ses conditions dépendent de ce fournisseur externe.
- Le texte recherché est transmis au service correspondant lorsque la fonction est utilisée. Aucune clé API ni aucun fichier `.env` n’est requis.

La recherche en direct ou l’audio peuvent être temporairement indisponibles si un service externe ne répond pas. Les suggestions locales nécessitent `autocomplete.json`.

## Licence

Le code source est distribué sous la [licence MIT](../LICENSE). Celle-ci ne couvre pas automatiquement le contenu du dictionnaire du TDK, les données dérivées du TDK dans la liste locale ni les services audio tiers ; des droits et conditions distincts peuvent s’appliquer.

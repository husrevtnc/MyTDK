<div align="center">
  <h1>MyTDK</h1>
  <p><strong>Una interfaz moderna para consultar palabras, modismos y proverbios turcos.</strong></p>
  <p>Servicios de diccionario del TDK · Interfaz en turco · Autohospedable</p>
  <p><a href="../README.md">Türkçe</a> · <a href="README.en.md">English</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a></p>
</div>

---

## Descripción

MyTDK es una aplicación web Node.js para consultar definiciones, modismos y proverbios turcos desde una sola interfaz. Obtiene resultados en directo de los servicios de diccionario en línea de TDK e incluye una lista local de palabras para sugerencias rápidas.

> **Fuente de datos:** Los resultados en directo proceden de los servicios de TDK. `autocomplete.json` es una lista local incluida con la aplicación. TDK no publica ni respalda este proyecto. El servidor necesita acceso a Internet para las búsquedas y el audio en directo.

## Funciones

- Sugerencias de palabras en directo y resultados desplazables
- Búsqueda de palabras, modismos y proverbios
- Grabaciones de palabras de TDK y lectura de texto en turco
- Interfaz adaptable roja y blanca, con tema oscuro rojo y negro
- Servidor Node.js sencillo, sin compilación del frontend

## Inicio rápido

### Requisitos

- **Node.js 18 o posterior**
- npm (incluido con Node.js)
- Internet para las búsquedas en TDK y los servicios de audio

### Instalación y ejecución

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Abre **http://localhost:4173**. Si se define la variable `PORT`, el servidor utiliza ese puerto; de lo contrario, escucha en `4173`.

## Endpoints API

| Solicitud | Función |
| --- | --- |
| `GET /healthz` | Estado del servidor: `{"status":"ok"}` |
| `GET /api/autocomplete` | Devuelve sugerencias locales de `autocomplete.json` |
| `GET /api/suggestions?ara=...` | Obtiene sugerencias coincidentes de TDK; requiere al menos dos caracteres |
| `GET /api/gts?ara=...` | Busca en el Diccionario Actual de Turco de TDK |
| `GET /api/atasozu?ara=...` | Busca modismos y proverbios de TDK |
| `GET /api/ses/{código}.wav` | Transmite una grabación de palabra de TDK |
| `POST /api/tts` | Convierte el campo JSON `text` a MP3; hasta 3000 caracteres |

## Dependencias y estructura

El frontend usa HTML, CSS y JavaScript sin bibliotecas adicionales. El servidor utiliza módulos integrados de Node.js para HTTP, archivos, rutas y flujos.

La única dependencia npm directa de `package.json` es [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api). Está declarada, pero el `server.js` actual no la importa directamente. `npm ci` instala las dependencias fijadas en `package-lock.json`.

```text
MyTDK/
├── index.html          # Interfaz y aplicación del navegador
├── server.js           # Servidor HTTP, acceso a TDK y audio
├── autocomplete.json   # Sugerencias locales
├── package.json        # Scripts y dependencias npm
├── package-lock.json   # Árbol de dependencias fijado
├── LICENSE             # Licencia MIT
└── READMEs/            # README traducidos
```

## Servicios externos y privacidad

- `api.sozluk.gov.tr` proporciona resultados del diccionario, sugerencias y grabaciones de palabras.
- La lectura de texto envía el contenido desde el servidor al endpoint TTS de Google Translate (`translate.google.com/translate_tts`). Su disponibilidad y condiciones dependen del proveedor externo.
- El texto buscado se envía al servicio correspondiente cuando se utiliza la función. No se necesita una clave API ni un archivo `.env`.

Las búsquedas o el audio pueden no estar disponibles temporalmente si falla un servicio externo. Las sugerencias locales requieren `autocomplete.json`.

## Licencia

El código fuente se publica bajo la [licencia MIT](../LICENSE). Esta no se aplica automáticamente al contenido del diccionario de TDK, a los datos derivados de TDK en la lista local ni a los servicios de audio de terceros; pueden tener derechos y condiciones propios.

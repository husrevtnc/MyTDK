const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 4173;
const TDK_API = 'https://api.sozluk.gov.tr';
const suggestionCache = new Map();
const ttsCache = new Map();
const browserHeaders = {
  Origin: 'https://sozluk.gov.tr',
  Referer: 'https://sozluk.gov.tr/',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site'
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const isHeadRequest = request.method === 'HEAD';
  const supportsHead = isHeadRequest && ['/', '/index.html', '/healthz'].includes(url.pathname);
  const isTTSRequest = request.method === 'POST' && url.pathname === '/api/tts';
  if (request.method !== 'GET' && !supportsHead && !isTTSRequest) {
    response.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'Yalnızca GET istekleri destekleniyor.' }));
    return;
  }

  if (isTTSRequest) {
    try {
      const body = await readBody(request, 12000);
      const text = String(JSON.parse(body).text || '').trim();
      if (!text || text.length > 3000) {
        response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ error: 'Seslendirilecek metin boş veya çok uzun.' }));
        return;
      }
      let audio = ttsCache.get(text);
      if (!audio) {
        audio = await createTurkishSpeech(text);
        ttsCache.set(text, audio);
        while (ttsCache.size > 40) ttsCache.delete(ttsCache.keys().next().value);
      }
      response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audio.length,
        'Cache-Control': 'private, max-age=3600'
      });
      response.end(audio);
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'Türkçe ses üretilemedi.' }));
    }
    return;
  }

  if (url.pathname === '/healthz') {
    const body = JSON.stringify({ status: 'ok' });
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-store'
    });
    response.end(isHeadRequest ? undefined : body);
    return;
  }

  if (url.pathname === '/api/autocomplete') {
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    });
    response.end(fs.readFileSync(path.join(__dirname, 'autocomplete.json')));
    return;
  }

  if (url.pathname === '/api/suggestions') {
    const query = (url.searchParams.get('ara') || '').trim();
    if (query.length < 2 || query.length > 100) {
      response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'En az iki harfli bir arama girin.' }));
      return;
    }

    const cacheKey = query.toLocaleLowerCase('tr-TR');
    try {
      let pending = suggestionCache.get(cacheKey);
      if (!pending) {
        pending = fetchAllWordSuggestions(query);
        suggestionCache.set(cacheKey, pending);
      }
      const words = await pending;
      suggestionCache.delete(cacheKey);
      suggestionCache.set(cacheKey, Promise.resolve(words));
      while (suggestionCache.size > 40) suggestionCache.delete(suggestionCache.keys().next().value);
      response.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      });
      response.end(JSON.stringify(words));
    } catch (error) {
      suggestionCache.delete(cacheKey);
      response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'TDK kelime önerileri alınamadı.' }));
    }
    return;
  }

  const soundMatch = url.pathname.match(/^\/api\/ses\/([a-z0-9_-]+)\.wav$/i);
  if (soundMatch) {
    try {
      const soundUrl = new URL(`/ses/${encodeURIComponent(soundMatch[1])}.wav`, TDK_API);
      const upstream = await fetch(soundUrl, { headers: browserHeaders, signal: AbortSignal.timeout(15000) });
      if (!upstream.ok || !upstream.body) {
        response.writeHead(upstream.status || 404);
        response.end();
        return;
      }
      response.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') || 'audio/wav',
        ...(upstream.headers.get('content-length') ? { 'Content-Length': upstream.headers.get('content-length') } : {}),
        'Cache-Control': 'public, max-age=86400'
      });
      require('node:stream').Readable.fromWeb(upstream.body).pipe(response);
    } catch (_) {
      response.writeHead(502);
      response.end();
    }
    return;
  }

  if (url.pathname === '/api/gts' || url.pathname === '/api/atasozu') {
    const query = (url.searchParams.get('ara') || '').trim();
    if (!query || query.length > 160) {
      response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'Geçerli bir arama sözü girin.' }));
      return;
    }
    const endpoint = url.pathname === '/api/gts' ? '/gts' : '/ads';
    const upstream = new URL(endpoint, TDK_API);
    upstream.searchParams.set('ara', query);
    if (endpoint === '/ads') upstream.searchParams.set('searchType', 'web');
    try {
      const result = await fetch(upstream, { headers: browserHeaders, signal: AbortSignal.timeout(20000) });
      response.writeHead(result.status, {
        'Content-Type': result.headers.get('content-type') || 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      response.end(await result.text());
    } catch (error) {
      response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'TDK servisine ulaşılamadı.', detail: error.name === 'TimeoutError' ? 'timeout' : 'network' }));
    }
    return;
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    const body = fs.readFileSync(path.join(__dirname, 'index.html'));
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': body.length
    });
    response.end(isHeadRequest ? undefined : body);
    return;
  }
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Bulunamadı');
});

async function createTurkishSpeech(text) {
  const chunks = splitSpeechText(text, 180);
  const audioChunks = [];
  for (let index = 0; index < chunks.length; index++) {
    const params = new URLSearchParams({
      ie: 'UTF-8',
      client: 'tw-ob',
      tl: 'tr',
      total: String(chunks.length),
      idx: String(index),
      textlen: String(chunks[index].length),
      q: chunks[index]
    });
    const response = await fetch(`https://translate.google.com/translate_tts?${params}`, {
      headers: {
        Referer: 'https://translate.google.com/',
        'User-Agent': 'Mozilla/5.0'
      },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`TTS provider returned ${response.status}`);
    const audio = Buffer.from(await response.arrayBuffer());
    const hasId3Header = audio.subarray(0, 3).equals(Buffer.from('ID3'));
    const hasMpegFrame = audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0;
    if (audio.length < 100 || (!hasId3Header && !hasMpegFrame)) {
      throw new Error('TTS provider returned invalid audio');
    }
    audioChunks.push(audio);
  }
  return Buffer.concat(audioChunks);
}

function splitSpeechText(text, maxLength) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let chunk = '';
  for (const word of words) {
    if (word.length > maxLength) throw new Error('A word is too long to synthesize.');
    if (chunk && chunk.length + word.length + 1 > maxLength) {
      chunks.push(chunk);
      chunk = '';
    }
    chunk += `${chunk ? ' ' : ''}${word}`;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

async function fetchAllWordSuggestions(query) {
  const pageSize = 50;
  const fetchPage = async offset => {
    const upstream = new URL('/gts-yeni/arama', TDK_API);
    upstream.searchParams.set('q', query);
    upstream.searchParams.set('mode', 'start');
    upstream.searchParams.set('scope', 'madde');
    upstream.searchParams.set('sort', 'madde_asc');
    upstream.searchParams.set('limit', String(pageSize));
    upstream.searchParams.set('offset', String(offset));
    upstream.searchParams.set('searchType', 'web');
    const result = await fetch(upstream, { headers: browserHeaders, signal: AbortSignal.timeout(30000) });
    if (!result.ok) throw new Error(`TDK ${result.status}`);
    return result.json();
  };

  const firstPage = await fetchPage(0);
  const total = Math.max(0, Number(firstPage.toplam) || 0);
  const pages = [firstPage];
  for (let start = pageSize; start < total; start += pageSize * 8) {
    const offsets = [];
    for (let offset = start; offset < Math.min(total, start + pageSize * 8); offset += pageSize) offsets.push(offset);
    pages.push(...await Promise.all(offsets.map(fetchPage)));
  }

  const unique = new Map();
  pages.flatMap(page => page.sonuclar || []).forEach(item => {
    if (item.madde) unique.set(String(item.madde).toLocaleLowerCase('tr-TR'), { madde: item.madde });
  });
  return [...unique.values()];
}

function readBody(request, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', chunk => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Request body too large'));
        request.resume();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

server.listen(PORT, '0.0.0.0', () => console.log(`TDK Akıllı Sözlük hazır: http://localhost:${PORT}`));

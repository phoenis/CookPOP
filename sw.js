// Service worker di CookPOP: apertura veloce e funzionamento offline.
//
// - Pagina (index.html / navigazione): prima la rete, sempre rivalidata
//   (così una versione nuova arriva subito, come senza service worker); la
//   copia in cache si usa solo se la rete non risponde entro NET_TIMEOUT_MS
//   o manca del tutto.
// - File con "?v=" (app.js, catalog.js, style.css): prima la cache — il
//   numero di versione cambia a ogni modifica, quindi una copia salvata non
//   è mai vecchia. Quando arriva una versione nuova, la vecchia si cancella.
// - Altri file dello stesso sito (icone, manifest): la cache risponde
//   subito, intanto si aggiorna in background.
// - Tutto il resto (Firebase, Google Fonts...) non passa di qui.
//
// "Aggiorna app" (app.js) cancella cache e service worker e ricarica: resta
// l'azzeramento totale di sempre, al caricamento dopo il SW si riregistra.
const CACHE = 'cookpop-v1';
const NET_TIMEOUT_MS = 4000;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;
  if(req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')){
    event.respondWith(networkFirst(req));
  } else if(url.searchParams.has('v')){
    event.respondWith(cacheFirstVersioned(req, url));
  } else {
    event.respondWith(staleWhileRevalidate(event, req));
  }
});

async function networkFirst(req){
  const cache = await caches.open(CACHE);
  // La pagina si salva sempre sotto la stessa chiave (senza query/hash),
  // qualunque URL l'abbia aperta.
  const key = new URL('./', self.location).href;
  const fromNet = fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
    if(res.ok) cache.put(key, res.clone());
    return res;
  });
  fromNet.catch(() => {}); // se vince il timeout, un errore di rete dopo non va segnalato
  const timeout = new Promise(resolve => setTimeout(resolve, NET_TIMEOUT_MS, null));
  try{
    const res = await Promise.race([fromNet, timeout]);
    if(res) return res;
  }catch(e){ /* offline: si prova la cache */ }
  const cached = await cache.match(key);
  if(cached) return cached;
  return fromNet; // niente in cache: si aspetta la rete, qualunque cosa succeda
}

async function cacheFirstVersioned(req, url){
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  if(cached) return cached;
  const res = await fetch(req);
  if(res.ok){
    await cache.put(req, res.clone());
    // via le versioni precedenti dello stesso file
    const keys = await cache.keys();
    await Promise.all(keys.filter(k => {
      const u = new URL(k.url);
      return u.pathname === url.pathname && u.search !== url.search;
    }).map(k => cache.delete(k)));
  }
  return res;
}

async function staleWhileRevalidate(event, req){
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const update = fetch(req).then(res => {
    if(res.ok) cache.put(req, res.clone());
    return res;
  });
  if(cached){
    event.waitUntil(update.catch(() => {}));
    return cached;
  }
  return update;
}

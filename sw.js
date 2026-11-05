// Clean Cut V10 service worker.
// - The app page is network-first, so updates always arrive, and falls back to the saved copy offline.
// - The converter files are pinned versions, so they are saved once and served from the phone after that.
// - version.json and the download services always go straight to the network.
const SHELL = 'sc-shell-v10';
const LIBS = 'sc-libs-v1';
const SHELL_FILES = ['index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const CDN = 'https://cdn.jsdelivr.net/npm/';
const LIB_FILES = [
  CDN + '@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js',
  CDN + '@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js',
  CDN + '@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
  CDN + '@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
  CDN + 'mediabunny@1.61.3/dist/bundles/mediabunny.min.mjs',
];
const INDEX = new URL('index.html', self.registration.scope).href;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    await shell.addAll(SHELL_FILES);
    // Best effort: save the converter now so the app works offline after the first visit.
    const libs = await caches.open(LIBS);
    await Promise.all(LIB_FILES.map(async u => {
      try {
        if (await libs.match(u)) return;
        const r = await fetch(u, { mode: 'cors' });
        if (r.ok) await libs.put(u, r);
      } catch {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) {
      if (k.startsWith('sc-shell-') && k !== SHELL) await caches.delete(k);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (url.pathname.endsWith('/version.json')) return;
    e.respondWith(networkFirst(req));
  } else if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(cacheFirst(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  const isPage = req.mode === 'navigate';
  const target = isPage ? INDEX : req.url; // every page address in this app is the same page
  try {
    const res = await fetch(target, { cache: 'no-cache' });
    if (res.ok) cache.put(target, res.clone());
    return res;
  } catch {
    return (await cache.match(target)) || (await cache.match(INDEX)) || Response.error();
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(LIBS);
  const hit = await cache.match(req.url);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req.url, res.clone());
  return res;
}

// JK Compressores — Calculadora Técnica
// A cada nova versão publicada, altere o número abaixo (ex.: v1-3) para o app baixar os arquivos novos.
const CACHE = 'jk-calculadora-v1-2';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './logo-jk.png', './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Com internet: busca a versão mais nova e guarda cópia. Sem internet: usa a cópia guardada.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});

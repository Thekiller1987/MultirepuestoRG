const CACHE = 'waskar-pos-v1'
const ASSETS = ['/', '/index.html', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.url.includes('/rest/v1') || req.url.includes('/functions/v1') || req.url.includes('/rpc/')) {
    event.respondWith(
      fetch(req).then(res => res).catch(() => caches.match(req))
    )
  } else {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const resClone = res.clone()
        caches.open(CACHE).then(cache => cache.put(req, resClone))
        return res
      }))
    )
  }
})
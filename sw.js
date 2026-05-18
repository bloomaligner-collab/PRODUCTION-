// Cedarwings SAS — service worker.
// Network-first so the app is never stale while online, with a
// cached fallback so it still opens offline. Same-origin only —
// Supabase / esm.sh / fonts are never intercepted.

const CACHE = 'cw-app-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (url.origin !== self.location.origin) return; // leave APIs/CDNs alone

  event.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok && fresh.type === 'basic') {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const start = await caches.match('./index.html');
        if (start) return start;
      }
      throw err;
    }
  })());
});

// Forward-compatible: if web-push is added later, these already work.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  const title = data.title || '💬 Cedarwings';
  const options = {
    body: data.body || 'New message',
    tag: data.tag || 'cw-chat',
    data: { url: data.url || './chat.html' },
    icon: './icon.svg',
    badge: './icon.svg',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { c.focus(); if ('navigate' in c) c.navigate(target).catch(() => {}); return; }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});

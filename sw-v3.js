// Cedarwings SAS — service worker v3.
// Rotated from sw-v2.js to evict workers stuck on stale code (the
// "flashing hamburger" reload loop). sw.js and sw-v2.js are now
// self-destruct shims; this is the real worker.
// HTML / .js / .css → network-first with a 4-s fallback to cache.
// Static assets → stale-while-revalidate. Same-origin only.

const CACHE = 'cw-app-v11';
const NAV_TIMEOUT = 4000;
const PUSH_ACK_URL = 'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/push-ack';
const PUSH_ACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cm1hZG16enVhbHF1a3h4bHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0Mjc3MDQsImV4cCI6MjA5MjAwMzcwNH0.KmVRMz17T4f_FKgWSjr9LTh0DIMsJVyOGuC0k-v1BQs';

self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

function putCache(req, res) {
  if (res && res.ok && res.type === 'basic') {
    caches.open(CACHE).then((c) => c.put(req, res.clone())).catch(() => {});
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (url.origin !== self.location.origin) return;

  const path = url.pathname.toLowerCase();
  const codeLike = req.mode === 'navigate'
    || (req.headers.get('accept') || '').includes('text/html')
    || path.endsWith('.js') || path.endsWith('.css')
    || path.endsWith('.html') || path.endsWith('/');

  if (codeLike) {
    event.respondWith((async () => {
      try {
        const net = fetch(req, { cache: 'reload' }).then((r) => putCache(req, r));
        const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), NAV_TIMEOUT));
        return await Promise.race([net, timeout]);
      } catch (err) {
        const cached = await caches.match(req);
        if (cached) return cached;
        const start = await caches.match('./index.html');
        if (start) return start;
        return fetch(req);
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    const net = fetch(req).then((r) => putCache(req, r)).catch(() => null);
    return cached || (await net) || fetch(req);
  })());
});

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  const title = data.title || '💬 Cedarwings';
  const options = {
    body: data.body || 'New message',
    tag: data.tag || 'cw-chat',
    data: { url: data.url || './chat.html', logId: data.logId || null },
    icon: './icon.svg',
    badge: './icon.svg',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const d = event.notification.data || {};
  const target = d.url || './index.html';
  event.waitUntil((async () => {
    if (d.logId) {
      try {
        await fetch(`${PUSH_ACK_URL}?id=${encodeURIComponent(d.logId)}`, {
          method: 'POST',
          headers: { apikey: PUSH_ACK_KEY, Authorization: `Bearer ${PUSH_ACK_KEY}` },
        });
      } catch (e) { /* opened-tracking is best-effort */ }
    }
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { c.focus(); if ('navigate' in c) c.navigate(target).catch(() => {}); return; }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});

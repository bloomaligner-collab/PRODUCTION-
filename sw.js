// Cedarwings SAS — service worker.
// HTML pages: network-first with a short timeout so a slow network
// can never hang the app — it falls back to the cached copy fast.
// Static assets: stale-while-revalidate for instant loads.
// Same-origin only — Supabase / esm.sh / fonts are never intercepted.

const CACHE = 'cw-app-v7';
const NAV_TIMEOUT = 4000;
// Acknowledge notification opens for the delivery dashboard.
const PUSH_ACK_URL = 'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/push-ack';
const PUSH_ACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cm1hZG16enVhbHF1a3h4bHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0Mjc3MDQsImV4cCI6MjA5MjAwMzcwNH0.KmVRMz17T4f_FKgWSjr9LTh0DIMsJVyOGuC0k-v1BQs';

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

// Let the page tell a waiting SW to take over immediately.
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
  if (url.origin !== self.location.origin) return; // leave APIs/CDNs alone

  // HTML *and* behaviour-critical code (.js/.css) are network-first so
  // the installed app never runs stale logic after a deploy. Only inert
  // assets (icons/fonts/manifest) are served cache-first.
  const path = url.pathname.toLowerCase();
  const codeLike = req.mode === 'navigate'
    || (req.headers.get('accept') || '').includes('text/html')
    || path.endsWith('.js') || path.endsWith('.css')
    || path.endsWith('.html') || path.endsWith('/');

  if (codeLike) {
    // Network-first, but never wait longer than NAV_TIMEOUT.
    event.respondWith((async () => {
      try {
        // 'reload' bypasses the browser HTTP cache so a freshly deployed
        // page/script can never be masked by a stale disk-cached copy.
        const net = fetch(req, { cache: 'reload' }).then((r) => putCache(req, r));
        const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), NAV_TIMEOUT));
        return await Promise.race([net, timeout]);
      } catch (err) {
        const cached = await caches.match(req);
        if (cached) return cached;
        const start = await caches.match('./index.html');
        if (start) return start;
        return fetch(req); // last resort, let the browser surface the error
      }
    })());
    return;
  }

  // Inert assets: serve cache instantly, refresh in the background.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const net = fetch(req).then((r) => putCache(req, r)).catch(() => null);
    return cached || (await net) || fetch(req);
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

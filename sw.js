// Cedarwings SAS — self-destruct service worker.
// Devices stuck on an old cached copy of this worker kept serving stale
// JS (the "flashing hamburger" reload loop) and never picked up new
// deploys. The browser re-checks this script periodically; when it sees
// THIS version it purges every cache, unregisters itself, and reloads any
// open tab so the device fetches fresh code with no worker controlling it.
// The fresh access.js then registers the current worker (sw-v3.js).

self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) { /* best effort */ }
    try { await self.clients.claim(); } catch (e) {}
    let wins = [];
    try { wins = await self.clients.matchAll({ type: 'window' }); } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    for (const c of wins) {
      try { c.navigate(c.url); } catch (e) {}
    }
  })());
});

// No fetch handler → requests go straight to the network while this
// short-lived worker tears itself down. Nothing stale is ever served.

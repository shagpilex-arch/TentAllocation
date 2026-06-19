// Scout Camp Planner — offline-first service worker
// Caches the core app shell so the app loads and works with zero connectivity
// after the first successful visit (camps often have no signal).

const CACHE_NAME = "camp-planner-shell-v1";
const SHELL_FILES = [
    "./",
    "./index.html",
    "./app.css",
    "./app.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);

    // Never intercept collaboration/network calls — those must always hit the network
    if (url.hostname.includes("firebasedatabase.app")) return;
    if (event.request.method !== "GET") return;

    // App shell: cache-first, so it works completely offline once visited
    if (SHELL_FILES.some(f => url.pathname.endsWith(f.replace("./", "")) || url.pathname === "/")) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                const network = fetch(event.request)
                    .then(response => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
                        }
                        return response;
                    })
                    .catch(() => cached);
                return cached || network;
            })
        );
        return;
    }

    // Everything else: network-first, fall back to cache
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

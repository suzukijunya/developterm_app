// オフライン対応:一度開いたファイルを端末に保存し、電波がないときはそれを使う。
// 画面(index.html)は通信できればいつも最新を取り、できなければ保存したものを出す。
// JS・CSS は ?v= つきのURLで版が変わるので、保存したものをそのまま使う。
const CACHE = "uscpa-app";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// 今の index.html が読むファイル以外(古い版)を消す
async function cleanup(cache, html) {
  const keep = new Set();
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) keep.add(new URL(m[1], self.registration.scope).href);
  for (const req of await cache.keys()) {
    const u = new URL(req.url);
    if (u.search && !keep.has(req.url)) await cache.delete(req);
  }
}

async function page(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000))]);
    if (res.ok) {
      await cache.put("./", res.clone());
      res
        .clone()
        .text()
        .then((html) => cleanup(cache, html))
        .catch(() => {});
    }
    return res;
  } catch (e) {
    return (await cache.match("./")) || (await cache.match(req, { ignoreSearch: true })) || Response.error();
  }
}

async function asset(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  const isPage = req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
  e.respondWith(isPage ? page(req) : asset(req));
});

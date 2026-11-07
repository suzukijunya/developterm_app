// オフライン対応は廃止。以前のものが入っている端末では、この版が自分を取り除き、保存したファイルを消す。
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) =>
  e.waitUntil(
    (async () => {
      await caches.delete("uscpa-app");
      await self.registration.unregister();
      const cs = await self.clients.matchAll({ type: "window" });
      cs.forEach((c) => c.navigate(c.url));
    })()
  )
);

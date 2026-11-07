// 学習記録の自動バックアップ。
// 1) 端末内:保存のたびに IndexedDB にも写しておき、localStorage だけが消えたときに戻す。
//    あわせて、ブラウザに「この記録は消さないで」と頼む(storage.persist)。
// 2) クラウド:claude.ai で開いたときは、本人だけが読めるクラウドの保存先に自動で保存し、
//    機種変更などで記録が空になったら自動で戻す。
// 3) ファイル:クラウドが使えないときは、1週間ごとに記録ファイルの保存をすすめる。

const Backup = (() => {
  const IDB_NAME = "uscpa_backup";
  const CHUNK = 180000; // 1ドキュメントの上限(256KiB)より小さく分ける
  const info = { device: false, cloud: false, cloudAt: null, cloudNewer: false, persisted: false };
  const listeners = [];
  const notify = () => listeners.forEach((fn) => fn(info));

  // ---- 端末内(IndexedDB) ----
  function idb() {
    return new Promise((res, rej) => {
      if (!window.indexedDB) return rej(new Error("no idb"));
      const r = indexedDB.open(IDB_NAME, 1);
      r.onupgradeneeded = () => r.result.createObjectStore("kv");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function idbPut(text) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction("kv", "readwrite");
      tx.objectStore("kv").put(text, "state");
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }
  async function idbGet() {
    const db = await idb();
    return new Promise((res, rej) => {
      const r = db.transaction("kv").objectStore("kv").get("state");
      r.onsuccess = () => res(r.result || null);
      r.onerror = () => rej(r.error);
    });
  }

  const hasData = (s) => !!s && (Object.keys(s.q || {}).length || Object.keys(s.cards || {}).length || Object.keys(s.study || {}).length);

  function restore(text, why) {
    Store.importJson(text);
    window.dispatchEvent(new CustomEvent("uscpa:restored", { detail: why }));
  }

  // ---- クラウド(claude.ai のアーティファクトで開いたときだけ) ----
  let cloud = null; // { db, base }
  async function cloudInit() {
    if (!window.claude || typeof window.claude.use !== "function") return;
    try {
      const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      if (!db || !user) return;
      const uid = await user.id();
      if (!uid) return;
      cloud = { db, base: "data/users/" + uid + "/" };
      const meta = await db.doc(cloud.base + "b_meta").get();
      info.cloud = true;
      if (meta.exists) {
        const m = meta.data();
        info.cloudAt = m.savedAt || null;
        const local = Store.get();
        if (!hasData(local)) {
          // この端末の記録が空なら、クラウドから戻す
          const text = await cloudRead(m.n);
          if (text) restore(text, "cloud");
        } else if (m.savedAt && local.savedAt && m.savedAt > local.savedAt + 60000) {
          info.cloudNewer = true;
        }
      }
      notify();
      if (hasData(Store.get()) && !info.cloudNewer) schedule(true);
    } catch (e) {
      cloud = null;
    }
  }
  async function cloudRead(n) {
    const parts = [];
    for (let i = 0; i < n; i++) {
      const d = await cloud.db.doc(cloud.base + "b_" + i).get();
      if (!d.exists) return null;
      parts.push(d.data().t);
    }
    return parts.join("");
  }
  async function cloudWrite(text) {
    const n = Math.max(1, Math.ceil(text.length / CHUNK));
    for (let i = 0; i < n; i++) await cloud.db.doc(cloud.base + "b_" + i).set({ t: text.slice(i * CHUNK, (i + 1) * CHUNK) });
    const savedAt = Store.get().savedAt || Date.now();
    await cloud.db.doc(cloud.base + "b_meta").set({ n, savedAt, v: 1 });
    info.cloudAt = savedAt;
    notify();
  }

  // ---- 保存の予約(変更が続くあいだはまとめて1回) ----
  let tDevice = null;
  let tCloud = null;
  let cloudBusy = false;
  function schedule(cloudOnly) {
    if (!cloudOnly) {
      clearTimeout(tDevice);
      tDevice = setTimeout(() => {
        idbPut(Store.exportJson())
          .then(() => {
            info.device = true;
            notify();
          })
          .catch(() => {});
      }, 3000);
    }
    if (cloud && !info.cloudNewer) {
      clearTimeout(tCloud);
      tCloud = setTimeout(flushCloud, 20000);
    }
  }
  async function flushCloud() {
    if (!cloud || cloudBusy || info.cloudNewer) return;
    cloudBusy = true;
    try {
      await cloudWrite(JSON.stringify(Store.get()));
    } catch (e) {
      // 失敗したら次の変更でまた試す
    }
    cloudBusy = false;
  }

  // ---- ファイル ----
  async function saveFile() {
    const text = Store.exportJson();
    const name = "uscpa-backup-" + Store.today() + ".json";
    const file = typeof File !== "undefined" ? new File([text], name, { type: "application/json" }) : null;
    try {
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "USCPA学習の記録" });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      Store.setPref("lastFileBackup", Store.today());
      return true;
    } catch (e) {
      return false;
    }
  }
  // クラウドが使えず、記録があり、前回のファイル保存から7日以上たっていれば true
  function fileDue() {
    if (info.cloud || !hasData(Store.get())) return false;
    const last = Store.get().prefs.lastFileBackup;
    if (!last) return Object.keys(Store.get().study).length >= 3;
    return Store.addDays(last, 7) <= Store.today();
  }

  // クラウドの新しい記録をこの端末に読み込む(別の端末で勉強したとき)
  async function pullCloud() {
    if (!cloud) return false;
    const meta = await cloud.db.doc(cloud.base + "b_meta").get();
    if (!meta.exists) return false;
    const text = await cloudRead(meta.data().n);
    if (!text) return false;
    info.cloudNewer = false;
    restore(text, "cloud");
    notify();
    return true;
  }
  // この端末の記録でクラウドを上書きする
  async function pushCloud() {
    info.cloudNewer = false;
    await flushCloud();
  }

  async function init() {
    try {
      if (navigator.storage && navigator.storage.persist) info.persisted = await navigator.storage.persist();
    } catch (e) {}
    // localStorage が空で、端末内の写しが残っていれば戻す
    try {
      if (!hasData(Store.get())) {
        const text = await idbGet();
        if (text && hasData(JSON.parse(text))) restore(text, "device");
      } else info.device = true;
    } catch (e) {}
    Store.onSave(() => schedule(false));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && cloud) {
        clearTimeout(tCloud);
        flushCloud();
      }
    });
    cloudInit();
    notify();
  }

  init();
  return { info: () => info, onChange: (fn) => listeners.push(fn), saveFile, fileDue, pullCloud, pushCloud };
})();

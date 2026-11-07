// 学習記録の自動バックアップ。
// 1) 端末内:保存のたびに IndexedDB にも写しておき、localStorage だけが消えたときに戻す。
//    あわせて、ブラウザに「この記録は消さないで」と頼む(storage.persist)。
// 2) クラウド:claude.ai で開いたときは、本人だけが読めるクラウドの保存先に自動で保存し、
//    機種変更などで記録が空になったら自動で戻す。
// 3) GitHub 同期:GitHub Pages 版では、本人の GitHub の非公開 Gist に自動で保存し、
//    PC・スマホなど複数の端末で同じ記録を使う(初回だけ各端末でトークンを登録)。
//    両方の端末で同時に勉強したときは、問題・カード・学習時間などを項目ごとに合わせる。
// 4) ファイル:どれも使えないときは、1週間ごとに記録ファイルの保存をすすめる。

const Backup = (() => {
  const IDB_NAME = "uscpa_backup";
  const CHUNK = 180000; // 1ドキュメントの上限(256KiB)より小さく分ける
  const info = { device: false, cloud: false, cloudAt: null, cloudNewer: false, persisted: false, gh: null, ghAt: null, ghError: null };
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

  // ---- GitHub 同期(Gist) ----
  // トークンは記録とは別の場所に置く(記録の書き出しファイルに入らないように)
  const SYNC_KEY = "uscpa_sync_v1";
  const GIST_FILE = "uscpa-sync.json";
  const GIST_DESC = "USCPA学習アプリの記録(自動同期)";
  const syncCfg = () => {
    try {
      return JSON.parse(localStorage.getItem(SYNC_KEY) || "null");
    } catch (e) {
      return null;
    }
  };
  const setSyncCfg = (c) => {
    try {
      if (c) localStorage.setItem(SYNC_KEY, JSON.stringify(c));
      else localStorage.removeItem(SYNC_KEY);
    } catch (e) {}
  };

  async function gh(path, opts, token) {
    const cfg = syncCfg();
    const res = await fetch("https://api.github.com" + path, {
      ...(opts || {}),
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + (token || (cfg && cfg.token)), "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const err = new Error("GitHub " + res.status);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  // 2つの記録を項目ごとに合わせる(両方の端末で勉強していたとき)
  function merge(a, b) {
    const newer = (a.savedAt || 0) >= (b.savedAt || 0) ? a : b;
    const out = JSON.parse(JSON.stringify(newer));
    const keys = (x, y) => new Set(Object.keys(x || {}).concat(Object.keys(y || {})));
    out.q = {};
    keys(a.q, b.q).forEach((k) => {
      const x = (a.q || {})[k];
      const y = (b.q || {})[k];
      out.q[k] = !x ? y : !y ? x : (x.ts || 0) >= (y.ts || 0) ? x : y;
    });
    out.cards = {};
    keys(a.cards, b.cards).forEach((k) => {
      const x = (a.cards || {})[k];
      const y = (b.cards || {})[k];
      out.cards[k] = !x ? y : !y ? x : x.due !== y.due ? (x.due > y.due ? x : y) : x.box >= y.box ? x : y;
    });
    out.notes = Object.assign({}, a.notes, b.notes);
    out.tbs = {};
    keys(a.tbs, b.tbs).forEach((k) => {
      const x = (a.tbs || {})[k];
      const y = (b.tbs || {})[k];
      out.tbs[k] = !x ? y : !y ? x : { best: Math.max(x.best, y.best), last: (x.n >= y.n ? x : y).last, n: Math.max(x.n, y.n) };
    });
    // 学習時間は日・科目ごとに多いほう(同じ時間を二重に数えないため)
    out.study = {};
    keys(a.study, b.study).forEach((d) => {
      const x = (a.study || {})[d] || {};
      const y = (b.study || {})[d] || {};
      out.study[d] = {};
      keys(x, y).forEach((sec) => (out.study[d][sec] = Math.max(x[sec] || 0, y[sec] || 0)));
    });
    const union = (x, y, max) => {
      const seen = new Set();
      return (x || [])
        .concat(y || [])
        .filter((e) => (seen.has(e.ts) ? false : seen.add(e.ts)))
        .sort((p, q) => q.ts - p.ts)
        .slice(0, max);
    };
    out.history = union(a.history, b.history, 200);
    out.mocks = union(a.mocks, b.mocks, 50);
    out.savedAt = Date.now();
    return out;
  }

  let ghBusy = false;
  async function ghPush() {
    const cfg = syncCfg();
    if (!cfg || !cfg.gistId) return;
    const st = Store.get();
    if ((st.savedAt || 0) <= (cfg.lastSynced || 0)) return;
    await gh("/gists/" + cfg.gistId, { method: "PATCH", body: JSON.stringify({ files: { [GIST_FILE]: { content: JSON.stringify({ savedAt: st.savedAt, state: st }) } } }) });
    setSyncCfg(Object.assign(syncCfg(), { lastSynced: st.savedAt }));
    info.ghAt = Date.now();
    info.ghError = null;
    notify();
  }

  async function ghReadRemote(cfg) {
    const g = await gh("/gists/" + cfg.gistId);
    const f = g.files && g.files[GIST_FILE];
    if (!f) return null;
    // 大きいファイルは本文が省略されるので、raw から読む
    const text = f.truncated ? await (await fetch(f.raw_url)).text() : f.content;
    return JSON.parse(text);
  }

  // GitHub の記録を確かめ、新しければ取り込み、この端末の変更があれば送る
  async function ghSync() {
    const cfg = syncCfg();
    if (!cfg || !cfg.gistId || ghBusy) return;
    ghBusy = true;
    try {
      const remote = await ghReadRemote(cfg);
      const local = Store.get();
      const dirty = (local.savedAt || 0) > (cfg.lastSynced || 0);
      if (remote && remote.state && (remote.savedAt || 0) > (cfg.lastSynced || 0)) {
        if (!hasData(local) || !dirty) {
          restore(JSON.stringify(remote.state), "github");
          setSyncCfg(Object.assign(syncCfg(), { lastSynced: remote.savedAt }));
        } else {
          restore(JSON.stringify(merge(local, remote.state)), "merge");
        }
      }
      await ghPush();
      info.ghAt = Date.now();
      info.ghError = null;
    } catch (e) {
      info.ghError = e.status === 401 ? "トークンが無効か期限切れです。設定し直してください" : "同期できませんでした(通信を確認してください)";
    }
    ghBusy = false;
    notify();
  }

  // トークンを登録して同期を始める。同じ GitHub アカウントの別の端末で作った保存先があれば、それを使う
  async function ghConnect(token) {
    token = String(token || "").trim();
    const me = await gh("/user", null, token);
    const list = await gh("/gists?per_page=100", null, token);
    let gist = list.find((g) => g.description === GIST_DESC && g.files && g.files[GIST_FILE]);
    if (!gist) {
      const st = Store.get();
      gist = await gh("/gists", { method: "POST", body: JSON.stringify({ description: GIST_DESC, public: false, files: { [GIST_FILE]: { content: JSON.stringify({ savedAt: st.savedAt || Date.now(), state: st }) } } }) }, token);
      setSyncCfg({ token, gistId: gist.id, login: me.login, lastSynced: st.savedAt || 0 });
    } else setSyncCfg({ token, gistId: gist.id, login: me.login, lastSynced: 0 });
    info.gh = me.login;
    startGhTimer();
    await ghSync();
    return me.login;
  }
  // 開いたままでも、ときどき別の端末の記録を確かめる
  let ghTimer = null;
  function startGhTimer() {
    if (!ghTimer) ghTimer = setInterval(() => info.gh && document.visibilityState === "visible" && ghSync(), 120000);
  }
  function ghDisconnect() {
    setSyncCfg(null);
    info.gh = null;
    info.ghAt = null;
    info.ghError = null;
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
    if (info.gh) {
      clearTimeout(tGh);
      tGh = setTimeout(() => ghPush().catch(() => {}), 15000);
    }
  }
  let tGh = null;
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
    if (info.cloud || info.gh || !hasData(Store.get())) return false;
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
      if (info.gh) {
        // 画面を離れるときは送り、戻ってきたら別の端末の記録を確かめる
        if (document.visibilityState === "hidden") {
          clearTimeout(tGh);
          ghPush().catch(() => {});
        } else ghSync();
      }
    });
    const cfg = syncCfg();
    if (cfg && cfg.gistId) {
      info.gh = cfg.login || "GitHub";
      startGhTimer();
      ghSync();
    }
    cloudInit();
    notify();
  }

  init();
  return { info: () => info, onChange: (fn) => listeners.push(fn), saveFile, fileDue, pullCloud, pushCloud, ghConnect, ghDisconnect, ghSync, merge };
})();

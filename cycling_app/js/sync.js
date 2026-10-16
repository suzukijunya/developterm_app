// 端末どうしの同期: GitHub の「Gist(非公開)」に、設定・走行記録・ガレージ・パーツの写真を保存して、
// PCとスマホのどちらから変えても、もう一方を開いたときに最新になるようにする。
// トークンはこの端末の中だけに保存する(Gist には保存しない)。

const Sync = (() => {
  const KEY = "cycling_sync_v1";
  const API = "https://api.github.com";
  const DESC = "ride-calorie-sync"; // データの Gist の説明(これで探す)
  const PHOTO_DESC = "ride-calorie-photos"; // 写真の Gist
  const FILE = "data.json";

  let cfg = load();
  let running = null;
  let again = false;
  let timer = null;
  const listeners = [];
  let status = { state: cfg.token ? "idle" : "off", msg: "", at: cfg.lastAt || 0 };

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveCfg() {
    try {
      localStorage.setItem(KEY, JSON.stringify(cfg));
    } catch (e) {}
  }
  function setStatus(state, msg) {
    status = { state, msg: msg || "", at: cfg.lastAt || 0 };
    for (const fn of listeners) fn({ status });
  }

  async function gh(path, opts = {}) {
    const res = await fetch(API + path, {
      method: opts.method || "GET",
      headers: Object.assign(
        { Accept: "application/vnd.github+json", Authorization: "Bearer " + cfg.token },
        opts.body ? { "Content-Type": "application/json" } : {}
      ),
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
    });
    if (!res.ok) {
      const e = new Error(`GitHub ${res.status}`);
      e.status = res.status;
      throw e;
    }
    return res.status === 204 ? null : res.json();
  }

  // Gist のファイルの中身(大きいファイルは途中で切れているので raw_url から読む)
  async function fileText(f) {
    if (!f) return null;
    if (!f.truncated && typeof f.content === "string") return f.content;
    const res = await fetch(f.raw_url, { cache: "no-store" });
    if (!res.ok) throw new Error("raw " + res.status);
    return res.text();
  }

  async function readRemote() {
    const g = await gh(`/gists/${cfg.gistId}`);
    const txt = await fileText(g.files[FILE]);
    try {
      return txt ? JSON.parse(txt) : {};
    } catch (e) {
      return {};
    }
  }

  // ---------- 写真(IndexedDB の "cycling_garage" / "photos" と同じ場所) ----------
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("no indexedDB"));
      const req = indexedDB.open("cycling_garage", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("photos");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }
  async function idb(mode, fn) {
    const d = await db();
    return new Promise((resolve) => {
      const tx = d.transaction("photos", mode);
      const req = fn(tx.objectStore("photos"));
      tx.oncomplete = () => resolve(req && req.result);
      tx.onerror = () => resolve(null);
    });
  }
  const getPhoto = (id) => idb("readonly", (s) => s.get(id)).catch(() => null);
  const putPhoto = (id, blob) => idb("readwrite", (s) => s.put(blob, id));

  // ガレージの中で使っている写真の id(マイパーツの写真・3Dに貼った写真)
  function photoIds(garage) {
    const out = new Set();
    (function walk(o) {
      if (!o || typeof o !== "object") return;
      if (Array.isArray(o)) return o.forEach(walk);
      for (const [k, v] of Object.entries(o)) {
        if (k === "photoId" && typeof v === "string") out.add(v);
        else walk(v);
      }
    })(garage);
    return [...out];
  }
  const toDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  const fromDataUrl = async (s) => (await fetch(s)).blob();

  // 写真をそろえる: ない写真はダウンロード、まだ上げていない写真はアップロード、使わなくなった写真は消す
  async function syncPhotos(remote) {
    const photos = Object.assign({}, remote.photos || {});
    let photoGist = remote.photoGist || null;
    const ids = photoIds(Store.garage);
    let changed = false;
    // ダウンロード
    for (const id of ids) {
      if (!photos[id]) continue;
      if (await getPhoto(id)) continue;
      try {
        const res = await fetch(photos[id], { cache: "no-store" });
        if (res.ok) await putPhoto(id, await fromDataUrl(await res.text()));
      } catch (e) {
        // 次の同期でやり直す
      }
    }
    // アップロード(1回に5枚まで)
    const up = [];
    for (const id of ids) {
      if (photos[id] || up.length >= 5) continue;
      const blob = await getPhoto(id);
      if (blob) up.push([id, await toDataUrl(blob)]);
    }
    const gone = Object.keys(photos).filter((id) => !ids.includes(id));
    if (up.length || (gone.length && photoGist)) {
      const files = {};
      for (const [id, data] of up) files[`photo-${id}.txt`] = { content: data };
      if (photoGist) for (const id of gone) files[`photo-${id}.txt`] = null;
      let g;
      if (!photoGist) {
        files["README.md"] = { content: "ライドカロリーのパーツ写真(自動で作られました)" };
        g = await gh("/gists", { method: "POST", body: { description: PHOTO_DESC, public: false, files } });
        photoGist = g.id;
      } else {
        try {
          g = await gh(`/gists/${photoGist}`, { method: "PATCH", body: { files } });
        } catch (e) {
          if (e.status !== 404 && e.status !== 422) throw e;
          // 写真の Gist が消されていたら作り直す
          for (const k of Object.keys(files)) if (files[k] === null) delete files[k];
          files["README.md"] = { content: "ライドカロリーのパーツ写真(自動で作られました)" };
          g = await gh("/gists", { method: "POST", body: { description: PHOTO_DESC, public: false, files } });
          photoGist = g.id;
          for (const k of Object.keys(photos)) delete photos[k];
        }
      }
      for (const [id] of up) if (g.files[`photo-${id}.txt`]) photos[id] = g.files[`photo-${id}.txt`].raw_url;
      for (const id of gone) delete photos[id];
      changed = true;
    }
    return { photos, photoGist, changed };
  }

  // ---------- 同期 ----------
  async function run(force) {
    const remote = await readRemote();
    const changed = Store.merge(remote.app, force);
    if (changed.length) for (const fn of listeners) fn({ changed });
    const ph = await syncPhotos(remote).catch(() => ({ photos: remote.photos || {}, photoGist: remote.photoGist || null, changed: false }));
    const app = Store.snapshot();
    if (ph.changed || stable(app) !== stable(remote.app)) {
      const data = { v: 1, app, photos: ph.photos, photoGist: ph.photoGist, savedAt: Date.now(), device: deviceName() };
      await gh(`/gists/${cfg.gistId}`, { method: "PATCH", body: { files: { [FILE]: { content: JSON.stringify(data) } } } });
    }
    if (ph.changed && changed.indexOf("garage") < 0) for (const fn of listeners) fn({ photos: true });
    cfg.lastAt = Date.now();
    saveCfg();
  }

  // キーの順番によらない比べ方
  function stable(o) {
    if (o === undefined) return "u";
    if (!o || typeof o !== "object") return JSON.stringify(o);
    if (Array.isArray(o)) return "[" + o.map(stable).join(",") + "]";
    return "{" + Object.keys(o).filter((k) => o[k] !== undefined).sort().map((k) => JSON.stringify(k) + ":" + stable(o[k])).join(",") + "}";
  }

  function deviceName() {
    const ua = navigator.userAgent || "";
    return /iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : "PC";
  }

  // 同期する(同時に1回だけ。途中で頼まれたら、終わってからもう1回)
  function syncNow(force) {
    if (!cfg.token || !cfg.gistId) return Promise.resolve(false);
    if (running) {
      again = true;
      return running;
    }
    setStatus("busy", "同期しています…");
    running = run(force)
      .then(() => {
        setStatus("idle", "");
        return true;
      })
      .catch((e) => {
        if (e.status === 401) setStatus("error", "トークンが無効です。設定し直してください");
        else if (e.status === 404) {
          // Gist が消されていたら、次の同期で作り直す
          cfg.gistId = null;
          saveCfg();
          setStatus("error", "同期のデータが見つかりません。もう一度「連携する」を押してください");
        } else setStatus("error", navigator.onLine === false ? "オフラインです。つながったら同期します" : "同期できませんでした。あとでもう一度試します");
        return false;
      })
      .finally(() => {
        running = null;
        if (again) {
          again = false;
          schedule(1500);
        }
      });
    return running;
  }

  function schedule(ms = 2500) {
    if (!cfg.token || !cfg.gistId) return;
    clearTimeout(timer);
    timer = setTimeout(() => syncNow(), ms);
  }

  // 連携する: トークンを確かめて、同期のデータ(Gist)を探す。なければ作る
  // choose(): 両方にデータがあるとき、どちらを使うか("remote" / "local")を返す
  async function connect(token, choose) {
    const prev = cfg;
    cfg = { token: token.trim() };
    try {
      const me = await gh("/user");
      cfg.login = me.login;
      let found = null;
      for (let page = 1; page <= 5 && !found; page++) {
        const list = await gh(`/gists?per_page=100&page=${page}`);
        found = list.find((g) => g.description === DESC);
        if (list.length < 100) break;
      }
      if (found) {
        cfg.gistId = found.id;
        const remote = await readRemote();
        const local = Store.snapshot();
        const hasLocal = local.profileSet || local.garage || local.rides.length || local.places.length;
        const force = remote.app && hasLocal ? await choose(remote) : "remote";
        saveCfg();
        await run(force);
      } else {
        const data = { v: 1, app: Store.snapshot(), photos: {}, photoGist: null, savedAt: Date.now(), device: deviceName() };
        const g = await gh("/gists", { method: "POST", body: { description: DESC, public: false, files: { [FILE]: { content: JSON.stringify(data) } } } });
        cfg.gistId = g.id;
        saveCfg();
        await run();
      }
      cfg.lastAt = Date.now();
      saveCfg();
      setStatus("idle", "");
      return { ok: true, login: cfg.login };
    } catch (e) {
      cfg = prev;
      saveCfg();
      return { ok: false, error: e.status === 401 ? "トークンが正しくありません" : e.status === 403 || e.status === 404 ? "このトークンには Gist の権限がありません(gist にチェックを入れて作り直してください)" : "GitHub につながりませんでした" };
    }
  }

  function disconnect() {
    clearTimeout(timer);
    cfg = {};
    saveCfg();
    setStatus("off", "");
  }

  // 変わったら少し待って送る・画面に戻ったら受け取る
  function start() {
    Store.onChange(() => schedule());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") schedule(300);
      else if (timer) syncNow(); // 閉じる前に、まだ送っていない変更を送る
    });
    window.addEventListener("online", () => schedule(500));
    setInterval(() => document.visibilityState === "visible" && schedule(100), 3 * 60 * 1000);
    schedule(300);
  }

  // ---------- 設定の画面(走行画面の設定・ガレージの両方で使う) ----------
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function statusText() {
    if (status.state === "busy") return "🔄 同期しています…";
    if (status.state === "error") return "⚠️ " + status.msg;
    if (!status.at) return "";
    const d = new Date(status.at);
    const today = new Date().toDateString() === d.toDateString();
    return `✓ 最終同期 ${today ? "" : `${d.getMonth() + 1}/${d.getDate()} `}${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function panelHtml() {
    if (cfg.token && cfg.gistId)
      return `
        <section class="card sync-card">
          <h2>☁️ 端末どうしの同期</h2>
          <p>GitHub(<strong>@${esc(cfg.login || "")}</strong>)と連携中です。設定・目的地・走行記録・ガレージ・パーツの写真を、PCとスマホで自動でそろえます。</p>
          <p class="small" id="sync-status">${esc(statusText())}</p>
          <div class="sync-row"><button class="btn sub" type="button" data-sync="now">今すぐ同期</button><button class="link danger" type="button" data-sync="off">連携をやめる</button></div>
        </section>`;
    return `
      <section class="card sync-card">
        <h2>☁️ 端末どうしの同期</h2>
        <p class="muted small">PCとスマホの両方で同じ設定をすると、どちらで変えても、もう一方を開いたときに最新になります。データは自分の GitHub アカウントの非公開の Gist に保存されます。</p>
        <ol class="small sync-steps">
          <li>GitHub にログインして、<a href="https://github.com/settings/tokens/new?scopes=gist&description=ride-calorie-sync" target="_blank" rel="noopener">トークンの作成ページ</a>を開きます(「gist」にだけチェックが入っています)</li>
          <li>「Expiration」を「No expiration」にして、いちばん下の「Generate token」を押します</li>
          <li>表示された <code>ghp_</code> で始まる文字をコピーして、下に貼り付けます(PCとスマホの両方で)</li>
        </ol>
        <input type="password" class="sync-token" id="sync-token" placeholder="ghp_…" autocomplete="off" />
        <button class="btn start" type="button" data-sync="connect">連携する</button>
        <p class="muted small">トークンはこの端末の中だけに保存します。Gist の読み書き以外には使えません。</p>
        <p class="small" id="sync-status">${status.state === "error" ? esc("⚠️ " + status.msg) : ""}</p>
      </section>`;
  }

  // root の中の同期の設定のボタンを動かす。rerender: 画面を描き直す関数
  function bindPanel(root, rerender) {
    root.querySelectorAll("[data-sync]").forEach((b) =>
      b.addEventListener("click", async () => {
        const act = b.dataset.sync;
        if (act === "now") return syncNow();
        if (act === "off") {
          if (confirm("同期をやめますか?(この端末のデータとGistのデータは、どちらも消えません)")) disconnect(), rerender();
          return;
        }
        const token = (root.querySelector("#sync-token") || {}).value || "";
        if (!token.trim()) return alert("トークンを貼り付けてください");
        b.disabled = true;
        b.textContent = "連携しています…";
        const r = await connect(token, async (remote) => {
          const when = remote.savedAt ? new Date(remote.savedAt).toLocaleString("ja-JP") : "";
          return confirm(
            `GitHub に、ほかの端末(${remote.device || "?"}・${when})のデータがあります。\n\n` +
              "OK: そちらのデータを使う(この端末の設定・ガレージを置き換えます)\n" +
              "キャンセル: この端末のデータを使う(GitHub のデータを置き換えます)\n\n" +
              "走行記録はどちらを選んでも両方を合わせます。"
          )
            ? "remote"
            : "local";
        });
        if (!r.ok) {
          b.disabled = false;
          b.textContent = "連携する";
          return alert(r.error);
        }
        rerender();
      })
    );
  }

  // 状態が変わったら、表示中の「最終同期」の文字だけ書き換える
  listeners.push((e) => {
    if (!e.status) return;
    const el = document.getElementById("sync-status");
    if (el) el.textContent = statusText();
  });

  function onUpdate(fn) {
    listeners.push(fn);
  }

  return {
    get connected() {
      return !!(cfg.token && cfg.gistId);
    },
    get login() {
      return cfg.login || "";
    },
    get status() {
      return status;
    },
    connect,
    disconnect,
    syncNow,
    start,
    onUpdate,
    photoIds,
    panelHtml,
    bindPanel,
    statusText,
  };
})();

if (typeof window !== "undefined") Sync.start();

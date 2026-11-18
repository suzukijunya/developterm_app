// YouTube で再生回数が伸びているロードバイクの動画。
// アプリを開いたときに、毎回探し直す(時間がかかっても裏で進める。続けて開いたときは10分あける)。
// YouTube Data API v3 を、使う人のAPIキー(この端末にだけ保存・同期しない)で呼ぶ。
// 結果はこの端末に保存して、次に開いたときはすぐ出す。

const YT = (() => {
  const KEY = "cycling_yt_key", CACHE = "cycling_yt_cache", MIN_GAP = 10 * 60 * 1000; // 連続で開いたときは10分あける(1日の上限を使い切らないため)
  const QUERIES = ["ロードバイク", "ロードバイク カスタム", "ロードバイク 初心者"];
  let running = null;
  const listeners = new Set();
  const key = () => {
    try {
      return localStorage.getItem(KEY) || "";
    } catch (e) {
      return "";
    }
  };
  function setKey(k) {
    try {
      if (k) localStorage.setItem(KEY, k.trim());
      else localStorage.removeItem(KEY);
    } catch (e) {}
  }
  function cached() {
    try {
      return JSON.parse(localStorage.getItem(CACHE) || "null");
    } catch (e) {
      return null;
    }
  }
  // ISO 8601 の長さ(PT1M5S など)→ 秒
  const secs = (d) => {
    const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || "");
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  };
  async function api(path, params) {
    const u = new URL("https://www.googleapis.com/youtube/v3/" + path);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    u.searchParams.set("key", key());
    const res = await fetch(u);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((j.error && j.error.message) || "HTTP " + res.status);
    return j;
  }
  // 探し直す。force: 10分の間隔を気にしない
  function refresh(force) {
    if (!key()) return Promise.resolve(null);
    const c = cached();
    if (!force && c && c.t && Date.now() - c.t < MIN_GAP && !c.error) return Promise.resolve(c);
    if (running) return running;
    emit({ loading: true });
    running = (async () => {
      const now = Date.now();
      const ids = new Map(); // id → どの期間で見つかったか
      // 直近30日と7日で、再生回数の多い順。日本語・日本
      for (const [days, q, n] of [[30, QUERIES[0], 25], [7, QUERIES[0], 20], [30, QUERIES[1], 15], [30, QUERIES[2], 15]]) {
        const j = await api("search", {
          part: "id",
          type: "video",
          q,
          order: "viewCount",
          regionCode: "JP",
          relevanceLanguage: "ja",
          publishedAfter: new Date(now - days * 864e5).toISOString(),
          maxResults: n,
        });
        for (const it of j.items || []) if (it.id && it.id.videoId) ids.set(it.id.videoId, true);
      }
      const list = [...ids.keys()];
      const items = [];
      for (let i = 0; i < list.length; i += 50) {
        const j = await api("videos", { part: "snippet,statistics,contentDetails", id: list.slice(i, i + 50).join(",") });
        for (const v of j.items || []) {
          const pub = Date.parse(v.snippet.publishedAt), days = Math.max(0.5, (now - pub) / 864e5), views = +v.statistics.viewCount || 0;
          const th = v.snippet.thumbnails || {};
          items.push({
            id: v.id,
            title: v.snippet.title,
            ch: v.snippet.channelTitle,
            pub,
            views,
            likes: +v.statistics.likeCount || 0,
            perDay: Math.round(views / days),
            sec: secs(v.contentDetails && v.contentDetails.duration),
            img: (th.medium || th.high || th.default || {}).url || "",
          });
        }
      }
      items.sort((a, b) => b.perDay - a.perDay);
      const out = { t: now, items };
      try {
        localStorage.setItem(CACHE, JSON.stringify(out));
      } catch (e) {}
      return out;
    })()
      .catch((e) => {
        const prev = cached() || {};
        const out = Object.assign({}, prev, { error: String(e.message || e).slice(0, 160), errorAt: Date.now() });
        try {
          localStorage.setItem(CACHE, JSON.stringify(out));
        } catch (er) {}
        return out;
      })
      .finally(() => {
        running = null;
      })
      .then((r) => (emit({ loading: false }), r));
    return running;
  }
  function emit(e) {
    for (const f of listeners) {
      try {
        f(e);
      } catch (er) {}
    }
  }
  // アプリを開いたとき: 同期でログインしていれば(キーがあれば)探し直す
  // (同期でログインしている人は、その端末でも、ほかの端末でも、開くたびに最新になる)
  function onOpen() {
    if (key()) setTimeout(() => refresh(false), 1500);
  }
  return { key, setKey, cached, refresh, onOpen, busy: () => !!running, on: (f) => (listeners.add(f), () => listeners.delete(f)) };
})();

if (typeof module !== "undefined") module.exports = YT;

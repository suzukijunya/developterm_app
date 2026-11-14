// デュエルのセリフを、声優っぽい声で話す(OpenAI の音声AI gpt-4o-mini-tts)。
// セリフごとに「叫ぶ」「溜める」などの演技の指示をつけ、自分(熱血の主人公)とライバル(クールな敵)で声を分ける。
// 作った音声は端末(IndexedDB)に保存して使い回すので、同じセリフの2回目からは料金も通信もかからない。
// 間に合わない(初めてのセリフで2.5秒以内に届かない)・圏外・エラーのときは、ブラウザの読み上げに切り替える。
// APIキーはこの端末の localStorage だけに置き、同期しない。

const AIVoice = (() => {
  const KEY = "cycling_openai_key";
  const OPT = "cycling_tts";
  const MODEL = "gpt-4o-mini-tts";
  const VOICES = ["ash", "ballad", "cedar", "coral", "echo", "fable", "marin", "nova", "onyx", "sage", "shimmer", "verse", "alloy"];
  const WAIT_MS = 2500;
  const STYLE = {
    you: "あなたは日本のテレビアニメで、熱血カードバトルものの主人公(10代後半の少年)を演じる声優です。自然な日本語の発音とアクセントで、感情をしっかり込めて、キャラクターとして演じてください。英語なまりは出さないでください。",
    opp: "あなたは日本のテレビアニメで、主人公の前に立ちはだかるクールで不敵なライバルを演じる声優です。自然な日本語の発音で、余裕のある低めの声、自信に満ちた挑発的な話し方で演じてください。英語なまりは出さないでください。",
  };
  const TONE = {
    shout: "ここは見せ場です。腹の底から全力で叫ぶように、力強く、熱く。語尾は勢いよく伸ばしてください。",
    low: "ここは溜めの場面です。低く静かに、間を取りながら、悔しさと決意をにじませてください。",
    "": "テンポよく、はっきりと、感情を込めて。",
    oppLow: "低く静かに、冷たく見下すように。余裕たっぷりに間を取ってください。",
  };

  // ---------- 設定 ----------
  function opts() {
    try {
      return Object.assign({ on: false, you: "ash", opp: "onyx" }, JSON.parse(localStorage.getItem(OPT)) || {});
    } catch (e) {
      return { on: false, you: "ash", opp: "onyx" };
    }
  }
  function setOpts(o) {
    try {
      localStorage.setItem(OPT, JSON.stringify(Object.assign(opts(), o)));
    } catch (e) {
      // 保存できなくても続ける
    }
  }
  function key() {
    try {
      return localStorage.getItem(KEY) || "";
    } catch (e) {
      return "";
    }
  }
  function setKey(k) {
    try {
      if (k) localStorage.setItem(KEY, k.trim());
      else localStorage.removeItem(KEY);
    } catch (e) {
      // 続ける
    }
  }
  const enabled = () => opts().on && !!key();

  // ---------- 保存(IndexedDB) ----------
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("no indexedDB"));
      const req = indexedDB.open("cycling_voice", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("clips");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }
  async function cacheGet(k) {
    try {
      const d = await db();
      return await new Promise((resolve) => {
        const r = d.transaction("clips").objectStore("clips").get(k);
        r.onsuccess = () => resolve(r.result || null);
        r.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }
  async function cachePut(k, blob) {
    try {
      const d = await db();
      await new Promise((resolve) => {
        const tx = d.transaction("clips", "readwrite");
        tx.objectStore("clips").put(blob, k);
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    } catch (e) {
      // 保存できなくても再生はする
    }
  }
  async function cacheCount() {
    try {
      const d = await db();
      return await new Promise((resolve) => {
        const r = d.transaction("clips").objectStore("clips").count();
        r.onsuccess = () => resolve(r.result || 0);
        r.onerror = () => resolve(0);
      });
    } catch (e) {
      return 0;
    }
  }
  async function cacheClear() {
    const d = await db();
    await new Promise((resolve) => {
      const tx = d.transaction("clips", "readwrite");
      tx.objectStore("clips").clear();
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  }

  // ---------- 音声を作る ----------
  // 演技の種類が指定されていなければ、セリフから決める(「…」は溜め、「!」は叫び)
  const guessTone = (text) => (/…|\.\.\./.test(text) && !/!!/.test(text) ? "low" : /!/.test(text) ? "shout" : "");
  const voiceOf = (side) => (side === "opp" ? opts().opp : opts().you);
  const clipKey = (text, side, tone) => [MODEL, voiceOf(side), side, tone, text].join("|");
  const pending = new Map();
  async function clip(text, side = "you", tone) {
    tone = tone == null ? guessTone(text) : tone;
    const k = clipKey(text, side, tone);
    const hit = await cacheGet(k);
    if (hit) return hit;
    if (pending.has(k)) return pending.get(k);
    const p = (async () => {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: "Bearer " + key(), "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, voice: voiceOf(side), input: text, instructions: STYLE[side === "opp" ? "opp" : "you"] + (side === "opp" && tone === "low" ? TONE.oppLow : TONE[tone || ""]), response_format: "mp3" }),
      });
      if (!res.ok) {
        let msg = "HTTP " + res.status;
        try {
          const j = await res.json();
          if (j.error && j.error.message) msg += ": " + j.error.message;
        } catch (e) {
          // 本文なし
        }
        throw new Error(msg);
      }
      const blob = await res.blob();
      await cachePut(k, blob);
      return blob;
    })();
    pending.set(k, p);
    try {
      return await p;
    } finally {
      pending.delete(k);
    }
  }

  // ---------- 再生(1つの audio を使い回す。iPhoneはタップの中で一度鳴らしておく) ----------
  let audio = null;
  let queue = [];
  let gen = 0;
  let lastError = "";
  function el() {
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.addEventListener("ended", next);
      audio.addEventListener("error", next);
    }
    return audio;
  }
  // 無音を鳴らして、あとから自動で再生できるようにする(ライド開始のタップで呼ぶ)
  function unlock() {
    try {
      const a = el();
      a.src = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAACAAAA/oAR0dHR0dHR0dHR0dHYmJiYmJiYmJiYmJifHx8fHx8fHx8fHx8fJaWlpaWlpaWlpaWlrGxsbGxsbGxsbGxsbHLy8vLy8vLy8vLy8vl5eXl5eXl5eXl5eXl////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQC1AAAAAAAAAP6yysejgAAAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NAxKQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80LEowAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80DEpAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsSjAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {
      // 鳴らせなくても続ける
    }
  }
  function next() {
    const a = el();
    const n = queue.shift();
    if (!n) return;
    if (a.dataset.url) URL.revokeObjectURL(a.dataset.url);
    const url = URL.createObjectURL(n);
    a.dataset.url = url;
    a.src = url;
    const p = a.play();
    if (p && p.catch) p.catch(() => next());
  }
  function playBlob(blob, q) {
    const a = el();
    if (!q) {
      queue = [];
      a.pause();
    }
    queue.push(blob);
    if (!q || a.paused || a.ended) next();
  }
  function stop() {
    gen++;
    queue = [];
    if (audio) audio.pause();
  }

  // セリフを話す。o: { side, tone, queue, fallback }。間に合わなければ fallback(ブラウザの読み上げ)を呼ぶ
  function say(text, o = {}) {
    if (!enabled()) return false;
    const my = o.queue ? gen : ++gen;
    if (!o.queue) queue = [];
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      if (o.fallback) o.fallback();
    }, WAIT_MS);
    clip(text, o.side || "you", o.tone)
      .then((blob) => {
        if (done || my !== gen) return; // 遅れて届いたものは保存だけして鳴らさない(次から一瞬で鳴る)
        done = true;
        clearTimeout(timer);
        playBlob(blob, o.queue);
      })
      .catch((e) => {
        lastError = e.message || String(e);
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (o.fallback) o.fallback();
      });
    return true;
  }

  // よく使うセリフを前もって作っておく(ライド開始時)。lines: [[text, side, tone], ...]
  async function prefetch(lines) {
    if (!enabled()) return;
    for (const [t, s, tone] of lines) {
      try {
        await clip(t, s, tone);
      } catch (e) {
        lastError = e.message || String(e);
        return; // キーの間違いなどなら、それ以上は試さない
      }
    }
  }

  // 設定画面の「試す」: 作って鳴らし、結果を返す
  async function test(side = "you") {
    const line = side === "opp" ? ["フン…その程度か。来い、相手になってやる。", "low"] : ["俺のターン! ドロー!!", "shout"];
    unlock();
    const blob = await clip(line[0], side, line[1]);
    playBlob(blob, false);
  }

  return { VOICES, opts, setOpts, key, setKey, enabled, say, prefetch, stop, unlock, test, cacheCount, cacheClear, lastError: () => lastError };
})();

if (typeof module !== "undefined") module.exports = AIVoice;

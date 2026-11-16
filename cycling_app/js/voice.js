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
  const openaiOn = () => opts().on && !!key();
  // AivisSpeech などで作った音声パック(Mac で作ってスマホに読み込む)
  const PACK = "cycling_voicepack";
  function packMeta() {
    try {
      return JSON.parse(localStorage.getItem(PACK)) || null;
    } catch (e) {
      return null;
    }
  }
  const enabled = () => openaiOn() || !!packMeta();
  const packKey = (side, text) => "pack|" + (side || "you") + "|" + text;

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

  // セリフを話す。o: { side, tone, queue, fallback }。
  // 音声パックにあればそれを鳴らす → なければ OpenAI で作る → 間に合わなければ fallback(ブラウザの読み上げ)
  function say(text, o = {}) {
    if (!enabled()) return false;
    const my = o.queue ? gen : ++gen;
    if (!o.queue) queue = [];
    if (packMeta()) {
      cacheGet(packKey(o.side, text)).then((blob) => {
        if (my !== gen && !o.queue) return;
        if (blob) return playBlob(blob, o.queue);
        if (openaiOn()) return sayAI(text, o, my);
        if (o.fallback) o.fallback();
      });
      return true;
    }
    return sayAI(text, o, my);
  }
  function sayAI(text, o, my) {
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
    if (!openaiOn()) return;
    for (const [t, s, tone] of lines) {
      try {
        await clip(t, s, tone);
      } catch (e) {
        lastError = e.message || String(e);
        return; // キーの間違いなどなら、それ以上は試さない
      }
    }
  }

  // ---------- 音声パック(zip・無圧縮)を読み込む ----------
  // 中身: manifest.json { version, voices: { you, opp }, lines: [{ side, text, file }] } と音声ファイル
  function unzipStored(buf) {
    const dv = new DataView(buf);
    const td = new TextDecoder();
    const out = {};
    let p = 0;
    while (p + 30 <= buf.byteLength && dv.getUint32(p, true) === 0x04034b50) {
      const flags = dv.getUint16(p + 6, true);
      const method = dv.getUint16(p + 8, true);
      const size = dv.getUint32(p + 18, true);
      const nlen = dv.getUint16(p + 26, true);
      const elen = dv.getUint16(p + 28, true);
      const name = td.decode(new Uint8Array(buf, p + 30, nlen));
      const start = p + 30 + nlen + elen;
      if (method !== 0 || flags & 8) throw new Error("この音声パックは読めない形式です(作成スクリプトで作り直してください)");
      out[name] = buf.slice(start, start + size);
      p = start + size;
    }
    return out;
  }
  async function importPack(file, onProgress) {
    const files = unzipStored(await file.arrayBuffer());
    if (!files["manifest.json"]) throw new Error("音声パックではないようです(manifest.json がありません)");
    const man = JSON.parse(new TextDecoder().decode(files["manifest.json"]));
    await clearPack(true);
    let n = 0;
    for (const l of man.lines || []) {
      const data = files[l.file];
      if (!data) continue;
      await cachePut(packKey(l.side, l.text), new Blob([data], { type: /\.mp3$/i.test(l.file) ? "audio/mpeg" : "audio/wav" }));
      n++;
      if (onProgress && n % 20 === 0) onProgress(n, man.lines.length);
    }
    localStorage.setItem(PACK, JSON.stringify({ count: n, voices: man.voices || {}, engine: man.engine || "", at: Date.now() }));
    return n;
  }
  async function clearPack(keepMeta) {
    const d = await db();
    await new Promise((resolve) => {
      const tx = d.transaction("clips", "readwrite");
      const st = tx.objectStore("clips");
      const r = st.openCursor();
      r.onsuccess = () => {
        const c = r.result;
        if (!c) return;
        if (String(c.key).startsWith("pack|")) c.delete();
        c.continue();
      };
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
    if (!keepMeta) localStorage.removeItem(PACK);
  }
  // パックのセリフを鳴らす(設定の「試す」)
  async function testPack(side, text) {
    unlock();
    const b = await cacheGet(packKey(side, text));
    if (!b) throw new Error("このセリフはパックに入っていません");
    playBlob(b, false);
  }

  // 設定画面の「試す」: 作って鳴らし、結果を返す
  async function test(side = "you") {
    const line = side === "opp" ? ["フン…その程度か。来い、相手になってやる。", "low"] : ["俺のターン! ドロー!!", "shout"];
    unlock();
    const blob = await clip(line[0], side, line[1]);
    playBlob(blob, false);
  }

  return { VOICES, opts, setOpts, key, setKey, enabled, openaiOn, packMeta, importPack, clearPack, testPack, say, prefetch, stop, unlock, test, cacheCount, cacheClear, lastError: () => lastError };
})();

if (typeof module !== "undefined") module.exports = AIVoice;

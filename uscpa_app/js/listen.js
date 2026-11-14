// 聞き流しモードの再生エンジン(ブラウザ内蔵の音声合成)。
// 1項目 = 読み上げ(英語/日本語)と「間」の並び。画面をつけたまま使う前提で、
// 再生中は画面の自動消灯を止める(Wake Lock)。iPhone などは画面を消すと読み上げが止まる。

// 事前に作った日本語の音声ファイル(Google Cloud の Neural2 の声)。
// 文章のハッシュ → audio/ja/<ハッシュ>.mp3。一覧は js/data/audio_ja.js(AUDIO_JA)にある。
// 作り方:tools/make_audio.py。ファイルがない文章は端末の声で読む。
const RecAudio = (() => {
  // FNV-1a(32bit)。文字は UTF-16 の単位で数える(tools/make_audio.py と同じ計算)
  function hash(text) {
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
  }
  const set = typeof AUDIO_JA !== "undefined" ? new Set(AUDIO_JA) : new Set();
  const has = (text) => set.has(hash(text));
  const url = (text) => "audio/ja/" + hash(text) + ".mp3";
  // 1つの audio 要素を使い回す(iPhone では最初のタップで再生が許可された要素を使い続けるのが確実)
  let el = null;
  function player() {
    if (!el) {
      el = new Audio();
      el.preload = "auto";
    }
    return el;
  }
  return { hash, has, url, player, count: () => set.size };
})();

const Listen = (() => {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  let jaVoice = null;
  let enVoice = null;

  // 声は Voices(speech.js)で選ぶ。設定で選んだ声、なければいちばん自然そうな声
  function pickVoices() {
    jaVoice = Voices.get("ja");
    enVoice = Voices.get("en");
  }
  if (supported) {
    pickVoices();
    if (speechSynthesis.addEventListener) speechSynthesis.addEventListener("voiceschanged", pickVoices);
  }

  // 長い日本語は文ごとに分ける(長すぎる読み上げは途中で止まるブラウザがある)
  // 古い Safari は後読み正規表現に未対応のため使わない
  function splitText(t) {
    return String(t)
      .replace(/\s+/g, " ")
      .replace(/([。!?])/g, "$1\u0000")
      .split("\u0000")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  const st = {
    items: [],
    idx: 0,
    seg: 0,
    playing: false,
    timer: null,
    token: 0,
    rate: 1,
    onChange: null,
    wake: null,
  };

  function emit() {
    if (st.onChange) st.onChange(state());
  }

  function state() {
    return { idx: st.idx, total: st.items.length, playing: st.playing, item: st.items[st.idx] || null };
  }

  async function keepAwake(on) {
    try {
      if (on && !st.wake && navigator.wakeLock) {
        st.wake = await navigator.wakeLock.request("screen");
        st.wake.addEventListener("release", () => (st.wake = null));
      } else if (!on && st.wake) {
        await st.wake.release();
        st.wake = null;
      }
    } catch (e) {
      st.wake = null;
    }
  }
  // 画面に戻ってきたら Wake Lock を取り直す(タブを離れると自動で外れるため)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && st.playing) keepAwake(true);
  });

  function mediaSession() {
    if (!("mediaSession" in navigator)) return;
    try {
      const it = st.items[st.idx];
      if (it && window.MediaMetadata) navigator.mediaSession.metadata = new MediaMetadata({ title: it.title, artist: it.sub || "USCPA 聞き流し" });
      navigator.mediaSession.setActionHandler("play", () => play());
      navigator.mediaSession.setActionHandler("pause", () => pause());
      navigator.mediaSession.setActionHandler("nexttrack", () => next());
      navigator.mediaSession.setActionHandler("previoustrack", () => prev());
    } catch (e) {}
  }

  function runSeg() {
    const my = st.token;
    const it = st.items[st.idx];
    if (!st.playing) return;
    if (!it) {
      stop();
      emit();
      return;
    }
    if (st.seg === 0) {
      mediaSession();
      emit();
    }
    const s = it.segs[st.seg];
    if (!s) {
      // 項目の最後まで来たら次へ
      st.idx += 1;
      st.seg = 0;
      if (st.idx >= st.items.length) {
        st.playing = false;
        keepAwake(false);
        emit();
        return;
      }
      runSeg();
      return;
    }
    const after = () => {
      if (my !== st.token || !st.playing) return;
      st.seg += 1;
      runSeg();
    };
    if (s.wait) {
      st.timer = setTimeout(after, s.wait);
      return;
    }
    if (it.onSpeak) it.onSpeak();
    // 自然な声の音声ファイルがあれば、それを再生する
    if (s.lang === "ja" && RecAudio.has(s.t)) {
      const a = RecAudio.player();
      a.onended = after;
      a.onerror = () => {
        // ファイルが読めなければ端末の声で読む
        a.onended = a.onerror = null;
        speakTts(s, after);
      };
      a.src = RecAudio.url(s.t);
      a.playbackRate = Math.max(0.5, Math.min(2, st.rate / 0.95));
      const pr = a.play();
      if (pr && pr.catch) pr.catch(() => a.onerror && a.onerror());
      return;
    }
    speakTts(s, after);
  }

  function speakTts(s, after) {
    const u = new SpeechSynthesisUtterance(s.t);
    u.lang = s.lang === "ja" ? "ja-JP" : "en-US";
    const v = s.lang === "ja" ? jaVoice : enVoice;
    if (v) u.voice = v;
    u.rate = st.rate * (s.lang === "ja" ? 1.05 : 1);
    u.onend = u.onerror = after;
    speechSynthesis.speak(u);
  }

  // 項目の segs を、文ごとに分けた形に直す
  function normalize(items) {
    return items.map((it) => ({
      ...it,
      segs: it.segs.flatMap((s) => (s.wait || (s.lang === "ja" && RecAudio.has(s.t)) ? [s] : splitText(s.t).map((t) => ({ t, lang: s.lang })))),
    }));
  }

  function load(items, opts) {
    stop();
    st.items = normalize(items);
    st.idx = 0;
    st.seg = 0;
    st.rate = (opts && opts.rate) || 1;
    st.onChange = (opts && opts.onChange) || null;
    emit();
  }

  function play() {
    if (!supported || !st.items.length) return;
    if (st.idx >= st.items.length) st.idx = 0;
    st.token += 1;
    speechSynthesis.cancel();
    st.playing = true;
    st.seg = 0;
    keepAwake(true);
    emit();
    runSeg();
  }

  function halt() {
    st.token += 1;
    clearTimeout(st.timer);
    if (supported) speechSynthesis.cancel();
    const a = RecAudio.player();
    a.onended = a.onerror = null;
    try {
      a.pause();
    } catch (e) {}
  }

  function pause() {
    halt();
    st.playing = false;
    keepAwake(false);
    emit();
  }

  function stop() {
    halt();
    st.playing = false;
    keepAwake(false);
  }

  function jump(d) {
    const was = st.playing;
    halt();
    st.idx = Math.max(0, Math.min(st.items.length - 1, st.idx + d));
    st.seg = 0;
    if (was) {
      st.token += 1;
      st.playing = true;
      runSeg();
    } else emit();
  }
  const next = () => jump(1);
  const prev = () => jump(-1);

  return { supported, load, play, pause, stop, next, prev, state, pickVoices, hasJa: () => !!jaVoice || RecAudio.count() > 0 };
})();

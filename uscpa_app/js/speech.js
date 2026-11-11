// 英語の読み上げ(ブラウザ内蔵の音声合成)。APIキーや通信は不要。
// data-say 属性を持つ要素をタップすると、その英語を読み上げる。

const Speech = (() => {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  let voice = null;

  // 自然に聞こえる米国英語の声を優先して選ぶ
  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    const us = voices.filter((v) => /^en[-_]US/i.test(v.lang));
    voice =
      us.find((v) => /Samantha|Ava|Allison|Google US English|Microsoft (Aria|Jenny|Guy)/i.test(v.name)) ||
      us.find((v) => v.localService) ||
      us[0] ||
      voices.find((v) => /^en/i.test(v.lang)) ||
      null;
  }

  if (supported) {
    pickVoice();
    speechSynthesis.addEventListener ? speechSynthesis.addEventListener("voiceschanged", pickVoice) : (speechSynthesis.onvoiceschanged = pickVoice);
  }

  const rate = () => Store.get().prefs.speechRate || 0.95;

  // 長い文は文ごとに分けて順に読む(長い読み上げが途中で止まるブラウザがあるため)
  function chunks(text) {
    const out = [];
    String(text)
      .replace(/\s+/g, " ")
      .trim()
      .replace(/([a-z0-9)%"]{2}[.?!])\s+(?=[A-Z(])/g, "$1\u0000")
      .split("\u0000")
      .forEach((t) => {
        // それでも長い文は、カンマ・セミコロンの後で切る
        while (t.length > 220) {
          const cut = Math.max(t.lastIndexOf(", ", 200), t.lastIndexOf("; ", 200));
          if (cut < 60) break;
          out.push(t.slice(0, cut + 1));
          t = t.slice(cut + 2);
        }
        if (t.trim()) out.push(t.trim());
      });
    return out;
  }

  // ボタンの表示:読み上げ中は「■ 停止」、途中で止めたら「▶ 再開」(横に「最初から」)、それ以外は元の表示
  const STOP_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;
  const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
  let markedBtn = null;
  let playingSay = null; // 読み上げ中の文(画面が描き直されてボタンが入れ替わっても止められるように)
  let paused = null; // 途中で止めた文と位置 { say, i: 文の番号, offset: 文の中の位置 }
  let token = 0;
  let pos = { i: 0, offset: 0 }; // いま読んでいる位置

  function unmark() {
    const btn = markedBtn;
    markedBtn = null;
    if (!btn) return;
    btn.classList.remove("playing", "paused");
    if (btn.dataset.html !== undefined) {
      btn.innerHTML = btn.dataset.html;
      delete btn.dataset.html;
    }
    btn.setAttribute("aria-label", btn.dataset.label || "読み上げ");
    const r = btn.nextElementSibling;
    if (r && r.classList.contains("spk-restart")) r.remove();
  }
  function mark(btn, state) {
    unmark();
    if (!btn) return;
    markedBtn = btn;
    btn.dataset.html = btn.innerHTML;
    const labeled = !!btn.querySelector("span");
    btn.classList.add(state);
    if (state === "playing") {
      btn.setAttribute("aria-label", "読み上げを止める");
      btn.innerHTML = STOP_ICON + (labeled ? "<span>停止</span>" : "");
    } else {
      btn.setAttribute("aria-label", "止めたところから読み上げる");
      btn.innerHTML = PLAY_ICON + (labeled ? "<span>再開</span>" : "");
      btn.insertAdjacentHTML("afterend", `<span class="spk-restart" role="button" tabindex="0" aria-label="最初から読み上げる">↺${labeled ? " 最初から" : ""}</span>`);
    }
  }

  // from:{ i, offset } を渡すと、その位置から読み始める
  function speak(text, onend, from) {
    if (!supported || !text) return false;
    token += 1;
    const my = token;
    speechSynthesis.cancel();
    const btn = speak.source;
    speak.source = null;
    paused = null;
    mark(btn, "playing");
    playingSay = btn ? btn.dataset.say : null;
    const parts = chunks(text);
    let i = from ? Math.min(from.i, parts.length - 1) : 0;
    let offset = from ? from.offset : 0;
    const finish = () => {
      if (my !== token) return;
      playingSay = null;
      unmark();
      if (onend) onend();
    };
    const next = () => {
      if (my !== token) return;
      if (i >= parts.length) return finish();
      const base = offset;
      pos = { i, offset: base };
      const u = new SpeechSynthesisUtterance(parts[i].slice(base));
      i += 1;
      offset = 0;
      u.lang = "en-US";
      if (voice) u.voice = voice;
      u.rate = rate();
      // 単語ごとに位置を覚えておく(止めたときに、その単語から再開するため)
      u.onboundary = (e) => {
        if (my === token && (!e.name || e.name === "word")) pos = { i: i - 1, offset: base + (e.charIndex || 0) };
      };
      u.onend = next;
      u.onerror = (e) => (e && (e.error === "interrupted" || e.error === "canceled") ? null : next());
      speechSynthesis.speak(u);
    };
    next();
    return true;
  }

  // 画面が描き直されたら、読み上げ中・一時停止中の文のボタンの表示を戻す
  function refresh() {
    const say = playingSay !== null ? playingSay : paused && paused.say;
    if (say === null || say === undefined || (markedBtn && markedBtn.isConnected)) return;
    markedBtn = null;
    const el = [...document.querySelectorAll(".spk[data-say]")].find((x) => x.dataset.say === say);
    if (el) mark(el, playingSay !== null ? "playing" : "paused");
  }

  // 一時停止:いまの位置を覚えて止める
  function pause() {
    const say = playingSay;
    const btn = markedBtn;
    token += 1;
    playingSay = null;
    if (supported) speechSynthesis.cancel();
    paused = { say, i: pos.i, offset: pos.offset };
    mark(btn, "paused");
  }

  function stop() {
    token += 1;
    playingSay = null;
    paused = null;
    if (supported) speechSynthesis.cancel();
    unmark();
  }

  // 読み上げボタン(ボタンの中に置けるよう span で作る)
  const ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>`;
  function button(text, label, extraClass) {
    if (!supported) return "";
    const attr = String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    return `<span class="spk ${extraClass || ""}" role="button" tabindex="0" data-say="${attr}" data-label="${label || "読み上げ"}" aria-label="${label || "読み上げ"}">${ICON}${label ? `<span>${label}</span>` : ""}</span>`;
  }

  // キャプチャ段階で処理し、カードの裏返しや選択肢の回答が同時に起きないようにする
  function onActivate(e) {
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    // 「最初から」:一時停止中の文を頭から読み直す
    const rs = e.target.closest && e.target.closest(".spk-restart");
    if (rs) {
      e.preventDefault();
      e.stopPropagation();
      const btn = rs.previousElementSibling;
      if (!btn || !btn.dataset.say) return;
      unmark();
      speak.source = btn;
      speak(btn.dataset.say);
      return;
    }
    const el = e.target.closest && e.target.closest("[data-say]");
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    const say = el.dataset.say;
    // 読み上げ中に押したら一時停止、一時停止中に押したら止めたところから再開、それ以外は最初から
    if (playingSay !== null && say === playingSay) return pause();
    const from = paused && paused.say === say ? { i: paused.i, offset: paused.offset } : null;
    speak.source = el.classList.contains("spk") ? el : null;
    speak(say, null, from);
  }
  document.addEventListener("click", onActivate, true);
  document.addEventListener("keydown", onActivate, true);
  window.addEventListener("hashchange", stop);

  return { supported, speak, stop, button, refresh };
})();

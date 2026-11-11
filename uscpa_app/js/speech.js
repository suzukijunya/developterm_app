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

  // 再生中のボタンは「■ 停止」の表示にする。止まったら元に戻す
  const STOP_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;
  let playingBtn = null;
  let playingSay = null; // 読み上げ中の文(画面が描き直されてボタンが入れ替わっても止められるように)
  let token = 0;
  function markPlaying(btn) {
    if (playingBtn && playingBtn !== btn) unmark();
    if (!btn) return;
    playingBtn = btn;
    btn.dataset.html = btn.innerHTML;
    btn.classList.add("playing");
    btn.setAttribute("aria-label", "読み上げを止める");
    btn.innerHTML = STOP_ICON + (btn.querySelector("span") ? "<span>停止</span>" : "");
  }
  function unmark() {
    const btn = playingBtn;
    playingBtn = null;
    if (!btn) return;
    btn.classList.remove("playing");
    if (btn.dataset.html !== undefined) btn.innerHTML = btn.dataset.html;
    btn.setAttribute("aria-label", btn.dataset.label || "読み上げ");
  }

  function speak(text, onend) {
    if (!supported || !text) return false;
    token += 1;
    const my = token;
    speechSynthesis.cancel();
    unmark();
    const btn = speak.source;
    speak.source = null;
    markPlaying(btn);
    playingSay = btn ? btn.dataset.say : null;
    const parts = chunks(text);
    let i = 0;
    const finish = () => {
      if (my !== token) return;
      playingSay = null;
      unmark();
      if (onend) onend();
    };
    const next = () => {
      if (my !== token) return;
      if (i >= parts.length) return finish();
      const u = new SpeechSynthesisUtterance(parts[i++]);
      u.lang = "en-US";
      if (voice) u.voice = voice;
      u.rate = rate();
      u.onend = next;
      u.onerror = (e) => (e && (e.error === "interrupted" || e.error === "canceled") ? null : next());
      speechSynthesis.speak(u);
    };
    next();
    return true;
  }

  // 画面が描き直されたら、読み上げ中の文のボタンを「停止」表示に戻す
  function refresh() {
    if (playingSay === null || (playingBtn && playingBtn.isConnected)) return;
    const el = [...document.querySelectorAll(".spk[data-say]")].find((x) => x.dataset.say === playingSay);
    playingBtn = null;
    if (el) markPlaying(el);
  }

  function stop() {
    token += 1;
    playingSay = null;
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
    const el = e.target.closest && e.target.closest("[data-say]");
    if (!el) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    // 読み上げ中のボタンをもう一度押したら止める。止まっているときに押すと最初から読む
    if (el === playingBtn || (playingSay !== null && el.dataset.say === playingSay)) return stop();
    speak.source = el.classList.contains("spk") ? el : null;
    speak(el.dataset.say);
  }
  document.addEventListener("click", onActivate, true);
  document.addEventListener("keydown", onActivate, true);
  window.addEventListener("hashchange", stop);

  return { supported, speak, stop, button, refresh };
})();

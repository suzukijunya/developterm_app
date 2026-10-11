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

  function speak(text, onend) {
    if (!supported || !text) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, " ").trim());
    u.lang = "en-US";
    if (voice) u.voice = voice;
    u.rate = rate();
    document.querySelectorAll(".spk.playing").forEach((el) => el.classList.remove("playing"));
    const btn = speak.source;
    if (btn) btn.classList.add("playing");
    u.onend = u.onerror = () => {
      if (btn) btn.classList.remove("playing");
      if (onend) onend();
    };
    speechSynthesis.speak(u);
    speak.source = null;
    return true;
  }

  function stop() {
    if (supported) speechSynthesis.cancel();
  }

  // 読み上げボタン(ボタンの中に置けるよう span で作る)
  const ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>`;
  function button(text, label, extraClass) {
    if (!supported) return "";
    const attr = String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    return `<span class="spk ${extraClass || ""}" role="button" tabindex="0" data-say="${attr}" aria-label="${label || "読み上げ"}">${ICON}${label ? `<span>${label}</span>` : ""}</span>`;
  }

  // キャプチャ段階で処理し、カードの裏返しや選択肢の回答が同時に起きないようにする
  function onActivate(e) {
    const el = e.target.closest && e.target.closest("[data-say]");
    if (!el) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    speak.source = el.classList.contains("spk") ? el : null;
    speak(el.dataset.say);
  }
  document.addEventListener("click", onActivate, true);
  document.addEventListener("keydown", onActivate, true);
  window.addEventListener("hashchange", stop);

  return { supported, speak, stop, button };
})();

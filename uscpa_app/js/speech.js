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

  // ---- 追いかけ表示(カラオケ) ----
  // 読み上げているボタンの data-follow(CSSセレクタ)が指す英文の中で、読み終わった部分と
  // いま読んでいる単語に色を付ける。DOMは書き換えず CSS Custom Highlight API で塗る。
  const Karaoke = (() => {
    const ok = typeof CSS !== "undefined" && CSS.highlights && typeof Highlight !== "undefined";
    const SKIP = ".cl-ja, .c-ja, .ja, .spk, .spk-restart, .cja-btn, .c-tools, .q-ja";
    const norm = (w) => w.toLowerCase().replace(/[^a-z0-9$%]/g, "");
    let sel = null;
    let spoken = []; // [{ part, start, n }]
    let dom = []; // [{ node, start, end, n }]
    let map = []; // 読み上げの単語番号 → 画面の単語番号
    let last = -1;

    function collect() {
      dom = [];
      if (!sel) return;
      let roots = [];
      try {
        roots = [...document.querySelectorAll(sel)];
      } catch (e) {}
      roots.forEach((root) => {
        const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) => (n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
        });
        for (let n = tw.nextNode(); n; n = tw.nextNode()) for (const m of n.data.matchAll(/\S+/g)) dom.push({ node: n, start: m.index, end: m.index + m[0].length, n: norm(m[0]) });
      });
      // 読み上げの単語と画面の単語を、前から順に対応づける(「A.」など画面にない語は飛ばす)
      map = [];
      let d = 0;
      spoken.forEach((w, k) => {
        let hit = -1;
        for (let j = d; j < Math.min(dom.length, d + 6); j++)
          if (w.n && dom[j].n === w.n) {
            hit = j;
            break;
          }
        map[k] = hit;
        if (hit >= 0) d = hit + 1;
      });
    }

    function start(follow, parts) {
      clear();
      if (!ok || !follow || Store.get().prefs.karaoke === false) return;
      sel = follow;
      spoken = [];
      parts.forEach((t, p) => {
        for (const m of t.matchAll(/\S+/g)) spoken.push({ part: p, start: m.index, n: norm(m[0]) });
      });
      collect();
    }

    // part 番目の文の pos 文字目から読み始めた、という知らせを受けて塗り直す
    function at(part, pos) {
      if (!sel) return;
      let k = -1;
      for (let x = 0; x < spoken.length; x++) {
        if (spoken[x].part < part || (spoken[x].part === part && spoken[x].start <= pos)) k = x;
        else break;
      }
      paintWord(k);
    }
    function paintWord(k) {
      if (!sel || k < 0) return;
      if (dom.length && !dom[0].node.isConnected) collect(); // 画面が描き直された
      let j = -1;
      for (let x = k; x >= 0 && j < 0; x--) j = map[x];
      if (j < 0 || !dom[j]) return;
      last = k;
      try {
        const now = new Range();
        now.setStart(dom[j].node, dom[j].start);
        now.setEnd(dom[j].node, dom[j].end);
        const done = new Range();
        done.setStart(dom[0].node, dom[0].start);
        done.setEnd(dom[j].node, dom[j].start);
        CSS.highlights.set("spk-now", new Highlight(now));
        CSS.highlights.set("spk-done", new Highlight(done));
        // 読んでいる所が画面の外に出たら、見える位置までスクロールする
        const r = now.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 90 || r.top < 70) window.scrollBy({ top: r.top - window.innerHeight / 3, behavior: "smooth" });
      } catch (e) {}
    }
    // 単語の区切りの知らせが来ない声のための、時間からの推定
    const wordsIn = (part) => spoken.filter((w) => w.part === part);
    function clear() {
      sel = null;
      last = -1;
      if (ok) {
        CSS.highlights.delete("spk-now");
        CSS.highlights.delete("spk-done");
      }
    }
    return { start, at, clear, active: () => !!sel, wordsIn, lastWord: () => last, paintWord, indexOf: (part, start) => spoken.findIndex((w) => w.part === part && w.start >= start) };
  })();

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
    Karaoke.start(btn && btn.dataset.follow, parts);
    let i = from ? Math.min(from.i, parts.length - 1) : 0;
    let offset = from ? from.offset : 0;
    const finish = () => {
      if (my !== token) return;
      playingSay = null;
      Karaoke.clear();
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
      // 単語ごとに位置を覚えておく(止めたときに、その単語から再開するため)。追いかけ表示も進める
      const part = i - 1;
      let gotBoundary = false;
      let est = null;
      u.onboundary = (e) => {
        if (my !== token || (e.name && e.name !== "word")) return;
        gotBoundary = true;
        clearInterval(est);
        pos = { i: part, offset: base + (e.charIndex || 0) };
        Karaoke.at(part, base + (e.charIndex || 0));
      };
      u.onstart = () => {
        if (my !== token) return;
        Karaoke.at(part, base);
        // 単語の区切りを知らせない声(オンラインの声など)は、話す速さから位置を推定する
        if (Karaoke.active()) {
          const words = Karaoke.wordsIn(part).filter((w) => w.start >= base);
          let k = 0;
          const per = 380 / rate();
          setTimeout(() => {
            if (gotBoundary || my !== token) return;
            est = setInterval(() => {
              if (gotBoundary || my !== token || k >= words.length) return clearInterval(est);
              pos = { i: part, offset: words[k].start };
              Karaoke.at(part, words[k].start);
              k += 1;
            }, per);
          }, 500);
        }
      };
      u.onend = () => {
        clearInterval(est);
        next();
      };
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

  // 読み上げ中に速さを変えたら、いまの位置から新しい速さで読み直す
  function rateChanged() {
    if (playingSay === null) return;
    const btn = markedBtn;
    pause();
    const p = paused;
    if (!p || !btn) return;
    speak.source = btn;
    speak(p.say, null, { i: p.i, offset: p.offset });
  }

  function stop() {
    token += 1;
    playingSay = null;
    paused = null;
    Karaoke.clear();
    if (supported) speechSynthesis.cancel();
    unmark();
  }

  // 読み上げボタン(ボタンの中に置けるよう span で作る)
  const ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>`;
  // follow:読み上げに合わせて色を付ける英文のCSSセレクタ(追いかけ表示)
  function button(text, label, extraClass, follow) {
    if (!supported) return "";
    const enc = (x) => String(x).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    const attr = enc(text);
    return `<span class="spk ${extraClass || ""}" role="button" tabindex="0" data-say="${attr}"${follow ? ` data-follow="${enc(follow)}"` : ""} data-label="${label || "読み上げ"}" aria-label="${label || "読み上げ"}">${ICON}${label ? `<span>${label}</span>` : ""}</span>`;
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

  return { supported, speak, stop, button, refresh, rateChanged };
})();

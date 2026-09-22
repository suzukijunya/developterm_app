// 新しいタブ(練習・発見・トーク・マイページ)で共通に使う画面パーツ
const UI = (() => {
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function root() {
    return document.getElementById("app");
  }

  // 画面を作って #app に差し替える。navId を渡すと下部タブを付ける
  function screen(className, { navId = null } = {}) {
    const app = root();
    clear(app);
    window.scrollTo(0, 0);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const s = el("div", "screen " + className);
    if (navId) s.classList.add("screen--tabbed");
    app.appendChild(s);
    if (navId) s.appendChild(App.bottomNav(navId));
    return s;
  }

  // 下部タブの手前に中身を差し込む
  function add(screenEl, child) {
    const nav = screenEl.querySelector(":scope > .bottom-nav");
    if (nav) screenEl.insertBefore(child, nav);
    else screenEl.appendChild(child);
    return child;
  }

  function subHeader(title, onBack, { right = null } = {}) {
    const bar = el("div", "sub-header");
    const back = el("button", "sub-header-back");
    back.type = "button";
    back.innerHTML = Icons.prev;
    back.setAttribute("aria-label", "戻る");
    back.addEventListener("click", onBack);
    bar.appendChild(back);
    bar.appendChild(el("div", "sub-header-title", title));
    const slot = el("div", "sub-header-right");
    if (right) slot.appendChild(right);
    bar.appendChild(slot);
    return bar;
  }

  function button(className, text, onClick) {
    const b = el("button", className, text);
    b.type = "button";
    if (onClick) b.addEventListener("click", onClick);
    return b;
  }

  function iconButton(className, svg, label, onClick) {
    const b = el("button", className);
    b.type = "button";
    b.innerHTML = svg;
    b.setAttribute("aria-label", label);
    if (onClick) b.addEventListener("click", onClick);
    return b;
  }

  function speakerButton(text, { rate = 0.9, className = "ui-speaker" } = {}) {
    return iconButton(className, Icons.speaker, "音声を再生", (e) => {
      e.stopPropagation();
      Speech.speak(text, { rate }).catch(() => {});
    });
  }

  function bookmarkButton(item) {
    const btn = el("button", "ui-bookmark");
    btn.type = "button";
    const paint = () => {
      const on = AppState.isBookmarked(item.hanzi);
      btn.classList.toggle("is-on", on);
      btn.textContent = on ? "★" : "☆";
      btn.setAttribute("aria-label", on ? "ブックマークを外す" : "ブックマークする");
    };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const added = AppState.toggleBookmark(item);
      paint();
      toast(added ? "ブックマークしました" : "ブックマークを外しました");
    });
    paint();
    return btn;
  }

  // 中国語(ピンイン付き) + 日本語訳 のブロック
  function zhBlock({ hanzi, pinyin, ja, size = "md", speak = true, bookmark = null }) {
    const box = el("div", `zh-block zh-block--${size}`);
    const row = el("div", "zh-block-row");
    row.appendChild(Ruby.render(hanzi, pinyin || "", { className: "zh-block-ruby" }));
    const tools = el("div", "zh-block-tools");
    if (speak) tools.appendChild(speakerButton(hanzi));
    if (bookmark) tools.appendChild(bookmarkButton(bookmark));
    row.appendChild(tools);
    box.appendChild(row);
    if (ja) box.appendChild(el("div", "zh-block-ja tr-text", ja));
    return box;
  }

  // APIキー未設定のときに表示するカード
  function keyGate(container) {
    if (AI.hasKey()) return false;
    const card = el("div", "key-gate");
    card.appendChild(el("div", "key-gate-icon", "🔑"));
    card.appendChild(el("div", "key-gate-title", "AI機能を使うにはAPIキーの設定が必要です"));
    card.appendChild(
      el(
        "div",
        "key-gate-text",
        "Anthropic のAPIキーを マイページ → 設定 で入力すると、AI会話・作文添削・カメラ識別などが使えます(使った分だけ課金されます)。"
      )
    );
    card.appendChild(button("primary-btn", "設定を開く", () => App.go("settings")));
    container.appendChild(card);
    return true;
  }

  let toastTimer = null;
  function toast(message) {
    let t = document.querySelector(".ui-toast");
    if (!t) {
      t = el("div", "ui-toast");
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-shown"), 1800);
  }

  function sectionTitle(text, sub) {
    const wrap = el("div", "ui-section");
    wrap.appendChild(el("h2", "ui-section-title", text));
    if (sub) wrap.appendChild(el("div", "ui-section-sub", sub));
    return wrap;
  }

  // AI の回答(簡単なMarkdown)を安全に表示する: エスケープしてから太字・箇条書きだけ整形
  function renderMarkdown(text) {
    const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const lines = escape(text).split("\n");
    let html = "";
    let inList = false;
    lines.forEach((line) => {
      const bullet = line.match(/^\s*[-・*]\s+(.*)$/);
      const heading = line.match(/^\s*#{1,4}\s+(.*)$/);
      let body = bullet ? bullet[1] : heading ? heading[1] : line;
      body = body.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (bullet) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${body}</li>`;
        return;
      }
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (heading) html += `<div class="md-h">${body}</div>`;
      else if (body.trim() === "") html += '<div class="md-gap"></div>';
      else html += `<div>${body}</div>`;
    });
    if (inList) html += "</ul>";
    const div = el("div", "md");
    div.innerHTML = html;
    return div;
  }

  function levelLabel() {
    const lv = App.getCurrentLevel();
    return lv ? `${lv.label}(${lv.hskLabel})` : "初級";
  }

  return {
    el,
    clear,
    root,
    screen,
    add,
    subHeader,
    button,
    iconButton,
    speakerButton,
    bookmarkButton,
    zhBlock,
    keyGate,
    toast,
    sectionTitle,
    renderMarkdown,
    levelLabel,
  };
})();

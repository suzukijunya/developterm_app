// 選択した英語をその場で和訳する。
// テキストを選択(またはコピー)すると、画面下に訳を表示する。
// 会計用語は用語集(単語カード)の訳を優先して出し、文全体は Google 翻訳の無料エンドポイントで訳す。

const QuickTranslate = (() => {
  const API = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=";
  const MAX_LEN = 600;
  const cache = new Map();
  let sheet = null;
  let timer = null;
  let shownText = "";
  let reqId = 0;

  const enabled = () => Store.get().prefs.autoTranslate !== false;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // 用語集:カードの英語(括弧内の略語も別に)を、長いものから順に照合する
  let glossary = null;
  function buildGlossary() {
    const list = [];
    CPA.allCards().forEach((c) => {
      const main = c.en.replace(/\s*\(.*?\)\s*/g, " ").trim();
      const abbr = (c.en.match(/\(([^)]+)\)/) || [])[1];
      [main, abbr].filter(Boolean).forEach((term) => {
        const pat = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
        list.push({ re: new RegExp("(^|[^a-z])" + pat + "(s|es)?(?![a-z])", "i"), len: term.length, card: c });
      });
    });
    return list.sort((a, b) => b.len - a.len);
  }

  function lookup(text) {
    glossary = glossary || buildGlossary();
    const hits = [];
    const seen = new Set();
    for (const g of glossary) {
      if (hits.length >= 3) break;
      if (seen.has(g.card.id) || !g.re.test(text)) continue;
      seen.add(g.card.id);
      hits.push(g.card);
    }
    return hits;
  }

  function translate(text) {
    if (cache.has(text)) return Promise.resolve(cache.get(text));
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const t = setTimeout(() => ctrl && ctrl.abort(), 7000);
    return fetch(API + encodeURIComponent(text), ctrl ? { signal: ctrl.signal } : {})
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => {
        const ja = (data[0] || []).map((x) => x[0]).join("");
        if (!ja) throw new Error("empty");
        cache.set(text, ja);
        return ja;
      })
      .finally(() => clearTimeout(t));
  }

  function selectedText() {
    const sel = window.getSelection && window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return "";
    const node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
    // 入力欄の中や、翻訳シート自体の選択は対象外
    if (!node || node.closest("input, textarea, select, .qt-sheet")) return "";
    return sel.toString().replace(/\s+/g, " ").trim();
  }

  function hide() {
    if (sheet) sheet.hidden = true;
    shownText = "";
    reqId += 1;
  }

  function show(text) {
    if (!text || text === shownText) return;
    // 英字を含まない選択(日本語の解説など)は訳さない
    if (!/[A-Za-z]{2,}/.test(text)) return;
    if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN);
    shownText = text;
    const id = ++reqId;
    if (!sheet) {
      sheet = document.createElement("div");
      sheet.className = "qt-sheet";
      sheet.setAttribute("role", "status");
      document.body.appendChild(sheet);
      sheet.addEventListener("click", (e) => {
        if (e.target.closest("[data-qt-close]")) {
          hide();
          const sel = window.getSelection && window.getSelection();
          if (sel) sel.removeAllRanges();
        }
      });
    }
    const hits = lookup(text);
    const isTerm = hits.length && hits[0].en.toLowerCase().replace(/\s*\(.*?\)\s*/g, " ").trim() === text.toLowerCase().replace(/[.,:;?]$/, "");
    sheet.innerHTML = `
      <button class="qt-close" data-qt-close aria-label="閉じる">×</button>
      <div class="qt-src">${esc(text.length > 120 ? text.slice(0, 120) + "…" : text)}</div>
      ${hits.map((c) => `<div class="qt-term"><b>${esc(c.en)}</b><span>${esc(c.ja)}</span><small>${esc(c.desc)}</small></div>`).join("")}
      ${isTerm ? "" : `<div class="qt-ja" id="qt-ja"><span class="qt-loading">翻訳中…</span></div>`}`;
    sheet.hidden = false;
    if (isTerm) return;
    translate(text).then(
      (ja) => {
        if (id !== reqId) return;
        const el = sheet.querySelector("#qt-ja");
        if (el) el.textContent = ja;
      },
      () => {
        if (id !== reqId) return;
        const el = sheet.querySelector("#qt-ja");
        if (el) el.innerHTML = `<span class="qt-loading">自動翻訳を取得できませんでした(オフライン、または埋め込み表示では使えません)。${hits.length ? "用語集の訳を参照してください。" : ""}</span>`;
      }
    );
  }

  function onSelectionChange() {
    if (!enabled()) return;
    clearTimeout(timer);
    // 選択範囲をドラッグで広げている間は待ち、止まってから訳す
    timer = setTimeout(() => {
      const text = selectedText();
      if (text) show(text);
      else if (shownText) hide();
    }, 550);
  }

  function onCopy() {
    if (!enabled()) return;
    clearTimeout(timer);
    show(selectedText());
  }

  document.addEventListener("selectionchange", onSelectionChange);
  document.addEventListener("copy", onCopy);
  window.addEventListener("hashchange", hide);

  return { hide, lookup };
})();

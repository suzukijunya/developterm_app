// 選択した英語をその場で和訳する。
// テキストを選択(またはコピー)すると、画面下に訳を表示する。
// 会計用語は用語集(単語カード)の訳を優先して出し、文全体は Google 翻訳の無料エンドポイントで訳す。

const QuickTranslate = (() => {
    const MAX_LEN = 600;
  const CACHE_KEY = "uscpa_tr_cache_v1";
  const cache = new Map();
  try {
    Object.entries(JSON.parse(localStorage.getItem(CACHE_KEY) || "{}")).forEach(([k, v]) => cache.set(k, v));
  } catch (e) {
    // 読めない場合はキャッシュなしで動く
  }
  let saveTimer = null;
  function flush() {
    clearTimeout(saveTimer);
    saveTimer = null;
    try {
      // 古いものから消して最大1500件に保つ
      const entries = Array.from(cache.entries()).slice(-1500);
      localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch (e) {
      // 保存できない環境では起動中のみ有効
    }
  }
  function remember(text, ja) {
    cache.set(text, ja);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 300);
  }
  // アプリを閉じる・切り替える直前にも保存する
  window.addEventListener("pagehide", () => saveTimer && flush());
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && saveTimer && flush());
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

  // 無料の翻訳エンドポイントは混雑時に失敗することがあるため、順に試して最初に成功したものを使う
  const PROVIDERS = [
    {
      url: (q) => "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=" + q,
      parse: (d) => (d[0] || []).map((x) => x[0]).join(""),
    },
    {
      url: (q) => "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ja&q=" + q,
      parse: (d) => (Array.isArray(d) ? (Array.isArray(d[0]) ? d[0][0] : d[0]) : ""),
    },
    {
      url: (q) => "https://api.mymemory.translated.net/get?langpair=en%7Cja&q=" + q,
      parse: (d) => (d && d.responseStatus == 200 && d.responseData ? d.responseData.translatedText : ""),
    },
  ];

  function fetchJson(url, ms) {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const t = setTimeout(() => ctrl && ctrl.abort(), ms);
    return fetch(url, Object.assign({ credentials: "omit", referrerPolicy: "no-referrer" }, ctrl ? { signal: ctrl.signal } : {}))
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .catch((e) => {
        throw new Error(e && e.name === "AbortError" ? "タイムアウト" : (e && e.message) || "通信エラー");
      })
      .finally(() => clearTimeout(t));
  }

  async function translate(text) {
    if (cache.has(text)) return cache.get(text);
    const q = encodeURIComponent(text);
    const errors = [];
    for (const p of PROVIDERS) {
      try {
        const ja = String(p.parse(await fetchJson(p.url(q), 8000)) || "").trim();
        if (ja) {
          remember(text, ja);
          return ja;
        }
        errors.push("空の応答");
      } catch (e) {
        errors.push(e.message);
      }
    }
    throw new Error(errors.join(" / "));
  }

  // 用語集と完全一致する語句は用語集の訳を使う
  function termFor(text) {
    const norm = (x) => x.toLowerCase().replace(/\s*\(.*?\)\s*/g, " ").replace(/[.,:;?]$/, "").trim();
    const hit = lookup(text)[0];
    return hit && norm(hit.en) === norm(text) ? hit.ja : null;
  }

  // 選択肢などの複数の短文を訳す。未翻訳のものは改行でつないで1回の通信で訳し、行数が合わなければ1件ずつ訳す
  async function translateLines(lines) {
    const out = lines.map((l) => termFor(l) || cache.get(l) || null);
    const todo = lines.filter((l, i) => !out[i]);
    if (todo.length) {
      let parts = null;
      try {
        const joined = await translate(todo.join("\n"));
        parts = joined.split(/\n/).map((x) => x.trim()).filter(Boolean);
      } catch (e) {
        parts = null;
      }
      if (parts && parts.length === todo.length) {
        todo.forEach((l, i) => remember(l, parts[i]));
      } else {
        await Promise.all(todo.map((l) => translate(l).catch(() => null)));
      }
      lines.forEach((l, i) => {
        if (!out[i]) out[i] = cache.get(l) || null;
      });
    }
    return out;
  }

  function runTranslate(text, id, hasHits) {
    const el = sheet.querySelector("#qt-ja");
    if (el) el.innerHTML = `<span class="qt-loading">翻訳中…</span>`;
    translate(text).then(
      (ja) => {
        if (id !== reqId) return;
        const box = sheet.querySelector("#qt-ja");
        if (box) box.textContent = ja;
      },
      (err) => {
        if (id !== reqId) return;
        const box = sheet.querySelector("#qt-ja");
        if (!box) return;
        const offline = typeof navigator !== "undefined" && navigator.onLine === false;
        box.innerHTML = `<span class="qt-loading">${offline ? "オフラインのため" : ""}自動翻訳を取得できませんでした${offline ? "" : `(${esc(err.message)})`}。${hasHits ? "用語集の訳を参照してください。" : ""}</span>
          <button class="qt-retry" data-qt-retry>もう一度試す</button>`;
      }
    );
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
        if (e.target.closest("[data-qt-retry]")) {
          runTranslate(shownText, reqId, !!sheet.querySelector(".qt-term"));
          return;
        }
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
      <div class="qt-src">${typeof Speech !== "undefined" ? Speech.button(text, "", "small") : ""}${esc(text.length > 120 ? text.slice(0, 120) + "…" : text)}</div>
      ${hits.map((c) => `<div class="qt-term"><b>${esc(c.en)}</b><span>${esc(c.ja)}</span><small>${esc(c.desc)}</small></div>`).join("")}
      ${isTerm ? "" : `<div class="qt-ja" id="qt-ja"><span class="qt-loading">翻訳中…</span></div>`}`;
    sheet.hidden = false;
    if (isTerm) return;
    runTranslate(text, id, hits.length > 0);
  }

  function onSelectionChange() {
    if (!enabled()) return;
    clearTimeout(timer);
    // 選択範囲をドラッグで広げている間は待ち、止まってから訳す
    timer = setTimeout(() => {
      const text = selectedText();
      if (text) show(text);
      // 選択が外れたら閉じる。ただしポップアップ内のボタン(再試行・発音)を押して外れた場合は閉じない
      else if (shownText && !downInSheet) hide();
    }, 550);
  }

  function onCopy() {
    if (!enabled()) return;
    clearTimeout(timer);
    show(selectedText());
  }

  let downInSheet = false;
  document.addEventListener("pointerdown", (e) => (downInSheet = !!(e.target.closest && e.target.closest(".qt-sheet"))), true);
  document.addEventListener("touchstart", (e) => (downInSheet = !!(e.target.closest && e.target.closest(".qt-sheet"))), { capture: true, passive: true });
  document.addEventListener("selectionchange", onSelectionChange);
  document.addEventListener("copy", onCopy);
  window.addEventListener("hashchange", hide);

  return { hide, lookup, translateLines };
})();

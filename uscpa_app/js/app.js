// 画面の描画とルーティング。ハッシュ(#/home など)で画面を切り替える。

const App = (() => {
  const $app = document.getElementById("app");
  const CORE = ["FAR", "AUD", "REG"];
  const DISCIPLINES = ["BAR", "ISC", "TCP"];
  const MOCK_MCQ = 20;
  const MOCK_TBS = 2;

  let current = { section: null }; // 学習時間を記録する科目
  let session = null; // MC演習・模擬試験のセッション
  let cardRun = null; // 単語カードのセッション
  let timerId = null;
  let lastInput = Date.now();

  // ---------- 小物 ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pct = (x) => Math.round(x * 100);
  const letters = ["A", "B", "C", "D", "E"];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const fmtHours = (secs) => (secs / 3600).toFixed(secs >= 36000 ? 0 : 1);
  const fmtMin = (secs) => Math.round(secs / 60);
  const fmtClock = (secs) => {
    const s = Math.max(0, Math.floor(secs));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(ss).padStart(2, "0");
  };
  const daysUntil = (dateStr) => Math.ceil((new Date(dateStr + "T00:00:00") - new Date(Store.today() + "T00:00:00")) / 86400000);
  const bar = (ratio, color) => `<div class="bar"><span style="width:${Math.min(100, pct(ratio))}%;${color ? "background:" + color : ""}"></span></div>`;
  const tag = (secId) => {
    const s = CPA.getSection(secId);
    return `<span class="tag" style="--c:${s.color}">${s.id}</span>`;
  };

  // 埋め込み表示(claude.ai など)では confirm()/alert() が使えないため、画面内のダイアログで確認する
  function ask(message, okLabel, danger) {
    return new Promise((resolve) => {
      const d = document.createElement("div");
      d.className = "modal";
      d.innerHTML = `<div class="modal-box" role="dialog" aria-modal="true"><p>${esc(message)}</p>
        <div class="btn-row"><button class="btn" data-x>キャンセル</button><button class="btn ${danger ? "danger" : "primary"}" data-ok>${okLabel}</button></div></div>`;
      const close = (v) => {
        d.remove();
        resolve(v);
      };
      d.querySelector("[data-ok]").onclick = () => close(true);
      d.querySelector("[data-x]").onclick = () => close(false);
      d.onclick = (e) => {
        if (e.target === d) close(false);
      };
      document.body.appendChild(d);
      d.querySelector("[data-ok]").focus();
    });
  }

  function toast(message) {
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // ---- 用語の詳しい説明(日本でいうと何か) ----
  function explainBtn(cardId) {
    if (typeof CPA_EXPLAIN === "undefined" || !CPA_EXPLAIN[cardId]) return "";
    return `<span class="xp-btn" role="button" tabindex="0" data-explain="${cardId}">詳しく・日本では?</span>`;
  }

  function showExplain(cardId) {
    const c = CPA.allCards().find((x) => x.id === cardId);
    const x = c && CPA_EXPLAIN[cardId];
    if (!x) return;
    const ch = CPA.getChapter(c.chapter);
    const d = document.createElement("div");
    d.className = "modal";
    d.innerHTML = `<div class="modal-box xp-box" role="dialog" aria-modal="true" aria-label="${esc(c.en)} の説明">
        <button class="qt-close" data-x aria-label="閉じる">×</button>
        <div class="xp-head">${tag(c.section)} <b>${esc(c.en)}</b> ${Speech.button(c.en)}</div>
        <div class="xp-ja">${esc(c.ja)}</div>
        <h4>詳しく</h4><p>${esc(x[0])}</p>
        <h4>日本でいうと</h4><p class="xp-jp">${esc(x[1])}</p>
        ${x[2] ? `<h4>例</h4><p>${esc(x[2])}</p>` : ""}
        <div class="btn-row"><a class="btn" href="#/ch/${ch.id}/note" data-go title="${esc(ch.title)}">この章の講義へ</a><button class="btn primary" data-x>閉じる</button></div>
      </div>`;
    const close = () => {
      d.remove();
      document.removeEventListener("keydown", onEsc);
    };
    const onEsc = (e) => e.key === "Escape" && close();
    d.addEventListener("click", (e) => {
      if (e.target === d || e.target.closest("[data-x]") || e.target.closest("[data-go]")) close();
    });
    document.addEventListener("keydown", onEsc);
    document.body.appendChild(d);
    d.querySelector(".xp-box").scrollTop = 0;
  }

  // キャプチャ段階で処理して、カードの裏返しなどと同時に起きないようにする
  document.addEventListener(
    "click",
    (e) => {
      const b = e.target.closest && e.target.closest("[data-explain]");
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      showExplain(b.dataset.explain);
    },
    true
  );
  document.addEventListener(
    "keydown",
    (e) => {
      const b = e.target.closest && e.target.closest("[data-explain]");
      if (!b || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      showExplain(b.dataset.explain);
    },
    true
  );

  // 本試験のスコアは非公開の方法で換算されるため、正答率からの「目安」として表示する
  function estScore(ratio) {
    const v = ratio <= 0.65 ? (ratio / 0.65) * 75 : 75 + ((ratio - 0.65) / 0.35) * 24;
    return Math.max(0, Math.min(99, Math.round(v)));
  }

  function mySections() {
    return CORE.concat([Store.get().plan.discipline]);
  }

  // 章の進捗:講義・単語・MC・TBS の4ステップの平均
  function chapterProgress(ch) {
    const steps = [];
    steps.push(Store.noteRead(ch.id) ? 1 : 0);
    if (ch.cards.length) steps.push(ch.cards.filter((c) => Store.isCardMastered(c.id)).length / ch.cards.length);
    steps.push(ch.mcq.filter((q) => (Store.qRec(q.id) || {}).last === true).length / ch.mcq.length);
    const tb = CPA.tbsFor({ chapter: ch.id });
    if (tb.length) steps.push(tb.filter((t) => (Store.tbsRec(t.id) || {}).best >= 0.7).length / tb.length);
    return steps.reduce((a, b) => a + b, 0) / steps.length;
  }

  // ---- 1周にかかる時間の目安 ----
  // 講義ノートは1分250字で読む、単語カード1枚1分、MC 1問2.5分(解説を読む時間を含む)、TBS 1問15分で計算する
  const PACE = { noteChars: 250, card: 1, mcq: 2.5, tbs: 15 };
  const noteLen = new Map();
  function noteMinutes(ch) {
    if (!noteLen.has(ch.id)) noteLen.set(ch.id, ch.note.replace(/<[^>]+>/g, "").replace(/\s+/g, "").length);
    return Math.ceil(noteLen.get(ch.id) / PACE.noteChars);
  }
  function chapterMinutes(ch) {
    const tb = CPA.tbsFor({ chapter: ch.id }).length;
    const full = noteMinutes(ch) + ch.cards.length * PACE.card + ch.mcq.length * PACE.mcq + tb * PACE.tbs;
    const left =
      (Store.noteRead(ch.id) ? 0 : noteMinutes(ch)) +
      ch.cards.filter((c) => !Store.isCardMastered(c.id)).length * PACE.card +
      ch.mcq.filter((q) => (Store.qRec(q.id) || {}).last !== true).length * PACE.mcq +
      CPA.tbsFor({ chapter: ch.id }).filter((t) => !((Store.tbsRec(t.id) || {}).best >= 0.7)).length * PACE.tbs;
    return { full, left };
  }
  function sectionMinutes(sec) {
    return sec.chapters.reduce(
      (a, ch) => {
        const m = chapterMinutes(ch);
        return { full: a.full + m.full, left: a.left + m.left };
      },
      { full: 0, left: 0 }
    );
  }
  function fmtDur(min) {
    if (min < 60) return `約${Math.max(1, Math.round(min))}分`;
    return `約${(Math.round((min / 60) * 2) / 2).toFixed(1).replace(/\.0$/, "")}時間`;
  }
  function daysFor(min) {
    return Math.max(1, Math.ceil(min / Math.max(1, Store.get().plan.dailyMin)));
  }
  function timeLine(m) {
    const daily = Store.get().plan.dailyMin;
    return `1周 ${fmtDur(m.full)}(1日${daily}分で約${daysFor(m.full)}日)${m.left < m.full ? ` ・ 残り ${m.left > 0 ? fmtDur(m.left) : "なし"}` : ""}`;
  }

  function sectionProgress(sec) {
    return sec.chapters.reduce((a, ch) => a + chapterProgress(ch), 0) / sec.chapters.length;
  }

  function accuracy(qs) {
    let n = 0;
    let ok = 0;
    qs.forEach((q) => {
      const r = Store.qRec(q.id);
      if (r && r.n) {
        n += r.n;
        ok += r.ok;
      }
    });
    return n ? ok / n : null;
  }

  // ---------- レイアウト ----------
  function page({ title, back, body, tab, sub }) {
    const tabs = [
      ["home", "ホーム", "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"],
      ["learn", "学習", "M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"],
      ["practice", "演習", "M4 20h4L19 9l-4-4L4 16zM14 6l4 4"],
      ["cards", "単語", "M4 6h12v12H4zM8 3h12v12"],
      ["stats", "記録", "M4 20V10M10 20V4M16 20v-7M22 20H2"],
    ];
    $app.innerHTML = `
      <header class="top">
        ${back ? `<a class="back" href="${back}" aria-label="戻る">‹</a>` : `<span class="logo">US<b>CPA</b></span>`}
        <div class="top-title"><h1>${title}</h1>${sub ? `<div class="top-sub">${sub}</div>` : ""}</div>
        <a class="top-gear" href="#/settings" aria-label="設定">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
        </a>
      </header>
      <main class="main">${body}</main>
      ${
        tab === null
          ? ""
          : `<nav class="tabs">${tabs
              .map(([id, label, d]) => `<a href="#/${id}" class="${tab === id ? "on" : ""}"><svg viewBox="0 0 24 24"><path d="${d}"/></svg><span>${label}</span></a>`)
              .join("")}</nav>`
      }`;
    $app.classList.toggle("no-tabs", tab === null);
    // 画面が切り替わったら、前の画面で出した翻訳ポップアップを閉じる
    if (typeof QuickTranslate !== "undefined") QuickTranslate.hide();
    window.scrollTo(0, 0);
  }

  // ---------- ホーム ----------
  function viewHome() {
    current.section = null;
    const st = Store.get();
    const plan = st.plan;
    const todaySec = Store.studySeconds({ date: Store.today() });
    const totalSec = Store.studySeconds();
    const upcoming = mySections()
      .map((id) => ({ id, date: plan.examDates[id] }))
      .filter((x) => x.date && daysUntil(x.date) >= 0)
      .sort((a, b) => a.date.localeCompare(b.date));
    const weakCount = CPA.allMcq().filter((q) => Store.isWeak(q.id)).length;
    const dueCards = CPA.allCards().filter((c) => mySections().includes(c.section) && Store.isCardDue(c.id)).length;
    const last = st.last && CPA.getChapter(st.last.chapter);

    const countdown = upcoming.length
      ? `<div class="hero">
          <div class="hero-label">${tag(upcoming[0].id)} 受験日まで</div>
          <div class="hero-num">${daysUntil(upcoming[0].date)}<small>日</small></div>
          <div class="hero-sub">${upcoming[0].date}${upcoming.length > 1 ? ` ・ 次は ${upcoming[1].id}(${daysUntil(upcoming[1].date)}日後)` : ""}</div>
        </div>`
      : `<a class="hero hero-empty" href="#/settings"><div class="hero-label">受験日が未設定です</div><div class="hero-sub">設定すると残り日数と1日の目安時間を表示します ›</div></a>`;

    let pace = "";
    if (upcoming.length) {
      const sec = CPA.getSection(upcoming[0].id);
      const remain = 1 - sectionProgress(sec);
      const days = Math.max(1, daysUntil(upcoming[0].date));
      const leftCh = remain * sec.chapters.length;
      pace = `<p class="muted small">${sec.id} の残りは約 ${leftCh.toFixed(1)} 章分。受験日の2週間前に終えて総復習に回すなら、週 ${(leftCh / Math.max(1, (days - 14) / 7)).toFixed(1)} 章のペースが目安です。</p>`;
    }

    const body = `
      ${countdown}
      <div class="stat-row">
        <div class="stat"><div class="stat-num">${fmtMin(todaySec)}<small>/${plan.dailyMin}分</small></div><div class="stat-label">今日の学習</div>${bar(todaySec / 60 / plan.dailyMin)}</div>
        <div class="stat"><div class="stat-num">${Store.streak()}<small>日</small></div><div class="stat-label">連続学習</div></div>
        <div class="stat"><div class="stat-num">${fmtHours(totalSec)}<small>/${plan.targetHours}h</small></div><div class="stat-label">累計時間</div>${bar(totalSec / 3600 / plan.targetHours)}</div>
      </div>
      ${pace}

      <h2 class="h2">今日やること</h2>
      <div class="actions">
        ${
          last
            ? `<a class="action" href="#/ch/${last.id}/${st.last.tab || "note"}"><span class="ai">▶</span><span><b>続きから</b><small>${last.section} ${esc(last.title)}</small></span></a>`
            : `<a class="action" href="#/ch/FAR-01/note"><span class="ai">▶</span><span><b>まずはFARから始める</b><small>概念フレームワークと財務諸表</small></span></a>`
        }
        <a class="action" href="#/cards/run/due"><span class="ai">🗂</span><span><b>単語カード</b><small>復習予定 ${dueCards} 枚</small></span></a>
        <a class="action ${weakCount ? "" : "dim"}" href="${weakCount ? "#/review" : "#/practice"}"><span class="ai">↻</span><span><b>苦手復習</b><small>${weakCount ? weakCount + " 問(不正解・要復習)" : "まだありません"}</small></span></a>
        <a class="action" href="#/mock"><span class="ai">⏱</span><span><b>模擬試験</b><small>本番形式で実力チェック</small></span></a>
      </div>

      <h2 class="h2">科目別の進捗</h2>
      <div class="sec-list">
        ${mySections()
          .map((id) => {
            const s = CPA.getSection(id);
            const acc = accuracy(s.chapters.flatMap((c) => c.mcq));
            return `<a class="sec-card" href="#/sec/${id}" style="--c:${s.color}">
              <div class="sec-id">${id}</div>
              <div class="sec-body"><div class="sec-name">${s.ja}<small>${s.kind}</small></div>
                ${bar(sectionProgress(s), s.color)}
                <div class="sec-meta"><span class="pct-strong">進捗 ${pct(sectionProgress(s))}%</span><span>正答率 ${acc === null ? "—" : pct(acc) + "%"}</span><span>学習済み ${fmtHours(Store.studySeconds({ section: id }))}h</span></div>
                <div class="time-line">${timeLine(sectionMinutes(s))}</div>
              </div></a>`;
          })
          .join("")}
      </div>
      <a class="link-card" href="#/eligibility"><b>受験資格チェック</b><span>学歴と単位から、出願できる州と次にやることを判定 ›</span></a>
      <a class="link-card" href="#/compare"><b>講座の料金比較</b><span>アビタス・CPA会計学院の受講料を、給付金・キャッシュバック込みで比較 ›</span></a>
      <a class="link-card" href="#/guide"><b>USCPA試験ガイド</b><span>試験制度・科目の選び方・おすすめの学習の流れ ›</span></a>`;
    page({ title: "ホーム", body, tab: "home" });
  }

  // ---------- 学習(科目一覧) ----------
  function viewLearn() {
    current.section = null;
    const disc = Store.get().plan.discipline;
    const card = (s) => `
      <a class="sec-card ${DISCIPLINES.includes(s.id) && s.id !== disc ? "dim" : ""}" href="#/sec/${s.id}" style="--c:${s.color}">
        <div class="sec-id">${s.id}</div>
        <div class="sec-body"><div class="sec-name">${s.ja}<small>${s.name}</small></div>
          ${bar(sectionProgress(s), s.color)}
          <div class="sec-meta"><span class="pct-strong">進捗 ${pct(sectionProgress(s))}%</span><span>${s.chapters.length}章</span><span>MC ${s.chapters.reduce((a, c) => a + c.mcq.length, 0)}問</span><span>TBS ${CPA.tbsFor({ section: s.id }).length}問</span>${s.id === disc ? "<span class='pill'>選択中</span>" : ""}</div>
          <div class="time-line">${timeLine(sectionMinutes(s))}</div>
          ${typeof CPA_TIPS !== "undefined" && CPA_TIPS[s.id] ? `<div class="tip-line">コツ:${esc(CPA_TIPS[s.id].one)}</div>` : ""}
        </div></a>`;
    const body = `
      <p class="muted">講義ノートで理解 → 単語カードで用語を固める → MC演習 → TBS の順に進めるのがおすすめです。</p>
      <h2 class="h2">必須科目(Core)</h2>
      <div class="sec-list">${CORE.map((id) => card(CPA.getSection(id))).join("")}</div>
      <h2 class="h2">選択科目(Discipline)<small>3つから1つを受験</small></h2>
      <div class="sec-list">${DISCIPLINES.map((id) => card(CPA.getSection(id))).join("")}</div>`;
    page({ title: "学習", body, tab: "learn" });
  }

  // ---------- 科目 ----------
  function viewSection(id) {
    const s = CPA.getSection(id);
    if (!s) return go("#/learn");
    current.section = id;
    const body = `
      <div class="sec-hero" style="--c:${s.color}">
        <div class="sec-hero-id">${s.id}</div>
        <div><div class="sec-hero-name">${s.name}</div><div class="sec-hero-ja">${s.ja}・${s.kind}</div></div>
      </div>
      <div class="exam-grid">
        <div><b>${s.exam.hours}時間</b><small>試験時間</small></div>
        <div><b>${s.exam.mcq}問</b><small>MC</small></div>
        <div><b>${s.exam.tbs}問</b><small>TBS</small></div>
        <div><b>${s.exam.weight.replace(" / ", "<br>")}</b><small>配点</small></div>
      </div>
      <div class="panel prog-panel">
        <div class="prog-top"><div><div class="prog-num">${pct(sectionProgress(s))}<small>%</small></div><div class="muted small">${s.id} の進捗</div></div>
          <div class="prog-time"><b>${fmtDur(sectionMinutes(s).full)}</b><small>1周の目安</small></div>
          <div class="prog-time"><b>${sectionMinutes(s).left > 0 ? fmtDur(sectionMinutes(s).left) : "完了"}</b><small>残り</small></div>
          <div class="prog-time"><b>約${daysFor(sectionMinutes(s).left || sectionMinutes(s).full)}日</b><small>1日${Store.get().plan.dailyMin}分で</small></div></div>
        ${bar(sectionProgress(s), s.color)}
        <p class="muted small">目安は、このアプリの教材(講義・単語・MC・TBS)を1周する時間です。本試験の対策には、問題の繰り返しや予備校の教材を含めてさらに時間がかかります。1日の目標時間は設定で変えられます。</p>
      </div>
      <p class="muted">${s.summary}</p>
      ${
        typeof CPA_TIPS !== "undefined" && CPA_TIPS[s.id]
          ? `<details class="panel tips">
              <summary><b>学習のコツ(タップで開く)</b><span class="muted small">${esc(CPA_TIPS[s.id].one)}</span></summary>
              <ul>${CPA_TIPS[s.id].tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
              <dl>
                <dt>このアプリでの進め方</dt><dd>${esc(CPA_TIPS[s.id].app)}</dd>
                <dt>学習時間</dt><dd>${esc(CPA_TIPS[s.id].share)}</dd>
                <dt>受験の順番</dt><dd>${esc(CPA_TIPS[s.id].pair)}</dd>
              </dl>
            </details>`
          : ""
      }
      <h2 class="h2">章</h2>
      <div class="ch-list">
        ${s.chapters
          .map((ch, i) => {
            const mcqOk = ch.mcq.filter((q) => (Store.qRec(q.id) || {}).last === true).length;
            const cardOk = ch.cards.filter((c) => Store.isCardMastered(c.id)).length;
            const tb = CPA.tbsFor({ chapter: ch.id });
            const tbOk = tb.filter((t) => (Store.tbsRec(t.id) || {}).best >= 0.7).length;
            const p = chapterProgress(ch);
            return `<a class="ch-card" href="#/ch/${ch.id}/note">
              <div class="ch-num" style="--c:${s.color}">${p >= 0.999 ? "✓" : i + 1}</div>
              <div class="ch-body">
                <div class="ch-title">${esc(ch.title)}</div>
                <div class="ch-en">${esc(ch.en)}</div>
                <div class="time-line"><b>進捗 ${pct(p)}%</b> ・ ${timeLine(chapterMinutes(ch))}</div>
                <div class="steps">
                  <span class="${Store.noteRead(ch.id) ? "ok" : ""}">講義</span>
                  <span class="${cardOk === ch.cards.length ? "ok" : ""}">単語 ${cardOk}/${ch.cards.length}</span>
                  <span class="${mcqOk === ch.mcq.length ? "ok" : ""}">MC ${mcqOk}/${ch.mcq.length}</span>
                  ${tb.length ? `<span class="${tbOk === tb.length ? "ok" : ""}">TBS ${tbOk}/${tb.length}</span>` : ""}
                </div>
              </div></a>`;
          })
          .join("")}
      </div>
      <div class="btn-row">
        <button class="btn primary" data-act="sec-practice">${s.id} をランダム演習</button>
        <a class="btn" href="#/mock/${s.id}">${s.id} 模擬試験</a>
      </div>`;
    page({ title: s.id + " " + s.ja, back: "#/learn", body, tab: "learn" });
    $app.querySelector("[data-act=sec-practice]").onclick = () => {
      startPractice({ title: s.id + " ランダム演習", qs: shuffle(s.chapters.flatMap((c) => c.mcq)).slice(0, 10), back: "#/sec/" + s.id });
    };
  }

  // ---------- 章 ----------
  function viewChapter(id, tab) {
    const ch = CPA.getChapter(id);
    if (!ch) return go("#/learn");
    const s = CPA.getSection(ch.section);
    current.section = s.id;
    tab = tab || "note";
    Store.setLast(id, tab);
    const tbs = CPA.tbsFor({ chapter: id });
    const idx = s.chapters.indexOf(ch);
    const next = s.chapters[idx + 1];
    const tabs = [
      ["note", "講義"],
      ["cards", "単語"],
      ["mcq", "MC"],
    ].concat(tbs.length ? [["tbs", "TBS"]] : []);

    let inner = "";
    if (tab === "note") {
      const read = Store.noteRead(id);
      inner = `<article class="note">${ch.note}</article>
        <div class="btn-row">
          <button class="btn ${read ? "" : "primary"}" data-act="read">${read ? "✓ 読了済み(取り消す)" : "読了にする"}</button>
          <a class="btn" href="#/ch/${id}/cards">単語カードへ ›</a>
        </div>`;
    } else if (tab === "cards") {
      inner = `<p class="muted small">カードをタップすると意味が表示されます。「覚えた」はカード復習で2回以上連続して「わかった」を選ぶと付きます。</p>
        <div class="flip-grid">
          ${ch.cards
            .map(
              (c) => `<button class="flip" data-flip>
                ${Speech.button(c.en, "", "corner")}
                <span class="flip-front">${esc(c.en)}${Store.isCardMastered(c.id) ? '<i class="mastered">覚えた</i>' : ""}</span>
                <span class="flip-back"><b>${esc(c.ja)}</b><small>${esc(c.desc)}</small>${explainBtn(c.id)}</span></button>`
            )
            .join("")}
        </div>
        <div class="btn-row"><a class="btn primary" href="#/cards/run/ch/${id}">この章のカードを復習</a><a class="btn" href="#/ch/${id}/mcq">MC演習へ ›</a></div>`;
    } else if (tab === "mcq") {
      const unsolved = ch.mcq.filter((q) => (Store.qRec(q.id) || {}).last !== true);
      inner = `<div class="q-list">
          ${ch.mcq
            .map((q, i) => {
              const r = Store.qRec(q.id);
              const mark = !r || !r.n ? "<span class='qm none'>—</span>" : r.last ? "<span class='qm ok'>○</span>" : "<span class='qm ng'>×</span>";
              return `<button class="q-item" data-q="${i}">${mark}<span class="q-text">Q${i + 1}. ${esc(q.q)}</span>${r && r.flag ? "<span class='flag-on'>⚑</span>" : ""}</button>`;
            })
            .join("")}
        </div>
        <div class="btn-row">
          <button class="btn primary" data-act="all">全${ch.mcq.length}問を解く</button>
          <button class="btn" data-act="unsolved" ${unsolved.length ? "" : "disabled"}>未正解 ${unsolved.length}問</button>
        </div>`;
    } else if (tab === "tbs") {
      inner = `<div class="q-list">${tbs
        .map((t) => {
          const r = Store.tbsRec(t.id);
          return `<a class="q-item" href="#/tbs/${t.id}"><span class="qm ${r ? (r.best >= 0.7 ? "ok" : "ng") : "none"}">${r ? pct(r.best) + "%" : "—"}</span><span class="q-text">${esc(t.title)}</span></a>`;
        })
        .join("")}</div>`;
    }

    const body = `
      <div class="ch-head"><div class="ch-head-en">${esc(ch.en)}</div>${tag(s.id)} 第${idx + 1}章</div>
      <div class="seg">${tabs.map(([k, l]) => `<a href="#/ch/${id}/${k}" class="${k === tab ? "on" : ""}">${l}</a>`).join("")}</div>
      ${inner}
      ${next ? `<a class="link-card" href="#/ch/${next.id}/note"><b>次の章</b><span>${esc(next.title)} ›</span></a>` : ""}`;
    page({ title: esc(ch.title), back: "#/sec/" + s.id, body, tab: "learn" });

    const on = (sel, fn) => {
      const el = $app.querySelector(sel);
      if (el) el.onclick = fn;
    };
    $app.querySelectorAll(".note .en").forEach((el) => {
      if (Speech.supported) el.dataset.say = el.textContent;
    });
    on("[data-act=read]", () => {
      Store.markNote(id, !Store.noteRead(id));
      viewChapter(id, tab);
    });
    on("[data-act=all]", () => startPractice({ title: ch.title, qs: ch.mcq, back: `#/ch/${id}/mcq` }));
    on("[data-act=unsolved]", () => startPractice({ title: ch.title + "(未正解)", qs: ch.mcq.filter((q) => (Store.qRec(q.id) || {}).last !== true), back: `#/ch/${id}/mcq` }));
    $app.querySelectorAll("[data-q]").forEach((el) => {
      el.onclick = () => {
        const i = +el.dataset.q;
        startPractice({ title: ch.title, qs: ch.mcq.slice(i).concat(ch.mcq.slice(0, i)), back: `#/ch/${id}/mcq` });
      };
    });
    $app.querySelectorAll("[data-flip]").forEach((el) => (el.onclick = () => el.classList.toggle("flipped")));
  }

  // ---------- 演習(設定) ----------
  function viewPractice() {
    current.section = null;
    const opts = CPA.sections.map((s) => `<option value="${s.id}">${s.id} ${s.ja}</option>`).join("");
    const weak = CPA.allMcq().filter((q) => Store.isWeak(q.id));
    const body = `
      <div class="panel">
        <h2 class="h2 first">問題演習(MC)</h2>
        <label class="field"><span>科目</span><select id="p-sec"><option value="">すべての科目</option>${opts}</select></label>
        <label class="field"><span>章</span><select id="p-ch"><option value="">すべての章</option></select></label>
        <div class="field"><span>出題</span>
          <div class="chips" id="p-mode">
            <button data-v="smart" class="on">未正解を優先</button>
            <button data-v="random">ランダム</button>
            <button data-v="weak">苦手のみ</button>
            <button data-v="flag">⚑のみ</button>
          </div></div>
        <div class="field"><span>問題数</span>
          <div class="chips" id="p-num"><button data-v="5">5</button><button data-v="10" class="on">10</button><button data-v="20">20</button><button data-v="999">全部</button></div></div>
        <p class="muted small" id="p-count"></p>
        <button class="btn primary block" id="p-start">演習を始める</button>
      </div>

      <div class="actions two">
        <a class="action" href="#/mock"><span class="ai">⏱</span><span><b>模擬試験</b><small>ミニ(MC ${MOCK_MCQ}問+TBS ${MOCK_TBS}問)または本番と同じ問題数・時間制限つき</small></span></a>
        <a class="action ${weak.length ? "" : "dim"}" href="#/review"><span class="ai">↻</span><span><b>苦手復習</b><small>${weak.length}問</small></span></a>
      </div>

      <h2 class="h2">TBS(Task-Based Simulation)</h2>
      <div class="q-list">
        ${CPA.tbsList
          .map((t) => {
            const r = Store.tbsRec(t.id);
            return `<a class="q-item" href="#/tbs/${t.id}"><span class="qm ${r ? (r.best >= 0.7 ? "ok" : "ng") : "none"}">${r ? pct(r.best) + "%" : "—"}</span><span class="q-text">${tag(t.section)} ${esc(t.title)}</span></a>`;
          })
          .join("")}
      </div>`;
    page({ title: "演習", body, tab: "practice" });

    const $sec = $app.querySelector("#p-sec");
    const $ch = $app.querySelector("#p-ch");
    const chip = (box) => box.querySelector(".on").dataset.v;
    const pool = () => {
      let qs = CPA.allMcq();
      if ($sec.value) qs = qs.filter((q) => q.section === $sec.value);
      if ($ch.value) qs = qs.filter((q) => q.chapter === $ch.value);
      const mode = chip($app.querySelector("#p-mode"));
      if (mode === "weak") qs = qs.filter((q) => Store.isWeak(q.id));
      if (mode === "flag") qs = qs.filter((q) => (Store.qRec(q.id) || {}).flag);
      return qs;
    };
    const refresh = () => {
      const n = pool().length;
      $app.querySelector("#p-count").textContent = `対象 ${n} 問`;
      $app.querySelector("#p-start").disabled = !n;
    };
    $sec.onchange = () => {
      const s = CPA.getSection($sec.value);
      $ch.innerHTML = `<option value="">すべての章</option>` + (s ? s.chapters.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join("") : "");
      refresh();
    };
    $ch.onchange = refresh;
    $app.querySelectorAll(".chips").forEach((box) =>
      box.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          box.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
          b.classList.add("on");
          refresh();
        };
      })
    );
    $app.querySelector("#p-start").onclick = () => {
      let qs = shuffle(pool());
      if (chip($app.querySelector("#p-mode")) === "smart") {
        // 未回答 → 直近不正解 → 正解済み の順に並べる
        const rank = (q) => {
          const r = Store.qRec(q.id);
          return !r || !r.n ? 0 : r.last === false ? 1 : 2;
        };
        qs.sort((a, b) => rank(a) - rank(b));
      }
      qs = qs.slice(0, +chip($app.querySelector("#p-num")));
      const s = CPA.getSection($sec.value);
      startPractice({ title: (s ? s.id + " " : "") + "問題演習", qs, back: "#/practice" });
    };
    refresh();
  }

  function viewReview() {
    const qs = shuffle(CPA.allMcq().filter((q) => Store.isWeak(q.id)));
    if (!qs.length) return go("#/practice");
    startPractice({ title: "苦手復習", qs: qs.slice(0, 20), back: "#/practice" });
  }

  // ---------- MC演習セッション ----------
  function startPractice({ title, qs, back }) {
    if (!qs.length) return;
    session = { kind: "practice", title, qs, back: back || "#/practice", idx: 0, picks: {}, start: Date.now() };
    if (location.hash === "#/quiz") viewQuiz();
    else go("#/quiz");
  }

  // ---- 部分ごとの和訳 ----
  // 問題文は句読点や接続語の前で短いかたまりに分け、タップしたかたまりだけを訳す。
  // 選択肢は「訳」ボタンを押したものだけを訳す。表示中の訳は問題IDごとに覚えておく。
  const shownClauses = new Map(); // qid -> Set(かたまり番号)
  const shownChoices = new Map(); // qid -> Set(選択肢番号)
  const jaCache = new Map(); // 英文 -> 訳(起動中のみ。端末への保存は QuickTranslate が行う)
  const SPLIT_WORDS = ["that", "which", "who", "whose", "when", "where", "if", "because", "unless", "under", "during", "for", "from", "by", "to", "on", "with", "and"];

  function splitClauses(text) {
    // 句読点の直後で分ける(古い Safari は後読み正規表現に未対応のため使わない)
    // 文末(U.S. などの略語は除く)でも分ける
    const pieces = text
      .replace(/([,;:?])\s+/g, "$1\u0000")
      .replace(/([a-z0-9)%]{2}\.)\s+(?=[A-Z])/g, "$1\u0000")
      .split("\u0000");
    const out = [];
    const cut = (t) => {
      if (t.length <= 55) return out.push(t);
      // 真ん中に近い接続語の前で分ける(両側が短くなりすぎない位置だけ)
      let best = -1;
      const re = new RegExp("\\s(?=(" + SPLIT_WORDS.join("|") + ")\\s)", "gi");
      let m;
      while ((m = re.exec(t))) {
        if (m.index < 22 || t.length - m.index < 18) continue;
        // 「for which」「to whom」のような前置詞の直後では分けない
        if (/\b(for|to|of|in|on|by|with|from|at|about|under)$/i.test(t.slice(0, m.index))) continue;
        if (best < 0 || Math.abs(m.index - t.length / 2) < Math.abs(best - t.length / 2)) best = m.index;
      }
      if (best < 0) return out.push(t);
      cut(t.slice(0, best));
      cut(t.slice(best + 1));
    };
    pieces.forEach(cut);
    return out;
  }

  function translatePiece(text) {
    if (jaCache.has(text)) return Promise.resolve(jaCache.get(text));
    if (typeof QuickTranslate === "undefined") return Promise.resolve(null);
    return QuickTranslate.translateLines([text]).then((r) => {
      if (r[0]) jaCache.set(text, r[0]);
      return r[0];
    });
  }

  function fillPiece(el, text) {
    if (jaCache.has(text)) {
      el.textContent = jaCache.get(text);
      return;
    }
    translatePiece(text).then((ja) => {
      el.textContent = ja || "(訳を取得できませんでした)";
      el.classList.toggle("fail", !ja);
    });
  }

  function questionHtml(q, i, total, opts) {
    const r = Store.qRec(q.id);
    const showJa = Store.get().prefs.showJa;
    const picked = opts.picked;
    const reveal = opts.reveal && picked !== undefined;
    const sc = shownClauses.get(q.id) || new Set();
    const cc = shownChoices.get(q.id) || new Set();
    const clauses = splitClauses(q.q);
    return `
      <div class="q-head">
        <span>${tag(q.section)} 問題 ${i + 1} / ${total}</span>
        <button class="flag ${r && r.flag ? "on" : ""}" data-act="flag" title="要復習に追加">⚑ 要復習</button>
      </div>
      <div class="q-box">
        <p class="q-en" data-qid="${q.id}">${clauses
          .map((t, n) => `<span class="cl ${sc.has(n) ? "on" : ""}" data-cl="${n}">${esc(t)}</span>${sc.has(n) ? `<span class="cl-ja" data-clja="${n}">${esc(jaCache.get(t) || "…")}</span>` : ""}`)
          .join(" ")}</p>
        ${Speech.button(q.q, "問題文", "inline")} ${Speech.button(q.q + " " + q.c.map((c, k) => letters[k] + ". " + c + ".").join(" "), "選択肢まで", "inline")}
        <button class="ja-toggle" data-act="ja">${showJa ? "全文の和訳を隠す" : "全文の和訳"}</button>
        <span class="ja-hint">わからない部分をタップするとそこだけ和訳します(もう一度タップで隠す)。選択肢は「訳」ボタンで。</span>
        <p class="q-ja ${showJa ? "" : "hidden"}">${esc(q.ja)}</p>
      </div>
      <div class="choices" data-qid="${q.id}">
        ${q.c
          .map((c, k) => {
            let cls = "";
            if (reveal) {
              if (k === q.a) cls = "correct";
              else if (k === picked) cls = "wrong";
            } else if (k === picked) cls = "picked";
            return `<button class="choice ${cls}" data-k="${k}" ${reveal ? 'aria-disabled="true"' : ""}><span class="ck">${letters[k]}</span><span class="ctext"><span class="cen">${esc(c)}</span>${
              cc.has(k) ? `<span class="c-ja" data-cja="${k}">${esc(jaCache.get(c) || "…")}</span>` : ""
            }</span><span class="c-tools">${
              /[A-Za-z]{3,}/.test(c) ? `<span class="cja-btn ${cc.has(k) ? "on" : ""}" role="button" tabindex="0" data-cjab="${k}" aria-label="この選択肢を和訳">訳</span>` : ""
            }${Speech.button(c, "", "small")}</span></button>`;
          })
          .join("")}
      </div>
      ${
        reveal
          ? `<div class="explain ${picked === q.a ? "good" : "bad"}">
              <div class="explain-head">${picked === q.a ? "正解" : "不正解"} — 正解は ${letters[q.a]}</div>
              <p>${esc(q.ex)}</p>
              ${r ? `<div class="muted small">この問題の通算:${r.ok}/${r.n} 正解</div>` : ""}
            </div>`
          : ""
      }`;
  }

  // 再描画のあと、表示中で未取得の訳を埋める
  function fillShownPieces(q) {
    const clauses = splitClauses(q.q);
    $app.querySelectorAll("[data-clja]").forEach((el) => fillPiece(el, clauses[+el.dataset.clja]));
    $app.querySelectorAll("[data-cja]").forEach((el) => fillPiece(el, q.c[+el.dataset.cja]));
  }

  // 問題文のかたまりをタップ:そのかたまりの訳を出す・隠す(画面は再描画しない)
  function toggleClause(el) {
    const box = el.closest("[data-qid]");
    const q = box && CPA.getMcq(box.dataset.qid);
    if (!q) return;
    const n = +el.dataset.cl;
    const set = shownClauses.get(q.id) || new Set();
    shownClauses.set(q.id, set);
    const next = el.nextElementSibling;
    if (set.has(n)) {
      set.delete(n);
      el.classList.remove("on");
      if (next && next.matches("[data-clja]")) next.remove();
    } else {
      set.add(n);
      el.classList.add("on");
      const ja = document.createElement("span");
      ja.className = "cl-ja";
      ja.dataset.clja = n;
      ja.textContent = "…";
      el.after(ja);
      fillPiece(ja, splitClauses(q.q)[n]);
    }
  }

  // 選択肢の「訳」ボタン:その選択肢だけ訳を出す・隠す(回答はしない)
  function toggleChoiceJa(btn) {
    const box = btn.closest("[data-qid]");
    const q = box && CPA.getMcq(box.dataset.qid);
    if (!q) return;
    const k = +btn.dataset.cjab;
    const set = shownChoices.get(q.id) || new Set();
    shownChoices.set(q.id, set);
    const ctext = btn.closest(".choice").querySelector(".ctext");
    const cur = ctext.querySelector("[data-cja]");
    if (set.has(k)) {
      set.delete(k);
      btn.classList.remove("on");
      if (cur) cur.remove();
    } else {
      set.add(k);
      btn.classList.add("on");
      const ja = document.createElement("span");
      ja.className = "c-ja";
      ja.dataset.cja = k;
      ja.textContent = "…";
      ctext.appendChild(ja);
      fillPiece(ja, q.c[k]);
    }
  }

  // キャプチャ段階で処理して、選択肢の回答やカードの操作と同時に起きないようにする
  function onPieceTap(e) {
    const strip = e.target.closest && e.target.closest(".c-tools");
    if (strip && !e.target.closest("[data-cjab], [data-say]")) {
      // ボタンの周りの余白を押した場合は、回答にならないよう何もしない
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const t = e.target.closest && e.target.closest("[data-cjab], .q-en [data-cl]");
    if (!t) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    if (t.matches("[data-cl]")) {
      // 長押しで文字を選択している最中はタップ扱いにしない
      const sel = window.getSelection && window.getSelection();
      if (sel && !sel.isCollapsed && sel.toString().trim()) return;
      toggleClause(t);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    toggleChoiceJa(t);
  }
  document.addEventListener("click", onPieceTap, true);
  document.addEventListener("keydown", onPieceTap, true);

  function bindQuestionCommon(q, rerender) {
    fillShownPieces(q);
    const ja = $app.querySelector("[data-act=ja]");
    if (ja)
      ja.onclick = () => {
        Store.setPref("showJa", !Store.get().prefs.showJa);
        rerender();
      };
    const fl = $app.querySelector("[data-act=flag]");
    if (fl)
      fl.onclick = () => {
        Store.toggleFlag(q.id);
        rerender();
      };
  }

  function viewQuiz() {
    if (!session) return go("#/practice");
    if (session.kind === "mock") return viewMockRun();
    const { qs, idx } = session;
    if (idx >= qs.length) return viewQuizResult();
    const q = qs[idx];
    current.section = q.section;
    const picked = session.picks[q.id];
    const answered = picked !== undefined;
    const confirmMode = !!Store.get().prefs.confirmAnswer;
    const pending = !answered && confirmMode && session.pending && session.pending.qid === q.id ? session.pending.k : undefined;
    const body = `
      ${bar(idx / qs.length)}
      ${questionHtml(q, idx, qs.length, answered ? { picked, reveal: true } : { picked: pending, reveal: false })}
      <div class="btn-row sticky">
        <a class="btn" href="${session.back}">中断</a>
        ${
          answered
            ? `<button class="btn primary" data-act="next">${idx + 1 < qs.length ? "次の問題 ›" : "結果を見る"}</button>`
            : confirmMode
            ? `<button class="btn primary" data-act="commit" ${pending === undefined ? "disabled" : ""}>${pending === undefined ? "選択肢を選んでください" : `${letters[pending]} で解答する`}</button>`
            : `<span class="muted small kb">キーボード:1〜4 / A〜D で解答</span>`
        }
      </div>`;
    page({ title: esc(session.title), back: session.back, body, tab: null });

    // 再描画してもスクロール位置を保つ(解説や選択中の選択肢が見えたままにする)
    const keepScroll = () => {
      const y = window.scrollY;
      viewQuiz();
      window.scrollTo(0, y);
    };
    const commit = (k) => {
      session.pending = null;
      session.picks[q.id] = k;
      Store.answer(q.id, k === q.a);
      keepScroll();
    };
    $app.querySelectorAll(".choice").forEach((b) => {
      b.onclick = () => {
        if (session.picks[q.id] !== undefined) return;
        const k = +b.dataset.k;
        if (!confirmMode || pending === k) return commit(k);
        session.pending = { qid: q.id, k };
        keepScroll();
      };
    });
    const cm = $app.querySelector("[data-act=commit]");
    if (cm && pending !== undefined) cm.onclick = () => commit(pending);
    bindQuestionCommon(q, viewQuiz);
    const nx = $app.querySelector("[data-act=next]");
    if (nx)
      nx.onclick = () => {
        session.idx += 1;
        viewQuiz();
      };
  }

  function viewQuizResult() {
    const { qs, picks } = session;
    const ok = qs.filter((q) => picks[q.id] === q.a).length;
    const done = qs.filter((q) => picks[q.id] !== undefined).length;
    if (!session.saved) {
      session.saved = true;
      Store.pushHistory({ kind: "practice", title: session.title, ok, n: done, secs: Math.round((Date.now() - session.start) / 1000) });
    }
    const wrong = qs.filter((q) => picks[q.id] !== undefined && picks[q.id] !== q.a);
    const body = `
      <div class="result">
        <div class="result-num">${ok}<small> / ${done}</small></div>
        <div class="result-label">正答率 ${done ? pct(ok / done) : 0}%</div>
      </div>
      <div class="q-list">
        ${qs
          .map((q) => {
            const p = picks[q.id];
            const mark = p === undefined ? "<span class='qm none'>—</span>" : p === q.a ? "<span class='qm ok'>○</span>" : "<span class='qm ng'>×</span>";
            return `<details class="q-item det"><summary>${mark}<span class="q-text">${esc(q.q)}</span></summary>
              <div class="det-body"><p class="q-ja">${esc(q.ja)}</p><p><b>正解 ${letters[q.a]}.</b> ${esc(q.c[q.a])}</p><p class="muted">${esc(q.ex)}</p></div></details>`;
          })
          .join("")}
      </div>
      <div class="btn-row">
        ${wrong.length ? `<button class="btn primary" data-act="retry">間違えた ${wrong.length} 問をもう一度</button>` : ""}
        <a class="btn" href="${session.back}">戻る</a>
      </div>`;
    page({ title: "結果", back: session.back, body, tab: null });
    const r = $app.querySelector("[data-act=retry]");
    if (r) r.onclick = () => startPractice({ title: session.title + "(復習)", qs: wrong, back: session.back });
  }

  // ---------- 模擬試験 ----------
  function viewMockSetup(secId) {
    current.section = null;
    const sel = secId || mySections()[0];
    const s = CPA.getSection(sel);
    const poolMcq = s.chapters.reduce((a, c) => a + c.mcq.length, 0);
    const poolTbs = CPA.tbsFor({ section: sel }).length;
    // ミニ:MC 20問+TBS 2問。本番形式:本試験と同じ問題数・4時間(問題が足りないときは全問)
    const modes = {
      mini: { label: "ミニ模試", nMcq: Math.min(MOCK_MCQ, poolMcq), nTbs: Math.min(MOCK_TBS, poolTbs) },
      full: { label: "本番形式", nMcq: Math.min(s.exam.mcq, poolMcq), nTbs: Math.min(s.exam.tbs, poolTbs) },
    };
    modes.mini.minutes = Math.round(modes.mini.nMcq * 1.5 + modes.mini.nTbs * 12);
    modes.full.minutes = modes.full.nMcq === s.exam.mcq && modes.full.nTbs === s.exam.tbs ? s.exam.hours * 60 : Math.round(modes.full.nMcq * 1.5 + modes.full.nTbs * 12);
    const hist = Store.get().mocks.filter((m) => m.section === sel).slice(0, 5);
    const body = `
      <div class="seg wrap">${CPA.sections.map((x) => `<a href="#/mock/${x.id}" class="${x.id === sel ? "on" : ""}">${x.id}</a>`).join("")}</div>
      <div class="panel">
        <div class="sec-hero small" style="--c:${s.color}"><div class="sec-hero-id">${s.id}</div><div><div class="sec-hero-name">${s.name}</div><div class="sec-hero-ja">${s.ja}</div></div></div>
        <ul class="plain">
          <li><b>ミニ模試</b>:MC ${modes.mini.nMcq}問 + TBS ${modes.mini.nTbs}問・${modes.mini.minutes}分(MC 1問1.5分・TBS 1問12分で換算)</li>
          <li><b>本番形式</b>:MC ${modes.full.nMcq}問 + TBS ${modes.full.nTbs}問・${modes.full.minutes % 60 ? modes.full.minutes + "分" : modes.full.minutes / 60 + "時間"}(本試験は MC ${s.exam.mcq}問・TBS ${s.exam.tbs}問・${s.exam.hours}時間)</li>
          <li>配点 ${s.exam.weight}。解答中は正誤が表示されず、終了後にまとめて採点します</li>
          <li>スコアは正答率から換算した<b>目安</b>です(合格ライン 75)。本番の画面操作は <a href="#/guide">AICPA公式サンプルテスト</a>でも確認できます</li>
        </ul>
        <div class="btn-row"><button class="btn primary" data-mode="mini">ミニ模試を開始</button><button class="btn" data-mode="full">本番形式で開始</button></div>
      </div>
      ${
        hist.length
          ? `<h2 class="h2">${s.id} の過去の結果</h2><div class="q-list">${hist
              .map((m) => `<div class="q-item"><span class="qm ${m.score >= 75 ? "ok" : "ng"}">${m.score}</span><span class="q-text">${m.date} ・ MC ${pct(m.mcq)}% / TBS ${m.tbs === null ? "—" : pct(m.tbs) + "%"}</span></div>`)
              .join("")}</div>`
          : ""
      }`;
    page({ title: "模擬試験", back: "#/practice", body, tab: "practice" });
    $app.querySelectorAll("[data-mode]").forEach((b) => {
      b.onclick = () => {
        const m = modes[b.dataset.mode];
        const qs = shuffle(s.chapters.flatMap((c) => c.mcq)).slice(0, m.nMcq);
        const tb = shuffle(CPA.tbsFor({ section: sel })).slice(0, m.nTbs);
        session = {
          kind: "mock",
          section: sel,
          title: sel + " " + (b.dataset.mode === "full" ? "模擬試験(本番形式)" : "模擬試験"),
          items: qs.map((q) => ({ type: "mcq", q })).concat(tb.map((t) => ({ type: "tbs", t }))),
          idx: 0,
          picks: {},
          tbsInputs: {},
          flags: {},
          start: Date.now(),
          limit: m.minutes * 60,
          back: "#/mock/" + sel,
        };
        go("#/quiz");
      };
    });
  }

  function viewMockRun() {
    const sx = session;
    if (sx.finished) return viewMockResult();
    current.section = sx.section;
    const it = sx.items[sx.idx];
    const remain = sx.limit - (Date.now() - sx.start) / 1000;
    if (remain <= 0) return finishMock();
    const nav = sx.items
      .map((x, i) => {
        const done = x.type === "mcq" ? sx.picks[x.q.id] !== undefined : Object.keys(sx.tbsInputs[x.t.id] || {}).length > 0;
        const label = x.type === "mcq" ? i + 1 : "T" + (i + 1 - sx.items.filter((y) => y.type === "mcq").length);
        return `<button class="nav-dot ${i === sx.idx ? "cur" : ""} ${done ? "done" : ""} ${sx.flags[i] ? "flagged" : ""}" data-go="${i}">${label}</button>`;
      })
      .join("");
    let main;
    if (it.type === "mcq") {
      main = questionHtml(it.q, sx.idx, sx.items.length, { picked: sx.picks[it.q.id], reveal: false });
    } else {
      main = tbsHtml(it.t, sx.tbsInputs[it.t.id] || {}, false);
    }
    const body = `
      <div class="mock-bar"><span>⏱ <b id="clock">${fmtClock(remain)}</b></span><button class="btn small" data-act="mflag">${sx.flags[sx.idx] ? "★ 見直し解除" : "☆ 見直し"}</button><button class="btn small danger" data-act="finish">終了して採点</button></div>
      <div class="nav-grid">${nav}</div>
      ${main}
      <div class="btn-row sticky">
        <button class="btn" data-act="prev" ${sx.idx === 0 ? "disabled" : ""}>‹ 前へ</button>
        <button class="btn primary" data-act="next">${sx.idx + 1 < sx.items.length ? "次へ ›" : "終了して採点"}</button>
      </div>`;
    page({ title: esc(sx.title), sub: `${sx.idx + 1} / ${sx.items.length}`, back: null, body, tab: null });

    if (it.type === "mcq") {
      $app.querySelectorAll(".choice").forEach((b) => {
        b.onclick = () => {
          sx.picks[it.q.id] = +b.dataset.k;
          viewMockRun();
        };
      });
      bindQuestionCommon(it.q, viewMockRun);
    } else {
      bindTbsInputs(it.t, sx.tbsInputs);
    }
    $app.querySelectorAll("[data-go]").forEach((b) => {
      b.onclick = () => {
        sx.idx = +b.dataset.go;
        viewMockRun();
      };
    });
    $app.querySelector("[data-act=mflag]").onclick = () => {
      sx.flags[sx.idx] = !sx.flags[sx.idx];
      viewMockRun();
    };
    $app.querySelector("[data-act=prev]").onclick = () => {
      sx.idx -= 1;
      viewMockRun();
    };
    $app.querySelector("[data-act=next]").onclick = () => {
      if (sx.idx + 1 < sx.items.length) {
        sx.idx += 1;
        viewMockRun();
      } else confirmFinish();
    };
    $app.querySelector("[data-act=finish]").onclick = confirmFinish;
  }

  function confirmFinish() {
    const sx = session;
    const left = sx.items.filter((x) => (x.type === "mcq" ? sx.picks[x.q.id] === undefined : !Object.keys(sx.tbsInputs[x.t.id] || {}).length)).length;
    ask(left ? `未解答が ${left} 問あります。終了して採点しますか?` : "終了して採点しますか?", "採点する").then((ok) => {
      if (ok && session === sx) finishMock();
    });
  }

  function finishMock() {
    const sx = session;
    if (sx.finished) return viewMockResult();
    sx.finished = true;
    sx.secs = Math.min(sx.limit, Math.round((Date.now() - sx.start) / 1000));
    const mcqs = sx.items.filter((x) => x.type === "mcq");
    const tbs = sx.items.filter((x) => x.type === "tbs");
    let ok = 0;
    mcqs.forEach(({ q }) => {
      const p = sx.picks[q.id];
      if (p !== undefined) Store.answer(q.id, p === q.a);
      if (p === q.a) ok += 1;
    });
    sx.mcqRatio = mcqs.length ? ok / mcqs.length : 0;
    sx.tbsScores = {};
    tbs.forEach(({ t }) => {
      const sc = gradeTbs(t, sx.tbsInputs[t.id] || {}).score;
      sx.tbsScores[t.id] = sc;
      Store.recordTbs(t.id, sc);
    });
    sx.tbsRatio = tbs.length ? tbs.reduce((a, { t }) => a + sx.tbsScores[t.id], 0) / tbs.length : null;
    const s = CPA.getSection(sx.section);
    const mcW = parseInt(s.exam.weight.match(/MC (\d+)%/)[1], 10) / 100;
    const ratio = sx.tbsRatio === null ? sx.mcqRatio : sx.mcqRatio * mcW + sx.tbsRatio * (1 - mcW);
    sx.score = estScore(ratio);
    Store.pushMock({ section: sx.section, score: sx.score, mcq: sx.mcqRatio, tbs: sx.tbsRatio, secs: sx.secs });
    Store.pushHistory({ kind: "mock", title: sx.title, ok, n: mcqs.length, secs: sx.secs });
    viewMockResult();
  }

  function viewMockResult() {
    const sx = session;
    const s = CPA.getSection(sx.section);
    const pass = sx.score >= 75;
    const mcqs = sx.items.filter((x) => x.type === "mcq");
    const tbs = sx.items.filter((x) => x.type === "tbs");
    // 章ごとの正誤
    const byCh = {};
    mcqs.forEach(({ q }) => {
      byCh[q.chapter] = byCh[q.chapter] || { ok: 0, n: 0 };
      byCh[q.chapter].n += 1;
      if (sx.picks[q.id] === q.a) byCh[q.chapter].ok += 1;
    });
    const body = `
      <div class="result ${pass ? "pass" : "fail"}">
        <div class="result-label">${s.id} 推定スコア</div>
        <div class="result-num">${sx.score}</div>
        <div class="result-label">${pass ? "合格ライン(75)到達" : "合格ライン(75)まであと " + (75 - sx.score)}</div>
        <div class="muted small">MC ${pct(sx.mcqRatio)}% ・ TBS ${sx.tbsRatio === null ? "—" : pct(sx.tbsRatio) + "%"} ・ ${fmtClock(sx.secs)}</div>
      </div>
      <h2 class="h2">章ごとの正答</h2>
      <div class="ch-score">
        ${Object.entries(byCh)
          .map(([cid, r]) => `<a href="#/ch/${cid}/note"><span>${esc(CPA.getChapter(cid).title)}</span>${bar(r.ok / r.n, s.color)}<b>${r.ok}/${r.n}</b></a>`)
          .join("")}
      </div>
      <h2 class="h2">MC の見直し</h2>
      <div class="q-list">
        ${mcqs
          .map(({ q }, i) => {
            const p = sx.picks[q.id];
            const mark = p === undefined ? "<span class='qm none'>—</span>" : p === q.a ? "<span class='qm ok'>○</span>" : "<span class='qm ng'>×</span>";
            return `<details class="q-item det"><summary>${mark}<span class="q-text">Q${i + 1}. ${esc(q.q)}</span></summary>
              <div class="det-body"><p class="q-ja">${esc(q.ja)}</p>
              ${q.c.map((c, k) => `<p class="${k === q.a ? "ans-ok" : k === p ? "ans-ng" : ""}">${letters[k]}. ${esc(c)}</p>`).join("")}
              <p class="muted">${esc(q.ex)}</p></div></details>`;
          })
          .join("")}
      </div>
      ${
        tbs.length
          ? `<h2 class="h2">TBS の見直し</h2>${tbs
              .map(({ t }) => `<details class="panel det"><summary><b>${esc(t.title)}</b> — ${pct(sx.tbsScores[t.id])}%</summary>${tbsHtml(t, sx.tbsInputs[t.id] || {}, true)}</details>`)
              .join("")}`
          : ""
      }
      <div class="btn-row"><a class="btn primary" href="#/mock/${s.id}">もう一度</a><a class="btn" href="#/home">ホームへ</a></div>`;
    page({ title: "模擬試験の結果", back: "#/mock/" + s.id, body, tab: null });
  }

  // ---------- TBS ----------
  function parseNum(v) {
    if (v === undefined || v === null) return NaN;
    const s = String(v).replace(/[,$\s]/g, "").replace(/^\((.*)\)$/, "-$1");
    return s === "" ? NaN : Number(s);
  }

  function gradeTbs(t, inputs) {
    const marks = t.rows.map((r, i) => {
      const v = inputs[i];
      if (r.type === "num") return Math.abs(parseNum(v) - r.answer) <= (r.tol || 0);
      return v === r.answer;
    });
    return { marks, score: marks.filter(Boolean).length / t.rows.length };
  }

  function tbsHtml(t, inputs, graded) {
    const g = graded ? gradeTbs(t, inputs) : null;
    return `
      <div class="tbs">
        <div class="tbs-scenario">${Speech.button(t.scenario.replace(/<p class="ja">[\s\S]*?<\/p>/g, "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " "), "英文を読み上げ", "inline")}${t.scenario}</div>
        <table class="tbs-table">
          <thead><tr><th>項目</th><th>解答</th>${graded ? "<th></th>" : ""}</tr></thead>
          <tbody>
          ${t.rows
            .map((r, i) => {
              const v = inputs[i] === undefined ? "" : inputs[i];
              const field =
                r.type === "num"
                  ? `<input class="tbs-in" data-row="${i}" inputmode="decimal" placeholder="$" value="${esc(v)}" ${graded ? "disabled" : ""}>`
                  : `<select class="tbs-in" data-row="${i}" ${graded ? "disabled" : ""}><option value="">選択</option>${r.options.map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
              const fix = graded && !g.marks[i] ? `<div class="tbs-fix">正解:${r.type === "num" ? "$" + r.answer.toLocaleString() : esc(r.answer)}</div>` : "";
              return `<tr class="${graded ? (g.marks[i] ? "row-ok" : "row-ng") : ""}"><td>${esc(r.label)}</td><td>${field}${fix}</td>${graded ? `<td class="mk">${g.marks[i] ? "○" : "×"}</td>` : ""}</tr>`;
            })
            .join("")}
          </tbody>
        </table>
        ${graded ? `<div class="explain ${g.score >= 0.7 ? "good" : "bad"}"><div class="explain-head">得点 ${g.marks.filter(Boolean).length} / ${t.rows.length}(${pct(g.score)}%)</div>${t.explain}</div>` : ""}
      </div>`;
  }

  function bindTbsInputs(t, store) {
    store[t.id] = store[t.id] || {};
    $app.querySelectorAll(".tbs-in").forEach((el) => {
      const set = () => {
        if (el.value === "") delete store[t.id][el.dataset.row];
        else store[t.id][el.dataset.row] = el.value;
      };
      el.oninput = set;
      el.onchange = set;
    });
  }

  let tbsDraft = {};
  function viewTbs(id, graded) {
    const t = CPA.getTbs(id);
    if (!t) return go("#/practice");
    current.section = t.section;
    const ch = CPA.getChapter(t.chapter);
    const body = `
      <div class="ch-head">${tag(t.section)} ${esc(ch.title)}</div>
      ${tbsHtml(t, tbsDraft[id] || {}, graded)}
      <div class="btn-row sticky">
        ${graded ? `<button class="btn" data-act="again">もう一度解く</button><a class="btn primary" href="#/ch/${t.chapter}/tbs">章に戻る</a>` : `<button class="btn primary" data-act="grade">採点する</button>`}
      </div>`;
    page({ title: esc(t.title), back: "#/practice", body, tab: null });
    if (!graded) {
      bindTbsInputs(t, tbsDraft);
      $app.querySelector("[data-act=grade]").onclick = () => {
        const g = gradeTbs(t, tbsDraft[id] || {});
        Store.recordTbs(id, g.score);
        viewTbs(id, true);
      };
    } else {
      $app.querySelector("[data-act=again]").onclick = () => {
        tbsDraft[id] = {};
        viewTbs(id, false);
      };
    }
  }

  // ---------- 単語カード ----------
  function viewCards() {
    current.section = null;
    const mine = mySections();
    const rows = CPA.sections
      .map((s) => {
        const cs = s.chapters.flatMap((c) => c.cards);
        const due = cs.filter((c) => Store.isCardDue(c.id)).length;
        const m = cs.filter((c) => Store.isCardMastered(c.id)).length;
        return `<a class="sec-card ${mine.includes(s.id) ? "" : "dim"}" href="#/cards/run/sec/${s.id}" style="--c:${s.color}">
          <div class="sec-id">${s.id}</div>
          <div class="sec-body"><div class="sec-name">${s.ja}</div>${bar(m / cs.length, s.color)}
          <div class="sec-meta"><span>覚えた ${m}/${cs.length}</span><span>復習予定 ${due}</span></div></div></a>`;
      })
      .join("");
    const dueAll = CPA.allCards().filter((c) => mine.includes(c.section) && Store.isCardDue(c.id)).length;
    const body = `
      <a class="action wide" href="#/cards/run/due"><span class="ai">🗂</span><span><b>今日の復習を始める</b><small>受験科目(${mine.join("・")})の復習予定 ${dueAll} 枚</small></span></a>
      <h2 class="h2">科目別</h2>
      <div class="sec-list">${rows}</div>
      <h2 class="h2">用語集</h2>
      <input class="search" id="g-q" placeholder="英語・日本語で検索(例:lease, 減損)">
      <div class="gloss" id="g-list"></div>`;
    page({ title: "単語カード", body, tab: "cards" });
    const $q = $app.querySelector("#g-q");
    const draw = () => {
      const k = $q.value.trim().toLowerCase();
      const list = CPA.allCards().filter((c) => !k || (c.en + c.ja + c.desc).toLowerCase().includes(k));
      $app.querySelector("#g-list").innerHTML = list.length
        ? list.map((c) => `<div class="gloss-row">${tag(c.section)}<div class="gloss-body"><b>${esc(c.en)}</b><span>${esc(c.ja)}</span><small>${esc(c.desc)}</small>${explainBtn(c.id)}</div>${Speech.button(c.en)}</div>`).join("")
        : `<p class="muted">見つかりませんでした</p>`;
    };
    $q.oninput = draw;
    draw();
  }

  function startCardRun(kind, id) {
    let cards;
    let title;
    let back = "#/cards";
    if (kind === "ch") {
      const ch = CPA.getChapter(id);
      if (!ch) return go("#/cards");
      cards = ch.cards;
      title = ch.title;
      back = `#/ch/${id}/cards`;
    } else if (kind === "sec") {
      const s = CPA.getSection(id);
      if (!s) return go("#/cards");
      const all = s.chapters.flatMap((c) => c.cards);
      const due = all.filter((c) => Store.isCardDue(c.id));
      cards = due.length ? due : all;
      title = s.id + (due.length ? " 復習" : " 全カード");
    } else {
      cards = CPA.allCards().filter((c) => mySections().includes(c.section) && Store.isCardDue(c.id));
      title = "今日の復習";
    }
    cards = shuffle(cards).slice(0, 30);
    cardRun = { title, cards, idx: 0, flipped: false, back, tally: [0, 0, 0] };
  }

  function viewCardRun() {
    if (!cardRun) return go("#/cards");
    const { cards, idx } = cardRun;
    if (!cards.length) {
      page({
        title: "単語カード",
        back: cardRun.back,
        body: `<div class="result"><div class="result-num">🎉</div><div class="result-label">今日の復習はありません</div></div><div class="btn-row"><a class="btn primary" href="${cardRun.back}">戻る</a></div>`,
        tab: null,
      });
      return;
    }
    if (idx >= cards.length) {
      const [ng, mid, ok] = cardRun.tally;
      page({
        title: "単語カード",
        back: cardRun.back,
        body: `<div class="result"><div class="result-num">${cards.length}<small>枚</small></div><div class="result-label">わかった ${ok} ・ あいまい ${mid} ・ わからない ${ng}</div></div><div class="btn-row"><a class="btn primary" href="${cardRun.back}">戻る</a></div>`,
        tab: null,
      });
      return;
    }
    const c = cards[idx];
    current.section = c.section;
    const prefs = Store.get().prefs;
    const listen = Speech.supported && !!prefs.cardListen;
    const auto = Speech.supported && (listen || !!prefs.cardAuto);
    const hideEn = listen && !cardRun.flipped;
    const body = `
      ${bar(idx / cards.length)}
      ${
        Speech.supported
          ? `<div class="chips center-chips" id="c-mode">
              <button data-m="auto" class="${prefs.cardAuto || listen ? "on" : ""}" ${listen ? "disabled" : ""}>🔊 自動で発音</button>
              <button data-m="listen" class="${listen ? "on" : ""}">👂 リスニング</button>
            </div>`
          : ""
      }
      <div class="muted small center">${idx + 1} / ${cards.length}</div>
      <button class="bigcard ${cardRun.flipped ? "flipped" : ""}" data-act="flip">
        <span class="bc-tag">${c.section}</span>
        ${Speech.button(c.en, "", "corner big")}
        ${hideEn ? `<span class="bc-listen">音声を聞いて、用語と意味を思い浮かべてください</span>` : `<span class="bc-en">${esc(c.en)}</span>`}
        ${cardRun.flipped ? `<span class="bc-ja">${esc(c.ja)}</span><span class="bc-desc">${esc(c.desc)}</span>${explainBtn(c.id)}` : `<span class="muted small">タップして${hideEn ? "答え" : "意味"}を表示</span>`}
      </button>
      ${
        cardRun.flipped
          ? `<div class="grade-row"><button class="btn g0" data-g="0">わからない</button><button class="btn g1" data-g="1">あいまい</button><button class="btn g2" data-g="2">わかった</button></div>`
          : ""
      }`;
    page({ title: esc(cardRun.title), back: cardRun.back, body, tab: null });
    // 新しいカードを表示したときだけ自動で発音する(裏返しでは再生しない)
    if (auto && cardRun.spoken !== idx) {
      cardRun.spoken = idx;
      Speech.speak(c.en);
    }
    $app.querySelectorAll("#c-mode button").forEach((b) => {
      b.onclick = () => {
        const key = b.dataset.m === "auto" ? "cardAuto" : "cardListen";
        Store.setPref(key, !Store.get().prefs[key]);
        cardRun.spoken = -1;
        viewCardRun();
      };
    });
    $app.querySelector("[data-act=flip]").onclick = () => {
      cardRun.flipped = !cardRun.flipped;
      viewCardRun();
    };
    $app.querySelectorAll("[data-g]").forEach((b) => {
      b.onclick = () => {
        const g = +b.dataset.g;
        Store.reviewCard(c.id, g);
        cardRun.tally[g] += 1;
        cardRun.idx += 1;
        cardRun.flipped = false;
        viewCardRun();
      };
    });
  }

  // ---------- 記録 ----------
  function viewStats() {
    current.section = null;
    const st = Store.get();
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = Store.addDays(Store.today(), -i);
      days.push({ d, secs: Store.studySeconds({ date: d }) });
    }
    const maxSec = Math.max(60 * 30, ...days.map((x) => x.secs));
    const totalSec = Store.studySeconds();
    const allQ = CPA.allMcq();
    const answered = allQ.filter((q) => (Store.qRec(q.id) || {}).n).length;
    const body = `
      <div class="stat-row">
        <div class="stat"><div class="stat-num">${fmtHours(totalSec)}<small>h</small></div><div class="stat-label">累計学習時間</div></div>
        <div class="stat"><div class="stat-num">${answered}<small>/${allQ.length}</small></div><div class="stat-label">解いた問題</div></div>
        <div class="stat"><div class="stat-num">${accuracy(allQ) === null ? "—" : pct(accuracy(allQ)) + "<small>%</small>"}</div><div class="stat-label">通算正答率</div></div>
      </div>

      <h2 class="h2">直近14日の学習時間</h2>
      <div class="chart">
        ${days
          .map(
            (x) => `<div class="col" title="${x.d}: ${fmtMin(x.secs)}分"><div class="col-bar" style="height:${Math.round((x.secs / maxSec) * 100)}%"></div><span>${+x.d.slice(8)}</span></div>`
          )
          .join("")}
      </div>
      <p class="muted small">学習画面(講義・演習・カード)を開いて操作している時間を自動で記録しています。</p>

      <h2 class="h2">科目別</h2>
      <table class="tbl">
        <thead><tr><th>科目</th><th>時間</th><th>進捗</th><th>正答率</th><th>模試最高</th></tr></thead>
        <tbody>
        ${CPA.sections
          .map((s) => {
            const acc = accuracy(s.chapters.flatMap((c) => c.mcq));
            const best = st.mocks.filter((m) => m.section === s.id).reduce((a, m) => Math.max(a, m.score), -1);
            return `<tr><td>${tag(s.id)}</td><td>${fmtHours(Store.studySeconds({ section: s.id }))}h</td><td>${pct(sectionProgress(s))}%</td><td>${acc === null ? "—" : pct(acc) + "%"}</td><td>${best < 0 ? "—" : best}</td></tr>`;
          })
          .join("")}
        </tbody>
      </table>

      <h2 class="h2">最近の演習</h2>
      ${
        st.history.length
          ? `<div class="q-list">${st.history
              .slice(0, 15)
              .map((h) => `<div class="q-item"><span class="qm ${h.n && h.ok / h.n >= 0.7 ? "ok" : "ng"}">${h.n ? pct(h.ok / h.n) + "%" : "—"}</span><span class="q-text">${h.date} ・ ${esc(h.title)}(${h.ok}/${h.n})</span></div>`)
              .join("")}</div>`
          : `<p class="muted">まだ記録がありません。</p>`
      }`;
    page({ title: "学習記録", body, tab: "stats" });
  }

  // ---------- 設定 ----------
  function viewSettings() {
    current.section = null;
    const st = Store.get();
    const plan = st.plan;
    const body = `
      <div class="panel">
        <h2 class="h2 first">受験プラン</h2>
        <div class="field"><span>選択科目</span>
          <div class="chips" id="s-disc">${DISCIPLINES.map((d) => `<button data-v="${d}" class="${plan.discipline === d ? "on" : ""}">${d} ${CPA.getSection(d).ja}</button>`).join("")}</div></div>
        ${mySections()
          .map((id) => `<label class="field"><span>${id} 受験日</span><input type="date" data-exam="${id}" value="${plan.examDates[id] || ""}"></label>`)
          .join("")}
        <label class="field"><span>目標の総学習時間(時間)</span><input type="number" id="s-target" min="100" step="50" value="${plan.targetHours}"></label>
        <label class="field"><span>1日の目標(分)</span><input type="number" id="s-daily" min="10" step="10" value="${plan.dailyMin}"></label>
        <label class="check"><input type="checkbox" id="s-ja" ${st.prefs.showJa ? "checked" : ""}> 問題の和訳を最初から表示する</label>
        ${
          Speech.supported
            ? `<div class="field"><span>読み上げの速さ</span><div class="chips" id="s-rate">${[
                [0.75, "ゆっくり"],
                [0.95, "ふつう"],
                [1.15, "速め"],
              ]
                .map(([v, l]) => `<button data-v="${v}" class="${(st.prefs.speechRate || 0.95) === v ? "on" : ""}">${l}</button>`)
                .join("")}</div></div>`
            : `<p class="muted small">このブラウザは英語の読み上げに対応していません。</p>`
        }
        <label class="check"><input type="checkbox" id="s-confirm" ${st.prefs.confirmAnswer ? "checked" : ""}> 選択肢を選んでから「解答する」で確定する(誤タップ防止)</label>
        <label class="check"><input type="checkbox" id="s-qt" ${st.prefs.autoTranslate !== false ? "checked" : ""}> 英文を選択したら自動で翻訳する</label>
      </div>

      <div class="panel">
        <h2 class="h2 first">データ</h2>
        <p class="muted small">学習記録はこの端末のブラウザにだけ保存されます。機種変更の前にはバックアップを書き出してください。</p>
        <div class="btn-row">
          <button class="btn" data-act="export">バックアップを表示</button>
          <label class="btn">ファイルから読み込む<input type="file" accept="application/json,.json" id="s-import" hidden></label>
        </div>
        <div id="s-backup" hidden>
          <p class="muted small">下のテキストをコピーしてメモなどに保存してください。別の端末では、ここに貼り付けて「このテキストから読み込む」を押すと復元できます。</p>
          <textarea class="backup" id="s-text" spellcheck="false"></textarea>
          <div class="btn-row"><button class="btn primary" data-act="copy">コピー</button><button class="btn" data-act="load-text">このテキストから読み込む</button></div>
        </div>
        <button class="btn danger block" data-act="reset">すべての学習記録を消去</button>
      </div>
      <p class="muted small">本アプリは学習用の非公式教材です。特定の予備校・団体とは関係ありません。税額の基準値や試験制度は改正されるため、受験前に AICPA・NASBA・各州の公式情報で最新の内容を確認してください。</p>`;
    page({ title: "設定", back: "#/home", body, tab: null });

    $app.querySelectorAll("#s-disc button").forEach((b) => {
      b.onclick = () => {
        Store.setPlan({ discipline: b.dataset.v });
        viewSettings();
      };
    });
    $app.querySelectorAll("[data-exam]").forEach((el) => {
      el.onchange = () => {
        const dates = Object.assign({}, Store.get().plan.examDates);
        if (el.value) dates[el.dataset.exam] = el.value;
        else delete dates[el.dataset.exam];
        Store.setPlan({ examDates: dates });
      };
    });
    $app.querySelector("#s-target").onchange = (e) => Store.setPlan({ targetHours: Math.max(1, +e.target.value || 1200) });
    $app.querySelector("#s-daily").onchange = (e) => Store.setPlan({ dailyMin: Math.max(1, +e.target.value || 120) });
    $app.querySelector("#s-ja").onchange = (e) => Store.setPref("showJa", e.target.checked);
    $app.querySelectorAll("#s-rate button").forEach((b) => {
      b.onclick = () => {
        Store.setPref("speechRate", +b.dataset.v);
        $app.querySelectorAll("#s-rate button").forEach((x) => x.classList.toggle("on", x === b));
        Speech.speak("Relevance and faithful representation.");
      };
    });
    $app.querySelector("#s-confirm").onchange = (e) => Store.setPref("confirmAnswer", e.target.checked);
    $app.querySelector("#s-qt").onchange = (e) => Store.setPref("autoTranslate", e.target.checked);
    const $box = $app.querySelector("#s-backup");
    const $text = $app.querySelector("#s-text");
    const load = (text) => {
      try {
        Store.importJson(text);
        toast("学習記録を読み込みました");
        viewSettings();
      } catch (err) {
        toast("読み込めませんでした。バックアップのテキストをそのまま貼り付けてください");
      }
    };
    $app.querySelector("[data-act=export]").onclick = () => {
      $text.value = Store.exportJson();
      $box.hidden = false;
      $text.focus();
      $text.select();
    };
    $app.querySelector("[data-act=copy]").onclick = () => {
      const fallback = () => {
        $text.focus();
        $text.select();
        toast("選択しました。コピーしてください");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText($text.value).then(() => toast("コピーしました"), fallback);
      else fallback();
    };
    $app.querySelector("[data-act=load-text]").onclick = () => {
      if ($text.value.trim()) load($text.value);
    };
    $app.querySelector("#s-import").onchange = (e) => {
      const f = e.target.files[0];
      if (f) f.text().then(load);
    };
    $app.querySelector("[data-act=reset]").onclick = () => {
      ask("すべての学習記録を消去します。元に戻せません。", "消去する", true).then((ok) => {
        if (!ok) return;
        Store.reset();
        toast("学習記録を消去しました");
        go("#/home");
      });
    };
  }

  // ---------- 試験ガイド ----------
  function viewGuide() {
    current.section = null;
    const row = (s) => `<tr><td>${tag(s.id)}</td><td>${s.ja}</td><td>${s.exam.hours}h</td><td>${s.exam.mcq}</td><td>${s.exam.tbs}</td><td>${s.exam.weight}</td></tr>`;
    const body = `
      <article class="note">
        <h3>試験の構成(CPA Evolution・2024年〜)</h3>
        <p>必須科目(Core)3科目+選択科目(Discipline)1科目の、計4科目に合格する必要があります。</p>
        <table class="tbl"><thead><tr><th></th><th>科目</th><th>時間</th><th>MC</th><th>TBS</th><th>配点</th></tr></thead>
        <tbody>${CPA.sections.map(row).join("")}</tbody></table>
        <ul>
          <li>スコアは 0〜99 で、<b>75以上で合格</b>。正答率と点数は1対1では対応しません(本アプリの推定スコアは目安)。</li>
          <li>1科目に合格してから残りの科目に合格するまでの<b>有効期間</b>は州によって異なります(18か月または30か月など)。</li>
          <li>日本でも受験できます(Prometric テストセンター)。出願・受験資格は州ごとに要件が違います。</li>
        </ul>

        <p><a href="#/eligibility"><b>受験資格チェック</b></a>で、学歴と単位から出願できる州の目安と次にやることを確認できます。</p>

        <h3>選択科目の選び方</h3>
        <ul>
          <li><b>BAR</b>:FARの延長。財務分析・管理会計も含む。会計の得意な人、FARと続けて学習したい人向け。</li>
          <li><b>ISC</b>:IT統制とSOC業務。AUDと相性がよい。IT監査・内部統制に関わる人向け。</li>
          <li><b>TCP</b>:REGの税法の発展。税務の仕事をする人、REGと続けて学習したい人向け。</li>
        </ul>

        <h3>おすすめの学習の流れ</h3>
        <div class="pt"><ol>
          <li><b>講義ノート</b>で論点の全体像をつかむ(日本語で理解 → 英語のキーワードを確認)</li>
          <li><b>単語カード</b>で英語の用語を固める。英文の問題をすばやく読むための土台</li>
          <li><b>MC演習</b>は英語の問題文を先に読み、わからないときだけ和訳を見る。解説で「なぜ他の選択肢が誤りか」まで確認</li>
          <li><b>TBS</b>で計算と判断を表に落とし込む練習</li>
          <li>章が一通り終わったら<b>模擬試験</b>で時間配分を確認し、<b>苦手復習</b>で弱点をつぶす</li>
        </ol></div>

        <h3>学習時間の目安</h3>
        <p>会計の予備知識や英語力によって大きく変わりますが、4科目合計で <b>1,000〜1,500時間</b> 程度がよく目安にされます。FARは範囲が最も広いため、最初に着手して時間を多めに配分するのが一般的です。目標時間は設定で変更できます。</p>

        <h3 id="supplement">演習量の補い方</h3>
        <p>本番レベルの演習量(予備校の問題集は全科目で数千問)をこのアプリだけでそろえるのは難しいため、次のように使い分けます。</p>
        <table class="tbl"><thead><tr><th>教材</th><th>役割</th><th>使い方</th></tr></thead><tbody>
          <tr><td><b>予備校の問題集</b><br><small class="muted">アビタスなど</small></td><td>演習量の中心</td><td>本番レベルの問題を繰り返し解く。計算は手を動かして解く</td></tr>
          <tr><td><b>AICPA公式サンプルテスト</b><br><small class="muted">無料・全6科目</small></td><td>本番の画面操作と時間配分の確認</td><td>本番と同じ試験ソフトの短縮版(最大2時間)。各科目1回分しかないので、受験の1〜2か月前に1回解く</td></tr>
          <tr><td><b>このアプリ</b></td><td>理解と復習</td><td>問題集で間違えた論点を講義ノートと「詳しく・日本では?」で確認。スキマ時間に単語カード・リスニング・苦手復習。章が終わったら本番形式の模擬試験</td></tr>
          <tr><td><b>無料の問題集</b><br><small class="muted">FreeFellow など</small></td><td>予備校に入る前の補助</td><td>質は未確認。内容が古い可能性があるため、利用条件と改訂時期を確認してから使う</td></tr>
        </tbody></table>
        <p><a href="https://www.aicpa-cima.com/resources/article/get-familiar-with-the-cpa-exam-by-practicing-with-our-sample-tests" target="_blank" rel="noopener">AICPA Sample Tests(公式・英語)</a> ・ <a href="#/compare">予備校の比較</a></p>
        <p class="muted small">試験の形式(問題数・時間)は改訂されることがあります。学習計画を立てる前に、AICPA公式の Blueprint で確認してください。</p>

        <p class="muted small">本アプリの問題・解説はオリジナルの学習用教材で、AICPA の公式問題や特定の予備校の教材ではありません。税額の基準値などは毎年改正されるため、最新の公式情報を確認してください。</p>
      </article>`;
    page({ title: "試験ガイド", back: "#/home", body, tab: "home" });
  }

  // ---------- 受験資格チェック ----------
  const EDU = [
    ["bachelor", "4年制大学卒(学士)"],
    ["master", "大学院修了(修士)"],
    ["senior", "4年制大学に在学中(最終学年)"],
    ["junior", "4年制大学に在学中(1〜3年)"],
    ["associate", "短大・高専卒"],
    ["vocational", "専門学校卒"],
    ["highschool", "高校卒"],
  ];

  function eligInput() {
    return Object.assign({ edu: "bachelor", total: 124, acct: 0, biz: 0, exp: 0, goal: "license" }, Store.get().prefs.elig || {});
  }

  function judgeReq(req, me, isExam) {
    const hasBachelor = me.edu === "bachelor" || me.edu === "master";
    const miss = [];
    let pending = null;
    if (req.degree === "master" && me.edu !== "master") miss.push("修士号");
    else if (req.degree === "bachelor" && !hasBachelor) {
      if (isExam && req.seniorOk && me.edu === "senior") pending = "卒業見込みで出願";
      else if (me.edu === "senior" || me.edu === "junior") miss.push("学士号(卒業後に可)");
      else miss.push("学士号");
    }
    const gap = (need, have, label) => {
      if (need && have < need) miss.push(`${label}あと${need - have}`);
    };
    gap(req.total, me.total, "総単位");
    gap(req.acct, me.acct, "会計単位");
    gap(req.biz, me.biz, "ビジネス単位");
    if (!isExam && req.exp && me.exp < req.exp) miss.push(`実務経験あと${+(req.exp - me.exp).toFixed(1)}年`);
    return { ok: !miss.length, pending, miss };
  }

  function judgeState(st, me) {
    const exam = judgeReq(st.exam, me, true);
    const lic = st.licenses
      .map((p) => Object.assign({ path: p }, judgeReq(p, me, false)))
      .sort((a, b) => a.miss.length - b.miss.length)[0];
    return { st, exam, lic };
  }

  function viewEligibility() {
    current.section = null;
    const me = eligInput();
    const num = (id, label, val, hint) =>
      `<label class="field"><span>${label}</span><input type="number" inputmode="numeric" min="0" step="1" id="${id}" value="${val}">${hint ? `<small class="muted">${hint}</small>` : ""}</label>`;
    const body = `
      <div class="panel">
        <p class="muted small" style="margin-top:0">学歴と単位を入れると、日本からの出願で選ばれやすい5つの州について、受験資格とライセンス要件を満たしているかの<b>目安</b>を表示します。</p>
        <label class="field"><span>最終学歴</span><select id="el-edu">${EDU.map(([v, l]) => `<option value="${v}" ${me.edu === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
        <div id="el-warn"></div>
        ${num("el-total", "取得済みの総単位数", me.total, "日本の大学の単位をそのまま入力(目安としてほぼ同数で換算)。大学院の単位も含めます")}
        ${num("el-acct", "うち会計の単位", me.acct, "簿記・財務会計・管理会計・原価計算・監査・税務など")}
        ${num("el-biz", "うちビジネスの単位", me.biz, "経済・経営・ファイナンス・商法/会社法・統計・情報など(会計は含めない)")}
        <label class="field"><span>会計・監査・税務などの実務経験</span><select id="el-exp">${[
          [0, "なし"],
          [0.5, "1年未満"],
          [1, "1年以上2年未満"],
          [2, "2年以上"],
        ]
          .map(([v, l]) => `<option value="${v}" ${+me.exp === v ? "selected" : ""}>${l}</option>`)
          .join("")}</select><small class="muted">ライセンスの実務経験は、原則としてCPA(または州が認める者)の確認が必要です</small></label>
      </div>
      <div id="el-result"></div>`;
    page({ title: "受験資格チェック", back: "#/home", body, tab: "home" });

    const NON_DEGREE = { vocational: "専門学校", highschool: "高校" };
    const syncLabels = () => {
      const edu = $app.querySelector("#el-edu").value;
      const label = $app.querySelector("#el-total").closest(".field").querySelector("span");
      label.textContent = NON_DEGREE[edu] ? "大学・短大などで取得した単位(専門学校の単位は含めない)" : "取得済みの総単位数";
      $app.querySelector("#el-warn").innerHTML =
        edu === "vocational"
          ? `<div class="warn-box"><b>専門学校の単位は、原則として数えられません</b>
             学歴評価機関は、学位を出せる大学などの単位を米国の大学単位に換算します。専門学校の単位は評価の対象外とされることが多いため、
             放送大学・通信制大学・短大などで取った単位だけを入力してください(まだなければ 0)。</div>`
          : "";
    };
    const draw = () => {
      syncLabels();
      const cur = {
        edu: $app.querySelector("#el-edu").value,
        total: Math.max(0, parseInt($app.querySelector("#el-total").value, 10) || 0),
        acct: Math.max(0, parseInt($app.querySelector("#el-acct").value, 10) || 0),
        biz: Math.max(0, parseInt($app.querySelector("#el-biz").value, 10) || 0),
        exp: +$app.querySelector("#el-exp").value,
      };
      Store.setPref("elig", cur);
      const res = ELIGIBILITY.states
        .map((st) => judgeState(st, cur))
        .sort((a, b) => (a.exam.ok ? 0 : 1) - (b.exam.ok ? 0 : 1) || a.exam.miss.length - b.exam.miss.length || a.lic.miss.length - b.lic.miss.length);
      const anyExam = res.some((r) => r.exam.ok);
      const mark = (j) => (j.ok ? (j.pending ? `<span class="jm warn">△ ${j.pending}</span>` : `<span class="jm ok">◯ 満たす見込み</span>`) : `<span class="jm ng">✕ ${j.miss.join("・")}</span>`);
      const steps = [];
      steps.push(`<b>学歴評価を申し込む</b>:日本の大学の単位がどう認定されるかは評価機関(NIES・FACS など)の判定で決まります。この判定の結果がすべての出発点です(目安1.5〜3か月)。`);
      if (!anyExam) {
        const best = res[0];
        const noDegree = cur.edu === "vocational" || cur.edu === "highschool" || cur.edu === "associate";
        steps.push(
          noDegree
            ? `<b>学士号を取る</b>:ほとんどの州で、受験かライセンスのどちらか(多くは両方)に学士号が必要です。働きながらなら、次のような方法があります。
               <ul>
                 <li><b>通信制大学</b>(放送大学など):1年次入学なら卒業まで4年が目安。会計・経済・経営の科目を選べば、学位と同時に会計/ビジネス単位も貯められます。</li>
                 <li><b>3年次編入</b>:${cur.edu === "vocational" ? "修業年限2年以上などの要件を満たす専門学校を修了して「専門士」の称号がある場合、" : "短大・高専卒の場合、"}大学の3年次に編入できることがあり、卒業までの期間を約2年に短縮できます(受け入れは大学ごとに異なります)。</li>
                 <li><b>学位授与機構</b>:大学改革支援・学位授与機構の制度で、短大・高専など(要件を満たす専門学校を含む場合あり)の修了者が、単位を積み上げて学士号を取得する方法もあります。</li>
               </ul>どの方法でも、履修する前に、その科目が会計単位・ビジネス単位として認定されそうかを確認しておくと無駄がありません。`
            : best.exam.miss.some((m) => m.startsWith("学士"))
            ? `<b>学位を確保する</b>:多くの州は学士号が必要です。在学中なら卒業見込みで出願できる州(グアムなど)を検討します。`
            : `<b>不足単位を取る</b>:${esc(best.st.name)}なら ${esc(best.exam.miss.join("・"))} です。予備校の単位取得プログラムや放送大学などの科目履修が一般的です。履修前に、その科目が会計/ビジネス単位として認定されるかを確認しましょう。`
        );
      }
      steps.push(`<b>出願州を決めて出願</b>:受験資格を満たす州に出願し、NTS(受験票)を受け取ったら、日本のプロメトリック・テストセンターで予約します。`);
      steps.push(`<b>30か月以内に4科目合格</b>:多くの州で、最初の合格から30か月以内に残りの科目に合格する必要があります。`);
      steps.push(`<b>ライセンス</b>:合格後、実務経験・倫理試験などの要件を満たす州でライセンスを申請します。受験した州と別の州で申請することもできます(要件は申請先の州のもの)。`);

      $app.querySelector("#el-result").innerHTML = `
        <h2 class="h2">判定結果<small>${ELIGIBILITY.checkedAt}時点の情報</small></h2>
        <div class="elig-list">
          ${res
            .map(
              ({ st, exam, lic }) => `
            <details class="elig ${exam.ok ? "ok" : ""}">
              <summary>
                <div class="elig-head"><b>${st.name}</b><span class="muted small">${st.en}</span></div>
                <div class="elig-row"><span class="elig-k">受験</span>${mark(exam)}</div>
                <div class="elig-row"><span class="elig-k">ライセンス</span>${mark(lic)}<span class="muted small">(${esc(lic.path.label)})</span></div>
              </summary>
              <div class="elig-body">
                <p><b>受験要件</b>:${esc(st.examText)}${st.exam.acctNote ? `<br><span class="muted small">※会計単位は${esc(st.exam.acctNote)}が必要です。この判定では12単位以上で仮に判定しています</span>` : ""}</p>
                <p><b>ライセンスのルート</b></p>
                <ul>${st.licenses.map((p) => `<li>${esc(p.label)}${p.note ? `<span class="muted small">(${esc(p.note)})</span>` : ""}</li>`).join("")}</ul>
                <p><b>注意点</b></p>
                <ul>${st.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
                <p class="small">情報源:${st.sources.map((x) => `<a href="${x.url}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join(" / ")}</p>
              </div>
            </details>`
            )
            .join("")}
        </div>
        <h2 class="h2">次にやること</h2>
        <ol class="steps-list">${steps.map((x) => `<li>${x}</li>`).join("")}</ol>
        <a class="link-card" href="#/compare"><b>講座の料金比較</b><span>単位取得が含まれる講座を、給付金・キャッシュバック込みで比べる ›</span></a>
        <h2 class="h2">共通のポイント</h2>
        <div class="panel">${ELIGIBILITY.common.map((c) => `<p><b>${esc(c.label)}</b>:${esc(c.text)}</p>`).join("")}</div>
        <p class="muted small">この判定は${ELIGIBILITY.checkedAt}時点の公開情報(予備校・解説サイトなどの二次情報を含む)にもとづく目安です。各州の要件は改正が続いており、情報源によって食い違う点は厳しい側で判定しています。出願前に必ず各州の Board of Accountancy と学歴評価機関で最新の要件を確認してください。<br>
        参考:${ELIGIBILITY.generalSources.map((x) => `<a href="${x.url}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join(" / ")}</p>`;
    };
    $app.querySelectorAll("#el-edu, #el-total, #el-acct, #el-biz, #el-exp").forEach((el) => {
      el.oninput = draw;
      el.onchange = draw;
    });
    draw();
  }

  // ---------- 講座の料金比較 ----------
  const yen = (n) => Math.round(n).toLocaleString("ja-JP") + "円";

  function comparePrefs() {
    const saved = Store.get().prefs.compare || {};
    const plans = COURSE_PRESETS.plans.map((p) => {
      const ov = Object.assign({}, (saved.plans || {})[p.id] || {});
      delete ov.cashback; // 旧版の「条件付き還元」1項目の編集値は使わない
      return Object.assign({}, p, ov);
    });
    // 旧版の「条件付き還元を含める」チェックは、3つの還元すべてに引き継ぐ
    const legacy = !!saved.cashback;
    const flag = (k) => (saved[k] === undefined ? legacy : !!saved[k]);
    return {
      needCredits: saved.needCredits !== false,
      subsidy: !!saved.subsidy,
      pass: flag("pass"),
      career: flag("career"),
      other: flag("other"),
      extra: saved.extra || 0,
      checked: saved.checked || {},
      plans,
    };
  }

  function viewCompare() {
    current.section = null;
    const pr = comparePrefs();
    const cb = COURSE_PRESETS.cashback;
    const elig = Store.get().prefs.elig;
    const noDegree = elig && ["vocational", "highschool", "associate", "junior"].includes(elig.edu);
    const chk = (id, on, label) => `<label class="check"><input type="checkbox" id="${id}" ${on ? "checked" : ""}> ${label}</label>`;
    const field = (p, k, label) =>
      `<label class="field"><span>${label}</span><input type="number" inputmode="numeric" min="0" step="10" data-plan="${p.id}" data-k="${k}" value="${p[k]}"></label>`;
    const body = `
      <div class="panel">
        <p class="muted small" style="margin-top:0">予備校の受講料を、あなたの条件で比べます。金額は${COURSE_PRESETS.updatedAt}時点の案内をもとにした初期値で、キャンペーンに合わせて編集できます。</p>
        ${chk("cp-credits", pr.needCredits, "会計・ビジネス単位を取る必要がある")}
        ${chk("cp-subsidy", pr.subsidy, "教育訓練給付金を受け取れる(雇用保険の加入期間などの要件あり)")}
        <div class="cp-group">条件付きの還元(受け取れる見込みのものだけチェック)</div>
        ${chk("cp-pass", pr.pass, "合格お祝い金:期限内(入会から約2年)に4科目すべて合格できる")}
        ${chk("cp-career", pr.career, "キャリア支援金:予備校の転職支援(ABcareer)を通じて転職する")}
        ${chk("cp-other", pr.other, "その他の補助(CPA会計学院の「最大46%補助」など、内訳不明のもの)")}
        <label class="field" style="margin-top:10px"><span>どの講座でも共通でかかる費用(任意)</span><input type="number" inputmode="numeric" min="0" step="1000" id="cp-extra" value="${pr.extra}"><small class="muted">受験料・日本受験の追加料金・学歴評価など。4科目で数十万円規模になります(州と為替で変わります)</small></label>
      </div>
      <div id="cp-result"></div>

      <h2 class="h2">${cb.title}</h2>
      <div class="table-wrap"><table class="tbl cp-cond">
        <thead><tr><th></th><th>合格お祝い金</th><th>キャリア支援金</th></tr></thead>
        <tbody>${cb.rows.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody>
      </table></div>
      <p class="muted small">${esc(cb.note)}</p>
      ${
        noDegree
          ? `<div class="warn-box"><b>あなたの場合(受験資格チェックの入力より)</b>
              合格お祝い金は、受け取るのが難しい可能性が高いです。期限は入会から約2年ですが、先に学士号(州によっては単位)をそろえる必要があり、学位の取得に2年以上かかると受験を始める前に期限が来てしまいます。キャリア支援金は試験に合格しなくても対象になりえますが、ABcareerで転職する場合に限られます。</div>`
          : `<p class="muted small">受験資格チェックに学歴を入力すると、ここにあなたの場合の注意点を表示します。</p>`
      }
      <h2 class="h2">ガイダンス・個別相談で確認すること</h2>
      <div class="panel cp-check">
        ${cb.checklist.map((t, i) => `<label class="check"><input type="checkbox" data-ck="${i}" ${pr.checked[i] ? "checked" : ""}> ${esc(t)}</label>`).join("")}
      </div>
      <p class="small">情報源:${cb.sources.map((x) => `<a href="${x.url}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join(" / ")}</p>

      <h2 class="h2">講座の金額を編集</h2>
      <div class="cp-edit">
        ${pr.plans
          .map(
            (p) => `<details class="panel det"><summary><b>${esc(p.school)}</b> ${esc(p.name)}</summary>
              ${field(p, "price", "受講料(最初に払う額)")}
              ${field(p, "subsidy", "教育訓練給付金の目安")}
              ${field(p, "pass", "合格お祝い金")}
              ${field(p, "career", "キャリア支援金")}
              ${field(p, "other", "その他の条件付き補助")}
              <ul class="small muted">${p.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
            </details>`
          )
          .join("")}
        <button class="btn block" data-act="cp-reset">金額を初期値に戻す</button>
      </div>
      <p class="muted small">金額は各校の案内(${COURSE_PRESETS.updatedAt}時点)と公開情報をもとにした目安です。キャンペーンの条件・給付金の対象かどうか・単位取得の有無は、申し込む前に各校で必ず確認してください。教育訓練給付金は受講修了後に支給され、前回の受給から3年以上空いていることなどの要件があります。</p>`;
    page({ title: "講座の料金比較", back: "#/home", body, tab: "home" });

    const save = (patch) => {
      const cur = Store.get().prefs.compare || {};
      Store.setPref("compare", Object.assign({}, cur, patch));
    };
    const draw = () => {
      const c = comparePrefs();
      const rows = c.plans.map((p) => {
        const afterSubsidy = p.price - (c.subsidy ? p.subsidy : 0);
        const parts = [
          [c.pass, p.pass, "合格お祝い金"],
          [c.career, p.career, "キャリア支援金"],
          [c.other, p.other, "その他の補助"],
        ].filter(([on, v]) => on && v);
        const back = parts.reduce((a, [, v]) => a + v, 0);
        const final = afterSubsidy - back + c.extra;
        const warn = [];
        if (c.needCredits && p.credits === false) warn.push("単位取得が含まれません(別途必要)");
        if (c.needCredits && p.credits === null) warn.push("単位取得が含まれるか要確認");
        return { p, upfront: p.price + c.extra, afterSubsidy: afterSubsidy + c.extra, final, parts, warn, usable: !(c.needCredits && p.credits === false) };
      });
      const usable = rows.filter((r) => r.usable);
      const best = usable.length ? usable.reduce((a, b) => (b.final < a.final ? b : a)) : null;
      const sorted = rows.slice().sort((a, b) => b.usable - a.usable || a.final - b.final);
      $app.querySelector("#cp-result").innerHTML = `
        <h2 class="h2">比較結果<small>安い順</small></h2>
        <div class="cp-list">
          ${sorted
            .map(
              (r) => `<div class="cp-card ${r === best ? "best" : ""} ${r.usable ? "" : "dim"}">
                <div class="cp-head"><div><b>${esc(r.p.school)}</b><span class="muted small"> ${esc(r.p.name)}</span></div>${r === best ? `<span class="pill">最安</span>` : ""}</div>
                <div class="cp-final">${yen(r.final)}<small> 実質負担</small></div>
                <table class="cp-break">
                  <tr><td>最初に払う額</td><td>${yen(r.upfront)}</td></tr>
                  ${c.subsidy ? `<tr><td>給付金が戻った後</td><td>${yen(r.afterSubsidy)}</td></tr>` : ""}
                  ${r.parts.map(([, v, label]) => `<tr><td>− ${label}</td><td>${yen(v)}</td></tr>`).join("")}
                </table>
                ${r.warn.length ? `<ul class="cp-warn">${r.warn.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
              </div>`
            )
            .join("")}
        </div>
        <p class="muted small">${
          c.pass || c.career || c.other
            ? "条件付きの還元は、条件を満たしたときだけ受け取れます。満たせなかった場合の負担も確認しておきましょう。"
            : "条件付きの還元は含めていません(確実に払う額で比較しています)。受け取れる見込みのものにチェックを入れると反映されます。"
        }</p>`;
    };

    [["cp-credits", "needCredits"], ["cp-subsidy", "subsidy"], ["cp-pass", "pass"], ["cp-career", "career"], ["cp-other", "other"]].forEach(([id, k]) => {
      $app.querySelector("#" + id).onchange = (e) => (save({ [k]: e.target.checked }), draw());
    });
    $app.querySelector("#cp-extra").oninput = (e) => (save({ extra: Math.max(0, +e.target.value || 0) }), draw());
    $app.querySelectorAll("[data-ck]").forEach((el) => {
      el.onchange = () => {
        const checked = Object.assign({}, comparePrefs().checked, { [el.dataset.ck]: el.checked });
        save({ checked });
      };
    });
    $app.querySelectorAll("[data-plan]").forEach((el) => {
      el.oninput = () => {
        const cur = Store.get().prefs.compare || {};
        const plans = Object.assign({}, cur.plans || {});
        plans[el.dataset.plan] = Object.assign({}, plans[el.dataset.plan] || {}, { [el.dataset.k]: Math.max(0, +el.value || 0) });
        save({ plans });
        draw();
      };
    });
    $app.querySelector("[data-act=cp-reset]").onclick = () => {
      save({ plans: {} });
      viewCompare();
      toast("金額を初期値に戻しました");
    };
    draw();
  }

  // ---------- ルーティング ----------
  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const [a, b, c, d] = parts;
    // 模擬試験中に他の画面へ移動したら、セッションを破棄する(タイマー不整合を防ぐ)
    if (a !== "quiz" && session && session.kind === "mock" && !session.finished && a) session = null;
    switch (a) {
      case undefined:
      case "home":
        return viewHome();
      case "learn":
        return viewLearn();
      case "sec":
        return viewSection(b);
      case "ch":
        return viewChapter(b, c);
      case "practice":
        return viewPractice();
      case "review":
        return viewReview();
      case "quiz":
        return viewQuiz();
      case "mock":
        return viewMockSetup(b);
      case "tbs":
        return viewTbs(b, false);
      case "cards":
        if (b === "run") {
          startCardRun(c, d);
          return viewCardRun();
        }
        return viewCards();
      case "stats":
        return viewStats();
      case "settings":
        return viewSettings();
      case "guide":
        return viewGuide();
      case "eligibility":
        return viewEligibility();
      case "compare":
        return viewCompare();
      default:
        return viewHome();
    }
  }

  // ---------- 学習時間の記録・模試のタイマー・キーボード操作 ----------
  function tick() {
    const active = document.visibilityState === "visible" && Date.now() - lastInput < 3 * 60 * 1000;
    if (active && current.section) Store.addStudy(current.section, 5);
    if (session && session.kind === "mock" && !session.finished && location.hash === "#/quiz") {
      const remain = session.limit - (Date.now() - session.start) / 1000;
      const el = document.getElementById("clock");
      if (remain <= 0) finishMock();
      else if (el) {
        el.textContent = fmtClock(remain);
        el.classList.toggle("warn", remain < 300);
      }
    }
  }

  function onKey(e) {
    if (location.hash !== "#/quiz" || !session || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const k = e.key.toUpperCase();
    const idx = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "ABCD".indexOf(k);
    if (idx >= 0) {
      const btn = $app.querySelectorAll(".choice")[idx];
      if (btn && btn.getAttribute("aria-disabled") !== "true") btn.click();
    } else if (e.key === "Enter" || e.key === "ArrowRight") {
      const nx = $app.querySelector("[data-act=next], [data-act=commit]:not([disabled])");
      if (nx) nx.click();
    }
  }

  function init() {
    ["pointerdown", "keydown", "scroll", "input"].forEach((ev) => window.addEventListener(ev, () => (lastInput = Date.now()), { passive: true }));
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", route);
    timerId = setInterval(tick, 5000);
    // 模試の残り時間表示は1秒ごとに更新する
    setInterval(() => {
      if (session && session.kind === "mock" && !session.finished && location.hash === "#/quiz") {
        const el = document.getElementById("clock");
        const remain = session.limit - (Date.now() - session.start) / 1000;
        if (el && remain > 0) el.textContent = fmtClock(remain);
      }
    }, 1000);
    route();
  }

  return { init, explainBtn };
})();

App.init();

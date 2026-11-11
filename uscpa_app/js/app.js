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
  // カードの「詳しく・日本では?」:説明ファイル(CPA_EXPLAIN)か、カード自体に持たせた説明(xp)を使う
  function explainFor(cardId) {
    if (typeof CPA_EXPLAIN !== "undefined" && CPA_EXPLAIN[cardId]) return CPA_EXPLAIN[cardId];
    const c = CPA.allCards().find((x) => x.id === cardId);
    return (c && c.xp) || null;
  }

  function explainBtn(cardId) {
    if (!explainFor(cardId)) return "";
    return `<span class="xp-btn" role="button" tabindex="0" data-explain="${cardId}">詳しく・日本では?</span>`;
  }

  function showExplain(cardId) {
    const c = CPA.allCards().find((x) => x.id === cardId);
    const x = c && explainFor(cardId);
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

  // いま力を入れる科目:受験日が近い科目 → 最後に開いた章の科目 → FAR
  function focusSection() {
    const st = Store.get();
    const up = mySections()
      .map((id) => ({ id, date: st.plan.examDates[id] }))
      .filter((x) => x.date && daysUntil(x.date) >= 0)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (up.length) return up[0].id;
    const last = st.last && CPA.getChapter(st.last.chapter);
    return last ? last.section : mySections()[0];
  }

  // 今日の単語カード:期日が来た復習カード + 新しいカード(1日 prefs.newPerDay 枚まで)。
  // 新しいカードは力を入れる科目の章の順に出す
  function todayCards(list) {
    const review = list.filter((c) => Store.isCardReviewDue(c.id));
    const per = Store.get().prefs.newPerDay ?? 20;
    const left = Math.max(0, per - Store.newCardsToday());
    const f = focusSection();
    const unseen = list.filter((c) => !Store.cardRec(c.id));
    const fresh = unseen.filter((c) => c.section === f).concat(unseen.filter((c) => c.section !== f)).slice(0, left);
    return { review, fresh, unseen: unseen.length };
  }

  // ひとこと5分:力を入れる科目の「いまの章」から、未回答・不正解の問題を5問
  function startQuick() {
    const st = Store.get();
    const last = st.last && CPA.getChapter(st.last.chapter);
    const sec = CPA.getSection(focusSection());
    const ch = last && last.section === sec.id ? last : sec.chapters.find((c) => c.mcq.some((q) => !(Store.qRec(q.id) || {}).n)) || sec.chapters[0];
    const rank = (q) => {
      const r = Store.qRec(q.id);
      return !r || !r.n ? 0 : r.last === false ? 1 : 2;
    };
    let qs = shuffle(ch.mcq).sort((a, b) => rank(a) - rank(b));
    // 章の問題がほぼ解き終わっていれば、科目全体から補う
    if (rank(qs[Math.min(4, qs.length - 1)]) === 2) qs = shuffle(sec.chapters.flatMap((c) => c.mcq)).sort((a, b) => rank(a) - rank(b));
    startPractice({ title: "5分だけ演習(" + sec.id + ")", qs: qs.slice(0, 5), back: "#/home" });
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
      <main class="main view-${tab || "solo"}">${body}</main>
      ${
        tab === null
          ? ""
          : `<nav class="tabs"><span class="side-logo logo">US<b>CPA</b></span>${tabs
              .map(([id, label, d]) => `<a href="#/${id}" class="${tab === id ? "on" : ""}"><svg viewBox="0 0 24 24"><path d="${d}"/></svg><span>${label}</span></a>`)
              .join("")}</nav>`
      }`;
    $app.classList.toggle("no-tabs", tab === null);
    if (typeof Speech !== "undefined" && Speech.refresh) Speech.refresh();
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
    const tc = todayCards(CPA.allCards().filter((c) => mySections().includes(c.section)));
    const lastDay = Store.lastStudyDate();
    const gap = lastDay ? daysUntil(Store.today()) - daysUntil(lastDay) : null;
    const last = st.last && CPA.getChapter(st.last.chapter);

    const countdown = upcoming.length
      ? `<div class="hero">
          <div class="hero-label">${tag(upcoming[0].id)} 受験日まで</div>
          <div class="hero-num">${daysUntil(upcoming[0].date)}<small>日</small></div>
          <div class="hero-sub">${upcoming[0].date}${upcoming.length > 1 ? ` ・ 次は ${upcoming[1].id}(${daysUntil(upcoming[1].date)}日後)` : ""}</div>
        </div>`
      : `<a class="hero hero-empty" href="#/planner"><div class="hero-label">受験日を決めよう</div><div class="hero-sub">単位・手続き・勉強時間から、いつ受けられるかを逆算します ›</div></a>`;

    let pace = "";
    if (upcoming.length) {
      const sec = CPA.getSection(upcoming[0].id);
      const remain = 1 - sectionProgress(sec);
      const days = Math.max(1, daysUntil(upcoming[0].date));
      const leftCh = remain * sec.chapters.length;
      pace = `<p class="muted small">${sec.id} の残りは約 ${leftCh.toFixed(1)} 章分。受験日の2週間前に終えて総復習に回すなら、週 ${(leftCh / Math.max(1, (days - 14) / 7)).toFixed(1)} 章のペースが目安です。</p>`;
    }

    const body = `
      <div class="home-top">
      ${countdown}
      <div class="stat-row">
        <div class="stat"><div class="stat-num">${fmtMin(todaySec)}<small>/${plan.dailyMin}分</small></div><div class="stat-label">今日の学習</div>${bar(todaySec / 60 / plan.dailyMin)}</div>
        <div class="stat"><div class="stat-num">${Store.streak()}<small>日</small></div><div class="stat-label">連続学習</div></div>
        <div class="stat"><div class="stat-num">${fmtHours(totalSec)}<small>/${plan.targetHours}h</small></div><div class="stat-label">累計時間</div>${bar(totalSec / 3600 / plan.targetHours)}</div>
      </div>
      </div>
      ${pace}

      <a class="quick ${gap === null || gap >= 3 ? "back" : ""}" href="#/quick">
        <span class="quick-text">${
          gap === null
            ? "<b>まずは5分だけ</b><small>" + focusSection() + "の問題を5問。1問ずつ解説つき</small>"
            : gap >= 3
              ? "<b>おかえりなさい(" + gap + "日ぶり)</b><small>まずは5問だけ。続きの章から出します</small>"
              : "<b>5分だけやる</b><small>" + focusSection() + "の未回答・不正解から5問</small>"
        }</span><span class="quick-go">はじめる</span></a>

      ${
        typeof Backup !== "undefined" && Backup.fileDue()
          ? `<div class="nudge"><span>📦 記録はこの端末にしかありません。1週間に1回、ファイルに保存しておくと安心です</span><button class="btn small" data-act="home-save">保存</button></div>`
          : ""
      }
      ${
        typeof Backup !== "undefined" && !Backup.info().cloud && !Backup.info().gh && !Store.get().prefs.hideSyncNudge
          ? `<div class="nudge"><a href="#/settings/sync" style="flex:1;color:inherit;text-decoration:none">🔄 PCとスマホで記録を自動同期する(設定 ›)</a><button class="btn small" data-act="hide-sync">あとで</button></div>`
          : ""
      }
      ${
        typeof Backup !== "undefined" && Backup.info().cloudNewer
          ? `<a class="nudge" href="#/settings"><span>☁ 別の端末で勉強した新しい記録があります。設定画面で読み込めます</span></a>`
          : ""
      }

      <h2 class="h2">今日やること</h2>
      <div class="actions">
        ${resumeCard()}
        ${
          last
            ? `<a class="action" href="#/ch/${last.id}/${st.last.tab || "note"}"><span class="ai">▶</span><span><b>続きから</b><small>${last.section} ${esc(last.title)}</small></span></a>`
            : `<a class="action" href="#/ch/FAR-01/note"><span class="ai">▶</span><span><b>まずはFARから始める</b><small>概念フレームワークと財務諸表</small></span></a>`
        }
        <a class="action" href="#/cards/run/due"><span class="ai">🗂</span><span><b>単語カード</b><small>${cardsLine(tc)}</small></span></a>
        <a class="action ${weakCount ? "" : "dim"}" href="${weakCount ? "#/review" : "#/practice"}"><span class="ai">↻</span><span><b>苦手復習</b><small>${weakCount ? weakCount + " 問(不正解・要復習)" : "まだありません"}</small></span></a>
        <a class="action" href="#/mock"><span class="ai">⏱</span><span><b>模擬試験</b><small>本番形式で実力チェック</small></span></a>
        <a class="action" href="#/listen"><span class="ai">🎧</span><span><b>聞き流し</b><small>通勤・ジムで単語を音声で</small></span></a>
        <a class="action" href="#/analysis"><span class="ai">📈</span><span><b>実力分析</b><small>合格の目安と間違いの傾向</small></span></a>
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
      <div class="link-grid">
      <a class="link-card" href="#/planner"><b>受験日プランナー</b><span>単位・手続き・勉強時間から受験日を逆算。希望日に間に合う締切もわかる ›</span></a>
      <a class="link-card" href="#/eligibility"><b>受験資格チェック</b><span>学歴と単位から、出願できる州と次にやることを判定 ›</span></a>
      <a class="link-card" href="#/compare"><b>講座の料金比較</b><span>アビタス・CPA会計学院の受講料を、給付金・キャッシュバック込みで比較 ›</span></a>
      <a class="link-card" href="#/guide"><b>USCPA試験ガイド</b><span>試験制度・科目の選び方・おすすめの学習の流れ ›</span></a>
      </div>`;
    page({ title: "ホーム", body, tab: "home" });
    const hn = $app.querySelector("[data-act=hide-sync]");
    if (hn)
      hn.onclick = () => {
        Store.setPref("hideSyncNudge", true);
        viewHome();
      };
    const hs = $app.querySelector("[data-act=home-save]");
    if (hs) hs.onclick = () => Backup.saveFile().then((ok) => ok && (toast("記録を保存しました"), viewHome()));
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
      const resume = resumeCard(`#/ch/${id}/mcq`);
      inner = `${resume ? `<div class="actions">${resume}</div>` : ""}<div class="q-list">
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
    const resume = resumeCard();
    const body = `
      ${resume ? `<div class="actions">${resume}</div>` : ""}
      <div class="pr-grid"><div class="pr-left">
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

      </div><div class="pr-right">
      <h2 class="h2 pr-first">TBS(Task-Based Simulation)</h2>
      ${CPA.sections
        .map((s) => {
          const ts = CPA.tbsFor({ section: s.id });
          const done = ts.filter((t) => Store.tbsRec(t.id)).length;
          return `<details class="tbs-group ${mySections().includes(s.id) ? "" : "dim"}" style="--c:${s.color}"><summary>${tag(s.id)}<b>${s.ja}</b><span class="muted small">${done}/${ts.length} 問</span></summary>
            <div class="q-list">${ts
              .map((t) => {
                const r = Store.tbsRec(t.id);
                return `<a class="q-item" href="#/tbs/${t.id}"><span class="qm ${r ? (r.best >= 0.7 ? "ok" : "ng") : "none"}">${r ? pct(r.best) + "%" : "—"}</span><span class="q-text">${esc(t.title)}</span></a>`;
              })
              .join("")}</div></details>`;
        })
        .join("")}
      </div></div>`;
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
  // 途中経過(出題リスト・何問目か・選んだ選択肢)は解答のたびに保存し、
  // 中断ボタンを押さずにアプリを閉じても「続きから」で再開できるようにする
  const SESSION_KEY = "uscpa_session_v1";
  function persistSession() {
    if (!session || session.kind !== "practice") return;
    try {
      const { title, back, qs, idx, picks, start } = session;
      localStorage.setItem(SESSION_KEY, JSON.stringify({ title, back, qids: qs.map((q) => q.id), idx, picks, start }));
    } catch (e) {}
  }
  function clearSavedSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }
  function savedSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!s || !Array.isArray(s.qids)) return null;
      const qs = s.qids.map((id) => CPA.getMcq(id)).filter(Boolean);
      if (!qs.length || s.idx >= qs.length) return null;
      return { kind: "practice", title: s.title, back: s.back || "#/practice", qs, idx: Math.max(0, s.idx | 0), picks: s.picks || {}, start: Date.now() };
    } catch (e) {
      return null;
    }
  }
  function resumeCard(onlyBack) {
    const s = savedSession();
    if (!s || (onlyBack && s.back !== onlyBack)) return "";
    const done = Object.keys(s.picks).length;
    return `<a class="action resume" href="#/resume"><span class="ai">⏯</span><span><b>MC演習の続きから</b><small>${esc(s.title)} ・ 問題 ${s.idx + 1} / ${s.qs.length}(解答済み ${done} 問)</small></span></a>`;
  }
  function resumeSession() {
    const s = savedSession();
    if (!s) return go("#/practice");
    session = s;
    if (location.hash === "#/quiz") viewQuiz();
    else location.replace("#/quiz");
  }

  function startPractice({ title, qs, back }) {
    if (!qs.length) return;
    session = { kind: "practice", title, qs, back: back || "#/practice", idx: 0, picks: {}, start: Date.now() };
    persistSession();
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
    // 問題の図解(模試では出さない。設定で消せる)
    const figHtml = !opts.noFig && Store.get().prefs.showFig !== false && typeof Figure !== "undefined" ? Figure.render(CPA.getFig(q.id)) : "";
    return `
      <div class="q-head">
        <span>${tag(q.section)} 問題 ${i + 1} / ${total}</span>
        <button class="flag ${r && r.flag ? "on" : ""}" data-act="flag" title="要復習に追加">⚑ 要復習</button>
      </div>
      <div class="q-wrap ${figHtml ? "has-fig" : ""}">
      <div class="q-box">
        <p class="q-en" data-qid="${q.id}">${clauses
          .map((t, n) => `<span class="cl ${sc.has(n) ? "on" : ""}" data-cl="${n}">${esc(t)}</span>${sc.has(n) ? `<span class="cl-ja" data-clja="${n}">${esc(jaCache.get(t) || "…")}</span>` : ""}`)
          .join(" ")}</p>
        ${Speech.button(q.q, "問題文", "inline")} ${Speech.button(q.q + " " + q.c.map((c, k) => letters[k] + ". " + c + ".").join(" "), "選択肢まで", "inline")}
        <button class="ja-toggle" data-act="ja">${showJa ? "全文の和訳を隠す" : "全文の和訳"}</button>
        <span class="ja-hint">わからない部分をタップするとそこだけ和訳します(もう一度タップで隠す)。選択肢は「訳」ボタンで。</span>
        <p class="q-ja ${showJa ? "" : "hidden"}">${esc(q.ja)}</p>
      </div>
      ${figHtml}
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
    if (!session) {
      session = savedSession();
      if (!session) return go("#/practice");
    }
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
      ${
        answered && picked !== q.a
          ? `<div class="why-pick"><span>間違えた理由は?</span><div class="chips">${WHY.map(([k, l]) => `<button data-why-pick="${k}" class="${(Store.qRec(q.id) || {}).why === k ? "on" : ""}">${l}</button>`).join("")}</div></div>`
          : ""
      }
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
      persistSession();
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
    $app.querySelectorAll("[data-why-pick]").forEach((b) => {
      b.onclick = () => {
        const on = b.classList.contains("on");
        Store.setWhy(q.id, on ? null : b.dataset.whyPick);
        $app.querySelectorAll("[data-why-pick]").forEach((x) => x.classList.toggle("on", !on && x === b));
      };
    });
    const nx = $app.querySelector("[data-act=next]");
    if (nx)
      nx.onclick = () => {
        session.idx += 1;
        persistSession();
        viewQuiz();
      };
  }

  function viewQuizResult() {
    const { qs, picks } = session;
    const ok = qs.filter((q) => picks[q.id] === q.a).length;
    const done = qs.filter((q) => picks[q.id] !== undefined).length;
    if (!session.saved) {
      session.saved = true;
      clearSavedSession();
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
      main = questionHtml(it.q, sx.idx, sx.items.length, { picked: sx.picks[it.q.id], reveal: false, noFig: true });
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
  function cardsLine(tc) {
    const n = tc.review.length + tc.fresh.length;
    if (!n) return tc.unseen ? "今日の分は終わり(新しいカードはまた明日)" : "今日の復習はありません";
    return `今日 ${n} 枚(復習 ${tc.review.length}・新しい ${tc.fresh.length})`;
  }

  function viewCards() {
    current.section = null;
    const mine = mySections();
    const rows = CPA.sections
      .map((s) => {
        const cs = s.chapters.flatMap((c) => c.cards);
        const due = cs.filter((c) => Store.isCardReviewDue(c.id)).length;
        const unseen = cs.filter((c) => !Store.cardRec(c.id)).length;
        const m = cs.filter((c) => Store.isCardMastered(c.id)).length;
        return `<a class="sec-card ${mine.includes(s.id) ? "" : "dim"}" href="#/cards/run/sec/${s.id}" style="--c:${s.color}">
          <div class="sec-id">${s.id}</div>
          <div class="sec-body"><div class="sec-name">${s.ja}</div>${bar(m / cs.length, s.color)}
          <div class="sec-meta"><span>覚えた ${m}/${cs.length}</span><span>復習 ${due}</span><span>未学習 ${unseen}</span></div></div></a>`;
      })
      .join("");
    const tc = todayCards(CPA.allCards().filter((c) => mine.includes(c.section)));
    const body = `
      <div class="cards-top">
      <a class="action wide" href="#/cards/run/due"><span class="ai">🗂</span><span><b>今日の復習を始める</b><small>${cardsLine(tc)} ・ 新しいカードは1日${Store.get().prefs.newPerDay ?? 20}枚まで</small></span></a>
      <a class="action wide" href="#/listen"><span class="ai">🎧</span><span><b>聞き流し(通勤・ジム)</b><small>画面を見ずに単語を音声で。○✕クイズも</small></span></a>
      </div>
      <h2 class="h2">科目別</h2>
      <div class="sec-list">${rows}</div>
      <h2 class="h2">用語集</h2>
      <input class="search" id="g-q" placeholder="英語・日本語で検索(例:lease, 減損)">
      <div class="gloss" id="g-list"></div>`;
    page({ title: "単語カード", body, tab: "cards" });
    const $q = $app.querySelector("#g-q");
    const draw = () => {
      const k = $q.value.trim().toLowerCase();
      const hit = CPA.allCards().filter((c) => !k || (c.en + c.ja + c.desc).toLowerCase().includes(k));
      // 全件(1,000枚超)を一度に描くと重いので、最初は一部だけ出して「もっと見る」で足す
      const list = hit.slice(0, glossMax);
      const more = hit.length > list.length ? `<button class="btn block" id="g-more">もっと見る(残り ${hit.length - list.length} 件)</button>` : "";
      $app.querySelector("#g-list").innerHTML = list.length
        ? (k ? `<p class="muted small">${hit.length} 件</p>` : "") + list.map((c) => `<div class="gloss-row">${tag(c.section)}<div class="gloss-body"><b>${esc(c.en)}</b><span>${esc(c.ja)}</span><small>${esc(c.desc)}</small>${explainBtn(c.id)}</div>${Speech.button(c.en)}</div>`).join("")
        : `<p class="muted">見つかりませんでした</p>`;
      if (more) {
        $app.querySelector("#g-list").insertAdjacentHTML("beforeend", more);
        $app.querySelector("#g-more").onclick = () => {
          glossMax += 50;
          draw();
        };
      }
    };
    let glossMax = 30;
    $q.oninput = () => {
      glossMax = 30;
      draw();
    };
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
      const tc = todayCards(all);
      const due = tc.review.concat(tc.fresh);
      cards = due.length ? due : all;
      title = s.id + (due.length ? " 復習" : " 全カード");
    } else {
      const tc = todayCards(CPA.allCards().filter((c) => mySections().includes(c.section)));
      // 復習を先に(混ぜて)、新しいカードはその後に章の順で
      cards = shuffle(tc.review).concat(tc.fresh);
      title = "今日の単語";
    }
    if (kind !== "due") cards = shuffle(cards);
    cards = cards.slice(0, kind === "due" ? 60 : 30);
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

      <a class="link-card" href="#/analysis"><b>実力分析</b><span>科目ごとの合格の目安・弱い章・間違えた問題の傾向 ›</span></a>
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
  // 自動バックアップの状態(設定画面)
  function backupStatus() {
    if (typeof Backup === "undefined") return `<p class="muted small">学習記録はこの端末のブラウザにだけ保存されます。</p>`;
    const b = Backup.info();
    const t = (ms) => {
      const d = new Date(ms);
      return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    const last = Store.get().prefs.lastFileBackup;
    return `<ul class="bk-list">
        ${
          b.cloud
            ? `<li class="ok"><b>クラウド</b>自動で保存中${b.cloudAt ? `(最終 ${t(b.cloudAt)})` : ""}。別の端末でも、claude.ai のこのアプリを開けば記録が戻ります</li>`
            : `<li class="${b.gh && !b.ghError ? "ok" : ""}"><b>PC・スマホの自動同期</b>${
                b.gh
                  ? `GitHub(@${esc(b.gh)})の非公開メモに自動で保存中${b.ghAt ? `(最終 ${t(b.ghAt)})` : ""}${b.ghError ? `<br><span class="ng-text">${esc(b.ghError)}</span>` : ""}`
                  : "未設定(下で設定すると、PCとスマホで同じ記録を使えます)"
              }</li>`
        }
        <li class="${b.device ? "ok" : ""}"><b>この端末</b>保存のたびに、ブラウザの別の保存場所にも写しています${b.persisted ? "(消さないよう設定済み)" : ""}</li>
        <li class="${last ? "ok" : ""}"><b>ファイル</b>${last ? `最終保存 ${last}` : "まだ保存していません"}。機種変更の前や、ブラウザのデータを消す前に保存してください</li>
      </ul>
      ${
        !b.cloud && !b.gh
          ? `<details class="sync-setup" open><summary>PC・スマホの自動同期を設定する(初回だけ・各端末で)</summary>
              <ol class="steps-list">
                <li><a href="https://github.com/settings/tokens/new?scopes=gist&description=USCPA%E5%AD%A6%E7%BF%92%E3%82%A2%E3%83%97%E3%83%AA" target="_blank" rel="noopener"><b>GitHubでトークンを作る ›</b></a><br>「gist」にチェックが入った状態で開きます。Expiration(有効期限)を <b>No expiration</b> にして、一番下の「Generate token」を押します。</li>
                <li>表示された <code>ghp_</code> で始まる文字列をコピーして、下に貼り付けます。</li>
                <li>PCでも同じ手順で(同じトークンを貼っても、もう1つ作ってもOK)。同じGitHubアカウントなら、自動で同じ記録につながります。</li>
              </ol>
              <label class="field"><span>トークン</span><input type="password" id="s-ghtoken" placeholder="ghp_..." autocomplete="off"></label>
              <button class="btn primary" data-act="ghconnect">自動同期を始める</button>
              <p class="muted small">記録はあなたのGitHubアカウントの非公開メモ(Gist)に保存されます。トークンはこの端末にだけ保存され、記録の書き出しファイルには入りません。トークンは gist(メモ)の読み書きしかできない権限にしてください。</p>
            </details>`
          : ""
      }
      ${
        b.gh
          ? `<div class="btn-row"><button class="btn" data-act="ghsync">今すぐ同期</button><button class="btn" data-act="ghoff">同期をやめる</button></div>`
          : ""
      }
      ${
        b.cloudNewer
          ? `<div class="warn-box"><b>別の端末で勉強した新しい記録がクラウドにあります</b>この端末の記録と入れ替えるか、この端末の記録でクラウドを上書きするか選んでください。
             <div class="btn-row"><button class="btn primary" data-act="pull">クラウドの記録を読み込む</button><button class="btn" data-act="push">この端末の記録で上書き</button></div></div>`
          : ""
      }`;
  }

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
        <a class="link-card" href="#/planner"><b>受験日プランナー</b><span>単位・手続き・勉強時間から受験日を逆算して設定 ›</span></a>
        <label class="field"><span>目標の総学習時間(時間)</span><input type="number" id="s-target" min="100" step="50" value="${plan.targetHours}"></label>
        <label class="field"><span>1日の目標(分)</span><input type="number" id="s-daily" min="10" step="10" value="${plan.dailyMin}"></label>
        <label class="field"><span>新しい単語カード(1日の枚数)</span><input type="number" id="s-newcards" min="0" max="200" step="5" value="${st.prefs.newPerDay ?? 20}"></label>
        <label class="check"><input type="checkbox" id="s-fig" ${st.prefs.showFig !== false ? "checked" : ""}> 問題の図解を表示する(模試では表示しません)</label>
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
        ${backupStatus()}
        <div class="btn-row">
          <button class="btn" data-act="savefile">記録をファイルに保存</button>
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
    $app.querySelector("#s-fig").onchange = (e) => Store.setPref("showFig", e.target.checked);
    $app.querySelector("#s-newcards").onchange = (e) => Store.setPref("newPerDay", Math.max(0, Math.min(200, Math.round(+e.target.value) || 0)));
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
    // ホームの「自動同期」から来たときは、設定の場所まで移動する
    if (location.hash === "#/settings/sync") {
      const el = $app.querySelector(".sync-setup") || $app.querySelector(".bk-list");
      if (el) setTimeout(() => el.scrollIntoView({ block: "center" }), 50);
    }
    const ghc = $app.querySelector("[data-act=ghconnect]");
    if (ghc)
      ghc.onclick = () => {
        const tk = $app.querySelector("#s-ghtoken").value.trim();
        if (!tk) return toast("トークンを貼り付けてください");
        ghc.disabled = true;
        ghc.textContent = "接続中…";
        Backup.ghConnect(tk)
          .then((login) => {
            toast(`@${login} で自動同期を始めました`);
            viewSettings();
          })
          .catch((e) => {
            toast(e.status === 401 ? "トークンが正しくありません" : e.status === 403 || e.status === 404 ? "トークンに gist の権限がありません" : "接続できませんでした");
            ghc.disabled = false;
            ghc.textContent = "自動同期を始める";
          });
      };
    const ghs = $app.querySelector("[data-act=ghsync]");
    if (ghs) ghs.onclick = () => Backup.ghSync().then(() => (toast(Backup.info().ghError || "同期しました"), viewSettings()));
    const gho = $app.querySelector("[data-act=ghoff]");
    if (gho)
      gho.onclick = () => {
        Backup.ghDisconnect();
        toast("自動同期をやめました(GitHubの記録は残っています)");
        viewSettings();
      };
    $app.querySelector("[data-act=savefile]").onclick = () => Backup.saveFile().then((ok) => ok && toast("記録を保存しました"));
    const pull = $app.querySelector("[data-act=pull]");
    if (pull) pull.onclick = () => Backup.pullCloud().then((ok) => !ok && toast("読み込めませんでした"));
    const push = $app.querySelector("[data-act=push]");
    if (push)
      push.onclick = () =>
        Backup.pushCloud().then(() => {
          toast("この端末の記録をクラウドに保存しました");
          viewSettings();
        });
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

  // ---------- 聞き流し(通勤・ジム) ----------
  // 単語カードを音声で流す。画面を見なくても進む。○✕クイズはジムの合間でも答えられる難しさ
  const LISTEN_KINDS = [
    ["word", "単語(英→日)", "英語 → 少し間 → 日本語と一言説明"],
    ["quiz", "○✕クイズ", "「この用語の意味は○○。○か✕か?」→ 間 → 正解"],
    ["deep", "詳しく聞く", "日本語の詳しい説明と「日本でいうと」まで"],
  ];
  const LISTEN_GAPS = [
    [1500, "短め"],
    [3000, "ふつう"],
    [5000, "長め"],
  ];

  function listenPrefs() {
    return Object.assign({ kind: "word", scope: "mine", order: "weak", gap: 3000, count: 50 }, Store.get().prefs.listen || {});
  }

  function listenItems(lp) {
    let cards = CPA.allCards();
    if (lp.scope === "mine") cards = cards.filter((c) => mySections().includes(c.section));
    else if (lp.scope.length === 3) cards = cards.filter((c) => c.section === lp.scope);
    else cards = cards.filter((c) => c.chapter === lp.scope);
    if (lp.kind === "deep") cards = cards.filter((c) => explainFor(c.id));
    if (lp.order === "weak") {
      // 覚えていない(箱が小さい)カードと、まだ見ていないカードを先に
      const box = (c) => (Store.cardRec(c.id) || { box: 0 }).box;
      cards = shuffle(cards).sort((a, b) => box(a) - box(b));
    } else if (lp.order === "random") cards = shuffle(cards);
    cards = cards.slice(0, lp.count);
    const g = lp.gap;
    return cards.map((c) => {
      const base = { title: c.en, sub: c.ja, card: c, onSpeak: () => {
        lastInput = Date.now();
        current.section = c.section;
      } };
      if (lp.kind === "quiz") {
        const others = CPA.getChapter(c.chapter).cards.filter((x) => x.id !== c.id && x.ja !== c.ja);
        const truth = !others.length || Math.random() < 0.5;
        const shown = truth ? c.ja : others[Math.floor(Math.random() * others.length)].ja;
        return Object.assign(base, {
          quiz: { shown, truth },
          segs: [
            { t: c.en, lang: "en" },
            { t: `の意味は、${shown}。○か✕か?`, lang: "ja" },
            { wait: g + 1000 },
            { t: truth ? "正解は、まる。" : `正解は、ばつ。正しくは、${c.ja}。`, lang: "ja" },
            { t: c.desc, lang: "ja" },
            { wait: Math.round(g / 2) },
          ],
        });
      }
      if (lp.kind === "deep") {
        const x = explainFor(c.id);
        return Object.assign(base, {
          segs: [
            { t: c.en, lang: "en" },
            { t: `${c.ja}。${c.desc}`, lang: "ja" },
            { t: x[0], lang: "ja" },
            { t: `日本でいうと。${x[1]}`, lang: "ja" },
            { wait: g },
          ],
        });
      }
      return Object.assign(base, {
        segs: [
          { t: c.en, lang: "en" },
          { wait: g },
          { t: `${c.ja}。${c.desc}`, lang: "ja" },
          { wait: Math.round(g / 3) },
          { t: c.en, lang: "en" },
          { wait: Math.round(g / 2) },
        ],
      });
    });
  }

  function viewListen() {
    current.section = null;
    if (!Listen.supported) {
      page({ title: "聞き流し", back: "#/cards", body: `<div class="panel"><p>このブラウザは音声の読み上げに対応していません。iPhone の Safari や Android の Chrome で開いてください。</p></div>`, tab: "cards" });
      return;
    }
    const lp = listenPrefs();
    const chip = (id, list, v) => `<div class="chips" id="${id}">${list.map(([k, l]) => `<button data-v="${k}" class="${String(v) === String(k) ? "on" : ""}">${l}</button>`).join("")}</div>`;
    const scopes = [["mine", "受験科目すべて"]].concat(CPA.sections.map((s) => [s.id, `${s.id} ${s.ja}`]));
    const body = `
      <div class="panel">
        <p class="muted small" style="margin-top:0">通勤中やジムの合間に、画面を見ずに単語を聞き流せます。<b>画面はつけたまま</b>にしてください(画面を消すと読み上げが止まるスマホが多いため、再生中は自動で消えないようにします)。</p>
        <div class="field"><span>内容</span>${chip("ls-kind", LISTEN_KINDS, lp.kind)}<small class="muted" id="ls-kind-hint"></small></div>
        <label class="field"><span>範囲</span><select id="ls-scope">${scopes.map(([k, l]) => `<option value="${k}" ${lp.scope === k ? "selected" : ""}>${l}</option>`).join("")}${CPA.allChapters()
          .map((c) => `<option value="${c.id}" ${lp.scope === c.id ? "selected" : ""}>${c.id} ${esc(c.title)}</option>`)
          .join("")}</select></label>
        <div class="field"><span>順番</span>${chip("ls-order", [["weak", "覚えていない順"], ["random", "ランダム"], ["seq", "章の順"]], lp.order)}</div>
        <div class="field"><span>考える間</span>${chip("ls-gap", LISTEN_GAPS, lp.gap)}</div>
        <div class="field"><span>枚数</span>${chip("ls-count", [[20, "20"], [50, "50"], [100, "100"], [999, "全部"]], lp.count)}</div>
        ${Listen.hasJa() ? "" : `<p class="warn-box small">この端末には日本語の読み上げ音声が見つかりませんでした。英語だけが読まれる場合は、端末の設定で日本語の音声を追加してください。</p>`}
      </div>
      <div class="player" id="ls-player">
        <div class="player-now" id="ls-now"></div>
        <div class="player-ctl">
          <button class="pbtn" data-p="prev" aria-label="前へ">⏮</button>
          <button class="pbtn main" data-p="toggle" aria-label="再生/一時停止" id="ls-toggle">▶</button>
          <button class="pbtn" data-p="next" aria-label="次へ">⏭</button>
        </div>
      </div>`;
    page({ title: "聞き流し", back: "#/cards", body, tab: "cards" });

    const kindHint = () => ($app.querySelector("#ls-kind-hint").textContent = LISTEN_KINDS.find((k) => k[0] === listenPrefs().kind)[2]);
    const render = (s) => {
      const box = $app.querySelector("#ls-now");
      if (!box) return;
      const it = s.item;
      $app.querySelector("#ls-toggle").textContent = s.playing ? "⏸" : "▶";
      box.innerHTML = it
        ? `<div class="player-count">${s.idx + 1} / ${s.total}</div>
           <div class="player-en">${esc(it.title)}</div>
           ${it.quiz ? `<div class="player-ja">${esc(it.quiz.shown)}?</div><div class="muted small">${s.playing ? "…" : ""}</div>` : `<div class="player-ja">${esc(it.sub)}</div>`}`
        : `<div class="muted">「▶」で再生</div>`;
    };
    const reload = () => {
      const items = listenItems(listenPrefs());
      Listen.load(items, { rate: Store.get().prefs.speechRate || 0.95, onChange: render });
    };
    const save = (k, v) => {
      Store.setPref("listen", Object.assign(listenPrefs(), { [k]: v }));
      kindHint();
      reload();
    };
    [["ls-kind", "kind"], ["ls-order", "order"], ["ls-gap", "gap"], ["ls-count", "count"]].forEach(([id, k]) =>
      $app.querySelectorAll(`#${id} button`).forEach((b) => {
        b.onclick = () => {
          $app.querySelectorAll(`#${id} button`).forEach((x) => x.classList.remove("on"));
          b.classList.add("on");
          save(k, /^\d+$/.test(b.dataset.v) ? +b.dataset.v : b.dataset.v);
        };
      })
    );
    $app.querySelector("#ls-scope").onchange = (e) => save("scope", e.target.value);
    $app.querySelectorAll("[data-p]").forEach((b) => {
      b.onclick = () => {
        const a = b.dataset.p;
        if (a === "prev") Listen.prev();
        else if (a === "next") Listen.next();
        else if (Listen.state().playing) Listen.pause();
        else Listen.play();
      };
    });
    kindHint();
    reload();
  }

  // ---------- 実力分析(合格の目安・間違いの傾向) ----------
  const WHY = [
    ["know", "知識不足"],
    ["calc", "計算ミス"],
    ["read", "英文の読み違い"],
    ["slip", "うっかり"],
  ];
  // 選択肢の3つ以上に数字があれば計算問題とみなす
  const isCalcQ = (q) => q.c.filter((c) => /\d/.test(c)).length >= 3;

  // 科目ごとの合格の目安。MC(いまの正答率)とTBS(最高点の平均)を本番の配点どおり半々で合わせ、
  // 模試の最高点があれば半分ずつ混ぜる。点数への換算は模試と同じ estScore
  function readiness(s) {
    const qs = s.chapters.flatMap((c) => c.mcq);
    const ans = qs.filter((q) => (Store.qRec(q.id) || {}).n);
    const okN = ans.filter((q) => Store.qRec(q.id).last === true).length;
    const mcAcc = ans.length ? okN / ans.length : null;
    const ts = CPA.tbsFor({ section: s.id });
    const tr = ts.map((t) => Store.tbsRec(t.id)).filter(Boolean);
    const tbsAvg = tr.length ? tr.reduce((a, r) => a + r.best, 0) / tr.length : null;
    const mocks = Store.get().mocks.filter((m) => m.section === s.id);
    const mockBest = mocks.length ? Math.max(...mocks.map((m) => m.score)) : null;
    const cov = ans.length / qs.length;
    let est = null;
    if (ans.length >= 30) {
      const ratio = tbsAvg === null ? mcAcc : (mcAcc + tbsAvg) / 2;
      est = estScore(ratio);
      if (mockBest !== null) est = Math.round((est + mockBest) / 2);
    } else if (mockBest !== null) est = mockBest;
    const level = est === null ? "none" : est >= 75 && cov >= 0.6 ? "ok" : est >= 65 ? "near" : "far";
    // 弱い章:5問以上解いて正答率が低い順。手をつけていない章も別に出す
    const chs = s.chapters.map((c) => {
      const a = c.mcq.filter((q) => (Store.qRec(q.id) || {}).n);
      return { c, n: a.length, acc: a.length ? a.filter((q) => Store.qRec(q.id).last === true).length / a.length : null };
    });
    const weak = chs.filter((x) => x.n >= 5 && x.acc < 0.7).sort((a, b) => a.acc - b.acc).slice(0, 3);
    const untouched = chs.filter((x) => !x.n);
    return { s, qs, ans: ans.length, mcAcc, tbsAvg, tbsN: tr.length, tbsTotal: ts.length, mockBest, cov, est, level, weak, untouched };
  }

  function viewAnalysis() {
    current.section = null;
    const LV = { ok: ["合格圏", "ok"], near: ["あと少し", "near"], far: ["要強化", "far"], none: ["データ不足", "none"] };
    const rd = mySections().map((id) => readiness(CPA.getSection(id)));
    const readyHtml = rd
      .map((r) => {
        const [lab, cls] = LV[r.level];
        return `<div class="ready-card" style="--c:${r.s.color}">
          <div class="ready-head">${tag(r.s.id)}<b>${r.s.ja}</b><span class="ready-lv ${cls}">${lab}</span></div>
          <div class="ready-score">${r.est === null ? `<span class="muted">あと${Math.max(0, 30 - r.ans)}問解くと目安が出ます</span>` : `予想 <b>${r.est}</b><small> / 合格ライン 75${r.cov < 0.3 && r.mockBest === null ? "(解いた範囲が狭いので参考値)" : ""}</small>`}</div>
          ${r.est !== null ? `<div class="ready-bar"><span style="width:${r.est}%"></span><i style="left:75%"></i></div>` : ""}
          <div class="ready-meta">
            <span>MC正答率 ${r.mcAcc === null ? "—" : pct(r.mcAcc) + "%"}<small>(目安65%以上)</small></span>
            <span>カバー率 ${pct(r.cov)}%<small>(${r.ans}/${r.qs.length}問・目安60%以上)</small></span>
            <span>TBS ${r.tbsAvg === null ? "—" : pct(r.tbsAvg) + "%"}<small>(${r.tbsN}/${r.tbsTotal}問)</small></span>
            <span>模試最高 ${r.mockBest === null ? "—" : r.mockBest}</span>
          </div>
          ${
            r.weak.length
              ? `<div class="ready-weak"><b>弱い章</b>${r.weak.map((w) => `<a href="#/ch/${w.c.id}/mcq">${esc(w.c.title)}<small>${pct(w.acc)}%</small></a>`).join("")}</div>`
              : ""
          }
          ${r.untouched.length && r.ans ? `<div class="ready-weak"><b>まだ解いていない章</b>${r.untouched.slice(0, 3).map((w) => `<a href="#/ch/${w.c.id}/mcq">${esc(w.c.title)}</a>`).join("")}${r.untouched.length > 3 ? `<small class="muted">ほか${r.untouched.length - 3}章</small>` : ""}</div>` : ""}
        </div>`;
      })
      .join("");

    // 間違いの傾向(いま間違えたままの問題)
    const wrong = CPA.allMcq().filter((q) => (Store.qRec(q.id) || {}).last === false);
    const byWhy = WHY.map(([k, l]) => ({ k, l, qs: wrong.filter((q) => Store.qRec(q.id).why === k) })).concat([
      { k: "none", l: "理由未選択", qs: wrong.filter((q) => !Store.qRec(q.id).why) },
    ]);
    const answered = CPA.allMcq().filter((q) => (Store.qRec(q.id) || {}).n);
    const typeRow = (label, f) => {
      const a = answered.filter(f);
      const w = a.filter((q) => Store.qRec(q.id).last === false);
      return { label, a: a.length, w, rate: a.length ? w.length / a.length : null };
    };
    const types = [typeRow("計算問題", isCalcQ), typeRow("理論問題", (q) => !isCalcQ(q))];
    const byCh = CPA.allChapters()
      .map((c) => ({ c, qs: wrong.filter((q) => q.chapter === c.id) }))
      .filter((x) => x.qs.length)
      .sort((a, b) => b.qs.length - a.qs.length)
      .slice(0, 6);
    const maxW = Math.max(1, ...byWhy.map((x) => x.qs.length));
    const tendHtml = wrong.length
      ? `<div class="panel">
          <p class="muted small" style="margin-top:0">いま間違えたままの問題 <b>${wrong.length}</b> 問の内訳です。問題を間違えたときに理由を選ぶと、ここに集計されます。</p>
          <div class="why-bars">${byWhy
            .filter((x) => x.qs.length)
            .map(
              (x) => `<button class="why-bar" data-why="${x.k}"><span class="why-l">${x.l}</span><span class="why-track"><span style="width:${(x.qs.length / maxW) * 100}%"></span></span><span class="why-n">${x.qs.length}問 ›</span></button>`
            )
            .join("")}</div>
          <h3 class="h3">計算と理論</h3>
          <div class="why-types">${types
            .map((t) => `<button class="why-type" data-type="${t.label}" ${t.w.length ? "" : "disabled"}><b>${t.label}</b><span>${t.rate === null ? "—" : "間違い " + pct(t.rate) + "%"}</span><small>${t.w.length}問を解き直す ›</small></button>`)
            .join("")}</div>
          ${(() => {
            const [c, th] = types;
            if (c.rate === null || th.rate === null || c.a < 10 || th.a < 10) return "";
            if (c.rate > th.rate + 0.1) return `<p class="small">計算問題の間違いが多めです。電卓の操作と、TBSの計算(仕訳・CF・税額)を重点的に。</p>`;
            if (th.rate > c.rate + 0.1) return `<p class="small">理論問題の間違いが多めです。単語カードの「詳しく」と講義ノートで論点の整理を。</p>`;
            return "";
          })()}
          <h3 class="h3">間違いが多い章</h3>
          <div class="q-list">${byCh
            .map((x) => `<button class="q-item why-ch" data-ch="${x.c.id}"><span class="qm ng">${x.qs.length}</span><span class="q-text">${tag(x.c.section)} ${esc(x.c.title)}</span></button>`)
            .join("")}</div>
        </div>`
      : `<div class="panel"><p class="muted" style="margin:0">間違えたままの問題はありません。問題演習で間違えると、ここに傾向が出ます。</p></div>`;

    const body = `
      <h2 class="h2 first">合格の目安<small>受験科目</small></h2>
      <div class="ready-list">${readyHtml}</div>
      <p class="muted small">予想はアプリ内の正答率からの目安です(MCとTBSを本番の配点どおり半々、模試の結果があれば半分ずつ反映)。本番は問題の難易度で点数が調整されるため、合格ラインに余裕をもって届くのを目標にしましょう。</p>
      <h2 class="h2">間違えた問題の傾向</h2>
      ${tendHtml}`;
    page({ title: "実力分析", back: "#/stats", body, tab: "stats" });

    const run = (title, qs) => startPractice({ title, qs: shuffle(qs).slice(0, 20), back: "#/analysis" });
    $app.querySelectorAll("[data-why]").forEach((b) => (b.onclick = () => {
      const x = byWhy.find((y) => y.k === b.dataset.why);
      run(`${x.l}の問題を解き直す`, x.qs);
    }));
    $app.querySelectorAll("[data-type]").forEach((b) => (b.onclick = () => {
      const t = types.find((y) => y.label === b.dataset.type);
      run(`${t.label}の解き直し`, t.w);
    }));
    $app.querySelectorAll("[data-ch].why-ch").forEach((b) => (b.onclick = () => {
      const x = byCh.find((y) => y.c.id === b.dataset.ch);
      run(`${x.c.id} 間違えた問題`, x.qs);
    }));
  }

  // ---------- 受験日プランナー ----------
  // 単位・手続き・勉強時間から受験日を逆算する。期間や時間はすべて予備校・解説サイトの一般的な目安で、画面で変えられる。
  const PLAN_HOURS = { FAR: 400, AUD: 250, REG: 250, BAR: 200, ISC: 150, TCP: 150 };
  const PLAN_ORDERS = [
    ["FAR", "AUD", "REG", "D"],
    ["FAR", "REG", "AUD", "D"],
    ["FAR", "D", "AUD", "REG"],
    ["REG", "FAR", "AUD", "D"],
  ];
  const PAPER_STAGES = [
    ["none", "まだ何もしていない"],
    ["credits", "単位はそろった(学歴評価はまだ)"],
    ["eval", "学歴評価が済んだ(出願はまだ)"],
    ["applied", "出願した(受験票NTS待ち)"],
    ["nts", "NTSが届いた"],
  ];
  // 選択科目(BAR・ISC・TCP)を受けられる月(要確認。設定で外せる)
  const DISC_MONTHS = [1, 4, 7, 10];

  function plannerInput() {
    const plan = Store.get().plan;
    const p = Object.assign(
      { mode: "auto", stage: "none", state: "MT", order: 0, dpw: 6, credWeeks: 2, evalDays: 60, appDays: 30, bookDays: 14, discWin: true, hours: {}, target: "" },
      Store.get().prefs.planner || {},
      { daily: plan.dailyMin }
    );
    // 希望日は「希望日から逆算」を選び、明日以降の日付を入れたときだけ使う
    // (iPhone は空の日付欄に触れると今日の日付が入るため、空欄=最短 の判定には頼らない)
    p.tgt = p.mode === "target" && p.target && p.target > Store.today() ? p.target : "";
    return p;
  }

  const fmtDate = (d) => {
    const [y, m, dd] = d.split("-");
    return `${y}年${+m}月${+dd}日`;
  };
  const daysBetween = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);

  // 選択科目は受験できる月の初日まで後ろにずらす
  function snapDisc(date) {
    let [y, m] = date.split("-").map(Number);
    if (DISC_MONTHS.includes(m)) return date;
    while (!DISC_MONTHS.includes(m)) {
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return `${y}-${String(m).padStart(2, "0")}-01`;
  }

  function computePlan(p) {
    const today = Store.today();
    const disc = Store.get().plan.discipline;
    const order = PLAN_ORDERS[p.order].map((x) => (x === "D" ? disc : x));
    const el = eligInput();
    const st = ELIGIBILITY.states.find((s) => s.id === p.state) || ELIGIBILITY.states[0];
    const needAcct = Math.max(0, st.exam.acct - el.acct);
    const needBiz = Math.max(0, st.exam.biz - el.biz);
    const needTotal = Math.max(0, st.exam.total - el.total - needAcct - needBiz);
    const stageIdx = PAPER_STAGES.findIndex((s) => s[0] === p.stage);
    const missing = stageIdx >= 1 ? 0 : needAcct + needBiz + needTotal;
    const courses = Math.ceil(missing / 3);
    // 手続きの段階(残っているものだけ数える)
    const paper = [];
    // 日本の大学の学歴評価は、単位取得と並行して進められる(遅いほうが終わったら出願)
    if (courses && stageIdx < 2) {
      const cd = courses * p.credWeeks * 7;
      paper.push({ key: "credits", label: `不足単位を取る(約${missing}単位・${courses}科目)+並行して学歴評価を申し込む`, days: Math.max(cd, p.evalDays) });
    } else if (stageIdx < 2) paper.push({ key: "eval", label: "学歴評価(NIES・FACS など)", days: p.evalDays });
    if (stageIdx < 3) paper.push({ key: "app", label: `${st.name}に出願`, days: 0 });
    if (stageIdx < 4) paper.push({ key: "nts", label: "受験票(NTS)が届く", days: p.appDays });
    paper.push({ key: "book", label: "テストセンターを予約(空き待ち)", days: p.bookDays });

    const perDayH = (p.daily / 60) * (p.dpw / 7);
    const remainH = (id) => Math.max(0, (p.hours[id] ?? PLAN_HOURS[id]) - Store.studySeconds({ section: id }) / 3600);
    const isDisc = (id) => DISCIPLINES.includes(id);

    // 1科目めの受験日:勉強が終わる日と手続きが終わる日の遅いほう(希望日があればそれ)
    const paperDays = paper.reduce((a, x) => a + x.days, 0);
    const paperReady = Store.addDays(today, paperDays);
    const first = order[0];
    const studyEnd = Store.addDays(today, Math.ceil(remainH(first) / Math.max(0.01, perDayH)));
    let d1 = p.tgt || (studyEnd > paperReady ? studyEnd : paperReady);
    if (isDisc(first) && p.discWin) d1 = snapDisc(d1);

    // 手続きの締切(1科目めの受験日から逆算)
    let cursor = d1;
    const deadlines = [];
    for (let i = paper.length - 1; i >= 0; i--) {
      cursor = Store.addDays(cursor, -paper[i].days);
      deadlines.unshift(Object.assign({ start: cursor }, paper[i]));
    }

    const exams = [];
    let prev = null;
    order.forEach((id, i) => {
      const h = remainH(id);
      const days = Math.ceil(h / Math.max(0.01, perDayH));
      let date;
      if (i === 0) date = d1;
      else {
        date = Store.addDays(prev, Math.max(14, days));
        if (isDisc(id) && p.discWin) date = snapDisc(date);
      }
      exams.push({ id, date, hours: h, from: i === 0 ? today : prev });
      prev = date;
    });
    // 1科目めを希望日で受けるのに必要な1日の勉強時間
    const avail = daysBetween(today, d1);
    const needMin = avail > 0 ? Math.ceil(((remainH(first) * 60) / avail) * (7 / p.dpw)) : null;
    const span = daysBetween(exams[0].date, exams[exams.length - 1].date);
    return { studyEnd, paperReady, order, st, el, missing, needAcct, needBiz, needTotal, deadlines, exams, needMin, perDayH, span, today, stageIdx };
  }

  function viewPlanner() {
    current.section = null;
    const p = plannerInput();
    const disc = Store.get().plan.discipline;
    const num = (id, label, val, attrs, hint) =>
      `<label class="field"><span>${label}</span><input type="number" inputmode="numeric" id="${id}" value="${val}" ${attrs}>${hint ? `<small class="muted">${hint}</small>` : ""}</label>`;
    const body = `
      <div class="panel">
        <p class="muted small" style="margin-top:0">USCPAの受験日は自分で決めて予約します(FAR・AUD・REGは年中受験可)。単位・手続き・勉強時間から、いつ受けられるかを逆算します。<b>希望日を入れると</b>、その日に間に合わせるための締切と1日の勉強時間を出します。</p>
        <div class="field"><span>決め方</span><div class="chips" id="pl-mode"><button data-v="auto" class="${p.mode !== "target" ? "on" : ""}">最短で受けられる日を提案</button><button data-v="target" class="${p.mode === "target" ? "on" : ""}">希望日から逆算</button></div></div>
        <label class="field" id="pl-target-f" ${p.mode === "target" ? "" : "hidden"}><span>1科目めの希望日</span><input type="date" id="pl-target" value="${p.target}" min="${Store.addDays(Store.today(), 1)}"></label>
        ${num("pl-daily", "1日の勉強時間(分)", p.daily, 'min="10" step="10"')}
        ${num("pl-dpw", "週に勉強する日数", p.dpw, 'min="1" max="7" step="1"')}
        <div class="field"><span>受験の順番</span><div class="chips" id="pl-order">${PLAN_ORDERS.map((o, i) => `<button data-v="${i}" class="${+p.order === i ? "on" : ""}">${o.map((x) => (x === "D" ? disc : x)).join("→")}</button>`).join("")}</div></div>
        <label class="field"><span>手続きの進み具合</span><select id="pl-stage">${PAPER_STAGES.map(([v, l]) => `<option value="${v}" ${p.stage === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
        <label class="field"><span>出願する州</span><select id="pl-state">${ELIGIBILITY.states.map((s) => `<option value="${s.id}" ${p.state === s.id ? "selected" : ""}>${s.name}</option>`).join("")}</select></label>
        <details class="pl-more"><summary>期間・時間の目安を変える</summary>
          ${num("pl-cred", "単位:1科目(3単位)にかかる週数", p.credWeeks, 'min="1" step="1"', "予備校の単位プログラムや通信制大学のペースに合わせて")}
          ${num("pl-eval", "学歴評価にかかる日数", p.evalDays, 'min="0" step="5"', "目安1.5〜3か月")}
          ${num("pl-app", "出願から受験票(NTS)までの日数", p.appDays, 'min="0" step="5"', "州や時期で変わる。目安2〜6週間")}
          ${num("pl-book", "予約から受験までの日数", p.bookDays, 'min="0" step="1"', "東京・大阪の会場は混む時期がある")}
          ${["FAR", "AUD", "REG", disc].map((id) => num("pl-h-" + id, `${id} の必要勉強時間(時間)`, p.hours[id] ?? PLAN_HOURS[id], 'min="0" step="10"')).join("")}
          <label class="check"><input type="checkbox" id="pl-win" ${p.discWin ? "checked" : ""}> 選択科目(BAR・ISC・TCP)は1・4・7・10月だけ受けられるものとして計算(最新の受験期間は要確認)</label>
        </details>
        <p class="muted small">単位は<a href="#/eligibility">受験資格チェック</a>の入力(会計 ${eligInput().acct}・ビジネス ${eligInput().biz}・総 ${eligInput().total} 単位)を使います。</p>
      </div>
      <div id="pl-result"></div>`;
    page({ title: "受験日プランナー", back: "#/home", body, tab: "home" });

    const val = (id) => $app.querySelector(id).value;
    const read = () => {
      const hours = {};
      ["FAR", "AUD", "REG", disc].forEach((id) => (hours[id] = Math.max(0, +val("#pl-h-" + id) || 0)));
      const np = {
        target: val("#pl-target"),
        mode: $app.querySelector("#pl-mode .on").dataset.v,
        dpw: Math.min(7, Math.max(1, +val("#pl-dpw") || 6)),
        order: +$app.querySelector("#pl-order .on").dataset.v,
        stage: val("#pl-stage"),
        state: val("#pl-state"),
        credWeeks: Math.max(1, +val("#pl-cred") || 2),
        evalDays: Math.max(0, +val("#pl-eval") || 0),
        appDays: Math.max(0, +val("#pl-app") || 0),
        bookDays: Math.max(0, +val("#pl-book") || 0),
        discWin: $app.querySelector("#pl-win").checked,
        hours,
      };
      Store.setPref("planner", np);
      Store.setPlan({ dailyMin: Math.max(10, +val("#pl-daily") || 120) });
      return plannerInput();
    };
    const draw = () => {
      const pp = read();
      const r = computePlan(pp);
      const late = r.deadlines.filter((d) => d.start < r.today);
      const first = r.exams[0];
      const warn = [];
      if (pp.tgt && late.length) warn.push(`希望日には手続きが間に合わない見込みです。「${late[0].label}」は${fmtDate(late[0].start)}に始める必要がありました。希望日を遅らせるか、各期間を見直してください。`);
      if (pp.tgt && r.needMin && r.needMin > pp.daily) warn.push(`希望日に${first.id}を受けるには、1日 約${r.needMin}分(週${pp.dpw}日)の勉強が必要です。いまの設定は1日${pp.daily}分です。`);
      if (pp.mode === "target" && !pp.tgt) warn.push("希望日は明日以降の日付を選んでください。それまでは最短で受けられる日を表示しています。");
      if (r.span > 913) warn.push(`最初の受験から最後の受験まで約${Math.round(r.span / 30)}か月です。多くの州で「最初の合格から30か月以内に全科目合格」が必要なため、順番か勉強時間を見直しましょう。`);
      if (r.el.edu !== "bachelor" && r.el.edu !== "master" && r.st.exam.degree === "bachelor") warn.push(`${r.st.name}は受験に学士号が必要です。受験資格チェックで出願先を確認してください。`);
      const credLine = r.stageIdx >= 1 ? "単位はそろっている前提で計算しています。" : r.missing ? `${r.st.name}の受験要件まで、会計 ${r.needAcct}・ビジネス ${r.needBiz}${r.needTotal ? `・その他 ${r.needTotal}` : ""} 単位が不足しています(受験資格チェックの入力から計算)。` : `受験資格チェックの入力では、${r.st.name}の単位要件を満たしています。`;
      $app.querySelector("#pl-result").innerHTML = `
        ${warn.map((w) => `<div class="warn-box">${w}</div>`).join("")}
        <h2 class="h2">受験日の提案<small>${pp.tgt ? "希望日から逆算" : "最短で受けられる日"}</small></h2>
        <div class="pl-exams">
          ${r.exams
            .map((e) => {
              const s = CPA.getSection(e.id);
              return `<div class="pl-exam" style="--c:${s.color}">${tag(e.id)}<div class="pl-exam-body"><b>${fmtDate(e.date)}</b><small>あと${daysBetween(r.today, e.date)}日 ・ 残り約${Math.round(e.hours)}時間を${Math.max(1, Math.round(daysBetween(e.from, e.date) / 7))}週間で</small></div></div>`;
            })
            .join("")}
        </div>
        ${
          pp.tgt
            ? r.needMin !== null
              ? `<p class="muted small">${first.id}を${fmtDate(first.date)}に受けるのに必要な勉強時間:1日 約${r.needMin}分(週${pp.dpw}日)</p>`
              : ""
            : r.paperReady > r.studyEnd
              ? `<p class="muted small">勉強だけなら${fmtDate(r.studyEnd)}ごろに${first.id}を受けられますが、単位と手続きが終わるのを待つ日程になっています。単位を早く取れれば前に倒せます。</p>`
              : `<p class="muted small">手続きは先に終わる見込みなので、勉強のペースで日程が決まっています。</p>`
        }
        <div class="btn-row"><button class="btn primary" id="pl-apply">この日程を受験日に設定</button>${pp.tgt && r.needMin && r.needMin > pp.daily ? `<button class="btn" id="pl-daily-set">1日の目標を${r.needMin}分にする</button>` : ""}</div>
        <h2 class="h2">手続きのスケジュール<small>${first.id}受験日からの逆算</small></h2>
        <p class="muted small">${credLine}</p>
        <ol class="pl-steps">
          ${r.deadlines
            .map((d) => `<li class="${d.start < r.today ? "late" : ""}"><b>${d.start < r.today ? "今すぐ" : fmtDate(d.start) + "までに開始"}</b><span>${esc(d.label)}${d.days ? `(約${d.days >= 28 ? Math.round(d.days / 7) + "週間" : d.days + "日"})` : ""}</span></li>`)
            .join("")}
          <li><b>${fmtDate(first.date)}</b><span>${first.id} 受験</span></li>
        </ol>
        <p class="muted small">期間や必要時間は予備校・解説サイトの一般的な目安です(必要時間は1科目の講義・演習・総復習を含む目安。すでに学習した時間は差し引いています)。合格の有効期限・受験期間・手続きの期間は州や時期で変わるため、出願前に各州の Board of Accountancy・NASBA で確認してください。</p>`;
      $app.querySelector("#pl-apply").onclick = () => {
        const dates = Object.assign({}, Store.get().plan.examDates);
        r.exams.forEach((e) => (dates[e.id] = e.date));
        Store.setPlan({ examDates: dates });
        toast("受験日を設定しました");
        go("#/home");
      };
      const ds = $app.querySelector("#pl-daily-set");
      if (ds)
        ds.onclick = () => {
          $app.querySelector("#pl-daily").value = r.needMin;
          draw();
        };
    };
    $app.querySelectorAll("#pl-mode button").forEach((b) => {
      b.onclick = () => {
        $app.querySelectorAll("#pl-mode button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        $app.querySelector("#pl-target-f").hidden = b.dataset.v !== "target";
        draw();
      };
    });
    $app.querySelectorAll("#pl-order button").forEach((b) => {
      b.onclick = () => {
        $app.querySelectorAll("#pl-order button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        draw();
      };
    });
    $app.querySelectorAll(".panel input, .panel select").forEach((el) => (el.onchange = draw));
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
        ${chk("cp-pass", pr.pass, "合格お祝い金:期限内(再申し込みから2年以内)に4科目すべて合格できる")}
        ${chk("cp-career", pr.career, "キャリア支援金:予備校の転職支援(AB Career)を通じて転職する")}
        ${chk("cp-other", pr.other, "その他の補助(CPA会計学院の「最大46%補助」など、内訳不明のもの)")}
        <label class="field" style="margin-top:10px"><span>どの講座でも共通でかかる費用(任意)</span><input type="number" inputmode="numeric" min="0" step="1000" id="cp-extra" value="${pr.extra}"><small class="muted">受験料・日本受験の追加料金・学歴評価など。4科目で数十万円規模になります(州と為替で変わります)</small></label>
      </div>
      <div id="cp-result"></div>

      <h2 class="h2">${cb.title}</h2>
      <div class="table-wrap"><table class="tbl cp-cond">
        <thead><tr>${cb.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${cb.rows.map((r) => `<tr><th>${esc(r[0])}</th>${r.slice(1).map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>
      <p class="muted small">${esc(cb.note)}</p>
      ${
        noDegree
          ? `<div class="warn-box"><b>あなたの場合(受験資格チェックの入力より)</b>
              アビタスの案内どおりモンタナ州に出願する場合、学位は不要ですが、フルパックで会計Upper 24単位・ビジネス24単位を取り終えてから受験を始めることになります。合格お祝い金の期限は再申し込みから2年以内なので、単位取得と並行して早めに科目学習を進めないと期限に間に合わない可能性があります。キャリア支援金は試験に合格しなくても対象ですが、AB Careerを通じて転職する場合に限られます。</div>`
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
    // 聞き流しの画面を離れたら再生を止める
    if (a !== "listen" && typeof Listen !== "undefined") Listen.stop();
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
      case "resume":
        return resumeSession();
      case "quick":
        return startQuick();
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
      case "planner":
        return viewPlanner();
      case "listen":
        return viewListen();
      case "analysis":
        return viewAnalysis();
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
    // 以前のオフライン対応(Service Worker)は廃止。入っている端末からは取り除き、保存したファイルも消す
    if ("serviceWorker" in navigator && navigator.serviceWorker.getRegistrations)
      navigator.serviceWorker
        .getRegistrations()
        .then((rs) => rs.forEach((r) => r.unregister()))
        .catch(() => {});
    if (window.caches) caches.delete("uscpa-app").catch(() => {});
    // 自動バックアップから記録を戻したら、画面を描き直す
    window.addEventListener("uscpa:restored", (e) => {
      toast(
        { cloud: "クラウドの記録を読み込みました", github: "別の端末の記録を読み込みました", merge: "別の端末の記録と合わせました", device: "端末内のバックアップから記録を戻しました" }[e.detail] ||
          "記録を読み込みました"
      );
      route();
    });
    // クラウドが使えるとわかったときなど、表示が変わるときだけ描き直す(保存のたびには描き直さない)
    let bkSig = "false|false|null|null";
    if (typeof Backup !== "undefined")
      Backup.onChange((b) => {
        const sig = `${b.cloud}|${b.cloudNewer}|${b.gh}|${b.ghError}`;
        if (sig === bkSig) return;
        bkSig = sig;
        if (/^#\/(settings|home)?$/.test(location.hash || "#/")) route();
      });
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

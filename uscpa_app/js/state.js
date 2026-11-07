// 学習記録を localStorage に保存・復元する。
// 保存できない環境(プライベートモード等)では、起動中のメモリ上だけで動く。

const Store = (() => {
  const KEY = "uscpa_app_v1";
  // 単語カードの復習間隔(Leitner式)。index = box(1〜5)、値 = 次回までの日数
  const BOX_DAYS = [0, 0, 1, 3, 7, 16];

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function addDays(dateStr, n) {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function defaults() {
    return {
      q: {}, // { [questionId]: { n, ok, last: bool, flag: bool, ts } }
      cards: {}, // { [cardId]: { box, due, first } } first = 初めて覚えた日
      notes: {}, // { [chapterId]: 'YYYY-MM-DD' } 講義ノートを読了した日
      tbs: {}, // { [tbsId]: { best, last, n } } 正答率(0〜1)
      study: {}, // { 'YYYY-MM-DD': { [sectionId]: seconds } }
      history: [], // 演習セッションの結果(新しい順、最大200件)
      mocks: [], // 模擬試験の結果(新しい順、最大50件)
      plan: { discipline: "BAR", examDates: {}, targetHours: 1200, dailyMin: 120 },
      prefs: { showJa: false, newPerDay: 20 },
      last: null, // 最後に開いた章 { chapter, tab }
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      const base = defaults();
      return Object.assign(base, parsed, {
        plan: Object.assign(base.plan, parsed.plan || {}),
        prefs: Object.assign(base.prefs, parsed.prefs || {}),
      });
    } catch (e) {
      return defaults();
    }
  }

  // 保存のたびに呼ぶ処理(自動バックアップなど)
  const saveHooks = [];
  function save() {
    state.savedAt = Date.now();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // 保存できない環境では今回の起動中のみ有効
    }
    saveHooks.forEach((fn) => {
      try {
        fn();
      } catch (e) {}
    });
  }
  const onSave = (fn) => saveHooks.push(fn);
  // 記録が空(学習の形跡なし)か
  const isEmpty = () => !Object.keys(state.q).length && !Object.keys(state.cards).length && !Object.keys(state.study).length;

  // ---- MC問題 ----
  function answer(qid, ok) {
    const r = state.q[qid] || { n: 0, ok: 0, last: null, flag: false };
    r.n += 1;
    if (ok) r.ok += 1;
    r.last = ok;
    // 正解したら「間違えた理由」は消す(いま間違えている問題の傾向だけを見る)
    if (ok) delete r.why;
    r.ts = Date.now();
    state.q[qid] = r;
    save();
  }

  function toggleFlag(qid) {
    const r = state.q[qid] || { n: 0, ok: 0, last: null, flag: false };
    r.flag = !r.flag;
    state.q[qid] = r;
    save();
    return r.flag;
  }

  const qRec = (qid) => state.q[qid];
  // 間違えた理由(know=知識不足, calc=計算ミス, read=英文の読み違い, slip=うっかり)
  function setWhy(qid, why) {
    const r = state.q[qid];
    if (!r) return;
    if (why) r.why = why;
    else delete r.why;
    save();
  }
  // 苦手問題:直近で間違えた or 要復習フラグ
  const isWeak = (qid) => {
    const r = state.q[qid];
    return !!r && (r.last === false || r.flag);
  };

  // ---- 単語カード ----
  function reviewCard(cid, grade) {
    // grade: 0 = わからない, 1 = あいまい, 2 = わかった
    const r = state.cards[cid] || { box: 1, due: today(), first: today() };
    if (grade === 0) r.box = 1;
    else if (grade === 2) r.box = Math.min(5, r.box + 1);
    r.due = addDays(today(), grade === 0 ? 0 : grade === 1 ? 1 : BOX_DAYS[r.box]);
    state.cards[cid] = r;
    save();
  }
  const cardRec = (cid) => state.cards[cid];
  const isCardDue = (cid) => {
    const r = state.cards[cid];
    return !r || r.due <= today();
  };
  // 初めて見たカードの枚数(今日)。新しいカードは1日に prefs.newPerDay 枚までに抑える
  const newCardsToday = () => Object.values(state.cards).filter((r) => r.first === today()).length;
  // 復習期日が来た、一度は覚えたカード
  const isCardReviewDue = (cid) => {
    const r = state.cards[cid];
    return !!r && r.due <= today();
  };
  const isCardMastered = (cid) => {
    const r = state.cards[cid];
    return !!r && r.box >= 4;
  };

  // ---- 講義ノート / TBS ----
  function markNote(chId, done) {
    if (done) state.notes[chId] = today();
    else delete state.notes[chId];
    save();
  }
  const noteRead = (chId) => !!state.notes[chId];

  function recordTbs(id, score) {
    const r = state.tbs[id] || { best: 0, last: 0, n: 0 };
    r.n += 1;
    r.last = score;
    r.best = Math.max(r.best, score);
    state.tbs[id] = r;
    save();
  }
  const tbsRec = (id) => state.tbs[id];

  // ---- 学習時間 ----
  function addStudy(section, secs) {
    const d = today();
    state.study[d] = state.study[d] || {};
    state.study[d][section] = (state.study[d][section] || 0) + secs;
    save();
  }

  function studySeconds(filter) {
    let total = 0;
    Object.entries(state.study).forEach(([date, bySec]) => {
      if (filter && filter.date && date !== filter.date) return;
      Object.entries(bySec).forEach(([sec, s]) => {
        if (filter && filter.section && sec !== filter.section) return;
        total += s;
      });
    });
    return total;
  }

  // 最後に学習した日(1分以上)。一度も無ければ null
  function lastStudyDate() {
    const ds = Object.keys(state.study).filter((d) => Object.values(state.study[d]).some((x) => x >= 60)).sort();
    return ds.length ? ds[ds.length - 1] : null;
  }

  function streak() {
    let n = 0;
    let d = today();
    // 今日まだ学習していなくても、昨日まで続いていれば連続記録は途切れていない扱い
    if (!state.study[d]) d = addDays(d, -1);
    while (state.study[d] && Object.values(state.study[d]).some((s) => s >= 60)) {
      n += 1;
      d = addDays(d, -1);
    }
    return n;
  }

  // ---- 記録 ----
  function pushHistory(entry) {
    state.history.unshift(Object.assign({ date: today(), ts: Date.now() }, entry));
    state.history = state.history.slice(0, 200);
    save();
  }

  function pushMock(entry) {
    state.mocks.unshift(Object.assign({ date: today(), ts: Date.now() }, entry));
    state.mocks = state.mocks.slice(0, 50);
    save();
  }

  function setPlan(patch) {
    Object.assign(state.plan, patch);
    save();
  }

  function setPref(k, v) {
    state.prefs[k] = v;
    save();
  }

  function setLast(chapter, tab) {
    state.last = { chapter, tab };
    save();
  }

  function exportJson() {
    return JSON.stringify(state, null, 1);
  }

  function importJson(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !parsed.q) throw new Error("形式が正しくありません");
    localStorage.setItem(KEY, JSON.stringify(parsed));
    state = load();
  }

  function reset() {
    state = defaults();
    save();
  }

  return {
    get: () => state,
    today,
    addDays,
    answer,
    toggleFlag,
    qRec,
    setWhy,
    onSave,
    isEmpty,
    isWeak,
    reviewCard,
    cardRec,
    isCardDue,
    isCardReviewDue,
    newCardsToday,
    isCardMastered,
    markNote,
    noteRead,
    recordTbs,
    tbsRec,
    addStudy,
    studySeconds,
    streak,
    lastStudyDate,
    pushHistory,
    pushMock,
    setPlan,
    setPref,
    setLast,
    exportJson,
    importJson,
    reset,
  };
})();

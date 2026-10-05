// 特別コース(30ラリーの会話コース)の一覧・コース画面・読み込み。
// コース本体は courses/cNNN.json に分けてあり、開くときに読み込む(起動を軽くするため)。
const Courses = (() => {
  const { el } = UI;
  const cache = {};

  function index() {
    return typeof COURSE_INDEX === "undefined" ? [] : COURSE_INDEX;
  }

  function doneCount(entry) {
    return entry.lessons.filter((id) => AppState.isLessonCompleted(id)).length;
  }

  // 本編(UNITS)に入っている特別コース(貿易実務 30ラリー特訓)も一覧に並べる
  function builtinEntries() {
    return UNITS.filter((u) => u.special).map((u) => ({
      id: u.id,
      builtin: true,
      cat: "貿易・調達",
      icon: u.icon,
      title: u.title,
      desc: u.description,
      lessons: u.lessons.map((l) => l.id),
    }));
  }

  function allEntries() {
    return builtinEntries().concat(index());
  }

  async function load(id) {
    if (cache[id]) return cache[id];
    const v = typeof APP_VERSION !== "undefined" ? APP_VERSION : "";
    const res = await fetch(`courses/${id}.json?v=${encodeURIComponent(v)}`);
    if (!res.ok) throw new Error(`コースを読み込めませんでした(${res.status})`);
    const course = await res.json();
    // ペアマッチ・穴埋めなどの自動生成問題を追加(ダミー単語は全ユニットから選ぶ)
    if (typeof LessonExtras !== "undefined") {
      const holder = new Array(Math.max(0, UNITS.length - 1));
      holder.push({ id: course.id, lessons: course.lessons });
      LessonExtras.augment(holder);
    }
    cache[id] = course;
    return course;
  }

  // ---------- 一覧 ----------
  let filter = "すべて";

  function catalog(onBack) {
    const back = onBack || (() => App.go("home"));
    const screen = UI.screen("screen--sub screen--courses");
    screen.appendChild(UI.subHeader("特別コース", back));
    const body = el("div", "sub-body");

    const entries = allEntries();
    const finished = entries.filter((e) => doneCount(e) === e.lessons.length).length;
    const hero = el("div", "co-hero");
    hero.appendChild(el("div", "co-hero-title", "30ラリー会話コース"));
    hero.appendChild(el("div", "co-hero-sub", `ビジネスと生活の場面を、30往復の会話で通しで練習。全${entries.length}コース・修了 ${finished}`));
    body.appendChild(hero);

    // 続きから
    const lastId = AppState.getPref("lastCourse", null);
    const last = entries.find((e) => e.id === lastId);
    if (last && doneCount(last) < last.lessons.length) {
      const resume = UI.button("co-resume", "", () => open(last.id, () => catalog(back)));
      resume.appendChild(el("span", "co-resume-icon", last.icon));
      const t = el("span", "co-resume-text");
      t.appendChild(el("span", "co-resume-kicker", "続きから"));
      t.appendChild(el("span", "co-resume-title", last.title));
      resume.appendChild(t);
      resume.appendChild(el("span", "co-resume-count", `${doneCount(last)}/${last.lessons.length}`));
      body.appendChild(resume);
    }

    const cats = ["すべて"].concat(Array.from(new Set(entries.map((e) => e.cat))));
    const chips = el("div", "co-chips");
    cats.forEach((c) => {
      chips.appendChild(
        UI.button("co-chip" + (c === filter ? " is-on" : ""), c, () => {
          filter = c;
          catalog(back);
        })
      );
    });
    body.appendChild(chips);

    const list = el("div", "co-list");
    entries
      .filter((e) => filter === "すべて" || e.cat === filter)
      .forEach((e) => {
        const done = doneCount(e);
        const card = UI.button("co-card" + (done === e.lessons.length ? " is-done" : ""), "", () => open(e.id, () => catalog(back)));
        card.appendChild(el("span", "co-card-icon", e.icon));
        const mid = el("span", "co-card-mid");
        mid.appendChild(el("span", "co-card-cat", e.cat));
        mid.appendChild(el("span", "co-card-title", e.title));
        mid.appendChild(el("span", "co-card-desc", e.desc));
        const bar = el("span", "co-card-bar");
        const fill = el("span", "co-card-fill");
        fill.style.width = `${(done / e.lessons.length) * 100}%`;
        bar.appendChild(fill);
        mid.appendChild(bar);
        card.appendChild(mid);
        card.appendChild(el("span", "co-card-count", done === e.lessons.length ? "✓" : `${done}/${e.lessons.length}`));
        list.appendChild(card);
      });
    body.appendChild(list);
    screen.appendChild(body);
  }

  // ---------- コース画面(6レッスン) ----------
  async function open(id, onBack) {
    AppState.setPref("lastCourse", id);
    const entry = allEntries().find((e) => e.id === id);
    if (!entry) return;
    const screen = UI.screen("screen--sub screen--course");
    screen.appendChild(UI.subHeader(entry.title, onBack));
    const body = el("div", "sub-body");
    screen.appendChild(body);

    let lessons;
    let speakers = null;
    if (entry.builtin) {
      lessons = UNITS.find((u) => u.id === id).lessons;
      const first = lessons[0].exercises.find((e) => e.speakers);
      speakers = first ? first.speakers : null;
    } else {
      body.appendChild(el("div", "co-loading", "読み込み中…"));
      try {
        const course = await load(id);
        lessons = course.lessons;
        speakers = course.speakers;
      } catch (err) {
        UI.clear(body);
        body.appendChild(el("div", "co-loading", err.message || "読み込みに失敗しました。通信状況を確認してください"));
        return;
      }
      UI.clear(body);
    }

    const head = el("div", "co-head");
    head.appendChild(el("div", "co-head-icon", entry.icon));
    head.appendChild(el("div", "co-head-desc", entry.desc));
    if (speakers) {
      const cast = el("div", "co-cast");
      ["A", "B"].forEach((k) => {
        const p = el("div", "co-cast-person");
        p.appendChild(el("span", "co-cast-icon", speakers[k].icon));
        p.appendChild(el("span", "co-cast-name", `${speakers[k].name}(${speakers[k].role})`));
        cast.appendChild(p);
      });
      head.appendChild(cast);
    }
    body.appendChild(head);

    lessons.forEach((lesson, i) => {
      const done = AppState.isLessonCompleted(lesson.id);
      const unlocked = done || i === 0 || AppState.isLessonCompleted(lessons[i - 1].id);
      const row = UI.button("co-lesson" + (done ? " is-done" : unlocked ? " is-open" : " is-locked"), "", () => {
        if (!unlocked) {
          UI.toast("前のレッスンをクリアすると挑戦できます");
          return;
        }
        App.runLesson(lesson, { onExit: () => open(id, onBack) });
      });
      row.appendChild(el("span", "co-lesson-num", done ? "★" : unlocked ? String(i + 1) : "🔒"));
      const t = el("span", "co-lesson-text");
      t.appendChild(el("span", "co-lesson-title", lesson.title));
      t.appendChild(el("span", "co-lesson-sub", `${lesson.exercises.length}問`));
      row.appendChild(t);
      body.appendChild(row);
    });
  }

  return { catalog, open, count: () => allEntries().length };
})();

// アプリ全体のルーティングと画面描画を担当するメインスクリプト

(function () {
  const appRoot = document.getElementById("app");

  // ユニット/レッスンをフラットな配列にして順序管理(アンロック判定に使う)
  const FLAT_LESSONS = [];
  UNITS.forEach((unit) => {
    unit.lessons.forEach((lesson) => {
      FLAT_LESSONS.push({ unit, lesson });
    });
  });

  function lessonIndexById(lessonId) {
    return FLAT_LESSONS.findIndex((x) => x.lesson.id === lessonId);
  }

  function isLessonUnlocked(lessonId) {
    const idx = lessonIndexById(lessonId);
    if (idx <= 0) return true;
    const prevLesson = FLAT_LESSONS[idx - 1].lesson;
    return AppState.isLessonCompleted(prevLesson.id);
  }

  const LESSON_BY_ID = {};
  FLAT_LESSONS.forEach((x) => {
    LESSON_BY_ID[x.lesson.id] = x.lesson;
  });

  // key は "lessonId#exerciseIndex" 形式。苦手問題の記録/復元に使う
  function exerciseByKey(key) {
    const [lessonId, idxStr] = key.split("#");
    const lesson = LESSON_BY_ID[lessonId];
    if (!lesson) return null;
    const exercise = lesson.exercises[Number(idxStr)];
    if (!exercise) return null;
    return { exercise, lessonTitle: lesson.title };
  }

  // ---------------- レベル/ロードマップ ----------------
  function getLevelLessons(levelDef) {
    const lessons = [];
    levelDef.unitIds.forEach((uid) => {
      const unit = UNITS.find((u) => u.id === uid);
      if (unit) lessons.push(...unit.lessons);
    });
    return lessons;
  }

  function getLevelStats(levelDef) {
    const lessons = getLevelLessons(levelDef);
    const total = lessons.length;
    const completed = lessons.filter((l) => AppState.isLessonCompleted(l.id)).length;
    const percent = total > 0 ? completed / total : 0;
    return { total, completed, percent };
  }

  // レベルごとの状態(cleared/current/upcoming/future)を判定する。
  // 実装済みレベルのうち最初に未クリアのものを「current」とする
  function getLevelStatuses() {
    let currentAssigned = false;
    return LEVELS.map((lv) => {
      const stats = getLevelStats(lv);
      let status;
      if (!lv.implemented) {
        status = "future";
      } else if (stats.total > 0 && stats.percent >= 1) {
        status = "cleared";
      } else if (!currentAssigned) {
        status = "current";
        currentAssigned = true;
      } else {
        status = "upcoming";
      }
      return Object.assign({}, lv, { stats, status });
    });
  }

  function getCurrentLevel() {
    const statuses = getLevelStatuses();
    return statuses.find((s) => s.status === "current") || statuses[statuses.length - 1];
  }

  // エクササイズから代表的な単語・フレーズを抽出する(語彙数の概算に使用)
  function flashcardKey(deckId, index) {
    return `${deckId}#${index}`;
  }

  function extractVocabTerms(exercise) {
    switch (exercise.type) {
      case "listening_choice":
        return [exercise.audioText];
      case "translate_choice":
      case "speaking":
      case "writing_pinyin":
        return [exercise.hanzi];
      case "writing_cn":
        return [exercise.answer];
      default:
        return [];
    }
  }

  // 完了したレッスン + マスターした単語カードを対象に、実際に practice した
  // 語彙・フレーズの異なり数を数える(完全なHSK語彙カウントではなく概算)
  function getVocabLearnedCount() {
    const set = new Set();
    FLAT_LESSONS.forEach(({ lesson }) => {
      if (!AppState.isLessonCompleted(lesson.id)) return;
      lesson.exercises.forEach((ex) => extractVocabTerms(ex).forEach((t) => set.add(t)));
    });
    VOCAB_DECKS.forEach((deck) => {
      deck.words.forEach((w, i) => {
        if (AppState.getFlashcardEntry(flashcardKey(deck.id, i)).mastered) set.add(w.hanzi);
      });
    });
    NEWS_ARTICLES.forEach((article) => {
      if (!AppState.isArticleRead(article.id)) return;
      article.vocab.forEach((w) => set.add(w.hanzi));
    });
    return set.size;
  }

  function getVocabTotalInApp() {
    const set = new Set();
    FLAT_LESSONS.forEach(({ lesson }) => {
      lesson.exercises.forEach((ex) => extractVocabTerms(ex).forEach((t) => set.add(t)));
    });
    VOCAB_DECKS.forEach((deck) => deck.words.forEach((w) => set.add(w.hanzi)));
    NEWS_ARTICLES.forEach((article) => article.vocab.forEach((w) => set.add(w.hanzi)));
    return set.size;
  }

  function renderLevelBanner(container) {
    const current = getCurrentLevel();
    const goal = LEVELS.find((l) => l.id === GOAL_LEVEL_ID);

    const banner = el("button", "level-banner");
    banner.type = "button";
    const left = el("div", "level-banner-text");
    left.appendChild(el("div", "level-banner-current", `📍 現在のレベル: ${current.label}(${current.hskLabel})`));
    left.appendChild(el("div", "level-banner-goal", `🎯 ゴール: ${goal.label}・${goal.hskLabel}(ビジネス中国語)`));
    banner.appendChild(left);
    banner.appendChild(el("div", "level-banner-arrow", "›"));
    banner.addEventListener("click", () => renderRoadmap(renderHome));

    container.appendChild(banner);
  }

  function formatHours(hours) {
    return hours >= 100 ? Math.round(hours).toLocaleString() : hours.toFixed(1);
  }

  // 「ビジネス中国語ゴール」までの現実的な距離を、レッスン完了率ではなく
  // 学習時間・語彙数という実数で示す(アプリ内進捗の水増しを避けるため)
  function renderGoalDistanceCard() {
    const state = AppState.get();
    const goal = LEVELS.find((l) => l.id === GOAL_LEVEL_ID);
    const hoursStudied = state.totalStudySeconds / 3600;
    const vocabLearned = getVocabLearnedCount();
    const vocabInApp = getVocabTotalInApp();

    const card = el("div", "goal-distance-card");
    card.appendChild(el("div", "goal-distance-title", "🎯 ゴールまでの現在地(実数ベース)"));

    const block1 = el("div", "goal-distance-block");
    const head1 = el("div", "goal-distance-row");
    head1.appendChild(el("div", "goal-distance-label", "学習時間"));
    head1.appendChild(el("div", "goal-distance-value", `${formatHours(hoursStudied)}h / ${goal.targetHours.toLocaleString()}h`));
    block1.appendChild(head1);
    block1.appendChild(barOuterInner(Math.min(1, hoursStudied / goal.targetHours)));
    card.appendChild(block1);

    const block2 = el("div", "goal-distance-block");
    const head2 = el("div", "goal-distance-row");
    head2.appendChild(el("div", "goal-distance-label", "学習した語彙・フレーズ"));
    head2.appendChild(el("div", "goal-distance-value", `${vocabLearned} / ${goal.targetVocab.toLocaleString()}語`));
    block2.appendChild(head2);
    block2.appendChild(barOuterInner(Math.min(1, vocabLearned / goal.targetVocab)));
    card.appendChild(block2);

    card.appendChild(
      el(
        "div",
        "goal-distance-app-note",
        `現在アプリに収録済みの語彙: ${vocabInApp}語(全12ユニット分)。アプリの学習だけでゴールの語彙量に届くことはありません。`
      )
    );
    card.appendChild(el("div", "goal-distance-disclaimer", LEVEL_BENCHMARK_NOTE));

    return card;
  }

  function barOuterInner(ratio) {
    const outer = el("div", "goal-distance-bar-outer");
    const inner = el("div", "goal-distance-bar-inner");
    inner.style.width = `${ratio * 100}%`;
    outer.appendChild(inner);
    return outer;
  }

  function renderRoadmap(onBack = renderHome) {
    clear(appRoot);
    const screen = el("div", "screen screen--roadmap");
    renderTopBar(screen, { showBack: true, onBack });

    const intro = el("div", "roadmap-intro");
    intro.appendChild(el("h1", "roadmap-title", "ロードマップ"));
    intro.appendChild(
      el("p", "roadmap-sub", "ゴールは「ビジネス中国語が話せる」レベル(HSK6相当)。今の自分の立ち位置を確認しよう。")
    );
    screen.appendChild(intro);
    screen.appendChild(renderGoalDistanceCard());

    const STATUS_LABELS = { cleared: "✅ クリア", current: "📍 今ここ", upcoming: "これから", future: "近日追加予定" };

    const list = el("div", "roadmap-list");
    getLevelStatuses().forEach((lv) => {
      const card = el("div", `roadmap-level roadmap-level--${lv.status}`);
      if (lv.id === GOAL_LEVEL_ID) card.classList.add("roadmap-level--goal");

      const header = el("div", "roadmap-level-header");
      header.appendChild(el("div", "roadmap-level-label", lv.label + (lv.id === GOAL_LEVEL_ID ? " 🎯" : "")));
      header.appendChild(el("div", "roadmap-level-hsk", lv.hskLabel));
      card.appendChild(header);
      card.appendChild(el("div", "roadmap-level-desc", lv.description));

      if (lv.implemented) {
        const barOuter = el("div", "roadmap-level-bar-outer");
        const barInner = el("div", "roadmap-level-bar-inner");
        barInner.style.width = `${lv.stats.percent * 100}%`;
        barOuter.appendChild(barInner);
        card.appendChild(barOuter);
        card.appendChild(el("div", "roadmap-level-progress-text", `アプリ内進捗: ${lv.stats.completed}/${lv.stats.total} レッスン完了`));
      } else {
        card.appendChild(el("div", "roadmap-level-future-badge", "レッスン追加予定"));
      }

      card.appendChild(
        el(
          "div",
          "roadmap-level-benchmark",
          `目安(累計): 語彙${lv.targetVocab.toLocaleString()}語・学習時間${lv.targetHours.toLocaleString()}h`
        )
      );
      card.appendChild(el("div", "roadmap-level-status", STATUS_LABELS[lv.status]));
      list.appendChild(card);
    });
    screen.appendChild(list);

    appRoot.appendChild(screen);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  // ---------------- ヘッダー(共通) ----------------
  function renderTopBar(container, { showBack = false, onBack = null } = {}) {
    const state = AppState.get();
    const bar = el("div", "topbar");

    if (showBack) {
      const backBtn = el("button", "icon-btn", "✕");
      backBtn.type = "button";
      backBtn.addEventListener("click", onBack);
      bar.appendChild(backBtn);
    } else {
      bar.appendChild(el("div", "brand", "汉语学习 中国語学習"));
    }

    const stats = el("div", "topbar-stats");
    const streak = el("div", "stat-pill stat-pill--streak", `🔥 ${state.streak}`);
    const xp = el("div", "stat-pill stat-pill--xp", `💎 ${state.xp}`);
    stats.appendChild(streak);
    stats.appendChild(xp);
    bar.appendChild(stats);

    container.appendChild(bar);
  }

  // ---------------- デイリーゴール ----------------
  function renderDailyGoal(container) {
    const state = AppState.get();
    const goal = AppState.getDailyGoal();
    const progress = Math.min(1, state.dailyXp / goal);

    const box = el("div", "daily-goal");
    const header = el("div", "daily-goal-header");
    header.appendChild(el("div", "daily-goal-label", "🎯 今日の目標"));
    header.appendChild(el("div", "daily-goal-value", `${Math.min(state.dailyXp, goal)} / ${goal} XP`));
    box.appendChild(header);

    const barOuter = el("div", "daily-goal-bar-outer");
    const barInner = el("div", "daily-goal-bar-inner");
    barInner.style.width = `${progress * 100}%`;
    barOuter.appendChild(barInner);
    box.appendChild(barOuter);

    let message;
    if (state.dailyXp >= goal) {
      message = "✅ 今日の目標達成!お見事です";
    } else if (state.dailyXp === 0) {
      message = state.streak > 0 ? `🔥 継続${state.streak}日目!今日も1レッスン進めよう` : "今日から中国語学習をはじめよう!";
    } else {
      message = `あと${goal - state.dailyXp}XPで今日の目標達成!`;
    }
    box.appendChild(el("div", "daily-goal-message", message));

    box.appendChild(renderStreakCalendar(state));

    container.appendChild(box);
  }

  const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

  function renderStreakCalendar(state) {
    const row = el("div", "streak-calendar");
    const studySet = new Set(state.studyDates);
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const studied = studySet.has(key);
      const isToday = i === 0;

      const cell = el("div", "streak-cell" + (isToday ? " streak-cell--today" : ""));
      cell.appendChild(el("div", "streak-cell-day", WEEKDAY_LABELS[d.getDay()]));
      cell.appendChild(el("div", "streak-cell-dot" + (studied ? " streak-cell-dot--on" : ""), studied ? "🔥" : ""));
      row.appendChild(cell);
    }
    return row;
  }

  // ---------------- 苦手復習カード ----------------
  function renderWeakReviewCard(container) {
    const count = AppState.weakCount();
    if (count === 0) return;

    const card = el("button", "weak-review-card");
    card.type = "button";
    const textWrap = el("div");
    textWrap.appendChild(el("div", "weak-review-title", "🔁 苦手を復習する"));
    textWrap.appendChild(el("div", "weak-review-sub", `間違えた問題が ${count} 問あります`));
    card.appendChild(textWrap);
    card.appendChild(el("div", "weak-review-arrow", "›"));
    card.addEventListener("click", startWeakReview);

    container.appendChild(card);
  }

  function startWeakReview() {
    const keys = AppState.getWeakKeys(10);
    const items = keys.map((key) => ({ key, found: exerciseByKey(key) })).filter((x) => x.found);
    if (items.length === 0) return;

    const lesson = {
      id: "weak_review",
      title: "苦手復習",
      exercises: items.map((x) => x.found.exercise),
    };
    runLesson(lesson, { keys: items.map((x) => x.key), isReview: true });
  }

  // ---------------- ホーム画面(スキルツリー) ----------------
  function renderHome() {
    AppState.refreshDaily();
    clear(appRoot);
    const screen = el("div", "screen screen--home");
    renderTopBar(screen);
    renderLevelBanner(screen);
    renderDailyGoal(screen);
    renderWeakReviewCard(screen);

    const path = el("div", "skill-path");

    UNITS.forEach((unit) => {
      const unitHeader = el("div", "unit-header");
      const unitTitleWrap = el("div", "unit-title-wrap");
      unitTitleWrap.appendChild(el("div", "unit-icon", unit.icon));
      const unitTexts = el("div");
      unitTexts.appendChild(el("div", "unit-title", unit.title));
      unitTexts.appendChild(el("div", "unit-desc", unit.description));
      unitTitleWrap.appendChild(unitTexts);
      unitHeader.appendChild(unitTitleWrap);
      path.appendChild(unitHeader);

      const lessonRow = el("div", "lesson-row");
      unit.lessons.forEach((lesson, idx) => {
        const unlocked = isLessonUnlocked(lesson.id);
        const completed = AppState.isLessonCompleted(lesson.id);
        const stars = AppState.getLessonStars(lesson.id);

        const node = el("div", "lesson-node");
        if (completed) node.classList.add("lesson-node--completed");
        else if (unlocked) node.classList.add("lesson-node--unlocked");
        else node.classList.add("lesson-node--locked");

        const circle = el("button", "lesson-circle");
        circle.type = "button";
        circle.textContent = completed ? "★" : unlocked ? String(idx + 1) : "🔒";
        circle.disabled = !unlocked;
        circle.addEventListener("click", () => startLesson(lesson.id));
        node.appendChild(circle);
        node.appendChild(el("div", "lesson-title", lesson.title));

        if (completed) {
          const starsRow = el("div", "lesson-stars");
          for (let i = 0; i < 3; i++) {
            starsRow.appendChild(el("span", i < stars ? "star star--on" : "star", "★"));
          }
          node.appendChild(starsRow);
        }

        lessonRow.appendChild(node);
      });
      path.appendChild(lessonRow);
    });

    screen.appendChild(path);
    screen.appendChild(renderBottomNav("study"));

    appRoot.appendChild(screen);
  }

  // 下部タブ(学習・練習・発見・トーク・マイページ)
  function renderBottomNav(activeId) {
    const nav = el("div", "bottom-nav");
    const tabs = [
      { id: "study", label: "学習", icon: Icons.navStudy, route: "home" },
      { id: "practice", label: "練習", icon: Icons.navPractice, route: "practice" },
      { id: "discover", label: "発見", icon: Icons.navDiscover, route: "discover" },
      { id: "talk", label: "トーク", icon: Icons.navTalk, route: "talk" },
      { id: "mypage", label: "マイページ", icon: Icons.navMe, route: "mypage" },
    ];
    tabs.forEach((tab) => {
      const btn = el("button", "nav-tab" + (tab.id === activeId ? " nav-tab--active" : ""));
      btn.type = "button";
      const icon = el("span", "nav-tab-icon");
      icon.innerHTML = tab.icon;
      btn.appendChild(icon);
      btn.appendChild(el("span", "nav-tab-label", tab.label));
      btn.addEventListener("click", () => go(tab.route));
      nav.appendChild(btn);
    });
    return nav;
  }

  function getBadgeDefs(state, completedLessons, totalLessons) {
    const best = Math.max(state.bestStreak || 0, state.streak || 0);
    return [
      { icon: "🎓", label: "はじめの一歩", unlocked: completedLessons >= 1 },
      { icon: "🔥", label: "3日連続", unlocked: best >= 3 },
      { icon: "🚀", label: "7日連続", unlocked: best >= 7 },
      { icon: "🏆", label: "30日連続", unlocked: best >= 30 },
      { icon: "🏅", label: "5レッスン修了", unlocked: completedLessons >= 5 },
      { icon: "👑", label: "全レッスン制覇", unlocked: totalLessons > 0 && completedLessons >= totalLessons },
      { icon: "💎", label: "500XP達成", unlocked: state.xp >= 500 },
    ];
  }

  function getBadges() {
    const completed = FLAT_LESSONS.filter((x) => AppState.isLessonCompleted(x.lesson.id)).length;
    return getBadgeDefs(AppState.get(), completed, FLAT_LESSONS.length);
  }

  // ---------------- 単語カード(フラッシュカード) ----------------
  const FLASHCARD_SESSION_SIZE = 15;

  function getDeckStats(deck) {
    let mastered = 0;
    let due = 0;
    const today = todayStrForFlashcards();
    deck.words.forEach((w, i) => {
      const entry = AppState.getFlashcardEntry(flashcardKey(deck.id, i));
      if (entry.mastered) mastered++;
      if (!entry.dueDate || entry.dueDate <= today) due++;
    });
    return { total: deck.words.length, mastered, due };
  }

  function todayStrForFlashcards() {
    return new Date().toISOString().slice(0, 10);
  }

  function renderFlashcardHome() {
    clear(appRoot);
    const screen = el("div", "screen screen--flashcards");
    renderTopBar(screen, { showBack: true, onBack: () => go("discover") });

    const intro = el("div", "flashcard-intro");
    intro.appendChild(el("h1", "flashcard-intro-title", "🎴 単語帳"));
    intro.appendChild(
      el("p", "flashcard-intro-sub", "電車移動中など、すきま時間にタップだけでサクサク復習できます。")
    );
    screen.appendChild(intro);

    const list = el("div", "deck-list");
    VOCAB_DECKS.forEach((deck) => {
      const stats = getDeckStats(deck);
      const card = el("button", "deck-card");
      card.type = "button";
      const top = el("div", "deck-card-top");
      top.appendChild(el("div", "deck-card-icon", deck.icon));
      const texts = el("div");
      texts.appendChild(el("div", "deck-card-title", deck.label));
      texts.appendChild(el("div", "deck-card-desc", deck.description));
      top.appendChild(texts);
      card.appendChild(top);

      const barOuter = el("div", "deck-card-bar-outer");
      const barInner = el("div", "deck-card-bar-inner");
      barInner.style.width = `${(stats.mastered / stats.total) * 100}%`;
      barOuter.appendChild(barInner);
      card.appendChild(barOuter);

      const statsRow = el("div", "deck-card-stats");
      statsRow.appendChild(el("span", null, `習得 ${stats.mastered}/${stats.total}語`));
      if (stats.due > 0) {
        statsRow.appendChild(el("span", "deck-card-due", `復習 ${stats.due}語`));
      }
      card.appendChild(statsRow);

      card.addEventListener("click", () => startFlashcardSession(deck.id));
      list.appendChild(card);
    });
    screen.appendChild(list);

    screen.appendChild(renderBottomNav("discover"));
    appRoot.appendChild(screen);
  }

  function startFlashcardSession(deckId) {
    const deck = VOCAB_DECKS.find((d) => d.id === deckId);
    if (!deck) return;
    const today = todayStrForFlashcards();

    const withEntries = deck.words.map((w, i) => ({
      word: w,
      key: flashcardKey(deckId, i),
      entry: AppState.getFlashcardEntry(flashcardKey(deckId, i)),
    }));

    const due = withEntries
      .filter((x) => x.entry.dueDate && x.entry.dueDate <= today)
      .sort((a, b) => a.entry.box - b.entry.box);
    const fresh = withEntries.filter((x) => !x.entry.dueDate);

    const queue = due.concat(fresh).slice(0, FLASHCARD_SESSION_SIZE);

    if (queue.length === 0) {
      alert("このデッキは今復習する単語がありません。また後で来てください!");
      return;
    }

    runFlashcardSession(deck, queue);
  }

  function runFlashcardSession(deck, queue) {
    let index = 0;
    let reviewedCount = 0;
    const startedAt = Date.now();
    let timeCommitted = false;

    function commitSessionTime() {
      if (timeCommitted) return;
      timeCommitted = true;
      AppState.addStudySeconds((Date.now() - startedAt) / 1000);
      if (reviewedCount > 0) AppState.markStudiedToday();
    }

    function exitToDecks() {
      commitSessionTime();
      renderFlashcardHome();
    }

    function renderCardScreen() {
      clear(appRoot);
      const screen = el("div", "screen screen--flashcard-session");

      const header = el("div", "lesson-header");
      const closeBtn = el("button", "icon-btn", "✕");
      closeBtn.type = "button";
      closeBtn.addEventListener("click", exitToDecks);
      header.appendChild(closeBtn);

      const progressOuter = el("div", "progress-outer");
      const progressInner = el("div", "progress-inner");
      progressInner.style.width = `${(index / queue.length) * 100}%`;
      progressOuter.appendChild(progressInner);
      header.appendChild(progressOuter);
      header.appendChild(el("div", "hearts-display", `${index + 1}/${queue.length}`));
      screen.appendChild(header);

      const { word } = queue[index];

      const cardWrap = el("div", "flashcard-wrap");
      const card = el("div", "flashcard");
      card.appendChild(el("div", "flashcard-hanzi", word.hanzi));
      card.appendChild(el("div", "flashcard-pinyin", word.pinyin));
      card.appendChild(el("div", "flashcard-meaning", word.meaning));

      const playBtn = el("button", "play-btn", "🔊");
      playBtn.type = "button";
      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        Speech.speak(word.hanzi).catch(() => {});
      });
      card.appendChild(playBtn);

      cardWrap.appendChild(card);
      screen.appendChild(cardWrap);

      setTimeout(() => Speech.speak(word.hanzi).catch(() => {}), 250);

      const footer = el("div", "lesson-footer flashcard-footer");
      const dontKnowBtn = el("button", "flashcard-btn flashcard-btn--no", "❌ もう一度");
      dontKnowBtn.type = "button";
      const knowBtn = el("button", "flashcard-btn flashcard-btn--yes", "✅ 覚えた");
      knowBtn.type = "button";
      dontKnowBtn.addEventListener("click", () => answer(false));
      knowBtn.addEventListener("click", () => answer(true));
      footer.appendChild(dontKnowBtn);
      footer.appendChild(knowBtn);
      screen.appendChild(footer);

      function answer(knew) {
        AppState.reviewFlashcard(queue[index].key, knew);
        AppState.addXp(2);
        reviewedCount++;
        index++;
        if (index >= queue.length) {
          commitSessionTime();
          renderFlashcardSummary(deck, reviewedCount);
        } else {
          renderCardScreen();
        }
      }

      appRoot.appendChild(screen);
    }

    renderCardScreen();
  }

  function renderFlashcardSummary(deck, reviewedCount) {
    clear(appRoot);
    const screen = el("div", "screen screen--summary");
    const card = el("div", "summary-card");
    card.appendChild(el("div", "summary-emoji", "🎴"));
    card.appendChild(el("h1", "summary-title", "お疲れさまでした!"));
    card.appendChild(el("p", "summary-sub", `${deck.label} を ${reviewedCount}語 復習しました`));

    const continueBtn = el("button", "primary-btn", "単語帳に戻る");
    continueBtn.type = "button";
    continueBtn.addEventListener("click", renderFlashcardHome);
    card.appendChild(continueBtn);

    screen.appendChild(card);
    appRoot.appendChild(screen);
  }

  // ---------------- 今日のニュース ----------------
  // 静的サイトのためライブ配信のニュースを直接取得することはできず、また
  // 有料記事の無断転載も避けたいので、実在のビジネストレンドを題材に学習用
  // に書き下ろしたオリジナル記事(news.js)を日付でローテーション表示する
  function getTodaysArticles() {
    const dayIndex = Math.floor(Date.now() / 86400000);
    const n = NEWS_ARTICLES.length;
    const startIdx = (dayIndex * 3) % n;
    const picks = [];
    for (let i = 0; i < 3; i++) {
      picks.push(NEWS_ARTICLES[(startIdx + i) % n]);
    }
    return picks;
  }

  function renderNewsHome() {
    clear(appRoot);
    const screen = el("div", "screen screen--news");
    renderTopBar(screen, { showBack: true, onBack: () => go("discover") });

    const intro = el("div", "flashcard-intro");
    intro.appendChild(el("h1", "flashcard-intro-title", "📰 今日のニュース"));
    intro.appendChild(
      el("p", "flashcard-intro-sub", "ビジネストレンドの記事を中国語→日本語で読みながら学習できます。毎日3本入れ替わります。")
    );
    screen.appendChild(intro);

    const list = el("div", "news-list");
    getTodaysArticles().forEach((article) => {
      const read = AppState.isArticleRead(article.id);
      const card = el("button", "news-card" + (read ? " news-card--read" : ""));
      card.type = "button";
      const top = el("div", "news-card-top");
      top.appendChild(el("span", "news-card-category", article.category));
      if (read) top.appendChild(el("span", "news-card-read-badge", "✅ 既読"));
      card.appendChild(top);
      card.appendChild(el("div", "news-card-title-zh", article.titleZh));
      card.appendChild(el("div", "news-card-title-ja", article.titleJa));
      card.addEventListener("click", () => renderArticleReader(article));
      list.appendChild(card);
    });
    screen.appendChild(list);

    screen.appendChild(renderBottomNav("discover"));
    appRoot.appendChild(screen);
  }

  function renderArticleReader(article) {
    clear(appRoot);
    const screen = el("div", "screen screen--article");

    const startedAt = Date.now();
    let timeCommitted = false;
    function commitTime() {
      if (timeCommitted) return;
      timeCommitted = true;
      AppState.addStudySeconds((Date.now() - startedAt) / 1000);
    }

    const header = el("div", "lesson-header");
    const closeBtn = el("button", "icon-btn", "✕");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", () => {
      commitTime();
      renderNewsHome();
    });
    header.appendChild(closeBtn);
    header.appendChild(el("div", "news-card-category", article.category));
    screen.appendChild(header);

    const body = el("div", "article-body");
    body.appendChild(el("h1", "article-title-zh", article.titleZh));
    body.appendChild(el("div", "article-title-ja", article.titleJa));

    article.sentences.forEach((s) => {
      const row = el("div", "article-sentence");
      const zhRow = el("div", "article-sentence-zh-row");
      zhRow.appendChild(el("div", "article-sentence-zh", s.zh));
      const playBtn = el("button", "play-btn", "🔊");
      playBtn.type = "button";
      playBtn.addEventListener("click", () => Speech.speak(s.zh).catch(() => {}));
      zhRow.appendChild(playBtn);
      row.appendChild(zhRow);

      const jaText = el("div", "article-sentence-ja hidden", s.ja);
      const toggleBtn = el("button", "article-toggle-btn", "日本語訳を見る");
      toggleBtn.type = "button";
      toggleBtn.addEventListener("click", () => {
        const hiding = !jaText.classList.contains("hidden");
        jaText.classList.toggle("hidden");
        toggleBtn.textContent = hiding ? "日本語訳を見る" : "訳を隠す";
      });
      row.appendChild(toggleBtn);
      row.appendChild(jaText);
      body.appendChild(row);
    });

    const vocabSection = el("div", "article-vocab-section");
    vocabSection.appendChild(el("div", "article-vocab-heading", "この記事のキーワード"));
    const vocabList = el("div", "article-vocab-list");
    article.vocab.forEach((w) => {
      const chip = el("div", "article-vocab-chip");
      chip.appendChild(el("span", "article-vocab-hanzi", w.hanzi));
      chip.appendChild(el("span", "article-vocab-pinyin", w.pinyin));
      chip.appendChild(el("span", "article-vocab-meaning", w.meaning));
      vocabList.appendChild(chip);
    });
    vocabSection.appendChild(vocabList);
    body.appendChild(vocabSection);

    screen.appendChild(body);

    const footer = el("div", "lesson-footer");
    const alreadyRead = AppState.isArticleRead(article.id);
    const doneBtn = el("button", "primary-btn", alreadyRead ? "読み終えた(既読)" : "読み終えた");
    doneBtn.type = "button";
    doneBtn.addEventListener("click", () => {
      const wasNew = !AppState.isArticleRead(article.id);
      AppState.markArticleRead(article.id);
      if (wasNew) {
        AppState.addXp(15);
        AppState.markStudiedToday();
      }
      commitTime();
      renderNewsHome();
    });
    footer.appendChild(doneBtn);
    screen.appendChild(footer);

    appRoot.appendChild(screen);
  }

  // ---------------- レッスン画面 ----------------
  function startLesson(lessonId) {
    const entry = FLAT_LESSONS.find((x) => x.lesson.id === lessonId);
    if (!entry) return;
    runLesson(entry.lesson);
  }

  // ---------------- レッスン共通UI(ChineseSkill風) ----------------
  // ピンイン・日本語訳の表示ON/OFF(画面右上のトグル)。端末ごとの表示設定なので
  // 学習データとは分けて保存する
  const DISPLAY_KEY = "zh_app_display_v1";
  const display = (() => {
    try {
      return Object.assign({ pinyin: true, translation: true }, JSON.parse(localStorage.getItem(DISPLAY_KEY) || "{}"));
    } catch (e) {
      return { pinyin: true, translation: true };
    }
  })();

  function applyDisplay() {
    document.body.classList.toggle("hide-pinyin", !display.pinyin);
    document.body.classList.toggle("hide-translation", !display.translation);
  }

  function toggleDisplay(key) {
    display[key] = !display[key];
    try {
      localStorage.setItem(DISPLAY_KEY, JSON.stringify(display));
    } catch (e) {
      // 保存できなくても表示の切り替え自体は行う
    }
    applyDisplay();
  }

  applyDisplay();

  // レッスン中の問題の中国語をブックマークするための情報
  function bookmarkItemFor(exercise, lessonTitle) {
    const correct = ((exercise.choices || []).find((c) => c.correct) || {}).text || "";
    const source = lessonTitle || "レッスン";
    switch (exercise.type) {
      case "listening_choice":
        return { hanzi: exercise.audioText, pinyin: exercise.pinyin, meaning: correct, source };
      case "translate_choice":
        return { hanzi: exercise.hanzi, pinyin: exercise.pinyin, meaning: correct, source };
      case "writing_cn":
        return { hanzi: exercise.answer, pinyin: exercise.pinyinHint, meaning: exercise.meaning, source };
      case "writing_pinyin":
        return { hanzi: exercise.hanzi, pinyin: exercise.answerToned || exercise.answer, meaning: exercise.meaningHint, source };
      case "speaking":
      case "fill_blank":
      case "sentence_build":
        return { hanzi: exercise.hanzi, pinyin: exercise.pinyin, meaning: exercise.meaning, source };
      default:
        return null;
    }
  }

  function buildLessonTop({ progress, fire = false, onPause, onSkip = null, bookmark = null }) {
    const top = el("div", "cs-top");
    const bar = el("div", "cs-progress");
    const fill = el("div", "cs-progress-fill" + (fire ? " is-fire" : ""));
    fill.style.width = `${Math.max(2, progress * 100)}%`;
    bar.appendChild(fill);
    top.appendChild(bar);

    const row = el("div", "cs-top-row");
    const pause = Exercises.iconButton("cs-icon-btn", Icons.pause, "一時停止");
    pause.addEventListener("click", onPause);
    row.appendChild(pause);

    const right = el("div", "cs-top-right");
    const xpPop = el("div", "cs-xp-pop");
    right.appendChild(xpPop);
    const skip = el("button", "cs-skip-pill" + (onSkip ? "" : " hidden"), "スキップ");
    skip.type = "button";
    if (onSkip) skip.addEventListener("click", onSkip);
    right.appendChild(skip);
    if (bookmark && bookmark.hanzi) {
      const star = UI.bookmarkButton(bookmark);
      star.classList.add("cs-star");
      right.appendChild(star);
    }

    const pyBtn = el("button", "cs-toggle" + (display.pinyin ? " is-on" : ""), "拼");
    pyBtn.type = "button";
    pyBtn.setAttribute("aria-label", "ピンインの表示切り替え");
    pyBtn.addEventListener("click", () => {
      toggleDisplay("pinyin");
      pyBtn.classList.toggle("is-on", display.pinyin);
    });
    const trBtn = Exercises.iconButton("cs-toggle" + (display.translation ? " is-on" : ""), Icons.translate, "日本語訳の表示切り替え");
    trBtn.addEventListener("click", () => {
      toggleDisplay("translation");
      trBtn.classList.toggle("is-on", display.translation);
    });
    right.append(pyBtn, trBtn);
    row.appendChild(right);
    top.appendChild(row);

    return {
      el: top,
      setProgress(value, isFire, { sparkle = false } = {}) {
        fill.style.width = `${Math.max(2, value * 100)}%`;
        fill.classList.toggle("is-fire", !!isFire);
        // 正解したら、伸びきったバーの先端でキラッとはじける
        if (sparkle) setTimeout(() => Motion.sparkle(fill), 380);
      },
      showSkip(handler) {
        skip.classList.remove("hidden");
        skip.onclick = handler;
      },
      hideSkip() {
        skip.classList.add("hidden");
      },
      popXp(amount) {
        xpPop.textContent = `+${amount}`;
        xpPop.classList.remove("is-shown");
        void xpPop.offsetWidth; // アニメーションを毎回最初から再生する
        xpPop.classList.add("is-shown");
      },
    };
  }

  function showPauseSheet(screen, onQuit, quitNote) {
    const overlay = el("div", "cs-overlay");
    const card = el("div", "cs-pause-card");
    card.appendChild(el("div", "cs-pause-title", "一時停止中"));
    if (quitNote) card.appendChild(el("div", "cs-pause-note", quitNote));
    const resume = el("button", "primary-btn", "再開する");
    resume.type = "button";
    resume.addEventListener("click", () => overlay.remove());
    const quit = el("button", "cs-text-btn", "レッスンを終了する");
    quit.type = "button";
    quit.addEventListener("click", () => {
      overlay.remove();
      onQuit();
    });
    card.append(resume, quit);
    overlay.appendChild(card);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
    screen.appendChild(overlay);
  }

  function comboLabel(combo) {
    return el("div", "cs-combo", `Combo x${combo}`);
  }

  // 単語を含むレッスン内の例文を探す(単語カードに添えて表示する)
  function findExampleSentence(lesson, item) {
    return (
      LessonExtras.sentenceCandidates(lesson).find(
        (s) => s.hanzi !== item.hanzi && s.hanzi.includes(item.hanzi)
      ) || null
    );
  }

  // ---------------- レッスン前の単語カード ----------------
  function renderVocabPreviewScreen(lesson, items, index, onDone) {
    clear(appRoot);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const screen = el("div", "screen screen--lesson cs-screen");
    const item = items[index];

    const top = buildLessonTop({
      progress: index / items.length,
      onPause: () => showPauseSheet(screen, renderHome),
      onSkip: onDone,
    });
    screen.appendChild(top.el);
    screen.appendChild(el("div", "cs-instruction", `この課の単語 ${index + 1}/${items.length}`));

    const body = el("div", "cs-body");
    const card = el("div", "cs-intro-card");
    const len = Array.from(item.hanzi).length;
    const sizeClass = len > 6 ? " cs-intro-ruby--long" : len > 3 ? " cs-intro-ruby--mid" : "";
    card.appendChild(Ruby.render(item.hanzi, item.pinyin, { className: "cs-intro-ruby" + sizeClass }));
    if (item.meaning) card.appendChild(el("div", "cs-intro-meaning", item.meaning));
    body.appendChild(card);

    const example = findExampleSentence(lesson, item);
    if (example) {
      const exCard = el("div", "cs-intro-example");
      exCard.appendChild(el("div", "cs-intro-example-label", "例文"));
      exCard.appendChild(
        Exercises.sentenceBlock({
          hanzi: example.hanzi,
          pinyin: example.pinyin,
          meaning: example.meaning,
          highlight: item.hanzi,
        })
      );
      const exPlay = Exercises.iconButton("cs-mini-speaker", Icons.speaker, "例文を再生");
      exPlay.addEventListener("click", () => Speech.speak(example.hanzi).catch(() => {}));
      exCard.appendChild(exPlay);
      body.appendChild(exCard);
    }
    screen.appendChild(body);

    const toolbar = el("div", "cs-toolbar");
    const prev = Exercises.iconButton("cs-tool-btn", Icons.prev, "前の単語");
    prev.disabled = index === 0;
    prev.addEventListener("click", () => renderVocabPreviewScreen(lesson, items, index - 1, onDone));
    const speak = Exercises.iconButton("cs-tool-btn", Icons.speaker, "音声を再生");
    speak.addEventListener("click", () => Speech.speak(item.hanzi).catch(() => {}));
    const slow = Exercises.iconButton("cs-tool-btn", Icons.slow, "ゆっくり再生");
    slow.addEventListener("click", () => Speech.speak(item.hanzi, { rate: 0.55 }).catch(() => {}));
    const next = Exercises.iconButton("cs-tool-btn cs-tool-btn--next", Icons.next, index + 1 < items.length ? "次の単語" : "レッスンを始める");
    next.addEventListener("click", () => {
      if (index + 1 < items.length) renderVocabPreviewScreen(lesson, items, index + 1, onDone);
      else onDone();
    });
    toolbar.append(prev, speak, slow, next);
    screen.appendChild(toolbar);

    appRoot.appendChild(screen);
    setTimeout(() => {
      if (screen.isConnected) Speech.speak(item.hanzi).catch(() => {});
    }, 300);
  }

  // ---------------- レッスン本体 ----------------
  function runLesson(lesson, options = {}) {
    const isReview = !!options.isReview;
    const exercises = lesson.exercises;
    const keys = options.keys || exercises.map((_, i) => lesson.id + "#" + i);
    const total = exercises.length;
    let index = 0;
    let correctCount = 0;
    let skippedCount = 0;
    let sessionXp = 0;
    let combo = 0;
    let maxCombo = 0;
    let progressShown = 0;
    let current = null;
    // レベルチェックテスト用: 問題ごとの正誤(options.onFinish に渡す)
    const results = [];

    // 実際に画面を開いていた時間を記録し、ロードマップの学習時間の目安に使う
    const startedAt = Date.now();
    let timeCommitted = false;
    function commitStudyTime() {
      if (timeCommitted) return;
      timeCommitted = true;
      AppState.addStudySeconds((Date.now() - startedAt) / 1000);
    }

    // スピーキング問題があるレッスンでは、問題に着く前に先にマイク許可を
    // 済ませておく(毎回の問題ごとに許可を求められるのを減らすため)
    if (exercises.some((ex) => ex.type === "speaking")) {
      Speech.ensureMicPermission();
    }

    function leaveExercise() {
      if (current && current.dispose) current.dispose();
      current = null;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    function quit() {
      leaveExercise();
      commitStudyTime();
      renderHome();
    }

    function renderExerciseScreen() {
      clear(appRoot);
      const exercise = exercises[index];
      const screen = el("div", "screen screen--lesson cs-screen");
      const nextLabel = index + 1 < total ? "続ける" : "結果を見る";
      let answered = false;
      let continueBtn = null;

      const top = buildLessonTop({
        progress: progressShown,
        fire: combo >= 3,
        onPause: () => showPauseSheet(screen, quit, "ここまでの進捗は保存されません"),
        bookmark: bookmarkItemFor(exercise, lesson.title),
      });
      screen.appendChild(top.el);
      const instruction = el("div", "cs-instruction");
      screen.appendChild(instruction);
      const body = el("div", "cs-body");
      screen.appendChild(body);
      const footer = el("div", "cs-footer");
      const submitBtn = el("button", "primary-btn cs-submit", "提出する");
      submitBtn.type = "button";
      submitBtn.disabled = true;

      const api = {
        onChange: (canSubmit) => {
          // 確定後にWhisperの遅延認識結果などが届いても、
          // 「続ける」ボタンの状態を上書きしないようにする
          if (answered) return;
          submitBtn.disabled = !canSubmit;
        },
        submit: () => {
          if (!answered) handleCheck();
        },
        setBusy: (busy) => {
          if (!continueBtn) return;
          continueBtn.disabled = busy;
          continueBtn.textContent = busy ? "🔊 録音を再生中..." : nextLabel;
        },
      };

      const r = Exercises.render(exercise, api);
      current = r;
      instruction.textContent = r.instruction || "";
      body.appendChild(r.element);
      if (r.skippable) {
        top.showSkip(() => {
          if (answered) return;
          answered = true;
          skippedCount++;
          results[index] = false;
          combo = 0;
          progressShown = (index + 1) / total;
          advance();
        });
      }
      if (r.submitMode === "button") {
        submitBtn.addEventListener("click", () => api.submit());
        footer.appendChild(submitBtn);
      }
      screen.appendChild(footer);
      if (index > 0) screen.classList.add("cs-screen--enter");
      appRoot.appendChild(screen);

      function handleCheck() {
        answered = true;
        submitBtn.disabled = true;
        top.hideSkip();
        const result = r.check();
        if (r.reveal) r.reveal(result);

        const isSpeaking = exercise.type === "speaking";
        const wasWrong = isSpeaking ? result.bonus === false : !result.correct;
        AppState.recordAnswer(keys[index], wasWrong);

        if (result.correct) correctCount++;
        results[index] = !!result.correct;
        if (!wasWrong) {
          combo++;
          maxCombo = Math.max(maxCombo, combo);
        } else {
          combo = 0;
        }
        if (result.correct) {
          const gained = isSpeaking && result.bonus === false ? 5 : 10;
          AppState.addXp(gained);
          sessionXp += gained;
          top.popXp(gained);
        }
        progressShown = (index + 1) / total;
        top.setProgress(progressShown, combo >= 3, { sparkle: !wasWrong });
        if (!isSpeaking || !r.playRecording) {
          if (wasWrong) {
            Motion.Sfx.wrong();
            Motion.vibrate(80);
          } else {
            Motion.Sfx.correct();
          }
        }

        if (result.autoAdvance) {
          if (combo >= 2) screen.appendChild(comboLabel(combo));
          setTimeout(advance, 700);
          return;
        }

        continueBtn = el("button", "primary-btn cs-continue " + (wasWrong ? "cs-continue--bad" : "cs-continue--good"), nextLabel);
        continueBtn.type = "button";
        continueBtn.addEventListener("click", advance);

        if (isSpeaking) {
          // 自分の発音の再生が終わるまでは次に進めないようにする
          clear(footer);
          if (combo >= 2) screen.appendChild(comboLabel(combo));
          footer.appendChild(continueBtn);
          if (r.playRecording) {
            api.setBusy(true);
            r.playRecording().then(() => api.setBusy(false));
          }
          return;
        }

        footer.classList.add("hidden");
        const sheet = el("div", "cs-sheet " + (result.correct ? "cs-sheet--good" : "cs-sheet--bad"));
        if (combo >= 2) sheet.appendChild(comboLabel(combo));
        const head = el("div", "cs-sheet-head");
        head.appendChild(el("span", "cs-sheet-label", result.correct ? "正解! 正しい回答:" : "正しい回答:"));
        const tools = el("div", "cs-sheet-tools");
        tools.appendChild(el("span", "cs-mascot " + (result.correct ? "cs-mascot--good" : "cs-mascot--bad"), result.correct ? "🐼" : "🙈"));
        if (result.audio) {
          const speak = Exercises.iconButton("cs-mini-speaker", Icons.speaker, "正解を再生");
          speak.addEventListener("click", () => Speech.speak(result.audio).catch(() => {}));
          tools.appendChild(speak);
        }
        head.appendChild(tools);
        sheet.appendChild(head);
        const content = el("div", "cs-sheet-body");
        content.appendChild(result.sheet ? result.sheet() : el("div", "cs-sheet-answer-text", result.correctText));
        if (!result.correct) content.appendChild(el("div", "cs-sheet-yours", `あなたの回答: ${result.userText}`));
        sheet.appendChild(content);
        sheet.appendChild(continueBtn);
        screen.appendChild(sheet);
      }
    }

    let advancing = false;
    function advance() {
      if (advancing) return;
      advancing = true;
      const oldScreen = appRoot.querySelector(".cs-screen");
      const parts = oldScreen ? oldScreen.querySelectorAll(":scope > .cs-instruction, :scope > .cs-body, :scope > .cs-footer, :scope > .cs-combo") : [];
      // シートは中央寄せに transform を使っているので、横には流さずに下へ引っ込める
      const sheet = oldScreen && oldScreen.querySelector(":scope > .cs-sheet");
      if (sheet) sheet.classList.add("cs-sheet--leaving");
      Motion.slideOut(parts).then(() => {
        advancing = false;
        advanceNow();
      });
    }

    function advanceNow() {
      leaveExercise();
      index++;
      if (index >= total && options.onFinish) {
        commitStudyTime();
        AppState.markStudiedToday();
        options.onFinish(results);
        return;
      }
      if (index >= total) {
        const answeredCount = total - skippedCount;
        const accuracy = answeredCount > 0 ? correctCount / answeredCount : 0;
        if (isReview) {
          AppState.markStudiedToday();
        } else {
          AppState.completeLesson(lesson.id, accuracy);
        }
        AppState.addXp(20); // レッスン完了ボーナス
        sessionXp += 20;
        commitStudyTime();
        renderSummaryScreen(lesson, { accuracy, sessionXp, isReview, maxCombo });
      } else {
        renderExerciseScreen();
      }
    }

    if (!isReview && !options.isTest) {
      const previewItems = LessonExtras.vocabItems(lesson);
      if (previewItems.length > 0) {
        renderVocabPreviewScreen(lesson, previewItems, 0, renderExerciseScreen);
        return;
      }
    }
    renderExerciseScreen();
  }

  function renderSummaryScreen(lesson, { accuracy, sessionXp, isReview, maxCombo }) {
    clear(appRoot);
    setTimeout(() => Motion.Sfx.complete(), 250);
    const pct = Math.round(accuracy * 100);
    const [zh, ja] =
      pct >= 90 ? ["极好", "すばらしい"] : pct >= 70 ? ["很好", "よくできました"] : pct >= 40 ? ["不错", "いい調子"] : ["加油", "がんばろう"];
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;

    const screen = el("div", "screen cs-result");
    const confetti = el("div", "cs-confetti");
    const colors = ["#ff9f1a", "#ff5a7a", "#ffd23f", "#4cc76a", "#5aa9ff"];
    for (let i = 0; i < 26; i++) {
      const piece = el("span", "cs-confetti-piece" + (i % 3 === 0 ? " is-star" : ""));
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${(Math.random() * 1.2).toFixed(2)}s`;
      piece.style.animationDuration = `${(2.4 + Math.random() * 1.8).toFixed(2)}s`;
      piece.style.setProperty("--c", colors[i % colors.length]);
      piece.style.setProperty("--r", `${Math.round(Math.random() * 360)}deg`);
      confetti.appendChild(piece);
    }
    screen.appendChild(confetti);

    const hero = el("div", "cs-result-hero");
    hero.appendChild(el("div", "cs-result-zh", zh));
    hero.appendChild(el("div", "cs-result-ja", ja));
    hero.appendChild(el("div", "cs-result-sub", isReview ? "苦手復習 完了" : lesson.title));
    const starsRow = el("div", "cs-result-stars");
    for (let i = 0; i < 3; i++) {
      starsRow.appendChild(el("span", "cs-result-star" + (i < stars ? " is-on" : ""), "★"));
    }
    hero.appendChild(starsRow);
    screen.appendChild(hero);

    const stats = el("div", "cs-result-stats");
    [
      [`${pct}%`, "正解率"],
      [`+${sessionXp}`, "XP"],
      [`x${maxCombo}`, "最大コンボ"],
    ].forEach(([value, label]) => {
      const box = el("div", "cs-result-stat");
      box.appendChild(el("div", "cs-result-stat-value", value));
      box.appendChild(el("div", "cs-result-stat-label", label));
      stats.appendChild(box);
    });
    screen.appendChild(stats);

    const footer = el("div", "cs-footer cs-result-footer");
    const continueBtn = el("button", "primary-btn", "続ける");
    continueBtn.type = "button";
    continueBtn.addEventListener("click", renderHome);
    footer.appendChild(continueBtn);
    screen.appendChild(footer);
    appRoot.appendChild(screen);
  }

  // ---------------- 画面遷移(新しいタブのモジュールからも使う) ----------------
  const ROUTES = {
    home: () => renderHome(),
    practice: () => Practice.home(),
    discover: () => Discover.home(),
    talk: () => Talk.home(),
    mypage: () => MyPage.home(),
    settings: () => MyPage.settings(),
    news: () => renderNewsHome(),
    flashcards: () => renderFlashcardHome(),
    roadmap: () => renderRoadmap(() => MyPage.home()),
  };

  function go(name) {
    (ROUTES[name] || ROUTES.home)();
    window.scrollTo(0, 0);
  }

  window.App = {
    go,
    bottomNav: renderBottomNav,
    getCurrentLevel,
    getTodaysArticles,
    openArticle: renderArticleReader,
    startLesson,
    runLesson,
    getBadges,
    getDisplay: () => Object.assign({}, display),
    toggleDisplay,
  };

  // 起動
  renderHome();
})();

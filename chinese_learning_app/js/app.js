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
    banner.addEventListener("click", renderRoadmap);

    container.appendChild(banner);
  }

  function renderRoadmap() {
    clear(appRoot);
    const screen = el("div", "screen screen--roadmap");
    renderTopBar(screen, { showBack: true, onBack: renderHome });

    const intro = el("div", "roadmap-intro");
    intro.appendChild(el("h1", "roadmap-title", "ロードマップ"));
    intro.appendChild(
      el("p", "roadmap-sub", "ゴールは「ビジネス中国語が話せる」レベル(HSK6相当)。今の自分の立ち位置を確認しよう。")
    );
    screen.appendChild(intro);

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
        card.appendChild(el("div", "roadmap-level-progress-text", `${lv.stats.completed}/${lv.stats.total} レッスン完了`));
      } else {
        card.appendChild(el("div", "roadmap-level-future-badge", "レッスン追加予定"));
      }

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
    const hearts = el("div", "stat-pill stat-pill--hearts", `❤️ ${state.hearts}`);
    stats.appendChild(streak);
    stats.appendChild(xp);
    stats.appendChild(hearts);
    bar.appendChild(stats);

    container.appendChild(bar);
  }

  // ---------------- デイリーゴール ----------------
  function renderDailyGoal(container) {
    const state = AppState.get();
    const goal = AppState.DAILY_GOAL_XP;
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

    const nav = el("div", "bottom-nav");
    const homeTab = el("button", "nav-tab nav-tab--active", "🏠 ホーム");
    homeTab.type = "button";
    const profileTab = el("button", "nav-tab", "👤 マイページ");
    profileTab.type = "button";
    profileTab.addEventListener("click", renderProfile);
    nav.appendChild(homeTab);
    nav.appendChild(profileTab);
    screen.appendChild(nav);

    appRoot.appendChild(screen);
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

  // ---------------- プロフィール画面 ----------------
  function renderProfile() {
    clear(appRoot);
    const state = AppState.get();
    const screen = el("div", "screen screen--profile");
    renderTopBar(screen, { showBack: true, onBack: renderHome });

    const card = el("div", "profile-card");
    card.appendChild(el("div", "profile-emoji", "🐼"));
    card.appendChild(el("h1", "profile-name", "学習者"));

    const grid = el("div", "profile-grid");
    const totalLessons = FLAT_LESSONS.length;
    const completedLessons = FLAT_LESSONS.filter((x) => AppState.isLessonCompleted(x.lesson.id)).length;

    const statsData = [
      ["🔥", `${state.streak}日`, "連続学習"],
      ["💎", `${state.xp}`, "累計XP"],
      ["✅", `${completedLessons}/${totalLessons}`, "完了レッスン"],
    ];
    statsData.forEach(([icon, value, label]) => {
      const box = el("div", "profile-stat-box");
      box.appendChild(el("div", "profile-stat-icon", icon));
      box.appendChild(el("div", "profile-stat-value", value));
      box.appendChild(el("div", "profile-stat-label", label));
      grid.appendChild(box);
    });
    card.appendChild(grid);

    card.appendChild(el("h2", "badges-heading", "実績"));
    const badgesGrid = el("div", "badges-grid");
    getBadgeDefs(state, completedLessons, totalLessons).forEach((badge) => {
      const b = el("div", "badge" + (badge.unlocked ? " badge--unlocked" : ""));
      b.appendChild(el("div", "badge-icon", badge.icon));
      b.appendChild(el("div", "badge-label", badge.label));
      badgesGrid.appendChild(b);
    });
    card.appendChild(badgesGrid);

    const resetBtn = el("button", "secondary-btn", "学習データをリセットする");
    resetBtn.type = "button";
    resetBtn.addEventListener("click", () => {
      if (confirm("学習の進捗をすべてリセットします。よろしいですか?")) {
        AppState.reset();
        renderHome();
      }
    });
    card.appendChild(resetBtn);

    screen.appendChild(card);
    appRoot.appendChild(screen);
  }

  // ---------------- レッスン画面 ----------------
  function startLesson(lessonId) {
    const entry = FLAT_LESSONS.find((x) => x.lesson.id === lessonId);
    if (!entry) return;
    runLesson(entry.lesson);
  }

  function runLesson(lesson, options = {}) {
    const isReview = !!options.isReview;
    const keys = options.keys || lesson.exercises.map((_, i) => lesson.id + "#" + i);
    let index = 0;
    let correctCount = 0;
    let sessionXp = 0;
    const total = lesson.exercises.length;
    let currentCheck = null;
    let answered = false;

    function exitToHome() {
      if (confirm("レッスンを中断してホームに戻りますか?ここまでの進捗は保存されません。")) {
        renderHome();
      }
    }

    function renderExerciseScreen() {
      clear(appRoot);
      const screen = el("div", "screen screen--lesson");

      const header = el("div", "lesson-header");
      const closeBtn = el("button", "icon-btn", "✕");
      closeBtn.type = "button";
      closeBtn.addEventListener("click", exitToHome);
      header.appendChild(closeBtn);

      const progressOuter = el("div", "progress-outer");
      const progressInner = el("div", "progress-inner");
      progressInner.style.width = `${(index / total) * 100}%`;
      progressOuter.appendChild(progressInner);
      header.appendChild(progressOuter);

      header.appendChild(el("div", "hearts-display", "❤️ " + AppState.get().hearts));
      screen.appendChild(header);

      const exercise = lesson.exercises[index];
      const body = el("div", "lesson-body");
      answered = false;

      const { element, check } = Exercises.render(exercise, {
        onChange: (canCheck) => {
          checkBtn.disabled = !canCheck;
        },
      });
      currentCheck = check;
      body.appendChild(element);
      screen.appendChild(body);

      const feedback = el("div", "feedback hidden");
      screen.appendChild(feedback);

      const footer = el("div", "lesson-footer");
      const checkBtn = el("button", "primary-btn", "確認する");
      checkBtn.type = "button";
      checkBtn.disabled = true;
      footer.appendChild(checkBtn);
      screen.appendChild(footer);

      let failed = false;

      checkBtn.addEventListener("click", () => {
        if (!answered) {
          handleCheck(feedback, footer, checkBtn, exercise, () => {
            failed = true;
          });
        } else if (failed) {
          renderFailScreen(lesson, { keys, isReview });
        } else {
          advance();
        }
      });

      appRoot.appendChild(screen);
    }

    function handleCheck(feedback, footer, checkBtn, exercise, onFail) {
      const result = currentCheck();
      answered = true;
      feedback.classList.remove("hidden");

      const wasWrong = exercise.type === "speaking" ? result.bonus === false : !result.correct;
      AppState.recordAnswer(keys[index], wasWrong);

      if (result.correct) {
        correctCount++;
        feedback.className = "feedback feedback--correct";
        const title = el("div", "feedback-title", result.bonus === false ? "👍 挑戦を記録しました!" : "✅ 正解!");
        feedback.appendChild(title);
        if (exercise.type === "speaking") {
          feedback.appendChild(el("div", "feedback-sub", result.userText));
        }
        const gained = result.bonus === false ? 5 : 10;
        AppState.addXp(gained);
        sessionXp += gained;
      } else {
        const heartsLeft = AppState.loseHeart();
        feedback.className = "feedback feedback--wrong";
        feedback.appendChild(el("div", "feedback-title", "❌ 不正解"));
        feedback.appendChild(el("div", "feedback-sub", `正解: ${result.correctText}`));
        feedback.appendChild(el("div", "feedback-sub", `あなたの回答: ${result.userText}`));

        if (heartsLeft <= 0) {
          checkBtn.textContent = "結果を見る";
          checkBtn.classList.remove("primary-btn--correct");
          checkBtn.classList.add("primary-btn--wrong");
          checkBtn.disabled = false;
          onFail();
          return;
        }
      }

      checkBtn.textContent = index + 1 < total ? "続ける" : "レッスン完了";
      checkBtn.classList.add(result.correct ? "primary-btn--correct" : "primary-btn--wrong");
      checkBtn.disabled = false;
    }

    function advance() {
      index++;
      if (index >= total) {
        const accuracy = correctCount / total;
        if (isReview) {
          AppState.markStudiedToday();
        } else {
          AppState.completeLesson(lesson.id, accuracy);
        }
        AppState.addXp(20); // レッスン完了ボーナス
        sessionXp += 20;
        renderSummaryScreen(lesson, correctCount, total, sessionXp, isReview);
      } else {
        renderExerciseScreen();
      }
    }

    renderExerciseScreen();
  }

  function renderFailScreen(lesson, options) {
    clear(appRoot);
    const screen = el("div", "screen screen--summary screen--fail");
    const card = el("div", "summary-card");
    card.appendChild(el("div", "summary-emoji", "💔"));
    card.appendChild(el("h1", "summary-title", "ハートがなくなりました"));
    card.appendChild(el("p", "summary-sub", "少し休んでからもう一度挑戦しましょう。ハートは翌日に回復します。"));

    const retryBtn = el("button", "primary-btn", "レッスンをやり直す");
    retryBtn.type = "button";
    retryBtn.addEventListener("click", () => {
      AppState.refillHearts(); // 練習を続けられるよう即時回復
      runLesson(lesson, options);
    });
    card.appendChild(retryBtn);

    const homeBtn = el("button", "secondary-btn", "ホームに戻る");
    homeBtn.type = "button";
    homeBtn.addEventListener("click", renderHome);
    card.appendChild(homeBtn);

    screen.appendChild(card);
    appRoot.appendChild(screen);
  }

  function renderSummaryScreen(lesson, correctCount, total, sessionXp, isReview) {
    clear(appRoot);
    const accuracy = correctCount / total;
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;

    const screen = el("div", "screen screen--summary");
    const card = el("div", "summary-card");
    card.appendChild(el("div", "summary-emoji", isReview ? "🔁" : "🎉"));
    card.appendChild(el("h1", "summary-title", isReview ? "苦手復習 完了!" : "レッスン完了!"));
    card.appendChild(el("p", "summary-sub", isReview ? "弱点を克服しました" : lesson.title));

    const starsRow = el("div", "summary-stars");
    for (let i = 0; i < 3; i++) {
      starsRow.appendChild(el("span", i < stars ? "star star--big star--on" : "star star--big", "★"));
    }
    card.appendChild(starsRow);

    const statsRow = el("div", "summary-stats");
    const acc = el("div", "summary-stat-box");
    acc.appendChild(el("div", "summary-stat-value", `${Math.round(accuracy * 100)}%`));
    acc.appendChild(el("div", "summary-stat-label", "正解率"));
    const xpBox = el("div", "summary-stat-box");
    xpBox.appendChild(el("div", "summary-stat-value", `+${sessionXp}`));
    xpBox.appendChild(el("div", "summary-stat-label", "獲得XP"));
    statsRow.appendChild(acc);
    statsRow.appendChild(xpBox);
    card.appendChild(statsRow);

    const continueBtn = el("button", "primary-btn", "続ける");
    continueBtn.type = "button";
    continueBtn.addEventListener("click", renderHome);
    card.appendChild(continueBtn);

    screen.appendChild(card);
    appRoot.appendChild(screen);
  }

  // 起動
  renderHome();
})();

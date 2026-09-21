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

  // ---------------- ホーム画面(スキルツリー) ----------------
  function renderHome() {
    AppState.refreshDaily();
    clear(appRoot);
    const screen = el("div", "screen screen--home");
    renderTopBar(screen);

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

  function runLesson(lesson) {
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
          renderFailScreen(lesson);
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
        AppState.completeLesson(lesson.id, accuracy);
        AppState.addXp(20); // レッスン完了ボーナス
        sessionXp += 20;
        renderSummaryScreen(lesson, correctCount, total, sessionXp);
      } else {
        renderExerciseScreen();
      }
    }

    renderExerciseScreen();
  }

  function renderFailScreen(lesson) {
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
      runLesson(lesson);
    });
    card.appendChild(retryBtn);

    const homeBtn = el("button", "secondary-btn", "ホームに戻る");
    homeBtn.type = "button";
    homeBtn.addEventListener("click", renderHome);
    card.appendChild(homeBtn);

    screen.appendChild(card);
    appRoot.appendChild(screen);
  }

  function renderSummaryScreen(lesson, correctCount, total, sessionXp) {
    clear(appRoot);
    const accuracy = correctCount / total;
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;

    const screen = el("div", "screen screen--summary");
    const card = el("div", "summary-card");
    card.appendChild(el("div", "summary-emoji", "🎉"));
    card.appendChild(el("h1", "summary-title", "レッスン完了!"));
    card.appendChild(el("p", "summary-sub", lesson.title));

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

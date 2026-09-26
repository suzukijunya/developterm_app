// マイページ: 学習記録・ライブラリ・ブックマーク・目標・レベルチェックテスト・カードコレクション・設定
const MyPage = (() => {
  const { el, clear } = UI;

  function formatStudyTime(sec) {
    const min = Math.floor(sec / 60);
    if (min < 60) return [String(min), "分"];
    return [(min / 60).toFixed(1), "時間"];
  }

  function home() {
    const state = AppState.get();
    const screen = UI.screen("screen--mypage", { navId: "mypage" });

    const top = el("div", "mp-top");
    top.appendChild(UI.iconButton("mp-gear", Icons.gear, "設定", settings));
    UI.add(screen, top);

    const profile = el("div", "mp-profile");
    profile.appendChild(el("div", "mp-avatar", "🐼"));
    const who = el("div", "mp-who");
    who.appendChild(el("div", "mp-name", AppState.getNickname()));
    const lv = App.getCurrentLevel();
    who.appendChild(el("span", "mp-level", lv ? lv.label.replace(/\s.*/, "") : "Lv.1"));
    profile.appendChild(who);
    const coins = UI.button("mp-coins", "", badges);
    coins.appendChild(el("span", "mp-coin-icon", "🪙"));
    coins.appendChild(el("span", "mp-coin-num", String(state.xp)));
    coins.appendChild(el("span", "mp-coin-arrow", "›"));
    profile.appendChild(coins);
    UI.add(screen, profile);

    const stats = el("div", "mp-stats");
    const [timeVal, timeUnit] = formatStudyTime(state.totalStudySeconds);
    [
      ["学習時間", timeVal, timeUnit],
      ["連続記録", String(state.streak), "日"],
      ["合計学習日数", String(AppState.getTotalStudyDays()), "日"],
    ].forEach(([label, value, unit]) => {
      const box = el("div", "mp-stat");
      box.appendChild(el("div", "mp-stat-label", label));
      const v = el("div", "mp-stat-value", value);
      v.appendChild(el("span", "mp-stat-unit", unit));
      box.appendChild(v);
      stats.appendChild(box);
    });
    UI.add(screen, stats);

    const goal = AppState.getDailyGoal();
    AppState.refreshDaily();
    const done = Math.min(state.dailyXp, goal);
    const banner = UI.button("mp-banner", "", goalScreen);
    banner.appendChild(el("span", "mp-banner-icon", "🎯"));
    const bt = el("div", "mp-banner-texts");
    bt.appendChild(el("div", "mp-banner-title", state.dailyXp >= goal ? "今日の目標 達成!" : "今日の目標"));
    const bar = el("div", "mp-banner-bar");
    const fill = el("div", "mp-banner-fill");
    fill.style.width = `${(done / goal) * 100}%`;
    bar.appendChild(fill);
    bt.appendChild(bar);
    banner.appendChild(bt);
    banner.appendChild(el("span", "mp-banner-num", `${done}/${goal} XP`));
    UI.add(screen, banner);

    const lastTest = AppState.getLevelTests()[0];
    const cardStats = cardDefs().reduce((acc, c) => acc + (c.unlocked ? 1 : 0), 0);
    const menu = el("div", "mp-menu");
    [
      { icon: "📘", label: "学習ライブラリ", go: library },
      { icon: "📙", label: "教科書(ロードマップ)", go: () => App.go("roadmap") },
      { icon: "⭐", label: "ブックマーク", note: `${AppState.getBookmarks().length}件`, go: bookmarks },
      { icon: "🚀", label: "学習目標", note: `1日${goal}XP`, go: goalScreen },
      { icon: "📊", label: "中国語レベルチェックテスト", note: lastTest ? `正解率${lastTest.accuracy}%` : "未受験", go: levelTestIntro },
      { icon: "🐼", label: "AI先生に質問", go: () => Practice.askAI(home) },
      "sep",
      { icon: "🃏", label: "カードコレクション", note: `${cardStats}/${cardDefs().length}`, go: cards },
      { icon: "🏅", label: "実績バッジ", go: badges },
      { icon: "⚙️", label: "設定", go: settings },
    ].forEach((item) => {
      if (item === "sep") {
        menu.appendChild(el("div", "mp-sep"));
        return;
      }
      const row = UI.button("mp-row", "", item.go);
      row.appendChild(el("span", "mp-row-icon", item.icon));
      row.appendChild(el("span", "mp-row-label", item.label));
      if (item.note) row.appendChild(el("span", "mp-row-note", item.note));
      row.appendChild(el("span", "mp-row-arrow", "›"));
      menu.appendChild(row);
    });
    UI.add(screen, menu);
  }

  // ---------- 学習ライブラリ ----------
  function library() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("学習ライブラリ", home));
    const body = el("div", "sub-body");
    body.appendChild(el("div", "ui-section-title", "完了したレッスン"));
    let any = false;
    UNITS.forEach((u) => {
      const done = u.lessons.filter((l) => AppState.isLessonCompleted(l.id));
      if (done.length === 0) return;
      any = true;
      body.appendChild(el("div", "lib-unit", `${u.icon} ${u.title}`));
      done.forEach((l) => {
        const row = UI.button("lib-row", "", () => App.startLesson(l.id));
        row.appendChild(el("span", "lib-row-title", l.title));
        const stars = AppState.getLessonStars(l.id);
        row.appendChild(el("span", "lib-row-stars", "★".repeat(stars) + "☆".repeat(3 - stars)));
        row.appendChild(el("span", "lib-row-go", "復習 ›"));
        body.appendChild(row);
      });
    });
    if (!any) body.appendChild(el("div", "empty-note", "まだ完了したレッスンはありません。「学習」タブから始めましょう。"));

    body.appendChild(el("div", "ui-section-title", "単語帳の習得状況"));
    VOCAB_DECKS.forEach((d) => {
      const mastered = d.words.filter((_, i) => AppState.getFlashcardEntry(`${d.id}#${i}`).mastered).length;
      const row = UI.button("lib-row", "", () => App.go("flashcards"));
      row.appendChild(el("span", "lib-row-title", `${d.icon} ${d.label}`));
      row.appendChild(el("span", "lib-row-stars", `${mastered}/${d.words.length}語`));
      row.appendChild(el("span", "lib-row-go", "›"));
      body.appendChild(row);
    });

    const read = NEWS_ARTICLES.filter((a) => AppState.isArticleRead(a.id));
    body.appendChild(el("div", "ui-section-title", `読んだニュース(${read.length})`));
    if (read.length === 0) body.appendChild(el("div", "empty-note", "まだ読んだ記事はありません。"));
    read.forEach((a) => {
      const row = UI.button("lib-row", "", () => App.openArticle(a));
      row.appendChild(el("span", "lib-row-title", a.titleZh));
      row.appendChild(el("span", "lib-row-go", "›"));
      body.appendChild(row);
    });
    screen.appendChild(body);
  }

  // ---------- ブックマーク ----------
  function bookmarks() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("ブックマーク", home));
    const body = el("div", "sub-body");
    const items = AppState.getBookmarks();
    if (items.length === 0) {
      body.appendChild(el("div", "empty-art", "⭐"));
      body.appendChild(el("div", "empty-note", "まだブックマークはありません。レッスン中の ☆ や、フレーズ・AI会話の ☆ をタップすると、ここに保存されます。"));
    } else {
      body.appendChild(el("p", "sub-lead", `${items.length}件。タップで音声、★で解除できます。`));
      items.forEach((b) => {
        const block = UI.zhBlock({ hanzi: b.hanzi, pinyin: b.pinyin, ja: b.meaning, bookmark: b });
        if (b.source) block.appendChild(el("div", "bm-source", b.source));
        body.appendChild(block);
      });
      body.appendChild(
        UI.button("primary-btn", "▶ 続けて聞く", async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          for (const b of items) {
            if (!btn.isConnected) break;
            await Speech.speak(b.hanzi).catch(() => {});
            await new Promise((r) => setTimeout(r, 400));
          }
          btn.disabled = false;
        })
      );
    }
    screen.appendChild(body);
  }

  // ---------- 学習目標 ----------
  function goalScreen() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("学習目標", home));
    const body = el("div", "sub-body");
    body.appendChild(el("p", "sub-lead", "1日に獲得するXPの目標を選びましょう。毎日続けることが一番の近道です。"));
    const current = AppState.getDailyGoal();
    [
      [10, "ゆるく", "1日5分・レッスン半分くらい"],
      [30, "ふつう", "1日10〜15分・レッスン1回"],
      [50, "しっかり", "1日20〜30分・レッスン2回"],
      [100, "本気", "1日45分以上・レッスン+AI会話"],
    ].forEach(([xp, name, desc]) => {
      const row = UI.button("goal-opt" + (xp === current ? " is-on" : ""), "", () => {
        AppState.setDailyGoal(xp);
        UI.toast(`目標を1日${xp}XPにしました`);
        goalScreen();
      });
      row.appendChild(el("div", "goal-opt-name", name));
      row.appendChild(el("div", "goal-opt-desc", desc));
      row.appendChild(el("div", "goal-opt-xp", `${xp} XP`));
      body.appendChild(row);
    });
    screen.appendChild(body);
  }

  // ---------- レベルチェックテスト ----------
  const TEST_TYPES = ["listening_choice", "translate_choice", "writing_cn", "writing_pinyin", "reading"];
  const TEST_SIZE = 20;

  function levelTestIntro() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("レベルチェックテスト", home));
    const body = el("div", "sub-body");
    const card = el("div", "game-intro");
    card.appendChild(el("div", "game-intro-art", "📊"));
    card.appendChild(el("div", "game-intro-title", "今の実力をチェック"));
    card.appendChild(el("div", "game-intro-text", `入門〜ビジネスまで、各レベルから出題される${TEST_SIZE}問のテストです(約5分)。結果から、今のあなたのレベルの目安を表示します。`));
    card.appendChild(UI.button("primary-btn", "テストを始める", startLevelTest));
    body.appendChild(card);

    const tests = AppState.getLevelTests();
    if (tests.length) {
      body.appendChild(el("div", "ui-section-title", "これまでの結果"));
      tests.forEach((t) => {
        const row = el("div", "lib-row");
        row.appendChild(el("span", "lib-row-title", `${t.date}  ${t.levelLabel}`));
        row.appendChild(el("span", "lib-row-stars", `正解率${t.accuracy}%`));
        body.appendChild(row);
      });
    }
    screen.appendChild(body);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startLevelTest() {
    const levels = LEVELS.filter((l) => l.implemented);
    const per = Math.floor(TEST_SIZE / levels.length);
    let extra = TEST_SIZE - per * levels.length;
    const exercises = [];
    const levelOf = [];
    levels.forEach((lv, li) => {
      const pool = UNITS.filter((u) => lv.unitIds.includes(u.id))
        .flatMap((u) => u.lessons)
        .flatMap((l) => l.exercises)
        .filter((ex) => TEST_TYPES.includes(ex.type));
      const n = per + (extra-- > 0 ? 1 : 0);
      shuffle(pool)
        .slice(0, n)
        .forEach((ex) => {
          exercises.push(ex);
          levelOf.push(li);
        });
    });
    App.runLesson(
      { id: "level_test", title: "レベルチェックテスト", exercises },
      {
        isTest: true,
        keys: exercises.map(() => null),
        onFinish: (results) => levelTestResult(levels, levelOf, results),
      }
    );
  }

  function levelTestResult(levels, levelOf, results) {
    const perLevel = levels.map(() => ({ ok: 0, total: 0 }));
    results.forEach((ok, i) => {
      perLevel[levelOf[i]].total++;
      if (ok) perLevel[levelOf[i]].ok++;
    });
    // 下のレベルから順に、正解率70%以上が続いたところまでを「今のレベル」とみなす
    let reached = -1;
    for (let i = 0; i < levels.length; i++) {
      const p = perLevel[i];
      if (p.total > 0 && p.ok / p.total >= 0.7) reached = i;
      else break;
    }
    const accuracy = Math.round((results.filter(Boolean).length / results.length) * 100);
    const levelLabel = reached >= 0 ? `${levels[reached].label}(${levels[reached].hskLabel})` : "入門前";
    AppState.saveLevelTest({ accuracy, levelLabel });

    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("テスト結果", home));
    const body = el("div", "sub-body");
    const card = el("div", "game-intro");
    card.appendChild(el("div", "game-intro-art", "🎓"));
    card.appendChild(el("div", "game-intro-text", "あなたのレベルの目安"));
    card.appendChild(el("div", "game-intro-title", levelLabel));
    card.appendChild(el("div", "game-intro-best", `正解率 ${accuracy}%`));
    body.appendChild(card);
    body.appendChild(el("div", "ui-section-title", "レベル別の正解率"));
    levels.forEach((lv, i) => {
      const p = perLevel[i];
      const ratio = p.total ? p.ok / p.total : 0;
      const row = el("div", "lt-row");
      row.appendChild(el("div", "lt-label", lv.label));
      const bar = el("div", "lt-bar");
      const fill = el("div", "lt-fill" + (ratio >= 0.7 ? " is-pass" : ""));
      fill.style.width = `${ratio * 100}%`;
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el("div", "lt-num", `${p.ok}/${p.total}`));
      body.appendChild(row);
    });
    body.appendChild(el("p", "sub-note", "※アプリ内の問題による簡易的な目安で、HSKの公式な判定ではありません。"));
    body.appendChild(UI.button("primary-btn", "マイページに戻る", home));
    screen.appendChild(body);
  }

  // ---------- カードコレクション ----------
  const UNIT_CARDS = {
    u1: ["你好", "nǐ hǎo", "こんにちは"],
    u2: ["时间", "shíjiān", "時間"],
    u3: ["家人", "jiārén", "家族"],
    u4: ["生活", "shēnghuó", "生活"],
    u5: ["工作", "gōngzuò", "仕事"],
    u6: ["电话", "diànhuà", "電話"],
    u7: ["合作", "hézuò", "協力・提携"],
    u8: ["出差", "chūchāi", "出張"],
    u9: ["报告", "bàogào", "報告"],
    u10: ["解决", "jiějué", "解決する"],
    u11: ["招聘", "zhāopìn", "採用する"],
    u12: ["合同", "hétong", "契約"],
    u13: ["合规", "héguī", "コンプライアンス"],
    u14: ["城市", "chéngshì", "都市"],
    u15: ["微信", "Wēixìn", "WeChat"],
    u16: ["会议", "huìyì", "会議"],
    u17: ["系统", "xìtǒng", "システム"],
    u18: ["财务", "cáiwù", "財務・経理"],
    u19: ["海关", "hǎiguān", "税関"],
    u20: ["安全", "ānquán", "安全"],
  };
  const DECK_CARDS = {
    trade: ["贸易", "màoyì", "貿易"],
    accounting: ["会计", "kuàijì", "会計"],
    news: ["新闻", "xīnwén", "ニュース"],
    contract: ["条款", "tiáokuǎn", "条項"],
    customs_police: ["法律", "fǎlǜ", "法律"],
    basic: ["日常", "rìcháng", "日常"],
    chat: ["聊天", "liáotiān", "おしゃべり・チャット"],
    meeting: ["开会", "kāihuì", "会議をする"],
    it: ["技术", "jìshù", "技術"],
    life: ["生活", "shēnghuó", "生活"],
    hr: ["人才", "réncái", "人材"],
    sales: ["营销", "yíngxiāo", "マーケティング"],
    logistics: ["运输", "yùnshū", "輸送"],
  };

  function cardDefs() {
    const state = AppState.get();
    const best = Math.max(state.bestStreak || 0, state.streak || 0);
    const out = [];
    UNITS.forEach((u, i) => {
      const w = UNIT_CARDS[u.id];
      if (!w) return;
      out.push({
        art: u.icon,
        zh: w[0],
        pinyin: w[1],
        meaning: w[2],
        rarity: i < 4 ? "N" : i < 8 ? "R" : i < 12 ? "SR" : "SSR",
        how: `ユニット「${u.title}」の全レッスンを完了`,
        unlocked: u.lessons.every((l) => AppState.isLessonCompleted(l.id)),
      });
    });
    VOCAB_DECKS.forEach((d) => {
      const w = DECK_CARDS[d.id];
      if (!w) return;
      const mastered = d.words.filter((_, i) => AppState.getFlashcardEntry(`${d.id}#${i}`).mastered).length;
      out.push({ art: d.icon, zh: w[0], pinyin: w[1], meaning: w[2], rarity: "R", how: `単語帳「${d.label}」で20語マスター`, unlocked: mastered >= 20 });
    });
    out.push({ art: "🔥", zh: "坚持", pinyin: "jiānchí", meaning: "続ける", rarity: "N", how: "3日連続で学習", unlocked: best >= 3 });
    out.push({ art: "🚀", zh: "努力", pinyin: "nǔlì", meaning: "努力する", rarity: "R", how: "7日連続で学習", unlocked: best >= 7 });
    out.push({ art: "🏆", zh: "毅力", pinyin: "yìlì", meaning: "根気・粘り強さ", rarity: "SSR", how: "30日連続で学習", unlocked: best >= 30 });
    out.push({ art: "📊", zh: "挑战", pinyin: "tiǎozhàn", meaning: "挑戦する", rarity: "N", how: "レベルチェックテストを受ける", unlocked: AppState.getLevelTests().length > 0 });
    out.push({ art: "💬", zh: "朋友", pinyin: "péngyou", meaning: "友達", rarity: "R", how: "トークで5回会話する", unlocked: AppState.getPref("talkSessions", 0) >= 5 });
    out.push({ art: "🎓", zh: "学霸", pinyin: "xuébà", meaning: "秀才", rarity: "SR", how: "累計1000XPを獲得", unlocked: state.xp >= 1000 });
    return out;
  }

  function cards() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("カードコレクション", home));
    const body = el("div", "sub-body");
    const defs = cardDefs();
    body.appendChild(el("p", "sub-lead", `集めたカード ${defs.filter((c) => c.unlocked).length}/${defs.length}枚。学習を進めると新しいカードが手に入ります。`));
    const grid = el("div", "card-grid");
    defs.forEach((c) => {
      const card = UI.button(`cc-card cc-card--${c.rarity}` + (c.unlocked ? "" : " is-locked"), "", () => {
        if (c.unlocked) Speech.speak(c.zh).catch(() => {});
        else UI.toast(`入手方法: ${c.how}`);
      });
      card.appendChild(el("div", "cc-rarity", c.rarity));
      card.appendChild(el("div", "cc-art", c.unlocked ? c.art : "?"));
      if (c.unlocked) {
        card.appendChild(el("div", "cc-py", c.pinyin));
        card.appendChild(el("div", "cc-zh", c.zh));
        card.appendChild(el("div", "cc-mean", c.meaning));
      } else {
        card.appendChild(el("div", "cc-how", c.how));
      }
      grid.appendChild(card);
    });
    body.appendChild(grid);
    screen.appendChild(body);
  }

  // ---------- 実績バッジ ----------
  function badges() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("実績バッジ", home));
    const body = el("div", "sub-body");
    const grid = el("div", "badges-grid");
    App.getBadges().forEach((badge) => {
      const b = el("div", "badge" + (badge.unlocked ? " badge--unlocked" : ""));
      b.appendChild(el("div", "badge-icon", badge.icon));
      b.appendChild(el("div", "badge-label", badge.label));
      grid.appendChild(b);
    });
    body.appendChild(grid);
    screen.appendChild(body);
  }

  // ---------- 設定 ----------
  function settings() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("設定", home));
    const body = el("div", "sub-body");

    body.appendChild(el("div", "ui-section-title", "プロフィール"));
    body.appendChild(el("label", "form-label", "ニックネーム"));
    const nick = el("input", "form-input");
    nick.value = AppState.get().nickname || "";
    nick.placeholder = "学習者";
    nick.maxLength = 20;
    nick.addEventListener("change", () => {
      AppState.setNickname(nick.value);
      UI.toast("保存しました");
    });
    body.appendChild(nick);

    body.appendChild(el("div", "ui-section-title", "AI機能(Claude API)"));
    const ai = AI.loadSettings();
    body.appendChild(
      el(
        "p",
        "sub-note",
        "AI会話・作文添削・カメラ識別などを使うには、Anthropic Console(console.anthropic.com)で発行したAPIキーが必要です。キーはこの端末のブラウザにだけ保存され、送信先は Anthropic のAPIのみです。利用した分だけAnthropicのアカウントに課金されます。"
      )
    );
    body.appendChild(el("label", "form-label", "APIキー"));
    const keyRow = el("div", "key-row");
    const key = el("input", "form-input");
    key.type = "password";
    key.autocomplete = "off";
    key.placeholder = "sk-ant-...";
    key.value = ai.apiKey;
    const show = UI.button("key-show", "表示", () => {
      key.type = key.type === "password" ? "text" : "password";
      show.textContent = key.type === "password" ? "表示" : "隠す";
    });
    keyRow.append(key, show);
    body.appendChild(keyRow);

    body.appendChild(el("label", "form-label", "モデル"));
    const model = el("select", "form-input");
    AI.MODELS.forEach((m) => {
      const o = el("option", null, m.label);
      o.value = m.id;
      if (m.id === ai.model) o.selected = true;
      model.appendChild(o);
    });
    body.appendChild(model);

    const aiActions = el("div", "essay-actions");
    const save = UI.button("primary-btn", "保存", () => {
      AI.saveSettings({ apiKey: key.value.trim(), model: model.value });
      UI.toast("AIの設定を保存しました");
    });
    const test = UI.button("secondary-btn", "接続テスト", async () => {
      AI.saveSettings({ apiKey: key.value.trim(), model: model.value });
      test.disabled = true;
      test.textContent = "確認中…";
      try {
        const reply = await AI.ping();
        UI.toast(`接続OK: ${reply}`);
      } catch (err) {
        UI.toast(err.message);
      } finally {
        test.disabled = false;
        test.textContent = "接続テスト";
      }
    });
    aiActions.append(test, save);
    body.appendChild(aiActions);

    body.appendChild(el("div", "ui-section-title", "表示"));
    const display = App.getDisplay();
    [
      ["pinyin", "ピンインを表示する"],
      ["translation", "日本語訳を表示する"],
    ].forEach(([k, label]) => {
      const row = el("label", "toggle-row");
      row.appendChild(el("span", null, label));
      const cb = el("input");
      cb.type = "checkbox";
      cb.checked = display[k];
      cb.addEventListener("change", () => App.toggleDisplay(k));
      row.appendChild(cb);
      body.appendChild(row);
    });
    const sfxRow = el("label", "toggle-row");
    sfxRow.appendChild(el("span", null, "効果音・振動"));
    const sfx = el("input");
    sfx.type = "checkbox";
    sfx.checked = AppState.getPref("sfx", true);
    sfx.addEventListener("change", () => {
      AppState.setPref("sfx", sfx.checked);
      if (sfx.checked) Motion.Sfx.correct();
    });
    sfxRow.appendChild(sfx);
    body.appendChild(sfxRow);

    if (window.WhisperASR && WhisperASR.isAvailable()) {
      body.appendChild(el("div", "ui-section-title", "スピーキング"));
      const wRow = el("label", "toggle-row");
      wRow.appendChild(el("span", null, "高精度認識(Whisper)を使う"));
      const w = el("input");
      w.type = "checkbox";
      w.checked = WhisperASR.isEnabled();
      w.addEventListener("change", () => {
        WhisperASR.setEnabled(w.checked);
        UI.toast(w.checked ? "高精度認識をオンにしました" : "高精度認識をオフにしました");
      });
      wRow.appendChild(w);
      body.appendChild(wRow);
      body.appendChild(
        el(
          "p",
          "sub-note",
          "録音をこの端末の中でAIモデル(数十MB)を使って文字起こしし、判定の精度を上げます。スマホではメモリ不足でアプリが落ちることがあるため、オフをおすすめします(スマホでは最初からオフ)。"
        )
      );
    }

    const crashes = Diag.crashes();
    if (crashes.length) {
      body.appendChild(el("div", "ui-section-title", "診断情報"));
      body.appendChild(
        el("p", "sub-note", "アプリが途中で終了した記録があります。不具合の報告のときは、この画面のスクリーンショットを送ってください。")
      );
      crashes.forEach((c) => {
        const box = el("div", "diag-box");
        box.appendChild(el("div", "diag-title", `${c.at}「${c.during}」の途中で終了(v${c.version})`));
        box.appendChild(el("pre", "diag-trail", c.trail.join("\n")));
        body.appendChild(box);
      });
      body.appendChild(
        UI.button("secondary-btn", "診断情報を消去", () => {
          Diag.clear();
          settings();
        })
      );
    }

    body.appendChild(el("div", "ui-section-title", "データ"));
    body.appendChild(
      UI.button("secondary-btn", "APIキーをこの端末から削除する", () => {
        AI.saveSettings({ apiKey: "" });
        key.value = "";
        UI.toast("APIキーを削除しました");
      })
    );
    body.appendChild(
      UI.button("secondary-btn danger-btn", "学習データをリセットする", () => {
        if (confirm("学習の進捗・ブックマーク・記録をすべてリセットします。よろしいですか?")) {
          AppState.reset();
          App.go("home");
        }
      })
    );
    body.appendChild(el("p", "sub-note diag-version", `バージョン ${APP_VERSION}`));
    screen.appendChild(body);
  }

  return { home, settings, bookmarks, levelTestIntro, cards };
})();

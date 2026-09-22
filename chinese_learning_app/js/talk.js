// トークタブ: AI話題トーク・語彙当てゲーム・中国語モーメンツ・会話リスニング
// (他のユーザーとつながる機能の代わりに、1人で練習できる形にしている)
const Talk = (() => {
  const { el, clear } = UI;

  function home() {
    const screen = UI.screen("screen--talk", { navId: "talk" });
    const head = el("div", "tk-head");
    head.appendChild(el("div", "tk-avatar", "🐼"));
    const texts = el("div");
    texts.appendChild(el("div", "tk-hi", `Hi ${AppState.getNickname()}`));
    texts.appendChild(el("div", "tk-sub", "思ったことを声に出してみよう"));
    head.appendChild(texts);
    UI.add(screen, head);

    const orbit = el("div", "tk-orbit");
    orbit.append(el("div", "tk-orbit-ring tk-orbit-ring--1"), el("div", "tk-orbit-ring tk-orbit-ring--2"), el("div", "tk-orbit-ring tk-orbit-ring--3"));
    const floaters = ["你好", "谢谢", "加油", "没事儿", "好吃"];
    floaters.forEach((w, i) => {
      const f = el("div", `tk-float tk-float--${i + 1}`, w);
      orbit.appendChild(f);
    });
    UI.add(screen, orbit);

    UI.add(screen, el("div", "tk-count", `これまでの会話練習: ${AppState.getPref("talkSessions", 0)}回`));

    const grid = el("div", "tk-grid");
    [
      { tone: "blue", title: "話題トーク", sub: "AIの友達と、話題を決めて雑談", art: "💬", go: topicTalk },
      { tone: "yellow", title: "語彙当て", sub: "私が言うのを当ててみて", art: "🎧", go: vocabGame },
      { tone: "green", title: "中国語モーメンツ", sub: "友達の投稿を読んでコメント", art: "🪐", go: moments },
      { tone: "pink", title: "みんなの会話", sub: "みんなが話しているのを聞いてみよう", art: "#", go: dialogues },
    ].forEach((c) => {
      const card = UI.button(`tk-card tk-card--${c.tone}`, "", c.go);
      card.appendChild(el("div", "tk-card-title", c.title));
      card.appendChild(el("div", "tk-card-sub", c.sub));
      card.appendChild(el("div", "tk-card-art", c.art));
      grid.appendChild(card);
    });
    UI.add(screen, grid);
  }

  function countSession() {
    AppState.setPref("talkSessions", AppState.getPref("talkSessions", 0) + 1);
  }

  // ---------- 話題トーク ----------
  function topicTalk() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("話題トーク", home));
    const body = el("div", "sub-body");
    screen.appendChild(body);
    body.appendChild(el("p", "sub-lead", "話し相手と話題を選ぶと、AIの友達が中国語で話しかけてきます。音声でも文字でも返事できます。"));

    let partner = TALK_PARTNERS.find((p) => p.id === AppState.getPref("talkPartner", "xiaomei")) || TALK_PARTNERS[0];
    body.appendChild(el("div", "ui-section-title", "話し相手"));
    const partners = el("div", "tk-partners");
    TALK_PARTNERS.forEach((p) => {
      const b = UI.button("tk-partner" + (p.id === partner.id ? " is-on" : ""), "", () => {
        partner = p;
        AppState.setPref("talkPartner", p.id);
        partners.querySelectorAll(".tk-partner").forEach((x) => x.classList.toggle("is-on", x === b));
      });
      b.appendChild(el("div", "tk-partner-avatar", p.avatar));
      b.appendChild(el("div", "tk-partner-name", p.name));
      b.appendChild(el("div", "tk-partner-desc", p.profile.split("。")[0]));
      partners.appendChild(b);
    });
    body.appendChild(partners);

    body.appendChild(el("div", "ui-section-title", "話題"));
    const grid = el("div", "tk-topics");
    TALK_TOPICS.forEach((t) => {
      const b = UI.button("tk-topic", "", () => {
        countSession();
        Chat.open({
          title: partner.name,
          subtitle: `話題: ${t.title}`,
          avatar: partner.avatar,
          role: `${partner.profile} 学習者とは語学交換で知り合った友達として、くだけた口調で話す。`,
          situation: `今日は「${t.opener}」について雑談する。あなたから話題を振って会話を始める。`,
          goal: null,
          onExit: topicTalk,
        });
      });
      b.appendChild(el("div", "tk-topic-icon", t.icon));
      b.appendChild(el("div", "tk-topic-title", t.title));
      grid.appendChild(b);
    });
    body.appendChild(grid);
  }

  // ---------- 語彙当てゲーム ----------
  function gamePool() {
    const map = new Map();
    const add = (hanzi, pinyin, meaning) => {
      if (!hanzi || !meaning || !pinyin || map.has(hanzi) || Array.from(hanzi).length > 6) return;
      map.set(hanzi, { hanzi, pinyin, meaning });
    };
    // 学習済みのレッスンの単語を優先し、少なければ単語帳・全レッスンから補う
    const lessons = UNITS.flatMap((u) => u.lessons);
    lessons.filter((l) => AppState.isLessonCompleted(l.id)).forEach((l) => LessonExtras.vocabItems(l).forEach((w) => add(w.hanzi, w.pinyin, w.meaning)));
    if (map.size < 20) lessons.slice(0, 12).forEach((l) => LessonExtras.vocabItems(l).forEach((w) => add(w.hanzi, w.pinyin, w.meaning)));
    if (map.size < 20) VOCAB_DECKS.forEach((d) => d.words.forEach((w) => add(w.hanzi, w.pinyin, w.meaning)));
    return Array.from(map.values());
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function vocabGame() {
    const ROUNDS = 10;
    const TIME = 10000;
    const pool = gamePool();
    const questions = shuffle(pool).slice(0, ROUNDS);
    let round = 0;
    let score = 0;
    let combo = 0;
    let timer = null;
    const best = AppState.getPref("vocabGameBest", 0);

    const screen = UI.screen("screen--sub screen--game");
    screen.appendChild(
      UI.subHeader("語彙当て", () => {
        clearInterval(timer);
        home();
      })
    );
    const body = el("div", "sub-body");
    screen.appendChild(body);

    function intro() {
      clear(body);
      const card = el("div", "game-intro");
      card.appendChild(el("div", "game-intro-art", "🎧"));
      card.appendChild(el("div", "game-intro-title", "私が言うのを当ててみて!"));
      card.appendChild(el("div", "game-intro-text", `中国語の音声を聞いて、正しい意味を選んでください。全${ROUNDS}問、早く答えるほど高得点!`));
      card.appendChild(el("div", "game-intro-best", `ベストスコア: ${best}点`));
      card.appendChild(UI.button("primary-btn", "スタート", ask));
      body.appendChild(card);
    }

    function ask() {
      clear(body);
      if (round >= questions.length) return finish();
      const q = questions[round];
      const others = shuffle(pool.filter((w) => w.meaning !== q.meaning)).slice(0, 3);
      const options = shuffle([q, ...others]);

      const top = el("div", "game-top");
      top.appendChild(el("div", "game-round", `${round + 1} / ${questions.length}`));
      top.appendChild(el("div", "game-score", `${score}点`));
      body.appendChild(top);
      const bar = el("div", "game-timer");
      const fill = el("div", "game-timer-fill");
      bar.appendChild(fill);
      body.appendChild(bar);

      const play = UI.iconButton("cs-speaker cs-speaker--main game-play", Icons.speaker, "もう一度聞く", () => Speech.speak(q.hanzi).catch(() => {}));
      body.appendChild(play);
      const reveal = el("div", "game-reveal");
      body.appendChild(reveal);
      const opts = el("div", "cs-choices");
      let answered = false;
      const started = Date.now();

      function resolve(picked) {
        if (answered) return;
        answered = true;
        clearInterval(timer);
        const correct = picked === q;
        const elapsed = Date.now() - started;
        if (correct) {
          combo++;
          score += 10 + Math.max(0, Math.round((TIME - elapsed) / 1000)) + (combo >= 3 ? 5 : 0);
        } else {
          combo = 0;
        }
        opts.querySelectorAll(".cs-choice").forEach((b, i) => {
          b.disabled = true;
          if (options[i] === q) b.classList.add("is-correct");
          else if (options[i] === picked) b.classList.add("is-wrong");
          else b.classList.add("is-dim");
        });
        reveal.appendChild(Ruby.render(q.hanzi, q.pinyin, { className: "game-reveal-ruby" }));
        if (combo >= 3) reveal.appendChild(el("div", "game-combo", `Combo x${combo}!`));
        round++;
        setTimeout(ask, 1300);
      }

      options.forEach((o) => {
        const b = UI.button("cs-choice", o.meaning, () => resolve(o));
        opts.appendChild(b);
      });
      body.appendChild(opts);

      setTimeout(() => Speech.speak(q.hanzi).catch(() => {}), 250);
      timer = setInterval(() => {
        const left = Math.max(0, TIME - (Date.now() - started));
        fill.style.width = `${(left / TIME) * 100}%`;
        if (left <= 0) resolve(null);
      }, 100);
    }

    function finish() {
      const newBest = Math.max(best, score);
      AppState.setPref("vocabGameBest", newBest);
      AppState.addXp(Math.round(score / 10));
      AppState.markStudiedToday();
      countSession();
      const card = el("div", "game-intro");
      card.appendChild(el("div", "game-intro-art", score > best ? "🏆" : "🎉"));
      card.appendChild(el("div", "game-intro-title", `${score}点`));
      card.appendChild(el("div", "game-intro-text", score > best ? "ベストスコア更新!" : `ベストスコア: ${newBest}点`));
      card.appendChild(UI.button("primary-btn", "もう一度", vocabGame));
      card.appendChild(UI.button("cs-text-btn", "トークに戻る", home));
      body.appendChild(card);
    }

    if (pool.length < 4) {
      body.appendChild(el("p", "sub-lead", "単語が足りません。レッスンを進めてから遊んでみてください。"));
      return;
    }
    intro();
  }

  // ---------- 中国語モーメンツ ----------
  function moments() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("中国語モーメンツ", home));
    const body = el("div", "sub-body mo-feed");
    body.appendChild(el("p", "sub-lead", "中国の友達(架空の人物)の投稿です。読んで、聞いて、コメントしてみよう。コメントには本人(AI)が返信します。"));
    const likes = AppState.getPref("momentLikes", {});

    MOMENTS.forEach((m) => {
      const p = MOMENT_PEOPLE[m.who];
      const card = el("div", "mo-card");
      const head = el("div", "mo-head");
      head.appendChild(el("div", "mo-avatar", p.avatar));
      const names = el("div");
      names.appendChild(el("div", "mo-name", p.name));
      names.appendChild(el("div", "mo-time", m.time));
      head.appendChild(names);
      card.appendChild(head);
      card.appendChild(Ruby.render(m.zh, m.pinyin, { className: "mo-text" }));
      const ja = el("div", "mo-ja hidden", m.ja);
      card.appendChild(ja);
      card.appendChild(el("div", "mo-photo", m.art));

      const actions = el("div", "mo-actions");
      const liked = !!likes[m.id];
      const like = UI.button("mo-act" + (liked ? " is-on" : ""), `${liked ? "❤️" : "🤍"} ${m.likes + (liked ? 1 : 0)}`, () => {
        const now = AppState.getPref("momentLikes", {});
        now[m.id] = !now[m.id];
        AppState.setPref("momentLikes", now);
        like.classList.toggle("is-on", now[m.id]);
        like.textContent = `${now[m.id] ? "❤️" : "🤍"} ${m.likes + (now[m.id] ? 1 : 0)}`;
      });
      actions.appendChild(like);
      actions.appendChild(UI.button("mo-act", "🔊 聞く", () => Speech.speak(m.zh).catch(() => {})));
      actions.appendChild(
        UI.button("mo-act", "訳", (e) => {
          ja.classList.toggle("hidden");
          e.currentTarget.classList.toggle("is-on", !ja.classList.contains("hidden"));
        })
      );
      actions.appendChild(UI.button("mo-act mo-act--comment", "💬 コメント", () => commentOn(m, p)));
      card.appendChild(actions);
      body.appendChild(card);
    });
    screen.appendChild(body);
  }

  function commentOn(m, p) {
    countSession();
    const intro = el("div", "mo-quote");
    intro.appendChild(el("div", "mo-quote-label", `${p.name}の投稿`));
    intro.appendChild(Ruby.render(m.zh, m.pinyin, { className: "mo-quote-text" }));
    intro.appendChild(el("div", "mo-quote-ja tr-text", m.ja));
    intro.appendChild(el("div", "mo-quote-hint", "💡 例: 「太棒了！」「辛苦了！」「我也想去！」など、中国語でコメントしてみよう"));
    Chat.open({
      title: p.name,
      subtitle: "モーメンツのコメント",
      avatar: p.avatar,
      role: `${p.profile} SNSに投稿した本人として、学習者からのコメントに友達らしく返信し、そのまま雑談を続ける。`,
      situation: `あなたがSNSに投稿した内容:「${m.zh}」(${m.ja})。学習者がこの投稿にコメントしてくれた。`,
      goal: null,
      aiStarts: false,
      intro,
      placeholder: "コメントを入力(中国語で)",
      onExit: moments,
    });
  }

  // ---------- みんなの会話(リスニング) ----------
  function speakerInfo(key) {
    return MOMENT_PEOPLE[key] || DIALOGUE_EXTRA_PEOPLE[key] || { name: key, avatar: "🙂" };
  }

  function dialogues() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("みんなの会話", home));
    const body = el("div", "sub-body");
    body.appendChild(el("p", "sub-lead", "中国の人たちの会話を聞いてみよう。1文ずつタップして聞いたり、通して再生したりできます。"));
    DIALOGUES.forEach((d) => {
      const row = UI.button("dl-row", "", () => dialogueDetail(d));
      row.appendChild(el("div", "dl-row-art", d.art));
      const t = el("div", "dl-row-texts");
      t.appendChild(el("div", "dl-row-title", d.title));
      const who = Object.values(d.speakers)
        .map((k) => speakerInfo(k).name)
        .join(" と ");
      t.appendChild(el("div", "dl-row-sub", `${who}・${d.lines.length}文`));
      row.appendChild(t);
      row.appendChild(el("span", "pr-tag pr-tag--" + { 初級: "beginner", 中級: "intermediate", 上級: "advanced" }[d.level], d.level));
      body.appendChild(row);
    });
    screen.appendChild(body);
  }

  function dialogueDetail(d) {
    const screen = UI.screen("screen--sub");
    let stopped = false;
    screen.appendChild(
      UI.subHeader(d.title, () => {
        stopped = true;
        dialogues();
      })
    );
    const body = el("div", "sub-body");
    const pitch = { A: 1.15, B: 0.85 };
    const rows = d.lines.map(([side, zh, py, ja]) => {
      const who = speakerInfo(d.speakers[side]);
      const row = el("div", `dl-line dl-line--${side}`);
      row.appendChild(el("div", "dl-line-avatar", who.avatar));
      const bubble = UI.button("dl-bubble", "", () => Speech.speak(zh, { pitch: pitch[side] }).catch(() => {}));
      bubble.appendChild(el("div", "dl-name", who.name));
      bubble.appendChild(Ruby.render(zh, py, { className: "dl-ruby" }));
      bubble.appendChild(el("div", "dl-ja tr-text", ja));
      row.appendChild(bubble);
      body.appendChild(row);
      return { row, zh, side };
    });

    const bar = el("div", "dl-bar");
    const playAll = UI.button("primary-btn", "▶ 通して再生", async () => {
      playAll.disabled = true;
      stopped = false;
      for (const r of rows) {
        if (stopped || !r.row.isConnected) break;
        rows.forEach((x) => x.row.classList.remove("is-playing"));
        r.row.classList.add("is-playing");
        r.row.scrollIntoView({ block: "center", behavior: "smooth" });
        await Speech.speak(r.zh, { pitch: pitch[r.side] }).catch(() => {});
        await new Promise((res) => setTimeout(res, 350));
      }
      rows.forEach((x) => x.row.classList.remove("is-playing"));
      playAll.disabled = false;
      AppState.markStudiedToday();
      AppState.addXp(3);
    });
    bar.appendChild(playAll);
    screen.appendChild(body);
    screen.appendChild(bar);
  }

  return { home, topicTalk, vocabGame, moments, dialogues };
})();

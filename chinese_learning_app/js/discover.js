// 発見タブ: ピンイン(pinyin_course.js へ)・漢字入門・語彙力アップ・日常フレーズ・流行フレーズ・ネイティブ表現・ニュース
const Discover = (() => {
  const { el, clear } = UI;

  function dayIndex() {
    return Math.floor(Date.now() / 86400000);
  }

  function home() {
    const screen = UI.screen("screen--discover", { navId: "discover" });
    UI.add(screen, el("h1", "page-title", "発見"));

    const icons = el("div", "dc-icons");
    [
      { label: "ピンイン入門", glyph: "a", tone: "orange", go: () => PinyinCourse.map() },
      { label: "漢字入門", glyph: "汉", tone: "purple", go: hanziIntro },
      { label: "語彙力アップ", glyph: "A", tone: "blue", go: () => App.go("flashcards") },
      { label: "日常フレーズ", glyph: "≡", tone: "teal", go: phrases },
    ].forEach((it) => {
      const b = UI.button("dc-icon", "", it.go);
      b.appendChild(el("span", `dc-icon-box dc-icon-box--${it.tone}`, it.glyph));
      b.appendChild(el("span", "dc-icon-label", it.label));
      icons.appendChild(b);
    });
    UI.add(screen, icons);

    UI.add(screen, UI.sectionTitle("おすすめ", "1日3分で、実践的な中国語を学ぼう"));
    const pick = TRENDY_PHRASES[dayIndex() % TRENDY_PHRASES.length];
    const feature = UI.button("dc-feature", "", () => slangDetail(pick, "trendy"));
    const art = el("div", "dc-feature-art");
    art.appendChild(el("div", "dc-feature-art-zh", pick.zh + "。"));
    art.appendChild(el("div", "dc-feature-art-emoji", pick.art));
    feature.appendChild(art);
    const ft = el("div", "dc-feature-texts");
    ft.appendChild(el("div", "dc-feature-title", pick.title));
    ft.appendChild(el("div", "dc-feature-sub", `${pick.zh} (${pick.pinyin})`));
    const tags = el("div", "dc-tags");
    tags.appendChild(el("span", "dc-tag dc-tag--green", "今日の一語"));
    tags.appendChild(el("span", "dc-tag dc-tag--blue", "流行語"));
    ft.appendChild(tags);
    feature.appendChild(ft);
    UI.add(screen, feature);

    const rail = el("div", "dc-rail");
    [
      { icon: "🔥", title: "流行フレーズ", sub: "中国人が今よく言っている言葉", tone: "pink", go: () => slangList("trendy") },
      { icon: "🗣️", title: "ネイティブ表現", sub: "中国人のように話したい!", tone: "blue", go: () => slangList("native") },
      { icon: "📰", title: "ビジネスニュース", sub: "毎日3本、中国語で読む", tone: "green", go: () => App.go("news") },
    ].forEach((c) => {
      const card = UI.button(`dc-rail-card dc-rail-card--${c.tone}`, "", c.go);
      card.appendChild(el("div", "dc-rail-icon", c.icon));
      card.appendChild(el("div", "dc-rail-title", c.title));
      card.appendChild(el("div", "dc-rail-sub", c.sub));
      rail.appendChild(card);
    });
    UI.add(screen, rail);

    const newsHead = el("div", "dc-news-head");
    newsHead.appendChild(el("h2", "ui-section-title", "最近更新"));
    newsHead.appendChild(UI.button("dc-more", "→", () => App.go("news")));
    UI.add(screen, newsHead);
    const list = el("div", "dc-news-list");
    App.getTodaysArticles().forEach((a) => {
      const row = UI.button("dc-news", "", () => App.openArticle(a));
      row.appendChild(el("div", "dc-news-art", a.category.slice(0, 2)));
      const t = el("div", "dc-news-texts");
      t.appendChild(el("div", "dc-news-title", a.titleZh));
      t.appendChild(el("div", "dc-news-sub", a.titleJa));
      const tg = el("div", "dc-tags");
      tg.appendChild(el("span", "dc-tag dc-tag--green", a.category));
      if (AppState.isArticleRead(a.id)) tg.appendChild(el("span", "dc-tag dc-tag--blue", "既読"));
      t.appendChild(tg);
      row.appendChild(t);
      list.appendChild(row);
    });
    UI.add(screen, list);
  }

  // ---------- 漢字入門 ----------
  function hanziIntro() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("漢字入門", home));
    const body = el("div", "sub-body");
    body.appendChild(el("p", "sub-lead", "基本の漢字を、書き順アニメーションと なぞり書きで覚えましょう。日本の漢字と形が違う「簡体字」にも注目!"));
    HANZI_GROUPS.forEach((g) => {
      body.appendChild(el("div", "ui-section-title", `${g.icon} ${g.title}`));
      const grid = el("div", "hz-grid");
      g.chars.forEach((c) => {
        const tile = UI.button("hz-tile", "", () => hanziDetail(g, c));
        tile.appendChild(el("div", "hz-tile-py", c.pinyin));
        tile.appendChild(el("div", "hz-tile-ch", c.ch));
        tile.appendChild(el("div", "hz-tile-mean", c.meaning));
        grid.appendChild(tile);
      });
      body.appendChild(grid);
    });
    screen.appendChild(body);
  }

  function hanziDetail(group, c) {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader(`${c.ch}(${c.pinyin})`, hanziIntro));
    const body = el("div", "sub-body");
    screen.appendChild(body);

    const stage = el("div", "hz-stage");
    const target = el("div", "hz-writer");
    stage.appendChild(target);
    body.appendChild(stage);

    let writer = null;
    if (window.HanziWriter && HANZI_STROKES[c.ch]) {
      writer = HanziWriter.create(target, c.ch, {
        width: 240,
        height: 240,
        padding: 12,
        showOutline: true,
        strokeColor: "#ff9a1f",
        radicalColor: "#e27c00",
        outlineColor: "#e6e7eb",
        drawingColor: "#3c3c3c",
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 250,
        charDataLoader: (ch, onComplete) => onComplete(HANZI_STROKES[ch]),
      });
      setTimeout(() => writer.animateCharacter(), 300);
    } else {
      target.appendChild(el("div", "hz-fallback", c.ch));
    }

    const controls = el("div", "hz-controls");
    controls.appendChild(UI.button("hz-btn", "▶ 書き順", () => writer && writer.animateCharacter()));
    controls.appendChild(
      UI.button("hz-btn", "✍️ なぞる", () => {
        if (!writer) return;
        writer.quiz({
          onComplete: (summary) => {
            UI.toast(summary.totalMistakes === 0 ? "完璧です!" : `完成!(ミス ${summary.totalMistakes} 回)`);
            AppState.addXp(2);
            AppState.markStudiedToday();
          },
        });
      })
    );
    controls.appendChild(UI.button("hz-btn", "🔊", () => Speech.speak(c.ch, { rate: 0.7 }).catch(() => {})));
    body.appendChild(controls);

    const info = el("div", "hz-info");
    info.appendChild(el("div", "hz-info-py", c.pinyin));
    info.appendChild(el("div", "hz-info-mean", c.meaning));
    info.appendChild(el("div", "hz-info-note", c.note));
    body.appendChild(info);

    body.appendChild(el("div", "ui-section-title", "この字を使った言葉"));
    c.words.forEach(([zh, py, ja]) => body.appendChild(UI.zhBlock({ hanzi: zh, pinyin: py, ja, size: "sm", bookmark: { hanzi: zh, pinyin: py, meaning: ja, source: "漢字入門" } })));

    const idx = group.chars.indexOf(c);
    const nav = el("div", "hz-nav");
    const prev = group.chars[idx - 1];
    const next = group.chars[idx + 1];
    nav.appendChild(UI.button("secondary-btn", prev ? `← ${prev.ch}` : " ", () => prev && hanziDetail(group, prev)));
    nav.appendChild(UI.button("secondary-btn", next ? `${next.ch} →` : " ", () => next && hanziDetail(group, next)));
    if (!prev) nav.firstChild.disabled = true;
    if (!next) nav.lastChild.disabled = true;
    body.appendChild(nav);
  }

  // ---------- 日常フレーズ ----------
  function phrases() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("日常フレーズ", home));
    const body = el("div", "sub-body");
    body.appendChild(el("p", "sub-lead", "旅行や日常ですぐ使えるフレーズ集です。タップで音声、☆でブックマークできます。"));
    const grid = el("div", "ph-cats");
    DAILY_PHRASES.forEach((cat) => {
      const card = UI.button("ph-cat", "", () => phraseCategory(cat));
      card.appendChild(el("div", "ph-cat-icon", cat.icon));
      card.appendChild(el("div", "ph-cat-title", cat.title));
      card.appendChild(el("div", "ph-cat-count", `${cat.phrases.length}フレーズ`));
      grid.appendChild(card);
    });
    body.appendChild(grid);
    screen.appendChild(body);
  }

  function phraseCategory(cat) {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader(`${cat.icon} ${cat.title}`, phrases));
    const body = el("div", "sub-body");
    cat.phrases.forEach(([zh, py, ja]) => {
      const block = UI.zhBlock({ hanzi: zh, pinyin: py, ja, bookmark: { hanzi: zh, pinyin: py, meaning: ja, source: "日常フレーズ" } });
      block.classList.add("ph-item");
      body.appendChild(block);
    });
    body.appendChild(
      UI.button("primary-btn", "▶ ぜんぶ続けて聞く", async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        for (const [zh] of cat.phrases) {
          if (!btn.isConnected) break;
          await Speech.speak(zh).catch(() => {});
          await new Promise((r) => setTimeout(r, 400));
        }
        btn.disabled = false;
        AppState.markStudiedToday();
      })
    );
    screen.appendChild(body);
  }

  // ---------- 流行フレーズ / ネイティブ表現 ----------
  function slangList(kind) {
    const items = kind === "trendy" ? TRENDY_PHRASES : NATIVE_EXPRESSIONS;
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader(kind === "trendy" ? "🔥 流行フレーズ" : "🗣️ ネイティブ表現", home));
    const body = el("div", "sub-body");
    body.appendChild(
      el(
        "p",
        "sub-lead",
        kind === "trendy" ? "中国のSNSや若者の会話でよく見かける言葉です。" : "教科書にはあまり載っていない、会話でよく使う自然な言い回しです。"
      )
    );
    items.forEach((it) => {
      const row = UI.button("sl-row", "", () => slangDetail(it, kind));
      row.appendChild(el("div", "sl-row-art", it.art));
      const t = el("div", "sl-row-texts");
      t.appendChild(el("div", "sl-row-zh", `${it.zh}  ${it.pinyin}`));
      t.appendChild(el("div", "sl-row-title", it.title));
      row.appendChild(t);
      body.appendChild(row);
    });
    screen.appendChild(body);
  }

  function slangDetail(it, kind) {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader(kind === "trendy" ? "流行フレーズ" : "ネイティブ表現", () => slangList(kind)));
    const body = el("div", "sub-body");
    const hero = el("div", "sl-hero");
    hero.appendChild(el("div", "sl-hero-art", it.art));
    hero.appendChild(Ruby.render(it.zh, it.pinyin, { className: "sl-hero-ruby" }));
    hero.appendChild(el("div", "sl-hero-title", it.title));
    const tools = el("div", "sl-hero-tools");
    tools.appendChild(UI.speakerButton(it.zh));
    tools.appendChild(UI.bookmarkButton({ hanzi: it.zh, pinyin: it.pinyin, meaning: it.title, source: kind === "trendy" ? "流行フレーズ" : "ネイティブ表現" }));
    hero.appendChild(tools);
    body.appendChild(hero);
    body.appendChild(el("div", "ui-section-title", "どんな意味?"));
    body.appendChild(el("div", "sl-explain", it.explain));
    body.appendChild(el("div", "ui-section-title", "例文"));
    body.appendChild(UI.zhBlock({ hanzi: it.ex[0], pinyin: it.ex[1], ja: it.ex[2], bookmark: { hanzi: it.ex[0], pinyin: it.ex[1], meaning: it.ex[2], source: "例文" } }));
    screen.appendChild(body);
    setTimeout(() => Speech.speak(it.zh).catch(() => {}), 300);
    AppState.markStudiedToday();
  }

  return { home, hanziIntro, phrases, slangList };
})();

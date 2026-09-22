// 練習タブ: AI講師との会話・作文添削・カメラ識別・絵を見て話す・シナリオ会話・AIに質問
const Practice = (() => {
  const { el, clear } = UI;
  const LEVEL_LABEL = { beginner: "初級", intermediate: "中級", advanced: "上級" };
  const TUTOR = { name: "小雅先生", avatar: "👩‍🏫" };
  let filter = { category: "all", level: "all" };

  function home() {
    const screen = UI.screen("screen--practice", { navId: "practice" });

    const hero = el("div", "pr-hero");
    const heroText = el("div", "pr-hero-text");
    heroText.appendChild(el("div", "pr-hero-hello", `こんにちは、${AppState.getNickname()}さん`));
    heroText.appendChild(el("div", "pr-hero-sub", `私はAI講師の${TUTOR.name}です`));
    hero.appendChild(heroText);
    hero.appendChild(el("div", "pr-hero-avatar", TUTOR.avatar));
    UI.add(screen, hero);

    const panel = el("div", "pr-panel");
    const tiles = el("div", "pr-tiles");
    [
      { icon: "📷", label: "AIカメラ識別", tone: "blue", go: camera },
      { icon: "📝", label: "作文添削", tone: "purple", go: essay },
      { icon: "💬", label: "会話トレーニング", tone: "teal", go: freeTalk },
      { icon: "🖼️", label: "絵を見て話す", tone: "peach", go: pictureList },
    ].forEach((t) => {
      const tile = UI.button(`pr-tile pr-tile--${t.tone}`, "", t.go);
      tile.appendChild(el("span", "pr-tile-icon", t.icon));
      tile.appendChild(el("span", "pr-tile-label", t.label));
      tiles.appendChild(tile);
    });
    panel.appendChild(tiles);

    const head = el("div", "pr-scn-head");
    head.appendChild(el("h2", "ui-section-title", "シナリオ別会話練習"));
    head.appendChild(UI.button("pr-custom-btn", "✏️ 自分でテーマを設定する", customTheme));
    panel.appendChild(head);

    const catRow = el("div", "pr-chips");
    SCENARIO_CATEGORIES.forEach((c) => {
      catRow.appendChild(
        UI.button("pr-chip" + (filter.category === c.id ? " is-on" : ""), c.label, () => {
          filter.category = c.id;
          home();
        })
      );
    });
    panel.appendChild(catRow);

    const lvRow = el("div", "pr-levels");
    SCENARIO_LEVELS.forEach((l) => {
      lvRow.appendChild(
        UI.button("pr-level" + (filter.level === l.id ? " is-on" : ""), l.label, () => {
          filter.level = l.id;
          home();
        })
      );
    });
    panel.appendChild(lvRow);

    const list = el("div", "pr-scn-list");
    SCENARIOS.filter(
      (s) => (filter.category === "all" || s.category === filter.category) && (filter.level === "all" || s.level === filter.level)
    ).forEach((s) => {
      const item = UI.button("pr-scn", "", () => startScenario(s));
      item.appendChild(el("div", "pr-scn-art", s.icon));
      const texts = el("div", "pr-scn-texts");
      texts.appendChild(el("div", "pr-scn-title", s.title));
      texts.appendChild(el("div", "pr-scn-desc", s.situation));
      const tags = el("div", "pr-scn-tags");
      tags.appendChild(el("span", `pr-tag pr-tag--${s.level}`, LEVEL_LABEL[s.level]));
      tags.appendChild(el("span", "pr-tag pr-tag--ai", "AI会話"));
      texts.appendChild(tags);
      item.appendChild(texts);
      list.appendChild(item);
    });
    panel.appendChild(list);
    UI.add(screen, panel);

    const ask = UI.button("pr-ask-bar", "", askAI);
    ask.appendChild(el("span", "pr-ask-avatar", "🐼"));
    ask.appendChild(el("span", "pr-ask-text", "AI先生に質問する"));
    UI.add(screen, ask);
  }

  function startScenario(s) {
    Chat.open({
      title: s.title,
      subtitle: `${LEVEL_LABEL[s.level]}・シナリオ会話`,
      avatar: s.icon,
      role: s.role,
      situation: s.situation,
      goal: s.goal,
    });
  }

  function freeTalk() {
    Chat.open({
      title: TUTOR.name,
      subtitle: "会話トレーニング",
      avatar: TUTOR.avatar,
      role: `やさしい中国語講師「${TUTOR.name}」。学習者の話をよく聞き、ほめながら会話を広げる。`,
      situation: "日常的な話題で自由に雑談する会話練習。最初は学習者に今日の調子や最近あったことを聞く。",
      goal: null,
    });
  }

  function customTheme() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("テーマを設定", home));
    const body = el("div", "sub-body");
    body.appendChild(el("p", "sub-lead", "練習したい場面を自由に書いてください。AIがその相手役になって会話します。"));
    const sceneLabel = el("label", "form-label", "場面・状況");
    const scene = el("textarea", "form-input form-input--area");
    scene.placeholder = "例: 中国の取引先と夕食の席で、乾杯のあいさつをする";
    const roleLabel = el("label", "form-label", "相手の役(任意)");
    const role = el("input", "form-input");
    role.placeholder = "例: 取引先の部長";
    const goalLabel = el("label", "form-label", "会話のゴール(任意)");
    const goal = el("input", "form-input");
    goal.placeholder = "例: 感謝を伝えて、今後の協力をお願いする";
    body.append(sceneLabel, scene, roleLabel, role, goalLabel, goal);
    const start = UI.button("primary-btn", "会話をはじめる", () => {
      if (!scene.value.trim()) {
        UI.toast("場面を入力してください");
        return;
      }
      Chat.open({
        title: "オリジナル会話",
        subtitle: scene.value.trim().slice(0, 24),
        avatar: "✏️",
        role: role.value.trim() || "場面にふさわしい中国語話者の相手役",
        situation: scene.value.trim(),
        goal: goal.value.trim() || null,
        onExit: home,
      });
    });
    body.appendChild(start);
    screen.appendChild(body);
  }

  // ---------- AIカメラ識別 ----------
  const CAMERA_SCHEMA = {
    type: "object",
    properties: {
      scene_zh: { type: "string" },
      scene_pinyin: { type: "string" },
      scene_ja: { type: "string" },
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            hanzi: { type: "string" },
            pinyin: { type: "string" },
            meaning_ja: { type: "string" },
            example_zh: { type: "string" },
            example_pinyin: { type: "string" },
            example_ja: { type: "string" },
          },
          required: ["hanzi", "pinyin", "meaning_ja", "example_zh", "example_pinyin", "example_ja"],
          additionalProperties: false,
        },
      },
    },
    required: ["scene_zh", "scene_pinyin", "scene_ja", "items"],
    additionalProperties: false,
  };

  function camera() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("AIカメラ識別", home));
    const body = el("div", "sub-body");
    screen.appendChild(body);
    if (UI.keyGate(body)) return;
    body.appendChild(el("p", "sub-lead", "身の回りの物を撮影すると、写っている物の中国語・ピンイン・例文をAIが教えてくれます。"));

    const picker = el("label", "cam-picker");
    picker.appendChild(el("span", "cam-picker-icon", "📷"));
    picker.appendChild(el("span", "cam-picker-text", "写真を撮る / 選ぶ"));
    const file = el("input");
    file.type = "file";
    file.accept = "image/*";
    file.setAttribute("capture", "environment");
    file.className = "visually-hidden";
    picker.appendChild(file);
    body.appendChild(picker);

    const result = el("div", "cam-result");
    body.appendChild(result);

    file.addEventListener("change", async () => {
      const f = file.files && file.files[0];
      if (!f) return;
      clear(result);
      let image;
      try {
        image = await AI.imageFileToBase64(f);
      } catch (err) {
        result.appendChild(el("div", "chat-error", "⚠️ " + err.message));
        return;
      }
      const img = el("img", "cam-photo");
      img.src = image.dataUrl;
      img.alt = "撮影した写真";
      result.appendChild(img);
      const loading = el("div", "ai-loading", "AIが写真を見ています…");
      result.appendChild(loading);
      try {
        const data = await AI.json({
          system:
            "あなたは日本語話者に中国語を教える先生です。写真に写っている主な物を3〜6個取り上げ、簡体字の中国語・声調記号付きピンイン(単語ごとにスペース区切り)・日本語の意味・その物を使った短い例文(ピンインと日本語訳付き)を返します。scene_zh は写真全体を説明する1文。人物が写っていても個人を特定する説明はしない。",
          messages: [
            {
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } },
                { type: "text", text: `この写真に写っている物を中国語で教えてください。学習者のレベル: ${UI.levelLabel()}` },
              ],
            },
          ],
          schema: CAMERA_SCHEMA,
          effort: "medium",
        });
        loading.remove();
        result.appendChild(el("div", "ui-section-title", "写真の説明"));
        result.appendChild(UI.zhBlock({ hanzi: data.scene_zh, pinyin: data.scene_pinyin, ja: data.scene_ja, bookmark: { hanzi: data.scene_zh, pinyin: data.scene_pinyin, meaning: data.scene_ja, source: "AIカメラ" } }));
        result.appendChild(el("div", "ui-section-title", "写っている物"));
        data.items.forEach((it) => {
          const card = el("div", "cam-item");
          card.appendChild(UI.zhBlock({ hanzi: it.hanzi, pinyin: it.pinyin, ja: it.meaning_ja, size: "lg", bookmark: { hanzi: it.hanzi, pinyin: it.pinyin, meaning: it.meaning_ja, source: "AIカメラ" } }));
          card.appendChild(UI.zhBlock({ hanzi: it.example_zh, pinyin: it.example_pinyin, ja: it.example_ja, size: "sm" }));
          result.appendChild(card);
        });
        AppState.addXp(5);
        AppState.markStudiedToday();
      } catch (err) {
        loading.remove();
        result.appendChild(el("div", "chat-error", "⚠️ " + err.message));
      }
      file.value = "";
    });
  }

  // ---------- 作文添削 ----------
  const ESSAY_SCHEMA = {
    type: "object",
    properties: {
      score: { type: "integer" },
      overall_ja: { type: "string" },
      corrected_zh: { type: "string" },
      corrected_pinyin: { type: "string" },
      corrections: {
        type: "array",
        items: {
          type: "object",
          properties: {
            original: { type: "string" },
            corrected: { type: "string" },
            explanation_ja: { type: "string" },
          },
          required: ["original", "corrected", "explanation_ja"],
          additionalProperties: false,
        },
      },
      good_points_ja: { type: "array", items: { type: "string" } },
      model_zh: { type: "string" },
      model_pinyin: { type: "string" },
      model_ja: { type: "string" },
    },
    required: ["score", "overall_ja", "corrected_zh", "corrected_pinyin", "corrections", "good_points_ja", "model_zh", "model_pinyin", "model_ja"],
    additionalProperties: false,
  };

  const ESSAY_TOPICS = ["自己紹介", "私の週末", "私の仕事", "好きな食べ物", "私の町", "最近うれしかったこと", "自由テーマ"];

  function essay() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("作文添削", home));
    const body = el("div", "sub-body");
    screen.appendChild(body);
    if (UI.keyGate(body)) return;
    body.appendChild(el("p", "sub-lead", "中国語で作文を書くと、AIが間違いを直して、より自然な表現と模範文を教えてくれます。"));

    let topic = ESSAY_TOPICS[0];
    const chips = el("div", "pr-chips pr-chips--wrap");
    ESSAY_TOPICS.forEach((t) => {
      const c = UI.button("pr-chip" + (t === topic ? " is-on" : ""), t, () => {
        topic = t;
        chips.querySelectorAll(".pr-chip").forEach((x) => x.classList.toggle("is-on", x === c));
      });
      chips.appendChild(c);
    });
    body.appendChild(el("label", "form-label", "テーマ"));
    body.appendChild(chips);

    body.appendChild(el("label", "form-label", "作文(中国語)"));
    const text = el("textarea", "form-input form-input--area form-input--essay");
    text.placeholder = "例: 我叫田中，我是日本人。我在东京工作……";
    text.value = AppState.getPref("essayDraft", "");
    text.addEventListener("input", () => AppState.setPref("essayDraft", text.value));
    body.appendChild(text);

    const actions = el("div", "essay-actions");
    const dictate = UI.button("secondary-btn essay-dictate", "🎙️ 音声で入力", async () => {
      if (!Speech.isRecognitionSupported()) {
        UI.toast("この端末は音声入力に対応していません");
        return;
      }
      dictate.disabled = true;
      dictate.textContent = "聞き取り中…";
      try {
        const alts = await Speech.recognizeOnce();
        text.value = text.value + alts[0];
        AppState.setPref("essayDraft", text.value);
      } catch (e) {
        UI.toast("うまく聞き取れませんでした");
      } finally {
        dictate.disabled = false;
        dictate.textContent = "🎙️ 音声で入力";
      }
    });
    const submit = UI.button("primary-btn", "添削する", () => run());
    actions.append(dictate, submit);
    body.appendChild(actions);

    const result = el("div", "essay-result");
    body.appendChild(result);

    async function run() {
      const content = text.value.trim();
      if (!content) {
        UI.toast("作文を入力してください");
        return;
      }
      submit.disabled = true;
      clear(result);
      const loading = el("div", "ai-loading", "AIが添削しています…");
      result.appendChild(loading);
      try {
        const r = await AI.json({
          system:
            "あなたは日本語話者に中国語作文を指導する経験豊富な先生です。学習者の作文を添削します。説明はすべて日本語。中国語は簡体字、ピンインは声調記号付きで単語ごとにスペース区切り。score は0〜100の整数(レベル相応の評価)。corrections は直すべき箇所ごとに原文の該当部分・修正後・理由。問題がない箇所は含めない。good_points_ja はよくできている点を1〜3個。model_zh は同じテーマ・同じくらいの長さで、学習者のレベルより少し上の模範文。",
          messages: [
            {
              role: "user",
              content: `テーマ: ${topic}\n学習者のレベル: ${UI.levelLabel()}\n\n作文:\n${content}`,
            },
          ],
          schema: ESSAY_SCHEMA,
          effort: "medium",
        });
        loading.remove();
        renderEssayResult(result, r);
        AppState.addXp(10);
        AppState.markStudiedToday();
      } catch (err) {
        loading.remove();
        result.appendChild(el("div", "chat-error", "⚠️ " + err.message));
      } finally {
        submit.disabled = false;
      }
    }
  }

  function scoreBadge(score) {
    const s = el("div", "score-badge " + (score >= 80 ? "is-good" : score >= 60 ? "is-ok" : "is-low"));
    s.appendChild(el("span", "score-badge-num", String(score)));
    s.appendChild(el("span", "score-badge-unit", "点"));
    return s;
  }

  function renderEssayResult(container, r) {
    const head = el("div", "result-head");
    head.appendChild(scoreBadge(r.score));
    head.appendChild(el("div", "result-overall", r.overall_ja));
    container.appendChild(head);

    container.appendChild(el("div", "ui-section-title", "添削後の文章"));
    container.appendChild(UI.zhBlock({ hanzi: r.corrected_zh, pinyin: r.corrected_pinyin, bookmark: null }));

    if (r.corrections.length) {
      container.appendChild(el("div", "ui-section-title", `直したところ(${r.corrections.length}か所)`));
      r.corrections.forEach((c) => {
        const item = el("div", "fix-item");
        const line = el("div", "fix-line");
        line.appendChild(el("span", "fix-old", c.original));
        line.appendChild(el("span", "fix-arrow", "→"));
        line.appendChild(el("span", "fix-new", c.corrected));
        item.appendChild(line);
        item.appendChild(el("div", "fix-note", c.explanation_ja));
        container.appendChild(item);
      });
    } else {
      container.appendChild(el("div", "fix-perfect", "🎉 直すところはありませんでした!"));
    }

    if (r.good_points_ja.length) {
      container.appendChild(el("div", "ui-section-title", "よかった点"));
      const ul = el("ul", "chat-feedback-list");
      r.good_points_ja.forEach((g) => ul.appendChild(el("li", null, g)));
      container.appendChild(ul);
    }

    container.appendChild(el("div", "ui-section-title", "模範文"));
    container.appendChild(
      UI.zhBlock({ hanzi: r.model_zh, pinyin: r.model_pinyin, ja: r.model_ja, bookmark: { hanzi: r.model_zh, pinyin: r.model_pinyin, meaning: r.model_ja, source: "作文添削" } })
    );
  }

  // ---------- 絵を見て話す ----------
  const PICTURE_SCHEMA = {
    type: "object",
    properties: {
      score: { type: "integer" },
      feedback_ja: { type: "string" },
      corrected_zh: { type: "string" },
      corrected_pinyin: { type: "string" },
      model_zh: { type: "string" },
      model_pinyin: { type: "string" },
      model_ja: { type: "string" },
      useful_words: {
        type: "array",
        items: {
          type: "object",
          properties: { hanzi: { type: "string" }, pinyin: { type: "string" }, meaning_ja: { type: "string" } },
          required: ["hanzi", "pinyin", "meaning_ja"],
          additionalProperties: false,
        },
      },
    },
    required: ["score", "feedback_ja", "corrected_zh", "corrected_pinyin", "model_zh", "model_pinyin", "model_ja", "useful_words"],
    additionalProperties: false,
  };

  function pictureList() {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("絵を見て話す", home));
    const body = el("div", "sub-body");
    body.appendChild(el("p", "sub-lead", "絵を見て、何が起きているかを中国語で説明してみましょう。AIが評価して、もっと自然な言い方を教えてくれます。"));
    const grid = el("div", "pic-grid");
    PICTURE_SCENES.forEach((p) => {
      const card = UI.button("pic-card", "", () => pictureDetail(p));
      card.appendChild(el("div", "pic-art", p.art));
      card.appendChild(el("div", "pic-title", p.title));
      grid.appendChild(card);
    });
    body.appendChild(grid);
    screen.appendChild(body);
  }

  function pictureDetail(p) {
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader(p.title, pictureList));
    const body = el("div", "sub-body");
    screen.appendChild(body);
    const art = el("div", "pic-stage");
    art.appendChild(el("div", "pic-stage-art", p.art));
    body.appendChild(art);
    if (UI.keyGate(body)) return;
    body.appendChild(el("div", "sub-lead", "この絵について、中国語で2〜3文で説明してみよう(音声でも入力できます)。"));

    const text = el("textarea", "form-input form-input--area");
    text.placeholder = "例: 他们一家人在吃火锅……";
    body.appendChild(text);
    const actions = el("div", "essay-actions");
    const mic = UI.button("secondary-btn essay-dictate", "🎙️ 話して入力", async () => {
      if (!Speech.isRecognitionSupported()) {
        UI.toast("この端末は音声入力に対応していません");
        return;
      }
      mic.disabled = true;
      mic.textContent = "聞き取り中…";
      try {
        const alts = await Speech.recognizeOnce();
        text.value = text.value + alts[0];
      } catch (e) {
        UI.toast("うまく聞き取れませんでした");
      } finally {
        mic.disabled = false;
        mic.textContent = "🎙️ 話して入力";
      }
    });
    const submit = UI.button("primary-btn", "評価してもらう", () => run());
    actions.append(mic, submit);
    body.appendChild(actions);
    const result = el("div", "essay-result");
    body.appendChild(result);

    async function run() {
      const answer = text.value.trim();
      if (!answer) {
        UI.toast("説明を入力してください");
        return;
      }
      submit.disabled = true;
      clear(result);
      const loading = el("div", "ai-loading", "AIが評価しています…");
      result.appendChild(loading);
      try {
        const r = await AI.json({
          system:
            "あなたは日本語話者に中国語を教える先生です。学習者が絵(場面)を中国語で説明しました。場面の内容に合っているか・文法・語彙を評価します。説明は日本語、中国語は簡体字、ピンインは声調記号付きで単語ごとにスペース区切り。score は0〜100の整数。corrected_zh は学習者の文を最小限直したもの、model_zh は学習者のレベルに合った2〜3文の模範解答、useful_words はこの場面で使える単語を3〜5個。",
          messages: [
            {
              role: "user",
              content: `場面: ${p.scene}\n学習者のレベル: ${UI.levelLabel()}\n\n学習者の説明:\n${answer}`,
            },
          ],
          schema: PICTURE_SCHEMA,
          effort: "medium",
        });
        loading.remove();
        const head = el("div", "result-head");
        head.appendChild(scoreBadge(r.score));
        head.appendChild(el("div", "result-overall", r.feedback_ja));
        result.appendChild(head);
        result.appendChild(el("div", "ui-section-title", "直した文"));
        result.appendChild(UI.zhBlock({ hanzi: r.corrected_zh, pinyin: r.corrected_pinyin }));
        result.appendChild(el("div", "ui-section-title", "模範解答"));
        result.appendChild(UI.zhBlock({ hanzi: r.model_zh, pinyin: r.model_pinyin, ja: r.model_ja, bookmark: { hanzi: r.model_zh, pinyin: r.model_pinyin, meaning: r.model_ja, source: "絵を見て話す" } }));
        result.appendChild(el("div", "ui-section-title", "使える単語"));
        r.useful_words.forEach((w) =>
          result.appendChild(UI.zhBlock({ hanzi: w.hanzi, pinyin: w.pinyin, ja: w.meaning_ja, size: "sm", bookmark: { hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning_ja, source: "絵を見て話す" } }))
        );
        AppState.addXp(10);
        AppState.markStudiedToday();
      } catch (err) {
        loading.remove();
        result.appendChild(el("div", "chat-error", "⚠️ " + err.message));
      } finally {
        submit.disabled = false;
      }
    }
  }

  // ---------- AIに質問 ----------
  const QA_EXAMPLES = ["「了」と「过」の違いは?", "「すみません」は中国語でどう使い分ける?", "我在学中文 の「在」の意味は?", "ビジネスメールの書き出しの定番は?"];

  function askAI(onBack) {
    const back = typeof onBack === "function" ? onBack : home;
    const screen = UI.screen("screen--chat");
    const header = el("div", "chat-header");
    header.appendChild(UI.iconButton("chat-back", Icons.prev, "戻る", back));
    const who = el("div", "chat-who");
    who.appendChild(el("div", "chat-avatar", "🐼"));
    const names = el("div");
    names.appendChild(el("div", "chat-title", "AI先生に質問"));
    names.appendChild(el("div", "chat-subtitle", "文法・単語・表現の疑問に日本語で答えます"));
    who.appendChild(names);
    header.appendChild(who);
    screen.appendChild(header);

    const log = el("div", "chat-log");
    screen.appendChild(log);
    const inputBar = el("div", "chat-input-bar");
    const input = el("textarea", "chat-input");
    input.rows = 1;
    input.placeholder = "質問を入力";
    const sendBtn = UI.button("chat-send", "送信");
    inputBar.append(input, sendBtn);
    screen.appendChild(inputBar);
    if (UI.keyGate(log)) {
      inputBar.classList.add("hidden");
      return;
    }

    const examples = el("div", "qa-examples");
    examples.appendChild(el("div", "qa-examples-label", "こんな質問ができます"));
    QA_EXAMPLES.forEach((q) =>
      examples.appendChild(
        UI.button("chat-chip", q, () => {
          input.value = q;
          send();
        })
      )
    );
    log.appendChild(examples);

    const history = [];
    let busy = false;
    const system =
      "あなたは日本語話者に中国語を教える、親しみやすい中国語の先生です。学習者の質問に日本語でわかりやすく答えます。中国語の例文を出すときは必ず簡体字・声調記号付きピンイン・日本語訳をセットで示します。長すぎず、要点を箇条書きで整理してください。学習者のレベル: " +
      UI.levelLabel() +
      "\n\nLatency-sensitive; begin your answer immediately.";

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        send();
      }
    });
    sendBtn.addEventListener("click", send);

    async function send() {
      const q = input.value.trim();
      if (!q || busy) return;
      busy = true;
      sendBtn.disabled = true;
      input.value = "";
      examples.remove();
      const me = el("div", "chat-row chat-row--me");
      me.appendChild(el("div", "chat-bubble chat-bubble--me", q));
      log.appendChild(me);
      history.push({ role: "user", content: q });
      const row = el("div", "chat-row chat-row--ai");
      row.appendChild(el("div", "chat-bubble-avatar", "🐼"));
      const bubble = el("div", "chat-bubble chat-bubble--ai chat-bubble--qa");
      bubble.appendChild(el("div", "chat-typing-text", "考えています…"));
      row.appendChild(bubble);
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      try {
        const answer = await AI.streamText({
          system,
          messages: history,
          effort: "medium",
          onText: (full) => {
            clear(bubble);
            bubble.appendChild(UI.renderMarkdown(full));
            log.scrollTop = log.scrollHeight;
          },
        });
        history.push({ role: "assistant", content: answer });
        AppState.markStudiedToday();
      } catch (err) {
        history.pop();
        clear(bubble);
        bubble.appendChild(el("div", "chat-error", "⚠️ " + err.message));
      } finally {
        busy = false;
        sendBtn.disabled = false;
      }
    }
  }

  return { home, askAI, startScenario, customTheme, camera, essay, freeTalk, pictureList };
})();

// AI と中国語で会話する画面(シナリオ会話・自由会話・話題トーク・モーメンツのコメントで共通)
// AI の返答は構造化出力(JSON)で受け取り、ピンイン・日本語訳・添削・返答例を表示する。

const Chat = (() => {
  const { el, clear } = UI;

  const REPLY_SCHEMA = {
    type: "object",
    properties: {
      reply_zh: { type: "string" },
      reply_pinyin: { type: "string" },
      reply_ja: { type: "string" },
      correction: {
        type: "object",
        properties: {
          has_issue: { type: "boolean" },
          corrected_zh: { type: "string" },
          corrected_pinyin: { type: "string" },
          explanation_ja: { type: "string" },
        },
        required: ["has_issue", "corrected_zh", "corrected_pinyin", "explanation_ja"],
        additionalProperties: false,
      },
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: { zh: { type: "string" }, pinyin: { type: "string" }, ja: { type: "string" } },
          required: ["zh", "pinyin", "ja"],
          additionalProperties: false,
        },
      },
      finished: { type: "boolean" },
    },
    required: ["reply_zh", "reply_pinyin", "reply_ja", "correction", "suggestions", "finished"],
    additionalProperties: false,
  };

  const FEEDBACK_SCHEMA = {
    type: "object",
    properties: {
      score: { type: "integer" },
      summary_ja: { type: "string" },
      good_points_ja: { type: "array", items: { type: "string" } },
      improvements: {
        type: "array",
        items: {
          type: "object",
          properties: {
            you_said: { type: "string" },
            better_zh: { type: "string" },
            better_pinyin: { type: "string" },
            explanation_ja: { type: "string" },
          },
          required: ["you_said", "better_zh", "better_pinyin", "explanation_ja"],
          additionalProperties: false,
        },
      },
      useful_phrases: {
        type: "array",
        items: {
          type: "object",
          properties: { zh: { type: "string" }, pinyin: { type: "string" }, ja: { type: "string" } },
          required: ["zh", "pinyin", "ja"],
          additionalProperties: false,
        },
      },
    },
    required: ["score", "summary_ja", "good_points_ja", "improvements", "useful_phrases"],
    additionalProperties: false,
  };

  function systemPrompt({ role, situation, goal }) {
    return [
      "あなたは日本語を母語とする中国語学習者の会話練習相手です。",
      "",
      "# あなたの役",
      role,
      "",
      "# 状況",
      situation,
      goal ? `\n# 会話のゴール\n${goal}` : "",
      "",
      "# 返答のルール",
      `- 学習者のレベルは「${UI.levelLabel()}」。reply_zh はそのレベルに合った語彙・長さの簡体字中国語にする(初級なら1〜2文の短く簡単な文)。`,
      "- 役になりきり、会話が続くように相手にも質問を返す。",
      "- reply_pinyin は reply_zh の声調記号付きピンイン。単語ごとにスペースで区切り、句読点も対応させる(例: \"Nǐ hǎo, wǒ jiào Xiǎoměi.\")。",
      "- reply_ja は reply_zh の自然な日本語訳。",
      "- correction は学習者の直前の発言について: 文法・語彙・不自然な点があれば has_issue=true とし、corrected_zh/corrected_pinyin に自然な言い方、explanation_ja に短い理由(日本語)。問題なければ has_issue=false で他は空文字。学習者が日本語で話した場合は has_issue=true とし、その内容を中国語でどう言うかを示す。会話の開始時(学習者の発言がまだない時)は has_issue=false。",
      "- suggestions は、学習者が次に言えそうな返答例を2つ(学習者のレベルに合った短い文)。",
      "- finished は、会話のゴールが達成された・会話が自然に終わったときだけ true。",
      "",
      "Latency-sensitive; begin your answer immediately.",
    ].join("\n");
  }

  // opts: { title, subtitle, avatar, role, situation, goal, kickoff, onExit, xpLabel }
  function open(opts) {
    const screen = UI.screen("screen--chat");
    const system = systemPrompt(opts);
    const history = [];
    const startedAt = Date.now();
    let busy = false;
    let userTurns = 0;
    let finished = false;

    const header = el("div", "chat-header");
    header.appendChild(
      UI.iconButton("chat-back", Icons.prev, "戻る", () => {
        exit();
      })
    );
    const who = el("div", "chat-who");
    who.appendChild(el("div", "chat-avatar", opts.avatar || "🤖"));
    const names = el("div");
    names.appendChild(el("div", "chat-title", opts.title));
    if (opts.subtitle) names.appendChild(el("div", "chat-subtitle", opts.subtitle));
    who.appendChild(names);
    header.appendChild(who);
    const endBtn = UI.button("chat-end-btn", "評価をもらう", () => showFeedback());
    header.appendChild(endBtn);
    screen.appendChild(header);

    if (opts.goal) {
      const goal = el("div", "chat-goal");
      goal.appendChild(el("span", "chat-goal-label", "🎯 ゴール"));
      goal.appendChild(el("span", null, opts.goal));
      screen.appendChild(goal);
    }

    const log = el("div", "chat-log");
    screen.appendChild(log);

    const suggestBar = el("div", "chat-suggest");
    screen.appendChild(suggestBar);

    const inputBar = el("div", "chat-input-bar");
    const micBtn = UI.iconButton("chat-mic", Icons.mic, "音声で入力");
    const input = el("textarea", "chat-input");
    input.rows = 1;
    input.placeholder = "中国語で入力(日本語でもOK)";
    const sendBtn = UI.button("chat-send", "送信");
    inputBar.append(micBtn, input, sendBtn);
    screen.appendChild(inputBar);

    if (UI.keyGate(log)) {
      inputBar.classList.add("hidden");
      endBtn.classList.add("hidden");
      return;
    }

    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(120, input.scrollHeight) + "px";
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        send();
      }
    });
    sendBtn.addEventListener("click", send);

    // 音声入力: もう一度タップで終了
    let activeRec = null;
    micBtn.addEventListener("click", async () => {
      if (activeRec) {
        activeRec.stop();
        return;
      }
      if (!Speech.isRecognitionSupported()) {
        UI.toast("この端末は音声入力に対応していません");
        return;
      }
      activeRec = Speech.startRecognition();
      micBtn.classList.add("is-recording");
      input.placeholder = "聞き取り中… もう一度タップで終了";
      try {
        const alts = await activeRec.result;
        input.value = (input.value ? input.value + " " : "") + alts[0];
        input.dispatchEvent(new Event("input"));
      } catch (e) {
        UI.toast("うまく聞き取れませんでした");
      } finally {
        activeRec = null;
        micBtn.classList.remove("is-recording");
        input.placeholder = "中国語で入力(日本語でもOK)";
      }
    });

    function scrollDown() {
      log.scrollTop = log.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
    }

    function addUserBubble(text) {
      const row = el("div", "chat-row chat-row--me");
      const bubble = el("div", "chat-bubble chat-bubble--me", text);
      row.appendChild(bubble);
      log.appendChild(row);
      scrollDown();
      return row;
    }

    function addAiBubble(reply) {
      const row = el("div", "chat-row chat-row--ai");
      row.appendChild(el("div", "chat-bubble-avatar", opts.avatar || "🤖"));
      const bubble = el("div", "chat-bubble chat-bubble--ai");
      bubble.appendChild(Ruby.render(reply.reply_zh, reply.reply_pinyin, { className: "chat-ruby" }));
      bubble.appendChild(el("div", "chat-ja tr-text", reply.reply_ja));
      const tools = el("div", "chat-bubble-tools");
      tools.appendChild(UI.speakerButton(reply.reply_zh, { className: "chat-tool" }));
      tools.appendChild(UI.bookmarkButton({ hanzi: reply.reply_zh, pinyin: reply.reply_pinyin, meaning: reply.reply_ja, source: opts.title }));
      bubble.appendChild(tools);
      row.appendChild(bubble);
      log.appendChild(row);
      scrollDown();
      Speech.speak(reply.reply_zh).catch(() => {});
    }

    function addCorrection(userRow, c) {
      if (!c || !c.has_issue) return;
      const box = el("div", "chat-correction");
      box.appendChild(el("div", "chat-correction-label", "✏️ より自然な言い方"));
      box.appendChild(Ruby.render(c.corrected_zh, c.corrected_pinyin, { className: "chat-correction-ruby" }));
      if (c.explanation_ja) box.appendChild(el("div", "chat-correction-note", c.explanation_ja));
      userRow.appendChild(box);
    }

    function renderSuggestions(list) {
      clear(suggestBar);
      if (!list || list.length === 0) return;
      suggestBar.appendChild(el("span", "chat-suggest-label", "💡"));
      list.forEach((s) => {
        const chip = el("button", "chat-chip");
        chip.type = "button";
        chip.appendChild(el("span", "chat-chip-zh", s.zh));
        chip.appendChild(el("span", "chat-chip-ja tr-text", s.ja));
        chip.addEventListener("click", () => {
          input.value = s.zh;
          input.dispatchEvent(new Event("input"));
          input.focus();
          Speech.speak(s.zh).catch(() => {});
        });
        suggestBar.appendChild(chip);
      });
    }

    function typing() {
      const row = el("div", "chat-row chat-row--ai");
      row.appendChild(el("div", "chat-bubble-avatar", opts.avatar || "🤖"));
      const b = el("div", "chat-bubble chat-bubble--ai chat-typing");
      b.append(el("span"), el("span"), el("span"));
      row.appendChild(b);
      log.appendChild(row);
      scrollDown();
      return row;
    }

    function showError(message, retry) {
      const row = el("div", "chat-error");
      row.appendChild(el("div", null, "⚠️ " + message));
      if (retry) {
        row.appendChild(
          UI.button("chat-retry", "もう一度", () => {
            row.remove();
            retry();
          })
        );
      }
      log.appendChild(row);
      scrollDown();
    }

    async function requestReply(userRow) {
      busy = true;
      sendBtn.disabled = true;
      const t = typing();
      try {
        const reply = await AI.json({ system, messages: history, schema: REPLY_SCHEMA, effort: "low" });
        t.remove();
        history.push({ role: "assistant", content: JSON.stringify(reply) });
        if (userRow) addCorrection(userRow, reply.correction);
        addAiBubble(reply);
        renderSuggestions(reply.suggestions);
        if (reply.finished && !finished) {
          finished = true;
          const done = el("div", "chat-finished");
          done.appendChild(el("div", null, "🎉 会話のゴールを達成しました!"));
          done.appendChild(UI.button("primary-btn", "評価をもらう", () => showFeedback()));
          log.appendChild(done);
          scrollDown();
        }
      } catch (err) {
        t.remove();
        // 失敗したユーザー発言は履歴から外して、再試行できるようにする
        const last = history.pop();
        showError(err.message, () => {
          history.push(last);
          requestReply(userRow);
        });
      } finally {
        busy = false;
        sendBtn.disabled = false;
      }
    }

    function send() {
      const text = input.value.trim();
      if (!text || busy) return;
      input.value = "";
      input.style.height = "auto";
      clear(suggestBar);
      const row = addUserBubble(text);
      history.push({ role: "user", content: text });
      userTurns++;
      if (userTurns === 1) AppState.markStudiedToday();
      if (userTurns <= 10) AppState.addXp(2);
      requestReply(row);
    }

    async function showFeedback() {
      if (busy) return;
      if (userTurns === 0) {
        UI.toast("まずは会話してみましょう");
        return;
      }
      const overlay = el("div", "cs-overlay");
      const card = el("div", "chat-feedback");
      card.appendChild(el("div", "chat-feedback-title", "会話の評価"));
      const body = el("div", "chat-feedback-body");
      body.appendChild(el("div", "chat-feedback-loading", "AIが会話を振り返っています…"));
      card.appendChild(body);
      card.appendChild(UI.button("cs-text-btn", "閉じる", () => overlay.remove()));
      overlay.appendChild(card);
      screen.appendChild(overlay);

      // AI から始めた会話では、最初の(非表示の)開始指示を除く
      const transcript = history
        .slice(opts.aiStarts === false ? 0 : 1)
        .map((m) => (m.role === "user" ? `学習者: ${m.content}` : `相手: ${JSON.parse(m.content).reply_zh}`))
        .join("\n");
      try {
        const fb = await AI.json({
          system:
            "あなたは中国語教師です。日本語話者の学習者の会話練習を振り返り、励ましつつ具体的にフィードバックします。説明はすべて日本語、中国語には声調記号付きピンインを付けます。score は0〜100の整数。improvements は学習者の実際の発言から最大3つ、useful_phrases はこの場面で使える表現を3つ。",
          messages: [
            {
              role: "user",
              content: `# 練習の設定\n${opts.situation}\n${opts.goal ? "ゴール: " + opts.goal : ""}\n学習者のレベル: ${UI.levelLabel()}\n\n# 会話\n${transcript}`,
            },
          ],
          schema: FEEDBACK_SCHEMA,
          effort: "medium",
        });
        clear(body);
        const score = el("div", "chat-feedback-score");
        score.appendChild(el("span", "chat-feedback-score-num", String(fb.score)));
        score.appendChild(el("span", null, "点"));
        body.appendChild(score);
        body.appendChild(el("div", "chat-feedback-summary", fb.summary_ja));
        if (fb.good_points_ja.length) {
          body.appendChild(el("div", "chat-feedback-h", "👍 よかった点"));
          const ul = el("ul", "chat-feedback-list");
          fb.good_points_ja.forEach((g) => ul.appendChild(el("li", null, g)));
          body.appendChild(ul);
        }
        if (fb.improvements.length) {
          body.appendChild(el("div", "chat-feedback-h", "✏️ こう言うともっと自然"));
          fb.improvements.forEach((imp) => {
            const item = el("div", "chat-feedback-imp");
            item.appendChild(el("div", "chat-feedback-said", `あなた: ${imp.you_said}`));
            item.appendChild(UI.zhBlock({ hanzi: imp.better_zh, pinyin: imp.better_pinyin, ja: imp.explanation_ja, size: "sm", bookmark: { hanzi: imp.better_zh, pinyin: imp.better_pinyin, meaning: imp.explanation_ja, source: opts.title } }));
            body.appendChild(item);
          });
        }
        if (fb.useful_phrases.length) {
          body.appendChild(el("div", "chat-feedback-h", "📌 使える表現"));
          fb.useful_phrases.forEach((p) =>
            body.appendChild(UI.zhBlock({ hanzi: p.zh, pinyin: p.pinyin, ja: p.ja, size: "sm", bookmark: { hanzi: p.zh, pinyin: p.pinyin, meaning: p.ja, source: opts.title } }))
          );
        }
        AppState.addXp(10);
      } catch (err) {
        clear(body);
        body.appendChild(el("div", "chat-error", "⚠️ " + err.message));
      }
    }

    function exit() {
      if (activeRec) activeRec.stop();
      AppState.addStudySeconds((Date.now() - startedAt) / 1000);
      (opts.onExit || (() => App.go("practice")))();
    }

    if (opts.aiStarts === false) {
      // 学習者から話しかける(モーメンツへのコメントなど)
      if (opts.intro) log.appendChild(opts.intro);
      if (opts.placeholder) input.placeholder = opts.placeholder;
      return;
    }
    // 会話を AI から始める(この最初の指示は画面には表示しない)
    history.push({ role: "user", content: opts.kickoff || "会話を始めてください。あなたから最初に話しかけてください。" });
    requestReply(null);
  }

  return { open, REPLY_SCHEMA };
})();

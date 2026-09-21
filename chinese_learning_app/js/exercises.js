// 各エクササイズタイプのUIを生成するモジュール群。
// render(exercise, { onChange }) => { element, check() }
//   - onChange(canCheck: boolean) は回答可能状態が変わるたびに呼ぶ
//   - check() は { correct: boolean, correctText, userText } を返す

const Exercises = (() => {
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function playButton(text, { big = false } = {}) {
    const btn = el("button", "play-btn" + (big ? " play-btn--big" : ""));
    btn.type = "button";
    btn.innerHTML = "🔊";
    btn.setAttribute("aria-label", "音声を再生");
    btn.addEventListener("click", () => {
      btn.classList.add("play-btn--active");
      Speech.speak(text).finally(() => btn.classList.remove("play-btn--active"));
    });
    return btn;
  }

  // ---------- リスニング: 音声を聞いて選択肢から選ぶ ----------
  function renderListeningChoice(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--listening");
    wrap.appendChild(el("div", "exercise-label", "👂 リスニング"));
    wrap.appendChild(el("h2", "exercise-prompt", exercise.prompt));

    const playArea = el("div", "listening-play-area");
    playArea.appendChild(playButton(exercise.audioText, { big: true }));
    playArea.appendChild(el("div", "listening-hint", "タップして音声を聞いてください"));
    wrap.appendChild(playArea);

    const choicesWrap = el("div", "choices");
    let selected = null;
    exercise.choices.forEach((choice) => {
      const btn = el("button", "choice-btn", choice.text);
      btn.type = "button";
      btn.addEventListener("click", () => {
        choicesWrap.querySelectorAll(".choice-btn").forEach((b) => b.classList.remove("choice-btn--selected"));
        btn.classList.add("choice-btn--selected");
        selected = choice;
        onChange(true);
      });
      choicesWrap.appendChild(btn);
    });
    wrap.appendChild(choicesWrap);

    // 自動再生
    setTimeout(() => Speech.speak(exercise.audioText).catch(() => {}), 400);

    return {
      element: wrap,
      check() {
        const correct = exercise.choices.find((c) => c.correct);
        return {
          correct: !!selected && selected.correct,
          correctText: correct.text,
          userText: selected ? selected.text : "(未回答)",
        };
      },
    };
  }

  // ---------- リーディング/語彙: 中国語文を見て意味を選ぶ ----------
  function renderTranslateChoice(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--translate");
    wrap.appendChild(el("div", "exercise-label", "📖 リーディング"));
    wrap.appendChild(el("h2", "exercise-prompt", exercise.prompt));

    const card = el("div", "hanzi-card");
    const hanziRow = el("div", "hanzi-row");
    hanziRow.appendChild(el("span", "hanzi-text", exercise.hanzi));
    hanziRow.appendChild(playButton(exercise.hanzi));
    card.appendChild(hanziRow);
    card.appendChild(el("div", "pinyin-text", exercise.pinyin));
    wrap.appendChild(card);

    const choicesWrap = el("div", "choices");
    let selected = null;
    exercise.choices.forEach((choice) => {
      const btn = el("button", "choice-btn", choice.text);
      btn.type = "button";
      btn.addEventListener("click", () => {
        choicesWrap.querySelectorAll(".choice-btn").forEach((b) => b.classList.remove("choice-btn--selected"));
        btn.classList.add("choice-btn--selected");
        selected = choice;
        onChange(true);
      });
      choicesWrap.appendChild(btn);
    });
    wrap.appendChild(choicesWrap);

    return {
      element: wrap,
      check() {
        const correct = exercise.choices.find((c) => c.correct);
        return {
          correct: !!selected && selected.correct,
          correctText: correct.text,
          userText: selected ? selected.text : "(未回答)",
        };
      },
    };
  }

  // ---------- リーディング: 短文を読んで質問に答える ----------
  function renderReading(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--reading");
    wrap.appendChild(el("div", "exercise-label", "📖 リーディング"));

    const passageCard = el("div", "passage-card");
    const passageRow = el("div", "passage-row");
    passageRow.appendChild(el("span", "passage-hanzi", exercise.passage));
    passageRow.appendChild(playButton(exercise.passage));
    passageCard.appendChild(passageRow);

    const toggleBtn = el("button", "pinyin-toggle", "拼音を表示");
    toggleBtn.type = "button";
    const pinyinEl = el("div", "passage-pinyin hidden", exercise.passagePinyin);
    toggleBtn.addEventListener("click", () => {
      pinyinEl.classList.toggle("hidden");
      toggleBtn.textContent = pinyinEl.classList.contains("hidden") ? "拼音を表示" : "拼音を隠す";
    });
    passageCard.appendChild(toggleBtn);
    passageCard.appendChild(pinyinEl);
    wrap.appendChild(passageCard);

    wrap.appendChild(el("h2", "exercise-prompt", exercise.question));

    const choicesWrap = el("div", "choices");
    let selected = null;
    exercise.choices.forEach((choice) => {
      const btn = el("button", "choice-btn", choice.text);
      btn.type = "button";
      btn.addEventListener("click", () => {
        choicesWrap.querySelectorAll(".choice-btn").forEach((b) => b.classList.remove("choice-btn--selected"));
        btn.classList.add("choice-btn--selected");
        selected = choice;
        onChange(true);
      });
      choicesWrap.appendChild(btn);
    });
    wrap.appendChild(choicesWrap);

    return {
      element: wrap,
      check() {
        const correct = exercise.choices.find((c) => c.correct);
        return {
          correct: !!selected && selected.correct,
          correctText: correct.text,
          userText: selected ? selected.text : "(未回答)",
        };
      },
    };
  }

  // ---------- スピーキング: マイクで発音して認識結果と照合 ----------
  function renderSpeaking(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--speaking");
    wrap.appendChild(el("div", "exercise-label", "🗣️ スピーキング"));
    wrap.appendChild(el("h2", "exercise-prompt", exercise.prompt));

    const card = el("div", "hanzi-card");
    const hanziRow = el("div", "hanzi-row");
    hanziRow.appendChild(el("span", "hanzi-text", exercise.hanzi));
    hanziRow.appendChild(playButton(exercise.hanzi));
    card.appendChild(hanziRow);
    card.appendChild(el("div", "pinyin-text", exercise.pinyin));
    card.appendChild(el("div", "meaning-text", exercise.meaning));
    wrap.appendChild(card);

    const micArea = el("div", "mic-area");
    const micBtn = el("button", "mic-btn");
    micBtn.type = "button";
    micBtn.innerHTML = "🎙️";
    micArea.appendChild(micBtn);
    const micStatus = el("div", "mic-status", "マイクボタンを押して発音してください");
    micArea.appendChild(micStatus);
    const resultBox = el("div", "mic-result hidden");
    micArea.appendChild(resultBox);
    wrap.appendChild(micArea);

    let attempted = false;
    let matched = false;
    let recognizedText = "";
    const supported = Speech.isRecognitionSupported();

    if (!supported) {
      micStatus.textContent = "この端末は音声認識に対応していません。発音練習をしたら「自己採点」で進みましょう。";
      const selfBtn = el("button", "self-rate-btn", "発音したので次へ進む");
      selfBtn.type = "button";
      selfBtn.addEventListener("click", () => {
        attempted = true;
        matched = true; // 音声認識非対応環境は自己申告で正解扱い
        selfBtn.disabled = true;
        selfBtn.textContent = "✓ 発音を記録しました";
        onChange(true);
      });
      micArea.appendChild(selfBtn);
      micBtn.disabled = true;
    }

    micBtn.addEventListener("click", async () => {
      if (!supported) return;
      micBtn.disabled = true;
      micBtn.classList.add("mic-btn--recording");
      micStatus.textContent = "聞き取り中... 中国語で発音してください";
      resultBox.classList.add("hidden");
      try {
        const alternatives = await Speech.recognizeOnce();
        recognizedText = alternatives[0] || "";
        const targetNorm = exercise.hanzi.replace(/[,、。\s]/g, "");
        matched = alternatives.some((a) => {
          const cleaned = a.replace(/[,、。\s]/g, "");
          return cleaned.includes(targetNorm) || targetNorm.includes(cleaned);
        });
        attempted = true;
        resultBox.classList.remove("hidden");
        resultBox.textContent = matched
          ? `✅ 認識結果:「${recognizedText}」 — 発音が認識できました!`
          : `🔁 認識結果:「${recognizedText}」 — もう一度試すか、そのまま次へ進めます`;
        resultBox.className = "mic-result " + (matched ? "mic-result--ok" : "mic-result--retry");
        micStatus.textContent = "もう一度発音するか、次へ進みましょう";
        onChange(true);
      } catch (err) {
        attempted = true;
        matched = false;
        resultBox.classList.remove("hidden");
        resultBox.className = "mic-result mic-result--retry";
        resultBox.textContent = "⚠️ 音声を認識できませんでした。もう一度試すか、そのまま次へ進めます";
        onChange(true);
      } finally {
        micBtn.disabled = false;
        micBtn.classList.remove("mic-btn--recording");
      }
    });

    return {
      element: wrap,
      check() {
        return {
          correct: attempted, // 発音に挑戦したこと自体を評価(認識一致でボーナス表示)
          bonus: matched,
          correctText: exercise.hanzi + "(" + exercise.pinyin + ")",
          userText: recognizedText ? `あなたの発音:「${recognizedText}」` : "発音に挑戦しました",
        };
      },
    };
  }

  // ---------- ライティング: 日本語の意味から中国語を入力 ----------
  function renderWritingCn(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--writing");
    wrap.appendChild(el("div", "exercise-label", "✍️ ライティング"));
    wrap.appendChild(el("h2", "exercise-prompt", `次の意味を中国語(漢字)で書いてください`));

    const card = el("div", "hanzi-card hanzi-card--writing");
    card.appendChild(el("div", "meaning-text meaning-text--big", exercise.meaning));
    if (exercise.pinyinHint) {
      card.appendChild(el("div", "pinyin-hint", `ヒント (拼音): ${exercise.pinyinHint}`));
    }
    wrap.appendChild(card);

    const input = el("input", "text-input");
    input.type = "text";
    input.placeholder = "ここに中国語を入力...";
    input.addEventListener("input", () => onChange(input.value.trim().length > 0));
    wrap.appendChild(input);

    return {
      element: wrap,
      check() {
        const userText = input.value.trim();
        const correct = userText.replace(/\s/g, "") === exercise.answer.replace(/\s/g, "");
        return {
          correct,
          correctText: exercise.answer,
          userText: userText || "(未回答)",
        };
      },
    };
  }

  // ---------- ライティング: 漢字からピンインを入力 ----------
  function renderWritingPinyin(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--writing");
    wrap.appendChild(el("div", "exercise-label", "✍️ ライティング"));
    wrap.appendChild(el("h2", "exercise-prompt", "次の漢字のピンインをアルファベットで入力してください"));

    const card = el("div", "hanzi-card hanzi-card--writing");
    const hanziRow = el("div", "hanzi-row");
    hanziRow.appendChild(el("span", "hanzi-text", exercise.hanzi));
    hanziRow.appendChild(playButton(exercise.hanzi));
    card.appendChild(hanziRow);
    if (exercise.meaningHint) {
      card.appendChild(el("div", "pinyin-hint", `意味: ${exercise.meaningHint}`));
    }
    wrap.appendChild(card);

    const input = el("input", "text-input");
    input.type = "text";
    input.placeholder = "例: ni hao (声調記号なしでOK)";
    input.addEventListener("input", () => onChange(input.value.trim().length > 0));
    wrap.appendChild(input);

    return {
      element: wrap,
      check() {
        const userText = input.value.trim();
        const correct = Speech.normalizePinyin(userText) === Speech.normalizePinyin(exercise.answer);
        return {
          correct,
          correctText: exercise.answerToned || exercise.answer,
          userText: userText || "(未回答)",
        };
      },
    };
  }

  const renderers = {
    listening_choice: renderListeningChoice,
    translate_choice: renderTranslateChoice,
    reading: renderReading,
    speaking: renderSpeaking,
    writing_cn: renderWritingCn,
    writing_pinyin: renderWritingPinyin,
  };

  function render(exercise, api) {
    const fn = renderers[exercise.type];
    if (!fn) throw new Error("Unknown exercise type: " + exercise.type);
    return fn(exercise, api);
  }

  return { render };
})();

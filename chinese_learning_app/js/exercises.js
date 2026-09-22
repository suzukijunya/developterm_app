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

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 全レッスン・単語帳から中国語の漢字候補プールを集める
  // (ライティング問題の選択肢のダミーに使う)
  let _hanziPool = null;
  function getHanziPool() {
    if (_hanziPool) return _hanziPool;
    const set = new Set();
    if (typeof UNITS !== "undefined") {
      UNITS.forEach((u) =>
        u.lessons.forEach((l) =>
          l.exercises.forEach((ex) => {
            if (ex.type === "writing_cn" && ex.answer) set.add(ex.answer);
            if (ex.type === "writing_pinyin" && ex.hanzi) set.add(ex.hanzi);
            if (ex.type === "translate_choice" && ex.hanzi) set.add(ex.hanzi);
            if (ex.type === "speaking" && ex.hanzi) set.add(ex.hanzi);
          })
        )
      );
    }
    if (typeof VOCAB_DECKS !== "undefined") {
      VOCAB_DECKS.forEach((d) => d.words.forEach((w) => set.add(w.hanzi)));
    }
    _hanziPool = Array.from(set);
    return _hanziPool;
  }

  // 正解と長さの近いダミーを優先しつつ、足りなければプール全体から補う
  function pickDistractors(correct, count) {
    const pool = getHanziPool().filter((h) => h !== correct);
    const close = pool.filter((h) => Math.abs(h.length - correct.length) <= 2);
    const source = close.length >= count ? close : pool;
    return shuffle(source).slice(0, count);
  }

  // 全レッスン・単語帳から声調付きピンインの候補プールを集める
  // (ライティング問題の選択肢のダミーに使う)
  let _pinyinPool = null;
  function getPinyinPool() {
    if (_pinyinPool) return _pinyinPool;
    const set = new Set();
    if (typeof UNITS !== "undefined") {
      UNITS.forEach((u) =>
        u.lessons.forEach((l) =>
          l.exercises.forEach((ex) => {
            if (ex.type === "writing_pinyin" && ex.answerToned) set.add(ex.answerToned);
            if (ex.type === "translate_choice" && ex.pinyin) set.add(ex.pinyin);
            if (ex.type === "speaking" && ex.pinyin) set.add(ex.pinyin);
            if (ex.type === "listening_choice" && ex.pinyin) set.add(ex.pinyin);
          })
        )
      );
    }
    if (typeof VOCAB_DECKS !== "undefined") {
      VOCAB_DECKS.forEach((d) => d.words.forEach((w) => { if (w.pinyin) set.add(w.pinyin); }));
    }
    _pinyinPool = Array.from(set);
    return _pinyinPool;
  }

  // 正解と長さの近いダミーを優先しつつ、足りなければプール全体から補う
  function pickPinyinDistractors(correct, count) {
    const pool = getPinyinPool().filter((p) => p !== correct);
    const close = pool.filter((p) => Math.abs(p.length - correct.length) <= 2);
    const source = close.length >= count ? close : pool;
    return shuffle(source).slice(0, count);
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

  // ピンインをルビ(ふりがな)として中国語の上に表示する
  function rubyText(hanzi, pinyin, className) {
    const ruby = document.createElement("ruby");
    if (className) ruby.className = className;
    ruby.appendChild(document.createTextNode(hanzi));
    const rt = document.createElement("rt");
    rt.textContent = pinyin;
    ruby.appendChild(rt);
    return ruby;
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

    // 回答確認後に中国語の答え文をルビ(ピンイン)付きで表示するエリア
    const answerReveal = el("div", "listening-answer-reveal hidden");
    wrap.appendChild(answerReveal);

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
      reveal() {
        answerReveal.classList.remove("hidden");
        clear(answerReveal);
        answerReveal.appendChild(rubyText(exercise.audioText, exercise.pinyin, "listening-answer-ruby"));
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
    const whisperBox = el("div", "whisper-result hidden");
    micArea.appendChild(whisperBox);
    wrap.appendChild(micArea);

    let attempted = false;
    let matched = false;
    let recognizedText = "";
    let recordedAudioUrl = null;
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

      let recorder = null;
      if (Speech.isRecordingSupported()) {
        try {
          recorder = await Speech.startRecording();
        } catch (e) {
          recorder = null; // 録音できなくても音声認識自体は続行する
        }
      }

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
        micStatus.textContent = "もう一度発音するか、次へ進みましょう";
        onChange(true);
      } finally {
        micBtn.disabled = false;
        micBtn.classList.remove("mic-btn--recording");
        if (recorder) {
          try {
            const blob = await recorder.stop();
            if (blob && blob.size > 0) {
              if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
              recordedAudioUrl = URL.createObjectURL(blob);
              refineWithWhisper(blob);
            }
          } catch (e) {
            // 録音の保存に失敗しても学習フロー自体は継続する
          }
        }
      }
    });

    // 録音した音声をWhisper(ブラウザ内で動く高精度モデル)で追加認識し、
    // Web Speech APIより精度の高い結果が得られたら表示・判定を更新する。
    // 失敗しても既存の認識結果はそのまま使えるので学習の妨げにはならない。
    async function refineWithWhisper(blob) {
      if (!window.WhisperASR || !window.WhisperASR.isSupported()) return;
      whisperBox.classList.remove("hidden");
      whisperBox.className = "whisper-result";
      whisperBox.textContent = window.WhisperASR.loaded
        ? "🔍 詳しく確認中..."
        : "🔍 詳しく確認中...(初回は認識モデルの読み込みに時間がかかります)";

      const text = await window.WhisperASR.transcribe(blob).catch(() => null);
      if (!text) {
        whisperBox.classList.add("hidden");
        return;
      }

      recognizedText = text;
      const targetNorm = exercise.hanzi.replace(/[,、。\s]/g, "");
      const cleaned = text.replace(/[,、。\s]/g, "");
      matched = cleaned.includes(targetNorm) || targetNorm.includes(cleaned);
      attempted = true;
      onChange(true);

      const pinyinReading = window.PinyinConv ? await window.PinyinConv.convert(text).catch(() => null) : null;

      whisperBox.className = "whisper-result " + (matched ? "whisper-result--ok" : "whisper-result--retry");
      clear(whisperBox);
      whisperBox.appendChild(el("div", "whisper-result-label", matched ? "✅ 詳細認識(高精度)" : "🔁 詳細認識(高精度)"));
      if (pinyinReading) {
        whisperBox.appendChild(rubyText(text, pinyinReading, "whisper-result-ruby"));
      } else {
        whisperBox.appendChild(el("div", "whisper-result-ruby", text));
      }
    }

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
      // 録音した自分の発音を再生する。再生が終わる(または録音がない/
      // 再生に失敗する)まで待てるようPromiseを返す
      playRecording() {
        if (!recordedAudioUrl) return Promise.resolve();
        return new Promise((resolve) => {
          const audio = new Audio(recordedAudioUrl);
          audio.addEventListener("ended", resolve);
          audio.addEventListener("error", resolve);
          audio.play().catch(resolve);
        });
      },
    };
  }

  // ---------- ライティング: 日本語の意味に合う中国語(漢字)を選ぶ ----------
  function renderWritingCn(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--writing");
    wrap.appendChild(el("div", "exercise-label", "✍️ ライティング"));
    wrap.appendChild(el("h2", "exercise-prompt", "次の意味に合う中国語(漢字)を選んでください"));

    const card = el("div", "hanzi-card hanzi-card--writing");
    card.appendChild(el("div", "meaning-text meaning-text--big", exercise.meaning));
    if (exercise.pinyinHint) {
      card.appendChild(el("div", "pinyin-hint", `ヒント (拼音): ${exercise.pinyinHint}`));
    }
    wrap.appendChild(card);

    const options = shuffle([exercise.answer, ...pickDistractors(exercise.answer, 3)]);

    const choicesWrap = el("div", "choices");
    let selected = null;
    options.forEach((optionText) => {
      const btn = el("button", "choice-btn", optionText);
      btn.type = "button";
      btn.addEventListener("click", () => {
        choicesWrap.querySelectorAll(".choice-btn").forEach((b) => b.classList.remove("choice-btn--selected"));
        btn.classList.add("choice-btn--selected");
        selected = optionText;
        onChange(true);
      });
      choicesWrap.appendChild(btn);
    });
    wrap.appendChild(choicesWrap);

    return {
      element: wrap,
      check() {
        return {
          correct: selected === exercise.answer,
          correctText: exercise.answer,
          userText: selected || "(未回答)",
        };
      },
    };
  }

  // ---------- ライティング: 漢字に合うピンインを選ぶ ----------
  function renderWritingPinyin(exercise, { onChange }) {
    const wrap = el("div", "exercise exercise--writing");
    wrap.appendChild(el("div", "exercise-label", "✍️ ライティング"));
    wrap.appendChild(el("h2", "exercise-prompt", "次の漢字のピンインを選んでください"));

    const card = el("div", "hanzi-card hanzi-card--writing");
    const hanziRow = el("div", "hanzi-row");
    hanziRow.appendChild(el("span", "hanzi-text", exercise.hanzi));
    hanziRow.appendChild(playButton(exercise.hanzi));
    card.appendChild(hanziRow);
    if (exercise.meaningHint) {
      card.appendChild(el("div", "pinyin-hint", `意味: ${exercise.meaningHint}`));
    }
    wrap.appendChild(card);

    const correctText = exercise.answerToned || exercise.answer;
    const options = shuffle([correctText, ...pickPinyinDistractors(correctText, 3)]);

    const choicesWrap = el("div", "choices");
    let selected = null;
    options.forEach((optionText) => {
      const btn = el("button", "choice-btn", optionText);
      btn.type = "button";
      btn.addEventListener("click", () => {
        choicesWrap.querySelectorAll(".choice-btn").forEach((b) => b.classList.remove("choice-btn--selected"));
        btn.classList.add("choice-btn--selected");
        selected = optionText;
        onChange(true);
      });
      choicesWrap.appendChild(btn);
    });
    wrap.appendChild(choicesWrap);

    return {
      element: wrap,
      check() {
        return {
          correct: selected === correctText,
          correctText,
          userText: selected || "(未回答)",
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

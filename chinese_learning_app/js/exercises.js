// 各エクササイズタイプのUIを生成するモジュール群(ChineseSkill風レイアウト)。
// render(exercise, api) => {
//   element, instruction(画面左上の指示文), submitMode, skippable?,
//   check() => { correct, bonus?, correctText, userText, sheet?(), audio?, autoAdvance? },
//   reveal?(result), playRecording?(), dispose?()
// }
// submitMode: "tap"    … 選択肢をタップした瞬間に api.submit() で確定
//             "button" … 画面下の「提出する」で確定(api.onChange で押せる状態を通知)
//             "self"   … 問題側が完了を判断して api.submit() する(ペア・発音)
// api: { onChange(canSubmit), submit(), setBusy(busy) }

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

  // ---------- ダミー選択肢のプール ----------
  let _hanziPool = null;
  function getHanziPool() {
    if (_hanziPool) return _hanziPool;
    const set = new Set();
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
    VOCAB_DECKS.forEach((d) => d.words.forEach((w) => set.add(w.hanzi)));
    _hanziPool = Array.from(set);
    return _hanziPool;
  }

  // 正解と長さの近いダミーを優先しつつ、足りなければプール全体から補う
  function pickClose(pool, correct, count) {
    const others = pool.filter((x) => x !== correct);
    const close = others.filter((x) => Math.abs(x.length - correct.length) <= 2);
    return shuffle(close.length >= count ? close : others).slice(0, count);
  }

  let _pinyinPool = null;
  function getPinyinPool() {
    if (_pinyinPool) return _pinyinPool;
    const set = new Set();
    UNITS.forEach((u) =>
      u.lessons.forEach((l) =>
        l.exercises.forEach((ex) => {
          if (ex.type === "writing_pinyin" && ex.answerToned) set.add(ex.answerToned);
          if (["translate_choice", "speaking", "listening_choice"].includes(ex.type) && ex.pinyin) set.add(ex.pinyin);
        })
      )
    );
    VOCAB_DECKS.forEach((d) => d.words.forEach((w) => w.pinyin && set.add(w.pinyin)));
    _pinyinPool = Array.from(set);
    return _pinyinPool;
  }

  // 穴埋め・並べ替えのダミータイル(単語単位・ピンイン付き)。ユニットごとに
  // 分けて持ち、そのユニット→それ以前のユニット→全体の順で選ぶ(初級の問題に
  // ビジネス用語のダミーが混ざって不自然にならないように)
  let _unitTiles = null;
  let _allTiles = null;
  function getUnitTiles() {
    if (_unitTiles) return _unitTiles;
    const all = new Map();
    _unitTiles = UNITS.map((u) => {
      const map = new Map();
      u.lessons.forEach((l) =>
        LessonExtras.sentenceCandidates(l).forEach((s) =>
          s.tiles.forEach((t) => {
            const tile = { hanzi: t.hanzi, pinyin: t.pinyin, punct: "" };
            if (!map.has(t.hanzi)) map.set(t.hanzi, tile);
            if (!all.has(t.hanzi)) all.set(t.hanzi, tile);
          })
        )
      );
      return Array.from(map.values());
    });
    VOCAB_DECKS.forEach((d) =>
      d.words.forEach((w) => {
        if (all.has(w.hanzi) || Array.from(w.hanzi).length > 4) return;
        if (Ruby.segment(w.hanzi, w.pinyin)) all.set(w.hanzi, { hanzi: w.hanzi, pinyin: w.pinyin, punct: "" });
      })
    );
    _allTiles = Array.from(all.values());
    return _unitTiles;
  }

  function pickTileDistractors(exclude, targetLen, count, unitIndex) {
    if (count <= 0) return [];
    const unitTiles = getUnitTiles();
    const idx = typeof unitIndex === "number" ? unitIndex : unitTiles.length - 1;
    const tiers = [unitTiles[idx] || [], unitTiles.slice(0, idx).flat(), _allTiles];
    const picked = [];
    const used = new Set(exclude);
    const take = (candidates) => {
      for (const t of shuffle(candidates)) {
        if (picked.length >= count) return;
        if (used.has(t.hanzi)) continue;
        picked.push(t);
        used.add(t.hanzi);
      }
    };
    // 長さの近い単語を近いユニットから優先し、足りなければ長さを問わず補う
    tiers.forEach((tier) => take(tier.filter((t) => Math.abs(t.hanzi.length - targetLen) <= 1)));
    tiers.forEach((tier) => take(tier));
    return picked;
  }

  // ---------- 共通パーツ ----------
  function iconButton(className, svg, label) {
    const btn = el("button", className);
    btn.type = "button";
    btn.innerHTML = svg;
    btn.setAttribute("aria-label", label);
    return btn;
  }

  function speakWith(btn, text, rate) {
    btn.classList.add("is-playing");
    Speech.speak(text, { rate })
      .catch(() => {})
      .finally(() => btn.classList.remove("is-playing"));
  }

  // オレンジの大きな再生ボタン + ゆっくり再生(カメ)ボタン
  function audioRow(text, { size = "big", autoplay = false } = {}) {
    const row = el("div", `cs-audio-row cs-audio-row--${size}`);
    const main = iconButton("cs-speaker cs-speaker--main", Icons.speaker, "音声を再生");
    const slow = iconButton("cs-speaker cs-speaker--slow", Icons.slow, "ゆっくり再生");
    main.addEventListener("click", () => speakWith(main, text, 0.9));
    slow.addEventListener("click", () => speakWith(slow, text, 0.55));
    row.append(main, slow);
    if (autoplay) {
      setTimeout(() => {
        if (row.isConnected) speakWith(main, text, 0.9);
      }, 350);
    }
    return row;
  }

  function translationLine(text) {
    return el("div", "cs-translation tr-text", text);
  }

  function sentenceBlock({ hanzi, pinyin, meaning, highlight = null, size = "md" }) {
    const block = el("div", `cs-sentence cs-sentence--${size}`);
    block.appendChild(Ruby.render(hanzi, pinyin, { highlight }));
    if (meaning) block.appendChild(translationLine(meaning));
    return block;
  }

  function sheetText(text) {
    return () => el("div", "cs-sheet-answer-text", text);
  }

  function sheetSentence({ hanzi, pinyin, meaning }, highlight) {
    return () => sentenceBlock({ hanzi, pinyin, meaning, highlight, size: "sheet" });
  }

  // 白いカード型の選択肢。タップした瞬間に回答が確定する
  function choiceList(options, { onPick, variant = "" }) {
    const wrap = el("div", "cs-choices" + (variant ? ` cs-choices--${variant}` : ""));
    let locked = false;
    const buttons = options.map((opt) => {
      const btn = el("button", "cs-choice", opt.label);
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        btn.classList.add("is-picked");
        onPick(opt.value);
      });
      wrap.appendChild(btn);
      return { btn, opt };
    });
    return {
      el: wrap,
      mark(correctValue, pickedValue) {
        locked = true;
        buttons.forEach(({ btn, opt }) => {
          if (opt.value === correctValue) btn.classList.add("is-correct");
          else if (opt.value === pickedValue) btn.classList.add("is-wrong");
          else btn.classList.add("is-dim");
        });
      },
    };
  }

  function tileButton(tile) {
    const btn = el("button", "cs-tile");
    btn.type = "button";
    btn.appendChild(Ruby.render(tile.hanzi + (tile.punct || ""), tile.pinyin, { className: "cs-tile-ruby" }));
    return btn;
  }

  function spacer() {
    return el("div", "cs-spacer");
  }

  function choiceResult(exercise, selected, extra = {}) {
    const correct = exercise.choices.find((c) => c.correct);
    return Object.assign(
      {
        correct: !!selected && selected.correct,
        correctText: correct.text,
        userText: selected ? selected.text : "(未回答)",
        sheet: sheetText(correct.text),
      },
      extra
    );
  }

  // ---------- リスニング: 音声を聞いて正しい訳を選ぶ ----------
  function renderListeningChoice(exercise, api) {
    const wrap = el("div", "cs-ex cs-ex--listening");
    wrap.appendChild(spacer());
    wrap.appendChild(audioRow(exercise.audioText, { autoplay: true }));
    // 回答後に中国語の答えをピンイン付きで表示する
    const revealCard = el("div", "cs-reveal-card hidden");
    wrap.appendChild(revealCard);
    wrap.appendChild(spacer());

    let selected = null;
    const list = choiceList(
      exercise.choices.map((c) => ({ label: c.text, value: c })),
      {
        onPick: (value) => {
          selected = value;
          api.submit();
        },
      }
    );
    wrap.appendChild(list.el);

    return {
      element: wrap,
      instruction: "正しい翻訳を選べ",
      submitMode: "tap",
      check() {
        return choiceResult(exercise, selected, { audio: exercise.audioText });
      },
      reveal() {
        list.mark(exercise.choices.find((c) => c.correct), selected);
        revealCard.classList.remove("hidden");
        revealCard.appendChild(Ruby.render(exercise.audioText, exercise.pinyin, { className: "cs-reveal-ruby" }));
      },
    };
  }

  // ---------- 中国語を見て正しい訳を選ぶ ----------
  function renderTranslateChoice(exercise, api) {
    const wrap = el("div", "cs-ex cs-ex--translate");
    wrap.appendChild(spacer());
    const card = el("div", "cs-word-card");
    card.appendChild(Ruby.render(exercise.hanzi, exercise.pinyin, { className: "cs-big-ruby" }));
    card.appendChild(audioRow(exercise.hanzi, { size: "small", autoplay: true }));
    wrap.appendChild(card);
    wrap.appendChild(spacer());

    let selected = null;
    const list = choiceList(
      exercise.choices.map((c) => ({ label: c.text, value: c })),
      {
        onPick: (value) => {
          selected = value;
          api.submit();
        },
      }
    );
    wrap.appendChild(list.el);

    return {
      element: wrap,
      instruction: "正しい翻訳を選べ",
      submitMode: "tap",
      check() {
        return choiceResult(exercise, selected, { audio: exercise.hanzi });
      },
      reveal() {
        list.mark(exercise.choices.find((c) => c.correct), selected);
      },
    };
  }

  // 「A: …… B: ……」形式の会話文は話者ごとに行を分ける
  function passageLines(passage, pinyin) {
    const hz = passage.split(/\s*(?=[A-Z][:：])/).filter(Boolean);
    const py = (pinyin || "").split(/\s*(?=\b[A-Z]:)/).filter(Boolean);
    if (hz.length > 1 && hz.length === py.length) return hz.map((h, i) => [h, py[i]]);
    return [[passage, pinyin]];
  }

  // ---------- リーディング: 短文を読んで質問に答える ----------
  function renderReading(exercise, api) {
    const wrap = el("div", "cs-ex cs-ex--reading");
    const card = el("div", "cs-passage-card");
    passageLines(exercise.passage, exercise.passagePinyin).forEach(([hz, py]) => {
      const row = el("div", "cs-passage-line");
      const m = hz.match(/^([A-Z])[:：]\s*/);
      let hanzi = hz;
      let pinyin = py;
      if (m) {
        row.appendChild(el("span", "cs-speaker-label", m[1]));
        hanzi = hz.slice(m[0].length);
        pinyin = (py || "").replace(/^[A-Z]:\s*/, "");
      }
      row.appendChild(Ruby.render(hanzi, pinyin, { className: "cs-passage-ruby" }));
      card.appendChild(row);
    });
    card.appendChild(audioRow(exercise.passage, { size: "small" }));
    wrap.appendChild(card);
    wrap.appendChild(el("div", "cs-question", exercise.question));
    wrap.appendChild(spacer());

    let selected = null;
    const list = choiceList(
      exercise.choices.map((c) => ({ label: c.text, value: c })),
      {
        onPick: (value) => {
          selected = value;
          api.submit();
        },
      }
    );
    wrap.appendChild(list.el);

    return {
      element: wrap,
      instruction: "文章を読んで質問に答えよう",
      submitMode: "tap",
      check() {
        return choiceResult(exercise, selected);
      },
      reveal() {
        list.mark(exercise.choices.find((c) => c.correct), selected);
      },
    };
  }

  // ---------- 発音採点 ----------
  function hanziOnly(text) {
    return Array.from(text || "").filter((ch) => Ruby.isHanzi(ch));
  }

  // 最長共通部分列で、お手本のどの文字が発音できていたかを求める
  function lcsMatched(target, heard, eq) {
    const n = target.length;
    const m = heard.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        dp[i][j] = eq(target[i - 1], heard[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    const matched = new Set();
    let i = n;
    let j = m;
    while (i > 0 && j > 0) {
      if (eq(target[i - 1], heard[j - 1])) {
        matched.add(i - 1);
        i--;
        j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    return matched;
  }

  function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve(null), ms))]);
  }

  function plainSyllable(py) {
    return Speech.normalizePinyin(py || "").replace(/r$/, (r, off, s) => (s === "er" ? r : ""));
  }

  // 文字の一致に加え、ピンイン(声調なし)の一致でも採点し、良い方を採用する
  // (音声認識が同音の別の漢字を返しても正しく発音できていれば正解扱いにするため)
  async function scoreSpeech(exercise, heardText) {
    const target = hanziOnly(exercise.hanzi);
    if (target.length === 0) return { score: 0, matched: new Set() };
    const heard = hanziOnly(heardText);
    let matched = lcsMatched(target, heard, (a, b) => a === b);

    const tokens = Ruby.segment(exercise.hanzi, exercise.pinyin);
    const targetSyl = tokens ? tokens.flatMap((t) => (t.type === "word" ? t.chars.map((c) => plainSyllable(c.py)) : [])) : null;
    if (targetSyl && targetSyl.length === target.length && window.PinyinConv && window.PinyinConv.toSyllables) {
      const heardSyl = await withTimeout(window.PinyinConv.toSyllables(heard.join("")), 2500);
      if (Array.isArray(heardSyl)) {
        const bySound = lcsMatched(targetSyl, heardSyl.map(plainSyllable), (a, b) => a && a === b);
        if (bySound.size > matched.size) matched = bySound;
      }
    }
    return { score: Math.round((matched.size / target.length) * 100), matched };
  }

  function scoreClass(score) {
    if (score === null) return "cs-score--done";
    if (score >= 80) return "cs-score--good";
    if (score >= 60) return "cs-score--ok";
    return "cs-score--low";
  }

  // ---------- スピーキング: 文を読み上げて採点 ----------
  function renderSpeaking(exercise, api) {
    const wrap = el("div", "cs-ex cs-ex--speaking");
    const card = el("div", "cs-speak-card");
    card.appendChild(audioRow(exercise.hanzi, { size: "small", autoplay: true }));
    const sentence = sentenceBlock({
      hanzi: exercise.hanzi,
      pinyin: exercise.pinyin,
      meaning: exercise.meaning,
      size: "lg",
    });
    card.appendChild(sentence);
    wrap.appendChild(card);
    const whisperBox = el("div", "cs-whisper hidden");
    wrap.appendChild(whisperBox);
    wrap.appendChild(spacer());
    const panel = el("div", "cs-mic-panel");
    wrap.appendChild(panel);

    const recognitionSupported = Speech.isRecognitionSupported();
    const recordingSupported = Speech.isRecordingSupported();
    let attempted = false;
    let bestScore = null;
    let recognizedText = "";
    let recordedAudioUrl = null;
    let submitted = false;
    let busy = false;
    let stopPlayback = null;
    let resultHint = null;
    let resultScore = null;
    let cleanupRecording = null;
    let disposed = false;

    function paint(matched) {
      sentence.querySelectorAll(".rb-char[data-i]").forEach((node) => {
        const ok = matched.has(Number(node.dataset.i));
        node.classList.toggle("rb-ok", ok);
        node.classList.toggle("rb-ng", !ok);
      });
    }

    function finishAttempt() {
      if (!submitted) {
        submitted = true;
        api.submit();
      } else {
        playOwn().then(() => api.setBusy(false));
      }
    }

    function renderIdle(message) {
      clear(panel);
      const micBtn = iconButton("cs-mic-btn", Icons.mic, "録音を開始");
      micBtn.addEventListener("click", startAttempt);
      panel.appendChild(micBtn);
      panel.appendChild(el("div", "cs-mic-hint", message || "マイクをタップして読み上げよう"));
      if (!recognitionSupported && !recordingSupported) {
        micBtn.disabled = true;
        panel.lastChild.textContent = "この端末は録音に対応していません。声に出して読んだら次へ進みましょう";
        const selfBtn = el("button", "cs-self-btn", "読み上げたので次へ");
        selfBtn.type = "button";
        selfBtn.addEventListener("click", () => {
          attempted = true;
          selfBtn.disabled = true;
          finishAttempt();
        });
        panel.appendChild(selfBtn);
      }
    }

    function renderRecording(onStop) {
      clear(panel);
      const wave = el("button", "cs-wave");
      wave.type = "button";
      wave.setAttribute("aria-label", "録音を終了");
      const bars = [];
      for (let i = 0; i < 24; i++) {
        const bar = el("span", "cs-wave-bar");
        wave.appendChild(bar);
        bars.push(bar);
      }
      wave.addEventListener("click", onStop);
      panel.appendChild(wave);
      panel.appendChild(el("div", "cs-mic-hint", "録音中… タップして終了"));
      return bars;
    }

    function renderProcessing() {
      clear(panel);
      panel.appendChild(el("div", "cs-processing", "判定中…"));
    }

    function renderResult() {
      clear(panel);
      const row = el("div", "cs-result-row");
      const replay = iconButton("cs-round-btn", Icons.play, "自分の録音を再生");
      replay.disabled = !recordedAudioUrl;
      replay.addEventListener("click", () => playOwn());
      resultScore = el("button", "cs-score " + scoreClass(bestScore));
      resultScore.type = "button";
      if (bestScore === null) resultScore.innerHTML = Icons.check;
      else resultScore.textContent = String(bestScore);
      resultScore.addEventListener("click", () => {
        if (stopPlayback) stopPlayback();
        else playOwn();
      });
      const retry = iconButton("cs-round-btn", Icons.retry, "もう一度録音");
      retry.addEventListener("click", startAttempt);
      row.append(replay, resultScore, retry);
      resultHint = el("div", "cs-mic-hint", "");
      panel.append(row, resultHint);
    }

    function updateScoreView() {
      if (!resultScore) return;
      resultScore.className = "cs-score " + scoreClass(bestScore);
      resultScore.textContent = String(bestScore);
    }

    // 自分の録音を再生。終わる(or 停止/失敗する)と解決するPromiseを返す
    function playOwn() {
      if (!recordedAudioUrl || disposed) return Promise.resolve();
      if (stopPlayback) stopPlayback();
      return new Promise((resolve) => {
        const audio = new Audio(recordedAudioUrl);
        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          stopPlayback = null;
          if (resultHint) resultHint.textContent = "スコアをタップすると自分の録音を聞けます";
          if (resultScore) resultScore.classList.remove("is-playing");
          resolve();
        };
        stopPlayback = () => {
          audio.pause();
          done();
        };
        audio.addEventListener("ended", done);
        audio.addEventListener("error", done);
        if (resultHint) resultHint.textContent = "自分の録音を再生中… タップで停止";
        if (resultScore) resultScore.classList.add("is-playing");
        audio.play().catch(done);
      });
    }

    async function startAttempt() {
      if (busy || disposed) return;
      busy = true;
      // 再生を止めると画面側の「再生完了→続けるを有効化」が先に走るので、
      // それを待ってから録音中の無効化をかける
      if (stopPlayback) stopPlayback();
      await Promise.resolve();
      if (submitted) api.setBusy(true);
      if (window.speechSynthesis) window.speechSynthesis.cancel();

      let recorder = null;
      if (recordingSupported) {
        try {
          recorder = await Speech.startRecording();
        } catch (e) {
          recorder = null;
        }
      }
      const recog = recognitionSupported ? Speech.startRecognition() : null;
      let finishManual = () => {};
      const manualStop = new Promise((resolve) => {
        finishManual = resolve;
      });
      const stop = () => {
        if (recog) recog.stop();
        finishManual();
      };
      const bars = renderRecording(stop);

      let meter = null;
      let raf = 0;
      const levels = new Array(bars.length).fill(0.1);
      let last = 0;
      const tick = (t) => {
        if (t - last > 70) {
          last = t;
          levels.shift();
          levels.push(meter ? meter.read() : 0.15 + Math.random() * 0.3);
          bars.forEach((b, i) => {
            b.style.transform = `scaleY(${Math.max(0.12, levels[i]).toFixed(2)})`;
          });
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      Speech.createLevelMeter()
        .then((m) => {
          meter = m;
        })
        .catch(() => {});

      cleanupRecording = () => {
        cancelAnimationFrame(raf);
        if (meter) meter.close();
        if (recog) recog.stop();
        finishManual();
      };

      let alternatives = [];
      if (recog) {
        alternatives = await recog.result.catch(() => []);
      } else {
        await manualStop; // 音声認識なし: タップされるまで録音だけ行う
      }
      cancelAnimationFrame(raf);
      if (meter) meter.close();
      cleanupRecording = null;
      if (disposed) return;
      renderProcessing();

      let blob = null;
      if (recorder) blob = await recorder.stop().catch(() => null);
      if (blob && blob.size > 0) {
        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
        recordedAudioUrl = URL.createObjectURL(blob);
      }

      if (recog && alternatives.length === 0) {
        busy = false;
        if (submitted) api.setBusy(false);
        renderIdle("うまく聞き取れませんでした。もう一度タップして読み上げてみよう");
        return;
      }

      attempted = true;
      if (alternatives.length > 0) {
        let best = null;
        for (const alt of alternatives) {
          const s = await scoreSpeech(exercise, alt);
          if (!best || s.score > best.score) best = Object.assign(s, { text: alt });
        }
        bestScore = best.score;
        recognizedText = best.text;
        paint(best.matched);
      }
      renderResult();
      busy = false;
      if (blob && blob.size > 0) refineWithWhisper(blob);
      finishAttempt();
    }

    // 録音をWhisper(ブラウザ内で動く高精度モデル)でも認識し、より良い
    // スコアが出たら表示を更新する。失敗しても既存の結果はそのまま使える
    async function refineWithWhisper(blob) {
      if (!window.WhisperASR || !window.WhisperASR.isSupported()) return;
      whisperBox.className = "cs-whisper";
      whisperBox.textContent = window.WhisperASR.loaded
        ? "🔍 高精度認識で確認中…"
        : "🔍 高精度認識で確認中…(初回はモデルの読み込みに時間がかかります)";
      const text = await window.WhisperASR.transcribe(blob).catch(() => null);
      if (disposed) return;
      if (!text) {
        whisperBox.classList.add("hidden");
        return;
      }
      const s = await scoreSpeech(exercise, text);
      if (bestScore === null || s.score > bestScore) {
        bestScore = s.score;
        recognizedText = text;
        paint(s.matched);
        updateScoreView();
      }
      const pinyinReading = window.PinyinConv ? await window.PinyinConv.convert(text).catch(() => null) : null;
      clear(whisperBox);
      whisperBox.className = "cs-whisper cs-whisper--done";
      whisperBox.appendChild(el("div", "cs-whisper-label", "高精度認識"));
      const line = el("div", "cs-whisper-text");
      if (pinyinReading) {
        const ruby = document.createElement("ruby");
        ruby.appendChild(document.createTextNode(text));
        ruby.appendChild(el("rt", null, pinyinReading));
        line.appendChild(ruby);
      } else {
        line.textContent = text;
      }
      whisperBox.appendChild(line);
    }

    renderIdle();

    return {
      element: wrap,
      instruction: "文を読みなさい",
      submitMode: "self",
      skippable: true,
      check() {
        return {
          correct: attempted, // 発音に挑戦したこと自体を評価(高スコアは苦手記録から除外)
          bonus: bestScore === null ? true : bestScore >= 80,
          correctText: `${exercise.hanzi}(${exercise.pinyin})`,
          userText: recognizedText ? `あなたの発音:「${recognizedText}」` : "発音に挑戦しました",
          score: bestScore,
        };
      },
      playRecording() {
        return playOwn();
      },
      dispose() {
        disposed = true;
        if (cleanupRecording) cleanupRecording();
        if (stopPlayback) stopPlayback();
      },
    };
  }

  // ---------- 意味に合う中国語(漢字)を選ぶ ----------
  function renderWritingCn(exercise, api) {
    const wrap = el("div", "cs-ex cs-ex--writing");
    wrap.appendChild(spacer());
    const card = el("div", "cs-word-card");
    card.appendChild(el("div", "cs-meaning-big", exercise.meaning));
    if (exercise.pinyinHint) card.appendChild(el("div", "cs-hint", `ヒント: ${exercise.pinyinHint}`));
    wrap.appendChild(card);
    wrap.appendChild(spacer());

    let selected = null;
    const options = shuffle([exercise.answer, ...pickClose(getHanziPool(), exercise.answer, 3)]);
    const list = choiceList(
      options.map((o) => ({ label: o, value: o })),
      {
        variant: "zh",
        onPick: (value) => {
          selected = value;
          api.submit();
        },
      }
    );
    wrap.appendChild(list.el);

    return {
      element: wrap,
      instruction: "正しい中国語を選べ",
      submitMode: "tap",
      check() {
        return {
          correct: selected === exercise.answer,
          correctText: exercise.answer,
          userText: selected || "(未回答)",
          sheet: sheetSentence({ hanzi: exercise.answer, pinyin: exercise.pinyinHint, meaning: exercise.meaning }),
          audio: exercise.answer,
        };
      },
      reveal() {
        list.mark(exercise.answer, selected);
      },
    };
  }

  // ---------- 漢字に合うピンインを選ぶ ----------
  function renderWritingPinyin(exercise, api) {
    const wrap = el("div", "cs-ex cs-ex--writing");
    wrap.appendChild(spacer());
    const card = el("div", "cs-word-card");
    card.appendChild(el("div", "cs-hanzi-big", exercise.hanzi));
    if (exercise.meaningHint) card.appendChild(el("div", "cs-hint tr-text", exercise.meaningHint));
    card.appendChild(audioRow(exercise.hanzi, { size: "small" }));
    wrap.appendChild(card);
    wrap.appendChild(spacer());

    const correctText = exercise.answerToned || exercise.answer;
    let selected = null;
    const options = shuffle([correctText, ...pickClose(getPinyinPool(), correctText, 3)]);
    const list = choiceList(
      options.map((o) => ({ label: o, value: o })),
      {
        variant: "pinyin",
        onPick: (value) => {
          selected = value;
          api.submit();
        },
      }
    );
    wrap.appendChild(list.el);

    return {
      element: wrap,
      instruction: "正しいピンインを選べ",
      submitMode: "tap",
      check() {
        return {
          correct: selected === correctText,
          correctText,
          userText: selected || "(未回答)",
          sheet: sheetSentence({ hanzi: exercise.hanzi, pinyin: correctText, meaning: exercise.meaningHint }),
          audio: exercise.hanzi,
        };
      },
      reveal() {
        list.mark(correctText, selected);
      },
    };
  }

  // ---------- ペアマッチ: 中国語と意味の組を作る ----------
  function renderMatchPairs(exercise, api) {
    const wrap = el("div", "cs-ex cs-ex--match");
    const doneArea = el("div", "cs-match-done");
    const grid = el("div", "cs-match-grid");
    const left = el("div", "cs-match-col");
    const right = el("div", "cs-match-col");
    grid.append(left, right);
    wrap.append(doneArea, grid);

    const pairs = exercise.pairs;
    let mistakes = 0;
    let matchedCount = 0;
    let selLeft = null;
    let selRight = null;
    let locked = false;

    function makeTile(side, i) {
      const p = pairs[i];
      const btn = el("button", `cs-match-tile cs-match-tile--${side}`);
      btn.type = "button";
      btn.dataset.i = String(i);
      if (side === "zh") btn.appendChild(Ruby.render(p.hanzi, p.pinyin, { className: "cs-match-ruby" }));
      else btn.textContent = p.meaning;
      btn.addEventListener("click", () => pick(side, btn));
      return btn;
    }

    shuffle(pairs.map((_, i) => i)).forEach((i) => left.appendChild(makeTile("zh", i)));
    shuffle(pairs.map((_, i) => i)).forEach((i) => right.appendChild(makeTile("ja", i)));

    function pick(side, btn) {
      if (locked || btn.classList.contains("is-matched")) return;
      if (side === "zh") {
        Speech.speak(pairs[Number(btn.dataset.i)].hanzi).catch(() => {});
        if (selLeft) selLeft.classList.remove("is-selected");
        selLeft = selLeft === btn ? null : btn;
        if (selLeft) selLeft.classList.add("is-selected");
      } else {
        if (selRight) selRight.classList.remove("is-selected");
        selRight = selRight === btn ? null : btn;
        if (selRight) selRight.classList.add("is-selected");
      }
      if (selLeft && selRight) evaluate();
    }

    function evaluate() {
      const a = selLeft;
      const b = selRight;
      selLeft = null;
      selRight = null;
      if (a.dataset.i === b.dataset.i) {
        matchedCount++;
        a.classList.add("is-matched");
        b.classList.add("is-matched");
        const p = pairs[Number(a.dataset.i)];
        const bar = el("div", "cs-match-bar");
        bar.appendChild(Ruby.render(p.hanzi, p.pinyin, { className: "cs-match-ruby" }));
        bar.appendChild(el("span", "cs-match-bar-ja", p.meaning));
        setTimeout(() => {
          a.remove();
          b.remove();
          doneArea.appendChild(bar);
        }, 220);
        if (matchedCount === pairs.length) {
          locked = true;
          setTimeout(() => api.submit(), 750);
        }
      } else {
        mistakes++;
        locked = true;
        a.classList.add("is-wrong");
        b.classList.add("is-wrong");
        setTimeout(() => {
          a.classList.remove("is-wrong", "is-selected");
          b.classList.remove("is-wrong", "is-selected");
          locked = false;
        }, 520);
      }
    }

    return {
      element: wrap,
      instruction: "正しいペアをタップしてください",
      submitMode: "self",
      check() {
        return {
          correct: mistakes === 0,
          autoAdvance: true,
          correctText: pairs.map((p) => `${p.hanzi}=${p.meaning}`).join(" / "),
          userText: mistakes > 0 ? `${mistakes}回まちがえました` : "全問正解",
        };
      },
    };
  }

  // ---------- 穴埋め: 空欄に入る単語を選ぶ ----------
  function renderFillBlank(exercise, api) {
    const tiles = Ruby.tiles(exercise.hanzi, exercise.pinyin);
    const answerTile = tiles[exercise.blankIndex];
    const wrap = el("div", "cs-ex cs-ex--fill");
    wrap.appendChild(audioRow(exercise.hanzi, { size: "small" }));

    const sentenceWrap = el("div", "cs-fill-sentence");
    const line = el("div", "cs-fill-line");
    const slot = el("button", "cs-slot");
    slot.type = "button";
    tiles.forEach((t, i) => {
      if (i === exercise.blankIndex) {
        line.appendChild(slot);
        if (t.punct) line.appendChild(el("span", "cs-fill-punct", t.punct));
      } else {
        line.appendChild(Ruby.render(t.hanzi + t.punct, t.pinyin, { className: "cs-fill-word" }));
      }
    });
    sentenceWrap.append(line, translationLine(exercise.meaning));
    wrap.appendChild(sentenceWrap);
    wrap.appendChild(spacer());

    const options = shuffle([
      Object.assign({}, answerTile, { punct: "" }),
      ...pickTileDistractors(new Set(tiles.map((t) => t.hanzi)), answerTile.hanzi.length, 3, exercise.unitIndex),
    ]);
    const bank = el("div", "cs-bank");
    let chosen = null;
    let chosenBtn = null;
    let locked = false;

    function renderSlot() {
      clear(slot);
      slot.classList.toggle("is-filled", !!chosen);
      if (chosen) slot.appendChild(Ruby.render(chosen.hanzi, chosen.pinyin, { className: "cs-tile-ruby" }));
    }

    options.forEach((opt) => {
      const btn = tileButton(opt);
      btn.addEventListener("click", () => {
        if (locked) return;
        if (chosenBtn) chosenBtn.classList.remove("is-used");
        if (chosenBtn === btn) {
          chosen = null;
          chosenBtn = null;
        } else {
          chosen = opt;
          chosenBtn = btn;
          btn.classList.add("is-used");
          Speech.speak(opt.hanzi).catch(() => {});
        }
        renderSlot();
        api.onChange(!!chosen);
      });
      bank.appendChild(btn);
    });
    slot.addEventListener("click", () => {
      if (locked || !chosenBtn) return;
      chosenBtn.classList.remove("is-used");
      chosen = null;
      chosenBtn = null;
      renderSlot();
      api.onChange(false);
    });
    wrap.appendChild(bank);

    return {
      element: wrap,
      instruction: "適切な語を選び、空欄に入れよ",
      submitMode: "button",
      check() {
        return {
          correct: !!chosen && chosen.hanzi === answerTile.hanzi,
          correctText: exercise.hanzi,
          userText: chosen ? chosen.hanzi : "(未回答)",
          sheet: sheetSentence(exercise, answerTile.hanzi),
          audio: exercise.hanzi,
        };
      },
      reveal(result) {
        locked = true;
        slot.classList.add(result.correct ? "is-correct" : "is-wrong");
      },
    };
  }

  // ---------- 並べ替え: 音声を聞いて単語を並べて文を作る ----------
  function renderSentenceBuild(exercise, api) {
    const tiles = Ruby.tiles(exercise.hanzi, exercise.pinyin);
    const wrap = el("div", "cs-ex cs-ex--build");
    wrap.appendChild(audioRow(exercise.hanzi, { autoplay: true }));
    wrap.appendChild(el("div", "cs-build-prompt", exercise.meaning));
    const answerArea = el("div", "cs-answer-area");
    wrap.appendChild(answerArea);
    wrap.appendChild(spacer());

    const extra = pickTileDistractors(new Set(tiles.map((t) => t.hanzi)), 2, tiles.length <= 6 ? 1 : 0, exercise.unitIndex);
    let bankTiles = tiles.concat(extra);
    const target = tiles.map((t) => t.hanzi).join("");
    for (let n = 0; n < 6; n++) {
      bankTiles = shuffle(bankTiles);
      if (bankTiles.slice(0, tiles.length).map((t) => t.hanzi).join("") !== target) break;
    }

    const bank = el("div", "cs-bank");
    const placed = [];
    let locked = false;
    bankTiles.forEach((tile) => {
      const bankBtn = tileButton(tile);
      bankBtn.addEventListener("click", () => {
        if (locked || bankBtn.classList.contains("is-used")) return;
        bankBtn.classList.add("is-used");
        const answerBtn = tileButton(tile);
        answerBtn.classList.add("cs-tile--placed");
        const entry = { tile, answerBtn };
        answerBtn.addEventListener("click", () => {
          if (locked) return;
          answerBtn.remove();
          bankBtn.classList.remove("is-used");
          placed.splice(placed.indexOf(entry), 1);
          api.onChange(placed.length > 0);
        });
        placed.push(entry);
        answerArea.appendChild(answerBtn);
        Speech.speak(tile.hanzi).catch(() => {});
        api.onChange(true);
      });
      bank.appendChild(bankBtn);
    });
    wrap.appendChild(bank);

    return {
      element: wrap,
      instruction: "音声を聞き、単語を並べて文章を作りなさい",
      submitMode: "button",
      check() {
        const user = placed.map((p) => p.tile.hanzi).join("");
        return {
          correct: user === target,
          correctText: exercise.hanzi,
          userText: placed.map((p) => p.tile.hanzi + (p.tile.punct || "")).join(" ") || "(未回答)",
          sheet: sheetSentence(exercise),
          audio: exercise.hanzi,
        };
      },
      reveal(result) {
        locked = true;
        placed.forEach((p) => p.answerBtn.classList.add(result.correct ? "is-correct" : "is-wrong"));
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
    match_pairs: renderMatchPairs,
    fill_blank: renderFillBlank,
    sentence_build: renderSentenceBuild,
  };

  function render(exercise, api) {
    const fn = renderers[exercise.type];
    if (!fn) throw new Error("Unknown exercise type: " + exercise.type);
    return fn(exercise, api);
  }

  return { render, audioRow, sentenceBlock, iconButton };
})();

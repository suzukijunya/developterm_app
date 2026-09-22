// 各レッスンの既存コンテンツ(単語・例文)から、ペアマッチ/穴埋め/並べ替えの
// 問題を自動生成してレッスン末尾に追加する。末尾に追加するのは、苦手問題の
// 記録キー("lessonId#index")の既存の番号をずらさないため。

const LessonExtras = (() => {
  function correctChoiceText(exercise) {
    return ((exercise.choices || []).find((c) => c.correct) || {}).text || null;
  }

  // レッスン内の単語・フレーズを重複なく抽出する(事前学習カードとペア問題用)
  function vocabItems(lesson) {
    const seen = new Set();
    const items = [];
    lesson.exercises.forEach((exercise) => {
      let hanzi = null;
      let pinyin = null;
      let meaning = null;
      switch (exercise.type) {
        case "listening_choice":
          hanzi = exercise.audioText;
          pinyin = exercise.pinyin;
          meaning = correctChoiceText(exercise);
          break;
        case "translate_choice":
          hanzi = exercise.hanzi;
          pinyin = exercise.pinyin;
          meaning = correctChoiceText(exercise);
          break;
        case "speaking":
          hanzi = exercise.hanzi;
          pinyin = exercise.pinyin;
          meaning = exercise.meaning;
          break;
        case "writing_cn":
          hanzi = exercise.answer;
          pinyin = exercise.pinyinHint;
          meaning = exercise.meaning;
          break;
        case "writing_pinyin":
          hanzi = exercise.hanzi;
          pinyin = exercise.answerToned || exercise.answer;
          meaning = exercise.meaningHint;
          break;
        default:
          return;
      }
      if (!hanzi || seen.has(hanzi)) return;
      seen.add(hanzi);
      items.push({ hanzi, pinyin, meaning });
    });
    return items;
  }

  // 並べ替え・穴埋めに使える例文(ピンインと単語単位で対応が取れるもの)
  function sentenceCandidates(lesson) {
    const out = [];
    const seen = new Set();
    lesson.exercises.forEach((exercise) => {
      let s = null;
      if (exercise.type === "speaking") {
        s = { hanzi: exercise.hanzi, pinyin: exercise.pinyin, meaning: exercise.meaning };
      } else if (exercise.type === "listening_choice") {
        s = { hanzi: exercise.audioText, pinyin: exercise.pinyin, meaning: correctChoiceText(exercise) };
      }
      if (!s || !s.meaning || seen.has(s.hanzi)) return;
      const tiles = Ruby.tiles(s.hanzi, s.pinyin);
      if (!tiles || tiles.length < 3 || tiles.length > 14) return;
      seen.add(s.hanzi);
      out.push(Object.assign(s, { tileCount: tiles.length, tiles }));
    });
    return out.sort((a, b) => b.tileCount - a.tileCount);
  }

  function lessonText(lesson) {
    return lesson.exercises
      .map((ex) => [ex.hanzi, ex.audioText, ex.passage, ex.answer].filter(Boolean).join(" "))
      .join(" ");
  }

  // ビジネス系のレッスンは長文中心で短い単語が少ないので、そのレッスンの
  // 文中に実際に出てくる単語帳の単語でペア問題を補う
  function deckWordsInLesson(lesson) {
    if (typeof VOCAB_DECKS === "undefined") return [];
    const text = lessonText(lesson);
    const out = [];
    VOCAB_DECKS.forEach((deck) =>
      deck.words.forEach((w) => {
        if (Array.from(w.hanzi).length >= 2 && text.includes(w.hanzi)) out.push(w);
      })
    );
    return out;
  }

  function buildMatchPairs(lesson, unit) {
    const usedMeanings = new Set();
    const usedHanzi = new Set();
    const pairs = [];
    const sameUnitItems = unit.lessons.filter((l) => l !== lesson).flatMap(vocabItems);
    vocabItems(lesson)
      .concat(deckWordsInLesson(lesson), sameUnitItems)
      .forEach((item) => {
        if (pairs.length >= 4) return;
        if (!item.pinyin || !item.meaning) return;
        if (Array.from(item.hanzi).length > 5 || item.meaning.length > 14) return;
        if (usedMeanings.has(item.meaning) || usedHanzi.has(item.hanzi)) return;
        usedMeanings.add(item.meaning);
        usedHanzi.add(item.hanzi);
        pairs.push({ hanzi: item.hanzi, pinyin: item.pinyin, meaning: item.meaning });
      });
    return pairs.length >= 3 ? { type: "match_pairs", pairs, generated: true } : null;
  }

  // unitIndex はダミーの単語を「そのユニットまでに習った単語」から選ぶために使う
  // 空欄にする単語は、そのレッスンで習う単語を最優先し、次に長い(内容語らしい)
  // 単語、同点なら後ろの単語(目的語など)を選ぶ
  function buildFillBlank(sentence, unitIndex, lessonWords) {
    const score = (t) => (lessonWords.has(t.hanzi) ? 10 : 0) + t.hanzi.length;
    let blankIndex = 0;
    sentence.tiles.forEach((t, i) => {
      if (score(t) >= score(sentence.tiles[blankIndex])) blankIndex = i;
    });
    return {
      type: "fill_blank",
      hanzi: sentence.hanzi,
      pinyin: sentence.pinyin,
      meaning: sentence.meaning,
      blankIndex,
      unitIndex,
      generated: true,
    };
  }

  function buildSentenceBuild(sentence, unitIndex) {
    return {
      type: "sentence_build",
      hanzi: sentence.hanzi,
      pinyin: sentence.pinyin,
      meaning: sentence.meaning,
      unitIndex,
      generated: true,
    };
  }

  function augment(units) {
    units.forEach((unit, unitIndex) =>
      unit.lessons.forEach((lesson) => {
        if (lesson._augmented) return;
        lesson._augmented = true;
        const extra = [];
        const match = buildMatchPairs(lesson, unit);
        if (match) extra.push(match);
        // 並べ替えはタイルが多すぎると難しすぎるので8語以内の文を使い、
        // 穴埋めには残りのうち一番長い文を使う
        const sentences = sentenceCandidates(lesson);
        const buildSentence = sentences.find((s) => s.tileCount <= 8) || null;
        const fillSentence = sentences.find((s) => s !== buildSentence) || null;
        const lessonWords = new Set(
          vocabItems(lesson)
            .concat(deckWordsInLesson(lesson))
            .map((w) => w.hanzi)
        );
        if (fillSentence) extra.push(buildFillBlank(fillSentence, unitIndex, lessonWords));
        if (buildSentence) extra.push(buildSentenceBuild(buildSentence, unitIndex));
        lesson.exercises.push(...extra);
      })
    );
  }

  return { vocabItems, sentenceCandidates, augment };
})();

LessonExtras.augment(UNITS);

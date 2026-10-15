// 科目・章・問題データの登録先。各科目ファイル(far.js など)が CPA.section() で登録する。
//
// 章(chapter)の形:
//   { id, title, en, note: "講義ノートのHTML",
//     mcq: [{ q: 英語の問題文, ja: 和訳, c: [選択肢A〜D], a: 正解のindex, ex: 日本語解説 }],
//     cards: [[英語の用語, 日本語訳, 一言説明, 詳しい説明?, 日本でいうと?, 例?]] }
// TBS は CPA.tbs() で登録する(js/data/tbs.js)。

const CPA = (() => {
  const sections = [];
  const tbsList = [];

  // 正解の位置が偏らないよう、問題IDから決まる位置へ正解の選択肢を入れ替える
  // (毎回同じ並びになるので、復習時に位置が変わって混乱することはない)
  function balanceAnswer(q) {
    let h = 0;
    for (const ch of q.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const to = h % q.c.length;
    if (to === q.a) return;
    [q.c[to], q.c[q.a]] = [q.c[q.a], q.c[to]];
    q.a = to;
  }

  function section(def) {
    def.chapters.forEach((ch) => {
      ch.section = def.id;
      ch.mcq.forEach((q, i) => {
        q.id = ch.id + "-q" + String(i + 1).padStart(2, "0");
        balanceAnswer(q);
        q.chapter = ch.id;
        q.section = def.id;
      });
      ch.cards = (ch.cards || []).map((c, i) => ({
        id: ch.id + "-k" + String(i + 1).padStart(2, "0"),
        en: c[0],
        ja: c[1],
        desc: c[2] || "",
        xp: c[3] ? [c[3], c[4] || "", c[5] || ""] : null, // 4〜6番目:詳しい説明・日本でいうと・例(任意)
        chapter: ch.id,
        section: def.id,
      }));
    });
    sections.push(def);
  }

  // 既存の章に問題・カードを追加する。保存済みの学習記録がずれないよう、IDは既存の続き番号にする
  function extend(chapterId, add) {
    const ch = getChapter(chapterId);
    if (!ch) throw new Error("unknown chapter " + chapterId);
    (add.mcq || []).forEach((q) => {
      q.id = ch.id + "-q" + String(ch.mcq.length + 1).padStart(2, "0");
      balanceAnswer(q);
      q.chapter = ch.id;
      q.section = ch.section;
      ch.mcq.push(q);
    });
    (add.cards || []).forEach((c) => {
      ch.cards.push({
        id: ch.id + "-k" + String(ch.cards.length + 1).padStart(2, "0"),
        en: c[0],
        ja: c[1],
        desc: c[2] || "",
        xp: c[3] ? [c[3], c[4] || "", c[5] || ""] : null,
        chapter: ch.id,
        section: ch.section,
      });
    });
  }

  function tbs(def) {
    tbsList.push(def);
  }

  const getSection = (id) => sections.find((s) => s.id === id);
  const allChapters = () => sections.flatMap((s) => s.chapters);
  const getChapter = (id) => allChapters().find((c) => c.id === id);
  const allMcq = () => allChapters().flatMap((c) => c.mcq);
  const getMcq = (id) => allMcq().find((q) => q.id === id);
  const allCards = () => allChapters().flatMap((c) => c.cards);
  const getTbs = (id) => tbsList.find((t) => t.id === id);
  const tbsFor = (filter) => tbsList.filter((t) => (filter.section ? t.section === filter.section : true) && (filter.chapter ? t.chapter === filter.chapter : true));

  return { section, extend, tbs, sections, tbsList, getSection, allChapters, getChapter, allMcq, getMcq, allCards, getTbs, tbsFor };
})();

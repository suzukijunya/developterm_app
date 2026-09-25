// ピンイン: コースマップ・各レッスン・ピンイン表・ピンインテスト
const PinyinCourse = (() => {
  const { el, clear } = UI;
  const D = PinyinData;

  const TONE_NAMES = { 1: "第1声", 2: "第2声", 3: "第3声", 4: "第4声" };
  const TONE_GLYPHS = { 1: "ā", 2: "á", 3: "ǎ", 4: "à" };

  // ---------- コースの中身 ----------
  // ex: 例の音節(数字は声調)。代表字は pinyin_chart.js のデータから引く
  const INITIAL_TIPS = {
    b: { tip: "息を抑えて出す「パ」。日本語の「バ」ほど濁らせない(無気音)。", ex: ["ba1", "bi3", "bu4"] },
    p: { tip: "息を強く吐きながら「パ」。口の前のティッシュが揺れるくらい(有気音)。", ex: ["pa4", "pi2", "pao3"] },
    m: { tip: "日本語の「マ行」とほぼ同じ。唇を閉じてから開く。", ex: ["ma1", "mi3", "mao1"] },
    f: { tip: "上の歯を下唇に軽く当てて息を出す。英語の f と同じ。", ex: ["fa1", "fei1", "fu4"] },
    d: { tip: "息を抑えた「タ」。濁らせずに短く(無気音)。", ex: ["da4", "di4", "dou1"] },
    t: { tip: "息を強く吐き出す「タ」(有気音)。", ex: ["ta1", "tian1", "tou2"] },
    n: { tip: "日本語の「ナ行」と同じ。舌先を上の歯ぐきにつける。", ex: ["na2", "ni3", "nan2"] },
    l: { tip: "舌先を上の歯ぐきにつけてから離す。英語の l に近い。", ex: ["la1", "lai2", "lü4"] },
    g: { tip: "息を抑えた「カ」。日本語の「ガ」のように濁らせない(無気音)。", ex: ["ge1", "gao1", "gui4"] },
    k: { tip: "息を強く吐き出す「カ」(有気音)。", ex: ["ka3", "kou3", "kan4:看"] },
    h: { tip: "のどの奥で息をこする「ハ」。日本語より摩擦を強く。", ex: ["he1:喝", "hao3:好", "hua1"] },
    j: { tip: "息を抑えた「チ」。舌先を下の歯の裏につけ、口を横に引く(無気音)。", ex: ["ji1", "jia1", "jiu3"] },
    q: { tip: "息を強く吐き出す「チ」(有気音)。j と同じ舌の位置で。", ex: ["qi1", "qu4", "qian2"] },
    x: { tip: "口を横に引いて「シ」。舌先は下の歯の裏に。", ex: ["xi1", "xiao3", "xue2"] },
    zh: { tip: "舌先を反らせて上あごに当て、息を抑えて「ヂ」(無気音)。", ex: ["zhi1", "zhe4:这", "zhong1:中"] },
    ch: { tip: "zh と同じ舌の形で、息を強く出す「チ」(有気音)。", ex: ["chi1:吃", "cha2:茶", "chuan2"] },
    sh: { tip: "舌を反らせたまま「シ」。舌先は上あごに触れない。", ex: ["shi4", "shu1", "shan1"] },
    r: { tip: "舌を反らせたまま、「リ」と「ジ」の中間のような音を出す。", ex: ["ri4", "re4", "ren2"] },
    z: { tip: "息を抑えた「ツ」。口を横に引いて(無気音)。", ex: ["zi4", "zai4", "zou3"] },
    c: { tip: "息を強く吐き出す「ツ」(有気音)。", ex: ["ci2", "cai4", "cong2:从"] },
    s: { tip: "口を横に引いて「ス」。", ex: ["si4", "san1", "suo3"] },
  };

  const FINAL_TIPS = {
    a: { tip: "口を大きく開けて「アー」。", ex: ["ba1", "ma1", "ta1"] },
    o: { tip: "唇を丸くして「オー」。b・p・m・f の後では「ウオ」に近く聞こえる。", ex: ["bo1", "po1", "mo2"] },
    e: { tip: "「エ」の口の形のまま、のどの奥で「ウ」と言う。「ウァ」に近いあいまいな音。", ex: ["he1:喝", "ke4", "de2"] },
    i: { tip: "口を横に強く引いて「イー」。zhi・chi・shi・ri・zi・ci・si の i は「ウ」に近い音になる。", ex: ["yi1", "ni3", "shi4"] },
    u: { tip: "唇を強く丸めて前に突き出し「ウー」。日本語の「ウ」より深い。", ex: ["wu3", "bu4", "lu4"] },
    ü: { tip: "「ウ」の唇のまま「イ」と言う。j・q・x・y の後では点を省いて u と書く。", ex: ["yu2", "nü3", "lü4"] },
    ai: { tip: "はっきり「アイ」。", ex: ["ai4", "mai3", "lai2"] },
    ei: { tip: "「エイ」。e ははっきりした「エ」。", ex: ["fei1", "mei3", "hei1"] },
    ao: { tip: "「アオ」。後ろは軽く「アゥ」に近い。", ex: ["hao3:好", "mao1", "dao4"] },
    ou: { tip: "「オウ」。唇を丸めて。", ex: ["kou3", "dou1", "zou3"] },
    er: { tip: "「ア」と言いながら舌先を反らせる。単独で使うそり舌の韻母。", ex: ["er4", "er2", "er3"] },
    ia: { tip: "「イア」を1音で「ヤ」のように。", ex: ["jia1", "xia4", "ya2"] },
    ie: { tip: "「イエ」。e はここでははっきりした「エ」。", ex: ["xie4", "jie3", "ye3"] },
    iao: { tip: "「イアオ」を1音で「ヤオ」のように。", ex: ["xiao3", "jiao4", "yao4"] },
    iu: { tip: "本来は iou。「イオウ」を縮めた音で、第3・4声だと o がはっきり聞こえる。", ex: ["liu4", "jiu3", "you3"] },
    ua: { tip: "「ウア」を1音で「ワ」のように。", ex: ["hua1", "gua1", "wa2"] },
    uo: { tip: "「ウオ」。「ウォ」のように。", ex: ["guo2", "duo1", "wo3"] },
    uai: { tip: "「ウアイ」を1音で「ワイ」のように。", ex: ["kuai4", "huai4", "wai4"] },
    ui: { tip: "本来は uei。「ウエイ」を縮めた音。", ex: ["dui4", "gui4", "wei4"] },
    üe: { tip: "ü のあとに「エ」。「ユエ」に近い。", ex: ["yue4", "xue2", "jue2"] },
    an: { tip: "舌先を上の歯ぐきにつけて終わる「アン」(「案内」の「ン」)。", ex: ["an1", "man4", "kan4:看"] },
    en: { tip: "あいまいな「エン」。-n なので舌先を歯ぐきにつけて終わる。", ex: ["ren2", "men2", "hen3"] },
    in: { tip: "「イン」。舌先を歯ぐきにつけて短く終わる。", ex: ["xin1", "lin2", "yin1"] },
    ian: { tip: "つづりは ian でも発音は「イエン」。a が「エ」に変わるので注意。", ex: ["tian1", "mian4", "qian2"] },
    uan: { tip: "「ウアン」を1音で「ワン」のように。", ex: ["guan1", "huan1", "wan3"] },
    un: { tip: "本来は uen。「ウエン」を縮めた音。", ex: ["chun1", "lun2", "wen4"] },
    üan: { tip: "ü のあとに「エン」。「ユエン」に近い。", ex: ["yuan2", "quan2", "xuan3"] },
    ün: { tip: "ü のあとに「ン」。「ユン」に近い。", ex: ["yun2", "jun1", "qun2"] },
    ang: { tip: "口を開けたまま舌の奥を上げて終わる「アン(グ)」(「案外」の「ン」)。", ex: ["mang2", "fang2", "chang2"] },
    eng: { tip: "あいまいな「オン」に近い音。口は開けたまま。", ex: ["leng3", "feng1", "deng3"] },
    ing: { tip: "「イン(グ)」。舌先はどこにも付けない。", ex: ["ting1:听", "ming2", "ying1"] },
    ong: { tip: "唇を丸めて「オン(グ)」。「ウォン」に近い。", ex: ["hong2", "dong1", "zhong1:中"] },
    iang: { tip: "「イアン(グ)」を1音で「ヤン」のように。", ex: ["xiang3", "liang3", "jiang1"] },
    iong: { tip: "「イオン(グ)」を1音で「ヨン」のように。", ex: ["xiong2", "yong4", "qiong2"] },
    uang: { tip: "「ウアン(グ)」を1音で「ワン」のように。", ex: ["huang2", "guang1", "wang2"] },
    ueng: { tip: "「ウォン(グ)」。声母が付かず weng としてだけ使う。", ex: ["weng1", "weng4"] },
  };

  const SANDHI_RULES = [
    {
      title: "第3声 + 第3声 → 第2声 + 第3声",
      text: "第3声が2つ続くと、前の字を第2声で発音します。表記は第3声のまま。",
      ex: [["你好", "nǐ hǎo", "ní hǎo"], ["可以", "kě yǐ", "ké yǐ"], ["水果", "shuǐ guǒ", "shuí guǒ"]],
    },
    {
      title: "半3声",
      text: "第3声のあとに第1・2・4声や軽声が続くと、低く抑えたまま上げずに次の字へ進みます。",
      ex: [["老师", "lǎo shī"], ["很忙", "hěn máng"], ["好看", "hǎo kàn"]],
    },
    {
      title: "「不」の変化",
      text: "不 bù は、第4声の前では bú(第2声)になります。それ以外はそのまま bù。",
      ex: [["不是", "bù shì", "bú shì"], ["不去", "bù qù", "bú qù"], ["不好", "bù hǎo", "bù hǎo(変化なし)"]],
    },
    {
      title: "「一」の変化",
      text: "一 yī は、第4声の前で yí、第1・2・3声の前で yì。数字として読むとき・順番・語末では yī のまま。",
      ex: [["一个", "yī gè", "yí ge"], ["一天", "yī tiān", "yì tiān"], ["第一", "dì yī", "dì yī(変化なし)"]],
    },
    {
      title: "軽声",
      text: "本来の声調を失って、前の音に続けて軽く短く読む音。声調記号は付けません。",
      ex: [["妈妈", "mā ma"], ["谢谢", "xiè xie"], ["朋友", "péng you"]],
    },
    {
      title: "儿化(r化)",
      text: "語尾に「儿」が付くと、前の音節の終わりで舌を反らせます。北京など北方でよく聞かれます。",
      ex: [["一点儿", "yì diǎnr"], ["哪儿", "nǎr"], ["玩儿", "wánr"]],
    },
  ];

  // 声調変化クイズ: [漢字, 表記, 実際の発音, まちがいの選択肢...]
  const SANDHI_QUIZ = [
    ["你好", "nǐ hǎo", "ní hǎo", "nǐ hǎo", "nǐ háo"],
    ["很好", "hěn hǎo", "hén hǎo", "hěn hǎo", "hěn háo"],
    ["可以", "kě yǐ", "ké yǐ", "kě yǐ", "kě yí"],
    ["水果", "shuǐ guǒ", "shuí guǒ", "shuǐ guǒ", "shuǐ guó"],
    ["不是", "bù shì", "bú shì", "bù shì", "bū shì"],
    ["不去", "bù qù", "bú qù", "bù qù", "bǔ qù"],
    ["不来", "bù lái", "bù lái", "bú lái", "bǔ lái"],
    ["一个", "yī gè", "yí ge", "yī ge", "yì ge"],
    ["一天", "yī tiān", "yì tiān", "yī tiān", "yí tiān"],
    ["一起", "yī qǐ", "yì qǐ", "yī qǐ", "yí qǐ"],
    ["一样", "yī yàng", "yí yàng", "yī yàng", "yì yàng"],
    ["第一", "dì yī", "dì yī", "dì yí", "dì yì"],
  ];

  const COURSE = [
    { id: "about", title: "ピンインについて", board: "pīn\nyīn", kind: "about", color: "orange", lead: "ピンイン(拼音)は、中国語の発音をアルファベットで表す記号です。中国の子どもも小学校で最初に習います。" },
    { id: "tones", title: "声調", board: "ā á\nǎ à", kind: "tones", color: "pink", lead: "中国語は音の高さの変化(声調)で意味が変わります。同じ ma でも声調が違えば別の言葉に。" },
    { id: "ini1", title: "声母1", board: "b p\nm f", kind: "initials", items: ["b", "p", "m", "f"], color: "blue", section: "声母(子音)", lead: "唇を使う音。b と p は「息の強さ」だけが違います。" },
    { id: "ini2", title: "声母2", board: "d t\nn l", kind: "initials", items: ["d", "t", "n", "l"], color: "green", lead: "舌先を上の歯ぐきに当てる音。d(息を抑える)と t(息を強く)を聞き分けよう。" },
    { id: "ini3", title: "声母3", board: "g k h", kind: "initials", items: ["g", "k", "h"], color: "purple", lead: "のどの奥で出す音。g は濁らせない「カ」です。" },
    { id: "ini4", title: "声母4", board: "j q x", kind: "initials", items: ["j", "q", "x"], color: "teal", lead: "舌の前の方を上あごに近づける音。後ろには i と ü しか来ません。" },
    { id: "ini5", title: "声母5", board: "zh ch\nsh r", kind: "initials", items: ["zh", "ch", "sh", "r"], color: "orange", lead: "舌を反らせて出す「そり舌音」。日本語にない音なので一番の練習ポイント!" },
    { id: "ini6", title: "声母6", board: "z c s", kind: "initials", items: ["z", "c", "s"], color: "blue", lead: "舌先を歯の裏に近づける音。zh・ch・sh との違いは舌を反らせないこと。" },
    { id: "fin1", title: "韻母1", board: "a o e\ni u ü", kind: "finals", items: ["a", "o", "e", "i", "u", "ü"], color: "pink", section: "韻母(母音)", lead: "基本の6つの母音。e と ü は日本語にない音です。" },
    { id: "fin2", title: "韻母2", board: "ai ei\nao ou", kind: "finals", items: ["ai", "ei", "ao", "ou", "er"], color: "green", lead: "2つの母音をなめらかにつなげる複母音と、そり舌の er。" },
    { id: "fin3", title: "韻母3", board: "ia ie\niao iu", kind: "finals", items: ["ia", "ie", "iao", "iu"], color: "purple", lead: "i で始まる韻母。声母がないときは y を付けて ya・ye・yao・you と書きます。" },
    { id: "fin4", title: "韻母4", board: "ua uo\nui üe", kind: "finals", items: ["ua", "uo", "uai", "ui", "üe"], color: "teal", lead: "u・ü で始まる韻母。声母がないときは w・y を付けて wa・wo・wai・wei・yue と書きます。" },
    { id: "fin5", title: "韻母5", board: "an en\nin un", kind: "finals", items: ["an", "en", "in", "ian", "uan", "un", "üan", "ün"], color: "orange", lead: "-n で終わる韻母。舌先を上の歯ぐきにつけて終わります(「案内」の「ン」)。" },
    { id: "fin6", title: "韻母6", board: "ang eng\ning ong", kind: "finals", items: ["ang", "eng", "ing", "ong", "iang", "iong", "uang", "ueng"], color: "blue", lead: "-ng で終わる韻母。口を開けたまま舌の奥を上げて終わります(「案外」の「ン」)。" },
    { id: "sandhi", title: "声調の変化", board: "nǐ hǎo", kind: "sandhi", color: "pink", section: "仕上げ", lead: "つながると声調が変わる、実際の会話で大事なルールです。" },
  ];

  const INITIAL_GROUPS = [["b", "p", "m", "f"], ["d", "t", "n", "l"], ["g", "k", "h"], ["j", "q", "x"], ["zh", "ch", "sh", "r"], ["z", "c", "s"]];
  const INITIAL_PAIRS = { b: "p", p: "b", d: "t", t: "d", g: "k", k: "g", n: "l", l: "n", f: "h", h: "f", m: "n", j: "zh", q: "ch", x: "sh", zh: "z", z: "zh", ch: "c", c: "ch", sh: "s", s: "sh", r: "l" };
  const FINAL_GROUPS = COURSE.filter((n) => n.kind === "finals").map((n) => n.items);
  const FINAL_PAIRS = {
    an: "ang", ang: "an", en: "eng", eng: "en", in: "ing", ing: "in", ian: "iang", iang: "ian", uan: "uang", uang: "uan",
    un: "ong", ong: "eng", ün: "un", üan: "uan", ie: "üe", üe: "ie", u: "ü", ü: "u", i: "ü", e: "o", o: "e",
    ou: "uo", uo: "ou", ai: "ei", ei: "ai", ao: "ou", ia: "ie", iao: "iu", iu: "iao", ua: "uo", uai: "ai", ui: "ei", iong: "ong", er: "e", ueng: "ong",
  };

  // ---------- 小道具 ----------
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function say(text, slow = false) {
    return Speech.speak(text, { rate: slow ? 0.45 : 0.75 }).catch(() => {});
  }

  // 声母+韻母の組み合わせが実在するか(j・q・x の後ろの u は ü と同じ綴りになるので除く)
  function valid(i, f) {
    if (["j", "q", "x"].includes(i) && f[0] === "u") return false;
    return D.exists(D.written(i, f));
  }

  function syllable(syl, t, i, f) {
    const e = PINYIN_SYLLABLES[syl];
    if (!e || !e[t - 1]) return null;
    return { syl, t, i, f, toned: e[t - 1][0], ch: e[t - 1][1] };
  }

  function cand(i, f, t) {
    return valid(i, f) ? syllable(D.written(i, f), t, i, f) : null;
  }

  // "ba1" → 音節オブジェクト。"hao3:好" のように代表字を指定することもできる
  function fromCode(str) {
    const [code, ch] = str.split(":");
    const m = code.match(/^(.+)([1-4])$/);
    const s = m ? syllable(m[1], Number(m[2])) : null;
    return s && ch ? { ...s, ch } : s;
  }

  // 綴り → [声母, 韻母]
  const SPLIT = {};
  D.INITIALS.forEach((i) => D.FINALS.forEach((f) => {
    if (valid(i, f)) SPLIT[D.written(i, f)] = [i, f];
  }));

  const ALL_SYLS = Object.keys(PINYIN_SYLLABLES);

  function sylChip(s, { className = "py-chip" } = {}) {
    const b = UI.button(className, "", () => say(s.ch));
    b.appendChild(el("span", "py-chip-py", s.toned));
    b.appendChild(el("span", "py-chip-ch", s.ch));
    return b;
  }

  function toneCurve(tone) {
    // 5段階の音の高さ(5=高い)で声調の形を描く
    const points = { 1: [[0, 5], [1, 5]], 2: [[0, 3], [1, 5]], 3: [[0, 2], [0.5, 1], [1, 4]], 4: [[0, 5], [1, 1]], 0: [[0.45, 3], [0.55, 3]] }[tone];
    const toXY = ([x, y]) => `${(8 + x * 64).toFixed(1)},${(8 + (5 - y) * 11).toFixed(1)}`;
    const svg = `<svg viewBox="0 0 80 60" aria-hidden="true">${[1, 2, 3, 4, 5]
      .map((lv) => `<line x1="4" x2="76" y1="${8 + (5 - lv) * 11}" y2="${8 + (5 - lv) * 11}" class="tc-grid"/>`)
      .join("")}<polyline points="${points.map(toXY).join(" ")}" class="tc-line"/></svg>`;
    const box = el("div", "tone-curve");
    box.innerHTML = svg;
    return box;
  }

  function board(text, className = "py-board") {
    const b = el("div", className);
    text.split("\n").forEach((line) => b.appendChild(el("span", "", line)));
    return b;
  }

  // ---------- 進み具合 ----------
  function doneSet() {
    return new Set(AppState.getPref("pinyinDone", []));
  }

  function markDone(id) {
    const s = doneSet();
    s.add(id);
    AppState.setPref("pinyinDone", Array.from(s));
  }

  // ---------- 問題の作り方 ----------
  // 選択肢(文字列)をシャッフルして問題にする
  function makeQ({ prompt, display = null, audio = null, correct, wrong, reveal, review }) {
    const options = shuffle([correct, ...wrong]);
    return { prompt, display, audio, options, answer: options.indexOf(correct), reveal, review };
  }

  function syllableReview(s) {
    return { label: s.toned, ch: s.ch };
  }

  // 似ている順に並べて、上から n 個の不正解を選ぶ
  function closest(pool, correct, rank, n = 3) {
    return pool
      .filter((x) => x !== correct)
      .map((x) => ({ x, r: rank(x) + Math.random() }))
      .sort((a, b) => a.r - b.r)
      .slice(0, n)
      .map((o) => o.x);
  }

  function listenQ(prompt, c, others) {
    return makeQ({
      prompt,
      audio: c.ch,
      correct: c.toned,
      wrong: others.map((o) => o.toned),
      reveal: `${c.toned}  ${c.ch}`,
      review: syllableReview(c),
    });
  }

  function toneQ(minTones = 4) {
    const syls = ALL_SYLS.filter((s) => D.tonesOf(s).length >= minTones);
    const syl = pick(syls);
    const all = D.tonesOf(syl).map((x) => syllable(syl, x.tone));
    const c = pick(all);
    const q = listenQ("聞こえた声調はどれ?", c, all.filter((x) => x !== c));
    q.reveal = `${c.toned}  ${c.ch}(${TONE_NAMES[c.t]})`;
    return q;
  }

  function initialQ(group = null) {
    const initials = group || D.INITIALS.filter(Boolean);
    for (let n = 0; n < 400; n++) {
      const f = pick(D.FINALS);
      const t = 1 + rand(4);
      const pool = initials.map((i) => cand(i, f, t)).filter(Boolean);
      if (pool.length < 3) continue;
      const c = pick(pool);
      const mates = INITIAL_GROUPS.find((g) => g.includes(c.i)) || [];
      const others = closest(pool, c, (x) => (INITIAL_PAIRS[c.i] === x.i ? 0 : mates.includes(x.i) ? 1 : 2));
      return listenQ("聞こえた音はどれ?(はじめの子音に注目)", c, others);
    }
    return toneQ();
  }

  function finalQ(group = null) {
    const finals = group || D.FINALS;
    for (let n = 0; n < 400; n++) {
      const i = pick(D.INITIALS);
      const t = 1 + rand(4);
      const pool = finals.map((f) => cand(i, f, t)).filter(Boolean);
      if (pool.length < 3) continue;
      const c = pick(pool);
      const mates = FINAL_GROUPS.find((g) => g.includes(c.f)) || [];
      const others = closest(pool, c, (x) => (FINAL_PAIRS[c.f] === x.f ? 0 : mates.includes(x.f) ? 1 : 2));
      return listenQ("聞こえた音はどれ?(母音の部分に注目)", c, others);
    }
    return toneQ();
  }

  // 声母・韻母・声調のどれか1つだけ違う選択肢から、音節まるごとを選ぶ
  function syllableQ() {
    for (let n = 0; n < 400; n++) {
      const syl = pick(Object.keys(SPLIT));
      const [i, f] = SPLIT[syl];
      const tones = D.tonesOf(syl);
      if (!tones.length) continue;
      const c = syllable(syl, pick(tones).tone, i, f);
      const seen = new Set([c.toned]);
      const others = [];
      const push = (s) => {
        if (s && !seen.has(s.toned) && others.length < 3) {
          seen.add(s.toned);
          others.push(s);
        }
      };
      if (INITIAL_PAIRS[i]) push(cand(INITIAL_PAIRS[i], f, c.t));
      if (FINAL_PAIRS[f]) push(cand(i, FINAL_PAIRS[f], c.t));
      shuffle(tones).forEach((x) => push(syllable(syl, x.tone)));
      shuffle(D.INITIALS).forEach((x) => push(cand(x, f, c.t)));
      if (others.length < 3) continue;
      return listenQ("聞こえた音節はどれ?", c, others);
    }
    return toneQ();
  }

  // 「ピンインについて」: 音節を声母・韻母・声調に分解する
  function partsQ() {
    for (let n = 0; n < 400; n++) {
      const syl = pick(Object.keys(SPLIT));
      const [i, f] = SPLIT[syl];
      if (!i || f.startsWith("ü")) continue;
      const tones = D.tonesOf(syl);
      if (!tones.length) continue;
      const c = syllable(syl, pick(tones).tone, i, f);
      const part = pick(["initial", "final", "tone"]);
      const reveal = `${c.toned} = ${i}(声母)+ ${f}(韻母)+ ${TONE_NAMES[c.t]}`;
      const base = { display: c.toned, audio: c.ch, reveal, review: syllableReview(c) };
      if (part === "initial") {
        const wrong = closest(D.INITIALS.filter(Boolean), i, (x) => (INITIAL_PAIRS[i] === x ? 0 : 1));
        return makeQ({ ...base, prompt: "この音節の声母(はじめの子音)は?", correct: i, wrong });
      }
      if (part === "final") {
        const wrong = closest(D.FINALS, f, (x) => (FINAL_PAIRS[f] === x ? 0 : x[0] === f[0] ? 1 : 2));
        return makeQ({ ...base, prompt: "この音節の韻母(母音の部分)は?", correct: f, wrong });
      }
      return makeQ({ ...base, prompt: "この音節の声調は?", correct: TONE_NAMES[c.t], wrong: [1, 2, 3, 4].filter((x) => x !== c.t).map((x) => TONE_NAMES[x]) });
    }
    return toneQ();
  }

  function sandhiQuestions(n) {
    return shuffle(SANDHI_QUIZ)
      .slice(0, n)
      .map(([hz, written, actual, ...wrong]) =>
        makeQ({
          prompt: "実際にはどう発音する?",
          display: `${hz}(${written})`,
          audio: hz,
          correct: actual,
          wrong: wrong.filter((w) => w !== actual),
          reveal: `${hz} は ${actual} と発音します`,
          review: { label: actual, ch: hz },
        })
      );
  }

  // 同じ音声(字)が続けて出ないように n 問つくる
  function generate(n, gen) {
    const list = [];
    const seen = new Set();
    for (let tries = 0; list.length < n && tries < n * 30; tries++) {
      const q = gen();
      const key = (q.display || "") + (q.audio || "") + q.prompt;
      if (seen.has(key)) continue;
      seen.add(key);
      list.push(q);
    }
    return list;
  }

  function lessonQuestions(node) {
    if (node.kind === "about") return generate(5, partsQ);
    if (node.kind === "tones") return generate(5, () => toneQ(4));
    if (node.kind === "initials") return generate(5, () => initialQ(node.items));
    if (node.kind === "finals") return generate(5, () => finalQ(node.items));
    return sandhiQuestions(5);
  }

  // ---------- クイズ画面(レッスンの練習問題とテストで共通) ----------
  function runQuiz({ title, makeQuestions, onExit, onDone, nextLabel = null, onNext = null }) {
    const questions = makeQuestions();
    let idx = 0;
    let score = 0;
    const missed = [];

    const screen = UI.screen("screen--pq");
    const top = el("div", "pq-top");
    const close = UI.button("pq-close", "×", onExit);
    close.setAttribute("aria-label", "やめる");
    const bar = el("div", "pq-bar");
    const fill = el("div", "pq-bar-fill");
    bar.appendChild(fill);
    const count = el("div", "pq-count");
    top.appendChild(close);
    top.appendChild(bar);
    top.appendChild(count);
    screen.appendChild(top);
    const stage = el("div", "pq-stage");
    screen.appendChild(stage);
    const foot = el("div", "pq-foot");
    screen.appendChild(foot);

    function show() {
      clear(stage);
      clear(foot);
      const q = questions[idx];
      fill.style.width = `${(idx / questions.length) * 100}%`;
      count.textContent = `${idx + 1} / ${questions.length}`;
      stage.appendChild(el("div", "pq-prompt", q.prompt));
      if (q.display) stage.appendChild(el("div", "pq-display" + (q.display.length > 6 ? " pq-display--long" : ""), q.display));
      if (q.audio) {
        const row = el("div", "pq-audio");
        row.appendChild(UI.iconButton("pq-play", Icons.speaker, "もう一度聞く", () => say(q.audio)));
        row.appendChild(UI.iconButton("pq-slow", Icons.slow, "ゆっくり聞く", () => say(q.audio, true)));
        stage.appendChild(row);
        // 文字を見せる問題は答えのヒントにならないよう、音声は自動で流さない
        if (!q.display) setTimeout(() => say(q.audio), 250);
      }
      const long = q.options.some((o) => o.length > 7);
      const opts = el("div", "pq-options" + (long ? " pq-options--list" : ""));
      q.options.forEach((label, k) => opts.appendChild(UI.button("pq-opt", label, () => answer(k))));
      stage.appendChild(opts);

      function answer(k) {
        const ok = k === q.answer;
        opts.querySelectorAll(".pq-opt").forEach((b, j) => {
          b.disabled = true;
          if (j === q.answer) b.classList.add("is-correct");
          else if (j === k) b.classList.add("is-wrong");
        });
        if (ok) score++;
        else missed.push(q);
        const correctBtn = opts.querySelectorAll(".pq-opt")[q.answer];
        if (ok) {
          Motion.Sfx.correct();
          Motion.hop([correctBtn]);
          fill.style.width = `${((idx + 1) / questions.length) * 100}%`;
          setTimeout(() => Motion.sparkle(fill), 320);
        } else {
          Motion.Sfx.wrong();
          Motion.vibrate(80);
          Motion.shake(opts.querySelectorAll(".pq-opt")[k]);
        }
        const sheet = el("div", "pq-sheet " + (ok ? "is-good" : "is-bad"));
        sheet.appendChild(el("div", "pq-sheet-title", ok ? "正解!" : "おしい!"));
        sheet.appendChild(el("div", "pq-sheet-text", q.reveal));
        sheet.appendChild(
          UI.button("pq-continue", idx + 1 < questions.length ? "つづける" : "結果を見る", () => {
            idx++;
            if (idx < questions.length) show();
            else finish();
          })
        );
        foot.appendChild(sheet);
        if (q.audio) say(q.audio);
      }
    }

    function finish() {
      if (onDone) onDone(score, questions.length);
      AppState.addXp(score);
      AppState.markStudiedToday();
      const res = UI.screen("screen--sub screen--pq-result");
      res.appendChild(UI.subHeader(title, onExit));
      const body = el("div", "sub-body");
      const hero = el("div", "pq-result");
      const ratio = score / questions.length;
      hero.appendChild(el("div", "pq-result-emoji", ratio === 1 ? "🏆" : ratio >= 0.7 ? "🎉" : "💪"));
      const sc = el("div", "pq-result-score");
      sc.appendChild(el("strong", "", String(score)));
      sc.appendChild(document.createTextNode(` / ${questions.length}`));
      hero.appendChild(sc);
      hero.appendChild(
        el(
          "div",
          "pq-result-text",
          ratio === 1 ? "全問正解!完ぺきです" : ratio >= 0.7 ? "よくできました!この調子" : "くり返し聞くほど耳が慣れてきます"
        )
      );
      hero.appendChild(el("div", "pq-result-xp", `+${score} XP`));
      body.appendChild(hero);

      const actions = el("div", "pq-actions");
      if (onNext) actions.appendChild(UI.button("primary-btn", nextLabel, onNext));
      actions.appendChild(
        UI.button(onNext ? "secondary-btn" : "primary-btn", "もう一度", () =>
          runQuiz({ title, makeQuestions, onExit, onDone, nextLabel, onNext })
        )
      );
      actions.appendChild(UI.button("secondary-btn", "戻る", onExit));
      body.appendChild(actions);

      if (missed.length) {
        body.appendChild(el("div", "ui-section-title", "まちがえた問題"));
        const list = el("div", "pq-missed");
        missed.forEach((q) => {
          const row = UI.button("pq-missed-row", "", () => say(q.review.ch));
          row.appendChild(el("span", "pq-missed-py", q.review.label));
          row.appendChild(el("span", "pq-missed-ch", q.review.ch));
          const spk = el("span", "pq-missed-spk");
          spk.innerHTML = Icons.speaker;
          row.appendChild(spk);
          list.appendChild(row);
        });
        body.appendChild(list);
      }
      res.appendChild(body);
    }

    show();
  }

  // ---------- コースマップ ----------
  const TREE_SVG =
    '<svg viewBox="0 0 40 56" aria-hidden="true"><rect x="17" y="40" width="6" height="14" rx="2" fill="#9a6a3c"/><path d="M20 2 36 26H27L38 44H2L13 26H4z" fill="currentColor"/></svg>';
  const MOUNTAIN_SVG =
    '<svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0 160V96L60 40l46 42 52-62 70 76 44-34 58 50 70-58v100z" class="pymap-mt pymap-mt--far"/>' +
    '<path d="M0 160v-38l70-46 58 52 64-40 72 56 56-34 80 50v0z" class="pymap-mt pymap-mt--near"/>' +
    '<path d="M60 40l-14 13 10-2 6 6 6-6 8 1zM158 20l-15 18 11-3 5 7 6-7 10 2z" class="pymap-snow"/>' +
    "</svg>";

  function map() {
    const screen = UI.screen("screen--pymap");
    const head = el("div", "pymap-head");
    const back = UI.iconButton("pymap-back", Icons.prev, "戻る", () => Discover.home());
    head.appendChild(back);
    head.appendChild(el("div", "pymap-title", "ピンイン"));
    const done = doneSet();
    head.appendChild(el("div", "pymap-count", `${COURSE.filter((n) => done.has(n.id)).length} / ${COURSE.length}`));
    screen.appendChild(head);

    const actions = el("div", "pymap-actions");
    const chartBtn = UI.button("pymap-action", "", () => chart());
    chartBtn.appendChild(el("span", "pymap-action-icon pymap-action-icon--chart", "表"));
    chartBtn.appendChild(el("span", "", "ピンイン表"));
    const testBtn = UI.button("pymap-action", "", () => testHub());
    testBtn.appendChild(el("span", "pymap-action-icon pymap-action-icon--test", "✓"));
    testBtn.appendChild(el("span", "", "ピンインテスト"));
    actions.appendChild(chartBtn);
    actions.appendChild(testBtn);
    screen.appendChild(actions);

    const scene = el("div", "pymap-scene");
    const mts = el("div", "pymap-mountains");
    mts.innerHTML = MOUNTAIN_SVG;
    scene.appendChild(mts);
    [[12, 30, 1], [70, 64, 0.8], [40, 12, 0.6]].forEach(([x, y, s]) => {
      const cloud = el("div", "pymap-cloud");
      cloud.style.left = `${x}%`;
      cloud.style.top = `${y}px`;
      cloud.style.transform = `scale(${s})`;
      scene.appendChild(cloud);
    });

    const XS = [50, 74, 50, 26];
    const NODE_H = 132;
    const DISC = 88;
    const nextId = (COURSE.find((n) => !done.has(n.id)) || {}).id;
    let y = 170;
    let prev = null;
    COURSE.forEach((node, k) => {
      if (node.section) {
        const ribbon = el("div", "pymap-ribbon", node.section);
        ribbon.style.top = `${y}px`;
        scene.appendChild(ribbon);
        y += 84;
      }
      const x = XS[k % XS.length];
      const cy = y + DISC / 2;
      if (prev) {
        for (let d = 1; d <= 4; d++) {
          const t = d / 5;
          const dot = el("div", "pymap-dot");
          dot.style.left = `${prev.x + (x - prev.x) * t}%`;
          dot.style.top = `${prev.cy + (cy - prev.cy) * t}px`;
          scene.appendChild(dot);
        }
      }
      // 木はノードと反対側に
      const treeX = x > 50 ? 10 + (k % 3) * 4 : x < 50 ? 80 + (k % 2) * 6 : k % 2 ? 12 : 84;
      const tree = el("div", "pymap-tree" + (k % 3 === 0 ? " pymap-tree--small" : ""));
      tree.innerHTML = TREE_SVG;
      tree.style.left = `${treeX}%`;
      tree.style.top = `${y + 18}px`;
      scene.appendChild(tree);

      const btn = UI.button(`pymap-node pymap-node--${node.color}`, "", () => lesson(node));
      if (done.has(node.id)) btn.classList.add("is-done");
      if (node.id === nextId) btn.classList.add("is-next");
      btn.style.left = `${x}%`;
      btn.style.top = `${y}px`;
      const disc = el("div", "pymap-disc");
      disc.appendChild(board(node.board, "pymap-board"));
      if (done.has(node.id)) {
        const check = el("span", "pymap-check");
        check.innerHTML = Icons.check;
        disc.appendChild(check);
      }
      btn.appendChild(disc);
      if (node.id === nextId) btn.appendChild(el("span", "pymap-start", done.size ? "つづき" : "スタート"));
      btn.appendChild(el("span", "pymap-label", node.title));
      scene.appendChild(btn);
      prev = { x, cy };
      y += NODE_H;
    });
    scene.style.height = `${y + 40}px`;
    screen.appendChild(scene);

    const nextNode = screen.querySelector(".pymap-node.is-next");
    if (nextNode && done.size) setTimeout(() => nextNode.scrollIntoView({ block: "center" }), 0);
  }

  // ---------- レッスン ----------
  function lesson(node) {
    const screen = UI.screen("screen--sub screen--pylesson");
    screen.appendChild(UI.subHeader(node.title, map));
    const body = el("div", "sub-body");

    const hero = el("div", `pyl-hero pyl-hero--${node.color}`);
    hero.appendChild(board(node.board, "pymap-board pyl-hero-board"));
    hero.appendChild(el("div", "pyl-hero-lead", node.lead));
    body.appendChild(hero);

    if (node.kind === "about") aboutContent(body);
    else if (node.kind === "tones") tonesContent(body);
    else if (node.kind === "sandhi") sandhiContent(body);
    else {
      const tips = node.kind === "initials" ? INITIAL_TIPS : FINAL_TIPS;
      node.items.forEach((sym) => {
        const info = tips[sym];
        const card = el("div", "pyl-card");
        card.appendChild(el("div", "pyl-sym", sym));
        const right = el("div", "pyl-card-main");
        right.appendChild(el("div", "pyl-tip", info.tip));
        const chips = el("div", "py-chips");
        info.ex.map(fromCode).filter(Boolean).forEach((s) => chips.appendChild(sylChip(s)));
        right.appendChild(chips);
        card.appendChild(right);
        body.appendChild(card);
      });
      if (node.id === "ini4") body.appendChild(noteCard("j・q・x と ü", "j・q・x の後ろの u は、実は ü の音。ü の点を省いて ju・qu・xu と書きます(居 jū・去 qù・需 xū)。"));
      if (node.id === "ini5" || node.id === "ini6") body.appendChild(noteCard("zhi・chi・shi・ri・zi・ci・si の i", "この7つの i は「イ」ではなく、舌の形はそのままで声だけ出す「ウ」に近い音です。"));
    }

    const idx = COURSE.indexOf(node);
    const next = COURSE[idx + 1];
    const start = UI.button("primary-btn pyl-start", "練習問題にチャレンジ(5問)", () =>
      runQuiz({
        title: node.title,
        makeQuestions: () => lessonQuestions(node),
        onExit: map,
        onDone: () => markDone(node.id),
        nextLabel: next ? `次へ: ${next.title}` : "コースに戻る",
        onNext: () => (next ? lesson(next) : map()),
      })
    );
    const dock = el("div", "pyl-dock");
    dock.appendChild(start);
    body.appendChild(dock);
    screen.appendChild(body);
  }

  function noteCard(title, text) {
    const card = el("div", "tip-card");
    card.appendChild(el("div", "tip-card-title", title));
    card.appendChild(el("div", "tip-card-text", text));
    return card;
  }

  function aboutContent(body) {
    const anat = el("div", "pyl-anatomy");
    const word = el("div", "pyl-anatomy-word");
    [["m", "ini"], ["a", "fin"]].forEach(([t, cls]) => word.appendChild(el("span", `pyl-part pyl-part--${cls}`, t)));
    const toneMark = el("span", "pyl-part pyl-part--tone", "ˉ");
    word.appendChild(toneMark);
    anat.appendChild(word);
    const legend = el("div", "pyl-legend");
    [
      ["ini", "声母", "はじめの子音(21種類)"],
      ["fin", "韻母", "残りの母音の部分(36種類)"],
      ["tone", "声調", "音の高さの変化(4種類+軽声)"],
    ].forEach(([cls, name, desc]) => {
      const row = el("div", "pyl-legend-row");
      row.appendChild(el("span", `pyl-legend-tag pyl-part--${cls}`, name));
      row.appendChild(el("span", "", desc));
      legend.appendChild(row);
    });
    anat.appendChild(legend);
    const ex = syllable("ma", 1);
    anat.appendChild(sylChip(ex, { className: "py-chip py-chip--big" }));
    body.appendChild(anat);

    body.appendChild(noteCard("音節は約400種類", "中国語の音節(声母+韻母)は約400種類しかありません。これに4つの声調が組み合わさって、1,300ほどの音を区別します。ピンイン表で全部見られます。"));
    body.appendChild(noteCard("声調記号の付け方", "記号は母音の上に付けます。a があれば a、なければ e、ou なら o、それ以外は最後の母音(例: hǎo・xiè・duō・guì・liù)。"));
    body.appendChild(el("div", "ui-section-title", "聞いてみよう"));
    [["你好", "nǐ hǎo", "こんにちは"], ["谢谢", "xiè xie", "ありがとう"], ["中国", "Zhōng guó", "中国"]].forEach(([hanzi, pinyin, ja]) =>
      body.appendChild(UI.zhBlock({ hanzi, pinyin, ja, size: "md" }))
    );
  }

  function tonesContent(body) {
    PINYIN_TONES.forEach((t) => {
      const card = UI.button("tone-card", "", () => say(t.char));
      card.appendChild(el("div", "tone-card-mark", t.mark));
      const mid = el("div", "tone-card-mid");
      mid.appendChild(el("div", "tone-card-name", `${t.name}・${t.curve}`));
      mid.appendChild(el("div", "tone-card-tip", t.tip));
      mid.appendChild(el("div", "tone-card-ex", `例: ${t.char} ${t.pinyin}(${t.meaning})`));
      card.appendChild(mid);
      card.appendChild(toneCurve(t.tone));
      body.appendChild(card);
    });

    body.appendChild(el("div", "ui-section-title", "4つの声調を聞き比べ"));
    const sets = el("div", "pyl-toneset-list");
    ["ma", "ba", "yi", "wu", "tang", "da"].forEach((syl) => {
      const row = el("div", "pyl-toneset");
      const all = D.tonesOf(syl).map((x) => syllable(syl, x.tone));
      const play = UI.iconButton("pyl-toneset-play", Icons.play, `${syl} を4つ続けて聞く`, () => playSequence(all, Array.from(chips.children)));
      row.appendChild(play);
      const chips = el("div", "py-chips");
      all.forEach((s) => chips.appendChild(sylChip(s)));
      row.appendChild(chips);
      sets.appendChild(row);
    });
    body.appendChild(sets);
  }

  // 声調を順番に読み上げ、読んでいるチップを光らせる
  let seqToken = 0;
  async function playSequence(list, chips) {
    const token = ++seqToken;
    for (let k = 0; k < list.length; k++) {
      if (token !== seqToken) return;
      chips.forEach((c, j) => c.classList.toggle("is-playing", j === k));
      await say(list[k].ch);
      await new Promise((r) => setTimeout(r, 180));
    }
    if (token === seqToken) chips.forEach((c) => c.classList.remove("is-playing"));
  }

  function sandhiContent(body) {
    SANDHI_RULES.forEach((rule) => {
      const card = el("div", "pyl-rule");
      card.appendChild(el("div", "tip-card-title", rule.title));
      card.appendChild(el("div", "tip-card-text", rule.text));
      const list = el("div", "pyl-rule-list");
      rule.ex.forEach(([hz, written, actual]) => {
        const row = UI.button("pyl-rule-ex", "", () => say(hz));
        row.appendChild(el("span", "pyl-rule-hz", hz));
        row.appendChild(el("span", "pyl-rule-py", written));
        if (actual) {
          row.appendChild(el("span", "pyl-rule-arrow", "→"));
          row.appendChild(el("span", "pyl-rule-actual", actual));
        }
        const spk = el("span", "pyl-rule-spk");
        spk.innerHTML = Icons.speaker;
        row.appendChild(spk);
        list.appendChild(row);
      });
      card.appendChild(list);
      body.appendChild(card);
    });
  }

  // ---------- ピンイン表 ----------
  function chart(tone = AppState.getPref("pinyinChartTone", 1)) {
    const screen = UI.screen("screen--sub screen--pychart");
    screen.appendChild(UI.subHeader("ピンイン表", map));

    const bar = el("div", "pyc-tones");
    [1, 2, 3, 4, 0].forEach((t) => {
      const b = UI.button("pyc-tone" + (t === tone ? " is-on" : ""), t ? TONE_GLYPHS[t] : "全部", () => {
        AppState.setPref("pinyinChartTone", t);
        chart(t);
      });
      b.setAttribute("aria-label", t ? TONE_NAMES[t] : "すべての声調");
      bar.appendChild(b);
    });
    screen.appendChild(bar);

    const wrap = el("div", "pyc-wrap");
    const table = el("table", "pyc-table");
    const thead = el("thead");
    const hr = el("tr");
    hr.appendChild(el("th", "pyc-corner", "声母\\韻母"));
    D.FINALS.forEach((f) => hr.appendChild(el("th", "pyc-col", f)));
    thead.appendChild(hr);
    table.appendChild(thead);
    const tbody = el("tbody");
    let selected = null;
    D.INITIALS.forEach((i) => {
      const tr = el("tr");
      tr.appendChild(el("th", "pyc-row", i || "-"));
      D.FINALS.forEach((f) => {
        const td = el("td");
        if (valid(i, f)) {
          const syl = D.written(i, f);
          const s = tone ? syllable(syl, tone, i, f) : null;
          const label = tone ? (s ? s.toned : syl) : syl;
          const cell = UI.button("pyc-cell" + (tone && !s ? " is-none" : ""), label, () => {
            if (selected) selected.classList.remove("is-sel");
            selected = cell;
            cell.classList.add("is-sel");
            showDetail(i, f, tone);
          });
          td.appendChild(cell);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    screen.appendChild(wrap);

    const panel = el("div", "pyc-panel");
    panel.appendChild(el("div", "pyc-panel-hint", tone ? "マスをタップすると発音が聞けます" : "マスをタップすると4つの声調を続けて読みます"));
    screen.appendChild(panel);

    function showDetail(i, f, t) {
      const syl = D.written(i, f);
      clear(panel);
      const headRow = el("div", "pyc-panel-head");
      headRow.appendChild(el("div", "pyc-panel-syl", syl));
      headRow.appendChild(el("div", "pyc-panel-parts", i ? `声母 ${i} + 韻母 ${f}` : `韻母 ${f}(声母なし)`));
      panel.appendChild(headRow);
      const all = [1, 2, 3, 4].map((x) => syllable(syl, x, i, f));
      const chips = el("div", "py-chips pyc-panel-chips");
      all.forEach((s, k) => {
        if (s) chips.appendChild(sylChip(s));
        else chips.appendChild(el("span", "py-chip py-chip--none", D.markTone(syl, k + 1)));
      });
      panel.appendChild(chips);
      if (t) {
        const s = all[t - 1];
        if (s) {
          chips.children[t - 1].classList.add("is-playing");
          say(s.ch);
        }
      } else {
        const liveChips = Array.from(chips.children).filter((c) => !c.classList.contains("py-chip--none"));
        playSequence(all.filter(Boolean), liveChips);
      }
    }
  }

  // ---------- ピンインテスト ----------
  const TESTS = [
    { id: "tone", title: "声調テスト", desc: "同じ音の4つの声調を聞き分ける", icon: "ā", color: "pink", n: 10, gen: () => toneQ(3) },
    { id: "initial", title: "声母テスト", desc: "b / p、zh / z など似た子音を聞き分ける", icon: "b", color: "blue", n: 10, gen: () => initialQ() },
    { id: "final", title: "韻母テスト", desc: "-n / -ng など似た母音を聞き分ける", icon: "an", color: "green", n: 10, gen: () => finalQ() },
    { id: "all", title: "総合テスト", desc: "声調・声母・韻母をまとめて実力チェック", icon: "拼", color: "orange", n: 20, gen: () => pick([() => toneQ(3), initialQ, finalQ, syllableQ, syllableQ])() },
  ];

  function testHub() {
    const screen = UI.screen("screen--sub screen--pytest");
    screen.appendChild(UI.subHeader("ピンインテスト", map));
    const body = el("div", "sub-body");

    const banner = el("div", "pyt-banner");
    ["ā", "ǒ", "ü", "ì", "é"].forEach((ch, k) => banner.appendChild(el("span", `pyt-float pyt-float--${k}`, ch)));
    banner.appendChild(el("div", "pyt-banner-zh", "拼音测试"));
    banner.appendChild(el("div", "pyt-banner-en", "Pinyin Test"));
    banner.appendChild(el("div", "pyt-banner-sub", "音声を聞いて、正しいピンインを選ぼう"));
    body.appendChild(banner);

    const best = AppState.getPref("pinyinTestBest", {});
    TESTS.forEach((test) => {
      const card = UI.button("pyt-card", "", () =>
        runQuiz({
          title: test.title,
          makeQuestions: () => generate(test.n, test.gen),
          onExit: testHub,
          onDone: (score) => {
            const b = AppState.getPref("pinyinTestBest", {});
            if (!(b[test.id] >= score)) {
              b[test.id] = score;
              AppState.setPref("pinyinTestBest", b);
            }
          },
        })
      );
      card.appendChild(el("span", `pyt-card-icon pyt-card-icon--${test.color}`, test.icon));
      const mid = el("span", "pyt-card-main");
      mid.appendChild(el("span", "pyt-card-title", test.title));
      mid.appendChild(el("span", "pyt-card-desc", test.desc));
      const meta = el("span", "pyt-card-meta");
      meta.appendChild(el("span", "pyt-pill", `${test.n}問`));
      if (test.id in best) meta.appendChild(el("span", "pyt-pill pyt-pill--best", `ベスト ${best[test.id]} / ${test.n}`));
      mid.appendChild(meta);
      card.appendChild(mid);
      card.appendChild(el("span", "pyt-card-arrow", "›"));
      body.appendChild(card);
    });
    body.appendChild(el("p", "sub-note", "音声はお使いの端末の中国語音声で再生されます。聞き取りにくいときはカメのボタンでゆっくり再生できます。"));
    screen.appendChild(body);
  }

  return { map, chart, testHub, lesson, COURSE, _gen: { toneQ, initialQ, finalQ, syllableQ, partsQ, sandhiQuestions, fromCode, INITIAL_TIPS, FINAL_TIPS } };
})();

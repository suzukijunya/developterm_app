// 社内トレカの「入力フォーマット」定義。
// 1枚のカード = 1つの JSON オブジェクト。ここにある項目を埋めれば card_renderer.js が画像を描く。
// まとめて作るときは表(Excel / CSV)の1行 = 1枚。列の定義は TABLE_COLUMNS。
// 項目の説明は FORMAT.md を参照。

const CardFormat = (() => {
  const VERSION = 1;

  // カード種類 → 枠の色・モンスターかどうか・種族行に入る能力
  const CARD_TYPES = {
    normal: { label: "通常モンスター", frame: "#d2ad52", monster: true, ability: "" },
    effect: { label: "効果モンスター", frame: "#c8834e", monster: true, ability: "効果" },
    ritual: { label: "儀式モンスター", frame: "#6d8fc6", monster: true, ability: "儀式／効果" },
    fusion: { label: "融合モンスター", frame: "#8d6aae", monster: true, ability: "融合／効果" },
    synchro: { label: "シンクロモンスター", frame: "#e4e4e4", monster: true, ability: "シンクロ／効果" },
    xyz: { label: "エクシーズモンスター", frame: "#2f2d2d", monster: true, ability: "エクシーズ／効果", dark: true },
    spell: { label: "魔法カード", frame: "#1f8a7e", monster: false },
    trap: { label: "罠カード", frame: "#a8447c", monster: false },
  };

  // 魔法・罠の種類(【魔法カード】の横のアイコン)
  const SPELL_TYPES = ["通常", "永続", "装備", "速攻", "フィールド", "儀式"];
  const TRAP_TYPES = ["通常", "永続", "カウンター"];

  // 属性(右上の丸いマーク)
  const ATTRIBUTES = {
    光: { color: "#b8741a", ruby: "ひかり", label: "光" },
    闇: { color: "#5b2f86", ruby: "やみ", label: "闇" },
    炎: { color: "#c52a1c", ruby: "ほのお", label: "炎" },
    水: { color: "#1f63b8", ruby: "みず", label: "水" },
    風: { color: "#2f8a3c", ruby: "かぜ", label: "風" },
    地: { color: "#6e4a26", ruby: "ち", label: "地" },
    神: { color: "#a88418", ruby: "かみ", label: "神" },
    魔: { color: "#13806f", ruby: "まほう", label: "魔" },
    罠: { color: "#a3336e", ruby: "トラップ", label: "罠" },
    custom: { color: "#c6352a", ruby: "", label: "カスタム(文字・画像)" },
  };

  // イラストに重ねる光のエフェクト
  const ART_EFFECTS = {
    none: { label: "なし" },
    gold: { label: "黄金の光", color: "#ffc54d" },
    purple: { label: "紫の魔力", color: "#b36bff" },
    blue: { label: "蒼い光", color: "#5ab4ff" },
    red: { label: "紅蓮の炎", color: "#ff6a3d" },
    green: { label: "翠の風", color: "#6dff9a" },
  };

  const NAME_COLORS = {
    gold: { label: "金" },
    white: { label: "白" },
    black: { label: "黒" },
  };

  function uid() {
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function createDefault() {
    return {
      formatVersion: VERSION,
      id: uid(),
      cardType: "effect",
      subtype: "通常",
      name: "",
      attribute: "光",
      customAttribute: { text: "", color: "#c6352a", image: null },
      level: 4,
      tribe: "",
      abilities: "",
      effect: "",
      atk: "1800",
      def: "1200",
      cardCode: "WB-001",
      copyright: "©" + new Date().getFullYear() + " WB ARGO",
      frameColor: "",
      nameColor: "gold",
      art: { image: null, zoom: 1, x: 0, y: 0, effect: "gold", intensity: 0.7 },
      // 元ネタ(AIが文面を考えるための情報。カードには印刷されない)
      member: { realName: "", department: "", role: "", skills: "", personality: "", episode: "", related: "", tone: "かっこよく" },
      // 表から読み込んだとき空欄だった項目。「AIで空欄を埋める」でここだけ作る。
      autoFields: [],
    };
  }

  function str(v, fallback = "") {
    return v === undefined || v === null ? fallback : String(v);
  }

  function num(v, fallback, min, max) {
    const n = Number(v);
    if (!isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  // 外部から来た JSON(手入力・AIの回答・インポート)を安全な形にそろえる
  function normalize(input) {
    const d = createDefault();
    const src = input && typeof input === "object" ? input : {};
    const art = Object.assign({}, d.art, src.art || {});
    const custom = Object.assign({}, d.customAttribute, src.customAttribute || {});
    const member = Object.assign({}, d.member, src.member || {});
    Object.keys(member).forEach((k) => (member[k] = str(member[k])));
    const cardType = CARD_TYPES[src.cardType] ? src.cardType : d.cardType;
    const subtypes = cardType === "spell" ? SPELL_TYPES : cardType === "trap" ? TRAP_TYPES : ["通常"];
    return {
      formatVersion: VERSION,
      id: str(src.id) || d.id,
      cardType,
      subtype: subtypes.includes(src.subtype) ? src.subtype : "通常",
      name: str(src.name),
      attribute: ATTRIBUTES[src.attribute] ? src.attribute : d.attribute,
      customAttribute: { text: str(custom.text).slice(0, 2), color: str(custom.color, d.customAttribute.color), image: custom.image || null },
      level: Math.round(num(src.level, d.level, 0, 12)),
      tribe: str(src.tribe),
      abilities: str(src.abilities),
      effect: str(src.effect),
      atk: str(src.atk, d.atk),
      def: str(src.def, d.def),
      cardCode: str(src.cardCode, d.cardCode),
      copyright: str(src.copyright, d.copyright),
      frameColor: /^#[0-9a-f]{6}$/i.test(str(src.frameColor)) ? src.frameColor : "",
      nameColor: NAME_COLORS[src.nameColor] ? src.nameColor : d.nameColor,
      art: {
        image: art.image || null,
        zoom: num(art.zoom, 1, 0.5, 4),
        x: num(art.x, 0, -1, 1),
        y: num(art.y, 0, -1, 1),
        effect: ART_EFFECTS[art.effect] ? art.effect : d.art.effect,
        intensity: num(art.intensity, d.art.intensity, 0, 1),
        fileName: str(art.fileName),
      },
      member,
      autoFields: Array.isArray(src.autoFields) ? src.autoFields.filter((f) => AI_FIELDS.includes(f)) : [],
    };
  }

  function isMonster(card) {
    return CARD_TYPES[card.cardType].monster;
  }

  function subtypesFor(cardType) {
    return cardType === "spell" ? SPELL_TYPES : cardType === "trap" ? TRAP_TYPES : [];
  }

  // 「魔法カード(速攻)」のような表示名
  function typeLabel(card) {
    const t = CARD_TYPES[card.cardType];
    if (t.monster) return t.label;
    return card.subtype && card.subtype !== "通常" ? `${card.subtype}${t.label.replace("カード", "")}` : t.label;
  }

  // 種族行「【CFO族／効果】」
  function typeLine(card) {
    const t = CARD_TYPES[card.cardType];
    if (!t.monster) return "";
    const abilities = card.abilities.trim() || t.ability;
    const parts = [card.tribe.trim() || "戦士族"];
    if (abilities) parts.push(abilities);
    return "【" + parts.join("／") + "】";
  }

  // ---------------------------------------------------------------
  // AI 用:元ネタ → カード文面
  // ---------------------------------------------------------------

  // AI に考えてもらえる項目
  const AI_FIELDS = ["name", "attribute", "level", "tribe", "effect", "atk", "def"];
  const MONSTER_ONLY_FIELDS = ["attribute", "level", "tribe", "atk", "def"];

  const AI_SCHEMA = {
    type: "object",
    properties: {
      name: { type: "string" },
      attribute: { type: "string", enum: ["光", "闇", "炎", "水", "風", "地", "神"] },
      level: { type: "integer" },
      tribe: { type: "string" },
      effect: { type: "string" },
      atk: { type: "integer" },
      def: { type: "integer" },
      artEffect: { type: "string", enum: ["gold", "purple", "blue", "red", "green"] },
    },
    required: ["name", "attribute", "level", "tribe", "effect", "atk", "def", "artEffect"],
    additionalProperties: false,
  };

  const AI_RULES = `あなたは会社「ウィーブレイン」の社内イベント用トレーディングカードの文面を作るライターです。
遊戯王OCG風のパロディカードとして、渡された元ネタから1枚分のカードデータを作ってください。

共通のルール:
- 指定されたカード種類に合った文面にする。
- 「決まっている項目」があれば、その値はそのまま返し、ほかの項目をそれに合わせて作る。
- 社内の人・モノ・出来事・案件名は「」で囲む。「世界観メモ」にある用語を積極的に使い、他のカードと効果がつながるようにする。
- 誰かを傷つける・差別的・過度に下品な表現は避け、本人や社員が笑って受け取れる内容にする。
- effect: 遊戯王のテキストの言い回し(「〜できる。」「1ターンに1度、〜」「①：〜」)で書く。
  - 効果が複数ある場合は「①：」「②：」で始めて改行で区切る。
  - 全体で120文字前後、長くても180文字以内。
- artEffect: イラストに重ねる光の色。雰囲気に合うものを選ぶ。

モンスターカードのとき:
- name: 仕事内容や特徴を表す漢字の二つ名 + 呼び名(カタカナ)。例「財務統括魔導士スズキ」「税務幻術師ヨナハ」「海外転売仙人キョウ」。14文字以内。
- tribe: 役割を表す「〇〇族」。例「CFO族」「商人族」「悪魔族」。
- attribute: 人柄や職種のイメージに合う属性を1つ。
- level: 社歴・役職の重さを1〜12で。atk/def は 0〜5000 の100刻み(攻めの強さ=ATK、守りの堅さ=DEF)。
- 融合・儀式・シンクロ・エクシーズの場合は、effect の1行目に素材を書く(例「「スズキ」＋「ヨナハ」」)。

魔法カードのとき:
- name: 社内用語・出来事・決め台詞そのもの、または少しもじった名前(例「法務確認」「月末締め」「全社会議」)。12文字以内。
- effect: 魔法らしい効果にする(「デッキから〜を手札に加える」「自分フィールドの〜の攻撃力は〜アップする」など)。種類ごとの決まり文句:
  - 永続: 「このカードが魔法＆罠ゾーンに存在する限り、〜」
  - 装備: 「〜モンスターにのみ装備可能。装備モンスターの攻撃力は〜」
  - 速攻: 相手ターンでも使える即効性のある効果
  - フィールド: 「フィールドの〜族モンスターの攻撃力は〜」のような場全体の効果
  - 儀式: 「儀式モンスター「〜」の降臨に必要。」から始める
- attribute は "光"、level は 0、tribe は ""、atk と def は 0 を返す(使わない)。

罠カードのとき:
- name: 魔法カードと同じ考え方。相手の行動を止める・跳ね返すイメージの言葉が合う(例「リターン請求」「差し戻し」)。
- effect: 「相手が〜した時に発動できる。」のように相手の行動に反応する効果にする。
  - 永続: 「このカードが魔法＆罠ゾーンに存在する限り、〜」
  - カウンター: 「〜の発動を無効にし破壊する。」
- attribute は "光"、level は 0、tribe は ""、atk と def は 0 を返す(使わない)。`;

  function memberText(card) {
    const m = card.member;
    return [
      ["元ネタ", m.realName],
      ["部署", m.department],
      ["役職・担当", m.role],
      ["特徴・得意なこと", m.skills],
      ["口癖・名ゼリフ", m.personality],
      ["エピソード", m.episode],
      ["一緒に登場させたい人・モノ", m.related],
      ["カードの雰囲気", m.tone],
    ]
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `- ${k}: ${v.trim()}`)
      .join("\n");
  }

  // keep: 決まっている(AIに変えてほしくない)項目
  function fixedText(card, keep) {
    const monster = isMonster(card);
    const labels = { name: "カード名", attribute: "属性", level: "レベル", tribe: "種族", effect: "効果", atk: "ATK", def: "DEF" };
    return keep
      .filter((f) => monster || !MONSTER_ONLY_FIELDS.includes(f))
      .map((f) => [f, String(card[f] === undefined ? "" : card[f]).trim()])
      .filter(([, v]) => v)
      .map(([f, v]) => `- ${labels[f]}(${f}): ${v.replace(/\n/g, " / ")}`)
      .join("\n");
  }

  function requestText(card, opts = {}) {
    const parts = [`次のカードを作ってください。\n\n- カード種類: ${typeLabel(card)}\n${memberText(card)}`];
    const fixed = fixedText(card, opts.keep || []);
    if (fixed) parts.push(`決まっている項目(この値のまま返す):\n${fixed}`);
    if (opts.extra && opts.extra.trim()) parts.push(`追加の要望: ${opts.extra.trim()}`);
    if (opts.world && opts.world.trim()) parts.push(`世界観メモ(ウィーブレインの社内用語・人物・出来事):\n${opts.world.trim()}`);
    return parts.join("\n\n");
  }

  // opts: { extra, world, keep: [変えない項目] }
  function buildAiRequest(card, opts) {
    return { system: AI_RULES, user: requestText(card, opts), schema: AI_SCHEMA };
  }

  // APIキーがなくても ChatGPT / Claude のチャットに貼って使えるプロンプト
  function buildCopyPrompt(card, opts) {
    const example = isMonster(card)
      ? {
          name: "財務統括魔導士スズキ",
          attribute: "光",
          level: 6,
          tribe: "CFO族",
          effect: "このカードがフィールドに存在する限り、相手の「グレー金融」の効果は無効化される。\n①：1ターンに1度、相手が「リターン請求」を発動した時に発動できる。デッキから「法務確認」1枚を手札に加える。",
          atk: 2400,
          def: 2100,
          artEffect: "gold",
        }
      : {
          name: "法務確認",
          attribute: "光",
          level: 0,
          tribe: "",
          effect: "①：相手が「グレー金融」「曖昧契約」を発動した時に発動できる。その発動を無効にし、自分はデッキから1枚ドローする。",
          atk: 0,
          def: 0,
          artEffect: "blue",
        };
    return `${AI_RULES}

${requestText(card, opts)}

回答は次の形式の JSON だけを、コードブロックなしで返してください。
${JSON.stringify(example, null, 2)}`;
  }

  // AI の回答(JSON)をカードに反映する。only を渡すとその項目だけ反映する。
  function applyAiResult(card, result, only) {
    const r = typeof result === "string" ? parseLooseJson(result) : result;
    const next = normalize(card);
    const use = (f) => !only || only.includes(f);
    const monster = isMonster(next);
    if (use("name") && r.name) next.name = str(r.name);
    if (use("effect") && r.effect) next.effect = str(r.effect);
    if (monster) {
      if (use("attribute") && ATTRIBUTES[r.attribute]) next.attribute = r.attribute;
      if (use("level") && r.level !== undefined) next.level = Math.round(num(r.level, next.level, 1, 12));
      if (use("tribe") && r.tribe) next.tribe = str(r.tribe);
      if (use("atk") && r.atk !== undefined) next.atk = str(r.atk);
      if (use("def") && r.def !== undefined) next.def = str(r.def);
    }
    if (ART_EFFECTS[r.artEffect] && (!only || next.autoFields.length)) next.art.effect = r.artEffect;
    next.autoFields = only ? next.autoFields.filter((f) => !only.includes(f)) : [];
    return next;
  }

  // ```json ... ``` や前後の文章が付いていても JSON 部分を取り出す
  function parseLooseJson(text) {
    const s = String(text);
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("JSON が見つかりませんでした。");
    return JSON.parse(s.slice(start, end + 1));
  }

  // ---------------------------------------------------------------
  // 表(Excel / CSV / 貼り付け)⇔ カード
  // 1行 = 1枚。1行目は見出し。列の順番は自由(見出しの名前で判定)。
  // ---------------------------------------------------------------

  const TONES = ["かっこよく", "面白く", "かわいく", "渋く"];
  const TYPE_WORDS = {
    normal: ["通常モンスター"],
    effect: ["効果モンスター", "効果", "モンスター", ""],
    ritual: ["儀式モンスター"],
    fusion: ["融合モンスター", "融合"],
    synchro: ["シンクロモンスター", "シンクロ"],
    xyz: ["エクシーズモンスター", "エクシーズ"],
    spell: ["魔法カード", "魔法"],
    trap: ["罠カード", "罠", "トラップ", "トラップカード"],
  };

  // ai: 空欄なら AI に作ってもらう項目
  const TABLE_COLUMNS = [
    { key: "cardType", label: "カード種類", required: true, options: ["効果モンスター", "通常モンスター", "融合モンスター", "儀式モンスター", "シンクロモンスター", "エクシーズモンスター", "魔法カード", "罠カード"], help: "モンスターか魔法か罠か" },
    { key: "subtype", label: "魔法・罠の種類", options: ["通常", "永続", "装備", "速攻", "フィールド", "儀式", "カウンター"], help: "魔法: 通常/永続/装備/速攻/フィールド/儀式、罠: 通常/永続/カウンター。空欄なら通常" },
    { key: "name", label: "カード名", ai: true, help: "モンスターは「二つ名＋呼び名」、魔法・罠は社内用語や出来事" },
    { key: "member.realName", label: "元ネタ", required: true, help: "モデルになる人の名前、社内用語、出来事、商品など" },
    { key: "member.department", label: "部署", help: "人がモデルのとき" },
    { key: "member.role", label: "役職・担当", help: "人がモデルのとき" },
    { key: "member.skills", label: "特徴・得意なこと", help: "仕事ぶり、強み、どんなモノ・出来事か" },
    { key: "member.personality", label: "口癖・名ゼリフ", help: "効果テキストのネタになる" },
    { key: "member.episode", label: "エピソード", help: "社内で有名な話、事件、評判" },
    { key: "member.related", label: "一緒に登場させたい人・モノ", help: "効果に出したい同僚・案件・他のカード名" },
    { key: "member.tone", label: "雰囲気", options: TONES, help: "空欄なら「かっこよく」" },
    { key: "attribute", label: "属性", ai: true, monster: true, options: ["光", "闇", "炎", "水", "風", "地", "神"], help: "モンスターのみ" },
    { key: "level", label: "レベル", ai: true, monster: true, help: "モンスターのみ。1〜12" },
    { key: "tribe", label: "種族", ai: true, monster: true, help: "モンスターのみ。例: CFO族" },
    { key: "effect", label: "効果テキスト", ai: true, help: "改行はセル内改行(Alt+Enter)か \\n" },
    { key: "atk", label: "ATK", ai: true, monster: true, help: "モンスターのみ。0〜5000" },
    { key: "def", label: "DEF", ai: true, monster: true, help: "モンスターのみ。0〜5000" },
    { key: "cardCode", label: "カードコード", help: "空欄なら WB-001 から連番" },
    { key: "art.file", label: "イラスト画像ファイル名", help: "例: suzuki.png(画像は読み込み時に一緒に選ぶ)" },
    { key: "art.effect", label: "イラストの光", options: Object.values(ART_EFFECTS).map((e) => e.label), help: "空欄なら黄金の光" },
    { key: "note", label: "メモ", help: "自由記入(カードには使わない)" },
  ];

  function normHeader(h) {
    return String(h || "")
      .replace(/[\s　]/g, "")
      .replace(/[（(][^）)]*[）)]/g, "")
      .replace(/[*＊※]/g, "");
  }

  // 「速攻魔法」「カウンター罠」のように種類ごと書かれていても読めるようにする → { type, subtype }
  function pickType(v) {
    const w = String(v || "").trim().replace(/\s/g, "");
    if (CARD_TYPES[w]) return { type: w, subtype: "" };
    const hit = Object.keys(TYPE_WORDS).find((k) => TYPE_WORDS[k].includes(w));
    if (hit) return { type: hit, subtype: "" };
    const m = w.match(/^(.+?)(魔法|罠|トラップ)(カード)?$/);
    if (m) return { type: m[2] === "魔法" ? "spell" : "trap", subtype: m[1] };
    return null;
  }

  // 区切り文字(タブ or カンマ)を自動判定して2次元配列に。"" で囲んだセル内の改行・カンマに対応。
  function parseDelimited(text) {
    const src = String(text).replace(/^﻿/, "").replace(/\r\n?/g, "\n");
    const firstLine = src.split("\n", 1)[0];
    const delim = (firstLine.match(/\t/g) || []).length >= (firstLine.match(/,/g) || []).length ? "\t" : ",";
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (quoted) {
        if (ch === '"' && src[i + 1] === '"') {
          cell += '"';
          i++;
        } else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"' && cell === "") quoted = true;
      else if (ch === delim) {
        row.push(cell);
        cell = "";
      } else if (ch === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else cell += ch;
    }
    if (cell || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows.filter((r) => r.some((c) => String(c).trim()));
  }

  // rows: [[見出し...], [値...], ...] → { cards, warnings }
  // startNo: カードコード自動連番の開始番号
  function rowsToCards(rows, startNo = 1) {
    const warnings = [];
    if (!rows.length) return { cards: [], warnings: ["表が空です。"] };
    const headers = rows[0].map(normHeader);
    const colIndex = {};
    TABLE_COLUMNS.forEach((c) => {
      const i = headers.findIndex((h) => h === normHeader(c.label) || h === c.key);
      if (i >= 0) colIndex[c.key] = i;
    });
    if (colIndex.cardType === undefined && colIndex["member.realName"] === undefined) {
      return { cards: [], warnings: ["1行目に見出し(「カード種類」「元ネタ」など)が見つかりません。テンプレートの見出し行ごと貼り付けてください。"] };
    }
    const cards = [];
    let no = startNo;
    rows.slice(1).forEach((r, idx) => {
      const rowNo = idx + 2;
      const get = (key) => (colIndex[key] === undefined ? "" : String(r[colIndex[key]] === undefined ? "" : r[colIndex[key]]).trim());
      if (TABLE_COLUMNS.every((c) => !get(c.key) || c.key === "note")) return;

      const c = createDefault();
      const picked = pickType(get("cardType"));
      if (!picked) warnings.push(`${rowNo}行目: カード種類「${get("cardType")}」がわからないので効果モンスターにしました。`);
      c.cardType = picked ? picked.type : "effect";
      const sub = (get("subtype") || (picked ? picked.subtype : "")).replace(/(魔法|罠|カード)/g, "");
      const subs = subtypesFor(c.cardType);
      if (subs.length) {
        if (sub && !subs.includes(sub)) warnings.push(`${rowNo}行目: 「${get("subtype")}」は${CARD_TYPES[c.cardType].label}の種類にないので通常にしました。`);
        c.subtype = subs.includes(sub) ? sub : "通常";
      }
      const monster = CARD_TYPES[c.cardType].monster;
      if (!monster) {
        c.attribute = c.cardType === "spell" ? "魔" : "罠";
        c.art.effect = c.cardType === "spell" ? "blue" : "purple";
      }

      ["realName", "department", "role", "skills", "personality", "episode", "related"].forEach((k) => (c.member[k] = get("member." + k)));
      const tone = get("member.tone");
      if (tone) c.member.tone = tone;
      if (!c.member.realName && !get("name")) warnings.push(`${rowNo}行目: 「元ネタ」も「カード名」も空です。`);

      c.name = get("name");
      c.effect = get("effect").replace(/\\n/g, "\n");
      if (monster) {
        const attr = get("attribute");
        if (attr && ATTRIBUTES[attr]) c.attribute = attr;
        else if (attr) warnings.push(`${rowNo}行目: 属性「${attr}」がわからないので空欄扱いにしました。`);
        const lv = get("level");
        if (lv) c.level = Math.round(num(lv.replace(/[^0-9]/g, ""), c.level, 0, 12));
        c.tribe = get("tribe");
        c.atk = get("atk") || "?";
        c.def = get("def") || "?";
      }
      c.autoFields = AI_FIELDS.filter((f) => (monster || !MONSTER_ONLY_FIELDS.includes(f)) && !get(f));
      if (monster && get("attribute") && !ATTRIBUTES[get("attribute")]) c.autoFields.push("attribute");

      c.cardCode = get("cardCode") || "WB-" + String(no).padStart(3, "0");
      no++;
      const fx = get("art.effect");
      const fxKey = Object.keys(ART_EFFECTS).find((k) => ART_EFFECTS[k].label === fx || k === fx);
      if (fxKey) c.art.effect = fxKey;
      c.art.fileName = get("art.file");
      cards.push(c);
    });
    if (!cards.length && !warnings.length) warnings.push("カードの行が見つかりませんでした。");
    return { cards, warnings };
  }

  // カード → 表(書き出し用)
  function cardsToRows(cards) {
    const typeWord = (c) => CARD_TYPES[c.cardType].label;
    const rows = [TABLE_COLUMNS.map((c) => c.label)];
    cards.forEach((card) => {
      const monster = isMonster(card);
      rows.push(
        TABLE_COLUMNS.map((col) => {
          switch (col.key) {
            case "cardType":
              return typeWord(card);
            case "subtype":
              return monster ? "" : card.subtype;
            case "art.file":
              return card.art.fileName || "";
            case "art.effect":
              return ART_EFFECTS[card.art.effect].label;
            case "note":
              return "";
            default: {
              if (col.monster && !monster) return "";
              if (card.autoFields.includes(col.key)) return "";
              const v = col.key.split(".").reduce((o, k) => (o ? o[k] : ""), card);
              return v === undefined || v === null ? "" : String(v);
            }
          }
        })
      );
    });
    return rows;
  }

  function toCsv(rows) {
    const esc = (v) => (/[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);
    return "﻿" + rows.map((r) => r.map((v) => esc(String(v))).join(",")).join("\r\n");
  }

  // 表の空欄をチャットAIに埋めてもらうプロンプト(このあとに表を貼る)
  function buildTablePrompt(world) {
    const cols = TABLE_COLUMNS.map((c) => `- ${c.label}: ${c.help}${c.options ? `(選択肢: ${c.options.join(" / ")})` : ""}${c.ai ? " ※空欄ならあなたが考える" : ""}`).join("\n");
    return `${AI_RULES}

これから貼る表は、1行が1枚のカードです。列の意味は次のとおりです。
${cols}

お願い:
- 「※空欄ならあなたが考える」の列が空欄のセルを、元ネタや他の列の内容から考えて埋めてください。
- すでに書かれているセルは変えないでください。
- モンスター以外の行は、属性・レベル・種族・ATK・DEF を空欄のままにしてください。
- 回答は、見出し行を含む表全体をタブ区切りのテキストで、コードブロックに入れて返してください。列の順番は変えないでください。
- 効果テキストの改行は「\\n」と書いてください(セルの中で本当に改行しない)。
${world && world.trim() ? `\n世界観メモ(ウィーブレインの社内用語・人物・出来事):\n${world.trim()}\n` : ""}
表:
`;
  }

  // ---------------------------------------------------------------
  // 画像生成AI 用:本人写真 → カードのイラスト部分
  // 文字は画像生成AIに描かせず(文字化けするため)、枠と文字はこのツールが描く。
  // ---------------------------------------------------------------

  const ART_STYLES = {
    painterly: { label: "リアル(ファンタジー油彩)", text: "写実的なファンタジー油彩画。ドラマチックな逆光、細密な描き込み、トレーディングカードのイラストらしい重厚なタッチ" },
    anime: { label: "アニメ調", text: "高品質なアニメ・イラスト調。はっきりした線と鮮やかな彩色、キラキラした光の粒子" },
    comic: { label: "アメコミ調", text: "アメリカンコミック調。太い輪郭線と陰影、力強いポーズ" },
  };

  const EFFECT_WORDS = {
    none: "落ち着いた背景",
    gold: "背後に黄金色に輝く魔法陣と光の粒子",
    purple: "背後に紫色の魔力の渦と光の粒子",
    blue: "背後に蒼く輝く魔法陣と光の粒子",
    red: "背後に紅蓮の炎と火の粉",
    green: "背後に翠色の風の渦と光の粒子",
  };

  function buildImagePrompt(card, styleKey) {
    const style = ART_STYLES[styleKey] || ART_STYLES.painterly;
    const m = card.member;
    const props = [m.skills, m.personality, m.episode].filter((v) => v && v.trim()).join(" / ");
    if (!isMonster(card)) {
      return `トレーディングカードの「${typeLabel(card)}」用のイラストを1枚描いてください。

- カード名: 「${card.name || "(カード名)"}」${m.realName ? `(元ネタ: ${m.realName})` : ""}
- 場面: カード名と効果の内容をひと目で表す、象徴的な場面や道具を描く${card.effect ? `(効果: ${card.effect.replace(/\n/g, " ")})` : ""}
- ${m.related ? `登場させたい人・モノ: ${m.related}(写真を添付した場合は顔立ちを写真に忠実に)` : "人物は描かなくてもよい。写真を添付した場合はその人物を登場させる"}
- ヒント: ${props || "会社・オフィスにちなんだモチーフをファンタジー風に"}
- 構図: 正方形に近い横長(約1:1)。中央に主役を大きく
- 演出: ${EFFECT_WORDS[card.art.effect] || EFFECT_WORDS.blue}
- 画風: ${style.text}
- 禁止: 文字・ロゴ・カード枠・透かしは一切入れない(イラストのみ)`;
    }
    const who = [m.department, m.role].filter((v) => v && v.trim()).join("の");
    return `添付した写真の人物をモデルに、トレーディングカード用のイラストを1枚描いてください。

- 構図: 正方形に近い横長(約1:1)。人物は胸から上〜腰から上、正面寄りで中央に大きく配置
- 人物: 写真の顔立ち・髪型・雰囲気に忠実に描く${who ? `(${who})` : ""}
- キャラクター設定: 「${card.name || "(カード名)"}」${card.tribe ? `/${card.tribe}` : ""}
- 持ち物・演出: 本人の仕事を象徴する小物を手に持たせる${props ? `(ヒント: ${props})` : ""}
- 背景: ${EFFECT_WORDS[card.art.effect] || EFFECT_WORDS.gold}、宙に舞う書類など仕事にちなんだモチーフ
- 画風: ${style.text}
- 禁止: 文字・ロゴ・カード枠・透かしは一切入れない(イラストのみ)`;
  }

  return {
    VERSION,
    CARD_TYPES,
    SPELL_TYPES,
    TRAP_TYPES,
    ATTRIBUTES,
    ART_EFFECTS,
    NAME_COLORS,
    ART_STYLES,
    AI_FIELDS,
    TABLE_COLUMNS,
    uid,
    createDefault,
    normalize,
    isMonster,
    subtypesFor,
    typeLabel,
    typeLine,
    buildAiRequest,
    buildCopyPrompt,
    applyAiResult,
    parseLooseJson,
    parseDelimited,
    rowsToCards,
    cardsToRows,
    toCsv,
    buildTablePrompt,
    buildImagePrompt,
  };
})();

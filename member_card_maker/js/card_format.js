// 社内メンバートレカの「入力フォーマット」定義。
// 1枚のカード = 1つの JSON オブジェクト。ここにある項目を埋めれば card_renderer.js が画像を描く。
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
      member: { realName: "", department: "", role: "", skills: "", personality: "", episode: "", tone: "かっこよく" },
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
    return {
      formatVersion: VERSION,
      id: str(src.id) || d.id,
      cardType: CARD_TYPES[src.cardType] ? src.cardType : d.cardType,
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
      },
      member,
    };
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
  // AI 用:メンバー情報 → カード文面
  // ---------------------------------------------------------------

  const AI_SCHEMA = {
    type: "object",
    properties: {
      name: { type: "string", description: "二つ名+呼び名。例: 財務統括魔導士スズキ" },
      cardType: { type: "string", enum: ["normal", "effect", "ritual", "fusion", "synchro", "xyz"] },
      attribute: { type: "string", enum: ["光", "闇", "炎", "水", "風", "地", "神"] },
      level: { type: "integer", description: "1〜12" },
      tribe: { type: "string", description: "〇〇族。例: CFO族" },
      effect: { type: "string" },
      atk: { type: "integer" },
      def: { type: "integer" },
      artEffect: { type: "string", enum: ["gold", "purple", "blue", "red", "green"] },
    },
    required: ["name", "cardType", "attribute", "level", "tribe", "effect", "atk", "def", "artEffect"],
    additionalProperties: false,
  };

  const AI_RULES = `あなたは社内イベント用の「メンバー紹介トレーディングカード」の文面を作るライターです。
遊戯王OCG風のパロディカードとして、渡されたメンバー情報から1枚分のカードデータを作ってください。

ルール:
- name: 仕事内容や特徴を表す漢字の二つ名 + 呼び名(カタカナ)。例「財務統括魔導士スズキ」「税務幻術師ヨナハ」「海外転売仙人キョウ」。全体で14文字以内。
- tribe: 役割を表す「〇〇族」。例「CFO族」「商人族」「悪魔族」。
- attribute: 人柄や職種のイメージに合う属性を1つ。
- level: 社歴・役職の重さを1〜12で。atk/def は 0〜5000 の100刻みで、攻めの強さ=ATK、守りの堅さ=DEF。
- effect: 遊戯王のテキストの言い回し(「〜できる。」「1ターンに1度、〜」「①：〜」)で、本人の仕事ぶり・口癖・エピソードをネタにする。
  - 効果が複数ある場合は「①：」「②：」で始めて改行で区切る。
  - 全体で120文字前後、長くても180文字以内。
  - 社内の同僚や案件名は「」で囲む。
  - 誰かを傷つける・差別的・過度に下品な表現は避け、本人が笑って受け取れる内容にする。
- cardType: 基本は "effect"。特別感を出したいときだけ他を選ぶ。
- artEffect: イラストに重ねる光の色。雰囲気に合うものを選ぶ。`;

  function memberText(member, extra) {
    const lines = [
      ["呼び名・名前", member.realName],
      ["部署", member.department],
      ["役職・担当", member.role],
      ["得意なこと・スキル", member.skills],
      ["性格・口癖", member.personality],
      ["エピソード・社内での評判", member.episode],
      ["カードの雰囲気", member.tone],
    ]
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `- ${k}: ${v.trim()}`);
    if (extra && extra.trim()) lines.push(`- 追加の要望: ${extra.trim()}`);
    return lines.join("\n");
  }

  function buildAiRequest(member, extra) {
    return {
      system: AI_RULES,
      user: `次のメンバーのカードを作ってください。\n\n${memberText(member, extra)}`,
      schema: AI_SCHEMA,
    };
  }

  // APIキーがなくても ChatGPT / Claude のチャットに貼って使えるプロンプト
  function buildCopyPrompt(member, extra) {
    const example = {
      name: "財務統括魔導士スズキ",
      cardType: "effect",
      attribute: "光",
      level: 6,
      tribe: "CFO族",
      effect:
        "このカードがフィールドに存在する限り、相手の「グレー金融」の効果は無効化される。\n①：1ターンに1度、相手が「リターン請求」を発動した時に発動できる。このカードは「法務確認」を発動する。",
      atk: 2400,
      def: 2100,
      artEffect: "gold",
    };
    return `${AI_RULES}

次のメンバーのカードを作ってください。

${memberText(member, extra)}

回答は次の形式の JSON だけを、コードブロックなしで返してください。
${JSON.stringify(example, null, 2)}`;
  }

  // AI の回答(JSON)をカードに反映する
  function applyAiResult(card, result) {
    const r = typeof result === "string" ? parseLooseJson(result) : result;
    const next = normalize(card);
    if (r.name) next.name = str(r.name);
    if (CARD_TYPES[r.cardType] && CARD_TYPES[r.cardType].monster) next.cardType = r.cardType;
    if (ATTRIBUTES[r.attribute]) next.attribute = r.attribute;
    if (r.level !== undefined) next.level = Math.round(num(r.level, next.level, 1, 12));
    if (r.tribe) next.tribe = str(r.tribe);
    if (r.abilities !== undefined) next.abilities = str(r.abilities);
    if (r.effect) next.effect = str(r.effect);
    if (r.atk !== undefined) next.atk = str(r.atk);
    if (r.def !== undefined) next.def = str(r.def);
    if (ART_EFFECTS[r.artEffect]) next.art.effect = r.artEffect;
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
    const who = [m.department, m.role].filter((v) => v && v.trim()).join("の");
    const props = [m.skills, m.personality, m.episode].filter((v) => v && v.trim()).join(" / ");
    return `添付した写真の人物をモデルに、トレーディングカード用のイラストを1枚描いてください。

- 構図: 正方形(1:1)。人物は胸から上〜腰から上、正面寄りで中央に大きく配置
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
    ATTRIBUTES,
    ART_EFFECTS,
    NAME_COLORS,
    ART_STYLES,
    uid,
    createDefault,
    normalize,
    typeLine,
    buildAiRequest,
    buildCopyPrompt,
    applyAiResult,
    parseLooseJson,
    buildImagePrompt,
  };
})();

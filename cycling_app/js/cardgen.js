// デュエルのカード 10,000枚を作る(40テーマ × 250枚)。
// カードは1枚ずつ書かず、「いつ(召喚した時・破壊された時…)」「条件」「何をする」を組み合わせて作る。
// 効果が強いカードほど攻撃力が下がる・SPCが多く要る、というつり合いを取る。
// 名前・テーマは自転車の用語から作ったオリジナル。同じ番号のカードは、いつ開いても同じ内容になる。
//
// カード: { key, no, kind: monster/spell/trap, name, icon, th(テーマ), rar: N/R/SR/UR, text,
//           lv, atk, tuner, synchro, need(召喚に要るSPC), attr, type, cost(スペルのSPC),
//           e: [{ on, do, n, if }] }  ← 効果(Battle が読む)

const CardGen = (() => {
  const FOCUS = ["aggro", "draw", "burn", "wall", "swarm", "control", "synchro", "trap"];
  const FOCUS_JA = { aggro: "高い攻撃力で押し切る", draw: "手札を増やして手数で勝つ", burn: "効果ダメージでLPを直接削る", wall: "固い守りとLP回復で粘る", swarm: "仲間を並べて強くなる", control: "相手のモンスターを弱らせ・どかす", synchro: "SPCをためてシンクロ召喚を重ねる", trap: "罠を伏せてチェーンで返す" };
  const ATTR = ["風", "炎", "水", "地", "光", "闇"];
  const THEME_NAMES = ["ペダル", "クランク", "スポーク", "リム", "ハブ", "サドル", "ステム", "フォーク", "ケイデンス", "ペロトン", "エシュロン", "クリテリウム", "ブルベ", "ランドナー", "ベロドローム", "グラベル", "ディレイラー", "カセット", "クリート", "ビンディング", "ボトル", "ジャージ", "グローブ", "メット", "サイコン", "ヒルクライム", "ダウンヒル", "スプリント", "ローラー", "ドラフト", "テールウィンド", "クロスウィンド", "ナイトライド", "サンライズ", "レインライド", "ロングライド", "ポタリング", "ケイリン", "マディソン", "オムニアム"];
  const THEME_ICON = ["🦶", "⚙️", "🛞", "⭕", "🔩", "💺", "📐", "🍴", "🎵", "🚴", "🪽", "🏁", "🌙", "🧳", "🏟️", "🪨", "🔧", "📼", "👟", "🔗", "🥤", "👕", "🧤", "⛑️", "📟", "⛰️", "🎢", "💨", "🛼", "🌀", "🍃", "🌬️", "🌃", "🌅", "🌧️", "🛣️", "☕", "🏮", "🤝", "🏆"];
  // モンスターの名前(生きもの・役職)と絵・種族
  const NOUNS = "ナイト⚔️戦士|ウォリアー🗡️戦士|ガーディアン🛡️戦士|ランサー🔱戦士|ソルジャー🪖戦士|レンジャー🏹戦士|ファイター🥊戦士|サムライ⚔️戦士|ニンジャ🥷戦士|パラディン🛡️戦士|ウルフ🐺獣|タイガー🐯獣|ライオン🦁獣|ベア🐻獣|フォックス🦊獣|ラビット🐇獣|ホース🐎獣|バッファロー🐃獣|パンサー🐆獣|ボア🐗獣|スタッグ🦌獣|ハウンド🐕獣|ファルコン🦅鳥獣|イーグル🦅鳥獣|オウル🦉鳥獣|スワロー🐦鳥獣|クロウ🐦鳥獣|ホーク🦅鳥獣|ペンギン🐧鳥獣|フェニックス🔥鳥獣|スワン🦢鳥獣|ドラゴン🐉ドラゴン|ワイバーン🐲ドラゴン|ドレイク🐲ドラゴン|サーペント🐍ドラゴン|ヒドラ🐍ドラゴン|ゴーレム🗿機械|ロボ🤖機械|ドローン🛸機械|エンジン⚙️機械|マシン🤖機械|タービン🌀機械|キャノン💣機械|ギアノイド⚙️機械|メイジ🧙魔法使い|ウィザード🧙魔法使い|シャーマン🔮魔法使い|アルケミスト⚗️魔法使い|オラクル🔮魔法使い|セージ📜魔法使い|シャーク🦈魚|ドルフィン🐬魚|タートル🐢水|ホエール🐋魚|オクトパス🐙水|クラブ🦀水|フロッグ🐸水|ビートル🪲昆虫|マンティス🦗昆虫|スパイダー🕷️昆虫|バタフライ🦋昆虫|ホーネット🐝昆虫|スコーピオン🦂昆虫|アント🐜昆虫|タイタン🗿岩石|ジャイアント🗿岩石|トレント🌳植物|ローズ🌹植物|カクタス🌵植物|マッシュ🍄植物|ファントム👻アンデット|スペクター👻アンデット|リーパー💀アンデット|デーモン😈悪魔|インプ😈悪魔|ガーゴイル🦇悪魔|バット🦇悪魔|エンジェル👼天使|ヴァルキリー🪽天使|スピリット✨天使|スパーク⚡雷|ボルト⚡雷|ノヴァ🌟雷|コメット☄️雷"
    .split("|")
    .map((s) => {
      const m = s.match(/^([ァ-ヶー]+)(.+?)([ぁ-ん一-龠ァ-ヶー]+)$/);
      return { name: m[1], icon: m[2], race: m[3] };
    });
  const EPI = ["疾走の", "鋼の", "黎明の", "宵闇の", "烈風の", "不屈の", "蒼き", "紅の", "白銀の", "黄金の", "迅雷の", "深緑の"];
  const SYN = "エンペラー👑|オーバーロード👑|アークドラゴン🐲|セイヴァー🌟|ギャラクシー🌌|インフィニティ♾️|ジェネシス🌅|ゼニス🏔️|レクイエム🎻|ラグナロク⚡|アポロン☀️|ルナティック🌙".split("|").map((s) => ({ name: s.replace(/[^ァ-ヶー]/g, ""), icon: s.replace(/[ァ-ヶー]/g, "") }));
  // スペル・罠の名前は、効果に合う言葉から選ぶ(回復なら「ヒール」、ダメージなら「バースト」…)
  const W = (t) => t.split("|");
  const SPELL_W = {
    draw: W("ストリーム|ドラフティング|リロード|スリップ"), burn: W("バースト|フレア|ブレイズ|イグニッション|エキゾースト"), heal: W("ヒール|リカバリー|レスト|サプライ|リペア"),
    boost: W("ブースト|スパート|ダッシュ|アクセル"), boostAll: W("エール|アンセム|トレイン|フォーメーション"), destroy: W("ブレイク|ストライク|インパクト"), snipe: W("ピンポイント|ショット|スナイプ"),
    sweep: W("サイクロン|ストーム|ウェーブ"), weakenAll: W("ミスト|フロスト|ヘッドウィンド"), weaken: W("ドラッグ|ブレーキング|スロー"), revive: W("リターン|リバース|リブート"),
    search: W("コール|スカウト|サーチ"), charge: W("チャージ|ギアアップ|シフト"), extra: W("ラッシュ|ダブルアタック|オーバーテイク"), discard: W("プレッシャー|チェック|マーク"),
    bounce: W("Uターン|プッシュバック|ゲイル"), setTrap: W("セットアップ|プラン|タクティクス"),
  };
  const TRAP_W = {
    negateAtk: W("ストップ|ブロック|バリア|シールド|イエローフラッグ"), killAtk: W("ピット|ホール|クラッシュ|パンク|スネア"), guardUp: W("ガード|ウォール|テールガード|サポート|カバー"),
    counter: W("カウンター|ジャム|キャンセル|サイレンス"), chainBurn: W("チェーンロック|バックファイア|エコー|リアクション|スパイラル"), reflectDmg: W("ミラー|リフレクト|リコイル"),
    bounceAtk: W("リジェクト|ターンバック|ブローバック"), drainAtk: W("マッドトラップ|スリップダウン|フリーズ|バインド|ウェイト"), onAtk: W("アンブッシュ|フェイント|サイレン|シグナル|デコイ"),
  };
  const FORM = W("ライン|ゾーン|ループ|ターン|レーン|ルート|サイクル|フェーズ|コード|ゲート|ロード|サイン|リズム|ペース|モード|スイッチ|アーク|ノート|ステージ|ドライブ");
  const RIVAL_TITLE = { aggro: "疾風の", draw: "千手の", burn: "爆炎の", wall: "鉄壁の", swarm: "群狼の", control: "氷刃の", synchro: "同調の", trap: "罠師" };
  const RIVAL_NAME = ["ハルト", "ソラ", "レン", "ユウ", "ナギ", "トワ", "シン", "ジン", "カナタ", "リク", "アオ", "セナ", "タクミ", "ヒビキ", "イツキ", "ミナト", "サク", "ルイ", "コウ", "ダイチ", "アキト", "ユキ", "ケイ", "マコト", "シオン", "レイ", "ツバサ", "ハヤテ", "カイト", "リョウマ", "イオリ", "トウマ", "ショウ", "ガク", "ノア", "ヒロ", "テツ", "ゴウ", "ライ", "エイジ"];

  // ---------- 乱数(番号から決まる) ----------
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const r50 = (x) => Math.round(x / 50) * 50;
  // 重みつきで1つ選ぶ
  function pick(r, list, w) {
    let sum = 0;
    for (const x of list) sum += w(x);
    let t = r() * sum;
    for (const x of list) if ((t -= w(x)) <= 0) return x;
    return list[list.length - 1];
  }

  // ---------- 効果の一覧 ----------
  // [いつ, 何を, 数, つり合いの重さ(攻撃力をこれだけ下げる), 最小Lv, 最大Lv, 得意なテーマ]
  const M = [
    ["summon", "draw", 1, 350, 1, 8, "draw"], ["summon", "spc", 1, 200, 1, 8, "synchro aggro"], ["summon", "spc", 2, 400, 2, 8, "synchro"],
    ["summon", "heal", 500, 150, 1, 8, "wall"], ["summon", "heal", 1000, 300, 2, 8, "wall"],
    ["summon", "burn", 300, 200, 1, 8, "burn"], ["summon", "burn", 500, 350, 2, 8, "burn"], ["summon", "burn", 800, 500, 4, 8, "burn"],
    ["summon", "call", 3, 450, 1, 4, "swarm synchro"],
    ["summon", "weaken", 300, 250, 1, 8, "control"], ["summon", "weaken", 500, 400, 2, 8, "control"], ["summon", "weaken", 800, 600, 4, 8, "control"],
    ["summon", "snipe", 0, 700, 5, 8, "control"], ["summon", "search", 0, 400, 1, 6, "draw swarm"], ["summon", "revive", 3, 600, 3, 8, "swarm"],
    ["summon", "discard", 1, 450, 3, 8, "control"], ["summon", "setTrap", 0, 450, 1, 6, "trap"], ["summon", "bounce", 0, 700, 6, 8, "control"],
    ["cont", "guard", 0, 300, 1, 8, "wall"], ["cont", "aura", 200, 350, 1, 8, "swarm"], ["cont", "aura", 300, 500, 4, 8, "swarm"],
    ["cont", "twin", 0, 900, 4, 8, "aggro"], ["cont", "sneak", 0, 350, 1, 4, "aggro burn"], ["cont", "drain", 0, 300, 1, 8, "wall"],
    ["cont", "themeUp", 200, 250, 1, 8, "swarm synchro"], ["cont", "themeUp", 300, 350, 3, 8, "swarm"],
    ["cont", "rage", 400, 200, 1, 8, "aggro"], ["cont", "rage", 600, 300, 3, 8, "aggro"],
    ["cont", "spcUp", 50, 250, 1, 8, "aggro synchro"], ["cont", "spcUp", 100, 450, 4, 8, "synchro"],
    ["cont", "wall", 400, 150, 1, 8, "wall trap"], ["cont", "wall", 800, 300, 2, 8, "wall trap"],
    ["turn", "grow", 100, 300, 1, 8, "aggro"], ["turn", "grow", 200, 500, 3, 8, "aggro"], ["turn", "spc", 1, 400, 1, 8, "synchro"],
    ["turn", "heal", 300, 200, 1, 8, "wall"], ["turn", "burn", 200, 350, 1, 8, "burn"],
    ["dead", "draw", 1, 250, 1, 8, "draw"], ["dead", "burn", 500, 250, 1, 8, "burn"], ["dead", "spc", 2, 200, 1, 8, "synchro"],
    ["dead", "revive", 3, 500, 2, 8, "swarm"], ["dead", "search", 0, 350, 1, 8, "draw"],
    ["hit", "burn", 300, 250, 1, 8, "burn aggro"], ["hit", "burn", 500, 400, 3, 8, "burn"], ["kill", "draw", 1, 400, 2, 8, "draw aggro"], ["hit", "spc", 1, 200, 1, 8, "synchro"],
  ];
  // スペル: [何を, 数, SPC, 得意なテーマ]
  const S = [
    ["draw", 2, 2, "draw"], ["draw", 3, 4, "draw"], ["burn", 500, 2, "burn"], ["burn", 800, 3, "burn"], ["burn", 1000, 4, "burn"], ["burn", 1500, 6, "burn"], ["burn", 2000, 8, "burn"],
    ["heal", 1000, 1, "wall"], ["heal", 1500, 2, "wall"], ["heal", 2500, 4, "wall"], ["boost", 700, 2, "aggro"], ["boost", 1000, 3, "aggro"], ["boost", 1500, 4, "aggro"],
    ["boostAll", 300, 3, "swarm"], ["boostAll", 500, 5, "swarm aggro"], ["boostAll", 800, 8, "swarm"], ["destroy", 0, 4, "control"], ["snipe", 0, 2, "control"],
    ["sweep", 1500, 5, "control"], ["sweep", 2000, 7, "control"], ["weakenAll", 500, 3, "control"], ["weakenAll", 800, 5, "control"], ["weaken", 1000, 2, "control"],
    ["revive", 9, 3, "swarm"], ["search", 0, 1, "draw synchro"], ["charge", 2, 0, "synchro"], ["charge", 3, 1, "synchro"], ["extra", 0, 1, "swarm synchro"],
    ["discard", 1, 3, "control"], ["bounce", 0, 3, "control"], ["setTrap", 0, 1, "trap"],
  ];
  // スペル・罠のおまけ効果: [何を, 数, SPCの足し]
  const RIDER = [["draw", 1, 2], ["heal", 500, 1], ["burn", 300, 1], ["spc", 1, 1], ["weaken", 300, 1]];
  // 罠: [何を, 数, めずらしさの下限(0=N), 得意なテーマ]
  const TR = [
    ["negateAtk", 0, 0, "wall trap"], ["killAtk", 0, 1, "trap control"], ["guardUp", 500, 0, "wall"], ["guardUp", 800, 0, "wall"], ["guardUp", 1200, 1, "wall"],
    ["counter", 0, 1, "trap control"], ["chainBurn", 300, 0, "burn trap"], ["chainBurn", 400, 1, "burn trap"], ["chainBurn", 500, 2, "burn"],
    ["reflectDmg", 0, 2, "trap burn"], ["bounceAtk", 0, 1, "control"], ["drainAtk", 500, 0, "control"], ["drainAtk", 1000, 1, "control"], ["onAtk", 0, 0, "draw burn synchro"],
  ];
  const ON_ATK = [["draw", 1], ["draw", 2], ["burn", 500], ["burn", 800], ["heal", 1000], ["spc", 2]];
  const IFS = [{ spc: 4 }, { low: 1 }, { theme: 1 }, { grave: 5 }];

  // ---------- 文章 ----------
  const ON_JA = { summon: "召喚した時、", cont: "", turn: "自分のターンの始めに、", dead: "破壊された時、", hit: "攻撃した後、", kill: "戦闘で相手モンスターを破壊した時、", cast: "", also: "" };
  function ifText(c, th) {
    if (!c) return "";
    if (c.spc) return `SPCが${c.spc}以上なら、`;
    if (c.low) return "自分のLPが相手より少ないなら、";
    if (c.theme) return `自分の場にほかの「${th}」モンスターがいるなら、`;
    if (c.grave) return `自分の墓地が${c.grave}枚以上なら、`;
    if (c.atkGE) return `攻撃力${c.atkGE}以上のモンスターの攻撃なら、`;
    return "";
  }
  function doText(e, th) {
    const n = e.n;
    switch (e.do) {
      case "draw": return `${n}枚ドローする`;
      case "spc": case "charge": return `SPC+${n}`;
      case "heal": return `LPを${n}回復する`;
      case "burn": return `相手に${n}ダメージ`;
      case "call": return "手札のLv3以下のモンスター1体を特殊召喚する";
      case "weaken": return `相手のいちばん強いモンスターの攻撃力-${n}`;
      case "weakenAll": return `相手のモンスターすべての攻撃力-${n}`;
      case "snipe": return "相手のいちばん弱いモンスターを破壊する";
      case "destroy": return "相手のいちばん強いモンスターを破壊する";
      case "sweep": return `攻撃力${n}以下の相手モンスターをすべて破壊する`;
      case "search": return "デッキからモンスター1体を手札に加える";
      case "revive": return n >= 9 ? "墓地のモンスター1体を特殊召喚する" : `墓地のLv${n}以下のモンスター1体を特殊召喚する`;
      case "discard": return "相手の手札を1枚捨てさせる";
      case "setTrap": return "デッキから罠1枚を伏せる";
      case "bounce": return "相手のいちばん強いモンスターを手札に戻す";
      case "guard": return "1ターンに1度、戦闘では破壊されない";
      case "aura": return `ほかの自分のモンスターの攻撃力+${n}`;
      case "twin": return "1ターンに2回攻撃できる";
      case "sneak": return "勝てる相手がいない時、攻撃力を半分にして直接攻撃できる";
      case "drain": return "戦闘で与えたダメージの半分だけLPを回復する";
      case "themeUp": return `自分の場のほかの「${th}」モンスター1体につき攻撃力+${n}`;
      case "rage": return `自分のLPが相手より少ない間、攻撃力+${n}`;
      case "spcUp": return `自分のSPC1つにつき攻撃力+${n}`;
      case "wall": return `攻撃された時、攻撃力+${n}`;
      case "grow": return `攻撃力+${n}(場にいる間ずっと)`;
      case "boost": return `自分のモンスター1体の攻撃力+${n}(このターン)`;
      case "boostAll": return `自分のモンスターすべての攻撃力+${n}(このターン)`;
      case "extra": return "このターン、もう1回通常召喚できる";
      case "negateAtk": return "相手の攻撃を無効にする";
      case "reflectDmg": return "相手の攻撃を無効にし、その攻撃力の半分のダメージを返す";
      case "killAtk": return "攻撃してきたモンスターを破壊する";
      case "bounceAtk": return "攻撃を無効にし、攻撃してきたモンスターを手札に戻す";
      case "drainAtk": return `攻撃してきたモンスターの攻撃力-${n}(ずっと)`;
      case "guardUp": return `攻撃された自分のモンスターの攻撃力+${n}`;
      case "counter": return "カウンター罠。相手の魔法・罠の発動を無効にする";
      case "chainBurn": return `チェーン2以降で発動。チェーンの数×${n}ダメージ`;
      case "onAtk": return "相手の攻撃宣言時に発動";
    }
    return "";
  }
  function textOf(c) {
    const th = c.thName;
    const parts = (c.e || []).map((e) => (ON_JA[e.on] || "") + ifText(e.if, th) + doText(e, th));
    let head = "";
    if (c.kind === "spell") head = `Sp(${c.cost}) `;
    if (c.kind === "monster" && c.tuner) head = "チューナー。";
    if (c.kind === "monster" && c.need) parts.unshift(`SPCが${c.need}以上なら召喚できる`);
    if (c.synchro) head = "シンクロ。";
    return head + (parts.length ? parts.join("。") + "。" : c.kind === "monster" ? `「${th}」の${c.race}。` : "");
  }

  // ---------- 1枚を作る ----------
  // テーマごとの攻撃力の調整(自動対戦で勝率がそろうように決めた値)
  let TUNE = [150,-150,-200,0,100,-350,0,-150,-100,-250,-150,-200,-300,-300,50,-400,-150,-350,-150,-450,-250,-400,-150,-200,50,200,0,-600,-200,-100,-100,150,-400,-600,-300,400,-550,-300,-700,150];
  try {
    if (typeof process !== "undefined" && process.env && process.env.CG_TUNE) TUNE = JSON.parse(process.env.CG_TUNE);
  } catch (e) {}
  const tune = (th) => TUNE[th.i] || 0;
  const BASE = [0, 500, 800, 1200, 1600, 2000, 2300, 2600, 2900];
  const NEED = [0, 0, 0, 0, 0, 3, 4, 6, 7];
  const RAR_BONUS = { N: 0, R: 100, SR: 200, UR: 300 };
  const rarOf = (r) => {
    const x = r();
    return x < 0.4 ? "N" : x < 0.75 ? "R" : x < 0.93 ? "SR" : "UR";
  };
  const likes = (tags, focus) => (tags.split(" ").includes(focus) ? 5 : 1);
  // 条件をつけて、1段強くする(同じ重さのまま)
  function withIf(r, e, list, idx) {
    const up = list.find((x) => x[0] === e.on && x[1] === e.do && x[2] > e.n && x !== list[idx]);
    const c = IFS[Math.floor(r() * IFS.length)];
    return Object.assign({}, e, up ? { n: up[2] } : {}, { if: c });
  }
  function monster(r, th, lv, rar, tuner) {
    const nEff = rar === "N" ? (r() < 0.35 ? 1 : 0) : rar === "UR" ? 2 : 1;
    const e = [];
    let cost = 0;
    for (let k = 0; k < nEff; k++) {
      const ok = M.filter((x) => lv >= x[4] && lv <= x[5] && !e.some((y) => y.do === x[1]));
      const x = pick(r, ok, (y) => likes(y[6], th.focus) * (y[3] <= BASE[lv] * 0.5 + 200 ? 1 : 0.15));
      let eff = { on: x[0], do: x[1], n: x[2] };
      if ((rar === "SR" || rar === "UR") && x[0] !== "cont" && r() < 0.5) eff = withIf(r, eff, M, M.indexOf(x));
      e.push(eff);
      cost += x[3];
    }
    let atk = BASE[lv] + (Math.floor(r() * 5) - 2) * 50 + RAR_BONUS[rar] - cost * (lv >= 5 ? 0.8 : 1) - (tuner ? 200 : 0);
    atk = Math.max(lv <= 2 ? 100 : 300, r50(atk + tune(th) * (lv <= 2 ? 0.6 : 1)));
    return { kind: "monster", lv, atk, tuner: tuner || undefined, need: NEED[lv] || undefined, e };
  }
  function synchro(r, th, lv, rar) {
    const base = [0, 0, 0, 0, 0, 2200, 2500, 2700, 3000, 3200, 3400][lv];
    const ok = M.filter((x) => ["summon", "cont", "hit", "kill"].includes(x[0]) && !["call", "sneak", "search", "setTrap"].includes(x[1]));
    const e = [];
    for (let k = 0; k < (rar === "UR" ? 2 : 1); k++) {
      const x = pick(r, ok.filter((y) => !e.some((z) => z.do === y[1])), (y) => likes(y[6], th.focus));
      e.push({ on: x[0], do: x[1], n: x[2] });
    }
    return { kind: "monster", lv, atk: r50(base + (Math.floor(r() * 3) - 1) * 50 + (rar === "UR" ? -100 : 0) + tune(th) * 0.5), synchro: true, e };
  }
  function spell(r, th, rar) {
    const x = pick(r, S, (y) => likes(y[3], th.focus) * (rar === "N" && y[2] >= 6 ? 0.2 : 1));
    const e = [{ on: "cast", do: x[0], n: x[1] }];
    let cost = x[2];
    if (rar === "SR" || rar === "UR") {
      const rd = RIDER[Math.floor(r() * RIDER.length)];
      if (rd[0] !== x[0]) {
        const cond = rar === "UR" ? IFS[Math.floor(r() * IFS.length)] : null;
        e.push(Object.assign({ on: "cast", do: rd[0], n: rd[1] }, cond ? { if: cond } : {}));
        cost += cond ? Math.max(0, rd[2] - 1) : rd[2];
      }
    }
    if (rar === "UR" && cost > 1) cost--;
    return { kind: "spell", cost: Math.min(10, cost), e };
  }
  function trap(r, th, rar) {
    const rk = { N: 0, R: 1, SR: 2, UR: 2 }[rar];
    const x = pick(r, TR.filter((y) => y[2] <= rk), (y) => likes(y[3], th.focus));
    const e = [{ on: "trap", do: x[0], n: x[1] }];
    if (x[0] === "onAtk") {
      const a = ON_ATK[Math.min(ON_ATK.length - 1, Math.floor(r() * ON_ATK.length))];
      e.push({ on: "also", do: a[0], n: a[1] });
      if (rk >= 2) {
        const a2 = ON_ATK.filter((y) => y[0] !== a[0])[Math.floor(r() * 4)];
        e.push({ on: "also", do: a2[0], n: a2[1] });
      }
    } else if (rk >= 2 && x[0] !== "counter" && x[0] !== "chainBurn") {
      const rd = RIDER[Math.floor(r() * RIDER.length)];
      e.push({ on: "also", do: rd[0], n: rd[1] });
    } else if (x[0] === "killAtk" && rar === "R" && r() < 0.5) e[0].if = { atkGE: 2000 }, e.push({ on: "also", do: "draw", n: 1 });
    return { kind: "trap", e };
  }
  const SPELL_ICON = { draw: "🃏", burn: "🔥", heal: "💚", boost: "⚡", boostAll: "📣", destroy: "💥", snipe: "🎯", sweep: "🌪️", weakenAll: "🌫️", weaken: "🧊", revive: "♻️", search: "🔎", charge: "🔋", extra: "➕", discard: "🫳", bounce: "↩️", setTrap: "🪤" };
  const TRAP_ICON = { negateAtk: "🚩", killAtk: "🕳️", guardUp: "🍃", counter: "🔁", chainBurn: "⛓️", reflectDmg: "🔮", bounceAtk: "↩️", drainAtk: "🧲", onAtk: "📯" };

  // ---------- 全部を作る ----------
  let all = null, byKey = null, themes = null;
  function build(taken) {
    if (all) return;
    all = [];
    byKey = {};
    const used = new Set(taken || []);
    themes = THEME_NAMES.map((name, i) => ({ id: "t" + i, i, name, icon: THEME_ICON[i], focus: FOCUS[i % 8], attr: ATTR[i % 6], cards: [] }));
    for (const th of themes) {
      const r = rng(1000 + th.i * 7919);
      const add = (c, name, icon) => {
        const no = all.length + 1;
        Object.assign(c, { key: "g" + no, no, name, icon, th: th.id, thName: th.name });
        if (c.kind === "monster") c.attr = th.attr;
        c.text = textOf(c);
        all.push(c);
        byKey[c.key] = c;
        th.cards.push(c);
        used.add(name);
      };
      // モンスター 138体(うちチューナー 22体) + シンクロ 12体
      const order = NOUNS.map((_, k) => k);
      for (let k = order.length - 1; k > 0; k--) {
        const j = Math.floor(r() * (k + 1));
        [order[k], order[j]] = [order[j], order[k]];
      }
      let ni = 0;
      const nextName = () => {
        for (;;) {
          const noun = NOUNS[order[ni % order.length]], lap = Math.floor(ni / order.length);
          ni++;
          const name = (lap ? EPI[(lap - 1 + ((ni * 5 + th.i) % EPI.length)) % EPI.length] : "") + th.name + "・" + noun.name;
          if (!used.has(name)) return { name, noun };
        }
      };
      for (let k = 0; k < 138; k++) {
        const tuner = k < 22;
        const x = r();
        const lv = tuner ? 1 + Math.floor(r() * 3) : x < 0.08 ? 1 : x < 0.24 ? 2 : x < 0.46 ? 3 : x < 0.7 ? 4 : x < 0.82 ? 5 : x < 0.91 ? 6 : x < 0.97 ? 7 : 8;
        const rar = lv >= 7 ? (r() < 0.5 ? "SR" : "UR") : rarOf(r);
        const c = monster(r, th, lv, rar, tuner);
        const { name, noun } = nextName();
        c.rar = rar;
        c.race = noun.race;
        c.type = `${noun.race}族／${tuner ? "チューナー／" : ""}${c.e.length ? "効果" : "通常"}`;
        add(c, name, noun.icon);
      }
      SYN.forEach((sy, k) => {
        const lv = 5 + Math.floor(k / 2), rar = lv >= 8 ? "UR" : "SR";
        const c = synchro(r, th, lv, rar);
        c.rar = rar;
        c.race = "シンクロ";
        c.attr = th.attr;
        c.type = "シンクロ／効果";
        add(c, th.name + "・" + sy.name, sy.icon);
      });
      // スペル 55枚・罠 45枚。名前は効果に合う言葉から。使い切ったら「言葉・形」の2語にする
      const free = (words) => {
        for (const w of words) if (!used.has(th.name + "・" + w)) return th.name + "・" + w;
        for (let f = 0; f < FORM.length; f++)
          for (const w of words) {
            const name = th.name + "・" + w + "・" + FORM[(f + th.i) % FORM.length];
            if (!used.has(name)) return name;
          }
        for (let k = 2; ; k++) if (!used.has(th.name + "・" + words[0] + k)) return th.name + "・" + words[0] + k;
      };
      for (let k = 0; k < 55; k++) {
        const rar = rarOf(r), c = spell(r, th, rar);
        c.rar = rar;
        add(c, free(SPELL_W[c.e[0].do] || ["スペル"]), SPELL_ICON[c.e[0].do] || "✨");
      }
      for (let k = 0; k < 45; k++) {
        const rar = rarOf(r), c = trap(r, th, rar);
        c.rar = rar;
        add(c, free(TRAP_W[c.e[0].do] || ["トラップ"]), TRAP_ICON[c.e[0].do] || "🪤");
      }
    }
  }

  // ---------- テーマのデッキ(40枚)とエクストラ(シンクロ) ----------
  // モンスター22(チューナー5・Lv4以下が中心)、スペル10、罠8。強いカードほど枚数を少なく
  function deck(thId) {
    build();
    const th = themes.find((t) => t.id === thId);
    if (!th) return null;
    if (th.deck) return th.deck;
    const r = rng(77 + th.i * 131);
    const val = { N: 1, R: 2, SR: 3, UR: 4 };
    const take = (list, n, copies) => {
      const pool = list.slice().sort((a, b) => val[b.rar] - val[a.rar] + (r() - 0.5) * 2.2);
      const out = [];
      for (const c of pool) {
        if (out.length >= n) break;
        const k = Math.min(n - out.length, copies(c));
        for (let i = 0; i < k; i++) out.push(c.key);
      }
      return out;
    };
    const mons = th.cards.filter((c) => c.kind === "monster" && !c.synchro);
    const cp = (c) => (c.rar === "UR" ? 1 : c.rar === "SR" ? 2 : 3);
    const d = [
      ...take(mons.filter((c) => c.tuner), 5, () => 2),
      ...take(mons.filter((c) => !c.tuner && c.lv <= 4), 12, cp),
      ...take(mons.filter((c) => !c.tuner && c.lv >= 5 && c.lv <= 6), 4, () => 2),
      ...take(mons.filter((c) => !c.tuner && c.lv >= 7), 1, () => 1),
      ...take(th.cards.filter((c) => c.kind === "spell"), 10, cp),
      ...take(th.cards.filter((c) => c.kind === "trap"), 8, cp),
    ];
    return (th.deck = d);
  }
  const extra = (thId) => (build(), (themes.find((t) => t.id === thId) || { cards: [] }).cards.filter((c) => c.synchro));
  // テーマ使いのライバル
  function foes() {
    build();
    return themes.map((th) => ({ id: "th-" + th.id, th: th.id, name: (RIVAL_TITLE[th.focus] || "") + RIVAL_NAME[th.i], deckName: `「${th.name}」デッキ`, style: FOCUS_JA[th.focus], icon: th.icon, get deck() { return deck(th.id); } }));
  }

  return {
    build,
    get all() { return build(), all; },
    get themes() { return build(), themes; },
    get byKey() { return build(), byKey; },
    deck, extra, foes, textOf, FOCUS_JA,
  };
})();

if (typeof module !== "undefined") module.exports = CardGen;

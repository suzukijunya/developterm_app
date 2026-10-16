// パーツ構成: 部位(スロット)ごとのパーツ、目安の重量、空気抵抗に関わる属性、合計重量。
// 重量は一般的な製品の「目安」。実際のパーツの重さに書き換えて使う。

const Parts = (() => {
  // 部位の一覧(表示順)。fields はその部位で編集できる属性
  const SLOTS = [
    { id: "frame", name: "フレーム", icon: "🔺" },
    { id: "fork", name: "フォーク", icon: "🍴" },
    { id: "wheels", name: "ホイール", icon: "⭕" },
    { id: "tires", name: "タイヤ(2本)", icon: "🛞" },
    { id: "tubes", name: "チューブ/シーラント", icon: "💧" },
    { id: "groupset", name: "コンポ一式", icon: "⚙️" },
    { id: "handlebar", name: "ハンドル", icon: "🚲" },
    { id: "stem", name: "ステム", icon: "📐" },
    { id: "seatpost", name: "シートポスト", icon: "📏" },
    { id: "saddle", name: "サドル", icon: "💺" },
    { id: "pedals", name: "ペダル", icon: "👟" },
    { id: "bartape", name: "バーテープ", icon: "🎗️" },
    { id: "cages", name: "ボトルケージ", icon: "🥤" },
    { id: "accessories", name: "その他(ライト・サイコンなど)", icon: "🔦" },
  ];

  // 目安のパーツ(重量はグラム)。attrs は空気抵抗や3D表示に使う
  const PRESETS = {
    frame: [
      { name: "カーボン 軽量フレーム", g: 800, attrs: { aero: "round" } },
      { name: "カーボン エアロフレーム", g: 1000, attrs: { aero: "aero" } },
      { name: "カーボン 標準フレーム", g: 1050, attrs: { aero: "round" } },
      { name: "アルミフレーム", g: 1300, attrs: { aero: "round" } },
      { name: "クロモリフレーム", g: 1900, attrs: { aero: "round" } },
    ],
    fork: [
      { name: "フルカーボンフォーク", g: 380 },
      { name: "カーボンフォーク(アルミコラム)", g: 550 },
      { name: "クロモリフォーク", g: 800 },
    ],
    wheels: [
      { name: "アルミ(完成車付属)", g: 1900, attrs: { rimFront: 22, rimRear: 22, discRear: false } },
      { name: "アルミ 軽量", g: 1500, attrs: { rimFront: 25, rimRear: 25, discRear: false } },
      { name: "カーボン 30mm", g: 1350, attrs: { rimFront: 30, rimRear: 30, discRear: false } },
      { name: "カーボン 45〜50mm", g: 1450, attrs: { rimFront: 50, rimRear: 50, discRear: false } },
      { name: "カーボン 60mm", g: 1600, attrs: { rimFront: 60, rimRear: 60, discRear: false } },
      { name: "前60mm+後ディスク", g: 1900, attrs: { rimFront: 60, rimRear: 60, discRear: true } },
    ],
    tires: [
      { name: "25C クリンチャー", g: 450, attrs: { width: 25 } },
      { name: "28C クリンチャー", g: 500, attrs: { width: 28 } },
      { name: "28C チューブレス", g: 580, attrs: { width: 28 } },
      { name: "32C", g: 620, attrs: { width: 32 } },
    ],
    tubes: [
      { name: "ブチルチューブ", g: 200 },
      { name: "軽量ブチル", g: 140 },
      { name: "TPUチューブ", g: 70 },
      { name: "シーラント(チューブレス)", g: 120 },
    ],
    groupset: [
      { name: "105クラス(機械式)", g: 2800 },
      { name: "105クラス(電動)", g: 2750 },
      { name: "アルテグラクラス", g: 2500 },
      { name: "デュラエースクラス", g: 2300 },
      { name: "ソラ・ティアグラクラス", g: 3000 },
    ],
    handlebar: [
      { name: "アルミハンドル", g: 300, attrs: { type: "round" } },
      { name: "カーボンハンドル", g: 230, attrs: { type: "round" } },
      { name: "エアロハンドル", g: 250, attrs: { type: "aero" } },
      { name: "一体型ハンドル(ステム込み)", g: 380, attrs: { type: "integrated" } },
    ],
    stem: [
      { name: "アルミステム", g: 130 },
      { name: "カーボンステム", g: 110 },
      { name: "(一体型ハンドルに含む)", g: 0 },
    ],
    seatpost: [
      { name: "アルミシートポスト", g: 250 },
      { name: "カーボンシートポスト", g: 200 },
      { name: "エアロ専用シートポスト", g: 250 },
    ],
    saddle: [
      { name: "標準サドル", g: 260 },
      { name: "軽量サドル", g: 180 },
      { name: "カーボンレールサドル", g: 150 },
    ],
    pedals: [
      { name: "ビンディング(SPD-SL)", g: 260 },
      { name: "軽量ビンディング", g: 220 },
      { name: "SPD", g: 330 },
      { name: "フラットペダル", g: 350 },
    ],
    bartape: [{ name: "標準バーテープ", g: 60 }, { name: "厚手バーテープ", g: 90 }],
    cages: [
      { name: "ケージ1個+ボトル1本", g: 30, attrs: { bottles: 1 } },
      { name: "ケージ2個+ボトル2本", g: 60, attrs: { bottles: 2 } },
      { name: "なし", g: 0, attrs: { bottles: 0 } },
    ],
    accessories: [
      { name: "ライト前後+サイコン", g: 250, attrs: { extras: 2 } },
      { name: "ライト前後+サイコン+サドルバッグ", g: 400, attrs: { extras: 3 } },
      { name: "なし", g: 0, attrs: { extras: 0 } },
    ],
  };

  const pick = (slot, i) => JSON.parse(JSON.stringify(PRESETS[slot][i]));

  // 最初の構成(カーボン完成車・105クラス相当)
  function defaultParts() {
    return {
      frame: pick("frame", 2),
      fork: pick("fork", 0),
      wheels: pick("wheels", 0),
      tires: pick("tires", 1),
      tubes: pick("tubes", 0),
      groupset: pick("groupset", 0),
      handlebar: pick("handlebar", 0),
      stem: pick("stem", 0),
      seatpost: pick("seatpost", 1),
      saddle: pick("saddle", 0),
      pedals: pick("pedals", 0),
      bartape: pick("bartape", 0),
      cages: pick("cages", 0),
      accessories: pick("accessories", 0),
    };
  }

  // 取り付けているパーツの合計(g)
  function totalGrams(parts) {
    return SLOTS.reduce((s, sl) => s + (parts[sl.id] && parts[sl.id].mounted !== false ? +parts[sl.id].g || 0 : 0), 0);
  }

  // 回転するホイール外周の重さ(kg)。加速の計算に使う(リム・タイヤ・チューブ)
  function rotatingKg(parts) {
    const m = (id) => (parts[id] && parts[id].mounted !== false ? +parts[id].g || 0 : 0);
    return (m("wheels") * 0.45 + m("tires") + m("tubes")) / 1000;
  }

  // 空気抵抗の計算(Fit.bikeCda)に渡す属性
  function aeroOf(parts) {
    const a = (id) => (parts[id] && parts[id].mounted !== false && parts[id].attrs) || {};
    const bar = a("handlebar").type || "round";
    const frameAero = a("frame").aero || "round";
    return {
      frame: frameAero,
      rimFront: a("wheels").rimFront || 25,
      rimRear: a("wheels").rimRear || 25,
      discRear: !!a("wheels").discRear,
      tire: a("tires").width || 28,
      bar,
      cables: frameAero === "aero" || bar === "integrated" ? "internal" : "external",
      bottles: a("cages").bottles != null ? a("cages").bottles : 1,
      extras: a("accessories").extras || 0,
    };
  }

  function slotName(id) {
    const s = SLOTS.find((x) => x.id === id);
    return s ? s.name : id;
  }

  return { SLOTS, PRESETS, defaultParts, totalGrams, rotatingKg, aeroOf, slotName };
})();

if (typeof module !== "undefined") module.exports = Parts;

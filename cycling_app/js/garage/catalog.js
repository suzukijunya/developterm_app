// おすすめパーツのカタログ: 具体的なモデル名・重さ・新品価格・中古相場の目安。
// 重さはメーカー公称値などの目安(サイズ・年式で変わる)。価格は 2026年10月時点の目安で、
// 中古は状態・付属品で大きく変わる。中古で買いにくい消耗品(タイヤ・チューブ)は used: null。
//
// kind: "swap" = その部位をまるごと替える(g はその部位の重さ)
//       "delta" = 部位の一部だけ替える(deltaG は軽くなる重さ。グループセットのクランクなど)
// tags: light(軽さ) / comfort(乗り心地・腰) / speed(速さ・転がり) / commute(通勤の扱いやすさ・パンクしにくさ)
// score: 各目的への効き目(0〜3)

const Catalog = (() => {
  const ITEMS = [
    // ---------- ホイール(リムブレーキ・シマノ10/11速) ----------
    {
      id: "w-racing5", slot: "wheels", kind: "swap", name: "FULCRUM Racing 5 (リムブレーキ)", g: 1645,
      attrs: { rimFront: 24, rimRear: 27, discRear: false }, price: 45000, used: [12000, 22000],
      score: { light: 1, speed: 1, commute: 2 }, note: "丈夫で、通勤にも使いやすい定番のアルミホイール",
    },
    {
      id: "w-zonda", slot: "wheels", kind: "swap", name: "Campagnolo ZONDA C17 (リムブレーキ)", g: 1596,
      attrs: { rimFront: 24, rimRear: 27, discRear: false }, price: 75780, used: [17500, 30000],
      score: { light: 2, speed: 2, commute: 2 }, note: "中古の数が多く、値段の割に軽くて回りが軽い",
    },
    {
      id: "w-racing3", slot: "wheels", kind: "swap", name: "FULCRUM Racing 3 (リムブレーキ)", g: 1550,
      attrs: { rimFront: 24, rimRear: 27, discRear: false }, price: 85000, used: [18000, 40000],
      score: { light: 2, speed: 2, commute: 1 }, note: "ZONDAより少し軽く、加速がよい",
    },
    {
      id: "w-rs81", slot: "wheels", kind: "swap", name: "SHIMANO WH-RS81-C24-CL", g: 1502,
      attrs: { rimFront: 24, rimRear: 24, discRear: false }, price: 90000, used: [30000, 50000],
      score: { light: 2, speed: 2, commute: 1 }, note: "カーボン補強のリムで、乗り心地もよい",
    },
    {
      id: "w-9000c24", slot: "wheels", kind: "swap", name: "SHIMANO DURA-ACE WH-9000-C24-CL", g: 1386,
      attrs: { rimFront: 24, rimRear: 24, discRear: false }, price: 150000, used: [40000, 70000],
      score: { light: 3, speed: 2, commute: 0 }, note: "リムブレーキの軽量ホイールの最上位クラス",
    },
    // ---------- タイヤ(前後2本) ----------
    {
      id: "t-agilest25", slot: "tires", kind: "swap", name: "Panaracer AGILEST 25C ×2", g: 380,
      attrs: { width: 25 }, price: 12000, used: null,
      score: { light: 2, speed: 2, commute: 1 }, note: "軽くて転がりがよい。国内で手に入りやすい",
    },
    {
      id: "t-gp5000-28", slot: "tires", kind: "swap", name: "Continental GRAND PRIX 5000 28C ×2", g: 480,
      attrs: { width: 28 }, price: 16000, used: null,
      score: { light: 1, speed: 3, comfort: 2, commute: 1 }, note: "転がりの軽さで定評がある。28Cは空気圧を下げられて腰にやさしい",
    },
    {
      id: "t-duro28", slot: "tires", kind: "swap", name: "Panaracer AGILEST DURO 28C ×2", g: 500,
      attrs: { width: 28 }, price: 12000, used: null,
      score: { comfort: 2, commute: 3, speed: 1 }, note: "パンクに強い通勤向け。28Cで段差の衝撃もやわらぐ",
    },
    // ---------- チューブ(前後2本) ----------
    {
      id: "u-purple", slot: "tubes", kind: "swap", name: "Panaracer PURPLE LITE (TPU) ×2", g: 72,
      price: 6000, used: null,
      score: { light: 3, speed: 1 }, note: "1本36g。ブチルの半分以下で、いちばん安く効く軽量化",
    },
    {
      id: "u-conti-tpu", slot: "tubes", kind: "swap", name: "Continental TPU Tube ×2", g: 70,
      price: 7000, used: null,
      score: { light: 3, speed: 1 }, note: "1本35g。バルブ長は60mm(リムの高さに合わせて選ぶ)",
    },
    // ---------- サドル ----------
    {
      id: "s-power-comp", slot: "saddle", kind: "swap", name: "SPECIALIZED Power Comp", g: 265,
      price: 15000, used: [4000, 7000],
      score: { comfort: 3, commute: 1 }, note: "先が短く、前傾しても股と腰が楽。腰痛のある人に定番",
    },
    {
      id: "s-power-expert", slot: "saddle", kind: "swap", name: "SPECIALIZED Power Expert", g: 225,
      price: 24000, used: [7000, 11000],
      score: { comfort: 3, light: 1 }, note: "Power Comp と同じ形で、レールが軽い",
    },
    {
      id: "s-slr-boost", slot: "saddle", kind: "swap", name: "selle ITALIA SLR Boost Superflow", g: 185,
      price: 30000, used: [8000, 13000],
      score: { light: 2, comfort: 1 }, note: "軽くて短め。穴あきで圧迫が少ない",
    },
    // ---------- シートポスト ----------
    {
      id: "p-ritchey-carbon", slot: "seatpost", kind: "swap", name: "RITCHEY WCS カーボン 1ボルト", g: 200,
      price: 18000, used: [6000, 10000],
      score: { light: 1, comfort: 2 }, note: "カーボンが振動を吸って腰の負担を減らす。径(30.9mmなど)をフレームに合わせる",
    },
    {
      id: "p-flexlogic", slot: "seatpost", kind: "swap", name: "RITCHEY WCS Carbon Link FlexLogic", g: 190,
      price: 30000, used: [10000, 16000],
      score: { comfort: 3, light: 1 }, note: "しなって突き上げを逃がす形。27.2mmなので、太いフレームにはシムを使う",
    },
    // ---------- ペダル ----------
    {
      id: "d-r550", slot: "pedals", kind: "swap", name: "SHIMANO PD-R550 (SPD-SL)", g: 310,
      price: 7000, used: [3000, 5000],
      score: { speed: 1, light: 1 }, note: "初めてのビンディングに",
    },
    {
      id: "d-r7000", slot: "pedals", kind: "swap", name: "SHIMANO 105 PD-R7000 (SPD-SL)", g: 265,
      price: 13000, used: [5000, 8000],
      score: { light: 2, speed: 2 }, note: "踏み面が広く、力が逃げにくい",
    },
    {
      id: "d-r8000", slot: "pedals", kind: "swap", name: "SHIMANO ULTEGRA PD-R8000 (SPD-SL)", g: 248,
      price: 20000, used: [7000, 11000],
      score: { light: 2, speed: 2 }, note: "105より少し軽い",
    },
    {
      id: "d-me700", slot: "pedals", kind: "swap", name: "SHIMANO PD-ME700 (SPD・片面フラット)", g: 380,
      price: 9000, used: [4000, 6000],
      score: { commute: 3 }, note: "歩きやすいSPDの靴でも、普通の靴でも乗れる。通勤向け",
    },
    // フォークはフレームとセット(同じモデル)で替えるので、単体ではおすすめしない
    // ---------- グループセット(一部だけ替える) ----------
    {
      id: "g-fc5700", slot: "groupset", kind: "delta", name: "クランク SHIMANO 105 FC-5700 + BB SM-BBR60", deltaG: 150, short: "105クランク(FC-5700)",
      price: 20000, used: [5000, 9000],
      score: { light: 1, speed: 1 }, needsShop: true,
      note: "四角軸のクランクから中空のホローテックIIに替える。フロントシングルならチェーンリングを1枚にして使う。BB(約2,500円)は新品で",
    },
    {
      id: "g-chain", slot: "groupset", kind: "delta", name: "チェーン SHIMANO CN-HG95 (10速)", deltaG: 0, short: "新品チェーン(CN-HG95)",
      price: 3500, used: null,
      score: { speed: 1, commute: 1 }, maint: true,
      note: "伸びたチェーンを替えると変速が軽くなり、ギアも長持ちする(3,000〜5,000kmが目安)",
    },
    // ---------- 小物 ----------
    {
      id: "a-ti-qr", slot: "accessories", kind: "delta", name: "チタン クイックリリース 前後", deltaG: 70, short: "チタンQR",
      price: 5000, used: null,
      score: { light: 1 }, note: "鉄の付属品(前後約130g)から約70g軽くなる、手軽な軽量化",
    },
  ];

  const byId = (id) => ITEMS.find((x) => x.id === id) || null;
  const forSlot = (slot) => ITEMS.filter((x) => x.slot === slot);

  // 中古で買うときの目安(中央の値)。中古がなければ新品
  function cost(item, usedOk) {
    return usedOk && item.used ? Math.round((item.used[0] + item.used[1]) / 2 / 500) * 500 : item.price;
  }

  function yen(n) {
    return "¥" + Math.round(n).toLocaleString();
  }

  // 「中古 ¥17,500〜30,000 / 新品 ¥75,780」のような表示
  function priceText(item) {
    const used = item.used ? `中古 ${yen(item.used[0])}〜${item.used[1].toLocaleString()}` : "新品のみ";
    return `${used} / 新品 ${yen(item.price)}`;
  }

  // バイクにつける(build.parts を書き換える)
  function apply(build, item) {
    const prev = build.parts[item.slot] || { name: "", g: 0 };
    if (item.kind === "swap") {
      build.parts[item.slot] = {
        name: item.name,
        g: item.g,
        attrs: Object.assign({}, prev.attrs || {}, item.attrs || {}),
        shop: { id: item.id, price: item.price, used: item.used },
        mounted: true,
      };
    } else {
      const p = Object.assign({}, prev);
      const done = (p.shopDeltas || []).slice();
      if (done.includes(item.id)) return;
      done.push(item.id);
      p.shopDeltas = done;
      p.g = Math.max(0, (+p.g || 0) - item.deltaG);
      p.name = `${prev.name || ""}${prev.name ? " + " : ""}${item.short || item.name}`;
      p.mounted = true;
      build.parts[item.slot] = p;
    }
  }

  // 今のパーツより軽くなる重さ(g)。delta はそのまま
  function saving(build, item) {
    if (item.kind === "delta") return (build.parts[item.slot] && (build.parts[item.slot].shopDeltas || []).includes(item.id)) ? 0 : item.deltaG;
    const p = build.parts[item.slot];
    return Math.max(0, (p && p.mounted !== false ? +p.g || 0 : 0) - item.g);
  }

  // もう付いているか
  function installed(build, item) {
    const p = build.parts[item.slot];
    if (!p) return false;
    if (item.kind === "delta") return (p.shopDeltas || []).includes(item.id);
    return (p.shop && p.shop.id === item.id) || p.name === item.name;
  }

  return { ITEMS, byId, forSlot, cost, yen, priceText, apply, saving, installed };
})();

if (typeof module !== "undefined") module.exports = Catalog;

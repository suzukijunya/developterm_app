// 写真だけでパーツ登録: 写真から部位・メーカー・モデル・重さを読み取り、写っている範囲を切り出して、
// マイパーツに登録して3Dに貼る。AI(APIキーがあるとき)か、文字認識とアプリのカタログ(無料)で読む。

const QuickAdd = (() => {
  // メーカー名(写真の文字から探す)と、よく作っている部位
  const BRANDS = [
    ["SHIMANO", "groupset"], ["SRAM", "groupset"], ["CAMPAGNOLO", "groupset"], ["FULCRUM", "wheels"], ["MAVIC", "wheels"],
    ["DT SWISS", "wheels"], ["ZIPP", "wheels"], ["ENVE", "wheels"], ["HUNT", "wheels"], ["ROVAL", "wheels"], ["BONTRAGER", "wheels"],
    ["GIANT", "frame"], ["CADEX", "wheels"], ["SPECIALIZED", "frame"], ["TREK", "frame"], ["CANNONDALE", "frame"], ["BIANCHI", "frame"],
    ["MERIDA", "frame"], ["SCOTT", "frame"], ["CERVELO", "frame"], ["PINARELLO", "frame"], ["COLNAGO", "frame"], ["BMC", "frame"],
    ["CONTINENTAL", "tires"], ["PANARACER", "tires"], ["VITTORIA", "tires"], ["MICHELIN", "tires"], ["PIRELLI", "tires"], ["SCHWALBE", "tires"],
    ["FIZIK", "saddle"], ["SELLE ITALIA", "saddle"], ["PROLOGO", "saddle"], ["SAN MARCO", "saddle"], ["BROOKS", "saddle"],
    ["RITCHEY", "handlebar"], ["DEDA", "handlebar"], ["3T", "handlebar"], ["ZIPP", "handlebar"], ["PRO", "handlebar"],
    ["LOOK", "pedals"], ["TIME", "pedals"], ["WAHOO", "accessories"], ["GARMIN", "accessories"], ["CATEYE", "accessories"],
    ["SUPACAZ", "bartape"], ["LIZARD SKINS", "bartape"], ["ELITE", "cages"], ["TACX", "cages"],
  ];
  // 型番の決まり(シマノなど)から部位を決める
  const CODES = [
    [/\bFC-?[A-Z]?\d{3,4}/i, "groupset", "クランク"], [/\bRD-?[A-Z]?\d{3,4}/i, "groupset", "リアディレイラー"], [/\bFD-?[A-Z]?\d{3,4}/i, "groupset", "フロントディレイラー"],
    [/\bST-?[A-Z]?\d{3,4}/i, "groupset", "STIレバー"], [/\bBR-?[A-Z]?\d{3,4}/i, "groupset", "ブレーキ"], [/\bCS-?[A-Z]?\d{3,4}/i, "groupset", "スプロケット"],
    [/\bWH-?[A-Z]?\d{3,4}/i, "wheels", "ホイール"], [/\bPD-?[A-Z]?\d{3,4}/i, "pedals", "ペダル"], [/\bSM-?BB/i, "groupset", "BB"],
    [/GP ?5000|AGILEST|CORSA|PRO ?ONE|P ?ZERO|GATORSKIN|GRAND ?PRIX/i, "tires", ""], [/RACING ?\d|ZONDA|SHAMAL|KSYRIUM|COSMIC/i, "wheels", ""],
    [/ANTARES|ARIONE|ALIANTE|SLR|POWER|ROMIN|SCRATCH|DIMENSION/i, "saddle", ""],
  ];

  const up = (s) => String(s || "").normalize("NFKC").toUpperCase();

  // 文字認識の結果から、部位・メーカー・モデルを推し量る
  function guessFromText(text, hintSlot) {
    const t = up(text).replace(/[^\w\s\-.]/g, " ");
    let brand = "", slot = hintSlot || "", model = "", what = "";
    for (const [b, s] of BRANDS) {
      if (new RegExp("(^|\\s)" + b.replace(" ", "\\s*") + "(\\s|$)").test(t)) {
        brand = b;
        if (!slot) slot = s;
        break;
      }
    }
    for (const [re, s, w] of CODES) {
      const m = t.match(re);
      if (m) {
        model = m[0].replace(/\s+/g, " ").trim();
        if (!hintSlot) slot = s;
        what = w;
        break;
      }
    }
    // カタログ(重さ・値段がわかっているもの)の名前と照らし合わせる
    let best = null, bestScore = 0;
    for (const it of Catalog.ITEMS) {
      const words = up(it.name).split(/[\s()/+×]+/).filter((w) => w.length >= 3);
      const score = words.filter((w) => t.includes(w)).length;
      if (score > bestScore) (best = it), (bestScore = score);
    }
    const match = bestScore >= 2 ? best : null;
    if (match) {
      slot = match.slot;
      const parts = match.name.split(" ");
      brand = brand || parts[0];
      model = match.name.slice(parts[0].length).trim();
    }
    return { slot: slot || "accessories", brand: brand ? brand[0] + brand.slice(1).toLowerCase().replace(/^(sram|bmc|dt swiss|3t|pro)$/i, (x) => x.toUpperCase()) : "", model: model || what, match, text: t };
  }

  // 写真の中で、背景(四隅の色)と違う所の範囲 = パーツが写っている範囲(0〜1の割合)
  async function detectCrop(blob) {
    const img = await createImageBitmap(blob);
    const W = 160, H = Math.max(1, Math.round((img.height / img.width) * 160));
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data;
    const px = (x, y) => {
      const i = (y * W + x) * 4;
      return [d[i], d[i + 1], d[i + 2]];
    };
    // 縁の色の平均を背景とする
    const edge = [];
    for (let x = 0; x < W; x += 4) edge.push(px(x, 0), px(x, H - 1));
    for (let y = 0; y < H; y += 4) edge.push(px(0, y), px(W - 1, y));
    const bg = [0, 1, 2].map((k) => edge.reduce((a, p) => a + p[k], 0) / edge.length);
    const spread = edge.reduce((a, p) => a + Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]), 0) / edge.length;
    // 背景がごちゃごちゃしていたら(実物を部屋で撮った写真など)、切り出さない
    if (spread > 60) return { crop: [0, 0, 1, 1], plain: false, w: img.width, h: img.height };
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    const th = Math.max(40, spread * 2.5);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = px(x, y);
        if (Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > th) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    if (x1 < 0) return { crop: [0, 0, 1, 1], plain: false, w: img.width, h: img.height };
    return { crop: [x0 / W, y0 / H, (x1 + 1) / W, (y1 + 1) / H], plain: true, w: img.width, h: img.height };
  }

  // 無料で読む: 文字認識 + カタログ
  async function ruleIdentify(blob, onProgress, hintSlot) {
    let text = "";
    try {
      text = await Importer.ocr(blob, onProgress, "11");
    } catch (e) {
      // 文字認識が読み込めなくても、手で直せばよい
    }
    const g = guessFromText(text, hintSlot);
    const m = g.match;
    return [
      {
        slot: g.slot,
        brand: g.brand,
        model: g.model,
        year: "",
        weight_g: m ? (m.kind === "swap" ? m.g : 0) : 0,
        weight_source: m ? "アプリのカタログ(公称値の目安)" : "",
        price_jpy: m ? m.price : 0,
        specs: m && m.attrs && m.attrs.width ? { width: String(m.attrs.width) } : {},
        color: "",
        view: "side",
        facing: "unknown",
        bbox: null,
        confidence: m ? 0.6 : g.brand ? 0.3 : 0.1,
        note: m ? "カタログのモデルと一致しました" : g.brand ? "メーカー名は読めました。モデルと重さを確かめてください" : "文字を読み取れませんでした。部位とモデルを入れてください",
      },
    ];
  }

  // 3Dに貼るための情報(どの範囲を、どの向きで貼るか)
  function decalFor(slot, crop, view, facing, w, h, fromWholeBike) {
    if (slot === "wheels") {
      // ホイールは円: 範囲の真ん中がハブ、外周がタイヤ
      const cx = ((crop[0] + crop[2]) / 2) * w, cy = ((crop[1] + crop[3]) / 2) * h;
      const R = (Math.min((crop[2] - crop[0]) * w, (crop[3] - crop[1]) * h) / 2) * 0.9;
      return { kind: "wheel", pts: { hub: { x: cx, y: cy }, rimEdge: { x: cx, y: cy - R } }, w, h, clean: true };
    }
    return { kind: "auto", crop, view: view === "other" ? "side" : view || "side", flip: facing === "left", ref: fromWholeBike ? "bike" : "part", w, h };
  }

  return { detectCrop, ruleIdentify, guessFromText, decalFor };
})();

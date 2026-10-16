// アセンブルの性能値: パーツと乗車姿勢から、ゲームのような性能のバー(0〜100)と総合ランクを出す。
// 重さ・空気抵抗・速さ・登坂・加速は物理の計算(Fit)から、乗り心地・丈夫さはパーツの種類からの目安。

const Stats = (() => {
  const clamp = (x, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));
  const lerp01 = (v, worst, best) => clamp(((v - worst) / (best - worst)) * 100);

  const name = (p) => String((p && p.name) || "").toLowerCase();
  const on = (p) => p && p.mounted !== false;
  const shopItem = (p) => (p && p.shop && typeof Catalog !== "undefined" ? Catalog.byId(p.shop.id) : null);

  // 乗り心地(腰・体へのやさしさ)の点
  function comfortOf(parts, torsoDeg) {
    let s = 20;
    const tires = parts.tires;
    if (on(tires)) {
      const w = (tires.attrs && tires.attrs.width) || 25;
      s += clamp((w - 23) * 4, 0, 40);
      if (/チューブレス|tubeless/.test(name(tires))) s += 4;
    }
    const fr = name(parts.frame), fk = name(parts.fork);
    if (/カーボン|carbon/.test(fr)) s += 10;
    else if (/クロモリ|steel|chromoly|スチール/.test(fr)) s += 8;
    if (parts.frame && parts.frame.attrs && parts.frame.attrs.aero === "aero") s -= 3;
    if (/カーボン|carbon/.test(fk)) s += 6;
    else if (/クロモリ|steel|スチール/.test(fk)) s += 3;
    const sp = name(parts.seatpost);
    if (/flex|しなる/.test(sp)) s += 12;
    else if (/カーボン|carbon/.test(sp)) s += 6;
    const sd = parts.saddle, si = shopItem(sd);
    if (si && si.score) s += (si.score.comfort || 0) * 4;
    else if (/power|穴あき|cutout/.test(name(sd))) s += 8;
    const bt = parts.bartape;
    if (on(bt)) s += /厚手|thick|gel|ジェル/.test(name(bt)) ? 5 : 2;
    if (/カーボン|carbon/.test(name(parts.handlebar))) s += 3;
    // 上体が起きているほど腰が楽(前傾が深いほど速いが、体には負担)
    if (torsoDeg != null) s += clamp((torsoDeg - 32) * 0.8, -8, 16);
    return clamp(s);
  }

  // 丈夫さ・パンクしにくさの点
  function durabilityOf(parts) {
    let s = 40;
    const tires = parts.tires;
    if (on(tires)) {
      const w = (tires.attrs && tires.attrs.width) || 25;
      s += clamp((w - 23) * 1.5, 0, 15);
      if (/duro|gator|marathon|通勤|耐パンク/.test(name(tires))) s += 20;
      if (/チューブレス|tubeless/.test(name(tires))) s += 10;
    }
    const tb = name(parts.tubes);
    if (/tpu/.test(tb)) s -= 4;
    else if (/latex|ラテックス/.test(tb)) s -= 6;
    else if (/ブチル|butyl/.test(tb)) s += 4;
    const wh = parts.wheels;
    if (on(wh)) s += (+wh.g || 1700) > 1700 ? 8 : (+wh.g || 1700) < 1450 ? -6 : 0;
    for (const id of ["wheels", "tires", "pedals"]) {
      const it = shopItem(parts[id]);
      if (it && it.score && it.score.commute) s += it.score.commute * 4;
    }
    return clamp(s);
  }

  // 付けているパーツの値段の合計(わかるものだけ)
  function valueOf(parts) {
    let yen = 0;
    for (const p of Object.values(parts)) {
      if (!on(p) || !p.shop) continue;
      yen += p.shop.price || 0;
    }
    return yen;
  }

  // r = calc() の結果({ fit, bikeKg, perf })
  function compute(build, r) {
    const torso = r.fit.angles.torso;
    const v = {
      weight: { raw: r.bikeKg, text: r.bikeKg.toFixed(2) + " kg", bar: lerp01(r.bikeKg, 13, 6) },
      aero: { raw: r.fit.cda.total, text: r.fit.cda.total.toFixed(3), bar: lerp01(r.fit.cda.total, 0.45, 0.22) },
      speed: { raw: r.perf.speed200, text: r.perf.speed200.toFixed(1) + " km/h", bar: lerp01(r.perf.speed200, 26, 42) },
      climb: { raw: r.perf.climb, text: r.perf.climb.toFixed(2) + " 分", bar: lerp01(r.perf.climb, 11, 6.5) },
      accel: { raw: r.perf.accel, text: r.perf.accel.toFixed(2) + " 秒", bar: lerp01(r.perf.accel, 13, 6) },
      comfort: { raw: 0, text: "", bar: comfortOf(build.parts, torso) },
      durability: { raw: 0, text: "", bar: durabilityOf(build.parts) },
    };
    v.comfort.raw = v.comfort.bar;
    v.comfort.text = Math.round(v.comfort.bar) + "";
    v.durability.raw = v.durability.bar;
    v.durability.text = Math.round(v.durability.bar) + "";
    // 総合: 速さ系と体・丈夫さを合わせた点(1000点満点)
    const W = { weight: 1.2, aero: 1, speed: 1.2, climb: 1.2, accel: 0.8, comfort: 1, durability: 0.6 };
    let sum = 0, wsum = 0;
    for (const [k, w] of Object.entries(W)) (sum += v[k].bar * w), (wsum += w);
    const total = Math.round((sum / wsum) * 10);
    return { v, total, rank: rankOf(total), value: valueOf(build.parts) };
  }

  function rankOf(total) {
    return total >= 800 ? "S" : total >= 680 ? "A" : total >= 560 ? "B" : total >= 440 ? "C" : total >= 320 ? "D" : "E";
  }

  // 性能の項目(表示の順)。lower: 数字が小さいほど良い
  const ROWS = [
    { k: "weight", en: "WEIGHT", ja: "重さ", lower: true },
    { k: "aero", en: "AERO", ja: "空気抵抗", lower: true },
    { k: "speed", en: "SPEED", ja: "平地(200W)" },
    { k: "climb", en: "CLIMB", ja: "登坂 5%×2km", lower: true },
    { k: "accel", en: "ACCEL", ja: "0→30km/h", lower: true },
    { k: "comfort", en: "COMFORT", ja: "乗り心地" },
    { k: "durability", en: "DURABILITY", ja: "丈夫さ" },
  ];

  // パーツのレア度: 値段が高いほど上。値段がわからなければ、性能の上がり方で決める
  const TIERS = [
    { id: "legend", label: "LEGENDARY", min: 100000, color: "#ffb52e" },
    { id: "epic", label: "EPIC", min: 50000, color: "#c06bff" },
    { id: "rare", label: "RARE", min: 20000, color: "#3fa3ff" },
    { id: "uncommon", label: "UNCOMMON", min: 8000, color: "#44d68a" },
    { id: "common", label: "COMMON", min: 0, color: "#9aa6b8" },
  ];
  function tierOf(price, gain) {
    if (price > 0) return TIERS.find((t) => price >= t.min);
    // 値段がわからない(マイパーツ・目安): 総合点の上がり方で
    const g = gain || 0;
    return g >= 40 ? TIERS[1] : g >= 20 ? TIERS[2] : g >= 6 ? TIERS[3] : TIERS[4];
  }

  return { compute, ROWS, TIERS, tierOf, rankOf, comfortOf, durabilityOf };
})();

if (typeof module !== "undefined") module.exports = Stats;

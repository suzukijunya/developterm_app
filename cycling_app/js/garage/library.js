// マイパーツ(自分のパーツのデータベース)。
// 公式の重量・寸法・URL・写真を部位ごとに保存し、バイクに付けると数値が3Dと計算にそのまま反映される。
// 写真は端末の中(IndexedDB)に縮小して保存する。

const Library = (() => {
  // 部位ごとの公式仕様の項目
  //   to: 反映先(attrs.〇〇 = パーツの属性、pos.〇〇 = ポジション、geo.〇〇 = フレームのジオメトリ)
  //   scale: 入力値(mm など)→保存値(m)の倍率。keys: 仕様を貼り付けたときに探す言葉
  const SPEC_FIELDS = {
    frame: [
      { k: "aero", label: "形", type: "select", options: [["round", "丸パイプ"], ["aero", "エアロ"]], to: "attrs.aero" },
      { k: "size", label: "サイズ", type: "text", keys: ["サイズ", "size"] },
      { k: "stack", label: "スタック", unit: "mm", to: "geo.stack", scale: 0.001, keys: ["スタック", "stack"] },
      { k: "reach", label: "リーチ", unit: "mm", to: "geo.reach", scale: 0.001, keys: ["リーチ", "reach"] },
      { k: "headAngle", label: "ヘッド角", unit: "°", to: "geo.headAngle", keys: ["ヘッド角", "ヘッドアングル", "ヘッドチューブ角", "head tube angle", "head angle"] },
      { k: "headTube", label: "ヘッドチューブ長", unit: "mm", to: "geo.headTube", scale: 0.001, keys: ["ヘッドチューブ長", "ヘッドチューブ", "head tube length", "head tube"] },
      { k: "seatAngle", label: "シート角", unit: "°", to: "geo.seatAngle", keys: ["シート角", "シートアングル", "シートチューブ角", "seat tube angle", "seat angle"] },
      { k: "seatTube", label: "シートチューブ長", unit: "mm", to: "geo.seatTube", scale: 0.001, keys: ["シートチューブ長", "シートチューブ", "seat tube length", "seat tube"] },
      { k: "chainstay", label: "チェーンステー長", unit: "mm", to: "geo.chainstay", scale: 0.001, keys: ["チェーンステー", "chainstay", "chain stay"] },
      { k: "bbDrop", label: "BBドロップ", unit: "mm", to: "geo.bbDrop", scale: 0.001, keys: ["bbドロップ", "bb drop", "ドロップ"] },
      { k: "forkOffset", label: "フォークオフセット", unit: "mm", to: "geo.forkOffset", scale: 0.001, keys: ["フォークオフセット", "オフセット", "フォークレーキ", "レーキ", "fork rake", "fork offset", "rake", "offset"] },
    ],
    fork: [],
    wheels: [
      { k: "rimFront", label: "前のリム高", unit: "mm", to: "attrs.rimFront", keys: ["フロント", "前輪", "front"] },
      { k: "rimRear", label: "後ろのリム高", unit: "mm", to: "attrs.rimRear", keys: ["リア", "後輪", "rear"] },
      { k: "rimWidth", label: "リム内幅", unit: "mm", keys: ["リム内幅", "内幅", "internal width", "inner width"] },
      { k: "discRear", label: "後輪ディスク", type: "select", options: [["", "いいえ"], ["1", "はい"]], to: "attrs.discRear" },
    ],
    tires: [{ k: "width", label: "タイヤ幅", unit: "mm", to: "attrs.width", keys: ["タイヤ幅", "幅", "width"] }],
    tubes: [],
    groupset: [
      { k: "crank", label: "クランク長", unit: "mm", to: "pos.crank", scale: 0.001, keys: ["クランク長", "クランク", "crank length", "crank"] },
      { k: "speeds", label: "変速段数", unit: "速" },
    ],
    handlebar: [
      { k: "type", label: "形", type: "select", options: [["round", "丸ハンドル"], ["aero", "エアロ"], ["integrated", "一体型(ステム込み)"]], to: "attrs.type" },
      { k: "barWidth", label: "幅(芯-芯)", unit: "mm", to: "pos.barWidth", scale: 0.001, keys: ["幅", "width", "サイズ"] },
      { k: "barReach", label: "リーチ", unit: "mm", to: "pos.barReach", scale: 0.001, keys: ["リーチ", "reach"] },
      { k: "barDrop", label: "ドロップ", unit: "mm", to: "pos.barDrop", scale: 0.001, keys: ["ドロップ", "drop"] },
    ],
    stem: [
      { k: "stemLength", label: "長さ", unit: "mm", to: "pos.stemLength", scale: 0.001, keys: ["長さ", "length", "サイズ"] },
      { k: "stemAngle", label: "角度", unit: "°", to: "pos.stemAngle", keys: ["角度", "angle", "ライズ", "rise"] },
    ],
    seatpost: [
      { k: "setback", label: "セットバック", unit: "mm", keys: ["セットバック", "setback", "オフセット", "offset"] },
      { k: "postLength", label: "長さ", unit: "mm", keys: ["長さ", "length"] },
    ],
    saddle: [
      { k: "saddleLength", label: "長さ", unit: "mm", keys: ["長さ", "length"] },
      { k: "saddleWidth", label: "幅", unit: "mm", keys: ["幅", "width"] },
    ],
    pedals: [{ k: "stackHeight", label: "スタックハイト", unit: "mm", keys: ["スタックハイト", "スタック", "stack height", "stack"] }],
    bartape: [{ k: "thickness", label: "厚さ", unit: "mm", keys: ["厚さ", "thickness"] }],
    cages: [{ k: "bottles", label: "ボトルの数", type: "select", options: [[0, "なし"], [1, "1本"], [2, "2本"]], to: "attrs.bottles" }],
    accessories: [{ k: "extras", label: "付けている物の数", type: "select", options: [[0, "なし"], [1, "1つ"], [2, "2つ"], [3, "3つ以上"]], to: "attrs.extras" }],
  };

  // 部位ごとの属性の初期値(目安のパーツに合わせる)
  const DEFAULT_ATTRS = {
    frame: { aero: "round" },
    wheels: { rimFront: 25, rimRear: 25, discRear: false },
    tires: { width: 28 },
    handlebar: { type: "round" },
    cages: { bottles: 1 },
    accessories: { extras: 0 },
  };

  const displayName = (it) => [it.brand, it.model].filter(Boolean).join(" ") + (it.year ? `(${it.year})` : "") || "名前のないパーツ";

  // ---------- 仕様の貼り付けから数値を読み取る ----------
  function normalize(text) {
    return String(text || "")
      .normalize("NFKC")
      .replace(/[−–—ー](?=\d)/g, "-")
      .replace(/(?<=\d),(?=\d{3}(?!\d))/g, "")
      .toLowerCase();
  }

  // key のすぐ後ろにある数値(単位つき)を探す
  function findNumber(t, keys, units) {
    for (const key of keys) {
      const k = key.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // key のあと(改行までの14文字以内)で最初に出てくる数値。「サイズ(芯-芯):400mm」のような書き方にも対応
      const re = new RegExp(`${k}[^0-9\\n]{0,14}?([+\\-±]?\\d+(?:\\.\\d+)?)\\s*(${units})?`, "i");
      const m = t.match(re);
      if (m) return { value: parseFloat(m[1].replace("±", "-")), unit: m[2] || "" };
    }
    return null;
  }

  // 戻り値: { g, specs: { k: 表示単位の値 }, found: [読み取った項目の名前] }
  function parse(slot, text) {
    const t = normalize(text);
    const out = { specs: {}, found: [] };
    // 重量
    let w = t.match(/(?:重量|重さ|実測|weight)[^0-9\n]{0,12}(\d+(?:\.\d+)?)\s*(kg|g|グラム)/i) || t.match(/(\d+(?:\.\d+)?)\s*(kg|g|グラム)(?![a-z])/i);
    if (w) {
      const v = parseFloat(w[1]);
      out.g = Math.round(w[2] === "kg" ? v * 1000 : v);
      out.found.push(`重量 ${out.g.toLocaleString()}g`);
    }
    for (const f of SPEC_FIELDS[slot] || []) {
      if (!f.keys || f.type === "select") continue;
      if (f.k === "rimFront" || f.k === "rimRear") continue; // 下でまとめて読む
      const r = findNumber(t, f.keys, f.unit === "°" ? "°|度|deg" : "mm|cm|速|speed");
      if (!r) continue;
      let v = r.value;
      if (r.unit === "cm") v *= 10;
      if (f.type === "text") v = String(r.value);
      out.specs[f.k] = v;
      out.found.push(`${f.label} ${v}${f.unit || ""}`);
    }
    if (slot === "wheels") {
      // 「リムハイト 50mm」「前45mm/後60mm」のどちらでも読む
      const front = findNumber(t, ["フロント", "前輪", "front"], "mm");
      const rear = findNumber(t, ["リア", "後輪", "rear"], "mm");
      const both = findNumber(t, ["リムハイト", "リム高さ", "リム高", "リムハイ", "rim depth", "rim height", "depth"], "mm");
      const fv = (front && front.value > 10 && front.value < 120 ? front.value : null) || (both && both.value);
      const rv = (rear && rear.value > 10 && rear.value < 120 ? rear.value : null) || (both && both.value);
      if (fv) (out.specs.rimFront = fv), out.found.push(`前のリム高 ${fv}mm`);
      if (rv) (out.specs.rimRear = rv), out.found.push(`後ろのリム高 ${rv}mm`);
      if (/ディスクホイール|disc wheel/.test(t)) (out.specs.discRear = "1"), out.found.push("後輪ディスク");
    }
    if (slot === "tires") {
      const m = t.match(/(?:700\s*[x×]\s*)?(\d{2})\s*c\b/) || t.match(/[x×]\s*(\d{2}(?:\.\d)?)\b/);
      if (m) {
        out.specs.width = parseFloat(m[1]);
        out.found = out.found.filter((s) => !s.startsWith("タイヤ幅"));
        out.found.push(`タイヤ幅 ${out.specs.width}mm`);
      }
    }
    if (slot === "groupset") {
      const m = t.match(/(\d{1,2})\s*(?:速|s\b|speed)/);
      if (m) (out.specs.speeds = +m[1]), out.found.push(`変速段数 ${m[1]}速`);
    }
    if (slot === "stem" && out.specs.stemAngle != null && /±/.test(text) && out.specs.stemAngle > 0) out.specs.stemAngle = -out.specs.stemAngle;
    if (slot === "handlebar" && /一体型|integrated|インテグレーテッド/.test(t)) (out.specs.type = "integrated"), out.found.push("一体型");
    if (slot === "frame" && /エアロ|aero/.test(t)) (out.specs.aero = "aero"), out.found.push("エアロ形状");
    return out;
  }

  // ---------- バイクへの反映 ----------
  // マイパーツ item をバイク build の部位に付ける(数値もポジション・ジオメトリに反映)
  function apply(build, item) {
    const prev = build.parts[item.slot];
    const attrs = Object.assign({}, DEFAULT_ATTRS[item.slot] || {}, (prev && prev.attrs) || {});
    for (const f of SPEC_FIELDS[item.slot] || []) {
      const raw = item.specs && item.specs[f.k];
      if (raw == null || raw === "" || !f.to) continue;
      const [where, key] = f.to.split(".");
      let v = raw;
      if (f.k === "discRear") v = raw === "1" || raw === true;
      else if (f.type !== "select" || typeof DEFAULT_ATTRS[item.slot]?.[key] === "number") v = isNaN(+raw) ? raw : +raw * (f.scale || 1);
      if (where === "attrs") attrs[key] = v;
      else if (where === "pos") build.pos[key] = v;
      else if (where === "geo") build.geo[key] = v;
    }
    build.parts[item.slot] = { libId: item.id, name: displayName(item), g: +item.g || 0, attrs, mounted: prev ? prev.mounted : true };
    // 写真のデザインを3Dに貼る位置合わせ(写真とセットで持つ)
    if (item.decal && item.photoId) build.parts[item.slot].decal = Object.assign({ photoId: item.photoId }, item.decal);
    if (item.slot === "frame" && item.color) build.color = item.color;
  }

  // 1つの部位に複数のパーツを付けられる部位(前後のホイール、コンポの部品、小物など)
  const MULTI = ["wheels", "tires", "tubes", "groupset", "cages", "accessories"];

  // 内訳から、名前と合計の重さを作り直す
  function fromComponents(prev, comps) {
    const p = Object.assign({}, prev);
    delete p.libId;
    delete p.shop;
    p.components = comps;
    p.name = comps.map((c) => c.name).join(" + ");
    p.g = comps.reduce((a, c) => a + (+c.g || 0), 0);
    p.mounted = true;
    return p;
  }

  // いまのパーツはそのままに、マイパーツを追加で付ける(例: 前輪に後輪を足す)
  function addComponent(build, item) {
    const prev = build.parts[item.slot];
    if (!prev || prev.mounted === false) return apply(build, item);
    const comps = prev.components ? prev.components.slice() : [{ libId: prev.libId || null, name: prev.name, g: +prev.g || 0 }];
    if (comps.some((c) => c.libId === item.id)) return;
    comps.push({ libId: item.id, name: displayName(item), g: +item.g || 0 });
    const p = fromComponents(prev, comps);
    // 写真の貼り方がまだなければ、追加したパーツのものを使う
    if (!p.decal && item.decal && item.photoId) p.decal = Object.assign({ photoId: item.photoId }, item.decal);
    build.parts[item.slot] = p;
  }

  // 内訳の i 番目を外す。1つだけ残ったら、そのパーツ単体に戻す
  function removeComponent(build, slot, i, library) {
    const prev = build.parts[slot];
    if (!prev || !prev.components) return;
    const comps = prev.components.filter((_, k) => k !== i);
    if (!comps.length) return;
    if (comps.length === 1) {
      const it = comps[0].libId && library.find((x) => x.id === comps[0].libId);
      if (it) return apply(build, it);
      build.parts[slot] = Object.assign(fromComponents(prev, comps), { components: undefined });
      delete build.parts[slot].components;
      return;
    }
    build.parts[slot] = fromComponents(prev, comps);
  }

  // マイパーツを直したら、それを付けているバイクにも反映する(内訳に入っているものも)
  function syncAll(garage, item) {
    for (const b of Object.values(garage.builds)) {
      const p = b.parts[item.slot];
      if (!p) continue;
      if (p.libId === item.id) apply(b, item);
      else if (p.components && p.components.some((c) => c.libId === item.id)) {
        const comps = p.components.map((c) => (c.libId === item.id ? { libId: item.id, name: displayName(item), g: +item.g || 0 } : c));
        b.parts[item.slot] = Object.assign(fromComponents(p, comps), { attrs: p.attrs, decal: p.decal });
      }
    }
  }

  // マイパーツを消したら、付けているバイクでは「目安のパーツ」として残す(リンクだけ外す)
  function unlinkAll(garage, id) {
    for (const b of Object.values(garage.builds)) {
      for (const p of Object.values(b.parts)) if (p && p.libId === id) delete p.libId;
    }
  }

  // ---------- 写真(IndexedDB) ----------
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("no indexedDB"));
      const req = indexedDB.open("cycling_garage", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("photos");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }

  async function putPhoto(id, blob) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction("photos", "readwrite");
      tx.objectStore("photos").put(blob, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getPhoto(id) {
    const d = await db();
    return new Promise((resolve) => {
      const req = d.transaction("photos").objectStore("photos").get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  async function deletePhoto(id) {
    try {
      const d = await db();
      d.transaction("photos", "readwrite").objectStore("photos").delete(id);
    } catch (e) {
      // 消せなくても困らない
    }
  }

  // 写真を長い辺 maxSize px の JPEG に縮小する
  // 3Dに貼るとロゴの文字まで見えるよう、長い辺 1600px まで残す
  function resize(file, maxSize = 1600) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, maxSize / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/jpeg", 0.85);
      };
      img.onerror = () => reject(new Error("image"));
      img.src = url;
    });
  }

  // 写真の平均的な色(フレームの色を写真から拾う)。真ん中あたりの、白・黒に近くない色を平均する
  async function dominantColor(blob) {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    await new Promise((r, j) => ((img.onload = r), (img.onerror = j), (img.src = url)));
    const c = document.createElement("canvas");
    c.width = c.height = 48;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, 48, 48);
    URL.revokeObjectURL(url);
    const d = g.getImageData(8, 8, 32, 32).data;
    let r = 0, gg = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const mx = Math.max(d[i], d[i + 1], d[i + 2]);
      const mn = Math.min(d[i], d[i + 1], d[i + 2]);
      if (mx - mn < 40 || mx < 40) continue; // 白・灰色・黒は背景として除く
      r += d[i];
      gg += d[i + 1];
      b += d[i + 2];
      n++;
    }
    if (!n) return null;
    const hex = (x) => Math.round(x / n).toString(16).padStart(2, "0");
    return `#${hex(r)}${hex(gg)}${hex(b)}`;
  }

  return { SPEC_FIELDS, displayName, parse, apply, syncAll, addComponent, removeComponent, MULTI, unlinkAll, putPhoto, getPhoto, deletePhoto, resize, dominantColor };
})();

if (typeof module !== "undefined") module.exports = Library;

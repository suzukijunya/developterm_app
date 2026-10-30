// ガレージ画面: パーツの組み立て・フィッティング・空力・「いまのバイク」と「NEW」の比較。

(() => {
  const el = document.getElementById("garage");
  const has3D = !!window.THREE;

  let tab = new URLSearchParams(location.search).get("tab") === "mission" ? "mission" : "parts";
  let selected = null; // 編集中の部位
  let suggestion = null; // 自動調整の提案
  let libForm = null; // マイパーツの入力フォーム(編集中の内容)
  let importRev = null; // 読み込んだパーツ表の確認中の内容 { rows, totals, status }
  let pasteOpen = false;
  const photoUrls = {}; // 写真ID → 表示用URL
  let mode = "mechanic"; // mechanic(整備: スタンドに載せる) / ride(乗車: ライダーを乗せる)
  let exploded = false;
  let pedaling = true;
  let flow = false;
  let viewIdx = 0;
  const VIEWS = [
    { id: "side", label: "横" },
    { id: "iso", label: "斜め" },
    { id: "front", label: "正面" },
    { id: "top", label: "上" },
  ];

  // ---------- データ ----------
  function newBuild(name, body) {
    const inseam = body.inseam || 0.47 * body.height;
    return {
      name,
      color: "#0a3d91",
      geo: Object.assign({}, Fit.DEFAULT_GEO),
      pos: Object.assign({}, Fit.DEFAULT_POS, { saddleHeight: Math.round(0.883 * inseam * 200) / 200 }),
      parts: Parts.defaultParts(),
    };
  }

  function loadGarage() {
    const prof = Store.profile;
    let g = Store.garage;
    if (!g) {
      const body = Object.assign({}, Fit.DEFAULT_BODY, { height: (prof.heightCm || 172) / 100, weight: prof.weightKg || 65 });
      g = { body, goal: "balance", active: "current", builds: {} };
      g.builds.current = newBuild("いまのバイク", body);
      g.builds.next = newBuild("NEW", body);
      g.builds.next.parts.wheels = JSON.parse(JSON.stringify(Parts.PRESETS.wheels[3]));
    }
    if (!g.library) g.library = []; // マイパーツ(自分のパーツのデータベース)
    if (!g.shops) g.shops = JSON.parse(JSON.stringify(Shops.DEFAULTS)); // 近くのメンテナンス店
    // 身長・体重は走行計算の設定と共通
    g.body.height = (prof.heightCm || g.body.height * 100) / 100;
    g.body.weight = prof.weightKg || g.body.weight;
    return g;
  }

  let G = loadGarage();
  const save = () => Store.setGarage(G);
  const other = () => (G.active === "current" ? "next" : "current");
  const B = (k = G.active) => G.builds[k];

  function input(k, extraPos) {
    return inputOf(B(k), extraPos);
  }
  function inputOf(b, extraPos) {
    const tire = (b.parts.tires && b.parts.tires.attrs && b.parts.tires.attrs.width) || 28;
    return { geo: b.geo, pos: Object.assign({}, b.pos, extraPos || {}), aero: Parts.aeroOf(b.parts), wheelRadius: 0.311 + tire / 1000 };
  }

  function calc(k = G.active) {
    return calcBuild(B(k));
  }
  // 好きな構成(付けたらどうなるかの試算など)の計算
  function calcBuild(b) {
    const fit = Fit.compute(inputOf(b), G.body);
    const bikeKg = Parts.totalGrams(b.parts) / 1000;
    const rot = Parts.rotatingKg(b.parts);
    const perf = Fit.performance(fit.cda.total, G.body.weight + bikeKg, rot);
    return { fit, bikeKg, rot, perf };
  }

  // ---------- 表示用 ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const mm = (m) => Math.round(m * 1000);
  const kgTxt = (kg) => kg.toFixed(2) + " kg";

  // 差の表示。lowerIsBetter なら小さい方が良い
  function delta(a, b, digits, unit, lowerIsBetter) {
    const d = b - a;
    if (Math.abs(d) < Math.pow(10, -digits) / 2) return `<span class="d same">±0</span>`;
    const good = lowerIsBetter ? d < 0 : d > 0;
    return `<span class="d ${good ? "good" : "bad"}">${d > 0 ? "▲" : "▼"}${Math.abs(d).toFixed(digits)}${unit}</span>`;
  }

  // ---------- 画面の骨組み(3Dの入れ物は作り直さない) ----------
  el.innerHTML = `
    <header class="topbar"><div class="topbar-inner g-top"><a href="index.html" class="g-back">←</a>RIDE <span>ASSEMBLY</span></div></header>
    <div class="g-stage" id="stage">
      ${has3D ? "" : `<p class="g-no3d">3D表示を読み込めませんでした。通信状況を確認してください。数値の計算はこのまま使えます。</p>`}
      <div class="g-builds" id="builds"></div>
      <div class="g-tools" id="tools"></div>
    </div>
    <div class="g-summary" id="summary"></div>
    <nav class="g-tabs" id="tabs"></nav>
    <main class="main g-main" id="panel"></main>`;

  const stage = document.getElementById("stage");
  if (has3D) {
    try {
      View3D.create(stage);
      View3D.onClerk(() => openClerk());
    } catch (e) {
      stage.insertAdjacentHTML("afterbegin", `<p class="g-no3d">この端末では3D表示を使えません。数値の計算はこのまま使えます。</p>`);
    }
  }

  let pending3D = false;
  function refresh3D() {
    if (!has3D || pending3D) return;
    pending3D = true;
    requestAnimationFrame(async () => {
      pending3D = false;
      try {
        const decals = await loadDecals(B());
        View3D.setModel(Fit.compute(input(G.active), G.body), B(), G.body, decals);
        if (selected) View3D.highlight(selected, false);
        playFx();
      } catch (e) {
        // 3Dが使えなくても数値は出す
      }
    });
  }

  // 写真のデザインを3Dに貼れる部位と、写真の撮り方
  const DECAL_SLOTS = ["frame", "wheels", "saddle", "handlebar", "bartape"];
  const DECAL_HELP = {
    frame: "横から撮った写真で、後輪の軸・BB・ヘッドチューブの上端をタップします。ロゴや塗装がそのまま3Dのフレームに貼られます。",
    wheels: "横から撮った写真で、ハブの中心とリムの外側の縁をタップします。リムとタイヤのロゴが3Dのホイールに貼られます。",
    saddle: "真上から(先端を上にして)撮った写真で、サドルの先端と後ろの端をタップします。表面の柄やロゴが3Dのサドルに貼られます。",
    handlebar: "正面から撮った写真で、左右のドロップの下の端をタップします。ロゴや柄が3Dのハンドル(一体型ならステムも)に貼られます。",
    bartape: "バーテープを巻いたハンドルを正面から撮った写真で、左右のドロップの下の端をタップします。テープの色や柄が3Dに貼られます。",
  };

  // 付けているパーツのうち、写真を3Dに貼るもの(写真のURLを用意する)
  async function loadDecals(build) {
    const out = {};
    for (const slot of Parts.SLOTS.map((x) => x.id)) {
      const p = build.parts[slot];
      if (!p || !p.decal || !p.decal.photoId || p.mounted === false) continue;
      let url = photoUrls[p.decal.photoId];
      if (!url) {
        const blob = await Library.getPhoto(p.decal.photoId).catch(() => null);
        if (!blob) continue;
        url = photoUrls[p.decal.photoId] = URL.createObjectURL(blob);
      }
      out[slot] = Object.assign({ url }, p.decal);
    }
    return out;
  }

  function renderBuilds() {
    document.getElementById("builds").innerHTML = ["current", "next"]
      .map((k) => `<button class="g-chip ${G.active === k ? "on" : ""}" data-build="${k}">${k === "current" ? "装着済み" : "NEW"}<small>${esc(G.builds[k].name)}</small></button>`)
      .join("");
  }

  function renderTools() {
    document.getElementById("tools").innerHTML = `
      <button class="g-tool ${mode === "ride" ? "on" : ""}" data-tool="mode">${mode === "ride" ? "🚴 乗車" : "🔧 整備"}</button>
      <button class="g-tool ${exploded ? "on" : ""}" data-tool="explode">💥 分解</button>
      <button class="g-tool ${pedaling ? "on" : ""}" data-tool="pedal">${pedaling ? "⏸" : "▶"} ペダル</button>
      <button class="g-tool ${flow ? "on" : ""}" data-tool="flow" ${mode === "ride" ? "" : "disabled"}>💨 流れ</button>
      <button class="g-tool" data-tool="view">👁 ${VIEWS[viewIdx].label}</button>
      ${has3D ? `<button class="g-tool ${photoOn ? "on" : ""}" data-tool="photo">📸 写真</button><button class="g-tool" data-tool="movie">🎬 動画</button>` : ""}
      <button class="g-tool" data-tool="sound" aria-label="効果音">${Sfx.muted ? "🔇" : "🔊"}</button>`;
  }

  // 写真モード(光を何百回も計算して、写真のように描く)
  let photoOn = false;
  function photoStatus(st) {
    let el2 = document.getElementById("photo-st");
    if (!st.on && !st.loading && !st.error) {
      if (el2) el2.remove();
      if (photoOn) (photoOn = false), renderTools();
      return;
    }
    if (!el2) {
      stage.insertAdjacentHTML("beforeend", `<div class="g-photo-st" id="photo-st"></div>`);
      el2 = document.getElementById("photo-st");
    }
    if (st.error) {
      el2.textContent = "⚠️ " + st.error;
      photoOn = false;
      renderTools();
      return;
    }
    const pct = Math.min(100, Math.round((st.samples / st.max) * 100));
    el2.innerHTML = st.hq
      ? "📸 この端末のGPUでは光の計算が重すぎたので、高画質モード(止めると細かく描き直す)にしました"
      : st.retry
      ? `📸 GPUに重すぎたので、軽い設定(${st.retry + 1}/3)でやり直しています…`
      : st.loading
      ? "📸 写真モードを準備しています…"
      : st.moving
        ? "📸 動かすのを止めると、写真のように描き始めます"
        : `📸 ${st.samples < st.max ? "光を計算中" : "完成"} <b>${pct}%</b><i style="width:${pct}%"></i>`;
  }

  // ---------- アセンブル(性能のバー) ----------
  const statsOf = (b) => Stats.compute(b, calcBuild(b));
  // 生の値の差を、単位つきで(重さは g、ほかは表示の単位)
  function rawDelta(k, d) {
    if (k === "weight") return `${d > 0 ? "+" : "−"}${Math.abs(Math.round(d * 1000))}g`;
    const dig = k === "aero" ? 3 : k === "climb" || k === "accel" ? 2 : k === "speed" ? 1 : 0;
    const unit = k === "speed" ? "km/h" : k === "climb" ? "分" : k === "accel" ? "秒" : "";
    return `${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(dig)}${unit}`;
  }

  function renderSummary() {
    const a = statsOf(B());
    const o = statsOf(B(other()));
    const name = other() === "next" ? "NEW" : "装着済み";
    const dt = a.total - o.total;
    const rows = Stats.ROWS.map((r) => {
      const va = a.v[r.k], vo = o.v[r.k];
      const db = va.bar - vo.bar; // +なら良くなった
      const d = va.raw - vo.raw;
      const lo = Math.min(va.bar, vo.bar), hi = Math.max(va.bar, vo.bar);
      const show = Math.abs(db) >= 0.5;
      return `<div class="ac-row">
        <span class="ac-en">${r.en}</span><span class="ac-ja">${r.ja}</span>
        <span class="ac-bar"><i style="width:${lo.toFixed(1)}%"></i>${show ? `<em class="${db > 0 ? "up" : "down"}" style="left:${lo.toFixed(1)}%;width:${(hi - lo).toFixed(1)}%"></em>` : ""}</span>
        <span class="ac-val">${va.text}</span>
        <span class="ac-d ${show ? (db > 0 ? "up" : "down") : ""}">${show ? (r.k === "comfort" || r.k === "durability" ? `${db > 0 ? "▲" : "▼"}${Math.abs(Math.round(db))}` : rawDelta(r.k, d)) : ""}</span>
      </div>`;
    }).join("");
    document.getElementById("summary").innerHTML = `
      <div class="ac-head">
        <div class="ac-rank rank-${a.rank}"><small>RANK</small><b>${a.rank}</b></div>
        <div class="ac-total"><small>TOTAL SCORE</small><b>${a.total}</b>${dt ? `<em class="${dt > 0 ? "up" : "down"}">${dt > 0 ? "▲" : "▼"}${Math.abs(dt)}</em>` : ""}</div>
        <div class="ac-cost"><small>PARTS VALUE</small><b>${a.value ? Catalog.yen(a.value) : "—"}</b></div>
      </div>
      <div class="ac-rows">${rows}</div>
      <p class="g-vs">差は「${name}」と比べた値。緑は良くなった所、赤は悪くなった所</p>`;
  }

  // 付けたらどう変わるか(カタログ・店員さんの候補の横に出す)
  function previewHtml(item) {
    const before = statsOf(B());
    const clone = JSON.parse(JSON.stringify(B()));
    Catalog.apply(clone, item);
    const after = statsOf(clone);
    const dt = after.total - before.total;
    const chips = Stats.ROWS.map((r) => ({ r, db: after.v[r.k].bar - before.v[r.k].bar }))
      .filter((x) => Math.abs(x.db) >= 1)
      .sort((a, b) => Math.abs(b.db) - Math.abs(a.db))
      .slice(0, 3)
      .map((x) => `<i class="${x.db > 0 ? "up" : "down"}">${x.r.ja}${x.db > 0 ? "▲" : "▼"}</i>`)
      .join("");
    const tier = Stats.tierOf(item.price, dt);
    return `<span class="ac-prev"><b class="tier tier-${tier.id}">${tier.label}</b><span class="${dt >= 0 ? "up" : "down"}">TOTAL ${dt >= 0 ? "+" : "−"}${Math.abs(dt)}</span>${chips}</span>`;
  }

  // 付け替え: 前後の性能を比べて、レア度に応じたエフェクトを出す
  // fn: 実際に付け替える処理。info: { slot, price, name }
  function equip(info, fn) {
    cell = null; // 付け替えたら、表に戻ってエフェクトを見せる
    const k = G.active;
    const before = statsOf(B(k));
    fn();
    const after = statsOf(B(G.active));
    const gain = after.total - before.total; // 見ていた構成と、付けたあとの構成の差
    const tier = Stats.tierOf(info.price || 0, gain);
    const diffs = Stats.ROWS.map((r) => ({ r, db: after.v[r.k].bar - before.v[r.k].bar, d: after.v[r.k].raw - before.v[r.k].raw }))
      .filter((x) => Math.abs(x.db) >= 0.5)
      .sort((a, b) => Math.abs(b.db) - Math.abs(a.db))
      .slice(0, 3);
    fxQueue = { info, tier, gain, diffs, rank: after.rank, bikeName: B(G.active).name };
    if (!has3D) setTimeout(playFx);
  }
  let fxQueue = null;
  // デュエルモード: 付けたパーツ(チューナー)とバイクのレベルを足して「シンクロ召喚」
  const TUNERS = ["tubes", "cages", "accessories", "bartape", "pedals", "tires"];
  function synchroLine(info, lv, rank, bikeName) {
    const partLv = [2, 3, 4, 6, 8][lv] || 2;
    const bikeLv = { S: 10, A: 8, B: 6, C: 5, D: 4, E: 3 }[rank] || 4;
    const tuner = TUNERS.includes(info.slot);
    const total = Math.min(12, tuner ? partLv + bikeLv - 2 : bikeLv + (lv >= 3 ? 1 : 0));
    return tuner
      ? `<small class="syn">✦ SYNCHRO SUMMON ★${total} ✦</small><em class="syn-sub">チューナー★${partLv} + ${esc(bikeName || "バイク")}★${bikeLv}</em>`
      : `<small class="syn">✦ ACCEL ASSEMBLE ★${total} ✦</small>`;
  }
  function playFx() {
    if (!fxQueue) return;
    const { info, tier, gain, diffs, rank, bikeName } = fxQueue;
    fxQueue = null;
    const lv = Stats.TIERS.length - 1 - Stats.TIERS.indexOf(tier); // common=0 … legendary=4
    const duel = !!Store.prefs.duel;
    if (has3D && info.slot) View3D.equipFx(info.slot, duel ? "#3dff8a" : tier.color, lv, duel);
    if (duel && typeof DuelFx !== "undefined") {
      chibiJump();
      DuelFx.cutIn(TUNERS.includes(info.slot) ? `チューニング! シンクロ召喚! 来い、${info.name || "新しいパーツ"}!` : `${info.name || "新しいパーツ"}、アクセル・アッセンブル!`, "you");
    }
    Sfx.equip(lv);
    let el2 = document.getElementById("ac-banner");
    if (el2) el2.remove();
    stage.insertAdjacentHTML(
      "beforeend",
      `<div class="ac-banner tier-${tier.id}" id="ac-banner" style="--tc:${tier.color}">
        ${duel ? synchroLine(info, lv, rank, bikeName) : `<small>${lv >= 2 ? "◆ " : ""}${tier.label}${lv >= 2 ? " ◆" : ""}</small>`}
        <strong>${esc(info.name || "")}</strong>
        <span>${gain ? `TOTAL ${gain > 0 ? "+" : "−"}${Math.abs(gain)}` : "ASSEMBLED"}${diffs.map((x) => ` ・ ${x.r.ja} ${x.r.k === "comfort" || x.r.k === "durability" ? (x.db > 0 ? "▲" : "▼") + Math.abs(Math.round(x.db)) : rawDelta(x.r.k, x.d)}`).join("")}</span>
      </div>`
    );
    el2 = document.getElementById("ac-banner");
    setTimeout(() => el2 && el2.classList.add("out"), 2600 + lv * 300);
    setTimeout(() => el2 && el2.remove(), 3300 + lv * 300);
  }

  function renderTabs() {
    const T = [
      ["parts", "🧰 パーツ"],
      ["fit", "🧍 フィッティング"],
      ["aero", "💨 空力"],
      ["compare", "📊 比較"],
      ["clerk", "🧑‍🔧 店員さん"],
      ["mission", "🎖️ ミッション"],
    ];
    document.getElementById("tabs").innerHTML = T.map(([id, label]) => `<button class="g-tab ${tab === id ? "on" : ""}" data-tab="${id}">${label}</button>`).join("");
  }

  // デュエルモードのときは、3Dの左下にちびキャラ(設定で選んだ画像があればその画像)
  function renderChibi() {
    if (!stage) return;
    let c = document.getElementById("g-chibi");
    if (!Store.prefs.duel || typeof DuelFx === "undefined") {
      if (c) c.remove();
      return;
    }
    if (!c) {
      stage.insertAdjacentHTML("beforeend", `<div class="g-chibi" id="g-chibi"><div class="dl-chibi">${DuelFx.avatarHtml("you", "normal", true)}</div></div>`);
      c = document.getElementById("g-chibi");
    }
  }
  function chibiJump() {
    const c = document.querySelector("#g-chibi .dl-chibi");
    if (!c) return;
    c.classList.remove("jump");
    void c.offsetWidth;
    c.classList.add("jump");
  }

  function renderAll() {
    renderChibi();
    renderBuilds();
    renderTools();
    renderSummary();
    renderTabs();
    renderPanel();
    renderBubble();
  }

  // ---------- パーツ ----------
  function barIntegrated(b) {
    const h = b.parts.handlebar;
    return !!(h && h.mounted !== false && h.attrs && h.attrs.type === "integrated");
  }

  // 写真はあるのに、まだ3Dに貼る位置合わせをしていないマイパーツ
  function needsDecal(p, slot) {
    if (!p || !p.libId || !DECAL_SLOTS.includes(slot) || p.mounted === false) return false;
    const it = G.library.find((x) => x.id === p.libId);
    return !!(it && it.photoId && !it.decal);
  }

  // 部位まちがいっぽいパーツ(型番から見分ける。例: ホイールの欄にスプロケット CS-6700)
  function misfits(slot, p) {
    if (!p || p.mounted === false || typeof QuickAdd === "undefined") return [];
    const list = p.components && p.components.length ? p.components : [{ libId: p.libId || null, name: p.name }];
    return list
      .map((c) => ({ c, guess: QuickAdd.slotOfName(c.name) }))
      .filter((x) => x.guess && x.guess.slot !== slot)
      .map((x) => ({ libId: x.c.libId || null, name: x.c.name, to: x.guess.slot, what: x.guess.what || Parts.slotName(x.guess.slot), code: x.guess.code }));
  }

  // マイパーツを別の部位へ移す。付けていた所は、もう片方の構成のパーツ(なければ目安)に戻す
  function moveLib(id, to) {
    const it = libItem(id);
    if (!it) return;
    const from = it.slot;
    it.slot = to;
    for (const [k, b] of Object.entries(G.builds)) {
      const p = b.parts[from];
      if (!p) continue;
      const ci = (p.components || []).findIndex((c) => c.libId === id);
      if (ci >= 0) Library.removeComponent(b, from, ci, G.library);
      else if (p.libId === id) {
        const o = G.builds[k === "current" ? "next" : "current"].parts[from];
        const uses = (q) => q && (q.libId === id || (q.components || []).some((c) => c.libId === id));
        b.parts[from] = o && !uses(o) ? JSON.parse(JSON.stringify(o)) : Parts.defaultParts()[from];
      }
    }
  }

  // ---------- 組み合わせ表(縦: 部位、横: 装着済み / NEW) ----------
  let cell = null; // 開いているマス { slot, k }
  let dataOpen = false; // 読み込み・バックアップの欄を開いているか
  let sheetEdit = false;

  function cellHtml(slotId, k) {
    const b = G.builds[k];
    const p = b.parts[slotId] || { name: "(なし)", g: 0 };
    const inBar = slotId === "stem" && barIntegrated(b);
    const off = !inBar && p.mounted === false;
    const it = p.libId ? libItem(p.libId) : null;
    const o = G.builds[k === "current" ? "next" : "current"].parts[slotId] || {};
    const diff = k === "next" && (o.name !== p.name || o.g !== p.g || (o.mounted === false) !== (p.mounted === false));
    const dg = (off ? 0 : +p.g || 0) - (o.mounted === false ? 0 : +o.g || 0);
    const warn = !inBar && misfits(slotId, p).length;
    // マスには写真もアイコンも置かない(部位は左の列でわかる。写真はマスを開いた画面で見る)
    return `<button class="mx-cell nothumb ${(cell ? cell.slot === slotId && cell.k === k : selected === slotId && G.active === k) ? "sel" : ""} ${off ? "off" : ""} ${diff ? "diff" : ""} ${warn ? "warn" : ""}" data-cell="${slotId}" data-k="${k}">
      <span class="mx-name">${warn ? `<i class="mx-warn" title="部位がちがうかも">⚠️</i>` : ""}${inBar ? "一体型ハンドルに含む" : off ? "外しています" : esc(p.name)}</span>
      <span class="mx-g">${inBar ? "0 g" : off ? "—" : (+p.g || 0).toLocaleString() + " g"}${diff && dg ? `<em class="${dg < 0 ? "up" : "down"}">${dg < 0 ? "−" : "+"}${Math.abs(dg)}g</em>` : ""}</span>
    </button>`;
  }

  function matrixHtml() {
    const kg = (k) => kgTxt(Parts.totalGrams(G.builds[k].parts) / 1000);
    return `
      <section class="card g-mx">
        <h2>アセンブル表</h2>
        <p class="muted small">マスをタップすると、その部位を付け替えられます(付けていないマイパーツやおすすめから選べます)。</p>
        <div class="mx-grid">
          <span class="mx-corner"></span>
          <span class="mx-col ${G.active === "current" ? "on" : ""}">装着済み<small>${kg("current")}</small></span>
          <span class="mx-col ${G.active === "next" ? "on" : ""}">NEW<small>${kg("next")}</small></span>
          ${Parts.SLOTS.map((sl) => `<span class="mx-slot">${sl.icon}<small>${sl.name}</small></span>${cellHtml(sl.id, "current")}${cellHtml(sl.id, "next")}`).join("")}
        </div>
      </section>`;
  }

  // マスを開いたときの下からの画面: いま付いているパーツ・付け替えの候補・細かい数値
  function sheetHtml() {
    const { slot, k } = cell;
    const sl = Parts.SLOTS.find((x) => x.id === slot);
    const b = G.builds[k];
    const p = b.parts[slot] || { name: "(なし)", g: 0 };
    const inBar = slot === "stem" && barIntegrated(b);
    const off = !inBar && p.mounted === false;
    const it = p.libId ? libItem(p.libId) : null;
    const inComps = new Set((p.components || []).map((c) => c.libId).filter(Boolean));
    const others = G.library.filter((x) => x.slot === slot && x.id !== p.libId && !inComps.has(x.id));
    const multi = Library.MULTI.includes(slot) && !off;
    const sided = Library.SIDE_SLOTS.includes(slot);
    const comps = p.components && p.components.length > 1 ? p.components : null;
    const wrong = inBar ? [] : misfits(slot, p);
    return `
      <div class="mx-sheet" id="mxsheet">
        <div class="mx-panel">
          <div class="mx-top"><strong>${sl.icon} ${sl.name} <small>・ ${k === "current" ? "装着済み" : "NEW"}</small></strong><button class="mx-x" data-cell-close aria-label="閉じる">×</button></div>
          <div class="mx-now">
            ${it && it.photoId ? photoTag(it.photoId, "mx-thumb big") : `<span class="mx-thumb big empty">${sl.icon}</span>`}
            <div><small>いま付いているパーツ${comps ? `(${comps.length}点・合計)` : ""}</small><strong>${inBar ? "一体型ハンドルに含む" : comps ? "" : esc(p.name)}</strong>
              ${comps ? `<div class="mx-comps">${comps.map((c, i) => `<div><span>${c.side ? `<b class="mx-side">${c.side === "front" ? "F" : "R"}</b>` : ""}${esc(c.name)}${c.half ? "(片側分)" : ""}</span><b>${(+c.g || 0).toLocaleString()}g</b><button class="mx-x small" data-comp-del="${i}" aria-label="外す">×</button></div>`).join("")}</div>` : ""}
              <small>${inBar ? "0 g" : (+p.g || 0).toLocaleString() + " g"}${off ? " ・ 外しています" : ""}</small>
              <div class="g-plan-btns">${inBar ? "" : `<button class="btn sub" data-mount="${slot}">${off ? "取り付ける" : "外す"}</button>`}${it ? `<button class="link" data-lib-edit="${it.id}">マイパーツを編集</button>` : ""}</div></div>
          </div>
          ${wrong
            .map(
              (w) => `<div class="notice warn mx-misfit">⚠️ 「${esc(w.name)}」は${esc(w.what)}っぽいです${w.code ? `(型番 ${esc(w.code)})` : ""}。${esc(Parts.slotName(w.to))}のパーツではありませんか?
                ${w.libId ? `<button class="btn sub" data-misfit-move="${w.libId}" data-to="${w.to}">${esc(Parts.slotName(w.to))}へ移動</button>` : `<small>マイパーツではないので、下の「数値を細かく」で名前を直すか、「外す」を押してください</small>`}</div>`
            )
            .join("")}
          <p class="g-sub">マイパーツから付け替える${multi ? "・追加する" : ""}</p>
          ${sided ? `<p class="muted small">フロントとリアは別々に付けられます。「フロントに」を押すとフロントだけ入れ替わり、リアはそのまま残ります(重さは前後の合計)。2本セットのものは「前後ペアで」。</p>` : multi ? `<p class="muted small">「＋追加」で、いまのパーツに足して付けられます(重さは合計)。</p>` : ""}
          ${
            others.length
              ? others
                  .map(
                    (x) => `<div class="g-lib">${photoTag(x.photoId)}<div class="g-lib-text"><strong>${esc(Library.displayName(x))}</strong><small>${(+x.g || 0).toLocaleString()}g${specSummary(x)}</small></div>
                      <div class="g-lib-actions">${
                        sided
                          ? `<button class="btn sub" data-lib-side="front" data-lib-id="${x.id}" data-target="${k}">フロントに</button><button class="btn sub" data-lib-side="rear" data-lib-id="${x.id}" data-target="${k}">リアに</button><button class="btn sub" data-lib-side="pair" data-lib-id="${x.id}" data-target="${k}">前後ペアで</button>`
                          : `${multi ? `<button class="btn sub" data-lib-add="${x.id}" data-target="${k}">＋追加</button>` : ""}<button class="btn sub" data-lib-put="${x.id}" data-target="${k}">${multi ? "入れ替え" : "付ける"}</button>`
                      }<button class="link" data-lib-edit="${x.id}">編集</button></div></div>`
                  )
                  .join("")
              : `<p class="muted small">この部位のマイパーツはほかにありません。</p>`
          }
          <div class="g-plan-btns"><label class="btn sub g-file">📷 写真で登録<input type="file" accept="image/*" multiple id="quick-files-slot" data-hint="${slot}" hidden /></label><button class="btn sub" data-lib-new="${slot}">＋ 手で登録</button></div>
          <details class="g-cat" ${sheetEdit ? "open" : ""} id="mx-edit"><summary>✏️ おすすめのモデル・目安・数値を細かく</summary>${inBar ? "" : editor(slot)}</details>
        </div>
      </div>`;
  }

  function openCell(slot, k) {
    cell = { slot, k };
    selected = slot;
    sheetEdit = false;
    const switched = G.active !== k;
    G.active = k;
    if (switched) {
      changed();
      renderAll();
    } else renderPanel();
    if (has3D) View3D.highlight(slot, true);
  }

  function partsPanel() {
    const b = B();
    const rows = Parts.SLOTS.map((sl) => {
      const p = b.parts[sl.id] || { name: "(なし)", g: 0 };
      // 一体型ハンドルなら、ステムはハンドルに含まれる(単体では不要)
      const inBar = sl.id === "stem" && barIntegrated(b);
      const off = !inBar && p.mounted === false;
      return `
        <div class="g-part ${selected === sl.id ? "sel" : ""} ${off ? "off" : ""}">
          <button class="g-part-main" data-slot="${sl.id}">
            <span class="g-part-icon">${sl.icon}</span>
            <span class="g-part-text"><small>${sl.name}</small>${inBar ? "一体型ハンドルに含む" : (p.libId ? "📘 " : "") + esc(p.name)}${!inBar && p.shop && p.shop.used ? `<em class="g-used">中古 ${Catalog.yen(p.shop.used[0])}〜${p.shop.used[1].toLocaleString()}</em>` : !inBar && p.shop ? `<em class="g-used">新品 ${Catalog.yen(p.shop.price)}</em>` : ""}</span>
            <span class="g-part-g">${inBar ? "0 g" : off ? "取り外し中" : (+p.g || 0).toLocaleString() + " g"}</span>
          </button>
          ${needsDecal(p, sl.id) ? `<button class="g-mount g-decal-btn" data-decal-lib="${p.libId}">🎨 ロゴを貼る</button>` : ""}
          ${inBar ? "" : `<button class="g-mount" data-mount="${sl.id}">${off ? "取り付け" : "外す"}</button>`}
        </div>
        ${selected === sl.id ? `<div class="g-editor">${editor(sl.id)}</div>` : ""}`;
    }).join("");
    void rows;
    return `
      ${quickHtml()}
      ${libForm ? libFormHtml() : ""}
      ${importRev ? importHtml() : ""}
      ${matrixHtml()}
      ${cell ? sheetHtml() : ""}
      ${libraryHtml()}`;
  }

  // ---------- 写真でパーツ登録(読み取り → 確認 → 組み込み) ----------
  const quick = { entries: [], target: "current", aiOpen: false, busy: 0 };

  function quickHtml() {
    const rows = quick.entries
      .map((e, i) => {
        if (e.status === "reading")
          return `<div class="q-row">${e.url ? `<img class="q-thumb" src="${e.url}" alt="" />` : `<span class="q-thumb"></span>`}<div class="q-body"><strong>読み取り中…</strong><small>${e.msg || ""}</small><i class="q-bar" style="width:${Math.round((e.progress || 0.1) * 100)}%"></i></div></div>`;
        const r = e.res;
        const conf = Math.round((r.confidence || 0) * 100);
        return `<div class="q-row ${e.include ? "" : "off"}">
          <div class="q-thumb" style="background-image:url('${e.url}');background-size:${(100 / Math.max(0.05, e.crop[2] - e.crop[0])).toFixed(1)}% ${(100 / Math.max(0.05, e.crop[3] - e.crop[1])).toFixed(1)}%;background-position:${((e.crop[0] / Math.max(0.0001, 1 - (e.crop[2] - e.crop[0]))) * 100).toFixed(1)}% ${((e.crop[1] / Math.max(0.0001, 1 - (e.crop[3] - e.crop[1]))) * 100).toFixed(1)}%"></div>
          <div class="q-body">
            <div class="q-line"><select data-q="slot" data-i="${i}">${Parts.SLOTS.map((sl) => `<option value="${sl.id}" ${sl.id === r.slot ? "selected" : ""}>${sl.icon} ${sl.name}</option>`).join("")}</select>
              <label class="q-inc"><input type="checkbox" data-q="include" data-i="${i}" ${e.include ? "checked" : ""} />組み込む</label></div>
            <div class="q-line"><input type="text" data-q="brand" data-i="${i}" value="${esc(r.brand || "")}" placeholder="メーカー" /><input type="text" data-q="model" data-i="${i}" value="${esc(r.model || "")}" placeholder="モデル" /></div>
            <div class="q-line"><span class="g-in"><input type="number" inputmode="decimal" data-q="weight_g" data-i="${i}" value="${r.weight_g || ""}" placeholder="重さ" /><em>g</em></span>
              <small class="q-conf ${conf >= 70 ? "up" : conf >= 40 ? "" : "down"}">確かさ ${conf}%</small></div>
            <small class="muted">${esc(r.note || "")}${/^https?:/.test(r.weight_source || "") ? ` <a href="${esc(r.weight_source)}" target="_blank" rel="noopener">重さの出典</a>` : r.weight_source ? `(重さ: ${esc(r.weight_source)})` : ""}${Object.keys(r.specs || {}).length ? `<br>仕様: ${esc(Object.entries(r.specs).map(([k, v]) => k + "=" + v).join(", "))}` : ""}</small>
          </div></div>`;
      })
      .join("");
    const ready = quick.entries.filter((e) => e.status === "ok" && e.include).length;
    return `
      <section class="card q-card">
        <h2>📷 写真でパーツ登録</h2>
        <p class="small">パーツの写真(自転車全体の写真でもOK)を選ぶだけで、部位・メーカー・モデル・重さを読み取り、3Dのバイクに写真ごと組み込みます。</p>
        <label class="btn start g-file">📷 写真を選ぶ(何枚でも)<input type="file" accept="image/*" multiple id="quick-files" hidden /></label>
        <p class="small">${
          AI.ready
            ? `🤖 AIで読み取り(${esc(AI.MODELS[AI.opts.model].label)}・${AI.opts.search ? "ネットで重さを確認・" + AI.MODELS[AI.opts.model].costSearch : AI.MODELS[AI.opts.model].cost}/枚)。`
            : `🆓 無料の読み取り: 写真の文字(ロゴ・型番)とアプリのカタログから読みます。AIを使うと、刻印が読めない写真でもモデルと正確な重さがわかります。`
        } <button class="link" data-quick="ai">AIの設定</button> ・ <button class="link" data-lib-new="">写真なしで手で登録</button></p>
        ${
          quick.aiOpen
            ? `<div class="q-ai">
                <p class="small">Anthropic の API キーを入れると、Claude が写真を見てパーツを判定します。料金は自分のアカウントにかかります(下は1枚あたりの目安)。キーは<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">こちら</a>で作れます(この端末の中だけに保存し、同期はしません)。</p>
                <input type="password" id="ai-key" placeholder="${AI.ready ? esc(AI.maskedKey) + "(保存済み)" : "sk-ant-…"}" autocomplete="off" />
                ${Object.entries(AI.MODELS)
                  .map(([id, m]) => `<label class="check"><input type="radio" name="ai-model" data-ai-model="${id}" ${AI.opts.model === id ? "checked" : ""} /><span>${esc(m.label)}<small>読み取り ${m.cost} ・ ネットで確認 ${m.costSearch}</small></span></label>`)
                  .join("")}
                <label class="check"><input type="checkbox" id="ai-search" ${AI.opts.search ? "checked" : ""} /><span>重さ・仕様をネットでメーカーの公表値と確かめる<small>正確になりますが、検索1回ごとに約1.5円+α高くなります。オフでも、AIが覚えている公表値を入れます</small></span></label>
                <div class="g-plan-btns"><button class="btn sub" data-quick="ai-save">保存</button>${AI.ready ? `<button class="link danger" data-quick="ai-off">キーを消す</button>` : ""}</div>
              </div>`
            : ""
        }
        ${rows ? `<div class="q-list">${rows}</div>` : ""}
        ${
          ready
            ? `<div class="q-foot"><label class="g-field"><span>組み込む先</span><select id="quick-target"><option value="current" ${quick.target === "current" ? "selected" : ""}>装着済み(いまのバイク)</option><option value="next" ${quick.target === "next" ? "selected" : ""}>NEW</option></select></label>
               <button class="btn start" data-quick="commit">⚙️ ${ready}点を登録して組み込む</button>
               <button class="link" data-quick="clear">やめる</button></div>`
            : quick.entries.length && !quick.busy
              ? `<button class="link" data-quick="clear">やめる</button>`
              : ""
        }
      </section>`;
  }

  async function quickAdd(files, hintSlot) {
    for (const file of files) {
      const entry = { status: "reading", progress: 0.05, msg: "写真を準備しています" };
      quick.entries.push(entry);
      quick.busy++;
      renderPanel();
      try {
        const blob = await Library.resize(file, 2400);
        const photoId = "ph" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
        await Library.putPhoto(photoId, blob);
        const url = (photoUrls[photoId] = URL.createObjectURL(blob));
        Object.assign(entry, { url, photoId, msg: AI.ready ? "AIがパーツを見ています(ネットで重さを確かめるので、少しかかります)" : "写真の文字を読んでいます" });
        renderPanel();
        const crop = await QuickAdd.detectCrop(blob);
        let items, aiNote = "";
        if (AI.ready) {
          try {
            items = await AI.identify(blob, hintSlot ? `この写真は「${Parts.slotName(hintSlot)}」(slot=${hintSlot})のパーツです` : "");
          } catch (e) {
            aiNote = e.status === 401 ? "AIのキーが正しくありません。" : "AIで読み取れなかったので、無料の読み取りにしました。";
          }
        }
        if (!items || !items.length)
          items = await QuickAdd.ruleIdentify(
            blob,
            (p) => {
              entry.progress = 0.2 + p * 0.8;
              renderPanel();
            },
            hintSlot
          );
        // 1枚の写真から複数のパーツ(自転車全体の写真)なら、それぞれの範囲を使う
        const whole = items.length > 1;
        const idx = quick.entries.indexOf(entry);
        const made = items.map((r) => ({
          status: "ok",
          include: true,
          photoId,
          url,
          w: crop.w,
          h: crop.h,
          crop: r.bbox || (crop.plain ? crop.crop : [0, 0, 1, 1]),
          whole: whole && !r.bbox,
          res: Object.assign(r, { note: aiNote + (r.note || "") }),
          blob,
        }));
        quick.entries.splice(idx, 1, ...made);
      } catch (e) {
        Object.assign(entry, { status: "ok", include: false, crop: [0, 0, 1, 1], res: { slot: "accessories", brand: "", model: "", weight_g: 0, note: "この写真は読み取れませんでした", specs: {}, confidence: 0 } });
      }
      quick.busy--;
      renderPanel();
    }
  }

  async function quickCommit() {
    const list = quick.entries.filter((e) => e.status === "ok" && e.include);
    if (!list.length) return;
    const target = quick.target;
    const items = [];
    for (const e of list) {
      const r = e.res;
      const known = new Set((Library.SPEC_FIELDS[r.slot] || []).map((f) => f.k));
      const specs = {};
      for (const [k, v] of Object.entries(r.specs || {})) if (known.has(k)) specs[k] = v;
      let color = /^#[0-9a-f]{6}$/i.test(r.color || "") ? r.color : null;
      if (!color && r.slot === "frame" && e.blob) color = await Library.dominantColor(e.blob).catch(() => null);
      items.push({
        id: "lib" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        slot: r.slot,
        brand: String(r.brand || "").trim(),
        model: String(r.model || "").trim() || Parts.slotName(r.slot),
        year: String(r.year || "").trim(),
        g: +r.weight_g || 0,
        url: /^https?:/.test(r.weight_source || "") ? r.weight_source : "",
        notes: r.note || "",
        specs,
        photoId: e.photoId,
        color,
        decal: QuickAdd.decalFor(r.slot, e.crop, r.view, r.facing, e.w, e.h, e.whole),
        price: +r.price_jpy || 0,
      });
    }
    const price = Math.max(0, ...items.map((x) => x.price));
    G.active = target;
    equip({ slot: items[0].slot, name: items.length > 1 ? `${items.length}点を組み込みました` : Library.displayName(items[0]), price }, () => {
      for (const it of items) {
        G.library.push(it);
        Library.apply(G.builds[target], it);
        if (it.price) G.builds[target].parts[it.slot].shop = { price: it.price, used: null };
      }
    });
    quick.entries = [];
    selected = items[0].slot;
    changed();
    renderAll();
  }

  // ---------- マイパーツ(パーツのデータベース) ----------
  const libItem = (id) => G.library.find((x) => x.id === id) || null;

  function photoTag(photoId, cls = "g-thumb") {
    if (!photoId) return `<span class="${cls} empty">📷</span>`;
    return `<img class="${cls}" data-photo="${photoId}" ${photoUrls[photoId] ? `src="${photoUrls[photoId]}"` : ""} alt="" />`;
  }

  // 写真は非同期で読むので、描画のあとで差し込む
  function loadPhotos() {
    document.querySelectorAll("img[data-photo]").forEach(async (img) => {
      const id = img.dataset.photo;
      if (!photoUrls[id]) {
        const blob = await Library.getPhoto(id).catch(() => null);
        if (!blob) return;
        photoUrls[id] = URL.createObjectURL(blob);
      }
      img.src = photoUrls[id];
    });
  }

  // パーツ表の読み込み・バックアップ(マイパーツの一覧は、組み合わせ表のマスを開くと出る)
  function libraryHtml() {
    return `
      <details class="card g-data" id="g-data" ${dataOpen || pasteOpen ? "open" : ""}>
        <summary><h2>マイパーツの読み込み・バックアップ <span class="g-total">${G.library.length}件</span></h2></summary>
        <p class="g-sub">📥 パーツ表から読み込む</p>
        <p class="muted small">表の写真(JPG・PNG)、CSV、またはバックアップのファイルを読み込めます。表計算ソフトのセルをコピーして貼り付けるのがいちばん正確です。</p>
        <div class="g-row">
          <label class="btn sub g-file">ファイル・写真を選ぶ<input type="file" accept="application/json,.json,.csv,.tsv,.txt,text/plain,text/csv,image/jpeg,image/png,.jpg,.jpeg,.png" id="lib-import" hidden /></label>
          <button class="btn sub" id="paste-toggle">表を貼り付ける</button>
        </div>
        ${
          pasteOpen
            ? `<div class="g-paste"><textarea id="paste-table" rows="6" placeholder="パーツ名・重さ(g)・備考 の列をそのまま貼り付け"></textarea><button class="chip" id="paste-read">読み取る</button></div>`
            : ""
        }
        <button class="btn sub" id="lib-export">書き出す(バックアップ)</button>
        <p class="muted small">マイパーツはこの端末の中に保存されます。機種変更のときは「書き出す」で保存したファイルを読み込めばもどせます(写真は含みません)。</p>
      </details>`;
  }

  function specSummary(it) {
    const fields = Library.SPEC_FIELDS[it.slot] || [];
    const parts = fields
      .filter((f) => it.specs && it.specs[f.k] != null && it.specs[f.k] !== "" && f.type !== "select")
      .slice(0, 3)
      .map((f) => `${f.label} ${it.specs[f.k]}${f.unit || ""}`);
    return parts.length ? " ・" + parts.join(" ・") : "";
  }

  function openLibForm(slot, id) {
    cell = null;
    const it = id ? libItem(id) : null;
    libForm = it
      ? JSON.parse(JSON.stringify(it))
      : { id: null, slot: slot || selected || "wheels", brand: "", model: "", year: "", g: "", url: "", notes: "", specs: {}, photoId: null, paste: "", note: "" };
    libForm.paste = "";
    libForm.note = "";
    renderPanel();
    const f = document.getElementById("libform");
    if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function libFormHtml() {
    const f = libForm;
    const field = (k, label, type = "text", ph = "") =>
      `<label class="g-field"><span>${label}</span><input type="${type}" data-lf="${k}" value="${esc(f[k] == null ? "" : f[k])}" placeholder="${ph}" ${type === "number" ? 'inputmode="decimal"' : ""} /></label>`;
    const specs = (Library.SPEC_FIELDS[f.slot] || [])
      .map((sp) => {
        const v = f.specs[sp.k] == null ? "" : f.specs[sp.k];
        if (sp.type === "select")
          return `<label class="g-field"><span>${sp.label}</span><select data-lf-spec="${sp.k}">${sp.options
            .map(([ov, t]) => `<option value="${ov}" ${String(ov) === String(v) ? "selected" : ""}>${t}</option>`)
            .join("")}</select></label>`;
        return `<label class="g-field"><span>${sp.label}${sp.to ? "" : "<small>記録用</small>"}</span><span class="g-in"><input type="${sp.type === "text" ? "text" : "number"}" inputmode="decimal" data-lf-spec="${sp.k}" value="${esc(v)}" /><em>${sp.unit || ""}</em></span></label>`;
      })
      .join("");
    return `
      <section class="card g-libform" id="libform">
        <h2>${f.id ? "マイパーツを編集" : "マイパーツを登録"}</h2>
        <label class="g-field"><span>部位</span><select data-lf="slot" ${f.id ? "disabled" : ""}>${Parts.SLOTS.map(
          (sl) => `<option value="${sl.id}" ${sl.id === f.slot ? "selected" : ""}>${sl.icon} ${sl.name}</option>`
        ).join("")}</select></label>
        <div class="g-photo">
          ${photoTag(f.photoId, "g-photo-img")}
          <label class="btn sub g-file">📷 写真を${f.photoId ? "変える" : "追加"}<input type="file" accept="image/*" id="lf-photo" hidden /></label>
        </div>
        ${webPhotoHtml(f)}
        ${
          f.photoId && DECAL_SLOTS.includes(f.slot)
            ? `<div class="g-decal">
                <button class="btn sub" id="lf-decal">🎨 写真のデザインを3Dに貼る${f.decal ? "(位置合わせをやり直す)" : ""}</button>
                ${f.decal && f.decalNote ? `<p class="notice warn">${esc(f.decalNote)}</p>` : ""}
                ${f.decal ? `<p class="small">✓ 貼り付け済み。保存すると3Dに反映されます <button class="link danger" id="lf-decal-off">貼るのをやめる</button></p>` : `<p class="muted small">${DECAL_HELP[f.slot]}</p>`}
              </div>`
            : ""
        }
        ${field("brand", "メーカー", "text", "例:SHIMANO")}
        ${field("model", "モデル名", "text", "例:WH-R8170-C50")}
        ${field("year", "年式", "text", "例:2024")}
        <label class="g-field"><span>重量(公式)</span><span class="g-in"><input type="number" inputmode="decimal" data-lf="g" value="${esc(f.g)}" /><em>g</em></span></label>
        ${field("url", "公式ページのURL", "url", "https://")}
        <div class="g-paste">
          <p class="g-sub">📋 公式ページの仕様を貼り付けて読み取る</p>
          <textarea data-lf="paste" rows="4" placeholder="例:リムハイト 50mm / 重量 1,450g">${esc(f.paste)}</textarea>
          <button class="chip" id="lf-parse">読み取る</button>
          ${f.note ? `<p class="notice">${esc(f.note)}</p>` : ""}
        </div>
        ${specs ? `<p class="g-sub">寸法など(3Dと計算に反映)</p>${specs}` : ""}
        <label class="g-field"><span>メモ</span><input type="text" data-lf="notes" value="${esc(f.notes)}" placeholder="例:実測 1,463g" /></label>
        ${f.url ? `<p class="small"><a href="${esc(f.url)}" target="_blank" rel="noopener">公式ページを開く ↗</a></p>` : ""}
        <button class="btn start" id="lf-save" data-target="${f.id ? "" : G.active}">${f.id ? "保存(付けているバイクにも反映)" : `保存して${G.active === "current" ? "装着済み" : "NEW"}に付ける`}</button>
        <div class="g-row">
          ${f.id ? "" : `<button class="btn sub" id="lf-save-only">登録だけする</button>`}
          <button class="btn sub" id="lf-cancel">やめる</button>
        </div>
        ${f.id ? `<button class="link danger" id="lf-delete">このマイパーツを削除</button>` : ""}
      </section>`;
  }

  // マイパーツのフォームに写真を入れる(ファイル・ネットの画像・貼り付けた画像)
  async function setFormPhoto(file) {
    if (!libForm) return;
    try {
      const form = libForm;
      const blob = await Library.resize(file, 2400); // ロゴの文字まで見えるよう大きめに残す
      const id = "ph" + Date.now().toString(36);
      await Library.putPhoto(id, blob);
      if (libForm !== form) return; // 写真の準備中にフォームを閉じた
      if (libForm.photoId) Library.deletePhoto(libForm.photoId);
      libForm.photoId = id;
      libForm.decal = null; // 写真が変わったら位置合わせもやり直し
      libForm.web = null;
      photoUrls[id] = URL.createObjectURL(blob);
      // フレームの写真なら、色を拾ってフレームの色にする
      if (libForm.slot === "frame") libForm.color = await Library.dominantColor(blob).catch(() => null);
    } catch (err) {
      alert("写真を保存できませんでした");
      return renderPanel();
    }
    renderPanel();
    // ロゴ・塗装を3Dに貼れる部位なら、そのまま位置合わせへ
    if (DECAL_SLOTS.includes(libForm.slot)) return startDecal();
  }

  // ---------- ネットから写真を探す ----------
  const webQuery = (f) => [f.brand, f.model, f.year].map((x) => String(x || "").trim()).filter(Boolean).join(" ");

  // Wikimedia Commons(自由に使える写真の集まり)から探す
  async function searchWebPhotos() {
    const f = libForm;
    const q = webQuery(f);
    if (!q) return alert("先にメーカーかモデル名を入力してください");
    f.web = { status: "loading", q, items: [] };
    renderPanel();
    try {
      const url =
        "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=12" +
        "&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=320&gsrsearch=" +
        encodeURIComponent(q + " filetype:bitmap");
      const data = await (await fetch(url)).json();
      const pages = Object.values((data.query && data.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
      const strip = (h) => String(h || "").replace(/<[^>]*>/g, "").trim();
      f.web.items = pages
        .map((p) => p.imageinfo && p.imageinfo[0])
        .filter((ii) => ii && ii.thumburl)
        .map((ii) => ({
          thumb: ii.thumburl,
          url: ii.url,
          page: ii.descriptionurl,
          credit: [strip(ii.extmetadata && ii.extmetadata.Artist && ii.extmetadata.Artist.value), strip(ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value)].filter(Boolean).join(" / "),
        }));
      f.web.status = f.web.items.length ? "ok" : "none";
    } catch (e) {
      f.web.status = "error";
    }
    if (libForm === f) renderPanel();
  }

  // 画像のURLから取り込む。そのまま読めなければ、画像の中継サービス(wsrv.nl)を通す
  async function photoFromUrl(url) {
    const tryFetch = async (u) => {
      const res = await fetch(u, { mode: "cors" });
      if (!res.ok) throw new Error(res.status);
      const b = await res.blob();
      if (!/^image\//.test(b.type)) throw new Error("not image");
      return b;
    };
    let blob;
    try {
      blob = await tryFetch(url);
    } catch (e) {
      blob = await tryFetch("https://wsrv.nl/?output=jpg&w=2400&url=" + encodeURIComponent(url.replace(/^https?:\/\//, "")));
    }
    return setFormPhoto(blob);
  }

  function webPhotoHtml(f) {
    const q = webQuery(f);
    const g = "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(q || Parts.slotName(f.slot));
    const w = f.web;
    return `<div class="g-web">
      <div class="g-web-btns">
        <button class="btn sub" id="lf-web">🔎 ネットで写真を探す</button>
        <button class="btn sub" id="lf-url">🌐 画像のURLから</button>
        <button class="btn sub" id="lf-clip">📋 コピーした画像を貼る</button>
      </div>
      <p class="muted small">見つからないときは <a href="${g}" target="_blank" rel="noopener">Google画像検索</a> で、横から撮った写真を長押し(右クリック)→「画像をコピー」してから「📋 コピーした画像を貼る」を押してください。メーカーの商品ページの画像も同じように使えます(個人で見る用途に)。</p>
      ${
        w
          ? w.status === "loading"
            ? `<p class="small">「${esc(w.q)}」を探しています…</p>`
            : w.status === "error"
              ? `<p class="notice warn small">検索できませんでした。通信状況を確かめてください</p>`
              : w.status === "none"
                ? `<p class="small">「${esc(w.q)}」の自由に使える写真は見つかりませんでした。上の Google画像検索を使ってください</p>`
                : `<p class="small">Wikimedia Commons の写真(自由に使えるもの)。タップで取り込みます</p>
                   <div class="g-web-grid">${w.items
                     .map((it, i) => `<button class="g-web-item" data-web-pick="${i}"><img src="${esc(it.thumb)}" alt="" loading="lazy" /><small>${esc(it.credit || "")}</small></button>`)
                     .join("")}</div>`
          : ""
      }
    </div>`;
  }

  // 写真のデザインを3Dに貼る: 写真の上で基準の点をタップする
  async function startDecal() {
    const f = libForm;
    let url = photoUrls[f.photoId];
    if (!url) {
      const blob = await Library.getPhoto(f.photoId).catch(() => null);
      if (!blob) return alert("写真を読み込めませんでした");
      url = photoUrls[f.photoId] = URL.createObjectURL(blob);
    }
    if (f.slot === "frame") {
      // 写真に重ねて見せる3Dのフレームの線(今のバイクのジオメトリで)
      const bk = Fit.compute(Object.assign(input(G.active), { geo: Object.assign({}, B().geo, specGeo(f)) }), G.body, { coarse: true }).bike;
      const o = { x: 0, y: 0 };
      const outline = [
        [bk.rearAxle, o], [o, bk.stTop], [bk.stTop, bk.rearAxle], [o, bk.htBot], [bk.htBot, bk.htTop], [bk.htTop, bk.stTop], [bk.htBot, bk.frontAxle],
      ];
      // 位置合わせの点の見当: 写真いっぱいに、右向きのバイクが横から写っているとして置く
      const guess = (w, h) => {
        const left = bk.rearAxle.x - bk.R, right = bk.frontAxle.x + bk.R;
        const top = Math.max(bk.htTop.y, bk.stTop.y) + 0.05, bottom = bk.rearAxle.y - bk.R;
        const sc = Math.min((w * 0.9) / (right - left), (h * 0.9) / (top - bottom));
        const ox = w / 2 - ((left + right) / 2) * sc, oy = h / 2 + ((top + bottom) / 2) * sc;
        const P = (q) => ({ x: ox + q.x * sc, y: oy - q.y * sc });
        return { rearAxle: P(bk.rearAxle), bb: P(o), htTop: P(bk.htTop) };
      };
      Measure.open("frameAlign", {
        imageUrl: url,
        points: (f.decal && f.decal.pts) || guess,
        guessed: !f.decal,
        anchors: { rearAxle: bk.rearAxle, bb: o, htTop: bk.htTop },
        outline,
        circles: [Object.assign({ r: bk.R }, bk.rearAxle), Object.assign({ r: bk.R }, bk.frontAxle)],
        onDone: (res) => {
          libForm.decal = { kind: "frame", pts: res.pts, w: res.w, h: res.h };
          // 3Dのフレーム(と車輪)が写真からはみ出していないか
          const m = Measure.affine3([bk.rearAxle, o, bk.htTop], [res.pts.rearAxle, res.pts.bb, res.pts.htTop]);
          const pts = [bk.rearAxle, bk.frontAxle, bk.htTop, bk.stTop, o];
          const out = m && pts.some((q) => {
            const x = m[0] * q.x + m[1] * q.y + m[2], y = m[3] * q.x + m[4] * q.y + m[5];
            return x < 0 || y < 0 || x > res.w || y > res.h;
          });
          libForm.decalNote = out ? "フレームの一部が写真からはみ出しています。はみ出した所は写真の端の色になります。フレーム全体が写った写真がおすすめです。" : "";
          finishDecal();
        },
      });
    } else if (f.slot !== "wheels") {
      const kind = f.slot === "saddle" ? "saddle" : "bar";
      Measure.open(kind === "saddle" ? "saddleAlign" : "barAlign", {
        imageUrl: url,
        points:
          (f.decal && f.decal.pts) ||
          ((w, h) => (kind === "saddle" ? { nose: { x: w / 2, y: h * 0.1 }, tail: { x: w / 2, y: h * 0.9 } } : { barL: { x: w * 0.22, y: h * 0.72 }, barR: { x: w * 0.78, y: h * 0.72 } })),
        guessed: !f.decal,
        onDone: (res) => {
          libForm.decal = { kind, pts: res.pts, w: res.w, h: res.h };
          libForm.decalNote = "";
          finishDecal();
        },
      });
    } else {
      Measure.open("wheelAlign", {
        imageUrl: url,
        points:
          (f.decal && f.decal.pts) ||
          ((w, h) =>
            // 横長ならバイク全体の写真とみて後輪、正方形に近ければホイールだけの写真とみて真ん中
            w > h * 1.3
              ? { hub: { x: w * 0.21, y: h * 0.62 }, rimEdge: { x: w * 0.21, y: h * 0.62 - w * 0.165 } }
              : { hub: { x: w / 2, y: h / 2 }, rimEdge: { x: w / 2, y: h / 2 - Math.min(w, h) * 0.38 } }),
        guessed: !f.decal,
        onDone: (res) => {
          libForm.decal = { kind: "wheel", pts: res.pts, w: res.w, h: res.h };
          const r = Math.hypot(res.pts.rimEdge.x - res.pts.hub.x, res.pts.rimEdge.y - res.pts.hub.y) * 1.1; // タイヤの外側まで
          const h = res.pts.hub;
          libForm.decalNote =
            h.x - r < 0 || h.y - r < 0 || h.x + r > res.w || h.y + r > res.h
              ? "ホイールの一部が写真からはみ出しています。はみ出した所は写真の端の色になります。ホイール全体が写った写真がおすすめです。"
              : "";
          finishDecal();
        },
      });
    }
  }

  // 位置合わせが終わったら、そのまま保存して3Dに貼る(保存し忘れでロゴが出ないのを防ぐ)
  function finishDecal() {
    const f = libForm;
    if (!f || !(String(f.brand || "").trim() || String(f.model || "").trim())) return renderPanel();
    const note = f.decalNote;
    // どのバイクにも付いていなければ、いま見ているバイクに付ける
    const attached = f.id && Object.values(G.builds).some((b) => b.parts[f.slot] && b.parts[f.slot].libId === f.id);
    saveLibForm(attached ? null : G.active);
    if (note) alert(note);
  }

  // フォームに入っているジオメトリ(m)
  function specGeo(f) {
    const out = {};
    for (const sp of Library.SPEC_FIELDS.frame) {
      const v = f.specs && f.specs[sp.k];
      if (sp.to && sp.to.startsWith("geo.") && v !== "" && v != null && !isNaN(+v)) out[sp.to.slice(4)] = +v * (sp.scale || 1);
    }
    return out;
  }

  // フォームの内容をマイパーツに保存する。target があればそのバイクに付ける
  function saveLibForm(target) {
    const f = libForm;
    if (!f.brand.trim() && !f.model.trim()) return alert("メーカーかモデル名を入力してください");
    const item = {
      id: f.id || "lib" + Date.now().toString(36),
      slot: f.slot,
      brand: f.brand.trim(),
      model: f.model.trim(),
      year: String(f.year || "").trim(),
      g: parseFloat(f.g) || 0,
      url: f.url.trim(),
      notes: f.notes.trim(),
      specs: f.specs,
      photoId: f.photoId || null,
      color: f.color || null,
      decal: f.photoId && f.decal ? f.decal : null,
    };
    const i = G.library.findIndex((x) => x.id === item.id);
    if (i >= 0) G.library[i] = item;
    else G.library.push(item);
    Library.syncAll(G, item);
    if (target) Library.apply(G.builds[target], item);
    libForm = null;
    selected = item.slot;
    changed();
    renderAll();
    if (has3D) View3D.highlight(selected, true);
  }

  function exportLibrary() {
    const data = JSON.stringify({ app: "ride-calorie", version: 1, library: G.library }, null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    a.download = "my-parts.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // 読み込んだパーツ表の確認画面
  function importHtml() {
    const r = importRev;
    if (r.status) return `<section class="card g-libform"><h2>パーツ表を読み込み中</h2><p>${esc(r.status)}</p></section>`;
    const sum = r.rows.filter((x) => x.include).reduce((a, x) => a + (+x.g || 0), 0);
    const total = r.totals.length ? r.totals.reduce((a, t) => (t.g > a.g ? t : a)) : null;
    const slots = Parts.SLOTS.map((sl) => [sl.id, sl.name]);
    const covered = new Set(r.rows.filter((x) => x.include).map((x) => x.slot));
    return `
      <section class="card g-libform" id="import-rev">
        <h2>読み込んだパーツ <span class="g-total">${r.rows.length}件</span></h2>
        <p class="muted small">部位は名前から推定しています。違っていたら直してください。チェックを外した行は登録しません。</p>
        <div class="g-imp">
          ${r.rows
            .map(
              (x, i) => `
            <div class="g-imp-row ${x.include ? "" : "off"}">
              <input type="checkbox" data-imp="include" data-i="${i}" ${x.include ? "checked" : ""} />
              <div class="g-imp-main">
                <input type="text" data-imp="name" data-i="${i}" value="${esc(x.name)}" />
                <div class="g-imp-sub">
                  <select data-imp="slot" data-i="${i}">${slots.map(([v, t]) => `<option value="${v}" ${v === x.slot ? "selected" : ""}>${t}</option>`).join("")}</select>
                  <span class="g-in"><input type="number" inputmode="decimal" data-imp="g" data-i="${i}" value="${x.g}" /><em>g</em></span>
                </div>
                ${x.note ? `<small>${esc(x.note)}</small>` : ""}
              </div>
            </div>`
            )
            .join("")}
        </div>
        <p class="g-imp-sum">合計 <b>${sum.toLocaleString()}g</b>${
          total ? `(表の「${esc(total.name)}」${total.g.toLocaleString()}g ${Math.abs(total.g - sum) < 2 ? "と一致 ✓" : `と${(sum - total.g).toLocaleString()}g違います`})` : ""
        }</p>
        <label class="check"><input type="checkbox" id="imp-unmount" ${covered.size >= 8 ? "checked" : ""} /><span>表にない部位は外す<small>表がバイク全体のパーツなら、表にない部位(目安のパーツ)を重さに入れないようにします</small></span></label>
        <button class="btn start" id="imp-apply" data-target="current">マイパーツに登録して装着済みに反映</button>
        <div class="g-row">
          <button class="btn sub" id="imp-apply-next" data-target="next">NEWに反映</button>
          <button class="btn sub" id="imp-only">登録だけする</button>
          <button class="btn sub" id="imp-cancel">やめる</button>
        </div>
      </section>`;
  }

  function startImportText(text) {
    const r = Importer.parse(text);
    if (!r.rows.length) {
      importRev = null;
      renderPanel();
      return alert("パーツ名と重さ(数字)の並んだ行が見つかりませんでした");
    }
    importRev = r;
    pasteOpen = false;
    renderPanel();
    const el2 = document.getElementById("import-rev");
    if (el2) el2.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function startImportImage(file) {
    importRev = { rows: [], totals: [], status: "写真の文字を読み取っています…(初回は文字認識のデータを読み込むので、少し時間がかかります)" };
    renderPanel();
    try {
      const text = await Importer.ocr(file, (p) => {
        importRev.status = `写真の文字を読み取っています… ${Math.round(p * 100)}%`;
        const card = document.querySelector(".g-libform p");
        if (card) card.textContent = importRev.status;
      });
      startImportText(text);
    } catch (e) {
      importRev = null;
      renderPanel();
      alert("写真の文字を読み取れませんでした。通信状況を確認するか、表をコピーして「表を貼り付ける」から読み込んでください");
    }
  }

  // 確認した行をマイパーツに登録し、target のバイクに反映する
  function applyImport(target, unmountMissing) {
    const rows = importRev.rows.filter((x) => x.include && x.name.trim());
    const items = rows.map((x, i) => ({
      id: "lib" + Date.now().toString(36) + i,
      slot: x.slot,
      brand: "",
      model: x.name.trim(),
      year: "",
      g: +x.g || 0,
      url: "",
      notes: x.note || "",
      specs: Importer.attrsFrom(x.slot, x.name + " " + (x.note || "")),
      photoId: null,
    }));
    G.library.push(...items);
    if (target) {
      const b = G.builds[target];
      const bySlot = {};
      for (const it of items) (bySlot[it.slot] = bySlot[it.slot] || []).push(it);
      for (const [slot, list] of Object.entries(bySlot)) {
        if (list.length === 1) Library.apply(b, list[0]);
        else {
          // 同じ部位が複数あれば(クランク+BB+…など)、まとめて1つのパーツにする
          const prev = b.parts[slot] || {};
          const attrs = Object.assign({}, prev.attrs || {});
          for (const it of list) Object.assign(attrs, it.specs);
          b.parts[slot] = {
            name: list.length > 2 ? `${list[0].model}ほか${list.length - 1}点` : list.map((x) => x.model).join("+"),
            g: list.reduce((a, x) => a + x.g, 0),
            attrs,
            components: list.map((x) => ({ libId: x.id, name: x.model, g: x.g })),
            mounted: true,
          };
        }
      }
      // 一体型ハンドルならステムは0g
      const bar = b.parts.handlebar;
      if (bar && bar.attrs && bar.attrs.type === "integrated" && !bySlot.stem) b.parts.stem = { name: "(一体型ハンドルに含む)", g: 0, mounted: true };
      if (unmountMissing) {
        for (const sl of Parts.SLOTS) {
          if (!bySlot[sl.id] && b.parts[sl.id] && !(sl.id === "stem" && bar && bar.attrs && bar.attrs.type === "integrated")) b.parts[sl.id].mounted = false;
        }
      }
      G.active = target;
    }
    importRev = null;
    changed();
    renderAll();
    alert(`${items.length}件のパーツをマイパーツに登録しました${target ? `(${target === "current" ? "装着済み" : "NEW"}に反映)` : ""}`);
  }

  async function importLibrary(file) {
    const name = (file.name || "").toLowerCase();
    if (/^image\//.test(file.type) || /\.(jpe?g|png)$/.test(name)) return startImportImage(file);
    if (!/\.json$/.test(name) && file.type !== "application/json") return startImportText(await file.text());
    try {
      const data = JSON.parse(await file.text());
      const list = Array.isArray(data.library) ? data.library : [];
      let n = 0;
      for (const it of list) {
        if (!it || !it.id || !it.slot || !Parts.SLOTS.some((s) => s.id === it.slot)) continue;
        // 写真はファイルに含まれないので、この端末にある同じマイパーツの写真は残す
        const i = G.library.findIndex((x) => x.id === it.id);
        it.photoId = i >= 0 ? G.library[i].photoId || null : null;
        if (i >= 0) G.library[i] = it;
        else G.library.push(it);
        Library.syncAll(G, it);
        n++;
      }
      changed();
      renderPanel();
      alert(`${n}件のマイパーツを読み込みました`);
    } catch (e) {
      alert("読み込めませんでした。書き出したファイルを選んでください");
    }
  }

  // 数値入力。scale は保存値→表示値(m→mmなら1000)
  function num(path, label, value, unit, step = 1, scale = 1, min, max) {
    // 体の寸法の 0 は「身長から自動で計算」なので、空欄にして「自動」と表示する
    const blank = path.startsWith("body.") && !value;
    const shown = blank ? "" : Math.round(value * scale * 10) / 10;
    return `<label class="g-field"><span>${label}</span><span class="g-in"><input type="number" inputmode="decimal" data-path="${path}" data-scale="${scale}" value="${shown}" ${blank ? 'placeholder="自動"' : ""} step="${step}" ${min != null ? `min="${min}"` : ""} ${max != null ? `max="${max}"` : ""} /><em>${unit}</em></span></label>`;
  }

  function sel(path, label, value, options) {
    return `<label class="g-field"><span>${label}</span><select data-path="${path}">${options
      .map(([v, t]) => `<option value="${v}" ${String(v) === String(value) ? "selected" : ""}>${t}</option>`)
      .join("")}</select></label>`;
  }

  function editor(id) {
    const b = B();
    const p = b.parts[id] || { name: "", g: 0, attrs: {} };
    const a = p.attrs || {};
    const presets = Parts.PRESETS[id] || [];
    const mine = G.library.filter((x) => x.slot === id);
    const linked = p.libId ? libItem(p.libId) : null;
    if (id === "stem" && barIntegrated(b))
      return `<p class="muted small">ハンドルが一体型(ステム込み)なので、ステムはハンドルの一部として3Dに表示し、重さもハンドルに含めています。ステムの長さ・角度は「フィッティング」で変えられます。単体のステムに替えるときは、ハンドルの形を「丸ハンドル」か「エアロ」にしてください。</p>`;
    let html = `
      ${
        linked
          ? `<div class="g-linked">${photoTag(linked.photoId)}<div><small>📘 マイパーツの数値を使っています</small><strong>${esc(Library.displayName(linked))}</strong></div><button class="link" data-lib-edit="${linked.id}">編集</button></div>`
          : ""
      }
      ${
        mine.length
          ? `<label class="g-field"><span>マイパーツから選ぶ</span><select data-lib-pick="${id}"><option value="">— 選ぶ —</option>${mine
              .map((x) => `<option value="${x.id}" ${x.id === p.libId ? "selected" : ""}>${esc(Library.displayName(x))}(${(+x.g || 0).toLocaleString()}g)</option>`)
              .join("")}</select></label>`
          : ""
      }
      ${
        p.components && p.components.length
          ? `<div class="g-comp"><small>内訳(${p.components.length}点)</small>${p.components.map((c) => `<div><span>${esc(c.name)}</span><b>${(+c.g).toLocaleString()}g</b></div>`).join("")}</div>`
          : ""
      }
      ${p.shop ? `<p class="small g-shopinfo">🏷️ ${esc(Catalog.priceText(Catalog.byId(p.shop.id) || { price: p.shop.price, used: p.shop.used }))}(目安)</p>` : ""}
      ${catalogHtml(id)}
      <button class="btn sub" data-lib-new="${id}">📘 公式データを入力してマイパーツに登録</button>
      <label class="g-field"><span>目安から選ぶ</span><select data-preset="${id}">
        <option value="">— 選ぶ —</option>
        ${presets.map((x, i) => `<option value="${i}">${esc(x.name)}(${x.g.toLocaleString()}g)</option>`).join("")}
      </select></label>
      <label class="g-field"><span>名前</span><input type="text" data-path="parts.${id}.name" value="${esc(p.name)}" maxlength="40" /></label>
      ${num(`parts.${id}.g`, "重さ", +p.g || 0, "g", 1)}`;
    if (id === "frame") {
      html += sel(`parts.frame.attrs.aero`, "形", a.aero || "round", [["round", "丸パイプ"], ["aero", "エアロ"]]);
      html += `<label class="g-field"><span>色</span><input type="color" data-path="color" value="${esc(b.color)}" /></label>`;
      html += `<p class="g-sub">ジオメトリ(メーカーのジオメトリ表の値)</p>`;
      html += num("geo.stack", "スタック", b.geo.stack, "mm", 1, 1000);
      html += num("geo.reach", "リーチ", b.geo.reach, "mm", 1, 1000);
      html += num("geo.headAngle", "ヘッド角", b.geo.headAngle, "°", 0.1);
      html += num("geo.headTube", "ヘッドチューブ長", b.geo.headTube, "mm", 1, 1000);
      html += num("geo.seatAngle", "シート角", b.geo.seatAngle, "°", 0.1);
      html += num("geo.seatTube", "シートチューブ長", b.geo.seatTube, "mm", 1, 1000);
      html += num("geo.chainstay", "チェーンステー長", b.geo.chainstay, "mm", 1, 1000);
      html += num("geo.bbDrop", "BBドロップ", b.geo.bbDrop, "mm", 1, 1000);
      html += num("geo.forkOffset", "フォークオフセット", b.geo.forkOffset, "mm", 1, 1000);
    }
    if (id === "wheels") {
      html += num(`parts.wheels.attrs.rimFront`, "前のリム高", a.rimFront || 25, "mm");
      html += num(`parts.wheels.attrs.rimRear`, "後ろのリム高", a.rimRear || 25, "mm");
      html += sel(`parts.wheels.attrs.discRear`, "後輪ディスク", a.discRear ? "1" : "", [["", "いいえ"], ["1", "はい"]]);
    }
    if (id === "tires") html += num(`parts.tires.attrs.width`, "タイヤ幅", a.width || 28, "mm");
    if (id === "handlebar") {
      html += sel(`parts.handlebar.attrs.type`, "形", a.type || "round", [["round", "丸ハンドル"], ["aero", "エアロ(平たい上部)"], ["integrated", "一体型(ステム込み)"]]);
      html += num("pos.barWidth", "幅(芯-芯)", b.pos.barWidth, "mm", 10, 1000);
      html += num("pos.barReach", "リーチ", b.pos.barReach, "mm", 5, 1000);
      html += num("pos.barDrop", "ドロップ", b.pos.barDrop, "mm", 5, 1000);
    }
    if (id === "stem") {
      html += num("pos.stemLength", "長さ", b.pos.stemLength, "mm", 10, 1000);
      html += sel("pos.stemAngle", "角度", b.pos.stemAngle, [-17, -10, -8, -6, 0, 6, 8, 10, 17].map((x) => [x, (x > 0 ? "+" : "") + x + "°"]));
      html += num("pos.spacers", "コラムスペーサー", b.pos.spacers, "mm", 5, 1000);
    }
    if (id === "groupset") html += sel("pos.crank", "クランク長", b.pos.crank, [0.16, 0.165, 0.17, 0.1725, 0.175].map((x) => [x, (x * 1000).toFixed(1).replace(".0", "") + "mm"]));
    if (id === "saddle" || id === "seatpost") {
      html += num("pos.saddleHeight", "サドル高(BB中心〜上面)", b.pos.saddleHeight, "mm", 5, 1000);
      html += num("pos.saddleSetback", "前後位置(+で前)", b.pos.saddleSetback, "mm", 5, 1000);
    }
    if (id === "cages") html += sel(`parts.cages.attrs.bottles`, "ボトル", a.bottles != null ? a.bottles : 1, [[0, "なし"], [1, "1本"], [2, "2本"]]);
    if (id === "accessories") html += sel(`parts.accessories.attrs.extras`, "付けている物の数", a.extras || 0, [[0, "なし"], [1, "1つ"], [2, "2つ"], [3, "3つ以上"]]);
    return html;
  }

  // ---------- フィッティング ----------
  function fitPanel() {
    const b = B();
    const r = calc().fit;
    const tg = Fit.targets(G.body, G.goal);
    const body = G.body;
    const ang = r.angles;
    const row = (k, val, unit, fmtv) => {
      const t = tg[k];
      const j = Fit.judge(val, t);
      const range = k === "kops" ? `${mm(t.ok[0])}〜+${mm(t.ok[1])}mm` : t.ok[1] >= 180 ? `${t.ok[0]}°以上` : `${t.ok[0]}〜${t.ok[1]}°`;
      return `<tr class="${j}"><td><i></i>${t.label}</td><td>${fmtv(val)}${unit}</td><td>${range}</td></tr>`;
    };
    const cm = (k, label, val) => num(`body.${k}`, label, val || 0, "cm", 0.5, 100);
    const sug = suggestion;
    return `
      ${measureCard()}
      <section class="card">
        <h2>体の寸法</h2>
        <p class="muted small">空欄(0)は身長から一般的な比率で計算します。測れる所だけ入れればOKです。</p>
        ${cm("height", "身長", body.height)}
        ${num("body.weight", "体重", body.weight, "kg", 0.1)}
        ${cm("inseam", "股下", body.inseam)}
        ${cm("sitting", "座高", body.sitting)}
        ${cm("arm", "腕の長さ(肩先〜手首)", body.arm)}
        ${cm("shoulder", "肩幅(肩先〜肩先)", body.shoulder)}
        ${cm("foot", "足のサイズ", body.foot)}
        ${sel("body.flex", "前屈", body.flex, [["stiff", "床に手が届かない"], ["normal", "指先が床に届く"], ["soft", "手のひらが床につく"]])}
        ${sel("body.backPain", "腰痛", body.backPain ? "1" : "", [["", "なし"], ["1", "あり"]])}
        <details class="g-more" ${body.thighLen || body.thighCirc ? "open" : ""}>
          <summary>各部の長さと太さ(写真で測った値・メジャーで測った値)</summary>
          <p class="muted small">長さは「立った写真で測る」で自動で入ります。太さはメジャーで測った周囲の長さを入れると、3Dの体の形と空気抵抗の計算が正確になります。</p>
          ${cm("thighLen", "太もも(股関節〜膝)", body.thighLen)}
          ${cm("shankLen", "すね(膝〜くるぶし)", body.shankLen)}
          ${cm("torsoLen", "胴(股関節〜肩)", body.torsoLen)}
          ${cm("upperArmLen", "上腕(肩〜肘)", body.upperArmLen)}
          ${cm("forearmLen", "前腕(肘〜手首)", body.forearmLen)}
          ${cm("thighCirc", "太もも周り(いちばん太い所)", body.thighCirc)}
          ${cm("calfCirc", "ふくらはぎ周り", body.calfCirc)}
          ${cm("chest", "胸囲", body.chest)}
          ${cm("waist", "ウエスト", body.waist)}
          ${cm("armCirc", "二の腕周り", body.armCirc)}
        </details>
      </section>
      <section class="card">
        <h2>ポジション(${B() === G.builds.current ? "装着済み" : "NEW"})</h2>
        ${num("pos.saddleHeight", "サドル高(BB中心〜上面)", b.pos.saddleHeight, "mm", 5, 1000)}
        ${num("pos.saddleSetback", "サドル前後(+で前)", b.pos.saddleSetback, "mm", 5, 1000)}
        ${num("pos.spacers", "コラムスペーサー", b.pos.spacers, "mm", 5, 1000)}
        ${num("pos.stemLength", "ステム長", b.pos.stemLength, "mm", 10, 1000)}
        ${sel("pos.stemAngle", "ステム角度", b.pos.stemAngle, [-17, -10, -8, -6, 0, 6, 8, 10, 17].map((x) => [x, (x > 0 ? "+" : "") + x + "°"]))}
        ${sel("pos.hands", "持つ位置", b.pos.hands, [["tops", "上ハンドル"], ["hoods", "ブラケット"], ["drops", "下ハンドル"]])}
        ${num("pos.elbow", "肘の曲げ", b.pos.elbow, "°", 5)}
      </section>
      <section class="card">
        <h2>関節の角度</h2>
        <table class="g-angles">
          <tr><th>項目</th><th>いま</th><th>目安</th></tr>
          ${row("kneeExt", ang.kneeExt, "°", (x) => x.toFixed(0))}
          ${row("kneeTop", ang.kneeTop, "°", (x) => x.toFixed(0))}
          ${row("hip", ang.hip, "°", (x) => x.toFixed(0))}
          ${row("torso", ang.torso, "°", (x) => x.toFixed(0))}
          ${row("shoulder", ang.shoulder, "°", (x) => x.toFixed(0))}
          ${row("kops", ang.kops, "mm", (x) => (x >= 0 ? "+" : "") + mm(x))}
        </table>
        ${ang.reachGap > 0 ? `<p class="notice warn">ハンドルが遠く、腕が届きません(約${mm(ang.reachGap)}mm)。ステムを短くするか、肘の曲げを小さくしてください。</p>` : ""}
        ${r.pose.legs.R.reachable ? "" : `<p class="notice warn">サドルが高すぎて、ペダルに足が届いていません。</p>`}
        <p class="muted small">目安は一般的なロードバイクのフィッティングの考え方にもとづく範囲です。痛みや違和感がある場合は、専門店でのフィッティングをおすすめします。</p>
      </section>
      <section class="card">
        <h2>自動で調整</h2>
        ${sel("goal", "優先すること", G.goal, [["comfort", "楽さ・腰へのやさしさ"], ["balance", "バランス"], ["aero", "速さ(空気抵抗)"]])}
        <button class="btn start" id="optimize">🔧 最適なポジションを探す</button>
        ${
          sug
            ? `<div class="g-sug">
                ${sug.changes.length ? `<ul>${sug.changes.map((c) => `<li>${c}</li>`).join("")}</ul>` : `<p>今のポジションが、目安にいちばん近い状態です。</p>`}
                <p class="muted small">調整後: 上体 ${sug.after.angles.torso.toFixed(0)}°・股関節 ${sug.after.angles.hip.toFixed(0)}°・膝 ${sug.after.angles.kneeExt.toFixed(0)}°・CdA ${sug.after.cda.total.toFixed(3)}</p>
                ${sug.changes.length ? `<div class="g-row"><button class="btn sub" id="apply-sug">このバイクに反映</button><button class="btn sub" id="apply-sug-next">NEWに反映して比べる</button></div>` : ""}
              </div>`
            : ""
        }
      </section>`;
  }

  // ---------- 写真で測る ----------
  const CRANKS = [
    [180, "一番下(6時)"],
    [90, "前(3時)"],
    [0, "一番上(12時)"],
    [270, "後ろ(9時)"],
  ];

  function measureCard() {
    const m = G.measure || {};
    const st = m.standing;
    const rd = m.riding;
    let standingHtml = "";
    if (st) {
      const rows = [
        ["inseam", "股下"],
        ["thighLen", "太もも"],
        ["shankLen", "すね"],
        ["torsoLen", "胴"],
        ["upperArmLen", "上腕"],
        ["forearmLen", "前腕"],
      ];
      standingHtml = `
        <p class="g-sub">立った写真の結果(${new Date(st.at).toLocaleDateString("ja-JP")})</p>
        <table class="g-table"><tr>${rows.map(([, l]) => `<th>${l}</th>`).join("")}</tr><tr>${rows
          .map(([k]) => `<td>${(st.values[k] * 100).toFixed(1)}cm</td>`)
          .join("")}</tr></table>
        <button class="btn sub" id="ms-apply">${st.applied ? "✓ 体の寸法に反映済み(もう一度反映する)" : "この長さを体の寸法に反映する"}</button>`;
    }
    let ridingHtml = "";
    if (rd) {
      const model = Fit.anglesAt(input(G.active), G.body, rd.crank);
      const tg = Fit.targets(G.body, G.goal);
      const rows = [
        ["knee", "膝", rd.crank === 180 ? tg.kneeExt : null],
        ["hip", "股関節", null],
        ["torso", "上体(水平から)", tg.torso],
        ["shoulder", "肩(胴と腕)", tg.shoulder],
        ["elbow", "肘の曲げ", null],
      ];
      const notes = [];
      const dk = rd.angles.knee - model.knee;
      if (Math.abs(dk) >= 4) notes.push(`膝の角度が、アプリの計算より${Math.abs(dk).toFixed(0)}°${dk > 0 ? "伸びて" : "曲がって"}います。サドル高の入力値か、体の寸法(股下・太もも・すね)を確かめてください。`);
      const dt = rd.angles.torso - model.torso;
      if (Math.abs(dt) >= 5) notes.push(`上体が、アプリの計算より${Math.abs(dt).toFixed(0)}°${dt > 0 ? "起きて" : "倒れて"}います。ハンドル周りの寸法か、肘の曲げ(写真では${rd.angles.elbow.toFixed(0)}°)を確かめてください。`);
      if (Math.abs(rd.angles.tilt) > 3) notes.push(`写真が${Math.abs(rd.angles.tilt).toFixed(0)}°傾いていましたが、前後の車軸を基準に補正しています。`);
      ridingHtml = `
        <p class="g-sub">乗った写真の結果(ペダル: ${CRANKS.find((c) => c[0] === rd.crank)[1]})</p>
        <table class="g-angles">
          <tr><th>項目</th><th>写真</th><th>アプリの計算</th><th>目安</th></tr>
          ${rows
            .map(([k, label, t]) => {
              const v = rd.angles[k];
              const j = t ? Fit.judge(v, t) : "";
              const range = t ? (t.ok[1] >= 180 ? `${t.ok[0]}°以上` : `${t.ok[0]}〜${t.ok[1]}°`) : "—";
              return `<tr class="${j}"><td>${t ? "<i></i>" : ""}${label}</td><td>${v.toFixed(0)}°</td><td>${model[k].toFixed(0)}°</td><td>${range}</td></tr>`;
            })
            .join("")}
        </table>
        ${notes.map((n) => `<p class="notice">${n}</p>`).join("")}
        ${rd.angles.elbow != null ? `<button class="btn sub" id="ms-elbow">写真の肘の曲げ(${rd.angles.elbow.toFixed(0)}°)をポジションに使う</button>` : ""}`;
    }
    return `
      <section class="card">
        <h2>📸 写真で測る</h2>
        <p class="muted small">写真の上で関節をタップすると、体の長さや、乗っているときの実際の角度を測れます。専門店の2Dフィッティングと同じ考え方です。</p>
        <button class="btn sub" id="ms-standing">🧍 立った写真で体の寸法を測る</button>
        ${standingHtml}
        <div class="g-row g-ms-ride">
          ${sel("measureCrank", "写真のペダルの位置", (rd && rd.crank) != null ? rd.crank : 180, CRANKS)}
        </div>
        <button class="btn sub" id="ms-riding">🚴 乗った写真で角度を測る</button>
        ${ridingHtml}
      </section>`;
  }

  function startMeasure(mode) {
    const crankSel = document.querySelector('[data-path="measureCrank"]');
    const crank = crankSel ? +crankSel.value : 180;
    Measure.open(mode, {
      height: G.body.height,
      onDone: (res) => {
        G.measure = G.measure || {};
        if (mode === "standing") G.measure.standing = { at: Date.now(), values: res, applied: false };
        else G.measure.riding = { at: Date.now(), crank, angles: res };
        save();
        renderPanel();
      },
    });
  }

  function runOptimize() {
    const before = Object.assign({}, Fit.DEFAULT_POS, B().pos);
    const o = Fit.optimize(input(G.active), G.body, G.goal);
    const changes = [];
    const lab = { saddleHeight: "サドル高", saddleSetback: "サドル前後", spacers: "コラムスペーサー", stemLength: "ステム長" };
    for (const k of Object.keys(lab)) {
      const d = mm(o.pos[k] - before[k]);
      if (d) changes.push(`${lab[k]}: ${mm(before[k])} → ${mm(o.pos[k])}mm(${d > 0 ? "+" : ""}${d})`);
    }
    if (o.pos.stemAngle !== before.stemAngle) changes.push(`ステム角度: ${before.stemAngle}° → ${o.pos.stemAngle}°`);
    suggestion = { pos: o.pos, after: o.result, changes };
  }

  // ---------- 空力 ----------
  function aeroPanel() {
    const c = calc();
    const fit = c.fit;
    const parts = Fit.bikeCdaParts(Parts.aeroOf(B().parts));
    const items = [
      ["体(ライダー)", fit.cda.rider],
      ["フレーム・フォーク", parts.frame],
      ["ホイール", parts.wheels],
      ["ハンドル・ケーブル", parts.bar],
      ["タイヤ(太さ)", parts.tires],
      ["ボトル・その他", parts.others],
    ];
    const max = Math.max(...items.map((x) => x[1]));
    const pw = (kmh) => Math.round((Fit.performance(fit.cda.total, G.body.weight + c.bikeKg, c.rot).watts30 / Math.pow(30 / 3.6, 1)) * 0); // 未使用
    void pw;
    const g = 9.81;
    const mass = G.body.weight + c.bikeKg;
    const power = (kmh) => Math.round(((kmh / 3.6) * mass * g * 0.005 + 0.5 * 1.2 * fit.cda.total * Math.pow(kmh / 3.6, 3)) / 0.976);
    return `
      <section class="card">
        <h2>空気抵抗 CdA <span class="g-total">${fit.cda.total.toFixed(3)} m²</span></h2>
        <div class="g-bars">${items
          .map(([n, v]) => `<div class="g-bar"><span>${n}</span><div><i style="width:${Math.max(2, (v / max) * 100)}%"></i></div><b>${v.toFixed(3)}</b></div>`)
          .join("")}</div>
        <p class="muted small">体の空気抵抗は、3Dモデルを正面から見た面積(前面投影面積)に、姿勢に応じた係数を掛けて計算しています。機材は一般的な風洞試験の傾向から決めた目安です。流体計算(CFD)ではなく推定値です。</p>
      </section>
      <section class="card">
        <h2>正面から見た面積 <span class="g-total">${fit.frontal.area.toFixed(3)} m²</span></h2>
        <canvas id="silhouette" class="g-sil" width="260" height="300"></canvas>
        <div class="g-row g-chips">
          ${[["tops", "上ハン"], ["hoods", "ブラケット"], ["drops", "下ハン"]].map(([v, t]) => `<button class="chip ${B().pos.hands === v ? "on" : ""}" data-hands="${v}">${t}</button>`).join("")}
        </div>
        ${num("pos.elbow", "肘の曲げ", B().pos.elbow, "°", 5)}
        <p class="muted small">上の3Dで「乗車」にして「流れ」を押すと、空気の流れのイメージを表示します(体に当たる所が赤)。</p>
      </section>
      <section class="card">
        <h2>速度と必要なパワー(平地・無風)</h2>
        <table class="g-table">
          <tr><th>速度</th>${[25, 30, 35, 40].map((v) => `<th>${v}km/h</th>`).join("")}</tr>
          <tr><td>パワー</td>${[25, 30, 35, 40].map((v) => `<td>${power(v)}W</td>`).join("")}</tr>
        </table>
      </section>`;
  }

  function drawSilhouette() {
    const cv = document.getElementById("silhouette");
    if (!cv) return;
    const fa = calc().fit.frontal;
    const ctx = cv.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    ctx.clearRect(0, 0, cv.width, cv.height);
    const scale = Math.min(cv.width / (fa.nz * fa.cell + 0.1), cv.height / (fa.ny * fa.cell + 0.1));
    const ox = (cv.width - fa.nz * fa.cell * scale) / 2;
    const oy = cv.height - (cv.height - fa.ny * fa.cell * scale) / 2;
    ctx.fillStyle = css.getPropertyValue("--brand").trim() || "#0047ab";
    const px = Math.max(1, fa.cell * scale);
    for (let j = 0; j < fa.ny; j++) for (let i = 0; i < fa.nz; i++) if (fa.mask[j * fa.nz + i]) ctx.fillRect(ox + i * fa.cell * scale, oy - (j + 1) * fa.cell * scale, px + 0.5, px + 0.5);
    // 地面の線
    ctx.strokeStyle = css.getPropertyValue("--muted").trim() || "#888";
    ctx.beginPath();
    ctx.moveTo(10, oy + 2);
    ctx.lineTo(cv.width - 10, oy + 2);
    ctx.stroke();
  }

  // ---------- 比較 ----------
  function comparePanel() {
    const a = calc("current");
    const b = calc("next");
    const rows = [
      ["バイク重量", a.bikeKg, b.bikeKg, 2, "kg", true],
      ["ホイール外周の重さ", a.rot, b.rot, 2, "kg", true],
      ["空気抵抗 CdA", a.fit.cda.total, b.fit.cda.total, 3, "", true],
      ["200Wでの平地の速度", a.perf.speed200, b.perf.speed200, 1, "km/h", false],
      ["30km/hに必要なパワー", a.perf.watts30, b.perf.watts30, 0, "W", true],
      ["平地11kmの時間(150W)", a.perf.commute, b.perf.commute, 2, "分", true],
      ["5%の坂2km(250W)", a.perf.climb, b.perf.climb, 2, "分", true],
      ["0→30km/h加速(400W)", a.perf.accel, b.perf.accel, 2, "秒", true],
      ["上体の角度", a.fit.angles.torso, b.fit.angles.torso, 0, "°", null],
      ["股関節の角度", a.fit.angles.hip, b.fit.angles.hip, 0, "°", false],
      ["膝の伸び", a.fit.angles.kneeExt, b.fit.angles.kneeExt, 0, "°", null],
    ];
    const diffParts = Parts.SLOTS.filter((s) => {
      const x = G.builds.current.parts[s.id] || {};
      const y = G.builds.next.parts[s.id] || {};
      return x.name !== y.name || x.g !== y.g || x.mounted !== y.mounted;
    });
    return `
      <section class="card">
        <h2>マシン性能の比較</h2>
        <table class="g-table g-compare">
          <tr><th>項目</th><th>装着済み</th><th>NEW</th><th>差</th></tr>
          ${rows
            .map(
              ([n, x, y, d, u, low]) =>
                `<tr><td>${n}</td><td>${x.toFixed(d)}${u}</td><td>${y.toFixed(d)}${u}</td><td>${low == null ? `<span class="d same">${(y - x >= 0 ? "+" : "") + (y - x).toFixed(d)}</span>` : delta(x, y, d, "", low)}</td></tr>`
            )
            .join("")}
        </table>
        <p class="muted small">体重${G.body.weight}kg+バイクで計算。速度・時間は平地(または一定勾配)・無風の理論値です。</p>
      </section>
      <section class="card">
        <h2>違うパーツ</h2>
        ${
          diffParts.length
            ? diffParts
                .map((s) => {
                  const x = G.builds.current.parts[s.id] || {};
                  const y = G.builds.next.parts[s.id] || {};
                  return `<div class="g-diff"><small>${s.name}</small><div>${esc(x.mounted === false ? "(取り外し中)" : x.name)} <b>${(+x.g || 0).toLocaleString()}g</b></div><div>→ ${esc(y.mounted === false ? "(取り外し中)" : y.name)} <b>${(+y.g || 0).toLocaleString()}g</b> ${delta(+x.g || 0, +y.g || 0, 0, "g", true)}</div></div>`;
                })
                .join("")
            : `<p class="muted">パーツは同じです。「NEW」に切り替えてパーツを変えると、ここで比べられます。</p>`
        }
      </section>
      <section class="card">
        <h2>構成の管理</h2>
        <button class="btn sub" id="copy-to-next">装着済みをNEWにコピー</button>
        <button class="btn sub" id="promote">NEWを装着済みにする(パーツ交換した)</button>
        <button class="btn start" id="use-ride">装着済みの重量と空気抵抗を走行計算に使う</button>
        <p class="muted small">走行計算に使うと、消費カロリーとパワーの計算で、バイクの重さ(${kgTxt(a.bikeKg)})と空気抵抗(CdA ${a.fit.cda.total.toFixed(3)})をこの値にします。${Store.profile.useGarage ? "(いまはガレージの値を使っています)" : ""}</p>
      </section>`;
  }

  // ---------- パネルの描画と操作 ----------
  // 選んだ部位に実物の写真があれば、3Dの上に写真のカードを出す(どのモデルか一目でわかるように)
  async function renderPartCard() {
    if (!has3D) return;
    let card = document.getElementById("partcard");
    const p = selected && tab === "parts" ? B().parts[selected] : null;
    const it = p && p.libId ? libItem(p.libId) : null;
    if (!it || !it.photoId) {
      if (card) card.remove();
      return;
    }
    let url = photoUrls[it.photoId];
    if (!url) {
      const blob = await Library.getPhoto(it.photoId).catch(() => null);
      if (!blob) return;
      url = photoUrls[it.photoId] = URL.createObjectURL(blob);
    }
    if (!card) {
      stage.insertAdjacentHTML("beforeend", `<div class="g-partcard" id="partcard"></div>`);
      card = document.getElementById("partcard");
    }
    card.innerHTML = `<img src="${url}" alt="" /><span>${esc(Library.displayName(it))}</span>`;
  }

  // ---------- おすすめパーツの写真 ----------
  // AIがあれば製品写真を探して出す(一度見つけたら覚えておく)。なければ画像検索へのリンク
  function prodImg(it) {
    const c = AI.cachedImage(it.id);
    if (c && c.url) return `<a class="g-prod" href="${esc(c.page || c.url)}" target="_blank" rel="noopener"><img src="${esc(c.url)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('empty');this.remove()" /></a>`;
    if (AI.ready && !(c && !c.url)) return `<button class="g-prod empty" data-find-one="${it.id}">📷<small>AIで写真を探す</small></button>`;
    return `<a class="g-prod empty" href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(it.name)}" target="_blank" rel="noopener">🔎<small>写真を見る</small></a>`;
  }

  // 画面に出ている「探しています」の写真を、ひとつずつ探す
  let finding = false;
  async function fillProdImgs() {
    if (finding || !AI.ready) return;
    finding = true;
    try {
      for (;;) {
        const el2 = document.querySelector("[data-find-img]");
        if (!el2) break;
        const it = Catalog.byId(el2.dataset.findImg);
        el2.removeAttribute("data-find-img");
        if (!it) continue;
        try {
          await AI.findImage(it.id, it.name);
        } catch (e) {
          break; // キーの間違い・通信できないときは、続けて探さない
        }
        document.querySelectorAll(`[data-prod="${it.id}"]`).forEach((x) => (x.innerHTML = prodImg(it)));
      }
    } finally {
      finding = false;
    }
  }

  // ---------- 店員さん ----------
  // 部位ごとの具体的なモデル(重さ・中古相場)
  function catalogHtml(id) {
    const list = Catalog.forSlot(id);
    if (!list.length) return "";
    const b = B();
    return `<details class="g-cat" ${G.active === "next" || cell ? "open" : ""}><summary>🏷️ 具体的なモデルから選ぶ(重さ・中古相場つき)</summary>
      ${list
        .map((it) => {
          const sv = Catalog.saving(b, it);
          const on = Catalog.installed(b, it);
          return `<div class="g-cat-row"><span data-prod="${it.id}">${prodImg(it)}</span><div class="g-cat-txt">${on ? "" : previewHtml(it)}<strong>${esc(it.name)}</strong><small>${it.kind === "swap" ? `${it.g.toLocaleString()}g` : it.deltaG ? `−${it.deltaG}g` : ""}${sv > 0 && it.kind === "swap" ? `(−${sv}g)` : ""}・${esc(Catalog.priceText(it))}</small><small class="muted">${esc(it.note)}</small></div>
            ${on ? `<span class="g-tag">付いています</span>` : `<button class="btn sub" data-cat-put="${it.id}">付ける</button>`}</div>`;
        })
        .join("")}
      <p class="muted small">重さは公称値などの目安、価格は2026年10月時点の目安です。中古は状態で大きく変わります。</p>
    </details>`;
  }

  function clerkState() {
    if (!G.clerk) G.clerk = { hearing: null, maint: {}, editing: true };
    if (!G.clerk.maint) G.clerk.maint = {};
    return G.clerk;
  }

  function clerkContext() {
    const c = clerkState();
    const cur = G.builds.current;
    const k = calc("current");
    const plan = c.hearing ? Clerk.plan(cur, c.hearing, G.body) : null;
    return {
      current: cur,
      body: G.body,
      rides: Store.rides,
      maint: c.maint,
      plan,
      torso: k.fit.angles.torso,
      integrated: barIntegrated(cur),
      bikeKg: k.bikeKg,
      nextKg: Parts.totalGrams(G.builds.next.parts) / 1000,
    };
  }

  function clerkPanel() {
    const c = clerkState();
    const ctx = clerkContext();
    const say = Clerk.comments(ctx).slice(0, 3);
    const h = c.hearing || { budget: 30000, goals: G.body.backPain ? ["comfort", "light"] : ["light"], usedOk: true };
    const hearingHtml = `
      <section class="card g-hear">
        <h2>🧑‍🔧 ご相談</h2>
        <p class="small">いまのバイク(装着済み)を見て、予算の中で効くパーツから順番に選びます。${G.body.backPain ? "腰痛ありで登録されているので、腰が楽になるものを優先します。" : ""}</p>
        <p class="g-sub">ご予算は?</p>
        <div class="g-chips">${Clerk.BUDGETS.map((y) => `<button class="g-chip2 ${h.budget === y ? "on" : ""}" data-hear-budget="${y}">${y >= 10000 ? y / 10000 + "万円" : y + "円"}</button>`).join("")}
          <label class="g-in g-budget"><input type="number" inputmode="numeric" id="hear-budget" value="${h.budget}" step="1000" min="1000" /><em>円</em></label></div>
        <p class="g-sub">どうなりたいですか?(いくつでも)</p>
        ${Clerk.GOALS.map((g) => `<label class="check"><input type="checkbox" data-hear-goal="${g.id}" ${h.goals.includes(g.id) ? "checked" : ""} /><span>${g.label}</span></label>`).join("")}
        <label class="check"><input type="checkbox" id="hear-used" ${h.usedOk !== false ? "checked" : ""} /><span>中古でもいい<small>メルカリ・ヤフオク・中古店の相場で考えます</small></span></label>
        <button class="btn start" data-clerk="plan">この内容で相談する</button>
      </section>`;
    const row = (x, idx) => {
      const it = x.item;
      const inNext = Catalog.installed(G.builds.next, it);
      return `<div class="g-plan-row">
        <div class="g-plan-n">${idx}</div>
        <span data-prod="${it.id}" class="g-plan-img">${prodImg(it)}</span>
        <div class="g-plan-body">
          <small>${esc(Parts.slotName(it.slot))}${x.pinned ? ` <em class="g-mine">あなたが選んだ候補</em>` : ""}</small>${G.active === "current" && !Catalog.installed(B(), it) ? previewHtml(it) : ""}<strong>${esc(it.name)}</strong>
          <div class="g-plan-meta"><b>${x.reason ? esc(x.reason) : "—"}</b><span>${esc(Catalog.priceText(it))}</span></div>
          ${
            x.alts && x.alts.length > 1
              ? `<label class="g-field g-alt"><span>ほかの候補</span><select data-clerk-alt="${x.key}">${x.alts
                  .map((a) => `<option value="${a.item.id}" ${a.item.id === it.id ? "selected" : ""}>${esc(a.item.name)}(${a.saving > 0 ? `−${a.saving}g・` : ""}${Catalog.yen(a.cost)})</option>`)
                  .join("")}</select></label>`
              : ""
          }
          <p class="small muted">${esc(it.note)}</p>
          ${it.needsShop ? `<p class="notice warn small">取り付けの前に、お店で合うか確かめてください</p>` : ""}
          <div class="g-plan-btns">${inNext ? `<span class="g-tag">NEWに入っています</span>` : `<button class="btn sub" data-clerk-next="${it.id}">NEWに入れる</button>`}<button class="link" data-clerk-bought="${it.id}">買って付けた</button><button class="link danger" data-clerk-skip="${x.key}">この部位は替えない</button></div>
        </div></div>`;
    };
    const plan = ctx.plan;
    const planHtml = plan
      ? `<section class="card g-plan">
          <h2>📝 おすすめの順番 <span class="g-total">${Catalog.yen(plan.total)}</span></h2>
          <p class="small">ご予算 ${Catalog.yen(plan.budget)}・${plan.usedOk ? "中古あり" : "新品のみ"}・${(c.hearing.goals || []).map((g) => (Clerk.GOALS.find((x) => x.id === g) || {}).label || g).join("、")}</p>
          ${plan.items.length ? plan.items.map((x, i) => row(x, i + 1)).join("") : `<p class="muted">このご予算と目的で、今のバイクに効くパーツが見つかりませんでした。ご予算か目的を変えてみてください。</p>`}
          ${plan.items.length ? `<p class="g-plan-sum">ぜんぶ替えると <strong>−${plan.saved.toLocaleString()}g</strong>(${ctx.bikeKg.toFixed(2)} → ${(ctx.bikeKg - plan.saved / 1000).toFixed(2)}kg)</p>
            <button class="btn start" data-clerk="build">まとめてNEWに組む(3Dで見る)</button>` : ""}
          ${plan.over ? `<p class="notice warn small">選んだ候補で、ご予算を ${Catalog.yen(plan.over)} 超えています</p>` : ""}
          ${plan.later.length ? `<p class="g-sub">ご予算が増えたら</p>${plan.later.map((x) => `<p class="small">・${esc(x.item.name)} ${x.reason ? `(${esc(x.reason)})` : ""} ${esc(Catalog.priceText(x.item))}</p>`).join("")}` : ""}
          ${
            plan.others.length
              ? `<details class="g-cat"><summary>➕ ほかの部位も選ぶ(${plan.others.length})</summary>${plan.others
                  .map(
                    (o) => `<div class="g-cat-row"><div><small>${esc(Parts.slotName(o.slot))}${o.skipped ? "(替えないにしています)" : ""}</small><strong>${esc(o.best.item.name)}</strong><small>${o.reason ? esc(o.reason) + "・" : ""}${esc(Catalog.priceText(o.best.item))}</small></div>
                      <button class="btn sub" data-clerk-add="${o.key}" data-item="${o.best.item.id}">加える</button></div>`
                  )
                  .join("")}</details>`
              : ""
          }
          ${c.hearing.choices && Object.keys(c.hearing.choices).length ? `<button class="link" data-clerk="auto">選んだ候補をやめて、おまかせに戻す</button>` : ""}
          <p class="muted small">重さは公称値などの目安、価格は2026年10月時点の目安です。「買って付けた」を押すと装着済みに反映して、次の一手を考え直します。</p>
          <button class="link" data-clerk="edit">相談し直す</button>
        </section>`
      : "";
    const ms = Clerk.maintenance(Store.rides, c.maint);
    const maintHtml = `
      <section class="card g-maint">
        <h2>🔧 メカニックの整備メモ <span class="g-total">${Math.round(Clerk.totalKm(Store.rides)).toLocaleString()}km</span></h2>
        ${ms
          .map(
            (m) => `<div class="g-maint-row ${m.due ? "due" : ""}"><div><strong>${m.label}</strong><small>${m.never ? "まだ記録がありません" : m.km ? `前回から ${Math.round(m.sinceKm)}km / 目安 ${m.km.toLocaleString()}km` : `前回から ${Math.floor(m.sinceDays)}日 / 目安 ${m.days}日`}</small></div>
              <button class="btn sub" data-maint="${m.id}">${m.due ? "やった" : "やった"}</button></div>`
          )
          .join("")}
        <p class="muted small">距離は、このアプリで記録したライドの合計です。</p>
      </section>`;
    return `
      <section class="card g-clerk">
        <div class="g-clerk-head"><span class="g-clerk-face">🧑‍🔧</span><div><strong>メカニックの店員さん</strong><small>今日のひとこと</small></div></div>
        ${say.map((t) => `<p class="g-say">${esc(t)}</p>`).join("")}
      </section>
      ${!c.hearing || c.editing ? hearingHtml : ""}
      ${planHtml}
      ${ladderHtml()}
      ${maintHtml}
      ${shopsHtml()}`;
  }

  // ---------- 近くのメンテナンス店 ----------
  let shopForm = null;
  function shopsHtml() {
    const list = G.shops || [];
    const tel = (t) => String(t || "").replace(/[^\d+]/g, "");
    return `<section class="card g-shops">
        <h2>🏪 近くのメンテナンス店</h2>
        <p class="small">荻窪のまわりで、ロードバイクの整備を頼めるお店です。口コミはどこも数件と少ないので、作業の内容と工賃は電話で確かめてから持ち込みましょう。</p>
        <p class="muted small">使い分けの目安: ドロップ化などの改造 → ${esc((Shops.forJob(list, "custom")[0] || {}).name || "—")} ／ GIANTの相談 → ${esc((Shops.forJob(list, "giant")[0] || {}).name || "—")} ／ オーバーホール → ${esc((Shops.forJob(list, "overhaul")[0] || {}).name || "—")} ／ 急ぎのパンク → ${esc((Shops.forJob(list, "quick").slice(-1)[0] || {}).name || "—")}</p>
        ${list
          .map(
            (x) => `<div class="g-shop">
              <div class="g-shop-head"><strong>${esc(x.name)}</strong>${(x.tags || []).map((t) => `<em>${esc(t)}</em>`).join("")}</div>
              <small class="g-shop-addr">📍 ${esc(x.addr || "")}${x.hours ? `<br />🕘 ${esc(x.hours)}` : ""}</small>
              ${x.good ? `<p class="small">👍 ${esc(x.good)}</p>` : ""}
              ${x.note ? `<p class="small muted">📝 ${esc(x.note)}</p>` : ""}
              <label class="g-field"><span>自分のメモ</span><input type="text" data-shop-memo="${x.id}" value="${esc(x.memo || "")}" placeholder="例: 10/25 チェーン交換 ¥3,500" /></label>
              <div class="g-plan-btns">
                ${x.tel ? `<a class="btn sub" href="tel:${tel(x.tel)}">📞 ${esc(x.tel)}</a>` : ""}
                <a class="btn sub" href="${Shops.routeUrl(x)}" target="_blank" rel="noopener">🚲 行き方</a>
                <a class="link" href="${Shops.mapUrl(x)}" target="_blank" rel="noopener">地図</a>
                ${x.src ? `<a class="link" href="${esc(x.src)}" target="_blank" rel="noopener">情報元</a>` : ""}
                <button class="link danger" data-shop-del="${x.id}">消す</button>
              </div></div>`
          )
          .join("")}
        ${
          shopForm
            ? `<div class="g-shop g-shop-form">
                <label class="g-field"><span>店名</span><input type="text" id="shop-name" value="${esc(shopForm.name)}" /></label>
                <label class="g-field"><span>住所</span><input type="text" id="shop-addr" value="${esc(shopForm.addr)}" /></label>
                <label class="g-field"><span>電話</span><input type="tel" id="shop-tel" value="${esc(shopForm.tel)}" /></label>
                <label class="g-field"><span>メモ</span><input type="text" id="shop-note" value="${esc(shopForm.note)}" /></label>
                <div class="g-plan-btns"><button class="btn sub" data-shop="save">追加する</button><button class="link" data-shop="cancel">やめる</button></div>
              </div>`
            : `<div class="g-plan-btns"><button class="btn sub" data-shop="new">＋ お店を追加</button>${list.length < Shops.DEFAULTS.length ? `<button class="link" data-shop="restore">消したおすすめを戻す</button>` : ""}</div>`
        }
        <p class="muted small">2026年10月にネットの店舗情報と口コミから調べました。営業時間・定休日は変わることがあります。</p>
      </section>`;
  }

  // ---------- コスパ順のアップグレード計画(1円あたりの軽量化・Sランクまでの値段) ----------
  function ladderOf() {
    const h = clerkState().hearing;
    const usedOk = !h || h.usedOk !== false;
    const scoreOf = (b) => {
      const st = statsOf(b);
      return { total: st.total, rank: st.rank, kg: Parts.totalGrams(b.parts) / 1000 };
    };
    return Object.assign(Clerk.ladder(G.builds.current, usedOk, scoreOf), { usedOk });
  }

  function ladderHtml() {
    const L = ladderOf();
    const rk = (r) => `<b class="ac-rank r-${r}">${r}</b>`;
    const head =
      L.start.rank === "S"
        ? `<p class="g-plan-sum">いまのバイクで、もう <strong>Sランク</strong>(${L.start.total}点)です!</p>`
        : L.sCost != null
          ? `<p class="g-plan-sum">Sランクまで <strong>${Catalog.yen(L.sCost)}</strong>(${L.sAt + 1}点替える)</p>`
          : `<p class="g-plan-sum">カタログのパーツだけでは、Sランク(800点)に届きません。ぜんぶ替えて ${rk(L.top.rank)} ${L.top.total}点(あと${800 - L.top.total}点)</p>
             <p class="muted small">残りは、フィッティング(姿勢を低く・空気抵抗を小さく)か、体重を落とすと上がります。</p>`;
    const rows = L.steps
      .map(
        (x, i) => `<div class="g-ladder-row ${i === L.sAt ? "goal" : ""}">
          <div class="g-plan-n">${i + 1}</div>
          <div class="g-plan-body">
            <small>${esc(Parts.slotName(x.item.slot))}${x.phase === "score" ? "・点を上げる" : ""}</small><strong>${esc(x.item.name)}</strong>
            <div class="g-plan-meta"><b>${x.save > 0 ? `−${x.save}g` : `+${x.gain}点`}・${Catalog.yen(x.cost)}${x.save > 0 ? `・<em>${x.gpk.toFixed(1)}g/千円</em>` : ""}</b>
              <span>累計 ${Catalog.yen(x.cum)} → ${x.after.kg.toFixed(2)}kg・${x.after.total}点 ${rk(x.after.rank)}${x.rankUp ? `<em class="g-rankup">RANK UP</em>` : ""}</span></div>
            <button class="link" data-ladder="${i}">ここまでNEWに組む</button>
          </div></div>`
      )
      .join("");
    return `<section class="card g-plan g-ladder">
        <h2>💴 コスパ順アップグレード</h2>
        <p class="small">いまのバイク(${L.start.kg.toFixed(2)}kg・${L.start.total}点 ${rk(L.start.rank)})から、1円あたりで軽くなる順に並べました(${L.usedOk ? "中古の相場" : "新品の値段"}で計算)。</p>
        ${head}
        ${rows || `<p class="muted">これ以上、カタログで効くパーツはありません。</p>`}
      </section>`;
  }

  // ---------- 月間ミッション・バッジ・ごほうび ----------
  function missionPanel() {
    const st = Missions.status(Store.rides, Store.places);
    const b = B();
    const isOn = (r) => (r.kind === "paint" ? b.color === r.color && (b.finish || "gloss") === r.finish : b.tapeColor === r.color);
    const months = [];
    for (const x of st.badges) {
      let m = months[months.length - 1];
      if (!m || m.ym !== x.ym) months.push((m = { ym: x.ym, month: x.month, list: [] }));
      m.list.push(x);
    }
    return `
      <section class="card g-mission">
        <h2>🎖️ ${st.month}のミッション <span class="g-total">残り${st.daysLeft}日</span></h2>
        ${st.missions
          .map(
            (m) => `<div class="g-ms ${m.done ? "done" : ""}">
              <span class="g-ms-i">${m.done ? "✅" : m.icon}</span>
              <div><strong>${esc(m.label)}</strong>
                <div class="g-ms-bar"><i style="width:${m.pct.toFixed(1)}%"></i></div>
                <small>${Missions.fmtVal(m, m.value)} / ${m.target.toLocaleString()}${m.unit}${m.done ? " ・ バッジ獲得!" : ""}</small></div></div>`
          )
          .join("")}
        <p class="muted small">記録したライドから毎回数えます(同期した記録も入ります)。毎月1日にリセット。</p>
      </section>
      <section class="card g-reward">
        <h2>🎨 ごほうび <span class="g-total">バッジ ${st.count}個</span></h2>
        <p class="small">${st.next ? `あと${st.next.need - st.count}個で「${esc(st.next.label)}」` : "ぜんぶのごほうびを手に入れました!"}。手に入れた色は「${G.active === "current" ? "装着済み" : "NEW"}」のバイクに付けられます。</p>
        <div class="g-rw-grid">${Missions.REWARDS.map((r) => {
          const open = st.count >= r.need;
          return `<div class="g-rw ${open ? "" : "locked"} ${open && isOn(r) ? "on" : ""}">
              <span class="g-rw-sw fin-${r.finish || "tape"}" style="--c:${r.color}"></span>
              <strong>${esc(r.label)}</strong>
              <small>${r.kind === "paint" ? "フレームの塗装" : "バーテープ"}</small>
              ${open ? (isOn(r) ? `<span class="g-tag">付けています</span>` : `<button class="btn sub" data-reward="${r.id}">付ける</button>`) : `<span class="g-rw-lock">🔒 バッジ${r.need}個</span>`}
            </div>`;
        }).join("")}</div>
        <div class="g-plan-btns"><button class="link" data-reward="reset-paint">塗装の仕上げを標準(つや)に戻す</button><button class="link" data-reward="reset-tape">バーテープを黒に戻す</button></div>
      </section>
      <section class="card g-badges">
        <h2>🏅 もらったバッジ</h2>
        ${months.length ? months.map((m) => `<p class="g-sub">${m.month}</p><div class="g-bd-row">${m.list.map((x) => `<span class="g-bd" title="${esc(x.label)}">${x.icon}<small>${esc(x.label)}</small></span>`).join("")}</div>`).join("") : `<p class="muted">まだバッジはありません。今月のミッションを1つ達成すると、最初のごほうび(ACオレンジ)が手に入ります。</p>`}
      </section>`;
  }

  // ---------- 🎬 動画を作る ----------
  const MOVIE_LABEL = { wheels: "WHEELS", frame: "FRAME", saddle: "SADDLE", handlebar: "COCKPIT", groupset: "DRIVETRAIN", tires: "TIRES", pedals: "PEDALS", seatpost: "SEATPOST" };
  async function movieData() {
    const b = B();
    const st = statsOf(b);
    const frame = b.parts.frame || {};
    const title = frame.libId || !/^(カーボン|アルミ|クロモリ)/.test(frame.name || "") ? frame.name || b.name : b.name;
    const order = ["wheels", "frame", "saddle", "handlebar", "groupset", "tires", "pedals", "seatpost"];
    const withPhoto = order.filter((s) => b.parts[s] && b.parts[s].mounted !== false && b.parts[s].libId && (libItem(b.parts[s].libId) || {}).photoId);
    const slots = withPhoto.concat(order.filter((s) => !withPhoto.includes(s) && b.parts[s] && b.parts[s].mounted !== false)).slice(0, 3);
    const parts = [];
    for (const s of slots) {
      const p = b.parts[s];
      const it = p.libId ? libItem(p.libId) : null;
      let img = null;
      if (it && it.photoId) {
        try {
          const blob = await Library.getPhoto(it.photoId);
          if (blob) img = await createImageBitmap(blob);
        } catch (e) {}
      }
      parts.push({ slot: s, label: MOVIE_LABEL[s] || s.toUpperCase(), name: p.name, g: +p.g || 0, img });
    }
    const d = new Date();
    return {
      title,
      sub: `${G.active === "current" ? "いまのバイク" : "NEWの構成"} ・ ${(Parts.totalGrams(b.parts) / 1000).toFixed(2)}kg ・ ${st.rank}ランク`,
      kg: Parts.totalGrams(b.parts) / 1000,
      rank: st.rank,
      total: st.total,
      rows: Stats.ROWS.map((r) => ({ en: r.en, ja: r.ja, bar: Math.round(st.v[r.k].bar) })),
      parts,
      date: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
    };
  }

  let movieUrl = null;
  function openMovie() {
    closeMovie();
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="mv" id="mv"><div class="mv-panel">
        <div class="mv-head"><strong>🎬 動画を作る</strong><button class="mv-x" data-mv="close" aria-label="閉じる">×</button></div>
        <div class="mv-body" id="mv-body">
          <p>いまの${G.active === "current" ? "装着済み" : "NEW"}のバイクで、映画の予告のような縦長の動画(約16秒・音つき)を作ります。</p>
          <ul class="mv-list"><li>3Dのバイクをカメラが回り込んで撮影</li><li>パーツの写真は、ゆっくり動く写真に</li><li>重さ・性能・ランクを、文字とグラフの動きで</li></ul>
          <p class="muted small">撮影の間(約16秒)はこの画面のままにしてください。音が出ます。作った動画はこの端末の中だけにあります。</p>
          <button class="btn start" data-mv="start">撮影スタート</button>
        </div></div></div>`
    );
  }
  function closeMovie() {
    const el = document.getElementById("mv");
    if (el) el.remove();
    if (movieUrl) URL.revokeObjectURL(movieUrl), (movieUrl = null);
  }
  async function startMovie() {
    const body = document.getElementById("mv-body");
    if (!body) return;
    body.innerHTML = `<canvas class="mv-prev" id="mv-prev" width="270" height="480"></canvas><div class="mv-bar"><i id="mv-bar"></i></div><p class="muted small" id="mv-msg">撮影中…</p>`;
    const prev = document.getElementById("mv-prev").getContext("2d");
    try {
      const data = await movieData();
      const out = await Movie.make(data, (k, cv) => {
        prev.drawImage(cv, 0, 0, 270, 480);
        const bar = document.getElementById("mv-bar");
        if (bar) bar.style.width = `${Math.round(k * 100)}%`;
      });
      const b2 = document.getElementById("mv-body");
      if (!b2) return;
      movieUrl = URL.createObjectURL(out.blob);
      b2.innerHTML = `<video class="mv-video" src="${movieUrl}" controls playsinline autoplay loop></video>
        <div class="g-plan-btns"><button class="btn start" data-mv="share" data-ext="${out.ext}">📤 保存・共有</button><button class="btn sub" data-mv="again">もう一度撮る</button></div>
        <p class="muted small">${out.ext === "webm" ? "WebM形式で書き出しました。TikTokなどに上げるときは、いったん写真アプリなどで保存してから選んでください。" : "MP4形式で書き出しました。"}</p>`;
      b2.querySelector("video").dataset.blob = "1";
      movieBlob = out;
    } catch (e) {
      const b2 = document.getElementById("mv-body");
      if (b2) b2.innerHTML = `<p class="notice warn">動画を作れませんでした: ${esc(e.message || String(e))}</p><button class="btn sub" data-mv="again">もう一度</button>`;
    }
  }
  let movieBlob = null;
  async function shareMovie() {
    if (!movieBlob) return;
    const name = `my-bike-${Date.now()}.${movieBlob.ext}`;
    const file = new File([movieBlob.blob], name, { type: movieBlob.type });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) return void (await navigator.share({ files: [file], title: "MY MACHINE" }));
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    const a = document.createElement("a");
    a.href = movieUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-mv]");
    if (!b) return;
    const a = b.dataset.mv;
    if (a === "close") closeMovie();
    if (a === "start") startMovie();
    if (a === "again") openMovie();
    if (a === "share") shareMovie();
  });

  // 3Dの上に出す吹き出し(今日のひとこと)
  function renderBubble() {
    if (!has3D) return;
    let el2 = document.getElementById("bubble");
    const today = new Date().toDateString();
    const c = clerkState();
    if (tab === "clerk" || mode === "ride" || c.bubbleHidden === today) {
      if (el2) el2.remove();
      return;
    }
    const text = Clerk.comments(clerkContext())[0];
    if (!el2) {
      stage.insertAdjacentHTML("beforeend", `<div class="g-bubble" id="bubble"></div>`);
      el2 = document.getElementById("bubble");
    }
    el2.innerHTML = `<button class="g-bubble-main" data-tab="clerk"><span class="g-bubble-face">🧑‍🔧</span><span class="g-bubble-text">${esc(text)}</span></button><button class="g-bubble-x" id="bubble-x" aria-label="今日は閉じる">×</button>`;
  }

  function openClerk() {
    tab = "clerk";
    if (mode !== "mechanic") setMode("mechanic");
    renderTabs();
    renderTools();
    renderPanel();
    renderBubble();
    if (has3D) View3D.waveClerk();
    window.scrollTo({ top: document.getElementById("tabs").offsetTop - 60, behavior: "smooth" });
  }

  function readHearing() {
    const c = clerkState();
    const goals = [...document.querySelectorAll("[data-hear-goal]")].filter((x) => x.checked).map((x) => x.dataset.hearGoal);
    const budget = Math.max(1000, +document.getElementById("hear-budget").value || 30000);
    const usedOk = document.getElementById("hear-used").checked;
    c.hearing = { budget, goals: goals.length ? goals : ["light"], usedOk, choices: (c.hearing && c.hearing.choices) || undefined };
  }

  function renderPanel() {
    const panel = document.getElementById("panel");
    panel.innerHTML = tab === "parts" ? partsPanel() : tab === "fit" ? fitPanel() : tab === "aero" ? aeroPanel() : tab === "clerk" ? clerkPanel() : tab === "mission" ? missionPanel() : comparePanel();
    if (tab === "aero") drawSilhouette();
    if (tab === "parts") loadPhotos();
    renderPartCard();
    fillProdImgs();
    if (typeof Sync !== "undefined" && tab === "parts") {
      panel.insertAdjacentHTML("beforeend", Sync.panelHtml());
      Sync.bindPanel(panel, renderPanel);
    }
  }

  // data-path("pos.stemLength" など)に値を書き込む
  function setPath(path, raw, scale) {
    const keys = path.split(".");
    let obj = keys[0] === "body" ? G.body : keys[0] === "goal" ? G : B();
    if (keys[0] === "body") keys.shift();
    if (path === "goal") {
      G.goal = raw;
      return;
    }
    for (let i = 0; i < keys.length - 1; i++) {
      if (obj[keys[i]] == null) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    const last = keys[keys.length - 1];
    let val = raw;
    if (last === "backPain") val = raw === "1";
    else if (last === "discRear") val = raw === "1";
    else if (last === "name" || last === "flex" || last === "hands" || last === "aero" || last === "type" || path === "color") val = raw;
    else {
      val = parseFloat(raw);
      if (!isFinite(val)) val = 0;
      val = val / (scale || 1);
    }
    obj[last] = val;
    // 身長・体重は走行計算の設定にも反映
    if (keys[0] === "height" || keys[0] === "weight") {
      Store.setProfile({ heightCm: Math.round(G.body.height * 100), weightKg: G.body.weight });
    }
  }

  function changed(rebuild3D = true) {
    save();
    renderSummary();
    if (rebuild3D) refresh3D();
  }

  el.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.findOne) {
      const it = Catalog.byId(t.dataset.findOne);
      if (!it) return;
      t.innerHTML = "⏳<small>探しています</small>";
      t.disabled = true;
      return AI.findImage(it.id, it.name)
        .catch(() => null)
        .then(() => document.querySelectorAll(`[data-prod="${it.id}"]`).forEach((x) => (x.innerHTML = prodImg(it))));
    }
    if (t.id === "lf-web") return searchWebPhotos();
    if (t.dataset.webPick && libForm && libForm.web) {
      const it = libForm.web.items[+t.dataset.webPick];
      if (!it) return;
      t.disabled = true;
      return photoFromUrl(it.url).catch(() => alert("この写真を取り込めませんでした"));
    }
    if (t.id === "lf-url") {
      const u = prompt("画像のURL(https://…で始まるもの)を貼り付けてください");
      if (!u || !/^https?:\/\//.test(u.trim())) return;
      return photoFromUrl(u.trim()).catch(() => alert("この画像を取り込めませんでした。画像を長押しして「画像をコピー」し、「📋 コピーした画像を貼る」を試してください"));
    }
    if (t.id === "lf-clip") {
      if (!navigator.clipboard || !navigator.clipboard.read) return alert("この端末では、ここから貼り付けられません。入力欄を長押しして「ペースト」してください");
      return navigator.clipboard
        .read()
        .then(async (items) => {
          for (const it of items) {
            const type = it.types.find((x) => /^image\//.test(x));
            if (type) return setFormPhoto(await it.getType(type));
          }
          alert("コピーした画像が見つかりませんでした。画像を長押し(右クリック)して「画像をコピー」してください");
        })
        .catch(() => alert("貼り付けを許可してください(またはパソコンなら Ctrl+V で貼り付けられます)"));
    }
    if (t.dataset.decalLib) {
      openLibForm(null, t.dataset.decalLib);
      return startDecal();
    }
    // ---- 組み合わせ表 ----
    if (t.dataset.cell) return openCell(t.dataset.cell, t.dataset.k);
    if (t.hasAttribute("data-cell-close")) {
      cell = null;
      return renderPanel();
    }
    // ---- 写真でパーツ登録 ----
    if (t.dataset.quick === "ai") {
      quick.aiOpen = !quick.aiOpen;
      return renderPanel();
    }
    if (t.dataset.quick === "ai-save") {
      const k = ((document.getElementById("ai-key") || {}).value || "").trim();
      if (k && !/^sk-ant-/.test(k)) return alert("sk-ant- で始まるキーを貼り付けてください");
      if (!k && !AI.ready) return alert("APIキーを貼り付けてください");
      if (k) AI.setKey(k);
      const m = document.querySelector("[data-ai-model]:checked");
      AI.setOpts({ model: m ? m.dataset.aiModel : AI.opts.model, search: !!(document.getElementById("ai-search") || {}).checked });
      quick.aiOpen = false;
      return renderPanel();
    }
    if (t.dataset.quick === "ai-off") {
      AI.setKey("");
      return renderPanel();
    }
    if (t.dataset.quick === "commit") return quickCommit();
    if (t.dataset.quick === "clear") {
      quick.entries = [];
      return renderPanel();
    }
    // ---- 店員さん ----
    if (t.dataset.hearBudget) {
      document.getElementById("hear-budget").value = t.dataset.hearBudget;
      document.querySelectorAll("[data-hear-budget]").forEach((x) => x.classList.toggle("on", x === t));
      return;
    }
    if (t.dataset.clerk === "plan") {
      readHearing();
      clerkState().editing = false;
      changed(false);
      renderPanel();
      if (has3D) View3D.waveClerk();
      return;
    }
    if (t.dataset.clerkSkip || t.dataset.clerkAdd) {
      const h = clerkState().hearing;
      h.choices = h.choices || {};
      if (t.dataset.clerkSkip) h.choices[t.dataset.clerkSkip] = "none";
      else h.choices[t.dataset.clerkAdd] = t.dataset.item;
      changed(false);
      return renderPanel();
    }
    if (t.dataset.clerk === "auto") {
      delete clerkState().hearing.choices;
      changed(false);
      return renderPanel();
    }
    if (t.dataset.clerk === "edit") {
      clerkState().editing = true;
      return renderPanel();
    }
    if (t.dataset.shopDel) {
      const x = G.shops.find((s) => s.id === t.dataset.shopDel);
      if (!x || !confirm(`「${x.name}」をリストから消しますか?`)) return;
      G.shops = G.shops.filter((s) => s !== x);
      changed(false);
      return renderPanel();
    }
    if (t.dataset.shop) {
      const a = t.dataset.shop;
      if (a === "new") shopForm = { name: "", addr: "", tel: "", note: "" };
      else if (a === "cancel") shopForm = null;
      else if (a === "restore") {
        for (const d of Shops.DEFAULTS) if (!G.shops.some((s) => s.id === d.id)) G.shops.push(JSON.parse(JSON.stringify(d)));
        changed(false);
      } else if (a === "save") {
        const v = (id) => document.getElementById(id).value.trim();
        if (!v("shop-name")) return alert("店名を入れてください");
        G.shops.push({ id: "u" + Date.now().toString(36), name: v("shop-name"), addr: v("shop-addr"), tel: v("shop-tel"), note: v("shop-note"), tags: [] });
        shopForm = null;
        changed(false);
      }
      return renderPanel();
    }
    if (t.dataset.reward) {
      const b = B();
      const id = t.dataset.reward;
      if (id === "reset-paint") delete b.finish;
      else if (id === "reset-tape") delete b.tapeColor;
      else {
        const r = Missions.REWARDS.find((x) => x.id === id);
        if (!r || Missions.status(Store.rides, Store.places).count < r.need) return;
        equip({ slot: r.kind === "paint" ? "frame" : "bartape", name: r.label, price: r.need >= 10 ? 100000 : r.need >= 6 ? 50000 : 20000 }, () => {
          if (r.kind === "paint") (b.color = r.color), (b.finish = r.finish);
          else b.tapeColor = r.color;
        });
      }
      changed();
      return renderAll();
    }
    if (t.dataset.ladder != null) {
      const L = ladderOf();
      const upto = L.steps.slice(0, +t.dataset.ladder + 1);
      if (!upto.length || !confirm(`いまのバイク(装着済み)をもとに、上から${upto.length}点を付けたNEWを組みます。今のNEWの構成は置き換わります。よろしいですか?`)) return;
      const nx = JSON.parse(JSON.stringify(G.builds.current));
      nx.name = `コスパ順 ${upto.length}点`;
      for (const x of upto) Catalog.apply(nx, x.item);
      const top = upto.slice().sort((a, b) => b.cost - a.cost)[0];
      G.active = "current";
      equip({ slot: top.item.slot, name: `コスパ順 ${upto.length}点`, price: upto.reduce((a, x) => a + x.item.price, 0) }, () => {
        G.builds.next = nx;
        G.active = "next";
      });
      changed();
      return renderAll();
    }
    if (t.dataset.clerk === "build") {
      // いまのバイクをもとに、おすすめをぜんぶ付けたNEWを組む
      const plan = clerkContext().plan;
      if (!plan || !plan.items.length) return;
      if (!confirm("いまのバイク(装着済み)をもとに、おすすめのパーツをぜんぶ付けたNEWを組みます。今のNEWの構成は置き換わります。よろしいですか?")) return;
      const nx = JSON.parse(JSON.stringify(G.builds.current));
      nx.name = "店員さんのおすすめ";
      for (const x of plan.items) Catalog.apply(nx, x.item);
      const top = plan.items.slice().sort((a, b) => b.cost - a.cost)[0];
      G.active = "current";
      equip({ slot: top && top.item.slot, name: `フルアセンブル ${plan.items.length}点`, price: plan.items.reduce((a, x) => a + x.item.price, 0) }, () => {
        G.builds.next = nx;
        G.active = "next";
      });
      changed();
      renderAll();
      return;
    }
    if (t.dataset.clerkNext || t.dataset.clerkBought || t.dataset.catPut) {
      const it = Catalog.byId(t.dataset.clerkNext || t.dataset.clerkBought || t.dataset.catPut);
      if (!it) return;
      equip({ slot: it.slot, name: it.name, price: it.price }, () => {
        if (t.dataset.catPut) Catalog.apply(B(), it);
        else Catalog.apply(G.builds.next, it);
        if (t.dataset.clerkBought) Catalog.apply(G.builds.current, it);
        if (!t.dataset.catPut) G.active = t.dataset.clerkBought ? "current" : "next";
      });
      selected = it.slot;
      changed();
      renderAll();
      if (has3D) View3D.highlight(selected, true);
      return;
    }
    if (t.dataset.maint) {
      clerkState().maint[t.dataset.maint] = { km: Clerk.totalKm(Store.rides), at: Date.now() };
      changed(false);
      return renderPanel();
    }
    if (t.id === "bubble-x") {
      clerkState().bubbleHidden = new Date().toDateString();
      changed(false);
      return renderBubble();
    }
    // ---- マイパーツ ----
    if (t.hasAttribute("data-lib-new")) return openLibForm(t.dataset.libNew || selected || "wheels", null);
    if (t.dataset.libEdit) return openLibForm(null, t.dataset.libEdit);
    if (t.dataset.libAdd) {
      const it = libItem(t.dataset.libAdd);
      if (!it) return;
      equip({ slot: it.slot, name: "＋ " + Library.displayName(it) }, () => {
        Library.addComponent(G.builds[t.dataset.target], it);
        G.active = t.dataset.target;
      });
      selected = it.slot;
      changed();
      renderAll();
      if (has3D) View3D.highlight(selected, true);
      return;
    }
    if (t.dataset.misfitMove) {
      const it = libItem(t.dataset.misfitMove);
      if (!it) return;
      const name = Library.displayName(it);
      moveLib(it.id, t.dataset.to);
      changed();
      renderAll();
      alert(`「${name}」を${Parts.slotName(t.dataset.to)}のマイパーツに移しました。付けるときは${Parts.slotName(t.dataset.to)}のマスから選んでください。`);
      return;
    }
    if (t.dataset.compDel != null && cell) {
      Library.removeComponent(G.builds[cell.k], cell.slot, +t.dataset.compDel, G.library);
      changed();
      return renderAll();
    }
    if (t.dataset.libSide) {
      const it = libItem(t.dataset.libId);
      if (!it) return;
      // 前後のどちらに使うパーツかを覚えておく(次からは写真・手入力の登録でもその側に付く)
      it.specs = Object.assign({}, it.specs, { side: t.dataset.libSide === "pair" ? "pair" : t.dataset.libSide });
      Library.syncAll(G, it);
      const label = { front: "フロント", rear: "リア", pair: "前後" }[t.dataset.libSide];
      equip({ slot: it.slot, name: `${label}: ${Library.displayName(it)}` }, () => {
        Library.apply(G.builds[t.dataset.target], it);
        G.active = t.dataset.target;
      });
      selected = it.slot;
      changed();
      renderAll();
      if (has3D) View3D.highlight(selected, true);
      return;
    }
    if (t.dataset.libPut) {
      const it = libItem(t.dataset.libPut);
      if (!it) return;
      equip({ slot: it.slot, name: Library.displayName(it) }, () => {
        Library.apply(G.builds[t.dataset.target], it);
        G.active = t.dataset.target;
      });
      selected = it.slot;
      changed();
      renderAll();
      if (has3D) View3D.highlight(selected, true);
      return;
    }
    if (t.id === "lf-parse") {
      const r = Library.parse(libForm.slot, libForm.paste);
      if (r.g) libForm.g = r.g;
      Object.assign(libForm.specs, r.specs);
      libForm.note = r.found.length ? `読み取った項目: ${r.found.join(" / ")}。内容を確かめてから保存してください。` : "数値を読み取れませんでした。重量(g)や寸法(mm)が書かれた部分を貼り付けてください。";
      return renderPanel();
    }
    if (t.id === "lf-decal") return startDecal();
    if (t.id === "lf-decal-off") {
      libForm.decal = null;
      return renderPanel();
    }
    if (t.id === "lf-save") return saveLibForm(t.dataset.target || null);
    if (t.id === "lf-save-only") return saveLibForm(null);
    if (t.id === "lf-cancel") {
      libForm = null;
      return renderPanel();
    }
    if (t.id === "lf-delete") {
      if (!confirm("このマイパーツを削除しますか?(付けているバイクのパーツは、数値をそのまま残します)")) return;
      const id = libForm.id;
      const it = libItem(id);
      if (it && it.photoId) Library.deletePhoto(it.photoId);
      G.library = G.library.filter((x) => x.id !== id);
      Library.unlinkAll(G, id);
      libForm = null;
      changed(false);
      return renderPanel();
    }
    if (t.id === "lib-export") return exportLibrary();
    if (t.id === "paste-toggle") {
      pasteOpen = !pasteOpen;
      return renderPanel();
    }
    if (t.id === "paste-read") return startImportText(document.getElementById("paste-table").value);
    if (t.id === "imp-apply" || t.id === "imp-apply-next") return applyImport(t.dataset.target, document.getElementById("imp-unmount").checked);
    if (t.id === "imp-only") return applyImport(null, false);
    if (t.id === "imp-cancel") {
      importRev = null;
      return renderPanel();
    }
    if (t.dataset.build) {
      G.active = t.dataset.build;
      suggestion = null;
      save();
      renderAll();
      refresh3D();
    } else if (t.dataset.tab === "clerk") {
      openClerk();
    } else if (t.dataset.tab) {
      tab = t.dataset.tab;
      // フィッティングと空力はライダーを乗せて見る
      if ((tab === "fit" || tab === "aero") && mode !== "ride") setMode("ride");
      if (tab === "parts" && mode !== "mechanic") setMode("mechanic");
      renderTabs();
      renderTools();
      renderPanel();
      renderBubble();
      window.scrollTo({ top: document.getElementById("tabs").offsetTop - 60, behavior: "smooth" });
    } else if (t.dataset.tool) {
      const k = t.dataset.tool;
      if (k === "movie") return openMovie();
      if (k === "mode") setMode(mode === "ride" ? "mechanic" : "ride");
      if (k === "explode") {
        exploded = !exploded;
        if (has3D) View3D.setExploded(exploded);
        viewIdx = exploded ? 1 : 0;
      }
      if (k === "pedal") {
        pedaling = !pedaling;
        if (has3D) View3D.setPedaling(pedaling);
      }
      if (k === "flow") {
        flow = !flow;
        if (has3D) View3D.setFlow(flow);
      }
      if (k === "view") {
        viewIdx = (viewIdx + 1) % VIEWS.length;
        if (has3D) View3D.setView(VIEWS[viewIdx].id);
      }
      if (k === "sound") Sfx.setMuted(!Sfx.muted);
      if (k === "photo" && has3D) {
        photoOn = !photoOn;
        // 写真モードは止まった姿を描く(ペダル・空気の流れは止める)
        if (photoOn && pedaling) (pedaling = false), View3D.setPedaling(false);
        View3D.setPhotoreal(photoOn, photoStatus);
      }
      renderTools();
    } else if (t.dataset.slot) {
      selected = selected === t.dataset.slot ? null : t.dataset.slot;
      if (has3D) {
        if (selected) View3D.highlight(selected, true);
        else View3D.clearHighlight();
      }
      renderPanel();
    } else if (t.dataset.mount) {
      const id = t.dataset.mount;
      const p = B().parts[id];
      if (!p) return;
      const mounting = p.mounted === false;
      p.mounted = mounting;
      save();
      renderSummary();
      renderPanel();
      if (has3D) {
        if (mounting) {
          refresh3D();
          requestAnimationFrame(() => requestAnimationFrame(() => View3D.animateMount(id, true)));
        } else {
          View3D.animateMount(id, false);
          setTimeout(refresh3D, 600);
        }
      }
    } else if (t.dataset.hands) {
      B().pos.hands = t.dataset.hands;
      changed();
      renderPanel();
    } else if (t.id === "ms-standing" || t.id === "ms-riding") {
      startMeasure(t.id === "ms-standing" ? "standing" : "riding");
    } else if (t.id === "ms-apply") {
      const v = G.measure.standing.values;
      for (const k of ["inseam", "thighLen", "shankLen", "torsoLen", "upperArmLen", "forearmLen", "arm"]) G.body[k] = Math.round(v[k] * 1000) / 1000;
      G.measure.standing.applied = true;
      suggestion = null;
      changed();
      renderPanel();
    } else if (t.id === "ms-elbow") {
      B().pos.elbow = Math.max(0, Math.round(G.measure.riding.angles.elbow));
      changed();
      renderPanel();
    } else if (t.id === "optimize") {
      runOptimize();
      renderPanel();
    } else if (t.id === "apply-sug" || t.id === "apply-sug-next") {
      const target = t.id === "apply-sug" ? G.active : "next";
      if (t.id === "apply-sug-next" && G.active === "current") {
        G.builds.next = JSON.parse(JSON.stringify(G.builds.current));
        G.builds.next.name = "NEW";
      }
      Object.assign(G.builds[target].pos, suggestion.pos);
      suggestion = null;
      if (target === "next") G.active = "next";
      changed();
      renderAll();
    } else if (t.id === "copy-to-next") {
      if (!confirm("NEWの構成を、装着済みと同じにしますか?")) return;
      G.builds.next = JSON.parse(JSON.stringify(G.builds.current));
      G.builds.next.name = "NEW";
      changed();
      renderAll();
    } else if (t.id === "promote") {
      if (!confirm("NEWの構成を装着済みにしますか?(いまの装着済みの構成は上書きされます)")) return;
      G.builds.current = JSON.parse(JSON.stringify(G.builds.next));
      G.builds.current.name = "いまのバイク";
      changed();
      renderAll();
    } else if (t.id === "use-ride") {
      const a = calc("current");
      Store.setProfile({ bikeKg: Math.round(a.bikeKg * 100) / 100, cdaCustom: Math.round(a.fit.cda.total * 1000) / 1000, useGarage: true });
      alert(`走行計算に使う値を、バイク ${a.bikeKg.toFixed(2)}kg・CdA ${a.fit.cda.total.toFixed(3)} にしました`);
      renderPanel();
    }
  });

  // 入力欄・選択欄の変更
  // マイパーツの入力欄(描き直さずにフォームの内容だけ更新する)
  // マイパーツの入力中に画像を貼り付けたら(Ctrl+V など)、その写真にする
  document.addEventListener("paste", (e) => {
    if (!libForm || !e.clipboardData) return;
    const item = [...e.clipboardData.items].find((x) => /^image\//.test(x.type));
    if (!item) return;
    e.preventDefault();
    setFormPhoto(item.getAsFile());
  });

  // 下からの画面の「細かく」を開いたままにする
  el.addEventListener(
    "toggle",
    (e) => {
      if (e.target.id === "mx-edit") sheetEdit = e.target.open;
      if (e.target.id === "g-data") dataOpen = e.target.open;
    },
    true
  );

  el.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.imp && importRev) {
      const row = importRev.rows[+t.dataset.i];
      if (t.dataset.imp === "name") row.name = t.value;
      if (t.dataset.imp === "g") row.g = parseFloat(t.value) || 0;
      return;
    }
    if (!libForm) return;
    if (t.dataset.lf && t.dataset.lf !== "slot") libForm[t.dataset.lf] = t.value;
    if (t.dataset.lfSpec) libForm.specs[t.dataset.lfSpec] = t.value;
  });

  el.addEventListener("change", async (e) => {
    const t = e.target;
    if (t.dataset.shopMemo) {
      const x = (G.shops || []).find((s) => s.id === t.dataset.shopMemo);
      if (x) (x.memo = t.value.trim()), changed(false);
      return;
    }
    if (t.dataset.imp && importRev) {
      const row = importRev.rows[+t.dataset.i];
      if (t.dataset.imp === "include") row.include = t.checked;
      if (t.dataset.imp === "slot") row.slot = t.value;
      if (t.dataset.imp === "g") row.g = parseFloat(t.value) || 0;
      return renderPanel();
    }
    if (t.id === "imp-unmount") return;
    if (t.dataset.lf === "slot" && libForm) {
      libForm.slot = t.value;
      libForm.specs = {};
      return renderPanel();
    }
    if (t.dataset.lfSpec && libForm) {
      libForm.specs[t.dataset.lfSpec] = t.value;
      return;
    }
    if (t.dataset.lf) return;
    if (t.id === "lf-photo" && t.files && t.files[0] && libForm) return setFormPhoto(t.files[0]);
    if (t.id === "quick-files" && t.files && t.files.length) return quickAdd([...t.files]);
    if (t.id === "quick-files-slot" && t.files && t.files.length) {
      quick.target = cell ? cell.k : quick.target;
      cell = null;
      window.scrollTo({ top: document.getElementById("tabs").offsetTop - 60, behavior: "smooth" });
      return quickAdd([...t.files], t.dataset.hint);
    }
    if (t.id === "quick-target") return void (quick.target = t.value);
    if (t.dataset.q) {
      const e = quick.entries[+t.dataset.i];
      if (!e) return;
      if (t.dataset.q === "include") e.include = t.checked;
      else if (t.dataset.q === "weight_g") e.res.weight_g = parseFloat(t.value) || 0;
      else e.res[t.dataset.q] = t.value;
      if (t.dataset.q === "slot" || t.dataset.q === "include") renderPanel();
      return;
    }
    if (t.id === "lib-import" && t.files && t.files[0]) return importLibrary(t.files[0]);
    if (t.dataset.clerkAlt) {
      const h = clerkState().hearing;
      h.choices = Object.assign(h.choices || {}, { [t.dataset.clerkAlt]: t.value });
      changed(false);
      return renderPanel();
    }
    if (t.dataset.libPick) {
      const it = libItem(t.value);
      if (!it) return;
      equip({ slot: it.slot, name: Library.displayName(it) }, () => Library.apply(B(), it));
      changed();
      renderPanel();
      if (has3D) View3D.highlight(selected, false);
      return;
    }
    if (t.dataset.preset) {
      const i = t.value;
      if (i === "") return;
      const id = t.dataset.preset;
      const keep = B().parts[id] && B().parts[id].mounted;
      equip({ slot: id, name: Parts.PRESETS[id][+i].name }, () => {
        B().parts[id] = JSON.parse(JSON.stringify(Parts.PRESETS[id][+i]));
        if (keep === false) B().parts[id].mounted = false;
      });
      changed();
      renderPanel();
      if (has3D && selected) View3D.highlight(selected, false);
      return;
    }
    if (!t.dataset.path) return;
    if (t.dataset.path === "measureCrank") {
      if (G.measure && G.measure.riding) {
        G.measure.riding.crank = +t.value;
        save();
        renderPanel();
      }
      return;
    }
    // マイパーツを付けた部位を手で書き換えたら、マイパーツとのつながりを外す(その部位だけの値になる)
    const pm = t.dataset.path.match(/^parts\.(\w+)\./);
    if (pm && B().parts[pm[1]]) {
      delete B().parts[pm[1]].libId;
      if (/\.(g|name)$/.test(t.dataset.path)) delete B().parts[pm[1]].components, delete B().parts[pm[1]].shop; // まとめたパーツの内訳・カタログの値段も外す
    }
    setPath(t.dataset.path, t.value, parseFloat(t.dataset.scale || "1"));
    if (t.dataset.path.startsWith("body.") || t.dataset.path === "goal") suggestion = null;
    changed();
    // 名前の入力中以外は、値に応じて表示を更新する
    if (t.type !== "text") renderPanel();
    else renderPanel();
  });

  function setMode(m) {
    mode = m;
    if (m !== "ride") flow = false;
    if (has3D) {
      View3D.setRider(m === "ride");
      View3D.setFlow(flow);
    }
    renderTools();
    renderBubble();
  }

  // ほかの端末で変えたガレージが届いたら、読み直して描き直す(入力中は待つ)
  if (typeof Sync !== "undefined")
    Sync.onUpdate((e) => {
      if (!(e.changed && (e.changed.includes("garage") || e.changed.includes("profile"))) && !e.photos) return;
      const a = document.activeElement;
      if (a && /INPUT|SELECT|TEXTAREA/.test(a.tagName) && !e.photos) return;
      if (e.changed && e.changed.includes("garage")) G = loadGarage();
      renderAll();
      refresh3D();
    });

  renderAll();
  refresh3D();
  save();
})();

// ガレージ画面: パーツの組み立て・フィッティング・空力・「いまのバイク」と「NEW」の比較。

(() => {
  const el = document.getElementById("garage");
  const has3D = !!window.THREE;

  let tab = "parts";
  let selected = null; // 編集中の部位
  let suggestion = null; // 自動調整の提案
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
    const b = B(k);
    const tire = (b.parts.tires && b.parts.tires.attrs && b.parts.tires.attrs.width) || 28;
    return { geo: b.geo, pos: Object.assign({}, b.pos, extraPos || {}), aero: Parts.aeroOf(b.parts), wheelRadius: 0.311 + tire / 1000 };
  }

  function calc(k = G.active) {
    const b = B(k);
    const fit = Fit.compute(input(k), G.body);
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
    <header class="topbar"><div class="topbar-inner g-top"><a href="index.html" class="g-back">←</a>RIDE <span>GARAGE</span></div></header>
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
    } catch (e) {
      stage.insertAdjacentHTML("afterbegin", `<p class="g-no3d">この端末では3D表示を使えません。数値の計算はこのまま使えます。</p>`);
    }
  }

  let pending3D = false;
  function refresh3D() {
    if (!has3D || pending3D) return;
    pending3D = true;
    requestAnimationFrame(() => {
      pending3D = false;
      try {
        View3D.setModel(Fit.compute(input(G.active), G.body), B(), G.body);
        if (selected) View3D.highlight(selected, false);
      } catch (e) {
        // 3Dが使えなくても数値は出す
      }
    });
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
      <button class="g-tool" data-tool="view">👁 ${VIEWS[viewIdx].label}</button>`;
  }

  function renderSummary() {
    const a = calc(G.active);
    const o = calc(other());
    const name = other() === "next" ? "NEW" : "装着済み";
    document.getElementById("summary").innerHTML = `
      <div><span>バイク重量</span><strong>${kgTxt(a.bikeKg)}</strong>${delta(o.bikeKg, a.bikeKg, 2, "", true)}</div>
      <div><span>空気抵抗 CdA</span><strong>${a.fit.cda.total.toFixed(3)}</strong>${delta(o.fit.cda.total, a.fit.cda.total, 3, "", true)}</div>
      <div><span>200Wで平地</span><strong>${a.perf.speed200.toFixed(1)}<small>km/h</small></strong>${delta(o.perf.speed200, a.perf.speed200, 1, "", false)}</div>
      <p class="g-vs">右の差は「${name}」と比べた値</p>`;
  }

  function renderTabs() {
    const T = [
      ["parts", "🧰 パーツ"],
      ["fit", "🧍 フィッティング"],
      ["aero", "💨 空力"],
      ["compare", "📊 比較"],
    ];
    document.getElementById("tabs").innerHTML = T.map(([id, label]) => `<button class="g-tab ${tab === id ? "on" : ""}" data-tab="${id}">${label}</button>`).join("");
  }

  function renderAll() {
    renderBuilds();
    renderTools();
    renderSummary();
    renderTabs();
    renderPanel();
  }

  // ---------- パーツ ----------
  function partsPanel() {
    const b = B();
    const rows = Parts.SLOTS.map((sl) => {
      const p = b.parts[sl.id] || { name: "(なし)", g: 0 };
      const off = p.mounted === false;
      return `
        <div class="g-part ${selected === sl.id ? "sel" : ""} ${off ? "off" : ""}">
          <button class="g-part-main" data-slot="${sl.id}">
            <span class="g-part-icon">${sl.icon}</span>
            <span class="g-part-text"><small>${sl.name}</small>${esc(p.name)}</span>
            <span class="g-part-g">${off ? "取り外し中" : (+p.g || 0).toLocaleString() + " g"}</span>
          </button>
          <button class="g-mount" data-mount="${sl.id}">${off ? "取り付け" : "外す"}</button>
        </div>
        ${selected === sl.id ? `<div class="g-editor">${editor(sl.id)}</div>` : ""}`;
    }).join("");
    return `
      <section class="card">
        <h2>パーツ在庫 <span class="g-total">${kgTxt(Parts.totalGrams(b.parts) / 1000)}</span></h2>
        <p class="muted small">部位をタップすると3Dで光り、パーツを選び直せます。重さは一般的な製品の目安なので、手元のパーツの実際の重さに書き換えてください。</p>
        ${rows}
      </section>`;
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
    let html = `
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
  function renderPanel() {
    const panel = document.getElementById("panel");
    panel.innerHTML = tab === "parts" ? partsPanel() : tab === "fit" ? fitPanel() : tab === "aero" ? aeroPanel() : comparePanel();
    if (tab === "aero") drawSilhouette();
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
    if (t.dataset.build) {
      G.active = t.dataset.build;
      suggestion = null;
      save();
      renderAll();
      refresh3D();
    } else if (t.dataset.tab) {
      tab = t.dataset.tab;
      // フィッティングと空力はライダーを乗せて見る
      if ((tab === "fit" || tab === "aero") && mode !== "ride") setMode("ride");
      if (tab === "parts" && mode !== "mechanic") setMode("mechanic");
      renderTabs();
      renderTools();
      renderPanel();
      window.scrollTo({ top: document.getElementById("tabs").offsetTop - 60, behavior: "smooth" });
    } else if (t.dataset.tool) {
      const k = t.dataset.tool;
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
  el.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.preset) {
      const i = t.value;
      if (i === "") return;
      const id = t.dataset.preset;
      const keep = B().parts[id] && B().parts[id].mounted;
      B().parts[id] = JSON.parse(JSON.stringify(Parts.PRESETS[id][+i]));
      if (keep === false) B().parts[id].mounted = false;
      changed();
      renderPanel();
      if (has3D && selected) View3D.highlight(selected, false);
      return;
    }
    if (!t.dataset.path) return;
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
  }

  renderAll();
  refresh3D();
  save();
})();

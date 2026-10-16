// ガレージ画面: パーツの組み立て・フィッティング・空力・「いまのバイク」と「NEW」の比較。

(() => {
  const el = document.getElementById("garage");
  const has3D = !!window.THREE;

  let tab = "parts";
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
            <span class="g-part-text"><small>${sl.name}</small>${p.libId ? "📘 " : ""}${esc(p.name)}</span>
            <span class="g-part-g">${off ? "取り外し中" : (+p.g || 0).toLocaleString() + " g"}</span>
          </button>
          <button class="g-mount" data-mount="${sl.id}">${off ? "取り付け" : "外す"}</button>
        </div>
        ${selected === sl.id ? `<div class="g-editor">${editor(sl.id)}</div>` : ""}`;
    }).join("");
    return `
      ${libForm ? libFormHtml() : ""}
      ${importRev ? importHtml() : ""}
      <section class="card">
        <h2>パーツ在庫 <span class="g-total">${kgTxt(Parts.totalGrams(b.parts) / 1000)}</span></h2>
        <p class="muted small">部位をタップすると3Dで光り、パーツを選び直せます。📘のついたパーツは、マイパーツ(公式データ)の数値を使っています。</p>
        ${rows}
      </section>
      ${libraryHtml()}`;
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

  function libraryHtml() {
    const groups = Parts.SLOTS.map((sl) => ({ sl, items: G.library.filter((x) => x.slot === sl.id) })).filter((g) => g.items.length);
    const used = (id, k) => G.builds[k].parts && Object.values(G.builds[k].parts).some((p) => p && p.libId === id);
    return `
      <section class="card">
        <h2>マイパーツ <span class="g-total">${G.library.length}件</span></h2>
        <p class="muted small">公式の重量・寸法・URL・写真を登録した、自分のパーツのデータベースです。付けると数値が3Dと計算にそのまま反映され、あとで直すと付けているバイクにも反映されます。</p>
        <button class="btn sub" data-lib-new="">＋ パーツを登録する</button>
        ${
          groups.length
            ? groups
                .map(
                  (g) => `
          <p class="g-sub">${g.sl.icon} ${g.sl.name}</p>
          ${g.items
            .map(
              (it) => `
            <div class="g-lib">
              ${photoTag(it.photoId)}
              <div class="g-lib-text">
                <strong>${esc(Library.displayName(it))}</strong>
                <small>${(+it.g || 0).toLocaleString()}g${specSummary(it)}${used(it.id, "current") ? " ・装着済みに付いています" : ""}${used(it.id, "next") ? " ・NEWに付いています" : ""}</small>
              </div>
              <div class="g-lib-actions">
                <button class="chip" data-lib-put="${it.id}" data-target="current">装着済みへ</button>
                <button class="chip" data-lib-put="${it.id}" data-target="next">NEWへ</button>
                <button class="link" data-lib-edit="${it.id}">編集</button>
              </div>
            </div>`
            )
            .join("")}`
                )
                .join("")
            : `<p class="muted">まだありません。「パーツを登録する」か、パーツ在庫の部位から登録できます。</p>`
        }
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
      </section>`;
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
  function renderPanel() {
    const panel = document.getElementById("panel");
    panel.innerHTML = tab === "parts" ? partsPanel() : tab === "fit" ? fitPanel() : tab === "aero" ? aeroPanel() : comparePanel();
    if (tab === "aero") drawSilhouette();
    if (tab === "parts") loadPhotos();
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
    // ---- マイパーツ ----
    if (t.hasAttribute("data-lib-new")) return openLibForm(t.dataset.libNew || selected || "wheels", null);
    if (t.dataset.libEdit) return openLibForm(null, t.dataset.libEdit);
    if (t.dataset.libPut) {
      const it = libItem(t.dataset.libPut);
      if (!it) return;
      Library.apply(G.builds[t.dataset.target], it);
      G.active = t.dataset.target;
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
    if (t.id === "lf-photo" && t.files && t.files[0] && libForm) {
      try {
        const blob = await Library.resize(t.files[0]);
        const id = "ph" + Date.now().toString(36);
        await Library.putPhoto(id, blob);
        if (libForm.photoId) Library.deletePhoto(libForm.photoId);
        libForm.photoId = id;
        photoUrls[id] = URL.createObjectURL(blob);
        // フレームの写真なら、色を拾ってフレームの色にする
        if (libForm.slot === "frame") libForm.color = await Library.dominantColor(blob).catch(() => null);
      } catch (err) {
        alert("写真を保存できませんでした");
      }
      return renderPanel();
    }
    if (t.id === "lib-import" && t.files && t.files[0]) return importLibrary(t.files[0]);
    if (t.dataset.libPick) {
      const it = libItem(t.value);
      if (!it) return;
      Library.apply(B(), it);
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
      B().parts[id] = JSON.parse(JSON.stringify(Parts.PRESETS[id][+i]));
      if (keep === false) B().parts[id].mounted = false;
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
      if (/\.(g|name)$/.test(t.dataset.path)) delete B().parts[pm[1]].components; // まとめたパーツの内訳も外す
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
  }

  renderAll();
  refresh3D();
  save();
})();

// 画面の操作:フォーム ⇔ カードJSON の同期、保存、画像の読み込み、書き出し。

(() => {
  const STORE_KEY = "member_cards_v1";
  const IMAGE_PLACEHOLDER = "[埋め込み画像]";
  const EXPORT_SCALE = 2; // PNG は 2048 x 2880px で書き出す

  const $ = (id) => document.getElementById(id);
  const form = $("form");
  const canvas = $("card");

  let cards = [];
  let current = null;

  // ---------------- 保存 ----------------

  function loadCards() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (Array.isArray(raw) && raw.length) return raw.map(CardFormat.normalize);
    } catch (e) {
      // 読めないときは見本から始める
    }
    return SAMPLE_CARDS.map(CardFormat.normalize);
  }

  let saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(cards));
      } catch (e) {
        toast("ブラウザの保存容量が足りません。「全カードをJSON保存」で書き出してください。");
      }
    }, 400);
  }

  // ---------------- 画像 ----------------

  const imageCache = new Map();
  function getImage(src) {
    if (!src) return null;
    const hit = imageCache.get(src);
    if (hit) return hit.img;
    const entry = { img: null };
    imageCache.set(src, entry);
    CardRenderer.loadImage(src).then((img) => {
      entry.img = img;
      scheduleRender();
    });
    return null;
  }

  function imagesFor(card) {
    return {
      art: getImage(card.art.image),
      attribute: card.attribute === "custom" ? getImage(card.customAttribute.image) : null,
    };
  }

  function fileToDataUrl(file, maxSide, type) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL(type, 0.9));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("画像を読み込めませんでした。"));
      };
      img.src = url;
    });
  }

  // ---------------- 描画 ----------------

  let renderQueued = false;
  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      if (current) CardRenderer.render(canvas, current, imagesFor(current), 1);
    });
  }

  // ---------------- フォーム ----------------

  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  function setPath(obj, path, value) {
    const keys = path.split(".");
    const last = keys.pop();
    keys.reduce((o, k) => o[k], obj)[last] = value;
  }

  function fillSelect(el, entries) {
    el.innerHTML = "";
    entries.forEach(([value, label]) => el.add(new Option(label, value)));
  }

  function fillForm() {
    form.querySelectorAll("[name]").forEach((el) => {
      const v = getPath(current, el.name);
      el.value = v === undefined || v === null ? "" : v;
    });
    $("frameColorPick").value = current.frameColor || CardFormat.CARD_TYPES[current.cardType].frame;
    updateDependentUi();
  }

  function updateDependentUi() {
    const type = CardFormat.CARD_TYPES[current.cardType];
    $("levelOut").textContent = type.monster ? current.level : "—";
    form.querySelector('[name="level"]').disabled = !type.monster;
    $("monsterOnly").hidden = !type.monster;
    $("statsRow").hidden = !type.monster;
    $("abilities").placeholder = type.ability || "(なし)";
    $("customAttr").hidden = current.attribute !== "custom";
    if (!current.frameColor) $("frameColorPick").value = type.frame;
    $("imagePrompt").value = CardFormat.buildImagePrompt(current, $("artStyle").value);
    $("cardJson").value = cardJsonForView(current);
  }

  function onFormInput(e) {
    const el = e.target;
    if (!el.name || !current) return;
    let v = el.value;
    if (el.type === "range") v = Number(v);
    setPath(current, el.name, v);
    if (el.name === "cardType") {
      // 魔法・罠に切り替えたら属性マークも合わせる
      if (v === "spell") current.attribute = "魔";
      else if (v === "trap") current.attribute = "罠";
      else if (current.attribute === "魔" || current.attribute === "罠") current.attribute = "光";
      form.querySelector('[name="attribute"]').value = current.attribute;
    }
    if (el.name === "frameColor" && /^#[0-9a-f]{6}$/i.test(v)) $("frameColorPick").value = v;
    changed();
  }

  function changed() {
    updateDependentUi();
    refreshList();
    scheduleRender();
    scheduleSave();
  }

  function setCard(card) {
    const idx = cards.findIndex((c) => c.id === card.id);
    current = CardFormat.normalize(card);
    if (idx >= 0) cards[idx] = current;
    else cards.push(current);
    fillForm();
    refreshList();
    scheduleRender();
    scheduleSave();
  }

  // ---------------- カード一覧 ----------------

  function refreshList() {
    const list = $("cardList");
    list.innerHTML = "";
    cards.forEach((c, i) => {
      const label = `${i + 1}. ${c.name.trim() || "(名前未入力)"}${c.cardCode ? "  " + c.cardCode : ""}`;
      list.add(new Option(label, c.id, false, c === current));
    });
  }

  function selectCard(id) {
    current = cards.find((c) => c.id === id) || cards[0];
    fillForm();
    refreshList();
    scheduleRender();
  }

  function newCard() {
    const c = CardFormat.createDefault();
    const n = cards.length + 1;
    c.cardCode = "WB-" + String(n).padStart(3, "0");
    cards.push(c);
    selectCard(c.id);
    scheduleSave();
  }

  function duplicateCard() {
    const c = CardFormat.normalize(JSON.parse(JSON.stringify(current)));
    c.id = CardFormat.uid();
    c.name = c.name + "(コピー)";
    cards.splice(cards.indexOf(current) + 1, 0, c);
    selectCard(c.id);
    scheduleSave();
  }

  function deleteCard() {
    if (!confirm(`「${current.name || "(名前未入力)"}」を削除しますか?`)) return;
    cards = cards.filter((c) => c !== current);
    if (!cards.length) cards.push(CardFormat.createDefault());
    selectCard(cards[0].id);
    scheduleSave();
  }

  // ---------------- JSON ----------------

  // 画面表示用:長い画像データは短い目印に置き換える
  function cardJsonForView(card) {
    const c = JSON.parse(JSON.stringify(card));
    if (c.art.image && c.art.image.startsWith("data:")) c.art.image = IMAGE_PLACEHOLDER;
    if (c.customAttribute.image && c.customAttribute.image.startsWith("data:")) c.customAttribute.image = IMAGE_PLACEHOLDER;
    return JSON.stringify(c, null, 2);
  }

  function applyCardJson() {
    try {
      const obj = CardFormat.parseLooseJson($("cardJson").value);
      if (obj.art && obj.art.image === IMAGE_PLACEHOLDER) obj.art.image = current.art.image;
      if (obj.customAttribute && obj.customAttribute.image === IMAGE_PLACEHOLDER) obj.customAttribute.image = current.customAttribute.image;
      obj.id = current.id;
      setCard(obj);
      toast("JSONを反映しました。");
    } catch (e) {
      toast("JSONを読み取れませんでした: " + e.message);
    }
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function safeName(card) {
    return [card.cardCode, card.name].filter(Boolean).join("_").replace(/[\\/:*?"<>|\s]+/g, "_") || "card";
  }

  function exportJson(list, filename) {
    const body = JSON.stringify({ formatVersion: CardFormat.VERSION, cards: list }, null, 2);
    download(new Blob([body], { type: "application/json" }), filename);
  }

  function importJson(text) {
    const data = JSON.parse(text);
    const list = Array.isArray(data) ? data : Array.isArray(data.cards) ? data.cards : [data];
    const ids = new Set(cards.map((c) => c.id));
    const added = list.map((raw) => {
      const c = CardFormat.normalize(raw);
      if (ids.has(c.id)) c.id = CardFormat.uid();
      return c;
    });
    cards.push(...added);
    selectCard(added[0].id);
    scheduleSave();
    toast(`${added.length}枚のカードを読み込みました。`);
  }

  // ---------------- PNG ----------------

  async function renderToBlob(card) {
    const imgs = {
      art: await CardRenderer.loadImage(card.art.image),
      attribute: card.attribute === "custom" ? await CardRenderer.loadImage(card.customAttribute.image) : null,
    };
    const c = document.createElement("canvas");
    CardRenderer.render(c, card, imgs, EXPORT_SCALE);
    return new Promise((resolve) => c.toBlob(resolve, "image/png"));
  }

  async function savePng(card) {
    download(await renderToBlob(card), safeName(card) + ".png");
  }

  async function saveAllPng() {
    for (const card of cards) {
      await savePng(card);
      await new Promise((r) => setTimeout(r, 350)); // 連続ダウンロードがブロックされないよう間隔をあける
    }
    toast(`${cards.length}枚を書き出しました。`);
  }

  // ---------------- AI ----------------

  function setAiStatus(msg, isError) {
    const el = $("aiStatus");
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
  }

  async function runAi() {
    const btn = $("btnAi");
    btn.disabled = true;
    setAiStatus("AIがカードを考えています…");
    try {
      const result = await CardAI.generateCard(current.member, $("aiExtra").value);
      setCard(CardFormat.applyAiResult(current, result));
      setAiStatus("カード文面を反映しました。気に入らなければもう一度押すと別案が出ます。");
    } catch (e) {
      setAiStatus(e.message, true);
      if (/APIキー/.test(e.message)) $("aiSettings").open = true;
    } finally {
      btn.disabled = false;
    }
  }

  async function copyText(text, done) {
    try {
      await navigator.clipboard.writeText(text);
      toast(done);
    } catch (e) {
      toast("コピーできませんでした。テキストを選択してコピーしてください。");
    }
  }

  // 既存のトレカ画像(縦長のカード全体)を入れたとき、イラスト枠の部分だけが見えるように拡大・位置合わせする。
  // 比率は見本カード画像(1024x1536)のイラスト枠の位置。
  const CARD_ART_REGION = { left: 0.114, right: 0.886, top: 0.17, bottom: 0.651 };

  async function cropFromCardImage() {
    const img = await CardRenderer.loadImage(current.art.image);
    if (!img) return toast("先に「写真・イラスト」にトレカ画像を入れてください。");
    const a = CardRenderer.LAYOUT.art;
    const r = CARD_ART_REGION;
    const rw = (r.right - r.left) * img.width;
    const rh = (r.bottom - r.top) * img.height;
    const s = Math.max(a.w / rw, a.h / rh);
    const s0 = Math.max(a.w / img.width, a.h / img.height);
    current.art.zoom = Math.min(4, s / s0);
    current.art.x = Math.max(-1, Math.min(1, (s * (img.width / 2 - ((r.left + r.right) / 2) * img.width)) / a.w));
    current.art.y = Math.max(-1, Math.min(1, (s * (img.height / 2 - ((r.top + r.bottom) / 2) * img.height)) / a.h));
    syncArtInputs();
    changed();
    toast("イラスト部分だけを切り出しました。ずれていればドラッグで微調整してください。");
  }

  // ---------------- イラストのドラッグ・ズーム ----------------

  function toCardCoords(e) {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * CardRenderer.W, y: ((e.clientY - r.top) / r.height) * CardRenderer.H };
  }

  function inArt(p) {
    const a = CardRenderer.LAYOUT.art;
    return p.x >= a.x && p.x <= a.x + a.w && p.y >= a.y && p.y <= a.y + a.h;
  }

  function syncArtInputs() {
    ["art.zoom", "art.x", "art.y"].forEach((n) => (form.querySelector(`[name="${n}"]`).value = getPath(current, n)));
  }

  let drag = null;
  canvas.addEventListener("pointerdown", (e) => {
    const p = toCardCoords(e);
    if (!current.art.image || !inArt(p)) return;
    drag = { p, x: current.art.x, y: current.art.y };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    const p = toCardCoords(e);
    canvas.style.cursor = current && current.art.image && inArt(p) ? (drag ? "grabbing" : "grab") : "default";
    if (!drag) return;
    const a = CardRenderer.LAYOUT.art;
    current.art.x = Math.max(-1, Math.min(1, drag.x + (p.x - drag.p.x) / a.w));
    current.art.y = Math.max(-1, Math.min(1, drag.y + (p.y - drag.p.y) / a.h));
    syncArtInputs();
    scheduleRender();
  });
  const endDrag = () => {
    if (!drag) return;
    drag = null;
    changed();
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener(
    "wheel",
    (e) => {
      if (!current.art.image || !inArt(toCardCoords(e))) return;
      e.preventDefault();
      current.art.zoom = Math.max(0.5, Math.min(4, current.art.zoom * Math.exp(-e.deltaY * 0.0015)));
      syncArtInputs();
      scheduleRender();
      scheduleSave();
    },
    { passive: false }
  );

  // ---------------- その他 ----------------

  let toastTimer = null;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  function init() {
    fillSelect($("cardType"), Object.entries(CardFormat.CARD_TYPES).map(([k, v]) => [k, v.label]));
    fillSelect($("attribute"), Object.entries(CardFormat.ATTRIBUTES).map(([k, v]) => [k, v.label]));
    fillSelect($("artEffect"), Object.entries(CardFormat.ART_EFFECTS).map(([k, v]) => [k, v.label]));
    fillSelect($("nameColor"), Object.entries(CardFormat.NAME_COLORS).map(([k, v]) => [k, v.label]));
    fillSelect($("artStyle"), Object.entries(CardFormat.ART_STYLES).map(([k, v]) => [k, v.label]));
    fillSelect($("aiModel"), CardAI.MODELS.map((m) => [m.id, m.label]));

    const ai = CardAI.loadSettings();
    $("apiKey").value = ai.apiKey;
    $("aiModel").value = ai.model;
    $("apiKey").addEventListener("change", (e) => CardAI.saveSettings({ apiKey: e.target.value.trim() }));
    $("aiModel").addEventListener("change", (e) => CardAI.saveSettings({ model: e.target.value }));

    form.addEventListener("input", onFormInput);
    form.addEventListener("change", onFormInput);
    $("frameColorPick").addEventListener("input", (e) => {
      current.frameColor = e.target.value;
      form.querySelector('[name="frameColor"]').value = e.target.value;
      changed();
    });
    $("artStyle").addEventListener("change", updateDependentUi);

    $("artFile").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        current.art.image = await fileToDataUrl(file, 1600, "image/jpeg");
        Object.assign(current.art, { zoom: 1, x: 0, y: 0 });
        fillForm();
        changed();
      } catch (err) {
        toast(err.message);
      }
      e.target.value = "";
    });
    $("attrFile").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        current.customAttribute.image = await fileToDataUrl(file, 256, "image/png");
        changed();
      } catch (err) {
        toast(err.message);
      }
      e.target.value = "";
    });
    $("btnCropCard").addEventListener("click", cropFromCardImage);
    $("btnClearArt").addEventListener("click", () => {
      current.art.image = null;
      changed();
    });
    $("btnClearAttrImg").addEventListener("click", () => {
      current.customAttribute.image = null;
      changed();
    });

    $("cardList").addEventListener("change", (e) => selectCard(e.target.value));
    $("btnNew").addEventListener("click", newCard);
    $("btnDup").addEventListener("click", duplicateCard);
    $("btnDelete").addEventListener("click", deleteCard);
    $("btnImport").addEventListener("click", () => $("importFile").click());
    $("importFile").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        importJson(await file.text());
      } catch (err) {
        toast("読み込めませんでした: " + err.message);
      }
      e.target.value = "";
    });
    $("btnExportAll").addEventListener("click", () => exportJson(cards, "member_cards.json"));
    $("btnJson").addEventListener("click", () => exportJson([current], safeName(current) + ".json"));
    $("btnPng").addEventListener("click", () => savePng(current));
    $("btnAllPng").addEventListener("click", saveAllPng);
    $("btnApplyCardJson").addEventListener("click", applyCardJson);

    $("btnAi").addEventListener("click", runAi);
    $("btnCopyPrompt").addEventListener("click", () =>
      copyText(CardFormat.buildCopyPrompt(current.member, $("aiExtra").value), "プロンプトをコピーしました。チャットAIに貼り付けてください。")
    );
    $("btnApplyJson").addEventListener("click", () => {
      try {
        setCard(CardFormat.applyAiResult(current, $("pasteJson").value));
        $("pasteJson").value = "";
        toast("AIの回答を反映しました。");
      } catch (e) {
        toast("JSONを読み取れませんでした: " + e.message);
      }
    });
    $("btnCopyImagePrompt").addEventListener("click", () => copyText($("imagePrompt").value, "画像生成用プロンプトをコピーしました。"));

    cards = loadCards();
    selectCard(cards[0].id);
    // Webフォントが届いたら描き直す
    CardRenderer.loadFonts().then(scheduleRender);
  }

  init();
})();

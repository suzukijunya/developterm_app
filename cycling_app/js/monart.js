// デュエルのモンスターの姿(3Dモデル)。
// ガレージで GLB(meshy.ai などで作った3Dモデル)を読み込むと、その場で1枚の絵(透明な背景のPNG)に焼いて端末に保存する。
// 走行中の画面はその絵を使うだけなので、three.js も3D描画もいらない(電池と速さのため)。
// GLB と絵は IndexedDB(cycling_garage / photos)に置き、同期しない。向きの設定(Store.garage.monsters)だけ同期する。

const MonsterArt = (() => {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // モデルを割り当てられるモンスター(自分のデッキ・シンクロ・エース・共通)。prompt は meshy.ai などで作るときの例
  const SLOTS = [
    { id: "ソニック・ストリーム・ドラゴン", icon: "🐲", note: "エース(運命のドロー)", prompt: "a sleek white and gold mechanical dragon with glowing blue wings, made of carbon fiber bicycle parts, heroic pose, game monster, full body" },
    { id: "ストリーム・ドラゴン", icon: "🐲", note: "シンクロ Lv8", prompt: "a streamlined silver mechanical dragon with wind-shaped wings, bicycle chain details, game monster, full body" },
    { id: "ホライズン・ウォリアー", icon: "⚔️", note: "シンクロ Lv7", prompt: "an armored knight warrior with a long lance, cycling-themed armor, game monster, full body" },
    { id: "ケイデンス・ナイト", icon: "🛡️", note: "シンクロ Lv6", prompt: "a knight with a round shield shaped like a bicycle wheel, game monster, full body" },
    { id: "シンクロ・スプリンター", icon: "💫", note: "シンクロ Lv5", prompt: "a fast humanoid robot sprinter with glowing green lines, game monster, full body" },
    { id: "カーボン・ドラゴン", icon: "🐉", note: "Lv6", prompt: "a black carbon fiber dragon, matte with blue highlights, game monster, full body" },
    { id: "エアロ・ファルコン", icon: "🦅", note: "Lv4", prompt: "a mechanical falcon with aerodynamic metal wings, game monster" },
    { id: "スポーク・ガーディアン", icon: "🛡️", note: "Lv4", prompt: "a guardian golem holding a large spoked wheel as a shield, game monster, full body" },
    { id: "スプロケット・ナイト", icon: "⚙️", note: "Lv3", prompt: "a small knight made of gears and sprockets, game monster, full body" },
    { id: "ケイデンス・シンクロン", icon: "🎵", note: "チューナー Lv3", prompt: "a small cute robot with a metronome head, glowing green, game monster" },
    { id: "チェーン・ウルフ", icon: "🐺", note: "チューナー Lv2", prompt: "a wolf made of bicycle chains and metal plates, game monster, full body" },
    { id: "ドラフティング・ラビット", icon: "🐇", note: "Lv2", prompt: "a cute aerodynamic rabbit with a cycling helmet, game monster" },
    { id: "*you", icon: "🙂", note: "自分のモンスター(上で決めていないもの全部)", prompt: "" },
    { id: "*opp", icon: "😈", note: "相手のモンスター(全部)", prompt: "a dark menacing mechanical monster with red glowing eyes, game monster, full body" },
  ];
  // カードに出す数字とテキスト(バトルのカードと同じ値)
  const CARD = {
    "ソニック・ストリーム・ドラゴン": { lv: 10, atk: 3500, kind: "ace", attr: "光", type: "ドラゴン族/エース", text: "運命のドローで呼ばれる。相手のいちばん強いモンスターを破壊して現れる。攻撃した後、相手に500ダメージ。" },
    "ストリーム・ドラゴン": { lv: 8, atk: 3000, kind: "synchro", attr: "風", type: "ドラゴン族/シンクロ", text: "チューナー+チューナー以外のモンスター。攻撃した後、相手に500ダメージ。" },
    "ホライズン・ウォリアー": { lv: 7, atk: 2700, kind: "synchro", attr: "風", type: "戦士族/シンクロ", text: "チューナー+チューナー以外のモンスター。地平の彼方から駆けつける戦士。" },
    "ケイデンス・ナイト": { lv: 6, atk: 2500, kind: "synchro", attr: "風", type: "戦士族/シンクロ", text: "チューナー+チューナー以外のモンスター。1ターンに1度、戦闘では破壊されない。" },
    "シンクロ・スプリンター": { lv: 5, atk: 2300, kind: "synchro", attr: "風", type: "機械族/シンクロ", text: "チューナー+チューナー以外のモンスター。シンクロ召喚すると1枚ドロー。" },
    "カーボン・ドラゴン": { lv: 6, atk: 2400, kind: "effect", attr: "風", type: "ドラゴン族/効果", text: "スピードカウンターが5以上なら召喚できる。" },
    "エアロ・ファルコン": { lv: 4, atk: 1800, kind: "normal", attr: "風", type: "鳥獣族", text: "空気を切り裂く翼。向かい風の中でも速度を落とさない。" },
    "スポーク・ガーディアン": { lv: 4, atk: 1600, kind: "effect", attr: "地", type: "岩石族/効果", text: "1ターンに1度、戦闘では破壊されない。" },
    "スプロケット・ナイト": { lv: 3, atk: 1300, kind: "normal", attr: "地", type: "機械族", text: "歯車の騎士。チューナーと組んでシンクロ召喚につなげる。" },
    "ケイデンス・シンクロン": { lv: 3, atk: 1000, kind: "tuner", attr: "光", type: "機械族/チューナー", text: "召喚すると、手札のレベル3以下のモンスター1体を特殊召喚する。" },
    "チェーン・ウルフ": { lv: 2, atk: 800, kind: "tuner", attr: "地", type: "獣族/チューナー", text: "召喚すると、スピードカウンターが1つ増える。" },
    "ドラフティング・ラビット": { lv: 2, atk: 600, kind: "effect", attr: "風", type: "獣族/効果", text: "召喚すると1枚ドロー。" },
  };
  for (const sl of SLOTS) if (CARD[sl.id]) sl.card = CARD[sl.id];
  const urls = {};
  let loading = null;

  function db() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("no indexedDB"));
      const req = indexedDB.open("cycling_garage", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("photos");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function get(key) {
    const d = await db();
    return new Promise((resolve) => {
      const req = d.transaction("photos").objectStore("photos").get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }
  async function put(key, blob) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction("photos", "readwrite");
      if (blob == null) tx.objectStore("photos").delete(key);
      else tx.objectStore("photos").put(blob, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  const meta = () => (typeof Store !== "undefined" && Store.garage && Store.garage.monsters) || {};

  // 保存してある絵を読み込む(アプリの起動時に1回)
  function load() {
    if (loading) return loading;
    loading = (async () => {
      for (const id of Object.keys(meta())) {
        try {
          const b = await get("monimg:" + id);
          if (b) urls[id] = URL.createObjectURL(b);
        } catch (e) {
          // 読めなければ絵文字のまま
        }
      }
    })();
    return loading;
  }
  function setUrl(id, blob) {
    if (urls[id]) URL.revokeObjectURL(urls[id]);
    if (blob) urls[id] = URL.createObjectURL(blob);
    else delete urls[id];
  }
  // モンスターの絵のURL(なければ null)。side: そのモンスターを出した側
  function src(m, side) {
    if (!m) return null;
    return urls[m.name] || urls["*" + (side || "you")] || null;
  }
  // 絵があれば <img>、なければ絵文字
  function icon(m, side, cls = "") {
    const u = src(m, side);
    return u ? `<img class="mart ${cls}" src="${u}" alt="${esc(m.name)}" draggable="false" />` : `<span class="memo ${cls}">${m.icon || "❔"}</span>`;
  }

  // ---------- ガレージ: GLB を絵に焼く(three.js と GLTFLoader があるページだけ) ----------
  // tf: { rotY(ラジアン), flip(上下さかさま) }
  async function render(buffer, tf = {}) {
    const THREE = window.THREE;
    if (!THREE || !window.GLTFLoader) throw new Error("3D表示が使えないページです");
    const gltf = await new Promise((res, rej) => new window.GLTFLoader().parse(buffer, "", res, (e) => rej(e || new Error("読み込めませんでした"))));
    const model = gltf.scene;
    model.traverse((o) => {
      if (!o.isMesh) return;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        m.side = THREE.DoubleSide;
        if (m.metalness != null) m.metalness = Math.min(m.metalness, 0.35); // 環境マップなしでも暗くならないように
        if (m.roughness != null) m.roughness = Math.max(m.roughness, 0.35);
      }
    });
    // 向き → 大きさを1にそろえ、足元を床に、中心を真ん中に
    const turn = new THREE.Group();
    turn.add(model);
    turn.rotation.set(tf.flip ? Math.PI : 0, (tf.rotY || 0) - 0.55, 0); // 少し斜めから(3/4ビュー)
    const holder = new THREE.Group();
    holder.add(turn);
    holder.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(holder);
    const size = box.getSize(new THREE.Vector3());
    const k = 1 / Math.max(size.x, size.y, size.z, 1e-6);
    holder.scale.setScalar(k);
    holder.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(holder);
    const c = box.getCenter(new THREE.Vector3());
    holder.position.set(-c.x, -box.min.y, -c.z);
    holder.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(holder);
    const h = box.max.y;
    const scene = new THREE.Scene();
    scene.add(holder);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334466, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(-1.5, 2.5, 2.5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fd8ff, 1.2);
    rim.position.set(2, 1.5, -2.5);
    scene.add(rim);
    const W = 512;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(W, W, false);
    renderer.setClearColor(0x000000, 0);
    if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
    // 少し下から見上げる(強そうに見える)
    const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const dist = (sphere.radius / Math.sin(THREE.MathUtils.degToRad(15))) * 1.02;
    cam.position.set(0, h * 0.25, dist);
    cam.lookAt(0, h * 0.5, 0);
    renderer.render(scene, cam);
    const blob = await new Promise((res) => renderer.domElement.toBlob(res, "image/png"));
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    model.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          for (const t of ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap"]) if (m[t]) m[t].dispose();
          m.dispose();
        }
      }
    });
    return blob;
  }

  // GLB を保存して絵を作る。戻り値: 作った絵(Blob)
  async function assign(id, file, tf) {
    const buf = await file.arrayBuffer();
    const img = await render(buf, tf);
    await put("mon:" + id, file);
    await put("monimg:" + id, img);
    setUrl(id, img);
    return img;
  }
  // 向きを変えて、保存してあるGLBから絵を作り直す
  async function rerender(id, tf) {
    const glb = await get("mon:" + id);
    if (!glb) throw new Error("この端末にモデルのファイルがありません");
    const img = await render(await glb.arrayBuffer(), tf);
    await put("monimg:" + id, img);
    setUrl(id, img);
    return img;
  }
  async function remove(id) {
    await put("mon:" + id, null);
    await put("monimg:" + id, null);
    setUrl(id, null);
  }
  const has = (id) => !!urls[id];
  const url = (id) => urls[id] || null;

  return { SLOTS, load, src, icon, assign, rerender, remove, has, url };
})();

if (typeof module !== "undefined") module.exports = MonsterArt;

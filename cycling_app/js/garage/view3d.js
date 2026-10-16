// ガレージの3D表示(three.js)。工房の作業スタンドに載ったバイクと、乗ったときのライダーを描く。
// 部位ごとにまとめて描くので、光らせる・外す/付ける・分解して見せる、ができる。

const View3D = (() => {
  const T = () => window.THREE;
  const V = (p) => new (T().Vector3)(p.x, p.y, p.z || 0);

  let renderer, scene, camera, root, bikeGroup, riderGroup, envGroup, flowPoints;
  let container;
  let groups = {}; // 部位ID → THREE.Group
  let anim = { crank: 90, pedaling: true, exploded: 0, explodeTarget: 0, flow: false, rider: false };
  let state = null; // { fit結果, build, body }
  let cam = { az: 0.0, el: 0.12, dist: 2.6, target: null, goal: null };
  let highlightId = null;
  let mountAnim = {}; // 部位ID → { t, dir }
  let riderParts = [];
  let raf = 0;
  let lastT = 0;

  const COLORS = {
    tire: 0x1b1b1f,
    rim: 0x2a2d34,
    metal: 0x9aa3ad,
    dark: 0x24262b,
    saddle: 0x15161a,
    tape: 0x111214,
    jersey: 0x0a3d91,
    shorts: 0x14161c,
    skin: 0xe3b48f,
    shoe: 0xf2f2f2,
    helmet: 0xffffff,
  };

  // ---------- 初期化 ----------
  function create(el) {
    container = el;
    const THREE = T();
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding;
    el.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1d2330);
    scene.fog = new THREE.Fog(0x1d2330, 6, 14);
    camera = new THREE.PerspectiveCamera(40, 1, 0.05, 50);
    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x3a3226, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(2, 4, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7fb0ff, 0.45);
    rim.position.set(-3, 2, -2);
    scene.add(rim);
    root = new THREE.Group();
    scene.add(root);
    envGroup = new THREE.Group();
    scene.add(envGroup);
    buildEnvironment();
    cam.target = new THREE.Vector3(0.15, 0.55, 0);
    cam.goal = cam.target.clone();
    bindControls(renderer.domElement);
    resize();
    window.addEventListener("resize", resize);
    lastT = performance.now();
    loop();
  }

  function resize() {
    if (!renderer || !container) return;
    const w = container.clientWidth || 360;
    const h = container.clientHeight || 300;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // 工房: 床・壁・有孔ボード・作業スタンド
  function buildEnvironment() {
    const THREE = T();
    const floorTex = canvasTexture(256, (g, s) => {
      g.fillStyle = "#4a4e57";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 900; i++) {
        g.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
        g.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
      g.strokeStyle = "rgba(0,0,0,0.25)";
      g.lineWidth = 2;
      g.strokeRect(0, 0, s, s);
    });
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(8, 8);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2;
    floor.name = "floor";
    envGroup.add(floor);
    // 有孔ボードの壁
    const pegTex = canvasTexture(128, (g, s) => {
      g.fillStyle = "#b48a5a";
      g.fillRect(0, 0, s, s);
      g.fillStyle = "#6b4e2e";
      for (let x = 8; x < s; x += 16) for (let y = 8; y < s; y += 16) g.fillRect(x - 2, y - 2, 4, 4);
    });
    pegTex.wrapS = pegTex.wrapT = THREE.RepeatWrapping;
    pegTex.repeat.set(10, 4);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), new THREE.MeshStandardMaterial({ map: pegTex, roughness: 1 }));
    wall.position.set(0, 2, -1.6);
    wall.name = "wall";
    envGroup.add(wall);
    // 壁の工具(シルエット)
    const toolMat = new THREE.MeshStandardMaterial({ color: 0x30343c, metalness: 0.6, roughness: 0.4 });
    for (let i = 0; i < 7; i++) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.25 + (i % 3) * 0.08, 0.02), toolMat);
      t.position.set(-1.2 + i * 0.22, 1.7, -1.58);
      t.rotation.z = (i % 2 ? 1 : -1) * 0.15;
      envGroup.add(t);
    }
    // 作業スタンド(整備モードのときだけ見せる)
    const stand = new THREE.Group();
    stand.name = "stand";
    const sMat = new THREE.MeshStandardMaterial({ color: 0x2b2f36, metalness: 0.5, roughness: 0.5 });
    const accent = new THREE.MeshStandardMaterial({ color: 0x1f6fe5, metalness: 0.3, roughness: 0.4 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 12), sMat);
    pole.name = "pole";
    stand.add(pole);
    for (let i = 0; i < 3; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), sMat);
      leg.name = "leg";
      leg.userData.ang = (i / 3) * Math.PI * 2;
      stand.add(leg);
    }
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.04), sMat);
    arm.name = "arm";
    stand.add(arm);
    const clampM = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), accent);
    clampM.name = "clamp";
    stand.add(clampM);
    envGroup.add(stand);
  }

  function canvasTexture(size, draw) {
    const THREE = T();
    const c = document.createElement("canvas");
    c.width = c.height = size;
    draw(c.getContext("2d"), size);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // ---------- 形を作る小道具 ----------
  function mat(color, opts = {}) {
    const THREE = T();
    return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.45, metalness: 0.2 }, opts));
  }

  // a から b への円柱(rx, rz で断面を楕円にできる)
  function tube(a, b, r, material, flat = 1) {
    const THREE = T();
    const A = V(a), B = V(b);
    const dir = new THREE.Vector3().subVectors(B, A);
    const L = dir.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 16), material);
    m.position.copy(A).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    if (flat !== 1) m.scale.set(1, 1, flat);
    return m;
  }

  function box(center, size, material) {
    const THREE = T();
    const m = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    m.position.copy(V(center));
    return m;
  }

  function group(id) {
    const THREE = T();
    const g = new THREE.Group();
    g.name = id;
    g.userData.slot = id;
    bikeGroup.add(g);
    groups[id] = g;
    return g;
  }

  // 前後のホイール。リムの高さ(mm)とタイヤ幅(mm)で形が変わる
  function wheel(center, R, tireW, rimMm, disc, gw, gt) {
    const THREE = T();
    const tw = tireW / 1000;
    const rimOuter = R - tw * 0.9;
    const rimInner = rimOuter - Math.max(0.018, rimMm / 1000);
    // タイヤ(タイヤの部位)
    const tire = new THREE.Mesh(new THREE.TorusGeometry(R - tw / 2, tw / 2, 12, 64), mat(COLORS.tire, { roughness: 0.9 }));
    tire.position.copy(V(center));
    gt.add(tire);
    // リム(ホイールの部位): 断面が四角いドーナツ
    const pts = [
      new THREE.Vector2(rimInner, -0.011),
      new THREE.Vector2(rimOuter, -0.012),
      new THREE.Vector2(rimOuter, 0.012),
      new THREE.Vector2(rimInner, 0.011),
      new THREE.Vector2(rimInner, -0.011),
    ];
    const rim = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), mat(rimMm >= 30 ? 0x111317 : COLORS.rim, { metalness: 0.5, roughness: 0.35 }));
    rim.rotation.x = Math.PI / 2;
    rim.position.copy(V(center));
    gw.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 16), mat(COLORS.metal, { metalness: 0.8 }));
    hub.rotation.x = Math.PI / 2;
    hub.position.copy(V(center));
    gw.add(hub);
    if (disc) {
      const d = new THREE.Mesh(new THREE.CylinderGeometry(rimInner, rimInner, 0.02, 48), mat(0x15171b, { metalness: 0.4 }));
      d.rotation.x = Math.PI / 2;
      d.position.copy(V(center));
      gw.add(d);
    } else {
      const spokes = new THREE.Group();
      const n = rimMm >= 40 ? 20 : 24;
      const geom = new THREE.BufferGeometry();
      const arr = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const side = i % 2 ? 0.035 : -0.035;
        arr.push(0, 0, side, Math.cos(a) * rimInner, Math.sin(a) * rimInner, 0);
      }
      geom.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
      spokes.add(new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ color: 0xb8c0c8 })));
      spokes.position.copy(V(center));
      spokes.userData.spin = true;
      gw.add(spokes);
    }
  }

  // ドロップハンドルの片側の形
  function barPath(c, reach, drop, hw, side) {
    const THREE = T();
    const z = side * hw;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(c.x, c.y, side * 0.02),
      new THREE.Vector3(c.x, c.y, side * (hw - 0.04)),
      new THREE.Vector3(c.x + reach * 0.7, c.y + 0.005, z),
      new THREE.Vector3(c.x + reach, c.y - drop * 0.25, z),
      new THREE.Vector3(c.x + reach * 0.8, c.y - drop * 0.8, z + side * 0.01),
      new THREE.Vector3(c.x + reach * 0.3, c.y - drop, z + side * 0.015),
      new THREE.Vector3(c.x - 0.04, c.y - drop + 0.01, z + side * 0.015),
    ]);
  }

  // ---------- バイク ----------
  function buildBike(fit, build) {
    const THREE = T();
    if (bikeGroup) root.remove(bikeGroup);
    bikeGroup = new THREE.Group();
    root.add(bikeGroup);
    groups = {};
    const bk = fit.bike;
    const parts = build.parts;
    const at = (id) => (parts[id] && parts[id].attrs) || {};
    const color = build.color || "#0a3d91";
    const frameMat = mat(new THREE.Color(color), { metalness: 0.35, roughness: 0.3 });
    const aero = at("frame").aero === "aero";
    const tr = aero ? 0.024 : 0.019;
    const flat = aero ? 0.55 : 1;

    // フレーム
    const gf = group("frame");
    const bb = { x: 0, y: 0, z: 0 };
    gf.add(tube(bk.ttFront, bk.stTop, tr * 0.85, frameMat, flat));
    gf.add(tube(bk.dtFront, bb, tr * 1.2, frameMat, flat));
    gf.add(tube(bb, bk.stTop, tr, frameMat, flat));
    gf.add(tube(bk.htTop, bk.htBot, tr * 1.25, frameMat));
    const stTopBack = { x: bk.stTop.x * 0.92, y: bk.stTop.y * 0.92 };
    for (const s of [-1, 1]) {
      gf.add(tube({ x: stTopBack.x, y: stTopBack.y, z: s * 0.012 }, { x: bk.rearAxle.x, y: bk.rearAxle.y, z: s * 0.065 }, 0.009, frameMat));
      gf.add(tube({ x: 0, y: 0, z: s * 0.03 }, { x: bk.rearAxle.x, y: bk.rearAxle.y, z: s * 0.065 }, 0.011, frameMat));
    }
    gf.add(tube({ x: 0, y: 0, z: -0.04 }, { x: 0, y: 0, z: 0.04 }, 0.022, frameMat));

    // フォーク
    const gk = group("fork");
    const forkMat = frameMat.clone();
    gk.add(tube(bk.htTop, add3(bk.htTop, mul3(bk.up, 0.01)), 0.016, mat(COLORS.dark)));
    for (const s of [-1, 1]) gk.add(tube({ x: bk.crown.x, y: bk.crown.y, z: s * 0.03 }, { x: bk.frontAxle.x, y: bk.frontAxle.y, z: s * 0.05 }, aero ? 0.014 : 0.012, forkMat, aero ? 0.6 : 1));
    gk.add(tube({ x: bk.crown.x, y: bk.crown.y, z: -0.035 }, { x: bk.crown.x, y: bk.crown.y, z: 0.035 }, 0.016, forkMat));

    // ホイールとタイヤ
    const gw = group("wheels");
    const gt = group("tires");
    group("tubes"); // 見えないが、選ぶとタイヤと一緒に光らせる
    const w = at("wheels");
    const tireW = at("tires").width || 28;
    wheel(bk.frontAxle, bk.R, tireW, w.rimFront || 25, false, gw, gt);
    wheel(bk.rearAxle, bk.R, tireW, w.rimRear || 25, !!w.discRear, gw, gt);

    // コンポ: クランク・チェーンリング・スプロケット・変速機・ブレーキ・チェーン・シフター
    const gg = group("groupset");
    const metal = mat(COLORS.metal, { metalness: 0.85, roughness: 0.25 });
    const darkM = mat(COLORS.dark, { metalness: 0.6, roughness: 0.35 });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.006, 40), darkM);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0, 0.055);
    gg.add(ring);
    const crank = new THREE.Group();
    crank.name = "crank";
    crank.userData.crank = true;
    const armR = box({ x: 0, y: bk.p.crank / 2, z: 0.07 }, [0.02, bk.p.crank, 0.012], darkM);
    const armL = box({ x: 0, y: -bk.p.crank / 2, z: -0.07 }, [0.02, bk.p.crank, 0.012], darkM);
    crank.add(armR, armL);
    gg.add(crank);
    const cassette = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.035, 24), metal);
    cassette.rotation.x = Math.PI / 2;
    cassette.position.set(bk.rearAxle.x, bk.rearAxle.y, 0.035);
    gg.add(cassette);
    gg.add(box({ x: bk.rearAxle.x + 0.01, y: bk.rearAxle.y - 0.07, z: 0.06 }, [0.04, 0.08, 0.02], darkM));
    gg.add(box({ x: 0.0, y: 0.11, z: 0.045 }, [0.05, 0.02, 0.02], darkM));
    // チェーン(上下2本の線で表す)
    const chainMat = mat(0x6f767f, { metalness: 0.9 });
    gg.add(tube({ x: 0, y: 0.1, z: 0.05 }, { x: bk.rearAxle.x, y: bk.rearAxle.y + 0.05, z: 0.04 }, 0.004, chainMat));
    gg.add(tube({ x: 0, y: -0.1, z: 0.05 }, { x: bk.rearAxle.x + 0.01, y: bk.rearAxle.y - 0.11, z: 0.05 }, 0.004, chainMat));
    // ブレーキ
    gg.add(box(add3(bk.crown, { x: 0.02, y: -0.01 }), [0.04, 0.05, 0.05], darkM));
    gg.add(box({ x: bk.stTop.x * 0.75 - 0.03, y: bk.stTop.y * 0.75 - 0.05 }, [0.04, 0.05, 0.05], darkM));
    // シフター(ブラケット)
    const hoods = bk.grips.hoods;
    for (const s of [-1, 1]) gg.add(box({ x: hoods.pt.x - 0.01, y: hoods.pt.y - 0.01, z: s * hoods.z }, [0.07, 0.035, 0.03], darkM));

    // ハンドル・バーテープ
    const gh = group("handlebar");
    const gbt = group("bartape");
    const barMat = mat(at("handlebar").type === "round" ? 0x2c2f36 : 0x111214, { metalness: 0.4 });
    for (const s of [-1, 1]) {
      const path = barPath(bk.barClamp, bk.p.barReach, bk.p.barDrop, bk.p.barWidth / 2, s);
      gh.add(new THREE.Mesh(new THREE.TubeGeometry(path, 40, at("handlebar").type === "aero" ? 0.013 : 0.012, 10, false), barMat));
      gbt.add(new THREE.Mesh(new THREE.TubeGeometry(path, 40, 0.0145, 10, false), mat(COLORS.tape, { roughness: 0.95 })));
    }

    // ステム・スペーサー
    const gs = group("stem");
    gs.add(tube(bk.htTop, add3(bk.htTop, mul3(bk.up, bk.p.spacers + 0.001)), 0.017, mat(0x30343b)));
    gs.add(tube(bk.steerer, bk.barClamp, 0.017, mat(0x202227, { metalness: 0.5 })));

    // シートポスト・サドル
    const gp = group("seatpost");
    gp.add(tube(bk.stTop, bk.clamp, 0.0135, mat(0x1c1e22, { metalness: 0.4 })));
    const gsd = group("saddle");
    const sd = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), mat(COLORS.saddle, { roughness: 0.8 }));
    sd.scale.set(0.135, 0.022, 0.065);
    sd.position.set(bk.saddleTop.x - 0.02, bk.saddleTop.y - 0.012, 0);
    gsd.add(sd);

    // ペダル
    const gpd = group("pedals");
    for (const s of [-1, 1]) {
      const pm = box({ x: 0, y: 0, z: s * 0.1 }, [0.09, 0.015, 0.07], darkM);
      pm.userData.pedal = s;
      gpd.add(pm);
    }

    // ボトルケージ・その他
    const gc = group("cages");
    const bottles = at("cages").bottles != null ? at("cages").bottles : 1;
    const dtMid = lerp3(bk.dtFront, bb, 0.5);
    const stMid = lerp3(bb, bk.stTop, 0.45);
    const bottleMat = mat(0xeeeeee, { roughness: 0.6 });
    if (bottles >= 1) gc.add(bottleMesh(dtMid, bk.dtFront, bottleMat));
    if (bottles >= 2) gc.add(bottleMesh(stMid, bk.stTop, bottleMat, -1));
    const ga = group("accessories");
    if ((at("accessories").extras || 0) > 0) {
      ga.add(box(add3(bk.barClamp, { x: 0.05, y: 0.02 }), [0.06, 0.012, 0.045], mat(0x0b0c0f)));
      const light = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.06, 12), mat(0xffffff, { emissive: 0xfff2c0, emissiveIntensity: 0.6 }));
      light.rotation.z = Math.PI / 2;
      light.position.set(bk.barClamp.x + 0.02, bk.barClamp.y - 0.03, 0.08);
      ga.add(light);
      ga.add(box({ x: bk.saddleTop.x - 0.1, y: bk.saddleTop.y - 0.12, z: 0 }, [0.03, 0.05, 0.02], mat(0xff2a2a, { emissive: 0xff0000, emissiveIntensity: 0.5 })));
      if ((at("accessories").extras || 0) >= 3) ga.add(box({ x: bk.saddleTop.x - 0.06, y: bk.saddleTop.y - 0.07, z: 0 }, [0.1, 0.06, 0.06], mat(0x222222)));
    }

    // 外しているパーツは隠す
    for (const id of Object.keys(groups)) {
      groups[id].visible = !(parts[id] && parts[id].mounted === false);
      groups[id].userData.offset = new THREE.Vector3();
      groups[id].traverse((o) => {
        if (o.isMesh) {
          o.material = o.material.clone();
          o.userData.baseEmissive = o.material.emissive ? o.material.emissive.clone() : null;
        }
      });
    }
    // タイヤとチューブは同じ場所にあるので、チューブを外したらタイヤを半透明にする
    if (parts.tubes && parts.tubes.mounted === false) {
      groups.tires.traverse((o) => o.isMesh && ((o.material.transparent = true), (o.material.opacity = 0.35)));
    }
  }

  function bottleMesh(center, toward, material, side = 1) {
    const THREE = T();
    const g = new THREE.Group();
    const dir = new THREE.Vector3(toward.x - center.x, toward.y - center.y, 0).normalize();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.2, 16), material);
    b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const n = new THREE.Vector3(-dir.y, dir.x, 0).multiplyScalar(0.045 * side);
    b.position.set(center.x + n.x, center.y + n.y, 0);
    g.add(b);
    return g;
  }

  const add3 = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: (a.z || 0) + (b.z || 0) });
  const mul3 = (a, k) => ({ x: a.x * k, y: a.y * k, z: (a.z || 0) * k });
  const lerp3 = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: (a.z || 0) + ((b.z || 0) - (a.z || 0)) * t });

  // ---------- ライダー ----------
  function buildRider() {
    const THREE = T();
    if (riderGroup) root.remove(riderGroup);
    riderGroup = new THREE.Group();
    root.add(riderGroup);
    riderParts = [];
    const cyl = new THREE.CylinderGeometry(1, 1, 1, 14);
    const sph = new THREE.SphereGeometry(1, 16, 12);
    const matFor = (part) =>
      part === "torso" || part === "arm" ? mat(COLORS.jersey) : part === "thigh" ? mat(COLORS.shorts) : part === "foot" ? mat(COLORS.shoe) : mat(COLORS.skin, { roughness: 0.7 });
    for (let i = 0; i < state.fit.caps.length; i++) {
      const c = state.fit.caps[i];
      const m = matFor(c.part);
      const body = new THREE.Mesh(cyl, m);
      const e1 = new THREE.Mesh(sph, m);
      const e2 = new THREE.Mesh(sph, m);
      riderGroup.add(body, e1, e2);
      riderParts.push({ body, e1, e2 });
    }
    // ヘルメット
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(COLORS.helmet, { roughness: 0.4 }));
    helmet.name = "helmet";
    riderGroup.add(helmet);
    riderGroup.visible = anim.rider;
    updateRider();
  }

  // 今のクランク角度でライダーの姿勢を計算し直して、各カプセルを動かす
  function updateRider() {
    if (!riderGroup || !state) return;
    const THREE = T();
    const pose = Fit.rider(state.fit.bike, state.fit.seg, anim.crank);
    const caps = Fit.capsules(pose, state.fit.seg);
    const up = new THREE.Vector3(0, 1, 0);
    caps.forEach((c, i) => {
      const p = riderParts[i];
      if (!p) return;
      const A = V(c.a), B = V(c.b);
      const d = new THREE.Vector3().subVectors(B, A);
      const L = d.length();
      p.body.visible = L > 1e-4;
      if (L > 1e-4) {
        p.body.position.copy(A).addScaledVector(d, 0.5);
        p.body.quaternion.setFromUnitVectors(up, d.clone().normalize());
        p.body.scale.set(c.r, L, c.r);
      }
      p.e1.position.copy(A);
      p.e2.position.copy(B);
      p.e1.scale.setScalar(c.r);
      p.e2.scale.setScalar(c.r);
    });
    const helmet = riderGroup.getObjectByName("helmet");
    const head = caps.find((c) => c.part === "head");
    helmet.position.copy(V(head.a));
    helmet.scale.setScalar(head.r * 1.08);
    helmet.rotation.z = ((pose.torsoAngle - 20) * Math.PI) / 180 * 0.5;
  }

  // ---------- 空気の流れ(イメージ) ----------
  function buildFlow() {
    const THREE = T();
    if (flowPoints) scene.remove(flowPoints);
    const N = 700;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(col, 3));
    flowPoints = new THREE.Points(geom, new THREE.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: 0.9 }));
    flowPoints.userData.seed = [];
    for (let i = 0; i < N; i++) {
      flowPoints.userData.seed.push(resetParticle(pos, i, true));
    }
    flowPoints.visible = anim.flow && anim.rider;
    scene.add(flowPoints);
  }

  function resetParticle(pos, i, anywhere) {
    const fa = state.fit.frontal;
    const y = fa.minY - 0.1 + Math.random() * (fa.ny * fa.cell + 0.2);
    const z = fa.minZ - 0.12 + Math.random() * (fa.nz * fa.cell + 0.24);
    pos[i * 3] = anywhere ? -1.2 + Math.random() * 2.8 : 1.6;
    pos[i * 3 + 1] = y + root.position.y;
    pos[i * 3 + 2] = z;
    return { y0: y, z0: z, jit: Math.random() };
  }

  // 正面から見た体の形(前面投影)に当たる粒は、体の外側へ回り込ませる
  function inBody(y, z) {
    const fa = state.fit.frontal;
    const i = Math.floor((z - fa.minZ) / fa.cell);
    const j = Math.floor((y - fa.minY) / fa.cell);
    if (i < 0 || j < 0 || i >= fa.nz || j >= fa.ny) return false;
    return fa.mask[j * fa.nz + i] === 1;
  }

  function updateFlow(dt) {
    if (!flowPoints || !flowPoints.visible) return;
    const pos = flowPoints.geometry.attributes.position.array;
    const col = flowPoints.geometry.attributes.color.array;
    const seeds = flowPoints.userData.seed;
    const front = state.fit.pose.legs.R.toe.x + 0.25; // 体の一番前より少し前
    const back = state.fit.pose.hipMid.x - 0.35;
    const cy = (state.fit.pose.shoulderMid.y + state.fit.pose.hipMid.y) / 2;
    const oy = root.position.y;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      let x = pos[i * 3] - dt * 1.6;
      let y = s.y0;
      let z = s.z0;
      let r = 0.45, g = 0.75, b = 1.0; // ふつうの流れ: 水色
      if (inBody(s.y0, s.z0)) {
        if (x < front && x > back) {
          // 体の外側(左右・上)へ押し出す
          const t = Math.min(1, (front - x) / 0.25);
          const dzs = s.z0 >= 0 ? 1 : -1;
          let k = 0;
          while (k < 40 && inBody(y, z)) {
            z += dzs * 0.012;
            if (y > cy) y += 0.006;
            k++;
          }
          y = s.y0 + (y - s.y0) * t;
          z = s.z0 + (z - s.z0) * t;
          r = 1.0; g = 0.45 - 0.25 * (1 - t); b = 0.3; // 体に当たる所は赤(圧力が高い)
        } else if (x <= back) {
          // 体の後ろは渦(乱れた流れ)
          y = s.y0 + Math.sin(x * 9 + s.jit * 6) * 0.03;
          z = s.z0 + Math.cos(x * 7 + s.jit * 6) * 0.03;
          r = 0.75; g = 0.6; b = 1.0;
        }
      }
      if (x < -1.3) {
        seeds[i] = resetParticle(pos, i, false);
        continue;
      }
      pos[i * 3] = x;
      pos[i * 3 + 1] = y + oy;
      pos[i * 3 + 2] = z;
      col[i * 3] = r;
      col[i * 3 + 1] = g;
      col[i * 3 + 2] = b;
    }
    flowPoints.geometry.attributes.position.needsUpdate = true;
    flowPoints.geometry.attributes.color.needsUpdate = true;
  }

  // ---------- 分解ビューのずらし方 ----------
  const EXPLODE = {
    frame: [0, 0, 0],
    fork: [0.25, 0, 0],
    wheels: [0, 0, 0.55],
    tires: [0, 0, 0.75],
    tubes: [0, 0, 0],
    groupset: [0, -0.15, 0.4],
    handlebar: [0.3, 0.3, 0],
    bartape: [0.4, 0.45, 0],
    stem: [0.2, 0.2, 0],
    seatpost: [-0.1, 0.25, 0],
    saddle: [-0.15, 0.45, 0],
    pedals: [0, -0.2, 0.3],
    cages: [0, 0, -0.35],
    accessories: [0.2, 0.25, -0.3],
  };

  // ---------- 外部から呼ぶ操作 ----------
  // fit: Fit.compute の結果、build: パーツ構成、body: 体
  function setModel(fit, build, body) {
    state = { fit, build, body };
    buildBike(fit, build);
    buildRider();
    buildFlow();
    placeOnStand();
    if (highlightId) highlight(highlightId);
  }

  // 整備モードはスタンドに持ち上げる。乗車モードは床に置く
  function placeOnStand() {
    if (!state) return;
    const bk = state.fit.bike;
    const ground = bk.g.bbDrop - bk.R; // タイヤの接地点の高さ(BB基準)
    const lift = anim.rider ? 0 : 0.35;
    root.position.y = -ground + lift;
    const stand = envGroup.getObjectByName("stand");
    stand.visible = !anim.rider;
    if (!anim.rider) {
      // シートポストをクランプする
      const c = bk.clamp;
      const clampPt = new (T().Vector3)(c.x - 0.03, c.y - 0.12 + root.position.y, 0);
      const baseX = clampPt.x - 0.3;
      const pole = stand.getObjectByName("pole");
      pole.scale.y = clampPt.y;
      pole.position.set(baseX, clampPt.y / 2, -0.25);
      stand.children.filter((o) => o.name === "leg").forEach((leg) => {
        const a = leg.userData.ang;
        leg.position.set(baseX + Math.cos(a) * 0.25, 0.08, -0.25 + Math.sin(a) * 0.25);
        leg.rotation.set(Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2);
      });
      const arm = stand.getObjectByName("arm");
      arm.position.set((baseX + clampPt.x) / 2, clampPt.y, -0.12);
      arm.rotation.y = -0.6;
      stand.getObjectByName("clamp").position.copy(clampPt);
    }
    // 乗車モードはライダーの頭まで入るように、少し上を中心にして引く
    cam.goal.set(anim.rider ? 0.1 : 0.15, root.position.y + (anim.rider ? 0.8 : 0.55), 0);
    cam.distGoal = anim.rider ? 3.1 : 2.6;
  }

  function setRider(on) {
    anim.rider = on;
    if (riderGroup) riderGroup.visible = on;
    if (flowPoints) flowPoints.visible = anim.flow && on;
    placeOnStand();
  }

  function setFlow(on) {
    anim.flow = on;
    if (flowPoints) flowPoints.visible = on && anim.rider;
  }

  function setPedaling(on) {
    anim.pedaling = on;
  }

  function setExploded(on) {
    anim.explodeTarget = on ? 1 : 0;
    // 横からだと手前にずれるだけで分かりにくいので、斜めから見る
    setView(on ? "iso" : "side");
  }

  // 部位を光らせて、カメラをそこへ寄せる
  function highlight(id, focus) {
    highlightId = id;
    for (const [gid, g] of Object.entries(groups)) {
      const on = gid === id || (id === "tubes" && gid === "tires");
      g.traverse((o) => {
        if (!o.isMesh || !o.material.emissive) return;
        if (on) o.material.emissive.setHex(0x1f6fe5);
        else if (o.userData.baseEmissive) o.material.emissive.copy(o.userData.baseEmissive);
        o.material.emissiveIntensity = on ? 0.5 : o.material.emissiveIntensity;
      });
    }
    if (focus && groups[id]) {
      const THREE = T();
      const b = new THREE.Box3().setFromObject(groups[id]);
      if (!b.isEmpty()) {
        const c = b.getCenter(new THREE.Vector3());
        cam.goal.copy(c);
        const size = b.getSize(new THREE.Vector3()).length();
        cam.distGoal = Math.max(0.9, Math.min(2.6, size * 1.6 + 0.5));
      }
    }
  }

  function clearHighlight() {
    highlight(null);
    if (state) placeOnStand();
  }

  // 取り外し/取り付けのアニメーション
  function animateMount(id, mounted) {
    const g = groups[id];
    if (!g) return;
    mountAnim[id] = { t: 0, mounted };
    g.visible = true;
  }

  function setView(name) {
    if (name === "side") Object.assign(cam, { azGoal: 0, elGoal: 0.08 });
    if (name === "front") Object.assign(cam, { azGoal: Math.PI / 2, elGoal: 0.05 });
    if (name === "iso") Object.assign(cam, { azGoal: 0.7, elGoal: 0.35 });
    if (name === "top") Object.assign(cam, { azGoal: 0.001, elGoal: 1.45 });
  }

  // ---------- カメラ操作(ドラッグで回す、ピンチ・ホイールで寄る) ----------
  function bindControls(el) {
    const pts = new Map();
    let lastDist = 0;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      cam.azGoal = cam.elGoal = undefined;
    });
    el.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      const prev = pts.get(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) {
        cam.az -= (e.clientX - prev.x) * 0.008;
        cam.el = Math.max(-0.1, Math.min(1.5, cam.el + (e.clientY - prev.y) * 0.006));
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastDist) cam.dist = Math.max(0.6, Math.min(5, cam.dist * (lastDist / d)));
        lastDist = d;
        cam.distGoal = cam.dist;
      }
    });
    const end = (e) => {
      pts.delete(e.pointerId);
      if (pts.size < 2) lastDist = 0;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        cam.dist = Math.max(0.6, Math.min(5, cam.dist * (1 + e.deltaY * 0.001)));
        cam.distGoal = cam.dist;
      },
      { passive: false }
    );
  }

  // ---------- 毎フレーム ----------
  function loop() {
    raf = requestAnimationFrame(loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (!state) return renderer.render(scene, camera);
    const THREE = T();
    // ペダリング(約85rpm)
    if (anim.pedaling) {
      anim.crank = (anim.crank + dt * 510) % 360;
      if (anim.rider) updateRider();
      bikeGroup.traverse((o) => {
        if (o.userData.crank) o.rotation.z = (-anim.crank * Math.PI) / 180;
        if (o.userData.spin) o.rotation.z -= dt * 4;
        if (o.userData.pedal) {
          const th = ((anim.crank + (o.userData.pedal < 0 ? 180 : 0)) * Math.PI) / 180;
          o.position.set(Math.sin(th) * state.fit.bike.p.crank, Math.cos(th) * state.fit.bike.p.crank, o.userData.pedal * 0.1);
        }
      });
    }
    // 分解ビュー
    anim.exploded += (anim.explodeTarget - anim.exploded) * Math.min(1, dt * 5);
    for (const [id, g] of Object.entries(groups)) {
      const e = EXPLODE[id] || [0, 0, 0];
      let k = anim.exploded;
      const m = mountAnim[id];
      if (m) {
        m.t = Math.min(1, m.t + dt * 2.2);
        const ease = 1 - Math.pow(1 - m.t, 3);
        // 取り付け: 外から所定の位置へ。取り外し: 外へ動いて消える
        k = Math.max(k, m.mounted ? 1.4 * (1 - ease) : 1.4 * ease);
        if (m.t >= 1) {
          delete mountAnim[id];
          g.visible = m.mounted;
        }
      }
      g.position.set(e[0] * k, e[1] * k, e[2] * k);
    }
    // 光らせた部位はゆっくり明滅
    if (highlightId) {
      const pulse = 0.35 + 0.25 * Math.sin(now / 250);
      const g = groups[highlightId === "tubes" ? "tires" : highlightId];
      if (g) g.traverse((o) => o.isMesh && o.material.emissive && (o.material.emissiveIntensity = pulse));
    }
    updateFlow(dt);
    // カメラ
    if (cam.azGoal != null) cam.az += (cam.azGoal - cam.az) * Math.min(1, dt * 4);
    if (cam.elGoal != null) cam.el += (cam.elGoal - cam.el) * Math.min(1, dt * 4);
    if (cam.distGoal != null) cam.dist += (cam.distGoal - cam.dist) * Math.min(1, dt * 4);
    cam.target.lerp(cam.goal, Math.min(1, dt * 4));
    camera.position.set(
      cam.target.x + cam.dist * Math.sin(cam.az) * Math.cos(cam.el),
      cam.target.y + cam.dist * Math.sin(cam.el),
      cam.target.z + cam.dist * Math.cos(cam.az) * Math.cos(cam.el)
    );
    camera.lookAt(cam.target);
    renderer.render(scene, camera);
  }

  function dispose() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    if (renderer) renderer.dispose();
  }

  return { create, setModel, setRider, setFlow, setPedaling, setExploded, highlight, clearHighlight, animateMount, setView, resize, dispose };
})();

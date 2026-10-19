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
    tire: 0x17181b,
    rim: 0x2a2d34,
    metal: 0xb7bec6,
    dark: 0x1f2125,
    saddle: 0x121316,
    tape: 0x101113,
    jersey: 0x0a3d91,
    jersey2: 0xf2f4f8,
    shorts: 0x0e0f12,
    skin: 0xe0ac86,
    sock: 0xf5f5f5,
    shoe: 0xf2f2f2,
    sole: 0x1a1a1a,
    helmet: 0xf7f7f7,
    lens: 0x16202e,
  };

  // ---------- 初期化 ----------
  function create(el) {
    container = el;
    const THREE = T();
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    // PCの画面(倍率1)でも、少し大きく描いてから縮めて、細い線やロゴをなめらかにする
    renderer.setPixelRatio(Math.min(2, Math.max(1.5, window.devicePixelRatio || 1)));
    renderer.outputEncoding = THREE.sRGBEncoding;
    // 写真のような明るさの出方と、床に落ちる影
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050607);
    scene.fog = new THREE.Fog(0x050607, 6, 14);
    // 工房の照明が映り込むように、周りの景色(環境マップ)を作る
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(envTexture()).texture;
      pmrem.dispose();
    } catch (e) {
      // 環境マップが使えない端末では、照明だけで描く
    }
    camera = new THREE.PerspectiveCamera(40, 1, 0.05, 50);
    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x3a3226, 0.35));
    const key = new THREE.DirectionalLight(0xfff4e6, 1.15);
    key.position.set(1.4, 3.6, 2.4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    keyLight = key;
    Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.6, near: 0.5, far: 9 });
    key.shadow.bias = -0.0005;
    key.shadow.radius = 4;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9cc0ff, 0.4);
    fill.position.set(-3, 2, -1.5);
    scene.add(fill);
    // 後ろからの光(輪郭が光って、ショールームのように立体的に見える)
    const rim = new THREE.DirectionalLight(0xffffff, 0.55);
    rim.position.set(-0.5, 2.2, -3.5);
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

  // 周りの景色: 天井の照明(明るい四角)と、壁・床の色のグラデーション
  // 工房の照明の映り込み(塗装やリムに、天井のライトと窓の光が映る)
  function envTexture() {
    const THREE = T();
    const W = 2048, H = 1024;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#6b7482");
    grad.addColorStop(0.42, "#2c323b");
    grad.addColorStop(0.5, "#1a1d22");
    grad.addColorStop(0.58, "#111317");
    grad.addColorStop(1, "#08090b");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    // 天井の細長いライト(塗装に白い線として映る)
    g.filter = "blur(3px)";
    g.fillStyle = "#ffffff";
    for (const [x, w] of [[120, 260], [620, 180], [1000, 300], [1500, 220]]) g.fillRect(x, 60, w, 34);
    for (const [x, w] of [[300, 160], [1250, 200]]) g.fillRect(x, 180, w, 22);
    // 窓(暖かい光)とソフトボックス
    g.fillStyle = "rgba(255,150,40,0.9)";
    g.fillRect(560, 430, 260, 18);
    g.fillStyle = "rgba(235,242,255,0.95)";
    g.fillRect(1660, 260, 160, 150);
    g.filter = "none";
    envCanvas = c;
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  let envCanvas = null;
  let keyLight = null;

  function resize() {
    if (!renderer || !container) return;
    const w = container.clientWidth || 360;
    const h = container.clientHeight || 300;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    sizePhoto();
    if (cam.auto !== false) cam.distGoal = fitDist();
  }

  // 画面の縦横比に合わせて、バイク(乗車中は人も)がちょうど収まる距離
  function fitDist() {
    const t = Math.tan(((camera ? camera.fov : 40) * Math.PI) / 360);
    const aspect = camera ? camera.aspect : 1;
    const w = anim.rider ? 2.3 : 1.95, h = anim.rider ? 2.15 : 1.4;
    return Math.max(1.5, w / 2 / (t * aspect), h / 2 / t);
  }

  // 工房: 床・壁・有孔ボード・作業台・マット・作業スタンド
  function buildEnvironment() {
    const THREE = T();
    // ハンガーの床: 黒っぽいコンクリートに、細い目地
    const floorTex = canvasTexture(512, (g, s) => {
      g.fillStyle = "#1a1d21";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 5000; i++) {
        g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "0,0,0"},${Math.random() * 0.05})`;
        g.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
      g.strokeStyle = "rgba(255,255,255,0.06)";
      g.lineWidth = 2;
      g.strokeRect(1, 1, s - 2, s - 2);
    });
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(6, 6);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16, 32, 32), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.5, metalness: 0.05, envMapIntensity: 0.55 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = "floor";
    envGroup.add(floor);
    // 組み立て台: 黄色と黒の警告の縞で囲み、床の輪が光る
    const hazard = canvasTexture(256, (g, s) => {
      g.fillStyle = "#111";
      g.fillRect(0, 0, s, s);
      g.fillStyle = "#e0a400";
      for (let x = -s; x < s * 2; x += 32) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x + 16, 0);
        g.lineTo(x + 16 + s, s);
        g.lineTo(x + s, s);
        g.fill();
      }
    });
    hazard.wrapS = THREE.RepeatWrapping;
    for (const [x, z, w, d, rx] of [[0.15, -0.95, 3.2, 0.08, 16], [0.15, 0.95, 3.2, 0.08, 16], [-1.45, 0, 0.08, 1.98, 1], [1.75, 0, 0.08, 1.98, 1]]) {
      const t = hazard.clone();
      t.needsUpdate = true;
      t.repeat.set(rx, 1);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.004, z);
      m.receiveShadow = true;
      envGroup.add(m);
    }
    const padRing = new THREE.Mesh(new THREE.RingGeometry(0.98, 1.02, 96), new THREE.MeshStandardMaterial({ color: 0x110800, emissive: 0xff8a14, emissiveIntensity: 1.4, side: THREE.DoubleSide }));
    padRing.rotation.x = -Math.PI / 2;
    padRing.position.set(0.15, 0.005, 0);
    padRing.name = "padRing";
    envGroup.add(padRing);
    // 壁の照明(細長いライト)。塗装やリムにも映り込む
    const lightMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xe8f1ff, emissiveIntensity: 1.6 });
    for (const x of [-2.4, -0.8, 0.8, 2.4]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.035, 0.03), lightMat);
      bar.position.set(x, 2.75, -1.57);
      envGroup.add(bar);
    }
    const amberMat = new THREE.MeshStandardMaterial({ color: 0x110800, emissive: 0xff8a14, emissiveIntensity: 1.2 });
    for (const x of [-3.0, 3.0]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.03, 2.4, 0.03), amberMat);
      col.position.set(x, 1.3, -1.57);
      envGroup.add(col);
    }
    const glow = new THREE.PointLight(0xff8a14, 0.6, 3.2);
    glow.position.set(0.15, 0.15, 0.6);
    envGroup.add(glow);
    // ゴムマット
    const matTex = canvasTexture(128, (g, s) => {
      g.fillStyle = "#1c1e22";
      g.fillRect(0, 0, s, s);
      g.strokeStyle = "#26292e";
      g.lineWidth = 3;
      for (let x = 0; x < s; x += 16) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x + 16, s);
        g.stroke();
      }
    });
    matTex.wrapS = matTex.wrapT = THREE.RepeatWrapping;
    matTex.repeat.set(6, 3);
    const rubber = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.1), new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.95 }));
    rubber.rotation.x = -Math.PI / 2;
    rubber.position.set(0.15, 0.003, 0);
    rubber.receiveShadow = true;
    envGroup.add(rubber);
    // 有孔ボードの壁
    // ハンガーの壁: 金属のパネル(継ぎ目・ボルト・番号の文字)。壁全体を1枚の絵で描く(繰り返さない)
    const pegTex = canvasTexture(2048, (g, s, H) => {
      g.fillStyle = "#1c2026";
      g.fillRect(0, 0, s, H);
      const cols = 10, rows = 4, pw = s / cols, ph = H / rows;
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          const x = i * pw, y = j * ph;
          const sh = 26 + Math.floor(Math.random() * 10);
          g.fillStyle = `rgb(${sh},${sh + 3},${sh + 8})`;
          g.fillRect(x + 3, y + 3, pw - 6, ph - 6);
          for (let k = 0; k < 120; k++) {
            g.fillStyle = `rgba(255,255,255,${Math.random() * 0.025})`;
            g.fillRect(x + Math.random() * pw, y + Math.random() * ph, 1 + Math.random() * 30, 1);
          }
          g.fillStyle = "#0a0c0f";
          for (const [bx, by] of [[10, 10], [pw - 10, 10], [10, ph - 10], [pw - 10, ph - 10]]) {
            g.beginPath();
            g.arc(x + bx, y + by, 3, 0, Math.PI * 2);
            g.fill();
          }
        }
      // 下の方の警告の帯と、番号
      const by = H * 0.88;
      g.fillStyle = "#151515";
      g.fillRect(0, by, s, H * 0.06);
      g.fillStyle = "#c78f00";
      for (let x = 0; x < s; x += 40) {
        g.beginPath();
        g.moveTo(x, by);
        g.lineTo(x + 20, by);
        g.lineTo(x + 20 + H * 0.06, by + H * 0.06);
        g.lineTo(x + H * 0.06, by + H * 0.06);
        g.fill();
      }
      g.fillStyle = "rgba(230,235,241,0.55)";
      g.font = `bold ${Math.round(ph * 0.22)}px sans-serif`;
      g.fillText("BAY-03", pw * 1.2, ph * 0.55);
      g.font = `${Math.round(ph * 0.09)}px sans-serif`;
      g.fillText("FRAME ASSEMBLY / MAINTENANCE", pw * 1.2, ph * 0.72);
      g.fillStyle = "rgba(255,154,46,0.7)";
      g.font = `bold ${Math.round(ph * 0.14)}px sans-serif`;
      g.fillText("RC-07", pw * 7.4, ph * 1.6);
    }, 820);
    pegTex.anisotropy = 8;
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4, 20, 8), new THREE.MeshStandardMaterial({ map: pegTex, roughness: 0.55, metalness: 0.6 }));
    wall.position.set(0, 2, -1.6);
    wall.receiveShadow = true;
    wall.name = "wall";
    envGroup.add(wall);
    // 横の壁(正面から見たときの背景)
    const side = new THREE.Mesh(new THREE.PlaneGeometry(6, 4, 12, 8), new THREE.MeshStandardMaterial({ color: 0x15181c, roughness: 0.6, metalness: 0.5 }));
    side.rotation.y = Math.PI / 2;
    side.position.set(-3.2, 2, 1.2);
    side.receiveShadow = true;
    envGroup.add(side);
    // 壁の工具(レンチ・ドライバー)
    const toolMat = new THREE.MeshStandardMaterial({ color: 0xc9cfd6, metalness: 0.9, roughness: 0.3 });
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x1f6fe5, roughness: 0.6 });
    for (let i = 0; i < 8; i++) {
      const L = 0.18 + (i % 4) * 0.05;
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.018, L, 0.008), toolMat);
      t.position.set(-1.25 + i * 0.2, 1.65, -1.585);
      envGroup.add(t);
      const head = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.007, 8, 16), toolMat);
      head.position.set(t.position.x, 1.65 + L / 2 + 0.015, -1.585);
      envGroup.add(head);
      if (i % 2) {
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.09, 12), gripMat);
        grip.position.set(t.position.x + 0.1, 1.4, -1.58);
        envGroup.add(grip);
      }
    }
    // 作業台
    const wood = new THREE.MeshStandardMaterial({ color: 0x2a2e34, metalness: 0.7, roughness: 0.35 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x2b2f36, metalness: 0.6, roughness: 0.45 });
    const bench = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.55), wood);
    top.position.y = 0.9;
    bench.add(top);
    for (const x of [-0.56, 0.56]) for (const z of [-0.24, 0.24]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.88, 0.04), steel);
      leg.position.set(x, 0.44, z);
      bench.add(leg);
    }
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 0.5), new THREE.MeshStandardMaterial({ color: 0xc46a12, metalness: 0.4, roughness: 0.4 }));
    drawer.position.set(0, 0.7, 0);
    bench.add(drawer);
    bench.position.set(-2.1, 0, -1.2);
    bench.traverse((o) => o.isMesh && ((o.castShadow = true), (o.receiveShadow = true)));
    envGroup.add(bench);
    // 作業スタンド(整備モードのときだけ見せる)
    const stand = new THREE.Group();
    stand.name = "stand";
    const sMat = new THREE.MeshStandardMaterial({ color: 0x2b2f36, metalness: 0.7, roughness: 0.35 });
    const accent = new THREE.MeshStandardMaterial({ color: 0x1f6fe5, metalness: 0.3, roughness: 0.35 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 16, 24), sMat);
    pole.name = "pole";
    stand.add(pole);
    for (let i = 0; i < 3; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 10, 12), sMat);
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
    stand.traverse((o) => o.isMesh && (o.castShadow = true));
    envGroup.add(stand);
    buildClerk();
  }

  // 店員さん(メカニック)。タップすると相談できる
  let clerkGroup = null;
  let clerkArm = null;
  let clerkTap = null;
  let clerkWave = 0;
  function buildClerk() {
    const THREE = T();
    const g = new THREE.Group();
    g.name = "clerk";
    const skin = mat(0xf1c6a0, { roughness: 0.7 });
    const pants = mat(0x2b2f38, { roughness: 0.85 });
    const shirt = mat(0xb9c4d4, { roughness: 0.8 });
    const apronTex = canvasTexture(256, (c, sz) => {
      c.fillStyle = "#0a3d91";
      c.fillRect(0, 0, sz, sz);
      c.fillStyle = "#ffffff";
      c.font = `bold ${sz * 0.13}px sans-serif`;
      c.textAlign = "center";
      c.fillText("MECHANIC", sz / 2, sz * 0.3);
      c.font = `${sz * 0.22}px sans-serif`;
      c.fillText("🔧", sz / 2, sz * 0.62);
    });
    const apron = new THREE.MeshStandardMaterial({ map: apronTex, roughness: 0.9 });
    const cyl = (r1, r2, h, m, y, x = 0, z = 0) => {
      const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 16, Math.max(1, Math.ceil(h / 0.05))), m);
      o.position.set(x, y, z);
      g.add(o);
      return o;
    };
    for (const s of [-1, 1]) {
      cyl(0.065, 0.055, 0.8, pants, 0.42, s * 0.09);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.24), mat(0x15171c));
      shoe.position.set(s * 0.09, 0.03, 0.04);
      g.add(shoe);
    }
    cyl(0.16, 0.15, 0.18, pants, 0.86);
    cyl(0.19, 0.16, 0.5, shirt, 1.18);
    const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), shirt);
    shoulders.position.y = 1.42;
    shoulders.scale.y = 0.45;
    g.add(shoulders);
    const ap = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.62), apron);
    ap.position.set(0, 1.04, 0.172);
    g.add(ap);
    cyl(0.05, 0.055, 0.1, skin, 1.5);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 18), skin);
    head.position.y = 1.62;
    head.scale.set(0.95, 1.05, 1);
    g.add(head);
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), mat(0x111111));
      eye.position.set(s * 0.038, 1.64, 0.1);
      g.add(eye);
    }
    const capM = mat(0x0a3d91, { roughness: 0.6 });
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.118, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), capM);
    cap.position.y = 1.66;
    g.add(cap);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.012, 20, 1, false, -Math.PI / 2, Math.PI), capM);
    brim.position.set(0, 1.665, 0.08);
    g.add(brim);
    // 腕: 左は下ろしてレンチを持つ、右は手を振れるように肩を中心に回す
    const armL = new THREE.Group();
    armL.position.set(-0.21, 1.4, 0);
    const ual = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.56, 12, 12), shirt);
    ual.position.y = -0.28;
    armL.add(ual);
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), skin);
    handL.position.y = -0.6;
    armL.add(handL);
    const wrench = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.24, 0.01), mat(0xc9ced6, { metalness: 0.9, roughness: 0.25 }));
    wrench.position.set(0, -0.7, 0.03);
    armL.add(wrench);
    armL.rotation.z = -0.08;
    g.add(armL);
    clerkArm = new THREE.Group();
    clerkArm.position.set(0.21, 1.4, 0);
    const uar = ual.clone();
    clerkArm.add(uar);
    const handR = handL.clone();
    clerkArm.add(handR);
    clerkArm.rotation.z = 0.08;
    g.add(clerkArm);
    g.traverse((o) => o.isMesh && (o.castShadow = true));
    // 前輪の向こう側に立って、少しバイクの方を向く(スマホの横長でない画面でも見える位置)
    g.position.set(1.05, 0, -1.05);
    g.rotation.y = -0.35;
    envGroup.add(g);
    clerkGroup = g;
  }

  // 店員さんをタップしたときに呼ぶ関数
  function onClerk(fn) {
    clerkTap = fn;
  }
  function waveClerk(sec = 2.5) {
    clerkWave = sec;
  }

  function canvasTexture(size, draw, h) {
    const THREE = T();
    const c = document.createElement("canvas");
    c.width = size;
    c.height = h || size;
    draw(c.getContext("2d"), size, h || size);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // ---------- 質感 ----------
  function mat(color, opts = {}) {
    const THREE = T();
    return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.45, metalness: 0.2 }, opts));
  }

  // クリア塗装(フレームの塗装やカーボンのツヤ)
  // 塗装の仕上げ(ミッションのごほうび)
  const FINISH = {
    gloss: {},
    matte: { roughness: 0.75, clearcoat: 0, metalness: 0.02 },
    pearl: { roughness: 0.3, metalness: 0.15, sheen: 1, sheenColor: 0xf3e6ff, sheenRoughness: 0.35 },
    metal: { roughness: 0.28, metalness: 0.85, clearcoat: 1, clearcoatRoughness: 0.05 },
    holo: { roughness: 0.2, metalness: 0.6, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 900] },
  };

  function paint(color, opts = {}) {
    const THREE = T();
    return new THREE.MeshPhysicalMaterial(Object.assign({ color, roughness: 0.38, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.55 }, opts));
  }

  let texCache = {};
  // カーボンの綾織り模様
  function carbonTex() {
    if (texCache.carbon) return texCache.carbon;
    const THREE = T();
    const t = canvasTexture(64, (g, s) => {
      g.fillStyle = "#16171a";
      g.fillRect(0, 0, s, s);
      const n = 8;
      const w = s / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const on = (i + j) % 4 < 2;
        const gr = g.createLinearGradient(i * w, j * w, i * w + w, j * w + w);
        gr.addColorStop(0, on ? "#2c2e33" : "#1b1c20");
        gr.addColorStop(1, on ? "#3a3d43" : "#232428");
        g.fillStyle = gr;
        g.fillRect(i * w + 0.5, j * w + 0.5, w - 1, w - 1);
      }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(24, 2);
    texCache.carbon = t;
    return t;
  }

  // タイヤのトレッド(細かい模様)
  function treadTex() {
    if (texCache.tread) return texCache.tread;
    const THREE = T();
    const t = canvasTexture(256, (g, s, h) => {
      g.fillStyle = "#1a1b1e";
      g.fillRect(0, 0, s, h);
      g.strokeStyle = "#232428";
      g.lineWidth = 1.5;
      for (let x = 0; x < s; x += 4) {
        g.beginPath();
        g.moveTo(x, 10);
        g.lineTo(x + 3, h - 10);
        g.stroke();
      }
      g.fillStyle = "#2b2c30";
      g.fillRect(0, 0, s, 8);
      g.fillRect(0, h - 8, s, 8);
    }, 32);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(30, 1);
    texCache.tread = t;
    return t;
  }

  // バーテープの巻き模様
  // バーテープの巻き目。color でテープの色(ミッションのごほうび)
  function tapeTex(color) {
    const key = "tape" + (color || "");
    if (texCache[key]) return texCache[key];
    const THREE = T();
    const base = new THREE.Color(color || "#121315");
    const line = base.clone().multiplyScalar(color ? 0.78 : 1.6);
    const t = canvasTexture(64, (g, s) => {
      g.fillStyle = "#" + base.getHexString();
      g.fillRect(0, 0, s, s);
      g.strokeStyle = "#" + line.getHexString();
      g.lineWidth = 6;
      for (let x = -s; x < 2 * s; x += 14) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x + s, s);
        g.stroke();
      }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(30, 1);
    texCache[key] = t;
    return t;
  }

  // ヘルメットの通気口の模様
  function helmetTex() {
    if (texCache.helmet) return texCache.helmet;
    const t = canvasTexture(128, (g, s) => {
      g.fillStyle = "#f7f7f7";
      g.fillRect(0, 0, s, s);
      g.fillStyle = "#24272d";
      for (let i = 0; i < 7; i++) g.fillRect(8 + i * 17, 20, 8, 70);
      g.fillStyle = "#1f6fe5";
      g.fillRect(0, 96, s, 8);
    });
    texCache.helmet = t;
    return t;
  }

  // ---------- 形を作る小道具 ----------
  // a から b への円柱。ra は a 側、rb は b 側の太さ(先細りにできる)。flat で断面を楕円に
  function tube(a, b, ra, material, flat = 1, rb) {
    const THREE = T();
    const A = V(a), B = V(b);
    const dir = new THREE.Vector3().subVectors(B, A);
    const L = dir.length();
    // 長いパイプは長さ方向にも区切る(細長い三角形は、写真モードの光の計算をとても遅く・不正確にする)
    const geo = new THREE.CylinderGeometry(rb == null ? ra : rb, ra, L, 24, Math.min(80, Math.max(1, Math.ceil(L / (((2 * Math.PI * Math.max(ra, rb || ra)) / 24) * 1.5)))));
    // 平たいパイプは形そのものを潰す(物の拡大率を縦横で変えると、写真モードの光の計算が崩れる)
    if (flat !== 1) geo.scale(1, 1, flat), (geo.userData.flat = flat);
    const m = new THREE.Mesh(geo, material);
    m.position.copy(A).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    m.userData.axis = { a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } }; // 写真を貼るときに使う中心線
    return m;
  }

  function ball(center, r, material) {
    const THREE = T();
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), material);
    m.position.copy(V(center));
    m.userData.center = { x: center.x, y: center.y };
    return m;
  }

  function box(center, size, material) {
    const THREE = T();
    const m = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    m.position.copy(V(center));
    return m;
  }

  // 歯車の形(チェーンリング・スプロケット)。z方向に厚み depth
  function gear(rOuter, teeth, depth, material, holeR) {
    const THREE = T();
    const sh = new THREE.Shape();
    const rRoot = rOuter - 0.004;
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * Math.PI * 2;
      const a1 = ((i + 0.3) / teeth) * Math.PI * 2;
      const a2 = ((i + 0.7) / teeth) * Math.PI * 2;
      const p = (r, a) => [Math.cos(a) * r, Math.sin(a) * r];
      if (i === 0) sh.moveTo(...p(rRoot, a0));
      else sh.lineTo(...p(rRoot, a0));
      sh.lineTo(...p(rOuter, a1));
      sh.lineTo(...p(rOuter, a2));
    }
    sh.closePath();
    if (holeR) {
      const hole = new THREE.Path();
      hole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
      sh.holes.push(hole);
    }
    const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false, curveSegments: 4 });
    geo.translate(0, 0, -depth / 2);
    return new THREE.Mesh(geo, material);
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
    const rimOuter = R - tw * 0.92;
    const depth = Math.max(0.018, rimMm / 1000);
    const rimInner = rimOuter - depth;
    // タイヤ(タイヤの部位): トレッドの模様つき。回る
    const tireSpin = new THREE.Group();
    tireSpin.position.copy(V(center));
    tireSpin.userData.spin = true;
    const tireMat = new THREE.MeshStandardMaterial({ map: treadTex(), color: 0xffffff, roughness: 0.88, metalness: 0 });
    tireSpin.add(new THREE.Mesh(new THREE.TorusGeometry(R - tw / 2, tw / 2, 16, 120), tireMat));
    gt.add(tireSpin);
    // リム・ハブ・スポーク(ホイールの部位): まとめて回す
    const spin = new THREE.Group();
    spin.position.copy(V(center));
    spin.userData.spin = true;
    const carbon = rimMm >= 30;
    const rimMat = carbon
      ? new THREE.MeshPhysicalMaterial({ map: carbonTex(), color: 0xffffff, roughness: 0.35, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.08 })
      : mat(0x1d1f23, { metalness: 0.7, roughness: 0.3 });
    const hw = 0.0115; // リムの幅の半分
    const prof = [
      [rimInner + 0.003, 0],
      [rimInner + depth * 0.25, -hw * 0.85],
      [rimOuter - 0.004, -hw],
      [rimOuter, -hw * 0.9],
      [rimOuter, hw * 0.9],
      [rimOuter - 0.004, hw],
      [rimInner + depth * 0.25, hw * 0.85],
      [rimInner + 0.003, 0],
    ].map(([r, z]) => new THREE.Vector2(r, z));
    const rim = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), rimMat);
    rim.rotation.x = Math.PI / 2;
    spin.add(rim);
    // ハブ(胴とフランジ)
    const hubMat = mat(0x2a2c31, { metalness: 0.8, roughness: 0.3 });
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.1, 20), hubMat);
    hub.rotation.x = Math.PI / 2;
    spin.add(hub);
    for (const z of [-0.03, 0.03]) {
      const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.004, 24), hubMat);
      fl.rotation.x = Math.PI / 2;
      fl.position.z = z;
      spin.add(fl);
    }
    // バルブ
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.03, 8), mat(0xcfd5db, { metalness: 0.9 }));
    valve.position.set(0, rimInner - 0.008, 0);
    spin.add(valve);
    if (disc) {
      const dp = [
        [0.02, 0.014],
        [rimInner + 0.01, 0.011],
        [rimInner + 0.01, -0.011],
        [0.02, -0.014],
      ].map(([r, z]) => new THREE.Vector2(r, z));
      const d = new THREE.Mesh(new THREE.LatheGeometry(dp, 64), rimMat);
      d.rotation.x = Math.PI / 2;
      spin.add(d);
    } else {
      // スポーク(細い棒をまとめて描く)。左右交互・接線組み
      const n = rimMm >= 40 ? 20 : 24;
      const spokeGeo = new THREE.CylinderGeometry(0.0011, 0.0011, 1, 5, 10);
      const inst = new THREE.InstancedMesh(spokeGeo, mat(0x9aa3ad, { metalness: 0.9, roughness: 0.25 }), n);
      const m4 = new THREE.Matrix4();
      const up = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < n; i++) {
        const side = i % 2 ? 0.03 : -0.03;
        const aH = (i / n) * Math.PI * 2;
        const aR = aH + (i % 4 < 2 ? 1 : -1) * 0.35; // 接線組み
        const A = new THREE.Vector3(Math.cos(aH) * 0.024, Math.sin(aH) * 0.024, side);
        const B = new THREE.Vector3(Math.cos(aR) * (rimInner + 0.004), Math.sin(aR) * (rimInner + 0.004), 0);
        const dir = new THREE.Vector3().subVectors(B, A);
        const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
        m4.compose(A.clone().addScaledVector(dir, 0.5), q, new THREE.Vector3(1, dir.length(), 1));
        inst.setMatrixAt(i, m4);
      }
      spin.add(inst);
    }
    gw.add(spin);
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
    const frameMat = paint(new THREE.Color(color), FINISH[build.finish] || {});
    const aero = at("frame").aero === "aero";
    const k = aero ? 1.2 : 1; // エアロフレームは太め
    const flat = aero ? 0.55 : 1;
    const bb = { x: 0, y: 0, z: 0 };
    const blackM = mat(COLORS.dark, { metalness: 0.5, roughness: 0.35 });
    const metal = mat(COLORS.metal, { metalness: 0.95, roughness: 0.22 });

    // フレーム: 先細りのパイプと、つなぎ目の丸み
    const gf = group("frame");
    const ttBack = lerp3(bb, bk.stTop, 0.97);
    gf.add(tube(bk.ttFront, ttBack, 0.017 * k, frameMat, flat, 0.015 * k));
    gf.add(tube(bk.dtFront, bb, 0.022 * k, frameMat, flat, 0.026 * k));
    gf.add(tube(bb, bk.stTop, 0.02 * k, frameMat, flat, 0.016 * k));
    gf.add(tube(bk.htBot, bk.htTop, 0.026 * k, frameMat, 1, 0.021 * k));
    for (const p of [bk.ttFront, bk.dtFront]) gf.add(ball(p, 0.021 * k, frameMat));
    gf.add(ball(ttBack, 0.017 * k, frameMat));
    const stJoin = lerp3(bb, bk.stTop, 0.9);
    for (const s of [-1, 1]) {
      const drop = { x: bk.rearAxle.x, y: bk.rearAxle.y, z: s * 0.065 };
      gf.add(tube({ x: stJoin.x, y: stJoin.y, z: s * 0.014 }, drop, 0.0095 * k, frameMat, 1, 0.007));
      gf.add(tube({ x: 0, y: 0, z: s * 0.032 }, drop, 0.013 * k, frameMat, 1, 0.008));
      gf.add(box(add3(drop, { x: 0.004, y: 0.004 }), [0.03, 0.03, 0.006], blackM));
    }
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.023, 0.072, 24), frameMat);
    shell.rotation.x = Math.PI / 2;
    gf.add(shell);
    // ヘッドセットの上のふた・シートクランプ
    gf.add(tube(bk.htTop, add3(bk.htTop, mul3(bk.up, 0.008)), 0.022, blackM));
    gf.add(tube(lerp3(bb, bk.stTop, 0.985), add3(bk.stTop, mul3(bk.seatDir, 0.012)), 0.019, blackM));

    // フォーク: 根元が太く、先が細い
    const gk = group("fork");
    const forkMat = frameMat.clone();
    const crownC = add3(bk.crown, mul3(bk.up, -0.01));
    gk.add(box(crownC, [0.05, 0.035, 0.085], forkMat));
    for (const s of [-1, 1]) {
      gk.add(tube({ x: crownC.x, y: crownC.y, z: s * 0.036 }, { x: bk.frontAxle.x, y: bk.frontAxle.y, z: s * 0.05 }, (aero ? 0.016 : 0.014) * 1, forkMat, aero ? 0.6 : 0.8, 0.008));
      gk.add(box({ x: bk.frontAxle.x, y: bk.frontAxle.y + 0.004, z: s * 0.05 }, [0.022, 0.026, 0.006], blackM));
    }

    // ホイールとタイヤ
    const gw = group("wheels");
    const gt = group("tires");
    group("tubes"); // 見えないが、選ぶとタイヤと一緒に光らせる
    const w = at("wheels");
    const tireW = at("tires").width || 28;
    wheel(bk.frontAxle, bk.R, tireW, w.rimFront || 25, false, gw, gt);
    wheel(bk.rearAxle, bk.R, tireW, w.rimRear || 25, !!w.discRear, gw, gt);
    // クイックリリースのレバー
    for (const ax of [bk.frontAxle, bk.rearAxle]) gw.add(box({ x: ax.x - 0.02, y: ax.y, z: -0.06 }, [0.06, 0.008, 0.006], metal));

    // コンポ: チェーンリング・クランク・スプロケット・チェーン・変速機・ブレーキ・シフター
    const gg = group("groupset");
    const ringR = 0.1;
    const ring = gear(ringR, 50, 0.004, mat(0x2b2d32, { metalness: 0.8, roughness: 0.3 }), 0.07);
    ring.position.set(0, 0, 0.052);
    gg.add(ring);
    // スパイダー(チェーンリングを支える腕)
    const spider = new THREE.Group();
    spider.userData.crank = true;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const arm = box({ x: Math.cos(a) * 0.04, y: Math.sin(a) * 0.04, z: 0.058 }, [0.08, 0.014, 0.006], blackM);
      arm.rotation.z = a;
      spider.add(arm);
    }
    gg.add(spider);
    // クランク(先細りの腕)
    const crank = new THREE.Group();
    crank.name = "crank";
    crank.userData.crank = true;
    const armShape = new THREE.Shape();
    const cl = bk.p.crank;
    armShape.moveTo(-0.018, 0);
    armShape.lineTo(-0.012, cl);
    armShape.absarc(0, cl, 0.012, Math.PI, 0, true);
    armShape.lineTo(0.018, 0);
    armShape.absarc(0, 0, 0.018, 0, Math.PI, true);
    const armGeo = new THREE.ExtrudeGeometry(armShape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2 });
    const armR = new THREE.Mesh(armGeo, paint(0x1b1c20, { metalness: 0.4 }));
    armR.position.z = 0.068;
    const armL = new THREE.Mesh(armGeo, paint(0x1b1c20, { metalness: 0.4 }));
    armL.rotation.z = Math.PI;
    armL.position.z = -0.08;
    crank.add(armR, armL);
    gg.add(crank);
    // スプロケット(11〜28T)
    const cogs = [11, 12, 13, 14, 15, 17, 19, 21, 24, 28];
    cogs.forEach((t, i) => {
      const cog = gear(0.0042 * t + 0.002, t, 0.0018, metal, 0.008);
      cog.position.set(bk.rearAxle.x, bk.rearAxle.y, 0.052 - i * 0.0039);
      cog.userData.spin = true;
      gg.add(cog);
    });
    // リアディレイラー(プーリー2つとケージ)
    const rx = bk.rearAxle.x, ry = bk.rearAxle.y;
    const pU = { x: rx + 0.005, y: ry - 0.065, z: 0.05 };
    const pL = { x: rx + 0.02, y: ry - 0.135, z: 0.05 };
    gg.add(box({ x: rx - 0.012, y: ry - 0.03, z: 0.068 }, [0.03, 0.05, 0.02], blackM));
    const cage = tube(pU, pL, 0.012, blackM, 0.35);
    cage.position.z = 0.058;
    gg.add(cage);
    for (const pp of [pU, pL]) {
      const pul = gear(0.016, 11, 0.004, mat(0x3a3d43, { metalness: 0.6 }), 0.004);
      pul.position.copy(V(pp));
      pul.userData.spin = true;
      gg.add(pul);
    }
    // チェーン: チェーンリング → 上を通ってスプロケット → プーリー2つ → 下を通ってチェーンリング
    const cogR = 0.0042 * 15 + 0.002;
    const pts = [];
    const z = 0.05;
    for (let a = 90; a >= -90; a -= 15) pts.push(new THREE.Vector3(Math.cos((a * Math.PI) / 180) * ringR, Math.sin((a * Math.PI) / 180) * ringR, z)); // チェーンリングの前側
    pts.push(new THREE.Vector3(pL.x + 0.016, pL.y - 0.012, z));
    pts.push(new THREE.Vector3(pL.x - 0.006, pL.y - 0.016, z));
    pts.push(new THREE.Vector3(pU.x + 0.016, pU.y, z));
    pts.push(new THREE.Vector3(pU.x - 0.014, pU.y + 0.006, z));
    for (let a = -100; a >= -270; a -= 20) pts.push(new THREE.Vector3(rx + Math.cos((a * Math.PI) / 180) * cogR, ry + Math.sin((a * Math.PI) / 180) * cogR, z)); // スプロケットの後ろ側
    pts.push(new THREE.Vector3(-0.03, ringR, z));
    const chain = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.2), 220, 0.0035, 6, true), mat(0x8a9099, { metalness: 0.9, roughness: 0.35 }));
    gg.add(chain);
    // ブレーキ(キャリパー)
    const caliper = (c, flipX) => {
      const g = new THREE.Group();
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.006, 8, 20, Math.PI), blackM);
      arch.rotation.y = Math.PI / 2;
      g.add(arch);
      for (const s of [-1, 1]) g.add(box({ x: 0, y: -0.03, z: s * 0.03 }, [0.03, 0.012, 0.008], mat(0x111111)));
      g.position.copy(V(c));
      g.rotation.z = flipX ? -0.3 : 0.3;
      return g;
    };
    gg.add(caliper(add3(bk.crown, { x: 0.025, y: -0.02 }), false));
    gg.add(caliper({ x: bk.stTop.x * 0.78 - 0.035, y: bk.stTop.y * 0.78 - 0.04 }, true));
    // シフター(ブラケットとレバー)
    const hoods = bk.grips.hoods;
    for (const s of [-1, 1]) {
      const hood = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), mat(0x18191c, { roughness: 0.7 }));
      hood.scale.set(0.045, 0.02, 0.016);
      hood.position.set(hoods.pt.x - 0.01, hoods.pt.y, s * hoods.z);
      hood.rotation.z = 0.35;
      gg.add(hood);
      const lever = new THREE.CatmullRomCurve3([
        new THREE.Vector3(hoods.pt.x + 0.03, hoods.pt.y + 0.01, s * hoods.z),
        new THREE.Vector3(hoods.pt.x + 0.045, hoods.pt.y - 0.05, s * hoods.z),
        new THREE.Vector3(hoods.pt.x + 0.03, hoods.pt.y - 0.1, s * (hoods.z + 0.005)),
      ]);
      gg.add(new THREE.Mesh(new THREE.TubeGeometry(lever, 16, 0.006, 8, false), metal));
    }

    // ハンドル・バーテープ
    const gh = group("handlebar");
    const gbt = group("bartape");
    const barCarbon = at("handlebar").type !== "round";
    const barMat = barCarbon ? paint(0xffffff, { map: carbonTex(), roughness: 0.4 }) : mat(0x2c2f36, { metalness: 0.6, roughness: 0.3 });
    const tapeMat = new THREE.MeshStandardMaterial({ map: tapeTex(build.tapeColor), color: 0xffffff, roughness: 0.95 });
    for (const s of [-1, 1]) {
      const path = barPath(bk.barClamp, bk.p.barReach, bk.p.barDrop, bk.p.barWidth / 2, s);
      const r = at("handlebar").type === "aero" ? 0.013 : 0.012;
      const bar = new THREE.Mesh(new THREE.TubeGeometry(path, 60, r, 14, false), barMat);
      if (at("handlebar").type === "aero") bar.scale.set(1, 0.85, 1);
      gh.add(bar);
      gbt.add(new THREE.Mesh(new THREE.TubeGeometry(path, 60, 0.0148, 14, false), tapeMat));
    }

    // ステム・コラムスペーサー
    // 一体型ハンドル(ステム込み)なら、ステム部分はハンドルと一緒に表示する
    const integrated = at("handlebar").type === "integrated";
    const gs = integrated ? gh : group("stem");
    const spacerMat = mat(0x2a2d33, { metalness: 0.5, roughness: 0.4 });
    const nSp = Math.max(1, Math.round(bk.p.spacers / 0.005));
    for (let i = 0; i < nSp && bk.p.spacers > 0.002; i++) {
      const a = add3(bk.htTop, mul3(bk.up, 0.008 + (bk.p.spacers / nSp) * i));
      gs.add(tube(a, add3(a, mul3(bk.up, bk.p.spacers / nSp - 0.0008)), 0.0185, spacerMat));
    }
    const stemMat = integrated ? barMat : paint(0x18191c, { metalness: 0.4 });
    gs.add(tube(add3(bk.steerer, mul3(bk.up, -0.02)), add3(bk.steerer, mul3(bk.up, 0.02)), 0.02, stemMat));
    gs.add(tube(bk.steerer, bk.barClamp, 0.016, stemMat, 1, 0.014));
    gs.add(box(add3(bk.barClamp, { x: 0.012 }), [0.016, 0.045, 0.05], stemMat));

    // シートポスト・サドル
    const gp = group("seatpost");
    gp.add(tube(bk.stTop, bk.clamp, 0.0136, paint(0x1c1e22, { metalness: 0.3 })));
    gp.add(box(add3(bk.clamp, { y: 0.012 }), [0.05, 0.02, 0.03], blackM));
    const gsd = group("saddle");
    const sh = new THREE.Shape();
    // 上から見たサドルの形(後ろが広く、前が細い)
    sh.moveTo(-0.13, 0);
    sh.bezierCurveTo(-0.13, 0.07, -0.08, 0.072, -0.03, 0.05);
    sh.bezierCurveTo(0.03, 0.025, 0.1, 0.02, 0.14, 0.012);
    sh.bezierCurveTo(0.152, 0.006, 0.152, -0.006, 0.14, -0.012);
    sh.bezierCurveTo(0.1, -0.02, 0.03, -0.025, -0.03, -0.05);
    sh.bezierCurveTo(-0.08, -0.072, -0.13, -0.07, -0.13, 0);
    const sGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.007, bevelSegments: 4, curveSegments: 16 });
    sGeo.rotateX(-Math.PI / 2);
    const saddle = new THREE.Mesh(sGeo, mat(COLORS.saddle, { roughness: 0.65 }));
    saddle.userData.decal = true; // 写真を貼るのはサドルの本体だけ(レールは貼らない)
    saddle.position.set(bk.saddleTop.x - 0.015, bk.saddleTop.y - 0.026, 0);
    gsd.add(saddle);
    for (const s of [-1, 1]) gsd.add(tube({ x: bk.saddleTop.x - 0.09, y: bk.saddleTop.y - 0.03, z: s * 0.02 }, { x: bk.saddleTop.x + 0.08, y: bk.saddleTop.y - 0.03, z: s * 0.012 }, 0.0035, metal));

    // ペダル(クランクに合わせて回る)
    const gpd = group("pedals");
    for (const s of [-1, 1]) {
      const pg = new THREE.Group();
      pg.userData.pedal = s;
      const ps = new THREE.Shape();
      ps.moveTo(-0.045, -0.01);
      ps.lineTo(0.045, -0.006);
      ps.lineTo(0.045, 0.006);
      ps.lineTo(-0.045, 0.01);
      ps.closePath();
      const body = new THREE.Mesh(new THREE.ExtrudeGeometry(ps, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2 }), paint(0x15161a));
      // ペダルの中心は z = ±0.1(毎フレームの位置合わせと同じ)。軸はクランクの先(±0.075)から
      body.position.z = s > 0 ? -0.012 : -0.058;
      pg.add(body);
      pg.add(tube({ x: 0, y: 0, z: -s * 0.025 }, { x: 0, y: 0, z: -s * 0.008 }, 0.005, metal));
      pg.position.set(0, 0, s * 0.1);
      gpd.add(pg);
    }

    // ボトルケージ・その他
    const gc = group("cages");
    const bottles = at("cages").bottles != null ? at("cages").bottles : 1;
    const dtMid = lerp3(bk.dtFront, bb, 0.5);
    const stMid = lerp3(bb, bk.stTop, 0.45);
    if (bottles >= 1) gc.add(bottleMesh(dtMid, bk.dtFront, 1));
    if (bottles >= 2) gc.add(bottleMesh(stMid, bk.stTop, -1));
    const ga = group("accessories");
    if ((at("accessories").extras || 0) > 0) {
      // サイコン(アウトフロントマウント)
      ga.add(tube(bk.barClamp, add3(bk.barClamp, { x: 0.06 }), 0.005, blackM));
      ga.add(box(add3(bk.barClamp, { x: 0.075, y: 0.01 }), [0.07, 0.016, 0.05], mat(0x0b0c0f, { roughness: 0.3 })));
      ga.add(box(add3(bk.barClamp, { x: 0.075, y: 0.0185 }), [0.055, 0.002, 0.04], mat(0x334455, { emissive: 0x223344, emissiveIntensity: 0.6, roughness: 0.1 })));
      // 前後のライト
      const light = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.06, 16), mat(0x222222, { metalness: 0.6 }));
      light.rotation.z = Math.PI / 2;
      light.position.set(bk.barClamp.x + 0.02, bk.barClamp.y - 0.03, 0.09);
      ga.add(light);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), mat(0xffffff, { emissive: 0xfff2c0, emissiveIntensity: 1.2 }));
      lens.rotation.y = Math.PI / 2;
      lens.position.set(bk.barClamp.x + 0.051, bk.barClamp.y - 0.03, 0.09);
      ga.add(lens);
      ga.add(box(lerp3(bk.stTop, bk.clamp, 0.4), [0.02, 0.05, 0.03], mat(0xff2a2a, { emissive: 0xff0000, emissiveIntensity: 0.8 })));
      if ((at("accessories").extras || 0) >= 3) ga.add(box({ x: bk.saddleTop.x - 0.06, y: bk.saddleTop.y - 0.07, z: 0 }, [0.1, 0.06, 0.06], mat(0x222222, { roughness: 0.8 })));
    }

    // 影を落とす・受ける
    bikeGroup.traverse((o) => o.isMesh && ((o.castShadow = true), (o.receiveShadow = true)));
    // 外しているパーツは隠す
    for (const id of Object.keys(groups)) {
      groups[id].visible = !(parts[id] && parts[id].mounted === false);
      groups[id].userData.offset = new THREE.Vector3();
      groups[id].traverse((o) => {
        if (o.isMesh) {
          o.material = o.material.clone();
          o.userData.baseEmissive = o.material.emissive ? o.material.emissive.clone() : null;
          o.userData.baseEmissiveI = o.material.emissiveIntensity;
        }
      });
    }
    // タイヤとチューブは同じ場所にあるので、チューブを外したらタイヤを半透明にする
    if (parts.tubes && parts.tubes.mounted === false) {
      groups.tires.traverse((o) => o.isMesh && ((o.material.transparent = true), (o.material.opacity = 0.35)));
    }
  }

  // ボトル(キャップとくびれつき)
  function bottleMesh(center, toward, side = 1) {
    const THREE = T();
    const g = new THREE.Group();
    const dir = new THREE.Vector3(toward.x - center.x, toward.y - center.y, 0).normalize();
    const prof = [
      [0, -0.1],
      [0.034, -0.1],
      [0.036, -0.06],
      [0.032, -0.02],
      [0.036, 0.03],
      [0.035, 0.075],
      [0.024, 0.095],
      [0.012, 0.1],
      [0, 0.1],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const b = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), new THREE.MeshPhysicalMaterial({ color: 0xf2f4f7, roughness: 0.5, transmission: 0, clearcoat: 0.3 }));
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.022, 16), mat(0x1f6fe5));
    cap.position.y = 0.11;
    const holder = new THREE.Group();
    holder.add(b, cap);
    holder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const n = new THREE.Vector3(-dir.y, dir.x, 0).multiplyScalar(0.046 * side);
    holder.position.set(center.x + n.x, center.y + n.y, 0);
    g.add(holder);
    return g;
  }

  const add3 = (a, b) => ({ x: a.x + (b.x || 0), y: a.y + (b.y || 0), z: (a.z || 0) + (b.z || 0) });
  const mul3 = (a, k) => ({ x: a.x * k, y: a.y * k, z: (a.z || 0) * k });
  const lerp3 = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: (a.z || 0) + ((b.z || 0) - (a.z || 0)) * t });

  // ---------- ライダー ----------
  // 服装: ジャージ(胴・上腕)、ビブショーツ(太もも)、素肌(前腕・すね)、ソックス・シューズ・グローブ
  function buildRider() {
    const THREE = T();
    if (riderGroup) root.remove(riderGroup);
    riderGroup = new THREE.Group();
    root.add(riderGroup);
    riderParts = [];
    const sph = new THREE.SphereGeometry(1, 20, 14);
    const jersey = new THREE.MeshPhysicalMaterial({ color: COLORS.jersey, roughness: 0.7, sheen: 0.25, sheenColor: new THREE.Color(0x3d6fd0), sheenRoughness: 0.6, envMapIntensity: 0.4 });
    const shorts = new THREE.MeshPhysicalMaterial({ color: COLORS.shorts, roughness: 0.45, sheen: 0.4, sheenColor: new THREE.Color(0x444a55) });
    const skin = new THREE.MeshPhysicalMaterial({ color: COLORS.skin, roughness: 0.6, sheen: 0.2, sheenColor: new THREE.Color(0xffd0b0), envMapIntensity: 0.4 });
    const shoe = paint(COLORS.shoe, { roughness: 0.35 });
    const matFor = (part) => (part === "torso" || part === "arm" ? jersey : part === "thigh" ? shorts : part === "foot" ? shoe : skin);
    for (let i = 0; i < state.fit.caps.length; i++) {
      const c = state.fit.caps[i];
      const m = matFor(c.part);
      // 先細りの円柱(根元の太さ1に対して先の太さ r2/r)
      const ratio = c.r > 0 ? (c.r2 == null ? 1 : c.r2 / c.r) : 1;
      const body = new THREE.Mesh(new THREE.CylinderGeometry(ratio, 1, 1, 20, 10), m);
      const e1 = new THREE.Mesh(sph, m);
      const e2 = new THREE.Mesh(sph, c.part === "thigh" ? skin : m); // 膝は素肌
      riderGroup.add(body, e1, e2);
      riderParts.push({ body, e1, e2 });
    }
    // 胴の中身(左右2本のあいだを埋めて、胸と背中の形にする。表示だけで計算には使わない)
    // 腰側の太さは体型で変わる(体重が多いと、胸より腰回りが太くなる)
    const sgB = state.fit.seg;
    const waistRatio = Math.max(0.78, Math.min(1.35, (sgB.r.torso[0] / sgB.r.torso[1]) * 0.9));
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(1, waistRatio, 1, 32, 10), jersey);
    chest.name = "chest";
    riderGroup.add(chest);
    // お腹(前傾すると下側に出る)
    const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), jersey);
    belly.name = "belly";
    riderGroup.add(belly);
    const shoulders = new THREE.Mesh(sph, jersey);
    shoulders.name = "shoulders";
    riderGroup.add(shoulders);
    // ソックス(足首)・シューズの底・グローブ
    const sockMat = mat(COLORS.sock, { roughness: 0.9 });
    const extras = new THREE.Group();
    extras.name = "extras";
    for (let i = 0; i < 2; i++) {
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16), sockMat);
      sock.name = "sock";
      extras.add(sock);
      const glove = new THREE.Mesh(sph, mat(0x111214, { roughness: 0.8 }));
      glove.name = "glove";
      extras.add(glove);
    }
    riderGroup.add(extras);
    // ヘルメット(通気口の模様)とサングラス
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 1.85), paint(0xffffff, { map: helmetTex(), roughness: 0.3 }));
    helmet.name = "helmet";
    riderGroup.add(helmet);
    const glasses = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 8, 24, Math.PI * 0.9), new THREE.MeshPhysicalMaterial({ color: COLORS.lens, metalness: 0.6, roughness: 0.05, clearcoat: 1 }));
    glasses.name = "glasses";
    riderGroup.add(glasses);
    riderGroup.traverse((o) => o.isMesh && (o.castShadow = true));
    riderGroup.visible = anim.rider;
    updateRider();
  }

  // 今のクランク角度でライダーの姿勢を計算し直して、各部を動かす
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
      p.e2.scale.setScalar(c.r2 == null ? c.r : c.r2);
    });
    // 胴: 腰から肩へ、肩幅に合わせた楕円の断面(胸の厚み × 肩幅)
    const sg = state.fit.seg;
    const chest = riderGroup.getObjectByName("chest");
    const H0 = V(pose.hipMid), S0 = V(pose.shoulderMid);
    const td = new THREE.Vector3().subVectors(S0, H0);
    const tl = td.length();
    chest.position.copy(H0).addScaledVector(td, 0.5);
    chest.quaternion.setFromUnitVectors(up, td.clone().normalize());
    chest.scale.set(sg.r.torso[1] * 1.05, tl * 0.92, sg.shoulderHalf + sg.r.torso[1] * 0.35);
    const belly = riderGroup.getObjectByName("belly");
    const bl = sg.belly || 0;
    belly.visible = bl > 0.008;
    if (belly.visible) {
      const tn = td.clone().normalize();
      // 胴の向きに直角で下を向く向き(横から見た面の中で)
      const nrm = new THREE.Vector3(tn.y, -tn.x, 0).normalize();
      belly.position.copy(H0).addScaledVector(td, 0.36).addScaledVector(nrm, sg.r.torso[0] * 0.35 + bl * 0.5);
      belly.quaternion.setFromUnitVectors(up, tn);
      belly.scale.set(sg.r.torso[0] * 0.75 + bl, tl * 0.3, sg.shoulderHalf * 0.8 + bl * 0.6);
    }
    const shoulders = riderGroup.getObjectByName("shoulders");
    shoulders.position.copy(S0).addScaledVector(td.clone().normalize(), -0.02);
    shoulders.scale.set(sg.r.torso[1] * 1.0, sg.r.torso[1] * 0.85, sg.shoulderHalf + sg.r.arm[0] * 0.6);
    // ソックスは足首、グローブは手
    const extras = riderGroup.getObjectByName("extras");
    const socks = extras.children.filter((o) => o.name === "sock");
    const gloves = extras.children.filter((o) => o.name === "glove");
    ["R", "L"].forEach((side, i) => {
      const l = pose.legs[side];
      const A = V(l.ankle);
      const K = V(l.knee);
      const d = new THREE.Vector3().subVectors(K, A).normalize();
      socks[i].position.copy(A).addScaledVector(d, 0.045);
      socks[i].quaternion.setFromUnitVectors(up, d);
      const r = (state.fit.seg.r.shank[1] || 0.035) * 1.08;
      socks[i].scale.set(r, 0.09, r);
      gloves[i].position.copy(V(pose.arms[side].hand));
      gloves[i].scale.set(0.045, 0.03, 0.035);
    });
    const head = caps.find((c) => c.part === "head");
    const helmet = riderGroup.getObjectByName("helmet");
    const tilt = ((pose.torsoAngle - 20) * Math.PI) / 180 * 0.5;
    helmet.position.copy(V(head.a)).add(new THREE.Vector3(-0.005, 0.012, 0));
    helmet.scale.set(head.r * 1.25, head.r * 1.05, head.r * 1.08);
    helmet.rotation.set(0, 0, tilt - 0.15);
    const glasses = riderGroup.getObjectByName("glasses");
    glasses.position.copy(V(head.a)).add(new THREE.Vector3(head.r * 0.35, -head.r * 0.2, 0));
    glasses.scale.setScalar(head.r * 0.82);
    glasses.rotation.set(Math.PI / 2, 0, Math.PI / 2 + Math.PI * 0.05);
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

  // ---------- 写真のデザインを3Dに貼る(投影マッピング) ----------
  // 横から撮った写真を、プロジェクターで映すように3Dの面に貼る。横から見ると写真とほぼ同じ見た目になる
  const texLoaded = {};
  function loadTex(url, cb) {
    const THREE = T();
    if (texLoaded[url]) return cb(texLoaded[url]);
    new THREE.TextureLoader().load(url, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texLoaded[url] = tex;
      cb(tex);
      photo.dirty = true;
    });
  }

  // mesh の頂点を、base(部位のグループやホイールの中心)から見た座標にして fn(x, y) → [u, v] を貼る
  function projectUV(mesh, base, fn, shrink) {
    const THREE = T();
    mesh.userData.projected = true; // 写真の貼り方を計算した形(写真モードで作り直さない)
    const M = new THREE.Matrix4();
    for (let o = mesh; o && o !== base; o = o.parent) {
      o.updateMatrix();
      M.premultiply(o.matrix);
    }
    const geo = mesh.geometry;
    const pos = geo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    const v = new THREE.Vector3();
    const ax = mesh.userData.axis;
    const ce = mesh.userData.center;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(M);
      let x = v.x, y = v.y;
      // パイプの縁は、写真ではパイプの外(壁など)が写りやすいので、中心線に少し寄せて取る
      if (shrink && ax) {
        const dx = ax.b.x - ax.a.x, dy = ax.b.y - ax.a.y;
        const L2 = dx * dx + dy * dy || 1;
        const t = Math.max(0, Math.min(1, ((x - ax.a.x) * dx + (y - ax.a.y) * dy) / L2));
        const cx = ax.a.x + t * dx, cy = ax.a.y + t * dy;
        x = cx + (x - cx) * shrink;
        y = cy + (y - cy) * shrink;
      } else if (shrink && ce) {
        x = ce.x + (x - ce.x) * shrink;
        y = ce.y + (y - ce.y) * shrink;
      }
      const [u, w] = fn(x, y, v.z);
      uv[i * 2] = u;
      uv[i * 2 + 1] = w;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }

  function photoMaterial(tex, opts) {
    const THREE = T();
    const m = new THREE.MeshPhysicalMaterial(Object.assign({ map: tex, color: 0xffffff, roughness: 0.38, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.5 }, opts));
    return m;
  }

  // 写真の背景(パーツ以外の所)を、近くのパーツの色で埋める。
  // 細いパイプなど、3Dと写真の位置が少しずれても、背景の白ではなく塗装の色になるように
  const cleanCache = {};
  function cleanedTexture(url, crop, cb) {
    const k = url + "|" + (crop || []).join(",");
    if (cleanCache[k]) return cb(cleanCache[k]);
    const img = new Image();
    img.onload = () => {
      const THREE = T();
      const s0 = Math.min(1, 1024 / Math.max(img.width, img.height));
      const W = Math.max(1, Math.round(img.width * s0)), H = Math.max(1, Math.round(img.height * s0));
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0, W, H);
      const im = g.getImageData(0, 0, W, H);
      const d = im.data;
      // 背景の色: パーツの範囲の外周の色の平均(範囲が写真全体なら、写真の縁)
      const [x0, y0, x1, y1] = (crop || [0, 0, 1, 1]).map((v, i) => Math.round(v * (i % 2 ? H : W)));
      // (平均ではなく真ん中の値: 縁にタイヤなどが少しかかっていても、背景の色になる)
      const rs = [], gs = [], bs = [];
      const pick = (x, y) => {
        x = Math.max(0, Math.min(W - 1, x));
        y = Math.max(0, Math.min(H - 1, y));
        const i = (y * W + x) * 4;
        rs.push(d[i]), gs.push(d[i + 1]), bs.push(d[i + 2]);
      };
      for (let x = x0; x < x1; x += 3) pick(x, y0), pick(x, y1 - 1);
      for (let y = y0; y < y1; y += 3) pick(x0, y), pick(x1 - 1, y);
      const med = (a) => a.sort((p, q) => p - q)[a.length >> 1] || 0;
      const br = med(rs), bgc = med(gs), bb = med(bs);
      // パーツの所(背景と色が違う所)の重み
      const L = [];
      let w = W, h = H;
      let cur = { w, h, r: new Float32Array(w * h), g: new Float32Array(w * h), b: new Float32Array(w * h), m: new Float32Array(w * h) };
      for (let i = 0; i < w * h; i++) {
        const r = d[i * 4], gg = d[i * 4 + 1], b2 = d[i * 4 + 2];
        const diff = Math.abs(r - br) + Math.abs(gg - bgc) + Math.abs(b2 - bb);
        const m = diff > 60 ? 1 : diff > 35 ? (diff - 35) / 25 : 0;
        cur.r[i] = r * m, cur.g[i] = gg * m, cur.b[i] = b2 * m, cur.m[i] = m;
      }
      L.push(cur);
      // 縮めながら色を平均(重みつき)
      while (cur.w > 1 || cur.h > 1) {
        const nw = Math.max(1, cur.w >> 1), nh = Math.max(1, cur.h >> 1);
        const nx = { w: nw, h: nh, r: new Float32Array(nw * nh), g: new Float32Array(nw * nh), b: new Float32Array(nw * nh), m: new Float32Array(nw * nh) };
        for (let y = 0; y < cur.h; y++)
          for (let x = 0; x < cur.w; x++) {
            const j = Math.min(nh - 1, y >> 1) * nw + Math.min(nw - 1, x >> 1), i = y * cur.w + x;
            nx.r[j] += cur.r[i], nx.g[j] += cur.g[i], nx.b[j] += cur.b[i], nx.m[j] += cur.m[i];
          }
        L.push(nx);
        cur = nx;
      }
      // 粗い段から細かい段へ: 重みが足りない所を、粗い段の平均の色で埋める
      for (let l = L.length - 2; l >= 0; l--) {
        const a = L[l], p2 = L[l + 1];
        for (let y = 0; y < a.h; y++)
          for (let x = 0; x < a.w; x++) {
            const i = y * a.w + x, j = Math.min(p2.h - 1, y >> 1) * p2.w + Math.min(p2.w - 1, x >> 1);
            const pm = p2.m[j] || 1e-6;
            const m = a.m[i];
            if (m >= 1) {
              // パーツの色がわかっている所: その平均
              a.r[i] /= m, a.g[i] /= m, a.b[i] /= m;
            } else {
              // 一部だけ・まったくわからない所: 粗い段の色で埋める
              a.r[i] += (1 - m) * (p2.r[j] / pm);
              a.g[i] += (1 - m) * (p2.g[j] / pm);
              a.b[i] += (1 - m) * (p2.b[j] / pm);
            }
            a.m[i] = 1;
          }
      }
      const top = L[0];
      for (let i = 0; i < W * H; i++) (d[i * 4] = top.r[i]), (d[i * 4 + 1] = top.g[i]), (d[i * 4 + 2] = top.b[i]);
      g.putImageData(im, 0, 0);
      const tex = new THREE.CanvasTexture(c);
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      cleanCache[k] = tex;
      cb(tex);
      photo.dirty = true;
    };
    img.src = url;
  }

  // 写真を、部位の形の範囲にそのまま投影する(どの部位でも使える貼り方)。
  // d.crop: 写真の中でパーツが写っている範囲 [左, 上, 右, 下](0〜1)、d.view: 写真の向き(side/top/front)、
  // d.flip: 横からの写真でパーツの前が左向き、d.ref: "bike" なら自転車全体の写真(フレームの部分に貼る)
  function applyAutoDecal(slot, d) {
    const THREE = T();
    const owner = bikeGroup;
    const ids = slot === "frame" ? ["frame", "fork"] : slot === "tubes" ? [] : [slot === "stem" && !groups.stem ? "handlebar" : slot];
    const targets = [];
    for (const id of ids) {
      const g = groups[id];
      if (!g || !g.visible) continue;
      g.traverse((o) => {
        if (!o.isMesh || o.isInstancedMesh || o.userData.projected) return;
        if (slot === "groupset") {
          // コンポの写真はクランクまわり(BBの近く・右側)に貼る
          const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
          const bb = new THREE.Vector3(0, 0, 0).applyMatrix4(bikeGroup.matrixWorld);
          if (c.distanceTo(bb) > 0.2 || c.z < -0.01) return;
        }
        targets.push(o);
      });
    }
    if (!targets.length) return;
    // 写真に合わせる3Dの範囲
    const box = new THREE.Box3();
    if (d.ref === "bike") box.setFromObject(bikeGroup);
    else for (const o of targets) box.expandByObject(o);
    const plane = (x, y, z) => (d.view === "top" ? [z, x] : d.view === "front" ? [-z, y] : [x, y]);
    const [h0, v0] = plane(box.min.x, box.min.y, box.min.z), [h1, v1] = plane(box.max.x, box.max.y, box.max.z);
    const hMin = Math.min(h0, h1), hMax = Math.max(h0, h1), vMin = Math.min(v0, v1), vMax = Math.max(v0, v1);
    // 写っている範囲の縁は背景の色が混ざりやすいので、少し内側を使う
    const [ax0, ay0, ax1, ay1] = d.crop || [0, 0, 1, 1];
    const ix = (ax1 - ax0) * 0.06, iy = (ay1 - ay0) * 0.1;
    const cx0 = ax0 + ix, cx1 = ax1 - ix, cy0 = ay0 + iy, cy1 = ay1 - iy;
    const fn = (x, y, z) => {
      const [h, v] = plane(x, y, z);
      let u = (h - hMin) / (hMax - hMin || 1);
      if (d.flip) u = 1 - u;
      const t = (v - vMin) / (vMax - vMin || 1);
      return [cx0 + u * (cx1 - cx0), 1 - (cy0 + (1 - t) * (cy1 - cy0))];
    };
    cleanedTexture(d.url, d.crop, (tex) => {
      if (bikeGroup !== owner) return;
      scene.updateMatrixWorld(true);
      for (const o of targets) {
        projectUV(o, null, fn, 0);
        const old = o.material;
        o.material = photoMaterial(tex, { metalness: old.metalness != null ? Math.min(0.5, old.metalness) : 0.1, roughness: old.roughness != null ? Math.max(0.3, old.roughness) : 0.4, clearcoat: slot === "frame" ? 1 : 0.4 });
        o.userData.baseEmissive = o.material.emissive.clone();
        o.userData.baseEmissiveI = 1;
      }
      if (highlightId) highlight(highlightId);
    });
  }

  function applyDecals(decals) {
    if (!decals) return;
    for (const [slot, d] of Object.entries(decals)) if (d && d.kind === "auto") applyAutoDecal(slot, d);
    const owner = bikeGroup;
    const bk = state.fit.bike;
    if (decals.frame && decals.frame.pts) {
      const d = decals.frame;
      // 写真の3点(後輪の軸・BB・ヘッドチューブの上端)と、3Dの同じ3点を合わせる
      const m = Measure.affine3([bk.rearAxle, { x: 0, y: 0 }, bk.htTop], [d.pts.rearAxle, d.pts.bb, d.pts.htTop]);
      if (m) {
        const fn = (x, y) => [(m[0] * x + m[1] * y + m[2]) / d.w, 1 - (m[3] * x + m[4] * y + m[5]) / d.h];
        loadTex(d.url, (tex) => {
          if (bikeGroup !== owner) return; // 描き直されていたら何もしない
          for (const id of ["frame", "fork"]) {
            const g = groups[id];
            if (!g) continue;
            g.traverse((o) => {
              if (!o.isMesh || o.isInstancedMesh) return;
              projectUV(o, g, fn, 0.6);
              o.material = photoMaterial(tex);
              o.userData.baseEmissive = o.material.emissive.clone();
              o.userData.baseEmissiveI = 1;
            });
          }
          if (highlightId) highlight(highlightId);
        });
      }
    }
    // 2点の対応(回転・拡大・移動)で、平面の座標 [h, v] → 写真のピクセルを求める。
    // 複素数で 写真 = A + (B − A) / (b − a) × (p − a)。写真は下向きが+なので、向きは座標の取り方で合わせる
    const similar = (a, b, A, B, d) => {
      const mx = b[0] - a[0], my = b[1] - a[1];
      const ix = B.x - A.x, iy = B.y - A.y;
      const den = mx * mx + my * my || 1;
      const kr = (ix * mx + iy * my) / den, ki = (iy * mx - ix * my) / den;
      return (h, v) => {
        const px = h - a[0], py = v - a[1];
        return [(A.x + kr * px - ki * py) / d.w, 1 - (A.y + ki * px + kr * py) / d.h];
      };
    };
    const paintGroups = (ids, url, fn, filter, opts) =>
      loadTex(url, (tex) => {
        if (bikeGroup !== owner) return;
        for (const id of ids) {
          const g = groups[id];
          if (!g) continue;
          g.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || (filter && !filter(o))) return;
            projectUV(o, g, fn, 0);
            o.material = photoMaterial(tex, opts);
            o.userData.baseEmissive = o.material.emissive.clone();
            o.userData.baseEmissiveI = 1;
          });
        }
        if (highlightId) highlight(highlightId);
      });
    // サドル: 上から撮った写真の、先端と後ろの端の中心
    if (decals.saddle && decals.saddle.pts && groups.saddle) {
      const d = decals.saddle;
      const x0 = bk.saddleTop.x - 0.015;
      const tail = [x0 - 0.137, 0], nose = [x0 + 0.155, 0];
      // 写真で先端が上なら、乗る人の右(z+)は写真の右
      const f = similar(tail, nose, d.pts.tail, d.pts.nose, d);
      paintGroups(["saddle"], d.url, (x, y, z) => f(x, z), (o) => o.userData.decal, { clearcoat: 0.3, roughness: 0.55 });
    }
    // ハンドル・バーテープ: 正面から撮った写真の、左右のドロップの下の端
    for (const id of ["handlebar", "bartape"]) {
      const d = decals[id];
      if (!d || !d.pts || !groups[id]) continue;
      const hw = bk.p.barWidth / 2 + 0.015;
      const yEnd = bk.barClamp.y - bk.p.barDrop + 0.01;
      // 正面から見ると、乗る人の右(z+)は写真の左、上(y+)は写真の上
      const f = similar([hw, yEnd], [-hw, yEnd], d.pts.barL, d.pts.barR, d);
      // ハンドルだけ貼るときは、ステム込み(一体型)の部分にも貼る
      paintGroups([id], d.url, (x, y, z) => f(z, y), null, id === "bartape" ? { clearcoat: 0, roughness: 0.9 } : {});
    }
    if (decals.wheels && decals.wheels.pts) {
      const d = decals.wheels;
      const tw = ((state.build.parts.tires && state.build.parts.tires.attrs && state.build.parts.tires.attrs.width) || 28) / 1000;
      const rimOuter = bk.R - tw * 0.92;
      const k = Math.hypot(d.pts.rimEdge.x - d.pts.hub.x, d.pts.rimEdge.y - d.pts.hub.y) / rimOuter; // 1mが写真で何ピクセルか
      const fn = (x, y) => [(d.pts.hub.x + x * k) / d.w, 1 - (d.pts.hub.y - y * k) / d.h];
      (d.clean ? (cb) => cleanedTexture(d.url, null, cb) : (cb) => loadTex(d.url, cb))((tex) => {
        if (bikeGroup !== owner) return;
        for (const id of ["wheels", "tires"]) {
          const g = groups[id];
          if (!g) continue;
          // ホイールごとの回る入れ物(中心が軸)を基準にする
          g.children.forEach((spin) => {
            if (!spin.userData.spin) return;
            spin.traverse((o) => {
              if (!o.isMesh || o.isInstancedMesh || o === spin) return;
              const r = o.geometry.boundingSphere || (o.geometry.computeBoundingSphere(), o.geometry.boundingSphere);
              if (r.radius < 0.1) return; // ハブ・バルブはそのまま
              projectUV(o, spin, fn, 0);
              o.material = photoMaterial(tex, id === "tires" ? { clearcoat: 0, roughness: 0.85 } : {});
              o.userData.baseEmissive = o.material.emissive.clone();
              o.userData.baseEmissiveI = 1;
            });
          });
        }
        if (highlightId) highlight(highlightId);
      });
    }
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
  function setModel(fit, build, body, decals) {
    state = { fit, build, body };
    buildBike(fit, build);
    applyDecals(decals);
    buildRider();
    buildFlow();
    placeOnStand();
    if (highlightId) highlight(highlightId);
    photo.dirty = true;
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
    cam.distGoal = fitDist();
    cam.auto = true;
  }

  function setRider(on) {
    anim.rider = on;
    photo.dirty = true;
    if (riderGroup) riderGroup.visible = on;
    if (flowPoints) flowPoints.visible = anim.flow && on;
    placeOnStand();
  }

  function setFlow(on) {
    anim.flow = on;
    photo.dirty = true;
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
    photo.dirty = true;
    for (const [gid, g] of Object.entries(groups)) {
      const on = gid === id || (id === "tubes" && gid === "tires") || (id === "stem" && !groups.stem && gid === "handlebar");
      g.traverse((o) => {
        if (!o.isMesh || !o.material.emissive) return;
        if (on) o.material.emissive.setHex(0x1f6fe5);
        else if (o.userData.baseEmissive) o.material.emissive.copy(o.userData.baseEmissive);
        o.material.emissiveIntensity = on ? 0.5 : o.userData.baseEmissiveI != null ? o.userData.baseEmissiveI : 1;
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
        cam.auto = false;
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
    let down = null;
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      down = pts.size === 1 ? { x: e.clientX, y: e.clientY } : null;
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
        cam.auto = false;
      }
    });
    const end = (e) => {
      // 動かさずに離したらタップ: 店員さんに当たったか調べる
      if (e.type === "pointerup" && down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8 && clerkGroup && clerkTap) {
        const THREE = T();
        const r = renderer.domElement.getBoundingClientRect();
        const ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        if (ray.intersectObject(clerkGroup, true).length) clerkTap();
      }
      down = null;
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
        cam.auto = false;
      },
      { passive: false }
    );
  }

  // ---------- 付けたときのエフェクト ----------
  // レア度 lv(0〜4)が高いほど派手に: 衝撃波の輪・光の粒・部品の光・(lv3以上)光の柱
  const fxList = [];
  let fxGlow = null;
  function equipFx(id, colorHex, lv = 0) {
    const THREE = T();
    const gid = id === "stem" && !groups.stem ? "handlebar" : id === "tubes" ? "tires" : id;
    const g = groups[gid];
    const color = new THREE.Color(colorHex);
    const c = new THREE.Vector3(0.2, 0.6, 0);
    let size = 0.6;
    if (g) {
      const b = new THREE.Box3().setFromObject(g);
      if (!b.isEmpty()) b.getCenter(c), (size = Math.max(0.15, b.getSize(new THREE.Vector3()).length() * 0.5));
    }
    const add = (obj, life, update) => {
      scene.add(obj);
      fxList.push({ obj, t: 0, life, update });
    };
    const glowMat = (opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    // 衝撃波の輪(カメラの方を向く)
    for (let r = 0; r < 1 + (lv >= 3 ? 1 : 0); r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(size, 0.004 + lv * 0.0015, 8, 96), glowMat(0.9));
      ring.position.copy(c);
      ring.lookAt(camera.position);
      add(ring, 0.9 + r * 0.25, (o, t, k) => {
        const e = Math.max(0, k - r * 0.2);
        o.scale.setScalar(0.3 + e * (1.6 + lv * 0.3));
        o.material.opacity = 0.9 * (1 - e);
      });
    }
    // 光の粒
    const n = 30 + lv * 45;
    const pos = new Float32Array(n * 3), vel = [];
    for (let i = 0; i < n; i++) {
      pos.set([c.x, c.y, c.z], i * 3);
      const v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 0.6, Math.random() * 2 - 1).normalize().multiplyScalar((0.4 + Math.random() * 0.9) * (0.8 + lv * 0.25));
      vel.push(v);
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color, size: 0.014 + lv * 0.004, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }));
    add(pts, 1.2 + lv * 0.15, (o, t, k, dt) => {
      const a = o.geometry.attributes.position;
      for (let i = 0; i < n; i++) {
        vel[i].y -= dt * 1.2;
        vel[i].multiplyScalar(1 - dt * 1.5);
        a.setXYZ(i, a.getX(i) + vel[i].x * dt, a.getY(i) + vel[i].y * dt, a.getZ(i) + vel[i].z * dt);
      }
      a.needsUpdate = true;
      o.material.opacity = 1 - k * k;
    });
    // 光の柱(レアなパーツだけ)
    if (lv >= 3) {
      const tex = canvasTexture(64, (gc, sz) => {
        const gr = gc.createLinearGradient(0, 0, 0, sz);
        gr.addColorStop(0, "rgba(255,255,255,0)");
        gr.addColorStop(0.7, "rgba(255,255,255,0.6)");
        gr.addColorStop(1, "rgba(255,255,255,1)");
        gc.fillStyle = gr;
        gc.fillRect(0, 0, sz, sz);
      });
      const m = glowMat(0.0);
      m.map = tex;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 3, 32, 1, true), m);
      pillar.position.set(c.x, root.position.y - (state ? state.fit.bike.g.bbDrop - state.fit.bike.R : 0) + 1.5, 0);
      add(pillar, 2.0, (o, t, k) => {
        o.material.opacity = Math.sin(Math.min(1, k) * Math.PI) * (lv >= 4 ? 0.55 : 0.35);
        o.rotation.y += 0.02;
      });
    }
    // 部品そのものを光らせる
    fxGlow = g ? { g, color, t: 0, life: 1.1 + lv * 0.2, lv } : null;
    photo.dirty = true;
  }

  function updateFx(dt) {
    for (let i = fxList.length - 1; i >= 0; i--) {
      const f = fxList[i];
      f.t += dt;
      const k = Math.min(1, f.t / f.life);
      f.update(f.obj, f.t, k, dt);
      if (f.t >= f.life) {
        scene.remove(f.obj);
        f.obj.geometry.dispose();
        f.obj.material.dispose();
        fxList.splice(i, 1);
      }
    }
    if (fxGlow) {
      fxGlow.t += dt;
      const k = fxGlow.t / fxGlow.life;
      const e = k >= 1 ? 0 : (1 - k) * (0.6 + fxGlow.lv * 0.2) * (0.75 + 0.25 * Math.sin(fxGlow.t * 30));
      fxGlow.g.traverse((o) => {
        if (!o.isMesh || !o.material.emissive) return;
        if (k >= 1) {
          if (o.userData.baseEmissive) o.material.emissive.copy(o.userData.baseEmissive);
          o.material.emissiveIntensity = o.userData.baseEmissiveI != null ? o.userData.baseEmissiveI : 1;
        } else {
          o.material.emissive.copy(fxGlow.color);
          o.material.emissiveIntensity = e;
        }
      });
      if (k >= 1) {
        fxGlow = null;
        if (highlightId) highlight(highlightId);
      }
    }
    return fxList.length > 0 || !!fxGlow;
  }

  // ---------- 写真モード(パストレーシング) ----------
  // 光の通り道を1画素ずつ何百回もたどって、映り込み・柔らかい影・まわりからの照り返しを計算する。
  // 動かしている間はふつうの表示、止めると少しずつ写真のようにきれいになる。
  const photo = { on: false, loading: null, pt: null, mat: null, quad: null, gen: null, dirty: true, still: 0, last: null, onStatus: null, error: "" };
  const PHOTO_MAX = 600; // ここまで重ねたら止める(電池を使いすぎないように)
  // 画質の段階: tiles = 1回に描く範囲の分け方、scale = 解像度、bounces = 光の跳ね返りの回数、tex = 模様の細かさ
  const PHOTO_LEVELS = [
    { tiles: 2, scale: 1, bounces: 5, tex: 1024, glossy: 0.4 },
    { tiles: 4, scale: 0.6, bounces: 3, tex: 512, glossy: 0.7 },
    { tiles: 6, scale: 0.4, bounces: 2, tex: 256, glossy: 1 },
  ];
  try {
    photo.level = Math.min(PHOTO_LEVELS.length - 1, +localStorage.getItem("cycling_photo_level") || 0);
  } catch (e) {}

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.onload = resolve;
      el.onerror = () => reject(new Error("load " + src));
      document.head.appendChild(el);
    });
  }

  // 工房の景色を、明るさの幅がある(照明がとても明るい)データにする
  function hdrEnv() {
    const THREE = T();
    const W = 1024, H = 512;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    g.drawImage(envCanvas, 0, 0, W, H);
    const src = g.getImageData(0, 0, W, H).data;
    const f = new Float32Array(W * H * 4);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4, o = ((H - 1 - y) * W + x) * 4; // 上下を合わせる
        const r = src[i] / 255, gg = src[i + 1] / 255, b = src[i + 2] / 255;
        const lum = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
        const boost = lum > 0.9 ? 14 : lum > 0.75 ? 3 : 1; // ライト・窓はとても明るい
        f[o] = Math.pow(r, 2.2) * boost;
        f[o + 1] = Math.pow(gg, 2.2) * boost;
        f[o + 2] = Math.pow(b, 2.2) * boost;
        f[o + 3] = 1;
      }
    }
    const tex = new THREE.DataTexture(f, W, H, THREE.RGBAFormat, THREE.FloatType);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  async function initPhoto() {
    const THREE = T();
    const v = (document.querySelector('script[src*="view3d.js"]') || {}).src || "";
    const q = (v.match(/\?v=[^&]+/) || [""])[0];
    await loadScript("js/vendor/three-extras.js" + q);
    await loadScript("js/vendor/three-mesh-bvh-0.5.24.js" + q);
    await loadScript("js/vendor/three-gpu-pathtracer-0.0.16.js" + q);
    const P = window.ThreePathTracer;
    // 写真モード専用の描画先(重すぎてGPUが止まっても、ふつうの3D表示は止まらないように分ける)
    const r2 = new THREE.WebGLRenderer({ antialias: false });
    if (!r2.capabilities.isWebGL2) throw new Error("webgl2");
    r2.outputEncoding = renderer.outputEncoding;
    r2.toneMapping = renderer.toneMapping;
    r2.toneMappingExposure = renderer.toneMappingExposure;
    r2.setPixelRatio(1);
    const cv = r2.domElement;
    cv.className = "g-photo-canvas";
    Object.assign(cv.style, { position: "absolute", left: "0", top: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "1", display: "none" });
    container.appendChild(cv);
    cv.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      cv.style.display = "none";
      // 重すぎてGPUが止まったら、もっと軽い設定で自動でやり直す
      const lv = (photo.level || 0) + 1;
      try {
        cv.remove();
      } catch (err) {}
      Object.assign(photo, { pt: null, mat: null, quad: null, gen: null, r2: null, checked: false });
      if (lv <= PHOTO_LEVELS.length - 1) {
        photo.level = lv;
        try {
          localStorage.setItem("cycling_photo_level", String(lv));
        } catch (err) {}
        photoStatus({ retry: lv });
        if (photo.on) setTimeout(() => photo.on && setPhotoreal(true), 600);
        return;
      }
      photo.broken = true;
      startHQ();
    });
    photo.r2 = r2;
    const mat = new P.PhysicalPathTracingMaterial();
    const pt = new P.PathTracingRenderer(r2);
    pt.camera = camera;
    pt.material = mat;
    // 画質の段階(重すぎて止まったら次の段階へ)。スマホは1回に描く範囲を小さくして、GPUが止まらないようにする
    const small = Math.min(window.innerWidth, window.innerHeight) < 600;
    const L = PHOTO_LEVELS[photo.level || 0];
    pt.tiles.set(L.tiles + (small ? 1 : 0), L.tiles + (small ? 1 : 0));
    photo.scale = L.scale * (small ? 0.8 : 1);
    photo.texSize = L.tex;
    mat.bounces = L.bounces;
    mat.filterGlossyFactor = L.glossy; // 細かいざらつきを抑える
    mat.envMapInfo.updateFrom(hdrEnv());
    mat.environmentIntensity = 1.6;
    const quad = new THREE.FullScreenQuad(
      P.DenoiseMaterial
        ? new P.DenoiseMaterial({ map: pt.target.texture, blending: THREE.CustomBlending, premultipliedAlpha: r2.getContextAttributes().premultipliedAlpha })
        : new THREE.MeshBasicMaterial({ map: pt.target.texture })
    );
    if (quad.material.sigma != null) Object.assign(quad.material, { sigma: 2.5, threshold: 0.05, kSigma: 1.0 });
    Object.assign(photo, { pt, mat, quad, gen: new P.PathTracingSceneGenerator() });
    sizePhoto();
  }

  function sizePhoto() {
    if (!photo.pt) return;
    const v = renderer.getDrawingBufferSize(new (T().Vector2)());
    const w = Math.round(v.x * (photo.scale || 1)), h = Math.round(v.y * (photo.scale || 1));
    photo.r2.setSize(w, h, false);
    photo.pt.setSize(w, h);
  }

  // 面積がほぼ0の三角形(球の極・円すいの先など)を取り除く。光の計算で当たり判定が乱れるため
  function dropDegenerate(g) {
    const THREE = T();
    const P = g.attributes.position.array, N = g.attributes.normal.array, U = g.attributes.uv.array;
    const n = P.length / 9;
    const keep = [];
    for (let t = 0; t < n; t++) {
      const i = t * 9;
      const ax = P[i + 3] - P[i], ay = P[i + 4] - P[i + 1], az = P[i + 5] - P[i + 2];
      const bx = P[i + 6] - P[i], by = P[i + 7] - P[i + 1], bz = P[i + 8] - P[i + 2];
      const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
      if (cx * cx + cy * cy + cz * cz > 1e-16) keep.push(t);
    }
    if (keep.length === n || g.groups.length) return g;
    const p2 = new Float32Array(keep.length * 9), n2 = new Float32Array(keep.length * 9), u2 = new Float32Array(keep.length * 6);
    keep.forEach((t, k) => {
      p2.set(P.subarray(t * 9, t * 9 + 9), k * 9);
      n2.set(N.subarray(t * 9, t * 9 + 9), k * 9);
      u2.set(U.subarray(t * 6, t * 6 + 6), k * 6);
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.BufferAttribute(p2, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(n2, 3));
    out.setAttribute("uv", new THREE.BufferAttribute(u2, 2));
    g.dispose();
    return out;
  }

  // 細長い三角形(長いパイプの側面など)が多いと、写真モードの当たり判定が途中で打ち切られ、黒い影やすじが出る。
  // 形の作り方(パラメータ)がわかる形は、細かく区切って作り直す(すき間ができないように、割るのではなく作り直す)
  // scaleLen: インスタンスなどで縦に伸ばしている倍率
  function densify(geo, scaleLen = 1, scaleRad = 1) {
    const THREE = T();
    const p = geo.parameters;
    if (!p) return null;
    const seg = (len, cell, cap) => Math.min(cap, Math.max(1, Math.ceil(len / Math.max(cell, 1e-4))));
    let g = null;
    if (geo.type === "CylinderGeometry") {
      const r = Math.max(p.radiusTop, p.radiusBottom);
      const cell = ((2 * Math.PI * r * scaleRad) / p.radialSegments) * 1.5;
      const hs = seg(p.height * scaleLen, cell, 120);
      if (hs <= p.heightSegments) return null;
      g = new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments, hs, p.openEnded, p.thetaStart, p.thetaLength);
    } else if (geo.type === "BoxGeometry") {
      const m = Math.min(p.width, p.height, p.depth) * 1.5;
      const ws = seg(p.width, m, 40), hs = seg(p.height, m, 40), ds = seg(p.depth, m, 40);
      if (ws <= p.widthSegments && hs <= p.heightSegments && ds <= p.depthSegments) return null;
      g = new THREE.BoxGeometry(p.width, p.height, p.depth, ws, hs, ds);
    } else if (geo.type === "TorusGeometry") {
      const cell = ((2 * Math.PI * p.tube) / p.radialSegments) * 1.5;
      const ts = seg(p.arc * p.radius, cell, 720);
      if (ts <= p.tubularSegments) return null;
      g = new THREE.TorusGeometry(p.radius, p.tube, p.radialSegments, ts, p.arc);
    } else if (geo.type === "LatheGeometry") {
      // 断面の線を細かく区切り直し、回す方向もそれに合わせて区切る(ボトル・リムなど)
      let maxR = 0;
      for (const q of p.points) maxR = Math.max(maxR, q.x);
      const around = (p.phiLength * maxR) / Math.max(p.segments, 24);
      const step = Math.max(0.002, around);
      const pts = [];
      for (let i = 0; i < p.points.length; i++) {
        const a = p.points[i];
        if (i === 0) {
          pts.push(a.clone());
          continue;
        }
        const b = p.points[i - 1];
        const n = Math.max(1, Math.ceil(a.distanceTo(b) / (step * 1.5)));
        for (let k = 1; k <= n; k++) pts.push(new THREE.Vector2().lerpVectors(b, a, k / n));
      }
      const ss = Math.max(p.segments, Math.min(720, Math.ceil((p.phiLength * maxR) / step)));
      if (pts.length <= p.points.length && ss <= p.segments) return null;
      g = new THREE.LatheGeometry(pts, ss, p.phiStart, p.phiLength);
    } else if (geo.type === "TubeGeometry") {
      const cell = ((2 * Math.PI * p.radius) / p.radialSegments) * 1.5;
      const ts = seg(p.path.getLength(), cell, 1500);
      if (ts <= p.tubularSegments) return null;
      g = new THREE.TubeGeometry(p.path, ts, p.radius, p.radialSegments, p.closed);
    } else if (geo.type === "PlaneGeometry") {
      const m = Math.min(p.width / p.widthSegments, p.height / p.heightSegments);
      const ws = seg(p.width, m, 64), hs = seg(p.height, m, 64);
      if (ws <= p.widthSegments && hs <= p.heightSegments) return null;
      g = new THREE.PlaneGeometry(p.width, p.height, ws, hs);
    }
    if (!g) return null;
    if (geo.userData.flat) g.scale(1, 1, geo.userData.flat);
    // 写真を貼った形(uvを計算し直したもの)は作り直すと貼り方が変わるので、作り直さない
    return g;
  }

  // 場面を光の計算用に組み直す(パーツや写真が変わったとき)。
  // 見えている形をすべて「置き場所・向き・拡大を形そのものに焼き込んだ」複製にしてから渡す
  // (縦横で拡大率が違う物や、同じ形をたくさん並べた物も、そのまま正しく計算できるように)
  function rebuildPhoto() {
    const THREE = T();
    scene.updateMatrixWorld(true);
    const temp = new THREE.Group();
    const made = [];
    const lights = [];
    const hg = highlightId && groups[highlightId === "tubes" ? "tires" : highlightId];
    const lit = new Set();
    if (hg) hg.traverse((o) => o.isMesh && lit.add(o));
    const mi = new THREE.Matrix4(), mw = new THREE.Matrix4();
    // 形の縦(y)方向の伸び(スポークのように、長さ1の形を引き伸ばして使っているとき)
    const scaleLen = (o, matrix) => new THREE.Vector3().setFromMatrixColumn(matrix, 1).length();
    const bake = (o, matrix) => {
      // 細長い三角形を減らすため、作り直せる形は細かく作り直す(写真を貼った形はそのまま)
      const sx = new THREE.Vector3().setFromMatrixColumn(matrix, 0).length();
      const dense = o.userData.projected ? null : densify(o.geometry, scaleLen(o, matrix), sx);
      const src = dense || o.geometry;
      // 頂点の番号つき・なしが混ざると、まとめるときに別の物どうしがつながってしまうので、すべて番号なしにそろえる
      let g = src.index ? src.toNonIndexed() : src.clone();
      if (dense) dense.dispose();
      for (const k of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(k)) g.deleteAttribute(k);
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      if (!Array.isArray(o.material)) g.clearGroups(); // 円柱のふたなどの面グループ(ない材質を見に行かないように)
      g.applyMatrix4(matrix);
      g = dropDegenerate(g);
      made.push(g);
      let m = o.material;
      // 光らせている部位は、写真モードでは光らせない
      if (lit.has(o) && m.emissive) {
        m = m.clone();
        if (o.userData.baseEmissive) m.emissive.copy(o.userData.baseEmissive);
        m.emissiveIntensity = o.userData.baseEmissiveI != null ? o.userData.baseEmissiveI : 1;
      }
      temp.add(new THREE.Mesh(g, m));
    };
    scene.traverseVisible((o) => {
      if (o.isInstancedMesh) {
        for (let i = 0; i < o.count; i++) {
          o.getMatrixAt(i, mi);
          bake(o, mw.multiplyMatrices(o.matrixWorld, mi));
        }
      } else if (o.isMesh) bake(o, o.matrixWorld);
      else if ((o.isDirectionalLight || o.isSpotLight || o.isPointLight)) lights.push(o);
    });
    // 撮影スタジオのような大きなソフトボックス(写真モードの計算だけで使う光)
    for (const [x, y, z, w, h, i] of [[0.3, 2.6, 0.9, 2.4, 1.2, 9], [-1.6, 1.6, 1.6, 1.2, 1.4, 4], [1.8, 1.4, 1.4, 0.9, 1.2, 3]]) {
      const l = new THREE.RectAreaLight(0xfff6ec, i, w, h);
      l.position.set(x, y, z);
      l.lookAt(0.2, 0.5, 0);
      temp.add(l);
    }
    temp.updateMatrixWorld(true);
    try {
      const { bvh, textures, materials, lights: ls } = photo.gen.generate([temp, ...lights]);
      const geo = bvh.geometry;
      const m = photo.mat;
      m.bvh.updateFrom(bvh);
      m.attributesArray.updateFrom(geo.attributes.normal, geo.attributes.tangent, geo.attributes.uv, geo.attributes.color);
      m.materialIndexAttribute.updateFrom(geo.attributes.materialIndex);
      m.textures.setTextures(photo.r2, photo.texSize || 1024, photo.texSize || 1024, textures);
      m.materials.updateFrom(materials, textures);
      m.lights.updateFrom(ls);
    } finally {
      for (const g of made) g.dispose();
    }
    photo.pt.reset();
    photo.checked = false;
  }


  function photoStatus(extra) {
    if (photo.onStatus) photo.onStatus(Object.assign({ on: photo.on, hq: !!photo.hq, samples: photo.pt ? Math.floor(photo.pt.samples) : 0, max: PHOTO_MAX, loading: !!photo.loading, error: photo.error }, extra || {}));
  }

  // 写真モードを入れる・切る。onStatus({ on, samples, loading, error, moving })
  function setPhotoreal(on, onStatus) {
    photo.on = on;
    if (onStatus) photo.onStatus = onStatus;
    photo.error = "";
    if (on && photo.broken) return startHQ();
    if (!on) setHQ(false);
    if (on && !photo.pt && !photo.loading) {
      photo.loading = initPhoto()
        .catch((e) => {
          photo.on = false;
          photo.error = /webgl2/.test(e.message) ? "この端末では写真モードを使えません(WebGL2が必要です)" : "写真モードを読み込めませんでした";
        })
        .finally(() => {
          photo.loading = null;
          photo.dirty = true;
          photoStatus();
        });
    }
    if (on) {
      anim.pedaling = false;
      photo.dirty = true;
    }
    photoStatus();
  }

  // 光の計算(パストレーシング)が重すぎる端末では、ふつうの描き方を高画質にする:
  // 止まっている間は2〜3倍の解像度で描いて縮め、影も細かくする
  const baseRatio = () => Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));
  function setHQ(on) {
    photo.hq = on;
    if (keyLight) {
      const size = on ? 4096 : 2048;
      if (keyLight.shadow.mapSize.x !== size) {
        keyLight.shadow.mapSize.set(size, size);
        keyLight.shadow.radius = on ? 6 : 4;
        if (keyLight.shadow.map) keyLight.shadow.map.dispose(), (keyLight.shadow.map = null);
      }
    }
    if (!on && renderer && renderer.getPixelRatio() !== baseRatio()) renderer.setPixelRatio(baseRatio()), resize();
  }
  function startHQ() {
    photo.on = true;
    setHQ(true);
    photoStatus({ hq: true });
  }

  // 写真モードで描く。動いている間は false を返す(ふつうに描く)
  function renderPhoto(moving) {
    if (photo.on && photo.hq) {
      const want = moving ? baseRatio() : Math.min(3, baseRatio() * 1.6);
      if (renderer.getPixelRatio() !== want) renderer.setPixelRatio(want), resize();
      return false;
    }
    const cv = photo.r2 && photo.r2.domElement;
    if (!photo.on || !photo.pt) {
      if (cv) cv.style.display = "none";
      return false;
    }
    if (moving) {
      cv.style.display = "none";
      photo.still = 0;
      photo.pt.reset();
      if (photo.reported !== -1) (photo.reported = -1), photoStatus({ moving: true });
      return false;
    }
    photo.still++;
    if (photo.still < 4) {
      cv.style.display = "none";
      return false; // 止まってから少し待つ
    }
    if (photo.dirty) {
      photo.dirty = false;
      try {
        rebuildPhoto();
      } catch (e) {
        console.warn("photo rebuild", e);
        photo.on = false;
        photo.error = "写真モードで描けませんでした";
        photoStatus();
        return false;
      }
    }
    if (photo.pt.samples < PHOTO_MAX) {
      camera.updateMatrixWorld();
      photo.pt.update();
      // 最初の数回で、ちゃんと描けているか確かめる(描けない端末では、ふつうの表示に戻す)
      if (!photo.checked && photo.pt.samples >= 2) {
        photo.checked = true;
        const px = new Float32Array(4);
        const t = photo.pt.target;
        photo.r2.readRenderTargetPixels(t, t.width >> 1, t.height >> 1, 1, 1, px);
        if (!(px[3] > 0)) {
          photo.broken = true;
          cv.style.display = "none";
          startHQ();
          return false;
        }
      }
    }
    photo.quad.material.map = photo.pt.target.texture;
    photo.quad.render(photo.r2);
    cv.style.display = "block";
    const n = Math.floor(photo.pt.samples);
    if (n !== photo.reported && (n < 8 || n % 4 === 0 || n >= PHOTO_MAX)) (photo.reported = n), photoStatus();
    return true;
  }

  // ---------- 毎フレーム ----------
  function loop() {
    raf = requestAnimationFrame(loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    // 店員さん: ゆっくり揺れる・手を振る
    if (clerkGroup && !photo.on) {
      clerkGroup.position.y = Math.sin(now / 900) * 0.004;
      if (clerkWave > 0) {
        clerkWave -= dt;
        clerkArm.rotation.z = 2.6 + Math.sin(now / 120) * 0.35;
      } else clerkArm.rotation.z += (0.08 - clerkArm.rotation.z) * Math.min(1, dt * 6);
    }
    if (!state) return renderer.render(scene, camera);
    const THREE = T();
    // 部品が動いている間は、止まってから光の計算用に組み直す
    let moving = (anim.flow && anim.rider) || anim.pedaling || clerkWave > 0 || Object.keys(mountAnim).length > 0 || Math.abs(anim.explodeTarget - anim.exploded) > 0.002;
    if (moving) photo.dirty = true;
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
    const fxOn = updateFx(dt);
    if (fxOn) moving = true;
    if (highlightId && !photo.on && !fxGlow) {
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
    // カメラが動いたか
    const key = [camera.position.x, camera.position.y, camera.position.z, cam.target.x, cam.target.y, cam.target.z].map((x) => x.toFixed(4)).join(",");
    if (key !== photo.last) (photo.last = key), (moving = true);
    if (renderPhoto(moving)) return;
    renderer.render(scene, camera);
  }

  function dispose() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    if (renderer) renderer.dispose();
  }

  return { equipFx, setPhotoreal, onClerk, waveClerk, create, setModel, setRider, setFlow, setPedaling, setExploded, highlight, clearHighlight, animateMount, setView, resize, dispose };
})();

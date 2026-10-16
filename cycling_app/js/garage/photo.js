// 写真で測る: 写真の上で関節などをタップして、体の寸法や乗っているときの関節の角度を測る。
// 専門店の2Dフィッティング(横から撮った写真・動画で角度を測る)と同じ考え方。写真は保存しない。

const Measure = (() => {
  // ---------- タップする点 ----------
  const MODES = {
    standing: {
      title: "立った写真で体の寸法を測る",
      tips: [
        "真横を向いて、まっすぐ立った全身の写真を使います",
        "撮る人は2〜3m離れて、腰の高さから水平に撮ってください",
        "体にぴったりした服だと、関節の位置が正確になります",
      ],
      points: [
        { k: "head", label: "頭のてっぺん" },
        { k: "heel", label: "かかと(床)" },
        { k: "shoulder", label: "肩先(肩のいちばん外側の骨)" },
        { k: "elbow", label: "肘(関節の中心)" },
        { k: "wrist", label: "手首(関節の中心)" },
        { k: "hip", label: "股関節(太ももの付け根の出っ張った骨)" },
        { k: "knee", label: "膝(関節の中心)" },
        { k: "ankle", label: "くるぶし" },
        { k: "crotch", label: "股(股下の位置)" },
      ],
      bones: [["head", "shoulder"], ["shoulder", "elbow"], ["elbow", "wrist"], ["shoulder", "hip"], ["hip", "knee"], ["knee", "ankle"], ["ankle", "heel"]],
    },
    riding: {
      title: "乗っている写真で関節の角度を測る",
      tips: [
        "バイクに乗った姿を真横(ドライブ側)から撮った写真を使います",
        "ペダルを一番下(6時)にした写真なら、膝の伸びも測れます",
        "ローラー台か、壁に手をついて止まった状態で、いつものハンドルの持ち方をしてください",
      ],
      points: [
        { k: "rearAxle", label: "後輪の軸(ハブの中心)" },
        { k: "frontAxle", label: "前輪の軸(ハブの中心)" },
        { k: "shoulder", label: "肩先" },
        { k: "elbow", label: "肘" },
        { k: "wrist", label: "手首" },
        { k: "hip", label: "股関節(太ももの付け根の出っ張った骨)" },
        { k: "knee", label: "膝" },
        { k: "ankle", label: "くるぶし" },
      ],
      bones: [["rearAxle", "frontAxle"], ["shoulder", "elbow"], ["elbow", "wrist"], ["shoulder", "hip"], ["hip", "knee"], ["knee", "ankle"]],
    },
    // 3Dに写真を貼るための位置合わせ(タップした点をそのまま返す)
    frameAlign: {
      title: "フレームの写真を3Dに貼る",
      raw: true,
      tips: [],
      points: [
        { k: "rearAxle", label: "後輪の軸(リアエンドの中心)" },
        { k: "bb", label: "BBの中心(クランクの軸)" },
        { k: "htTop", label: "ヘッドチューブの上端(前側)" },
      ],
      bones: [["rearAxle", "bb"], ["bb", "htTop"]],
    },
    wheelAlign: {
      title: "ホイールの写真を3Dに貼る",
      raw: true,
      tips: [],
      points: [
        { k: "hub", label: "ハブの中心(軸)" },
        { k: "rimEdge", label: "リムの外側の縁(タイヤとの境目)" },
      ],
      bones: [["hub", "rimEdge"]],
    },
    saddleAlign: {
      title: "サドルの写真を3Dに貼る",
      raw: true,
      tips: [],
      points: [
        { k: "nose", label: "サドルの先端(いちばん前)" },
        { k: "tail", label: "サドルの後ろの端(真ん中)" },
      ],
      bones: [["nose", "tail"]],
    },
    barAlign: {
      title: "ハンドルの写真を3Dに貼る",
      raw: true,
      tips: [],
      points: [
        { k: "barL", label: "写真の左側のドロップの下の端" },
        { k: "barR", label: "写真の右側のドロップの下の端" },
      ],
      bones: [["barL", "barR"]],
    },
  };

  // 3点の対応から、バイクの座標(x右・y上、m)→写真のピクセルへの変換(アフィン変換)を求める
  // 戻り値: [a, b, c, d, e, f]  px = a*x + b*y + c, py = d*x + e*y + f
  function affine3(src, dst) {
    const [p, q, r] = src;
    const det = p.x * (q.y - r.y) - p.y * (q.x - r.x) + (q.x * r.y - r.x * q.y);
    if (Math.abs(det) < 1e-12) return null;
    const solve = (u) => {
      const a = (u[0] * (q.y - r.y) - p.y * (u[1] - u[2]) + (u[1] * r.y - u[2] * q.y)) / det;
      const b = (p.x * (u[1] - u[2]) - u[0] * (q.x - r.x) + (q.x * u[2] - r.x * u[1])) / det;
      const c = (p.x * (q.y * u[2] - r.y * u[1]) - p.y * (q.x * u[2] - r.x * u[1]) + u[0] * (q.x * r.y - r.x * q.y)) / det;
      return [a, b, c];
    };
    const X = solve(dst.map((d) => d.x));
    const Y = solve(dst.map((d) => d.y));
    return [...X, ...Y];
  }

  // ---------- 計算 ----------
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  // b での角度(度)
  function angleAt(a, b, c) {
    const ux = a.x - b.x, uy = a.y - b.y, wx = c.x - b.x, wy = c.y - b.y;
    const cos = (ux * wx + uy * wy) / (Math.hypot(ux, uy) * Math.hypot(wx, wy));
    return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  }

  // 立った写真: 身長(m)を基準に各部の長さ(m)を出す。点は画像のピクセル座標(yは下向き)
  function standing(p, heightM) {
    const px = Math.abs(p.heel.y - p.head.y);
    const k = heightM / px; // 1ピクセルの長さ(m)
    const upper = dist(p.shoulder, p.elbow) * k;
    const fore = dist(p.elbow, p.wrist) * k;
    return {
      inseam: Math.abs(p.heel.y - p.crotch.y) * k,
      thighLen: dist(p.hip, p.knee) * k,
      shankLen: dist(p.knee, p.ankle) * k,
      upperArmLen: upper,
      forearmLen: fore,
      arm: upper + fore,
      torsoLen: dist(p.hip, p.shoulder) * k,
    };
  }

  // 乗った写真: 前後の車軸を結んだ線を水平として、関節の角度(度)を出す
  function riding(p) {
    const level = Math.atan2(p.frontAxle.y - p.rearAxle.y, p.frontAxle.x - p.rearAxle.x); // 写真の傾き
    const facingRight = p.frontAxle.x > p.rearAxle.x;
    // 胴の角度: 股関節から肩への向きを、車軸の線に対して測る(上が正)
    const ang = Math.atan2(p.shoulder.y - p.hip.y, p.shoulder.x - p.hip.x) - level;
    // 画像は y が下向き。右向きの写真は上が負、左向き(反転)の写真は回したあと上が正になる
    let torso = ((facingRight ? -ang : ang) * 180) / Math.PI;
    torso = ((torso % 360) + 360) % 360;
    if (torso > 180) torso -= 360;
    return {
      knee: angleAt(p.hip, p.knee, p.ankle),
      hip: angleAt(p.shoulder, p.hip, p.knee),
      torso,
      shoulder: angleAt(p.hip, p.shoulder, p.elbow),
      elbow: 180 - angleAt(p.shoulder, p.elbow, p.wrist), // 肘の曲げ(0 = まっすぐ)
      tilt: (level * 180) / Math.PI * (facingRight ? 1 : -1),
    };
  }

  // ---------- 画面(全画面で写真の上をタップする) ----------
  let ui = null;

  function open(mode, opts = {}) {
    close();
    const M = MODES[mode];
    ui = { mode, M, pts: {}, img: null, scale: 1, drag: null, opts };
    const root = document.createElement("div");
    root.className = "ms";
    root.innerHTML = `
      <div class="ms-head"><strong>${M.title}</strong><button class="ms-x" data-ms="close">✕</button></div>
      <div class="ms-body" id="ms-body">
        <div class="ms-intro">
          <ul>${M.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
          <label class="btn start ms-pick">📷 写真を選ぶ<input type="file" accept="image/*" id="ms-file" hidden /></label>
          <p class="muted small">写真はこの画面で測るだけで、保存も送信もしません。</p>
        </div>
      </div>
      <div class="ms-bar" id="ms-bar" hidden>
        <p class="ms-next" id="ms-next"></p>
        <div class="ms-btns">
          <button class="chip" data-ms="undo">↩ 1つ戻す</button>
          <button class="chip" data-ms="reset">やり直す</button>
          <button class="btn start ms-done" data-ms="done" disabled>完了</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    document.body.classList.add("ms-open");
    ui.root = root;
    root.addEventListener("click", onClick);
    root.querySelector("#ms-file").addEventListener("change", onFile);
    if (opts.imageUrl) loadImage(opts.imageUrl, opts.points);
  }

  function close() {
    if (!ui) return;
    ui.root.remove();
    if (ui.url) URL.revokeObjectURL(ui.url);
    document.body.classList.remove("ms-open");
    ui = null;
  }

  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    ui.url = URL.createObjectURL(f);
    loadImage(ui.url);
  }

  // pts: やり直すときの前回の点
  function loadImage(url, pts) {
    const img = new Image();
    img.onload = () => {
      ui.img = img;
      if (pts) ui.pts = JSON.parse(JSON.stringify(pts));
      const body = ui.root.querySelector("#ms-body");
      body.innerHTML = `<canvas id="ms-canvas" class="ms-canvas"></canvas>`;
      ui.canvas = body.querySelector("canvas");
      ui.root.querySelector("#ms-bar").hidden = false;
      layout();
      bindCanvas(ui.canvas);
      draw();
    };
    img.src = url;
  }

  // 写真を画面の幅(と高さ)に収める
  function layout() {
    const body = ui.root.querySelector("#ms-body");
    const w = body.clientWidth || 360;
    const h = Math.max(240, (body.clientHeight || 500) - 4);
    const s = Math.min(w / ui.img.width, h / ui.img.height);
    ui.scale = s;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    ui.canvas.width = Math.round(ui.img.width * s * dpr);
    ui.canvas.height = Math.round(ui.img.height * s * dpr);
    ui.canvas.style.width = Math.round(ui.img.width * s) + "px";
    ui.canvas.style.height = Math.round(ui.img.height * s) + "px";
    ui.dpr = dpr;
  }

  const nextPoint = () => ui.M.points.find((p) => !ui.pts[p.k]);

  function toImage(e) {
    const r = ui.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / ui.scale, y: (e.clientY - r.top) / ui.scale };
  }

  // タップで次の点を置く。置いた点の近くから指を動かしたときだけ、その点を動かす
  // (くるぶしとかかとのように近い点でも、タップなら次の点を置ける)
  function bindCanvas(cv) {
    cv.style.touchAction = "none";
    let down = null; // { p, near, moved }
    cv.addEventListener("pointerdown", (e) => {
      const p = toImage(e);
      const hitR = 24 / ui.scale;
      let near = null;
      for (const [k, q] of Object.entries(ui.pts)) {
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d < hitR && (!near || d < near.d)) near = { k, d };
      }
      cv.setPointerCapture(e.pointerId);
      down = { p, near: near && near.k, moved: false, sx: e.clientX, sy: e.clientY };
      if (!near) {
        // 何もない所: すぐに次の点を置き、そのままドラッグで微調整できる
        const n = nextPoint();
        if (n) {
          ui.pts[n.k] = p;
          ui.drag = n.k;
        }
      }
      ui.lens = p;
      draw();
    });
    cv.addEventListener("pointermove", (e) => {
      if (!down) return;
      if (!down.moved && Math.hypot(e.clientX - down.sx, e.clientY - down.sy) > 6) {
        down.moved = true;
        if (down.near) ui.drag = down.near;
      }
      if (!ui.drag) return;
      ui.pts[ui.drag] = toImage(e);
      ui.lens = ui.pts[ui.drag];
      draw();
    });
    const up = () => {
      // 置いた点の近くをタップしただけなら、次の点を置く
      if (down && down.near && !down.moved) {
        const n = nextPoint();
        if (n) ui.pts[n.k] = down.p;
      }
      down = null;
      ui.drag = null;
      ui.lens = null;
      draw();
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
  }

  function draw() {
    const g = ui.canvas.getContext("2d");
    const s = ui.scale * ui.dpr;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(ui.img, 0, 0, ui.canvas.width, ui.canvas.height);
    g.setTransform(s, 0, 0, s, 0, 0);
    const u = ui.dpr / s; // 画面上の1px(CSSピクセル)を写真の座標に直す倍率
    const lw = 3 * u;
    // 骨の線
    g.strokeStyle = "rgba(91,155,255,0.95)";
    g.lineWidth = lw;
    for (const [a, b] of ui.M.bones) {
      if (!ui.pts[a] || !ui.pts[b]) continue;
      g.beginPath();
      g.moveTo(ui.pts[a].x, ui.pts[a].y);
      g.lineTo(ui.pts[b].x, ui.pts[b].y);
      g.stroke();
    }
    // 位置合わせ: 3Dのフレームの線を写真に重ねて、合っているか確かめられるようにする
    if (ui.mode === "frameAlign" && ui.opts.outline && ui.pts.rearAxle && ui.pts.bb && ui.pts.htTop) {
      const A = ui.opts.anchors;
      const m = affine3([A.rearAxle, A.bb, A.htTop], [ui.pts.rearAxle, ui.pts.bb, ui.pts.htTop]);
      if (m) {
        const tp = (q) => [m[0] * q.x + m[1] * q.y + m[2], m[3] * q.x + m[4] * q.y + m[5]];
        g.strokeStyle = "rgba(255,204,0,0.9)";
        g.lineWidth = 2 * u;
        g.setLineDash([6 * u, 4 * u]);
        for (const [a, b] of ui.opts.outline) {
          g.beginPath();
          g.moveTo(...tp(a));
          g.lineTo(...tp(b));
          g.stroke();
        }
        for (const c of ui.opts.circles || []) {
          const [cx, cy] = tp(c);
          const [ex] = tp({ x: c.x + c.r, y: c.y });
          g.beginPath();
          g.arc(cx, cy, Math.abs(ex - cx), 0, Math.PI * 2);
          g.stroke();
        }
        g.setLineDash([]);
      }
    }
    if (ui.mode === "wheelAlign" && ui.pts.hub && ui.pts.rimEdge) {
      g.strokeStyle = "rgba(255,204,0,0.9)";
      g.lineWidth = 2 * u;
      g.beginPath();
      g.arc(ui.pts.hub.x, ui.pts.hub.y, Math.hypot(ui.pts.rimEdge.x - ui.pts.hub.x, ui.pts.rimEdge.y - ui.pts.hub.y), 0, Math.PI * 2);
      g.stroke();
    }
    // 点と番号
    ui.M.points.forEach((pt, i) => {
      const q = ui.pts[pt.k];
      if (!q) return;
      g.fillStyle = ui.drag === pt.k ? "#ffcc00" : "#e11d48";
      g.beginPath();
      g.arc(q.x, q.y, 7 * u, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#fff";
      g.lineWidth = 2 * u;
      g.stroke();
      g.fillStyle = "#fff";
      g.font = `${12 * u}px sans-serif`;
      g.fillText(String(i + 1), q.x + 9 * u, q.y - 9 * u);
    });
    // 指の下が見えるように、ドラッグ中は拡大鏡を出す
    if (ui.lens) {
      const L = 70 * u, Z = 2.5;
      const cx = ui.lens.x, cy = ui.lens.y - 110 * u;
      g.save();
      g.beginPath();
      g.arc(cx, cy, L, 0, Math.PI * 2);
      g.clip();
      g.drawImage(ui.img, ui.lens.x - L / Z, ui.lens.y - L / Z, (2 * L) / Z, (2 * L) / Z, cx - L, cy - L, 2 * L, 2 * L);
      g.strokeStyle = "#ffcc00";
      g.lineWidth = 1.5 * u;
      g.beginPath();
      g.moveTo(cx - 10 * u, cy);
      g.lineTo(cx + 10 * u, cy);
      g.moveTo(cx, cy - 10 * u);
      g.lineTo(cx, cy + 10 * u);
      g.stroke();
      g.restore();
      g.strokeStyle = "#fff";
      g.lineWidth = 2 * u;
      g.beginPath();
      g.arc(cx, cy, L, 0, Math.PI * 2);
      g.stroke();
    }
    const n = nextPoint();
    const idx = n ? ui.M.points.indexOf(n) + 1 : ui.M.points.length;
    ui.root.querySelector("#ms-next").innerHTML = n
      ? `<b>${idx}/${ui.M.points.length}</b> ${n.label} をタップ`
      : `<b>すべて置きました</b> 点はドラッグで直せます`;
    ui.root.querySelector('[data-ms="done"]').disabled = !!n;
  }

  function onClick(e) {
    const b = e.target.closest("[data-ms]");
    if (!b) return;
    const k = b.dataset.ms;
    if (k === "close") return close();
    if (k === "undo") {
      const placed = ui.M.points.filter((p) => ui.pts[p.k]);
      if (placed.length) delete ui.pts[placed[placed.length - 1].k];
      return draw();
    }
    if (k === "reset") {
      ui.pts = {};
      return draw();
    }
    if (k === "done") {
      const res = ui.M.raw
        ? { pts: JSON.parse(JSON.stringify(ui.pts)), w: ui.img.width, h: ui.img.height }
        : ui.mode === "standing"
        ? standing(ui.pts, ui.opts.height || 1.72)
        : riding(ui.pts);
      const cb = ui.opts.onDone;
      close();
      if (cb) cb(res);
    }
  }

  return { MODES, open, close, standing, riding, affine3 };
})();

if (typeof module !== "undefined") module.exports = Measure;

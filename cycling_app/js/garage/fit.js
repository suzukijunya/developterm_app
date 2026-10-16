// バイクの寸法(ジオメトリ)とライダーの体から、3Dの姿勢・関節角度・前面投影面積・空気抵抗を計算する。
// 座標: x = 前、y = 上、z = 右。単位はメートル。原点はBB(クランクの軸)の中心。
// 画面やブラウザAPIには依存しない(テストで直接呼べるようにするため)。

const Fit = (() => {
  const RAD = Math.PI / 180;
  const v = (x, y, z = 0) => ({ x, y, z });
  const add = (a, b) => v(a.x + b.x, a.y + b.y, a.z + b.z);
  const sub = (a, b) => v(a.x - b.x, a.y - b.y, a.z - b.z);
  const mul = (a, k) => v(a.x * k, a.y * k, a.z * k);
  const len = (a) => Math.hypot(a.x, a.y, a.z);
  const withZ = (a, z) => v(a.x, a.y, z);

  // ---------- 初期値 ----------
  // 一般的なロードバイク(Mサイズ相当)のジオメトリ
  const DEFAULT_GEO = {
    stack: 0.57, // BBからヘッドチューブ上端までの高さ
    reach: 0.39, // BBからヘッドチューブ上端までの水平距離
    headAngle: 73, // ヘッド角(度)
    headTube: 0.15, // ヘッドチューブ長
    seatAngle: 73.5, // シート角(度)
    seatTube: 0.5, // シートチューブ長(BB〜上端)
    chainstay: 0.408,
    bbDrop: 0.07,
    forkOffset: 0.045,
  };

  // ポジション(乗り手が調整できるところ)
  const DEFAULT_POS = {
    saddleHeight: 0.72, // BB中心〜サドル上面(シートチューブ沿い)
    saddleSetback: 0, // サドルの前後位置の調整(+で前、m)
    spacers: 0.02, // コラムスペーサー
    stemLength: 0.1,
    stemAngle: -6, // 度
    barReach: 0.08,
    barDrop: 0.125,
    barWidth: 0.4,
    crank: 0.17,
    hands: "hoods", // hoods / drops / tops
    elbow: 25, // 肘の曲げ(度)
  };

  // 体の寸法。空欄(0)は身長から一般的な比率で求める
  const DEFAULT_BODY = {
    height: 1.72,
    weight: 65,
    inseam: 0, // 股下
    sitting: 0, // 座高
    arm: 0, // 腕の長さ(肩先〜手首)
    shoulder: 0, // 肩幅(肩先〜肩先)
    foot: 0, // 足のサイズ
    flex: "normal", // 前屈: stiff / normal / soft
    backPain: false,
    // 写真で測った各部の長さ(m)。0 は身長などから自動で計算
    thighLen: 0, // 股関節〜膝
    shankLen: 0, // 膝〜くるぶし
    upperArmLen: 0, // 肩〜肘
    forearmLen: 0, // 肘〜手首
    torsoLen: 0, // 股関節〜肩
    // 太さ(周囲の長さ、m)。0 は体重から自動で計算
    thighCirc: 0, // 太もも周り
    calfCirc: 0, // ふくらはぎ周り
    chest: 0, // 胸囲
    waist: 0, // ウエスト
    armCirc: 0, // 二の腕周り
  };

  // 身長などから各部の長さを決める(人体の一般的な比率)
  function segments(body) {
    const H = body.height || 1.72;
    const inseam = body.inseam || 0.47 * H;
    const legScale = inseam / (0.47 * H);
    const armRaw = 0.186 * H + 0.146 * H;
    const armScale = body.arm ? body.arm / armRaw : 1;
    // 体重から太さを決める(BMI 22 を基準)
    const bmi = (body.weight || 22 * H * H) / (H * H);
    const girth = Math.sqrt(bmi / 22);
    const k = girth * (H / 1.72);
    const foot = body.foot || 0.152 * H;
    // 周囲の長さ → 太さ(半径)。測っていなければ体重と身長から
    const rad = (circ, def) => (circ > 0 ? circ / (2 * Math.PI) : def * k);
    const torsoR = body.chest > 0 ? (body.chest / (2 * Math.PI)) * 0.62 : 0.09 * k;
    return {
      H,
      girth,
      thigh: body.thighLen || 0.245 * H * legScale,
      shank: body.shankLen || 0.246 * H * legScale,
      ballToAnkle: Math.hypot(0.5 * foot, 0.04 * H),
      footBase: Math.atan2(0.04 * H, 0.5 * foot),
      foot,
      torso: body.torsoLen || (body.sitting ? Math.max(0.22 * H, body.sitting - 0.24 * H) : 0.29 * H),
      upperArm: body.upperArmLen || 0.186 * H * armScale,
      forearm: (body.forearmLen || 0.146 * H * armScale) + 0.04 * H, // 手首からグリップの中心まで含める
      shoulderHalf: (body.shoulder || 0.23 * H) / 2 - 0.025,
      hipHalf: 0.085 * (H / 1.72),
      neck: 0.1 * H,
      head: 0.115 * (H / 1.72), // ヘルメット込み
      // 各部の太さ(根元 → 先)
      r: {
        thigh: [rad(body.thighCirc, 0.085), rad(body.thighCirc ? body.thighCirc * 0.68 : 0, 0.058)],
        shank: [rad(body.calfCirc, 0.058), rad(body.calfCirc ? body.calfCirc * 0.6 : 0, 0.035)],
        arm: [rad(body.armCirc, 0.047), rad(body.armCirc ? body.armCirc * 0.85 : 0, 0.04)],
        forearm: [0.04 * k, 0.027 * k],
        torso: [body.waist > 0 ? (body.waist / (2 * Math.PI)) * 0.62 : torsoR * 0.92, torsoR],
      },
    };
  }

  // ---------- バイク ----------
  function bike(geo, pos, wheel) {
    const g = Object.assign({}, DEFAULT_GEO, geo);
    const p = Object.assign({}, DEFAULT_POS, pos);
    const R = (wheel && wheel.radius) || 0.338;
    const ha = g.headAngle * RAD;
    const sa = g.seatAngle * RAD;
    const up = v(-Math.cos(ha), Math.sin(ha)); // ヘッドチューブの上向き
    const htTop = v(g.reach, g.stack);
    const htBot = add(htTop, mul(up, -g.headTube));
    // フォーク: ヘッドチューブの延長線から、オフセットだけ前にずらした所に前輪の軸(高さはBBドロップ)
    const fwd = v(Math.sin(ha), Math.cos(ha)); // ヘッドチューブに直角な前向き
    const L = (htBot.y + g.forkOffset * fwd.y - g.bbDrop) / Math.sin(ha);
    const crown = add(htBot, mul(up, -0.03));
    const frontAxle = add(add(htBot, mul(up, -L)), mul(fwd, g.forkOffset));
    const rearAxle = v(-Math.sqrt(g.chainstay ** 2 - g.bbDrop ** 2), g.bbDrop);
    const seatDir = v(-Math.cos(sa), Math.sin(sa));
    const stTop = mul(seatDir, g.seatTube);
    // サドル: シートチューブの延長線上、サドル高の位置(上面)。前後の調整を足す
    const saddleTop = add(mul(seatDir, p.saddleHeight), v(p.saddleSetback, 0));
    // 坐骨が乗るのは、サドル上面のうちシートチューブの延長線より5cmほど後ろ
    const saddle = add(saddleTop, v(-0.05, 0));
    const clamp = add(mul(seatDir, p.saddleHeight - 0.045), v(p.saddleSetback, 0));
    // ステム: コラムスペーサーの上、ステムの中心
    const steerer = add(htTop, mul(up, p.spacers + 0.02));
    const stemDeg = 90 - g.headAngle + p.stemAngle;
    const barClamp = add(steerer, v(Math.cos(stemDeg * RAD) * p.stemLength, Math.sin(stemDeg * RAD) * p.stemLength));
    const hw = p.barWidth / 2;
    const grips = {
      tops: { pt: add(barClamp, v(0.0, 0.0)), z: 0.13 },
      hoods: { pt: add(barClamp, v(p.barReach + 0.02, 0.035)), z: hw - 0.01 },
      drops: { pt: add(barClamp, v(p.barReach * 0.55, -p.barDrop + 0.02)), z: hw + 0.01 },
    };
    // ヘッドチューブとシートチューブの間(トップチューブ・ダウンチューブの付け根)
    const ttFront = add(htTop, mul(up, -0.02));
    const dtFront = add(htBot, mul(up, 0.03));
    return { g, p, R, ha, sa, up, fwd, htTop, htBot, crown, frontAxle, rearAxle, seatDir, stTop, saddle, saddleTop, clamp, steerer, barClamp, grips, ttFront, dtFront };
  }

  // ---------- ライダーの姿勢(逆運動学) ----------
  // 2本の骨(長さ a, b)で根元 A から先 C に届くとき、関節の位置(2D、x-y平面)。bendSign で曲がる向きを選ぶ
  function twoBone(A, C, a, b, bendSign) {
    const dx = C.x - A.x;
    const dy = C.y - A.y;
    let d = Math.hypot(dx, dy);
    const reachable = d <= a + b && d >= Math.abs(a - b);
    d = Math.min(Math.max(d, Math.abs(a - b) + 1e-6), a + b - 1e-6);
    const cosA = (a * a + d * d - b * b) / (2 * a * d);
    const base = Math.atan2(dy, dx);
    const ang = base + bendSign * Math.acos(Math.max(-1, Math.min(1, cosA)));
    return { joint: v(A.x + a * Math.cos(ang), A.y + a * Math.sin(ang)), reachable };
  }

  // 3点 a-b-c の b での角度(度)
  function angleAt(a, b, c) {
    const u = sub(a, b);
    const w = sub(c, b);
    const cos = (u.x * w.x + u.y * w.y + u.z * w.z) / (len(u) * len(w));
    return Math.acos(Math.max(-1, Math.min(1, cos))) / RAD;
  }

  // crankDeg: 右クランクの角度(0 = 真上、90 = 前)
  function rider(bk, s, crankDeg) {
    const p = bk.p;
    // 股関節: 坐骨(サドル上面)から約9cm。骨盤が前傾しているので前上方(サドルの沈みも見込む)
    const hipMid = add(bk.saddle, mul(v(0.06, 0.045), s.H / 1.72));
    const legs = {};
    for (const side of ["R", "L"]) {
      const th = (crankDeg + (side === "L" ? 180 : 0)) * RAD;
      const z = (side === "R" ? 1 : -1) * 0.075; // ペダルの左右位置(Qファクターの半分)
      const pedal = v(Math.sin(th) * p.crank, Math.cos(th) * p.crank, z);
      // 足首: 母指球をペダルに乗せる。足裏はつま先が少し下がり、下死点ほど下がる(アンクリング)
      const fa = s.footBase + (10 - 8 * Math.cos(th)) * RAD;
      const ankle = add(pedal, v(-Math.cos(fa) * s.ballToAnkle, Math.sin(fa) * s.ballToAnkle));
      const hip = withZ(hipMid, (side === "R" ? 1 : -1) * s.hipHalf);
      const ik = twoBone(hip, ankle, s.thigh, s.shank, 1); // 膝は前に出る
      // 2Dで解いた膝を、腰と足首の左右位置の間に置く
      const knee = withZ(ik.joint, (hip.z + ankle.z) / 2);
      legs[side] = { hip, knee, ankle: withZ(ankle, z), pedal, toe: add(pedal, v(0.06 * (s.foot / 0.26), -0.01, z - pedal.z)), reachable: ik.reachable };
    }
    // 上半身: 胴の長さ(股関節から肩)と、肘を少し曲げた腕の長さで、肩の位置が決まる
    const grip = bk.grips[p.hands] || bk.grips.hoods;
    const elbowRad = p.elbow * RAD;
    const armEff = Math.sqrt(s.upperArm ** 2 + s.forearm ** 2 + 2 * s.upperArm * s.forearm * Math.cos(elbowRad));
    const dz = Math.max(0, grip.z - s.shoulderHalf);
    const armSag = Math.sqrt(Math.max(0.01, armEff ** 2 - dz ** 2));
    const sh = twoBone(hipMid, grip.pt, s.torso, armSag, 1); // 肩は上側
    const shoulderMid = sh.joint;
    const torsoAngle = Math.atan2(shoulderMid.y - hipMid.y, shoulderMid.x - hipMid.x) / RAD;
    const reachGap = Math.hypot(grip.pt.x - hipMid.x, grip.pt.y - hipMid.y) - (s.torso + armSag); // +: 届かない
    const arms = {};
    for (const side of ["R", "L"]) {
      const sgn = side === "R" ? 1 : -1;
      const shoulder = withZ(shoulderMid, sgn * s.shoulderHalf);
      const hand = withZ(grip.pt, sgn * grip.z);
      const ik = twoBone(shoulder, hand, s.upperArm, s.forearm, -1); // 肘は下・後ろ
      arms[side] = { shoulder, elbow: withZ(ik.joint, (shoulder.z + hand.z) / 2 + sgn * 0.03), hand };
    }
    // 頭: 首は胴より少し起こし、前を見る
    const neckAng = (torsoAngle + 30) * RAD;
    const headC = add(shoulderMid, v(Math.cos(neckAng) * (s.neck + s.head * 0.6), Math.sin(neckAng) * (s.neck + s.head * 0.6)));
    return { hipMid, shoulderMid, legs, arms, head: headC, torsoAngle, reachGap, sh };
  }

  // 体を「カプセル(太さのある線)」の集まりにする(3D表示と前面投影面積に使う)
  function capsules(r, s) {
    const k = s.girth * (s.H / 1.72);
    const c = [];
    // r: 根元の太さ、r2: 先の太さ(太ももは膝に向かって細くなる、など)
    const seg = (a, b, rad, part, rad2) => c.push({ a, b, r: rad, r2: rad2 == null ? rad : rad2, part });
    const R = s.r;
    for (const side of ["R", "L"]) {
      const l = r.legs[side];
      seg(l.hip, l.knee, R.thigh[0], "thigh", R.thigh[1]);
      seg(l.knee, l.ankle, R.shank[0], "shank", R.shank[1]);
      seg(l.ankle, l.toe, 0.04 * k, "foot", 0.032 * k);
      const a = r.arms[side];
      seg(a.shoulder, a.elbow, R.arm[0], "arm", R.arm[1]);
      seg(a.elbow, a.hand, R.forearm[0], "forearm", R.forearm[1]);
    }
    // 胴は左右2本で幅を出す(腰 → 胸)
    for (const sgn of [1, -1]) {
      seg(withZ(r.hipMid, sgn * s.hipHalf * 0.9), withZ(r.shoulderMid, sgn * (s.shoulderHalf - 0.05)), R.torso[0], "torso", R.torso[1]);
    }
    seg(r.shoulderMid, r.head, 0.055 * k, "neck", 0.05 * k);
    c.push({ a: r.head, b: r.head, r: s.head, r2: s.head, part: "head" });
    return c;
  }

  // ---------- 前面投影面積(正面から見た体の面積) ----------
  // 正面(z-y平面)に投影したカプセルを、格子で塗りつぶして面積を数える
  function frontalArea(caps, cell = 0.008) {
    let minZ = Infinity, maxZ = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const c of caps) {
      const m = Math.max(c.r, c.r2 == null ? c.r : c.r2);
      minZ = Math.min(minZ, c.a.z - m, c.b.z - m);
      maxZ = Math.max(maxZ, c.a.z + m, c.b.z + m);
      minY = Math.min(minY, c.a.y - m, c.b.y - m);
      maxY = Math.max(maxY, c.a.y + m, c.b.y + m);
    }
    const nz = Math.ceil((maxZ - minZ) / cell);
    const ny = Math.ceil((maxY - minY) / cell);
    const mask = new Uint8Array(nz * ny);
    // 投影した線分(z-y)ごとに、その周りの格子だけ調べる
    for (const c of caps) {
      const az = c.a.z, ay = c.a.y, bz = c.b.z, by = c.b.y;
      const dz = bz - az, dy = by - ay;
      const l2 = dz * dz + dy * dy;
      const cr2 = c.r2 == null ? c.r : c.r2;
      const z0 = Math.max(0, Math.floor((Math.min(az, bz) - Math.max(c.r, cr2) - minZ) / cell));
      const z1 = Math.min(nz - 1, Math.ceil((Math.max(az, bz) + Math.max(c.r, cr2) - minZ) / cell));
      const y0 = Math.max(0, Math.floor((Math.min(ay, by) - Math.max(c.r, cr2) - minY) / cell));
      const y1 = Math.min(ny - 1, Math.ceil((Math.max(ay, by) + Math.max(c.r, cr2) - minY) / cell));
      for (let j = y0; j <= y1; j++) {
        const py = minY + (j + 0.5) * cell;
        for (let i = z0; i <= z1; i++) {
          const pz = minZ + (i + 0.5) * cell;
          let t = l2 ? ((pz - az) * dz + (py - ay) * dy) / l2 : 0;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          const ez = az + t * dz - pz, ey = ay + t * dy - py;
          const rt = c.r + (cr2 - c.r) * t; // その位置での太さ
          if (ez * ez + ey * ey <= rt * rt) mask[j * nz + i] = 1;
        }
      }
    }
    let n = 0;
    for (let i = 0; i < mask.length; i++) n += mask[i];
    return { area: n * cell * cell, mask, nz, ny, cell, minZ, minY };
  }

  // ---------- 空気抵抗(CdA) ----------
  // 体の抗力係数(前面投影面積に掛ける)。上体を倒すほど少し小さくなる。
  // ブラケットを持った一般的な姿勢で、バイク込みの CdA が 0.32 前後になるよう合わせた値
  const riderCd = (torsoDeg) => 0.48 + 0.0032 * Math.max(15, Math.min(75, torsoDeg));

  // 機材ごとの空気抵抗(CdA, m²)の目安。部位ごとの内訳を返す
  function bikeCdaParts(aero) {
    const a = Object.assign({ frame: "round", rimFront: 30, rimRear: 30, discRear: false, tire: 28, bar: "round", cables: "external", bottles: 1, extras: 0 }, aero);
    const wheel = (mm) => (mm >= 55 ? 0.0075 : mm >= 40 ? 0.0085 : 0.01);
    return {
      frame: a.frame === "aero" ? 0.014 : 0.02,
      wheels: wheel(a.rimFront) + (a.discRear ? 0.0065 : wheel(a.rimRear)),
      tires: Math.max(0, a.tire - 25) * 0.0003,
      bar: (a.bar === "integrated" ? 0.0035 : a.bar === "aero" ? 0.004 : 0.006) + (a.cables === "internal" ? 0 : 0.001),
      others: 0.0015 * a.bottles + 0.001 * a.extras,
    };
  }

  function bikeCda(aero) {
    const p = bikeCdaParts(aero);
    return p.frame + p.wheels + p.tires + p.bar + p.others;
  }

  // ---------- 全体の計算 ----------
  // build: { geo, pos, aero, wheelRadius }  body: 体の寸法
  function compute(build, body, opts = {}) {
    const s = segments(Object.assign({}, DEFAULT_BODY, body));
    const bk = bike(build.geo, build.pos, { radius: build.wheelRadius });
    // 1周ぶんの姿勢から、膝・股関節の角度の範囲を出す
    let kneeMax = 0, kneeMin = 180, hipMin = 180, kops = null;
    const steps = opts.coarse ? 12 : 36;
    for (let i = 0; i < steps; i++) {
      const deg = (360 / steps) * i;
      const r = rider(bk, s, deg);
      const l = r.legs.R;
      const knee = angleAt(l.hip, l.knee, l.ankle);
      const hip = angleAt(r.shoulderMid, withZ(r.hipMid, 0), withZ(l.knee, 0));
      kneeMax = Math.max(kneeMax, knee);
      kneeMin = Math.min(kneeMin, knee);
      hipMin = Math.min(hipMin, hip);
      if (deg === 90) kops = l.knee.x - l.pedal.x; // 3時の位置で膝がペダル軸の前か後ろか
    }
    const pose = rider(bk, s, opts.crank != null ? opts.crank : 90);
    const a = pose.arms.R;
    const shoulderAng = angleAt(withZ(pose.hipMid, a.shoulder.z), a.shoulder, a.elbow);
    const caps = capsules(pose, s);
    const fa = frontalArea(caps, opts.coarse ? 0.012 : 0.008);
    const riderCda = riderCd(pose.torsoAngle) * fa.area;
    const bikePart = bikeCda(build.aero);
    return {
      bike: bk,
      seg: s,
      pose,
      caps,
      frontal: fa,
      angles: {
        kneeExt: kneeMax, // ペダルが一番下付近での膝の角度(伸び)
        kneeTop: kneeMin, // 一番上での膝の角度(曲がり)
        hip: hipMin, // 股関節の一番閉じた角度(上体と太もも)
        torso: pose.torsoAngle, // 上体の角度(水平から)
        shoulder: shoulderAng,
        kops: kops, // 3時の位置での膝とペダル軸の前後差(m)
        reachGap: pose.reachGap, // +ならハンドルが遠すぎて届かない
      },
      cda: { rider: riderCda, bike: bikePart, total: riderCda + bikePart, area: fa.area },
    };
  }

  // 指定したクランク角度での関節の角度(写真で測った値と比べるため)
  function anglesAt(build, body, crankDeg) {
    const s = segments(Object.assign({}, DEFAULT_BODY, body));
    const bk = bike(build.geo, build.pos, { radius: build.wheelRadius });
    const r = rider(bk, s, crankDeg);
    const l = r.legs.R;
    const a = r.arms.R;
    return {
      knee: angleAt(l.hip, l.knee, l.ankle),
      hip: angleAt(r.shoulderMid, withZ(r.hipMid, 0), withZ(l.knee, 0)),
      torso: r.torsoAngle,
      shoulder: angleAt(withZ(r.hipMid, a.shoulder.z), a.shoulder, a.elbow),
      elbow: 180 - angleAt(a.shoulder, a.elbow, a.hand),
    };
  }

  // ---------- 目安の範囲 ----------
  // goal: comfort(楽・腰にやさしい) / balance / aero(速さ)
  function targets(body, goal) {
    const flex = body.flex || "normal";
    const hipMin = { stiff: 50, normal: 45, soft: 40 }[flex] + (body.backPain ? 5 : 0);
    const torso = goal === "aero" ? [28, 40] : goal === "comfort" ? [45, 60] : [38, 50];
    // 腰痛があるときは、上体を少し起こした範囲を目安にする(速さ優先のときは除く)
    if (body.backPain && goal !== "aero") torso[0] = Math.max(torso[0], goal === "comfort" ? 48 : 44);
    return {
      kneeExt: { ok: [140, 150], warn: [135, 155], label: "膝の伸び(下死点)" },
      kneeTop: { ok: [68, 180], warn: [62, 180], label: "膝の曲がり(上死点)" },
      hip: { ok: [hipMin, 180], warn: [hipMin - 5, 180], label: "股関節の角度(最も閉じた時)" },
      torso: { ok: torso, warn: [torso[0] - 5, torso[1] + 5], label: "上体の角度(水平から)" },
      shoulder: { ok: [75, 100], warn: [65, 110], label: "肩の角度(胴と腕)" },
      kops: { ok: [-0.02, 0.02], warn: [-0.035, 0.035], label: "膝とペダル軸の前後(3時)" },
    };
  }

  function judge(value, t) {
    if (value >= t.ok[0] && value <= t.ok[1]) return "ok";
    if (value >= t.warn[0] && value <= t.warn[1]) return "warn";
    return "ng";
  }

  // 目安からどれだけ外れているか(0 = すべて目安の中)
  function penalty(res, tg) {
    let p = 0;
    const a = res.angles;
    for (const k of Object.keys(tg)) {
      const t = tg[k];
      const val = a[k];
      const scale = k === "kops" ? 400 : 1; // kops は 2.5mm ≒ 角度1度ぶん
      const over = val < t.ok[0] ? t.ok[0] - val : val > t.ok[1] ? val - t.ok[1] : 0;
      p += (over * scale) ** 2;
    }
    if (a.reachGap > 0) p += (a.reachGap * 1000) ** 2; // 届かないのは強く避ける
    // 膝の伸びは、目安の真ん中(145°)に寄せる
    p += ((a.kneeExt - (tg.kneeExt.ok[0] + tg.kneeExt.ok[1]) / 2) / 5) ** 2;
    return p;
  }

  // ---------- ポジションの自動調整 ----------
  // サドル高・前後・スペーサー・ステム長・角度を少しずつ動かして、目安に近づける
  const SEARCH = {
    saddleHeight: { step: 0.005, min: -0.06, max: 0.06 },
    saddleSetback: { step: 0.005, min: -0.025, max: 0.025 },
    spacers: { step: 0.005, abs: [0, 0.04] },
    stemLength: { step: 0.01, abs: [0.06, 0.14] },
    stemAngle: { list: [-17, -10, -6, 0, 6, 10, 17] },
  };

  function optimize(build, body, goal) {
    const tg = targets(body, goal);
    const base = build.pos;
    // CdA 0.01 の差を、目安から角度で何度外れるのと同じくらい重く見るか(aero: 約6度、balance: 約3.5度)
    const aeroW = goal === "aero" ? 1000 : goal === "balance" ? 150 : 0;
    const score = (pos) => {
      const r = compute(Object.assign({}, build, { pos }), body, { coarse: true });
      let change = 0;
      // 今の位置から大きく変えるほど不利にする(1cm ≒ 2点、ステム角度は6度 ≒ 2点)
      for (const k of Object.keys(SEARCH)) change += Math.abs((pos[k] - base[k]) * (k === "stemAngle" ? 0.0033 : 1));
      return { r, s: penalty(r, tg) + aeroW * r.cda.total + change * 200 };
    };
    let cur = Object.assign({}, DEFAULT_POS, base);
    let best = score(cur);
    for (let iter = 0; iter < 6; iter++) {
      let improved = false;
      for (const k of Object.keys(SEARCH)) {
        const d = SEARCH[k];
        const cands = d.list
          ? d.list
          : (() => {
              const lo = d.abs ? d.abs[0] : base[k] + d.min;
              const hi = d.abs ? d.abs[1] : base[k] + d.max;
              const out = [];
              for (let x = lo; x <= hi + 1e-9; x += d.step) out.push(Math.round(x * 1000) / 1000);
              return out;
            })();
        for (const val of cands) {
          if (val === cur[k]) continue;
          const pos = Object.assign({}, cur, { [k]: val });
          const sc = score(pos);
          if (sc.s < best.s - 1e-6) {
            best = sc;
            cur = pos;
            improved = true;
          }
        }
      }
      if (!improved) break;
    }
    return { pos: cur, result: compute(Object.assign({}, build, { pos: cur }), body) };
  }

  // ---------- 走りの比較 ----------
  // mass: ライダー+バイク+荷物(kg)、rot: ホイール外周の重さ(kg、回転の重さとして加速に効く)
  function performance(cda, mass, rot, crr = 0.005) {
    const g = 9.81;
    const rho = 1.2;
    const power = (v, grade = 0) => (v * (mass * g * (crr + grade)) + 0.5 * rho * cda * v ** 3) / 0.976;
    const speedAt = (watts, grade = 0) => {
      let lo = 0.5, hi = 30;
      for (let i = 0; i < 50; i++) {
        const m = (lo + hi) / 2;
        if (power(m, grade) > watts) hi = m;
        else lo = m;
      }
      return lo;
    };
    // 0→30km/h(400W)の時間。回転するホイール外周の重さは2倍に効く
    const accel = (() => {
      let v0 = 0.5, t = 0;
      const me = mass + rot;
      while (v0 < 30 / 3.6 && t < 60) {
        const f = 400 * 0.976 / v0 - mass * g * crr - 0.5 * rho * cda * v0 * v0;
        v0 += (f / me) * 0.05;
        t += 0.05;
      }
      return t;
    })();
    return {
      speed200: speedAt(200) * 3.6, // 200Wでの平地の速度(km/h)
      watts30: power(30 / 3.6), // 30km/hに必要なパワー(W)
      climb: 2000 / speedAt(250, 0.05) / 60, // 5%の坂2kmを250Wで(分)
      accel, // 0→30km/h(400W)(秒)
      commute: 11000 / speedAt(150) / 60, // 平地11kmを150Wで(分)
    };
  }

  return { DEFAULT_GEO, DEFAULT_POS, DEFAULT_BODY, segments, bike, rider, capsules, frontalArea, bikeCda, bikeCdaParts, compute, anglesAt, targets, judge, penalty, optimize, performance, angleAt, riderCd };
})();

if (typeof module !== "undefined") module.exports = Fit;

// デュエルの「サビ」の演出: 熱いターン(逆転・ピンチ・運命のドロー・シンクロ・長いチェーン・決着)だけ、
// アニメのようにカメラの画角を切り替えて見せる。ふつうのターンは今まで通り小さな盤面で流す。
// ショット: ドローの振り抜き / カードを突き出す / カードのアップ / あおりのモンスター / 2ショット /
//           シンクロの光の輪 / チェーンの割り画面 / 攻撃の突進 / ピンチの目元 / 逆転 / 決着 / ライバル登場
// 背景は層を重ねて奥行きを出し、カメラをゆっくり動かす。カットの間はフラッシュやワイプでつなぐ。
// セリフの字幕を重ね、効果音はその場で音を合成する(音声ファイルは使わない)。

const Cinema = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const DUR = { manga: 2.6, duel: 2.3, glare: 2.0, draw: 1.7, hold: 1.7, cardup: 1.6, low: 2.1, two: 1.8, synchro: 2.9, chain: 2.2, attack: 2.2, pinch: 2.4, reversal: 2.4, finish: 2.9, rival: 2.3 };

  // ---------- 効果音(Web Audio で合成) ----------
  let ac = null, bus = null;
  function unlock() {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
    } catch (e) {
      ac = null;
    }
  }
  // 出口: 残響(左右で違う響き)を足し、コンプレッサーで音割れを防ぐ
  function out() {
    if (bus) return bus;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 5;
    comp.connect(ac.destination);
    bus = ac.createGain();
    bus.gain.value = 0.9;
    bus.connect(comp);
    try {
      const len = Math.floor(ac.sampleRate * 2.2), ir = ac.createBuffer(2, len, ac.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
      }
      const rev = ac.createConvolver(), wet = ac.createGain();
      rev.buffer = ir;
      wet.gain.value = 0.3;
      bus.connect(rev);
      rev.connect(wet);
      wet.connect(comp);
    } catch (e) {
      // 残響が作れなくても音は出す
    }
    return bus;
  }
  function noise(len) {
    const b = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource();
    s.buffer = b;
    return s;
  }
  // pan: -1(左)〜1(右)。[from, to] なら左右に流す
  function env(node, t0, a, peak, dec, pan) {
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + dec);
    node.connect(g);
    if (pan != null && ac.createStereoPanner) {
      const p = ac.createStereoPanner(), ar = Array.isArray(pan);
      p.pan.setValueAtTime(ar ? pan[0] : pan, t0);
      if (ar) p.pan.linearRampToValueAtTime(pan[1], t0 + a + dec);
      g.connect(p);
      p.connect(out());
    } else g.connect(out());
    return g;
  }
  function tone(type, f0, f1, t0, a, peak, dec, pan, det) {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (det) o.detune.value = det;
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t0 + a + dec);
    env(o, t0, a, peak, dec, pan);
    o.start(t0);
    o.stop(t0 + a + dec + 0.05);
  }
  // 雑音をフィルターに通して鳴らす
  function nz(t, len, type, f0, f1, q, a, peak, dec, pan) {
    const n = noise(len), f = ac.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + a + dec);
    n.connect(f);
    env(f, t, a, peak, dec, pan);
    n.start(t);
  }
  const SFX = {
    whoosh(t, dir) {
      const d = dir === -1 ? [0.8, -0.8] : [-0.8, 0.8];
      nz(t, 0.7, "bandpass", 260, 4200, 1.3, 0.14, 0.5, 0.42, d);
      nz(t, 0.7, "lowpass", 180, 700, 0.7, 0.2, 0.35, 0.35, d);
    },
    // 重い打撃: 低い胴鳴り + 沈む低音 + 割れる高音
    hit(t) {
      tone("sine", 150, 38, t, 0.004, 0.95, 0.55);
      tone("sine", 72, 26, t, 0.01, 0.8, 1.1);
      tone("triangle", 220, 60, t, 0.003, 0.35, 0.22);
      nz(t, 0.5, "lowpass", 2400, 300, 0.7, 0.003, 0.7, 0.34);
      nz(t, 0.12, "highpass", 3200, 0, 0.7, 0.002, 0.3, 0.08, -0.4);
      nz(t + 0.015, 0.12, "highpass", 4200, 0, 0.7, 0.002, 0.25, 0.08, 0.4);
    },
    // 地響き(決着・合体)
    boom(t) {
      tone("sine", 58, 22, t, 0.02, 1, 1.9);
      tone("sine", 116, 30, t, 0.01, 0.4, 0.9);
      nz(t, 1.6, "lowpass", 500, 60, 0.6, 0.02, 0.6, 1.4);
    },
    shine(t) {
      [1318, 1760, 2637, 3520, 5274].forEach((f, i) => {
        tone("sine", f, 0, t + i * 0.05, 0.01, 0.1, 0.8, i % 2 ? 0.6 : -0.6);
        tone("triangle", f * 1.003, 0, t + i * 0.05 + 0.02, 0.01, 0.04, 1.1, i % 2 ? -0.6 : 0.6);
      });
      nz(t, 0.8, "highpass", 7000, 0, 0.7, 0.05, 0.05, 0.7);
    },
    // 和音の一撃(左右に少しずらして厚みを出す)
    stab(t, minor) {
      (minor ? [110, 220, 261.6, 329.6, 440] : [110, 220, 277.2, 329.6, 440]).forEach((f, i) => {
        tone("sawtooth", f, 0, t, 0.012, 0.055, 0.9, -0.5, -7 - i);
        tone("sawtooth", f, 0, t, 0.012, 0.055, 0.9, 0.5, 7 + i);
      });
      tone("sine", 55, 0, t, 0.01, 0.6, 0.9);
      tone("square", 880, 0, t, 0.005, 0.03, 0.25);
    },
    riser(t) {
      tone("sawtooth", 110, 1500, t, 0.05, 0.09, 1.3, -0.4, -9);
      tone("sawtooth", 110, 1500, t, 0.05, 0.09, 1.3, 0.4, 9);
      tone("sine", 40, 110, t, 0.3, 0.5, 1.05);
      nz(t, 1.5, "highpass", 400, 7000, 0.8, 1.2, 0.25, 0.15, [-0.7, 0.7]);
    },
    heart(t) {
      for (let k = 0; k < 2; k++) {
        tone("sine", 70, 38, t + k * 0.8, 0.01, 0.95, 0.2);
        tone("sine", 60, 33, t + k * 0.8 + 0.22, 0.01, 0.65, 0.2);
        nz(t + k * 0.8, 0.2, "lowpass", 160, 0, 0.7, 0.005, 0.3, 0.12);
      }
    },
    clink(t) {
      tone("square", 2200, 1400, t, 0.002, 0.07, 0.12, -0.3);
      tone("triangle", 3300, 0, t, 0.002, 0.06, 0.3, 0.3);
      tone("sine", 180, 90, t, 0.003, 0.3, 0.12);
    },
    // 斬撃(金属のこすれ)
    slash(t, dir) {
      nz(t, 0.3, "bandpass", 7000, 1400, 4, 0.004, 0.5, 0.2, dir === -1 ? [0.7, -0.7] : [-0.7, 0.7]);
      tone("sine", 3000, 900, t, 0.003, 0.08, 0.18);
    },
    // カットの切り替え(短い風)
    sweep(t) {
      nz(t, 0.3, "bandpass", 900, 3000, 0.9, 0.08, 0.14, 0.16, [-0.5, 0.5]);
    },
  };
  function sfx(name, delay = 0, arg) {
    if (!ac || !SFX[name]) return;
    try {
      SFX[name](ac.currentTime + delay, arg);
    } catch (e) {
      // 音が出なくても演出は続ける
    }
  }

  // ---------- 何を見せるか(カット割り) ----------
  // ev: Battle.step の返り値。cuts: [{ shot, side, line, tone, ... }]
  function plan(ev) {
    const d = ev.drama || { tags: [] };
    const tags = new Set(d.tags);
    const mine = ev.side === "you";
    const foe = ev.foe ? ev.foe.name : "ライバル";
    const cand = []; // [優先度, カット]
    const push = (pri, cut) => cand.push([pri, cand.length, cut]);
    const st = ev.steps;
    const DL = DuelLines;
    // セリフ(DuelLines の [文, 話す側, 演技])をカットにつける。side は画面の側、vside は声の側
    const ln = (t, cut) => Object.assign(cut, { line: t[0], vside: t[1], tone: t[2] });
    const nf = st.find((x) => x.t === "newfoe");
    if (nf) {
      push(6, ln(DL.rivalEnter(nf.foe), { shot: "rival", side: "opp", foe: nf.foe }));
      push(6, ln(DL.duel(), { shot: "duel", side: "you" }));
    }
    const draw = st.find((x) => x.t === "draw" && !x.why);
    if (tags.has("destiny")) {
      push(9, ln(DL.notHere(), { shot: "pinch", side: "you", lp: ev.lp0.you }));
      push(10, ln(DL.destinyDraw(), { shot: "draw", side: "you", gold: true }));
      const dc = st.find((x) => x.t === "spell" && x.card.fx === "destiny");
      if (dc) {
        push(5, ln(DL.thisCard(), { shot: "cardup", side: "you", card: dc.card }));
        push(9, ln(DL.activate(dc.card.name), { shot: "hold", side: "you", card: dc.card }));
      }
    } else if (mine && draw && d.score >= 5) push(3, ln(DL.myDraw(), { shot: "draw", side: "you" }));
    // 召喚(シンクロ・エース)
    let summons = 0;
    for (const s of st) {
      if (s.t !== "summon" || summons >= 2) continue;
      const who = s.side;
      const chant = typeof Board !== "undefined" ? DL.chant(Board.chant(s.mon, who), who) : DL.aceCall(s.mon.name, who);
      if (s.how === "synchro") {
        const tune = st[st.indexOf(s) - 1];
        push(7, ln(DL.synchroChant(who), { shot: "synchro", side: who, from: tune && tune.t === "tune" ? tune.from : [], lv: s.mon.lv, mon: s.mon }));
        push(7, ln(chant, { shot: "manga", side: who }));
        push(6, ln(DL.summonCry(s.mon.name, who), { shot: "low", side: who, mon: s.mon }));
        summons++;
      } else if (s.how === "ace" || s.mon.atk >= 2500) {
        if (s.how === "ace") push(9, ln(chant, { shot: "manga", side: who }));
        push(s.how === "ace" ? 10 : 5, ln(DL.aceCall(s.mon.name, who), { shot: s.how === "ace" ? "low" : "two", side: who, mon: s.mon }));
        summons++;
      }
    }
    // 長いチェーン
    const ch = st.filter((x) => x.t === "chain").sort((a, b) => b.links.length - a.links.length)[0];
    if (ch && ch.links.length >= 3) push(6, ln(DL.chain(ch.links.length, ev.side), { shot: "chain", side: ev.side, links: ch.links }));
    // 攻撃: 決着の一撃か、いちばん大きいダメージ
    const atks = st.filter((x) => x.t === "attack" && x.dmg > 0 && (x.result === "direct" || x.result === "destroy" || x.result === "guard"));
    const big = atks.sort((a, b) => (b.mon.ace ? 1e5 : 0) + b.dmg - (a.mon.ace ? 1e5 : 0) - a.dmg)[0];
    // 決着の一撃の前に、目のアップで溜める
    if (big && big.side === "you" && tags.has("win")) push(8, ln(DL.glare(), { shot: "glare", side: "you" }));
    if (big && (tags.has("win") || tags.has("lose") || tags.has("reversal") || tags.has("reversed") || tags.has("pinch") || big.dmg >= 1200))
      push(tags.has("win") || tags.has("lose") || tags.has("reversal") ? 9 : 6, ln(DL.attack(big.mon.name, big.side, big.result === "direct"), { shot: "attack", side: big.side, mon: big.mon, dmg: big.dmg, direct: big.result === "direct" }));
    // ピンチ・逆転・決着
    if (tags.has("pinch") && !tags.has("destiny")) push(8, ln(d.hint ? DL.pinchShort() : DL.pinch(), { shot: "pinch", side: "you", lp: ev.you.lp }));
    if (tags.has("reversal")) push(9, ln(DL.reversal(), { shot: "reversal", side: "you", lp: [ev.you.lp, ev.opp.lp] }));
    if (tags.has("reversed")) push(8, ln(DL.reversed(foe), { shot: "reversal", side: "opp", lp: [ev.you.lp, ev.opp.lp] }));
    if (tags.has("win")) push(10, ln(DL.ko(foe), { shot: "finish", side: "you", win: true }));
    if (tags.has("lose")) push(10, ln(DL.lifeZero(), { shot: "finish", side: "opp", win: false }));
    // 多すぎたら優先度の低いものから削る(順番は起きた順のまま)
    const keep = cand.slice().sort((a, b) => b[0] - a[0]).slice(0, 6);
    const cuts = cand.filter((c) => keep.includes(c)).map((c) => c[2]);
    // 決着とピンチは最後に置く
    const last = (shot) => {
      const i = cuts.findIndex((c) => c.shot === shot);
      if (i >= 0) cuts.push(cuts.splice(i, 1)[0]);
    };
    if (!tags.has("destiny")) last("pinch");
    last("reversal");
    last("finish");
    return cuts;
  }

  // ---------- 見せ場の人物(オリジナルのキャラクター: ロードバイク乗りのカードデュエリスト) ----------
  // セルアニメ調の描き込み。輪郭はすべてベジェ曲線(点列を Catmull-Rom で C に変換)。直線はファスナー・縫い目・カードの縁だけ。
  // 主線は塗りの細長い形: 外形は影の側ほど太く、内側の線は細く、1本の中で入り抜きをつける。
  // 塗りは 地の色 + 影2段(広い影・狭く濃い影)+ 逆光のふち + ハイライト。光は右上から、逆光は左から。
  // 自分=紺のトゲ髪を後ろへ流す・頭にオレンジのアイウェア・切れ長の青緑の目・濃紺のライディングジャケット(前を開けて青緑のジャージ)。寡黙で年上の主人公
  // 相手=銀の長髪・赤い目・黒いジャージに紫と赤・肩に羽織った上着(裏地赤)
  // 比率: 肩幅は頭の幅の約2.2倍、上腕≒前腕、手の長さ≒顔の長さ、指の節は 3:2:1.5。ひじは曲がる向きを守り、突き出す腕の側の肩を前へ出して胴をひねる
  // pose: base(カードを顔の横に構える) / draw(カードを引き抜く) / thrust(腕を前へ突き出す) / win(自分=カードを掲げる、相手=こぶしを突き上げる) / pinch(目元の帯に使う顔のアップ)
  // 目の高さは絵の上から2割強(ピンチの目元の帯が合わせている)。腕は絵の枠の外まで伸びる(overflow: visible)。side と pose ごとに1回だけ作って使い回す
  const HL = [0.8, -0.6]; // 光の来る向き(右上)
  const hf = (v) => Math.round(v * 10) / 10;
  const hpt = (p) => hf(p[0]) + " " + hf(p[1]);
  // 点列 → 3次ベジェの区間。点の3番目が 1 ならそこを角にする
  function hSegs(pts, closed) {
    const n = pts.length, out = [], g = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = g(i - 1), b = g(i), c = g(i + 1), d = g(i + 2);
      const c1 = b[2] ? [b[0] + (c[0] - b[0]) / 3, b[1] + (c[1] - b[1]) / 3] : [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
      const c2 = c[2] ? [c[0] - (c[0] - b[0]) / 3, c[1] - (c[1] - b[1]) / 3] : [c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6];
      out.push([b, c1, c2, c]);
    }
    return out;
  }
  // 相対座標(c)で書いて文字数を減らす。丸めた絶対座標どうしの差なので誤差はたまらない
  const hNum = (v) => {
    const t = String(Math.round(v * 10) / 10);
    return t.replace(/^(-?)0\./, "$1.");
  };
  const hPath = (pts, closed = true) => {
    const r = (v) => Math.round(v * 10) / 10;
    let x = r(pts[0][0]), y = r(pts[0][1]), d = "M" + x + " " + y;
    for (const s of hSegs(pts, closed)) {
      const a = [r(s[1][0]), r(s[1][1]), r(s[2][0]), r(s[2][1]), r(s[3][0]), r(s[3][1])];
      d += "c" + [a[0] - x, a[1] - y, a[2] - x, a[3] - y, a[4] - x, a[5] - y].map(hNum).join(" ").replace(/ -/g, "-");
      (x = a[4]), (y = a[5]);
    }
    return d + (closed ? "Z" : "");
  };
  // 凸包(外側を包む点の並び)
  function hull(P) {
    const p = P.map((q) => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
    for (const q of p) {
      while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
      lo.push(q);
    }
    for (const q of p.reverse()) {
      while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
      up.push(q);
    }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  const hLen = (pts) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
  // 曲線の上を細かく刻んだ点
  function hDense(pts, closed, step) {
    const out = [];
    for (const [b, c1, c2, e] of hSegs(pts, closed)) {
      const n = Math.max(2, Math.ceil((Math.hypot(c1[0] - b[0], c1[1] - b[1]) + Math.hypot(c2[0] - c1[0], c2[1] - c1[1]) + Math.hypot(e[0] - c2[0], e[1] - c2[1])) / step));
      for (let i = 0; i < n; i++) {
        const t = i / n, u = 1 - t, A = u * u * u, B = 3 * u * u * t, Cc = 3 * u * t * t, D = t * t * t;
        out.push([A * b[0] + B * c1[0] + Cc * c2[0] + D * e[0], A * b[1] + B * c1[1] + Cc * c2[1] + D * e[1]]);
      }
    }
    if (!closed) out.push(pts[pts.length - 1].slice(0, 2));
    return out;
  }
  // 入り抜きのある線(塗りの細長い形)。s=入り、e=抜き(全長に対する割合。0 なら太いまま)
  function hInk(pts, w, s = 0.3, e = 0.4, col = "#000", op = 1) {
    const L0 = hLen(pts);
    if (L0 < 0.3) return "";
    const D = hDense(pts, false, Math.max(0.3, L0 / 22)), n = D.length, cum = [0];
    for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(D[i][0] - D[i - 1][0], D[i][1] - D[i - 1][1]);
    const L = cum[n - 1] || 1, A = [], B = [], idx = [];
    for (let i = 0; i < n - 1; i += 2) idx.push(i);
    idx.push(n - 1);
    for (const i of idx) {
      const t = cum[i] / L, p = D[i], q0 = D[Math.max(0, i - 1)], q1 = D[Math.min(n - 1, i + 1)];
      let k = 1;
      if (s > 0 && t < s) k *= Math.sin(((t / s) * Math.PI) / 2);
      if (e > 0 && t > 1 - e) k *= Math.sin((((1 - t) / e) * Math.PI) / 2);
      const hw = Math.max(0.05, (w * k) / 2), tx = q1[0] - q0[0], ty = q1[1] - q0[1], tl = Math.hypot(tx, ty) || 1;
      A.push([p[0] - (ty / tl) * hw, p[1] + (tx / tl) * hw]);
      B.push([p[0] + (ty / tl) * hw, p[1] - (tx / tl) * hw]);
    }
    if (s > 0) (A[0][2] = 1), (B[0][2] = 1);
    if (e > 0) (A[A.length - 1][2] = 1), (B[B.length - 1][2] = 1);
    return `<path d="${hPath(A.concat(B.reverse()))}" fill="${col}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  }
  // 閉じた形の主線: 外へ太らせた帯。光と反対(影の側)ほど太い
  function hEdge(pts, w0, w1, col) {
    const L0 = hLen(pts.concat([pts[0]])), D = hDense(pts, true, Math.min(6, Math.max(0.5, L0 / 40))), n = D.length;
    let ar = 0;
    for (let i = 0; i < n; i++) {
      const a = D[i], b = D[(i + 1) % n];
      ar += a[0] * b[1] - b[0] * a[1];
    }
    const sg = ar > 0 ? 1 : -1, O = [], I = [];
    for (let i = 0; i < n; i += 2) {
      const p = D[i], a = D[(i - 1 + n) % n], b = D[(i + 1) % n], tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
      const nx = (sg * ty) / tl, ny = (-sg * tx) / tl, k = Math.max(0, Math.min(1, (0.35 - nx * HL[0] - ny * HL[1]) / 1.35)), w = w0 + (w1 - w0) * k;
      O.push([p[0] + nx * w, p[1] + ny * w]);
      I.push([p[0] - nx * 0.35, p[1] - ny * 0.35]);
    }
    return `<path d="${hPath(O)}${hPath(I.reverse())}" fill="${col}"/>`;
  }
  // 開いた線の主線: hEdge と同じ式(外へ太らせ、光と反対ほど太い)。sg は外形の回る向き、wf(始点からの長さ, 終点までの長さ, 影の強さ) で太さ
  function hEdgeOpen(pts, sg, wf, col) {
    const D = hDense(pts, false, 1.5), n = D.length, cum = [0], O = [], I = [];
    for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(D[i][0] - D[i - 1][0], D[i][1] - D[i - 1][1]);
    const L = cum[n - 1] || 1, idx = [];
    for (let i = 0; i < n - 1; i += 2) idx.push(i);
    idx.push(n - 1);
    for (const i of idx) {
      const p = D[i], a = D[Math.max(0, i - 1)], b = D[Math.min(n - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
      const nx = (sg * ty) / tl, ny = (-sg * tx) / tl, k = Math.max(0, Math.min(1, (0.35 - nx * HL[0] - ny * HL[1]) / 1.35)), w = Math.max(0.1, wf(cum[i], L - cum[i], k));
      O.push([p[0] + nx * w, p[1] + ny * w]);
      I.push([p[0] - nx * Math.min(0.35, w), p[1] - ny * Math.min(0.35, w)]);
    }
    O[0][2] = O[O.length - 1][2] = I[0][2] = I[I.length - 1][2] = 1;
    return `<path d="${hPath(O.concat(I.reverse()))}" fill="${col}"/>`;
  }
  // 点列の回る向き(面積の符号)
  const hSign = (P) => (P.reduce((s, p, i) => s + p[0] * P[(i + 1) % P.length][1] - P[(i + 1) % P.length][0] * p[1], 0) > 0 ? 1 : -1);
  const HERO_POSE = {
    base: { head: [211, 121, -4], lean: 0, sk: -3, dn: [0, 0], df: [0, 0], far: [[350, 404], [344, 262], "card", { a: -4 }], near: [[56, 424], [104, 506], "fist", {}], ex: "smile" },
    draw: { head: [218, 123, 5], lean: 5, sk: -6, dn: [0, 2], df: [6, -8], far: [[410, 236], [476, 114], "card", { a: 6 }], near: [[66, 420], [166, 446], "deck", {}], ex: "shout" },
    thrust: { head: [216, 122, 2], lean: 4, sk: -8, dn: [-6, 2], df: [14, 2], far: [[398, 292], [488, 258], "open", { pitch: -30 }], near: [[40, 392], [98, 456], "fist", {}], ex: "shout" },
    win: { head: [206, 123, -9], lean: -4, sk: 2, dn: [0, 2], df: [4, -10], far: [[376, 196], [368, 82], "fistUp", {}], near: [[52, 414], [112, 486], "fist", {}], ex: "grin" },
  };
  // 自分(主人公)のポーズ。口は閉じるか、小さく開けて言い放つ
  const HERO_POSE_YOU = {
    base: { head: [214, 130, -5], lean: 0, sk: -3, dn: [0, 0], df: [0, 0], far: [[358, 414], [374, 266], "card", { a: -4 }], near: [[50, 432], [104, 512], "fist", {}], ex: "calm" },
    draw: { head: [220, 132, 4], lean: 5, sk: -7, dn: [0, 2], df: [8, -8], far: [[424, 246], [494, 120], "card", { a: 8 }], near: [[62, 428], [168, 452], "deck", {}], ex: "say" },
    thrust: { head: [218, 131, 1], lean: 4, sk: -9, dn: [-6, 2], df: [16, 4], far: [[372, 338], [426, 290], "open", { fs: 1, ang: 14, hs: 1.55 }], near: [[34, 402], [94, 466], "fist", {}], ex: "say" },
    win: { head: [210, 132, -8], lean: -3, sk: 1, dn: [0, 2], df: [6, -10], far: [[400, 330], [404, 194], "card", { a: 2 }], near: [[46, 432], [110, 500], "fist", {}], ex: "quiet" },
  };
  const HERO_CACHE = {};
  function heroSvg(side, pose) {
    const o = side === "opp", k = (o ? "o" : "y") + (pose === "pinch" || HERO_POSE[pose] ? pose : "base");
    return HERO_CACHE[k] || (HERO_CACHE[k] = drawHero(o, k.slice(1), "cnH" + k));
  }
  function drawHero(o, pose, id) {
    const C = o
      ? { K: "#12060f", rim: "#ff9fd0", skin: ["#f4d6c6", "#d8a393", "#b07a7c"], hair: ["#e6e2f4", "#aaa2cf", "#6c6398"], hi: "#ffffff", hi2: "#ffffff", brow: "#4f477c", jk: ["#332c40", "#1e1928", "#0e0b14"], jhi: "#7d6f9c", ac: "#b03dff", ln: ["#b3143a", "#7d0d29", "#4d0719"], js: ["#362f43", "#231d2e", "#130f1a"], js2: "#4b1876", st: "#e0284f", st2: "#b03dff", gl: ["#b3172f", "#7c0d20", "#4d0713"], iris: ["#5c0716", "#e0203f", "#ff8a8a"], nail: "#f9e2d8" }
      : { K: "#070d18", rim: "#9fe9e0", skin: ["#f6d3b6", "#dfa283", "#b97862"], hair: ["#1c3556", "#11223d", "#081224"], hi: "#6f9cc4", hi2: "#b8dcf6", brow: "#0b1830", jk: ["#323e55", "#1f2839", "#121825"], jhi: "#53648a", ac: "#ff8a1f", ln: ["#0f8f88", "#0a6468", "#07444e"], js: ["#14a99c", "#0c7c7a", "#08555a"], js2: "#0a4148", st: "#1fd0bb", st2: "#ff8a1f", gl: ["#3a4660", "#252e40", "#141a27"], iris: ["#053642", "#14b8a6", "#8dffe6"], nail: "#fae0cc" };
    const K = C.K, S = C.skin, J = C.jk, DEG = Math.PI / 180, f = hf;
    let cn = 0;
    const ink = (pts, w, s = 0.3, e = 0.4, col = K, op = 1) => hInk(pts, w, s, e, col, op);
    const fill = (pts, col, op = 1) => `<path d="${hPath(pts)}" fill="${col}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
    const clip = (pts, inner) => {
      const c = id + "c" + cn++;
      return `<clipPath id="${c}"><path d="${hPath(pts)}"/></clipPath><g clip-path="url(#${c})">${inner}</g>`;
    };
    // 部品: 逆光のふち→狭く濃い影→広い影→地の色 を光の側へずらして重ね、外形で切り抜く。inner は上に描く影・模様。最後に強弱のある主線
    const part = (pts, M, inner = "", opt = {}) => {
      const c = id + "c" + cn++, k = opt.k ?? 1, tr = (a) => `translate(${f(a * k)} ${f(-a * k * 0.2)})`, w = opt.w || [1.1, 3.2], u = (col, t) => `<use href="#${c}p" fill="${col}"${t ? ` transform="${t}"` : ""}/>`;
      // 同じ外形は1回だけ書いて use で重ねる(文字数を抑える)
      const sh = k ? `${u(M[2], tr(2.2))}${opt.flat ? "" : u(M[1], tr(5))}${u(M[0], tr(opt.flat ? 5 : 11))}` : "";
      return `<defs><path id="${c}p" d="${hPath(pts)}"/></defs><clipPath id="${c}"><use href="#${c}p"/></clipPath>${u(k ? opt.rc || C.rim : M[0])}<g clip-path="url(#${c})">${sh}${inner}</g>${w[1] ? hEdge(pts, w[0], w[1], K) : ""}`;
    };
    // 筒(腕・首): A→B の軸に沿って半径の表 prof [[t, 外側の半径, 内側の半径]]
    const tube = (A, B, prof) => {
      const dx = B[0] - A[0], dy = B[1] - A[1], Ln = Math.hypot(dx, dy) || 1, ux = dx / Ln, uy = dy / Ln, nx = -uy, ny = ux;
      const rad = (t, s) => {
        let i = 0;
        while (i < prof.length - 2 && prof[i + 1][0] < t) i++;
        const a = prof[i], b = prof[i + 1], k = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0]))), j = s >= 0 ? 1 : 2;
        return (a[j] ?? a[1]) + ((b[j] ?? b[1]) - (a[j] ?? a[1])) * k;
      };
      const at = (t, s) => {
        const r = rad(t, s) * s;
        return [A[0] + dx * t + nx * r, A[1] + dy * t + ny * r];
      };
      const cap = (P, sg, r1, r2) => [[P[0] + sg * ux * r1 * 0.62 + nx * r1 * 0.78 * sg, P[1] + sg * uy * r1 * 0.62 + ny * r1 * 0.78 * sg], [P[0] + sg * ux * (r1 + r2) * 0.45, P[1] + sg * uy * (r1 + r2) * 0.45], [P[0] + sg * ux * r2 * 0.62 - nx * r2 * 0.78 * sg, P[1] + sg * uy * r2 * 0.62 - ny * r2 * 0.78 * sg]];
      const pts = prof.map(([t]) => at(t, 1)).concat(cap(B, 1, rad(1, 1), rad(1, -1)), [...prof].reverse().map(([t]) => at(t, -1)), cap(A, -1, rad(0, -1), rad(0, 1)));
      return { pts, at, A, B, ang: Math.atan2(dy, dx) / DEG, L: Ln, u: [ux, uy], n: [nx, ny], sd: nx * HL[0] + ny * HL[1] > 0 ? -1 : 1 };
    };
    const FN = (v, t) => (typeof v === "function" ? v(t) : v);
    // 筒の上の帯(t0..t1、幅方向 s0..s1。関数も可)
    const tband = (T, t0, t1, s0, s1, m = 8) => {
      const A = [], B = [];
      for (let i = 0; i <= m; i++) {
        const t = t0 + ((t1 - t0) * i) / m;
        A.push(T.at(t, FN(s0, t)));
        B.push(T.at(t, FN(s1, t)));
      }
      return A.concat(B.reverse());
    };
    // 筒を一周する帯(円柱らしく弓なり)
    const ring = (T, t0, t1, bow = 0.03, m = 6, w = 1.2) => {
      const A = [], B = [];
      for (let i = 0; i <= m; i++) {
        const s = -w + (2 * w * i) / m, b = bow * (1 - Math.min(1, s * s));
        A.push(T.at(t0 + b, s));
        B.push(T.at(t1 + b, s));
      }
      return A.concat(B.reverse());
    };
    const tl = (T, list) => list.map(([t, s]) => T.at(t, s));
    const bump = (t0, t1, a) => (t) => a * Math.sin(Math.PI * Math.max(0, Math.min(1, (t - t0) / (t1 - t0))));
    // 筒の影(1段目は広く波打つ境目、2段目は狭く濃く)
    const tshade = (T, M, ph = 0, a = 0.08) => `${fill(tband(T, -0.1, 1.1, T.sd * 1.4, (t) => T.sd * (a + 0.16 * Math.sin(t * 7 + ph)), 12), M[1])}${fill(tband(T, -0.1, 1.1, T.sd * 1.4, (t) => T.sd * (0.66 + 0.08 * Math.sin(t * 11 + ph)), 12), M[2])}`;

    // ---------- 髪 ----------
    // 房: 根元 (rx,ry) 幅 w から先 (tx,ty) へ。b はしなり(S字)。根元が太く先がとがる
    const lockGeo = ([rx, ry, tx, ty, w, b = 0.15]) => {
      const dx = tx - rx, dy = ty - ry, Ln = Math.hypot(dx, dy), nx = -dy / Ln, ny = dx / Ln;
      const cl = (t) => {
        const s = b * Ln * (Math.sin(Math.PI * t) - 0.32 * Math.sin(2 * Math.PI * t));
        return [rx + dx * t + nx * s, ry + dy * t + ny * s];
      };
      const hw = (t) => (w / 2) * (0.62 + 0.38 * Math.sin((Math.PI / 2) * Math.min(1, t / 0.22))) * Math.pow(Math.max(0, 1 - t), 0.8) * (1 + 0.16 * Math.sin(Math.PI * Math.min(1, t * 1.7)));
      const at = (t, s) => {
        const p = cl(t), a = cl(Math.max(0, t - 0.01)), c = cl(Math.min(1, t + 0.01)), vx = c[0] - a[0], vy = c[1] - a[1], l = Math.hypot(vx, vy) || 1;
        return [p[0] - (vy / l) * s * hw(t), p[1] + (vx / l) * s * hw(t)];
      };
      const T = [0, 0.1, 0.24, 0.4, 0.56, 0.71, 0.84, 0.93];
      const pts = T.map((t) => at(t, 1)).concat([[tx, ty, 1]], [...T].reverse().map((t) => at(t, -1)));
      const m0 = at(0.4, 0), m1 = at(0.4, 1), g = (m1[0] - m0[0]) * HL[0] + (m1[1] - m0[1]) * HL[1] > 0 ? -1 : 1;
      return { pts, at, cl, g, Ln };
    };
    const HO = o ? [-6, -20] : [-4, -22], HR = o ? 70 : 74;
    const lock = (spec, i, rim = 1) => {
      const G = lockGeo(spec), g = G.g, M = C.hair, ph = i * 1.7;
      const band = (t0, t1, s0, s1, m = 6) => {
        const A = [], B = [];
        for (let j = 0; j <= m; j++) {
          const t = t0 + ((t1 - t0) * j) / m;
          A.push(G.at(t, FN(s0, t)));
          B.push(G.at(t, FN(s1, t)));
        }
        return A.concat(B.reverse());
      };
      // 天使の輪: 頭の中心から HR の距離を横切るところに光の帯
      let tr = 0.3, best = 1e9;
      for (let t = 0.12; t <= 0.7; t += 0.04) {
        const p = G.cl(t), dd = Math.abs(Math.hypot(p[0] - HO[0], p[1] - HO[1]) - HR);
        if (dd < best) (best = dd), (tr = t);
      }
      const h0 = tr - 0.14, h1 = tr + 0.16, hb = bump(h0, h1, 1);
      const inner = `${fill(band(-0.02, 1, g * 1.4, (t) => g * (0.02 + 0.22 * Math.sin(t * 8 + ph))), M[1])}${fill(band(-0.02, 0.96, g * 1.4, (t) => g * (0.6 + 0.12 * Math.sin(t * 10 + ph))), M[2])}
        ${fill(band(h0, h1, (t) => -g * (0.12 + 0.5 * hb(t)), (t) => -g * (0.12 - 0.12 * hb(t))), C.hi2, o ? 0.95 : 0.7)}${o ? fill(band(h0 + 0.03, h1 - 0.04, (t) => -g * (0.3 + 0.18 * hb(t)), (t) => -g * (0.3 - 0.04 * hb(t))), "#fff") : ""}
        ${ink([0.04, 0.2, 0.4, 0.6].map((t) => G.at(t, -g * 0.42)), 0.9, 0.2, 0.6, M[2], 0.9)}${ink([0.1, 0.3, 0.5, 0.72].map((t) => G.at(t, g * 0.1)), 0.8, 0.2, 0.6, M[2], 0.8)}${ink([0.3, 0.5, 0.7, 0.86].map((t) => G.at(t, -g * 0.6)), 0.7, 0.3, 0.6, C.hi, 0.7)}`;
      return part(G.pts, M, inner, { k: 0.3, w: [0.8, 2.6], rc: rim ? C.rim : M[2] });
    };
    const HAIR = o
      ? {
          back: [[-30, -66, -130, -46, 40, 0.14], [-44, -54, -138, 8, 40, 0.12], [-52, -34, -146, 74, 38, 0.1], [-54, -12, -128, 126, 34, 0.09], [-48, 10, -100, 150, 26, 0.08], [-36, 20, -68, 136, 18, 0.06], [-10, -74, -116, -90, 36, 0.16]],
          top: [[0, -78, -100, -66, 38, 0.18], [22, -70, -60, -90, 34, 0.16], [36, -58, -20, -100, 26, 0.14]],
          side: [[-40, -30, -60, 62, 18, 0.08], [-40, -16, -46, 50, 13, 0.06]],
          bang: [[44, -32, 46, 16, 20, -0.08], [30, -40, 22, 8, 24, 0.1], [16, -44, -6, 6, 26, 0.14], [-4, -44, -27, 10, 24, 0.12], [-24, -40, -41, 16, 22, 0.1], [-40, -30, -50, 54, 18, 0.07], [6, -46, 10, -2, 14, -0.12]],
        }
      : {
          back: [[-28, -62, -130, -92, 40, 0.12], [-40, -46, -142, -50, 40, 0.1], [-46, -26, -136, -8, 36, 0.1], [-48, -6, -118, 30, 30, 0.08], [-44, 10, -94, 56, 22, 0.06], [-16, -70, -120, -124, 38, 0.12]],
          top: [[-4, -70, -110, -126, 38, 0.12], [12, -70, -80, -142, 36, 0.12], [28, -62, -42, -142, 32, 0.12], [40, -50, -8, -128, 26, 0.12], [46, -36, 44, -100, 18, -0.08]],
          side: [[-36, -34, -64, 4, 16, 0.1], [-38, -22, -42, 20, 12, 0.06]],
          bang: [[44, -32, 47, 6, 16, -0.08], [32, -40, 22, 4, 20, 0.1], [16, -44, -2, -2, 20, 0.12], [-4, -44, -26, -8, 20, 0.1], [-22, -40, -43, -4, 18, 0.08], [4, -44, 10, -12, 12, -0.1]],
        };

    // ---------- 目 ----------
    const EYE = o
      ? { w: [[-15, -5, 1], [-9, -10.6], [2, -11.6], [9, -8.6], [13, -4, 1], [12.6, 1], [10, 5.6], [3, 8.4], [-5, 8.4], [-11, 5], [-14, 0]], ic: [0, -1.4], rx: 7.8, ry: 9.4, pr: [2.8, 4.2],
          lid: [[13.6, -3.6], [8, -9.8], [0, -12.2], [-9, -11.6], [-15.2, -6.6], [-19.4, -8.8], [-22, -12]], lw: 4,
          lash: [[[-11, -11.6], [-14.6, -15], [-17.6, -16]], [[-14.6, -8.6], [-19.6, -11.6], [-22.6, -11.6]], [[-6, -12.4], [-8, -15.6], [-10, -17]], [[-15.6, -5], [-20, -5.6], [-22, -4.4]]],
          dl: [[-12, -15.6], [-3, -16.8], [6, -15], [12, -10]], lo: [[-11.5, 5.4], [-5, 8.8], [3, 9.6], [9.4, 6.6]] }
      : { w: [[-16.4, -4.6, 1], [-9, -7], [0, -7.4], [8, -5.4], [13.4, -1.6, 1], [10.6, 2.2], [4.4, 4.2], [-3.6, 4.4], [-10.6, 2.6], [-14.6, -0.8]], ic: [0.4, -0.8], rx: 6.2, ry: 6.2, pr: [2.1, 2.5], lsw: 1.3,
          lid: [[14.2, -1.4], [9, -6], [1, -8.2], [-8, -8], [-15.6, -5.6], [-20.4, -7.2], [-24, -10]], lw: 3.9,
          lash: [[[-14, -7.6], [-18.4, -9.8], [-21.4, -10]], [[-10, -8.6], [-13, -11], [-15.4, -11.8]]],
          dl: [[-13, -11.4], [-4, -12.4], [5, -11.2], [11.6, -7.4]], lo: [[-12, 2.6], [-6, 4.6], [1, 5.2], [6.4, 4.4]] };
    const eye = (cx, cy, sx, sy, flip) => {
      const E = EYE, c2 = id + "c" + cn++, [ix, iy] = E.ic;
      let fib = "";
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + 0.2;
        fib += ink([[ix + Math.cos(a) * E.rx * 0.42, iy + Math.sin(a) * E.ry * 0.42], [ix + Math.cos(a) * E.rx * 0.88, iy + Math.sin(a) * E.ry * 0.88]], 0.55, 0.3, 0.5, i % 2 ? C.iris[2] : C.iris[0], 0.7);
      }
      const iris = `<clipPath id="${c2}"><ellipse cx="${ix}" cy="${iy}" rx="${E.rx}" ry="${E.ry}"/></clipPath>
        <ellipse cx="${ix}" cy="${iy}" rx="${E.rx}" ry="${E.ry}" fill="url(#${id}i)"/><g clip-path="url(#${c2})">${fib}
        <path d="M${ix - E.rx * 1.2} ${iy - E.ry * 0.2}C${ix - E.rx * 0.5} ${iy - E.ry * 0.62} ${ix + E.rx * 0.5} ${iy - E.ry * 0.62} ${ix + E.rx * 1.2} ${iy - E.ry * 0.16}L${ix + E.rx * 1.2} ${iy - E.ry * 1.2}L${ix - E.rx * 1.2} ${iy - E.ry * 1.2}Z" fill="${C.iris[0]}" opacity=".9"/>
        <path d="M${ix - E.rx * 0.8} ${iy + E.ry * 0.3}C${ix - E.rx * 0.3} ${iy + E.ry * 0.75} ${ix + E.rx * 0.4} ${iy + E.ry * 0.75} ${ix + E.rx * 0.85} ${iy + E.ry * 0.28}C${ix + E.rx * 0.6} ${iy + E.ry * 1.1} ${ix - E.rx * 0.6} ${iy + E.ry * 1.1} ${ix - E.rx * 0.8} ${iy + E.ry * 0.3}Z" fill="${C.iris[2]}" opacity=".9"/></g>
        <ellipse cx="${ix}" cy="${iy}" rx="${E.rx}" ry="${E.ry}" fill="none" stroke="${K}" stroke-width="1.1"/><ellipse cx="${ix}" cy="${iy}" rx="${E.rx * 0.8}" ry="${E.ry * 0.8}" fill="none" stroke="${C.iris[0]}" stroke-width=".5" opacity=".7"/>
        <ellipse cx="${ix}" cy="${iy + 0.2}" rx="${E.pr[0]}" ry="${E.pr[1]}" fill="#04070c"/>`;
      const hi = `<ellipse cx="${f(ix - E.rx * 0.38)}" cy="${f(iy - E.ry * 0.42)}" rx="${f(E.rx * 0.38)}" ry="${f(E.ry * 0.26)}" fill="#fff" transform="rotate(-20 ${f(ix - E.rx * 0.38)} ${f(iy - E.ry * 0.42)})"/><circle cx="${f(ix + E.rx * 0.5)}" cy="${f(iy + E.ry * 0.42)}" r="${f(E.rx * 0.15)}" fill="#fff"/><circle cx="${f(ix - E.rx * 0.05)}" cy="${f(iy - E.ry * 0.62)}" r="${f(E.rx * 0.07)}" fill="#fff" opacity=".8"/>`;
      const white = E.w.map((p) => [p[0], p[1] - 3]);
      return `<g transform="translate(${cx} ${cy}) scale(${f((flip ? -1 : 1) * sx)} ${f(sy)})">
        ${clip(E.w, `${fill(E.w, "#fbfcff")}${fill(white.map((p) => [p[0], p[1] + 2.6]), "#c3cfe0")}${fill(white, "#8f9db8")}${iris}${hi}`)}
        ${ink(E.lid, E.lw, 0.32, 0.16)}${E.lash.map((l) => ink(l, E.lsw || 1.7, 0, 0.85)).join("")}
        ${ink([E.w[0], [E.w[0][0] + 1.2, E.w[0][1] + 4], [E.w[0][0] + 4.4, E.w[0][1] + 7.4]], 1.5, 0, 0.8)}
        ${ink(E.dl, 1.05, 0.4, 0.4, K, 0.8)}${ink(E.lo, 1.1, 0.4, 0.6, K, 0.75)}${ink([E.lo[1], [E.lo[1][0] - 1.6, E.lo[1][1] + 2.4]], 0.7, 0, 0.8, K, 0.7)}${ink([E.lo[0], [E.lo[0][0] - 1.8, E.lo[0][1] + 2]], 0.7, 0, 0.8, K, 0.7)}
        ${ink(E.lo.map((p) => [p[0] + 1, p[1] + 4.2]), 0.9, 0.5, 0.5, S[2], 0.6)}</g>`;
    };

    // ---------- 口 ----------
    const openM = (pts, teeth, tongue) => `${fill(pts, "#541220")}${clip(pts, `${fill(teeth, "#fff")}${fill(tongue, "#cf6670")}`)}${hEdge(pts, 0.6, 1.8, K)}`;
    const mouth = {
      smirk: `${ink([[0, 44.6], [7, 46], [14, 44.8], [22, 38.6]], 2.4, 0.2, 0.3)}${ink([[20.6, 36.4], [24.4, 39.4]], 1.6, 0.2, 0.6)}${ink([[6, 51.6], [9, 51.9], [12, 51]], 1.8, 0.5, 0.5, S[2])}`,
      smile: `${ink([[-2, 44], [5, 47.4], [13, 46.8], [21.5, 39.4]], 2.4, 0.2, 0.3)}${ink([[20, 37.6], [23.6, 39.6]], 1.6, 0.2, 0.6)}${ink([[5, 52.6], [8.5, 53], [12, 52]], 1.8, 0.5, 0.5, S[2])}`,
      shout: openM([[-4, 39], [4, 36.6], [14, 36.2], [23, 38.4], [21.6, 48], [16, 57.4], [8, 61], [1, 58], [-3, 49]], [[-6, 34], [26, 34], [24, 41.4], [12, 40.4], [-6, 42.4]], [[0, 56], [6, 51.6], [13, 51.4], [18, 55], [12, 64], [4, 63]]),
      grin: openM([[-5, 38], [6, 41], [16, 40.4], [25, 34], [23, 45], [16, 54], [8, 56], [0, 53], [-4, 46]], [[-8, 34], [28, 30], [24, 41.6], [12, 45.4], [-6, 44]], [[1, 52], [7, 48.6], [14, 48.6], [18, 52], [10, 58]]),
      calm: `${ink([[3, 50.4], [10, 50.7], [16, 49.9], [21.4, 47.2]], 2.3, 0.25, 0.35)}${ink([[7, 56.4], [10, 56.9], [13.5, 56.2]], 1.8, 0.5, 0.5, S[2])}`,
      say: openM([[3, 48.6], [9, 47.3], [15, 47.2], [20.4, 48], [18.8, 52.6], [14.8, 56], [10.6, 56.4], [6.4, 54], [3.6, 51]], [[0, 46], [23, 46], [21, 50], [12, 50.6], [1, 50.2]], [[6, 55.6], [10, 52.8], [14.5, 53], [17.4, 55.4], [12, 58]]) + ink([[8, 61], [10.5, 61.3], [13, 60.6]], 1.6, 0.5, 0.5, S[2]),
      quiet: `${ink([[1.6, 49.6], [7, 51.8], [14, 51.6], [21.6, 46.6]], 2.3, 0.2, 0.3)}${ink([[20.2, 45], [23.4, 47.4]], 1.5, 0.2, 0.6)}${ink([[7, 57.2], [10, 57.4], [13, 56.6]], 1.6, 0.5, 0.5, S[2])}`,
      glare: `${ink([[4, 51.4], [11, 50.6], [18.6, 49.8], [21.6, 51.6]], 2.5, 0.2, 0.25)}${ink([[7, 57], [10, 57.3], [13, 56.6]], 1.6, 0.5, 0.5, S[2])}${ink([[2, 47], [3.6, 50.6]], 0.9, 0.4, 0.4, S[2], 0.7)}`,
      grit: `${fill([[-3, 41.6], [9, 40.6], [21, 39], [20.6, 43], [20.2, 47], [9, 47.8], [-2, 48.6], [-2.6, 45]], "#fff")}${ink([[-2.6, 45], [9, 44.2], [20.6, 43]], 1.1, 0, 0)}${[2.6, 8.6, 14.6].map((x) => ink([[x, 41], [x + 0.4, 47.8]], 0.9, 0.3, 0.3)).join("")}${hEdge([[-3, 41.6], [9, 40.6], [21, 39], [20.6, 43], [20.2, 47], [9, 47.8], [-2, 48.6], [-2.6, 45]], 0.7, 2, K)}`,
    };

    // ---------- 顔(斜め右向き)。原点は両目の間、あご先は y≈73(相手は 66) ----------
    const FACE = o
      ? [[-42, -44], [-45.5, -20], [-45, 2], [-42, 20], [-37, 34], [-28, 46], [-15, 56], [-2, 63.5], [8, 66.6], [15, 66], [21, 61], [29, 51], [36, 37], [40.4, 22], [40, 8], [39.4, -4], [41, -20], [40.4, -34], [39, -44]]
      : [[-41, -44], [-43.6, -22], [-43, 0], [-41, 18], [-37.4, 32], [-31, 44], [-20, 56], [-6, 66], [4.6, 72.6], [11, 73.8], [17, 70.6], [24, 62], [31, 48], [36.4, 32], [38.4, 18], [37, 6], [37.4, -4], [39.4, -18], [39, -32], [37, -44]];
    const head = (ex) => {
      if (!o && ex === "grit") ex = "glare";
      const gl = ex === "glare" || ex === "grit", ny = o ? -3 : 0;
      const bang = (o ? [[-50, -46], [50, -46], [46, -12], [41, -2, 1], [36, -14], [28, -4, 1], [20, -16], [12, 2, 1], [6, -12], [-2, 6, 1], [-8, -12], [-17, 8, 1], [-24, -10], [-34, 12, 1], [-40, -8], [-47, 4]] : [[-50, -46], [50, -46], [46, -14], [44, -2, 1], [38, -18], [30, -6, 1], [24, -18], [16, -6, 1], [8, -18], [-2, -10, 1], [-10, -20], [-24, -12, 1], [-30, -20], [-40, -8, 1], [-47, -14]]);
      const faceIn = `${fill(bang, S[1])}${fill(bang.map((p) => [p[0], p[1] - 5, p[2]]), S[2], 0.8)}
        ${fill([[-50, -10], [-41, -12], [-37.6, 4], [-35.4, 20], [-30.6, 34], [-21, 48], [-8, 60], [2, 70], [-20, 74], [-52, 40]], S[1])}${fill([[-50, 0], [-43.4, 4], [-40.6, 20], [-35, 34], [-25, 47], [-31, 50], [-50, 30]], S[2])}
        ${fill([[2, 62 + ny], [10, 66 + ny], [17, 64 + ny], [13, 76], [2, 76]], S[1], 0.8)}
        ${ink([[39, -14], [37.6, 4], [38.8, 20], [33.6, 40], [25, 58], [16, 69 + ny]], 3.4, 0.3, 0.4, "#fff", 0.55)}
        ${o ? `<ellipse cx="22" cy="${24 + ny}" rx="11" ry="6" fill="url(#${id}b)"/><ellipse cx="-20" cy="${28 + ny}" rx="13" ry="7" fill="url(#${id}b)"/>` : ""}
        ${o ? "" : ink([[-30, 44], [-19, 54], [-8, 61]], 1.3, 0.4, 0.5, S[2], 0.7)}`;
      const ear = [[-41, -4], [-47, -9], [-53.4, -6], [-56.4, 4], [-55, 15], [-51, 24], [-45, 29], [-40, 27]];
      const earIn = `${fill([[-44, -2], [-50, -3], [-52, 6], [-50, 16], [-46, 22], [-43, 18]], S[1])}${fill([[-45, 4], [-48.6, 6], [-48, 14], [-45.4, 17], [-44, 10]], S[2])}${ink([[-43, -5], [-50.4, -5.4], [-53.4, 3], [-51.6, 16], [-46.6, 24]], 1.2, 0.3, 0.5)}${ink([[-46, 8], [-48, 12], [-46.4, 16]], 0.9, 0.3, 0.4)}`;
      const nose = `${ink([[12, -4 + ny], [14.4, 8 + ny], [16.6, 20 + ny]], 1.2, 0.5, 0.5, S[2], 0.6)}${ink([[17.6, 23.6 + ny], [19.4, 29.6 + ny], [17.4, 33.4 + ny], [13, 34.8 + ny]], 1.9, 0.4, 0.4)}${ink([[10.4, 33 + ny], [12.6, 34.6 + ny]], 1.2, 0.4, 0.4)}${fill([[9.6, 35.6 + ny], [17, 34.8 + ny], [14, 39 + ny]], S[1])}${fill([[13, 22 + ny], [18, 30 + ny], [16, 33 + ny], [12, 32 + ny]], S[1], 0.8)}<ellipse cx="17.6" cy="${27.6 + ny}" rx="1.2" ry="2" fill="#fff" opacity=".7"/>`;
      const eyes = o ? `${eye(-17, 4, 0.98, gl ? 0.82 : 0.96, 0)}${eye(24, 3, 0.7, gl ? 0.82 : 0.94, 1)}` : `${eye(-17.5, 6.4, 1, gl ? 0.7 : 0.9, 0)}${eye(23.6, 5.4, 0.72, gl ? 0.7 : 0.9, 1)}`;
      const by = gl ? 2.6 : 0, fr = gl ? 1.6 : 0;
      const brow = (pts) => `${fill(pts, C.brow)}${hEdge(pts, 0.2, 0.6, C.brow)}`;
      const brows = o
        ? `${brow([[-3, -7 + fr, 1], [-12, -11 + fr], [-24, -15.4 + fr], [-36, -15.2, 1], [-25, -12 + fr], [-13, -7.6 + fr], [-4, -3.6 + fr, 1]])}${brow([[12.6, -7.4 + fr, 1], [20, -12 + fr], [30, -15 + fr], [38.4, -15, 1], [30, -11.6 + fr], [21, -8 + fr], [13.2, -3.8 + fr, 1]])}`
        : `${brow([[-2.6, -5 + by, 1], [-10, -8.6 + by], [-20, -10.6 + by * 0.6], [-31, -11.8], [-39, -11.4, 1], [-30, -9 + by * 0.5], [-19, -7 + by * 0.6], [-9, -4 + by], [-3.2, -1.6 + by, 1]])}${brow([[12.6, -5.4 + by, 1], [19, -8.4 + by], [28, -11 + by * 0.5], [37, -12, 1], [29, -8.6], [20, -5.2 + by], [13, -1.8 + by, 1]])}`;
      const sweat = ex === "grit" || gl ? `<path d="M30 30C26.6 36 27 40.6 30.4 41.2C33.8 40.6 33.8 36 30 30Z" fill="#dff6ff"/>${hEdge([[30, 30, 1], [32.6, 36.4], [30.4, 41.2], [27.6, 37.2]], 0.5, 1.2, K)}<ellipse cx="29.2" cy="37.4" rx=".8" ry="1.4" fill="#fff"/>` : "";
      const cap = o ? [[-54, 6], [-58, -24], [-48, -56], [-24, -76], [4, -80], [30, -73], [46, -54], [49, -30], [47, -16, 1], [42, -30], [36, -24, 1], [30, -36], [20, -28, 1], [12, -40], [2, -32, 1], [-8, -42], [-18, -32, 1], [-28, -40], [-38, -28, 1], [-44, -32], [-48, -10]] : [[-53, 4], [-58, -24], [-48, -56], [-24, -75], [4, -79], [30, -72], [46, -52], [49, -28], [47, -14, 1], [42, -28], [36, -22, 1], [30, -34], [20, -26, 1], [12, -38], [2, -30, 1], [-8, -40], [-18, -30, 1], [-28, -38], [-38, -26, 1], [-44, -30], [-48, -8]];
      const capIn = `${fill([[-44, -40], [-32, -60], [-10, -70], [14, -68], [32, -58], [24, -54], [6, -60], [-12, -60], [-30, -50]], C.hi2, o ? 0.9 : 0.6)}`;
      const shades = o ? "" : `${ink([[-40, -46], [-48, -38], [-56, -30]], 5.4, 0, 0.1)}${ink([[-41, -45.4], [-48, -38.6], [-54.6, -31.4]], 2.4, 0, 0.1, "#4a5870")}
        ${part([[-42, -50], [-22, -64], [2, -67.4], [26, -64], [47, -50], [46.4, -43], [40, -37.8], [32, -39.2], [20, -43.6], [6, -44], [-6, -45.6], [-20, -44.6], [-34, -36.6], [-40.6, -39.6]], ["#f0701a", "#c4500f", "#8a2c10"], `<rect x="-60" y="-80" width="120" height="50" fill="url(#${id}v)" opacity=".85"/>${fill([[-31, -53], [-19, -59], [-24, -43], [-33, -40]], "#fff", 0.55)}${fill([[-13, -60], [-6, -61], [-12, -45.6], [-17, -44.6]], "#fff", 0.45)}${ink([[-40, -49], [-20, -61.6], [4, -64.6], [28, -61], [45, -49]], 1.6, 0.2, 0.2, "#ffe2b0", 0.8)}`, { k: 0.2, rc: "#ffcf7a", w: [1, 2.6] })}
        ${ink([[-42, -50], [-22, -64], [2, -67.4], [26, -64], [47, -50]], 3.2, 0.1, 0.1, "#4a5870")}`;
      return `${HAIR.back.map(lock).join("")}
        ${part(ear, S, earIn, { k: 0.3, w: [0.9, 2.4] })}
        ${part(FACE, S, faceIn, { k: 0, w: [1.2, 3.4] })}
        ${nose}${mouth[o ? (ex === "smile" || ex === "grin" ? (ex === "grin" ? "grin" : "smirk") : ex) : ex] || mouth.calm}
        ${eyes}${brows}${sweat}
        ${HAIR.bang.map((l, i) => lock(l, i + 30, 0)).join("")}
        ${part(cap, C.hair, capIn, { k: 0.6, w: [1, 2.8], rc: C.hair[2] })}
        ${HAIR.side.map((l, i) => lock(l, i + 20, 0)).join("")}${HAIR.top.map((l, i) => lock(l, i + 10)).join("")}${shades}`;
    };
    const defs = `<defs><linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.iris[0]}"/><stop offset=".55" stop-color="${C.iris[1]}"/><stop offset="1" stop-color="${C.iris[2]}"/></linearGradient><linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc060"/><stop offset=".45" stop-color="#f0701a"/><stop offset="1" stop-color="#8a2c10"/></linearGradient><radialGradient id="${id}b"><stop offset="0" stop-color="#ff8a7a" stop-opacity=".22"/><stop offset="1" stop-color="#ff8a7a" stop-opacity="0"/></radialGradient></defs>`;
    if (pose === "pinch") return `<svg class="cn-hero dl-svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${defs}<g transform="translate(192 90) scale(2.3)">${head("grit")}</g></svg>`;

    const PT = o ? HERO_POSE : HERO_POSE_YOU, P = PT[pose] || PT.base;
    const [hx, hy, hr] = P.head, hsc = o ? 1.24 : 1.18;
    // 顔の座標 → 全体の座標
    const hp = (x, y) => {
      const c = Math.cos(hr * DEG), s = Math.sin(hr * DEG);
      return [hx + (x * c - y * s) * hsc, hy + (x * s + y * c) * hsc];
    };
    // 胴の点: 手前の肩(wn)・奥の肩(wf)の動きにつられて動く
    const TP = (x, y, wn = 0, wf = 0, c = 0) => [x + P.dn[0] * wn + P.df[0] * wf, y + P.dn[1] * wn + P.df[1] * wf, c];

    // ---------- カード(裏面)。手の平面に貼るので、局所座標で描く ----------
    const cardG = `<rect x="-27" y="-39" width="54" height="78" rx="4.5" fill="#24120a"/><rect x="-22" y="-34" width="44" height="68" rx="2.5" fill="#3a1c0c" stroke="#c9a24a" stroke-width="2"/>
      <path d="M-22 -34L22 34M22 -34L-22 34" stroke="#c9a24a" stroke-width="1" opacity=".45"/><path d="M-18 -30L18 -30L18 30L-18 30Z" fill="none" stroke="#c9a24a" stroke-width=".7" stroke-dasharray="2 2" opacity=".7"/>
      <circle r="12" fill="#24120a" stroke="#c9a24a" stroke-width="2"/><circle r="8" fill="none" stroke="#c9a24a" stroke-width=".8"/><circle r="4.6" fill="#ffcf3d"/><circle cx="-1.4" cy="-1.6" r="1.6" fill="#fff8d0"/>
      <path d="M-25 -37L-6 -37L-25 -8Z" fill="#fff" opacity=".22"/><rect x="-27" y="-39" width="54" height="78" rx="4.5" fill="none" stroke="${K}" stroke-width="2.4"/>`;

    // ---------- 手 ----------
    // 手首を原点に指先は -y、手の甲は +z(見る人の側)。右手で作り、flip で左手。指は付け根から 3 節(長さ 3:2:1.5)
    const FING = [
      { b: [-14.6, -47.4], L: [19.5, 13, 9.8], r: [5.5, 5, 4.5] },
      { b: [-4.2, -50.6], L: [21, 14, 10.5], r: [5.7, 5.2, 4.6] },
      { b: [5.8, -48.8], L: [20, 13.3, 10], r: [5.4, 4.9, 4.4] },
      { b: [14.6, -44], L: [15.6, 10.4, 8], r: [4.8, 4.3, 3.9] },
    ];
    const THUMB = { b: [-11, -11], L: [21, 16, 13], r: [7, 6.1, 5.4] };
    const PALM = [[-13, 2], [0, 3.4], [13, 2], [17.6, -14], [19.6, -30], [17.6, -39], [10.4, -44.6], [0, -47.2], [-10, -46.6], [-18, -43], [-21, -32], [-18.6, -16]];
    // 手の形: 指 [開き, 付け根・第2・第1関節の曲げ]、親指 [向き, 手のひら側へのひねり, 曲げ3つ]、roll=前腕まわりの回転、pitch=前後の傾き
    const HANDS = {
      card: { f: [[-5, 6, 8, 4, 3], [3, 8, 10, 6, -3], [10, 92, 100, 52], [16, 88, 98, 50]], t: [-40, 30, 10, 16, 12], roll: 10, pitch: -14, card: { c: [-5, -90, -2], r: -8, s: 1 } },
      open: { f: [[-22, 6, 8, 5], [-6, 5, 9, 5], [10, 10, 13, 7], [27, 18, 18, 10]], t: [-52, 30, 8, 12, 10], roll: 170, pitch: -12 },
      fist: { f: [[-2, 92, 100, 62], [0, 94, 100, 62], [3, 94, 100, 60], [6, 92, 100, 60]], t: [-30, 50, 40, 55, 42], roll: 30, pitch: 0 },
      fistUp: { f: [[-2, 92, 100, 62], [0, 94, 100, 62], [3, 94, 100, 60], [6, 92, 100, 60]], t: [-30, 50, 40, 55, 42], roll: 190, pitch: -20 },
      deck: { f: [[-4, 40, 62, 30], [0, 38, 66, 32], [4, 40, 66, 30], [8, 44, 62, 28]], t: [-26, 64, 12, 18, 14], roll: 160, pitch: -10, deck: { c: [1, -36, -18], r: 2, s: 0.82 } },
    };
    const hand = (kind, W, ang, s, flip, hv = {}) => {
      const H = HANDS[kind] || HANDS.fist, R = (H.roll + (hv.roll || 0)) * DEG, Pt = (H.pitch + (hv.pitch || 0)) * DEG, A = ang * DEG, cR = Math.cos(R), sR = Math.sin(R), cP = Math.cos(Pt), sP = Math.sin(Pt), cA = Math.cos(A), sA = Math.sin(A);
      const T = ([x, y, z = 0]) => {
        if (flip) x = -x;
        const x1 = x * cR + z * sR, z1 = -x * sR + z * cR, y2 = y * cP - z1 * sP, z2 = y * sP + z1 * cP;
        return [W[0] + s * (x1 * cA - y2 * sA), W[1] + s * (x1 * sA + y2 * cA), z2];
      };
      // 平面(原点 o、横 ex、縦 ey)を画面へ写す行列
      const mat = (o3, ex, ey) => {
        const p0 = T(o3), px = T([o3[0] + ex[0], o3[1] + ex[1], o3[2] + ex[2]]), py = T([o3[0] + ey[0], o3[1] + ey[1], o3[2] + ey[2]]);
        return `matrix(${[px[0] - p0[0], px[1] - p0[1], py[0] - p0[0], py[1] - p0[1], p0[0], p0[1]].map((v) => Math.round(v * 1000) / 1000).join(" ")})`;
      };
      const nz = T([0, 0, 1])[2] - T([0, 0, 0])[2]; // 手の甲が見えているか
      const items = [];
      const capsule = (P1, P2, r1, r2) => {
        let dx = P2[0] - P1[0], dy = P2[1] - P1[1], l = Math.hypot(dx, dy);
        if (l < 0.01) (dx = 0), (dy = -1), (l = 1);
        const ux = dx / l, uy = dy / l, nx = -uy, ny = ux, m = [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2], rm = ((r1 + r2) / 2) * 1.05;
        return [[P1[0] + nx * r1, P1[1] + ny * r1], [m[0] + nx * rm, m[1] + ny * rm], [P2[0] + nx * r2, P2[1] + ny * r2], [P2[0] + (ux * 0.72 + nx * 0.7) * r2, P2[1] + (uy * 0.72 + ny * 0.7) * r2], [P2[0] + ux * r2, P2[1] + uy * r2], [P2[0] + (ux * 0.72 - nx * 0.7) * r2, P2[1] + (uy * 0.72 - ny * 0.7) * r2], [P2[0] - nx * r2, P2[1] - ny * r2], [m[0] - nx * rm, m[1] - ny * rm], [P1[0] - nx * r1, P1[1] - ny * r1], [P1[0] - (ux * 0.72 + nx * 0.7) * r1, P1[1] - (uy * 0.72 + ny * 0.7) * r1], [P1[0] - ux * r1, P1[1] - uy * r1], [P1[0] - (ux * 0.72 - nx * 0.7) * r1, P1[1] - (uy * 0.72 - ny * 0.7) * r1]];
      };
      // 指1本: 関節の3D位置と、各節の背の向き
      const chain = (base, Ls, a, fl, roll = 0) => {
        const u = [Math.sin(a * DEG), -Math.cos(a * DEG), 0], pp = [Math.cos(a * DEG), Math.sin(a * DEG), 0], cr = Math.cos(roll * DEG), sr = Math.sin(roll * DEG);
        const b = [pp[0] * sr, pp[1] * sr, -cr];
        let p = base.slice(), F = 0;
        const J = [p], N = [];
        for (let i = 0; i < 3; i++) {
          F += fl[i] * DEG;
          const d = [u[0] * Math.cos(F) + b[0] * Math.sin(F), u[1] * Math.cos(F) + b[1] * Math.sin(F), u[2] * Math.cos(F) + b[2] * Math.sin(F)];
          p = [p[0] + d[0] * Ls[i], p[1] + d[1] * Ls[i], p[2] + d[2] * Ls[i]];
          J.push(p);
          N.push([-b[0] * Math.cos(F) + u[0] * Math.sin(F), -b[1] * Math.cos(F) + u[1] * Math.sin(F), -b[2] * Math.cos(F) + u[2] * Math.sin(F)]);
        }
        return { J, N };
      };
      // 伸びた指は節をつないだ1本の形(関節で少しふくらむ)で描く。曲げた指は節ごとの筒
      const fingerOne = (P, R) => {
        const L = [], Rt = [], dir = (i) => {
          const a = P[Math.max(0, i - 1)], b = P[Math.min(3, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
          return [dx / l, dy / l];
        };
        for (let i = 0; i < 4; i++) {
          const [ux, uy] = dir(i), w = R[i];
          L.push([P[i][0] - uy * w, P[i][1] + ux * w]);
          Rt.push([P[i][0] + uy * w, P[i][1] - ux * w]);
          if (i < 3) {
            const m = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2], [vx, vy] = dir(i + 0.5 | 0), wm = ((R[i] + R[i + 1]) / 2) * 0.93;
            L.push([m[0] - vy * wm, m[1] + vx * wm]);
            Rt.push([m[0] + vy * wm, m[1] - vx * wm]);
          }
        }
        const [ux, uy] = dir(3), [bx, by] = dir(0), t = P[3], r = R[3], b0 = P[0], r0 = R[0];
        return L.concat([[t[0] + (ux * 0.7 - uy * 0.7) * r, t[1] + (uy * 0.7 + ux * 0.7) * r], [t[0] + ux * r, t[1] + uy * r], [t[0] + (ux * 0.7 + uy * 0.7) * r, t[1] + (uy * 0.7 - ux * 0.7) * r]], Rt.reverse(), [[b0[0] - bx * r0, b0[1] - by * r0]]);
      };
      // 部品の塗り: 肌もグローブも影2段+逆光。影のずれは手の大きさに合わせる。部品の線は細く、外形の太い線は最後にまとめて下に敷く
      const SK = { k: (0.42 * s) / 1.3, w: [0.35, 1.05], rc: "#ffe6d6" }, GK = { k: (0.5 * s) / 1.3, w: [0.4, 1.15] }, lw = s / 1.3;
      // 指1本。手袋は付け根の関節までで、指は素肌(親指は付け根の骨だけ手袋)。背側は関節のしわと爪、腹側は節の境のしわ
      const finger = (J, N, r, bias, thumb, one) => {
        const P = J.map(T), R = [r[0], r[1], r[2], r[2] * 0.8].map((v) => v * s), zf = (P[0][2] + P[3][2]) / 2 + bias;
        let det = "";
        for (let i = 0; i < 3; i++) {
          const a = P[i], b = P[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, nx = -uy, ny = ux, r1 = R[i], r2 = R[i + 1];
          const q = (off, w, o2 = a) => [o2[0] + ux * off + nx * w, o2[1] + uy * off + ny * w];
          const dn = T([J[i][0] + N[i][0], J[i][1] + N[i][1], J[i][2] + N[i][2]])[2] - T(J[i])[2];
          const cap = capsule(a, b, r1, r2), gl = false, z = (one ? zf : (a[2] + b[2]) / 2 + bias) + i * 0.01;
          let d = "";
          if (!gl) {
            // 節の側面の影(光と反対側を細く)と、ふくらみの照り
            const sd = nx * HL[0] + ny * HL[1] > 0 ? -1 : 1;
            d += fill([q(-1, sd * r1 * 1.3), q(l + 1, sd * r2 * 1.3, a), q(l + 1, sd * r2 * 0.5), q(-1, sd * r1 * 0.45)], S[1], 0.85);
            if (l > r1 * 1.1) d += ink([q(l * 0.2, -sd * r1 * 0.45), q(l * 0.75, -sd * r2 * 0.5)], 1.1 * lw, 0.4, 0.4, "#fff", 0.45);
            if (dn > 0.15) {
              if (i > 0) {
                d += ink([q(0.4, r1 * 0.62), q(1.8, 0), q(0.4, -r1 * 0.62)], 0.75 * lw, 0.35, 0.35, S[2], 0.95);
                if (l > r1 * 1.3) d += ink([q(3, r1 * 0.42), q(3.9, 0), q(3, -r1 * 0.42)], 0.55 * lw, 0.35, 0.35, S[2], 0.75);
              }
              if (i === 2 && dn > 0.3 && l > r1 * 0.8) {
                const p1 = q(l * 0.36, 0), p2 = q(l + r2 * 0.35, 0), nl = capsule(p1, p2, r2 * 0.68, r2 * 0.62);
                d += `${fill(nl, C.nail)}${hEdge(nl, 0.25, 0.6, S[2])}${ink([q(l * 0.5, -r2 * 0.25), q(l * 0.85, -r2 * 0.28)], 0.9 * lw, 0.3, 0.3, "#fff", 0.9)}`;
              }
            } else if (dn < -0.15 && i > 0) {
              d += ink([q(-0.6, r1 * 0.66), q(0.5, 0), q(-0.6, -r1 * 0.66)], 0.8 * lw, 0.3, 0.3, S[2], 0.9);
            }
          }
          if (one && !gl) det += d;
          else items.push({ z, pts: cap, g: part(cap, gl ? C.gl : S, d, gl ? GK : SK) });
          // 親指の付け根の骨は手袋の中(親指の穴の縁に縫い目)
          if (thumb && i === 0) {
            const m = q(l * 0.66, 0), gc = capsule(a, m, r1 * 1.1, r1 * 1.02), e = q(l * 0.66 - 1.4 * lw, 0);
            items.push({ z: z + 0.02, pts: gc, g: part(gc, C.gl, ink([[e[0] + nx * r1 * 0.95, e[1] + ny * r1 * 0.95], [e[0] - nx * r1 * 0.95, e[1] - ny * r1 * 0.95]], 0.7 * lw, 0.2, 0.2, C.st, 0.85), GK) });
          }
        }
        if (one) {
          const pts = fingerOne(P, R);
          items.push({ z: zf - 0.02, pts, g: part(pts, S, det, SK) });
        }
      };
      // カードは人差し指と中指の間にはさむ(人差し指が手前、中指が奥)
      const fz = [H.card ? 6 : 0, H.card ? -6 : 0, 0, 0], zr = [];
      FING.forEach((F, i) => {
        const [a, f1, f2, f3] = H.f[i], { J, N } = chain([F.b[0], F.b[1], -5.5], F.L, a, [f1, f2, f3]);
        zr.push((T(J[0])[2] + T(J[1])[2] + T(J[2])[2]) / 3);
        finger(J, N, F.r, fz[i], false, f1 + f2 + f3 < 70);
      });
      {
        const [a, rl, f1, f2, f3] = H.t, { J, N } = chain([THUMB.b[0], THUMB.b[1], -8], THUMB.L, a, [f1, f2, f3], rl);
        finger(J, N, THUMB.r, 0.5, true, f1 + f2 + f3 < 70);
      }
      // 甲と手のひら(指切りグローブ)。甲側: 手首のベルト・関節の硬い当て・縫い目・紋、手のひら側: 当て布と縫い目
      // 手のひらは厚みのある板: 甲(z=0)と手のひら(z=-12)の点を写して外側を包む
      const pp = hull(PALM.map((p) => T([p[0], p[1], 0])).concat(PALM.map((p) => T([p[0] * 0.95, p[1] * 0.96, -12]))));
      const back = `<g transform="${nz > 0 ? mat([0, 0, 0], [1, 0, 0], [0, 1, 0]) : mat([0, 0, -12], [1, 0, 0], [0, 1, 0])}">${nz > 0
        ? `<path d="M-24 -3C-8 -1 8 -1 24 -3L24 -14C8 -12 -8 -12 -24 -14Z" fill="${C.st2}"/><path d="M-24 -12C-8 -10 8 -10 24 -12L24 -14C8 -12 -8 -12 -24 -14Z" fill="#fff" opacity=".3"/><path d="M-24 -8.6C-8 -6.8 8 -6.8 24 -8.6" fill="none" stroke="${K}" stroke-width=".6" stroke-dasharray="1.6 1.4" opacity=".7"/>
          <path d="M-16 -16C-15 -24 -13 -29 -11 -33M16 -16C16 -24 15 -28 14 -32" fill="none" stroke="${C.gl[0]}" stroke-width=".7" stroke-dasharray="1.6 1.4"/>
          <path d="M-9 -17C-8 -24 -7 -29 -6 -33M3 -17C3 -24 3.4 -29 4 -33M12 -17C11.6 -24 11 -28 10.6 -32" fill="none" stroke="${C.gl[2]}" stroke-width="1.1" opacity=".55"/>
          <path d="M0 -31C2.2 -27.4 3.6 -25.4 4.6 -23C2.4 -20.8 1 -19 0 -16C-1 -19 -2.4 -20.8 -4.6 -23C-3.6 -25.4 -2.2 -27.4 0 -31Z" fill="${C.st}"/><path d="M0 -31C-2.2 -27.4 -3.6 -25.4 -4.6 -23L0 -23Z" fill="#fff" opacity=".35"/>
          <path d="M-21 -34C-12 -39 10 -41 20 -34L19.4 -43C10 -49 -12 -48 -20.4 -43Z" fill="${C.gl[0]}" stroke="${K}" stroke-width=".9"/><path d="M-19 -41C-10 -46 9 -47 18 -41" fill="none" stroke="#fff" stroke-width="1.2" opacity=".35"/>
          <path d="M-9.4 -36.6L-9.8 -45.6M0.6 -37.6L0.6 -47M10.4 -36.6L10.6 -45.6" stroke="${K}" stroke-width=".8" opacity=".8"/><path d="M-19 -35.6C-10 -39.4 9 -41 18.6 -35.6" fill="none" stroke="${C.gl[2]}" stroke-width="1.6" opacity=".7"/>`
        : `<path d="M-16 -18C-12 -34 10 -38 16 -24C17 -10 4 -5 -6 -7C-13 -9 -17 -13 -16 -18Z" fill="${C.gl[0]}"/><path d="M-13 -19C-8 -30 7 -33 13 -24C14 -13 3 -8 -5 -10" fill="none" stroke="${K}" stroke-width=".7" stroke-dasharray="1.6 1.4" opacity=".8"/>
          <path d="M-10 -36C-2 -40 8 -40 14 -35" fill="none" stroke="${C.gl[2]}" stroke-width="1.2" opacity=".8"/><path d="M-20 -3C-8 -1 8 -1 22 -3L22 -11C8 -9 -8 -9 -20 -11Z" fill="${C.st2}"/>`}</g>`;
      items.push({ z: T([0, -26, -6])[2] - 2, pts: pp, g: part(pp, C.gl, back, GK) });
      if (H.card) {
        const c = H.card.c, r = H.card.r * DEG;
        const cs = H.card.s || 1;
        items.push({ z: (zr[0] + zr[1]) / 2, g: `<g transform="${mat(c, [Math.cos(r) * cs, Math.sin(r) * cs, 0], [-Math.sin(r) * cs, Math.cos(r) * cs, 0])}">${cardG}</g>` });
      }
      if (H.deck) {
        const c = H.deck.c, r = H.deck.r * DEG, cs = H.deck.s || 1, ex = [Math.cos(r) * cs, Math.sin(r) * cs, 0], ey = [-Math.sin(r) * cs, Math.cos(r) * cs, 0];
        let g = "";
        for (let k = 5; k >= 0; k--) g += `<g transform="${mat([c[0], c[1], c[2] + k * 1.6], ex, ey)}">${k ? `<rect x="-27" y="-39" width="54" height="78" rx="4.5" fill="#efe4cc" stroke="${K}" stroke-width="1.6"/>` : cardG}</g>`;
        items.push({ z: T(c)[2], g });
      }
      items.sort((a, b) => a.z - b.z);
      // 外形の太い主線: 部品の下にまとめて敷くと、重なりの外側にだけ太い線が出る。カードをはさむときは手前と奥で分けて敷く
      let outS = "", grp = [];
      const flush = () => {
        outS += grp.map((i) => hEdge(i.pts, 0.9 * lw, 2.5 * lw, K)).join("") + grp.map((i) => i.g).join("");
        grp = [];
      };
      for (const it of items) {
        if (it.pts) grp.push(it);
        else flush(), (outS += it.g);
      }
      flush();
      return outS;
    };

    // 布のしわ: 影のくさび(入り抜き)+谷の細い線+光の側の照り。肩から下がる縦じわ、わきの下から胸へ引かれるしわ、すその寄りじわ
    const fold = (pts, w, a = 0.9, M = J, hi = C.jhi) => `${ink(pts.map((p) => [p[0] - w * 0.3, p[1]]), w * 2.2, 0.45, 0.5, M[1], a)}${ink(pts.map((p) => [p[0] - w * 0.4, p[1]]), w, 0.5, 0.55, M[2], 0.8)}${ink(pts.map((p) => [p[0] - w * 0.18, p[1]]), Math.max(0.8, w * 0.17), 0.4, 0.5, K, 0.7)}${ink(pts.map((p) => [p[0] + w * 0.45, p[1] - w * 0.1]), Math.max(0.8, w * 0.17), 0.45, 0.55, hi, 0.75)}`;
    // ---------- 腕 ----------
    // 自分: ジャケットの長袖(三角筋のふくらみ→上腕→ひじ→前腕はひじ側が太く手首へ細く→リブの袖口)。相手: 半袖のジャージから素肌の腕(上腕二頭筋・三頭筋・腕橈骨筋)
    // 腕は肩からひじ・手首まで1本の輪郭: 肩の上は胴の肩の線(P0)からそのまま続き、ひじは外側に骨の角・内側にしわの谷。付け根は袖の縫い目(わきの下→P0)で閉じる
    const PROF = o
      ? { up: [[0, 26, 26], [0.2, 27.4, 25.6], [0.5, 25, 23.6], [0.8, 21.6, 21], [1, 20, 20]], fo: [[0, 20, 20], [0.16, 23.8, 22], [0.42, 21.4, 19.8], [0.75, 16.8, 15.8], [1, 14.6, 14]] }
      : { up: [[0, 27, 27], [0.2, 28.4, 26.6], [0.5, 26.4, 25], [0.82, 23.6, 23], [1, 22.6, 22.6]], fo: [[0, 22.6, 22.6], [0.2, 25.4, 24], [0.5, 22.4, 21.2], [0.8, 18.8, 18], [0.86, 17.8, 17.2], [1, 17.2, 16.8]], fs: [[0, 24, 24], [0.3, 28, 27.4], [0.65, 32.6, 32], [0.84, 36.4, 36], [1, 38, 38]] };
    const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    // 腕の主線の太さ: 付け根は胴の主線(1.2〜3.6)と同じ太さで始まり、少しずつ腕の太さへ。わきの下で抜く
    const armW = (d0, d1, k) => {
      const tw = 1.2 + 2.4 * k, aw = 2.2 + 2.4 * k, r = Math.min(1, d0 / 36), q = r * r * (3 - 2 * r);
      return (tw + (aw - tw) * q) * (d1 < 16 ? Math.sin(((d1 / 16) * Math.PI) / 2) : 1);
    };
    const bul = (t, a, b, k) => k * Math.sin(Math.PI * Math.max(0, Math.min(1, (t - a) / (b - a))));
    const arm = (Sp, E, W, hk, hv, holder, flip, P0, P0b) => {
      const ux = W[0] - E[0], uy = W[1] - E[1], FL = Math.hypot(ux, uy), fx = ux / FL, fy = uy / FL;
      // FS: 見る人の方へ突き出す腕(遠近の誇張)。前腕は手首の側ほど太く、手も大きく、前腕が上腕の先に重なる
      const FS = hv.fs || 0;
      const up = tube(Sp, E, PROF.up), fo = tube(E, [W[0] - fx * 2, W[1] - fy * 2], FS ? PROF.fs : PROF.fo);
      const dot = up.u[0] * fo.u[0] + up.u[1] * fo.u[1], bend = 1 - dot;
      const sIn = -up.u[0] * fo.n[0] - up.u[1] * fo.n[1] > 0 ? 1 : -1, sInU = fo.u[0] * up.n[0] + fo.u[1] * up.n[1] > 0 ? 1 : -1;
      // 手の向き: ふつうは前腕の向き。FS は hv.ang(指先の向き、真上=0)で決め、手首は袖口の楕円の中から出る
      const hA = FS ? hv.ang : fo.ang + 90 + (hv.a || 0), hu = [Math.sin(hA * DEG), -Math.cos(hA * DEG)], fc = fo.B;
      const wr = FS ? tube([fc[0] - hu[0] * 4, fc[1] - hu[1] * 4], [fc[0] + hu[0] * 12, fc[1] + hu[1] * 12], [[0, 17, 17], [1, 15.6, 15.6]]) : tube([W[0] - fx * 16, W[1] - fy * 16], [W[0] + fx * 6, W[1] + fy * 6], [[0, 12.4, 12.4], [1, 12, 12]]);
      const hd = hand(hk, FS ? [fc[0] + hu[0] * 2, fc[1] + hu[1] * 2] : [W[0] + fx * 4, W[1] + fy * 4], hA, (o ? 1.26 : 1.3) * (FS ? hv.hs || 1.5 : 1), flip, hv);
      // わきの下の側(腰に近い側 sA)と肩の上の側(sT)
      const hip = [Sp[0] + (flip ? -40 : 40), Sp[1] + 150], dh = (s) => Math.hypot(up.at(0.1, s)[0] - hip[0], up.at(0.1, s)[1] - hip[1]);
      const sA = dh(1) < dh(-1) ? 1 : -1, sT = -sA;
      // ひじ: 曲がりの二等分の向き d(内側へ)。内側の谷 cr、外側の骨の角 tip。谷の手前で上腕・前腕の内側の線を止める
      let bx = fo.u[0] - up.u[0], by = fo.u[1] - up.u[1], bl = Math.hypot(bx, by);
      if (bl < 0.05) (bx = up.n[0] * sInU), (by = up.n[1] * sInU), (bl = 1);
      const d = [bx / bl, by / bl], sh = Math.sqrt((1 + dot) / 2), ch = Math.sqrt(Math.max(0, (1 - dot) / 2)), rE = PROF.up[PROF.up.length - 1][1];
      const off = (rE * ch) / Math.max(sh, 0.35), sharp = bend > 0.15;
      const cr = [E[0] + (d[0] * rE * 0.96) / Math.max(sh, 0.6), E[1] + (d[1] * rE * 0.96) / Math.max(sh, 0.6), sharp ? 1 : 0];
      const tk = 1.03 + 0.1 * Math.min(1, bend * 3), tip = [E[0] - d[0] * rE * tk, E[1] - d[1] * rE * tk];
      const tU = Math.min(0.9, 1 - (off + 5) / up.L), tF = Math.max(0.08, (off + 5) / fo.L);
      // 肩の上の線は P0 から外へふくらむ点だけを使う(へこみを作らない)
      const Q = up.at(0.45, sT), qx = Q[0] - P0[0], qy = Q[1] - P0[1], ql = Math.hypot(qx, qy) || 1;
      let nC = [-qy / ql, qx / ql];
      if (nC[0] * up.n[0] * sT + nC[1] * up.n[1] * sT < 0) nC = [-nC[0], -nC[1]];
      // 上げた腕ほど三角筋が丸く盛り上がる(raise: 0=下ろす 1=水平より上)。曲げた腕の内側は上腕二頭筋がふくらむ
      const raise = Math.max(0, Math.min(1, (0.95 - up.u[1]) / 0.95)), bic = 0.16 * Math.min(1, bend * 2), bul2 = (t, a, b, k) => k * Math.sin(Math.PI * Math.max(0, Math.min(1, (t - a) / (b - a)))) ** 2;
      const sideU = (s, t1 = s === sInU ? tU : 0.9, mul = 1) => {
        const top = s === sT, t0 = top ? 0.02 : 0.14, r = [];
        for (let i = 0; i <= 9; i++) {
          const t = t0 + ((t1 - t0) * i) / 9, q = up.at(t, s * FN(mul, t) * (1 + (top ? bul2(t, -0.3, 0.62, 0.12 + 0.24 * raise) : bul(t, 0.2, 0.85, 0.05)) + (s === sInU ? bul2(t, 0.42, 0.98, bic) : 0)));
          if (top && t < 0.45 && (q[0] - P0[0]) * nC[0] + (q[1] - P0[1]) * nC[1] < 1) continue;
          r.push(q);
        }
        // P0 の先に胴の肩の線をそのまま延ばした点を足す(肩の線が角を作らずに腕の上の線へつながる)
        if (s === sT && r.length) {
          const g = Math.hypot(r[0][0] - P0[0], r[0][1] - P0[1]) * 0.4, tx = P0[0] - P0b[0], ty = P0[1] - P0b[1], tl = Math.hypot(tx, ty) || 1;
          r.unshift([P0[0] + (tx / tl) * g, P0[1] + (ty / tl) * g]);
        }
        return r;
      };
      const sideF = (s) => {
        const inn = s === sInU, fs = inn ? sIn : -sIn, t0 = inn ? tF : 0.1, r = [];
        for (let i = 0; i <= 6; i++) {
          const t = t0 + ((1 - t0) * i) / 6;
          r.push(fo.at(t, fs * (1 + bul(t, -0.05, 0.6, 0.05))));
        }
        return r;
      };
      const side = (s) => [...sideU(s), s === sInU ? cr : tip, ...sideF(s)];
      const A = side(sT), B = side(sA).reverse(), PA = B[B.length - 1];
      // 袖の縫い目(わきの下→肩)は胴の内側(腰の向き)へふくらむ。肩の上の線と広い角度で分かれるので細いすき間ができない
      const sm = (PA0, k = 0.22) => {
        const m = lerp(PA0, P0, 0.5), g = Math.hypot(PA0[0] - P0[0], PA0[1] - P0[1]), hx = hip[0] - m[0], hy = hip[1] - m[1], hl = Math.hypot(hx, hy) || 1;
        return [m[0] + (hx / hl) * g * k, m[1] + (hy / hl) * g * k];
      };
      const capM = [fo.B[0] + fo.u[0] * 9, fo.B[1] + fo.u[1] * 9];
      const P0c = [P0[0], P0[1]], shape = [P0c, ...A, capM, ...B.slice(0, -1), [PA[0], PA[1], 1], sm(PA)];
      // 上腕と前腕の陰影はひじの二等分線で分けて塗る
      let mx = up.u[0] + fo.u[0], my = up.u[1] + fo.u[1], ml = Math.hypot(mx, my) || 1;
      (mx /= ml), (my /= ml);
      const gx = -my, gy = mx, BIG = 900;
      const halfU = [[E[0] + gx * BIG, E[1] + gy * BIG, 1], [E[0] + gx * BIG - mx * BIG, E[1] + gy * BIG - my * BIG, 1], [E[0] - gx * BIG - mx * BIG, E[1] - gy * BIG - my * BIG, 1], [E[0] - gx * BIG, E[1] - gy * BIG, 1]];
      const halfFo = [[E[0] + gx * BIG, E[1] + gy * BIG, 1], [E[0] + gx * BIG + mx * BIG, E[1] + gy * BIG + my * BIG, 1], [E[0] - gx * BIG + mx * BIG, E[1] - gy * BIG + my * BIG, 1], [E[0] - gx * BIG, E[1] - gy * BIG, 1]];
      const so = -sInU, sof = -sIn;
      let upIn, foIn, elbIn, M, sleeve = "";
      if (!o) {
        M = J;
        upIn = `${tshade(up, J, 1)}${fill(tband(up, 0.1, 0.62, (t) => -up.sd * (0.3 + bump(0.1, 0.62, 0.1)(t)), (t) => -up.sd * (0.3 + bump(0.1, 0.62, 0.42)(t))), C.jhi, 0.8)}
          ${fill(ring(up, 0.36, 0.41, 0.03, 6, 1.5), C.st)}${fill(ring(up, 0.44, 0.465, 0.03, 6, 1.5), C.st2)}
          ${ink(tl(up, [[0.16, sA * 1.05], [0.26, sA * 0.6], [0.3, sA * 0.2]]), 1.3, 0.2, 0.6)}${raise > 0.3 ? `${fold(tl(up, [[0.06, sA * 1.02], [0.17, sA * 0.62], [0.32, sA * 0.3], [0.44, sA * 0.22]]), 5, 0.9)}${ink(tl(up, [[0.44, sT * 1.04], [0.5, sT * 0.62], [0.49, sT * 0.3]]), 1.1, 0.3, 0.6)}` : ""}${ink(tl(up, [[0.58, sA * 1.0], [0.66, sA * 0.55]]), 1.1, 0.2, 0.6)}
          <path d="${hPath(tl(up, [[0.12, -up.sd * 0.62], [0.35, -up.sd * 0.6], [0.6, -up.sd * 0.6], [tU, -up.sd * 0.58]]), false)}" fill="none" stroke="${C.jhi}" stroke-width=".9" stroke-dasharray="2.4 2"/>`;
        foIn = `${tshade(fo, J, 2, 0.12)}${fill(tband(fo, 0.12, 0.7, (t) => -fo.sd * (0.32 + bump(0.12, 0.7, 0.08)(t)), (t) => -fo.sd * (0.32 + bump(0.12, 0.7, 0.36)(t))), C.jhi, 0.75)}
          ${ink(tl(fo, [[0.4, -1], [0.47, -0.4], [0.46, 0.25]]), 1.3, 0.3, 0.6)}${ink(tl(fo, [[0.58, 0.95], [0.63, 0.3]]), 1.2, 0.3, 0.6)}${ink(tl(fo, [[0.7, -0.9], [0.74, -0.2], [0.73, 0.4]]), 1.1, 0.3, 0.6)}
          ${fill(tband(fo, 0.84, 1.1, -1.4, 1.4), J[2])}${[-0.7, -0.42, -0.14, 0.14, 0.42, 0.7].map((s) => ink(tl(fo, [[0.865, s], [0.99, s * 0.96]]), 0.9, 0.2, 0.2, "#000", 0.6)).join("")}
          ${fill(ring(fo, 0.81, 0.84), C.st)}${fill(ring(fo, 0.87, 0.882), C.st2)}`;
        // ひじの袖: 内側は谷から扇に寄るしわと濃い影、外側は布が張って骨の角に沿う線と照り
        elbIn = sharp
          ? `${fill([up.at(tU - 0.12, sInU * 1.3), up.at(tU - 0.1, sInU * 0.55), lerp(cr, E, 0.75), fo.at(tF + 0.12, sIn * 0.5), fo.at(tF + 0.14, sIn * 1.3), cr], J[2], 0.75)}
            ${ink([cr, up.at(tU - 0.05, sInU * 0.5), up.at(tU - 0.16, sInU * 0.05)], 1.6, 0.1, 0.6)}${ink([cr, lerp(cr, E, 0.55), lerp(E, tip, 0.12)], 1.4, 0.1, 0.6)}${ink([cr, fo.at(tF + 0.07, sIn * 0.45), fo.at(tF + 0.17, sIn * -0.05)], 1.5, 0.1, 0.6)}${ink([fo.at(tF + 0.1, sIn * 1.02), fo.at(tF + 0.2, sIn * 0.6), fo.at(tF + 0.24, sIn * 0.3)], 1.2, 0.2, 0.6)}
            ${fill([up.at(0.8, so * 0.92), lerp(tip, E, 0.12), fo.at(0.2, sof * 0.92), fo.at(0.16, sof * 0.55), lerp(tip, E, 0.4), up.at(0.82, so * 0.55)], C.jhi, 0.55)}
            ${ink([up.at(0.78, so * 0.78), lerp(tip, cr, 0.2), fo.at(0.2, sof * 0.76)], 1.2, 0.3, 0.3, K, 0.85)}`
          : `${ink([up.at(0.86, sInU * 1.02), up.at(0.92, sInU * 0.5), up.at(0.93, sInU * 0.1)], 1.4, 0.2, 0.6)}${ink([fo.at(0.04, sIn * 1.02), fo.at(0.1, sIn * 0.55)], 1.3, 0.2, 0.6)}${ink([up.at(0.95, so * 0.95), up.at(1.0, so * 0.5)], 1.1, 0.2, 0.6, K, 0.8)}${ink([fo.at(0.1, sof * 1.0), fo.at(0.16, sof * 0.45), fo.at(0.15, sof * 0.05)], 1.2, 0.2, 0.6)}`;
      } else {
        M = S;
        upIn = `${tshade(up, S, 1.4, 0.18)}${ink(tl(up, [[0.58, sInU * 0.7], [0.72, sInU * 0.9], [0.86, sInU * 0.62]]), 1.2, 0.4, 0.5, S[2])}${ink(tl(up, [[0.6, -sInU * 0.5], [0.76, -sInU * 0.75], [0.9, -sInU * 0.4]]), 1, 0.4, 0.5, S[2], 0.8)}${fill(tband(up, 0.56, 0.72, -0.2, 0.9), S[2], 0.5)}`;
        foIn = `${tshade(fo, S, 2.3, 0.14)}${ink(tl(fo, [[0.06, 0.9], [0.2, 1.02], [0.42, 0.7], [0.6, 0.35]]), 1.3, 0.4, 0.6, S[2])}${ink(tl(fo, [[0.62, -0.3], [0.8, -0.2], [0.94, -0.15]]), 0.9, 0.4, 0.4, S[2], 0.8)}${ink(tl(fo, [[0.66, 0.25], [0.84, 0.22]]), 0.8, 0.4, 0.4, S[2], 0.7)}
          ${fill(tband(fo, 0.88, 1.1, -1.4, 1.4), C.gl[0])}${fill(tband(fo, 0.88, 1.1, fo.sd * 1.4, fo.sd * 0.3), C.gl[1])}${fill(ring(fo, 0.88, 0.905, 0.03, 6, 1.5), C.st2)}`;
        // 素肌のひじ: 内側に短いしわ、外側に骨の出っぱり(小さな山と照り)
        elbIn = sharp
          ? `${fill([up.at(tU - 0.1, sInU * 1.2), lerp(cr, E, 0.5), fo.at(tF + 0.1, sIn * 1.2), cr], S[2], 0.7)}${ink([cr, lerp(cr, E, 0.5)], 1.4, 0.1, 0.6)}${ink([up.at(tU - 0.04, sInU * 0.8), lerp(cr, E, 0.35), fo.at(tF + 0.05, sIn * 0.75)], 0.9, 0.3, 0.3, S[2])}
            ${ink([up.at(0.86, so * 0.7), lerp(tip, E, 0.3), fo.at(0.12, sof * 0.72)], 1.1, 0.3, 0.3, S[2])}${ink([lerp(tip, E, 0.12), lerp(tip, E, 0.2)].map((p, i) => [p[0] + (i ? fo.u[0] : -up.u[0]) * 5, p[1] + (i ? fo.u[1] : -up.u[1]) * 5]), 1.2, 0.4, 0.4, "#fff", 0.5)}`
          : `${ink([up.at(0.9, sInU * 0.9), up.at(0.98, sInU * 0.4)], 1.1, 0.3, 0.5, S[2])}${ink([up.at(0.92, so * 0.6), up.at(1.03, so * 0.85)], 1, 0.3, 0.5, S[2], 0.8)}`;
        // 半袖: 肩を丸く包み、すそへ少し広がる。わきの側は腕に沿わせて胴へはみ出さない。すそは筒の輪の弓なり
        const mO = (t) => 1.08 + 0.1 * Math.sin(Math.PI * Math.min(1, t / 0.5)) ** 0.7 + 0.1 * Math.max(0, Math.min(1, (t - 0.32) / 0.28)) ** 2, mI = (t) => 0.97 + 0.07 * Math.max(0, Math.min(1, (t - 0.36) / 0.24));
        const sA2 = sideU(sA, 0.58, mI), sT2 = sideU(sT, 0.58, mO), PB = sA2[0];
        const hem = [0.7, 0.35, 0, -0.35, -0.7].map((q) => up.at(0.6 + 0.045 * (1 - q * q), q >= 0 ? q * sT * mO(0.6) : -q * sA * mI(0.6)));
        const slv = [P0c, ...sT2, ...hem, ...sA2.slice(1).reverse(), [PB[0], PB[1], 1], sm(PB, 0.22)];
        sleeve = part(slv, C.js, `${tshade(up, C.js, 0.3, 0.2)}${fill(ring(up, 0.49, 0.6, 0.04, 6, 1.6), C.st)}${fill(ring(up, 0.45, 0.49, 0.04, 6, 1.6), C.st2)}${ink(tl(up, [[0.12, sA * 1.1], [0.22, sA * 0.5], [0.28, sA * -0.1]]), 1.3, 0.3, 0.5)}${ink(tl(up, [[0.28, sT * 1.05], [0.35, sT * 0.45]]), 1.3, 0.3, 0.5)}${fold(tl(up, [[0.16, sA * 0.7], [0.3, sA * 0.1], [0.42, sT * 0.5], [0.47, sT * 0.95]]), 3.6, 0.8, C.js, C.jhi)}${ink(tl(up, [[0.08, sT * 0.95], [0.2, sT * 1.12], [0.34, sT * 1.12]]), 2.2, 0.4, 0.5, C.jhi, 0.6)}${fill([P0, ...sT2.slice(0, 3), up.at(0.14, sT * 0.6), up.at(0.06, 0)], C.jhi, 0.45)}`, { k: 0.6, w: [0, 0] }) + hEdgeOpen([P0, ...sT2, ...hem, ...sA2.slice(1).reverse()], hSign(slv), armW, K) + ink([PB, sm(PB, 0.22), P0], 1.3, 0.2, 0.5, K, 0.85);
      }
      const inner = `${clip(halfU, upIn)}${clip(halfFo, foIn)}${elbIn}`;
      // 外形の太い線: 肩の上は胴の線から入り、わきの下で抜く。縫い目は細く
      const line = `${hEdgeOpen([P0, ...A, capM, ...B], hSign(shape), armW, K)}${ink([PA, sm(PA), P0], 1.3, 0.25, 0.5, K, 0.85)}${o ? "" : `<path d="${hPath([PA, sm(PA, 0.2), P0].map((p) => lerp(p, Sp, 0.08)), false)}" fill="none" stroke="${C.jhi}" stroke-width=".9" stroke-dasharray="2.4 2"/>`}`;
      let fsOver = "";
      if (FS && !o) {
        // 突き出す前腕: 上腕の先に重なる別の形。後ろの端(ひじ)は丸く、手前の端は袖口の楕円(短い軸は前腕の向き)
        const R0 = PROF.fs[0][1], R1 = PROF.fs[PROF.fs.length - 1][1], eb = 0.6, [ux2, uy2] = fo.u, [nx2, ny2] = fo.n, cA = fo.B;
        const el = (C0, r, b, a) => [C0[0] + nx2 * r * Math.cos(a) + ux2 * b * Math.sin(a), C0[1] + ny2 * r * Math.cos(a) + uy2 * b * Math.sin(a)];
        const arc = (C0, r, b, a0, a1, m = 10) => Array.from({ length: m + 1 }, (_, i) => el(C0, r, b, a0 + ((a1 - a0) * i) / m));
        const fsh = [...[0.12, 0.3, 0.5, 0.7, 0.88].map((t) => fo.at(t, 1)), ...arc(cA, R1, R1 * eb, 0, Math.PI, 12), ...[0.88, 0.7, 0.5, 0.3, 0.12].map((t) => fo.at(t, -1)), ...arc(E, R0, R0 * 0.85, Math.PI, Math.PI * 2, 8)];
        // 袖口の帯とひじ寄りのしわは、ひじの方へ弓なり(手前ほど近いので輪の見える側がひじへ向く)
        const rib = tband(fo, 0.8, 1.2, -1.4, 1.4);
        const fsIn = `${tshade(fo, J, 2, 0.1)}${fill(tband(fo, 0.1, 0.78, (t) => -fo.sd * (0.28 + bump(0.1, 0.78, 0.1)(t)), (t) => -fo.sd * (0.28 + bump(0.1, 0.78, 0.4)(t))), C.jhi, 0.75)}
          ${fill(rib, J[1])}${fill(tband(fo, 0.8, 1.2, fo.sd * 1.4, fo.sd * 0.2), J[2], 0.8)}${[-0.8, -0.55, -0.3, -0.05, 0.2, 0.45, 0.7].map((q) => ink([el(cA, R1 * 0.98, R1 * eb, Math.acos(q)), fo.at(0.84 - 0.1 * (1 - q * q), q * 0.98)], 1, 0.2, 0.2, "#000", 0.55)).join("")}
          ${fill(ring(fo, 0.7, 0.75, -0.1, 8, 1.5), C.st)}${fill(ring(fo, 0.79, 0.805, -0.1, 8, 1.5), C.st2)}
          ${[[0.2, -1, 0.35, 6], [0.36, 1, -0.2, 5], [0.52, -1, 0.1, 4]].map(([t, a, b, w]) => fold(tl(fo, [[t, a * 1.02], [t - 0.07 * (1 - ((a + b) / 2) ** 2), (a + b) / 2], [t - 0.02, b]]), w, 0.85)).join("")}
          ${ink(tl(fo, [[0.2, -sIn * 1], [0.27, -sIn * 0.45], [0.24, sIn * 0.1]]), 1.4, 0.3, 0.6)}${ink(tl(fo, [[0.4, sIn * 1], [0.45, sIn * 0.5], [0.43, 0]]), 1.3, 0.3, 0.6)}${ink(tl(fo, [[0.5, -sIn * 0.95], [0.56, -sIn * 0.4]]), 1.2, 0.3, 0.6)}
          ${fill(arc(E, R0 * 1.02, R0 * 0.9, Math.PI * 1.05, Math.PI * 1.95, 8).concat(arc(E, R0 * 0.7, R0 * 0.35, Math.PI * 1.9, Math.PI * 1.1, 8)), C.jhi, 0.5)}`;
        // 袖口: 中の暗がり、奥の縁の厚み、手前の縁の照り
        const cuff = `<ellipse cx="${f(cA[0])}" cy="${f(cA[1])}" rx="${f(R1 * eb * 0.86)}" ry="${f(R1 * 0.88)}" transform="rotate(${f(fo.ang)} ${f(cA[0])} ${f(cA[1])})" fill="#04070d"/>
          ${fill(arc(cA, R1 * 0.88, R1 * eb * 0.86, 0, Math.PI, 12).concat(arc(cA, R1 * 0.86, R1 * eb * 0.2, Math.PI, 0, 12)), J[1])}${fill(arc(cA, R1 * 0.88, R1 * eb * 0.86, Math.PI * 0.1, Math.PI * 0.55, 8).concat(arc(cA, R1 * 0.8, R1 * eb * 0.6, Math.PI * 0.55, Math.PI * 0.1, 8)), C.jhi, 0.6)}
          ${ink(arc(cA, R1 * 0.93, R1 * eb * 0.93, Math.PI * 1.08, Math.PI * 1.92, 10), 1.2, 0.3, 0.3, C.jhi, 0.8)}${ink(arc(cA, R1 * 0.88, R1 * eb * 0.86, 0, Math.PI * 2, 24), 1.6, 0, 0)}`;
        // 上腕に落ちる前腕の影と、ひじの手前に寄るしわ
        const cast = clip(shape, fill(arc([E[0] - HL[0] * 7, E[1] - HL[1] * 7], R0 * 1.08, R0 * 1.0, Math.PI * 0.95, Math.PI * 2.05, 10), J[2], 0.8));
        const uf = `${ink(tl(up, [[0.62, sT * 0.95], [0.7, sT * 0.45], [0.68, 0]]), 1.3, 0.3, 0.6)}${ink(tl(up, [[0.66, sA * 0.95], [0.74, sA * 0.4]]), 1.2, 0.3, 0.6)}${ink(tl(up, [[0.5, sT * 1], [0.56, sT * 0.6]]), 1.1, 0.3, 0.6)}`;
        fsOver = `${cast}${uf}${part(fsh, J, fsIn, { k: 0.6, w: [1.4, 4] })}${cuff}`;
      }
      const body = `${part(shape, M, inner, { k: 0.5, w: [0, 0] })}${line}${sleeve}${fsOver}`;
      let hold = "";
      if (holder) {
        const Lh = fo.L, r = o ? 21 : 23;
        hold = `<g transform="translate(${f(E[0])} ${f(E[1])}) rotate(${f(fo.ang)})">
          <rect x="${f(Lh * 0.2)}" y="${-r - 2}" width="7" height="${r * 2 + 4}" rx="2.4" fill="${C.gl[1]}" stroke="${K}" stroke-width="1.6"/><rect x="${f(Lh * 0.58)}" y="${-r + 1}" width="7" height="${r * 2 - 2}" rx="2.4" fill="${C.gl[1]}" stroke="${K}" stroke-width="1.6"/>
          <path d="M${f(Lh * 0.2 + 1)} ${-r}L${f(Lh * 0.2 + 1)} ${r}M${f(Lh * 0.58 + 6)} ${-r + 2}L${f(Lh * 0.58 + 6)} ${r - 2}" stroke="${C.rim}" stroke-width=".8" opacity=".6"/>
          <path d="M${f(Lh * 0.62)} -12L${f(Lh * 0.9)} -10L${f(Lh * 0.9)} 10L${f(Lh * 0.62)} 12Z" fill="#f2e7cc" stroke="${K}" stroke-width="1.6"/><path d="M${f(Lh * 0.64)} -8L${f(Lh * 0.86)} -6.6L${f(Lh * 0.86)} 6.6L${f(Lh * 0.64)} 8Z" fill="#c9a24a" stroke="${K}" stroke-width="1"/><path d="M${f(Lh * 0.66)} -9.4L${f(Lh * 0.66)} 9.4M${f(Lh * 0.7)} -9.8L${f(Lh * 0.7)} 9.8" stroke="#8a7350" stroke-width=".7"/>
          <rect x="${f(Lh * 0.13)}" y="-15.5" width="${f(Lh * 0.58)}" height="31" rx="5.5" fill="${o ? C.gl[0] : "#3a4760"}" stroke="${K}" stroke-width="2.2"/><rect x="${f(Lh * 0.15)}" y="-13.6" width="${f(Lh * 0.54)}" height="7" rx="3" fill="#fff" opacity=".14"/><rect x="${f(Lh * 0.13)}" y="7" width="${f(Lh * 0.58)}" height="8.5" rx="4" fill="#000" opacity=".3"/>
          <path d="M${f(Lh * 0.17)} -10.4L${f(Lh * 0.67)} -10.4" stroke="${C.st}" stroke-width="2.2"/><path d="M${f(Lh * 0.17)} 10.6L${f(Lh * 0.67)} 10.6" stroke="${K}" stroke-width=".8" stroke-dasharray="2 1.6"/>
          <g transform="translate(${f(Lh * 0.42)} 0)"><rect x="-8" y="-6" width="16" height="12" rx="2.4" fill="#c8d0dc" stroke="${K}" stroke-width="1.4"/><rect x="-5" y="-3" width="10" height="6" rx="1.4" fill="#5c6678" stroke="${K}" stroke-width=".8"/><path d="M-6 -4.6L5 -4.6" stroke="#fff" stroke-width="1.2" opacity=".8"/><circle cx="-12" cy="0" r="1.8" fill="#c8d0dc" stroke="${K}" stroke-width=".8"/><circle cx="12" cy="0" r="1.8" fill="#c8d0dc" stroke="${K}" stroke-width=".8"/></g>
          <path d="M${f(Lh * 0.48)} -6L${f(Lh * 0.52)} 0L${f(Lh * 0.48)} 6" fill="none" stroke="${C.st2}" stroke-width="2" opacity="0"/></g>`;
      }
      const wrist = part(wr.pts, S, tshade(wr, S, 0, 0.3), { k: 0.4, w: [1, 2.6] });
      if (!flip) return { up: wrist + body, fo: hold + hd };
      // 奥の腕: 胴の後ろに描き、肩のつなぎ目と上腕の先・前腕だけを胴と顔の上へ重ね直す(同じ絵を use で切り抜く)
      const gid = id + "a" + cn++, k0 = up.at(0.4, 0), out = (p, k) => [p[0] + (p[0] - Sp[0]) * k, p[1] + (p[1] - Sp[1]) * k, 1];
      // 相手は肩に羽織った上着が肩の上をおおうので、つなぎ目は重ね直さない
      const conn = o ? [] : [out(P0, 0.12), ...[0.02, 0.12, 0.22, 0.32, 0.42].map((t) => up.at(t, sT * 1.25)), up.at(0.42, sA * 1.25), out(PA, 0.12), out(sm(PA), 0.1)];
      const far = [[k0[0] + up.n[0] * BIG, k0[1] + up.n[1] * BIG, 1], [k0[0] + up.n[0] * BIG + up.u[0] * BIG, k0[1] + up.n[1] * BIG + up.u[1] * BIG, 1], [k0[0] - up.n[0] * BIG + up.u[0] * BIG, k0[1] - up.n[1] * BIG + up.u[1] * BIG, 1], [k0[0] - up.n[0] * BIG, k0[1] - up.n[1] * BIG, 1]];
      // 上げた腕のわきの下: 胴の布が腕へ引かれて寄るしわ(胴の上に描く)
      const pit = !o && raise > 0.3 ? [[0.1, 0.34, 5], [0.16, 0.22, 3.6]].map(([a, b, w]) => fold([lerp(PA, hip, a * 0.3), lerp(lerp(PA, hip, a + 0.06), Sp, -0.12), lerp(lerp(PA, hip, b), Sp, -0.2)], w, 0.85 * raise)).join("") : "";
      return { up: `<g id="${gid}">${body}</g>`, fo: `${pit}${wrist}<clipPath id="${gid}k">${conn.length ? `<path d="${hPath(conn)}"/>` : ""}<path d="${hPath(far)}"/><path d="${hPath(halfFo)}"/></clipPath><use href="#${gid}" clip-path="url(#${gid}k)"/>${hold}${hd}` };
    };

    // ---------- 首 ----------
    const neckPts = [hp(-36, 8), hp(14, 26), hp(16, 58), TP(240, 248, 0, 0.3), TP(244, 270, 0, 0.3), TP(186, 274, 0.3), TP(182, 250, 0.3)];
    const jaw = [hp(-42, 18), hp(-31, 44), hp(-10, 62), hp(6, 73), hp(16, 70), hp(26, 58)];
    const neckIn = `${fill(jaw.concat(jaw.map((p) => [p[0] - 6, p[1] + 22]).reverse()), S[1])}${fill(jaw.concat(jaw.map((p) => [p[0] - 3, p[1] + 9]).reverse()), S[2])}
      ${ink([hp(-34, 36), [(hx + 210) / 2 - 6, (hy + 260) / 2 + 30], TP(214, 268, 0.15)], 1.6, 0.3, 0.5, S[2])}${ink([hp(10, 80), hp(12, 88)], 1.2, 0.4, 0.4, S[2], 0.8)}${ink([TP(236, 252, 0, 0.3), TP(232, 268, 0, 0.3)], 1.2, 0.4, 0.4, S[2], 0.6)}`;
    // 襟が首に落とす影
    const neck = part(neckPts, S, neckIn + (o ? "" : fill([TP(172, 222, 0.3), TP(194, 240, 0.2), TP(214, 254), TP(234, 244, 0, 0.2), TP(254, 220, 0, 0.3), TP(254, 278, 0, 0.3), TP(174, 280, 0.3)], S[2], 0.75)), { k: 0.5, w: [1, 3] });
    const SN = o ? TP(102, 288, 1) : TP(104, 300, 1), SF = o ? TP(298, 280, 0, 1) : TP(304, 296, 0, 1);
    const fa = arm(SF, P.far[0], P.far[1], P.far[2], P.far[3], false, true, o ? TP(266, 246, 0, 0.6) : TP(274, 256, 0, 0.6), o ? TP(240, 237, 0, 0.2) : TP(252, 246, 0, 0.3)), na = arm(SN, P.near[0], P.near[1], P.near[2], P.near[3], true, false, o ? TP(130, 260, 0.8) : TP(126, 268, 0.9), o ? TP(160, 248, 0.5) : TP(150, 258, 0.7));

    // ---------- 胴 ----------
    let back = "", torso = "", collar = "";
    if (!o) {
      // 主人公: 前を開けたライディングジャケット。中に青緑のジャージ(ファスナーと幾何学の細い斜線)、前立てに青緑のパイピングと縫い目
      const TOR = [TP(186, 246, 0.3), TP(150, 258, 0.7), TP(118, 272, 1), TP(96, 292, 1), TP(86, 322, 0.9), TP(90, 370, 0.5), TP(100, 430, 0.2), TP(108, 520), TP(112, 620, 0, 0, 1), TP(300, 620, 0, 0, 1), TP(298, 520), TP(302, 440, 0, 0.2), TP(308, 372, 0, 0.5), TP(316, 328, 0, 0.9), TP(318, 298, 0, 1), TP(302, 276, 0, 1), TP(276, 258, 0, 0.6), TP(252, 246, 0, 0.3)];
      const eL = [TP(190, 252, 0.2), TP(197, 300, 0.1), TP(204, 360), TP(204, 440), TP(199, 520), TP(195, 620)], eR = [TP(250, 252, 0, 0.2), TP(257, 300, 0, 0.1), TP(264, 360), TP(268, 440), TP(272, 520), TP(276, 620)];
      const JS = eL.concat([...eR].reverse());
      let stripes = "";
      for (let x = 120; x < 340; x += 8) stripes += `M${x} 240L${x - 140} 640`;
      const zx = (y) => 228 + (P.df[0] * 0.2) - (y - 270) * 0.012;
      const jerseyIn = `<path d="${stripes}" stroke="${C.js[1]}" stroke-width="1.2" opacity=".55" fill="none"/>
        ${fill([TP(190, 390), TP(229, 418), TP(272, 386), TP(273, 400), TP(229, 432), TP(190, 404)], C.st2)}${fill([TP(190, 410), TP(229, 438), TP(274, 404), TP(275, 424), TP(229, 456), TP(190, 430)], C.js2)}
        ${fill(eL.map((p) => [p[0] - 4, p[1]]).concat([...eL].reverse().map((p) => [p[0] + 13, p[1] + 2])), C.js[1])}${fill(eL.map((p) => [p[0] - 4, p[1]]).concat([...eL].reverse().map((p) => [p[0] + 5, p[1] + 1])), C.js[2])}
        ${fill([TP(192, 252, 0.2), TP(250, 252, 0, 0.2), TP(254, 282), TP(228, 294), TP(196, 284)], C.js[2], 0.85)}
        ${ink([TP(198, 336), TP(206, 352), TP(218, 362), TP(226, 364)], 6, 0.2, 0.75, C.js[1])}${ink([TP(240, 358), TP(254, 352), TP(266, 338)], 4.4, 0.7, 0.2, C.js[1], 0.8)}
        ${ink([TP(244, 300), TP(254, 324), TP(262, 340)], 1.2, 0.4, 0.5, C.js[2])}${ink([TP(212, 470), TP(228, 480), TP(244, 476)], 1.2, 0.4, 0.5, C.js[2])}
        <path d="M${f(zx(272))} 272L${f(zx(620))} 620" stroke="${K}" stroke-width="4.4"/><path d="M${f(zx(272))} 272L${f(zx(620))} 620" stroke="#b9c4d0" stroke-width="2.6" stroke-dasharray="1.4 1.3"/><path d="M${f(zx(272))} 272L${f(zx(620))} 620" stroke="${K}" stroke-width=".6"/>
        <path d="M${f(zx(278) - 3)} 276L${f(zx(278) + 3)} 276L${f(zx(278) + 3.6)} 288L${f(zx(278) - 3.6)} 288Z" fill="#c8d0dc" stroke="${K}" stroke-width="1.1"/><path d="M${f(zx(286) - 3.4)} 287C${f(zx(286) - 4)} 296 ${f(zx(286) - 2)} 303 ${f(zx(286) + 1)} 304C${f(zx(286) + 4)} 303 ${f(zx(286) + 5)} 296 ${f(zx(286) + 3.4)} 287Z" fill="${C.st2}" stroke="${K}" stroke-width="1.2"/><ellipse cx="${f(zx(296) + 0.6)}" cy="298" rx="1.2" ry="2" fill="${K}"/>`;
      const folds = [
        [[TP(140, 300, 0.6), TP(146, 350, 0.3), TP(151, 410), TP(149, 476)], 7],
        [[TP(112, 334, 0.8), TP(117, 384, 0.4), TP(123, 440, 0.1), TP(125, 500)], 6],
        [[TP(172, 344, 0.2), TP(177, 394), TP(179, 452)], 5],
        [[TP(104, 352, 0.7), TP(128, 362, 0.4), TP(154, 368, 0.2)], 4],
        [[TP(118, 454), TP(140, 447), TP(162, 452)], 4],
        [[TP(126, 474), TP(150, 468), TP(168, 472)], 3],
        [[TP(282, 304, 0, 0.6), TP(279, 352, 0, 0.3), TP(282, 420), TP(286, 490)], 5],
        [[TP(304, 338, 0, 0.8), TP(289, 356, 0, 0.4), TP(272, 366, 0, 0.2)], 4],
        [[TP(268, 402), TP(272, 452), TP(270, 500)], 4],
      ].map(([q, w]) => fold(q, w)).join("");
      // 肩の上の面(光が当たる)、肩の縫い目、胸のヨーク(切り替え)と押さえのステッチ
      const shoulderHi = `${fill([TP(182, 250, 0.3), TP(150, 261, 0.6), TP(122, 275, 0.9), TP(104, 292, 1), TP(116, 293, 1), TP(148, 274, 0.6), TP(182, 262, 0.3)], C.jhi, 0.55)}${fill([TP(256, 250, 0, 0.3), TP(282, 260, 0, 0.6), TP(304, 279, 0, 1), TP(316, 300, 0, 1), TP(305, 299, 0, 1), TP(283, 275, 0, 0.6), TP(258, 262, 0, 0.3)], C.jhi, 0.8)}
        ${ink([TP(184, 248, 0.3), TP(150, 263, 0.6), TP(124, 277, 0.9), TP(106, 292, 1)], 1.1, 0.2, 0.3, K, 0.75)}${ink([TP(258, 248, 0, 0.3), TP(284, 260, 0, 0.6), TP(306, 282, 0, 1)], 1.1, 0.2, 0.3, K, 0.75)}
        ${ink([TP(90, 314, 1), TP(140, 304, 0.5), TP(194, 312, 0.1)], 1.2, 0.2, 0.2, K, 0.8)}${ink([TP(262, 312, 0, 0.1), TP(292, 304, 0, 0.5), TP(318, 306, 0, 1)], 1.2, 0.2, 0.2, K, 0.8)}
        <path d="${hPath([TP(92, 318, 1), TP(140, 308, 0.5), TP(194, 316, 0.1)], false)}${hPath([TP(262, 316, 0, 0.1), TP(292, 308, 0, 0.5), TP(318, 310, 0, 1)], false)}" fill="none" stroke="${C.jhi}" stroke-width=".9" stroke-dasharray="2.4 2"/>
        ${fill([TP(92, 316, 1), TP(140, 306, 0.5), TP(194, 314, 0.1), TP(194, 322, 0.1), TP(140, 316, 0.5), TP(96, 326, 1)], J[2], 0.35)}`;
      // 前立ての裏(見返し)がのぞく厚み。上ほど広く、身頃の内側へ落ちる影
      const facing = `${fill([TP(190, 252, 0.2), TP(197, 300, 0.1), TP(204, 360), TP(204, 420), TP(209, 380), TP(209, 320, 0.1), TP(202, 262, 0.2)], C.ln[1])}${ink([TP(201, 262, 0.2), TP(208, 320, 0.1), TP(208.6, 380), TP(205, 418)], 1, 0.3, 0.6, C.rim, 0.6)}
        ${fill([TP(250, 252, 0, 0.2), TP(257, 300, 0, 0.1), TP(264, 360), TP(266, 410), TP(260, 360), TP(253, 302, 0, 0.1), TP(244, 262, 0, 0.2)], C.ln[2])}
        ${fill(eR.map((p) => [p[0] - 2, p[1]]).concat([...eR].reverse().map((p) => [p[0] - 13, p[1] + 3])), C.js[2], 0.75)}`;
      const jkIn = `${shoulderHi}${fill([TP(150, 258, 0.7), TP(118, 272, 1), TP(96, 292, 1), TP(86, 322, 0.9), TP(90, 370, 0.5), TP(100, 430, 0.2), TP(108, 520), TP(112, 620), TP(152, 620), TP(146, 540), TP(140, 470), TP(134, 412), TP(132, 372), TP(124, 336, 0.4), TP(130, 300, 0.6), TP(146, 274, 0.6)], J[1])}
        ${fill([TP(118, 272, 1), TP(96, 292, 1), TP(86, 322, 0.9), TP(90, 370, 0.5), TP(100, 430, 0.2), TP(108, 520), TP(112, 620), TP(126, 620), TP(122, 520), TP(114, 430), TP(106, 372), TP(104, 330, 0.8), TP(112, 298, 1)], J[2])}
        ${fill([TP(282, 286, 0, 0.8), TP(298, 300, 0, 1), TP(300, 340, 0, 0.6), TP(292, 380, 0, 0.3), TP(284, 360, 0, 0.3), TP(284, 320, 0, 0.6)], C.jhi, 0.7)}
        ${ink([TP(132, 318, 0.5), TP(156, 321, 0.3), TP(178, 326, 0.2)], 3.6, 0.05, 0.12, C.st2)}${ink([TP(132, 327, 0.5), TP(150, 329.6, 0.3), TP(164, 332.6, 0.2)], 2.6, 0.05, 0.12, C.st)}
        ${folds}
        <path d="${hPath([TP(178, 252, 0.3), TP(150, 262, 0.6), TP(124, 276, 0.9), TP(108, 290, 1)], false)}M${hpt(TP(262, 250, 0, 0.3))}C${hpt(TP(280, 256, 0, 0.6))} ${hpt(TP(296, 266, 0, 0.9))} ${hpt(TP(306, 284, 0, 1))}" fill="none" stroke="${C.jhi}" stroke-width=".9" stroke-dasharray="2.4 2"/>
        <path d="${hPath(eL.map((p) => [p[0] - 7, p[1]]), false)}${hPath(eR.map((p) => [p[0] + 7, p[1]]), false)}" fill="none" stroke="${C.jhi}" stroke-width=".9" stroke-dasharray="2.4 2"/>
        <path d="${hPath([TP(112, 300, 0.9), TP(140, 318, 0.5), TP(160, 360), TP(168, 420), TP(166, 520), TP(160, 620)], false)}M${hpt(TP(296, 320, 0, 0.8))}${hPath([TP(296, 320, 0, 0.8), TP(286, 372, 0, 0.3), TP(284, 440), TP(288, 520), TP(292, 620)], false).replace(/^M[^c]*/, "")}" fill="none" stroke="${K}" stroke-width="1.3" opacity=".8"/>
        <path d="${hPath([TP(116, 304, 0.9), TP(143, 321, 0.5), TP(163, 362), TP(171, 420), TP(169, 520), TP(163, 620)], false)}" fill="none" stroke="${C.jhi}" stroke-width=".8" stroke-dasharray="2.4 2"/>
        <path d="M${hpt(TP(128, 410))}L${hpt(TP(160, 432))}" stroke="${K}" stroke-width="3.2"/><path d="M${hpt(TP(128, 410))}L${hpt(TP(160, 432))}" stroke="#7d8aa0" stroke-width="1.6" stroke-dasharray="1.2 1.1"/>
        <path d="M${hpt(TP(158, 428))}C${hpt(TP(162, 432))} ${hpt(TP(163, 438))} ${hpt(TP(160, 444))}C${hpt(TP(157, 446))} ${hpt(TP(154, 444))} ${hpt(TP(154, 440))}C${hpt(TP(155, 436))} ${hpt(TP(156, 432))} ${hpt(TP(158, 428))}Z" fill="${C.st2}" stroke="${K}" stroke-width="1"/>
        ${[0, 1, 2].map((i) => ink([TP(104 + i * 9, 286 + i * 3, 1), TP(110 + i * 9, 300 + i * 4, 0.9), TP(112 + i * 9, 316 + i * 4, 0.8)], 1, 0.3, 0.3, J[2], 0.9)).join("")}
        ${clip(JS, jerseyIn)}
        ${facing}
        <path d="${hPath(eL, false)}${hPath(eR, false)}" fill="none" stroke="${K}" stroke-width="6"/><path d="${hPath(eL, false)}${hPath(eR, false)}" fill="none" stroke="${C.st}" stroke-width="2.6"/>`;
      torso = part(TOR, J, jkIn, { k: 0.9, w: [1.2, 3.6] });
      // 風で後ろへ流れるすそ
      // 立ち襟の後ろ側(首の後ろを回る。内側の裏地が見え、上の縁に厚み)
      const cB = [TP(166, 222, 0.3), TP(186, 206, 0.2), TP(220, 198), TP(254, 206, 0, 0.2), TP(274, 222, 0, 0.3), TP(262, 240, 0, 0.3), TP(220, 230), TP(178, 240, 0.3)];
      const collarBack = part(cB, [C.ln[1], C.ln[2], "#04262c"], `${fill([TP(166, 222, 0.3), TP(186, 206, 0.2), TP(220, 198), TP(254, 206, 0, 0.2), TP(274, 222, 0, 0.3), TP(268, 226, 0, 0.3), TP(220, 207), TP(172, 228, 0.3)], J[0])}${ink([TP(172, 226, 0.3), TP(220, 206), TP(268, 224, 0, 0.3)], 1, 0.2, 0.2, K, 0.8)}${ink([TP(186, 230, 0.3), TP(220, 220), TP(256, 230, 0, 0.3)], 4, 0.3, 0.3, "#04262c", 0.6)}`, { k: 0.3, w: [0.9, 2.6] });
      back = `${part([TP(298, 356, 0, 0.5), TP(318, 392), TP(330, 450), TP(332, 530), TP(326, 620, 0, 0, 1), TP(286, 620, 0, 0, 1)], J, ink([TP(312, 420), TP(318, 480), TP(316, 540)], 1.2, 0.3, 0.6), { k: 1, w: [1.2, 3.4] })}${collarBack}
        ${part([TP(118, 372, 0.4), TP(92, 404), TP(52, 426), TP(-2, 432, 0, 0, 1), TP(20, 470), TP(22, 540), TP(2, 620, 0, 0, 1), TP(152, 620, 0, 0, 1)], J, `${ink([[-2, 432], [20, 470], [22, 540], [2, 620]].map((p) => [p[0] + 6, p[1] + 2]), 7, 0, 0, C.st)}${ink([[-2, 432], [20, 470], [22, 540], [2, 620]].map((p) => [p[0] + 16, p[1] + 4]), 3, 0, 0, C.st2)}${ink([[110, 404], [84, 426], [56, 440], [30, 446]], 1.5, 0.3, 0.5)}${ink([[122, 470], [96, 480], [70, 484], [46, 484]], 1.5, 0.3, 0.5)}${fill([[120, 380], [92, 412], [56, 434], [30, 440], [40, 470], [80, 468], [120, 450]], J[2], 0.7)}`, { k: 1.2, w: [1.2, 3.4] })}`;
      // 立ち襟(厚みのある上端、内側は青緑)
      const cL = [TP(170, 256, 0.3), TP(162, 234, 0.3), TP(158, 206, 0.3, 0, 1), TP(178, 213, 0.3), TP(196, 232, 0.2), TP(208, 256, 0.1), TP(213, 270, 0, 0, 1), TP(198, 274)], cR = [TP(256, 252, 0, 0.3), TP(264, 232, 0, 0.3), TP(278, 206, 0, 0.3, 1), TP(262, 214, 0, 0.3), TP(247, 236, 0, 0.2), TP(237, 264, 0, 0.1, 1), TP(246, 270)];
      const jc = [TP(182, 244, 0.2), TP(204, 258), TP(228, 264), TP(250, 254, 0, 0.2), TP(258, 246, 0, 0.3), TP(252, 272), TP(228, 288), TP(204, 282), TP(178, 260, 0.2)];
      collar = `${part(jc, [C.js2, C.js2, "#062a30"], `${ink([TP(186, 250), TP(206, 264), TP(228, 270), TP(252, 260, 0, 0.2)], 1.6, 0.1, 0.1, C.st)}`, { k: 0.3, w: [1, 2.6] })}
        ${part(cL, J, `${fill([TP(158, 206, 0.3), TP(178, 213, 0.3), TP(196, 232, 0.2), TP(208, 256, 0.1), TP(213, 270), TP(205, 268), TP(193, 240), TP(176, 222), TP(160, 213, 0.3)], C.ln[0])}${fill([TP(160, 213, 0.3), TP(176, 222), TP(193, 240), TP(205, 268), TP(201, 268), TP(188, 242), TP(172, 226)], C.ln[1])}${ink([TP(160, 208, 0.3), TP(178, 215), TP(196, 234), TP(208, 258)], 1.4, 0.2, 0.3, C.rim, 0.8)}${ink([TP(166, 240, 0.3), TP(180, 254), TP(196, 266)], 1, 0.3, 0.4, J[2])}`, { k: 0.5, w: [1, 3] })}
        ${part(cR, J, `${fill([TP(278, 206, 0, 0.3), TP(262, 214, 0, 0.3), TP(247, 236, 0, 0.2), TP(237, 264, 0, 0.1), TP(242, 265), TP(251, 240), TP(265, 222), TP(278, 214, 0, 0.3)], C.ln[0])}${ink([TP(276, 208, 0, 0.3), TP(262, 216), TP(248, 238), TP(239, 262)], 1.4, 0.2, 0.3, "#c8fff4", 0.7)}`, { k: 0.5, w: [1, 3] })}`;
    } else {
      // 相手: 黒いジャージ(紫の肩当て・赤と紫の山形・歯車の印)。肩に羽織った上着は後ろへなびく(裏地は赤)
      const TOR = [TP(152, 620, 0, 0, 1), TP(140, 500), TP(126, 410), TP(118, 350, 0.4), TP(106, 306, 0.9), TP(100, 286, 1), TP(124, 262, 0.8), TP(160, 248, 0.5), TP(186, 240, 0.2), TP(214, 236), TP(240, 237, 0, 0.2), TP(270, 246, 0, 0.6), TP(294, 262, 0, 1), TP(300, 280, 0, 1), TP(298, 330, 0, 0.6), TP(292, 400, 0, 0.2), TP(286, 500), TP(284, 620, 0, 0, 1)];
      const zx = (y) => 228 - (y - 270) * 0.01;
      const tin = `${fill([TP(86, 250, 1), TP(182, 236, 0.3), TP(204, 262), TP(228, 268), TP(240, 258), TP(244, 234, 0, 0.3), TP(320, 250, 0, 1), TP(320, 296, 0, 1), TP(262, 276, 0, 0.4), TP(228, 298), TP(168, 280, 0.4), TP(86, 312, 1)], C.js2)}
        ${ink([TP(96, 304, 1), TP(168, 284, 0.4), TP(228, 302), TP(262, 280, 0, 0.4), TP(316, 298, 0, 1)], 2.4, 0, 0, C.st2)}
        ${fill([TP(96, 392), TP(170, 420), TP(228, 438), TP(270, 414), TP(310, 382), TP(310, 406), TP(270, 440), TP(228, 464), TP(170, 446), TP(96, 420)], C.st)}${fill([TP(96, 426), TP(170, 452), TP(228, 470), TP(270, 446), TP(310, 412), TP(310, 421), TP(270, 456), TP(228, 480), TP(170, 462), TP(96, 436)], C.st2)}
        ${fill([TP(92, 322, 0.6), TP(124, 334, 0.4), TP(144, 356), TP(150, 380), TP(178, 398), TP(214, 396), TP(186, 410), TP(150, 404), TP(136, 430), TP(142, 480), TP(158, 540), TP(170, 620), TP(92, 620)], C.js[1])}${fill([TP(92, 330, 0.6), TP(116, 340, 0.4), TP(128, 370), TP(122, 410), TP(124, 470), TP(136, 540), TP(142, 620), TP(92, 620)], C.js[2])}
        ${ink([TP(150, 384), TP(176, 396), TP(204, 396), TP(222, 386)], 5, 0.15, 0.75, C.js[2], 0.9)}${ink([TP(240, 380), TP(258, 380), TP(276, 370), TP(288, 354)], 4, 0.7, 0.2, C.js[1])}
        ${ink([TP(186, 336), TP(204, 330), TP(220, 336)], 5, 0.5, 0.5, C.jhi, 0.3)}${fill([TP(258, 316, 0, 0.4), TP(276, 300, 0, 0.6), TP(290, 292, 0, 0.9), TP(294, 340, 0, 0.5), TP(286, 366), TP(280, 340), TP(270, 324)], C.jhi, 0.55)}
        ${ink([TP(292, 296, 0, 0.9), TP(296, 330, 0, 0.6), TP(292, 380, 0, 0.2), TP(288, 440)], 2.2, 0.3, 0.5, C.rim, 0.55)}
        <g transform="translate(${hpt(TP(166, 326))}) scale(1.25)" fill="none" stroke="${C.st2}" stroke-width="2.6"><circle r="12"/><circle r="4.4"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${f(Math.cos(i * 0.785) * 12)} ${f(Math.sin(i * 0.785) * 12)}L${f(Math.cos(i * 0.785) * 17)} ${f(Math.sin(i * 0.785) * 17)}"/>`).join("")}</g>
        <path d="M${f(zx(272))} 272L${f(zx(620))} 620" stroke="${K}" stroke-width="4"/><path d="M${f(zx(272))} 272L${f(zx(620))} 620" stroke="#8a8098" stroke-width="2.2" stroke-dasharray="1.4 1.3"/>
        ${[[TP(134, 332), TP(146, 352), TP(150, 376)], [TP(284, 318, 0, 0.4), TP(290, 344)], [TP(176, 504), TP(200, 492), TP(224, 492)], [TP(262, 502), TP(246, 492), TP(230, 492)], [TP(130, 300, 0.6), TP(150, 312), TP(170, 330)]].map((l) => ink(l, 1.4, 0.3, 0.6)).join("")}`;
      // 体に沿うジャージ: わきの下から胸へ引かれるしわ、腰の横じわ、肩の上の面の照り
      const oF = [
        [[TP(110, 330, 0.8), TP(134, 340, 0.4), TP(158, 346, 0.2)], 4],
        [[TP(292, 326, 0, 0.8), TP(274, 338, 0, 0.4), TP(254, 344, 0, 0.2)], 4],
        [[TP(124, 400), TP(140, 436), TP(156, 470)], 3.6],
        [[TP(290, 398, 0, 0.2), TP(278, 432), TP(268, 466)], 3.2],
        [[TP(146, 474), TP(164, 466), TP(186, 470)], 3.4],
        [[TP(262, 474), TP(244, 466), TP(224, 472)], 3.4],
        [[TP(156, 498), TP(178, 492), TP(198, 496)], 2.8],
      ].map(([q, w]) => fold(q, w, 0.95, C.js, C.jhi)).join("");
      const oHi = `${fill([TP(186, 238, 0.2), TP(150, 250, 0.5), TP(116, 266, 0.8), TP(104, 284, 1), TP(114, 282, 1), TP(150, 262, 0.5), TP(186, 248, 0.2)], C.jhi, 0.6)}${fill([TP(242, 238, 0, 0.2), TP(272, 248, 0, 0.6), TP(296, 266, 0, 1), TP(304, 284, 0, 1), TP(294, 282, 0, 1), TP(272, 260, 0, 0.6), TP(244, 248, 0, 0.2)], C.jhi, 0.8)}`;
      torso = part(TOR, C.js, oHi + tin + oF, { k: 1, w: [1.2, 3.6] });
      back = `${part([TP(300, 268, 0, 1), TP(344, 290, 0, 0.6), TP(370, 340), TP(362, 404), TP(380, 436), TP(370, 478), TP(344, 560), TP(286, 620, 0, 0, 1)], C.ln, ink([[330, 330], [346, 370], [346, 420], [330, 470]], 1.5, 0.3, 0.5), { k: 1.2 })}
        ${part([TP(120, 372, 0.4), TP(76, 396), TP(22, 392), TP(-44, 356, 0, 0, 1), TP(-26, 404), TP(-36, 446), TP(-70, 472, 0, 0, 1), TP(-20, 486), TP(30, 500), TP(20, 620, 0, 0, 1), TP(150, 620, 0, 0, 1)], C.ln, `${ink([[112, 404], [60, 420], [4, 412], [-22, 392]], 1.5, 0.3, 0.5)}${ink([[120, 470], [70, 474], [0, 466], [-40, 462]], 1.5, 0.3, 0.5)}${fill([[120, 380], [70, 404], [10, 400], [-30, 384], [-20, 420], [40, 440], [120, 430]], C.ln[2], 0.6)}`, { k: 1.2 })}
        ${part([TP(70, 286, 0.8), TP(24, 268), TP(-34, 232), TP(-84, 176, 0, 0, 1), TP(-106, 204, 0, 0, 1), TP(-56, 256), TP(-4, 296), TP(52, 322, 0.6)], J, `${fill([[-84, 176], [-106, 204], [-94, 216], [-70, 190]], C.ac)}${ink([[40, 290], [10, 276], [-20, 258], [-44, 236]], 1.5, 0.3, 0.5)}`, { k: 1 })}
        ${part([TP(110, 262, 0.8), TP(60, 282), TP(4, 280), TP(-56, 244, 0, 0, 1), TP(-34, 300), TP(-48, 340), TP(-84, 364, 0, 0, 1), TP(-30, 380), TP(4, 404), TP(-14, 452, 0, 0, 1), TP(36, 440), TP(80, 452), TP(126, 482, 0, 0, 1)], J, `${fill([[-56, 244], [-34, 300], [-48, 340], [-84, 364], [-66, 370], [-32, 344], [-22, 300], [-38, 256]], C.ac)}${fill([[-14, 452], [36, 440], [80, 452], [126, 482], [126, 466], [80, 438], [30, 428], [-8, 438]], C.ac)}${ink([[100, 300], [52, 314], [6, 304], [-24, 286]], 1.5, 0.3, 0.5)}${ink([[110, 380], [60, 380], [0, 366], [-40, 356]], 1.5, 0.3, 0.5)}${ink([[112, 430], [80, 420], [40, 416], [14, 420]], 1.5, 0.3, 0.5)}`, { k: 1.2 })}`;
      const jc = [TP(180, 240, 0.2), TP(204, 258), TP(228, 266), TP(244, 236, 0, 0.2), TP(256, 244, 0, 0.3), TP(252, 268), TP(228, 288), TP(204, 282), TP(166, 248, 0.3)];
      collar = `${part(jc, [C.js2, C.js2, "#2a0c44"], "", { k: 0.3, w: [1, 2.6] })}
        ${part([TP(190, 232, 0.3), TP(156, 236, 0.6), TP(112, 250, 0.9), TP(88, 272, 1), TP(86, 284, 1), TP(96, 294, 1), TP(120, 270, 0.8), TP(158, 256, 0.5), TP(196, 250, 0.2)], J, fill([TP(96, 294, 1), TP(120, 270, 0.8), TP(158, 256, 0.5), TP(196, 250, 0.2), TP(195, 243), TP(156, 248), TP(114, 264), TP(90, 288, 1)], C.ac), { k: 0.6 })}
        ${part([TP(238, 230, 0, 0.3), TP(264, 234, 0, 0.6), TP(294, 246, 0, 0.9), TP(312, 266, 0, 1), TP(312, 280, 0, 1), TP(304, 286, 0, 1), TP(288, 266, 0, 0.8), TP(266, 254, 0, 0.5), TP(240, 248, 0, 0.3)], J, fill([TP(304, 286, 0, 1), TP(288, 266, 0, 0.8), TP(266, 254), TP(240, 248), TP(240, 241), TP(268, 246), TP(294, 260), TP(310, 280, 0, 1)], C.ac), { k: 0.6 })}
        ${part([TP(184, 246, 0.2), TP(152, 184, 0.2, 0, 1), TP(176, 194), TP(200, 222), TP(212, 260, 0, 0, 1)], J, fill([TP(184, 246), TP(152, 184), TP(163, 189), TP(195, 250)], C.ln[0]), { k: 0.5 })}
        ${part([TP(246, 244, 0, 0.2), TP(274, 186, 0, 0.2, 1), TP(258, 198), TP(244, 224), TP(232, 260, 0, 0, 1)], J, fill([TP(246, 244), TP(274, 186), TP(265, 193), TP(238, 250)], C.ln[0]), { k: 0.5 })}`;
    }
    return `<svg class="cn-hero dl-svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${defs}
      <g stroke-linejoin="round" stroke-linecap="round" transform="translate(0 520) skewX(${P.sk}) rotate(${P.lean}) translate(-205 -520) translate(205 0)">
        ${back}${fa.up}${neck}${torso}${na.up}${collar}
        <g transform="translate(${hx} ${hy}) rotate(${hr}) scale(${hsc})">${head(P.ex)}</g>
        ${fa.fo}${na.fo}
      </g>
    </svg>`;
  }
  // 設定で自分の画像を入れているときはそれを使う。それ以外は上のオリジナルの人物
  function avatarHtml(side, pose) {
    let own = "";
    try {
      own = side === "you" ? localStorage.getItem(DuelFx.IMG_KEY) || "" : "";
    } catch (e) {
      own = "";
    }
    if (own) return DuelFx.avatarHtml(side);
    return heroSvg(side, pose);
  }

  // ---------- 画角 ----------
  const hasArt = (m, side) => typeof MonsterArt !== "undefined" && !!MonsterArt.src(m, side);
  const av = (side, cls = "", pose = "base") => `<div class="cn-av ${side} ${cls} p-${pose}">${avatarHtml(side, pose)}</div>`;
  const stars = (n) => "★".repeat(Math.max(1, Math.min(12, n || 4)));
  // 背景: 奥のグラデーション・光の筋・流れる線・ボケを重ねる
  const bg = (kind = "") => `<div class="cn-bg ${kind}"><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i></div>`;
  const floor = () => `<div class="cn-floor"><i></i></div>`;
  // 金属の文字(縁取りの層 + グラデーションの面)。大見出しは1文字ずつ出す
  const metal = (t, attr = "") => `<b class="cn-m" data-c="${esc(t)}" ${attr}><i>${esc(t)}</i></b>`;
  function kt(text, cls = "") {
    let i = 0;
    const word = (w) => `<span>${[...w].map((ch) => metal(ch, `style="--i:${i++}"`)).join("")}</span>`;
    return `<div class="cn-kt ${cls}" aria-label="${esc(text)}">${text.split(" ").map(word).join(" ")}</div>`;
  }
  // 数字(出るときに数え上がる)
  const num = (v, delay, ms = 500, pre = "") => `<b class="cn-m cn-num" data-c="${pre}${v.toLocaleString()}" data-count="${v}" data-pre="${pre}" data-delay="${delay}" data-ms="${ms}"><i>${pre}${v.toLocaleString()}</i></b>`;
  // 絵が無いモンスターの見せ方: 回る紋章の中に絵文字を置く
  function crest(inner, cls = "") {
    const ticks = Array.from({ length: 36 }, (_, i) => `<path d="M100 5 L100 ${i % 3 ? 10 : 16}" transform="rotate(${i * 10} 100 100)"/>`).join("");
    return `<div class="cn-crest ${cls}"><svg viewBox="0 0 200 200" aria-hidden="true"><g class="r1"><circle cx="100" cy="100" r="97"/>${ticks}<circle cx="100" cy="100" r="86" stroke-dasharray="2 6"/></g><g class="r2"><path d="M100 22 L167.5 139 L32.5 139Z"/><path d="M100 178 L32.5 61 L167.5 61Z"/><circle cx="100" cy="100" r="78"/></g><g class="r3"><circle cx="100" cy="100" r="62" stroke-dasharray="14 5 3 5"/><circle cx="100" cy="100" r="54"/></g></svg><span>${inner}</span></div>`;
  }
  // ghosts: 残像の枚数
  function monster(m, cls = "", side = "you", ghosts = 0) {
    let art = hasArt(m, side), body;
    if (art) body = MonsterArt.icon(m, side, "cn-img");
    else {
      // 絵が無いときは、街を飛んでいる3Dの姿を撮った絵を使う
      let url = null;
      try {
        url = typeof window.MonPortrait === "function" ? window.MonPortrait(m, side) : null;
      } catch (e) {}
      if (url) (art = true), (body = `<img class="cn-img cn-3d" src="${url}" alt="${esc(m.name)}" />`);
      else body = crest(esc(m.icon || "❔"));
    }
    let h = "";
    for (let k = ghosts; k >= 0; k--) h += `<div class="cn-monb ${k ? "g g" + k : ""}">${body}</div>`;
    return `<div class="cn-mon ${art ? "art" : "emo"} ${m.synchro ? "syn" : ""} ${m.ace ? "ace" : ""} ${cls}">${h}</div>`;
  }
  const plate = (m) => `<div class="cn-plate"><em style="--n:${Math.max(6, [...m.name].length)}">${esc(m.name)}</em><div class="cn-atk"><small>ATK</small>${num(m.atk, 650, 600)}</div><i>LV ${m.lv || 4} <u>${stars(m.lv)}</u></i></div>`;
  const cardBox = (card, cls) => `<div class="cn-halo ${cls}"></div><div class="cn-card ${cls}"><div class="cn-cardb">${DuelFx.cardHtml(card)}<i class="cn-shine"></i></div></div>`;
  // 画面の色みを変えるショット(金=運命・勝利、赤=ピンチ・敗北)
  function toneOf(c) {
    if (c.gold || (c.card && c.card.fx === "destiny") || (c.shot === "finish" && c.win) || (c.shot === "reversal" && c.side === "you")) return "tone-gold";
    if (c.shot === "pinch" || (c.shot === "finish" && !c.win)) return "tone-red";
    return "";
  }
  function shotHtml(c, ev) {
    const s = c.side;
    switch (c.shot) {
      case "draw":
        return `${bg("speed")}<svg class="cn-arc" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cnArc" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" style="stop-color:var(--c1)" stop-opacity=".9"/><stop offset=".85" style="stop-color:var(--hi)"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><path d="M20 590 C300 580 700 400 980 30 C760 330 420 500 20 590Z" fill="url(#cnArc)"/><path d="M200 585 C440 540 760 360 985 60 C800 330 500 500 200 585Z" fill="#fff" opacity=".7"/></svg>${av(s, "swing", "draw")}<i class="cn-cb"></i>${kt(c.gold ? "DESTINY DRAW!!" : "DRAW!!", "draw")}`;
      case "hold":
        return `${bg("speed")}${av(s, "hold", "thrust")}${cardBox(c.card, "hold")}`;
      case "cardup":
        return `${bg("deep")}${cardBox(c.card, "up")}`;
      case "low":
        return `${bg("deep")}${floor()}<div class="cn-pillar"></div>${monster(c.mon, "low", s)}${plate(c.mon)}`;
      case "two":
        return `${bg("speed")}${floor()}${monster(c.mon, "two", s)}${av(s, "two", "thrust")}${plate(c.mon)}`;
      case "synchro": {
        const n = Math.max(1, Math.min(12, c.lv || 6));
        const born = c.mon ? monster(c.mon, "born", s) : `<div class="cn-mon emo born"><div class="cn-monb">${crest(`<small>Lv</small>${n}`, "lvl")}</div></div>`;
        return `${bg("deep")}<div class="cn-gates"><i></i><i></i><i></i><i></i></div>${(c.from || []).slice(0, 3).map((m, i) => `<div class="cn-mat m${i}"><i></i><span>${esc(m)}</span></div>`).join("")}
          <div class="cn-stars">${Array.from({ length: n }, (_, i) => `<b style="--i:${i};--k:${i - (n - 1) / 2}">★</b>`).join("")}</div>
          <div class="cn-pillar late"></div><div class="cn-born">${born}</div>
          <div class="cn-synt">${kt("SYNCHRO", "in syn")}<p>LEVEL <b>${n}</b> <u>${stars(n)}</u></p></div><div class="cn-flash"></div>`;
      }
      case "chain":
        return `<div class="cn-split you side-you">${bg("deep")}${av("you", "split")}</div><div class="cn-split opp side-opp">${bg("deep")}${av("opp", "split")}</div><div class="cn-seam"><i></i></div>
          <div class="cn-links">${c.links.map((l, i) => `<div class="cn-link side-${l.side === "opp" ? "opp" : "you"}" style="--i:${i}"><em>CHAIN ${l.n}</em><span>${l.icon} ${esc(l.name)}</span></div>`).join("")}</div>`;
      case "attack": {
        const blade = (i, tf) => `<path style="--i:${i}" transform="${tf}" d="M560 30 Q300 270 40 570 Q340 320 560 30Z"/>`;
        return `${bg("rush")}<div class="cn-rush ${s}">${monster(c.mon, "dash", s, 2)}<svg class="cn-slashes" viewBox="0 0 600 600" aria-hidden="true">${blade(0, "translate(-90 -60) scale(.82)")}${blade(1, "")}${blade(2, "translate(150 90) scale(.78)")}</svg></div><div class="cn-impact ${s}"></div>
          <div class="cn-dmgw ${s}">${c.direct ? `<small>DIRECT ATTACK</small>` : ""}<div class="cn-dmg">${num(c.dmg, 830, 480, "−")}</div><em>DAMAGE</em></div>`;
      }
      case "pinch":
        return `${bg("deep")}<div class="cn-eyes"><div class="cn-eyei">${avatarHtml("you", "pinch")}</div></div><svg class="cn-ecg" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 60 L300 60 L322 44 L340 60 L352 60 L366 14 L384 96 L398 60 L430 60 L452 48 L474 60 L760 60 L782 44 L800 60 L812 60 L826 14 L844 96 L858 60 L890 60 L912 48 L934 60 L1000 60"/></svg><div class="cn-lp"><small>LIFE POINT</small>${num(c.lp || 0, 150, 500)}<em>DANGER</em></div>`;
      case "reversal":
        return `<div class="cn-rev ${s}">${bg("deep")}</div><svg class="cn-crack" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M-10 300 L120 250 L190 290 L330 170 L410 230 L520 120 L600 200 L720 90 L800 150 L1010 30"/></svg>${kt(s === "you" ? "逆転!!" : "逆転…!?", s === "you" ? "rev" : "rev long")}
          <div class="cn-lps"><span class="side-you"><small>YOU</small>${num(c.lp[0], 1050, 500)}</span><i>VS</i><span class="side-opp"><small>${esc(ev.foe ? ev.foe.name : "RIVAL")}</small>${num(c.lp[1], 1150, 500)}</span></div>`;
      case "finish":
        return `${bg("deep")}${av(c.win ? "you" : "opp", "finish", "win")}<div class="cn-fin ${c.win ? "win" : "lose"}">${kt("DUEL", "in l1")}${kt(c.win ? "WIN!!" : "LOSE…", "in l2")}<p>${c.win ? "VICTORY" : "DEFEAT"}</p></div><div class="cn-flash"></div>`;
      case "duel":
        return duelHtml();
      case "manga":
        return `<div class="bmanga ${s}"><div class="bm-lines"></div><div class="bm-av">${avatarHtml(s, "thrust")}</div><div class="bm-dodo"><b>ド</b><b>ド</b><b>ド</b><b>ド</b></div></div>`;
      case "glare":
        return `${bg("speed")}${eyeSvg(s)}`;
      case "rival":
        return `${bg("speed")}<div class="cn-band"></div>${av("opp", "rival")}<div class="cn-rname" style="--n:${Math.max(4, [...c.foe.name].length)}"><small>NEW RIVAL</small>${kt(c.foe.name, "in name")}<i>${esc(c.foe.icon || "")} デッキ「${esc(c.foe.deckName || "")}」</i></div>`;
    }
    return "";
  }
  // 対峙ショット: 斜めに裂いた画面の両側に相手と自分。光る裂け目の上に大見出し、手札を構える
  function duelHtml() {
    const fan = (n) => Array.from({ length: n }, (_, i) => `<i style="--k:${i - (n - 1) / 2}"></i>`).join("");
    return `<div class="cn-vs opp side-opp">${bg("speed")}${av("opp", "vs")}<div class="cn-fan top">${fan(5)}</div></div>
      <div class="cn-vs you side-you">${bg("speed")}${av("you", "vs")}<div class="cn-fan bot">${fan(5)}</div></div>
      <div class="cn-seam d"><i></i></div>${kt("DUEL!!", "duel")}`;
  }

  // 片目の極端なアップ(オリジナルの絵柄)。肌と瞳を段階的に塗り分け、まつげ・虹彩の筋・映り込みを描く。自分は青緑、相手は赤の瞳
  function eyeSvg(side) {
    const opp = side === "opp";
    const H = opp ? ["#6c6398", "#aaa2cf", "#e6e2f4", "#ffffff"] : ["#081224", "#1c3556", "#2c5378", "#6f9cc4"];
    const I = opp ? ["#ffc2cc", "#ff5a78", "#c01a40", "#4a0514"] : ["#d6fff4", "#4fe6c4", "#12a08c", "#06343f"];
    const E0 = "M430 520 C520 360 760 290 980 320 C1080 334 1150 380 1190 430 C1160 520 1050 610 860 625 C700 636 540 600 430 520Z";
    const cx = 810, cy = 468;
    // 主人公は切れ長: まぶた・まつげ・眉を縦につぶして低くし、瞳を小さくする(相手はそのまま)
    const sq = (d) => (opp ? d : d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, x, y) => `${x} ${Math.round(cy + (y - cy) * 0.62 + (x - cx) * -0.05)}`));
    const E = sq(E0), ik = opp ? 1 : 0.7;
    // まつげの束: 根元 (bx,by) から先 (tx,ty) へ、反りながら細くなる
    const lash = (bx, by, tx, ty, w) => {
      const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = (-dy / L) * w * 0.5, ny = (dx / L) * w * 0.5, mx = bx + dx * 0.55 - (dy / L) * L * 0.16, my = by + dy * 0.55 + (dx / L) * L * 0.16;
      return `M${Math.round(bx - nx)} ${Math.round(by - ny)} Q${Math.round(mx)} ${Math.round(my)} ${tx} ${ty} Q${Math.round(mx + nx * 0.8)} ${Math.round(my + ny * 0.8)} ${Math.round(bx + nx)} ${Math.round(by + ny)}Z`;
    };
    // 虹彩の筋(明暗を交互に)と、瞳孔のまわりのぎざぎざ
    let fib = "", cor = "";
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2 + (i % 3) * 0.02, r0 = 70 + (i % 4) * 9, r1 = 150 - (i % 5) * 7;
      fib += `<path d="M${(cx + Math.cos(a) * r0).toFixed(1)} ${(cy + Math.sin(a) * r0).toFixed(1)} L${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}" stroke="${i % 2 ? I[0] : I[3]}" stroke-width="${i % 2 ? 2.5 : 4}" opacity="${i % 2 ? 0.5 : 0.3}"/>`;
    }
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2, r = i % 2 ? 72 : 104 + (i % 3) * 8;
      cor += `${i ? "L" : "M"}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
    }
    const hair = ["M-40 -40 L430 -40 C390 160 300 370 180 580 C200 380 130 200 -40 130Z", "M310 -40 L720 -40 C660 80 530 230 410 340 C470 200 410 80 310 -40Z", "M640 -40 L1000 -40 C920 60 810 150 715 205 C750 120 710 40 640 -40Z", "M920 -40 L1640 -40 L1640 300 C1520 200 1320 140 1150 160 C1190 90 1070 20 920 -40Z", "M-40 60 C70 260 120 520 50 940 L-40 940Z", "M1420 -40 L1640 -40 L1640 620 C1600 420 1540 220 1420 -40Z"];
    const shine = ["M60 -20 C150 120 190 300 170 470", "M420 -20 C480 60 480 160 440 250", "M740 -20 C790 30 790 90 760 140", "M1080 -20 C1260 20 1440 80 1600 190", "M1500 -20 C1570 120 1610 280 1620 430"];
    return `<svg class="cn-eye" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cnSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d6b8"/><stop offset=".6" stop-color="#efc4a2"/><stop offset="1" stop-color="#dba585"/></linearGradient>
        <radialGradient id="cnI" cx="50%" cy="68%" r="70%"><stop offset="0" stop-color="${I[0]}"/><stop offset=".3" stop-color="${I[1]}"/><stop offset=".65" stop-color="${I[2]}"/><stop offset="1" stop-color="${I[3]}"/></radialGradient>
        <linearGradient id="cnHr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${H[1]}"/><stop offset="1" stop-color="${H[0]}"/></linearGradient>
        <linearGradient id="cnRim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a0a20" stop-opacity=".5"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="${I[1]}" stop-opacity=".55"/></linearGradient>
        <linearGradient id="cnSw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <clipPath id="cnE"><path d="${E}"/></clipPath>
        <clipPath id="cnIr"><circle cx="${cx}" cy="${cy}" r="170"/></clipPath>
        <clipPath id="cnLid"><rect class="cn-lid" x="380" y="286" width="860" height="352"/></clipPath>
      </defs>
      <rect width="1600" height="900" fill="url(#cnSk)"/>
      <path d="M-20 0 L330 0 C250 260 250 600 330 900 L-20 900Z" fill="#c98f70" opacity=".55"/>
      <path d="M-20 0 L210 0 C150 300 150 600 210 900 L-20 900Z" fill="#a8684e" opacity=".5"/>
      <path d="M0 760 C400 800 1000 790 1600 660 L1600 900 L0 900Z" fill="#d49f80" opacity=".7"/>
      <path d="${sq("M380 470 C500 300 780 215 1010 245 C1110 258 1190 300 1250 380 C1180 330 1090 300 985 296 C760 268 520 340 410 530Z")}" fill="#c98a6a" opacity=".6"/>
      <g stroke="#e58a7a" stroke-width="7" stroke-linecap="round" opacity=".55"><path d="M1010 720 L1050 680"/><path d="M1070 728 L1110 688"/><path d="M1130 730 L1170 690"/><path d="M1190 726 L1230 686"/></g>
      ${hair.map((d) => `<path d="${d}" transform="translate(22 34)" fill="#8a4a38" opacity=".3"/>`).join("")}
      <g class="cn-eyeg">
        <g clip-path="url(#cnLid)">
          <path d="${E}" fill="#f7f9fc"/>
          <g clip-path="url(#cnE)">
            <path d="${sq("M430 520 C520 360 760 290 980 320 C1080 334 1150 380 1190 430 L1190 478 C1140 420 1070 390 975 380 C770 356 560 410 430 560Z")}" fill="#aeb9cc"/>
            <path d="${sq("M430 540 C540 420 770 380 975 400 C1070 410 1140 440 1190 490 L1190 520 C1130 470 1060 446 975 438 C780 420 570 456 430 580Z")}" fill="#d3dae6"/>
            <path d="${sq("M430 520 C460 500 500 500 520 530 C500 560 460 560 430 520Z")}" fill="#e8a79a"/>
            <g class="cn-iris"><g transform="translate(${cx} ${cy}) scale(${ik}) translate(${-cx} ${-cy})">
              <circle cx="${cx}" cy="${cy}" r="170" fill="url(#cnI)"/>
              <path d="${cor}Z" fill="${I[0]}" opacity=".28"/>
              <g stroke-linecap="round">${fib}</g>
              <path d="M${cx - 170} ${cy} A170 170 0 0 1 ${cx + 170} ${cy} C${cx + 90} ${cy - 46} ${cx - 90} ${cy - 46} ${cx - 170} ${cy}Z" fill="#02060c" opacity=".46"/>
              <path d="M${cx - 150} ${cy - 76} A170 170 0 0 1 ${cx + 150} ${cy - 76} C${cx + 70} ${cy - 104} ${cx - 70} ${cy - 104} ${cx - 150} ${cy - 76}Z" fill="#02060c" opacity=".4"/>
              <path d="M${cx - 118} ${cy + 78} A142 142 0 0 0 ${cx + 118} ${cy + 78} A190 190 0 0 1 ${cx - 118} ${cy + 78}Z" fill="${I[0]}" opacity=".75"/>
              <circle cx="${cx}" cy="${cy}" r="163" fill="none" stroke="${I[3]}" stroke-width="16"/>
              <circle cx="${cx}" cy="${cy}" r="171" fill="none" stroke="#05080c" stroke-width="5"/>
              <circle class="cn-pupil" cx="${cx}" cy="${cy}" r="64" fill="#04060a" stroke="${I[2]}" stroke-width="4"/>
              <g clip-path="url(#cnIr)"><g transform="rotate(24 ${cx} ${cy})"><rect class="cn-sweep" x="${cx - 60}" y="${cy - 260}" width="120" height="520" fill="url(#cnSw)"/></g></g>
              <path d="M${cx + 62} ${cy - 96} l44 -16 l22 62 l-44 16Z" fill="${I[0]}" opacity=".7" stroke="#fff" stroke-width="3"/>
              <path d="M${cx - 112} ${cy - 118} C${cx - 84} ${cy - 142} ${cx - 44} ${cy - 138} ${cx - 34} ${cy - 106} C${cx - 28} ${cy - 76} ${cx - 62} ${cy - 54} ${cx - 92} ${cy - 62} C${cx - 122} ${cy - 70} ${cx - 132} ${cy - 100} ${cx - 112} ${cy - 118}Z" fill="#fff"/>
              <circle cx="${cx + 78}" cy="${cy + 86}" r="17" fill="#fff" opacity=".92"/><circle cx="${cx + 108}" cy="${cy + 62}" r="8" fill="#fff" opacity=".8"/>
            </g></g>
          </g>
        </g>
        <g class="cn-ulid">
          <path d="${sq("M398 540 C490 330 760 242 992 270 C1100 286 1185 342 1246 424 L1190 430 C1150 380 1080 334 980 320 C760 290 520 360 430 520Z")}" fill="#150a0c"/>
          <path d="${opp ? [[1050, 306, 1122, 220, 22], [1116, 334, 1218, 260, 26], [1174, 374, 1294, 328, 26], [1218, 418, 1322, 404, 20], [460, 474, 398, 442, 14], [990, 286, 1040, 214, 14]].map((l) => lash(...l)).join("") : sq([[1150, 380, 1326, 300, 30], [1098, 352, 1224, 290, 18], [1196, 420, 1300, 404, 16]].map((l) => lash(...l)).join(""))}" fill="#150a0c"/>
          <path d="${sq("M470 440 C600 330 800 300 980 322")}" fill="none" stroke="#5a3a4a" stroke-width="5" opacity=".7"/>
        </g>
        <path d="${sq("M1188 436 C1150 525 1050 606 860 622 C760 630 650 612 560 584")}" fill="none" stroke="#3a1c16" stroke-width="8" stroke-linecap="round"/>
        <path d="${sq("M1150 520 Q1176 530 1198 554 M1100 566 Q1124 580 1140 606 M1040 596 Q1058 612 1068 640 M980 612 Q992 628 998 650")}" fill="none" stroke="#3a1c16" stroke-width="5" stroke-linecap="round"/>
        <path d="${sq("M470 660 C640 720 900 716 1120 620")}" fill="none" stroke="#b97f63" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      </g>
      <path d="${sq("M466 400 C600 262 820 206 1034 236 C1110 248 1170 280 1214 318")}" fill="none" stroke="#8a5644" stroke-width="7" stroke-linecap="round" opacity=".75"/>
      <path d="${sq("M360 318 C560 176 860 128 1190 150 L1276 122 C1256 170 1220 196 1176 204 C880 186 600 232 392 356Z")}" fill="${H[0]}"/>
      <path d="${sq("M440 276 C640 176 900 150 1180 164")}" fill="none" stroke="${H[2]}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      ${hair.map((d) => `<path d="${d}" fill="url(#cnHr)" stroke="${H[0]}" stroke-width="4" stroke-linejoin="round"/>`).join("")}
      ${shine.map((d, i) => `<path d="${d}" fill="none" stroke="${H[i % 2 ? 2 : 3]}" stroke-width="${i % 2 ? 9 : 5}" stroke-linecap="round" opacity=".7"/>`).join("")}
      <path d="M150 -20 L250 -20 C240 120 200 260 150 380 C170 240 170 100 150 -20Z" fill="${H[2]}" opacity=".55"/>
      <rect width="1600" height="900" fill="url(#cnRim)"/>
      <path class="cn-star" d="M${cx - 80} ${cy - 190} L${cx - 70} ${cy - 108} L${cx + 12} ${cy - 98} L${cx - 70} ${cy - 88} L${cx - 80} ${cy - 6} L${cx - 90} ${cy - 88} L${cx - 172} ${cy - 98} L${cx - 90} ${cy - 108}Z" fill="#fff"/>
      <path class="cn-glint" d="M-100 470 L1700 410 L1700 432 L-100 500Z" fill="#fff"/>
    </svg>`;
  }

  // ---------- 光と粒の演出(キャンバス): 漂う粒・集中線・光の輪・火花・衝撃波・稲妻・レンズの光・紙吹雪・画面の揺れ ----------
  const reduce = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const FX = (() => {
    let cv = null, g = null, W = 0, H = 0, raf = 0, st = null, stageEl = null;
    const R = Math.random, TAU = Math.PI * 2;
    const PAL = { you: ["#5ff5c0", "#5fd0ff", "#eaffff"], opp: ["#ff5a8a", "#c060ff", "#ffe6f0"], gold: ["#ffd24a", "#ff9a2a", "#fff6d0"] };
    function spark(x, y, n, sp, cols, o = {}) {
      for (let i = 0; i < n; i++) {
        const a = o.dir != null ? o.dir + (R() - 0.5) * (o.spread || 1) : R() * TAU, v = sp * (0.25 + R() * 0.9);
        st.P.push({ x, y, px: x, py: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: (o.life || 0.9) * (0.5 + R()), w: (o.w || 2.2) * (0.5 + R()), col: cols[(R() * cols.length) | 0], grav: o.grav == null ? 500 : o.grav, drag: o.drag || 1.6, flat: !!o.flat, rot: R() * TAU, vr: (R() - 0.5) * 12 });
      }
    }
    const ring = (x, y, col, v, w) => st.rings.push({ x, y, r: 10, v: v || H * 1.6, a: 1, col, w: w || 10 });
    const flash = (a, col) => ((st.flash = Math.max(st.flash, a)), (st.flashCol = col || "#ffffff"));
    const flare = (x, y, col, len) => st.flares.push({ x, y, col, a: 1, len: len || 0.6 });
    function bolt(x0, y0, x1, y1, col) {
      const pts = [[x0, y0]], n = 9;
      for (let i = 1; i < n; i++) pts.push([x0 + ((x1 - x0) * i) / n + (R() - 0.5) * W * 0.08, y0 + ((y1 - y0) * i) / n + (R() - 0.5) * H * 0.05]);
      pts.push([x1, y1]);
      st.bolts.push({ pts, a: 1, col });
    }
    function once(key, at, t, fn) {
      if (t >= at && !st.done[key]) (st.done[key] = 1), fn();
    }
    // 集中線(中心から外へ流れる線)。horiz: 0=放射 ±1=横に流れる
    function lines(t, cx, cy, col, dense, horiz) {
      g.globalCompositeOperation = "lighter";
      g.strokeStyle = col;
      for (const L of st.L) {
        const k = (t * L.sp + L.ph) % 1;
        g.globalAlpha = Math.sin(k * Math.PI) * L.al * dense;
        g.lineWidth = L.w * st.dpr;
        g.beginPath();
        if (horiz) {
          const y = L.ph2 * H, x = (horiz > 0 ? k : 1 - k) * (W * 1.6) - W * 0.3, len = W * (0.12 + L.len * 0.3);
          g.moveTo(x, y);
          g.lineTo(x - horiz * len, y);
        } else {
          const r0 = Math.hypot(W, H) * (0.16 + k * 0.5), r1 = r0 + Math.hypot(W, H) * (0.1 + L.len * 0.28);
          g.moveTo(cx + Math.cos(L.a) * r0, cy + Math.sin(L.a) * r0);
          g.lineTo(cx + Math.cos(L.a) * r1, cy + Math.sin(L.a) * r1);
        }
        g.stroke();
      }
      g.globalAlpha = 1;
    }
    function glow(x, y, r, col, a) {
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, col);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.globalCompositeOperation = "lighter";
      g.globalAlpha = a;
      g.fillStyle = gr;
      g.fillRect(x - r, y - r, r * 2, r * 2);
      g.globalAlpha = 1;
    }
    // 後ろで回る光の扇
    function rays(t, cx, cy, col, n, a) {
      g.globalCompositeOperation = "lighter";
      g.fillStyle = col;
      const rad = Math.hypot(W, H);
      for (let i = 0; i < n; i++) {
        const a0 = t * 0.35 + (i / n) * TAU, wd = (TAU / n) * (0.22 + 0.12 * Math.sin(t * 2 + i));
        g.globalAlpha = a * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.7));
        g.beginPath();
        g.moveTo(cx, cy);
        g.arc(cx, cy, rad, a0, a0 + wd);
        g.closePath();
        g.fill();
      }
      g.globalAlpha = 1;
    }
    // 空気中の粒とボケ(奥行きごとに速さと大きさを変えて、カメラが動いて見えるように)
    function ambient(t, p) {
      g.globalCompositeOperation = "lighter";
      for (const d of st.D) {
        const z = d.z, x = ((((d.x + t * 0.014 * (0.3 + z) * d.dx) % 1) + 1) % 1) * W, y = ((((d.y - t * 0.022 * (0.3 + z)) % 1) + 1) % 1) * H;
        g.globalAlpha = (z > 0.6 ? 0.1 : 0.55 - z * 0.4) * (0.6 + 0.4 * Math.sin(t * 2 + d.ph * 9));
        g.fillStyle = p[d.c];
        g.beginPath();
        g.arc(x, y, (1 + z * z * 20) * st.dpr, 0, TAU);
        g.fill();
      }
      g.globalAlpha = 1;
    }
    // レンズに入った強い光(横に伸びる筋とゴースト)
    function drawFlare(f) {
      const L = W * f.len, h = H * 0.014;
      g.globalCompositeOperation = "lighter";
      const gr = g.createLinearGradient(f.x - L, 0, f.x + L, 0);
      gr.addColorStop(0, "rgba(0,0,0,0)");
      gr.addColorStop(0.5, f.col);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.globalAlpha = f.a;
      g.fillStyle = gr;
      g.beginPath();
      g.ellipse(f.x, f.y, L, h, 0, 0, TAU);
      g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.ellipse(f.x, f.y, L * 0.45, h * 0.3, 0, 0, TAU);
      g.fill();
      const dx = W / 2 - f.x, dy = H / 2 - f.y;
      for (const [k, r] of [[0.5, 0.03], [1.4, 0.05], [2, 0.09]]) {
        g.globalAlpha = f.a * 0.14;
        g.fillStyle = f.col;
        g.beginPath();
        g.arc(f.x + dx * k, f.y + dy * k, H * r, 0, TAU);
        g.fill();
      }
      g.globalAlpha = 1;
      glow(f.x, f.y, H * 0.2, f.col, f.a * 0.7);
      glow(f.x, f.y, H * 0.06, "#ffffff", f.a);
    }
    // ショットごとの見せ場の位置(CSSの配置に合わせる)
    const land = () => W > H;
    const SHOT = {
      synchro(t, c, p) {
        const cx = W / 2, cy = H * 0.46, n = Math.max(3, Math.min(10, c.lv || 6));
        glow(cx, cy, H * (0.5 + t * 0.2), p[0], 0.18 + 0.1 * Math.sin(t * 9));
        lines(t, cx, cy, p[2], 0.4 + Math.min(1, t) * 0.5, 0);
        if (t < 1.45) {
          // 奥から手前へ次々に通り抜ける光の輪
          g.globalCompositeOperation = "lighter";
          for (let k = 0; k < n; k++) {
            const u = (t * 0.75 + k / n) % 1, r = H * (0.04 + u * u * 1.1);
            g.globalAlpha = Math.min(1, u * 4) * (1 - u) * 1.4 * Math.min(1, t * 3);
            g.strokeStyle = p[0];
            g.shadowColor = p[0];
            g.shadowBlur = 30 * st.dpr;
            g.lineWidth = (2 + u * 12) * st.dpr;
            g.beginPath();
            g.ellipse(cx, cy, r, r * 0.92, t * 0.6 + k, 0, TAU);
            g.stroke();
          }
          g.shadowBlur = 0;
          // 星がらせんを描いて中心へ吸い込まれる
          const u = Math.min(1, t / 1.4), e = u * u;
          for (let k = 0; k < n; k++) {
            const a = (k / n) * TAU + t * 3 + e * 4, r = H * 0.42 * (1 - e);
            const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.6;
            glow(x, y, 26 * st.dpr, "#ffffff", 0.9);
            glow(x, y, 70 * st.dpr, p[2], 0.5);
            if (R() < 0.6) spark(x, y, 1, 60, p, { grav: 0, life: 0.5, w: 1.5 });
          }
          glow(cx, cy, H * 0.12 * (0.4 + e), "#ffffff", e);
        }
        once("burst", 1.45, t, () => {
          flash(1);
          spark(cx, cy, 280, H * 1.5, [p[0], p[2], "#ffffff"], { grav: 120, life: 1.2, w: 3 });
          ring(cx, cy, p[0]);
          ring(cx, cy, "#ffffff", H * 2.4, 6);
          flare(cx, cy, p[0], 0.9);
          st.shake = 22;
        });
        if (t > 1.45) {
          rays(t, cx, H * 0.55, p[0], 14, 0.12);
          if (R() < 0.8) spark(cx + (R() - 0.5) * H * 0.7, H * 0.86, 2, H * 0.6, p, { dir: -Math.PI / 2, spread: 0.3, grav: -80, life: 1.6, w: 2.2, drag: 0.5 });
        }
      },
      attack(t, c, p) {
        const dir = c.side === "opp" ? -1 : 1, cx = land() ? W * (0.5 + dir * 0.18) : W / 2, cy = H * (land() ? 0.46 : 0.5);
        lines(t * 1.6, cx, cy, p[2], t < 0.72 ? 1 : 0.45, dir);
        if (t < 0.72) {
          // 光の尾を引いて突っ込む
          const u = t / 0.72, x = cx - dir * W * 0.75 * (1 - u * u), y = cy + Math.sin(u * 3) * H * 0.02;
          glow(x, y, H * 0.3, p[0], 0.5);
          g.globalCompositeOperation = "lighter";
          const gr = g.createLinearGradient(x, y, x - dir * W * 0.5, y);
          gr.addColorStop(0, p[2]);
          gr.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = gr;
          g.globalAlpha = 0.55;
          g.beginPath();
          g.moveTo(x + dir * H * 0.09, y);
          g.lineTo(x, y - H * 0.045);
          g.lineTo(x - dir * W * 0.5, y);
          g.lineTo(x, y + H * 0.045);
          g.fill();
          g.globalAlpha = 1;
          spark(x, y, 4, 500, p, { dir: dir > 0 ? Math.PI : 0, spread: 1.2, grav: 200, life: 0.5 });
        }
        once("hit", 0.72, t, () => {
          flash(1);
          st.shake = 36;
          spark(cx, cy, 300, H * 1.8, [p[0], "#ffffff", "#ffd24a"], { life: 1.1, w: 3.2 });
          spark(cx, cy, 70, H * 0.9, ["#ffffff", "#ffd24a"], { flat: true, life: 1.4, w: 7, grav: 900 });
          spark(cx, cy, 90, H * 1.4, ["#ffffff"], { dir: dir > 0 ? 0 : Math.PI, spread: 0.9, life: 0.9, w: 4, grav: 200 });
          ring(cx, cy, "#ffffff", H * 2.6, 14);
          ring(cx, cy, p[0], H * 1.7, 22);
          ring(cx, cy, "#ffd24a", H * 1.1, 8);
          flare(cx, cy, "#ffb060", 0.8);
          for (let i = 0; i < 6; i++) bolt(cx, cy, cx + (R() - 0.5) * W * 1.2, cy + (R() - 0.5) * H * 1.2, p[2]);
        });
        if (t > 0.72) {
          glow(cx, cy, H * 0.7, c.side === "opp" ? "#ff2a50" : "#ff5a3a", Math.max(0.12, 0.6 - (t - 0.72) * 0.5));
          if (R() < 0.6) spark(cx + (R() - 0.5) * W * 0.4, cy + (R() - 0.5) * H * 0.4, 1, 90, ["#ffd24a", "#ff7a3a"], { grav: -120, life: 1.2, w: 2 });
        }
      },
      summon(t, c, p, big) {
        const k = { low: [0.64, 0.5], two: [0.3, 0.3], manga: [0.66, 0.5], rival: [0.72, 0.5] }[c.shot] || [0.5, 0.5];
        const cx = W * (land() ? k[0] : k[1]), cy = H * 0.5;
        rays(t, cx, cy, p[0], 14, 0.12);
        glow(cx, cy, H * 0.8, p[0], 0.2 + 0.08 * Math.sin(t * 8));
        lines(t, cx, cy, p[2], 0.6, 0);
        if (R() < 0.8) spark(R() * W, H + 10, 2, H * 0.5, p, { dir: -Math.PI / 2, spread: 0.5, grav: -60, life: 2, w: 2.4, drag: 0.4 });
        once("in", 0.05, t, () => {
          flash(0.7, p[2]);
          st.shake = big ? 26 : 12;
          ring(cx, H * 0.8, p[0], H * 1.8, 16);
          spark(cx, H * 0.8, big ? 220 : 110, H * 1.3, p, { dir: -Math.PI / 2, spread: 2.6, life: 1.3 });
          if (big) flare(cx, H * 0.42, p[0], 0.7);
        });
        if (big && (st.bt = (st.bt || 0) - st.dt) <= 0) {
          st.bt = 0.22 + R() * 0.3;
          const x = cx + (R() - 0.5) * W * 0.8;
          bolt(x, 0, x + (R() - 0.5) * W * 0.3, H * (0.5 + R() * 0.4), p[2]);
          flash(0.2, p[2]);
        }
      },
      draw(t, c, p) {
        lines(t * 1.3, W * 0.5, H * 0.5, p[2], 0.35, c.side === "opp" ? -1 : 1);
        // 振り抜いた腕の軌跡に沿って火花が飛ぶ
        const u = Math.min(1, Math.max(0, (t - 0.22) / 0.4)), L = land();
        const x = W * (L ? 0.26 + u * 0.66 : 0.05 + u * 0.8), y = H * (L ? 0.84 - u * u * 0.7 : 0.6 - u * u * 0.38);
        if (t > 0.22 && u < 1) spark(x, y, 14, 420, p, { grav: 300, life: 0.8 });
        once("f", 0.6, t, () => {
          flash(c.gold ? 0.8 : 0.35, p[2]);
          flare(x, y, p[0], c.gold ? 0.9 : 0.55);
          ring(x, y, p[0], H * 1.2, 6);
          if (c.gold) spark(x, y, 220, H * 1.3, p, { life: 1.3 });
        });
        if (c.gold) rays(t, x, y, p[0], 12, 0.12);
      },
      card(t, c, p) {
        const hold = c.shot === "hold", cx = W * (hold ? 0.68 : 0.5), cy = H * (land() ? 0.46 : hold ? 0.4 : 0.44);
        rays(t, cx, cy, p[0], 10, 0.1);
        glow(cx, cy, H * 0.7, p[0], 0.2);
        for (let i = 0; i < 3; i++) {
          const a = t * 2.4 + i * 2.1, r = H * 0.36;
          spark(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r, 1, 90, p, { grav: -40, life: 0.8, w: 2 });
        }
        once("f", 0.05, t, () => (flash(0.45, p[2]), ring(cx, cy, p[0], H * 1.2, 5)));
        once("g", 0.55, t, () => flare(cx - H * 0.08, cy - H * 0.2, p[2], 0.45));
      },
      glare(t, c, p) {
        // 瞳の光の位置を、SVGの座標から画面へ
        const sc = land() ? Math.max(W / 1600, H / 900) : (W * 0.62) / 900;
        const x = W / 2 + (737 - 800) * sc, y = H / 2 + (372 - 450) * sc;
        lines(t * 0.6, x, y, p[2], 0.22, 0);
        once("g", 1.0, t, () => (flare(x, y, p[0], 1), flash(0.3, p[2]), spark(x, y, 40, H * 0.6, [p[2], "#ffffff"], { grav: 0, life: 0.7, w: 1.6 })));
      },
      pinch(t) {
        const a = 0.35 + 0.25 * Math.sin(t * 7.8);
        const gr = g.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, Math.hypot(W, H) * 0.6);
        gr.addColorStop(0, "rgba(0,0,0,0)");
        gr.addColorStop(1, `rgba(255,20,50,${a})`);
        g.globalCompositeOperation = "lighter";
        g.fillStyle = gr;
        g.fillRect(0, 0, W, H);
        if (R() < 0.5) spark(R() * W, -10, 1, 80, ["#ff5a6a", "#7a1020"], { dir: Math.PI / 2, spread: 0.6, grav: 60, life: 3, w: 2, drag: 0.2 });
        if (((t * 1.25) | 0) !== st.beat) (st.beat = (t * 1.25) | 0), (st.shake = 8);
      },
      finish(t, c, p) {
        const L = land(), cx = W * (L ? 0.7 : 0.5), cy = H * (L ? 0.45 : 0.62);
        if (c.win) {
          rays(t, cx, cy, "#ffd24a", 16, 0.16);
          lines(t, cx, cy, "#fff6d0", 0.7, 0);
          if (R() < 0.9) spark(R() * W, -10, 4, 260, ["#ffd24a", "#5fd0ff", "#ff5a8a", "#5ff5c0", "#ffffff"], { dir: Math.PI / 2, spread: 1.2, grav: 260, life: 3, w: 8, flat: true, drag: 0.6 });
          once("f", 0.05, t, () => (flash(1), (st.shake = 30), ring(cx, cy, "#ffd24a"), ring(cx, cy, "#ffffff", H * 2.4, 8), spark(cx, cy, 320, H * 1.7, PAL.gold, { life: 1.4, w: 3 })));
          once("f2", 0.9, t, () => (ring(cx, cy, "#ffd24a", H * 1.4), flare(cx, cy - H * 0.1, "#ffd24a", 0.8), spark(cx, cy, 160, H * 1.2, PAL.gold, { life: 1.2 })));
        } else {
          glow(cx, cy, H, "#5a0618", 0.5);
          if (R() < 0.7) spark(R() * W, H + 10, 2, 160, ["#ff3d5a", "#7a1020", "#ff9a6a"], { dir: -Math.PI / 2, spread: 0.7, grav: -30, life: 2.6, w: 2.4, drag: 0.3 });
          once("f", 0.05, t, () => (flash(0.9, "#ff2a50"), (st.shake = 30), ring(cx, cy, "#ff3d5a")));
        }
      },
      // 対峙・逆転: 裂け目に沿って火花が走る
      clash(t, c, p) {
        const L = land(), duel = c.shot === "duel";
        lines(t, W / 2, H / 2, p[2], 0.6, 0);
        once("f", duel ? 0.22 : 0.66, t, () => {
          flash(0.9);
          st.shake = 22;
          for (let i = 0; i <= 26; i++) {
            const u = i / 26;
            const x = duel ? (L ? W * (0.58 - u * 0.16) : W * u) : W * u, y = duel ? (L ? H * u : H * (0.62 - u * 0.26)) : H * (0.68 - u * 0.5);
            spark(x, y, 9, H * 0.8, ["#ffffff", "#ffd24a", p[0]], { life: 0.9 });
          }
          ring(W / 2, H / 2, "#ffffff");
          flare(W / 2, H * 0.46, p[0], 0.9);
        });
      },
      chain(t, c, p) {
        const n = (c.links || []).length;
        for (let k = 0; k < n; k++)
          once("c" + k, 0.15 + k * 0.22, t, () => {
            const y = H * (0.7 - (0.5 * k) / Math.max(1, n - 1));
            bolt(0, y, W, y + (R() - 0.5) * H * 0.1, k % 2 ? PAL.opp[0] : PAL.you[0]);
            spark(W / 2, y, 60, H * 0.9, k % 2 ? PAL.opp : PAL.you, { life: 0.8 });
            flash(0.25);
            st.shake = 8;
          });
        lines(t, W / 2, H / 2, "#ffffff", 0.3, 0);
      },
    };
    const MAP = { synchro: "synchro", attack: "attack", low: "summon", two: "summon", manga: "summon", draw: "draw", hold: "card", cardup: "card", pinch: "pinch", finish: "finish", reversal: "clash", duel: "clash", rival: "summon", glare: "glare", chain: "chain" };
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!st || !cv.isConnected) return stop();
      const t = (now - st.t0) / 1000, dt = Math.min(0.05, (now - st.last) / 1000);
      st.last = now;
      st.dt = dt;
      // 大きな画面では描く解像度を抑える(横1920まで)
      const res = Math.min(2, window.devicePixelRatio || 1, 1920 / Math.max(1, cv.clientWidth));
      const cw = Math.round(cv.clientWidth * res), ch = Math.round(cv.clientHeight * res);
      if (cv.width !== cw || cv.height !== ch) (cv.width = cw), (cv.height = ch);
      W = cw;
      H = ch;
      st.dpr = Math.max(res, Math.hypot(W, H) / 1468); // 線や粒の太さの単位(1280x720 で 1)
      g.globalCompositeOperation = "source-over";
      g.clearRect(0, 0, W, H);
      const c = st.c, p = st.pal, fn = SHOT[MAP[c.shot]];
      ambient(t, p);
      if (fn) fn(t, c, p, c.shot === "low" || c.shot === "manga");
      // 衝撃波
      g.globalCompositeOperation = "lighter";
      st.rings = st.rings.filter((r) => r.a > 0.02);
      for (const r of st.rings) {
        r.r += r.v * dt * 0.9;
        r.a *= Math.exp(-dt * 2.6);
        g.globalAlpha = r.a;
        g.strokeStyle = r.col;
        g.lineWidth = r.w * st.dpr * (0.3 + r.a);
        g.beginPath();
        g.ellipse(r.x, r.y, r.r, r.r * 0.9, 0, 0, TAU);
        g.stroke();
      }
      // 稲妻
      st.bolts = st.bolts.filter((b) => b.a > 0.03);
      for (const b of st.bolts) {
        b.a *= Math.exp(-dt * 7);
        for (const [w, col] of [[9, b.col], [3, "#ffffff"]]) {
          g.globalAlpha = b.a * (w > 5 ? 0.5 : 1);
          g.strokeStyle = col;
          g.lineWidth = w * st.dpr;
          g.lineJoin = "bevel";
          g.beginPath();
          b.pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
          g.stroke();
        }
      }
      // 火花・紙吹雪
      g.lineCap = "round";
      const P = st.P;
      for (let i = P.length - 1; i >= 0; i--) {
        const q = P[i];
        q.life += dt;
        if (q.life > q.max) {
          P[i] = P[P.length - 1];
          P.pop();
          continue;
        }
        q.px = q.x;
        q.py = q.y;
        const dr = Math.exp(-q.drag * dt);
        q.vx *= dr;
        q.vy = q.vy * dr + q.grav * st.dpr * dt;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        const a = 1 - q.life / q.max;
        g.globalAlpha = Math.min(1, a * 1.6);
        if (q.flat) {
          q.rot += q.vr * dt;
          g.fillStyle = q.col;
          g.save();
          g.translate(q.x, q.y);
          g.rotate(q.rot);
          g.scale(1, Math.cos(q.rot * 1.7));
          g.fillRect(-q.w * st.dpr, -q.w * st.dpr * 0.6, q.w * 2 * st.dpr, q.w * 1.2 * st.dpr);
          g.restore();
        } else {
          g.strokeStyle = q.col;
          g.lineWidth = q.w * st.dpr * (0.4 + a);
          g.beginPath();
          g.moveTo(q.px - q.vx * 0.012, q.py - q.vy * 0.012);
          g.lineTo(q.x, q.y);
          g.stroke();
        }
      }
      if (P.length > 2600) P.splice(0, P.length - 2600);
      // レンズの光
      st.flares = st.flares.filter((f) => f.a > 0.02);
      for (const f of st.flares) {
        drawFlare(f);
        f.a *= Math.exp(-dt * 2.4);
      }
      // 画面全体の光
      if (st.flash > 0.01) {
        g.globalCompositeOperation = "lighter";
        g.globalAlpha = st.flash;
        g.fillStyle = st.flashCol;
        g.fillRect(0, 0, W, H);
        st.flash *= Math.exp(-dt * 6);
      }
      g.globalAlpha = 1;
      // 揺れ
      if (stageEl) {
        if (st.shake > 0.4) {
          const k = st.shake * Math.max(1, cv.clientHeight / 720);
          stageEl.style.transform = `translate(${((R() - 0.5) * k).toFixed(1)}px,${((R() - 0.5) * k).toFixed(1)}px) scale(1.03)`;
          st.shake *= Math.exp(-dt * 7);
        } else if (stageEl.style.transform) stageEl.style.transform = "";
      }
    }
    function start(el, c, tone) {
      cv = el.querySelector(".cn-fx");
      stageEl = el.querySelector(".cn-stage");
      if (stageEl) stageEl.style.transform = "";
      if (!cv) return;
      if (reduce()) return;
      g = cv.getContext("2d");
      const now = performance.now();
      const L = Array.from({ length: 110 }, () => ({ a: R() * TAU, sp: 0.6 + R() * 1.6, ph: R(), ph2: R(), len: R(), w: 0.6 + R() * 2.4, al: 0.15 + R() * 0.5 }));
      const D = Array.from({ length: 80 }, () => ({ x: R(), y: R(), z: R(), ph: R(), dx: R() < 0.5 ? -1 : 1, c: (R() * 3) | 0 }));
      const pal = tone === "tone-gold" ? PAL.gold : tone === "tone-red" ? PAL.opp : PAL[c.side] || PAL.you;
      st = { c, pal, t0: now, last: now, P: [], rings: [], bolts: [], flares: [], L, D, done: {}, flash: 0, flashCol: "#fff", shake: 0, dpr: 1, dt: 0.016 };
      if (!raf) raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      st = null;
    }
    return { start, stop };
  })();

  // ---------- 再生 ----------
  let timer = null, pre = null;
  let pending = null; // 再生中に次の見せ場が来たら、終わってから続けて流す
  const busy = () => !!document.getElementById("cine");
  // カードの拡大率を画面の大きさから決めるための値
  function fit() {
    const el = document.getElementById("cine");
    if (el) (el.style.setProperty("--cnw", el.clientWidth), el.style.setProperty("--cnh", el.clientHeight));
  }
  function stop() {
    clearTimeout(timer);
    clearTimeout(pre);
    FX.stop();
    pending = null;
    window.removeEventListener("resize", fit);
    const el = document.getElementById("cine");
    if (el) el.remove();
  }
  // 数字を数え上げる([data-count])
  function runCounts(root) {
    const rm = reduce();
    root.querySelectorAll("[data-count]").forEach((el) => {
      const to = +el.dataset.count, preTxt = el.dataset.pre || "", ms = +el.dataset.ms || 500, face = el.querySelector("i");
      const set = (v) => {
        const s = preTxt + Math.round(v).toLocaleString();
        face.textContent = s;
        el.dataset.c = s;
      };
      if (rm || !window.requestAnimationFrame) return set(to);
      const t0 = performance.now() + (+el.dataset.delay || 0);
      set(0);
      const tick = (now) => {
        if (!el.isConnected) return;
        const u = Math.min(1, Math.max(0, (now - t0) / ms));
        set(to * (1 - Math.pow(1 - u, 3)));
        if (u < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
  // カットの切り替え方(入ってくるショットで決める): 白フラッシュ / 斜めの帯のワイプ / 上下から閉じる幕
  const TR = { synchro: "flash", finish: "flash", reversal: "flash", cardup: "flash", low: "flash", attack: "wipe", draw: "wipe", rival: "wipe", hold: "wipe", two: "wipe", duel: "shut", chain: "shut", manga: "shut", pinch: "shut", glare: "shut" };
  // onCut(cut): そのカットのセリフを話す(声の高さ・速さは cut.tone で変える)
  function play(ev, onCut, onEnd) {
    const cuts = ev.cuts || plan(ev); // ev.cuts: カットを直接指定(確認用)
    if (!cuts.length) return false;
    if (busy()) {
      pending = { ev, onCut, onEnd };
      return cuts;
    }
    stop();
    document.body.insertAdjacentHTML("beforeend", `<div class="cine" id="cine" role="dialog" aria-label="デュエルの見せ場"><div class="cn-stage"></div><canvas class="cn-fx"></canvas><div class="cn-grade"></div><div class="cn-tr"></div><div class="cn-sub"></div><div class="cn-bar t"></div><div class="cn-bar b"></div></div>`);
    const el = document.getElementById("cine");
    const stage = el.querySelector(".cn-stage");
    const sub = el.querySelector(".cn-sub");
    const tr = el.querySelector(".cn-tr");
    fit();
    window.addEventListener("resize", fit);
    let i = 0;
    const end = () => {
      const p = pending;
      stop();
      if (onEnd) onEnd();
      if (p) play(p.ev, p.onCut, p.onEnd);
    };
    el.addEventListener("click", end);
    const trCls = (c, dir) => `cn-tr ${dir} ${TR[c.shot] || "flash"} side-${c.side}`;
    const next = () => {
      if (i >= cuts.length || !document.body.contains(el)) return end();
      const c = cuts[i++];
      const line = c.line || "", tone = toneOf(c);
      const dur = Math.max(DUR[c.shot] || 1.6, Math.min(3.2, line.length * 0.12));
      stage.className = `cn-stage shot-${c.shot} side-${c.side} ${tone}`;
      stage.style.setProperty("--dur", dur + "s");
      stage.innerHTML = `<div class="cn-cam">${shotHtml(c, ev)}</div>`;
      sub.innerHTML = line ? `<span>${esc(line)}</span>` : "";
      sub.className = `cn-sub side-${c.side} ${tone}`;
      tr.className = "cn-tr";
      void stage.offsetWidth;
      tr.className = trCls(c, "in");
      runCounts(stage);
      FX.start(el, c, tone);
      cueSfx(c);
      if (onCut) onCut(c);
      timer = setTimeout(next, dur * 1000);
      // 次のカットの少し前から、切り替えの幕をかぶせる
      const nx = cuts[i];
      if (nx) pre = setTimeout(() => ((tr.className = trCls(nx, "out")), sfx("sweep")), dur * 1000 - 150);
    };
    next();
    return cuts;
  }
  function cueSfx(c) {
    const dir = c.side === "opp" ? -1 : 1;
    const m = {
      draw: () => (sfx("whoosh", 0, dir), sfx("slash", 0.25, dir), c.gold && (sfx("shine", 0.55), sfx("boom", 0.6))),
      hold: () => (sfx("whoosh", 0, dir), sfx("shine", 0.15)),
      cardup: () => (sfx("shine"), sfx("stab", 0.05)),
      low: () => (sfx("stab", 0.05, c.side === "opp"), sfx("hit", 0.05), sfx("boom", 0.1)),
      two: () => (sfx("stab", 0.05, c.side === "opp"), sfx("whoosh", 0, dir)),
      synchro: () => (sfx("riser"), sfx("hit", 1.45), sfx("boom", 1.45), sfx("shine", 1.5), sfx("stab", 1.6)),
      chain: () => c.links.forEach((_, k) => sfx("clink", 0.15 + k * 0.22)),
      attack: () => (sfx("whoosh", 0, dir), sfx("slash", 0.66, dir), sfx("hit", 0.72), sfx("boom", 0.74)),
      pinch: () => sfx("heart"),
      reversal: () => (sfx("slash", 0.6), sfx("hit", 0.68), sfx("stab", 0.75, c.side === "opp"), sfx("boom", 0.7)),
      finish: () => (sfx("hit", 0.05), sfx("boom", 0.05), sfx("stab", 0.3, !c.win), c.win && sfx("shine", 0.9)),
      rival: () => (sfx("whoosh", 0, -1), sfx("stab", 0.15, true), sfx("boom", 0.15)),
      duel: () => (sfx("whoosh"), sfx("slash", 0.18), sfx("hit", 0.25), sfx("stab", 0.3)),
      manga: () => (sfx("stab", 0.05, c.side === "opp"), sfx("hit", 0.4), sfx("boom", 0.4)),
      glare: () => (sfx("heart"), sfx("slash", 0.98), sfx("shine", 1)),
    };
    if (m[c.shot]) m[c.shot]();
  }

  return { plan, play, stop, busy, unlock, sfx };
})();

if (typeof module !== "undefined") module.exports = Cinema;

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
  // セルアニメ調: 主線は外側を太く内側を細く、塗りは 地の色+影2段+逆光のふち。顔は斜め向きで、鋭い目と風になびく髪。
  // 自分=紺の髪・青緑の目・白い上着(裏地オレンジ) / 相手=銀の長髪・赤い目・黒い上着(裏地赤)。
  // pose: base(カードを顔の横に構える) / draw(カードを引き抜く) / thrust(腕を前へ突き出す) / win(こぶしを突き上げる) / pinch(目元の帯に使う顔のアップ)
  // 目の高さは絵の上から2割(ピンチの目元の帯が合わせている)。腕は絵の枠の外まで伸びる(overflow: visible)
  let heroSeq = 0;
  const HERO_POSE = {
    base: { head: [211, 120, -4], lean: 0, sk: -3, far: [348, 378, 336, 272], fh: "card", near: [60, 396, 98, 484], nh: "fist", ex: "smile" },
    draw: { head: [218, 122, 5], lean: 5, sk: -6, far: [378, 236, 446, 138], fh: "card", near: [76, 404, 164, 430], nh: "deck", ex: "shout" },
    thrust: { head: [216, 121, 2], lean: 4, sk: -8, far: [390, 284, 478, 252], fh: "open", near: [44, 366, 100, 434], nh: "fist", ex: "shout" },
    win: { head: [206, 122, -9], lean: -4, sk: 2, far: [364, 204, 356, 104], fh: "fist", near: [56, 392, 112, 460], nh: "fist", ex: "grin" },
  };
  function heroSvg(side, pose) {
    const o = side === "opp";
    const C = o
      ? { K: "#12060f", rim: "#ff9fd0", skin: ["#f4d6c6", "#d8a393", "#b07a7c"], hair: ["#e6e2f4", "#aaa2cf", "#6c6398"], hi: "#ffffff", brow: "#4f477c", jk: ["#2b2636", "#17131f", "#0b0910"], ac: "#b03dff", ln: ["#b3143a", "#7d0d29", "#4d0719"], js: ["#262231", "#16121d", "#0b0910"], js2: "#4b1876", st: "#e0284f", st2: "#b03dff", gl: ["#b3172f", "#7c0d20", "#4d0713"], iris: ["#5c0716", "#e0203f", "#ff8a8a"], lip: "#8a4350" }
      : { K: "#0b1424", rim: "#b8fff0", skin: ["#fcdcc0", "#eaab8b", "#c98069"], hair: ["#1f4468", "#132b4d", "#0a1730"], hi: "#5fd2de", brow: "#10233e", jk: ["#f7fafc", "#c5d5e7", "#90a8ca"], ac: "#ff8a1f", ln: ["#109c94", "#0b6f74", "#084a56"], js: ["#f4f8fb", "#c2d2e5", "#8fa6c8"], js2: "#17324f", st: "#12b5a5", st2: "#ff8a1f", gl: ["#1c2d48", "#111c33", "#0a1120"], iris: ["#06414f", "#12b5a5", "#7dffe0"], lip: "#9a4a3c" };
    const K = C.K, id = "cnH" + heroSeq++;
    let cn = 0;
    const f = (v) => Math.round(v * 10) / 10;
    // 部品: 外形を 逆光のふち→濃い影→薄い影→地の色 の順に少しずつずらして重ね、外形で切り抜く。inner は上に重ねる模様や影
    const part = (d, m, inner = "", sw = 3, k = 1, od = d) => {
      const c = id + "c" + cn++;
      return `<clipPath id="${c}"><path d="${d}"/></clipPath><path d="${d}" fill="${k ? C.rim : m[0]}"/><g clip-path="url(#${c})">${k ? `<path d="${d}" fill="${m[2]}" transform="translate(${f(2.6 * k)} ${f(0.6 * k)})"/><path d="${d}" fill="${m[1]}" transform="translate(${f(7 * k)} ${f(2.4 * k)})"/><path d="${d}" fill="${m[0]}" transform="translate(${f(13 * k)} ${f(5.5 * k)})"/>` : ""}${inner}</g><path d="${od}" fill="none" stroke="${K}" stroke-width="${sw}" stroke-linecap="round"/>`;
    };
    // 先細りの手足(袖)。at(t, s) は軸に沿った位置 t・幅方向 s の点
    const limb = (ax, ay, bx, by, ra, rb, k1 = 0.06, k2 = 0.06) => {
      const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = uy, ny = -ux;
      const at = (t, s) => `${f(ax + dx * t + nx * s * (ra + (rb - ra) * t))} ${f(ay + dy * t + ny * s * (ra + (rb - ra) * t))}`;
      const c1 = `${f(ax + dx / 2 + nx * ((ra + rb) / 2 + L * k1))} ${f(ay + dy / 2 + ny * ((ra + rb) / 2 + L * k1))}`, c2 = `${f(ax + dx / 2 - nx * ((ra + rb) / 2 + L * k2))} ${f(ay + dy / 2 - ny * ((ra + rb) / 2 + L * k2))}`;
      const od = `M${at(0, 1)}Q${c1} ${at(1, 1)}A${rb} ${rb} 0 0 1 ${at(1, -1)}Q${c2} ${at(0, -1)}`;
      return { d: `${od}A${ra} ${ra} 0 0 1 ${at(0, 1)}Z`, od, at, ang: (Math.atan2(dy, dx) * 180) / Math.PI, L };
    };
    const band = (l, t0, t1, col) => `<path d="M${l.at(t0, -1.5)}L${l.at(t0, 1.5)}L${l.at(t1, 1.5)}L${l.at(t1, -1.5)}Z" fill="${col}"/>`;
    const fold = (l, t, s0, s1, bend = 0.05) => `<path d="M${l.at(t, s0)}Q${l.at(t + bend, (s0 + s1) / 2)} ${l.at(t - bend * 0.4, s1)}" fill="none" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/>`;
    // 髪の房: 根元 A-B から先 T へ、しなって尖る。房ごとに影とハイライト
    const lock = ([ax, ay, bx, by, tx, ty, c = 0.18], sw = 2.4) => {
      const mx = (ax + bx) / 2, my = (ay + by) / 2, dx = tx - mx, dy = ty - my, px = -dy * c, py = dx * c;
      const q = (x, y, kk) => [(x + tx) / 2 + px * kk, (y + ty) / 2 + py * kk];
      const qa = q(ax, ay, 1.5), qb = q(bx, by, 0.5), qm = q(mx, my, 1.05);
      const od = `M${ax} ${ay}Q${f(qa[0])} ${f(qa[1])} ${tx} ${ty}Q${f(qb[0])} ${f(qb[1])} ${bx} ${by}`;
      const h0 = q(mx, my, 1.05), bp = (t, w) => `${f((1 - t) * (1 - t) * mx + 2 * t * (1 - t) * (h0[0] + px * w) + t * t * tx)} ${f((1 - t) * (1 - t) * my + 2 * t * (1 - t) * (h0[1] + py * w) + t * t * ty)}`;
      return part(od + "Z", C.hair, `<path d="M${bp(0.18, 0)}Q${bp(0.4, 0.22)} ${bp(0.66, 0)}Q${bp(0.4, -0.12)} ${bp(0.18, 0)}Z" fill="${C.hi}" opacity=".9"/>`, sw, 0.45, od);
    };
    // 目(外側の目尻が左)。上まぶたは太く跳ね上げ、虹彩は上が暗く下が明るい。ハイライト2つ
    const eye = (cx, cy, w, h, flip, ex) => {
      const c = id + "c" + cn++, W = "M-15 -5C-9 -11.5 4 -12 13 -4C13.5 0 12 4 10 6C3 9.5 -7 9 -12 5C-14 2 -15 -2 -15 -5Z";
      const sq = ex === "grit" ? 0.8 : 1;
      return `<g transform="translate(${cx} ${cy}) scale(${f((flip ? -1 : 1) * w / 28)} ${f((h / 20) * sq)})"><clipPath id="${c}"><path d="${W}"/></clipPath>
        <path d="${W}" fill="#fff"/><g clip-path="url(#${c})">
        <path d="M-16 -5C-9 -12 4 -12 14 -4L14 0C4 -8 -8 -8 -16 -1Z" fill="#b4c2d8"/>
        <ellipse cx="0" cy="-1.6" rx="7.8" ry="9.8" fill="url(#${id}i)" stroke="${K}" stroke-width="1.5"/>
        <path d="M-8 -3C-4 -7 4 -7 8 -3L8 -12L-8 -12Z" fill="${C.iris[0]}" opacity=".8"/>
        <ellipse cx="0" cy="-1.2" rx="3" ry="4.4" fill="#04070c"/>
        <path d="M-5.6 3.4C-2 7 2 7 5.6 3.4C3 9 -3 9 -5.6 3.4Z" fill="${C.iris[2]}"/>
        </g><ellipse cx="-3.6" cy="-5.6" rx="2.9" ry="2.2" fill="#fff" transform="rotate(-20 -3.6 -5.6)"/><circle cx="3.8" cy="2.8" r="1.4" fill="#fff"/>
        <path d="M-20.5 -10.5C-17.5 -8 -16.2 -6.4 -15.2 -3.6C-9 -10.6 4 -11.2 13.4 -3L14.6 -5.6C6 -15.8 -9.4 -16 -15.8 -10Z" fill="${K}"/>
        <path d="M-15.4 -4.6L-20.6 -4L-14.4 -0.8Z" fill="${K}"/>
        <path d="M-11.5 6C-6 9.6 3 10 9.4 7" fill="none" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M-11 -15C-4 -18.6 6 -17.6 13 -11" fill="none" stroke="${C.skin[2]}" stroke-width="1.2" stroke-linecap="round"/></g>`;
    };
    const HAIR = o
      ? { back: [[-44, -56, -55, -20, -112, 22, 0.3], [-55, -30, -53, 4, -120, 78, 0.22], [-54, -6, -46, 24, -104, 122, 0.16], [-50, 14, -36, 40, -82, 132, 0.1]], top: [], bang: [[47, -20, 30, -46, 45, 16, -0.16], [32, -46, 4, -50, -8, 2, 0.26], [8, -50, -18, -47, -27, 7, 0.22], [-16, -47, -42, -34, -41, 13, 0.18], [-38, -38, -53, -6, -49, 54, 0.1]] }
      : { back: [[-46, 22, -34, 42, -150, 78, 0.24], [-30, -68, -55, -24, -100, -64, 0.3], [-55, -36, -52, 10, -106, -12, 0.3], [-53, -4, -38, 38, -84, 34, 0.3]], top: [[-48, -48, -6, -78, -92, -96, 0.34], [-18, -77, 40, -66, -40, -116, 0.3], [24, -74, 48, -46, 20, -98, 0.22]], bang: [[48, -22, 36, -42, 43, -1, -0.14], [40, -40, 20, -46, 27, -12, 0.2], [26, -46, -2, -48, 5, 9, 0.2], [2, -48, -22, -46, -13, -8, 0.2], [-18, -46, -42, -36, -32, -5, 0.2], [-38, -38, -53, -8, -45, 36, 0.14]] };
    const mouth = {
      smirk: `<path d="M0 44.6C7 46 14 44.6 22 38.6" fill="none" stroke="${K}" stroke-width="2" stroke-linecap="round"/><path d="M20.6 36.4L24.4 39.4" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/><path d="M6 51.6L12 51" fill="none" stroke="${C.skin[2]}" stroke-width="1.6" stroke-linecap="round"/>`,
      smile: `<path d="M-2 44C5 48.4 15 46.6 21.5 39.4" fill="none" stroke="${K}" stroke-width="2" stroke-linecap="round"/><path d="M20 37.6L23.6 39.6" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/><path d="M5 52.6L12 52" fill="none" stroke="${C.skin[2]}" stroke-width="1.6" stroke-linecap="round"/>`,
      shout: `<path d="M-4 39C4 36 16 36 23 38.4C23 52 15 61 8 61C0 60 -4 50 -4 39Z" fill="#6e1626" stroke="${K}" stroke-width="2"/><path d="M-2.6 39.6C4 37.4 16 37.4 21.8 39.2L21 43C14 41.4 4 41.6 -2 43.4Z" fill="#fff"/><path d="M1 54C5 50 13 50 16.6 54C14 59.6 5 60 1 54Z" fill="#ef7f86"/>`,
      grin: `<path d="M-5 38C4 41.6 16 40.6 25 34C24.4 48 16 56 8 56C0 55 -4.4 47 -5 38Z" fill="#6e1626" stroke="${K}" stroke-width="2"/><path d="M-3.6 39.4C4 42.6 16 41.6 23.6 36.4L22.6 42C15 46 4 46.6 -2.6 44Z" fill="#fff"/><path d="M2 51C6 48 13 48 16 50.6C13 55 5 55 2 51Z" fill="#ef7f86"/>`,
      grit: `<path d="M-3 41.6L21 39L20 47L-2 48.6Z" fill="#fff" stroke="${K}" stroke-width="2"/><path d="M-2.6 45L20.6 43M3 41L3.6 48M9 40.4L9.6 47.6M15 39.8L15.4 47.2" fill="none" stroke="${K}" stroke-width="1.1"/>`,
    };
    // 顔(斜め右向き)。原点は両目の間、あごは y=64
    const head = (ex) => {
      const S = C.skin, fr = (ex === "grit" ? 3 : 0) + (o ? 1.8 : 0);
      const FACE = "M-42 -42C-47 -18 -46 12 -41 27C-34 43 -19 57 0 64.6C8 67.6 16 66.6 21 61.6C30 52 39 38 41.4 22C42.6 12 39.4 5 39 -3C39.4 -14 43 -28 39 -42Z";
      const faceIn = `<path d="M-48 -44L46 -44L43 -15C34 -22 24 -9 15 -15C10 -3 3 6 -2 -12C-9 -5 -17 -17 -24 -9C-30 -4 -38 -8 -46 -2Z" fill="${S[1]}"/>
        <path d="M-48 -10C-41 8 -37 30 -20 50C-30 46 -43 32 -49 4Z" fill="${S[1]}"/><path d="M-48 2C-43 22 -36 38 -22 49C-34 44 -45 30 -50 12Z" fill="${S[2]}"/>
        <path d="M20 64C30 52 39 38 41.4 22L44 24L30 66Z" fill="#fff" opacity=".5"/>`;
      // 頭にのせたアイウェア(一枚レンズ)
      const shades = `<path d="M-41 -45L-56 -30" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M-41 -45L-55 -31" fill="none" stroke="#f7fafc" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M-42 -50C-22 -66 22 -68 47 -50C48 -42 42 -36 33 -39C22 -44 10 -46 5 -43C-6 -46 -24 -44 -34 -36C-41 -39 -44 -44 -42 -50Z" fill="url(#${id}v)" stroke="${K}" stroke-width="2.4"/>
        <path d="M-42 -50C-22 -66 22 -68 47 -50" fill="none" stroke="#f7fafc" stroke-width="3.4" stroke-linecap="round"/><path d="M-30 -52L-18 -58L-24 -42L-33 -39ZM-12 -59L-6 -60L-12 -45L-17 -44Z" fill="#fff" opacity=".7"/>`;
      const brow = (d) => `<path d="${d}" fill="${C.brow}" stroke="${C.brow}" stroke-width="${o ? 0.6 : 1.6}"/>`;
      return `${HAIR.back.map((l) => lock(l, 2.8)).join("")}${o ? "" : `<path d="M-58 30L-50 46L-58 50L-66 34Z" fill="${C.st2}" stroke="${K}" stroke-width="2"/>`}
        ${part("M-41 -4C-51 -11 -58 2 -54 15C-52 24 -46 29 -41 25Z", S, `<path d="M-46 0C-52 4 -51 16 -46 21" fill="none" stroke="${S[2]}" stroke-width="2"/>`, 2.4, 0.3)}
        ${part(FACE, S, faceIn, 2.8, 0)}
        <path d="M13.6 21L17.4 29.6L11.6 31.6" fill="none" stroke="${K}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.6 23L16.4 30L11 31.4Z" fill="${S[1]}"/>
        ${mouth[o && (ex === "smile" || ex === "grin") ? "smirk" : ex] || mouth.smile}
        ${eye(-17, 4 + fr * 0.4, 27, o ? 15 : 19, 0, ex)}${eye(24, 3 + fr * 0.4, 19.5, o ? 14.4 : 18, 1, ex)}
        ${brow(`M-36 ${-15 + fr * 0.3}C-25 ${-18.6 + fr} -12 ${-15.4 + fr} -2.6 ${-9.4 + fr}L-3.6 ${-5.6 + fr}C-14 ${-10.6 + fr} -25 ${-13 + fr} -35 ${-11 + fr * 0.3}Z`)}${brow(`M38 ${-15.6 + fr * 0.3}C31 ${-18 + fr} 20 ${-14 + fr} 12.4 ${-9.4 + fr}L13 ${-5.8 + fr}C21 ${-10 + fr} 30 ${-13 + fr} 37.6 ${-11.6 + fr * 0.3}Z`)}
        ${ex === "grit" ? `<path d="M30 30C27 36 27.4 40 30.4 40.6C33.4 40 33.4 36 30 30Z" fill="#dff6ff" stroke="${K}" stroke-width="1.2"/>` : ""}
        ${part("M-53 2C-64 -34 -46 -75 -4 -77C31 -79 53 -54 48 -16L40 -34L-40 -30Z", C.hair, `<path d="M-38 -44C-30 -58 -14 -64 2 -62C-12 -58 -26 -52 -34 -40ZM10 -62C22 -60 32 -54 38 -44C30 -50 20 -56 8 -58Z" fill="${C.hi}" opacity=".85"/>`, 2.8, 0.7)}
        ${HAIR.top.map((l) => lock(l, 2.8)).join("")}${o ? "" : shades}${HAIR.bang.map((l) => lock(l, 1.7)).join("")}`;
    };
    if (pose === "pinch")
      return `<svg class="cn-hero dl-svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.iris[0]}"/><stop offset=".55" stop-color="${C.iris[1]}"/><stop offset="1" stop-color="${C.iris[2]}"/></linearGradient><linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd23d"/><stop offset=".5" stop-color="#ff8a1f"/><stop offset="1" stop-color="#e0407a"/></linearGradient></defs><g stroke-linejoin="round" transform="translate(192 90) scale(2.3)">${head("grit")}</g></svg>`;
    const P = HERO_POSE[pose] || HERO_POSE.base, J = C.jk;
    // カード(裏面)
    const cardG = (x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-24" y="-35" width="48" height="70" rx="4.5" fill="#24120a" stroke="${K}" stroke-width="2.6"/><rect x="-19.5" y="-30.5" width="39" height="61" rx="2.5" fill="#3a1c0c" stroke="#c9a24a" stroke-width="2"/><path d="M-19 -30L19 30M19 -30L-19 30" stroke="#c9a24a" stroke-width="1" opacity=".5"/><circle r="10.5" fill="#24120a" stroke="#c9a24a" stroke-width="2"/><circle r="4.4" fill="#ffcf3d"/><path d="M-22 -33L-6 -33L-22 -8Z" fill="#fff" opacity=".22"/></g>`;
    // 指(付け根から先へ)
    const finger = (x, y, a, len, w) => `<g transform="translate(${x} ${y}) rotate(${a})">${part(`M${-w / 2} 2L${-w / 2 + 0.6} ${-len + w * 0.45}Q0 ${-len - w * 0.35} ${w / 2 - 0.6} ${-len + w * 0.45}L${w / 2} 2Z`, C.skin, `<path d="M${-w / 2} ${-len * 0.5}L${w / 2} ${-len * 0.52}" stroke="${C.skin[2]}" stroke-width="1" fill="none"/>`, 2, 0.25)}</g>`;
    // 手(原点は手首、指先は上)。指切りグローブ
    const hand = (kind, x, y, a, s, flip) => {
      const palm = (d) => part(d, C.gl, `<path d="M-17 -5L17 -5L17 -11L-17 -11Z" fill="${C.st2}"/><path d="M-6 -17L0 -25L6 -17L0 -13Z" fill="${C.st}"/>`, 2.6, 0.5);
      let h = "";
      if (kind === "card") h = `${cardG(-2, -92, flip ? 12 : -12)}${finger(2, -34, 3, 43, 9.6)}${palm("M-15 2L-17.6 -30C-17 -38 15 -40 16.6 -33L15 2Z")}${finger(13, -33, 16, 17, 8.4)}${finger(6, -35, 6, 19, 9)}${finger(-10, -33, -5, 41, 9.8)}${part("M-16 -8C-27 -13 -30 -27 -23 -36C-19 -40 -14 -37 -15 -32L-13 -20Z", C.skin, "", 2, 0.25)}`;
      else if (kind === "open") h = `${finger(15, -30, 30, 29, 8.4)}${finger(8.6, -35, 13, 38, 9)}${finger(0, -36, -1, 42, 9.6)}${finger(-9.6, -33, -15, 38, 9.4)}${palm("M-15 2L-17.6 -30C-17 -38 15 -40 16.6 -33L15 2Z")}${part("M-15 -6C-28 -10 -38 -22 -39 -34C-35 -38 -31 -36 -29 -31L-15 -22Z", C.skin, "", 2, 0.25)}`;
      else if (kind === "deck") h = `<g transform="rotate(-12)"><rect x="-27" y="-74" width="50" height="66" rx="4" fill="#e9dcc0" stroke="${K}" stroke-width="2.4"/><path d="M-27 -66L23 -66M-27 -60L23 -60" stroke="#8a7350" stroke-width="1"/></g>${cardG(0, -44, -12, 0.96)}${palm("M-15 2L-17.6 -24C-17 -32 15 -34 16.6 -27L15 2Z")}${[-12, -4, 4, 12].map((dx, i) => finger(dx, -27, -4 + i * 2, 15 - Math.abs(i - 1.2) * 1.6, 8.6)).join("")}${part("M-16 -6C-27 -11 -30 -25 -23 -34C-19 -38 -14 -35 -15 -30L-13 -18Z", C.skin, "", 2, 0.25)}`;
      else h = `${part("M-16 2L-18.6 -27C-19 -41 17 -43 18 -30L15.6 2Z", C.gl, `<path d="M-17 -5L17 -5L17 -11L-17 -11Z" fill="${C.st2}"/>`, 2.6, 0.5)}${part("M-18.4 -27C-20 -45 18 -47 18 -31C18 -25 -18 -22 -18.4 -27Z", C.skin, `<path d="M-9.6 -42L-9 -25M-0.6 -43L0 -26M8.6 -42L9 -27" stroke="${K}" stroke-width="1.5" fill="none"/>`, 2.2, 0.3)}${part("M-19 -14C-25 -22 -21 -31 -12 -30L2 -27C7 -24 5 -18 0 -18L-11 -16Z", C.skin, "", 2, 0.25)}`;
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${flip ? -s : s} ${s})">${h}</g>`;
    };
    // 腕: 半袖のジャージから出た素肌の腕。上腕(up)と前腕+手(fo)を分けて返す。holder=前腕に巻いたカードホルダー
    const arm = (sx, sy, [ex, ey, wx, wy], hk, holder, flip) => {
      const S = C.skin, up = limb(sx, sy, ex, ey, 31, 25, 0.06, 0.03), fo = limb(ex, ey, wx, wy, 24.5, 16.5, 0.08, 0.02);
      const sl = limb(sx, sy, sx + (ex - sx) * 0.56, sy + (ey - sy) * 0.56, 34, 31, 0.03, 0.03);
      const mus = (l, t, s0, s1, b) => `<path d="M${l.at(t, s0)}Q${l.at(t + b, (s0 + s1) / 2)} ${l.at(t - b * 0.4, s1)}" fill="none" stroke="${S[2]}" stroke-width="1.6" stroke-linecap="round"/>`;
      const upS = part(up.d, S, `${mus(up, 0.86, -0.9, 0.1, 0.08)}`, 3.2, 1.5) + part(sl.d, C.js, `${band(sl, 0.78, 1.3, C.st)}${band(sl, 0.7, 0.78, C.st2)}${fold(sl, 0.3, 1, 0.1, -0.08)}${fold(sl, 0.5, -1, -0.2, 0.08)}`, 3.2);
      let hd = "";
      if (holder) {
        const L = fo.L, r = 22;
        hd = `<g transform="translate(${ex} ${ey}) rotate(${f(fo.ang)})"><rect x="${f(L * 0.2)}" y="${-r - 2}" width="7" height="${r * 2 + 4}" rx="2" fill="${C.gl[1]}" stroke="${K}" stroke-width="1.8"/><rect x="${f(L * 0.6)}" y="${-r + 2}" width="7" height="${r * 2 - 4}" rx="2" fill="${C.gl[1]}" stroke="${K}" stroke-width="1.8"/>
          <path d="M${f(L * 0.64)} -11L${f(L * 0.9)} -9L${f(L * 0.9)} 9L${f(L * 0.64)} 11Z" fill="#f2e7cc" stroke="${K}" stroke-width="1.8"/><path d="M${f(L * 0.64)} -6L${f(L * 0.84)} -4.6L${f(L * 0.84)} 5L${f(L * 0.64)} 6Z" fill="#c9a24a" stroke="${K}" stroke-width="1.4"/>
          <rect x="${f(L * 0.14)}" y="-14.5" width="${f(L * 0.56)}" height="29" rx="5" fill="${C.gl[0]}" stroke="${K}" stroke-width="2.4"/><path d="M${f(L * 0.18)} -10.5L${f(L * 0.66)} -10.5" stroke="${C.st}" stroke-width="2.4" fill="none"/><path d="M${f(L * 0.32)} 6L${f(L * 0.4)} -3L${f(L * 0.48)} 6" stroke="${C.st2}" stroke-width="2.6" fill="none" stroke-linejoin="miter"/><path d="M${f(L * 0.18)} 11L${f(L * 0.66)} 11" stroke="#000" stroke-width="2" opacity=".35" fill="none"/></g>`;
      }
      const foS = part(fo.d, S, `${mus(fo, 0.12, -1, 0, -0.08)}${mus(fo, 0.5, 1, 0.5, 0.2)}`, 3.2, 1.5, fo.od);
      const dx = wx - ex, dy = wy - ey;
      return { up: upS, fo: `${foS}${hd}${hand(hk, wx + (dx / fo.L) * 6, wy + (dy / fo.L) * 6, fo.ang + 90, 1.22, flip)}` };
    };
    const [hx, hy, hr] = P.head, hsc = 1.3;
    const neck = limb(hx - 5, hy + 56, 212, 248, 23, 26, 0, 0);
    const emblem = `<g transform="translate(166 326) scale(1.25)" fill="none" stroke="${C.st2}" stroke-width="2.6"><circle r="12"/><circle r="4.4"/><path d="M0 -12L0 -17M0 12L0 17M-12 0L-17 0M12 0L17 0M-8.5 -8.5L-12 -12M8.5 8.5L12 12M-8.5 8.5L-12 12M8.5 -8.5L12 -12"/></g>`;
    // 胴(斜め向き: 前の合わせは奥側へ寄る)
    const jersey = part("M152 620C142 462 128 412 120 352C114 322 104 300 98 284C108 258 150 246 186 238L240 236C266 242 290 254 300 272C300 302 298 332 294 358C290 412 286 462 284 620Z", C.js,
      `<path d="M86 250L182 236L204 262L228 268L240 258L244 234L320 250L320 296L262 276L228 298L168 280L86 312Z" fill="${C.js2}"/>
       <path d="M96 392Q170 420 228 438Q270 414 310 382L310 406Q270 440 228 464Q170 446 96 420Z" fill="${C.st}"/><path d="M96 426Q170 452 228 470Q270 446 310 412L310 421Q270 456 228 480Q170 462 96 436Z" fill="${C.st2}"/>
       <path d="M96 330L134 342C130 400 138 470 158 620L96 620Z" fill="${C.js2}"/><path d="M320 330L286 340C288 400 284 470 276 620L320 620Z" fill="${C.js2}"/>
       ${emblem}
       <path d="M126 366C150 392 204 394 226 378C230 384 228 390 224 394C200 404 150 400 126 366ZM232 378C246 388 270 384 290 362C276 392 248 398 234 392Z" fill="${C.js[1]}"/><path d="M100 300C112 330 116 360 112 400L130 620L100 620Z" fill="${C.js[1]}"/>
       <path d="M228 272C232 340 230 430 224 620" fill="none" stroke="${K}" stroke-width="2"/>
       <path d="M150 292C160 322 160 352 152 384M276 286C270 316 272 344 280 374M176 504C188 494 206 490 224 492M262 502C252 494 240 492 230 492" fill="none" stroke="${K}" stroke-width="1.4" opacity=".55"/>`, 3.2, 1.7)
      + part("M180 240C194 258 212 268 228 272C236 264 242 252 244 236L256 244C252 268 242 282 228 288C204 282 182 268 166 248Z", [C.js2, C.js2, C.js2], "", 2.4, 0)
      + `<path d="M223 286L233 286L233 302L223 302Z" fill="${C.st2}" stroke="${K}" stroke-width="1.6"/>`;
    // 肩に羽織った上着: 後ろへ大きくなびく(外側の布と裏地)、空の袖、立てた襟
    const cape = `${part("M300 268C344 290 372 340 362 404C380 436 370 478 344 560L286 620Z", C.ln, `<path d="M330 330C346 370 346 420 330 470" fill="none" stroke="${K}" stroke-width="1.5" opacity=".6"/>`, 3.2, 1.4)}
      ${part("M120 372C76 396 22 392 -44 356C-22 404 -34 446 -70 472C-20 486 30 500 20 620L150 620Z", C.ln, `<path d="M112 404C60 420 4 412 -22 392M120 470C70 474 0 466 -40 462" fill="none" stroke="${K}" stroke-width="1.5" opacity=".6"/>`, 3.2, 1.4)}
      ${part("M70 286C24 268 -34 232 -84 176L-106 204C-56 256 -4 296 52 322Z", J, `<path d="M-84 176L-106 204L-94 216L-70 190Z" fill="${C.ac}"/><path d="M-78 198L-60 180" stroke="${K}" stroke-width="1.4" fill="none"/><path d="M40 290C10 276 -20 258 -44 236" fill="none" stroke="${K}" stroke-width="1.5" opacity=".6"/>`, 3.2)}
      ${part("M110 262C60 282 4 280 -56 244C-34 300 -48 340 -84 364C-30 380 4 404 -14 452C36 440 80 452 126 482Z", J, `<path d="M-56 244C-34 300 -48 340 -84 364L-66 370C-32 344 -22 300 -38 256Z" fill="${C.ac}"/><path d="M-14 452C36 440 80 452 126 482L126 466C80 438 30 428 -8 438Z" fill="${C.ac}"/><path d="M100 300C52 314 6 304 -24 286M110 380C60 380 0 366 -40 356M112 430C80 420 40 416 14 420" fill="none" stroke="${K}" stroke-width="1.5" opacity=".6"/>`, 3.2, 1.4)}`;
    const yoke = `${part("M190 232C156 234 112 248 88 272C84 280 88 290 96 294C120 270 158 256 196 250Z", J, `<path d="M96 294C120 270 158 256 196 250L195 243C156 248 114 264 90 288Z" fill="${C.ac}"/>`, 3, 0.6)}${part("M238 230C264 234 294 246 312 266C316 274 312 284 304 286C288 266 266 254 240 248Z", J, `<path d="M304 286C288 266 266 254 240 248L240 241C268 246 294 260 310 280Z" fill="${C.ac}"/>`, 3, 0.6)}
      ${part("M184 246L152 184C176 194 202 222 212 260Z", J, `<path d="M184 246L152 184L163 189L195 250Z" fill="${C.ln[0]}"/>`, 2.8, 0.5)}${part("M246 244L274 186C258 198 244 224 232 260Z", J, `<path d="M246 244L274 186L265 193L238 250Z" fill="${C.ln[0]}"/>`, 2.8, 0.5)}`;
    const fa = arm(298, 278, P.far, P.fh, false, true), na = arm(102, 286, P.near, P.nh, true, false);
    return `<svg class="cn-hero dl-svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs><linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.iris[0]}"/><stop offset=".55" stop-color="${C.iris[1]}"/><stop offset="1" stop-color="${C.iris[2]}"/></linearGradient><linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd23d"/><stop offset=".5" stop-color="#ff8a1f"/><stop offset="1" stop-color="#e0407a"/></linearGradient></defs>
      <g stroke-linejoin="round" transform="translate(0 520) skewX(${P.sk}) rotate(${P.lean}) translate(-205 -520) translate(205 0)">
        ${cape}${fa.up}${na.up}
        ${part(neck.d, C.skin, `<path d="M${hx - 34} ${hy + 46}L${hx + 34} ${hy + 70}L${hx + 30} ${hy + 104}L${hx - 34} ${hy + 86}Z" fill="${C.skin[2]}"/>`, 2.8, 0.5)}
        ${jersey}${yoke}
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
    const H = opp ? ["#6c6398", "#aaa2cf", "#e6e2f4", "#ffffff"] : ["#0a1730", "#1f4468", "#2f6f96", "#5fd2de"];
    const I = opp ? ["#ffc2cc", "#ff5a78", "#c01a40", "#4a0514"] : ["#d6fff4", "#4fe6c4", "#12a08c", "#06343f"];
    const E = "M430 520 C520 360 760 290 980 320 C1080 334 1150 380 1190 430 C1160 520 1050 610 860 625 C700 636 540 600 430 520Z";
    const cx = 810, cy = 468;
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
      <path d="M380 470 C500 300 780 215 1010 245 C1110 258 1190 300 1250 380 C1180 330 1090 300 985 296 C760 268 520 340 410 530Z" fill="#c98a6a" opacity=".6"/>
      <g stroke="#e58a7a" stroke-width="7" stroke-linecap="round" opacity=".55"><path d="M1010 720 L1050 680"/><path d="M1070 728 L1110 688"/><path d="M1130 730 L1170 690"/><path d="M1190 726 L1230 686"/></g>
      ${hair.map((d) => `<path d="${d}" transform="translate(22 34)" fill="#8a4a38" opacity=".3"/>`).join("")}
      <g class="cn-eyeg">
        <g clip-path="url(#cnLid)">
          <path d="${E}" fill="#f7f9fc"/>
          <g clip-path="url(#cnE)">
            <path d="M430 520 C520 360 760 290 980 320 C1080 334 1150 380 1190 430 L1190 478 C1140 420 1070 390 975 380 C770 356 560 410 430 560Z" fill="#aeb9cc"/>
            <path d="M430 540 C540 420 770 380 975 400 C1070 410 1140 440 1190 490 L1190 520 C1130 470 1060 446 975 438 C780 420 570 456 430 580Z" fill="#d3dae6"/>
            <path d="M430 520 C460 500 500 500 520 530 C500 560 460 560 430 520Z" fill="#e8a79a"/>
            <g class="cn-iris">
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
            </g>
          </g>
        </g>
        <g class="cn-ulid">
          <path d="M398 540 C490 330 760 242 992 270 C1100 286 1185 342 1246 424 L1190 430 C1150 380 1080 334 980 320 C760 290 520 360 430 520Z" fill="#150a0c"/>
          <path d="M1050 300 L1118 226 L1104 318Z M1118 326 L1212 268 L1162 356Z M1176 368 L1288 332 L1214 404Z M1222 414 L1318 408 L1240 440Z M452 478 L400 446 L470 452Z" fill="#150a0c"/>
          <path d="M470 440 C600 330 800 300 980 322" fill="none" stroke="#5a3a4a" stroke-width="5" opacity=".7"/>
        </g>
        <path d="M1188 436 C1150 525 1050 606 860 622 C760 630 650 612 560 584" fill="none" stroke="#3a1c16" stroke-width="8" stroke-linecap="round"/>
        <path d="M1150 520 L1196 548 M1100 566 L1140 602 M1040 596 L1070 636" fill="none" stroke="#3a1c16" stroke-width="6" stroke-linecap="round"/>
        <path d="M470 660 C640 720 900 716 1120 620" fill="none" stroke="#b97f63" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      </g>
      <path d="M466 400 C600 262 820 206 1034 236 C1110 248 1170 280 1214 318" fill="none" stroke="#8a5644" stroke-width="7" stroke-linecap="round" opacity=".75"/>
      <path d="M360 318 C560 176 860 128 1190 150 L1276 122 C1256 170 1220 196 1176 204 C880 186 600 232 392 356Z" fill="${H[0]}"/>
      <path d="M440 276 C640 176 900 150 1180 164" fill="none" stroke="${H[2]}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
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

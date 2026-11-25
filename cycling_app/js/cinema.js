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

  // ---------- 見せ場の人物(オリジナルのロードレーサー) ----------
  // エアロヘルメットに透けるアイウェア、鋭い目、サイクルジャージ。片手でカードを顔の横に構える決めポーズ。
  // 自分は白×青緑×オレンジ、相手は黒×赤×紫(同じ画風)。目の高さは絵の上から2割(ピンチの目元の帯が合わせている)
  function heroSvg(side) {
    const o = side === "opp";
    const C = o
      ? { j1: "#1a1d26", j2: "#c8163c", j3: "#0c0d12", ac: "#b03dff", h1: "#20232c", h2: "#e0284f", vis: ["#ff5a78", "#7a1ad0"], iris: "#ff3d5a", hair: "#d9dde6", hair2: "#8f97a8", s1: "#ecc6aa", s2: "#c99680", gl: "#2a0a14" }
      : { j1: "#f4f7fb", j2: "#12b5a5", j3: "#10223c", ac: "#ff8a1f", h1: "#f6f8fb", h2: "#12b5a5", vis: ["#ffb02e", "#16c7b0"], iris: "#1fd0b0", hair: "#141a2a", hair2: "#34507a", s1: "#f4cba6", s2: "#d79b78", gl: "#10223c" };
    const K = "#0a111e", id = "cnH" + (o ? "o" : "y");
    const vents = [[-44, 14], [-23, 6], [0, 3], [23, 6], [44, 14]].map(([dx, dy]) => `<path d="M${196 + dx} ${24 + dy} L${190 + dx * 1.12} ${60 + dy * 0.5} L${210 + dx * 1.12} ${60 + dy * 0.5} L${204 + dx} ${24 + dy}Z"/>`).join("");
    const eye = (sx) => `<g transform="translate(200 0) scale(${sx} 1)">
        <path d="M-44 102 L-16 96 L-13 105 L-40 108Z" fill="#fff"/>
        <circle cx="-27" cy="101.5" r="6" fill="${C.iris}"/><circle cx="-27" cy="101.5" r="2.6" fill="#05070c"/><circle cx="-29" cy="99.5" r="1.4" fill="#fff"/>
        <path d="M-48 101 L-13 93.5 L-12 97 L-46 104Z" fill="${K}"/>
        <path d="M-50 93 L-12 86 L-12 90 L-48 96Z" fill="${C.hair}"/></g>`;
    return `<svg class="cn-hero dl-svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.vis[0]}" stop-opacity=".5"/><stop offset="1" stop-color="${C.vis[1]}" stop-opacity=".38"/></linearGradient>
        <linearGradient id="${id}j" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".38" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></linearGradient>
        <clipPath id="${id}t"><path d="M58 500 L64 332 C66 272 100 242 152 228 L248 228 C300 242 334 272 336 332 L342 500Z"/></clipPath>
      </defs>
      <g stroke="${K}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
        <path d="M40 432 L96 442 L92 504 L32 504Z" fill="${C.s1}"/>
        <path d="M68 296 C50 318 40 380 36 432 L98 444 C100 392 106 340 112 300Z" fill="${C.j2}"/>
        <path d="M36 414 L99 426 L98 444 L35 432Z" fill="${C.j3}"/>
        <path d="M58 500 L64 332 C66 272 100 242 152 228 L248 228 C300 242 334 272 336 332 L342 500Z" fill="${C.j1}"/>
        <g clip-path="url(#${id}t)" stroke="none">
          <path d="M50 250 L152 222 L200 262 L248 222 L350 250 L350 300 L250 262 L200 300 L150 262 L50 300Z" fill="${C.j3}"/>
          <path d="M40 372 L360 318 L360 352 L40 408Z" fill="${C.j2}"/>
          <path d="M40 416 L360 360 L360 370 L40 427Z" fill="${C.ac}"/>
          <path d="M40 300 L96 300 L84 500 L40 500Z M360 300 L304 300 L316 500 L360 500Z" fill="${C.j3}" opacity=".9"/>
          <g fill="none" stroke="${C.ac}" stroke-width="3"><circle cx="262" cy="300" r="13"/><circle cx="262" cy="300" r="5"/><path d="M262 283 L262 287 M262 313 L262 317 M245 300 L249 300 M275 300 L279 300 M250 288 L253 291 M271 309 L274 312 M250 312 L253 309 M271 291 L274 288"/></g>
          <rect x="40" y="220" width="320" height="290" fill="url(#${id}j)"/>
        </g>
        <path d="M200 266 L200 500" fill="none" stroke-width="2.5"/>
        <path d="M176 168 L176 232 L200 256 L224 232 L224 168Z" fill="${C.s1}"/>
        <path d="M176 176 L224 176 L224 200 L200 214 L176 198Z" fill="${C.s2}" stroke="none"/>
        <path d="M162 224 L200 262 L238 224 L246 240 L200 284 L154 240Z" fill="${C.j3}"/>
        <g transform="translate(0 30) rotate(-4 200 180) translate(200 186) scale(1.2) translate(-200 -186)">
          <path d="M146 104 L138 112 L142 134 L150 138Z M254 104 L262 112 L258 134 L250 138Z" fill="${C.s2}"/>
          <path d="M146 78 L148 130 L170 168 L200 186 L230 168 L252 130 L254 78Z" fill="${C.s1}"/>
          <path d="M200 186 L230 168 L252 130 L254 78 L240 78 L236 128 L216 162Z" fill="${C.s2}" stroke="none"/>
          <path d="M146 80 L136 132 L152 116 L150 146 L164 108Z M254 80 L264 132 L248 116 L250 146 L236 108Z" fill="${C.hair}"/>
          <path d="M152 74 L160 98 L172 80 L184 106 L196 80 L208 104 L220 80 L232 98 L248 74Z" fill="${C.hair}"/>
          <path d="M184 106 L190 84 L196 80Z M208 104 L214 84 L220 80Z" fill="${C.hair2}" stroke="none"/>
          <path d="M201 116 L196 138 L205 140" fill="none" stroke="${C.s2}" stroke-width="3"/>
          <path d="${o ? "M184 158 Q200 152 216 158" : "M184 154 Q202 162 218 150"}" fill="none" stroke="#7a3a30" stroke-width="3"/>
          <path d="M150 92 L178 172 M250 92 L222 172" fill="none" stroke="${C.gl}" stroke-width="4"/>
          <path d="M144 84 L256 84 L252 112 C238 126 214 120 200 111 C186 120 162 126 148 112Z" fill="url(#${id}v)" stroke-width="3"/>
          <g stroke="none">${eye(1)}${eye(-1)}</g>
          <path d="M156 88 L170 88 L160 114 L152 110Z M178 88 L183 88 L176 104 L172 105Z" fill="#fff" opacity=".45" stroke="none"/>
          <path d="M128 90 C120 30 166 4 200 4 C236 4 282 30 272 90 L258 80 C240 68 160 68 142 80Z" fill="${C.h1}"/>
          <path d="M200 4 C236 4 282 30 272 90 L258 80 C262 44 240 16 200 4Z" fill="#000" opacity=".16" stroke="none"/>
          <path d="M128 90 C126 76 127 62 131 50 L146 58 C142 66 141 74 142 80Z M272 90 C274 76 273 62 269 50 L254 58 C258 66 259 74 258 80Z" fill="${C.h2}"/>
          <g fill="${K}" stroke="none">${vents}</g>
          <path d="M142 80 C160 68 240 68 258 80" fill="none" stroke="${C.h2}" stroke-width="5"/>
        </g>
        <g transform="translate(18 8)">
        <path d="M298 248 C340 254 374 300 388 372 L332 394 C324 342 308 312 286 298Z" fill="${C.j2}"/>
        <path d="M388 372 L332 394 L328 376 L384 354Z" fill="${C.j3}"/>
        <path d="M386 376 L334 394 L300 226 L342 210Z" fill="${C.s1}"/>
        <path d="M386 376 L366 383 L330 216 L342 210Z" fill="${C.s2}" stroke="none"/>
        <g transform="rotate(-14 323 130)">
          <rect x="290" y="78" width="66" height="96" rx="6" fill="#1a0f08"/>
          <rect x="296" y="84" width="54" height="84" rx="3" fill="none" stroke="#c9a24a" stroke-width="2.5"/>
          <circle cx="323" cy="126" r="13" fill="none" stroke="#c9a24a" stroke-width="2.5"/><circle cx="323" cy="126" r="5" fill="#ffcf3d" stroke="none"/>
          <path d="M296 84 L350 168 M350 84 L296 168" stroke="#c9a24a" stroke-width="1.2" opacity=".5"/>
        </g>
        <path d="M294 232 C284 204 292 178 312 166 L350 176 C360 198 354 220 344 234Z" fill="${C.gl}"/>
        <path d="M304 180 L346 190" fill="none" stroke="${C.ac}" stroke-width="4"/>
        <path d="M300 178 L306 150 L318 152 L314 182Z M316 180 L324 150 L336 153 L330 184Z M332 184 L340 158 L351 162 L346 188Z" fill="${C.s1}"/>
        <path d="M296 214 L282 188 L292 180 L308 204Z" fill="${C.s1}"/>
        </g>
      </g>
    </svg>`;
  }
  // 設定で自分の画像を入れているときはそれを使う。それ以外は上のオリジナルの人物
  function avatarHtml(side) {
    let own = "";
    try {
      own = side === "you" ? localStorage.getItem(DuelFx.IMG_KEY) || "" : "";
    } catch (e) {
      own = "";
    }
    return own ? DuelFx.avatarHtml(side) : heroSvg(side);
  }

  // ---------- 画角 ----------
  const hasArt = (m, side) => typeof MonsterArt !== "undefined" && !!MonsterArt.src(m, side);
  const av = (side, cls = "") => `<div class="cn-av ${side} ${cls}">${avatarHtml(side)}</div>`;
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
    const art = hasArt(m, side);
    const body = art ? MonsterArt.icon(m, side, "cn-img") : crest(esc(m.icon || "❔"));
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
        return `${bg("speed")}<svg class="cn-arc" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cnArc" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" style="stop-color:var(--c1)" stop-opacity=".9"/><stop offset=".85" style="stop-color:var(--hi)"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><path d="M20 590 C300 580 700 400 980 30 C760 330 420 500 20 590Z" fill="url(#cnArc)"/><path d="M200 585 C440 540 760 360 985 60 C800 330 500 500 200 585Z" fill="#fff" opacity=".7"/></svg>${av(s, "swing")}<i class="cn-cb"></i>${kt(c.gold ? "DESTINY DRAW!!" : "DRAW!!", "draw")}`;
      case "hold":
        return `${bg("speed")}${av(s, "hold")}${cardBox(c.card, "hold")}`;
      case "cardup":
        return `${bg("deep")}${cardBox(c.card, "up")}`;
      case "low":
        return `${bg("deep")}${floor()}<div class="cn-pillar"></div>${monster(c.mon, "low", s)}${plate(c.mon)}`;
      case "two":
        return `${bg("speed")}${floor()}${monster(c.mon, "two", s)}${av(s, "two")}${plate(c.mon)}`;
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
        return `${bg("deep")}<div class="cn-eyes"><div class="cn-eyei">${avatarHtml("you")}</div></div><svg class="cn-ecg" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 60 L300 60 L322 44 L340 60 L352 60 L366 14 L384 96 L398 60 L430 60 L452 48 L474 60 L760 60 L782 44 L800 60 L812 60 L826 14 L844 96 L858 60 L890 60 L912 48 L934 60 L1000 60"/></svg><div class="cn-lp"><small>LIFE POINT</small>${num(c.lp || 0, 150, 500)}<em>DANGER</em></div>`;
      case "reversal":
        return `<div class="cn-rev ${s}">${bg("deep")}</div><svg class="cn-crack" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M-10 300 L120 250 L190 290 L330 170 L410 230 L520 120 L600 200 L720 90 L800 150 L1010 30"/></svg>${kt(s === "you" ? "逆転!!" : "逆転…!?", s === "you" ? "rev" : "rev long")}
          <div class="cn-lps"><span class="side-you"><small>YOU</small>${num(c.lp[0], 1050, 500)}</span><i>VS</i><span class="side-opp"><small>${esc(ev.foe ? ev.foe.name : "RIVAL")}</small>${num(c.lp[1], 1150, 500)}</span></div>`;
      case "finish":
        return `${bg("deep")}${av(c.win ? "you" : "opp", "finish")}<div class="cn-fin ${c.win ? "win" : "lose"}">${kt("DUEL", "in l1")}${kt(c.win ? "WIN!!" : "LOSE…", "in l2")}<p>${c.win ? "VICTORY" : "DEFEAT"}</p></div><div class="cn-flash"></div>`;
      case "duel":
        return duelHtml();
      case "manga":
        return `<div class="bmanga ${s}"><div class="bm-lines"></div><div class="bm-av">${avatarHtml(s)}</div><div class="bm-dodo"><b>ド</b><b>ド</b><b>ド</b><b>ド</b></div></div>`;
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
    const H = opp ? ["#1c060e", "#4a1022", "#8a2440", "#d05a78"] : ["#081424", "#15324f", "#2a5f8a", "#7fc0e8"];
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

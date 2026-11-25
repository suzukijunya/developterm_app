// デュエルの「サビ」の演出: 熱いターン(逆転・ピンチ・運命のドロー・シンクロ・長いチェーン・決着)だけ、
// アニメのようにカメラの画角を切り替えて見せる。ふつうのターンは今まで通り小さな盤面で流す。
// ショット: ドローの振り抜き / カードを突き出す / カードのアップ / あおりのモンスター / 2ショット /
//           シンクロの光の輪 / チェーンの割り画面 / 攻撃の突進 / ピンチの目元 / 逆転 / 決着 / ライバル登場
// 画面には走査線と、セリフの字幕を重ねる。効果音はその場で音を合成する(音声ファイルは使わない)。

const Cinema = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const DUR = { manga: 2.6, duel: 2.2, glare: 1.8, draw: 1.5, hold: 1.6, cardup: 1.4, low: 1.9, two: 1.7, synchro: 2.0, chain: 2.1, attack: 1.9, pinch: 2.4, reversal: 2.2, finish: 2.6, rival: 2.2 };

  // ---------- 効果音(Web Audio で合成) ----------
  let ac = null;
  function unlock() {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
    } catch (e) {
      ac = null;
    }
  }
  function noise(len) {
    const b = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource();
    s.buffer = b;
    return s;
  }
  function env(node, t0, a, peak, dec) {
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + dec);
    node.connect(g);
    g.connect(ac.destination);
    return g;
  }
  function tone(type, f0, f1, t0, a, peak, dec) {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t0 + a + dec);
    env(o, t0, a, peak, dec);
    o.start(t0);
    o.stop(t0 + a + dec + 0.05);
  }
  const SFX = {
    whoosh(t) {
      const n = noise(0.6);
      const f = ac.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(300, t);
      f.frequency.exponentialRampToValueAtTime(4000, t + 0.45);
      n.connect(f);
      env(f, t, 0.12, 0.5, 0.4);
      n.start(t);
    },
    hit(t) {
      tone("sine", 140, 40, t, 0.005, 0.9, 0.5);
      const n = noise(0.3);
      const f = ac.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 1800;
      n.connect(f);
      env(f, t, 0.003, 0.6, 0.25);
      n.start(t);
    },
    shine(t) {
      [1318, 1760, 2637, 3520].forEach((f, i) => tone("sine", f, 0, t + i * 0.05, 0.01, 0.12, 0.5));
    },
    stab(t, minor) {
      (minor ? [220, 261.6, 329.6, 440] : [220, 277.2, 329.6, 440]).forEach((f) => tone("sawtooth", f, 0, t, 0.01, 0.09, 0.7));
      tone("sine", 55, 0, t, 0.01, 0.5, 0.6);
    },
    riser(t) {
      tone("sawtooth", 120, 1600, t, 0.05, 0.12, 1.3);
      const n = noise(1.4);
      const f = ac.createBiquadFilter();
      f.type = "highpass";
      f.frequency.setValueAtTime(400, t);
      f.frequency.exponentialRampToValueAtTime(6000, t + 1.3);
      n.connect(f);
      env(f, t, 1.2, 0.25, 0.15);
      n.start(t);
    },
    heart(t) {
      for (let k = 0; k < 2; k++) {
        tone("sine", 70, 40, t + k * 0.8, 0.01, 0.9, 0.18);
        tone("sine", 60, 35, t + k * 0.8 + 0.22, 0.01, 0.6, 0.18);
      }
    },
    clink(t) {
      tone("square", 2200, 1400, t, 0.002, 0.08, 0.12);
      tone("triangle", 3300, 0, t, 0.002, 0.06, 0.2);
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
        push(7, ln(DL.synchroChant(who), { shot: "synchro", side: who, from: tune && tune.t === "tune" ? tune.from : [], lv: s.mon.lv }));
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

  // ---------- 画角 ----------
  const av = (side, cls = "") => `<div class="cn-av ${side} ${cls}">${DuelFx.avatarHtml(side)}</div>`;
  const badge = (m) => `<div class="cn-badge"><small>ATK</small><b>${m.atk}</b><i>LV ${"★".repeat(Math.min(10, m.lv || 4))}</i></div>`;
  const monster = (m, cls = "", side = "you") => `<div class="cn-mon ${m.synchro ? "syn" : ""} ${m.ace ? "ace" : ""} ${cls}">${typeof MonsterArt !== "undefined" && MonsterArt.src(m, side) ? MonsterArt.icon(m, side, "cn-img") : `<span>${m.icon}</span>`}</div>`;
  const speed = (cls = "") => `<div class="cn-speed ${cls}"></div>`;
  function shotHtml(c, ev) {
    const s = c.side;
    switch (c.shot) {
      case "draw":
        return `${speed(c.gold ? "gold" : s)}<div class="cn-swing">${av(s, "swing")}<div class="cn-trail ${c.gold ? "gold" : ""}"></div></div><svg class="cn-wave" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 200 L-20 120 C60 60 140 150 220 110 C290 75 340 40 420 60 L420 200Z" fill="#fff"/><path d="M-20 150 C70 100 150 170 230 135 C300 105 350 85 420 95" stroke="#bfe6ff" stroke-width="6" fill="none"/></svg><div class="cn-kt">${c.gold ? "DESTINY DRAW!!" : "DRAW!!"}</div>`;
      case "hold":
        return `${speed(s)}${av(s, "hold")}<div class="cn-card hold">${DuelFx.cardHtml(c.card)}</div>`;
      case "cardup":
        return `<div class="cn-glow ${c.card.fx === "destiny" ? "gold" : ""}"></div><div class="cn-card up">${DuelFx.cardHtml(c.card)}<i class="cn-shine"></i></div>`;
      case "low":
        return `<div class="cn-burst ${s}"></div>${monster(c.mon, "low", s)}${badge(c.mon)}<div class="cn-name">${esc(c.mon.name)}</div>`;
      case "two":
        return `${speed(s)}${monster(c.mon, "two", s)}${av(s, "two")}${badge(c.mon)}`;
      case "synchro":
        return `<div class="cn-sync"><i></i><i></i><i></i><i></i></div><div class="cn-stars">${"★".repeat(Math.min(10, c.lv))}</div><div class="cn-mats">${(c.from || []).map(esc).join("<br>+ ")}<b>= Lv${c.lv}</b></div><div class="cn-flash"></div>`;
      case "chain":
        return `<div class="cn-split you">${av("you", "split")}</div><div class="cn-split opp">${av("opp", "split")}</div>
          <div class="cn-links">${c.links.map((l, i) => `<div class="cn-link ${l.side}" style="--i:${i}"><em>CHAIN ${l.n}</em>${l.icon} ${esc(l.name)}</div>`).join("")}</div>`;
      case "attack":
        return `${speed("h " + s)}${monster(c.mon, "dash " + s, s)}<div class="cn-impact"></div><div class="cn-dmg ${s}">−${c.dmg.toLocaleString()}</div>`;
      case "pinch":
        return `<div class="cn-red"></div><div class="cn-eyes" style="background-image:url('${eyeSrc()}')"></div><div class="cn-lp">LP <b>${(c.lp || 0).toLocaleString()}</b></div>`;
      case "reversal":
        return `<div class="cn-rev ${s}"><div class="cn-kt big">${s === "you" ? "逆転!!" : "逆転…!?"}</div><div class="cn-lps"><span class="you">YOU ${c.lp[0].toLocaleString()}</span><span class="opp">${esc(ev.foe ? ev.foe.name : "")} ${c.lp[1].toLocaleString()}</span></div></div>`;
      case "finish":
        return `${speed(c.win ? "gold" : "opp")}${av(c.win ? "you" : "opp", "finish")}<div class="cn-flash"></div><div class="cn-kt big ${c.win ? "win" : "lose"}">${c.win ? "DUEL WIN!!" : "DUEL LOSE…"}</div>`;
      case "duel":
        return duelHtml();
      case "manga":
        return `<div class="bmanga ${s}"><div class="bm-lines"></div><div class="bm-av">${DuelFx.avatarHtml(s)}</div><div class="bm-dodo"><b>ド</b><b>ド</b><b>ド</b><b>ド</b></div></div>`;
      case "glare":
        return eyeSvg(s);
      case "rival":
        return `${speed("opp")}${av("opp", "rival")}<div class="cn-rname"><small>NEW RIVAL</small>${esc(c.foe.icon)} ${esc(c.foe.name)}<i>デッキ「${esc(c.foe.deckName)}」</i></div>`;
    }
    return "";
  }
  // 斜めに裂いた対峙ショット: 左上に相手、右下に自分。光る斜線で画面を割り、手札を構える
  function duelHtml() {
    const fan = (n) => Array.from({ length: n }, (_, i) => `<i style="--k:${i - (n - 1) / 2}"></i>`).join("");
    return `<div class="cn-vs opp">${av("opp", "vs")}<div class="cn-fan top">${fan(5)}</div><b>DUEL!!</b></div>
      <div class="cn-vs you">${av("you", "vs")}<div class="cn-fan bot">${fan(5)}</div><b>DUEL!!</b></div>
      <div class="cn-slash"></div>`;
  }

  // 片目の極端なアップ(アニメ調のオリジナルの目)。自分は青緑、相手は赤の瞳
  function eyeSvg(side) {
    const opp = side === "opp";
    const H = opp ? ["#2a0a14", "#5a1428", "#8a2440", "#c04060"] : ["#0b1a2e", "#173a5e", "#2a5f8a", "#5fa0c8"];
    const I = opp ? ["#ff8aa0", "#e0284f", "#5a0618"] : ["#9ff5e0", "#1fc7a0", "#0a3f4a"];
    const hair = [
      `M-20 -20 L120 -20 L60 150 Z`,
      `M80 -20 L200 -20 L110 120 Z`,
      `M170 -20 L260 -20 L200 90 Z`,
      `M240 -20 L420 -20 L420 60 L330 40 Z`,
      `M-20 60 L40 -20 L10 200 L-20 220 Z`,
    ];
    return `<svg class="cn-eye" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="cnI" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="${I[0]}"/><stop offset=".45" stop-color="${I[1]}"/><stop offset="1" stop-color="${I[2]}"/></radialGradient>
        <clipPath id="cnE"><path d="M70 170 C120 95 260 80 345 120 C330 175 250 220 160 215 C120 212 90 195 70 170Z"/></clipPath>
        <clipPath id="cnLid"><rect class="cn-lid" x="0" y="60" width="400" height="200"/></clipPath>
      </defs>
      <rect width="400" height="300" fill="#e7c3a6"/>
      <path d="M0 230 C120 250 260 250 400 215 L400 300 L0 300Z" fill="#d6a98a"/>
      <g class="cn-eyeg">
        <g clip-path="url(#cnLid)">
          <path d="M70 170 C120 95 260 80 345 120 C330 175 250 220 160 215 C120 212 90 195 70 170Z" fill="#f4f6f8"/>
          <g clip-path="url(#cnE)">
            <path d="M70 170 C120 95 260 80 345 120 L345 135 C250 105 140 115 70 180Z" fill="#b9c4cf" opacity=".8"/>
            <g class="cn-iris"><circle cx="215" cy="152" r="66" fill="url(#cnI)"/>
              <circle cx="215" cy="152" r="66" fill="none" stroke="${I[2]}" stroke-width="6"/>
              <circle cx="215" cy="152" r="44" fill="none" stroke="${I[0]}" stroke-width="2" opacity=".6"/>
              <circle class="cn-pupil" cx="215" cy="152" r="20" fill="#0a0508"/>
              <path d="M250 112 L290 104 L262 124Z" fill="#fff"/><path d="M175 186 L205 178 L186 194Z" fill="#fff" opacity=".85"/></g>
          </g>
        </g>
        <path d="M60 172 C115 88 265 72 352 116" fill="none" stroke="#120a0a" stroke-width="12" stroke-linecap="round"/>
        <path d="M335 112 L372 100 L350 124Z" fill="#120a0a"/>
        <path d="M95 200 C150 222 250 220 320 168" fill="none" stroke="#5a3a30" stroke-width="3" opacity=".7"/>
        <path d="M40 70 L330 30 L345 52 L60 92Z" fill="${H[0]}"/>
      </g>
      ${hair.map((d, i) => `<path d="${d}" fill="${H[i % 4]}" stroke="${H[3]}" stroke-width="2"/>`).join("")}
      <path d="M150 -20 L175 -20 L120 110Z" fill="${H[3]}" opacity=".7"/>
      <path class="cn-glint" d="M240 60 L420 20 L420 32 L246 70Z" fill="#fff"/>
    </svg>`;
  }

  // 目元のアップに使う画像
  function eyeSrc() {
    const html = DuelFx.avatarHtml("you");
    const m = /src="([^"]+)"/.exec(html);
    return m ? m[1] : "";
  }

  // ---------- 光と粒の演出(キャンバス): 集中線・光の輪・火花・衝撃波・稲妻・紙吹雪・画面の揺れ ----------
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
    function bolt(x0, y0, x1, y1, col) {
      const pts = [[x0, y0]], n = 9;
      for (let i = 1; i < n; i++) pts.push([x0 + ((x1 - x0) * i) / n + (R() - 0.5) * W * 0.08, y0 + ((y1 - y0) * i) / n + (R() - 0.5) * H * 0.05]);
      pts.push([x1, y1]);
      st.bolts.push({ pts, a: 1, col });
    }
    function once(key, at, t, fn) {
      if (t >= at && !st.done[key]) (st.done[key] = 1), fn();
    }
    // 集中線(中心から外へ流れる線)。dir: 0=放射 1=横に流れる
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
    const SHOT = {
      synchro(t, c, p) {
        const cx = W / 2, cy = H * 0.45, n = Math.max(3, Math.min(10, c.lv || 6));
        glow(cx, cy, H * (0.5 + t * 0.2), p[0], 0.18 + 0.1 * Math.sin(t * 9));
        lines(t, cx, cy, p[2], 0.5 + t * 0.4, 0);
        // 奥から手前へ次々に通り抜ける光の輪
        g.globalCompositeOperation = "lighter";
        for (let k = 0; k < n; k++) {
          const u = (t * 0.75 + k / n) % 1, r = H * (0.04 + u * u * 1.1);
          g.globalAlpha = Math.min(1, u * 4) * (1 - u) * 1.4;
          g.strokeStyle = p[0];
          g.shadowColor = p[0];
          g.shadowBlur = 30 * st.dpr;
          g.lineWidth = (2 + u * 12) * st.dpr;
          g.beginPath();
          g.ellipse(cx, cy, r, r * 0.92, t * 0.6 + k, 0, TAU);
          g.stroke();
        }
        g.shadowBlur = 0;
        // 星が一列に並んで中心へ吸い込まれる
        const u = Math.min(1, t / 1.4), e = u * u;
        for (let k = 0; k < n; k++) {
          const a = (k / n) * TAU + t * 3, r = H * 0.42 * (1 - e);
          const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.6;
          glow(x, y, 26 * st.dpr, "#ffffff", 0.9);
          glow(x, y, 70 * st.dpr, p[2], 0.5);
          if (t < 1.4 && R() < 0.5) spark(x, y, 1, 60, p, { grav: 0, life: 0.5, w: 1.5 });
        }
        once("burst", 1.45, t, () => {
          flash(1);
          spark(cx, cy, 260, H * 1.5, [p[0], p[2], "#ffffff"], { grav: 120, life: 1.2, w: 3 });
          ring(cx, cy, p[0]);
          ring(cx, cy, "#ffffff", H * 2.4, 6);
          st.shake = 22;
        });
        if (t > 1.45) {
          // 光の柱
          const a = Math.max(0, 1 - (t - 1.45) / 1.1), w = W * (0.05 + (t - 1.45) * 0.12);
          const gr = g.createLinearGradient(cx - w, 0, cx + w, 0);
          gr.addColorStop(0, "rgba(0,0,0,0)");
          gr.addColorStop(0.5, "#ffffff");
          gr.addColorStop(1, "rgba(0,0,0,0)");
          g.globalAlpha = a;
          g.fillStyle = gr;
          g.fillRect(cx - w, 0, w * 2, H);
          g.globalAlpha = 1;
        }
      },
      attack(t, c, p) {
        const dir = c.side === "opp" ? -1 : 1, cx = W / 2, cy = H * 0.42;
        lines(t * 1.6, cx, cy, p[2], 1, dir);
        if (t < 0.72) {
          // 光の弾が尾を引いて突っ込む
          const u = t / 0.72, x = cx - dir * W * 0.7 * (1 - u * u), y = cy + Math.sin(u * 3) * H * 0.02;
          glow(x, y, H * 0.22, p[0], 0.9);
          glow(x, y, H * 0.08, "#ffffff", 1);
          g.globalCompositeOperation = "lighter";
          const gr = g.createLinearGradient(x, y, x - dir * W * 0.5, y);
          gr.addColorStop(0, p[2]);
          gr.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = gr;
          g.beginPath();
          g.moveTo(x, y - H * 0.035);
          g.lineTo(x - dir * W * 0.5, y);
          g.lineTo(x, y + H * 0.035);
          g.fill();
          spark(x, y, 4, 500, p, { dir: dir > 0 ? Math.PI : 0, spread: 1.2, grav: 200, life: 0.5 });
        }
        once("hit", 0.72, t, () => {
          flash(1);
          st.shake = 34;
          spark(cx, cy, 300, H * 1.8, [p[0], "#ffffff", "#ffd24a"], { life: 1.1, w: 3.2 });
          spark(cx, cy, 60, H * 0.9, ["#ffffff"], { flat: true, life: 1.4, w: 7, grav: 900 });
          ring(cx, cy, "#ffffff", H * 2.6, 14);
          ring(cx, cy, p[0], H * 1.7, 22);
          ring(cx, cy, "#ffd24a", H * 1.1, 8);
          for (let i = 0; i < 5; i++) bolt(cx, cy, cx + (R() - 0.5) * W * 1.2, cy + (R() - 0.5) * H * 1.2, p[2]);
        });
        if (t > 0.72) glow(cx, cy, H * 0.6, c.side === "opp" ? "#ff2a50" : "#ff5a3a", Math.max(0, 0.6 - (t - 0.72) * 0.6));
      },
      summon(t, c, p, big) {
        const cx = W / 2, cy = H * 0.5;
        rays(t, cx, cy, p[0], 14, 0.16);
        glow(cx, cy, H * 0.8, p[0], 0.22 + 0.08 * Math.sin(t * 8));
        lines(t, cx, cy, p[2], 0.7, 0);
        if (R() < 0.8) spark(R() * W, H + 10, 2, H * 0.5, p, { dir: -Math.PI / 2, spread: 0.5, grav: -60, life: 2, w: 2.4, drag: 0.4 });
        once("in", 0.05, t, () => {
          flash(0.8, p[2]);
          st.shake = big ? 26 : 12;
          ring(cx, H * 0.8, p[0], H * 1.8, 16);
          spark(cx, H * 0.8, big ? 220 : 110, H * 1.3, p, { dir: -Math.PI / 2, spread: 2.6, life: 1.3 });
        });
        if (big && (st.bt = (st.bt || 0) - st.dt) <= 0) {
          st.bt = 0.22 + R() * 0.3;
          const x = R() * W;
          bolt(x, 0, x + (R() - 0.5) * W * 0.3, H * (0.5 + R() * 0.4), p[2]);
          flash(0.25, p[2]);
        }
      },
      draw(t, c, p) {
        lines(t * 1.3, W * 0.5, H * 0.5, p[2], 0.8, c.side === "opp" ? -1 : 1);
        const u = Math.min(1, t / 0.5), a = -2.4 + u * 2.6, cx = W * 0.5, cy = H * 0.75, r = H * 0.55;
        if (u < 1) spark(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 10, 380, p, { grav: 300, life: 0.8 });
        once("f", 0.45, t, () => (flash(c.gold ? 0.9 : 0.4, p[2]), c.gold && (ring(W / 2, H / 2, p[0]), spark(W / 2, H / 2, 200, H * 1.3, p, { life: 1.3 }))));
        if (c.gold) rays(t, W / 2, H / 2, p[0], 12, 0.14);
      },
      card(t, c, p) {
        const cx = W / 2, cy = H / 2;
        rays(t, cx, cy, p[0], 10, 0.14);
        glow(cx, cy, H * 0.7, p[0], 0.25);
        for (let i = 0; i < 3; i++) {
          const a = t * 2.4 + i * 2.1, r = H * 0.34;
          spark(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.5, 1, 90, p, { grav: 0, life: 0.7, w: 2 });
        }
        once("f", 0.05, t, () => flash(0.5, p[2]));
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
        const cx = W / 2, cy = H / 2;
        if (c.win) {
          rays(t, cx, cy, "#ffd24a", 16, 0.2);
          lines(t, cx, cy, "#fff6d0", 0.9, 0);
          if (R() < 0.9) spark(R() * W, -10, 4, 260, ["#ffd24a", "#5fd0ff", "#ff5a8a", "#5ff5c0", "#ffffff"], { dir: Math.PI / 2, spread: 1.2, grav: 260, life: 3, w: 8, flat: true, drag: 0.6 });
          once("f", 0.05, t, () => (flash(1), (st.shake = 30), ring(cx, cy, "#ffd24a"), ring(cx, cy, "#ffffff", H * 2.4, 8), spark(cx, cy, 320, H * 1.7, PAL.gold, { life: 1.4, w: 3 })));
          once("f2", 0.9, t, () => (ring(cx, cy, "#ffd24a", H * 1.4), spark(cx, cy, 160, H * 1.2, PAL.gold, { life: 1.2 })));
        } else {
          glow(cx, cy, H, "#5a0618", 0.5);
          if (R() < 0.7) spark(R() * W, H + 10, 2, 160, ["#ff3d5a", "#7a1020", "#ff9a6a"], { dir: -Math.PI / 2, spread: 0.7, grav: -30, life: 2.6, w: 2.4, drag: 0.3 });
          once("f", 0.05, t, () => (flash(0.9, "#ff2a50"), (st.shake = 30), ring(cx, cy, "#ff3d5a")));
        }
      },
      clash(t, c, p) {
        lines(t, W / 2, H / 2, p[2], 0.8, 0);
        once("f", 0.22, t, () => {
          flash(0.9);
          st.shake = 20;
          for (let i = 0; i < 26; i++) spark(W * (0.1 + i * 0.032), H * (0.9 - i * 0.032), 8, H * 0.8, ["#ffffff", "#ffd24a", p[0]], { life: 0.9 });
          ring(W / 2, H / 2, "#ffffff");
        });
      },
      chain(t, c, p) {
        const n = (c.links || []).length;
        for (let k = 0; k < n; k++)
          once("c" + k, 0.15 + k * 0.22, t, () => {
            const y = H * (0.25 + (0.5 * k) / Math.max(1, n - 1));
            bolt(0, y, W, y + (R() - 0.5) * H * 0.1, k % 2 ? PAL.opp[0] : PAL.you[0]);
            spark(W / 2, y, 60, H * 0.9, k % 2 ? PAL.opp : PAL.you, { life: 0.8 });
            flash(0.3);
            st.shake = 8;
          });
        lines(t, W / 2, H / 2, "#ffffff", 0.35, 0);
      },
    };
    const MAP = { synchro: "synchro", attack: "attack", low: "summon", two: "summon", manga: "summon", draw: "draw", hold: "card", cardup: "card", pinch: "pinch", finish: "finish", reversal: "clash", duel: "clash", rival: "summon", glare: "card", chain: "chain" };
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!st || !cv.isConnected) return stop();
      const t = (now - st.t0) / 1000, dt = Math.min(0.05, (now - st.last) / 1000);
      st.last = now;
      st.dt = dt;
      const cw = Math.round(cv.clientWidth * st.dpr), ch = Math.round(cv.clientHeight * st.dpr);
      if (cv.width !== cw || cv.height !== ch) (cv.width = cw), (cv.height = ch);
      W = cw;
      H = ch;
      g.globalCompositeOperation = "source-over";
      g.clearRect(0, 0, W, H);
      const c = st.c, p = c.gold ? PAL.gold : PAL[c.side] || PAL.you, fn = SHOT[MAP[c.shot]];
      if (fn) fn(t, c, p, c.shot === "low" || c.shot === "manga");
      // 衝撃波
      g.globalCompositeOperation = "lighter";
      st.rings = st.rings.filter((r) => r.a > 0.02);
      for (const r of st.rings) {
        r.r += r.v * dt * st.dpr * 0.6;
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
          stageEl.style.transform = `translate(${((R() - 0.5) * st.shake).toFixed(1)}px,${((R() - 0.5) * st.shake).toFixed(1)}px) scale(1.03)`;
          st.shake *= Math.exp(-dt * 7);
        } else if (stageEl.style.transform) stageEl.style.transform = "";
      }
    }
    function start(el, c) {
      cv = el.querySelector(".cn-fx");
      stageEl = el.querySelector(".cn-stage");
      if (!cv) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      g = cv.getContext("2d");
      const now = performance.now();
      const L = Array.from({ length: 110 }, () => ({ a: R() * TAU, sp: 0.6 + R() * 1.6, ph: R(), ph2: R(), len: R(), w: 0.6 + R() * 2.4, al: 0.15 + R() * 0.5 }));
      st = { c, t0: now, last: now, P: [], rings: [], bolts: [], L, done: {}, flash: 0, flashCol: "#fff", shake: 0, dpr: Math.min(2, window.devicePixelRatio || 1), dt: 0.016 };
      if (stageEl) stageEl.style.transform = "";
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
  let timer = null;
  let pending = null; // 再生中に次の見せ場が来たら、終わってから続けて流す
  const busy = () => !!document.getElementById("cine");
  function stop() {
    clearTimeout(timer);
    FX.stop();
    pending = null;
    const el = document.getElementById("cine");
    if (el) el.remove();
  }
  // onCut(cut): そのカットのセリフを話す(声の高さ・速さは cut.tone で変える)
  function play(ev, onCut, onEnd) {
    const cuts = ev.cuts || plan(ev); // ev.cuts: カットを直接指定(確認用)
    if (!cuts.length) return false;
    if (busy()) {
      pending = { ev, onCut, onEnd };
      return cuts;
    }
    stop();
    document.body.insertAdjacentHTML("beforeend", `<div class="cine" id="cine" role="dialog" aria-label="デュエルの見せ場"><div class="cn-stage"></div><canvas class="cn-fx"></canvas><div class="cn-scan"></div><div class="cn-sub"></div><div class="cn-bar t"></div><div class="cn-bar b"></div></div>`);
    const el = document.getElementById("cine");
    const stage = el.querySelector(".cn-stage");
    const sub = el.querySelector(".cn-sub");
    let i = 0;
    const end = () => {
      const p = pending;
      stop();
      if (onEnd) onEnd();
      if (p) play(p.ev, p.onCut, p.onEnd);
    };
    el.addEventListener("click", end);
    const next = () => {
      if (i >= cuts.length || !document.body.contains(el)) return end();
      const c = cuts[i++];
      stage.className = `cn-stage shot-${c.shot} side-${c.side}`;
      stage.innerHTML = shotHtml(c, ev);
      sub.innerHTML = `<span>${esc(c.line)}</span>`;
      sub.className = `cn-sub ${c.side}`;
      void stage.offsetWidth;
      FX.start(el, c);
      cueSfx(c);
      if (onCut) onCut(c);
      const dur = Math.max(DUR[c.shot] || 1.6, Math.min(3.2, c.line.length * 0.12));
      timer = setTimeout(next, dur * 1000);
    };
    next();
    return cuts;
  }
  function cueSfx(c) {
    const m = {
      draw: () => (sfx("whoosh"), c.gold && sfx("shine", 0.3)),
      hold: () => sfx("shine", 0.1),
      cardup: () => sfx("shine"),
      low: () => (sfx("stab", 0.05), sfx("hit", 0.05)),
      two: () => sfx("stab", 0.05, c.side === "opp"),
      synchro: () => (sfx("riser"), sfx("hit", 1.5), sfx("shine", 1.5)),
      chain: () => c.links.forEach((_, k) => sfx("clink", 0.15 + k * 0.22)),
      attack: () => (sfx("whoosh"), sfx("hit", 0.7)),
      pinch: () => sfx("heart"),
      reversal: () => (sfx("hit"), sfx("stab", 0.1, c.side === "opp")),
      finish: () => (sfx("hit"), sfx("stab", 0.25, !c.win)),
      rival: () => sfx("stab", 0, true),
      duel: () => (sfx("whoosh"), sfx("hit", 0.25), sfx("stab", 0.3)),
      manga: () => (sfx("stab", 0.05, c.side === "opp"), sfx("hit", 0.4)),
      glare: () => (sfx("heart"), sfx("shine", 0.9)),
    };
    if (m[c.shot]) m[c.shot]();
  }

  return { plan, play, stop, busy, unlock, sfx };
})();

if (typeof module !== "undefined") module.exports = Cinema;

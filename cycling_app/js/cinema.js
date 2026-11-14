// デュエルの「サビ」の演出: 熱いターン(逆転・ピンチ・運命のドロー・シンクロ・長いチェーン・決着)だけ、
// アニメのようにカメラの画角を切り替えて見せる。ふつうのターンは今まで通り小さな盤面で流す。
// ショット: ドローの振り抜き / カードを突き出す / カードのアップ / あおりのモンスター / 2ショット /
//           シンクロの光の輪 / チェーンの割り画面 / 攻撃の突進 / ピンチの目元 / 逆転 / 決着 / ライバル登場
// 画面には走査線と、セリフの字幕を重ねる。効果音はその場で音を合成する(音声ファイルは使わない)。

const Cinema = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const DUR = { duel: 2.2, glare: 1.8, draw: 1.5, hold: 1.6, cardup: 1.4, low: 1.9, two: 1.7, synchro: 2.0, chain: 2.1, attack: 1.9, pinch: 2.4, reversal: 2.2, finish: 2.6, rival: 2.2 };

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
    const nf = st.find((x) => x.t === "newfoe");
    if (nf) {
      push(6, { shot: "rival", side: "opp", line: `${nf.foe.name}、参上! デッキは${nf.foe.deckName}!`, tone: "shout", foe: nf.foe });
      push(6, { shot: "duel", side: "you", line: "デュエル!!", tone: "shout" });
    }
    const draw = st.find((x) => x.t === "draw" && !x.why);
    if (tags.has("destiny")) {
      push(9, { shot: "pinch", side: "you", line: `ここで…終わるわけには、いかない…!`, tone: "low", lp: ev.lp0.you });
      push(10, { shot: "draw", side: "you", line: "運命の…ドロー!!", tone: "shout", gold: true });
      const dc = st.find((x) => x.t === "spell" && x.card.fx === "destiny");
      if (dc) {
        push(5, { shot: "cardup", side: "you", card: dc.card, line: `このカードは…!`, tone: "low" });
        push(9, { shot: "hold", side: "you", card: dc.card, line: `${dc.card.name}、発動!!`, tone: "shout" });
      }
    } else if (mine && draw && d.score >= 5) push(3, { shot: "draw", side: "you", line: "俺のターン! ドロー!!", tone: "shout" });
    // 召喚(シンクロ・エース)
    let summons = 0;
    for (const s of st) {
      if (s.t !== "summon" || summons >= 2) continue;
      const who = s.side;
      if (s.how === "synchro") {
        const tune = st[st.indexOf(s) - 1];
        push(7, { shot: "synchro", side: who, from: tune && tune.t === "tune" ? tune.from : [], lv: s.mon.lv, line: who === "you" ? "光を束ねて、道を切り拓け! シンクロ召喚!" : `${foe}「闇を束ねろ…シンクロ召喚!」`, tone: "shout" });
        push(7, { shot: "low", side: who, mon: s.mon, line: who === "you" ? `走れ、${s.mon.name}!!` : `現れたのは…${s.mon.name}!`, tone: who === "you" ? "shout" : "low" });
        summons++;
      } else if (s.how === "ace" || s.mon.atk >= 2500) {
        push(s.how === "ace" ? 10 : 5, { shot: s.how === "ace" ? "low" : "two", side: who, mon: s.mon, line: who === "you" ? `来い! ${s.mon.name}!!` : `${foe}が${s.mon.name}を呼んだ…!`, tone: "shout" });
        summons++;
      }
    }
    // 長いチェーン
    const ch = st.filter((x) => x.t === "chain").sort((a, b) => b.links.length - a.links.length)[0];
    if (ch && ch.links.length >= 3) push(6, { shot: "chain", side: ev.side, links: ch.links, line: `チェーン${ch.links.length}! 最後に重ねたカードから解決だ!`, tone: "shout" });
    // 攻撃: 決着の一撃か、いちばん大きいダメージ
    const atks = st.filter((x) => x.t === "attack" && x.dmg > 0 && (x.result === "direct" || x.result === "destroy" || x.result === "guard"));
    const big = atks.sort((a, b) => (b.mon.ace ? 1e5 : 0) + b.dmg - (a.mon.ace ? 1e5 : 0) - a.dmg)[0];
    // 決着の一撃の前に、目のアップで溜める
    if (big && big.side === "you" && tags.has("win")) push(8, { shot: "glare", side: "you", line: "この一撃で…決める!", tone: "low" });
    if (big && (tags.has("win") || tags.has("lose") || tags.has("reversal") || tags.has("reversed") || tags.has("pinch") || big.dmg >= 1200))
      push(tags.has("win") || tags.has("lose") || tags.has("reversal") ? 9 : 6, { shot: "attack", side: big.side, mon: big.mon, dmg: big.dmg, direct: big.result === "direct", line: big.side === "you" ? `行け、${big.mon.name}! ${big.result === "direct" ? "ダイレクトアタック!" : "攻撃!"}` : `${big.mon.name}の攻撃…!`, tone: "shout" });
    // ピンチ・逆転・決着
    if (tags.has("pinch") && !tags.has("destiny")) push(8, { shot: "pinch", side: "you", lp: ev.you.lp, line: d.hint ? `LP${ev.you.lp}…まだだ。次の区間、全力で踏めば…!` : `くっ…LP、残り${ev.you.lp}…!`, tone: "low" });
    if (tags.has("reversal")) push(9, { shot: "reversal", side: "you", lp: [ev.you.lp, ev.opp.lp], line: "逆転だ!! ここからが、本当の勝負だ!", tone: "shout" });
    if (tags.has("reversed")) push(8, { shot: "reversal", side: "opp", lp: [ev.you.lp, ev.opp.lp], line: `${foe}に逆転された…!?`, tone: "low" });
    if (tags.has("win")) push(10, { shot: "finish", side: "you", win: true, line: `これで終わりだ! ${foe}、撃破!`, tone: "shout" });
    if (tags.has("lose")) push(10, { shot: "finish", side: "opp", win: false, line: "ライフが…ゼロに…。だが、まだ走れる!", tone: "low" });
    // 多すぎたら優先度の低いものから削る(順番は起きた順のまま)
    const keep = cand.slice().sort((a, b) => b[0] - a[0]).slice(0, 6);
    const cuts = cand.filter((c) => keep.includes(c)).map((c) => c[2]);
    // 決着とピンチは最後に置く
    const last = (shot) => {
      const i = cuts.findIndex((c) => c.shot === shot && c.line && !/運命|ここで/.test(c.line));
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
  const monster = (m, cls = "") => `<div class="cn-mon ${m.synchro ? "syn" : ""} ${m.ace ? "ace" : ""} ${cls}"><span>${m.icon}</span></div>`;
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
        return `<div class="cn-burst ${s}"></div>${monster(c.mon, "low")}${badge(c.mon)}<div class="cn-name">${esc(c.mon.name)}</div>`;
      case "two":
        return `${speed(s)}${monster(c.mon, "two")}${av(s, "two")}${badge(c.mon)}`;
      case "synchro":
        return `<div class="cn-sync"><i></i><i></i><i></i><i></i></div><div class="cn-stars">${"★".repeat(Math.min(10, c.lv))}</div><div class="cn-mats">${(c.from || []).map(esc).join("<br>+ ")}<b>= Lv${c.lv}</b></div><div class="cn-flash"></div>`;
      case "chain":
        return `<div class="cn-split you">${av("you", "split")}</div><div class="cn-split opp">${av("opp", "split")}</div>
          <div class="cn-links">${c.links.map((l, i) => `<div class="cn-link ${l.side}" style="--i:${i}"><em>CHAIN ${l.n}</em>${l.icon} ${esc(l.name)}</div>`).join("")}</div>`;
      case "attack":
        return `${speed("h " + s)}${monster(c.mon, "dash " + s)}<div class="cn-impact"></div><div class="cn-dmg ${s}">−${c.dmg.toLocaleString()}</div>`;
      case "pinch":
        return `<div class="cn-red"></div><div class="cn-eyes" style="background-image:url('${eyeSrc()}')"></div><div class="cn-lp">LP <b>${(c.lp || 0).toLocaleString()}</b></div>`;
      case "reversal":
        return `<div class="cn-rev ${s}"><div class="cn-kt big">${s === "you" ? "逆転!!" : "逆転…!?"}</div><div class="cn-lps"><span class="you">YOU ${c.lp[0].toLocaleString()}</span><span class="opp">${esc(ev.foe ? ev.foe.name : "")} ${c.lp[1].toLocaleString()}</span></div></div>`;
      case "finish":
        return `${speed(c.win ? "gold" : "opp")}${av(c.win ? "you" : "opp", "finish")}<div class="cn-flash"></div><div class="cn-kt big ${c.win ? "win" : "lose"}">${c.win ? "DUEL WIN!!" : "DUEL LOSE…"}</div>`;
      case "duel":
        return duelHtml();
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

  // ---------- 再生 ----------
  let timer = null;
  let pending = null; // 再生中に次の見せ場が来たら、終わってから続けて流す
  const busy = () => !!document.getElementById("cine");
  function stop() {
    clearTimeout(timer);
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
    document.body.insertAdjacentHTML("beforeend", `<div class="cine" id="cine" role="dialog" aria-label="デュエルの見せ場"><div class="cn-stage"></div><div class="cn-scan"></div><div class="cn-sub"></div><div class="cn-bar t"></div><div class="cn-bar b"></div></div>`);
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
      glare: () => (sfx("heart"), sfx("shine", 0.9)),
    };
    if (m[c.shot]) m[c.shot]();
  }

  return { plan, play, stop, busy, unlock, sfx };
})();

if (typeof module !== "undefined") module.exports = Cinema;

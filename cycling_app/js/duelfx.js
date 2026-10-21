// デュエルモードの演出(画面の上に重ねる): 開始と終了のときに左右のレーンを光が走り、
// ライフポイントのカウント・手札のドロー・召喚のエフェクトを出す。タップで閉じられる。

const DuelFx = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  let timer = null;

  function cardHtml(c, cls = "") {
    return `<div class="df-card ${c.kind} ${cls}"><div class="df-card-name">${esc(c.name)}</div><div class="df-card-art">${c.kind === "trap" ? "⚡" : "🌀"}</div><div class="df-card-type">${c.kind === "trap" ? "TRAP" : "SPEED SPELL"}</div><div class="df-card-text">${esc(c.text)}</div></div>`;
  }

  function overlay(html, ms, onClose) {
    close();
    document.body.insertAdjacentHTML("beforeend", `<div class="df" id="df" role="dialog" aria-label="デュエル">${html}<button class="df-skip">タップで閉じる</button></div>`);
    const el = document.getElementById("df");
    const done = () => {
      close();
      if (onClose) onClose();
    };
    el.addEventListener("click", done);
    timer = setTimeout(done, ms);
    return el;
  }

  function close() {
    clearTimeout(timer);
    const el = document.getElementById("df");
    if (el) el.remove();
  }

  // 数字をなめらかに変える(LPのカウント)
  function count(el, from, to, ms) {
    if (!el) return;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))).toLocaleString();
      if (k < 1 && document.body.contains(el)) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const lanes = `<div class="df-lane left"></div><div class="df-lane right"></div>`;

  // 開始: レーン → 「RIDING DUEL / ACCELERATION!」→ LP 4000 → 5枚ドロー
  function start({ hand, ghost }) {
    const el = overlay(
      `${lanes}
      <div class="df-center">
        <div class="df-title">RIDING DUEL</div>
        <div class="df-accel">ACCELERATION!</div>
        <div class="df-lps">
          <div class="df-lp you"><small>YOU</small><b id="df-lp-you">0</b></div>
          <div class="df-vs">VS</div>
          <div class="df-lp ghost"><small>GHOST</small><b id="df-lp-ghost">${ghost ? "0" : "—"}</b></div>
        </div>
        <div class="df-draw">DRAW!</div>
        <div class="df-hand">${hand.map((c, i) => cardHtml(c, "deal").replace('class="df-card', `style="--i:${i};--r:${(i - (hand.length - 1) / 2) * 6}deg;--y:${Math.abs(i - (hand.length - 1) / 2) * 6}px" class="df-card`)).join("")}</div>
      </div>`,
      6500
    );
    setTimeout(() => {
      count(el.querySelector("#df-lp-you"), 0, 4000, 900);
      if (ghost) count(el.querySelector("#df-lp-ghost"), 0, 4000, 900);
    }, 1300);
  }

  // 終了: レーン → LPのカウント → 相棒(バイク)の召喚 → 勝敗
  function end({ res, monster, used }) {
    const lp = res && !res.first ? res.lp : null;
    const verdict = !res || res.first ? "DUEL END" : res.battle && res.battle.winner === "draw" ? "DRAW" : res.win ? "DUEL WIN!" : "DUEL LOSE…";
    const el = overlay(
      `${lanes}
      <div class="df-center">
        <div class="df-title">TURBO DUEL END</div>
        <div class="df-lps">
          <div class="df-lp you"><small>YOU</small><b id="df-lp-end">4,000</b></div>
          ${res && !res.first ? `<div class="df-vs">VS</div><div class="df-lp ghost"><small>GHOST</small><b>${res.battle ? res.battle.opp.toLocaleString() : res.win ? "0" : "4,000"}</b></div>` : ""}
        </div>
        <div class="df-summon">
          <div class="df-rings"><i></i><i></i><i></i></div>
          <div class="df-monster">
            <div class="df-m-name">${esc(monster.name)}</div>
            <div class="df-m-stars">${"★".repeat(monster.stars)}</div>
            <div class="df-m-art">🚴</div>
            <div class="df-m-type">【シンクロ／機械族】</div>
            <div class="df-m-stat">ATK/${monster.atk.toLocaleString()}　DEF/${monster.def.toLocaleString()}</div>
          </div>
        </div>
        ${used && used.length ? `<div class="df-used">発動したカード: ${used.map((c) => esc(c.name)).join("・")}</div>` : ""}
        <div class="df-verdict ${res && !res.first ? (res.win ? "win" : "lose") : ""}">${verdict}</div>
      </div>`,
      8000
    );
    if (lp != null) setTimeout(() => count(el.querySelector("#df-lp-end"), 4000, lp, 1200), 900);
  }

  // 走行中: ドローしたカード・発動したカードを画面の下に少しだけ出す(操作は不要)
  function pop(card, label) {
    let el = document.getElementById("df-pop");
    if (el) el.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="df-pop" id="df-pop"><div class="df-pop-label">${esc(label)}</div>${cardHtml(card, "pop")}</div>`);
    el = document.getElementById("df-pop");
    setTimeout(() => el && el.remove(), 2600);
  }

  // ---------- バトルの盤面 ----------
  // b: Battle の状態。names: { you, opp }。marks: { 新しいモンスター/やられたモンスター → class }
  function monHtml(m, cls) {
    return `<div class="bf-mon ${m.synchro ? "syn" : ""} ${cls || ""}"><span class="bf-icon">${m.icon}</span><span class="bf-name">${esc(m.name)}</span><b>${m.atk}</b></div>`;
  }
  function rowHtml(field, extra, marks) {
    const list = field.concat(extra || []);
    const cells = [];
    for (let i = 0; i < 3; i++) cells.push(list[i] ? monHtml(list[i], marks.get(list[i])) : `<div class="bf-zone"></div>`);
    return cells.join("");
  }
  function fieldHtml(b, names, ev) {
    const marks = new Map();
    const dead = { you: [], opp: [] };
    if (ev) {
      for (const st of ev.steps) {
        if (st.t === "summon") marks.set(st.mon, st.synchro ? "new syn-new" : "new");
        if (st.t === "attack") {
          if (st.result === "destroy" || st.result === "both") st.target && (dead[st.side === "you" ? "opp" : "you"].push(st.target), marks.set(st.target, "dead"));
          if (st.result === "repel" || st.result === "both") (dead[st.side].push(st.mon), marks.set(st.mon, "dead"));
          if (!marks.has(st.mon)) marks.set(st.mon, "atk-" + st.side);
        }
      }
    }
    const lpBar = (side, lp) => `<div class="bf-lp ${side}"><small>${esc(names[side])}</small><div class="bf-lpbar"><i style="width:${(lp / 4000) * 100}%"></i></div><b>${lp.toLocaleString()}</b></div>`;
    return `<div class="bf">
      ${lpBar("opp", b.opp.lp)}
      <div class="bf-row opp">${rowHtml(b.opp.field, dead.opp, marks)}</div>
      <div class="bf-mid">TURN ${b.turn}</div>
      <div class="bf-row you">${rowHtml(b.you.field, dead.you, marks)}</div>
      ${lpBar("you", b.you.lp)}
    </div>`;
  }

  // 1ターンの演出(画面の上に4〜5秒。触らなくてよい)
  let turnTimer = null;
  function turn(ev, b, names) {
    clearTimeout(turnTimer);
    let el = document.getElementById("bt");
    if (el) el.remove();
    const yours = ev.side === "you";
    const seq = [];
    let t = 0.5, tSum = 1.4, tAtk = null;
    for (const st of ev.steps) {
      if (st.t === "draw") {
        seq.push(`<div class="bt-step bt-draw" style="--d:${t}s">${yours && st.card ? cardHtml(st.card, "mini-card") : `<div class="bt-back"></div>`}<span>DRAW!</span></div>`);
        t += 0.9;
      } else if (st.t === "summon") {
        tSum = t;
        seq.push(`<div class="bt-call" style="--d:${t}s">${st.synchro ? `✦ SYNCHRO SUMMON ✦<small>${esc(st.from.join(" + "))}</small>` : "SUMMON!"}<b>${st.mon.icon} ${esc(st.mon.name)} ATK ${st.mon.atk}</b></div>`);
        t += 0.9;
      } else if (st.t === "trap") {
        seq.push(`<div class="bt-step bt-trap" style="--d:${t}s">${cardHtml(Object.assign({ kind: "trap" }, st.card), "mini-card")}<span>TRAP OPEN!</span></div>`);
        t += 0.9;
      } else if (st.t === "attack") {
        tAtk = t + 0.3;
        const txt = st.result === "negated" ? "無効化!" : st.result === "direct" ? `ダイレクトアタック! −${st.dmg}` : st.result === "destroy" ? `撃破! −${st.dmg}` : st.result === "repel" ? `返り討ち… −${st.dmg}` : "相打ち!";
        seq.push(`<div class="bt-beam ${st.side}" style="--d:${t}s"></div><div class="bt-call dmg ${st.side}" style="--d:${t + 0.25}s">${st.mon.icon} ${esc(st.mon.name)}の攻撃 (${st.power})<b>${txt}</b></div>`);
        t += 1.1;
      } else if (st.t === "win") {
        seq.push(`<div class="bt-call win ${st.side}" style="--d:${t}s"><b>${st.side === "you" ? "DUEL WIN!" : "DUEL LOSE…"}</b></div>`);
        t += 1.2;
      }
    }
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="bt" id="bt" style="--dsum:${tSum}s;--dead:${tAtk || t}s">
        <div class="bt-banner ${ev.side}">TURN ${ev.turn}・${yours ? "YOUR TURN" : `${esc(names.opp)}のターン`}<small>この1km ${ev.ratio >= 1 ? "ゴーストより速い" : "ゴーストより遅い"}(×${ev.ratio.toFixed(2)})</small></div>
        ${fieldHtml(b, names, ev)}
        <div class="bt-seq">${seq.join("")}</div>
      </div>`
    );
    el = document.getElementById("bt");
    turnTimer = setTimeout(() => el && el.remove(), (t + 1.4) * 1000);
  }

  return { start, end, pop, close, cardHtml, fieldHtml, turn };
})();

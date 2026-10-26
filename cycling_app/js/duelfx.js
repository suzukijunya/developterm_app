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
        <div class="df-duelists"><div class="df-av you">${avatarHtml("you", "shout")}</div><div class="df-av opp">${ghost ? avatarHtml("opp", "shout") : ""}</div></div>
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
        <div class="df-duelists end"><div class="df-av you">${avatarHtml("you")}</div></div>
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
        <div class="bt-face ${ev.side}">${avatarHtml(ev.side)}</div>
        <div class="bt-banner ${ev.side}">TURN ${ev.turn}・${yours ? "YOUR TURN" : `${esc(names.opp)}のターン`}<small>この1km ${ev.ratio >= 1 ? "ゴーストより速い" : "ゴーストより遅い"}(×${ev.ratio.toFixed(2)})</small></div>
        ${fieldHtml(b, names, ev)}
        <div class="bt-seq">${seq.join("")}</div>
      </div>`
    );
    el = document.getElementById("bt");
    turnTimer = setTimeout(() => el && el.remove(), (t + 1.4) * 1000);
  }

  // ---------- デュエリスト(オリジナルのキャラクター。設定で自分の画像に替えられる) ----------
  const IMG_KEY = "cycling_duelist_img";
  function customImg() {
    try {
      return localStorage.getItem(IMG_KEY) || "";
    } catch (e) {
      return "";
    }
  }
  // オリジナルの主人公: 黒髪にオレンジのメッシュのツンツン頭、額にゴーグル、オレンジのマフラー、紺のライダージャケット、カードを構える。
  // o.ghost: ゴースト(青く透けた自分)。o.face: "normal" / "shout"(ドロー・攻撃などで叫ぶ顔)
  function charaSvg(o = {}) {
    const ghost = !!o.ghost, face = o.face || "normal";
    const C = ghost
      ? { hair: "#7fb4ff", hair2: "#cfe6ff", mesh: "#e6f3ff", skin: "#dcebff", skinS: "#b9d3f5", jacket: "#5f8fd8", jacket2: "#3f6fbf", scarf: "#bfe0ff", scarf2: "#9cc8f5", eye: "#ffffff", line: "#2a4a80", gog: "#d8ecff" }
      : { hair: "#1c1f2b", hair2: "#2e3446", mesh: "#ff8a1f", skin: "#ffe0c8", skinS: "#f2bfa0", jacket: "#1b2a4e", jacket2: "#24396a", scarf: "#ff6a1a", scarf2: "#e04e10", eye: "#1fc7a0", line: "#2b1a14", gog: "#ffb02e" };
    const iris = (cx, shout) => `
         <ellipse cx="${cx}" cy="${shout ? 124 : 123}" rx="8" ry="${shout ? 7.5 : 10}" fill="${C.eye}"/>
         <ellipse cx="${cx}" cy="${shout ? 125 : 125}" rx="4" ry="${shout ? 4.5 : 6}" fill="${ghost ? "#2f5fa8" : "#06352b"}"/>
         <path d="M${cx - 8} ${shout ? 120 : 117} Q${cx} ${shout ? 117 : 113} ${cx + 8} ${shout ? 120 : 117}" stroke="${ghost ? "#2f5fa8" : "#06352b"}" stroke-width="3" fill="none" opacity=".55"/>
         <circle cx="${cx - 3}" cy="${shout ? 121 : 118}" r="2.8" fill="#fff"/><circle cx="${cx + 3.5}" cy="${shout ? 127 : 128}" r="1.3" fill="#fff"/>`;
    const eyes = `
         <path d="M70 ${face === "shout" ? 120 : 116} Q83 ${face === "shout" ? 114 : 110} 97 116 L96 129 Q84 134 72 129Z" fill="#fff"/>
         <path d="M105 116 Q119 ${face === "shout" ? 114 : 110} 132 ${face === "shout" ? 120 : 116} L130 129 Q118 134 106 129Z" fill="#fff"/>
         ${iris(85, face === "shout")}${iris(117, face === "shout")}
         <path d="M68 ${face === "shout" ? 121 : 117} Q83 ${face === "shout" ? 113 : 108} 98 115" stroke="${C.line}" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M104 115 Q119 ${face === "shout" ? 113 : 108} 134 ${face === "shout" ? 121 : 117}" stroke="${C.line}" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M73 130 Q84 134 95 130" stroke="${C.line}" stroke-width="1.4" fill="none" opacity=".6"/><path d="M107 130 Q118 134 129 130" stroke="${C.line}" stroke-width="1.4" fill="none" opacity=".6"/>
         <path d="M66 ${face === "shout" ? 104 : 101} L97 ${face === "shout" ? 112 : 108} L96 ${face === "shout" ? 116 : 112} L67 ${face === "shout" ? 109 : 106}Z" fill="${C.hair}"/>
         <path d="M136 ${face === "shout" ? 104 : 101} L105 ${face === "shout" ? 112 : 108} L106 ${face === "shout" ? 116 : 112} L135 ${face === "shout" ? 109 : 106}Z" fill="${C.hair}"/>`;
    const mouth = face === "shout"
      ? `<path d="M86 146 Q101 140 116 146 Q113 164 101 165 Q89 164 86 146Z" fill="#5a1414"/><path d="M89 147 Q101 143 113 147 L112 151 Q101 148 90 151Z" fill="#fff"/><path d="M93 158 Q101 154 109 158 Q101 163 93 158Z" fill="#e0606a"/>`
      : `<path d="M90 148 Q101 154 113 145" stroke="${C.line}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M111 144 L115 142" stroke="${C.line}" stroke-width="2" stroke-linecap="round"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" class="dl-svg ${ghost ? "ghost" : ""}" aria-hidden="true">
    <!-- 後ろ髪 -->
    <path d="M48 118 L22 104 L44 94 L18 70 L50 72 L30 40 L64 56 L60 18 L86 46 L100 6 L112 44 L136 14 L136 52 L170 36 L152 70 L184 70 L158 94 L180 104 L152 118 Z" fill="${C.hair}"/>
    <path d="M100 6 L106 30 L112 44 L102 36Z M60 18 L72 38 L86 46 L72 44Z M136 14 L134 34 L136 52 L128 38Z M30 40 L48 52 L64 56 L46 56Z M170 36 L156 52 L152 70 L160 50Z" fill="${C.mesh}"/>
    <!-- マフラー(後ろになびく) -->
    <path d="M60 182 C30 176 14 160 4 140 C24 150 40 152 58 164Z" fill="${C.scarf2}"/>
    <path d="M58 172 C34 172 18 166 2 158 C20 176 40 184 62 186Z" fill="${C.scarf}"/>
    <!-- からだ・ジャケット -->
    <path d="M24 240 C30 200 52 184 100 182 C148 184 170 200 176 240Z" fill="${C.jacket}"/>
    <path d="M100 186 L84 240 L116 240Z" fill="${C.jacket2}"/>
    <path d="M60 196 L72 240" stroke="${C.scarf}" stroke-width="4"/><path d="M140 196 L128 240" stroke="${C.scarf}" stroke-width="4"/>
    <!-- 首・マフラー -->
    <path d="M86 160 L86 182 L114 182 L114 160Z" fill="${C.skinS}"/>
    <path d="M60 176 C80 168 120 168 140 176 C142 186 136 194 124 196 C108 190 92 190 76 196 C64 194 58 186 60 176Z" fill="${C.scarf}"/>
    <path d="M78 194 C90 188 110 188 122 194" stroke="${C.scarf2}" stroke-width="3" fill="none"/>
    <!-- 耳 -->
    <path d="M56 118 C48 116 48 132 58 138Z" fill="${C.skinS}"/><path d="M146 118 C154 116 154 132 144 138Z" fill="${C.skinS}"/>
    <!-- 顔 -->
    <path d="M58 98 C58 84 76 74 101 74 C126 74 144 84 144 98 L142 130 C138 148 120 166 101 168 C82 166 64 148 60 130Z" fill="${C.skin}" stroke="${C.line}" stroke-width="1.6" stroke-opacity=".55"/>
    <path d="M60 130 C64 148 82 166 101 168 C90 160 72 148 66 130Z" fill="${C.skinS}" opacity=".5"/>
    ${eyes}
    <path d="M100 132 L97 140 L102 140" stroke="${C.skinS}" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${mouth}
    <!-- ほっぺの絆創膏(主人公っぽさ) -->
    <g transform="rotate(-18 126 140)"><rect x="118" y="135" width="16" height="7" rx="3" fill="${ghost ? "#eaf4ff" : "#fff3e0"}" stroke="${ghost ? "#b9d3f5" : "#e7c9a5"}" stroke-width="1"/></g>
    <!-- 前髪(ツンツン・オレンジのメッシュ) -->
    <path d="M56 110 L56 84 L66 100 L68 76 L80 96 L84 72 L94 102 L100 76 L106 102 L116 72 L120 96 L132 76 L136 100 L146 84 L146 110 C152 78 134 56 101 54 C68 56 50 78 56 110Z" fill="${C.hair}"/>
    <path d="M84 72 L90 88 L94 102 L88 90Z M116 72 L119 86 L120 96 L114 86Z" fill="${C.mesh}"/>

    <!-- ゴーグル(おでこ) -->
    <path d="M52 74 C80 60 122 60 150 74 L148 80 C122 68 80 68 54 80Z" fill="#2b2f3a"/>
    <rect x="68" y="58" width="28" height="18" rx="8" fill="${C.gog}" stroke="#2b2f3a" stroke-width="3"/>
    <rect x="106" y="58" width="28" height="18" rx="8" fill="${C.gog}" stroke="#2b2f3a" stroke-width="3"/>
    <path d="M73 62 L82 62" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/><path d="M111 62 L120 62" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
    <!-- カードを構える手 -->
    <g transform="rotate(-12 160 196)">
      <rect x="146" y="150" width="38" height="54" rx="3" fill="#2bd1b4" stroke="#c9a24a" stroke-width="3"/>
      <rect x="152" y="156" width="26" height="24" fill="#0b2a24"/><circle cx="165" cy="168" r="7" fill="#3dff8a" opacity=".85"/>
    </g>
    <path d="M136 214 C140 198 152 190 164 194 C170 200 166 212 156 218 Z" fill="${ghost ? C.jacket : "#2b2f3a"}"/>
    <path d="M150 196 C156 190 166 190 170 196" stroke="${C.skin}" stroke-width="5" stroke-linecap="round" fill="none"/>
  </svg>`;
  }

  function avatarHtml(side, face) {
    const img = side === "you" ? customImg() : "";
    return img ? `<img class="dl-img" src="${img}" alt="" />` : charaSvg({ ghost: side === "opp", face });
  }

  // カットイン: 話すセリフと一緒に、キャラクターが斜めの帯で出てくる(順番に1.7秒ずつ)
  const cutQ = [];
  let cutBusy = false;
  function cutIn(text, side = "you") {
    cutQ.push({ text, side });
    if (!cutBusy) nextCut();
  }
  function nextCut() {
    const c = cutQ.shift();
    let el = document.getElementById("dl-cut");
    if (el) el.remove();
    if (!c) {
      cutBusy = false;
      return;
    }
    cutBusy = true;
    document.body.insertAdjacentHTML("beforeend", `<div class="dl-cut ${c.side}" id="dl-cut"><div class="dl-face">${avatarHtml(c.side, /[!!]/.test(c.text) ? "shout" : "normal")}</div><div class="dl-line">${esc(c.text)}</div></div>`);
    setTimeout(nextCut, Math.max(1700, c.text.length * 120));
  }

  return { start, end, pop, close, cardHtml, fieldHtml, turn, cutIn, avatarHtml, IMG_KEY };
})();

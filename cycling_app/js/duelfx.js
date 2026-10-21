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
    const verdict = !res || res.first ? "DUEL END" : res.win ? "DUEL WIN!" : "DUEL LOSE…";
    const el = overlay(
      `${lanes}
      <div class="df-center">
        <div class="df-title">TURBO DUEL END</div>
        <div class="df-lps">
          <div class="df-lp you"><small>YOU</small><b id="df-lp-end">4,000</b></div>
          ${res && !res.first ? `<div class="df-vs">VS</div><div class="df-lp ghost"><small>GHOST</small><b>${res.win ? "0" : "4,000"}</b></div>` : ""}
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

  return { start, end, pop, close, cardHtml };
})();

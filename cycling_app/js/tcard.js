// カードの見た目(オリジナルのトレーディングカード風)を1か所で作る。
// ガレージのモンスター一覧、デュエルの手札・盤面・演出で同じデザインを使う。
// c: Battle のカード({ kind: monster/spell/trap, name, icon, lv, atk, tuner, synchro, ace, fx, need, text })
// 大きさは入れ物の幅に合わせて伸び縮みする(CSS の cqw)。

const TCard = (() => {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  // ガレージのカードと同じ属性・種族(MonsterArt に書いてあれば使う)
  function extra(c) {
    if (typeof MonsterArt === "undefined") return null;
    const sl = MonsterArt.SLOTS.find((x) => x.id === c.name);
    return sl && sl.card ? sl.card : null;
  }
  function kindOf(c, side) {
    if (c.kind === "spell") return "spell";
    if (c.kind === "trap") return "trap";
    if (c.kind === "attack") return "spell";
    if (c.ace) return "ace";
    if (c.synchro || c.kind === "synchro") return "synchro";
    if (side === "opp") return "opp";
    if (c.tuner) return "tuner";
    if (c.fx || c.need || (c.e && c.e.length)) return "effect";
    return "normal";
  }
  // カード番号と通し番号(名前から決まる。印字の細部として出す)
  function codes(name) {
    let h = 2166136261;
    for (const ch of String(name)) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
    return { set: "RCD-JP" + String((h % 99) + 1).padStart(3, "0"), serial: String(h % 100000000).padStart(8, "0") };
  }
  // 長い名前は、プレートに収まるように横に詰める(実際のカードの印刷と同じやり方)
  function squeeze(name) {
    let w = 0;
    for (const ch of String(name)) w += /[ -~]/.test(ch) ? 0.56 : ch === "・" ? 0.6 : 1;
    return Math.min(1, 10.4 / w).toFixed(3);
  }
  const STAR = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9.3" fill="url(#tcg)" stroke="#5a3200" stroke-width=".8"/><path d="M10 3.4l1.9 4.3 4.7.4-3.6 3.1 1.1 4.6L10 13.3 5.9 15.8 7 11.2 3.4 8.1l4.7-.4z" fill="#fff3b0" stroke="#7a4a00" stroke-width=".5"/></svg>`;
  // グラデーションの定義は、ページに1つだけ置く
  function defs() {
    if (typeof document === "undefined" || document.getElementById("tc-defs")) return;
    document.body.insertAdjacentHTML("beforeend", `<svg id="tc-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="tcg" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffe680"/><stop offset=".55" stop-color="#f0a010"/><stop offset="1" stop-color="#a85a00"/></radialGradient></defs></svg>`);
  }
  // o: { artExtra(絵の窓に重ねるHTML), art(絵を差し替えるHTML), name(表示名) }
  function html(c, side, o = {}) {
    defs();
    const k = o.kind || kindOf(c, side);
    const ex = extra(c);
    const mon = k !== "spell" && k !== "trap";
    const attr = c.attr || (k === "spell" ? "魔" : k === "trap" ? "罠" : (ex && ex.attr) || (side === "opp" ? "闇" : "風"));
    const type = c.type || (k === "spell" ? (c.fx === "destiny" ? "運命のカード" : `スピード・スペル${c.cost ? "/SPC" + c.cost : ""}`) : k === "trap" ? "罠カード" : (ex && ex.type) || (c.tuner ? "チューナー" : c.synchro ? "シンクロ" : "モンスター"));
    const text = (ex && ex.text) || c.text || "";
    const hasArt = mon && typeof MonsterArt !== "undefined" && MonsterArt.src(c, side);
    const art = o.art || (hasArt ? MonsterArt.icon(c, side) : `<span class="tc-crest">${c.icon || "❔"}</span>`);
    const cd = codes(c.name);
    const lv = mon && c.lv ? Math.min(12, c.lv) : 0;
    return `<div class="tc tc-${k}">
      <div class="tc-top"><b><span style="transform:scaleX(${squeeze(o.name || c.name)})">${esc(o.name || c.name)}</span></b><i class="tc-attr"><em>${attr}</em></i></div>
      <div class="tc-stars">${STAR.repeat(lv)}</div>
      <div class="tc-art">${art}<i class="tc-foil"></i>${o.artExtra || ""}</div>
      <div class="tc-code"><span>${cd.set}</span></div>
      <div class="tc-box"><small>【${esc(type)}】</small><p>${esc(text)}</p>${mon && c.atk != null ? `<div class="tc-atk"><span>ATK/</span><b>${c.atk}</b></div>` : `<div class="tc-atk none"></div>`}</div>
      <div class="tc-foot"><span>${cd.serial}</span><span>©RIDE CALORIE DUEL</span><i class="tc-holo"></i></div>
    </div>`;
  }
  return { html, kindOf };
})();

if (typeof module !== "undefined") module.exports = TCard;

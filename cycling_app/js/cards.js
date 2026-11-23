// カード図鑑: 10,000枚のカードを探して見る。テーマを選ぶと、そのテーマのデッキ(40枚)でデュエルできる。
// 選んだデッキは、この端末にだけ保存する(localStorage の duel_deck)。
(() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ALL = CardGen.all, THEMES = CardGen.themes;
  const PAGE = 60;
  const RV = { N: 0, R: 1, SR: 2, UR: 3 };
  // 効果で絞るための区分
  const FX = [["draw", "ドロー"], ["burn", "ダメージ"], ["heal", "回復"], ["destroy snipe sweep killAtk", "破壊"], ["weaken weakenAll drainAtk", "弱らせる"], ["boost boostAll aura themeUp rage spcUp grow guardUp wall", "攻撃力アップ"],
    ["call revive", "特殊召喚"], ["search setTrap", "デッキから持ってくる"], ["spc charge", "SPC"], ["bounce bounceAtk discard", "手札に戻す・捨てさせる"], ["negateAtk reflectDmg counter", "無効にする"], ["guard twin sneak drain", "戦闘の特別な力"], ["chainBurn", "チェーン"]];
  let shown = PAGE, list = [];

  const getDeck = () => {
    try {
      return localStorage.getItem("duel_deck") || "";
    } catch (e) {
      return "";
    }
  };
  function setDeck(id) {
    try {
      id ? localStorage.setItem("duel_deck", id) : localStorage.removeItem("duel_deck");
    } catch (e) {}
    renderDeck();
  }
  function deckList(keys) {
    const n = new Map();
    for (const k of keys) n.set(k, (n.get(k) || 0) + 1);
    const cards = [...n.keys()].map((k) => Battle.cardOf(k));
    const part = (kind, label) => {
      const cs = cards.filter((c) => c.kind === kind);
      return `<div><b>${label} ${cs.reduce((a, c) => a + n.get(c.key), 0)}枚</b>: ${cs.map((c) => `<span>${c.icon} ${esc(c.name)}×${n.get(c.key)}</span>`).join("")}</div>`;
    };
    return part("monster", "モンスター") + part("spell", "スペル") + part("trap", "罠");
  }
  function renderDeck() {
    const id = getDeck(), th = THEMES.find((t) => t.id === id);
    const sel = $("cd-th").value, pick = THEMES.find((t) => t.id === sel);
    const d = Battle.myDeck();
    $("cd-deck").innerHTML = `<h2>いま使っているデッキ: ${th ? `${th.icon}「${esc(th.name)}」` : "⚡ スピード・ロード(はじめのデッキ)"}</h2>
      <p>${th ? esc(CardGen.FOCUS_JA[th.focus]) : "シンクロ召喚と罠でバランスよく戦う"}。40枚 + シンクロ ${d.extra.length}体。次のライドから使います。</p>
      <div class="cd-btns">
        ${pick && pick.id !== id ? `<button type="button" class="on" data-use="${pick.id}">${pick.icon}「${esc(pick.name)}」デッキを使う</button>` : ""}
        ${th ? `<button type="button" data-use="">はじめのデッキに戻す</button>` : ""}
        <button type="button" id="cd-show">デッキの中身を見る</button>
      </div>
      <div class="cd-decklist" id="cd-decklist" hidden>${deckList(d.keys)}<div><b>シンクロ</b>: ${d.extra.map((c) => `<span>${c.icon} ${esc(c.name)}(Lv${c.lv})</span>`).join("")}</div></div>
      ${pick ? `<p>「${esc(pick.name)}」: ${esc(CardGen.FOCUS_JA[pick.focus])}(${pick.attr}属性・250枚)</p>` : `<p>テーマを選ぶと、そのテーマのデッキに替えられます。ライバルも、これらのテーマのデッキを使ってきます。</p>`}`;
  }

  function apply() {
    const q = $("cd-q").value.trim(), th = $("cd-th").value, kind = $("cd-kind").value, rar = $("cd-rar").value, fx = $("cd-fx").value.split(" ").filter(Boolean), sort = $("cd-sort").value;
    list = ALL.filter((c) => {
      if (th && c.th !== th) return false;
      if (rar && c.rar !== rar) return false;
      if (kind === "tuner" ? !c.tuner : kind === "synchro" ? !c.synchro : kind === "monster" ? c.kind !== "monster" || c.synchro : kind && c.kind !== kind) return false;
      if (fx.length && !c.e.some((e) => fx.includes(e.do))) return false;
      if (q && !(c.name.includes(q) || c.text.includes(q))) return false;
      return true;
    });
    if (sort === "atk") list.sort((a, b) => (b.atk || -1) - (a.atk || -1));
    else if (sort === "lv") list.sort((a, b) => (b.lv || 0) - (a.lv || 0) || (b.atk || 0) - (a.atk || 0));
    else if (sort === "rar") list.sort((a, b) => RV[b.rar] - RV[a.rar] || a.no - b.no);
    shown = PAGE;
    render();
    renderDeck();
  }
  const cell = (c) => `<div class="cd-card" data-key="${c.key}"><i class="cd-rar ${c.rar}">${c.rar}</i>${TCard.html(c, "you")}<small class="cd-no">No.${String(c.no).padStart(5, "0")}</small></div>`;
  function render() {
    $("cd-count").textContent = `${list.length.toLocaleString()}枚 見つかりました(${Math.min(shown, list.length)}枚を表示)`;
    $("cd-grid").innerHTML = list.slice(0, shown).map(cell).join("");
    $("cd-more").hidden = shown >= list.length;
  }
  function open(key) {
    const c = CardGen.byKey[key];
    if (!c) return;
    const th = THEMES.find((t) => t.id === c.th);
    const inDeck = Battle.myDeck().keys.filter((k) => k === key).length;
    $("cd-modal").innerHTML = `<div class="cd-box"><div class="cd-big">${TCard.html(c, "you")}</div>
      <div class="cd-info"><b>${esc(c.name)}</b> <small>No.${String(c.no).padStart(5, "0")}・${c.rar}・テーマ「${esc(th.name)}」</small><br>
        ${c.kind === "monster" ? `Lv${c.lv}・ATK ${c.atk}・${esc(c.type)}<br>` : c.kind === "spell" ? `スピード・スペル(SPCが${c.cost}以上で使える)<br>` : "罠カード(伏せておき、相手の行動に割り込む)<br>"}
        ${esc(c.text)}${inDeck ? `<br><small>いまのデッキに ${inDeck}枚 入っています</small>` : ""}</div>
      <div class="cd-btns"><button type="button" data-th="${c.th}">「${esc(th.name)}」のカードを見る</button><button type="button" class="go" data-close>閉じる</button></div></div>`;
    $("cd-modal").hidden = false;
  }

  $("cd-total").textContent = `全 ${ALL.length.toLocaleString()}枚・${THEMES.length}テーマ`;
  $("cd-th").innerHTML = `<option value="">テーマ: すべて</option>` + THEMES.map((t) => `<option value="${t.id}">${t.icon} ${esc(t.name)}(${esc(CardGen.FOCUS_JA[t.focus])})</option>`).join("");
  $("cd-fx").innerHTML = `<option value="">効果: すべて</option>` + FX.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
  $("cd-th").value = getDeck();
  for (const id of ["cd-th", "cd-kind", "cd-rar", "cd-fx", "cd-sort"]) $(id).addEventListener("change", apply);
  let qt = 0;
  $("cd-q").addEventListener("input", () => (clearTimeout(qt), (qt = setTimeout(apply, 200))));
  $("cd-more").addEventListener("click", () => ((shown += PAGE), render()));
  $("cd-grid").addEventListener("click", (e) => {
    const el = e.target.closest(".cd-card");
    if (el) open(el.dataset.key);
  });
  $("cd-modal").addEventListener("click", (e) => {
    const t = e.target.closest("[data-th]");
    if (t) ($("cd-th").value = t.dataset.th), apply();
    if (t || e.target === $("cd-modal") || e.target.closest("[data-close]")) $("cd-modal").hidden = true;
  });
  $("cd-deck").addEventListener("click", (e) => {
    const u = e.target.closest("[data-use]");
    if (u) return setDeck(u.dataset.use);
    if (e.target.id === "cd-show") $("cd-decklist").hidden = !$("cd-decklist").hidden;
  });
  apply();
})();

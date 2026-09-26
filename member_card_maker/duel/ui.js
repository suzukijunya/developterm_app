// デュエル画面:盤面の描画、クリック操作、演出(カットイン・攻撃・ダメージ)、効果音。
// ルールは engine.js、CPU の判断は cpu.js。

(() => {
  const $ = (id) => document.getElementById(id);
  const STORE_KEY = "member_cards_v1"; // トレカメーカーの保存データ(同じサイトなので共有できる)
  const SOUND_KEY = "duel_sound_v1";
  const ME = 0;
  const CPU = 1;
  const E = DuelEngine;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const narrow = () => window.matchMedia("(max-width: 900px), (max-aspect-ratio: 1/1)").matches;

  let pool = [];
  let poolSource = "";
  let g = null;
  const images = new Map(); // card.id → 画像(data URL)
  const lpShown = [E.START_LP, E.START_LP];
  let targeting = null; // 攻撃対象を選んでいる最中 { zone }

  // ---------------- カードの準備 ----------------

  function loadPool() {
    let list = [];
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (Array.isArray(raw)) list = raw.map(CardFormat.normalize);
    } catch (e) {
      list = [];
    }
    poolSource = list.length ? "トレカメーカーで作ったカード" : "見本カード";
    if (!list.length) list = SAMPLE_CARDS.map(CardFormat.normalize);
    setPool(list);
  }

  function setPool(list) {
    // モンスターがいないとデュエルにならないので、見本のモンスターを足す
    if (!list.some((c) => CardFormat.isMonster(c))) list = list.concat(SAMPLE_CARDS.map(CardFormat.normalize).filter((c) => CardFormat.isMonster(c)));
    pool = list;
    const count = (f) => pool.filter(f).length;
    $("deckInfo").textContent = `${poolSource} ${pool.length}種類(モンスター${count((c) => CardFormat.isMonster(c))}・魔法${count((c) => c.cardType === "spell")}・罠${count(
      (c) => c.cardType === "trap"
    )})でデッキを作ります`;
  }

  async function prepareImages(cards) {
    await CardRenderer.loadFonts();
    const todo = [...new Map(cards.map((c) => [c.id, c])).values()].filter((c) => !images.has(c.id));
    let done = 0;
    for (const card of todo) {
      $("loadingCount").textContent = `${done}/${todo.length}`;
      const imgs = {
        art: await CardRenderer.loadImage(card.art.image),
        attribute: card.attribute === "custom" ? await CardRenderer.loadImage(card.customAttribute.image) : null,
      };
      const canvas = document.createElement("canvas");
      CardRenderer.render(canvas, card, imgs, 0.5);
      images.set(card.id, canvas.toDataURL("image/png"));
      done++;
      await sleep(0); // 画面が固まらないように
    }
  }

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  }

  // ---------------- 効果音(WebAudio で合成) ----------------

  let soundOn = true;
  try {
    soundOn = localStorage.getItem(SOUND_KEY) !== "off";
  } catch (e) {
    soundOn = true;
  }
  let actx = null;

  function audio() {
    if (!soundOn) return null;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      return actx;
    } catch (e) {
      return null;
    }
  }

  function tone(ctx, freq, start, dur, { type = "sine", vol = 0.12, to } = {}) {
    const o = ctx.createOscillator();
    const gain = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime + start);
    if (to) o.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + start + dur);
    gain.gain.setValueAtTime(vol, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
    o.connect(gain).connect(ctx.destination);
    o.start(ctx.currentTime + start);
    o.stop(ctx.currentTime + start + dur + 0.02);
  }

  function noise(ctx, start, dur, { vol = 0.15, freq = 1200, type = "lowpass" } = {}) {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    src.connect(f).connect(gain).connect(ctx.destination);
    src.start(ctx.currentTime + start);
  }

  function sfx(kind) {
    const ctx = audio();
    if (!ctx) return;
    switch (kind) {
      case "draw":
        tone(ctx, 700, 0, 0.08, { type: "triangle", to: 1200, vol: 0.06 });
        break;
      case "summon":
        [440, 660, 880].forEach((f, i) => tone(ctx, f, i * 0.06, 0.25, { type: "triangle", vol: 0.1 }));
        noise(ctx, 0, 0.3, { vol: 0.08, freq: 3000, type: "highpass" });
        break;
      case "set":
        tone(ctx, 260, 0, 0.12, { type: "square", vol: 0.05 });
        break;
      case "activate":
        [784, 1175, 1568].forEach((f, i) => tone(ctx, f, i * 0.07, 0.5, { vol: 0.09 }));
        break;
      case "attack":
        noise(ctx, 0, 0.35, { vol: 0.2, freq: 1800, type: "bandpass" });
        tone(ctx, 300, 0, 0.3, { type: "sawtooth", to: 900, vol: 0.05 });
        break;
      case "damage":
        tone(ctx, 140, 0, 0.35, { type: "square", to: 50, vol: 0.12 });
        noise(ctx, 0, 0.3, { vol: 0.2, freq: 500 });
        break;
      case "destroy":
        noise(ctx, 0, 0.5, { vol: 0.22, freq: 2200 });
        tone(ctx, 500, 0, 0.4, { type: "sawtooth", to: 80, vol: 0.05 });
        break;
      case "heal":
        [523, 659, 784].forEach((f, i) => tone(ctx, f, i * 0.08, 0.3, { vol: 0.08 }));
        break;
      case "win":
        [523, 659, 784, 1047].forEach((f, i) => tone(ctx, f, i * 0.15, 0.5, { type: "triangle", vol: 0.12 }));
        break;
      case "lose":
        [392, 330, 262, 196].forEach((f, i) => tone(ctx, f, i * 0.2, 0.5, { type: "triangle", vol: 0.1 }));
        break;
      case "turn":
        tone(ctx, 440, 0, 0.15, { type: "triangle", vol: 0.08 });
        tone(ctx, 880, 0.12, 0.25, { type: "triangle", vol: 0.08 });
        break;
    }
  }

  // ---------------- 画面の描画 ----------------

  function findInst(uid) {
    for (const P of g.players) {
      for (const list of [P.hand, P.grave, P.deck]) {
        const hit = list.find((c) => c.uid === uid);
        if (hit) return hit;
      }
      for (const s of P.monsters.concat(P.spells)) if (s && s.inst.uid === uid) return s.inst;
    }
    return null;
  }

  function findEl(uid) {
    return document.querySelector(`#duel [data-uid="${uid}"]`);
  }

  function cardNode(inst, ctx = {}) {
    const el = document.createElement("div");
    el.className = "card";
    if (inst) el.dataset.uid = inst.uid;
    const faceUp = ctx.faceUp !== false;
    if (faceUp && inst) {
      const img = document.createElement("img");
      img.src = images.get(inst.card.id) || "";
      img.alt = inst.card.name;
      el.appendChild(img);
    } else {
      el.classList.add("back");
    }
    if (ctx.def) el.classList.add("def");
    if (ctx.badge) {
      const b = document.createElement("span");
      b.className = "atk-badge " + (ctx.badge.cls || "");
      b.textContent = ctx.badge.text;
      el.appendChild(b);
    }
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onCardClick(el, inst, ctx);
    });
    el.addEventListener("mouseenter", () => {
      if (inst && (faceUp || ctx.side === ME)) showDetail(inst, ctx);
    });
    return el;
  }

  function renderZones(rowEl, side, row) {
    rowEl.innerHTML = "";
    const P = g.players[side];
    const slots = row === "monster" ? P.monsters : P.spells;
    const order = side === CPU ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4]; // 相手の場は向かい合わせ
    order.forEach((zone) => {
      const z = document.createElement("div");
      z.className = "zone" + (row === "spell" ? " spell" : "");
      const s = slots[zone];
      if (s) {
        const ctx = { side, row, zone, faceUp: s.faceUp || false };
        if (row === "monster") {
          ctx.def = s.position === "def";
          if (s.faceUp) {
            const atk = g.atkOf(side, zone);
            ctx.badge = s.position === "atk" ? { text: String(atk), cls: atk > s.inst.baseAtk ? "up" : atk < s.inst.baseAtk ? "down" : "" } : { text: "DEF " + s.inst.baseDef };
          }
        }
        const el = cardNode(s.inst, ctx);
        if (side === ME && g.fieldActions(ME, row, zone).length) el.classList.add("can-act");
        if (targeting && side === CPU && row === "monster") el.classList.add("targetable");
        z.appendChild(el);
      }
      rowEl.appendChild(z);
    });
  }

  function renderPile(el, side, kind) {
    const P = g.players[side];
    el.innerHTML = "";
    const list = kind === "deck" ? P.deck : P.grave;
    if (!list.length) {
      el.innerHTML = `<span class="label">${kind === "deck" ? "デッキ" : "墓地"}</span>`;
    } else {
      const top = kind === "deck" ? cardNode(null, { faceUp: false }) : cardNode(list[list.length - 1], { side, row: "grave" });
      el.appendChild(top);
    }
    const c = document.createElement("span");
    c.className = "count";
    c.textContent = list.length;
    el.appendChild(c);
  }

  function renderHand() {
    const my = $("myHand");
    my.innerHTML = "";
    g.players[ME].hand.forEach((inst, i) => {
      const el = cardNode(inst, { side: ME, hand: i });
      if (g.handActions(ME, i).length) el.classList.add("can-act");
      my.appendChild(el);
    });
    const opp = $("oppHand");
    opp.innerHTML = "";
    g.players[CPU].hand.forEach((inst) => opp.appendChild(cardNode(inst, { side: CPU, faceUp: false, hand: -1 })));
  }

  const PHASE_NAMES = { draw: "ドローフェイズ", main1: "メインフェイズ1", battle: "バトルフェイズ", main2: "メインフェイズ2", end: "エンドフェイズ" };

  function render() {
    if (!g) return;
    renderZones($("oppSpells"), CPU, "spell");
    renderZones($("oppMonsters"), CPU, "monster");
    renderZones($("myMonsters"), ME, "monster");
    renderZones($("mySpells"), ME, "spell");
    renderPile($("oppDeck"), CPU, "deck");
    renderPile($("oppGrave"), CPU, "grave");
    renderPile($("myDeck"), ME, "deck");
    renderPile($("myGrave"), ME, "grave");
    renderHand();
    [
      [ME, "myLp"],
      [CPU, "oppLp"],
    ].forEach(([p, id]) => {
      $(id).querySelector(".lp-num").textContent = lpShown[p];
      $(id).querySelector(".lp-bar i").style.width = Math.min(100, (g.players[p].lp / E.START_LP) * 100) + "%";
    });
    document.querySelectorAll("#phases li").forEach((li) => li.classList.toggle("on", li.dataset.phase === g.phase));
    $("phases").classList.toggle("opp-turn", g.current === CPU);
    $("phaseLabel").textContent = `ターン${g.turn} ${g.current === ME ? "あなた" : "ライバル"}の${PHASE_NAMES[g.phase] || ""}`;
    const mine = g.myTurn(ME);
    $("btnBattle").disabled = !(mine && g.phase === "main1" && g.turn > 1);
    $("btnMain2").disabled = !(mine && g.phase === "battle");
    $("btnEnd").disabled = !(mine && ["main1", "battle", "main2"].includes(g.phase));
  }

  function showDetail(inst, ctx = {}) {
    const card = inst.card;
    $("detailHint").hidden = true;
    $("detailImg").src = images.get(card.id) || "";
    $("detailName").textContent = card.name;
    $("detailType").textContent = CardFormat.typeLabel(card) + (inst.isMonster ? `  ★${inst.level}  ${CardFormat.typeLine(card)}` : "");
    let stats = "";
    if (inst.isMonster) {
      stats = `ATK ${inst.baseAtk} / DEF ${inst.baseDef}`;
      if (ctx.row === "monster" && ctx.side !== undefined && g.players[ctx.side].monsters[ctx.zone]) {
        const atk = g.atkOf(ctx.side, ctx.zone);
        if (atk !== inst.baseAtk) stats += `(現在の攻撃力 ${atk})`;
      }
      if (inst.isMonster && g.tributesNeeded(inst)) stats += `  生け贄${g.tributesNeeded(inst)}体`;
    }
    $("detailStats").textContent = stats;
    $("detailEffect").textContent = inst.eff.text;
    $("detailText").textContent = card.effect || "(テキストなし)";
  }

  function log(text) {
    const li = document.createElement("li");
    li.textContent = text;
    $("log").prepend(li);
    while ($("log").children.length > 80) $("log").lastChild.remove();
  }

  // ---------------- 操作 ----------------

  function closeMenu() {
    $("menu").hidden = true;
    document.querySelectorAll(".card.selected").forEach((c) => c.classList.remove("selected"));
  }

  function openMenu(el, acts, ctx) {
    const menu = $("menu");
    menu.innerHTML = "";
    acts.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = a.label;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        closeMenu();
        $("detail").classList.remove("open");
        doAction(a.action, ctx);
      });
      menu.appendChild(b);
    });
    menu.hidden = false;
    el.classList.add("selected");
    const r = el.getBoundingClientRect();
    const mw = menu.offsetWidth;
    const mh = menu.offsetHeight;
    let left = r.left + r.width / 2 - mw / 2;
    let top = r.top - mh - 8;
    if (top < 8) top = r.bottom + 8;
    left = Math.max(8, Math.min(window.innerWidth - mw - 8, left));
    top = Math.max(8, Math.min(window.innerHeight - mh - 8, top));
    menu.style.left = left + "px";
    menu.style.top = top + "px";
  }

  function onCardClick(el, inst, ctx) {
    if (targeting) {
      if (ctx.side === CPU && ctx.row === "monster") {
        const from = targeting.zone;
        endTargeting();
        g.act(() => g.attack(ME, from, ctx.zone));
      }
      return;
    }
    closeMenu();
    if (!inst) return;
    if (ctx.row === "grave") return viewCards(`${g.players[ctx.side].name}の墓地`, g.players[ctx.side].grave.slice().reverse());
    if (ctx.faceUp !== false || ctx.side === ME) {
      showDetail(inst, ctx);
      if (narrow()) $("detail").classList.add("open");
    }
    if (ctx.side !== ME || !g) return;
    const acts = ctx.hand !== undefined && ctx.hand >= 0 ? g.handActions(ME, ctx.hand) : ctx.row === "monster" || ctx.row === "spell" ? g.fieldActions(ME, ctx.row, ctx.zone) : [];
    if (acts.length) openMenu(el, acts, ctx);
  }

  function doAction(action, ctx) {
    switch (action) {
      case "summon":
      case "set":
      case "compromise":
        return g.act(() => g.normalSummon(ME, ctx.hand, action === "set", action === "compromise"));
      case "activate":
        return g.act(() => g.activate(ME, { handIndex: ctx.hand }));
      case "setST":
        return g.act(() => g.setSpellTrap(ME, ctx.hand));
      case "activateSet":
        return g.act(() => g.activate(ME, { zone: ctx.zone }));
      case "position":
        return g.act(() => g.changePosition(ME, ctx.zone));
      case "attack":
        return startTargeting(ctx.zone);
    }
  }

  function startTargeting(zone) {
    const hasTargets = g.players[CPU].monsters.some(Boolean);
    if (!hasTargets) return g.act(() => g.attack(ME, zone, null));
    targeting = { zone };
    $("targetText").textContent = "攻撃するモンスターを選んでください";
    $("btnDirect").hidden = true;
    $("targetBar").hidden = false;
    render();
  }

  function endTargeting() {
    targeting = null;
    $("targetBar").hidden = true;
    render();
  }

  // ---------------- 選択ダイアログ ----------------

  // engine からの選択要求 → 選んだ id の配列
  function choose(req) {
    return new Promise((resolve) => {
      const picked = new Set();
      const single = req.max === 1 && req.type !== "respond";
      $("modalTitle").textContent = req.title;
      $("modalSub").textContent = contextText(req);
      const box = $("modalCards");
      box.innerHTML = "";
      req.options.forEach((opt) => {
        const wrap = document.createElement("div");
        wrap.className = "opt";
        const hidden = isHidden(opt, req);
        const el = cardNode(opt.inst, { faceUp: !hidden, side: opt.side });
        el.addEventListener("click", () => {
          if (req.type === "respond") return finish([opt.id]);
          if (single) return finish([opt.id]);
          if (picked.has(opt.id)) picked.delete(opt.id);
          else if (picked.size < req.max) picked.add(opt.id);
          el.classList.toggle("selected", picked.has(opt.id));
          $("modalOk").disabled = picked.size < req.min || picked.size > req.max;
        });
        const label = document.createElement("span");
        label.textContent = hidden ? opt.label : opt.inst.card.name;
        wrap.append(el, label);
        box.appendChild(wrap);
      });
      const ok = $("modalOk");
      const cancel = $("modalCancel");
      ok.hidden = single || req.type === "respond";
      ok.disabled = true;
      ok.textContent = "決定";
      const cancelLabel = req.type === "respond" ? "発動しない" : req.type === "tribute" ? "やめる" : req.min === 0 ? "しない" : "";
      cancel.hidden = !cancelLabel;
      cancel.textContent = cancelLabel;
      $("modal").hidden = false;
      function finish(ids) {
        $("modal").hidden = true;
        ok.onclick = null;
        cancel.onclick = null;
        resolve(ids);
      }
      ok.onclick = () => finish([...picked]);
      cancel.onclick = () => finish([]);
      if (req.type === "respond") sfx("turn");
    });
  }

  function isHidden(opt, req) {
    if (opt.side === undefined || opt.zone === undefined) return false;
    const P = g.players[opt.side];
    const s = req.purpose === "destroyEnemyST" ? P.spells[opt.zone] : P.monsters[opt.zone];
    return opt.side === CPU && s && !s.faceUp;
  }

  function contextText(req) {
    const ctx = req.context;
    if (!ctx) return req.type === "respond" ? "" : "";
    if (req.purpose === "attack") {
      const atk = findInst(g.players[ctx.attacker].monsters[ctx.attackerZone] ? g.players[ctx.attacker].monsters[ctx.attackerZone].inst.uid : "");
      const name = atk ? atk.card.name : "モンスター";
      return ctx.direct ? `「${name}」がダイレクトアタックしてきます(攻撃力 ${g.atkOf(ctx.attacker, ctx.attackerZone)})` : `「${name}」が攻撃してきます(攻撃力 ${g.atkOf(ctx.attacker, ctx.attackerZone)})`;
    }
    if (req.purpose === "spell") return `相手の魔法「${ctx.spell.card.name}」: ${ctx.spell.eff.text}`;
    return "";
  }

  function viewCards(title, insts) {
    $("modalTitle").textContent = title;
    $("modalSub").textContent = `${insts.length}枚`;
    const box = $("modalCards");
    box.innerHTML = "";
    insts.forEach((inst) => {
      const wrap = document.createElement("div");
      wrap.className = "opt";
      const el = cardNode(inst, {});
      el.addEventListener("click", () => showDetail(inst));
      const label = document.createElement("span");
      label.textContent = inst.card.name;
      wrap.append(el, label);
      box.appendChild(wrap);
    });
    $("modalOk").hidden = true;
    $("modalCancel").hidden = false;
    $("modalCancel").textContent = "閉じる";
    $("modalCancel").onclick = () => ($("modal").hidden = true);
    $("modal").hidden = false;
  }

  // ---------------- 演出 ----------------

  async function banner(text, { opp = false, small = false, ms = 1100 } = {}) {
    const b = $("banner");
    b.textContent = text;
    b.className = "banner" + (opp ? " opp" : "") + (small ? " small" : "");
    b.hidden = false;
    b.style.animation = "none";
    void b.offsetWidth;
    b.style.animation = "";
    await sleep(ms);
    b.hidden = true;
  }

  function animateClass(el, cls, ms) {
    if (!el) return sleep(0);
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    return sleep(ms);
  }

  async function cutin(inst, p, text) {
    const c = $("cutin");
    $("cutinImg").src = images.get(inst.card.id) || "";
    $("cutinName").textContent = inst.card.name;
    $("cutinEffect").textContent = text;
    c.classList.toggle("opp", p === CPU);
    c.hidden = false;
    await Promise.race([sleep(1400), new Promise((r) => (c.onclick = r))]);
    c.onclick = null;
    c.hidden = true;
  }

  function floatNumber(p, text, cls) {
    const panel = $(p === ME ? "myLp" : "oppLp");
    const r = panel.getBoundingClientRect();
    const n = document.createElement("div");
    n.className = "float-num " + cls;
    n.textContent = text;
    n.style.left = r.left + r.width / 2 - 40 + "px";
    n.style.top = r.top + (p === ME ? -20 : r.height) + "px";
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 1100);
  }

  function animateLp(p, to) {
    const from = lpShown[p];
    const start = performance.now();
    const el = $(p === ME ? "myLp" : "oppLp").querySelector(".lp-num");
    return new Promise((resolve) => {
      function step(now) {
        const t = Math.min(1, (now - start) / 600);
        lpShown[p] = Math.round(from + (to - from) * t);
        el.textContent = lpShown[p];
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  async function attackAnim(d) {
    const a = findEl(d.uid);
    const t = d.targetUid ? findEl(d.targetUid) : $(d.p === ME ? "oppLp" : "myLp");
    sfx("attack");
    if (!a || !t) return sleep(400);
    const ra = a.getBoundingClientRect();
    const rt = t.getBoundingClientRect();
    const dx = (rt.left + rt.width / 2 - (ra.left + ra.width / 2)) * 0.85;
    const dy = (rt.top + rt.height / 2 - (ra.top + ra.height / 2)) * 0.85;
    a.style.zIndex = 20;
    const anim = a.animate(
      [{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(1.15)`, offset: 0.55 }, { transform: "none" }],
      { duration: 560, easing: "cubic-bezier(.5,0,.2,1)" }
    );
    await anim.finished.catch(() => {});
    a.style.zIndex = "";
  }

  // engine からの通知
  async function onEvent(type, d) {
    switch (type) {
      case "start":
        render();
        await banner("DUEL START!", { ms: 1200 });
        await banner(d.first === ME ? "あなたの先攻" : "ライバルの先攻", { small: true, opp: d.first === CPU, ms: 1000 });
        break;
      case "draw":
        if (d.silent) break;
        render();
        if (d.p === ME) {
          sfx("draw");
          await animateClass(findEl(d.uid), "anim-summon", 300);
        }
        break;
      case "turn":
        render();
        sfx("turn");
        await banner(d.current === ME ? "YOUR TURN" : "RIVAL TURN", { opp: d.current === CPU, ms: 1000 });
        break;
      case "phase":
        render();
        if (d.phase === "battle") await banner("BATTLE PHASE", { small: true, opp: g.current === CPU, ms: 800 });
        break;
      case "summon":
      case "flip":
        render();
        sfx("summon");
        await animateClass(findEl(d.uid), "anim-summon", 550);
        break;
      case "set":
        render();
        sfx("set");
        await animateClass(findEl(d.uid), "anim-summon", 350);
        break;
      case "position":
        render();
        await sleep(250);
        break;
      case "tribute":
        await animateClass(findEl(d.uid), "anim-destroy", 450);
        break;
      case "activate": {
        render();
        const inst = findInst(d.uid);
        sfx("activate");
        animateClass(findEl(d.uid), "anim-activate", 0);
        if (inst) await cutin(inst, d.p, d.text);
        break;
      }
      case "attack":
        render();
        await attackAnim(d);
        break;
      case "damage":
        sfx("damage");
        floatNumber(d.p, "-" + d.amount, "dmg");
        $("duel").classList.remove("shake");
        void $("duel").offsetWidth;
        $("duel").classList.add("shake");
        await animateLp(d.p, d.lp);
        render();
        break;
      case "heal":
        sfx("heal");
        floatNumber(d.p, "+" + d.amount, "heal");
        await animateLp(d.p, d.lp);
        render();
        break;
      case "destroy":
        sfx("destroy");
        await animateClass(findEl(d.uid), "anim-destroy", 480);
        break;
      case "log":
        log(d.text);
        break;
      case "update":
        render();
        break;
      case "win":
        render();
        await sleep(700);
        showResult(d);
        break;
    }
  }

  function showResult(d) {
    const win = d.winner === ME;
    sfx(win ? "win" : "lose");
    $("result").className = "result " + (win ? "win" : "lose");
    $("resultTitle").textContent = win ? "WIN" : "LOSE";
    $("resultReason").textContent = (win ? "ライバルの" : "あなたの") + d.reason;
    $("result").hidden = false;
  }

  // ---------------- 開始 ----------------

  async function startDuel() {
    $("result").hidden = true;
    show("loading");
    const decks = [E.buildDeck(pool), E.buildDeck(pool)];
    await prepareImages(pool);
    show("duel");
    $("log").innerHTML = "";
    lpShown[0] = lpShown[1] = E.START_LP;
    targeting = null;
    g = new E.Duel({ decks, names: ["あなた", "ライバル"], cpu: [false, true], io: { event: onEvent, choose }, ai: DuelCPU });
    render();
    const first = Math.random() < 0.5 ? ME : CPU;
    await g.act(() => g.start(first));
  }

  function init() {
    loadPool();
    $("btnSound").textContent = soundOn ? "🔊" : "🔇";
    $("btnStart").addEventListener("click", () => {
      audio();
      startDuel();
    });
    $("btnAgain").addEventListener("click", startDuel);
    $("btnToTitle").addEventListener("click", () => {
      $("result").hidden = true;
      g = null;
      show("title");
    });
    $("deckFile").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        const list = (Array.isArray(data) ? data : data.cards || []).map(CardFormat.normalize);
        if (!list.length) throw new Error("カードがありません");
        poolSource = `「${file.name}」のカード`;
        setPool(list);
      } catch (err) {
        $("deckInfo").textContent = "読み込めませんでした: " + err.message;
      }
      e.target.value = "";
    });
    $("btnBattle").addEventListener("click", () => g && g.act(() => g.toBattle()));
    $("btnMain2").addEventListener("click", () => g && g.act(() => g.toMain2()));
    $("btnEnd").addEventListener("click", () => {
      if (!g) return;
      closeMenu();
      if (targeting) endTargeting();
      g.act(() => g.endTurn());
    });
    $("btnSound").addEventListener("click", () => {
      soundOn = !soundOn;
      $("btnSound").textContent = soundOn ? "🔊" : "🔇";
      try {
        localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
      } catch (e) {
        // 保存できなくても切り替えは効く
      }
    });
    $("btnTargetCancel").addEventListener("click", endTargeting);
    $("detailClose").addEventListener("click", () => $("detail").classList.remove("open"));
    document.addEventListener("click", (e) => {
      if (!$("menu").contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
        if (targeting) endTargeting();
      }
    });
  }

  init();
})();

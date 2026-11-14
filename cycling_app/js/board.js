// デュエルの盤面を、ゲームの画面のように1手ずつ動かして見せる。
// 奥に相手・手前に自分のフィールド(モンスターゾーン3つ・魔法罠ゾーン4つ・デッキ・墓地)。
// 左上に相手、右下に自分の顔とLP。右上にターンとフェイズ。手札は下に並ぶ。
// ドロー → 召喚(手札からゾーンへ飛ぶ)→ 魔法 → 伏せ → チェーン(伏せカードがめくれる)→ 攻撃(突っ込んでLPが減る)…を順に再生する。
// しゃべる内容はギザギザの吹き出しで。シンクロやエースの召喚は、漫画風のカットイン(ドドドド)と口上。
// Battle.step の返り値(ev.before = ターン前の盤面, ev.steps = 起きたこと)から組み立てる。

const Board = (() => {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pool = () => (typeof Battle !== "undefined" ? Battle.POOL : {});
  const cardOf = (k) => Object.assign({ key: k }, pool()[k] || { name: "?", icon: "❔", kind: "spell" });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const LP0 = () => (typeof Battle !== "undefined" ? Battle.LP0 : 8000);

  // 召喚の口上(オリジナル)
  const CHANT = {
    "ストリーム・ドラゴン": "風を束ね、道を切り裂け! シンクロ召喚! 走れ、レベル8! ストリーム・ドラゴン!",
    "ソニック・ストリーム・ドラゴン": "限界の先へ、光の速さで駆け抜けろ! 現れろ、レベル10! ソニック・ストリーム・ドラゴン!",
    "ホライズン・ウォリアー": "地平の彼方から、来い! シンクロ召喚! レベル7! ホライズン・ウォリアー!",
  };
  function chant(m, side) {
    if (CHANT[m.name] && side === "you") return CHANT[m.name];
    return side === "you" ? `現れろ! レベル${m.lv}! ${m.name}!` : `闇よりいでよ…レベル${m.lv}、${m.name}!`;
  }

  // ---------- 盤面のHTML ----------
  const faceHtml = (c, cls = "") => `<div class="bc ${c.kind || ""} ${cls}"><i>${c.icon || "❔"}</i><b>${esc(c.name)}</b></div>`;
  const backHtml = (cls = "") => `<div class="bc back ${cls}"></div>`;
  function monHtml(m) {
    return `<div class="bm ${m.synchro ? "syn" : ""} ${m.ace ? "ace" : ""}" data-uid="${esc(m.uid)}">
      ${faceHtml({ kind: m.synchro ? "synchro" : "monster", icon: m.icon, name: m.name }, "flat")}
      <div class="bm-up"><span class="bm-ic">${m.icon}</span><div class="bm-atk"><small>ATK</small>${m.atk}<i>★${m.lv || ""}</i></div></div>
    </div>`;
  }
  function sideHtml(side, P) {
    const mz = [0, 1, 2].map((i) => `<div class="bz mz" data-i="${i}">${P.field[i] ? monHtml(P.field[i]) : ""}</div>`).join("");
    const st = [0, 1, 2, 3].map((i) => `<div class="bz st" data-i="${i}">${P.sets[i] ? backHtml("set") : ""}</div>`).join("");
    const pile = (cls, n, label) => `<div class="bp ${cls}"><div class="bc ${cls === "deck" ? "back" : "grave"}"></div><b>${n}</b><small>${label}</small></div>`;
    const stRow = `<div class="brow st ${side}">${pile("deck", P.deck, "デッキ")}${st}${pile("grave", P.grave, "墓地")}</div>`;
    const mzRow = `<div class="brow mz ${side}">${mz}</div>`;
    // 相手は奥から 魔法罠→モンスター、自分は手前に向かって モンスター→魔法罠
    return side === "opp" ? stRow + mzRow : mzRow + stRow;
  }
  function hudHtml(side, P, name) {
    return `<div class="bh ${side}"><div class="bh-face">${DuelFx.avatarHtml(side)}</div><div class="bh-lp"><small>LP:</small><b>${P.lp}</b></div><div class="bh-name">${esc(name)}</div></div>`;
  }
  function handHtml(P, side) {
    if (side === "opp") return `<div class="bhand opp">${P.hand.map((_, i) => backHtml("h").replace('class="bc', `style="--i:${i - (P.hand.length - 1) / 2}" class="bc`)).join("")}</div>`;
    return `<div class="bhand you">${P.hand.map((k, i) => faceHtml(cardOf(k), "h").replace('class="bc', `data-k="${esc(k)}" style="--i:${i - (P.hand.length - 1) / 2}" class="bc`)).join("")}</div>`;
  }
  function html(M, names) {
    return `<div class="bd-bg"><div class="bd-road"><i></i><i></i><i></i></div></div>
      ${hudHtml("opp", M.opp, names.opp)}
      <div class="bd-turn"><b>ターン ${M.turn}</b><span class="bd-phase ${M.side}">${M.side === "you" ? "YOU" : "RIVAL"} <em>ドローフェイズ</em></span></div>
      ${handHtml(M.opp, "opp")}
      <div class="bd-stage"><div class="bd-plane">
        <div class="bside opp">${sideHtml("opp", M.opp)}</div>
        <div class="bmid"></div>
        <div class="bside you">${sideHtml("you", M.you)}</div>
      </div></div>
      ${hudHtml("you", M.you, names.you)}
      ${handHtml(M.you, "you")}
      <div class="bd-fx"></div>`;
  }

  // ---------- 再生 ----------
  let token = 0;
  function stop() {
    token++;
    const el = document.getElementById("bd");
    if (el) el.remove();
  }
  const busy = () => !!document.getElementById("bd");

  // ev: Battle.step の返り値。names: { you, opp }。onDone: 終わったとき
  async function play(ev, names, onDone) {
    stop();
    const my = ++token;
    const alive = () => my === token && document.getElementById("bd");
    const clone = (Q) => ({ lp: Q.lp, spc: Q.spc, hand: Q.hand.slice(), field: Q.field.map((m) => Object.assign({}, m)), sets: Q.sets.slice(), deck: Q.deck, grave: Q.grave });
    const M = { turn: ev.turn, side: ev.side, you: clone(ev.before.you), opp: clone(ev.before.opp) };
    document.body.insertAdjacentHTML("beforeend", `<div class="bd ${ev.side}" id="bd" role="dialog" aria-label="デュエルの盤面">${html(M, names)}</div>`);
    const root = document.getElementById("bd");
    root.addEventListener("click", () => stop());
    // 1ターンを12秒くらいに収める
    const COST = { draw: 450, summon: 950, tune: 900, spell: 1150, set: 600, chain: 700, resolve: 750, effect: 700, burn: 850, destroy: 650, attack: 1250, info: 1000, newfoe: 1300, win: 1700 };
    let total = 900;
    for (const st of ev.steps) total += COST[st.t] || 500;
    for (const st of ev.steps) if (st.t === "summon" && (st.how === "synchro" || st.how === "ace")) total += 2200;
    const k = Math.max(0.45, Math.min(1, 12500 / total));
    const T = (ms) => ms * k;
    const $ = (sel) => root.querySelector(sel);
    const zone = (side, kind, i) => $(`.bside.${side} .brow.${kind} .bz[data-i="${i}"]`);
    const monEl = (uid) => $(`.bm[data-uid="${uid}"]`);
    const pile = (side, kind) => $(`.bside.${side} .bp.${kind}`);
    const hud = (side) => $(`.bh.${side}`);
    const fx = $(".bd-fx");
    const phase = (txt) => {
      const e = $(".bd-phase em");
      if (e && e.textContent !== txt) (e.textContent = txt), e.animate([{ transform: "scale(1.6)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 300 });
    };
    // 画面の中を、カードが飛ぶ
    const center = (el) => {
      const r = el.getBoundingClientRect(), R = root.getBoundingClientRect();
      return { x: r.left + r.width / 2 - R.left, y: r.top + r.height / 2 - R.top };
    };
    function fly(from, to, inner, ms, o = {}) {
      if (!from || !to) return sleep(ms);
      const a = center(from), b = center(to);
      const el = document.createElement("div");
      el.className = "bfly";
      el.innerHTML = inner;
      el.style.left = a.x + "px";
      el.style.top = a.y + "px";
      fx.appendChild(el);
      const mid = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - (o.arc || 40) };
      const an = el.animate(
        [
          { transform: `translate(-50%,-50%) scale(${o.s0 || 1})` },
          { transform: `translate(calc(-50% + ${mid.x - a.x}px), calc(-50% + ${mid.y - a.y}px)) scale(${o.sm || 1.3}) rotate(${o.rot || -8}deg)`, offset: 0.5 },
          { transform: `translate(calc(-50% + ${b.x - a.x}px), calc(-50% + ${b.y - a.y}px)) scale(${o.s1 || 0.8})` },
        ],
        { duration: ms, easing: "cubic-bezier(.4,.0,.3,1)" }
      );
      return an.finished.then(() => el.remove()).catch(() => el.remove());
    }
    function pop(at, text, cls) {
      if (!at) return;
      const c = center(at);
      const el = document.createElement("div");
      el.className = `bpop ${cls || ""}`;
      el.textContent = text;
      el.style.left = c.x + "px";
      el.style.top = c.y + "px";
      fx.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }
    function burst(at, cls) {
      if (!at) return;
      const c = center(at);
      const el = document.createElement("div");
      el.className = `bburst ${cls || ""}`;
      el.style.left = c.x + "px";
      el.style.top = c.y + "px";
      fx.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
    // ギザギザの吹き出し
    function say(side, text, ms) {
      const old = root.querySelector(".bsay");
      if (old) old.remove();
      root.insertAdjacentHTML("beforeend", `<div class="bsay ${side}"><span>${esc(text)}</span></div>`);
      const el = root.querySelector(".bsay");
      setTimeout(() => el && el.remove(), ms || T(1400));
    }
    // LPを数えて減らす(増やす)
    function setLp(side, to) {
      const b = hud(side) && hud(side).querySelector(".bh-lp b");
      if (!b) return;
      const from = +b.textContent || 0;
      M[side].lp = to;
      const t0 = performance.now(), dur = T(700);
      const tick = (t) => {
        const q = Math.min(1, (t - t0) / dur);
        b.textContent = Math.round(from + (to - from) * q);
        if (q < 1 && alive()) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      hud(side).animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], { duration: 250, iterations: 2 });
    }
    const handEl = (side) => $(`.bhand.${side}`);
    function handCard(side, key) {
      const h = handEl(side);
      if (!h) return null;
      return side === "you" ? h.querySelector(`.bc[data-k="${CSS.escape(key)}"]`) || h.lastElementChild : h.lastElementChild;
    }
    function relayoutHand(side) {
      const h = handEl(side);
      if (!h) return;
      const cs = [...h.children];
      cs.forEach((c, i) => c.style.setProperty("--i", i - (cs.length - 1) / 2));
    }
    function addHand(side, key) {
      const h = handEl(side);
      if (!h) return;
      h.insertAdjacentHTML("beforeend", side === "you" ? faceHtml(cardOf(key), "h").replace('class="bc', `data-k="${esc(key)}" class="bc`) : backHtml("h"));
      relayoutHand(side);
    }
    function takeHand(side, key) {
      const i = M[side].hand.indexOf(key);
      if (i >= 0) M[side].hand.splice(i, 1);
      else if (side === "opp") M.opp.hand.pop();
      const el = handCard(side, key);
      if (el) el.remove();
      relayoutHand(side);
      return el;
    }
    function bump(side, kind, d) {
      const p = pile(side, kind);
      if (!p) return;
      M[side][kind] += d;
      p.querySelector("b").textContent = M[side][kind];
    }
    const freeZone = (side, kind) => {
      for (let i = 0; i < (kind === "mz" ? 3 : 4); i++) {
        const z = zone(side, kind, i);
        if (z && !z.firstElementChild) return z;
      }
      return zone(side, kind, 0);
    };
    function placeMon(side, m) {
      const z = freeZone(side, "mz");
      if (!z) return null;
      z.innerHTML = monHtml(m);
      M[side].field.push(m);
      const e = z.firstElementChild;
      e.classList.add("in");
      return e;
    }
    function killMon(uid, side) {
      const e = monEl(uid);
      if (!e) return;
      e.classList.add("dead");
      M[side].field = M[side].field.filter((m) => m.uid !== uid);
      bump(side, "grave", 1);
      setTimeout(() => e.remove(), T(600));
    }
    // 漫画風のカットイン(ドドドド + 口上)
    async function mangaCut(side, text) {
      root.insertAdjacentHTML("beforeend", `<div class="bmanga ${side}"><div class="bm-lines"></div><div class="bm-av">${DuelFx.avatarHtml(side)}</div><div class="bm-dodo"><b>ド</b><b>ド</b><b>ド</b><b>ド</b></div><div class="bsay big ${side}"><span>${esc(text)}</span></div></div>`);
      if (typeof Cinema !== "undefined") Cinema.sfx("stab", 0.05, side === "opp");
      await sleep(T(2300));
      const el = root.querySelector(".bmanga");
      if (el) el.remove();
    }

    let chainCards = []; // 発動中の罠(解決が終わったら墓地へ)
    const flushChain = async () => {
      if (!chainCards.length) return;
      for (const c of chainCards) {
        c.el.classList.add("gone");
        bump(c.side, "grave", 1);
      }
      chainCards = [];
      await sleep(T(250));
    };
    const center$ = () => $(".bmid");

    await sleep(T(450));
    for (const st of ev.steps) {
      if (!alive()) return;
      if (!["resolve", "burn", "effect", "destroy", "chain"].includes(st.t)) await flushChain();
      const s = st.side || ev.side;
      const o = s === "you" ? "opp" : "you";
      switch (st.t) {
        case "newfoe":
          say("opp", `${st.foe.name}、参上! デッキは「${st.foe.deckName}」!`, T(1500));
          await sleep(T(1300));
          break;
        case "draw": {
          const key = st.card ? st.card.key : null;
          M[s].hand.push(key);
          bump(s, "deck", -1);
          await fly(pile(s, "deck"), handEl(s), s === "you" && st.card ? faceHtml(st.card) : backHtml(), T(420), { arc: 60, sm: 1.6 });
          addHand(s, key);
          if (!st.why && s === ev.side) say(s, s === "you" ? "オレのターン! ドロー!" : "ドロー…", T(900));
          if (st.destiny) say("you", "運命の…ドロー!!", T(1200));
          phase("メインフェイズ");
          break;
        }
        case "summon": {
          const m = st.mon;
          const z = freeZone(s, "mz");
          if (st.how === "synchro" || st.how === "ace") {
            await mangaCut(s, chant(m, s));
            if (!alive()) return;
            burst(z, "syn");
          } else if (st.how === "revive") {
            bump(s, "grave", -1);
            await fly(pile(s, "grave"), z, faceHtml({ kind: "monster", icon: m.icon, name: m.name }), T(500));
          } else {
            const from = takeHand(s, m.key) || handEl(s);
            await fly(from, z, s === "you" ? faceHtml(cardOf(m.key)) : backHtml(), T(500), { s1: 0.7 });
            say(s, `${m.name}を${st.how === "special" ? "特殊" : ""}召喚!`, T(1000));
          }
          placeMon(s, m);
          burst(z, st.how === "synchro" || st.how === "ace" ? "syn" : "");
          if (typeof Cinema !== "undefined") Cinema.sfx("hit");
          await sleep(T(450));
          break;
        }
        case "tune":
          say(s, `チューニング! ${st.from.join(" + ")}`, T(1100));
          for (const uid of st.mats || []) {
            const e = monEl(uid);
            if (e) e.classList.add("tuning");
          }
          if (typeof Cinema !== "undefined") Cinema.sfx("riser");
          await sleep(T(800));
          for (const uid of st.mats || []) killMon(uid, s);
          await sleep(T(150));
          break;
        case "spell": {
          const from = takeHand(s, st.card.key) || handEl(s);
          await fly(from, center$(), faceHtml(st.card), T(450), { s1: 2.2, sm: 1.8 });
          const big = document.createElement("div");
          big.className = "bact";
          big.innerHTML = faceHtml(st.card, "big") + `<em>${st.card.fx === "destiny" ? "運命のカード" : "スピード・スペル"}</em>`;
          fx.appendChild(big);
          say(s, `${st.card.name}、発動!`, T(1100));
          if (typeof Cinema !== "undefined") Cinema.sfx("shine");
          await sleep(T(600));
          big.remove();
          await fly(center$(), pile(s, "grave"), faceHtml(st.card), T(300), { s0: 1.4, s1: 0.6, arc: 10 });
          bump(s, "grave", 1);
          break;
        }
        case "set": {
          for (const key of st.keys || Array(st.n).fill(null)) {
            const z = freeZone(s, "st");
            const from = takeHand(s, key) || handEl(s);
            await fly(from, z, backHtml(), T(260), { s1: 0.7, rot: 90 });
            if (z) z.innerHTML = backHtml("set in");
            M[s].sets.push(key);
          }
          say(s, `カードを${st.n}枚伏せて…`, T(900));
          await sleep(T(200));
          break;
        }
        case "chain": {
          phase(ev.steps.some((x) => x.t === "attack") ? "バトルフェイズ" : "メインフェイズ");
          for (const l of st.links) {
            if (l.n === 1) continue;
            const zs = [0, 1, 2, 3].map((i) => zone(l.side, "st", i)).filter((z) => z && z.querySelector(".bc.back"));
            const z = zs[0];
            if (z) {
              z.innerHTML = faceHtml({ kind: l.kind, icon: l.icon, name: l.name }, "open") + `<em class="bchain">${l.n}</em>`;
              chainCards.push({ el: z.firstElementChild, side: l.side });
              setTimeout(() => z.querySelector(".bchain") && z.querySelector(".bchain").remove(), T(2600));
            }
            say(l.side, `トラップ発動! ${l.name}!`, T(800));
            if (typeof Cinema !== "undefined") Cinema.sfx("clink");
            await sleep(T(560));
          }
          if (st.links.length >= 3) {
            pop(center$(), `${st.links.length} CHAIN!!`, "chainx");
            await sleep(T(500));
          }
          break;
        }
        case "resolve":
        case "effect":
        case "info":
          say(s, st.text, T(1000));
          if (st.heal) setLp(s, M[s].lp + st.heal), pop(hud(s), `+${st.heal}`, "heal");
          await sleep(T(700));
          break;
        case "burn": {
          const target = hud(o);
          await fly(hud(s), target, `<div class="bfire">🔥</div>`, T(450), { arc: 30, sm: 2 });
          pop(target, `-${st.dmg}`, "dmg");
          setLp(o, Math.max(0, M[o].lp - st.dmg));
          if (typeof Cinema !== "undefined") Cinema.sfx("hit");
          if (st.why) say(s, `${st.why}! ${st.dmg}ダメージ!`, T(900));
          await sleep(T(450));
          break;
        }
        case "destroy":
          if (st.mon && st.mon.uid) {
            burst(monEl(st.mon.uid), "boom");
            killMon(st.mon.uid, s);
            if (st.why) say(st.side === "you" ? "opp" : "you", `${st.mon.name}を破壊!`, T(800));
          }
          await sleep(T(550));
          break;
        case "attack": {
          phase("バトルフェイズ");
          const a = monEl(st.mon.uid);
          const tEl = st.target ? monEl(st.target.uid) : hud(o);
          say(s, `${st.mon.name}で攻撃!${st.target ? "" : " ダイレクトアタック!"}`, T(1100));
          await sleep(T(250));
          if (a && tEl) {
            const A = center(a), B = center(tEl);
            a.animate(
              [{ transform: "none" }, { transform: `translate(${(B.x - A.x) * 0.85}px, ${(B.y - A.y) * 0.85}px) scale(1.3)`, offset: 0.55 }, { transform: "none" }],
              { duration: T(650), easing: "cubic-bezier(.5,0,.3,1)" }
            );
          }
          await sleep(T(360));
          if (typeof Cinema !== "undefined") Cinema.sfx("hit");
          burst(tEl, st.result === "negated" ? "shield" : "boom");
          if (st.result === "negated") pop(tEl, "無効!", "info");
          if (st.result === "destroy" || st.result === "both") st.target && killMon(st.target.uid, o);
          if (st.result === "repel" || st.result === "both") killMon(st.mon.uid, s);
          if (st.result === "guard") pop(tEl, "耐えた!", "info");
          if (st.dmg > 0) {
            const loser = st.result === "repel" ? s : o;
            pop(hud(loser), `-${st.dmg}`, "dmg");
            setLp(loser, Math.max(0, M[loser].lp - st.dmg));
          }
          await sleep(T(640));
          break;
        }
        case "win":
          phase("エンドフェイズ");
          root.insertAdjacentHTML("beforeend", `<div class="bwin ${st.side}">${st.side === "you" ? "WIN!!" : "LOSE…"}</div>`);
          await sleep(T(1600));
          break;
      }
    }
    await flushChain();
    if (!alive()) return;
    phase("エンドフェイズ");
    // 最後に本当の状態に合わせる(細かいずれを直す)
    M.you = clone(Object.assign({}, ev.you, { deck: ev.you.deck.length, grave: ev.you.grave.length }));
    M.opp = clone(Object.assign({}, ev.opp, { deck: ev.opp.deck.length, grave: ev.opp.grave.length }));
    const fxNode = $(".bd-fx");
    const stage = $(".bd-stage");
    const tmp = document.createElement("div");
    tmp.innerHTML = html(M, names);
    stage.replaceWith(tmp.querySelector(".bd-stage"));
    $(".bhand.you").replaceWith(tmp.querySelector(".bhand.you"));
    $(".bhand.opp").replaceWith(tmp.querySelector(".bhand.opp"));
    for (const sd of ["you", "opp"]) hud(sd).querySelector(".bh-lp b").textContent = M[sd].lp;
    if (fxNode) fxNode.innerHTML = "";
    await sleep(T(1100));
    if (!alive()) return;
    root.classList.add("out");
    await sleep(300);
    if (my === token) stop();
    if (onDone) onDone();
  }

  return { play, stop, busy, chant };
})();

if (typeof module !== "undefined") module.exports = Board;

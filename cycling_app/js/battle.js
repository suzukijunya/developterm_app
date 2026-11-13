// デュエルモードのバトル: 100m走るごとに1ターン、自分と相手が交互に動く(自分のターンは200mごと)。
// 自分のデッキは40枚。最初に5枚引き、自分のターンごとに1枚引くので、だいたい7kmで山札を引き切る。
// 1ターンの中で、モンスターの召喚・スピード・スペル・罠のセット・シンクロ召喚・攻撃を次々に行い、
// 攻撃や魔法には罠で割り込み(チェーン)、さらにカウンター罠で返し…と、何枚も重なる。
// 相手は、特徴のあるデッキを使うライバルがランダムに現れる。LPが0になったら、次のライバルが来る。
// 走りながら画面を触らなくていいように、すべて自動で進む。攻撃力は、その区間を実際にゴーストより速く走れたかで上下する。
// 状態は ride.duel.b に持つ(再読み込みしても続きから)。

const Battle = (() => {
  const D = typeof Duel !== "undefined" ? Duel : require("./duel.js");
  const LP0 = 8000;
  const ZONES = 3; // モンスターを出せる数
  const SETS = 4; // 罠を伏せられる数
  const STEP_M = 110; // この距離ごとに1ターン(自分と相手が交互)
  const HAND0 = 5;
  const SPC_MAX = 12;

  // ---------- カード ----------
  // kind: monster / spell(スピード・スペル。SPCが cost 以上で使える)/ trap(伏せてから相手の行動に割り込む)
  // fx: 効果の種類(エンジンが読む)
  const C = (o) => o;
  const POOL = {
    // --- 自分のデッキ「スピード・ロード」 ---
    sprocket: C({ kind: "monster", name: "スプロケット・ナイト", icon: "⚙️", lv: 3, atk: 1300, text: "歯車の騎士" }),
    chainwolf: C({ kind: "monster", name: "チェーン・ウルフ", icon: "🐺", lv: 2, atk: 800, tuner: true, fx: "spc1", text: "チューナー。召喚するとSPC+1" }),
    spoke: C({ kind: "monster", name: "スポーク・ガーディアン", icon: "🛡️", lv: 4, atk: 1600, fx: "guard", text: "1ターンに1度、戦闘では破壊されない" }),
    falcon: C({ kind: "monster", name: "エアロ・ファルコン", icon: "🦅", lv: 4, atk: 1800, text: "空気を切り裂く翼" }),
    cadence: C({ kind: "monster", name: "ケイデンス・シンクロン", icon: "🎵", lv: 3, atk: 1000, tuner: true, fx: "callLow", text: "チューナー。召喚すると、手札のLv3以下を1体特殊召喚" }),
    carbon: C({ kind: "monster", name: "カーボン・ドラゴン", icon: "🐉", lv: 6, atk: 2400, need: 5, text: "SPCが5以上なら召喚できる" }),
    rabbit: C({ kind: "monster", name: "ドラフティング・ラビット", icon: "🐇", lv: 2, atk: 600, fx: "draw1", text: "召喚すると1枚ドロー" }),
    slip: C({ kind: "spell", name: "スリップストリーム", icon: "🌀", cost: 2, fx: "draw2", text: "Sp(2) 2枚ドロー" }),
    boost: C({ kind: "spell", name: "アクセル・ブースト", icon: "⚡", cost: 3, fx: "atk1000", text: "Sp(3) このターン、モンスター1体の攻撃力+1000" }),
    puncture: C({ kind: "spell", name: "パンク・ブレイク", icon: "💥", cost: 4, fx: "destroy", text: "Sp(4) 相手のいちばん強いモンスターを破壊" }),
    downhill: C({ kind: "spell", name: "ダウンヒル・バーン", icon: "🔥", cost: 5, fx: "burn1000", text: "Sp(5) 相手に1000ダメージ" }),
    rerun: C({ kind: "spell", name: "リターン・ライド", icon: "♻️", cost: 3, fx: "revive", text: "Sp(3) 墓地のモンスター1体を特殊召喚" }),
    reflect: C({ kind: "trap", name: "リフレクト・ギア", icon: "🪞", fx: "negateAtk", text: "相手の攻撃を無効にする" }),
    counter: C({ kind: "trap", name: "カウンター・ドラフト", icon: "🔁", fx: "counter", text: "カウンター罠。相手の魔法・罠の発動を無効にする" }),
    discbrake: C({ kind: "trap", name: "ディスク・ブレーキ", icon: "🛑", fx: "killAtk", text: "攻撃してきたモンスターを破壊" }),
    chainreact: C({ kind: "trap", name: "チェーン・リアクション", icon: "⛓️", fx: "chainBurn", text: "チェーン2以降で発動。チェーンの数×400ダメージ" }),
    tailwind: C({ kind: "trap", name: "テイルウィンド", icon: "🍃", fx: "guardUp", text: "攻撃された自分のモンスターの攻撃力+800" }),
    // --- ライバルたちのカード ---
    sprinter: C({ kind: "monster", name: "ゼロヨン・スプリンター", icon: "🏎️", lv: 4, atk: 1900, text: "スタートダッシュの鬼" }),
    breakaway: C({ kind: "monster", name: "ブレイクアウェイ・ジェット", icon: "🚀", lv: 6, atk: 2500, need: 4, text: "SPCが4以上なら召喚できる" }),
    lead: C({ kind: "monster", name: "リードアウト・ボーイ", icon: "🏃", lv: 2, atk: 700, tuner: true, fx: "spc1", text: "チューナー。召喚するとSPC+1" }),
    nitro: C({ kind: "spell", name: "ニトロ・スパート", icon: "🧨", cost: 2, fx: "atk1000", text: "Sp(2) モンスター1体の攻撃力+1000" }),
    rush: C({ kind: "spell", name: "ラスト・ラッシュ", icon: "💨", cost: 6, fx: "allAtk500", text: "Sp(6) 自分のモンスター全部の攻撃力+500" }),
    pothole: C({ kind: "trap", name: "ポットホール", icon: "🕳️", fx: "killAtk", text: "攻撃してきたモンスターを破壊" }),
    caution: C({ kind: "trap", name: "イエロー・フラッグ", icon: "🚩", fx: "negateAtk", text: "相手の攻撃を無効にする" }),
    jammer: C({ kind: "trap", name: "シグナル・ジャマー", icon: "📡", fx: "counter", text: "カウンター罠。相手の魔法・罠の発動を無効にする" }),
    mirror: C({ kind: "trap", name: "ミラー・ロード", icon: "🔮", fx: "reflectDmg", text: "相手の攻撃を無効にし、その攻撃力の半分のダメージを返す" }),
    wall: C({ kind: "monster", name: "ヒルクライム・ゴーレム", icon: "🗿", lv: 5, atk: 2200, fx: "guard", need: 3, text: "戦闘で1度だけ破壊されない" }),
    switchback: C({ kind: "monster", name: "スイッチバック・タートル", icon: "🐢", lv: 3, atk: 1200, fx: "heal500", text: "召喚するとLP+500" }),
    aid: C({ kind: "spell", name: "補給ステーション", icon: "🥤", cost: 2, fx: "heal1500", text: "Sp(2) LPを1500回復" }),
    summit: C({ kind: "spell", name: "サミット・アタック", icon: "⛰️", cost: 5, fx: "destroy", text: "Sp(5) 相手のいちばん強いモンスターを破壊" }),
    flame: C({ kind: "monster", name: "フレイム・クランク", icon: "🔥", lv: 3, atk: 1100, fx: "burn300", text: "召喚すると相手に300ダメージ" }),
    exhaust: C({ kind: "spell", name: "エキゾースト・ブラスト", icon: "🌋", cost: 3, fx: "burn800", text: "Sp(3) 相手に800ダメージ" }),
    overheat: C({ kind: "spell", name: "オーバーヒート", icon: "♨️", cost: 6, fx: "burn1500", text: "Sp(6) 相手に1500ダメージ" }),
    sync1: C({ kind: "monster", name: "ハーモニー・シンクロン", icon: "🎼", lv: 2, atk: 500, tuner: true, fx: "callLow", text: "チューナー。手札のLv3以下を1体特殊召喚" }),
    gear: C({ kind: "monster", name: "ギア・ドール", icon: "🤖", lv: 3, atk: 1200, fx: "draw1", text: "召喚すると1枚ドロー" }),
  };
  // シンクロモンスター(エクストラデッキ。チューナー+チューナー以外で、レベルの合計がぴったりのとき)
  const SYNCHROS = {
    you: [
      { name: "ストリーム・ドラゴン", icon: "🐲", lv: 8, atk: 3000, synchro: true, fx: "pierce", text: "攻撃した後、相手に500ダメージ" },
      { name: "ホライズン・ウォリアー", icon: "⚔️", lv: 7, atk: 2700, synchro: true },
      { name: "シンクロ・スプリンター", icon: "💫", lv: 5, atk: 2300, synchro: true, fx: "draw1" },
      { name: "ケイデンス・ナイト", icon: "🛡️", lv: 6, atk: 2500, synchro: true, fx: "guard" },
    ],
    opp: [
      { name: "ナイトメア・ペロトン", icon: "💀", lv: 8, atk: 2900, synchro: true, fx: "pierce" },
      { name: "シャドウ・ブレイカー", icon: "🌑", lv: 6, atk: 2500, synchro: true },
      { name: "ファントム・ホイール", icon: "🌀", lv: 5, atk: 2200, synchro: true, fx: "draw1" },
    ],
  };
  const list = (o) => Object.entries(o).flatMap(([k, n]) => Array(n).fill(k));
  const YOU_DECK = list({ sprocket: 4, chainwolf: 3, spoke: 2, falcon: 4, cadence: 2, carbon: 2, rabbit: 2, slip: 2, boost: 3, puncture: 2, downhill: 2, rerun: 2, reflect: 3, counter: 2, discbrake: 2, chainreact: 2, tailwind: 1 });
  // ライバル(デッキの特徴ごと)。どのデッキも40枚
  const FOES = [
    { id: "sprint", name: "疾風のアキラ", deckName: "ゼロヨン・スプリント", style: "攻撃力の高いモンスターで押し切る", icon: "🏎️",
      deck: list({ sprinter: 4, breakaway: 3, falcon: 3, lead: 3, rabbit: 3, sprocket: 2, nitro: 4, rush: 2, boost: 3, puncture: 2, slip: 3, pothole: 2, caution: 2, reflect: 2, counter: 2 }) },
    { id: "trap", name: "罠師ミオ", deckName: "トラップ・ペロトン", style: "罠を何枚も伏せて、チェーンで返してくる", icon: "🕸️",
      deck: list({ spoke: 3, sprocket: 3, lead: 3, rabbit: 2, falcon: 2, slip: 3, rerun: 2, pothole: 3, caution: 3, jammer: 3, mirror: 2, chainreact: 3, counter: 3, reflect: 3, discbrake: 2 }) },
    { id: "climb", name: "鉄壁のゲン", deckName: "ヒルクライム・ウォール", style: "固い壁モンスターとLP回復で粘る", icon: "🗿",
      deck: list({ wall: 4, switchback: 4, spoke: 3, sprocket: 3, lead: 3, falcon: 2, aid: 4, summit: 2, slip: 3, rerun: 2, caution: 3, tailwind: 3, reflect: 2, counter: 2 }) },
    { id: "burn", name: "爆走のリョウ", deckName: "バーン・エキゾースト", style: "ダメージを与えるカードで直接LPを削る", icon: "🔥",
      deck: list({ flame: 4, lead: 3, sprocket: 3, rabbit: 3, falcon: 2, exhaust: 4, overheat: 3, downhill: 3, slip: 3, nitro: 2, chainreact: 3, pothole: 2, jammer: 2, caution: 3 }) },
    { id: "sync", name: "同調のカイ", deckName: "シンクロン・ストリーム", style: "チューナーを並べて次々にシンクロ召喚する", icon: "🎼",
      deck: list({ sync1: 4, lead: 3, cadence: 2, gear: 4, sprocket: 3, falcon: 3, slip: 3, rerun: 3, nitro: 2, puncture: 2, caution: 2, jammer: 3, reflect: 3, mirror: 3 }) },
  ];

  const r50 = (x) => Math.round(x / 50) * 50;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const card = (key) => Object.assign({ key }, POOL[key]);

  function rnd(b) {
    b.seed = (b.seed * 1103515245 + 12345) % 2147483648;
    return b.seed / 2147483648;
  }
  function shuffle(b, a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd(b) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const player = (deck) => ({ lp: LP0, deck, hand: [], field: [], sets: [], grave: [], spc: 0 });

  function newFoe(b) {
    const used = b.foesSeen || [];
    const left = FOES.filter((f) => !used.includes(f.id));
    const f = (left.length ? left : FOES)[Math.floor(rnd(b) * (left.length || FOES.length))];
    b.foe = f.id;
    b.foesSeen = used.concat(f.id);
    b.opp = player(shuffle(b, f.deck.slice()));
    for (let i = 0; i < HAND0; i++) b.opp.hand.push(b.opp.deck.pop());
    b.you.lp = LP0;
    return f;
  }
  const foeOf = (b) => FOES.find((f) => f.id === b.foe) || FOES[0];

  function state(ride) {
    const d = D.state(ride);
    if (!d.b || d.b.v !== 2) {
      const b = { v: 2, turn: 0, seed: ((ride.startedAt || 1) % 7919) + 7, segT: null, segD: 0, nextAt: STEP_M, wins: 0, losses: 0, used: [], winner: null };
      b.you = player(shuffle(b, YOU_DECK.slice()));
      newFoe(b);
      d.b = b;
    }
    return d.b;
  }

  // 最初の手札(5枚)。スタートの演出で見せる
  function deal(ride) {
    const b = state(ride);
    while (b.you.hand.length < HAND0 && b.you.deck.length) b.you.hand.push(b.you.deck.pop());
    return b.you.hand.map(card);
  }

  // ---------- 1ターンの中の動き ----------
  function draw(b, s, steps, n = 1, why) {
    const P = b[s];
    for (let i = 0; i < n; i++) {
      if (!P.deck.length) {
        if (s === "you") steps.push({ t: "info", side: s, text: "デッキが尽きた! ここからは手札とフィールドだけで勝負" });
        return;
      }
      const k = P.deck.pop();
      P.hand.push(k);
      steps.push({ t: "draw", side: s, card: s === "you" ? card(k) : null, why });
    }
  }
  const mon = (k, extra) => Object.assign({ key: k, uid: Math.random().toString(36).slice(2, 8) }, POOL[k] || {}, extra || {});

  function summon(b, s, steps, m, how) {
    const P = b[s], O = b[s === "you" ? "opp" : "you"];
    if (P.field.length >= ZONES) return false;
    P.field.push(m);
    steps.push({ t: "summon", side: s, mon: m, how });
    // 召喚したときの効果
    if (m.fx === "spc1") P.spc = Math.min(SPC_MAX, P.spc + 1), steps.push({ t: "effect", side: s, text: `${m.name}の効果! SPC+1(${P.spc})` });
    if (m.fx === "draw1") draw(b, s, steps, 1, m.name);
    if (m.fx === "heal500") (P.lp += 500), steps.push({ t: "effect", side: s, text: `${m.name}の効果! LP+500`, heal: 500 });
    if (m.fx === "burn300") damage(b, s, steps, 300, m.name);
    if (m.fx === "callLow") {
      const i = P.hand.findIndex((k) => POOL[k].kind === "monster" && POOL[k].lv <= 3 && !POOL[k].need);
      if (i >= 0 && P.field.length < ZONES) {
        const k = P.hand.splice(i, 1)[0];
        steps.push({ t: "effect", side: s, text: `${m.name}の効果! 手札から呼び出す` });
        summon(b, s, steps, mon(k), "special");
      }
    }
    return true;
  }

  function damage(b, s, steps, n, why) {
    const O = b[s === "you" ? "opp" : "you"];
    O.lp = Math.max(0, O.lp - n);
    steps.push({ t: "burn", side: s, dmg: n, why });
  }

  // チェーン: 発動したカード(link0)に、相手→自分→相手…と割り込みのカードを重ねる。最後に重ねたものから順に効く
  // trigger: { kind: "attack" | "spell", side, card?, attacker? }
  function runChain(b, steps, trigger) {
    const links = [{ side: trigger.side, card: trigger.card, base: true }];
    let responder = trigger.side === "you" ? "opp" : "you";
    let passes = 0;
    while (passes < 2 && links.length < 7) {
      const P = b[responder];
      const top = links[links.length - 1];
      const firstReply = links.length === 1;
      const want = (k) => {
        const fx = POOL[k].fx;
        if (fx === "counter") return top.card && (top.card.kind === "spell" || top.card.kind === "trap") && top.side !== responder; // 相手の魔法・罠を止める
        if (fx === "chainBurn") return links.length >= 2;
        if (!firstReply || trigger.kind !== "attack" || responder === trigger.side) return false;
        if (fx === "negateAtk" || fx === "reflectDmg" || fx === "killAtk") return true;
        if (fx === "guardUp") return b[responder].field.length > 0;
        return false;
      };
      const i = P.sets.findIndex(want);
      // 相手も毎回は使わない(読み合いの幅)
      if (i >= 0 && rnd(b) < (POOL[P.sets[i]].fx === "chainBurn" ? 0.9 : 0.8)) {
        const k = P.sets.splice(i, 1)[0];
        P.grave.push(k);
        if (responder === "you") b.used.push(POOL[k].name);
        links.push({ side: responder, card: card(k) });
        passes = 0;
      } else passes++;
      responder = responder === "you" ? "opp" : "you";
    }
    if (links.length === 1) return { negated: false, links };
    steps.push({ t: "chain", links: links.map((l, i) => ({ side: l.side, name: l.card ? l.card.name : trigger.attacker ? `${trigger.attacker.name}の攻撃` : "", icon: l.card ? l.card.icon : "⚔️", n: i + 1, kind: l.card ? l.card.kind : "attack" })) });
    // 後ろから解決
    const negated = new Set();
    const out = { negated: false, killAtk: false, reflect: false, guardUp: 0, links };
    for (let i = links.length - 1; i >= 1; i--) {
      if (negated.has(i)) {
        steps.push({ t: "resolve", n: i + 1, text: `チェーン${i + 1} ${links[i].card.name}は無効!`, side: links[i].side });
        continue;
      }
      const L = links[i], fx = L.card.fx;
      if (fx === "counter") {
        negated.add(i - 1);
        steps.push({ t: "resolve", n: i + 1, side: L.side, text: `チェーン${i + 1} ${L.card.name}! チェーン${i}を無効にする` });
      } else if (fx === "chainBurn") {
        damage(b, L.side, steps, links.length * 400, `チェーン${i + 1} ${L.card.name}(${links.length}チェーン)`);
      } else if (fx === "negateAtk") {
        out.negated = true;
        steps.push({ t: "resolve", n: i + 1, side: L.side, text: `チェーン${i + 1} ${L.card.name}! 攻撃を無効に` });
      } else if (fx === "reflectDmg") {
        out.negated = out.reflect = true;
        steps.push({ t: "resolve", n: i + 1, side: L.side, text: `チェーン${i + 1} ${L.card.name}! 攻撃をはね返す` });
      } else if (fx === "killAtk") {
        out.killAtk = true;
        steps.push({ t: "resolve", n: i + 1, side: L.side, text: `チェーン${i + 1} ${L.card.name}! 攻撃モンスターを破壊` });
      } else if (fx === "guardUp") {
        out.guardUp += 800;
        steps.push({ t: "resolve", n: i + 1, side: L.side, text: `チェーン${i + 1} ${L.card.name}! 守るモンスターの攻撃力+800` });
      }
    }
    if (negated.has(0)) out.negated = true, (out.base = "negated");
    return out;
  }

  // スピード・スペルを使う(相手のカウンター罠で止められることがある)
  function castSpell(b, s, steps, i, target) {
    const P = b[s], O = b[s === "you" ? "opp" : "you"];
    const k = P.hand.splice(i, 1)[0];
    const c = card(k);
    P.grave.push(k);
    if (s === "you") b.used.push(c.name);
    steps.push({ t: "spell", side: s, card: c });
    const ch = runChain(b, steps, { kind: "spell", side: s, card: c });
    if (ch.negated) return steps.push({ t: "resolve", side: s, text: `${c.name}は無効になった…` }), false;
    if (c.fx === "draw2") draw(b, s, steps, 2, c.name);
    if (c.fx === "atk1000" && target) (target.boost = (target.boost || 0) + 1000), steps.push({ t: "effect", side: s, text: `${target.name}の攻撃力+1000!` });
    if (c.fx === "allAtk500") P.field.forEach((m) => (m.boost = (m.boost || 0) + 500)), steps.push({ t: "effect", side: s, text: "全員の攻撃力+500!" });
    if (c.fx === "destroy") {
      const t = O.field.slice().sort((x, y) => y.atk - x.atk)[0];
      if (t) destroy(b, s === "you" ? "opp" : "you", t, steps, `${c.name}で`);
    }
    if (c.fx === "burn1000") damage(b, s, steps, 1000, c.name);
    if (c.fx === "burn800") damage(b, s, steps, 800, c.name);
    if (c.fx === "burn1500") damage(b, s, steps, 1500, c.name);
    if (c.fx === "heal1500") (P.lp += 1500), steps.push({ t: "effect", side: s, text: "LPを1500回復!", heal: 1500 });
    if (c.fx === "revive") {
      const gk = P.grave.filter((g) => POOL[g] && POOL[g].kind === "monster").sort((x, y) => POOL[y].atk - POOL[x].atk)[0];
      if (gk && P.field.length < ZONES) {
        P.grave.splice(P.grave.indexOf(gk), 1);
        steps.push({ t: "effect", side: s, text: `墓地から${POOL[gk].name}がよみがえる!` });
        summon(b, s, steps, mon(gk), "special");
      }
    }
    return true;
  }

  function destroy(b, s, m, steps, why) {
    const P = b[s];
    P.field = P.field.filter((x) => x !== m);
    if (m.key && POOL[m.key]) P.grave.push(m.key);
    steps.push({ t: "destroy", side: s, mon: m, why });
  }

  // シンクロ召喚: チューナー1体+ほか1〜2体で、レベルの合計がぴったりのシンクロモンスター(強いほう)を出す
  function trySynchro(b, s, steps) {
    const P = b[s];
    const tuners = P.field.filter((m) => m.tuner);
    const others = P.field.filter((m) => !m.tuner && !m.synchro);
    let best = null;
    for (const t of tuners) {
      const combos = [];
      for (let i = 0; i < others.length; i++) {
        combos.push([others[i]]);
        for (let j = i + 1; j < others.length; j++) combos.push([others[i], others[j]]);
      }
      for (const cmb of combos) {
        const lv = t.lv + cmb.reduce((a, m) => a + m.lv, 0);
        const sy = SYNCHROS[s].filter((x) => x.lv === lv).sort((x, y) => y.atk - x.atk)[0];
        const now = t.atk + cmb.reduce((a, m) => a + m.atk, 0);
        if (sy && (!best || sy.atk > best.sy.atk) && (sy.atk > Math.max(t.atk, ...cmb.map((m) => m.atk)) || now < sy.atk + 800)) best = { sy, mats: [t, ...cmb] };
      }
    }
    if (!best) return false;
    for (const m of best.mats) destroy(b, s, m, [], "");
    const sm = Object.assign({ uid: Math.random().toString(36).slice(2, 8) }, best.sy);
    steps.push({ t: "tune", side: s, from: best.mats.map((m) => `${m.name}(Lv${m.lv})`), lv: best.sy.lv });
    summon(b, s, steps, sm, "synchro");
    if (sm.fx === "draw1") draw(b, s, steps, 1, sm.name);
    return true;
  }

  // メインフェイズ(自動): 引く→スペルで手札を増やす→召喚→シンクロ→除去・回復・バーン→罠を伏せる
  function mainPhase(b, s, steps) {
    const P = b[s], O = b[s === "you" ? "opp" : "you"];
    const hasSpell = (fx) => P.hand.findIndex((k) => POOL[k].kind === "spell" && POOL[k].fx === fx && P.spc >= POOL[k].cost);
    let i;
    // ドロー系スペル
    while ((i = hasSpell("draw2")) >= 0) castSpell(b, s, steps, i);
    // 通常召喚(1回)。シンクロにつながる組み合わせを優先
    const monsters = P.hand.map((k, j) => ({ k, j, c: POOL[k] })).filter((x) => x.c.kind === "monster" && (!x.c.need || P.spc >= x.c.need));
    if (monsters.length && P.field.length < ZONES) {
      const haveTuner = P.field.some((m) => m.tuner);
      monsters.sort((x, y) => {
        const sc = (z) => z.c.atk + (z.c.fx === "callLow" ? 900 : 0) + (z.c.tuner && !haveTuner && P.field.length ? 1000 : 0) + (z.c.need ? 600 : 0) + (z.c.fx === "draw1" ? 300 : 0);
        return sc(y) - sc(x);
      });
      const pickM = monsters[0];
      P.hand.splice(pickM.j, 1);
      summon(b, s, steps, mon(pickM.k), "normal");
    }
    // 墓地から
    if ((i = hasSpell("revive")) >= 0 && P.field.length < ZONES && P.grave.some((g) => POOL[g] && POOL[g].kind === "monster")) castSpell(b, s, steps, i);
    // シンクロ(2回まで)
    for (let n = 0; n < 2 && trySynchro(b, s, steps); n++);
    // 相手のほうが強いモンスターを出していたら、除去
    const myTop = Math.max(0, ...P.field.map((m) => m.atk));
    const theirTop = O.field.slice().sort((x, y) => y.atk - x.atk)[0];
    if (theirTop && theirTop.atk >= myTop && (i = hasSpell("destroy")) >= 0) castSpell(b, s, steps, i);
    // 回復
    if (P.lp < LP0 * 0.6 && (i = hasSpell("heal1500")) >= 0) castSpell(b, s, steps, i);
    // バーン: 相手のLPが減っていたら、または余っていたら撃つ
    for (const fx of ["burn1500", "burn1000", "burn800"]) if ((i = hasSpell(fx)) >= 0 && (O.lp <= 3000 || rnd(b) < 0.6)) castSpell(b, s, steps, i);
    // 罠を伏せる
    let set = 0;
    for (let j = P.hand.length - 1; j >= 0 && P.sets.length < SETS; j--) if (POOL[P.hand[j]].kind === "trap") P.sets.push(P.hand.splice(j, 1)[0]), set++;
    if (set) steps.push({ t: "set", side: s, n: set });
  }

  // バトルフェイズ: 強い順に攻撃。勝てる相手を選び、勝てなければ強化スペルを使ってから殴る
  function battlePhase(b, s, steps, ratio) {
    const P = b[s], O = b[s === "you" ? "opp" : "you"];
    const ds = s === "you" ? "opp" : "you";
    const pw = (m) => r50((m.atk + (m.boost || 0)) * ratio);
    for (const m of P.field.slice().sort((x, y) => y.atk - x.atk)) {
      if (!P.field.includes(m) || O.lp <= 0) continue;
      let target = O.field.filter((t) => pw(m) > t.atk + (t.boost || 0)).sort((x, y) => y.atk - x.atk)[0] || null;
      if (!target && O.field.length) {
        const strongest = O.field.slice().sort((x, y) => y.atk - x.atk)[0];
        const bi = P.hand.findIndex((k) => POOL[k].fx === "atk1000" && P.spc >= POOL[k].cost);
        if (bi >= 0 && pw(m) + r50(1000 * ratio) > strongest.atk) {
          castSpell(b, s, steps, bi, m);
          if (pw(m) > strongest.atk) target = strongest;
        }
        if (!target) continue;
      }
      const power = pw(m);
      const step = { t: "attack", side: s, mon: m, power, target };
      const ch = runChain(b, steps, { kind: "attack", side: s, attacker: m });
      if (ch.reflect) {
        steps.push(Object.assign(step, { result: "negated" }));
        damage(b, ds, steps, r50(power / 2), "はね返し");
        continue;
      }
      if (ch.killAtk) {
        destroy(b, s, m, steps, "罠で");
        continue;
      }
      if (ch.negated) {
        steps.push(Object.assign(step, { result: "negated" }));
        continue;
      }
      if (target) {
        const ta = target.atk + (target.boost || 0) + (ch.guardUp || 0);
        if (power > ta) {
          if (target.fx === "guard" && !target.guarded) {
            target.guarded = true;
            step.result = "guard";
            step.dmg = r50(power - ta);
          } else {
            destroy(b, ds, target, [], "");
            step.result = "destroy";
            step.dmg = r50(power - ta);
          }
        } else if (power < ta) {
          destroy(b, s, m, [], "");
          step.result = "repel";
          step.dmg = r50(ta - power);
          P.lp = Math.max(0, P.lp - step.dmg);
          steps.push(step);
          continue;
        } else {
          destroy(b, ds, target, [], "");
          destroy(b, s, m, [], "");
          step.result = "both";
          step.dmg = 0;
        }
      } else {
        step.result = "direct";
        step.dmg = power;
      }
      O.lp = Math.max(0, O.lp - (step.dmg || 0));
      steps.push(step);
      if (m.fx === "pierce" && O.lp > 0) damage(b, s, steps, 500, `${m.name}の追撃`);
    }
    for (const m of P.field.concat(O.field)) (m.boost = 0), (m.guarded = false);
  }

  // 測位ごとに呼ぶ。100m進むごとに1ターン分のできごとを返す(なければ null)
  // ghostSpeed: ゴーストの速さ(信号待ち込み m/s)
  function step(ride, ghostSpeed) {
    const b = state(ride);
    const t = ride.last ? ride.last.t : Date.now();
    if (b.segT == null) b.segT = ride.startedAt || t;
    if (ride.distance < b.nextAt) return null;
    b.nextAt += STEP_M;
    b.turn++;
    // この区間の速さ(2ターン=200mごとに測り直す)
    if (b.turn % 2 === 1) {
      const pace = (ride.distance - b.segD) / Math.max(1, (t - b.segT) / 1000);
      b.ratio = b.turn === 1 ? 1 : clamp(pace / ghostSpeed, 0.8, 1.25);
      b.segD = ride.distance;
      b.segT = t;
    }
    const ratio = b.ratio || 1;
    const side = b.turn % 2 ? "you" : "opp";
    const other = side === "you" ? "opp" : "you";
    const P = b[side];
    const steps = [];
    let foeNew = null;
    if (b.pendingFoe) {
      foeNew = newFoe(b);
      b.pendingFoe = false;
      steps.push({ t: "newfoe", foe: { name: foeNew.name, deckName: foeNew.deckName, style: foeNew.style, icon: foeNew.icon } });
    }
    P.spc = Math.min(SPC_MAX, P.spc + 1);
    draw(b, side, steps, 1);
    mainPhase(b, side, steps);
    if (b.turn > 1) battlePhase(b, side, steps, side === "you" ? ratio : 1 / ratio);
    // コンボの数(このターンに発動・召喚した回数)
    const acts = steps.filter((x) => ["summon", "spell", "chain", "burn", "tune"].includes(x.t)).length;
    if (b.you.lp <= 0 || b.opp.lp <= 0) {
      const w = b.you.lp <= 0 ? "opp" : "you";
      if (w === "you") b.wins++;
      else b.losses++;
      steps.push({ t: "win", side: w, foe: foeOf(b).name });
      b.pendingFoe = true; // 次のターンに次のライバル
      b.you.lp = Math.max(b.you.lp, 1);
    }
    return { turn: b.turn, side, ratio, steps, acts, you: b.you, opp: b.opp, foe: foeOf(b), deckLeft: b.you.deck.length };
  }

  // 終わったときの成績(勝ち越し > いまのLP)
  function verdict(b) {
    if (!b) return null;
    const wins = b.wins || 0, losses = b.losses || 0;
    let winner = wins > losses ? "you" : wins < losses ? "opp" : null;
    if (!winner) winner = b.you.lp > b.opp.lp ? "you" : b.you.lp < b.opp.lp ? "opp" : "draw";
    return { winner, you: b.you.lp, opp: b.opp.lp, turns: b.turn, wins, losses, foe: b.foeName || (b.foe && foeOf(b).name) || "" };
  }

  // 保存用に小さくまとめる
  function summary(b) {
    if (!b) return null;
    return { turn: b.turn, wins: b.wins || 0, losses: b.losses || 0, you: { lp: b.you.lp, spc: b.you.spc }, opp: { lp: b.opp.lp }, foe: b.foe, foeName: foeOf(b).name, deckLeft: b.you.deck.length, used: (b.used || []).slice(-60) };
  }

  const cardOf = (k) => card(k);
  return { LP0, ZONES, STEP_M, FOES, POOL, YOU_DECK, state, deal, step, verdict, summary, foeOf, cardOf };
})();

if (typeof module !== "undefined") module.exports = Battle;

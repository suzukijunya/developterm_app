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
  const DMG = 0.55; // 戦闘ダメージの倍率(1人のライバルと長く競り合うように)

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
    // 運命のドロー(ピンチのときに、ゴーストより速く走ると引ける。デッキの40枚とは別)
    destiny: C({ kind: "spell", name: "リミット・オーバー・ドライブ", icon: "🌠", cost: 0, fx: "destiny", noChain: true, text: "運命のカード。相手のいちばん強いモンスターを破壊し、エースを呼ぶ。この発動は無効にされない" }),
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
  const ACE = { name: "ソニック・ストリーム・ドラゴン", icon: "🐲", lv: 10, atk: 3500, synchro: true, ace: true, fx: "pierce", text: "運命が呼ぶエース。攻撃した後、相手に500ダメージ" };
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

  // ---------- 10,000枚のカード(CardGen)を、同じ仕組みで使う ----------
  const G = typeof CardGen !== "undefined" ? CardGen : typeof require !== "undefined" ? require("./cardgen.js") : null;
  if (G) {
    G.build(Object.values(POOL).map((c) => c.name));
    for (const c of G.all) if (!c.synchro) POOL[c.key] = c;
    for (const f of G.foes()) FOES.push(f);
  }
  // 昔からのカードの効果(fx の合言葉)を、新しい書き方(いつ・何を・数)に直す
  const LEG = {
    spc1: [{ on: "summon", do: "spc", n: 1 }], draw1: [{ on: "summon", do: "draw", n: 1 }], heal500: [{ on: "summon", do: "heal", n: 500 }], burn300: [{ on: "summon", do: "burn", n: 300 }],
    callLow: [{ on: "summon", do: "call", n: 3 }], guard: [{ on: "cont", do: "guard" }], pierce: [{ on: "hit", do: "burn", n: 500 }],
    draw2: [{ on: "cast", do: "draw", n: 2 }], atk1000: [{ on: "cast", do: "boost", n: 1000 }], allAtk500: [{ on: "cast", do: "boostAll", n: 500 }], destroy: [{ on: "cast", do: "destroy" }],
    burn1000: [{ on: "cast", do: "burn", n: 1000 }], burn800: [{ on: "cast", do: "burn", n: 800 }], burn1500: [{ on: "cast", do: "burn", n: 1500 }], heal1500: [{ on: "cast", do: "heal", n: 1500 }],
    revive: [{ on: "cast", do: "revive", n: 9 }], destiny: [{ on: "cast", do: "destiny" }],
    negateAtk: [{ on: "trap", do: "negateAtk" }], counter: [{ on: "trap", do: "counter" }], killAtk: [{ on: "trap", do: "killAtk" }], chainBurn: [{ on: "trap", do: "chainBurn", n: 400 }],
    reflectDmg: [{ on: "trap", do: "reflectDmg" }], guardUp: [{ on: "trap", do: "guardUp", n: 800 }],
  };
  const NONE = [];
  const effs = (c) => (c && (c.e || LEG[c.fx])) || NONE;
  const main = (c) => effs(c)[0] || null; // スペル・罠のいちばんの効果
  const has = (c, on, d) => effs(c).find((e) => e.on === on && e.do === d) || null;
  const uid = () => Math.random().toString(36).slice(2, 8);

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

  // 自分のデッキ: カード図鑑で選んだテーマ(この端末に保存)。選んでいなければ、いつもの「スピード・ロード」
  function myTheme() {
    try {
      const t = typeof localStorage !== "undefined" && localStorage.getItem("duel_deck");
      return t && G && G.deck(t) ? t : null;
    } catch (e) {
      return null;
    }
  }
  // エクストラデッキ(シンクロ)
  function extraOf(b, s) {
    const th = s === "you" ? b.youTh : foeOf(b).th;
    return th && G ? G.extra(th) : SYNCHROS[s];
  }

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
    if (!d.b || d.b.v !== 3) {
      const b = { v: 3, turn: 0, seed: ((ride.startedAt || 1) % 7919) + 7, segT: null, segD: 0, nextAt: STEP_M, wins: 0, losses: 0, used: [], winner: null };
      b.youTh = myTheme();
      b.you = player(shuffle(b, (b.youTh ? G.deck(b.youTh) : YOU_DECK).slice()));
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
  const mon = (k, extra) => Object.assign({ key: k, uid: uid() }, POOL[k] || {}, extra || {});
  const other = (s) => (s === "you" ? "opp" : "you");
  const strongest = (list) => list.slice().sort((x, y) => y.atk - x.atk)[0] || null;
  const weakest = (list) => list.slice().sort((x, y) => x.atk - y.atk)[0] || null;

  // 効果の条件を満たしているか
  function ok(b, s, src, e, ctx) {
    const c = e.if;
    if (!c) return true;
    const P = b[s], O = b[other(s)];
    if (c.spc && P.spc < c.spc) return false;
    if (c.low && !(P.lp < O.lp)) return false;
    if (c.theme && !P.field.some((m) => m !== src && m.th && m.th === src.th)) return false;
    if (c.grave && P.grave.length < c.grave) return false;
    if (c.atkGE && !(ctx && ctx.attacker && ctx.attacker.atk >= c.atkGE)) return false;
    return true;
  }
  // 効果を1つ実行する。src: 効果を持つカード(またはモンスター)。target: 強化する相手(あれば)
  function exec(b, s, steps, src, e, target) {
    const P = b[s], O = b[other(s)], os = other(s), n = e.n || 0;
    const say = (text, extra) => steps.push(Object.assign({ t: "effect", side: s, text: `${src.name}の効果! ${text}` }, extra || {}));
    b.fxN = (b.fxN || 0) + 1;
    if (b.fxN > 40) return; // 1ターンに効果が回りすぎないように
    switch (e.do) {
      case "draw": return draw(b, s, steps, n, src.name);
      case "spc": case "charge": return (P.spc = Math.min(SPC_MAX, P.spc + n)), say(`SPC+${n}(${P.spc})`);
      case "heal": return (P.lp += n), say(`LP+${n}`, { heal: n });
      case "burn": return damage(b, s, steps, n, src.name);
      case "call": {
        const i = P.hand.findIndex((k) => POOL[k].kind === "monster" && POOL[k].lv <= 3 && !POOL[k].need);
        if (i < 0 || P.field.length >= ZONES) return;
        const k = P.hand.splice(i, 1)[0];
        say("手札から呼び出す");
        return summon(b, s, steps, mon(k), "special");
      }
      case "revive": {
        const gk = P.grave.filter((g) => POOL[g] && POOL[g].kind === "monster" && POOL[g].lv <= (n || 9) && g !== src.key).sort((x, y) => POOL[y].atk - POOL[x].atk)[0];
        if (!gk || P.field.length >= ZONES) return;
        P.grave.splice(P.grave.indexOf(gk), 1);
        steps.push({ t: "effect", side: s, text: `墓地から${POOL[gk].name}がよみがえる!` });
        return summon(b, s, steps, mon(gk), "revive");
      }
      case "destroy": { const t = strongest(O.field); return t && destroy(b, os, t, steps, `${src.name}で`); }
      case "snipe": { const t = weakest(O.field); return t && destroy(b, os, t, steps, `${src.name}で`); }
      case "sweep": { for (const t of O.field.filter((m) => m.atk <= n)) destroy(b, os, t, steps, `${src.name}で`); return; }
      case "weaken": { const t = strongest(O.field); if (!t) return; t.atk = Math.max(0, t.atk - n); return say(`${t.name}の攻撃力-${n}(${t.atk})`); }
      case "weakenAll": { if (!O.field.length) return; for (const t of O.field) t.atk = Math.max(0, t.atk - n); return say(`相手のモンスター全部の攻撃力-${n}`); }
      case "boost": { const t = target || strongest(P.field); if (!t) return; t.boost = (t.boost || 0) + n; return steps.push({ t: "effect", side: s, text: `${t.name}の攻撃力+${n}!` }); }
      case "boostAll": { if (!P.field.length) return; P.field.forEach((m) => (m.boost = (m.boost || 0) + n)); return steps.push({ t: "effect", side: s, text: `全員の攻撃力+${n}!` }); }
      case "grow": return (src.atk += n), say(`攻撃力+${n}(${src.atk})`);
      case "search": {
        const want = P.deck.filter((k) => POOL[k].kind === "monster" && (!POOL[k].need || P.spc >= POOL[k].need)).sort((x, y) => POOL[y].atk - POOL[x].atk)[0];
        if (!want) return;
        P.deck.splice(P.deck.indexOf(want), 1);
        P.hand.push(want);
        return say("デッキからモンスターを手札に加える");
      }
      case "setTrap": {
        const k = P.deck.find((x) => POOL[x].kind === "trap");
        if (!k || P.sets.length >= SETS) return;
        P.deck.splice(P.deck.indexOf(k), 1);
        P.sets.push(k);
        say("デッキから罠を伏せる");
        return steps.push({ t: "set", side: s, n: 1, keys: [k] });
      }
      case "discard": {
        if (!O.hand.length) return;
        const k = O.hand.splice(Math.floor(rnd(b) * O.hand.length), 1)[0];
        O.grave.push(k);
        return say(`相手の手札を1枚捨てさせた${s === "you" ? `(${POOL[k].name})` : ""}`);
      }
      case "bounce": {
        const t = strongest(O.field);
        if (!t) return;
        O.field = O.field.filter((x) => x !== t);
        if (t.key && POOL[t.key]) O.hand.push(t.key);
        say(`${t.name}を手札に戻す`);
        return steps.push({ t: "destroy", side: os, mon: t, why: "手札に戻された" });
      }
      case "extra": return (P.extraSummon = (P.extraSummon || 0) + 1), say("もう1回、通常召喚できる");
    }
  }
  // 「いつ」が合う効果を全部
  function fire(b, s, steps, src, on, ctx) {
    for (const e of effs(src)) if (e.on === on && ok(b, s, src, e, ctx)) exec(b, s, steps, src, e);
  }

  function summon(b, s, steps, m, how) {
    const P = b[s];
    if (P.field.length >= ZONES) return false;
    P.field.push(m);
    steps.push({ t: "summon", side: s, mon: m, how });
    fire(b, s, steps, m, "summon");
    return true;
  }

  function damage(b, s, steps, n, why) {
    const O = b[s === "you" ? "opp" : "you"];
    O.lp = Math.max(0, O.lp - n);
    steps.push({ t: "burn", side: s, dmg: n, why });
  }

  // 場のモンスターの攻撃力(強化・仲間の効果・SPCなどを足したもの)。defending: 攻撃されている側
  function power(b, s, m, defending) {
    const P = b[s], O = b[other(s)];
    let a = m.atk + (m.boost || 0);
    for (const e of effs(m)) {
      if (e.on !== "cont") continue;
      if (e.do === "themeUp") a += e.n * P.field.filter((x) => x !== m && x.th && x.th === m.th).length;
      else if (e.do === "rage" && P.lp < O.lp) a += e.n;
      else if (e.do === "spcUp") a += e.n * P.spc;
      else if (e.do === "wall" && defending) a += e.n;
    }
    for (const x of P.field) if (x !== m) for (const e of effs(x)) if (e.on === "cont" && e.do === "aura") a += e.n;
    return Math.max(0, a);
  }

  // チェーン: 発動したカード(link0)に、相手→自分→相手…と割り込みのカードを重ねる。最後に重ねたものから順に効く
  // trigger: { kind: "attack" | "spell", side, card?, attacker? }
  const ATK_TRAPS = ["negateAtk", "reflectDmg", "killAtk", "bounceAtk", "drainAtk", "onAtk"];
  function runChain(b, steps, trigger) {
    const links = [{ side: trigger.side, card: trigger.card, base: true }];
    let responder = trigger.side === "you" ? "opp" : "you";
    let passes = 0;
    while (passes < 2 && links.length < 7) {
      const P = b[responder];
      const top = links[links.length - 1];
      const firstReply = links.length === 1;
      const want = (k) => {
        const e = main(POOL[k]);
        if (!e || e.on !== "trap") return false;
        if (e.do === "counter") return top.card && (top.card.kind === "spell" || top.card.kind === "trap") && top.side !== responder; // 相手の魔法・罠を止める
        if (e.do === "chainBurn") return links.length >= 2;
        if (!firstReply || trigger.kind !== "attack" || responder === trigger.side) return false;
        if (!ok(b, responder, POOL[k], e, trigger)) return false;
        if (ATK_TRAPS.includes(e.do)) return true;
        if (e.do === "guardUp") return b[responder].field.length > 0;
        return false;
      };
      const i = P.sets.findIndex(want);
      // 相手も毎回は使わない(読み合いの幅)
      if (i >= 0 && rnd(b) < (main(POOL[P.sets[i]]).do === "chainBurn" ? 0.9 : 0.8)) {
        const k = P.sets.splice(i, 1)[0];
        P.grave.push(k);
        if (responder === "you") b.used.push(POOL[k].name);
        links.push({ side: responder, card: card(k), key: k });
        passes = 0;
      } else passes++;
      responder = responder === "you" ? "opp" : "you";
    }
    if (links.length === 1) return { negated: false, links };
    steps.push({ t: "chain", links: links.map((l, i) => ({ side: l.side, key: l.key, name: l.card ? l.card.name : trigger.attacker ? `${trigger.attacker.name}の攻撃` : "", icon: l.card ? l.card.icon : "⚔️", n: i + 1, kind: l.card ? l.card.kind : "attack" })) });
    // 後ろから解決
    const negated = new Set();
    const out = { negated: false, killAtk: false, reflect: false, bounce: false, guardUp: 0, links };
    for (let i = links.length - 1; i >= 1; i--) {
      if (negated.has(i)) {
        steps.push({ t: "resolve", n: i + 1, text: `チェーン${i + 1} ${links[i].card.name}は無効!`, side: links[i].side });
        continue;
      }
      const L = links[i], e = main(L.card), fx = e.do;
      const res = (text) => steps.push({ t: "resolve", n: i + 1, side: L.side, text: `チェーン${i + 1} ${L.card.name}! ${text}` });
      if (fx === "counter") (negated.add(i - 1), res(`チェーン${i}を無効にする`));
      else if (fx === "chainBurn") damage(b, L.side, steps, links.length * (e.n || 400), `チェーン${i + 1} ${L.card.name}(${links.length}チェーン)`);
      else if (fx === "negateAtk") ((out.negated = true), res("攻撃を無効に"));
      else if (fx === "reflectDmg") ((out.negated = out.reflect = true), res("攻撃をはね返す"));
      else if (fx === "killAtk") ((out.killAtk = true), res("攻撃モンスターを破壊"));
      else if (fx === "bounceAtk") ((out.negated = out.bounce = true), res("攻撃モンスターを手札に戻す"));
      else if (fx === "drainAtk") {
        if (trigger.attacker) trigger.attacker.atk = Math.max(0, trigger.attacker.atk - e.n);
        res(`攻撃モンスターの攻撃力-${e.n}`);
      } else if (fx === "guardUp") ((out.guardUp += e.n || 800), res(`守るモンスターの攻撃力+${e.n || 800}`));
      else if (fx === "onAtk") res("発動!");
      // おまけの効果
      for (const x of effs(L.card)) if (x.on === "also" && ok(b, L.side, L.card, x, trigger)) exec(b, L.side, steps, L.card, x);
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
    const ch = c.noChain ? { negated: false } : runChain(b, steps, { kind: "spell", side: s, card: c });
    if (ch.negated) return steps.push({ t: "resolve", side: s, text: `${c.name}は無効になった…` }), false;
    for (const e of effs(c)) {
      if (e.on !== "cast" || !ok(b, s, c, e)) continue;
      if (e.do === "destiny") {
        const t = strongest(O.field);
        if (t) destroy(b, other(s), t, steps, `${c.name}で`);
        if (P.field.length >= ZONES) {
          const weak = weakest(P.field);
          P.field = P.field.filter((x) => x !== weak);
          if (weak.key) P.grave.push(weak.key);
        }
        summon(b, s, steps, Object.assign({ uid: uid() }, ACE), "ace");
      } else exec(b, s, steps, c, e, target);
    }
    return true;
  }

  // 破壊する。o.quiet: できごとの一覧に出さない(戦闘の結果として別に出すとき)。o.mat: シンクロの素材(破壊された時の効果は出ない)
  function destroy(b, s, m, steps, why, o) {
    const P = b[s];
    if (!P.field.includes(m)) return;
    P.field = P.field.filter((x) => x !== m);
    if (m.key && POOL[m.key]) P.grave.push(m.key);
    if (!(o && o.quiet)) steps.push({ t: "destroy", side: s, mon: m, why });
    if (!(o && (o.mat || o.later))) fire(b, s, steps, m, "dead");
  }

  // シンクロ召喚: チューナー1体+ほか1〜2体で、レベルの合計がぴったりのシンクロモンスター(強いほう)を出す
  function trySynchro(b, s, steps) {
    const P = b[s];
    const tuners = P.field.filter((m) => m.tuner);
    const others = P.field.filter((m) => !m.tuner && !m.synchro);
    const ex = extraOf(b, s);
    let best = null;
    for (const t of tuners) {
      const combos = [];
      for (let i = 0; i < others.length; i++) {
        combos.push([others[i]]);
        for (let j = i + 1; j < others.length; j++) combos.push([others[i], others[j]]);
      }
      for (const cmb of combos) {
        const lv = t.lv + cmb.reduce((a, m) => a + m.lv, 0);
        const sy = ex.filter((x) => x.lv === lv).sort((x, y) => y.atk - x.atk)[0];
        const now = t.atk + cmb.reduce((a, m) => a + m.atk, 0);
        if (sy && (!best || sy.atk > best.sy.atk) && (sy.atk > Math.max(t.atk, ...cmb.map((m) => m.atk)) || now < sy.atk + 800)) best = { sy, mats: [t, ...cmb] };
      }
    }
    if (!best) return false;
    for (const m of best.mats) destroy(b, s, m, [], "", { quiet: true, mat: true });
    // シンクロモンスターは墓地に行かない(key を持たせない)
    const sm = Object.assign({}, best.sy, { uid: uid(), key: undefined });
    steps.push({ t: "tune", side: s, from: best.mats.map((m) => `${m.name}(Lv${m.lv})`), mats: best.mats.map((m) => m.uid), lv: best.sy.lv });
    summon(b, s, steps, sm, "synchro");
    return true;
  }

  // 手札のモンスターを出す順番を決める点数
  function summonScore(c, P, haveTuner) {
    let sc = c.atk + (c.need ? 600 : 0) + (c.tuner && !haveTuner && P.field.length ? 1000 : 0);
    for (const e of effs(c)) sc += e.do === "call" ? 900 : e.on === "summon" ? 350 : e.on === "cont" ? 250 : 150;
    return sc;
  }

  // メインフェイズ(自動): 引く→スペルで手札を増やす→召喚→シンクロ→除去・回復・バーン→罠を伏せる
  function mainPhase(b, s, steps) {
    const P = b[s], O = b[s === "you" ? "opp" : "you"];
    // 使えるスペル(いちばんの効果が kinds のどれか)を探す
    const hasSpell = (...kinds) =>
      P.hand.findIndex((k) => {
        const c = POOL[k], e = c.kind === "spell" && main(c);
        return e && kinds.includes(e.do) && P.spc >= (c.cost || 0) && ok(b, s, c, e);
      });
    let i, guard = 0;
    // 運命のカードは最優先
    if ((i = P.hand.indexOf("destiny")) >= 0) castSpell(b, s, steps, i);
    // SPCをためる・手札を増やす
    while ((i = hasSpell("charge", "search", "draw")) >= 0 && guard++ < 6) castSpell(b, s, steps, i);
    if ((i = hasSpell("setTrap")) >= 0 && P.sets.length < SETS) castSpell(b, s, steps, i);
    if ((i = hasSpell("extra")) >= 0 && P.hand.filter((k) => POOL[k].kind === "monster").length >= 2) castSpell(b, s, steps, i);
    // 通常召喚(ふつうは1回)。シンクロにつながる組み合わせを優先
    for (let n = 1 + (P.extraSummon || 0); n > 0 && P.field.length < ZONES; n--) {
      const monsters = P.hand.map((k, j) => ({ k, j, c: POOL[k] })).filter((x) => x.c.kind === "monster" && (!x.c.need || P.spc >= x.c.need));
      if (!monsters.length) break;
      const haveTuner = P.field.some((m) => m.tuner);
      monsters.sort((x, y) => summonScore(y.c, P, haveTuner) - summonScore(x.c, P, haveTuner));
      const pickM = monsters[0];
      P.hand.splice(pickM.j, 1);
      summon(b, s, steps, mon(pickM.k), "normal");
    }
    P.extraSummon = 0;
    // 墓地から
    if ((i = hasSpell("revive")) >= 0 && P.field.length < ZONES && P.grave.some((g) => POOL[g] && POOL[g].kind === "monster")) castSpell(b, s, steps, i);
    // シンクロ(2回まで)
    for (let n = 0; n < 2 && trySynchro(b, s, steps); n++);
    // 相手のほうが強いモンスターを出していたら、どかす・弱らせる
    for (let n = 0; n < 2; n++) {
      const myTop = Math.max(0, ...P.field.map((m) => power(b, s, m)));
      const theirTop = strongest(O.field);
      if (!theirTop || power(b, other(s), theirTop, true) < myTop) break;
      if ((i = hasSpell("destroy", "bounce", "weaken", "weakenAll", "sweep", "snipe")) < 0) break;
      castSpell(b, s, steps, i);
    }
    // 回復
    if (P.lp < LP0 * 0.6 && (i = hasSpell("heal")) >= 0) castSpell(b, s, steps, i);
    // バーン: 相手のLPが減っていたら、または余っていたら撃つ
    guard = 0;
    while ((i = hasSpell("burn")) >= 0 && guard++ < 3 && (O.lp <= 3000 || rnd(b) < 0.6)) castSpell(b, s, steps, i);
    // 手札を捨てさせる
    if (O.hand.length >= 2 && (i = hasSpell("discard")) >= 0 && rnd(b) < 0.7) castSpell(b, s, steps, i);
    // 罠を伏せる
    const keys = [];
    for (let j = P.hand.length - 1; j >= 0 && P.sets.length < SETS; j--) if (POOL[P.hand[j]].kind === "trap") P.sets.push(P.hand[j]), keys.push(P.hand.splice(j, 1)[0]);
    if (keys.length) steps.push({ t: "set", side: s, n: keys.length, keys });
  }

  // バトルフェイズ: 強い順に攻撃。勝てる相手を選び、勝てなければ強化スペルを使ってから殴る
  function battlePhase(b, s, steps, ratio) {
    const P = b[s], O = b[s === "you" ? "opp" : "you"];
    const ds = s === "you" ? "opp" : "you";
    const pw = (m) => r50(power(b, s, m) * ratio);
    const df = (t, up) => power(b, ds, t, true) + (up || 0);
    // 全体強化: 仲間が2体以上いて、相手にモンスターがいるか、とどめに届くとき
    const all = P.hand.findIndex((k) => POOL[k].kind === "spell" && main(POOL[k]).do === "boostAll" && P.spc >= (POOL[k].cost || 0));
    if (all >= 0 && P.field.length >= 2 && (O.field.length || O.lp <= 3500)) castSpell(b, s, steps, all);
    const queue = [];
    for (const m of P.field.slice().sort((x, y) => y.atk - x.atk)) (queue.push(m), has(m, "cont", "twin") && queue.push(m));
    for (const m of queue) {
      if (!P.field.includes(m) || O.lp <= 0) continue;
      let target = O.field.filter((t) => pw(m) > df(t)).sort((x, y) => y.atk - x.atk)[0] || null;
      let half = false;
      if (!target && O.field.length) {
        const top = O.field.slice().sort((x, y) => df(y) - df(x))[0];
        const bi = P.hand.findIndex((k) => POOL[k].kind === "spell" && main(POOL[k]).do === "boost" && P.spc >= (POOL[k].cost || 0));
        if (bi >= 0 && pw(m) + r50(main(POOL[P.hand[bi]]).n * ratio) > df(top)) {
          castSpell(b, s, steps, bi, m);
          if (pw(m) > df(top)) target = top;
        }
        // すり抜け: 勝てる相手がいない時、攻撃力を半分にして直接攻撃
        if (!target && has(m, "cont", "sneak")) half = true;
        if (!target && !half) continue;
      }
      const step = { t: "attack", side: s, mon: m, power: half ? r50(pw(m) / 2) : pw(m), target };
      const ch = runChain(b, steps, { kind: "attack", side: s, attacker: m });
      const pow = half ? r50(pw(m) / 2) : pw(m); // 罠で弱らされたあとの攻撃力
      step.power = pow;
      if (ch.reflect) {
        steps.push(Object.assign(step, { result: "negated" }));
        damage(b, ds, steps, r50(pow / 2), "はね返し");
        continue;
      }
      if (ch.bounce) {
        steps.push(Object.assign(step, { result: "negated" }));
        P.field = P.field.filter((x) => x !== m);
        if (m.key && POOL[m.key]) P.hand.push(m.key);
        steps.push({ t: "destroy", side: s, mon: m, why: "罠で手札に戻された" });
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
      const dead = []; // [side, mon] 戦闘で破壊されたモンスター(できごとを出したあとで、破壊された時の効果を出す)
      let killed = false;
      if (target && O.field.includes(target)) {
        const ta = df(target, ch.guardUp);
        if (pow > ta) {
          if (has(target, "cont", "guard") && !target.guarded) {
            target.guarded = true;
            step.result = "guard";
            step.dmg = r50((pow - ta) * DMG);
          } else {
            destroy(b, ds, target, [], "", { quiet: true, later: true });
            dead.push([ds, target]);
            killed = true;
            step.result = "destroy";
            step.dmg = r50((pow - ta) * DMG);
          }
        } else if (pow < ta) {
          destroy(b, s, m, [], "", { quiet: true, later: true });
          step.result = "repel";
          step.dmg = r50((ta - pow) * DMG);
          P.lp = Math.max(0, P.lp - step.dmg);
          steps.push(step);
          fire(b, s, steps, m, "dead");
          continue;
        } else {
          destroy(b, ds, target, [], "", { quiet: true, later: true });
          destroy(b, s, m, [], "", { quiet: true, later: true });
          dead.push([ds, target], [s, m]);
          step.result = "both";
          step.dmg = 0;
        }
      } else {
        step.target = null;
        step.result = "direct";
        step.dmg = r50(pow * DMG);
      }
      O.lp = Math.max(0, O.lp - (step.dmg || 0));
      steps.push(step);
      for (const [sd, dm] of dead) fire(b, sd, steps, dm, "dead");
      if (!P.field.includes(m)) continue;
      // 攻撃したあとの効果
      if (has(m, "cont", "drain") && step.dmg) (P.lp += r50(step.dmg / 2)), steps.push({ t: "effect", side: s, text: `${m.name}の効果! LP+${r50(step.dmg / 2)}`, heal: r50(step.dmg / 2) });
      if (O.lp > 0) for (const e of effs(m)) if (e.on === "hit" && ok(b, s, m, e)) e.do === "burn" ? damage(b, s, steps, e.n, `${m.name}の追撃`) : exec(b, s, steps, m, e);
      if (killed) fire(b, s, steps, m, "kill");
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
    const lp0 = { you: b.you.lp, opp: b.opp.lp };
    // ターンが始まる前の盤面(画面で1手ずつ再生するため)
    const snap = (Q) => ({ lp: Q.lp, spc: Q.spc, hand: Q.hand.slice(), field: Q.field.map((m) => Object.assign({}, m)), sets: Q.sets.slice(), deck: Q.deck.length, grave: Q.grave.length });
    const before = { you: snap(b.you), opp: snap(b.opp) };
    P.spc = Math.min(SPC_MAX, P.spc + 1);
    b.fxN = 0;
    // 運命のドロー: ピンチ(LP3000以下で負けている)のとき、前の区間をゴーストと同じかそれより速く走れていたら、
    // デッキの一番上が運命のカードになる(ライバル1人につき1回)
    let destiny = false;
    if (side === "you" && b.you.lp <= 3000 && b.you.lp < b.opp.lp && ratio >= 1 && b.destinyFoe !== b.foe) {
      b.destinyFoe = b.foe;
      b.you.deck.push("destiny");
      P.spc = Math.min(SPC_MAX, P.spc + 3);
      destiny = true;
    }
    // 背水の陣: 大きく負けている側は、1枚多く引いてSPCも増える(逆転の逆転が起きるように)
    if (b[side].lp <= b[other].lp - 2500 && b.turn > 2) {
      P.spc = Math.min(SPC_MAX, P.spc + 2);
      steps.push({ t: "effect", side, rally: true, text: side === "you" ? "背水の陣! 1枚多くドロー・SPC+2" : `${foeOf(b).name}の背水の陣! 1枚多くドロー・SPC+2` });
      draw(b, side, steps, 1, "背水の陣");
    }
    draw(b, side, steps, 1);
    if (destiny) steps[steps.length - 1].destiny = true;
    // ターンの始めの効果(場のモンスター)
    for (const m of P.field.slice()) if (P.field.includes(m)) fire(b, side, steps, m, "turn");
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
    const drama = judge(b, side, steps, lp0, destiny);
    // ピンチになったら、次の区間で全力を出せば運命のドローがあることを知らせる
    drama.hint = side === "opp" && b.you.lp <= 3000 && b.you.lp < b.opp.lp && b.destinyFoe !== b.foe && !b.pendingFoe;
    return { turn: b.turn, side, ratio, steps, acts, drama, lp0, before, you: b.you, opp: b.opp, foe: foeOf(b), deckLeft: b.you.deck.length };
  }

  // このターンの「熱さ」: 逆転・ピンチ・運命のドロー・エースやシンクロ・長いチェーン・大ダメージ・決着
  function judge(b, side, steps, lp0, destiny) {
    const tags = [];
    const lead0 = lp0.you - lp0.opp, lead1 = b.you.lp - b.opp.lp;
    const win = steps.find((x) => x.t === "win");
    if (win) tags.push(win.side === "you" ? "win" : "lose");
    if (lead0 <= -500 && lead1 > 0) tags.push("reversal");
    if (lead0 >= 500 && lead1 < 0) tags.push("reversed");
    if (destiny) tags.push("destiny");
    if (lp0.you > 3000 && b.you.lp <= 3000 && b.you.lp > 0) tags.push("pinch");
    if (steps.some((x) => x.t === "summon" && x.how === "synchro")) tags.push("synchro");
    if (steps.some((x) => x.t === "summon" && (x.mon.atk >= 2500 || x.how === "ace") && x.how !== "synchro")) tags.push("ace");
    if (steps.some((x) => x.t === "chain" && x.links.length >= 3)) tags.push("bigchain");
    const dmg = Math.max(lp0.you - b.you.lp, lp0.opp - b.opp.lp);
    if (dmg >= 2000) tags.push("bigdmg");
    const W = { win: 10, lose: 8, reversal: 9, reversed: 7, destiny: 9, pinch: 6, synchro: 5, ace: 4, bigchain: 5, bigdmg: 3 };
    const score = tags.reduce((a, t) => a + W[t], 0);
    return { tags, score, dmg, side };
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
  // 自分のデッキ(テーマのID。null=スピード・ロード)とエクストラ
  const myDeck = () => {
    const th = myTheme();
    return { th, keys: th ? G.deck(th) : YOU_DECK, extra: th ? G.extra(th) : SYNCHROS.you };
  };
  return { LP0, ZONES, STEP_M, FOES, POOL, YOU_DECK, SYNCHROS, ACE, state, deal, step, verdict, summary, foeOf, cardOf, effs, myDeck };
})();

if (typeof module !== "undefined") module.exports = Battle;

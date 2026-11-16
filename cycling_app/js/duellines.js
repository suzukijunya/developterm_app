// デュエルで話すセリフを1か所にまとめる。
// アプリ・演出はここの関数でセリフを作り、音声パック(AivisSpeech で Mac で作る)はここの all() で全部のセリフを数え上げる。
// 返り値は [セリフ, 話す側("you"/"opp"), 演技("shout"=叫ぶ/"low"=溜め/""=ふつう)]。
// 音声パックで鳴らせるように、数字(ダメージ・LP)はセリフに入れない(数字は画面で見せる)。

const DuelLines = (() => {
  const L = {
    stopped: () => ["止まりすぎた…", "you", "low"],
    ghostPass: () => ["ゴーストを抜いた! このまま突っ切るぜ!", "you", "shout"],
    ghostPassed: () => ["抜かれたか…まだだ、ここからだ!", "you", "low"],
    accel: () => ["ライディング・デュエル、アクセラレーション!", "you", "shout"],
    foeIntro: (f) => [`相手は${f.name}。デッキは${f.deckName}!`, "opp", ""],
    firstDraw: () => ["俺の先攻だ。ドロー!", "you", "shout"],
    partner: (name) => [`限界を超えろ! 俺の相棒、${name}、シンクロ召喚!`, "you", "shout"],
    endWin: () => ["俺の勝ちだ。いいライディングだったぜ", "you", ""],
    endLose: () => ["負けたか…次は必ず追い抜く。もう一度、走り出すだけだ", "you", "low"],
    endFirst: () => ["デュエル終了。次はこの走りがゴーストになる", "you", ""],
    newRival: (f) => [`新たなライバル、${f.name}! デッキは${f.deckName}か…`, "opp", ""],
    rivalEnter: (f) => [`${f.name}、参上! デッキは${f.deckName}!`, "opp", "shout"],
    ko: (foeName) => [`これで終わりだ! ${foeName}、撃破!`, "you", "shout"],
    lifeZero: () => ["ライフが…ゼロに…。だが、まだ走れる!", "you", "low"],
    chain: (n, side) => [`チェーン${n}! 最後に重ねたカードから解決だ!`, side, "shout"],
    trap: (name, side) => [`罠発動! ${name}!`, side, "shout"],
    synchroCall: (mon, side) => (side === "you" ? [`チューニング! シンクロ召喚! 来い、${mon}!`, "you", "shout"] : [`シンクロ召喚! 現れろ、${mon}!`, "opp", "shout"]),
    combo: (n, side) => (side === "you" ? [`${n}連続コンボ! まだまだ行くぜ!`, "you", "shout"] : [`${n}連続コンボ…ついて来られるか?`, "opp", "low"]),
    direct: (side) => (side === "you" ? ["ダイレクトアタック! 大ダメージだ!", "you", "shout"] : ["ダイレクトアタックだ。耐えられるか?", "opp", "low"]),
    burn: (side) => (side === "you" ? ["効果ダメージ! 一気に削る!", "you", "shout"] : ["バーンで焼き尽くしてやる…!", "opp", "low"]),
    myDraw: () => ["俺のターン! ドロー!!", "you", "shout"],
    destinyFull: () => ["運命の…ドロー!! 来い、ソニック・ストリーム・ドラゴン!", "you", "shout"],
    reversal: () => ["逆転だ!! ここからが、本当の勝負だ!", "you", "shout"],
    reversed: (foeName) => [`${foeName}に逆転された…!?`, "you", "low"],
    pinchHint: () => ["LPが残りわずか…次の区間、全力で踏めば、運命のドローだ!", "you", "low"],
    pinchShort: () => ["まだだ…次の区間、全力で踏めば…!", "you", "low"],
    pinch: () => ["くっ…LPが、もう残りわずか…!", "you", "low"],
    deckOut: () => ["デッキが尽きた! ここからは手札だけで勝負だ!", "you", "shout"],
    duel: () => ["デュエル!!", "you", "shout"],
    notHere: () => ["ここで…終わるわけには、いかない…!", "you", "low"],
    destinyDraw: () => ["運命の…ドロー!!", "you", "shout"],
    thisCard: () => ["このカードは…!", "you", "low"],
    activate: (card) => [`${card}、発動!!`, "you", "shout"],
    synchroChant: (side) => (side === "you" ? ["光を束ねて、道を切り拓け! シンクロ召喚!", "you", "shout"] : ["闇を束ねろ…シンクロ召喚!", "opp", "low"]),
    summonCry: (mon, side) => (side === "you" ? [`走れ、${mon}!!`, "you", "shout"] : [`現れたのは…${mon}!`, "you", "low"]),
    aceCall: (mon, side) => (side === "you" ? [`来い! ${mon}!!`, "you", "shout"] : [`来い、${mon}!`, "opp", "shout"]),
    glare: () => ["この一撃で…決める!", "you", "low"],
    attack: (mon, side, direct) => (side === "you" ? [`行け、${mon}! ${direct ? "ダイレクトアタック!" : "攻撃!"}`, "you", "shout"] : [`${mon}、攻撃だ!`, "opp", "shout"]),
    glareStart: (foeName) => [`${foeName}…勝負だ!`, "you", "low"],
    chant: (text, side) => [text, side, "shout"],
  };

  // 話す可能性のあるセリフを全部(音声パック用)。ctx: { partner: 相棒の名前 }
  function all(ctx = {}) {
    const B = typeof Battle !== "undefined" ? Battle : null;
    const out = [];
    const add = (x) => out.push(x);
    for (const [k, f] of Object.entries(L)) if (f.length === 0) add(f());
    if (ctx.partner) add(L.partner(ctx.partner));
    if (!B) return dedupe(out);
    const P = B.POOL;
    const foes = B.FOES;
    for (const f of foes) [L.foeIntro(f), L.newRival(f), L.rivalEnter(f), L.ko(f.name), L.reversed(f.name), L.glareStart(f.name)].forEach(add);
    const traps = [...new Set(Object.values(P).filter((c) => c.kind === "trap").map((c) => c.name))];
    for (const t of traps) for (const s of ["you", "opp"]) add(L.trap(t, s));
    for (const s of ["you", "opp"]) {
      for (let n = 2; n <= 7; n++) add(L.chain(n, s));
      for (let n = 5; n <= 20; n++) add(L.combo(n, s));
      add(L.direct(s));
      add(L.burn(s));
      add(L.synchroChant(s));
    }
    const youMons = [...new Set(B.YOU_DECK.filter((k) => P[k].kind === "monster").map((k) => P[k]))];
    const oppMons = [...new Set(foes.flatMap((f) => f.deck).filter((k) => P[k].kind === "monster").map((k) => P[k]))];
    const youSyn = B.SYNCHROS.you.concat([B.ACE]);
    const oppSyn = B.SYNCHROS.opp;
    for (const m of youMons.concat(youSyn)) for (const d of [true, false]) add(L.attack(m.name, "you", d));
    for (const m of oppMons.concat(oppSyn)) add(L.attack(m.name, "opp", true));
    for (const m of youSyn) {
      add(L.synchroCall(m.name, "you"));
      add(L.summonCry(m.name, "you"));
      add(L.aceCall(m.name, "you"));
      if (typeof Board !== "undefined") add(L.chant(Board.chant(m, "you"), "you"));
    }
    for (const m of oppSyn.concat(oppMons.filter((x) => x.atk >= 2500))) {
      add(L.synchroCall(m.name, "opp"));
      add(L.summonCry(m.name, "opp"));
      add(L.aceCall(m.name, "opp"));
      if (typeof Board !== "undefined") add(L.chant(Board.chant(m, "opp"), "opp"));
    }
    const destiny = P.destiny;
    if (destiny) add(L.activate(destiny.name));
    return dedupe(out);
  }
  function dedupe(list) {
    const seen = new Set();
    return list.filter(([t, s]) => {
      const k = s + "|" + t;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  return Object.assign({ all }, L);
})();

if (typeof module !== "undefined") module.exports = DuelLines;

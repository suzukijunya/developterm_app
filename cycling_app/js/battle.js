// デュエルモードのバトル: 1km走るごとに1ターン進み、自分とゴースト(いつもの自分。記録がなければ練習相手)が交互に
// ドロー → モンスター召喚 → 攻撃をする。攻撃力は、その1kmを実際にゴーストより速く走れたかで上下する。
// 走りながら画面を触らなくていいように、すべて自動で進む。状態は ride.duel.b に持つ。

const Battle = (() => {
  const D = typeof Duel !== "undefined" ? Duel : require("./duel.js");
  const LP0 = 4000;
  const ZONES = 3;
  const MON = [
    { id: "sprocket", name: "スプロケット・ナイト", lv: 3, atk: 1300, icon: "⚙️" },
    { id: "chain", name: "チェーン・ウルフ", lv: 4, atk: 1600, icon: "🐺", tuner: true },
    { id: "aero", name: "エアロ・ファルコン", lv: 5, atk: 2100, icon: "🦅" },
    { id: "spoke", name: "スポーク・ガーディアン", lv: 4, atk: 1500, icon: "🛡️", tuner: true },
    { id: "carbon", name: "カーボン・ドラゴン", lv: 7, atk: 2600, icon: "🐉" },
  ];
  const SYNCHRO = { id: "stream", name: "ストリーム・ドラゴン", lv: 8, atk: 3000, icon: "🐲", synchro: true };
  const GHOST = [
    { id: "g1", name: "ゴースト・ライダー", lv: 3, atk: 1400, icon: "👻" },
    { id: "g2", name: "ファントム・ホイール", lv: 4, atk: 1800, icon: "🌀" },
    { id: "g3", name: "シャドウ・スプリンター", lv: 6, atk: 2300, icon: "🌑" },
    { id: "g4", name: "ナイトメア・ペロトン", lv: 7, atk: 2700, icon: "💀" },
  ];
  const GHOST_TRAP = { name: "ファントム・バリア", text: "攻撃を1回無効にする" };

  const r50 = (x) => Math.round(x / 50) * 50;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function state(ride) {
    const d = D.state(ride);
    if (!d.b) d.b = { turn: 0, you: { lp: LP0, field: [] }, opp: { lp: LP0, field: [] }, seed: ((ride.startedAt || 1) % 7919) + 7, segT: null, segD: 0, winner: null, oppTrap: 1 };
    return d.b;
  }

  function rnd(b) {
    b.seed = (b.seed * 1103515245 + 12345) % 2147483648;
    return b.seed / 2147483648;
  }
  const pick = (b, list) => list[Math.floor(rnd(b) * list.length)];

  // 攻撃。atkSide が defSide を攻撃する
  function attack(b, steps, ride, atkSide, defSide, power, attacker) {
    const A = b[atkSide], Df = b[defSide];
    const target = Df.field.slice().sort((x, y) => y.atk - x.atk)[0] || null;
    const step = { t: "attack", side: atkSide, mon: attacker, power, target };
    // トラップ: 自分(you)は手札のバトル用トラップ、ゴーストは1回だけバリアを持つ
    if (defSide === "you") {
      const trap = D.useTrap(ride, ["negate", "half"]);
      if (trap) {
        steps.push({ t: "trap", side: "you", card: trap });
        if (trap.battle === "negate") {
          step.result = "negated";
          steps.push(step);
          return;
        }
        step.half = true;
      }
    } else if (b.oppTrap > 0 && rnd(b) < 0.3) {
      b.oppTrap--;
      steps.push({ t: "trap", side: "opp", card: GHOST_TRAP });
      step.result = "negated";
      steps.push(step);
      return;
    }
    const k = step.half ? 0.5 : 1;
    if (target) {
      if (power > target.atk) {
        Df.field = Df.field.filter((m) => m !== target);
        step.dmg = r50((power - target.atk) * 0.6 * k);
        step.result = "destroy";
      } else if (power < target.atk) {
        A.field = A.field.filter((m) => m !== attacker);
        step.dmg = r50((target.atk - power) * 0.6);
        step.result = "repel";
        A.lp = Math.max(0, A.lp - step.dmg);
        steps.push(step);
        return;
      } else {
        Df.field = Df.field.filter((m) => m !== target);
        A.field = A.field.filter((m) => m !== attacker);
        step.dmg = 0;
        step.result = "both";
      }
    } else {
      step.dmg = r50(power * 0.4 * k);
      step.result = "direct";
    }
    Df.lp = Math.max(0, Df.lp - (step.dmg || 0));
    steps.push(step);
  }

  // 測位ごとに呼ぶ。1km進んだら1ターン分のできごとを返す(なければ null)
  // ghostSpeed: ゴーストの速さ(信号待ち込み m/s)。spc: いまのスピードカウンター
  function step(ride, ghostSpeed, spc) {
    const b = state(ride);
    const t = ride.last ? ride.last.t : Date.now();
    if (b.segT == null) b.segT = ride.startedAt || t;
    if (b.winner || Math.floor(ride.distance / 1000) <= b.turn) return null;
    b.turn++;
    const pace = (ride.distance - b.segD) / Math.max(1, (t - b.segT) / 1000);
    b.segD = ride.distance;
    b.segT = t;
    const ratio = clamp(pace / ghostSpeed, 0.6, 1.5); // 1より大きいほど、この1kmはゴーストより速かった
    const side = b.turn % 2 ? "you" : "opp";
    const other = side === "you" ? "opp" : "you";
    const me = b[side];
    const steps = [];
    let card = null;
    if (side === "you") {
      card = D.drawCard(ride);
      steps.push({ t: "draw", side, card });
      // シンクロ召喚: SPCが8以上で、チューナーと別のモンスターがいるとき
      const tuner = me.field.find((m) => m.tuner);
      const partner = me.field.find((m) => m !== tuner && !m.synchro);
      if (spc >= 8 && tuner && partner && !me.field.some((m) => m.synchro)) {
        me.field = me.field.filter((m) => m !== tuner && m !== partner);
        const s = Object.assign({}, SYNCHRO);
        me.field.push(s);
        steps.push({ t: "summon", side, mon: s, synchro: true, from: [tuner.name, partner.name] });
      } else if (me.field.length < ZONES) {
        const maxLv = 3 + Math.floor(spc / 3);
        const m = Object.assign({}, pick(b, MON.filter((x) => x.lv <= maxLv)));
        me.field.push(m);
        steps.push({ t: "summon", side, mon: m });
      }
    } else {
      steps.push({ t: "draw", side });
      if (me.field.length < ZONES) {
        const maxLv = 3 + Math.floor(b.turn / 3);
        const m = Object.assign({}, pick(b, GHOST.filter((x) => x.lv <= maxLv)));
        me.field.push(m);
        steps.push({ t: "summon", side, mon: m });
      }
    }
    // バトル: いちばん強いモンスターで攻撃。この1kmの速さで攻撃力が上下する
    const att = me.field.slice().sort((x, y) => y.atk - x.atk)[0];
    if (att && b.turn > 1) {
      const k = side === "you" ? ratio : 1 / ratio;
      attack(b, steps, ride, side, other, r50(att.atk * k), att);
    }
    if (b.you.lp <= 0 || b.opp.lp <= 0) {
      b.winner = b.you.lp <= 0 ? "opp" : "you";
      steps.push({ t: "win", side: b.winner });
    }
    return { turn: b.turn, side, ratio, steps, you: b.you, opp: b.opp };
  }

  // 終わったときの勝ち負け(決着がつかなければLPの多いほう)
  function verdict(b) {
    if (!b) return null;
    const winner = b.winner || (b.you.lp > b.opp.lp ? "you" : b.you.lp < b.opp.lp ? "opp" : "draw");
    return { winner, you: b.you.lp, opp: b.opp.lp, turns: b.turn };
  }

  return { LP0, ZONES, MON, GHOST, SYNCHRO, state, step, verdict };
})();

if (typeof module !== "undefined") module.exports = Battle;

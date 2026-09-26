// CPU の考え方。強すぎず弱すぎず、「得になることは素直にやる」程度の判断をする。

const DuelCPU = (() => {
  // 考えている「間」(テストでは 0 にする)
  let speed = 1;
  const wait = (ms) => (speed ? new Promise((r) => setTimeout(r, ms * speed)) : Promise.resolve());

  function strongestEnemyAtk(g, p) {
    const d = 1 - p;
    return Math.max(0, ...g.players[d].monsters.map((m, z) => (m && m.faceUp && m.position === "atk" ? g.atkOf(d, z) : 0)));
  }

  function valueOf(g, p, inst) {
    return inst.isMonster ? inst.baseAtk + inst.baseDef / 4 : 1500;
  }

  // 選択を求められたとき
  async function choose(g, p, req) {
    const opts = req.options;
    const byAtk = (side) => (a, b) => (b.inst ? b.inst.baseAtk : 0) - (a.inst ? a.inst.baseAtk : 0) || 0;
    switch (req.purpose) {
      case "tribute": {
        const sorted = opts.slice().sort((a, b) => g.atkOf(p, a.zone) - g.atkOf(p, b.zone));
        return sorted.slice(0, req.min).map((o) => o.id);
      }
      case "destroyEnemy": {
        const d = 1 - p;
        const sorted = opts.slice().sort((a, b) => g.atkOf(d, b.zone) - g.atkOf(d, a.zone));
        return [sorted[0].id];
      }
      case "destroyEnemyST":
        return [opts[0].id];
      case "equip": {
        const sorted = opts.slice().sort((a, b) => g.atkOf(p, b.zone) - g.atkOf(p, a.zone));
        return [sorted[0].id];
      }
      case "revive":
      case "specialFromHand":
        return [opts.slice().sort(byAtk(p))[0].id];
      case "discard": {
        const sorted = opts.slice().sort((a, b) => valueOf(g, p, a.inst) - valueOf(g, p, b.inst));
        return sorted.slice(0, req.min).map((o) => o.id);
      }
      case "attack": {
        // 相手の攻撃に罠で割り込むか
        const ctx = req.context;
        const atk = g.atkOf(ctx.attacker, ctx.attackerZone);
        let danger = ctx.direct ? atk >= 800 : false;
        if (!ctx.direct) {
          const t = g.players[p].monsters[ctx.targetZone];
          if (t) danger = t.position === "atk" ? atk >= g.atkOf(p, ctx.targetZone) : atk > g.defOf(p, ctx.targetZone);
        }
        if (!danger) return [];
        const pick = opts.find((o) => o.inst.effKey !== "contDebuff") || opts[0];
        return [pick.id];
      }
      case "spell": {
        const key = req.context.spell.effKey;
        return ["destroyMonster", "destroyST", "draw2", "revive", "fieldBoost", "contBoost", "equip500"].includes(key) ? [opts[0].id] : [];
      }
      default:
        return opts.length && req.min > 0 ? opts.slice(0, req.min).map((o) => o.id) : opts.length ? [opts[0].id] : [];
    }
  }

  // 手札の魔法を、得になるものから使う
  async function playSpells(g, p) {
    const P = g.players[p];
    const order = ["draw2", "destroyMonster", "destroyST", "revive", "heal1500", "fieldBoost", "contBoost", "equip500", "burn800"];
    for (const key of order) {
      if (g.over || !g.isMain()) return;
      const i = P.hand.findIndex((c) => c.card.cardType === "spell" && c.effKey === key);
      if (i < 0 || g.emptySpellZone(p) < 0) continue;
      const inst = P.hand[i];
      if (inst.eff.canUse && !inst.eff.canUse(g, p)) continue;
      if (key === "heal1500" && P.lp > 5000) continue;
      if (key === "draw2" && P.deck.length <= 6) continue; // デッキ切れで負けないように
      if ((key === "fieldBoost" || key === "contBoost") && !P.monsters.some(Boolean) && !P.hand.some((c) => c.isMonster)) continue;
      await wait(250);
      await g.activate(p, { handIndex: i });
    }
  }

  // 召喚:一番強いモンスターを出す(生け贄が必要なら、弱いモンスターを使う)
  async function summon(g, p) {
    const P = g.players[p];
    if (g.normalSummoned) return;
    let best = null;
    P.hand.forEach((inst, i) => {
      if (!inst.isMonster) return;
      const need = g.tributesNeeded(inst);
      const own = P.monsters.map((m, z) => (m ? g.atkOf(p, z) : null)).filter((v) => v !== null).sort((a, b) => a - b);
      if (need === 0 && g.emptyMonsterZone(p) < 0) return;
      if (own.length < need) return;
      const lost = own.slice(0, need).reduce((s, v) => s + v, 0);
      const score = inst.baseAtk - lost + (inst.eff.trigger === "summon" ? 300 : 0);
      if (need && score < 300) return;
      if (!best || score > best.score) best = { i, score, inst };
    });
    // 出せるモンスターがいなくて場が空なら、一番強い上級モンスターを妥協召喚
    if (!best) {
      let top = null;
      P.hand.forEach((inst, i) => {
        if (inst.isMonster && g.canCompromise(p, inst) && (!top || inst.baseAtk > top.inst.baseAtk)) top = { i, inst };
      });
      if (!top) return;
      await wait(300);
      await g.normalSummon(p, top.i, false, true);
      return;
    }
    const strong = best.inst.baseAtk >= strongestEnemyAtk(g, p);
    await wait(300);
    await g.normalSummon(p, best.i, !strong);
  }

  async function setCards(g, p) {
    const P = g.players[p];
    for (let i = P.hand.length - 1; i >= 0; i--) {
      if (g.emptySpellZone(p) < 0) return;
      const inst = P.hand[i];
      if (inst.card.cardType === "trap") {
        await wait(200);
        await g.setSpellTrap(p, i);
      }
    }
  }

  async function activateContTraps(g, p) {
    const P = g.players[p];
    for (let z = 0; z < P.spells.length; z++) {
      const s = P.spells[z];
      if (s && !s.faceUp && s.inst.eff.main && s.setTurn < g.turn && g.players[1 - p].monsters.some(Boolean)) {
        await wait(200);
        await g.activate(p, { zone: z });
      }
    }
  }

  async function battle(g, p) {
    await g.toBattle();
    if (g.phase !== "battle") return;
    const P = g.players[p];
    const d = 1 - p;
    const attackers = P.monsters
      .map((m, z) => (m ? z : -1))
      .filter((z) => z >= 0 && g.canAttack(p, z))
      .sort((a, b) => g.atkOf(p, b) - g.atkOf(p, a));
    for (const z of attackers) {
      if (g.over || g.phase !== "battle" || !P.monsters[z]) break;
      const atk = g.atkOf(p, z);
      const targets = g.players[d].monsters.map((m, tz) => (m ? { m, tz } : null)).filter(Boolean);
      if (!targets.length) {
        await wait(350);
        await g.attack(p, z, null);
        continue;
      }
      let pick = null;
      let bestScore = -Infinity;
      targets.forEach(({ m, tz }) => {
        let score;
        if (!m.faceUp) score = atk >= 1500 ? 100 : -1;
        else if (m.position === "atk") {
          const t = g.atkOf(d, tz);
          // 同じ攻撃力なら、数で勝っているか長引いているときは相打ちを狙う(膠着でデッキ切れにならないように)
          const trade = atk === t && (P.monsters.filter(Boolean).length > g.players[d].monsters.filter(Boolean).length || g.turn > 14);
          score = atk > t ? t + 1000 : trade ? 50 : -1;
        }
        else score = atk > g.defOf(d, tz) ? 500 + m.inst.baseAtk / 10 : -1;
        if (score > bestScore) {
          bestScore = score;
          pick = tz;
        }
      });
      if (bestScore < 0) continue;
      await wait(350);
      await g.attack(p, z, pick);
    }
    if (g.phase === "battle") await g.toMain2();
  }

  // CPU の1ターン(ドローのあとから、エンドフェイズの前まで)
  async function playTurn(g, p) {
    await wait(400);
    await playSpells(g, p);
    await activateContTraps(g, p);
    await summon(g, p);
    await playSpells(g, p); // 召喚後に使える装備など
    if (g.turn > 1) await battle(g, p);
    if (g.phase === "battle") await g.toMain2();
    await setCards(g, p);
    await wait(300);
  }

  return { choose, playTurn, setSpeed: (v) => (speed = v) };
})();

if (typeof module !== "undefined") module.exports = DuelCPU;

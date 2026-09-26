// デュエルのルール処理(画面から独立)。マスターデュエルを簡略化したルールで、2人(あなた / CPU)が対戦する。
//
// - 画面とのやりとりは io を通す:
//     io.event(type, data)   … 演出用の通知(Promise を返せばアニメーションが終わるまで待つ)
//     io.choose(req)         … あなたに選ばせる(生け贄・対象・罠を発動するか など)。選んだ id の配列を返す
// - CPU の判断は ai(cpu.js)に任せる。
//
// カードの効果テキストは自由な文章なので、そのままは処理できない。
// 文章のキーワードと魔法・罠の種類から、下の EFFECTS のどれか1つを「ゲーム効果」として割り当てる。

const DuelEngine = (() => {
  const ZONES = 5;
  const START_LP = 8000;
  const START_HAND = 5;
  const HAND_LIMIT = 6;

  class GameOver extends Error {}

  function num(v) {
    const n = parseInt(String(v === undefined ? "" : v).replace(/[^0-9]/g, ""), 10);
    return isFinite(n) ? n : 0;
  }

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // ---------------------------------------------------------------
  // ゲーム効果の一覧
  // kind: monster / spell / trap
  // trigger: summon(召喚・特殊召喚に成功した時)/ attack(相手の攻撃宣言時)/ spell(相手の魔法発動時)/ main(自分のメインフェイズ)
  // stays: 発動後もフィールドに残る(装備・永続・フィールド)
  // ---------------------------------------------------------------
  const EFFECTS = {
    none: { kind: "monster", text: "(効果なし)" },
    draw1: {
      kind: "monster",
      trigger: "summon",
      text: "召喚・特殊召喚に成功した時、デッキから1枚ドローする。",
      async run(g, p) {
        await g.draw(p, 1);
      },
    },
    burn500: {
      kind: "monster",
      trigger: "summon",
      text: "召喚・特殊召喚に成功した時、相手に500ダメージを与える。",
      async run(g, p) {
        await g.damage(1 - p, 500);
      },
    },
    heal1000: {
      kind: "monster",
      trigger: "summon",
      text: "召喚・特殊召喚に成功した時、自分のLPを1000回復する。",
      async run(g, p) {
        await g.heal(p, 1000);
      },
    },
    atkAura: { kind: "monster", text: "このカードが表側表示で存在する限り、自分の他のモンスターの攻撃力は300アップする。" },
    destroyOnSummon: {
      kind: "monster",
      trigger: "summon",
      text: "召喚・特殊召喚に成功した時、相手フィールドのモンスター1体を選んで破壊する。",
      async run(g, p) {
        const opts = g.monsterOptions(1 - p);
        if (!opts.length) return;
        const [zone] = await g.ask(p, { type: "target", purpose: "destroyEnemy", title: "破壊する相手モンスターを選んでください", options: opts, min: 1, max: 1 });
        if (zone !== undefined) await g.destroyMonster(1 - p, zone);
      },
    },
    specialFromHand: {
      kind: "monster",
      trigger: "summon",
      text: "召喚・特殊召喚に成功した時、手札からレベル4以下のモンスター1体を特殊召喚できる。",
      async run(g, p) {
        const P = g.players[p];
        if (g.emptyMonsterZone(p) < 0) return;
        const opts = P.hand
          .map((inst, i) => ({ id: i, inst, label: inst.card.name }))
          .filter((o) => o.inst.isMonster && o.inst.level <= 4);
        if (!opts.length) return;
        const [i] = await g.ask(p, { type: "target", purpose: "specialFromHand", title: "特殊召喚するモンスターを選んでください(しない場合はキャンセル)", options: opts, min: 0, max: 1 });
        if (i === undefined) return;
        const inst = P.hand.splice(i, 1)[0];
        await g.specialSummon(p, inst);
      },
    },

    draw2: {
      kind: "spell",
      text: "デッキから2枚ドローする。",
      async run(g, p) {
        await g.draw(p, 2);
      },
    },
    destroyMonster: {
      kind: "spell",
      text: "相手フィールドのモンスター1体を選んで破壊する。",
      canUse: (g, p) => g.monsterOptions(1 - p).length > 0,
      async run(g, p) {
        const [zone] = await g.ask(p, { type: "target", purpose: "destroyEnemy", title: "破壊する相手モンスターを選んでください", options: g.monsterOptions(1 - p), min: 1, max: 1 });
        if (zone !== undefined) await g.destroyMonster(1 - p, zone);
      },
    },
    destroyST: {
      kind: "spell",
      text: "相手フィールドの魔法・罠カード1枚を選んで破壊する。",
      canUse: (g, p) => g.spellOptions(1 - p).length > 0,
      async run(g, p) {
        const [zone] = await g.ask(p, { type: "target", purpose: "destroyEnemyST", title: "破壊する相手の魔法・罠を選んでください", options: g.spellOptions(1 - p), min: 1, max: 1 });
        if (zone !== undefined) await g.destroySpell(1 - p, zone);
      },
    },
    burn800: {
      kind: "spell",
      text: "相手に800ダメージを与える。",
      async run(g, p) {
        await g.damage(1 - p, 800);
      },
    },
    heal1500: {
      kind: "spell",
      text: "自分のLPを1500回復する。",
      async run(g, p) {
        await g.heal(p, 1500);
      },
    },
    revive: {
      kind: "spell",
      text: "自分の墓地のモンスター1体を選んで攻撃表示で特殊召喚する。",
      canUse: (g, p) => g.players[p].grave.some((c) => c.isMonster) && g.emptyMonsterZone(p) >= 0,
      async run(g, p) {
        const P = g.players[p];
        const opts = P.grave.map((inst, i) => ({ id: i, inst, label: inst.card.name })).filter((o) => o.inst.isMonster);
        if (!opts.length || g.emptyMonsterZone(p) < 0) return;
        const [i] = await g.ask(p, { type: "target", purpose: "revive", title: "墓地から特殊召喚するモンスターを選んでください", options: opts, min: 1, max: 1 });
        if (i === undefined) return;
        const inst = P.grave.splice(i, 1)[0];
        await g.specialSummon(p, inst);
      },
    },
    equip500: {
      kind: "spell",
      stays: true,
      text: "自分の表側表示モンスター1体に装備する。装備モンスターの攻撃力は500アップする。",
      canUse: (g, p) => g.monsterOptions(p, true).length > 0,
      async run(g, p, self) {
        const [zone] = await g.ask(p, { type: "target", purpose: "equip", title: "装備するモンスターを選んでください", options: g.monsterOptions(p, true), min: 1, max: 1 });
        const m = g.players[p].monsters[zone];
        if (m) m.equips.push(self.uid);
        else await g.destroySpellByUid(p, self.uid);
      },
    },
    fieldBoost: { kind: "spell", stays: true, text: "このカードが存在する限り、自分のモンスターの攻撃力は300アップし、相手のモンスターの攻撃力は100ダウンする。" },
    contBoost: { kind: "spell", stays: true, text: "このカードが存在する限り、自分のモンスターの攻撃力は200アップする。" },

    negateAttack: {
      kind: "trap",
      trigger: "attack",
      text: "相手の攻撃宣言時に発動できる。その攻撃を無効にし、バトルフェイズを終了させる。",
      async run(g, p, self, ctx) {
        ctx.negated = true;
        ctx.endBattle = true;
      },
    },
    destroyAttacker: {
      kind: "trap",
      trigger: "attack",
      text: "相手の攻撃宣言時に発動できる。攻撃モンスターを破壊する。",
      async run(g, p, self, ctx) {
        ctx.negated = true;
        await g.destroyMonster(ctx.attacker, ctx.attackerZone);
      },
    },
    burnAttack: {
      kind: "trap",
      trigger: "attack",
      text: "相手の攻撃宣言時に発動できる。その攻撃を無効にし、攻撃モンスターの攻撃力の半分のダメージを相手に与える。",
      async run(g, p, self, ctx) {
        ctx.negated = true;
        await g.damage(ctx.attacker, Math.floor(g.atkOf(ctx.attacker, ctx.attackerZone) / 2));
      },
    },
    counterSpell: {
      kind: "trap",
      trigger: "spell",
      text: "相手が魔法カードを発動した時に発動できる。その発動を無効にし破壊する。",
      async run(g, p, self, ctx) {
        ctx.negated = true;
      },
    },
    contDebuff: {
      kind: "trap",
      trigger: "attack",
      main: true,
      stays: true,
      text: "自分のメインフェイズか相手の攻撃宣言時に発動できる。このカードが存在する限り、相手のモンスターの攻撃力は300ダウンする。",
    },
  };

  // カードの効果テキストと種類から、ゲーム効果を1つ決める
  function pickEffect(card) {
    const t = card.effect || "";
    const pick = (list) => list[hash(card.id + card.name) % list.length];
    if (card.cardType === "spell") {
      switch (card.subtype) {
        case "装備":
          return "equip500";
        case "フィールド":
          return "fieldBoost";
        case "永続":
          return "contBoost";
        case "儀式":
          return "revive";
      }
      if (/特殊召喚|蘇生|墓地/.test(t)) return "revive";
      if (/ドロー|手札に加える/.test(t)) return "draw2";
      if (/(魔法|罠).{0,8}破壊/.test(t)) return "destroyST";
      if (/破壊|無効/.test(t)) return "destroyMonster";
      if (/ダメージ|支払/.test(t)) return "burn800";
      if (/回復/.test(t)) return "heal1500";
      return pick(["draw2", "destroyMonster", "burn800", "heal1500"]);
    }
    if (card.cardType === "trap") {
      if (card.subtype === "カウンター") return "counterSpell";
      if (card.subtype === "永続") return "contDebuff";
      if (/魔法.{0,10}無効/.test(t)) return "counterSpell";
      if (/攻撃.{0,12}無効/.test(t)) return "negateAttack";
      if (/破壊/.test(t)) return "destroyAttacker";
      if (/ダメージ|支払/.test(t)) return "burnAttack";
      if (/無効/.test(t)) return "negateAttack";
      return pick(["negateAttack", "destroyAttacker", "burnAttack"]);
    }
    if (card.cardType === "normal") return "none";
    const level = num(card.level) || 4;
    if (/特殊召喚/.test(t) && level >= 5) return "specialFromHand";
    if (/ドロー|手札に加える/.test(t)) return "draw1";
    if (/破壊/.test(t) && level >= 7) return "destroyOnSummon";
    if (/ダメージ|支払/.test(t)) return "burn500";
    if (/回復/.test(t)) return "heal1000";
    if (/攻撃力|アップ|無効/.test(t)) return "atkAura";
    return pick(["draw1", "burn500", "atkAura", "heal1000"]);
  }

  let uidSeq = 0;
  function makeInstance(card) {
    const isMonster = !["spell", "trap"].includes(card.cardType);
    const effKey = pickEffect(card);
    return {
      uid: "u" + ++uidSeq,
      card,
      isMonster,
      level: isMonster ? num(card.level) || 4 : 0,
      baseAtk: isMonster ? num(card.atk) : 0,
      baseDef: isMonster ? num(card.def) : 0,
      effKey,
      eff: EFFECTS[effKey],
    };
  }

  function shuffle(arr, rand = Math.random) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // カードの一覧からデッキ(30〜40枚)を作る。
  // 1種類3枚までが基本。種類が少なくて30枚に届かないときは、同じカードを多めに入れて30枚にする。
  function buildDeck(cards, size = 30) {
    const pool = shuffle(cards.slice());
    const perCard = pool.length * 3 >= size ? 3 : Math.ceil(size / Math.max(1, pool.length));
    const deck = [];
    pool.forEach((c) => {
      for (let i = 0; i < perCard; i++) deck.push(c);
    });
    return shuffle(deck).slice(0, Math.min(40, Math.max(size, pool.length)));
  }

  // ---------------------------------------------------------------
  // デュエル本体
  // ---------------------------------------------------------------
  class Duel {
    // decks: [カード配列, カード配列]  cpu: [false, true] のように CPU かどうか
    constructor({ decks, names, cpu, io, ai }) {
      this.players = [0, 1].map((i) => ({
        name: names[i],
        lp: START_LP,
        deck: decks[i].map(makeInstance),
        hand: [],
        grave: [],
        monsters: Array(ZONES).fill(null),
        spells: Array(ZONES).fill(null),
        cpu: !!cpu[i],
      }));
      this.io = io || { event: async () => {}, choose: async () => [] };
      this.ai = ai;
      this.turn = 0;
      this.current = 0;
      this.phase = "draw";
      this.normalSummoned = false;
      this.winner = null;
      this.busy = false;
    }

    // 勝敗が決まったか(winner は 0 = あなた もありうるので真偽値で判定しない)
    get over() {
      return this.winner !== null;
    }

    // ---- 通知・選択 ----

    async emit(type, data = {}) {
      await this.io.event(type, data);
    }

    async log(text) {
      await this.emit("log", { text });
    }

    async ask(p, req) {
      const res = this.players[p].cpu ? await this.ai.choose(this, p, req) : await this.io.choose(req);
      return Array.isArray(res) ? res : [];
    }

    // ---- 状態の問い合わせ ----

    emptyMonsterZone(p) {
      return this.players[p].monsters.findIndex((m) => !m);
    }

    emptySpellZone(p) {
      return this.players[p].spells.findIndex((s) => !s);
    }

    monsterOptions(p, faceUpOnly) {
      return this.players[p].monsters
        .map((m, zone) => (m && (!faceUpOnly || m.faceUp) ? { id: zone, zone, side: p, inst: m.inst, label: m.faceUp ? m.inst.card.name : "裏側守備表示のモンスター" } : null))
        .filter(Boolean);
    }

    spellOptions(p) {
      return this.players[p].spells
        .map((s, zone) => (s ? { id: zone, zone, side: p, inst: s.inst, label: s.faceUp ? s.inst.card.name : "セットされたカード" } : null))
        .filter(Boolean);
    }

    activeSpells(p) {
      return this.players[p].spells.filter((s) => s && s.faceUp);
    }

    // 永続効果を含めた攻撃力
    atkOf(p, zone) {
      const m = this.players[p].monsters[zone];
      if (!m) return 0;
      let atk = m.halved ? Math.floor(m.inst.baseAtk / 2) : m.inst.baseAtk;
      atk += 500 * m.equips.length;
      this.players[p].monsters.forEach((o, z) => {
        if (o && z !== zone && o.faceUp && o.inst.effKey === "atkAura") atk += 300;
      });
      this.activeSpells(p).forEach((s) => {
        if (s.inst.effKey === "fieldBoost") atk += 300;
        if (s.inst.effKey === "contBoost") atk += 200;
      });
      this.activeSpells(1 - p).forEach((s) => {
        if (s.inst.effKey === "fieldBoost") atk -= 100;
        if (s.inst.effKey === "contDebuff") atk -= 300;
      });
      return Math.max(0, atk);
    }

    defOf(p, zone) {
      const m = this.players[p].monsters[zone];
      return m ? m.inst.baseDef : 0;
    }

    // 社員カードはレベルが高くなりがちなので、本家より生け贄を軽くしている
    tributesNeeded(inst) {
      return inst.level >= 10 ? 2 : inst.level >= 7 ? 1 : 0;
    }

    // 自分の場にモンスターがいなければ、上級モンスターも生け贄なしで出せる(攻撃力は半分)
    canCompromise(p, inst) {
      return this.tributesNeeded(inst) > 0 && !this.players[p].monsters.some(Boolean);
    }

    isMain() {
      return this.phase === "main1" || this.phase === "main2";
    }

    myTurn(p) {
      return !this.over && this.current === p && !this.busy;
    }

    // あなたが手札のカードでできること
    handActions(p, i) {
      const P = this.players[p];
      const inst = P.hand[i];
      if (!inst || !this.myTurn(p) || !this.isMain()) return [];
      const acts = [];
      if (inst.isMonster) {
        const need = this.tributesNeeded(inst);
        const own = P.monsters.filter(Boolean).length;
        const room = need === 0 ? this.emptyMonsterZone(p) >= 0 : own >= need;
        if (!this.normalSummoned && room) {
          acts.push({ action: "summon", label: need ? `アドバンス召喚(生け贄${need}体)` : "召喚" });
          acts.push({ action: "set", label: need ? `セット(生け贄${need}体)` : "セット" });
        }
        if (!this.normalSummoned && this.canCompromise(p, inst)) acts.push({ action: "compromise", label: "妥協召喚(生け贄なし・攻撃力半分)" });
      } else if (this.emptySpellZone(p) >= 0) {
        if (inst.card.cardType === "spell" && (!inst.eff.canUse || inst.eff.canUse(this, p))) acts.push({ action: "activate", label: "発動" });
        acts.push({ action: "setST", label: "セット" });
      }
      return acts;
    }

    // あなたがフィールドのカードでできること
    fieldActions(p, row, zone) {
      if (!this.myTurn(p)) return [];
      const P = this.players[p];
      const acts = [];
      if (row === "monster") {
        const m = P.monsters[zone];
        if (!m) return [];
        if (this.phase === "battle" && this.canAttack(p, zone)) acts.push({ action: "attack", label: "攻撃" });
        if (this.isMain() && m.summonedTurn !== this.turn && !m.changedPos && !m.attacked)
          acts.push({ action: "position", label: m.position === "atk" ? "守備表示にする" : m.faceUp ? "攻撃表示にする" : "反転召喚" });
      } else {
        const s = P.spells[zone];
        if (!s || s.faceUp || !this.isMain()) return [];
        const eff = s.inst.eff;
        const spellOk = s.inst.card.cardType === "spell" && (!eff.canUse || eff.canUse(this, p));
        const trapOk = s.inst.card.cardType === "trap" && eff.main && s.setTurn < this.turn;
        if (spellOk || trapOk) acts.push({ action: "activateSet", label: "発動" });
      }
      return acts;
    }

    canAttack(p, zone) {
      const m = this.players[p].monsters[zone];
      return !!m && this.phase === "battle" && this.turn > 1 && m.position === "atk" && m.faceUp && !m.attacked;
    }

    // ---- 進行 ----

    async start(first) {
      this.current = first;
      await this.emit("start", { first });
      for (let i = 0; i < START_HAND; i++) {
        await this.draw(0, 1, true);
        await this.draw(1, 1, true);
      }
      this.turn = 1;
      await this.beginTurn();
      await this.runCpuTurns();
    }

    async beginTurn() {
      this.normalSummoned = false;
      this.players[this.current].monsters.forEach((m) => {
        if (m) {
          m.attacked = false;
          m.changedPos = false;
        }
      });
      this.phase = "draw";
      await this.emit("turn", { turn: this.turn, current: this.current });
      if (this.turn > 1) await this.draw(this.current, 1);
      this.phase = "main1";
      await this.emit("phase", { phase: this.phase });
    }

    async toBattle() {
      if (this.phase !== "main1" || this.turn === 1) return;
      this.phase = "battle";
      await this.emit("phase", { phase: this.phase });
    }

    async toMain2() {
      if (this.phase !== "battle") return;
      this.phase = "main2";
      await this.emit("phase", { phase: this.phase });
    }

    async endTurn() {
      this.phase = "end";
      await this.emit("phase", { phase: this.phase });
      const P = this.players[this.current];
      while (P.hand.length > HAND_LIMIT) {
        const over = P.hand.length - HAND_LIMIT;
        const opts = P.hand.map((inst, i) => ({ id: i, inst, label: inst.card.name }));
        let picks = await this.ask(this.current, { type: "discard", purpose: "discard", title: `手札が${HAND_LIMIT}枚を超えています。${over}枚捨ててください`, options: opts, min: over, max: over });
        if (picks.length < over) picks = opts.slice(0, over).map((o) => o.id);
        picks
          .sort((a, b) => b - a)
          .forEach((i) => P.grave.push(P.hand.splice(i, 1)[0]));
        await this.emit("update");
      }
      this.current = 1 - this.current;
      this.turn++;
      await this.beginTurn();
    }

    // CPU の番が来たら、あなたの番になるまで進める
    async runCpuTurns() {
      try {
        while (!this.over && this.players[this.current].cpu) {
          await this.ai.playTurn(this, this.current);
          if (this.over) break;
          await this.endTurn();
        }
      } catch (e) {
        if (!(e instanceof GameOver)) throw e;
      }
    }

    // あなたの操作は必ずここを通す(ゲーム終了の例外をまとめて処理)
    async act(fn) {
      if (this.busy || this.over) return;
      this.busy = true;
      try {
        await fn();
      } catch (e) {
        if (!(e instanceof GameOver)) throw e;
      } finally {
        this.busy = false;
      }
      await this.emit("update");
      if (!this.over && this.players[this.current].cpu) {
        this.busy = true;
        try {
          await this.runCpuTurns();
        } finally {
          this.busy = false;
        }
        await this.emit("update");
      }
    }

    async lose(p, reason) {
      this.winner = 1 - p;
      await this.emit("win", { winner: 1 - p, reason });
      throw new GameOver();
    }

    // ---- 基本処理 ----

    async draw(p, n, silent) {
      const P = this.players[p];
      for (let i = 0; i < n; i++) {
        if (!P.deck.length) await this.lose(p, "デッキが0枚でドローできなかった");
        const inst = P.deck.shift();
        P.hand.push(inst);
        await this.emit("draw", { p, uid: inst.uid, silent });
      }
    }

    async damage(p, amount) {
      if (amount <= 0) return;
      const P = this.players[p];
      P.lp = Math.max(0, P.lp - amount);
      await this.emit("damage", { p, amount, lp: P.lp });
      if (P.lp <= 0) await this.lose(p, "LPが0になった");
    }

    async heal(p, amount) {
      this.players[p].lp += amount;
      await this.emit("heal", { p, amount, lp: this.players[p].lp });
    }

    async destroyMonster(p, zone) {
      const P = this.players[p];
      const m = P.monsters[zone];
      if (!m) return;
      await this.emit("destroy", { p, uid: m.inst.uid, row: "monster", zone });
      P.monsters[zone] = null;
      P.grave.push(m.inst);
      // 装備カードも一緒に墓地へ
      for (const uid of m.equips) await this.destroySpellByUid(p, uid);
      await this.emit("update");
    }

    async destroySpell(p, zone) {
      const P = this.players[p];
      const s = P.spells[zone];
      if (!s) return;
      await this.emit("destroy", { p, uid: s.inst.uid, row: "spell", zone });
      P.spells[zone] = null;
      P.grave.push(s.inst);
      // 装備していたモンスターの装備を外す
      [0, 1].forEach((q) => this.players[q].monsters.forEach((m) => m && (m.equips = m.equips.filter((u) => u !== s.inst.uid))));
      await this.emit("update");
    }

    async destroySpellByUid(p, uid) {
      for (const q of [p, 1 - p]) {
        const zone = this.players[q].spells.findIndex((s) => s && s.inst.uid === uid);
        if (zone >= 0) return this.destroySpell(q, zone);
      }
    }

    placeMonster(p, inst, { faceUp, position }) {
      const zone = this.emptyMonsterZone(p);
      this.players[p].monsters[zone] = { inst, faceUp, position, summonedTurn: this.turn, attacked: false, changedPos: false, equips: [] };
      return zone;
    }

    async triggerSummon(p, inst) {
      if (inst.eff.trigger !== "summon") return;
      await this.emit("activate", { p, uid: inst.uid, text: inst.eff.text });
      await inst.eff.run(this, p, inst, {});
    }

    // ---- 召喚 ----

    // set: 裏側守備表示でセット / compromise: 生け贄なしの妥協召喚(攻撃力半分)
    async normalSummon(p, handIndex, set, compromise) {
      const P = this.players[p];
      const inst = P.hand[handIndex];
      if (!inst || !inst.isMonster || this.normalSummoned || !this.isMain() || this.current !== p) return false;
      if (compromise && !this.canCompromise(p, inst)) return false;
      const need = compromise ? 0 : this.tributesNeeded(inst);
      if (need) {
        const opts = this.monsterOptions(p).map((o) => Object.assign(o, { label: o.inst.card.name }));
        if (opts.length < need) return false;
        const picks = await this.ask(p, { type: "tribute", purpose: "tribute", title: `生け贄にするモンスターを${need}体選んでください`, options: opts, min: need, max: need });
        if (picks.length < need) return false;
        for (const zone of picks) {
          const m = P.monsters[zone];
          await this.emit("tribute", { p, uid: m.inst.uid });
          await this.destroyMonster(p, zone);
        }
      } else if (this.emptyMonsterZone(p) < 0) return false;
      P.hand.splice(P.hand.indexOf(inst), 1);
      this.normalSummoned = true;
      const zone = this.placeMonster(p, inst, set ? { faceUp: false, position: "def" } : { faceUp: true, position: "atk" });
      if (compromise) P.monsters[zone].halved = true;
      await this.emit(set ? "set" : "summon", { p, uid: inst.uid, zone });
      await this.log(`${P.name}は「${set ? "モンスター" : inst.card.name}」を${set ? "セット" : compromise ? "妥協召喚" : need ? "アドバンス召喚" : "召喚"}した`);
      if (!set) await this.triggerSummon(p, inst);
      return true;
    }

    async specialSummon(p, inst) {
      if (this.emptyMonsterZone(p) < 0) {
        this.players[p].grave.push(inst);
        return;
      }
      const zone = this.placeMonster(p, inst, { faceUp: true, position: "atk" });
      await this.emit("summon", { p, uid: inst.uid, zone, special: true });
      await this.log(`${this.players[p].name}は「${inst.card.name}」を特殊召喚した`);
      await this.triggerSummon(p, inst);
    }

    async changePosition(p, zone) {
      const m = this.players[p].monsters[zone];
      if (!m || !this.isMain() || m.summonedTurn === this.turn || m.changedPos || m.attacked) return;
      m.changedPos = true;
      if (!m.faceUp) {
        m.faceUp = true;
        m.position = "atk";
        await this.emit("flip", { p, uid: m.inst.uid });
        await this.log(`${this.players[p].name}は「${m.inst.card.name}」を反転召喚した`);
        await this.triggerSummon(p, m.inst);
      } else {
        m.position = m.position === "atk" ? "def" : "atk";
        await this.emit("position", { p, uid: m.inst.uid });
      }
    }

    // ---- 魔法・罠 ----

    async setSpellTrap(p, handIndex) {
      const P = this.players[p];
      const inst = P.hand[handIndex];
      const zone = this.emptySpellZone(p);
      if (!inst || inst.isMonster || zone < 0 || !this.isMain()) return false;
      P.hand.splice(handIndex, 1);
      P.spells[zone] = { inst, faceUp: false, setTurn: this.turn };
      await this.emit("set", { p, uid: inst.uid, zone, row: "spell" });
      await this.log(`${P.name}は魔法・罠カードをセットした`);
      return true;
    }

    // 手札から魔法を発動(handIndex)、またはセットしたカードを発動(zone)
    async activate(p, { handIndex, zone }) {
      const P = this.players[p];
      let inst;
      if (handIndex !== undefined) {
        inst = P.hand[handIndex];
        if (!inst || inst.card.cardType !== "spell") return false;
        zone = this.emptySpellZone(p);
        if (zone < 0) return false;
        P.hand.splice(handIndex, 1);
        P.spells[zone] = { inst, faceUp: true, setTurn: this.turn };
      } else {
        const s = P.spells[zone];
        if (!s || s.faceUp) return false;
        inst = s.inst;
        s.faceUp = true;
      }
      const eff = inst.eff;
      if (eff.canUse && !eff.canUse(this, p)) {
        await this.destroySpell(p, zone);
        return false;
      }
      await this.emit("activate", { p, uid: inst.uid, text: eff.text });
      await this.log(`${P.name}は「${inst.card.name}」を発動した`);

      // 魔法には相手のカウンター罠で割り込める
      if (inst.card.cardType === "spell") {
        const ctx = { spell: inst, activator: p };
        await this.responseWindow(1 - p, "spell", ctx);
        if (ctx.negated) {
          await this.log(`「${inst.card.name}」の発動は無効になった`);
          await this.destroySpellByUid(p, inst.uid);
          return true;
        }
      }
      if (eff.run) await eff.run(this, p, inst, {});
      if (!eff.stays) await this.destroySpellByUid(p, inst.uid);
      await this.emit("update");
      return true;
    }

    // 相手の行動に対して、セットした罠を発動するか聞く
    async responseWindow(p, trigger, ctx) {
      const P = this.players[p];
      const opts = P.spells
        .map((s, zone) => (s && !s.faceUp && s.inst.card.cardType === "trap" && s.inst.eff.trigger === trigger && s.setTurn < this.turn ? { id: zone, zone, side: p, inst: s.inst, label: s.inst.card.name } : null))
        .filter(Boolean);
      if (!opts.length) return;
      const title = trigger === "attack" ? "相手が攻撃してきました。罠カードを発動しますか?" : `相手が「${ctx.spell.card.name}」を発動しました。罠カードを発動しますか?`;
      const [zone] = await this.ask(p, { type: "respond", purpose: trigger, title, options: opts, min: 0, max: 1, context: ctx });
      if (zone === undefined) return;
      const s = P.spells[zone];
      s.faceUp = true;
      const eff = s.inst.eff;
      await this.emit("activate", { p, uid: s.inst.uid, text: eff.text, chain: true });
      await this.log(`${P.name}は罠カード「${s.inst.card.name}」を発動した`);
      if (eff.run) await eff.run(this, p, s.inst, ctx);
      if (!eff.stays) await this.destroySpellByUid(p, s.inst.uid);
      await this.emit("update");
    }

    // ---- バトル ----

    async attack(p, zone, targetZone) {
      if (!this.canAttack(p, zone)) return false;
      const d = 1 - p;
      const P = this.players[p];
      const D = this.players[d];
      const hasTargets = D.monsters.some(Boolean);
      if (targetZone === null || targetZone === undefined) {
        if (hasTargets) return false;
      } else if (!D.monsters[targetZone]) return false;

      const m = P.monsters[zone];
      m.attacked = true;
      const direct = targetZone === null || targetZone === undefined;
      await this.emit("attack", { p, uid: m.inst.uid, targetUid: direct ? null : D.monsters[targetZone].inst.uid });
      await this.log(`「${m.inst.card.name}」の攻撃！`);

      const ctx = { attacker: p, attackerZone: zone, targetZone: direct ? null : targetZone, direct };
      await this.responseWindow(d, "attack", ctx);
      if (ctx.endBattle) {
        this.phase = "main2";
        await this.emit("phase", { phase: this.phase });
      }
      if (ctx.negated || !P.monsters[zone]) {
        await this.log("攻撃は止められた");
        return true;
      }

      const atk = this.atkOf(p, zone);
      if (direct) {
        await this.damage(d, atk);
        return true;
      }
      const t = D.monsters[targetZone];
      if (!t) return true;
      if (!t.faceUp) {
        t.faceUp = true;
        await this.emit("flip", { p: d, uid: t.inst.uid });
      }
      if (t.position === "atk") {
        const tAtk = this.atkOf(d, targetZone);
        if (atk > tAtk) {
          await this.destroyMonster(d, targetZone);
          await this.damage(d, atk - tAtk);
        } else if (atk < tAtk) {
          await this.destroyMonster(p, zone);
          await this.damage(p, tAtk - atk);
        } else {
          await this.destroyMonster(p, zone);
          await this.destroyMonster(d, targetZone);
        }
      } else {
        const tDef = this.defOf(d, targetZone);
        if (atk > tDef) await this.destroyMonster(d, targetZone);
        else if (atk < tDef) await this.damage(p, tDef - atk);
      }
      return true;
    }
  }

  function effectText(inst) {
    return inst.eff.text;
  }

  return { Duel, EFFECTS, pickEffect, buildDeck, makeInstance, effectText, num, START_LP, ZONES, GameOver };
})();

if (typeof module !== "undefined") module.exports = DuelEngine;

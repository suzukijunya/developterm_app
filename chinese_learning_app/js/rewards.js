// やる気を支えるごほうびの仕組み: ジェム(💎)・デイリークエスト・宝箱・
// 連続記録のマイルストーン・レベルクリアのお祝い・ショップ(フリーズ/XPブースト/応援キャラ)
const Rewards = (() => {
  const { el } = UI;

  // ---------- デイリークエスト ----------
  const QUESTS = {
    lessons: { icon: "📘", label: "レッスンを2回クリアする", target: 2, gems: 15 },
    xp: { icon: "⚡", label: "60XPを獲得する", target: 60, gems: 15 },
    correct: { icon: "✅", label: "問題に15問正解する", target: 15, gems: 10 },
    combo: { icon: "🔥", label: "5問連続で正解する", target: 5, gems: 15, mode: "max" },
    speaking: { icon: "🎤", label: "発音問題に3回挑戦する", target: 3, gems: 10 },
    perfect: { icon: "💯", label: "ノーミスでレッスンをクリアする", target: 1, gems: 20 },
    cards: { icon: "🎴", label: "単語カードを10枚復習する", target: 10, gems: 10 },
  };
  // 3つの枠から1つずつ選ぶ(毎日ちがう組み合わせ)
  const QUEST_SLOTS = [["lessons", "xp"], ["correct", "combo", "speaking"], ["perfect", "cards"]];
  const DAILY_CHEST = [30, 60];

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function dayNumber() {
    return Math.floor(Date.now() / 86400000);
  }

  function r() {
    return AppState.getRewards();
  }

  function save() {
    AppState.saveRewards();
  }

  function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function questState() {
    const rw = r();
    if (!rw.quests || rw.quests.date !== today()) {
      const d = dayNumber();
      rw.quests = {
        date: today(),
        items: QUEST_SLOTS.map((slot, i) => ({ id: slot[(d + i * 3) % slot.length], progress: 0, done: false })),
        chestClaimed: false,
      };
      save();
    }
    return rw.quests;
  }

  function getQuests() {
    return questState().items.map((q) => Object.assign({}, QUESTS[q.id], q));
  }

  // 新しく達成したクエスト(レッスン結果画面でまとめて見せる)
  let justCompleted = [];

  function track(type, amount = 1) {
    const qs = questState();
    let changed = false;
    qs.items.forEach((q) => {
      if (q.id !== type || q.done) return;
      const def = QUESTS[q.id];
      const next = def.mode === "max" ? Math.max(q.progress, amount) : q.progress + amount;
      if (next === q.progress) return;
      q.progress = Math.min(def.target, next);
      changed = true;
      if (q.progress >= def.target) {
        q.done = true;
        AppState.addGems(def.gems);
        justCompleted.push(Object.assign({}, def, q));
      }
    });
    if (changed) save();
  }

  function takeCompleted() {
    const list = justCompleted;
    justCompleted = [];
    return list;
  }

  function canClaimDailyChest() {
    const qs = questState();
    return !qs.chestClaimed && qs.items.every((q) => q.done);
  }

  function claimDailyChest() {
    if (!canClaimDailyChest()) return 0;
    const qs = questState();
    qs.chestClaimed = true;
    const gems = rand(DAILY_CHEST[0], DAILY_CHEST[1]);
    AppState.addGems(gems);
    save();
    return gems;
  }

  // ---------- XPブースト ----------
  function boostRemainingMs() {
    return Math.max(0, (r().boostUntil || 0) - Date.now());
  }

  function xpMultiplier() {
    return boostRemainingMs() > 0 ? 2 : 1;
  }

  // ---------- 宝箱(ユニットクリアごと) ----------
  function isChestOpened(unitId) {
    return !!(r().chests || {})[unitId];
  }

  function openChest(unitId, unitIndex) {
    const rw = r();
    rw.chests = rw.chests || {};
    if (rw.chests[unitId]) return 0;
    // 先のユニットほど少し多め
    const gems = rand(15, 30) + Math.min(30, unitIndex * 2);
    rw.chests[unitId] = gems;
    AppState.addGems(gems);
    save();
    return gems;
  }

  // ---------- レッスン完了時のごほうび ----------
  const STREAK_MILESTONES = [
    [3, 20],
    [7, 50],
    [14, 80],
    [30, 150],
    [50, 200],
    [100, 500],
  ];

  function onLessonComplete({ accuracy, firstTime, maxCombo, isReview }) {
    const lines = [];
    if (isReview) lines.push({ label: "苦手復習", gems: 5 });
    else if (firstTime) lines.push({ label: "初クリア", gems: 10 });
    else lines.push({ label: "おさらい", gems: 3 });
    if (accuracy >= 1) lines.push({ label: "パーフェクト!", gems: 10 });
    if (maxCombo >= 5) lines.push({ label: `${maxCombo}連続正解`, gems: 5 });

    const rw = r();
    rw.streakMilestones = rw.streakMilestones || {};
    const streak = AppState.get().streak;
    STREAK_MILESTONES.forEach(([days, gems]) => {
      if (streak >= days && !rw.streakMilestones[days]) {
        rw.streakMilestones[days] = true;
        lines.push({ label: `${days}日連続達成`, gems });
      }
    });
    const gems = lines.reduce((n, l) => n + l.gems, 0);
    AppState.addGems(gems);
    save();

    track("lessons", 1);
    if (accuracy >= 1) track("perfect", 1);
    return { gems, lines, quests: takeCompleted() };
  }

  function claimLevelReward(levelId) {
    const rw = r();
    rw.levels = rw.levels || {};
    if (rw.levels[levelId]) return 0;
    rw.levels[levelId] = true;
    AppState.addGems(100);
    save();
    return 100;
  }

  // ---------- ショップ ----------
  const MASCOTS = [
    { id: "panda", emoji: "🐼", name: "パンダ", price: 0 },
    { id: "cat", emoji: "🐱", name: "ネコ", price: 150 },
    { id: "tiger", emoji: "🐯", name: "トラ", price: 300 },
    { id: "fox", emoji: "🦊", name: "キツネ", price: 300 },
    { id: "monkey", emoji: "🐵", name: "サル(孫悟空)", price: 500 },
    { id: "dragon", emoji: "🐲", name: "龍", price: 800 },
  ];
  const FREEZE_PRICE = 200;
  const FREEZE_MAX = 2;
  const BOOST_PRICE = 100;
  const BOOST_MINUTES = 15;

  function mascot() {
    const id = r().mascot || "panda";
    return (MASCOTS.find((m) => m.id === id) || MASCOTS[0]).emoji;
  }

  function ownsMascot(id) {
    return id === "panda" || !!(r().mascots || {})[id];
  }

  function spend(price) {
    if ((AppState.get().gems || 0) < price) return false;
    AppState.addGems(-price);
    return true;
  }

  function buy(item) {
    const rw = r();
    if (item === "freeze") {
      if ((AppState.get().streakFreezes || 0) >= FREEZE_MAX) return "これ以上持てません(最大2個)";
      if (!spend(FREEZE_PRICE)) return "ジェムが足りません";
      AppState.addStreakFreeze(1);
      return null;
    }
    if (item === "boost") {
      if (!spend(BOOST_PRICE)) return "ジェムが足りません";
      rw.boostUntil = Math.max(Date.now(), rw.boostUntil || 0) + BOOST_MINUTES * 60000;
      save();
      return null;
    }
    const m = MASCOTS.find((x) => x.id === item);
    if (m) {
      if (!ownsMascot(m.id)) {
        if (!spend(m.price)) return "ジェムが足りません";
        rw.mascots = rw.mascots || {};
        rw.mascots[m.id] = true;
      }
      rw.mascot = m.id;
      save();
      return null;
    }
    return "不明なアイテムです";
  }

  // ---------- 画面パーツ ----------
  function gemIcon() {
    return el("span", "rw-gem", "💎");
  }

  // 数字を0からカウントアップ表示する
  function countUp(node, to, { from = 0, duration = 700 } = {}) {
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      node.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // 全画面のお祝い表示(宝箱・レベルクリアなど)
  function overlay({ art, title, sub, gems, button = "受け取る", onClose, big = false }) {
    const back = el("div", "rw-overlay");
    const card = el("div", "rw-modal" + (big ? " rw-modal--big" : ""));
    const burst = el("div", "rw-burst");
    for (let i = 0; i < 12; i++) {
      const ray = el("span", "rw-ray");
      ray.style.transform = `rotate(${i * 30}deg)`;
      burst.appendChild(ray);
    }
    card.appendChild(burst);
    const artEl = el("div", "rw-modal-art", art);
    card.appendChild(artEl);
    card.appendChild(el("div", "rw-modal-title", title));
    if (sub) card.appendChild(el("div", "rw-modal-sub", sub));
    if (gems) {
      const g = el("div", "rw-modal-gems");
      g.appendChild(gemIcon());
      const num = el("span", "rw-modal-gems-num", "0");
      g.appendChild(el("span", "", "+"));
      g.appendChild(num);
      card.appendChild(g);
      setTimeout(() => {
        countUp(num, gems);
        Motion.Sfx.coin();
      }, 450);
    }
    const btn = UI.button("primary-btn rw-modal-btn", button, () => {
      back.classList.add("is-leaving");
      setTimeout(() => {
        back.remove();
        if (onClose) onClose();
      }, 180);
    });
    card.appendChild(btn);
    back.appendChild(card);
    document.body.appendChild(back);
    // 紙吹雪
    const colors = ["#ff9f1a", "#ff5a7a", "#ffd23f", "#4cc76a", "#5aa9ff", "#ce82ff"];
    for (let i = 0; i < 24; i++) {
      const c = el("span", "rw-confetti");
      c.style.left = `${Math.random() * 100}%`;
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = `${(Math.random() * 0.6).toFixed(2)}s`;
      c.style.animationDuration = `${(1.8 + Math.random() * 1.4).toFixed(2)}s`;
      back.appendChild(c);
    }
    return back;
  }

  // 宝箱を開ける演出: 揺れる → パカッと開く → ジェム
  function showChestOpen({ title, sub, gems, onClose }) {
    const back = overlay({ art: "🎁", title, sub, gems, onClose });
    const art = back.querySelector(".rw-modal-art");
    art.classList.add("is-shaking");
    Motion.Sfx.tap();
    setTimeout(() => {
      art.classList.remove("is-shaking");
      art.textContent = "💰";
      art.classList.add("is-open");
      Motion.Sfx.chest();
      Motion.vibrate([30, 40, 30]);
    }, 420);
  }

  function showLevelUp(level, gems, onClose) {
    Motion.Sfx.complete();
    overlay({
      art: "🏆",
      title: `${level.label} クリア!`,
      sub: `${level.hskLabel}の範囲をすべて修了しました。次のレベルに進もう!`,
      gems,
      button: "次へ進む",
      big: true,
      onClose,
    });
  }

  function showUnitClear(unit, onClose) {
    Motion.Sfx.complete();
    overlay({
      art: unit.icon,
      title: "ユニットクリア!",
      sub: `「${unit.title}」を修了しました。ホームの宝箱を開けよう!`,
      button: "やったね",
      onClose,
    });
  }

  // ホーム: デイリークエストのカード
  function questCard(onChange) {
    const quests = getQuests();
    const card = el("div", "rw-quests");
    const head = el("div", "rw-quests-head");
    head.appendChild(el("div", "rw-quests-title", "📜 デイリークエスト"));
    head.appendChild(el("div", "rw-quests-sub", "毎日0時に入れ替わり"));
    card.appendChild(head);
    quests.forEach((q) => {
      const row = el("div", "rw-quest" + (q.done ? " is-done" : ""));
      row.appendChild(el("div", "rw-quest-icon", q.done ? "✅" : q.icon));
      const mid = el("div", "rw-quest-mid");
      mid.appendChild(el("div", "rw-quest-label", q.label));
      const bar = el("div", "rw-quest-bar");
      const fill = el("div", "rw-quest-fill");
      fill.style.width = `${(q.progress / q.target) * 100}%`;
      bar.appendChild(fill);
      bar.appendChild(el("span", "rw-quest-count", `${q.progress} / ${q.target}`));
      mid.appendChild(bar);
      row.appendChild(mid);
      const reward = el("div", "rw-quest-reward");
      reward.appendChild(gemIcon());
      reward.appendChild(el("span", "", String(q.gems)));
      row.appendChild(reward);
      card.appendChild(row);
    });
    const qs = questState();
    const chest = UI.button("rw-daily-chest" + (canClaimDailyChest() ? " is-ready" : qs.chestClaimed ? " is-claimed" : ""), "", () => {
      if (!canClaimDailyChest()) {
        UI.toast(qs.chestClaimed ? "今日の宝箱は受け取り済みです" : "3つのクエストを全部達成すると開けられます");
        return;
      }
      const gems = claimDailyChest();
      showChestOpen({ title: "デイリー宝箱", sub: "今日のクエストを全部達成!", gems, onClose: onChange });
    });
    chest.appendChild(el("span", "rw-daily-chest-icon", qs.chestClaimed ? "💰" : "🎁"));
    chest.appendChild(
      el(
        "span",
        "rw-daily-chest-text",
        qs.chestClaimed ? "今日の宝箱は受け取りました" : canClaimDailyChest() ? "タップして宝箱を開ける!" : "全部達成で宝箱(ジェム30〜60)"
      )
    );
    card.appendChild(chest);
    return card;
  }

  // ホーム: ユニットの最後に置く宝箱
  function unitChest(unit, unitIndex, unlocked, onChange) {
    const opened = isChestOpened(unit.id);
    const node = UI.button("rw-unit-chest" + (opened ? " is-opened" : unlocked ? " is-ready" : " is-locked"), "", () => {
      if (opened) {
        UI.toast(`この宝箱からは💎${r().chests[unit.id]}を受け取りました`);
        return;
      }
      if (!unlocked) {
        UI.toast("このユニットのレッスンを全部クリアすると開けられます");
        return;
      }
      const gems = openChest(unit.id, unitIndex);
      showChestOpen({ title: "宝箱を開けた!", sub: `「${unit.title}」クリアのごほうび`, gems, onClose: onChange });
    });
    node.appendChild(el("span", "rw-unit-chest-icon", opened ? "💰" : "🎁"));
    return node;
  }

  // ショップ画面
  function shop(onBack) {
    const screen = UI.screen("screen--sub screen--shop");
    screen.appendChild(UI.subHeader("ショップ", onBack || (() => App.go("home"))));
    const body = el("div", "sub-body");

    const wallet = el("div", "rw-wallet");
    wallet.appendChild(el("div", "rw-wallet-label", "所持ジェム"));
    const amount = el("div", "rw-wallet-amount");
    amount.appendChild(gemIcon());
    amount.appendChild(el("span", "", String(AppState.get().gems || 0)));
    wallet.appendChild(amount);
    wallet.appendChild(el("div", "rw-wallet-hint", "レッスン・クエスト・宝箱・連続記録で貯まります"));
    body.appendChild(wallet);

    const refresh = () => shop(onBack);
    const buyAndRefresh = (id, doneMsg) => {
      const err = buy(id);
      if (err) {
        UI.toast(err);
        Motion.Sfx.wrong();
        return;
      }
      Motion.Sfx.coin();
      UI.toast(doneMsg);
      refresh();
    };

    body.appendChild(el("div", "ui-section-title", "パワーアップ"));
    const freezes = AppState.get().streakFreezes || 0;
    body.appendChild(
      shopItem({
        icon: "🧊",
        title: "連続記録フリーズ",
        desc: `勉強できなかった日があっても、連続記録が途切れません(所持 ${freezes}/${FREEZE_MAX})`,
        price: FREEZE_PRICE,
        disabled: freezes >= FREEZE_MAX,
        label: freezes >= FREEZE_MAX ? "所持上限" : null,
        onBuy: () => buyAndRefresh("freeze", "連続記録フリーズを手に入れました"),
      })
    );
    const boostMin = Math.ceil(boostRemainingMs() / 60000);
    body.appendChild(
      shopItem({
        icon: "⚡",
        title: `XP2倍ブースト(${BOOST_MINUTES}分)`,
        desc: boostMin > 0 ? `使用中: あと${boostMin}分。買うと時間が延長されます` : `${BOOST_MINUTES}分間、獲得XPが2倍になります`,
        price: BOOST_PRICE,
        onBuy: () => buyAndRefresh("boost", "XP2倍ブースト開始!"),
      })
    );

    body.appendChild(el("div", "ui-section-title", "応援キャラ"));
    body.appendChild(el("p", "sub-note", "正解したときに出てくるキャラクターを変えられます。"));
    const grid = el("div", "rw-mascots");
    const current = r().mascot || "panda";
    MASCOTS.forEach((m) => {
      const owned = ownsMascot(m.id);
      const tile = UI.button("rw-mascot" + (m.id === current ? " is-on" : ""), "", () => {
        if (m.id === current) return;
        if (!owned && !confirm(`${m.name}を💎${m.price}で手に入れますか?`)) return;
        buyAndRefresh(m.id, `${m.name}に変更しました`);
      });
      tile.appendChild(el("div", "rw-mascot-emoji", m.emoji));
      tile.appendChild(el("div", "rw-mascot-name", m.name));
      tile.appendChild(el("div", "rw-mascot-price", m.id === current ? "使用中" : owned ? "持っている" : `💎${m.price}`));
      grid.appendChild(tile);
    });
    body.appendChild(grid);

    body.appendChild(el("div", "ui-section-title", "ジェムの貯め方"));
    [
      ["📘", "レッスン初クリア", "💎10(おさらいは💎3)"],
      ["💯", "ノーミスでクリア", "💎10"],
      ["🔥", "5問以上連続正解", "💎5"],
      ["📜", "デイリークエスト", "1つにつき💎10〜20"],
      ["🎁", "デイリー宝箱(クエスト全達成)", "💎30〜60"],
      ["🎁", "ユニットの宝箱", "💎15〜60"],
      ["🏆", "レベルクリア", "💎100"],
      ["📅", "連続記録 3/7/14/30日…", "💎20〜500"],
    ].forEach(([icon, label, value]) => {
      const row = el("div", "rw-howto");
      row.appendChild(el("span", "rw-howto-icon", icon));
      row.appendChild(el("span", "rw-howto-label", label));
      row.appendChild(el("span", "rw-howto-value", value));
      body.appendChild(row);
    });
    screen.appendChild(body);
  }

  function shopItem({ icon, title, desc, price, onBuy, disabled = false, label = null }) {
    const row = el("div", "rw-item");
    row.appendChild(el("div", "rw-item-icon", icon));
    const mid = el("div", "rw-item-mid");
    mid.appendChild(el("div", "rw-item-title", title));
    mid.appendChild(el("div", "rw-item-desc", desc));
    row.appendChild(mid);
    const btn = UI.button("rw-item-buy", label || `💎${price}`, onBuy);
    btn.disabled = disabled || (AppState.get().gems || 0) < price;
    row.appendChild(btn);
    return row;
  }

  return {
    getQuests,
    track,
    takeCompleted,
    xpMultiplier,
    boostRemainingMs,
    onLessonComplete,
    claimLevelReward,
    isChestOpened,
    mascot,
    questCard,
    unitChest,
    showLevelUp,
    showUnitClear,
    shop,
    countUp,
  };
})();

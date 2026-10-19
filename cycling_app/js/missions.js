// 月間ミッション: 毎月の目標(距離・通勤の回数など)と、達成でもらえるバッジ、バッジの数で増えるガレージのごほうび。
// バッジは走行記録から毎回計算する(保存しないので、同期した記録からどの端末でも同じになる)。

const Missions = (() => {
  const LIST = [
    { id: "dist", icon: "📏", label: "今月200km走る", target: 200, unit: "km" },
    { id: "commute", icon: "🏢", label: "通勤(目的地に到着)10回", target: 10, unit: "回" },
    { id: "kcal", icon: "🔥", label: "今月5,000kcal燃やす", target: 5000, unit: "kcal" },
    { id: "days", icon: "📅", label: "12日走る", target: 12, unit: "日" },
    { id: "climb", icon: "⛰️", label: "獲得標高1,000m", target: 1000, unit: "m" },
    { id: "early", icon: "🌅", label: "朝8時前に出発5回", target: 5, unit: "回" },
    { id: "pb", icon: "🏆", label: "目的地までの自己ベストを更新", target: 1, unit: "回" },
  ];

  // バッジの数で増えるごほうび(ガレージの色・仕上げ・飾り)
  const REWARDS = [
    { id: "p-acorange", need: 1, kind: "paint", label: "ACオレンジ", color: "#ff7a1a", finish: "gloss" },
    { id: "t-red", need: 2, kind: "tape", label: "バーテープ レッド", color: "#d0202a" },
    { id: "p-matte", need: 3, kind: "paint", label: "マットブラック", color: "#1b1d21", finish: "matte" },
    { id: "t-white", need: 4, kind: "tape", label: "バーテープ ホワイト", color: "#f2f2f2" },
    { id: "p-pearl", need: 6, kind: "paint", label: "パールホワイト", color: "#eef0f2", finish: "pearl" },
    { id: "t-neon", need: 8, kind: "tape", label: "バーテープ ネオン", color: "#b6ff1a" },
    { id: "p-metal", need: 10, kind: "paint", label: "ガンメタリック", color: "#4a525c", finish: "metal" },
    { id: "p-gold", need: 14, kind: "paint", label: "チャンピオンゴールド", color: "#d4a33a", finish: "metal" },
    { id: "p-holo", need: 20, kind: "paint", label: "ホログラム", color: "#c9d3e6", finish: "holo" },
  ];

  const ym = (ms) => {
    const d = new Date(ms);
    return d.getFullYear() * 100 + d.getMonth() + 1;
  };
  const ymLabel = (k) => `${Math.floor(k / 100)}年${k % 100}月`;
  const dayKey = (ms) => {
    const d = new Date(ms);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };

  // 自己ベストを更新したライド(それまでの到着より速かったもの)
  function pbRides(places) {
    const set = new Set();
    for (const p of places || []) {
      const trips = (p.trips || []).slice().sort((a, b) => a.at - b.at);
      let best = null;
      for (const t of trips) {
        if (best != null && t.speed > best) set.add(t.rideId);
        best = best == null ? t.speed : Math.max(best, t.speed);
      }
    }
    return set;
  }

  // その月の各ミッションの値
  function valuesFor(rides, pbs) {
    const days = new Set();
    const v = { dist: 0, commute: 0, kcal: 0, days: 0, climb: 0, early: 0, pb: 0 };
    for (const r of rides) {
      v.dist += (r.distance || 0) / 1000;
      if (r.arrivedPlaceId) v.commute++;
      v.kcal += (r.kcalBasal || 0) + (r.kcalExercise || 0);
      v.climb += r.elevGain || 0;
      if (new Date(r.startedAt).getHours() < 8) v.early++;
      if (pbs.has(r.id)) v.pb++;
      days.add(dayKey(r.startedAt));
    }
    v.days = days.size;
    return v;
  }

  function status(rides, places, now = Date.now()) {
    const pbs = pbRides(places);
    const byMonth = {};
    for (const r of rides || []) (byMonth[ym(r.startedAt)] = byMonth[ym(r.startedAt)] || []).push(r);
    const cur = ym(now);
    const badges = [];
    for (const k of Object.keys(byMonth).map(Number).sort((a, b) => b - a)) {
      const v = valuesFor(byMonth[k], pbs);
      for (const m of LIST) if (v[m.id] >= m.target) badges.push({ ym: k, month: ymLabel(k), id: m.id, icon: m.icon, label: m.label });
    }
    const v = valuesFor(byMonth[cur] || [], pbs);
    const d = new Date(now);
    const daysLeft = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate();
    const missions = LIST.map((m) => Object.assign({}, m, { value: v[m.id], done: v[m.id] >= m.target, pct: Math.min(100, (v[m.id] / m.target) * 100) }));
    const count = badges.length;
    const unlocked = REWARDS.filter((x) => count >= x.need);
    const next = REWARDS.find((x) => count < x.need) || null;
    return { ym: cur, month: ymLabel(cur), daysLeft, missions, badges, count, unlocked, next };
  }

  // このライドで達成したミッション(ライドを除いたときと比べる)
  function newlyDone(rides, places, ride) {
    const before = status(rides.filter((r) => r.id !== ride.id), places, ride.startedAt);
    const after = status(rides, places, ride.startedAt);
    return after.missions.filter((m) => m.done && !before.missions.find((x) => x.id === m.id).done);
  }

  const fmtVal = (m, v) => (m.unit === "km" ? v.toFixed(1) : Math.round(v).toLocaleString());

  return { LIST, REWARDS, status, newlyDone, fmtVal, ymLabel };
})();

if (typeof module !== "undefined") module.exports = Missions;

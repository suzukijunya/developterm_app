// デュエルモード(ライディング・デュエル風): 走った距離でたまるスピードカウンター(SPC)と、
// いつもの自分(目的地までの学習値)= ゴーストとのライフポイント(LP)勝負。
// 状態はライドの中(ride.duel)に持つので、再読み込みしても続きから数える。

const Duel = (() => {
  const E = typeof Eta !== "undefined" ? Eta : require("./eta.js");
  const MAX_SPC = 12;
  const LP0 = 4000;
  const STOP_PENALTY_SEC = 120; // 2分以上止まると、SPCが1つ減る(1回の停止につき1つ)
  const LP_PER_M = 4; // ゴーストに1m遅れるごとに減るLP(1km遅れで0)

  // カード(スピード・スペル風)。手札にあるカードは、条件を満たすと自動で発動する(走行中に画面を触らなくてよい)
  // c: 判定に使う値 { kmAvg(直近1kmの平均 km/h), nonstopM, cruiseSec(20km/h以上を続けた秒), vmax, climb, kcal, remainM }
  const CARDS = [
    { id: "boost", name: "アクセル・ブースト", kind: "spell", text: "1kmを平均25km/h以上で走ると発動。SPC+2", test: (c) => c.kmAvg >= 25, spc: 2, lp: 0 },
    { id: "nonstop", name: "ノンストップ・ロード", kind: "spell", text: "止まらずに2km走ると発動。SPC+1・LP+300", test: (c) => c.nonstopM >= 2000, spc: 1, lp: 300 },
    { id: "cruise", name: "クルーズ・コントロール", kind: "spell", text: "20km/h以上を5分続けると発動。LP+400", test: (c) => c.cruiseSec >= 300, spc: 0, lp: 400 },
    { id: "ignite", name: "イグニッション", kind: "spell", text: "30km/hを超えると発動。SPC+1", test: (c) => c.vmax >= 30, spc: 1, lp: 0 },
    { id: "hill", name: "ヒル・クライマー", kind: "spell", text: "20m登ると発動。LP+500", test: (c) => c.climb >= 20, spc: 0, lp: 500 },
    { id: "burn", name: "カロリー・バーン", kind: "spell", text: "100kcal燃やすと発動。LP+300", test: (c) => c.kcal >= 100, spc: 0, lp: 300 },
    { id: "final", name: "ファイナル・スパート", kind: "spell", text: "目的地まで残り500mで発動。LP+800", test: (c) => c.remainM != null && c.remainM <= 500, spc: 0, lp: 800 },
    { id: "wind", name: "テイルウィンド", kind: "trap", text: "追い風を受けると発動。SPC+1・LP+200", test: (c) => c.tail, spc: 1, lp: 200 },
  ];
  const HAND0 = 5; // 最初の手札
  const DRAW_KM = 2; // 2kmごとに1枚ドロー
  const HAND_MAX = 7;
  const LP_MAX = 8000;

  function state(ride) {
    if (!ride.duel) ride.duel = { spc: 0, km: 0, stop0: null, penal: false, ahead: null, hand: [], used: [], drawn: 0, lpBonus: 0, seed: (ride.startedAt || 0) % 9973 };
    const d = ride.duel;
    if (!d.hand) Object.assign(d, { hand: [], used: [], drawn: 0, lpBonus: 0, seed: (ride.startedAt || 0) % 9973 });
    return d;
  }

  // 山札から1枚(同じライドで同じカードは出さない。出せるものがなければ null)
  function drawOne(d) {
    const have = new Set(d.hand.concat(d.used));
    const left = CARDS.filter((c) => !have.has(c.id));
    if (!left.length || d.hand.length >= HAND_MAX) return null;
    d.seed = (d.seed * 1103515245 + 12345) % 2147483648;
    const c = left[d.seed % left.length];
    d.hand.push(c.id);
    d.drawn++;
    return c;
  }

  // ライドの最初: 5枚引く
  function deal(ride) {
    const d = state(ride);
    const out = [];
    while (d.drawn < HAND0) {
      const c = drawOne(d);
      if (!c) break;
      out.push(c);
    }
    return out;
  }

  const byId = (id) => CARDS.find((c) => c.id === id) || null;

  // カードの判定に使う値を、測位ごとに積み上げる
  function track(d, ride, extra) {
    const t = ride.last ? ride.last.t : Date.now();
    const v = (ride.vEma || 0) * 3.6;
    const tr = d.tr || (d.tr = { kmT: t, kmD: 0, stopD: 0, lastStopped: ride.stoppedSec, cruise0: null, kmAvg: 0 });
    if (ride.distance - tr.kmD >= 1000) {
      tr.kmAvg = (ride.distance - tr.kmD) / 1000 / Math.max(1 / 3600, (t - tr.kmT) / 3600000);
      tr.kmD = ride.distance;
      tr.kmT = t;
    }
    if (ride.stoppedSec > tr.lastStopped) tr.stopD = ride.distance;
    tr.lastStopped = ride.stoppedSec;
    if (v >= 20) tr.cruise0 = tr.cruise0 == null ? t : tr.cruise0;
    else tr.cruise0 = null;
    return {
      kmAvg: tr.kmAvg,
      nonstopM: ride.distance - tr.stopD,
      cruiseSec: tr.cruise0 == null ? 0 : (t - tr.cruise0) / 1000,
      vmax: (ride.maxSpeed || 0) * 3.6,
      climb: ride.elevGain || 0,
      kcal: (ride.kcalExercise || 0) + (ride.kcalBasal || 0),
      remainM: extra && extra.remainM != null ? extra.remainM : null,
      tail: !!(extra && extra.headwind != null && extra.headwind < -1),
    };
  }

  // 測位ごとに呼ぶ。返り値: SPCが増えた/減ったときのイベント
  // extra: { remainM: 目的地までの残り, headwind: 向かい風成分 m/s }
  function step(ride, extra) {
    const d = state(ride);
    const ev = [];
    while (ride.distance >= (d.km + 1) * 1000) {
      d.km++;
      if (d.spc < MAX_SPC) {
        d.spc++;
        ev.push({ type: "up", spc: d.spc });
      }
      // ドローフェイズ
      if (d.km % DRAW_KM === 0) {
        const c = drawOne(d);
        if (c) ev.push({ type: "draw", card: c });
      }
    }
    // 手札のカードの発動
    const c = track(d, ride, extra);
    for (const id of d.hand.slice()) {
      const card = byId(id);
      if (!card || !card.test(c)) continue;
      d.hand = d.hand.filter((x) => x !== id);
      d.used.push(id);
      d.spc = Math.min(MAX_SPC, d.spc + card.spc);
      d.lpBonus += card.lp;
      ev.push({ type: "activate", card, spc: d.spc });
    }
    // 止まっている間(stoppedSec が増えていく)を見張る
    if (d.lastStopped != null && ride.stoppedSec > d.lastStopped) {
      if (d.stop0 == null) d.stop0 = d.lastStopped;
      if (!d.penal && ride.stoppedSec - d.stop0 >= STOP_PENALTY_SEC && d.spc > 0) {
        d.spc--;
        d.penal = true;
        ev.push({ type: "down", spc: d.spc });
      }
    } else if (d.lastStopped != null && ride.stoppedSec === d.lastStopped) {
      d.stop0 = null;
      d.penal = false;
    }
    d.lastStopped = ride.stoppedSec;
    return ev;
  }

  // ゴースト(学習したいつものペース)との差。place の学習がなければ null
  function ghost(ride, place, now = Date.now()) {
    const L = place ? E.learned(place) : null;
    if (!L) return null;
    const elapsed = (now - ride.startedAt) / 1000;
    const gDist = elapsed * L.speed;
    const diff = ride.distance - gDist; // +なら前にいる
    const d = state(ride);
    const lp = Math.max(0, Math.min(LP_MAX, Math.round(LP0 - Math.max(0, -diff) * LP_PER_M) + d.lpBonus));
    let ev = null;
    if (elapsed > 60) {
      const ahead = diff >= 0;
      if (d.ahead != null && ahead !== d.ahead) ev = ahead ? "pass" : "passed";
      d.ahead = ahead;
    }
    return { diff, lp, ev };
  }

  // 終わったライドの勝敗: このライドの前までの学習値と比べる
  function result(r, place) {
    if (!place) return null;
    const trips = place.trips || [];
    const mine = trips.find((t) => t.rideId === r.id);
    if (!mine) return null;
    const L = E.learned({ trips: trips.filter((t) => t !== mine && t.at < mine.at) });
    const bonus = (r.duel && r.duel.lpBonus) || 0;
    if (!L) return { first: true, spc: (r.duel && r.duel.spc) || 0, bonus };
    const dist = r.distance;
    const diffSec = dist / L.speed - dist / mine.speed; // +なら速かった
    const win = diffSec > 0;
    const lp = Math.min(LP_MAX, (win ? LP0 : Math.max(0, Math.round(LP0 + diffSec * 20))) + bonus);
    return { win: win || (bonus > 0 && lp >= LP0), diffSec, lp, spc: (r.duel && r.duel.spc) || 0, bonus };
  }

  return { MAX_SPC, LP0, LP_MAX, CARDS, byId, deal, step, ghost, result, state };
})();

if (typeof module !== "undefined") module.exports = Duel;

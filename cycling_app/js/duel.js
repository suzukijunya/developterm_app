// デュエルモード(ライディング・デュエル風): 走った距離でたまるスピードカウンター(SPC)と、
// いつもの自分(目的地までの学習値)= ゴーストとのライフポイント(LP)勝負。
// 状態はライドの中(ride.duel)に持つので、再読み込みしても続きから数える。

const Duel = (() => {
  const E = typeof Eta !== "undefined" ? Eta : require("./eta.js");
  const MAX_SPC = 12;
  const LP0 = 4000;
  const STOP_PENALTY_SEC = 120; // 2分以上止まると、SPCが1つ減る(1回の停止につき1つ)
  const LP_PER_M = 4; // ゴーストに1m遅れるごとに減るLP(1km遅れで0)

  function state(ride) {
    if (!ride.duel) ride.duel = { spc: 0, km: 0, stop0: null, penal: false, ahead: null };
    return ride.duel;
  }

  // 測位ごとに呼ぶ。返り値: SPCが増えた/減ったときのイベント
  function step(ride) {
    const d = state(ride);
    const ev = [];
    while (ride.distance >= (d.km + 1) * 1000) {
      d.km++;
      if (d.spc < MAX_SPC) {
        d.spc++;
        ev.push({ type: "up", spc: d.spc });
      }
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
    const lp = Math.max(0, Math.min(LP0, Math.round(LP0 - Math.max(0, -diff) * LP_PER_M)));
    const d = state(ride);
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
    if (!L) return { first: true, spc: (r.duel && r.duel.spc) || 0 };
    const dist = r.distance;
    const diffSec = dist / L.speed - dist / mine.speed; // +なら速かった
    const win = diffSec > 0;
    const lp = win ? LP0 : Math.max(0, Math.round(LP0 + diffSec * 20));
    return { win, diffSec, lp, spc: (r.duel && r.duel.spc) || 0 };
  }

  return { MAX_SPC, LP0, step, ghost, result, state };
})();

if (typeof module !== "undefined") module.exports = Duel;

// 目的地までの残り時間を推定し、到着したライドから推定のクセを学習する。
//
// 学習するのは目的地ごとの2つの値:
//  - 実効速度: 走った距離 ÷ 信号待ちも含めた所要時間
//  - 遠回り率: 実際に走った距離 ÷ 出発地から目的地までの直線距離
// 新しいライドほど重く平均する。走行中は「今日のペース」と学習値を混ぜて使う。

const Eta = (() => {
  const P = typeof Physics !== "undefined" ? Physics : require("./physics.js");

  const ARRIVE_M = 150; // 目的地からこの距離以内なら到着
  const MATCH_M = 250; // ライドの終点がこの距離以内なら、その目的地へのライドとして学習する
  const MIN_TRIP_M = 500; // これより近い出発地からのライドは学習しない
  const DEFAULT_SPEED = 15 / 3.6; // 学習前の実効速度(信号待ち込み)
  const DEFAULT_DETOUR = 1.3; // 学習前の遠回り率
  const DECAY = 0.8; // 1回古くなるごとの重み
  const MAX_TRIPS = 30;

  // 目的地の学習値。trips は新しい順
  function learned(place) {
    const trips = (place && place.trips) || [];
    if (!trips.length) return null;
    let w = 1;
    let sw = 0;
    let speed = 0;
    let detour = 0;
    for (const t of trips) {
      sw += w;
      speed += w * t.speed;
      detour += w * t.detour;
      w *= DECAY;
    }
    return { speed: speed / sw, detour: detour / sw, n: trips.length };
  }

  // 走行中の推定。pos: { lat, lon }。ride: Tracker の状態
  function estimate(place, ride, pos) {
    const straight = P.distance(pos.lat, pos.lon, place.lat, place.lon);
    if (straight < ARRIVE_M) return { arrived: true, remainM: 0, sec: 0 };
    const L = learned(place);
    const remainM = straight * (L ? L.detour : DEFAULT_DETOUR);
    const elapsed = ride.movingSec + ride.stoppedSec + ride.gapSec;
    const today = ride.distance > 500 && elapsed > 60 ? ride.distance / elapsed : null;
    let speed;
    if (L && today) {
      // 進むほど今日のペース(風・疲れ・信号の運)を重く見る
      const progress = ride.distance / (ride.distance + remainM);
      const a = Math.max(0.15, Math.min(0.6, progress));
      speed = a * today + (1 - a) * L.speed;
    } else {
      speed = (L && L.speed) || today || DEFAULT_SPEED;
    }
    return { arrived: false, remainM, sec: remainM / speed, speed, learnedN: L ? L.n : 0 };
  }

  // 出発地から遠い目的地のうち、よく行く所を候補にする(通勤なら行き先が自動で選ばれる)
  function guess(places, pos) {
    const far = places.filter((p) => P.distance(pos.lat, pos.lon, p.lat, p.lon) > MIN_TRIP_M);
    far.sort((a, b) => (b.trips || []).length - (a.trips || []).length);
    return far[0] || null;
  }

  // 終わったライドが place への移動なら、学習用の記録を返す。
  // 走行中に到着を検知していれば、到着した時点の値を使う(着いてから終了を押すまでの時間を含めない)
  function tripFor(ride, place) {
    if (!ride.start || !ride.end) return null;
    const arr = ride.arrival && ride.arrival.placeId === place.id ? ride.arrival : null;
    if (!arr && P.distance(ride.end.lat, ride.end.lon, place.lat, place.lon) > MATCH_M) return null;
    const straight = P.distance(ride.start.lat, ride.start.lon, place.lat, place.lon);
    if (straight < MIN_TRIP_M) return null;
    const elapsed = arr ? arr.elapsed : ride.movingSec + ride.stoppedSec + ride.gapSec;
    const distance = arr ? arr.distance : ride.distance;
    if (elapsed < 60 || distance < straight * 0.8) return null;
    const trip = {
      rideId: ride.id,
      at: ride.endedAt,
      speed: distance / elapsed,
      detour: Math.max(1, Math.min(2.5, distance / straight)),
    };
    // 途中(半分の地点)で出していた予測が、実際の到着とどれだけずれたか
    if (ride.etaMid && ride.etaMid.placeId === place.id) {
      trip.errSec = ((arr ? arr.t : ride.endedAt) - ride.etaMid.arriveAt) / 1000;
    }
    return trip;
  }

  function addTrip(place, trip) {
    place.trips = [trip].concat((place.trips || []).filter((t) => t.rideId !== trip.rideId)).slice(0, MAX_TRIPS);
  }

  // 直近の予測のずれ(分)。予測を出していたライドだけで計算
  function accuracy(place) {
    const errs = (place.trips || []).filter((t) => typeof t.errSec === "number").slice(0, 5);
    if (!errs.length) return null;
    return { minutes: errs.reduce((s, t) => s + Math.abs(t.errSec), 0) / errs.length / 60, n: errs.length };
  }

  return { ARRIVE_M, learned, estimate, guess, tripFor, addTrip, accuracy };
})();

if (typeof module !== "undefined") module.exports = Eta;

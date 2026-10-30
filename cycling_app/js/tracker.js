// GPSの測位結果を1つずつ受け取り、距離・速度・勾配・パワー・消費カロリーを積み上げる。
// 画面やブラウザAPIには依存しない(テストで疑似的な測位を流せるようにするため)。

const Tracker = (() => {
  const P = typeof Physics !== "undefined" ? Physics : require("./physics.js");

  const MAX_ACCURACY = 35; // m。これより粗い測位は捨てる
  const GAP_SEC = 10; // これより長く測位が途切れたら「途切れ」として扱う
  const GRADE_DIST = 50; // m。この距離ごとに勾配を計算する
  const MAX_GRADE = 0.12;
  const MIN_GRADE = 0.01; // これより緩い勾配は平地とみなす(標高のぶれを坂と誤認しないため)
  const MAX_ALT_ACCURACY = 15; // m。これより粗い標高は使わない
  const CLIMB_STEP = 3; // m。獲得標高はこれ以上上がったときだけ数える
  // 電車・車の見分け: 時速50kmを超えて15秒続くか、時速80kmを超えたら乗り物とみなす。
  // 時速30kmを超えない状態が3分続いたら自転車に戻ったとみなす(駅で止まっている間は乗り物のまま)
  const VEHICLE_V = 50 / 3.6;
  const VEHICLE_MAX = 80 / 3.6;
  const VEHICLE_SEC = 15;
  const VEHICLE_KEEP_V = 30 / 3.6;
  const VEHICLE_EXIT_SEC = 180;

  function create(now) {
    return {
      id: String(now),
      startedAt: now,
      endedAt: null,
      distance: 0, // m
      movingSec: 0,
      stoppedSec: 0,
      gapSec: 0, // 画面が消えるなどで測位が途切れていた時間
      workJ: 0, // ペダルを回した仕事
      kcalBasal: 0,
      kcalExercise: 0,
      maxSpeed: 0, // m/s
      elevGain: 0, // m
      start: null, // 最初の測位地点 { lat, lon }
      // 以下は計算途中の状態
      last: null, // { lat, lon, t }
      vEma: 0,
      altEma: null,
      altRef: null, // { alt, dist }
      altLow: null, // 獲得標高を数えるための直近の最低点
      grade: 0,
      heading: null,
      power: 0, // 表示用(なめらかにしたパワー)
    };
  }

  // fix: { lat, lon, t(ms), accuracy, speed(m/s|null), altitude(m|null), altitudeAccuracy(m|null) }
  // env: { profile, wind: { speed, from, temp } | null }
  // 戻り値: "ok" | "inaccurate" | "first" | "skip"
  function step(ride, fix, env) {
    if (fix.accuracy > MAX_ACCURACY) return "inaccurate";
    if (!ride.last) {
      ride.start = { lat: fix.lat, lon: fix.lon };
      // 開始前に測った位置が届くことがあるので、開始時刻より前の時間は数えない
      ride.last = { lat: fix.lat, lon: fix.lon, t: Math.max(fix.t, ride.startedAt) };
      return "first";
    }
    const dt = (fix.t - ride.last.t) / 1000;
    if (dt < 0.5) return "skip";

    let d = P.distance(ride.last.lat, ride.last.lon, fix.lat, fix.lon);
    let raw = fix.speed != null && fix.speed >= 0 ? fix.speed : d / dt;
    // 止まっているときのGPSのぶれを距離に数えない
    if ((fix.speed != null && fix.speed < 0.5) || (fix.speed == null && d < fix.accuracy * 0.5)) {
      d = 0;
      raw = 0;
    }

    // 電車・車での移動は、自転車の距離・カロリーに入れない
    const vNow = d / dt;
    const fast = Math.max(raw, dt <= GAP_SEC ? vNow : 0);
    if (fast > VEHICLE_V) ride.fastSec = (ride.fastSec || 0) + dt;
    else (ride.fastSec = 0), (ride.fast = null);
    if (!ride.vehicle && (ride.fastSec >= VEHICLE_SEC || fast > VEHICLE_MAX)) {
      ride.vehicle = { since: fix.t, calm: 0, bike: 0 };
      // 乗り物とわかるまでの間に数えてしまった分を取り消す
      const f = ride.fast;
      if (f) {
        ride.distance -= f.d;
        ride.workJ -= f.work;
        ride.kcalExercise -= f.kcal;
        ride.movingSec -= f.sec;
        ride.vehicleDist = (ride.vehicleDist || 0) + f.d;
        ride.fast = null;
      }
    }
    if (ride.vehicle) {
      ride.vehicle.calm = fast > VEHICLE_KEEP_V ? 0 : ride.vehicle.calm + dt;
      // 自転車くらいの速さ(時速8〜30km)が1分続いたら、降りて自転車に乗ったとみなす
      const bikeLike = fast > 8 / 3.6 && fast <= VEHICLE_KEEP_V;
      ride.vehicle.bike = bikeLike ? ride.vehicle.bike + dt : Math.max(0, ride.vehicle.bike - dt * 0.5);
      // 自転車らしく走った分は、自転車に戻ったとわかったときに足せるように取っておく
      const pend = ride.vehicle.pend || (ride.vehicle.pend = { d: 0, work: 0, kcal: 0, sec: 0 });
      if (bikeLike) {
        const pw = P.legPower(env.profile, { v: fast });
        pend.d += d;
        pend.work += pw * dt;
        pend.kcal += P.kcalFor(env.profile, pw, dt).exercise;
        pend.sec += dt;
      } else if (fast > VEHICLE_KEEP_V) Object.assign(pend, { d: 0, work: 0, kcal: 0, sec: 0 });
      ride.vehicle.v = fast;
      if (ride.vehicle.calm >= VEHICLE_EXIT_SEC || ride.vehicle.bike >= 60) {
        if (ride.vehicle.bike >= 60) {
          ride.distance += pend.d;
          ride.workJ += pend.work;
          ride.kcalExercise += pend.kcal;
          ride.movingSec += pend.sec;
          ride.vehicleDist -= pend.d;
          ride.vEma = fast;
        }
        ride.vehicle = null;
      }
      else {
        ride.vehicleDist = (ride.vehicleDist || 0) + d;
        ride.vehicleSec = (ride.vehicleSec || 0) + dt;
        ride.kcalBasal += P.kcalFor(env.profile, 0, dt).basal;
        ride.vEma = 0;
        ride.last = { lat: fix.lat, lon: fix.lon, t: fix.t };
        return "vehicle";
      }
    }

    let v;
    let accel = 0;
    if (dt > GAP_SEC) {
      // 途切れていた区間は、平均速度で一定に走ったとみなす
      v = d / dt;
      ride.vEma = v;
      // 信号待ちで測位が来なかっただけ(ほぼ動いていない)なら途切れとはみなさない
      if (v >= P.STOP_SPEED) ride.gapSec += dt;
    } else {
      const prev = ride.vEma;
      ride.vEma += 0.5 * (raw - ride.vEma);
      v = ride.vEma;
      accel = Math.max(-1.5, Math.min(1.5, (v - prev) / dt));
    }

    if (d > 3) ride.heading = P.bearing(ride.last.lat, ride.last.lon, fix.lat, fix.lon);
    updateGrade(ride, fix, d);

    const wind = env.wind;
    const headwind = wind && ride.heading != null ? P.headwind(wind.speed, wind.from, ride.heading) : 0;
    const rho = P.airDensity(wind ? wind.temp : undefined);
    const power = P.legPower(env.profile, { v, accel, grade: ride.grade, headwind, rho });
    const kcal = P.kcalFor(env.profile, power, dt);

    // 時速50kmを超えている間の分は、乗り物とわかったときに取り消せるように覚えておく
    if (fast > VEHICLE_V) {
      const f = ride.fast || (ride.fast = { d: 0, work: 0, kcal: 0, sec: 0 });
      f.d += d;
      f.work += power * dt;
      f.kcal += kcal.exercise;
      if (v >= P.STOP_SPEED) f.sec += dt;
    }
    ride.distance += d;
    ride.workJ += power * dt;
    ride.kcalBasal += kcal.basal;
    ride.kcalExercise += kcal.exercise;
    if (v >= P.STOP_SPEED) ride.movingSec += dt;
    else ride.stoppedSec += dt;
    if (dt <= GAP_SEC) ride.maxSpeed = Math.max(ride.maxSpeed, v);
    ride.power += 0.3 * (power - ride.power);
    ride.last = { lat: fix.lat, lon: fix.lon, t: fix.t };
    return "ok";
  }

  // 標高はGPSのぶれが大きいので、強くなめらかにしてから一定距離ごとに勾配を出す
  function updateGrade(ride, fix, d) {
    if (fix.altitude == null) return;
    if (fix.altitudeAccuracy != null && fix.altitudeAccuracy > MAX_ALT_ACCURACY) return;
    ride.altEma = ride.altEma == null ? fix.altitude : ride.altEma + 0.05 * (fix.altitude - ride.altEma);
    if (!ride.altRef) {
      ride.altRef = { alt: ride.altEma, dist: 0 };
      ride.altLow = ride.altEma;
      return;
    }
    ride.altRef.dist += d;
    if (ride.altRef.dist >= GRADE_DIST) {
      const g = (ride.altEma - ride.altRef.alt) / ride.altRef.dist;
      ride.grade = Math.abs(g) < MIN_GRADE ? 0 : Math.max(-MAX_GRADE, Math.min(MAX_GRADE, g));
      ride.altRef = { alt: ride.altEma, dist: 0 };
    }
    if (ride.altEma < ride.altLow) ride.altLow = ride.altEma;
    else if (ride.altEma - ride.altLow >= CLIMB_STEP) {
      ride.elevGain += ride.altEma - ride.altLow;
      ride.altLow = ride.altEma;
    }
  }

  // 保存用に、計算途中の状態を除いた記録を作る
  function summary(ride, now) {
    return {
      id: ride.id,
      startedAt: ride.startedAt,
      endedAt: now,
      distance: ride.distance,
      movingSec: ride.movingSec,
      stoppedSec: ride.stoppedSec,
      gapSec: ride.gapSec,
      workJ: ride.workJ,
      kcalBasal: ride.kcalBasal,
      kcalExercise: ride.kcalExercise,
      maxSpeed: ride.maxSpeed,
      elevGain: ride.elevGain,
      start: ride.start,
      end: ride.last ? { lat: ride.last.lat, lon: ride.last.lon } : null,
      placeId: ride.placeId || null,
      etaMid: ride.etaMid || null,
      arrival: ride.arrival || null,
      // デュエルモードのスピードカウンター・使ったカード・カードで増えたLP
      vehicleDist: ride.vehicleDist || 0, // 電車・車と判断して数えなかった距離
      duel: ride.duel ? { spc: ride.duel.spc, used: ride.duel.used || [], lpBonus: ride.duel.lpBonus || 0, b: ride.duel.b ? { turn: ride.duel.b.turn, winner: ride.duel.b.winner, you: { lp: ride.duel.b.you.lp }, opp: { lp: ride.duel.b.opp.lp } } : null } : null,
    };
  }

  return { create, step, summary };
})();

if (typeof module !== "undefined") module.exports = Tracker;

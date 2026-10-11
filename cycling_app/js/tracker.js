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
      ride.last = { lat: fix.lat, lon: fix.lon, t: fix.t };
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
    };
  }

  return { create, step, summary };
})();

if (typeof module !== "undefined") module.exports = Tracker;

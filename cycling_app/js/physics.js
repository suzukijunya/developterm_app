// 走行中の必要パワーと消費カロリーを物理モデルで推定する。
// GPSの速度・標高と、体格・バイク重量・乗車姿勢から毎秒計算する。

const Physics = (() => {
  const G = 9.81;
  const DRIVETRAIN = 0.976; // チェーン・ギアの伝達効率
  const DELTA_EFF = 0.25; // 筋肉の効率(ペダルを回すエネルギーのうち、実際に仕事になる割合)
  const KCAL_PER_J = 1 / 4184;
  const STOP_SPEED = 0.8; // m/s(約3km/h)未満は停車とみなす

  // 乗車姿勢ごとの CdA(空気抵抗係数×前面投影面積, m²)。身長175cm・体重70kgの基準値。
  const POSTURES = {
    upright: { label: "上体を起こす", cda: 0.4 },
    hoods: { label: "ブラケット", cda: 0.32 },
    drops: { label: "下ハン", cda: 0.28 },
  };

  // 路面とタイヤの転がり抵抗係数
  const SURFACES = {
    good: { label: "きれいな舗装・細めのタイヤ", crr: 0.004 },
    city: { label: "一般的な都内の道", crr: 0.005 },
    rough: { label: "荒れた舗装・太めのタイヤ", crr: 0.007 },
  };

  // 体の前面投影面積(m²)。身長(m)・体重(kg)から(Bassettらの式)
  function frontalArea(heightM, massKg) {
    return 0.0293 * Math.pow(heightM, 0.725) * Math.pow(massKg, 0.425) + 0.0604;
  }

  const REF_AREA = frontalArea(1.75, 70);

  function cdaFor(profile) {
    const base = (POSTURES[profile.posture] || POSTURES.hoods).cda;
    return base * (frontalArea(profile.heightCm / 100, profile.weightKg) / REF_AREA);
  }

  function crrFor(profile) {
    return (SURFACES[profile.surface] || SURFACES.city).crr;
  }

  function totalMass(profile) {
    return profile.weightKg + profile.bikeKg + (profile.cargoKg || 0);
  }

  // 基礎代謝(kcal/日)。体組成計の「筋肉量」+ 骨量(約3kg)を除脂肪量とみなす(Katch-McArdle式)。
  // 筋肉量が未入力なら、体重から除脂肪量を概算する。
  function bmrPerDay(profile) {
    const lbm = profile.muscleKg > 0 ? profile.muscleKg + 3 : profile.weightKg * 0.8;
    return 370 + 21.6 * lbm;
  }

  // 空気密度(kg/m³)。気温(℃)から。気温不明なら15℃。
  function airDensity(tempC) {
    const t = typeof tempC === "number" ? tempC : 15;
    return 101325 / (287.05 * (t + 273.15));
  }

  // 1区間ぶんの脚のパワー(W)。
  // v: 速度 m/s、accel: 加速度 m/s²、grade: 勾配(0.05 = 5%)、headwind: 向かい風成分 m/s(追い風は負)
  function legPower(profile, { v, accel = 0, grade = 0, headwind = 0, rho }) {
    if (v < STOP_SPEED) return 0;
    const m = totalMass(profile);
    const theta = Math.atan(grade);
    const rolling = m * G * crrFor(profile) * Math.cos(theta);
    const gravity = m * G * Math.sin(theta);
    const inertia = m * accel;
    const vAir = v + headwind;
    const aero = 0.5 * (rho || airDensity()) * cdaFor(profile) * vAir * Math.abs(vAir);
    const wheel = v * (rolling + gravity + inertia + aero);
    // 下り坂やブレーキ中はペダルを止めている(マイナスのパワーは出さない)
    return Math.max(0, wheel / DRIVETRAIN);
  }

  // dt 秒間の消費カロリー(kcal)。基礎代謝分と運動分に分けて返す。
  function kcalFor(profile, powerW, dt) {
    const basal = (bmrPerDay(profile) / 86400) * dt;
    const exercise = (powerW / DELTA_EFF) * dt * KCAL_PER_J;
    return { basal, exercise };
  }

  // 2点間の距離(m)
  function distance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = Math.PI / 180;
    const dLat = (lat2 - lat1) * toRad;
    const dLon = (lon2 - lon1) * toRad;
    const a =
      Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  // 進行方向(度、北=0・東=90)
  function bearing(lat1, lon1, lat2, lon2) {
    const toRad = Math.PI / 180;
    const y = Math.sin((lon2 - lon1) * toRad) * Math.cos(lat2 * toRad);
    const x =
      Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad) -
      Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos((lon2 - lon1) * toRad);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  // 向かい風成分(m/s)。windFromDeg は風が吹いてくる方角(気象の慣例)。
  // 10m高の風速を、街中の自転車の高さ相当に弱める。
  const WIND_HEIGHT_FACTOR = 0.5;
  function headwind(windSpeed, windFromDeg, headingDeg) {
    const diff = ((windFromDeg - headingDeg) * Math.PI) / 180;
    return windSpeed * WIND_HEIGHT_FACTOR * Math.cos(diff);
  }

  return {
    POSTURES,
    SURFACES,
    STOP_SPEED,
    legPower,
    kcalFor,
    bmrPerDay,
    cdaFor,
    airDensity,
    distance,
    bearing,
    headwind,
  };
})();

if (typeof module !== "undefined") module.exports = Physics;

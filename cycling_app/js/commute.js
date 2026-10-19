// 通勤予報: 出発地・途中・目的地の天気から、いま出るとどうか(雨・向かい風・かかる時間)と、
// 3時間先までで一番よい出発時間を選ぶ。雨は15分ごとの降水量、なければ1時間ごとの降水確率で見る。

const Commute = (() => {
  const P = typeof Physics !== "undefined" ? Physics : require("./physics.js");
  const STEP = 15 * 60 * 1000;
  const SLOTS = 13; // いま〜3時間後まで、15分おき
  const WET_MM = 0.1; // 15分でこれ以上降ったら「雨」

  // 向かい風のときの速さ: 同じ脚の力で、風があるとどこまで落ちるか(二分法)
  function windFactor(profile, speed, hw) {
    if (Math.abs(hw) < 0.1) return 1;
    const target = P.legPower(profile, { v: speed });
    let lo = speed * 0.4, hi = speed * 1.6;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (P.legPower(profile, { v: mid, headwind: hw }) > target) hi = mid;
      else lo = mid;
    }
    return (lo + hi) / 2 / speed;
  }

  // points: [{ hourly: [{ t, pop, mm, speed, from }], m15: [{ t, mm }] }](出発地・途中・目的地の順)
  // trip: { from, to, distanceM, speed(信号込みの実効速度 m/s) }
  function plan(points, trip, profile, now = Date.now()) {
    const heading = P.bearing(trip.from.lat, trip.from.lon, trip.to.lat, trip.to.lon);
    const hourAt = (pt, t) => pt.hourly.filter((h) => h.t <= t).pop() || pt.hourly[0];
    const opts = [];
    for (let i = 0; i < SLOTS; i++) {
      const leave = i === 0 ? now : Math.ceil(now / STEP) * STEP + (i - 1) * STEP;
      // 風は行程の真ん中の時刻、各地点の平均
      let hw = 0;
      const mid0 = leave + (trip.distanceM / trip.speed / 2) * 1000;
      for (const pt of points) {
        const h = hourAt(pt, mid0);
        if (!h) continue;
        hw += P.headwind(h.speed, h.from, heading);
      }
      hw /= points.length || 1;
      // 実効速度のうち、走っている部分だけ風の影響を受けるとみなす(信号待ちは変わらない)
      const k = windFactor(profile, Math.max(4, trip.speed * 1.35), hw);
      const sec = trip.distanceM / (trip.speed * (0.25 + 0.75 * k));
      const arrive = leave + sec * 1000;
      // 雨: 行程の間の、地点ごとの15分降水量の最大と、1時間の降水確率の最大。
      // 出発地は走り始め、途中は真ん中、目的地は着くころの天気を見る
      let mm = 0, pop = 0, hasM15 = false;
      const n = points.length;
      points.forEach((pt, j) => {
        const t0 = n > 1 ? Math.max(leave, leave + (sec * 1000 * (j - 0.5)) / (n - 1)) : leave;
        const t1 = n > 1 ? Math.min(arrive, leave + (sec * 1000 * (j + 0.5)) / (n - 1)) : arrive;
        const m = (pt.m15 || []).filter((x) => x.t < t1 && x.t + STEP > t0);
        if (m.length) hasM15 = true;
        for (const x of m) mm = Math.max(mm, x.mm || 0);
        for (const h of pt.hourly) if (h.t + 3600000 > leave && h.t < arrive) pop = Math.max(pop, h.pop || 0);
      });
      const wet = hasM15 ? mm >= WET_MM : pop >= 60;
      const wait = (leave - now) / 60000;
      // 点数(小さいほどよい): かかる時間 + 雨 + 待つ時間(早く出たい)
      const score = sec / 60 + (wet ? 45 + mm * 20 : 0) + pop * 0.15 + wait * 0.25;
      opts.push({ leave, arrive, sec, hw, mm, pop, wet, wait, score });
    }
    const nowOpt = opts[0];
    const best = opts.reduce((a, b) => (b.score < a.score ? b : a), nowOpt);
    // 雨が止む / 降り出す時刻(出発地、15分ごと)
    const m0 = (points[0] && points[0].m15) || [];
    const rainNow = m0.length ? (m0.find((x) => x.t <= now && x.t + STEP > now) || m0[0]).mm >= WET_MM : false;
    const change = m0.find((x) => x.t > now && (x.mm >= WET_MM) !== rainNow);
    return { heading, now: nowOpt, best, opts, rainNow, stopAt: rainNow && change ? change.t : null, startAt: !rainNow && change ? change.t : null, message: message(nowOpt, best, rainNow, change) };
  }

  const hm = (ms) => {
    const d = new Date(ms);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  const windTxt = (hw) => (hw > 0.5 ? `向かい風${hw.toFixed(1)}m/s` : hw < -0.5 ? `追い風${(-hw).toFixed(1)}m/s` : "風の影響ほぼなし");

  function message(nowOpt, best, rainNow, change) {
    const waitMin = Math.round(best.wait);
    if (nowOpt.wet && !best.wet && best !== nowOpt)
      return { level: "wait", text: `☔ いまは雨。あと${waitMin}分待つと止みそうです(${hm(best.leave)}出発がおすすめ)` };
    if (nowOpt.wet) return { level: "rain", text: `☔ 3時間先まで雨が続きそうです。レインウェアを${rainNow ? "着て" : "持って"}出発を` };
    if (!rainNow && change && change.t < nowOpt.arrive + 60 * 60000)
      return { level: "go", text: `🏃 ${hm(change.t)}ごろから雨。いま出れば${hm(nowOpt.arrive)}に濡れずに着けそうです` };
    if (best !== nowOpt && nowOpt.sec - best.sec > 120 && best.wait <= 90)
      return { level: "wait", text: `🌬️ ${hm(best.leave)}に出ると風が弱まり、約${Math.round((nowOpt.sec - best.sec) / 60)}分早く着きそうです` };
    return { level: "go", text: `✅ いまが出発どきです。${windTxt(nowOpt.hw)}・約${Math.round(nowOpt.sec / 60)}分` };
  }

  return { plan, windFactor, windTxt, hm };
})();

if (typeof module !== "undefined") module.exports = Commute;

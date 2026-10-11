// 画面の描画と、GPS・画面ON維持・天気(風)の取得をまとめる。

(() => {
  const app = document.getElementById("app");

  let view = Store.profileSet ? "ride" : "settings";
  let ride = null; // 記録中のライド(Tracker の状態)
  let watchId = null;
  let wind = null; // { speed, from, temp, at }
  let windFetching = false;
  let gpsStatus = ""; // GPSの状態メッセージ
  let lastAccuracy = null;
  let lastSaved = 0;
  let lastResult = null; // 直前に終了したライドの記録
  let wakeLock = null;
  let wakeError = "";
  let resumed = false;

  const FOODS = [
    { name: "おにぎり", kcal: 180, unit: "個" },
    { name: "缶ビール(350ml)", kcal: 140, unit: "本" },
    { name: "ラーメン", kcal: 500, unit: "杯" },
  ];

  // ---------- 表示用の整形 ----------
  const fmt = {
    kcal: (n) => Math.round(n).toLocaleString("ja-JP"),
    km: (m) => (m / 1000).toFixed(m < 10000 ? 2 : 1),
    kmh: (ms) => (ms * 3.6).toFixed(1),
    dur(sec) {
      const s = Math.max(0, Math.round(sec));
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const ss = String(s % 60).padStart(2, "0");
      return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
    },
    min(sec) {
      const m = Math.round(sec / 60);
      return m >= 60 ? `${Math.floor(m / 60)}時間${m % 60}分` : `${m}分`;
    },
    date(ms) {
      const d = new Date(ms);
      const w = "日月火水木金土"[d.getDay()];
      return `${d.getMonth() + 1}月${d.getDate()}日(${w})`;
    },
    time(ms) {
      const d = new Date(ms);
      return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
    },
  };

  const COMPASS = ["北", "北北東", "北東", "東北東", "東", "東南東", "南東", "南南東", "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西"];
  const compass = (deg) => COMPASS[Math.round(deg / 22.5) % 16];

  function dayKey(ms) {
    const d = new Date(ms);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  const totalKcal = (r) => r.kcalBasal + r.kcalExercise;

  // ---------- 画面ON維持(Screen Wake Lock) ----------
  function wantWake() {
    return Store.prefs.wake === "always" || !!ride;
  }

  async function updateWake() {
    if (!("wakeLock" in navigator)) {
      wakeError = "unsupported";
      return;
    }
    if (wantWake() && !wakeLock && document.visibilityState === "visible") {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeError = "";
        wakeLock.addEventListener("release", () => {
          wakeLock = null;
          renderWake();
        });
      } catch (e) {
        // Safari などは画面をタップした後でないと許可されないことがある(タップ時に再試行)
        wakeError = "pending";
      }
    } else if (!wantWake() && wakeLock) {
      await wakeLock.release().catch(() => {});
      wakeLock = null;
    }
    renderWake();
  }

  function wakeText() {
    if (wakeLock) return { cls: "on", text: "画面ON維持中" };
    if (wakeError === "unsupported") return { cls: "off", text: "この端末は画面ON維持に非対応(自動ロックを手動でオフに)" };
    if (!wantWake()) return { cls: "", text: "画面ON維持:走行中のみ" };
    return { cls: "off", text: "画面ON維持:画面をタップすると有効になります" };
  }

  function renderWake() {
    const el = document.getElementById("wake");
    if (!el) return;
    const w = wakeText();
    el.className = "pill " + w.cls;
    el.textContent = w.text;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") updateWake();
    else if (ride) persist(true); // 画面が消える前に記録を保存しておく
  });
  document.addEventListener("pointerdown", () => {
    if (!wakeLock && wantWake()) updateWake();
  });

  // ---------- 風(Open-Meteo) ----------
  async function fetchWind(lat, lon) {
    if (!Store.prefs.wind || windFetching) return;
    if (wind && Date.now() - wind.at < 15 * 60 * 1000) return;
    windFetching = true;
    try {
      // 位置は約1km単位に丸めて送る
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" + lat.toFixed(2) + "&longitude=" + lon.toFixed(2) +
        "&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms";
      const res = await fetch(url);
      const data = await res.json();
      const c = data.current;
      wind = { speed: c.wind_speed_10m, from: c.wind_direction_10m, temp: c.temperature_2m, at: Date.now() };
    } catch (e) {
      // 取得できなければ無風として計算する
    } finally {
      windFetching = false;
    }
  }

  // ---------- GPS ----------
  function startGps() {
    if (!("geolocation" in navigator)) {
      gpsStatus = "この端末では位置情報が使えません";
      return;
    }
    gpsStatus = "GPSを探しています…";
    watchId = navigator.geolocation.watchPosition(onPosition, onGpsError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 30000,
    });
  }

  function stopGps() {
    if (watchId != null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  function onPosition(pos) {
    if (!ride) return;
    const c = pos.coords;
    lastAccuracy = c.accuracy;
    const fix = {
      lat: c.latitude,
      lon: c.longitude,
      t: pos.timestamp,
      accuracy: c.accuracy,
      speed: c.speed,
      altitude: c.altitude,
      altitudeAccuracy: c.altitudeAccuracy,
    };
    const result = Tracker.step(ride, fix, { profile: Store.profile, wind: Store.prefs.wind ? wind : null });
    gpsStatus = result === "inaccurate" ? `GPSの精度が低いため待っています(±${Math.round(c.accuracy)}m)` : "";
    fetchWind(c.latitude, c.longitude);
    persist(false);
    renderLive();
  }

  function onGpsError(err) {
    if (err.code === 1) {
      gpsStatus = "位置情報の利用が許可されていません。ブラウザの設定で許可してください";
    } else {
      gpsStatus = "GPSの電波を待っています…";
    }
    renderLive();
  }

  function persist(force) {
    const now = Date.now();
    if (!force && now - lastSaved < 10000) return;
    lastSaved = now;
    Store.setActive(ride);
  }

  // ---------- ライドの開始・終了 ----------
  function startRide() {
    ride = Tracker.create(Date.now());
    lastResult = null;
    resumed = false;
    Store.setActive(ride);
    startGps();
    updateWake();
    render();
  }

  function finishRide() {
    if (!ride) return;
    const now = Date.now();
    const tooShort = ride.distance < 50;
    if (tooShort) {
      if (!confirm("ほとんど走っていません。この記録を破棄しますか?")) return;
    } else if (!confirm("ライドを終了して保存しますか?")) {
      return;
    }
    stopGps();
    if (!tooShort) {
      lastResult = Tracker.summary(ride, now);
      Store.addRide(lastResult);
    }
    ride = null;
    Store.setActive(null);
    updateWake();
    render();
  }

  // 再読み込みや画面の切り替えで中断したライドを続きから記録する(3時間以上前なら終了扱い)
  function restoreActive() {
    const a = Store.active;
    if (!a) return;
    const lastT = a.last ? a.last.t : a.startedAt;
    if (Date.now() - lastT < 3 * 3600 * 1000) {
      ride = a;
      resumed = true;
      startGps();
    } else {
      if (a.distance >= 50) Store.addRide(Tracker.summary(a, lastT));
      Store.setActive(null);
    }
  }

  // ---------- 描画 ----------
  function render() {
    app.innerHTML = `
      <main class="main">${view === "ride" ? rideView() : view === "history" ? historyView() : settingsView()}</main>
      <nav class="tabs">
        ${tab("ride", "🚴", ride ? "走行中" : "走る")}
        ${tab("history", "📋", "記録")}
        ${tab("settings", "⚙️", "設定")}
      </nav>`;
    bind();
    renderWake();
    renderLive();
  }

  function tab(id, icon, label) {
    return `<button class="tab ${view === id ? "active" : ""}" data-view="${id}"><span>${icon}</span>${label}</button>`;
  }

  function todayRides() {
    const k = dayKey(Date.now());
    return Store.rides.filter((r) => dayKey(r.startedAt) === k);
  }

  function rideView() {
    if (ride) {
      return `
        <section class="live">
          ${resumed ? `<p class="notice">前回の記録の続きから計測しています</p>` : ""}
          <div class="hero">
            <div class="hero-label">消費カロリー</div>
            <div class="hero-value"><span id="kcal">0</span><small>kcal</small></div>
            <div class="hero-sub" id="food"></div>
          </div>
          <div class="grid">
            ${metric("power", "パワー", "W")}
            ${metric("speed", "速度", "km/h")}
            ${metric("dist", "距離", "km")}
            ${metric("elapsed", "経過時間", "")}
            ${metric("moving", "走行時間", "")}
            ${metric("stopped", "信号待ちなど", "")}
          </div>
          <div class="status">
            <span id="gps" class="pill"></span>
            <span id="windinfo" class="pill"></span>
            <span id="wake" class="pill"></span>
          </div>
          <p class="notice warn" id="gapwarn" hidden></p>
          <button class="btn stop" id="finish">ライドを終了</button>
        </section>`;
    }
    const today = todayRides();
    const todayKcal = today.reduce((s, r) => s + totalKcal(r), 0);
    return `
      ${lastResult ? resultCard(lastResult) : ""}
      <section class="card today">
        <div class="today-label">今日の合計</div>
        <div class="today-value">${fmt.kcal(todayKcal)}<small>kcal</small></div>
        <div class="muted">${today.length}回のライド・${fmt.km(today.reduce((s, r) => s + r.distance, 0))}km</div>
      </section>
      <button class="btn start" id="start">ライドを開始</button>
      <p class="muted center">
        ${Store.profile.weightKg}kg + バイク${Store.profile.bikeKg}kg + 荷物${Store.profile.cargoKg}kg・${Physics.POSTURES[Store.profile.posture].label}で計算
        <br /><button class="link" data-view="settings">体格・バイクを変更</button>
      </p>
      <div class="status center"><span id="wake" class="pill"></span></div>`;
  }

  function metric(id, label, unit) {
    return `<div class="metric"><div class="metric-label">${label}</div><div class="metric-value"><span id="${id}">–</span>${unit ? `<small>${unit}</small>` : ""}</div></div>`;
  }

  function foodLine(kcal, all) {
    const list = all ? FOODS : FOODS.slice(0, 1);
    return list.map((f) => `${f.name} ${(kcal / f.kcal).toFixed(1)}${f.unit}分`).join(" / ");
  }

  function resultCard(r) {
    const k = totalKcal(r);
    return `
      <section class="card result">
        <h2>おつかれさまでした!</h2>
        <div class="result-kcal">${fmt.kcal(k)}<small>kcal</small></div>
        <p class="muted">${foodLine(k, true)}</p>
        ${detailTable(r)}
      </section>`;
  }

  function detailTable(r) {
    const avgSpeed = r.movingSec > 0 ? r.distance / r.movingSec : 0;
    const avgPower = r.movingSec > 0 ? r.workJ / r.movingSec : 0;
    const rows = [
      ["距離", fmt.km(r.distance) + " km"],
      ["走行時間", fmt.min(r.movingSec)],
      ["信号待ちなど", fmt.min(r.stoppedSec)],
      ["平均速度(走行中)", fmt.kmh(avgSpeed) + " km/h"],
      ["最高速度", fmt.kmh(r.maxSpeed) + " km/h"],
      ["平均パワー(走行中)", Math.round(avgPower) + " W"],
      ["獲得標高", Math.round(r.elevGain) + " m"],
      ["運動で増えた分", fmt.kcal(r.kcalExercise) + " kcal"],
      ["基礎代謝分", fmt.kcal(r.kcalBasal) + " kcal"],
    ];
    return `
      <dl class="detail">${rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>
      ${r.gapSec > 30 ? `<p class="notice warn">画面が消えるなどで${fmt.min(r.gapSec)}ほど計測が途切れました。その間は平均速度で走ったものとして計算しています。</p>` : ""}`;
  }

  function historyView() {
    if (!Store.rides.length) {
      return `<section class="card"><h2>記録</h2><p class="muted">まだライドの記録がありません。「走る」からライドを開始すると、ここに保存されます。</p></section>`;
    }
    const groups = [];
    for (const r of Store.rides) {
      const k = dayKey(r.startedAt);
      let g = groups[groups.length - 1];
      if (!g || g.key !== k) groups.push((g = { key: k, date: r.startedAt, rides: [] }));
      g.rides.push(r);
    }
    const week = weekTotal();
    return `
      <section class="card">
        <div class="today-label">直近7日間</div>
        <div class="today-value">${fmt.kcal(week.kcal)}<small>kcal</small></div>
        <div class="muted">${week.count}回のライド・${fmt.km(week.dist)}km・${foodLine(week.kcal, false)}</div>
      </section>
      ${groups
        .map(
          (g) => `
        <h3 class="day">${fmt.date(g.date)}<span>${fmt.kcal(g.rides.reduce((s, r) => s + totalKcal(r), 0))} kcal</span></h3>
        ${g.rides
          .map(
            (r) => `
          <details class="card ride">
            <summary>
              <span class="ride-time">${fmt.time(r.startedAt)}〜${fmt.time(r.endedAt)}</span>
              <span class="ride-main">${fmt.kcal(totalKcal(r))} kcal</span>
              <span class="ride-sub">${fmt.km(r.distance)}km・${fmt.min(r.movingSec + r.stoppedSec)}</span>
            </summary>
            ${detailTable(r)}
            <button class="link danger" data-delete="${r.id}">この記録を削除</button>
          </details>`
          )
          .join("")}`
        )
        .join("")}`;
  }

  function weekTotal() {
    const since = Date.now() - 7 * 86400 * 1000;
    const list = Store.rides.filter((r) => r.startedAt >= since);
    return {
      count: list.length,
      kcal: list.reduce((s, r) => s + totalKcal(r), 0),
      dist: list.reduce((s, r) => s + r.distance, 0),
    };
  }

  function settingsView() {
    const p = Store.profile;
    const pr = Store.prefs;
    const options = (obj, cur) =>
      Object.entries(obj)
        .map(([k, v]) => `<option value="${k}" ${k === cur ? "selected" : ""}>${v.label}</option>`)
        .join("");
    return `
      <form class="card form" id="settings">
        <h2>体格・バイク</h2>
        ${!Store.profileSet ? `<p class="notice">はじめに体格とバイクの重さを入力してください。消費カロリーの計算に使います。</p>` : ""}
        ${numField("heightCm", "身長", "cm", p.heightCm, 120, 220, 1)}
        ${numField("weightKg", "体重", "kg", p.weightKg, 30, 200, 0.1)}
        ${numField("muscleKg", "筋肉量(体組成計の値)", "kg", p.muscleKg || "", 10, 120, 0.1, "わからなければ空欄で大丈夫です")}
        ${numField("bikeKg", "バイクの重さ", "kg", p.bikeKg, 3, 30, 0.1, "ボトル・ライト・ペダル込みの重さ")}
        ${numField("cargoKg", "荷物の重さ", "kg", p.cargoKg, 0, 30, 0.1, "通勤リュックなど")}
        <label class="field"><span>乗車姿勢</span><select name="posture">${options(Physics.POSTURES, p.posture)}</select></label>
        <label class="field"><span>路面・タイヤ</span><select name="surface">${options(Physics.SURFACES, p.surface)}</select></label>

        <h2>計算と画面</h2>
        <label class="check"><input type="checkbox" name="wind" ${pr.wind ? "checked" : ""} />
          <span>風を計算に入れる<small>天気予報(Open-Meteo)から現在地付近の風向き・風速を取得します。送る位置は約1km単位に丸めます</small></span></label>
        <label class="field"><span>画面を消さない</span>
          <select name="wake">
            <option value="always" ${pr.wake === "always" ? "selected" : ""}>開いている間ずっと</option>
            <option value="riding" ${pr.wake === "riding" ? "selected" : ""}>走行中のみ</option>
          </select></label>

        <button class="btn start" type="submit">保存</button>
        <p class="muted small">基礎代謝 約${Math.round(Physics.bmrPerDay(p))}kcal/日・空気抵抗係数(CdA) ${Physics.cdaFor(p).toFixed(3)}m²</p>
      </form>
      <section class="card">
        <h2>計算のしくみ</h2>
        <p class="muted">GPSの速度と標高の変化から、毎秒「転がり抵抗」「坂を登る力」「加速」「空気抵抗(風を含む)」に必要なパワーを計算します。脚の筋肉の効率を25%として、そのパワーを消費カロリーに換算し、基礎代謝分を足しています。</p>
        <p class="muted">パワーメーターではなく推定値です。風の強い日や、GPSが乱れやすいビル街では誤差が大きくなります。</p>
      </section>`;
  }

  function numField(name, label, unit, value, min, max, step, hint) {
    return `
      <label class="field"><span>${label}${hint ? `<small>${hint}</small>` : ""}</span>
        <span class="input-unit"><input type="number" inputmode="decimal" name="${name}" value="${value}" min="${min}" max="${max}" step="${step}" ${name === "muscleKg" ? "" : "required"} /><em>${unit}</em></span>
      </label>`;
  }

  // 計測中の数字だけを書き換える(画面全体を描き直さない)
  function renderLive() {
    if (!ride || view !== "ride") return;
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    const k = totalKcal(ride);
    const moving = ride.vEma >= Physics.STOP_SPEED;
    set("kcal", fmt.kcal(k));
    set("food", foodLine(k, false));
    set("power", moving ? Math.round(ride.power) : "0");
    set("speed", fmt.kmh(moving ? ride.vEma : 0));
    set("dist", fmt.km(ride.distance));
    set("elapsed", fmt.dur((Date.now() - ride.startedAt) / 1000));
    set("moving", fmt.dur(ride.movingSec));
    set("stopped", fmt.dur(ride.stoppedSec));

    const gps = document.getElementById("gps");
    if (gps) {
      gps.textContent = gpsStatus || (lastAccuracy != null ? `GPS ±${Math.round(lastAccuracy)}m` : "GPSを探しています…");
      gps.className = "pill " + (gpsStatus ? "off" : "on");
    }
    const w = document.getElementById("windinfo");
    if (w) {
      if (!Store.prefs.wind) w.textContent = "風:計算に入れない";
      else if (!wind) w.textContent = "風:取得中…";
      else {
        const hw = ride.heading != null ? Physics.headwind(wind.speed, wind.from, ride.heading) : 0;
        const dir = hw > 0.3 ? `向かい風 ${hw.toFixed(1)}m/s` : hw < -0.3 ? `追い風 ${(-hw).toFixed(1)}m/s` : "横風";
        w.textContent = `${compass(wind.from)}の風 ${wind.speed.toFixed(1)}m/s・${dir}`;
      }
    }
    const gap = document.getElementById("gapwarn");
    if (gap) {
      gap.hidden = ride.gapSec < 30;
      gap.textContent = `画面が消えるなどで${fmt.min(ride.gapSec)}ほど計測が途切れました。その間は平均速度で走ったものとして計算しています。`;
    }
  }

  function bind() {
    app.querySelectorAll("[data-view]").forEach((b) =>
      b.addEventListener("click", () => {
        view = b.dataset.view;
        render();
        window.scrollTo(0, 0);
      })
    );
    const start = document.getElementById("start");
    if (start) start.addEventListener("click", startRide);
    const finish = document.getElementById("finish");
    if (finish) finish.addEventListener("click", finishRide);
    app.querySelectorAll("[data-delete]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("この記録を削除しますか?")) return;
        Store.deleteRide(b.dataset.delete);
        render();
      })
    );
    const form = document.getElementById("settings");
    if (form) form.addEventListener("submit", onSaveSettings);
  }

  function onSaveSettings(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const num = (k) => parseFloat(f.get(k)) || 0;
    Store.setProfile({
      heightCm: num("heightCm"),
      weightKg: num("weightKg"),
      muscleKg: num("muscleKg"),
      bikeKg: num("bikeKg"),
      cargoKg: num("cargoKg"),
      posture: f.get("posture"),
      surface: f.get("surface"),
    });
    Store.setPrefs({ wind: f.get("wind") === "on", wake: f.get("wake") });
    updateWake();
    view = "ride";
    render();
    window.scrollTo(0, 0);
  }

  // 経過時間は測位がなくても1秒ごとに進める
  setInterval(() => {
    if (ride) renderLive();
  }, 1000);

  restoreActive();
  render();
  updateWake();
})();

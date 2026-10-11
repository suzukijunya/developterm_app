// 画面の描画と、GPS・画面ON維持・天気・目的地の推定をまとめる。

(() => {
  const app = document.getElementById("app");

  let view = Store.profileSet ? "ride" : "settings";
  let ride = null; // 記録中のライド(Tracker の状態)
  let pos = null; // 現在地 { lat, lon }
  let watchId = null;
  let gpsStatus = ""; // GPSの状態メッセージ
  let lastAccuracy = null;
  let lastSaved = 0;
  let lastResult = null; // 直前に終了したライドの記録
  let wakeLock = null;
  let wakeError = "";
  let resumed = false;
  let editMode = false; // 記録画面の選択削除モード
  let selected = new Set();
  let locatedAt = 0; // 天気のために現在地を取った時刻
  let weatherStatus = "";
  // 設定画面の目的地作成フォーム(描き直しても入力が消えないように保持する)
  // pick: 地図で確認中の場所 { lat, lon, label }
  let placeForm = { name: "", query: "", results: [], status: "", pick: null };
  let pickMap = null; // 地図(Leaflet)

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

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function dayKey(ms) {
    const d = new Date(ms);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  const totalKcal = (r) => r.kcalBasal + r.kcalExercise;
  const placeById = (id) => Store.places.find((p) => p.id === id) || null;

  // よく使う目的地(選んだ回数+到着した回数の多い順、同じなら作成順)
  function favorites() {
    const score = (p) => (p.uses || 0) + (p.trips || []).length;
    return Store.places
      .map((p, i) => ({ p, i }))
      .sort((a, b) => score(b.p) - score(a.p) || a.i - b.i)
      .slice(0, 2)
      .map((x) => x.p);
  }

  // 次のライドの目的地。選んでいなければ、最後にわかった現在地から遠い目的地を自動で選ぶ
  function plannedDest() {
    const id = Store.prefs.destId;
    if (id === "none") return null;
    if (id) return placeById(id);
    return Store.lastPos ? Eta.guess(Store.places, Store.lastPos) : null;
  }

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
    if (document.visibilityState === "visible") {
      updateWake();
      if (!ride && view === "ride") locateForWeather();
    } else if (ride) persist(true); // 画面が消える前に記録を保存しておく
  });
  document.addEventListener("pointerdown", () => {
    if (!wakeLock && wantWake()) updateWake();
  });

  // ---------- 天気 ----------
  // 走行中の計算に使う風。天気予報を使わない設定なら無風
  function currentWind() {
    const w = Store.prefs.wind && Weather.latest;
    return w ? w.current : null;
  }

  function refreshWeather(p) {
    if (!Store.prefs.wind || !p) return;
    Weather.get(p.lat, p.lon).then(() => {
      if (ride) renderLive();
      else renderWeather();
    });
  }

  // 走っていないときは、現在地を1回だけ取って天気を出す(10分に1回まで)
  function locateForWeather() {
    if (!Store.prefs.wind) return;
    if (Store.lastPos) refreshWeather(Store.lastPos);
    if (!("geolocation" in navigator) || Date.now() - locatedAt < 10 * 60 * 1000) return;
    locatedAt = Date.now();
    navigator.geolocation.getCurrentPosition(
      (p) => {
        Store.setLastPos({ lat: p.coords.latitude, lon: p.coords.longitude });
        weatherStatus = "";
        refreshWeather(Store.lastPos);
      },
      (err) => {
        if (!Store.lastPos) weatherStatus = err.code === 1 ? "位置情報を許可すると、現在地の天気を表示します" : "現在地を取得できませんでした";
        renderWeather();
      },
      { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: 20000 }
    );
  }

  // 天気カード(走っていないときのホーム画面)
  function renderWeather() {
    const el = document.getElementById("weather");
    if (!el) return;
    const w = Store.prefs.wind ? Weather.latest : null;
    if (!w) {
      el.innerHTML = Store.prefs.wind
        ? `<p class="muted">${weatherStatus || "天気を取得しています…"}</p>`
        : `<p class="muted">設定で「天気予報を使う」をオンにすると、1時間ごとの天気を表示します。</p>`;
      return;
    }
    const c = w.current;
    const d = Weather.describe(c.code);
    // 行き先の方向に対して向かい風か追い風か
    const here = Store.lastPos;
    const dest = here ? plannedDest() : null;
    const heading = dest ? Physics.bearing(here.lat, here.lon, dest.lat, dest.lon) : null;
    const rain = w.hourly.slice(0, 4).find((h) => h.pop >= 50);
    el.innerHTML = `
      <div class="wx-now">
        <span class="wx-icon">${d.icon}</span>
        <div>
          <div class="wx-temp">${Math.round(c.temp)}°<span>${d.label}</span></div>
          <div class="muted small">${compass(c.from)}の風 ${c.speed.toFixed(1)}m/s${dest ? `・${esc(dest.name)}へは${windWord(c, heading)}` : ""}</div>
        </div>
      </div>
      ${rain ? `<p class="notice warn">🌂 ${new Date(rain.t).getHours()}時ごろ 降水確率${rain.pop}%</p>` : ""}
      <div class="hours">
        ${w.hourly
          .map((h) => {
            const hd = Weather.describe(h.code);
            const hw = heading != null ? Physics.headwind(h.speed, h.from, heading) : 0;
            return `
            <div class="hour">
              <div class="hour-t">${new Date(h.t).getHours()}時</div>
              <div class="hour-i">${hd.icon}</div>
              <div class="hour-temp">${Math.round(h.temp)}°</div>
              <div class="hour-pop ${h.pop >= 50 ? "wet" : ""}">☔${h.pop}%</div>
              <div class="hour-wind"><span class="arrow" style="transform:rotate(${(h.from + 180) % 360}deg)">↑</span>${Math.round(h.speed)}m</div>
              ${heading != null ? `<div class="hour-hw ${hw > 0.5 ? "head" : hw < -0.5 ? "tail" : ""}">${hw > 0.5 ? "向かい" : hw < -0.5 ? "追い" : "横"}</div>` : ""}
            </div>`;
          })
          .join("")}
      </div>
      <p class="muted small">矢印は風が吹いていく向き${dest ? `。下の段は${esc(dest.name)}へ向かうときの風` : ""}</p>`;
  }

  function windWord(w, heading) {
    const hw = Physics.headwind(w.speed, w.from, heading);
    return hw > 0.5 ? "向かい風" : hw < -0.5 ? "追い風" : "横風";
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

  function onPosition(p) {
    if (!ride) return;
    const c = p.coords;
    lastAccuracy = c.accuracy;
    const fix = {
      lat: c.latitude,
      lon: c.longitude,
      t: p.timestamp,
      accuracy: c.accuracy,
      speed: c.speed,
      altitude: c.altitude,
      altitudeAccuracy: c.altitudeAccuracy,
    };
    const result = Tracker.step(ride, fix, { profile: Store.profile, wind: currentWind() });
    gpsStatus = result === "inaccurate" ? `GPSの精度が低いため待っています(±${Math.round(c.accuracy)}m)` : "";
    if (result !== "inaccurate") pos = { lat: c.latitude, lon: c.longitude };
    // 走り始めたら、行き先を自動で選ぶ(あとでタップして変えられる)
    if (pos && ride.placeId === undefined) {
      ride.placeId = (Eta.guess(Store.places, pos) || {}).id || null;
      if (ride.placeId) Store.markUsed(ride.placeId);
    }
    updateEta();
    refreshWeather(pos);
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
    // 目的地を選んでいなければ、最初の測位で現在地から自動で選ぶ
    const id = Store.prefs.destId;
    ride.placeId = id === "none" ? null : placeById(id) ? id : undefined;
    if (ride.placeId) Store.markUsed(ride.placeId);
    pos = null;
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
      learnFrom(lastResult);
      Store.addRide(lastResult);
      if (lastResult.end) Store.setLastPos(lastResult.end);
    }
    ride = null;
    Store.setActive(null);
    Store.setPrefs({ destId: null }); // 次のライドは現在地から自動で選び直す(帰り道なら自宅に切り替わる)
    updateWake();
    render();
  }

  // 目的地に着いたライドなら、その目的地の所要時間の学習に加える
  function learnFrom(r) {
    for (const place of Store.places) {
      const trip = Eta.tripFor(r, place);
      if (!trip) continue;
      Eta.addTrip(place, trip);
      r.arrivedPlaceId = place.id;
      Store.savePlaces();
      return place;
    }
    return null;
  }

  // 再読み込みや画面の切り替えで中断したライドを続きから記録する(3時間以上前なら終了扱い)
  function restoreActive() {
    const a = Store.active;
    if (!a) return;
    const lastT = a.last ? a.last.t : a.startedAt;
    if (Date.now() - lastT < 3 * 3600 * 1000) {
      ride = a;
      resumed = true;
      if (a.last) pos = { lat: a.last.lat, lon: a.last.lon };
      startGps();
    } else {
      if (a.distance >= 50) {
        const r = Tracker.summary(a, lastT);
        learnFrom(r);
        Store.addRide(r);
      }
      Store.setActive(null);
    }
  }

  // 走行中に行き先を切り替える(登録済みの目的地 → なし の順に回る)
  function cycleDest() {
    const ids = Store.places.map((p) => p.id).concat([null]);
    const i = ids.indexOf(ride.placeId == null ? null : ride.placeId);
    ride.placeId = ids[(i + 1) % ids.length];
    ride.etaMid = null;
    if (pos) updateEta();
    persist(true);
    renderLive();
  }

  // ---------- 目的地の登録 ----------
  function addPlace(place) {
    if (Store.addPlace(place)) return true;
    alert(`目的地は${Store.MAX_PLACES}件まで登録できます。設定画面で使わない目的地を削除してください`);
    return false;
  }

  // 終わったライドの到着地を目的地にする(そのライドから学習も始める)
  function registerEnd(r) {
    const def = new Date(r.endedAt).getHours() < 12 ? "会社" : "自宅";
    const name = prompt("目的地の名前を入力してください(例:会社、自宅)", def);
    if (!name || !name.trim()) return;
    if (!addPlace({ name: name.trim().slice(0, 20), label: "ライドの到着地", lat: r.end.lat, lon: r.end.lon })) return;
    learnFrom(r);
    Store.savePlaces();
    render();
  }

  function formName() {
    const name = placeForm.name.trim().slice(0, 20);
    if (!name) alert("目的地の名前を入力してください");
    return name;
  }

  // 名前が空欄なら、入力した住所・駅名をそのまま名前にする
  function savePlaceFromForm(lat, lon, label) {
    const q = placeForm.query.trim();
    const name = (placeForm.name.trim() || (Geocode.parseLatLon(q) ? "" : q)).slice(0, 20);
    if (!name) return;
    if (!addPlace({ name, label, lat, lon })) return;
    placeForm = { name: "", query: "", results: [], status: `「${name}」を登録しました`, pick: null };
    render();
  }

  async function searchPlace() {
    const q = placeForm.query.trim();
    if (!q) return;
    if (Geocode.isShortLink(q)) {
      placeForm.results = [];
      placeForm.pick = null;
      placeForm.status = "共有ボタンの短いURLからは位置を読み取れません。Googleマップで場所を長押しして出る「35.xxxx, 139.xxxx」をコピーしてください";
      return render();
    }
    // 緯度経度やGoogleマップのURLなら、その位置を地図に出して住所を調べる
    const direct = Geocode.parseLatLon(q);
    if (direct) {
      placeForm.results = [];
      placeForm.status = "貼り付けた位置を地図に表示しました。名前を入れて登録してください";
      return openPick({ lat: direct[0].lat, lon: direct[0].lon, label: null, moved: false, needAddr: true });
    }
    placeForm.results = [];
    placeForm.pick = null;
    placeForm.status = "検索しています…";
    render();
    try {
      placeForm.results = await Geocode.search(q, nearPoint() || (await locateOnce()));
      placeForm.status = placeForm.results.length
        ? "近い順に表示しています。候補をタップすると地図で位置を確認できます"
        : "見つかりませんでした。下の「Googleマップで探す」を使ってください";
    } catch (e) {
      placeForm.status = "検索できませんでした。通信状況を確認するか、Googleマップの「緯度,経度」を貼り付けてください";
    }
    render();
  }

  // 現在地を1回だけ取る(取れなければ null)
  function locateOnce() {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (p) => {
          Store.setLastPos({ lat: p.coords.latitude, lon: p.coords.longitude });
          resolve(Store.lastPos);
        },
        () => resolve(null),
        { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: 8000 }
      );
    });
  }

  // 検索で近くを優先するための基準地点
  function nearPoint() {
    return Store.lastPos || pos || (Store.places[0] ? { lat: Store.places[0].lat, lon: Store.places[0].lon } : null);
  }

  // ---------- 地図で場所を確認・選択(Leaflet + OpenStreetMap) ----------
  let leafletLoading = null;
  function loadLeaflet() {
    if (window.L) return Promise.resolve();
    if (leafletLoading) return leafletLoading;
    leafletLoading = new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);
      const js = document.createElement("script");
      js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      js.onload = resolve;
      js.onerror = () => {
        leafletLoading = null;
        reject(new Error("leaflet"));
      };
      document.head.appendChild(js);
    });
    return leafletLoading;
  }

  function openPick(pick) {
    placeForm.pick = pick;
    render();
    const el = document.getElementById("pick-box");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // 描き直しのたびに、地図の入れ物があれば地図を作り直す
  async function mountPickMap() {
    if (pickMap) {
      pickMap.remove();
      pickMap = null;
    }
    const el = document.getElementById("pick-map");
    if (!el || !placeForm.pick) return;
    try {
      await loadLeaflet();
    } catch (e) {
      el.innerHTML = `<p class="muted small">地図を読み込めませんでした。通信状況を確認してください</p>`;
      return;
    }
    if (!document.body.contains(el)) return;
    const p = placeForm.pick;
    pickMap = L.map(el, { zoomControl: true }).setView([p.lat, p.lon], 17);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(pickMap);
    const marker = L.marker([p.lat, p.lon], { draggable: true }).addTo(pickMap);
    let timer = null;
    const move = (ll) => {
      p.lat = ll.lat;
      p.lon = ll.lng;
      p.moved = true;
      marker.setLatLng(ll);
      // ピンを動かし終えてから住所を調べる
      clearTimeout(timer);
      setPickNote("住所を調べています…");
      timer = setTimeout(() => lookupPickAddress(p), 600);
    };
    if (p.needAddr) lookupPickAddress(p);
    pickMap.on("click", (e) => move(e.latlng));
    marker.on("dragend", () => move(marker.getLatLng()));
  }

  function setPickNote(text) {
    const note = document.getElementById("pick-note");
    if (note) note.textContent = text;
  }

  // 地図で選んだ位置の住所を調べて、登録する住所にする
  let lookupSeq = 0;
  function lookupPickAddress(p) {
    const seq = ++lookupSeq;
    p.needAddr = false;
    setPickNote("住所を調べています…");
    p.addrPromise = Geocode.reverse(p.lat, p.lon).then((addr) => {
      if (seq !== lookupSeq) return p.addrPromise;
      p.label = addr || `緯度 ${p.lat.toFixed(5)}, 経度 ${p.lon.toFixed(5)}`;
      setPickNote(`📍 ${p.label}`);
      return p.label;
    });
    return p.addrPromise;
  }

  // 住所のない目的地(地図・現在地・ライドの到着地で登録したもの)に、あとから住所をつける
  const NO_ADDR = /^(地図で選んだ場所|現在地で登録|ライドの到着地)/;
  let backfilling = false;
  async function backfillAddresses() {
    if (backfilling) return;
    backfilling = true;
    try {
      for (const place of Store.places.filter((x) => !x.label || NO_ADDR.test(x.label))) {
        const addr = await Geocode.reverse(place.lat, place.lon);
        if (!addr) continue;
        place.label = addr;
        Store.savePlaces();
        // 地図を開いていなければ表示を更新する(開いていれば次に描き直したときに出る)
        if (view === "settings" && !placeForm.pick) render();
        await new Promise((r) => setTimeout(r, 1100)); // 検索サービスへの問い合わせは1秒に1回まで
      }
    } finally {
      backfilling = false;
    }
  }

  function registerHere() {
    if (!formName()) return;
    if (!("geolocation" in navigator)) return alert("この端末では位置情報が使えません");
    placeForm.status = "現在地を取得しています…";
    render();
    navigator.geolocation.getCurrentPosition(
      (p) => savePlaceFromForm(p.coords.latitude, p.coords.longitude, "現在地で登録"),
      () => {
        placeForm.status = "現在地を取得できませんでした。位置情報の許可を確認してください";
        render();
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
  }

  function renamePlace(id) {
    const p = placeById(id);
    const name = prompt("新しい名前", p.name);
    if (!name || !name.trim()) return;
    Store.renamePlace(id, name.trim().slice(0, 20));
    render();
  }

  // ---------- 描画 ----------
  function render() {
    app.innerHTML = `
      <header class="topbar"><div class="topbar-inner">RIDE <span>CALORIE</span></div></header>
      <main class="main">${view === "ride" ? rideView() : view === "history" ? historyView() : settingsView()}</main>
      <nav class="tabs">
        ${tab("ride", "🚴", ride ? "走行中" : "走る")}
        ${tab("history", "📋", "記録")}
        ${tab("settings", "⚙️", "設定")}
      </nav>`;
    bind();
    renderWake();
    renderLive();
    renderWeather();
    mountPickMap();
    if (view === "settings") backfillAddresses();
    if (view === "ride" && !ride) locateForWeather();
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
          <button class="eta" id="eta"></button>
          <div class="grid">
            ${metric("power", "パワー", "W")}
            ${metric("speed", "速度", "km/h")}
            ${metric("grade", "勾配", "%")}
            ${metric("dist", "距離", "km")}
            ${metric("elapsed", "経過時間", "", "wide")}
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
      ${destPicker()}
      <button class="btn start" id="start">ライドを開始</button>
      <p class="muted center">
        ${Store.profile.weightKg}kg + バイク${Store.profile.bikeKg}kg + 荷物${Store.profile.cargoKg}kg・${Physics.POSTURES[Store.profile.posture].label}で計算
        <br /><button class="link" data-view="settings">体格・バイク・目的地を変更</button>
      </p>
      <div class="status center"><span id="wake" class="pill"></span></div>
      <section class="card weather" id="weather"></section>`;
  }

  // ホーム画面の目的地選択。よく使う2件は常にボタンで表示し、残りは「その他」から選ぶ
  function destPicker() {
    if (!Store.places.length) {
      return `
        <section class="card dest">
          <div class="today-label">目的地</div>
          <p class="muted small">設定で目的地(会社・自宅など)を作っておくと、ここで選ぶだけで到着までの残り時間を表示します。</p>
          <button class="link" data-view="settings">目的地を作成する</button>
        </section>`;
    }
    const cur = plannedDest();
    const none = Store.prefs.destId === "none";
    const favs = favorites();
    const others = Store.places.filter((p) => !favs.includes(p));
    const chip = (p) =>
      `<button class="chip dest-chip ${cur && cur.id === p.id ? "on" : ""}" data-dest="${p.id}">🏁 ${esc(p.name)}</button>`;
    const otherSel = others.length
      ? `<select class="chip dest-more ${cur && others.includes(cur) ? "on" : ""}" id="dest-more">
          <option value="">その他${others.length}件…</option>
          ${others.map((p) => `<option value="${p.id}" ${cur && cur.id === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}
        </select>`
      : "";
    let note = "";
    if (cur) {
      const est = Store.lastPos ? Eta.estimate(cur, { distance: 0, movingSec: 0, stoppedSec: 0, gapSec: 0 }, Store.lastPos) : null;
      const auto = !Store.prefs.destId ? "現在地から自動で選びました・" : "";
      note = est && !est.arrived ? `${auto}ここから約${Math.round(est.sec / 60)}分${est.learnedN ? `(到着${est.learnedN}回分の学習)` : "(学習前の目安)"}` : auto.replace(/・$/, "");
    } else if (none) {
      note = "目的地を決めずに走ります";
    } else {
      note = "目的地を選んでください";
    }
    return `
      <section class="card dest">
        <div class="today-label">目的地</div>
        <div class="dest-chips">
          ${favs.map(chip).join("")}
          ${otherSel}
          <button class="chip dest-chip ${none ? "on" : ""}" data-dest="none">なし</button>
        </div>
        <p class="muted small">${note}</p>
      </section>`;
  }

  function metric(id, label, unit, cls) {
    return `<div class="metric ${cls || ""}"><div class="metric-label">${label}</div><div class="metric-value"><span id="${id}">–</span>${unit ? `<small>${unit}</small>` : ""}</div></div>`;
  }

  function foodLine(kcal, all) {
    const list = all ? FOODS : FOODS.slice(0, 1);
    return list.map((f) => `${f.name} ${(kcal / f.kcal).toFixed(1)}${f.unit}分`).join(" / ");
  }

  function resultCard(r) {
    const k = totalKcal(r);
    const place = placeById(r.arrivedPlaceId);
    const L = place ? Eta.learned(place) : null;
    let placeLine = "";
    if (place) {
      const trip = place.trips.find((t) => t.rideId === r.id);
      const err = trip && typeof trip.errSec === "number" ? trip.errSec / 60 : null;
      placeLine = `<p class="notice">🏁 ${esc(place.name)}に到着。所要時間を学習しました(${L.n}回分)${
        err != null ? `<br />途中の予測とのずれ:${Math.abs(err) < 0.5 ? "ほぼぴったり" : `${Math.abs(err).toFixed(1)}分${err > 0 ? "遅れ" : "早着"}`}` : ""
      }</p>`;
    } else if (r.end && r.distance >= 500) {
      placeLine = `<button class="btn sub" id="register-end">🏁 この到着地を目的地に登録</button>`;
    }
    return `
      <section class="card result">
        <h2>おつかれさまでした!</h2>
        <div class="result-kcal">${fmt.kcal(k)}<small>kcal</small></div>
        <p class="muted">${foodLine(k, true)}</p>
        ${placeLine}
        ${detailTable(r)}
      </section>`;
  }

  function detailTable(r) {
    const avgSpeed = r.movingSec > 0 ? r.distance / r.movingSec : 0;
    const avgPower = r.movingSec > 0 ? r.workJ / r.movingSec : 0;
    const place = placeById(r.arrivedPlaceId);
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
    if (place) rows.unshift(["到着地", esc(place.name)]);
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
    const rideRow = (r) => {
      const summary = `
        <span class="ride-time">${fmt.time(r.startedAt)}〜${fmt.time(r.endedAt)}${placeById(r.arrivedPlaceId) ? `<em>→${esc(placeById(r.arrivedPlaceId).name)}</em>` : ""}</span>
        <span class="ride-main">${fmt.kcal(totalKcal(r))} kcal</span>
        <span class="ride-sub">${fmt.km(r.distance)}km・${fmt.min(r.movingSec + r.stoppedSec)}</span>`;
      if (editMode) {
        return `
          <label class="card ride select ${selected.has(r.id) ? "picked" : ""}">
            <input type="checkbox" data-select="${r.id}" ${selected.has(r.id) ? "checked" : ""} />
            <span class="ride-summary">${summary}</span>
          </label>`;
      }
      return `
        <details class="card ride">
          <summary class="ride-summary">${summary}</summary>
          ${detailTable(r)}
          <button class="link danger" data-delete="${r.id}">この記録を削除</button>
        </details>`;
    };
    return `
      <div class="history-head">
        <h2>記録</h2>
        <button class="link" id="edit-toggle">${editMode ? "完了" : "選択して削除"}</button>
      </div>
      ${
        editMode
          ? `<div class="edit-bar">
              <button class="chip" id="select-short">1km未満を選択</button>
              <button class="chip" id="select-all">すべて選択</button>
              <button class="chip" id="select-none">選択を解除</button>
            </div>`
          : `<section class="card">
              <div class="today-label">直近7日間</div>
              <div class="today-value">${fmt.kcal(week.kcal)}<small>kcal</small></div>
              <div class="muted">${week.count}回のライド・${fmt.km(week.dist)}km・${foodLine(week.kcal, false)}</div>
            </section>`
      }
      ${groups
        .map(
          (g) => `
        <h3 class="day">${fmt.date(g.date)}<span>${fmt.kcal(g.rides.reduce((s, r) => s + totalKcal(r), 0))} kcal</span></h3>
        ${g.rides.map(rideRow).join("")}`
        )
        .join("")}
      ${editMode ? `<div class="delete-bar"><button class="btn stop" id="delete-selected" ${selected.size ? "" : "disabled"}>選択した${selected.size}件を削除</button></div>` : ""}`;
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

  function placesSection() {
    const full = Store.places.length >= Store.MAX_PLACES;
    const rows = Store.places
      .map((p) => {
        const L = Eta.learned(p);
        const acc = Eta.accuracy(p);
        const info = L
          ? `到着${L.n}回を学習・信号込みの平均${fmt.kmh(L.speed)}km/h${acc ? `・予測のずれ 平均${acc.minutes.toFixed(1)}分` : ""}`
          : "まだ学習していません(到着するたびに学習します)";
        return `
          <div class="place">
            <div><strong>🏁 ${esc(p.name)}</strong><small>${p.label ? esc(p.label) + "<br />" : ""}${info}</small></div>
            <div class="place-actions">
              <button class="link" data-renameplace="${p.id}">名前</button>
              <button class="link danger" data-delplace="${p.id}">削除</button>
            </div>
          </div>`;
      })
      .join("");
    const f = placeForm;
    return `
      <section class="card">
        <h2>目的地 <span class="count">${Store.places.length}/${Store.MAX_PLACES}</span></h2>
        <p class="muted small">会社・自宅・よく行くお店などを作っておくと、走る画面で選ぶだけで「あと何分で着くか」を表示します。到着するたびに、信号待ちを含めたペースと道の遠回り具合を学習して、予測が正確になっていきます。</p>
        ${rows || `<p class="muted">まだ目的地がありません。下のフォームから作成してください。</p>`}
        ${
          full
            ? `<p class="notice">目的地は${Store.MAX_PLACES}件まで登録できます。追加するには、使わない目的地を削除してください。</p>`
            : `<form class="place-form" id="place-form">
                <h3>目的地を追加</h3>
                <label class="stack"><span>住所・駅名・施設名<small>Googleマップの「緯度,経度」も貼り付けられます</small></span>
                  <span class="search-row">
                    <input type="search" id="place-query" placeholder="例:荻窪1-33-12" value="${esc(f.query)}" />
                    <button class="chip" type="submit">検索</button>
                  </span>
                </label>
                <label class="stack"><span>名前<small>空欄なら入力した住所が名前になります</small></span>
                  <input type="text" id="place-name" maxlength="20" placeholder="例:会社" value="${esc(f.name)}" />
                </label>
                ${f.status ? `<p class="muted small">${esc(f.status)}</p>` : ""}
                ${f.results
                  .map(
                    (r, i) =>
                      `<button type="button" class="result-item ${f.pick && f.pick.from === i ? "on" : ""}" data-pick="${i}">📍 ${esc(r.label)}${
                        r.dist != null ? `<span class="dist">${fmt.km(r.dist)}km</span>` : ""
                      }</button>`
                  )
                  .join("")}
                ${
                  f.pick
                    ? `<div class="pick-box" id="pick-box">
                        <div class="pick-map" id="pick-map"></div>
                        <p class="pick-note" id="pick-note">${f.pick.label ? `📍 ${esc(f.pick.label)}` : "住所を調べています…"}</p>
                        <p class="muted small">違っていたら、地図をタップするかピンを動かして位置を直せます</p>
                        <button type="button" class="btn start" id="pick-save">この場所で登録</button>
                        <button type="button" class="link" id="pick-cancel">やめる</button>
                      </div>`
                    : `<button type="button" class="btn sub" id="pick-open">🗺️ 地図で場所を選ぶ</button>`
                }
                <div class="gmaps">
                  <p class="gmaps-title">検索に出てこない建物は、Googleマップで探せます</p>
                  <ol class="muted small">
                    <li>「Googleマップで探す」で開いて、目的の場所を長押し</li>
                    <li>出てきた「35.xxxx, 139.xxxx」をタップしてコピー</li>
                    <li>このアプリに戻って「コピーした位置を貼り付け」</li>
                  </ol>
                  <div class="gmaps-row">
                    <a class="chip" id="gmaps-link" href="${Geocode.googleMapsUrl(f.query)}" target="_blank" rel="noopener">🔎 Googleマップで探す</a>
                    <button type="button" class="chip" id="paste-pos">📋 コピーした位置を貼り付け</button>
                  </div>
                </div>
                <p class="muted small or">いまいる場所を登録するときは、名前を入れてから↓</p>
                <button type="button" class="btn sub" id="register-here">📍 現在地を目的地に登録</button>
              </form>`
        }
      </section>`;
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

        <h2>天気と画面</h2>
        <label class="check"><input type="checkbox" name="wind" ${pr.wind ? "checked" : ""} />
          <span>天気予報を使う<small>1時間ごとの天気の表示と、風向き・風速を使った計算に使います(Open-Meteo)。送る位置は約1km単位に丸めます</small></span></label>
        <label class="field"><span>画面を消さない</span>
          <select name="wake">
            <option value="always" ${pr.wake === "always" ? "selected" : ""}>開いている間ずっと</option>
            <option value="riding" ${pr.wake === "riding" ? "selected" : ""}>走行中のみ</option>
          </select></label>

        <button class="btn start" type="submit">保存</button>
        <p class="muted small">基礎代謝 約${Math.round(Physics.bmrPerDay(p))}kcal/日・空気抵抗係数(CdA) ${Physics.cdaFor(p).toFixed(3)}m²</p>
      </form>
      ${placesSection()}
      <section class="card">
        <h2>計算のしくみ</h2>
        <p class="muted">GPSの速度と標高の変化から、毎秒「転がり抵抗」「坂を登る力」「加速」「空気抵抗(風を含む)」に必要なパワーを計算します。脚の筋肉の効率を25%として、そのパワーを消費カロリーに換算し、基礎代謝分を足しています。</p>
        <p class="muted">勾配はGPSの標高から50mごとに出す目安です。標高のぶれを打ち消すため、坂に入ってから表示されるまで30秒ほど遅れ、1%未満の緩い坂は0%と表示します。</p>
        <p class="muted">パワーメーターではなく推定値です。風の強い日や、GPSが乱れやすいビル街では誤差が大きくなります。</p>
      </section>
      <section class="card">
        <h2>データ</h2>
        <button class="link danger" id="clear-rides">すべてのライド記録を削除</button>
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

    const g = document.getElementById("grade");
    if (g) {
      const pct = Math.round(ride.grade * 1000) / 10;
      g.textContent = ride.altEma == null ? "–" : (pct > 0 ? "+" : "") + pct.toFixed(Math.abs(pct) < 10 ? 1 : 0);
      g.parentElement.className = "metric-value " + (pct >= 3 ? "up" : pct <= -3 ? "down" : "");
    }

    renderEta();

    const gps = document.getElementById("gps");
    if (gps) {
      gps.textContent = gpsStatus || (lastAccuracy != null ? `GPS ±${Math.round(lastAccuracy)}m` : "GPSを探しています…");
      gps.className = "pill " + (gpsStatus ? "off" : "on");
    }
    const w = document.getElementById("windinfo");
    if (w) {
      const wind = currentWind();
      if (!Store.prefs.wind) w.textContent = "風:計算に入れない";
      else if (!wind) w.textContent = "風:取得中…";
      else {
        const hw = ride.heading != null ? Physics.headwind(wind.speed, wind.from, ride.heading) : 0;
        const dir = hw > 0.3 ? `向かい風 ${hw.toFixed(1)}m/s` : hw < -0.3 ? `追い風 ${(-hw).toFixed(1)}m/s` : "横風";
        w.textContent = `${Weather.describe(wind.code).icon} ${Math.round(wind.temp)}° ${compass(wind.from)}の風 ${wind.speed.toFixed(1)}m/s・${dir}`;
      }
    }
    const gap = document.getElementById("gapwarn");
    if (gap) {
      gap.hidden = ride.gapSec < 30;
      gap.textContent = `画面が消えるなどで${fmt.min(ride.gapSec)}ほど計測が途切れました。その間は平均速度で走ったものとして計算しています。`;
    }
  }

  // 目的地までの推定を更新する。半分まで来たときの予測と、到着した時点の記録を残しておき、
  // ライド終了後の学習と答え合わせに使う
  function updateEta() {
    const place = placeById(ride.placeId);
    ride.eta = place && pos ? Object.assign(Eta.estimate(place, ride, pos), { at: Date.now() }) : null;
    const est = ride.eta;
    if (!est) return;
    if (est.arrived) {
      if (!ride.arrival || ride.arrival.placeId !== place.id) {
        ride.arrival = {
          placeId: place.id,
          t: Date.now(),
          elapsed: ride.movingSec + ride.stoppedSec + ride.gapSec,
          distance: ride.distance,
        };
        persist(true);
      }
      return;
    }
    const progress = ride.distance / (ride.distance + est.remainM);
    if (!ride.etaMid && progress >= 0.5 && ride.distance > 1000) {
      ride.etaMid = { placeId: place.id, arriveAt: Date.now() + est.sec * 1000 };
    }
  }

  // 目的地までの残り距離・時間
  function renderEta() {
    const el = document.getElementById("eta");
    if (!el) return;
    const place = placeById(ride.placeId);
    if (!place) {
      el.className = "eta empty";
      el.innerHTML = Store.places.length
        ? `🏁 目的地なし<small>タップで目的地を選ぶ</small>`
        : `🏁 目的地を登録すると、到着までの残り時間を表示します<small>設定 → 目的地</small>`;
      return;
    }
    const est = ride.eta;
    if (!est) {
      el.className = "eta";
      el.innerHTML = `🏁 ${esc(place.name)}まで<small>現在地を確認しています…</small>`;
      return;
    }
    if (est.arrived) {
      el.className = "eta arrived";
      el.innerHTML = `🏁 ${esc(place.name)}に到着しました<small>到着時刻を記録しました。「ライドを終了」で所要時間を学習します</small>`;
      return;
    }
    const acc = Eta.accuracy(place);
    const basis = est.learnedN
      ? `到着${est.learnedN}回分の学習${acc ? `・予測のずれ 平均${acc.minutes.toFixed(1)}分` : ""}`
      : "学習前の目安(到着するたびに正確になります)";
    // 残り時間は最後の測位からの経過分を差し引く
    const sec = Math.max(0, est.sec - (Date.now() - est.at) / 1000);
    el.className = "eta";
    el.innerHTML = `
      <span class="eta-main">🏁 ${esc(place.name)}まで ${fmt.km(est.remainM)}km・あと<strong>${Math.max(1, Math.round(sec / 60))}分</strong></span>
      <span class="eta-at">${fmt.time(est.at + est.sec * 1000)}着</span>
      <small>${basis}${Store.places.length > 1 ? "・タップで目的地を変更" : ""}</small>`;
  }

  function bind() {
    const on = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", fn);
    };
    app.querySelectorAll("[data-view]").forEach((b) =>
      b.addEventListener("click", () => {
        view = b.dataset.view;
        placeForm.status = "";
        editMode = false;
        selected = new Set();
        render();
        window.scrollTo(0, 0);
      })
    );
    on("start", startRide);
    on("finish", finishRide);
    on("eta", () => {
      if (Store.places.length) cycleDest();
    });
    on("register-end", () => registerEnd(lastResult));
    on("register-here", registerHere);
    app.querySelectorAll("[data-dest]").forEach((b) =>
      b.addEventListener("click", () => {
        Store.setPrefs({ destId: b.dataset.dest });
        render();
      })
    );
    const more = document.getElementById("dest-more");
    if (more)
      more.addEventListener("change", () => {
        if (more.value) Store.setPrefs({ destId: more.value });
        render();
      });
    const pf = document.getElementById("place-form");
    if (pf) {
      const nameEl = document.getElementById("place-name");
      const queryEl = document.getElementById("place-query");
      nameEl.addEventListener("input", () => (placeForm.name = nameEl.value));
      queryEl.addEventListener("input", () => {
        placeForm.query = queryEl.value;
        const link = document.getElementById("gmaps-link");
        if (link) link.href = Geocode.googleMapsUrl(queryEl.value);
      });
      pf.addEventListener("submit", (e) => {
        e.preventDefault();
        searchPlace();
      });
    }
    app.querySelectorAll("[data-pick]").forEach((b) =>
      b.addEventListener("click", () => {
        const i = +b.dataset.pick;
        const r = placeForm.results[i];
        openPick({ lat: r.lat, lon: r.lon, label: r.label, from: i });
      })
    );
    on("paste-pos", async () => {
      let text = "";
      try {
        text = await navigator.clipboard.readText();
      } catch (e) {
        // 読み取れない端末では、検索欄に手で貼り付けてもらう
      }
      if (!text || !text.trim()) {
        alert("コピーした内容を読み取れませんでした。検索欄を長押しして貼り付け、「検索」を押してください");
        return;
      }
      placeForm.query = text.trim();
      if (!Geocode.parseLatLon(placeForm.query) && !Geocode.isShortLink(placeForm.query)) {
        placeForm.status = "コピーした内容に位置が見つかりませんでした。Googleマップで場所を長押しして出る「35.xxxx, 139.xxxx」をコピーしてください";
        placeForm.results = [];
        return render();
      }
      searchPlace();
    });
    on("pick-open", () => {
      const c = nearPoint() || { lat: 35.6812, lon: 139.7671 };
      openPick({ lat: c.lat, lon: c.lon, label: null, moved: false, needAddr: true });
    });
    on("pick-cancel", () => {
      placeForm.pick = null;
      render();
    });
    on("pick-save", () => {
      const p = placeForm.pick;
      const q = placeForm.query.trim();
      if (!placeForm.name.trim() && (!q || Geocode.parseLatLon(q))) {
        alert("名前を入力してください");
        document.getElementById("place-name").focus();
        return;
      }
      // 住所を調べている途中なら、終わってから登録する
      Promise.resolve(p.addrPromise).then(() => savePlaceFromForm(p.lat, p.lon, p.label || `緯度 ${p.lat.toFixed(5)}, 経度 ${p.lon.toFixed(5)}`));
    });
    app.querySelectorAll("[data-renameplace]").forEach((b) => b.addEventListener("click", () => renamePlace(b.dataset.renameplace)));
    app.querySelectorAll("[data-delplace]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("この目的地と、学習した所要時間を削除しますか?")) return;
        Store.deletePlace(b.dataset.delplace);
        render();
      })
    );

    // 記録の削除
    app.querySelectorAll("[data-delete]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("この記録を削除しますか?")) return;
        Store.deleteRides([b.dataset.delete]);
        render();
      })
    );
    on("edit-toggle", () => {
      editMode = !editMode;
      selected = new Set();
      render();
    });
    app.querySelectorAll("[data-select]").forEach((c) =>
      c.addEventListener("change", () => {
        if (c.checked) selected.add(c.dataset.select);
        else selected.delete(c.dataset.select);
        render();
      })
    );
    const pick = (fn) => () => {
      selected = new Set(Store.rides.filter(fn).map((r) => r.id));
      render();
    };
    on("select-short", pick((r) => r.distance < 1000));
    on("select-all", pick(() => true));
    on("select-none", pick(() => false));
    on("delete-selected", () => {
      if (!selected.size || !confirm(`選択した${selected.size}件の記録を削除しますか?`)) return;
      Store.deleteRides([...selected]);
      if (lastResult && selected.has(lastResult.id)) lastResult = null;
      selected = new Set();
      editMode = Store.rides.length > 0;
      render();
    });
    on("clear-rides", () => {
      if (!Store.rides.length) return alert("記録はありません");
      if (!confirm(`すべてのライド記録(${Store.rides.length}件)を削除しますか?目的地の学習もリセットされます。`)) return;
      Store.deleteRides(Store.rides.map((r) => r.id));
      lastResult = null;
      render();
    });

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

  // ホーム画面に追加したアプリは古いファイルを使い続けることがあるので、
  // 起動時と画面に戻ったときに最新のバージョンを確認し、新しければ読み込み直す(走行中はしない)
  const APP_VERSION = "2026.10.19";
  async function checkUpdate() {
    try {
      const res = await fetch("version.json?t=" + Date.now(), { cache: "no-store" });
      const latest = (await res.json()).version;
      if (ride) return;
      if (latest && latest !== APP_VERSION && sessionStorage.getItem("cycling_reloaded") !== latest) {
        sessionStorage.setItem("cycling_reloaded", latest); // 読み込み直しを繰り返さないように
        location.replace(location.pathname + "?v=" + latest);
      }
    } catch (e) {
      // オフラインなどで確認できなければ今のまま使う
    }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkUpdate();
  });
  checkUpdate();

  restoreActive();
  render();
  updateWake();
})();

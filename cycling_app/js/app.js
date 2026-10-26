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
  // ナビ: route = Nav のルート、hint = ルート上の現在位置、announced = 案内済みの曲がり角
  let nav = freshNav();
  let navMap = null; // 走行画面の地図
  let navLayers = {};
  let navFollowAt = 0; // 地図を手で動かしたら、しばらく現在地を追わない

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
      renderCommute();
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
    renderCommute();
  }

  // ---------- 通勤予報(雨・向かい風・いちばんよい出発時間) ----------
  function commuteTrip() {
    const here = Store.lastPos;
    const dest = here ? plannedDest() : null;
    if (!dest) return null;
    const straight = Physics.distance(here.lat, here.lon, dest.lat, dest.lon);
    if (straight < 500) return null;
    const L = Eta.learned(dest);
    return { dest, from: here, to: dest, distanceM: straight * (L ? L.detour : 1.3), speed: (L && L.speed) || 15 / 3.6, learned: L ? L.n : 0, evening: isEvening(dest) };
  }

  // 帰りの予報にするか: 14〜21時で、行き先が家(名前、またはいつも夕方に着いている所)
  function isEvening(dest, now = Date.now()) {
    const h = new Date(now).getHours();
    if (h < 14 || h >= 21) return false;
    if (/自宅|家|ホーム|home/i.test(dest.name || "")) return true;
    const hours = (dest.trips || []).map((t) => new Date(t.at).getHours()).sort((a, b) => a - b);
    return !hours.length || hours[Math.floor(hours.length / 2)] >= 14;
  }

  function commuteOpts(trip, now = Date.now()) {
    if (!trip.evening) return {};
    const d = new Date(now);
    const s17 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 17, 0).getTime();
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 21, 0).getTime();
    const start = Math.max(now, s17);
    return { evening: true, start, slots: Math.max(5, Math.round((end - start) / 900000) + 1) };
  }

  const routePoints = (trip) => [trip.from, { lat: (trip.from.lat + trip.to.lat) / 2, lon: (trip.from.lon + trip.to.lon) / 2 }, trip.to];

  let commuteKey = "";
  function renderCommute() {
    const el = document.getElementById("commute");
    if (!el) return;
    const trip = Store.prefs.wind ? commuteTrip() : null;
    if (!trip) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    const pts = routePoints(trip);
    const key = pts.map((p) => p.lat.toFixed(2) + "," + p.lon.toFixed(2)).join("|");
    const draw = (data) => {
      const el2 = document.getElementById("commute");
      if (!el2) return;
      // 地点ごとの予報が取れなければ、現在地の1時間ごとの予報だけで
      const points = data || (Weather.latest ? [{ hourly: Weather.latest.hourly, m15: [] }] : null);
      if (!points) {
        el2.innerHTML = `<div class="today-label">${trip.evening ? "🏠 帰りの予報" : "🚲 通勤予報"} → ${esc(trip.dest.name)}</div><p class="muted small">予報を取得しています…</p>`;
        return;
      }
      const co = commuteOpts(trip);
      const c = Commute.plan(points, trip, Store.profile, Date.now(), co);
      const hm = Commute.hm;
      const n = c.now;
      el2.innerHTML = `
        <div class="today-label">${trip.evening ? "🏠 帰りの予報" : "🚲 通勤予報"} → ${esc(trip.dest.name)}</div>
        <p class="cm-msg ${c.message.level}">${esc(c.message.text)}</p>
        <p class="small">${co.evening && co.start > Date.now() + 60000 ? `${hm(n.leave)}に出ると` : "いま出ると"} <b>${hm(n.arrive)}着</b>(約${Math.round(n.sec / 60)}分)・${Commute.windTxt(n.hw)}・${n.wet ? `雨 ${n.mm ? n.mm.toFixed(1) + "mm/15分" : n.pop + "%"}` : `☔${n.pop}%`}</p>
        <div class="cm-opts">${c.opts
          .map(
            (o, i) => `<div class="cm-opt ${o === c.best ? "best" : ""} ${o.wet ? "wet" : ""}">
              <div class="cm-t">${i === 0 && !(co.start > Date.now() + 60000) ? "いま" : hm(o.leave)}</div>
              <div class="cm-i">${o.wet ? "☔" : o.hw > 0.5 ? "🌬️" : "🚲"}</div>
              <div class="cm-m">${Math.round(o.sec / 60)}分</div>
              <div class="cm-a">${hm(o.arrive)}着</div>
            </div>`
          )
          .join("")}</div>
        <p class="muted small">出発の時刻ごとの、かかる時間と雨(${data ? "出発地・途中・目的地の15分ごとの予報" : "現在地の1時間ごとの予報"})。時間は${trip.learned ? `これまでの到着${trip.learned}回分の速さ` : "目安の速さ(15km/h)"}に、風の強さを足して計算しています。</p>`;
    };
    draw(null);
    if (commuteKey !== key) commuteKey = "";
    Weather.route(pts).then((data) => {
      commuteKey = key;
      draw(data);
    });
  }

  // 夕方の決まった時刻に、帰りの予報を知らせる(アプリを開いているときだけ。閉じていると届かない)
  const EVE_KEY = "cycling_evening_notified";
  async function eveningCheck() {
    const pr = Store.prefs;
    if (!pr.eveningNotify || !pr.wind || ride) return;
    const now = new Date();
    const [hh, mi] = String(pr.eveningTime || "17:30").split(":").map(Number);
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh || 17, mi || 0).getTime();
    const today = now.toDateString();
    if (Date.now() < at || now.getHours() >= 22) return;
    try {
      if (localStorage.getItem(EVE_KEY) === today) return;
    } catch (e) {}
    const trip = commuteTrip();
    if (!trip) return;
    trip.evening = true;
    const data = await Weather.route(routePoints(trip));
    const points = data || (Weather.latest ? [{ hourly: Weather.latest.hourly, m15: [] }] : null);
    if (!points) return;
    const c = Commute.plan(points, trip, Store.profile, Date.now(), Object.assign(commuteOpts(trip), { evening: true }));
    try {
      localStorage.setItem(EVE_KEY, today);
    } catch (e) {}
    const title = `🏠 帰りの予報(${trip.dest.name}まで)`;
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: c.message.text, icon: "icons/icon-192.png", tag: "evening" });
      }
    } catch (e) {
      // スマホのブラウザは、ページからの通知に対応していないことがある
    }
    toast(title, c.message.text);
  }

  function toast(title, text) {
    let el = document.getElementById("toast");
    if (el) el.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="toast" id="toast" role="status"><strong>${esc(title)}</strong><span>${esc(text)}</span><button aria-label="閉じる">×</button></div>`);
    el = document.getElementById("toast");
    el.querySelector("button").addEventListener("click", () => el.remove());
    setTimeout(() => el && el.remove(), 30000);
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
    if (result !== "inaccurate") updateNav();
    if (Store.prefs.duel) duelStep();
    updateEta();
    refreshWeather(pos);
    persist(false);
    renderLive();
  }

  // デュエルモード: スピードカウンターとゴーストの読み上げ
  function duelStep() {
    const wind = currentWind();
    const extra = { remainM: ride.eta && !ride.eta.arrived ? ride.eta.remainM : null, headwind: wind && ride.heading != null ? Physics.headwind(wind.speed, wind.from, ride.heading) : null };
    for (const e of Duel.step(ride, extra)) {
      if (e.type === "up" && (e.spc % 4 === 0 || e.spc === Duel.MAX_SPC)) duelSay(`スピードカウンター、${e.spc}!`, false, true);
      if (e.type === "down") duelSay("止まりすぎた…スピードカウンター、マイナス1", false, true);
      if (e.type === "draw") {
        DuelFx.pop(e.card, "DRAW!");
        duelSay("俺のターン、ドロー!", false, true);
      }
      if (e.type === "activate") {
        DuelFx.pop(e.card, e.card.kind === "trap" ? "TRAP OPEN!" : "SPEED SPELL!");
        duelSay(e.card.kind === "trap" ? `トラップ発動、${e.card.name}!` : `スピード・スペル、${e.card.name}、発動!`, false, true);
      }
    }
    // バトル: 1kmごとに1ターン
    const L = placeById(ride.placeId) ? Eta.learned(placeById(ride.placeId)) : null;
    const names = { you: "YOU", opp: L ? "ゴースト" : "練習相手" };
    const bev = Battle.step(ride, (L && L.speed) || 15 / 3.6, Duel.state(ride).spc);
    if (bev) {
      DuelFx.turn(bev, Battle.state(ride), names);
      battleVoice(bev, names);
      persist(true);
    }
    const g = Duel.ghost(ride, placeById(ride.placeId));
    if (g && g.ev === "pass") duelSay("ゴーストを抜いた! このまま突っ切るぜ!", false, true);
    if (g && g.ev === "passed") duelSay("抜かれたか…まだだ、ここからだ!", false, true);
  }

  // デュエル中のセリフ: 声で話して、キャラクターのカットインも出す
  function duelSay(text, force, queue, side = "you") {
    speak(text, force, queue);
    if (typeof DuelFx !== "undefined" && document.visibilityState === "visible") DuelFx.cutIn(text, side);
  }

  function battleVoice(ev, names) {
    const mine = ev.side === "you";
    for (const st of ev.steps) {
      if (st.t === "draw") duelSay(mine ? `俺のターン! ドロー!` : `${names.opp}のターン`, false, true, mine ? "you" : "opp");
      if (st.t === "summon")
        duelSay(st.synchro ? `${st.from[0]}に、${st.from[1]}をチューニング! シンクロ召喚! 来い、${st.mon.name}!` : mine ? `${st.mon.name}を召喚!` : `${names.opp}は${st.mon.name}を召喚した`, false, true, mine ? "you" : "opp");
      if (st.t === "trap") duelSay(st.side === "you" ? `罠カード発動! ${st.card.name}!` : `${names.opp}の罠、${st.card.name}!`, false, true, st.side);
      if (st.t === "attack") {
        const res = st.result === "negated" ? "攻撃は無効になった" : st.result === "direct" ? `ダイレクトアタック! ${st.dmg}のダメージ` : st.result === "destroy" ? `撃破! ${st.dmg}のダメージ` : st.result === "repel" ? `返り討ちだ…${st.dmg}のダメージ` : "相打ちだ";
        duelSay(mine ? `バトル! ${st.mon.name}で攻撃! ${res}` : `${st.mon.name}の攻撃。${res}`, false, true, mine ? "you" : "opp");
      }
      if (st.t === "win") duelSay(st.side === "you" ? "これで終わりだ! 俺の勝ちだ!" : "ライフがゼロに…だが、まだ走れる!", false, true);
    }
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
    resetNav();
    const navMsg = Store.prefs.nav && ride.placeId !== null ? (ride.placeId ? `${placeById(ride.placeId).name}へのナビを開始します` : "ナビを開始します") : "";
    if (Store.prefs.duel) {
      duelSay("ライディング・デュエル、アクセラレーション!", true);
      duelSay("俺の先攻だ。ドロー!", true, true);
      if (navMsg) speak(navMsg, true, true);
    } else if (navMsg) speak(navMsg, true);
    Store.setActive(ride);
    startGps();
    updateWake();
    render();
    if (Store.prefs.duel) {
      const hand = Duel.deal(ride);
      Store.setActive(ride);
      const place = placeById(ride.placeId);
      DuelFx.start({ hand, ghost: !!(place && Eta.learned(place)) });
    }
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
    resetNav();
    try {
      if (window.speechSynthesis) speechSynthesis.cancel();
    } catch (e) {
      // 無視
    }
    Store.setActive(null);
    Store.setPrefs({ destId: null }); // 次のライドは現在地から自動で選び直す(帰り道なら自宅に切り替わる)
    updateWake();
    render();
    if (Store.prefs.duel && lastResult) duelEnd(lastResult);
  }

  // デュエルの終わり: 相棒(バイク)をモンスターとして召喚して、勝敗を出す
  function duelEnd(r) {
    const res = duelOutcome(r);
    const so = sortieOf(r);
    const g = Store.garage && Store.garage.builds && Store.garage.builds.current;
    const frame = g && g.parts && g.parts.frame && g.parts.frame.name;
    const name = frame && !/^(カーボン|アルミ|クロモリ)/.test(frame) ? frame : g && g.name && !/^(いまのバイク|NEW)$/.test(g.name) ? g.name : "ロードバイク";
    const stars = { S: 8, A: 7, B: 6, C: 5, D: 4 }[so.rank] || 4;
    const avgPower = r.movingSec > 0 ? r.workJ / r.movingSec : 0;
    const monster = {
      name,
      stars,
      atk: Math.min(5000, Math.round((so.kmh * 100) / 50) * 50),
      def: Math.min(5000, Math.round((avgPower * 12 + r.elevGain * 5) / 50) * 50),
    };
    const used = ((r.duel && r.duel.used) || []).map(Duel.byId).filter(Boolean);
    DuelFx.end({ res, monster, used });
    duelSay(`限界を超えろ! 俺の相棒、${name}、シンクロ召喚!`, true);
    if (res && !res.first) duelSay(res.win ? "俺の勝ちだ。いいライディングだったぜ" : "負けたか…次は必ず追い抜く。もう一度、走り出すだけだ", true, true);
    else duelSay("デュエル終了。次はこの走りがゴーストになる", true, true);
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
    if (pos) {
      updateNav();
      updateEta();
    }
    persist(true);
    renderLive();
  }

  // ---------- ナビ ----------
  function freshNav() {
    return { route: null, placeId: null, hint: null, announced: {}, off: {}, fetching: false, status: "", lastFetch: 0 };
  }

  function resetNav() {
    nav = freshNav();
    if (navMap) drawRoute();
  }

  // 音声案内。force はライド開始などのタップ時(iPhoneは最初にタップの中で話さないと音が出ない)
  // デュエルモードの声: 端末にある日本語の男性の声を選び、低め・力強めに話す
  // (特定の声優さんの声をまねることはできないので、話し方とセリフで寄せる)
  const MALE = /otoya|ichiro|keita|daichi|hattori|takumi|naoki|kenji|male|男性/i;
  function duelVoice() {
    try {
      const vs = speechSynthesis.getVoices().filter((v) => /^ja/i.test(v.lang));
      return vs.find((v) => v.name === Store.prefs.duelVoice) || vs.find((v) => MALE.test(v.name)) || vs[0] || null;
    } catch (e) {
      return null;
    }
  }

  function speak(text, force, queue) {
    if (!Store.prefs.voice || !("speechSynthesis" in window)) return;
    if (!force && document.visibilityState !== "visible") return;
    // 音声で失敗しても、計測やナビは止めない
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 1.05;
      if (Store.prefs.duel) {
        const v = duelVoice();
        if (v) u.voice = v;
        u.pitch = 0.75;
        u.rate = 1.12;
      }
      if (!queue) speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) {
      // 話せなかった
    }
  }

  async function requestRoute(reason) {
    const place = placeById(ride && ride.placeId);
    if (!place || !pos || nav.fetching) return;
    // ルートを外れたときの引き直しは15秒に1回まで
    if (reason === "reroute" && Date.now() - nav.lastFetch < 15000) return;
    nav.fetching = true;
    nav.lastFetch = Date.now();
    nav.status = reason === "reroute" ? "ルートを外れました。ルートを引き直しています…" : "ルートを検索しています…";
    if (reason === "reroute") speak("ルートを外れました。ルートを引き直します");
    renderLive();
    try {
      const route = await Nav.fetchRoute({ lat: pos.lat, lon: pos.lon, heading: ride && ride.heading }, place);
      if (!ride || ride.placeId !== place.id) return; // 待っている間に目的地が変わった
      nav = Object.assign(freshNav(), { route, placeId: place.id, lastFetch: nav.lastFetch });
      nav.hint = Nav.snap(route, pos, null);
      drawRoute(true);
    } catch (e) {
      if (!ride) return;
      nav.status = "ルートを取得できませんでした。電波のよい場所で「ルート再検索」を押してください";
      nav.placeId = place.id; // 測位のたびに再検索しない
    } finally {
      nav.fetching = false;
      // 検索を待っている間にライドが終わっていれば何もしない
      if (ride) {
        updateEta();
        renderLive();
      }
    }
  }

  // 測位のたびに: ルート上の位置を合わせ、外れていれば引き直し、曲がる手前なら音声で案内する
  function updateNav() {
    if (!Store.prefs.nav || !ride || !pos) return;
    const place = placeById(ride.placeId);
    if (!place) {
      if (nav.route || nav.placeId) resetNav();
      return;
    }
    if (nav.placeId !== place.id) {
      nav.route = null;
      nav.placeId = null;
      if (navMap) drawRoute();
      requestRoute("new");
      return;
    }
    if (!nav.route) return;
    if (ride.arrival && ride.arrival.placeId === place.id) return; // 到着済み
    nav.hint = Nav.snap(nav.route, pos, nav.hint);
    if (Nav.offRoute(nav.off, nav.hint.off, lastAccuracy)) {
      requestRoute("reroute");
      return;
    }
    if (nav.hint.off < 60) {
      const text = Nav.announcement(nav.route, nav.hint.along, ride.vEma, nav.announced);
      if (text) speak(text);
    }
  }

  // 次に曲がる場所のカード
  function renderNavCard() {
    const el = document.getElementById("navcard");
    if (!el) return;
    const place = placeById(ride.placeId);
    if (!place) {
      el.className = "nav-card idle";
      el.innerHTML = `<div class="nav-main">目的地を選ぶとルート案内をします</div>`;
      return;
    }
    if (ride.arrival && ride.arrival.placeId === place.id) {
      el.className = "nav-card arrived";
      el.innerHTML = `<div class="nav-arrow">🏁</div><div><div class="nav-main">${esc(place.name)}に到着</div></div>`;
      return;
    }
    if (!nav.route || nav.fetching) {
      el.className = "nav-card idle";
      el.innerHTML = `<div class="nav-main small">${esc(nav.status || "ルートを検索しています…")}</div>`;
      return;
    }
    const n = Nav.next(nav.route, nav.hint ? nav.hint.along : 0);
    const info = Nav.turnInfo(n.step.kind);
    const after = n.after ? Nav.turnInfo(n.after.kind) : null;
    const off = nav.hint && nav.hint.off > 40;
    el.className = "nav-card" + (off ? " off" : "");
    el.innerHTML = `
      <div class="nav-arrow">${info.arrow}</div>
      <div class="nav-body">
        <div class="nav-dist">${Nav.distText(n.dist)}</div>
        <div class="nav-main">${info.text}${n.step.street ? `<span>${esc(n.step.street)}</span>` : ""}</div>
        <div class="nav-sub">${
          off ? "ルートから外れています" : after ? `その次: ${after.arrow} ${after.text}` : `ゴールまで ${Nav.distText(nav.route.length - (nav.hint ? nav.hint.along : 0))}`
        }</div>
      </div>`;
  }

  // 走行画面の地図
  async function mountNavMap() {
    const el = document.getElementById("navmap");
    if (!el) return;
    try {
      await loadLeaflet();
    } catch (e) {
      el.innerHTML = `<p class="muted small">地図を読み込めませんでした。曲がる場所の案内はこのまま続けます</p>`;
      el.classList.add("failed");
      return;
    }
    if (!document.body.contains(el) || navMap) return;
    const c = pos || Store.lastPos || { lat: 35.6812, lon: 139.7671 };
    navMap = L.map(el, { zoomControl: false, attributionControl: true }).setView([c.lat, c.lon], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(navMap);
    navMap.on("dragstart", () => (navFollowAt = Date.now() + 15000));
    drawRoute();
    updateNavMap();
  }

  function drawRoute(fit) {
    if (!navMap) return;
    for (const k of ["route", "dest"]) {
      if (navLayers[k]) navMap.removeLayer(navLayers[k]);
      navLayers[k] = null;
    }
    const place = ride && placeById(ride.placeId);
    if (nav.route) {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#0047ab";
      navLayers.route = L.polyline(nav.route.points, { color, weight: 6, opacity: 0.85 }).addTo(navMap);
      if (fit && !pos) navMap.fitBounds(navLayers.route.getBounds(), { padding: [20, 20] });
    }
    if (place) navLayers.dest = L.marker([place.lat, place.lon], { title: place.name }).addTo(navMap);
  }

  function updateNavMap() {
    if (!navMap || !pos) return;
    const ll = [pos.lat, pos.lon];
    if (!navLayers.me) {
      navLayers.me = L.circleMarker(ll, { radius: 9, color: "#fff", weight: 3, fillColor: "#e11d48", fillOpacity: 1 }).addTo(navMap);
    } else navLayers.me.setLatLng(ll);
    if (Date.now() > navFollowAt) navMap.panTo(ll, { animate: true, duration: 0.5 });
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
    if (navMap) {
      navMap.remove();
      navMap = null;
      navLayers = {};
    }
    app.innerHTML = `
      <header class="topbar"><div class="topbar-inner">RIDE <span>CALORIE</span></div></header>
      <main class="main">${view === "ride" ? rideView() : view === "history" ? historyView() : settingsView()}</main>
      <nav class="tabs">
        ${tab("ride", "🚴", ride ? "走行中" : "走る")}
        ${tab("history", "📋", "記録")}
        <a class="tab" href="garage.html"><span>🔧</span>ガレージ</a>
        ${tab("settings", "⚙️", "設定")}
      </nav>`;
    bind();
    renderWake();
    renderLive();
    renderWeather();
    mountPickMap();
    mountNavMap();
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
        <section class="live ${Store.prefs.nav ? "nav-on" : ""}">
          ${resumed ? `<p class="notice">前回の記録の続きから計測しています</p>` : ""}
          ${
            Store.prefs.nav
              ? `<div class="nav-card" id="navcard"></div>
                 <div class="nav-map" id="navmap"></div>`
              : ""
          }
          <div class="nav-tools">
            <button class="chip ${Store.prefs.nav ? "on" : ""}" id="nav-toggle">🧭 ナビ ${Store.prefs.nav ? "ON" : "OFF"}</button>
            ${
              Store.prefs.nav
                ? `<button class="chip ${Store.prefs.voice ? "on" : ""}" id="voice-toggle">${Store.prefs.voice ? "🔊 音声 ON" : "🔇 音声 OFF"}</button>
                   <button class="chip" id="reroute">↻ ルート再検索</button>`
                : ""
            }
          </div>
          ${Store.prefs.duel ? `<div class="duel-bar" id="duelbar"></div>` : ""}
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
      ${missionCard()}
      <p class="muted center">
        ${Store.profile.weightKg}kg + バイク${Store.profile.bikeKg}kg + 荷物${Store.profile.cargoKg}kg・${Store.profile.useGarage && Store.profile.cdaCustom ? `ガレージの空気抵抗(CdA ${Store.profile.cdaCustom})` : Physics.POSTURES[Store.profile.posture].label}で計算
        <br /><button class="link" data-view="settings">体格・バイク・目的地を変更</button>
      </p>
      <div class="status center"><span id="wake" class="pill"></span></div>
      <section class="card commute" id="commute" hidden></section>
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

  // 設定の「デュエルの声」に、端末にある日本語の声を並べる
  function fillVoices() {
    const sel = document.getElementById("duel-voice");
    if (!sel || !("speechSynthesis" in window)) return;
    const put = () => {
      const vs = speechSynthesis.getVoices().filter((v) => /^ja/i.test(v.lang));
      sel.innerHTML = `<option value="">おまかせ(男性の声を探す)</option>` + vs.map((v) => `<option value="${esc(v.name)}" ${v.name === Store.prefs.duelVoice ? "selected" : ""}>${esc(v.name)}${MALE.test(v.name) ? "(男性)" : ""}</option>`).join("");
    };
    put();
    speechSynthesis.onvoiceschanged = put;
  }

  // ホーム画面の今月のミッション(まだのものから3つ)
  function missionCard() {
    const st = Missions.status(Store.rides, Store.places);
    const left = st.missions.filter((m) => !m.done).sort((a, b) => b.pct - a.pct).slice(0, 3);
    const done = st.missions.filter((m) => m.done).length;
    return `
      <section class="card missions">
        <div class="ms-head"><div class="today-label">🎖️ ${st.month}のミッション</div><span>${done}/${st.missions.length} 達成・残り${st.daysLeft}日</span></div>
        ${left
          .map(
            (m) => `<div class="ms-row"><span>${m.icon} ${esc(m.label)}</span><small>${Missions.fmtVal(m, m.value)}/${m.target.toLocaleString()}${m.unit}</small>
              <div class="ms-bar"><i style="width:${m.pct.toFixed(1)}%"></i></div></div>`
          )
          .join("") || `<p class="small">今月のミッションをぜんぶ達成しました!🎉</p>`}
        <p class="muted small">バッジ ${st.count}個${st.next ? `・あと${st.next.need - st.count}個で「${esc(st.next.label)}」` : ""}
          <a class="link" href="garage.html?tab=mission">ガレージで見る</a></p>
      </section>`;
  }

  // ---------- 出撃リザルト(ランク・スコア・バッジ) ----------
  // ランクは「いつもの自分」と比べた速さ(過去のライドの平均速度の中央値)。記録が少ないうちは速度そのもので
  function sortieOf(r) {
    const avg = r.movingSec > 0 ? r.distance / r.movingSec : 0;
    const kmh = avg * 3.6;
    const others = Store.rides.filter((x) => x.id !== r.id && x.distance >= 1000 && x.movingSec > 0);
    const past = others.slice(0, 20).map((x) => x.distance / x.movingSec).sort((a, b) => a - b);
    const med = past.length >= 3 ? past[Math.floor(past.length / 2)] : null;
    const ratio = med ? avg / med : null;
    const place = placeById(r.arrivedPlaceId);
    const trips = place ? place.trips || [] : [];
    const trip = trips.find((t) => t.rideId === r.id);
    const pb = !!(trip && trips.length >= 2 && trips.every((t) => t === trip || t.speed < trip.speed));
    let rank;
    if (pb || (ratio && ratio >= 1.08)) rank = "S";
    else if (ratio) rank = ratio >= 1.03 ? "A" : ratio >= 0.97 ? "B" : ratio >= 0.9 ? "C" : "D";
    else rank = kmh >= 28 ? "S" : kmh >= 25 ? "A" : kmh >= 21 ? "B" : kmh >= 17 ? "C" : "D";
    const mult = { S: 1.3, A: 1.15, B: 1, C: 0.9, D: 0.8 }[rank];
    const score = Math.round(((r.distance / 1000) * 40 + totalKcal(r) * 0.6 + r.elevGain * 2 + kmh * 8) * mult);
    const badges = [];
    if (pb) badges.push(`🏆 ${place.name}まで自己ベスト`);
    if (others.length >= 3 && others.every((x) => x.distance < r.distance)) badges.push("📏 最長距離");
    if (others.length >= 3 && others.every((x) => (x.maxSpeed || 0) < r.maxSpeed)) badges.push(`⚡ 最高速度 ${fmt.kmh(r.maxSpeed)}km/h`);
    if (r.elevGain >= 100) badges.push(`⛰️ 獲得標高 ${Math.round(r.elevGain)}m`);
    for (const m of Missions.newlyDone(Store.rides, Store.places, r)) badges.unshift(`🎖️ ミッション達成: ${m.label}`);
    const week = Store.rides.filter((x) => x.startedAt > r.startedAt - 7 * 86400000 && x.startedAt <= r.startedAt).length;
    if (week >= 3) badges.push(`🔥 7日間で${week}回目`);
    const g = Store.garage && Store.garage.builds && Store.garage.builds.current;
    const machine = `${Store.profile.useGarage && g ? g.name || "いまのバイク" : "バイク"} ${Store.profile.bikeKg}kg`;
    const vs = ratio ? `いつもの平均より${ratio >= 1 ? "+" : "−"}${Math.abs(Math.round((ratio - 1) * 100))}%` : "記録が3回たまると、いつもの自分と比べます";
    return { rank, score, kmh, badges, machine, vs, pb };
  }

  function resultCard(r) {
    const k = totalKcal(r);
    const so = sortieOf(r);
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
    const avgPower = r.movingSec > 0 ? r.workJ / r.movingSec : 0;
    const cells = [
      ["DISTANCE", "距離", fmt.km(r.distance), "km"],
      ["CALORIE", "消費カロリー", fmt.kcal(k), "kcal"],
      ["AVG SPEED", "平均速度", so.kmh.toFixed(1), "km/h"],
      ["TIME", "走行時間", fmt.dur(r.movingSec), ""],
      ["CLIMB", "獲得標高", Math.round(r.elevGain), "m"],
      ["POWER", "平均パワー", Math.round(avgPower), "W"],
    ];
    return `
      <section class="card result sortie">
        ${duelHead(r)}
        <div class="so-head"><span>${Store.prefs.duel || r.duel ? "TURBO DUEL END" : "MISSION COMPLETE"}</span><small>${fmt.date(r.startedAt)} ${fmt.time(r.startedAt)}・${esc(so.machine)}</small></div>
        <div class="so-main">
          <div class="so-rank r-${so.rank}">${so.rank}</div>
          <div><div class="so-label">SCORE</div><div class="so-score">${so.score.toLocaleString()}<small>pts</small></div><div class="so-vs">${esc(so.vs)}</div></div>
        </div>
        <div class="so-grid">${cells.map(([en, ja, v, u]) => `<div class="so-cell"><small>${en}<em>${ja}</em></small><b>${v}<i>${u}</i></b></div>`).join("")}</div>
        ${so.badges.length ? `<div class="so-badges">${so.badges.map((b) => `<span>${esc(b)}</span>`).join("")}</div>` : ""}
        <p class="so-food">おつかれさまでした! ${foodLine(k, true)}</p>
        ${placeLine}
        <button class="btn sub so-share" id="share-result">📤 リザルト画像を保存・共有</button>
        <details class="so-detail"><summary>くわしい記録</summary>${detailTable(r)}</details>
      </section>`;
  }

  // 勝敗: バトルをしていれば、そのLP。なければゴーストとの時間の比べ
  function duelOutcome(r) {
    const res = Duel.result(r, placeById(r.arrivedPlaceId));
    const b = r.duel && r.duel.b && r.duel.b.turn ? Battle.verdict(r.duel.b) : null;
    if (!b) return res;
    // LPが同じ(短いライドなど)なら、ゴーストとの時間で決める
    if (b.winner === "draw" && res && res.diffSec != null) b.winner = res.diffSec > 0 ? "you" : "opp";
    return Object.assign({}, res || {}, { first: false, battle: b, win: b.winner === "you", lp: b.you });
  }

  // デュエルモードの勝敗(いつもの自分=ゴーストと比べる)
  function duelHead(r) {
    if (!(Store.prefs.duel || r.duel)) return "";
    const res = duelOutcome(r);
    const spc = (r.duel && r.duel.spc) || 0;
    if (res && res.battle) {
      const b = res.battle;
      return `<div class="duel-res ${b.winner === "you" ? "win" : b.winner === "opp" ? "lose" : ""}"><b>${b.winner === "you" ? "DUEL WIN!" : b.winner === "opp" ? "DUEL LOSE…" : "DRAW"}</b>
        <small>${b.turns}ターン・LP ${b.you.toLocaleString()} 対 ${b.opp.toLocaleString()}・SPC ${spc}${res.diffSec != null ? `・ゴーストより${Math.abs(Math.round(res.diffSec))}秒${res.diffSec > 0 ? "速い" : "遅い"}` : ""}</small></div>`;
    }
    if (!res) return `<div class="duel-res"><b>RIDING DUEL</b><small>SPC ${spc}・目的地に着くと、ゴーストとの勝負になります</small></div>`;
    if (res.first) return `<div class="duel-res"><b>FIRST DUEL</b><small>SPC ${spc}・次からは今日の自分がゴーストになります</small></div>`;
    const m = Math.abs(res.diffSec);
    const t = m >= 60 ? `${Math.floor(m / 60)}分${Math.round(m % 60)}秒` : `${Math.round(m)}秒`;
    return `<div class="duel-res ${res.win ? "win" : "lose"}"><b>${res.win ? "DUEL WIN!" : "DUEL LOSE…"}</b>
      <small>ゴーストより${t}${res.win ? "速い" : "遅い"}・LP ${res.lp.toLocaleString()} / ${Duel.LP0.toLocaleString()}・SPC ${spc}</small></div>`;
  }

  // 共有用の画像(1080×1350)をつくる
  function sortieImage(r) {
    const so = sortieOf(r);
    const W = 1080, H = 1350;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    const F = (w, px) => `${w} ${px}px "Rajdhani", "Hiragino Sans", "Noto Sans JP", sans-serif`;
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0d1117");
    bg.addColorStop(1, "#1a1206");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    // 斜めの縞
    g.save();
    g.globalAlpha = 0.25;
    g.fillStyle = "#ff9a2e";
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      g.moveTo(760 + i * 60, 0);
      g.lineTo(800 + i * 60, 0);
      g.lineTo(720 + i * 60, 110);
      g.lineTo(680 + i * 60, 110);
      g.fill();
    }
    g.restore();
    g.fillStyle = "#ff9a2e";
    g.fillRect(60, 150, 10, 70);
    g.fillStyle = "#e8edf3";
    g.font = F(800, 64);
    const duelOn = Store.prefs.duel || r.duel;
    g.fillText(duelOn ? "TURBO DUEL END" : "MISSION COMPLETE", 90, 210);
    const dr = duelOn ? duelOutcome(r) : null;
    if (dr && !dr.first) {
      g.textAlign = "right";
      g.font = F(900, 56);
      g.fillStyle = dr.win ? "#3dff8a" : "#ff6b5b";
      g.fillText(dr.win ? "DUEL WIN!" : "DUEL LOSE", W - 60, 300);
      g.font = F(600, 28);
      g.fillStyle = "#b8c2cf";
      g.fillText(`LP ${dr.lp.toLocaleString()}  SPC ${dr.spc}`, W - 60, 340);
      g.textAlign = "left";
    }
    g.fillStyle = "#8b96a5";
    g.font = F(500, 30);
    g.fillText(`${fmt.date(r.startedAt)} ${fmt.time(r.startedAt)}  ${so.machine}`, 90, 260);
    // ランク
    const col = { S: "#ffcf5a", A: "#ff9a2e", B: "#6fc3ff", C: "#b8c2cf", D: "#7d8794" }[so.rank];
    g.strokeStyle = col;
    g.lineWidth = 8;
    g.strokeRect(90, 320, 260, 260);
    g.fillStyle = col;
    g.font = F(800, 230);
    g.textAlign = "center";
    g.fillText(so.rank, 220, 535);
    g.textAlign = "left";
    g.fillStyle = "#8b96a5";
    g.font = F(600, 34);
    g.fillText("SCORE", 400, 380);
    g.fillStyle = "#e8edf3";
    g.font = F(800, 130);
    g.fillText(so.score.toLocaleString(), 400, 510);
    g.fillStyle = "#8b96a5";
    g.font = F(500, 30);
    g.fillText(so.vs, 400, 565);
    // 数値
    const avgPower = r.movingSec > 0 ? r.workJ / r.movingSec : 0;
    const cells = [
      ["DISTANCE", fmt.km(r.distance), "km"],
      ["CALORIE", fmt.kcal(totalKcal(r)), "kcal"],
      ["AVG SPEED", so.kmh.toFixed(1), "km/h"],
      ["TIME", fmt.dur(r.movingSec), ""],
      ["CLIMB", String(Math.round(r.elevGain)), "m"],
      ["POWER", String(Math.round(avgPower)), "W"],
    ];
    cells.forEach(([en, v, u], i) => {
      const x = 90 + (i % 2) * 460, y = 660 + Math.floor(i / 2) * 170;
      g.fillStyle = "rgba(255,255,255,0.04)";
      g.fillRect(x, y, 430, 140);
      g.fillStyle = "#ff9a2e";
      g.fillRect(x, y, 6, 140);
      g.fillStyle = "#8b96a5";
      g.font = F(600, 28);
      g.fillText(en, x + 30, y + 45);
      g.fillStyle = "#e8edf3";
      g.font = F(800, 70);
      g.fillText(v, x + 30, y + 118);
      const w = g.measureText(v).width;
      g.fillStyle = "#8b96a5";
      g.font = F(600, 32);
      g.fillText(u, x + 40 + w, y + 118);
    });
    g.font = F(700, 32);
    let bx = 90;
    for (const b of so.badges.slice(0, 3)) {
      const w = g.measureText(b).width + 40;
      if (bx + w > W - 60) break;
      g.fillStyle = "rgba(255,154,46,0.18)";
      g.fillRect(bx, 1180, w, 56);
      g.fillStyle = "#ffcf5a";
      g.fillText(b, bx + 20, 1219);
      bx += w + 16;
    }
    g.fillStyle = "#56606d";
    g.font = F(700, 28);
    g.fillText("RIDE CALORIE", 90, 1300);
    return new Promise((res) => c.toBlob(res, "image/png"));
  }

  async function shareResult(r) {
    const blob = await sortieImage(r);
    if (!blob) return;
    const name = `ride-result-${new Date(r.startedAt).toISOString().slice(0, 10)}.png`;
    const file = new File([blob], name, { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "ライドのリザルト" });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
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
          <button class="link" data-result="${r.id}">🎖️ リザルトを見る</button>
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
        ${
          p.cdaCustom
            ? `<label class="check"><input type="checkbox" name="useGarage" ${p.useGarage ? "checked" : ""} />
                <span>ガレージで計算した空気抵抗を使う(CdA ${p.cdaCustom})<small>オンのときは「乗車姿勢」の代わりに、ガレージのパーツ構成とポジションから計算した値を使います</small></span></label>`
            : `<p class="muted small">🔧 ガレージでパーツとポジションを入力すると、より正確な重さと空気抵抗を使えます</p>`
        }

        <h2>天気と画面</h2>
        <label class="check"><input type="checkbox" name="wind" ${pr.wind ? "checked" : ""} />
          <span>天気予報を使う<small>1時間ごとの天気の表示と、風向き・風速を使った計算に使います(Open-Meteo)。送る位置は約1km単位に丸めます</small></span></label>
        <label class="check"><input type="checkbox" name="eveningNotify" ${pr.eveningNotify ? "checked" : ""} />
          <span>夕方に帰りの予報を知らせる<small>決まった時刻に、会社から家までの雨と風、雨に当たらない出発時刻を知らせます。アプリを開いているとき(画面に出ているとき)だけ届きます</small></span></label>
        <label class="field"><span>知らせる時刻</span><input type="time" name="eveningTime" value="${esc(pr.eveningTime || "17:30")}" /></label>
        <label class="field"><span>画面を消さない</span>
          <select name="wake">
            <option value="always" ${pr.wake === "always" ? "selected" : ""}>開いている間ずっと</option>
            <option value="riding" ${pr.wake === "riding" ? "selected" : ""}>走行中のみ</option>
          </select></label>

        <h2>あそび</h2>
        <label class="check"><input type="checkbox" name="duel" ${pr.duel ? "checked" : ""} />
          <span>🃏 デュエルモード(5D's風)<small>走り出しの「アクセラレーション!」、1kmごとにたまるスピードカウンター、いつもの自分(ゴースト)とのLP勝負、ガレージのシンクロ召喚の演出</small></span></label>
        <label class="field"><span>デュエルの声</span><select name="duelVoice" id="duel-voice"><option value="">おまかせ(男性の声を探す)</option></select></label>
        <button class="link" type="button" id="duel-voice-test">🔊 声を試す</button>
        <div class="field duelist-field"><span>デュエリストの画像<small>ふだんはオリジナルのキャラクターが出ます。自分の写真など、使ってよい画像に替えられます(この端末の中だけに保存)</small></span>
          <div class="duelist-pick"><span class="duelist-prev" id="duelist-prev"></span>
            <label class="link">画像を選ぶ<input type="file" accept="image/*" id="duelist-file" hidden /></label>
            <button class="link" type="button" id="duelist-reset">元に戻す</button></div></div>
        <h2>ナビ</h2>
        <label class="check"><input type="checkbox" name="nav" ${pr.nav ? "checked" : ""} />
          <span>走行中に地図とルート案内を表示する<small>目的地までの自転車向けのルートを調べ、次に曲がる場所を表示します。地図を表示するぶん、電池と通信量が増えます</small></span></label>
        <label class="check"><input type="checkbox" name="voice" ${pr.voice ? "checked" : ""} />
          <span>曲がる場所を音声で案内する<small>「150m先、左折です」のように話します</small></span></label>

        <button class="btn start" type="submit">保存</button>
        <p class="muted small">基礎代謝 約${Math.round(Physics.bmrPerDay(p))}kcal/日・空気抵抗係数(CdA) ${Physics.cdaFor(p).toFixed(3)}m²</p>
      </form>
      ${placesSection()}
      ${typeof Sync !== "undefined" ? Sync.panelHtml() : ""}
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
    renderNavCard();
    updateNavMap();
    renderDuel();

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

  function renderDuel() {
    const el = document.getElementById("duelbar");
    if (!el || !ride) return;
    const d = Duel.state(ride);
    const g = Duel.ghost(ride, placeById(ride.placeId));
    const pips = Array.from({ length: Duel.MAX_SPC }, (_, i) => `<i class="${i < d.spc ? "on" : ""}"></i>`).join("");
    const pl = placeById(ride.placeId);
    const names = { you: "YOU", opp: pl && Eta.learned(pl) ? "ゴースト" : "練習相手" };
    el.className = "duel-bar field";
    el.innerHTML = `
      <div class="duel-top"><div class="spc"><span>SPC</span><b>${d.spc}</b><div class="spc-pips">${pips}</div></div>
      ${
        g
          ? `<div class="lp"><span>GHOST</span><b class="gh ${g.diff >= 0 ? "ahead" : "behind"}">${g.diff >= 0 ? "+" : "−"}${Math.round(Math.abs(g.diff)).toLocaleString()}m</b>
             <small>${g.diff >= 0 ? "ゴーストより前を走っています" : "ゴーストに遅れています"}</small></div>`
          : `<div class="lp"><span>GHOST</span><small>目的地に何回か着くと、いつもの自分(ゴースト)と勝負できます</small></div>`
      }</div>
      ${DuelFx.fieldHtml(Battle.state(ride), names)}
      <small class="duel-next">次のターンまで ${Math.max(0, Math.ceil((1000 - (ride.distance % 1000)) / 10) * 10)}m</small>
      <div class="duel-hand">${(d.hand || [])
        .map(Duel.byId)
        .filter(Boolean)
        .map((c) => `<span class="mini ${c.kind}" title="${esc(c.text)}">${c.kind === "trap" ? "⚡" : "🌀"} ${esc(c.name)}</span>`)
        .join("") || `<small>手札なし</small>`}</div>`;
  }

  // 目的地までの推定を更新する。半分まで来たときの予測と、到着した時点の記録を残しておき、
  // ライド終了後の学習と答え合わせに使う
  function updateEta() {
    const place = placeById(ride.placeId);
    const onRoute = place && nav.route && nav.placeId === place.id && nav.hint && nav.hint.off < 60;
    const opts = onRoute ? { routeRemainM: Math.max(0, nav.route.length - nav.hint.along) } : null;
    ride.eta = place && pos ? Object.assign(Eta.estimate(place, ride, pos, opts), { at: Date.now() }) : null;
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
    const basis =
      (est.byRoute ? "ルートの距離・" : "") +
      (est.learnedN
        ? `到着${est.learnedN}回分の学習${acc ? `・予測のずれ 平均${acc.minutes.toFixed(1)}分` : ""}`
        : "学習前の目安(到着するたびに正確になります)");
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
    if (typeof Sync !== "undefined") Sync.bindPanel(app, render);
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
    on("nav-toggle", () => {
      Store.setPrefs({ nav: !Store.prefs.nav });
      if (Store.prefs.nav) {
        speak("ナビをオンにしました", true);
        updateNav();
      } else resetNav();
      render();
    });
    on("voice-toggle", () => {
      Store.setPrefs({ voice: !Store.prefs.voice });
      if (Store.prefs.voice) speak("音声案内をオンにしました", true);
      else {
        try {
          speechSynthesis.cancel();
        } catch (e) {
          // 無視
        }
      }
      render();
    });
    on("reroute", () => {
      speak("ルートを検索します", true);
      nav.lastFetch = 0;
      nav.placeId = null;
      nav.route = null;
      updateNav();
    });
    on("finish", finishRide);
    on("eta", () => {
      if (Store.places.length) cycleDest();
    });
    on("register-end", () => registerEnd(lastResult));
    fillVoices();
    const prev = document.getElementById("duelist-prev");
    if (prev) prev.innerHTML = DuelFx.avatarHtml("you");
    on("duelist-reset", () => {
      try {
        localStorage.removeItem(DuelFx.IMG_KEY);
      } catch (e) {}
      if (prev) prev.innerHTML = DuelFx.avatarHtml("you");
    });
    const df = document.getElementById("duelist-file");
    if (df)
      df.addEventListener("change", async () => {
        const f = df.files && df.files[0];
        if (!f) return;
        try {
          // 縦長のカットインに合わせて、真ん中を切り出して小さくする
          const img = await createImageBitmap(f);
          const W = 240, H = 288, c = document.createElement("canvas");
          c.width = W;
          c.height = H;
          const s = Math.max(W / img.width, H / img.height);
          c.getContext("2d").drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
          localStorage.setItem(DuelFx.IMG_KEY, c.toDataURL("image/jpeg", 0.85));
          if (prev) prev.innerHTML = DuelFx.avatarHtml("you");
        } catch (e) {
          alert("画像を読み込めませんでした");
        }
      });
    on("duel-voice-test", () => {
      const sel = document.getElementById("duel-voice");
      const keep = { duel: Store.prefs.duel, duelVoice: Store.prefs.duelVoice, voice: Store.prefs.voice };
      Object.assign(Store.prefs, { duel: true, duelVoice: sel ? sel.value : "", voice: true });
      speak("ライディング・デュエル、アクセラレーション!", true);
      Object.assign(Store.prefs, keep);
    });
    on("share-result", () => lastResult && shareResult(lastResult));
    app.querySelectorAll("[data-result]").forEach((b) =>
      b.addEventListener("click", () => {
        lastResult = Store.rides.find((x) => x.id === b.dataset.result) || null;
        view = "ride";
        render();
        window.scrollTo(0, 0);
      })
    );
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
      useGarage: f.get("useGarage") === "on",
    });
    const eveningNotify = f.get("eveningNotify") === "on";
    const newTime = f.get("eveningTime") || "17:30";
    if (newTime !== Store.prefs.eveningTime || (eveningNotify && !Store.prefs.eveningNotify)) {
      try {
        localStorage.removeItem(EVE_KEY); // 時刻を変えたら、今日もう一度知らせる
      } catch (err) {}
    }
    Store.setPrefs({ wind: f.get("wind") === "on", wake: f.get("wake"), nav: f.get("nav") === "on", voice: f.get("voice") === "on", eveningNotify, eveningTime: newTime, duel: f.get("duel") === "on", duelVoice: f.get("duelVoice") || "" });
    if (eveningNotify && "Notification" in window && Notification.permission === "default") {
      try {
        Notification.requestPermission();
      } catch (err) {}
    }
    updateWake();
    view = "ride";
    render();
    window.scrollTo(0, 0);
  }

  setInterval(eveningCheck, 60 * 1000);
  setTimeout(eveningCheck, 3000);

  // 経過時間は測位がなくても1秒ごとに進める
  setInterval(() => {
    if (ride) renderLive();
  }, 1000);

  // ホーム画面に追加したアプリは古いファイルを使い続けることがあるので、
  // 起動時と画面に戻ったときに最新のバージョンを確認し、新しければ読み込み直す(走行中はしない)
  const APP_VERSION = "2026.11.13";
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
    if (document.visibilityState === "visible") {
      checkUpdate();
      eveningCheck();
    }
  });
  checkUpdate();

  // ほかの端末で変えた内容が届いたら描き直す(走行中・入力中は描き直さない)
  if (typeof Sync !== "undefined")
    Sync.onUpdate((e) => {
      if (!e.changed || ride) return;
      const a = document.activeElement;
      if (a && /INPUT|SELECT|TEXTAREA/.test(a.tagName)) return;
      render();
    });

  restoreActive();
  render();
  updateWake();
})();

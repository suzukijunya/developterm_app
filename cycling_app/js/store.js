// プロフィール・走行記録を localStorage に保存・復元する。
// 保存できない環境(プライベートモード等)では、起動中のメモリ上だけで動く。

const Store = (() => {
  const KEY = "cycling_app_v1";
  const MAX_PLACES = 10;

  function defaults() {
    return {
      profile: {
        heightCm: 170,
        weightKg: 65,
        muscleKg: 0, // 体組成計の「筋肉量」。0 = 未入力
        bikeKg: 8,
        cargoKg: 3, // リュックなどの荷物
        posture: "hoods",
        surface: "city",
      },
      prefs: {
        wind: true, // 天気APIの風を計算に入れる
        wake: "always", // 画面を消さない: "always" = アプリを開いている間 / "riding" = 走行中のみ
        destId: null, // 次のライドの目的地。null = 現在地から自動で選ぶ / "none" = 目的地なし
        nav: true, // 走行中に地図とルート案内を表示する
        voice: true, // 曲がる場所を音声で案内する
        eveningNotify: false, // 夕方に帰りの予報を知らせる(アプリを開いているとき)
        eveningTime: "17:30",
        duel: false, // デュエルモード(スピードカウンター・ゴーストとのLP勝負・シンクロ演出)
        duelVoice: "", // デュエルモードで使う声の名前(空ならおまかせ)
      },
      profileSet: false,
      rides: [], // 保存したライド(新しい順)
      places: [], // 目的地(最大10件) { id, name, label(住所など), lat, lon, uses(選んだ回数), trips: [到着したライドから学習した値(新しい順)] }
      lastPos: null, // 最後にわかった現在地 { lat, lon }(天気の表示用。端末の中だけに保存)
      active: null, // 記録中のライド(再読み込みしても続きから記録するため)
      garage: null, // ガレージ(パーツ構成・フィッティング)。garage.html で作る
      // 端末どうしの同期のための情報: t = 項目ごとに最後に変えた時刻(0 = まだ変えていない)、
      // deletedRides / deletedPlaces = 消したものの id(ほかの端末から戻ってこないように)
      sync: { t: { profile: 0, prefs: 0, places: 0, garage: 0 }, deletedRides: [] },
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      const base = defaults();
      const sync = parsed.sync || {};
      return Object.assign(base, parsed, {
        profile: Object.assign(base.profile, parsed.profile || {}),
        prefs: Object.assign(base.prefs, parsed.prefs || {}),
        sync: { t: Object.assign(base.sync.t, sync.t || {}), deletedRides: sync.deletedRides || [] },
      });
    } catch (e) {
      return defaults();
    }
  }

  const listeners = [];
  // 最後に保存したときの中身(本当に変わったときだけ同期の時刻を進めるため)
  const savedJson = {};
  const remember = () => {
    for (const k of ["profile", "prefs", "places", "garage"]) savedJson[k] = JSON.stringify(state[k]);
  };
  remember();
  // section: 変えた項目(中身が変わっていれば同期の時刻を進める)。なしなら端末の中だけの情報
  function save(section) {
    let changed = false;
    if (section) {
      const j = JSON.stringify(state[section]);
      if (j !== savedJson[section]) {
        savedJson[section] = j;
        state.sync.t[section] = Date.now();
        changed = true;
      }
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // 保存できない環境では今回の起動中のみ有効
    }
    if (changed) for (const fn of listeners) fn(section);
  }
  function touchRides() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
    for (const fn of listeners) fn("rides");
  }

  // ---------- 同期 ----------
  // ほかの端末と共有するもの(現在地・記録中のライドは端末の中だけ)
  function snapshot() {
    const { profile, prefs, profileSet, rides, places, garage, sync } = state;
    return JSON.parse(JSON.stringify({ profile, prefs, profileSet, rides, places, garage, sync }));
  }

  // ほかの端末のデータと合わせる。新しく変えたほうを使い、走行記録は両方を合わせる。
  // force: "remote" = あちらを使う / "local" = こちらを使う(初めて連携するときに選ぶ)
  // 戻り値: 変わった項目の一覧
  function merge(remote, force) {
    if (!remote) return [];
    const changed = [];
    const rt = (remote.sync && remote.sync.t) || {};
    const lt = state.sync.t;
    for (const k of ["profile", "prefs", "places", "garage"]) {
      if (remote[k] === undefined) continue;
      const r = rt[k] || 0, l = lt[k] || 0;
      if (force === "local") {
        lt[k] = Math.max(Date.now(), r + 1);
        continue;
      }
      if ((force === "remote" && remote[k] != null) || r > l) {
        if (JSON.stringify(state[k]) !== JSON.stringify(remote[k])) changed.push(k);
        state[k] = k === "profile" || k === "prefs" ? Object.assign(defaults()[k], remote[k]) : remote[k];
        lt[k] = r;
        if (k === "profile" && remote.profileSet) state.profileSet = true;
      }
    }
    // ライド: 両方を合わせる(消したものは除く)
    const del = new Set([...(state.sync.deletedRides || []), ...((remote.sync && remote.sync.deletedRides) || [])]);
    const byId = new Map();
    for (const r of [...state.rides, ...(remote.rides || [])]) if (r && r.id != null && !del.has(r.id) && !byId.has(r.id)) byId.set(r.id, r);
    const rides = [...byId.values()].sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0)).slice(0, 500);
    if (rides.length !== state.rides.length || rides.some((r, i) => r.id !== state.rides[i].id)) changed.push("rides");
    state.rides = rides;
    state.sync.deletedRides = [...del].slice(-1000);
    remember();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
    return changed;
  }

  return {
    get profile() {
      return state.profile;
    },
    get prefs() {
      return state.prefs;
    },
    get profileSet() {
      return state.profileSet;
    },
    get rides() {
      return state.rides;
    },
    get active() {
      return state.active;
    },
    get places() {
      return state.places;
    },
    get lastPos() {
      return state.lastPos;
    },
    get garage() {
      return state.garage;
    },
    setGarage(g) {
      state.garage = g;
      save("garage");
    },
    setLastPos(pos) {
      state.lastPos = { lat: pos.lat, lon: pos.lon };
      save();
    },
    setProfile(p) {
      Object.assign(state.profile, p);
      state.profileSet = true;
      save("profile");
    },
    setPrefs(p) {
      Object.assign(state.prefs, p);
      save("prefs");
    },
    setActive(ride) {
      state.active = ride;
      save();
    },
    addRide(ride) {
      state.rides.unshift(ride);
      if (state.rides.length > 500) state.rides.length = 500;
      touchRides();
    },
    // 削除したライドは、目的地の学習からも外す
    deleteRides(ids) {
      const set = new Set(ids);
      state.rides = state.rides.filter((r) => !set.has(r.id));
      for (const p of state.places) p.trips = (p.trips || []).filter((t) => !set.has(t.rideId));
      state.sync.deletedRides = [...state.sync.deletedRides, ...ids].slice(-1000);
      save("places");
      touchRides();
    },
    MAX_PLACES,
    // 上限に達していれば null
    addPlace(place) {
      if (state.places.length >= MAX_PLACES) return null;
      state.places.push(Object.assign({ id: String(Date.now()), uses: 0, trips: [] }, place));
      save("places");
      return state.places[state.places.length - 1];
    },
    renamePlace(id, name) {
      const p = state.places.find((x) => x.id === id);
      if (p) p.name = name;
      save("places");
    },
    deletePlace(id) {
      state.places = state.places.filter((p) => p.id !== id);
      if (state.prefs.destId === id) (state.prefs.destId = null), save("prefs");
      save("places");
    },
    // ライドの目的地として使った回数(よく使う目的地の並び順に使う)
    markUsed(id) {
      const p = state.places.find((x) => x.id === id);
      if (p) p.uses = (p.uses || 0) + 1;
      save("places");
    },
    // 目的地の学習値を書き換えたあとに呼ぶ
    savePlaces() {
      save("places");
    },
    snapshot,
    merge,
    // 同期する情報が変わったら呼ばれる
    onChange(fn) {
      listeners.push(fn);
    },
  };
})();

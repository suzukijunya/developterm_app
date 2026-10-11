// プロフィール・走行記録を localStorage に保存・復元する。
// 保存できない環境(プライベートモード等)では、起動中のメモリ上だけで動く。

const Store = (() => {
  const KEY = "cycling_app_v1";

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
      },
      profileSet: false,
      rides: [], // 保存したライド(新しい順)
      active: null, // 記録中のライド(再読み込みしても続きから記録するため)
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      const base = defaults();
      return Object.assign(base, parsed, {
        profile: Object.assign(base.profile, parsed.profile || {}),
        prefs: Object.assign(base.prefs, parsed.prefs || {}),
      });
    } catch (e) {
      return defaults();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // 保存できない環境では今回の起動中のみ有効
    }
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
    setProfile(p) {
      Object.assign(state.profile, p);
      state.profileSet = true;
      save();
    },
    setPrefs(p) {
      Object.assign(state.prefs, p);
      save();
    },
    setActive(ride) {
      state.active = ride;
      save();
    },
    addRide(ride) {
      state.rides.unshift(ride);
      if (state.rides.length > 500) state.rides.length = 500;
      save();
    },
    deleteRide(id) {
      state.rides = state.rides.filter((r) => r.id !== id);
      save();
    },
  };
})();

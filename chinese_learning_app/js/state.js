// 学習の進捗状態を localStorage に保存・復元する

const STORAGE_KEY = "zh_app_state_v1";
const MAX_HEARTS = 5;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    xp: 0,
    streak: 0,
    lastStudyDate: null,
    hearts: MAX_HEARTS,
    heartsRefillDate: todayStr(),
    lessonProgress: {}, // { [lessonId]: { completed: bool, stars: number, bestAccuracy: number } }
  };
}

const AppState = (() => {
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed };
    } catch (e) {
      return defaultState();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // localStorage が使えない環境では黙って無視する
    }
  }

  function get() {
    return state;
  }

  function reset() {
    state = defaultState();
    save();
  }

  // 日をまたいだらハートを回復し、連続学習日数(streak)を更新する
  function refreshDaily() {
    const today = todayStr();
    if (state.heartsRefillDate !== today) {
      state.hearts = MAX_HEARTS;
      state.heartsRefillDate = today;
    }
    save();
  }

  function markStudiedToday() {
    const today = todayStr();
    if (state.lastStudyDate === today) return;

    if (state.lastStudyDate) {
      const prev = new Date(state.lastStudyDate);
      const diffDays = Math.round((new Date(today) - prev) / 86400000);
      state.streak = diffDays === 1 ? state.streak + 1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastStudyDate = today;
    save();
  }

  function addXp(amount) {
    state.xp += amount;
    save();
  }

  function loseHeart() {
    state.hearts = Math.max(0, state.hearts - 1);
    save();
    return state.hearts;
  }

  function hasHearts() {
    return state.hearts > 0;
  }

  function refillHearts() {
    state.hearts = MAX_HEARTS;
    save();
  }

  function completeLesson(lessonId, accuracy) {
    const prev = state.lessonProgress[lessonId];
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;
    state.lessonProgress[lessonId] = {
      completed: true,
      stars: Math.max(stars, prev?.stars || 0),
      bestAccuracy: Math.max(accuracy, prev?.bestAccuracy || 0),
    };
    markStudiedToday();
    save();
  }

  function isLessonCompleted(lessonId) {
    return !!state.lessonProgress[lessonId]?.completed;
  }

  function getLessonStars(lessonId) {
    return state.lessonProgress[lessonId]?.stars || 0;
  }

  return {
    get,
    reset,
    refreshDaily,
    markStudiedToday,
    addXp,
    loseHeart,
    hasHearts,
    refillHearts,
    completeLesson,
    isLessonCompleted,
    getLessonStars,
    MAX_HEARTS,
  };
})();

// 学習の進捗状態を localStorage に保存・復元する

const STORAGE_KEY = "zh_app_state_v1";
const MAX_HEARTS = 5;
const DAILY_GOAL_XP = 30;
const STUDY_DATES_LIMIT = 60;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    lastStudyDate: null,
    hearts: MAX_HEARTS,
    heartsRefillDate: todayStr(),
    lessonProgress: {}, // { [lessonId]: { completed: bool, stars: number, bestAccuracy: number } }
    dailyXp: 0,
    dailyXpDate: todayStr(),
    studyDates: [], // 直近の学習日('YYYY-MM-DD')。連続学習カレンダー表示に使う
    mistakes: {}, // { [exerciseKey]: { wrongCount: number, correctStreak: number, lastSeen: string } }
    totalStudySeconds: 0, // 実際に学習画面を開いていた累計秒数(ロードマップの目安時間に使う)
    flashcards: {}, // { [deckId#wordIndex]: { box: 1-5, dueDate: string, mastered: bool } } 単語カード(Leitner式)
  };
}

// 単語カードの復習間隔(Leitner式)。インデックス=box番号(1〜5)、値=次回復習までの日数
const FLASHCARD_BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 14];
const FLASHCARD_MAX_BOX = 5;

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

  // 日をまたいだらハート/デイリー目標をリセットする
  function refreshDaily() {
    const today = todayStr();
    if (state.heartsRefillDate !== today) {
      state.hearts = MAX_HEARTS;
      state.heartsRefillDate = today;
    }
    if (state.dailyXpDate !== today) {
      state.dailyXp = 0;
      state.dailyXpDate = today;
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
    state.bestStreak = Math.max(state.bestStreak || 0, state.streak);
    state.lastStudyDate = today;

    if (!state.studyDates.includes(today)) {
      state.studyDates.push(today);
      if (state.studyDates.length > STUDY_DATES_LIMIT) state.studyDates.shift();
    }
    save();
  }

  function addXp(amount) {
    refreshDaily();
    state.xp += amount;
    state.dailyXp += amount;
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

  // 問題単位の正誤を記録する。連続2回正解したら「苦手」から卒業する
  function recordAnswer(key, wasWrong) {
    if (!key) return;
    const entry = state.mistakes[key] || { wrongCount: 0, correctStreak: 0 };
    if (wasWrong) {
      entry.wrongCount += 1;
      entry.correctStreak = 0;
      entry.lastSeen = todayStr();
      state.mistakes[key] = entry;
    } else if (state.mistakes[key]) {
      entry.correctStreak += 1;
      entry.lastSeen = todayStr();
      if (entry.correctStreak >= 2) {
        delete state.mistakes[key];
      } else {
        state.mistakes[key] = entry;
      }
    }
    save();
  }

  function getWeakKeys(limit) {
    const keys = Object.entries(state.mistakes)
      .sort((a, b) => b[1].wrongCount - a[1].wrongCount || (b[1].lastSeen || "").localeCompare(a[1].lastSeen || ""))
      .map(([key]) => key);
    return limit ? keys.slice(0, limit) : keys;
  }

  function weakCount() {
    return Object.keys(state.mistakes).length;
  }

  function getFlashcardEntry(key) {
    return state.flashcards[key] || { box: 1, dueDate: null, mastered: false };
  }

  // knew=true なら box を1つ進める(最大5=マスター)、false なら box1に戻す
  function reviewFlashcard(key, knew) {
    const entry = state.flashcards[key] ? { ...state.flashcards[key] } : { box: 1 };
    if (knew) {
      entry.box = Math.min(FLASHCARD_MAX_BOX, entry.box + 1);
      entry.mastered = entry.box >= FLASHCARD_MAX_BOX;
    } else {
      entry.box = 1;
      entry.mastered = false;
    }
    const days = FLASHCARD_BOX_INTERVAL_DAYS[entry.box] ?? 14;
    const due = new Date();
    due.setDate(due.getDate() + days);
    entry.dueDate = due.toISOString().slice(0, 10);
    state.flashcards[key] = entry;
    save();
  }

  function addStudySeconds(sec) {
    if (!sec || sec <= 0) return;
    // 離席・非アクティブタブなどで異常値が入らないよう1レッスン分の上限を設ける
    state.totalStudySeconds += Math.min(sec, 30 * 60);
    save();
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
    recordAnswer,
    getWeakKeys,
    weakCount,
    addStudySeconds,
    getFlashcardEntry,
    reviewFlashcard,
    MAX_HEARTS,
    DAILY_GOAL_XP,
  };
})();

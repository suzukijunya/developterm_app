// 「続けやすさ」まわり:
// - ホーム下部の「今日の3分」ボタン(開いたらワンタップで次のレッスンへ)
// - 久しぶりに開いたときの「おかえり」画面(ウォームアップ・おかえりボーナス)
// - 毎日のリマインダーをカレンダーに登録する画面(.ics / Googleカレンダー)
const Comeback = (() => {
  const { el } = UI;
  const AWAY_DAYS = 3; // この日数以上あいたら「おかえり」を出す
  const WELCOME_GEMS = 20;

  // ---------- ホーム下部の「今日の3分」 ----------
  function startCard(onBack) {
    const next = App.nextLesson();
    const bar = el("div", "cb-start");
    const text = el("div", "cb-start-text");
    let action;
    if (next) {
      const done = AppState.get().dailyXp >= AppState.getDailyGoal();
      text.appendChild(el("div", "cb-start-kicker", done ? "目標達成!もう1つ進める?" : "今日の3分"));
      text.appendChild(el("div", "cb-start-title", `${next.unit.icon} ${next.lesson.title}`));
      action = () => App.startLesson(next.lesson.id);
    } else {
      text.appendChild(el("div", "cb-start-kicker", "本編はすべてクリア!"));
      text.appendChild(el("div", "cb-start-title", "💼 30ラリー会話コースへ"));
      action = () => Courses.catalog(onBack);
    }
    bar.appendChild(text);
    bar.appendChild(UI.button("cb-start-btn", "はじめる ▶", action));
    return bar;
  }

  // ---------- おかえり画面 ----------
  function maybeWelcome(onBack) {
    const away = AppState.daysSinceLastStudy();
    if (away === null || away < AWAY_DAYS) return;
    const today = todayStr();
    if (AppState.getPref("welcomeShownOn", "") === today) return;
    AppState.setPref("welcomeShownOn", today);
    // おかえりボーナスは「休みの期間」ごとに1回だけ
    const last = AppState.get().lastStudyDate;
    let gems = 0;
    if (AppState.getPref("welcomeBonusFor", "") !== last) {
      AppState.setPref("welcomeBonusFor", last);
      gems = WELCOME_GEMS;
      AppState.addGems(gems);
      const pill = document.querySelector(".stat-pill--gems");
      if (pill) pill.textContent = `💎 ${AppState.get().gems}`;
    }
    showWelcome({ away, gems, onBack });
  }

  function showWelcome({ away, gems, onBack }) {
    const s = AppState.get();
    const back = el("div", "rw-overlay cb-overlay");
    const card = el("div", "rw-modal cb-modal");
    const close = (then) => {
      back.classList.add("is-leaving");
      setTimeout(() => {
        back.remove();
        if (then) then();
      }, 180);
    };

    card.appendChild(el("div", "cb-panda", "🐼"));
    card.appendChild(el("div", "rw-modal-title", `おかえりなさい、${AppState.getNickname()}さん!`));
    card.appendChild(el("div", "rw-modal-sub", `${away}日ぶりですね。間があいても大丈夫、今日の3分から再開しましょう。`));

    const stats = el("div", "cb-stats");
    const done = Object.values(s.lessonProgress || {}).filter((p) => p.completed).length;
    [
      [String(done), "レッスン"],
      [String(s.xp || 0), "XP"],
      [String(AppState.getTotalStudyDays()), "学習日"],
    ].forEach(([v, l]) => {
      const box = el("div", "cb-stat");
      box.appendChild(el("div", "cb-stat-v", v));
      box.appendChild(el("div", "cb-stat-l", l));
      stats.appendChild(box);
    });
    card.appendChild(stats);
    card.appendChild(el("div", "cb-note", "これまでの記録はちゃんと残っています。連続記録は今日からまた1日目です。"));
    if (gems) card.appendChild(el("div", "cb-bonus", `🎁 おかえりボーナス 💎+${gems}`));

    const actions = el("div", "cb-actions");
    if (App.canWarmup()) {
      actions.appendChild(UI.button("primary-btn", "3分ウォームアップ(おさらい8問)", () => close(() => App.startWarmup())));
      const next = App.nextLesson();
      if (next) actions.appendChild(UI.button("secondary-btn", `続きから:${next.lesson.title}`, () => close(() => App.startLesson(next.lesson.id))));
    } else {
      const next = App.nextLesson();
      if (next) actions.appendChild(UI.button("primary-btn", `続きから:${next.lesson.title}`, () => close(() => App.startLesson(next.lesson.id))));
    }
    if (!AppState.getPref("reminderTime", "")) {
      actions.appendChild(UI.button("cb-link", "⏰ 毎日のリマインダーを設定する", () => close(() => reminder(onBack))));
    }
    actions.appendChild(UI.button("cb-link cb-link--muted", "あとで", () => close()));
    card.appendChild(actions);

    back.appendChild(card);
    document.body.appendChild(back);
    if (gems && typeof Motion !== "undefined") setTimeout(() => Motion.Sfx.coin(), 400);
  }

  // ---------- リマインダー(カレンダー登録) ----------
  const APP_NAME = "中国語の時間(3分)";

  function appUrl() {
    return location.href.split("#")[0].split("?")[0];
  }

  // 明日の指定時刻(ローカル)を "YYYYMMDDTHHMMSS" で返す
  function startStamp(hhmm, plusMin = 0) {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(h, m + plusMin, 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  }

  function buildIcs(hhmm) {
    const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const desc = `1レッスンだけでOK。アプリを開く: ${appUrl()}`;
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//zh-learning//reminder//JA",
      "BEGIN:VEVENT",
      `UID:zh-reminder-${Date.now()}@zh-learning`,
      `DTSTAMP:${now}`,
      `DTSTART:${startStamp(hhmm)}`,
      `DTEND:${startStamp(hhmm, 10)}`,
      "RRULE:FREQ=DAILY",
      `SUMMARY:🐼 ${APP_NAME}`,
      `DESCRIPTION:${desc}`,
      `URL:${appUrl()}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${APP_NAME}`,
      "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
  }

  function googleUrl(hhmm) {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tokyo");
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: `🐼 ${APP_NAME}`,
      details: `1レッスンだけでOK。アプリを開く: ${appUrl()}`,
      dates: `${startStamp(hhmm)}/${startStamp(hhmm, 10)}`,
      ctz: tz,
      recur: "RRULE:FREQ=DAILY",
    });
    return `https://calendar.google.com/calendar/render?${q.toString()}`;
  }

  function reminder(onBack) {
    const back = onBack || (() => App.go("home"));
    const screen = UI.screen("screen--sub");
    screen.appendChild(UI.subHeader("毎日のリマインダー", back));
    const body = el("div", "sub-body");

    const hero = el("div", "cb-rem-hero");
    hero.appendChild(el("div", "cb-rem-icon", "⏰"));
    hero.appendChild(el("div", "cb-rem-title", "決まった時間に、3分だけ"));
    hero.appendChild(
      el("div", "cb-rem-sub", "習慣になるまでは「時間を決めて通知してもらう」のがいちばん効きます。カレンダーに毎日の予定として登録すると、その時刻に通知が届きます。")
    );
    body.appendChild(hero);

    body.appendChild(el("div", "ui-section-title", "通知する時刻"));
    const presets = el("div", "cb-rem-presets");
    const time = el("input", "form-input cb-rem-time");
    time.type = "time";
    time.value = AppState.getPref("reminderTime", "") || "21:00";
    [
      ["朝 7:30", "07:30"],
      ["昼 12:30", "12:30"],
      ["夜 21:00", "21:00"],
      ["寝る前 23:00", "23:00"],
    ].forEach(([label, v]) => {
      presets.appendChild(
        UI.button("co-chip" + (time.value === v ? " is-on" : ""), label, (e) => {
          time.value = v;
          presets.querySelectorAll(".co-chip").forEach((c) => c.classList.remove("is-on"));
          e.currentTarget.classList.add("is-on");
        })
      );
    });
    body.appendChild(presets);
    body.appendChild(time);

    const saved = () => {
      AppState.setPref("reminderTime", time.value);
      UI.toast(`毎日 ${time.value} に登録します`);
    };

    body.appendChild(el("div", "ui-section-title", "カレンダーに登録"));
    body.appendChild(
      UI.button("primary-btn cb-rem-btn", "📅 iPhone / Mac のカレンダーに追加", () => {
        if (!time.value) return;
        saved();
        const blob = new Blob([buildIcs(time.value)], { type: "text/calendar;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "chinese-reminder.ics";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 1000);
      })
    );
    body.appendChild(
      UI.button("secondary-btn cb-rem-btn", "Googleカレンダーに追加", () => {
        if (!time.value) return;
        saved();
        window.open(googleUrl(time.value), "_blank", "noopener");
      })
    );
    body.appendChild(
      el(
        "p",
        "sub-note",
        "iPhoneでホーム画面から開いているときに追加画面が出ない場合は、Safariでこのアプリを開いてから押してください。登録した予定はカレンダーアプリからいつでも削除・時刻変更できます。"
      )
    );
    screen.appendChild(body);
  }

  return { startCard, maybeWelcome, reminder };
})();

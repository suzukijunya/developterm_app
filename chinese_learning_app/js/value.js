// 「中国語ができるとどう変わる?」— 年収・ビジネス面のメリットを数字と図で見せる画面。
// 数値は公開情報(出典は画面下部に表示)にもとづく目安で、個人の年収を保証するものではない。
const ChineseValue = (() => {
  const { el } = UI;

  // 出典つきの数値(2026年9月時点で確認)
  const FACTS = {
    allowance: { min: 12, max: 36 }, // 語学手当 月1〜3万円 → 年12〜36万円
    marketBand: { min: 400, max: 600 }, // 中国語を使う職業の年収ボリュームゾーン(万円)
    proBand: { min: 600, max: 1200 }, // ビジネスレベル中国語 × 専門性の求人(万円)
  };

  const SOURCES = [
    ["財務省貿易統計(日本貿易会 JFTCキッズサイトの解説)", "https://www.jftc.or.jp/kids/kids_news/japan/country/China.html"],
    ["帝国データバンク「日本企業の中国進出動向調査(2024年)」", "https://www.tdb.co.jp/report/economic/vgnx1vn1er/"],
    ["JNTO 訪日外客数(2025年)", "https://www.jnto.go.jp/statistics/data/visitors-statistics/"],
    ["訪日ラボ「2025年の訪日中国人数・消費額」", "https://honichi.com/news/2026/02/13/inbound-china-2025/"],
    ["Ethnologue「What is the most spoken language?」", "https://www.ethnologue.com/insights/most-spoken-language/"],
    ["平均年収.jp「中国語を使う職業の年収」", "https://heikinnenshu.jp/column/shinchugokugoshokugyo.html"],
    ["doda「中国語 ビジネスレベルの求人」", "https://doda.jp/keyword/%E4%B8%AD%E5%9B%BD%E8%AA%9E%E3%80%80%E3%83%93%E3%82%B8%E3%83%8D%E3%82%B9%E3%83%AC%E3%83%99%E3%83%AB/"],
    ["マイナビ転職グローバル「中国語を使う仕事 年収1000万円以上」", "https://tenshoku.mynavi.jp/global/list/f605/min1000/"],
    ["CCレッスン「HSK6級で年収1000万を狙う」(語学手当 月1〜3万円の例)", "https://www.cclesson.com/blog/archives/4556"],
  ];

  function fmtMan(n) {
    return `${Math.round(n).toLocaleString()}万円`;
  }

  // ---------- ホームに置く小さなカード ----------
  function teaser(onOpen) {
    const card = UI.button("cv-teaser", "", onOpen);
    card.appendChild(el("div", "cv-teaser-icon", "💰"));
    const mid = el("div", "cv-teaser-mid");
    mid.appendChild(el("div", "cv-teaser-title", "中国語ができると、年収はどう変わる?"));
    mid.appendChild(el("div", "cv-teaser-sub", `中国語×専門職の求人は年収${FACTS.proBand.min}〜${FACTS.proBand.max.toLocaleString()}万円`));
    card.appendChild(mid);
    card.appendChild(el("div", "cv-teaser-arrow", "›"));
    return card;
  }

  // ---------- 年収シミュレーター(横棒の範囲グラフ) ----------
  function salaryChart(income) {
    const rows = [
      { label: "今の年収", sub: "あなたの入力", min: income, max: income, kind: "base" },
      {
        label: "+ 語学手当",
        sub: "手当が付いた場合(月1〜3万円)",
        min: income + FACTS.allowance.min,
        max: income + FACTS.allowance.max,
        kind: "up",
      },
      {
        label: "中国語を使う職業",
        sub: "年収のボリュームゾーン",
        min: FACTS.marketBand.min,
        max: FACTS.marketBand.max,
        kind: "band",
      },
      {
        label: "中国語×専門性",
        sub: "ビジネスレベル+営業・管理・技術など",
        min: FACTS.proBand.min,
        max: FACTS.proBand.max,
        kind: "pro",
      },
    ];
    const top = Math.max(1300, income * 1.25);
    const scale = (v) => `${Math.min(100, (v / top) * 100)}%`;

    const chart = el("div", "cv-chart");
    const detail = el("div", "cv-chart-detail", "バーをタップすると詳しい数字が出ます");
    rows.forEach((r) => {
      const row = UI.button(`cv-row cv-row--${r.kind}`, "", () => {
        chart.querySelectorAll(".cv-row").forEach((x) => x.classList.toggle("is-sel", x === row));
        const range = r.min === r.max ? fmtMan(r.min) : `${fmtMan(r.min)} 〜 ${fmtMan(r.max)}`;
        const diff = r.kind === "base" ? "" : r.max > income ? `(今より最大 +${fmtMan(r.max - income)})` : "(今の年収と同程度)";
        detail.textContent = `${r.label}: ${range} ${diff}`;
      });
      const label = el("div", "cv-row-label");
      label.appendChild(el("div", "cv-row-title", r.label));
      label.appendChild(el("div", "cv-row-sub", r.sub));
      row.appendChild(label);
      const track = el("div", "cv-row-track");
      // 目盛り(薄い縦線)
      [250, 500, 750, 1000, 1250].forEach((v) => {
        if (v > top) return;
        const tick = el("span", "cv-tick");
        tick.style.left = scale(v);
        track.appendChild(tick);
      });
      const bar = el("span", "cv-bar");
      if (r.min === r.max) {
        bar.classList.add("cv-bar--point");
        bar.style.left = `calc(${scale(r.min)} - 6px)`;
      } else {
        bar.style.left = scale(r.min);
        bar.style.width = `calc(${scale(r.max)} - ${scale(r.min)})`;
      }
      track.appendChild(bar);
      row.appendChild(track);
      row.appendChild(el("div", "cv-row-value", r.min === r.max ? fmtMan(r.min) : `${r.min.toLocaleString()}〜${fmtMan(r.max)}`));
      chart.appendChild(row);
    });
    const axis = el("div", "cv-axis");
    axis.appendChild(el("span", "", "0"));
    [500, 1000].forEach((v) => {
      if (v > top) return;
      const t = el("span", "cv-axis-tick", `${v.toLocaleString()}万`);
      t.style.left = scale(v);
      axis.appendChild(t);
    });
    chart.appendChild(axis);
    chart.appendChild(detail);
    return chart;
  }

  // ---------- 画面 ----------
  function screen(onBack) {
    const s = UI.screen("screen--sub screen--value");
    s.appendChild(UI.subHeader("中国語の価値", onBack || (() => App.go("home"))));
    const body = el("div", "sub-body");

    const hero = el("div", "cv-hero");
    hero.appendChild(el("div", "cv-hero-kicker", "中国語 × ビジネス"));
    hero.appendChild(el("div", "cv-hero-title", "話せるようになると、何が変わる?"));
    hero.appendChild(el("div", "cv-hero-sub", "公開データで見る、年収とビジネスのチャンス"));
    body.appendChild(hero);

    // 1) 年収
    body.appendChild(el("div", "ui-section-title", "💰 年収はどう変わる?"));
    const incomeRow = el("label", "cv-income");
    incomeRow.appendChild(el("span", "", "今の年収"));
    const input = el("input", "cv-income-input");
    input.type = "number";
    input.inputMode = "numeric";
    input.min = "0";
    input.max = "5000";
    input.step = "10";
    input.value = String(AppState.getPref("incomeMan", 500));
    incomeRow.appendChild(input);
    incomeRow.appendChild(el("span", "", "万円"));
    body.appendChild(incomeRow);
    const chartBox = el("div");
    body.appendChild(chartBox);
    const draw = () => {
      const v = Math.max(0, Math.min(5000, Number(input.value) || 0));
      AppState.setPref("incomeMan", v);
      UI.clear(chartBox);
      chartBox.appendChild(salaryChart(v));
    };
    input.addEventListener("input", draw);
    draw();
    body.appendChild(
      el(
        "p",
        "sub-note",
        "※ 求人サイト・記事の公開情報にもとづく目安です。年収を決めるのは語学力だけではなく、「中国語+営業・管理・技術・法務・会計」のような掛け合わせの経験が大きく影響します。"
      )
    );

    // 2) あなたの現在地 → ビジネスレベルまで
    body.appendChild(el("div", "ui-section-title", "📍 ビジネスレベルまで、あと少し"));
    body.appendChild(progressCard());

    // 3) ビジネスのチャンス(数字のタイル)
    body.appendChild(el("div", "ui-section-title", "🌏 数字で見るビジネスのチャンス"));
    const tiles = el("div", "cv-tiles");
    [
      { big: "No.1", unit: "", label: "中国は日本の最大の貿易相手国", note: "2024年 貿易総額 約44兆円" },
      { big: "13,034", unit: "社", label: "中国に進出している日本企業", note: "2024年6月時点" },
      { big: "2兆", unit: "円", label: "訪日中国人の旅行消費額(国別1位)", note: "2025年 909.6万人が来日" },
      { big: "12", unit: "億人", label: "中国語(普通話)を話す人", note: "母語話者は9.4億人で世界最多" },
    ].forEach((t) => {
      const tile = el("div", "cv-tile");
      const big = el("div", "cv-tile-big", t.big);
      if (t.unit) big.appendChild(el("span", "cv-tile-unit", t.unit));
      tile.appendChild(big);
      tile.appendChild(el("div", "cv-tile-label", t.label));
      tile.appendChild(el("div", "cv-tile-note", t.note));
      tiles.appendChild(tile);
    });
    body.appendChild(tiles);

    // 貿易に占める中国の割合(1本の割合バー)
    const share = el("div", "cv-share");
    share.appendChild(el("div", "cv-share-title", "日本の貿易総額に占める中国の割合(2024年)"));
    const bar = el("div", "cv-share-bar");
    const cn = el("span", "cv-share-cn");
    cn.style.width = "20%";
    const rest = el("span", "cv-share-rest");
    bar.append(cn, rest);
    share.appendChild(bar);
    const legend = el("div", "cv-share-legend");
    legend.appendChild(el("span", "cv-share-key cv-share-key--cn", "中国 20%"));
    legend.appendChild(el("span", "cv-share-key", "その他の国・地域 80%"));
    share.appendChild(legend);
    share.appendChild(el("div", "cv-share-note", "輸出の18%・輸入の23%が中国。日本の貿易の5回に1回は中国が相手です。"));
    body.appendChild(share);

    // 4) 通訳コストの試算
    body.appendChild(el("div", "ui-section-title", "🤝 自分で話せると、いくら浮く?"));
    body.appendChild(interpreterCalc());

    // 5) 話せると広がる仕事
    body.appendChild(el("div", "ui-section-title", "💼 中国語が武器になる仕事"));
    [
      ["🚢", "貿易・海外営業", "仕入れ先・取引先と直接交渉。価格や納期の話を通訳なしで進められる"],
      ["🏭", "工場・品質管理", "現地工場への指示・不良対応。現場の信頼が段違いに"],
      ["🛍️", "インバウンド・EC", "訪日中国人向けの接客・マーケティング・越境EC"],
      ["⚖️", "法務・会計・通関", "契約書・発票・税関とのやりとり。専門性との掛け算で希少人材に"],
      ["💻", "IT・ブリッジSE", "中国の開発チームとの橋渡し。要件定義から運用まで"],
    ].forEach(([icon, title, desc]) => {
      const row = el("div", "cv-job");
      row.appendChild(el("div", "cv-job-icon", icon));
      const mid = el("div", "cv-job-mid");
      mid.appendChild(el("div", "cv-job-title", title));
      mid.appendChild(el("div", "cv-job-desc", desc));
      row.appendChild(mid);
      body.appendChild(row);
    });

    // 出典
    body.appendChild(el("div", "ui-section-title", "出典"));
    const list = el("ul", "cv-sources");
    SOURCES.forEach(([name, url]) => {
      const li = el("li");
      const a = el("a", null, name);
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      li.appendChild(a);
      list.appendChild(li);
    });
    body.appendChild(list);
    body.appendChild(
      el("p", "sub-note", "数値は2026年9月時点で確認した公開情報です。年収は個人の経験・職種・地域によって大きく異なり、このアプリが年収アップを保証するものではありません。")
    );
    s.appendChild(body);
  }

  // アプリ内の進み具合と「ビジネスレベル(HSK5相当)」までの距離
  function progressCard() {
    const card = el("div", "cv-progress");
    const current = App.getCurrentLevel();
    const target = LEVELS.find((l) => /HSK5相当/.test(l.hskLabel)) || LEVELS[LEVELS.length - 1];
    const targetIdx = LEVELS.indexOf(target);
    const lessonsToTarget = LEVELS.slice(0, targetIdx + 1)
      .flatMap((lv) => lv.unitIds)
      .flatMap((uid) => (UNITS.find((u) => u.id === uid) || { lessons: [] }).lessons);
    const done = lessonsToTarget.filter((l) => AppState.isLessonCompleted(l.id)).length;
    const ratio = lessonsToTarget.length ? done / lessonsToTarget.length : 0;
    card.appendChild(el("div", "cv-progress-now", `今: ${current.label}(${current.hskLabel})`));
    const bar = el("div", "cv-progress-bar");
    const fill = el("div", "cv-progress-fill");
    fill.style.width = `${ratio * 100}%`;
    bar.appendChild(fill);
    const flag = el("span", "cv-progress-flag", "🏁");
    bar.appendChild(flag);
    card.appendChild(bar);
    card.appendChild(
      el(
        "div",
        "cv-progress-text",
        done >= lessonsToTarget.length
          ? `${target.label}(${target.hskLabel})のレッスンを修了!ビジネスレベルの求人の土台ができています`
          : `${target.label}(${target.hskLabel})まで あと${lessonsToTarget.length - done}レッスン`
      )
    );
    card.appendChild(
      el("div", "cv-progress-note", "ビジネスレベルの中国語を求める求人では、HSK5級以上を目安にしているものが多く見られます。")
    );
    card.appendChild(UI.button("primary-btn cv-progress-btn", "次のレッスンへ", () => App.go("home")));
    return card;
  }

  // 通訳を頼む日数 × 1日の費用 = 自分で話せたら浮くお金
  function interpreterCalc() {
    const box = el("div", "cv-calc");
    const days = numberField("通訳が必要な日(1か月)", "interpDays", 2, "日");
    const fee = numberField("通訳1日あたりの費用", "interpFee", 5, "万円");
    box.appendChild(days.row);
    box.appendChild(fee.row);
    const result = el("div", "cv-calc-result");
    box.appendChild(result);
    box.appendChild(el("div", "cv-calc-note", "※ 費用は仮の値です。見積もりに合わせて変えてください。移動や日程調整の手間、伝言ゲームによる行き違いも減らせます。"));
    const update = () => {
      const yearly = days.value() * fee.value() * 12;
      UI.clear(result);
      result.appendChild(el("div", "cv-calc-label", "1年で浮く通訳費"));
      result.appendChild(el("div", "cv-calc-big", fmtMan(yearly)));
    };
    days.input.addEventListener("input", update);
    fee.input.addEventListener("input", update);
    update();
    return box;
  }

  function numberField(label, key, fallback, unit) {
    const row = el("label", "cv-field");
    row.appendChild(el("span", "cv-field-label", label));
    const input = el("input", "cv-field-input");
    input.type = "number";
    input.inputMode = "decimal";
    input.min = "0";
    input.step = "0.5";
    input.value = String(AppState.getPref(key, fallback));
    row.appendChild(input);
    row.appendChild(el("span", "cv-field-unit", unit));
    const value = () => {
      const v = Math.max(0, Number(input.value) || 0);
      AppState.setPref(key, v);
      return v;
    };
    return { row, input, value };
  }

  return { screen, teaser };
})();

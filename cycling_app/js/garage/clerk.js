// 店員さん(メカニック): 予算と目的を聞いて、カタログから替えるパーツの順番を決める。
// 今のバイク・体・走った距離を見て、毎日ひとことコメントする。ルールで動く(通信なし・無料)。

const Clerk = (() => {
  const GOALS = [
    { id: "light", label: "軽くしたい(登り・加速)" },
    { id: "speed", label: "速く走りたい(転がり・踏み心地)" },
    { id: "comfort", label: "腰・体を楽にしたい" },
    { id: "commute", label: "通勤で扱いやすく・パンクしにくく" },
  ];
  const BUDGETS = [10000, 30000, 50000, 100000, 200000];

  // 整備の目安(km または 日)
  // 整備の目安(km または 日)。lv: 自分でやる難しさ(1〜3) / fee: お店の工賃の目安(円) / tools: 要る工具 / q: 手順を探す言葉
  const MAINT = [
    { id: "pressure", label: "タイヤの空気圧", days: 7, lv: 1, fee: 0, tools: ["pump"], q: "ロードバイク 空気圧 フロアポンプ 仏式", how: "ロードは1週間で1割ほど抜けます。乗る前に指定の空気圧まで入れましょう" },
    { id: "lube", label: "チェーンの掃除・注油", km: 300, lv: 1, fee: 1000, tools: ["clean"], q: "ロードバイク チェーン 掃除 注油", how: "汚れを拭いてから、1コマずつ油をさして余分を拭き取ります。雨の日のあとは早めに" },
    { id: "bolts", label: "ボルトの締め直し(トルク)", km: 1000, lv: 1, fee: 1000, tools: ["hex", "torque"], q: "ロードバイク トルクレンチ 締め付けトルク", how: "ステム・ハンドル・シートポスト・サドルを、書いてある強さで締め直します。カーボンは締めすぎ厳禁" },
    { id: "brake", label: "ブレーキシューの点検・交換", km: 1000, lv: 1, fee: 1500, tools: ["hex"], q: "Vブレーキ シュー交換 調整 トーイン", how: "溝が浅くなっていたり、金属片が刺さっていたら交換。リムに平行に、前を少しだけ先に当てます。最後にレバーを握って放し、左右のアームが同じ速さで戻るか確認(戻らない側は、根元のバネの端がフレームの台座の穴に入っていない)" },
    { id: "tires", label: "タイヤ・チューブの点検・交換", km: 2000, lv: 1, fee: 2000, tools: ["lever", "pump"], q: "ロードバイク タイヤ交換 クリンチャー タイヤレバー", how: "後輪が先に減ります。平らになってきた・ひび割れがあれば交換" },
    { id: "shift", label: "変速の調整", km: 1500, lv: 2, fee: 1500, tools: ["hex", "stand"], q: "RD-5701 調整 ワイヤー 張り アジャスター", how: "音鳴り・飛びは、まずワイヤーの張り(アジャスター)を半回転ずつ。上下の止めボルトは基本さわらない。いちばん軽いギアで、変速機とスポークのすき間も見る(ハンガーが少し曲がっているため)" },
    { id: "hanger", label: "ディレイラーハンガーの曲がり(様子見)", days: 30, lv: 1, fee: 0, tools: ["hex"], q: "ディレイラーハンガー 交換 曲がり 確認", how: "2026-11 に少し曲がっていると言われ、今のまま。いちばん軽いギアで変速機がスポークに近すぎないか、後ろから見て変速機が傾いていないかを月1回見る。変速がまた狂ったら交換(GIANT Escape R3用 約¥2,000〜3,000・5mm六角で10分)。C24に替えるときに一緒に替えると工賃が二重にならない" },
    { id: "chain", label: "チェーンの伸びの点検・交換", km: 3000, lv: 2, fee: 1500, tools: ["checker", "cutter"], q: "シマノ 10速 チェーン交換 ミッシングリンク", how: "チェッカーで0.5%を超えたら交換。放っておくとスプロケットも削れます" },
    { id: "cassette", label: "スプロケットのガタ・取り付け", km: 3000, lv: 2, fee: 1500, tools: ["sprocket", "torque"], q: "スプロケット 取り付け スペーサー 順番 ロックリング トルク", how: "手で歯をゆすってガタがないか見る。外すときは外した順に並べて置き、歯の間の薄いスペーサーも同じ順で戻す。ロックリングは約40N·m。11速用のホイール(C24など)に10速のスプロケットを付けるときは、奥に1.85mmのスペーサーが必須(2026-11、スペーサーの抜け・入れ違いでスプロケットが斜めになっていた)" },
    { id: "cable", label: "ブレーキ・変速のワイヤー交換", days: 365, lv: 2, fee: 6000, tools: ["wirecut", "hex", "stand"], q: "ロードバイク ワイヤー交換 STI 5700", how: "1年ごとが目安。引きが重い・戻りが悪いなら交換。外のケーブル(アウター)も一緒に替えると軽くなる。外す前に通り道を写真に撮る(後ろの変速機の手前は、フレームの外側を通す)。アウターの両端には必ずキャップを付ける(STIのところのキャップがなくて、変速が戻らなくなっていた)" },
    { id: "tape", label: "バーテープの巻き直し", days: 365, lv: 2, fee: 2000, tools: [], q: "バーテープ 巻き方 ロードバイク", how: "下から上へ、半分ずつ重ねて引っぱりながら巻きます。STIの裏は8の字で" },
  ];

  const totalKm = (rides) => (rides || []).reduce((a, r) => a + (r.distance || 0), 0) / 1000;

  // 整備: 前回からの距離・日数で、やる時期のものを返す
  function maintenance(rides, maint, now = Date.now()) {
    const km = totalKm(rides);
    return MAINT.map((m) => {
      const last = (maint && maint[m.id]) || null;
      const sinceKm = last ? km - (last.km || 0) : km;
      const sinceDays = last ? (now - last.at) / 86400000 : Infinity;
      const due = m.km ? sinceKm >= m.km : sinceDays >= m.days;
      const ratio = m.km ? sinceKm / m.km : last ? sinceDays / m.days : 1;
      return Object.assign({}, m, { sinceKm, sinceDays, due, ratio, never: !last });
    });
  }

  // 目的に対する効き目(大きいほどよい)
  function value(item, build, h, body) {
    const goals = new Set(h.goals || []);
    if (body && body.backPain) goals.add("comfort");
    const sc = item.score || {};
    let v = 0;
    for (const gId of goals) v += (sc[gId] || 0) * (gId === "comfort" && body && body.backPain ? 1.5 : 1);
    const save = Catalog.saving(build, item);
    if (goals.has("light")) v += save / 120;
    else v += save / 400;
    // 腰が痛いのに細いタイヤにするのは勧めない
    if (item.slot === "tires" && body && body.backPain && item.attrs && item.attrs.width < 28) v -= 2;
    // 今より重くなるのに、ほかの効き目もないもの
    if (item.kind === "swap" && save <= 0 && v < 2) v = 0;
    return v;
  }

  // 替えられないもの
  function blocked(item, build) {
    const p = build.parts[item.slot];
    if (Catalog.installed(build, item)) return "付いています";
    if (item.slot === "tubes" && build.parts.tires && /チューブレス|tubeless/i.test(build.parts.tires.name || "")) return "チューブレスなので不要";
    if (item.kind === "swap" && p && p.mounted !== false && (+p.g || 0) <= item.g && !(item.score && (item.score.comfort || item.score.commute))) return "今のほうが軽い";
    return "";
  }

  // 部位ごとのまとまり(クランクなど一部だけ替えるものは、それぞれ別)
  const keyOf = (item) => item.slot + (item.kind === "delta" ? ":" + item.id : "");

  // 予算の中で、効き目÷値段のよい順に、部位ごとに1つずつ選ぶ。
  // h.choices = { 部位: カタログのid(これにする) / "none"(この部位は替えない) } で、選んだものを固定して残りを選び直す
  function plan(build, h, body) {
    const usedOk = h.usedOk !== false;
    const budget = h.budget || 30000;
    const choices = h.choices || {};
    const mk = (item) => {
      const v = value(item, build, h, body);
      const c = Catalog.cost(item, usedOk);
      return { item, value: v, cost: c, eff: v / Math.max(1, c / 10000), saving: Catalog.saving(build, item), key: keyOf(item) };
    };
    const cands = [];
    const all = {}; // 部位ごとの候補(付いていないもの全部。効き目の順)
    for (const item of Catalog.ITEMS) {
      if (blocked(item, build)) continue;
      const c = mk(item);
      (all[c.key] = all[c.key] || []).push(c);
      if (c.value > 0.3) cands.push(c);
    }
    for (const k of Object.keys(all)) all[k].sort((a, b) => b.value - a.value || a.cost - b.cost);
    // 自分で選んだもの(固定)
    const pinned = [];
    for (const [k, id] of Object.entries(choices)) {
      if (id === "none") continue;
      const c = (all[k] || []).find((x) => x.item.id === id);
      if (c) pinned.push(Object.assign(c, { pinned: true }));
    }
    const fixed = new Set(Object.keys(choices));
    // 部位ごとに一番よいもの(ホイールなどは、予算に合う中で効き目が大きいもの)
    const best = {};
    for (const c of cands.sort((a, b) => b.value - a.value)) {
      if (c.cost > budget || fixed.has(c.key)) continue;
      if (!best[c.key] || c.eff > best[c.key].eff * 1.4) best[c.key] = c;
    }
    const list = Object.values(best).sort((a, b) => b.eff - a.eff);
    const picked = pinned.slice();
    let left = budget - pinned.reduce((a, c) => a + c.cost, 0);
    for (const c of list) {
      if (c.cost <= left) {
        picked.push(c);
        left -= c.cost;
      }
    }
    // 予算が余らないもの(次に買うとよいもの)
    const later = list.filter((c) => !picked.includes(c)).slice(0, 3);
    // 替えないことにした部位・おすすめに入らなかった部位(あとから加えられる)
    const inPlan = new Set(picked.map((c) => c.key));
    const others = Object.keys(all)
      .filter((k) => !inPlan.has(k))
      .map((k) => ({ key: k, slot: all[k][0].item.slot, skipped: choices[k] === "none", best: all[k][0] }));
    const total = picked.reduce((a, c) => a + c.cost, 0);
    return {
      items: picked.map((c) => Object.assign(c, { reason: reason(c, body), alts: all[c.key] || [c] })),
      later: later.map((c) => Object.assign(c, { reason: reason(c, body) })),
      others: others.map((o) => Object.assign(o, { reason: reason(o.best, body) })),
      total,
      over: Math.max(0, total - budget),
      saved: picked.reduce((a, c) => a + c.saving, 0),
      budget,
      usedOk,
    };
  }

  // コスパ順のアップグレード: 1円あたりで軽くなる重さの大きい順に、部位ごとに1つずつ付けていく。
  // 軽くなるものが尽きたら、総合点の上がり方÷値段の順に(乗り心地・丈夫さなど)。
  // scoreOf(build) → { total, rank, kg }。累計の値段と、付けたあとの総合点・ランクを返す
  function ladder(build, usedOk, scoreOf) {
    const sim = JSON.parse(JSON.stringify(build));
    const used = new Set();
    const start = scoreOf(sim);
    const steps = [];
    let now = start;
    let cum = 0;
    const take = (best, phase) => {
      Catalog.apply(sim, best.item);
      used.add(best.key);
      cum += best.cost;
      const after = scoreOf(sim);
      steps.push({ item: best.item, key: best.key, cost: best.cost, save: best.save, gpk: (best.save / best.cost) * 1000, cum, after, gain: after.total - now.total, rankUp: after.rank !== now.rank, phase });
      now = after;
    };
    for (let n = 0; n < 30; n++) {
      let best = null;
      for (const item of Catalog.ITEMS) {
        const key = keyOf(item);
        if (used.has(key) || blocked(item, sim)) continue;
        const save = Catalog.saving(sim, item);
        if (save <= 0) continue;
        const cost = Catalog.cost(item, usedOk);
        if (best && save / cost <= best.save / best.cost) continue;
        // 軽くなっても総合点が下がるもの(細いタイヤで乗り心地が落ちるなど)は入れない
        const trial = JSON.parse(JSON.stringify(sim));
        Catalog.apply(trial, item);
        if (scoreOf(trial).total < now.total) continue;
        best = { item, key, save, cost };
      }
      if (!best) break;
      take(best, "light");
    }
    for (let n = 0; n < 30; n++) {
      let best = null;
      for (const item of Catalog.ITEMS) {
        const key = keyOf(item);
        if (used.has(key) || blocked(item, sim)) continue;
        const trial = JSON.parse(JSON.stringify(sim));
        Catalog.apply(trial, item);
        const gain = scoreOf(trial).total - now.total;
        if (gain <= 0) continue;
        const cost = Catalog.cost(item, usedOk);
        if (!best || gain / cost > best.gain / best.cost) best = { item, key, save: Catalog.saving(sim, item), cost, gain };
      }
      if (!best) break;
      take(best, "score");
    }
    const sAt = steps.findIndex((x) => x.after.rank === "S");
    return { start, steps, sAt, sCost: start.rank === "S" ? 0 : sAt >= 0 ? steps[sAt].cum : null, top: steps.length ? steps[steps.length - 1].after : start };
  }

  function reason(c, body) {
    const out = [];
    if (c.saving > 0) out.push(`−${c.saving}g`);
    const sc = c.item.score || {};
    if (sc.comfort >= 2) out.push(body && body.backPain ? "腰が楽に" : "乗り心地がよくなる");
    if (sc.speed >= 2) out.push("よく進む");
    if (sc.commute >= 2) out.push("通勤向き");
    return out.join("・");
  }

  // ---------- 買いどきメモ(お店のセール) ----------
  // 日付は「このあたり」の目安。お店の案内が出たら直す。
  const SALES = [
    { id: "tokino-bf-2027", shop: "トキノさん", label: "ブラックフライデーセール", from: "2027-11-01", to: "2027-11-30", peak: "2027-11-26",
      off: 30, what: "店に展示している商品", note: "2026年11月にお店で聞いた話。日にちと対象は、2027年の秋にお店で確かめる" },
  ];
  // 今日から見た状態。st: far=まだ先 / soon=60日前から / now=期間中 / past=終わった
  function sales(now = Date.now()) {
    const t = (s) => new Date(s + "T00:00:00").getTime();
    return SALES.map((s) => {
      const a = t(s.from), b = t(s.to) + 86400000;
      const days = Math.ceil((a - now) / 86400000);
      return Object.assign({}, s, { days, st: now >= b ? "past" : now >= a ? "now" : days <= 60 ? "soon" : "far" });
    });
  }

  // ---------- 毎日のひとこと ----------
  // ctx: { current, next, body, rides, maint, plan, torso, bikeKg, nextKg, now }
  function comments(ctx) {
    const now = ctx.now || Date.now();
    const d = new Date(now);
    const out = []; // { pri(大きいほど先), text }
    const day = Math.floor((now - d.getTimezoneOffset() * 60000) / 86400000);

    // 整備
    const ms = maintenance(ctx.rides, ctx.maint, now);
    for (const m of ms.filter((x) => x.due && ((x.lv || 1) >= 2 || x.id === "hanger")).sort((a, b) => b.ratio - a.ratio)) {
      const when = m.never ? "まだ記録がありません" : m.km ? `前回から${Math.round(m.sinceKm)}km走りました` : `前回から${Math.floor(m.sinceDays)}日たちました`;
      out.push({ pri: 70 + Math.min(20, m.ratio * 5), text: `🔧 ${m.label}の時期です(${when})。${m.how}` });
      if (out.length > 1) break;
    }

    // 最近のライド
    const rides = ctx.rides || [];
    const last = rides[0];
    if (last && now - (last.endedAt || last.startedAt) < 36 * 3600000) {
      const km = (last.distance / 1000).toFixed(1);
      const kcal = Math.round((last.kcalExercise || 0) + (last.kcalBasal || 0));
      out.push({ pri: 60, text: `🚴 ${now - last.startedAt < 12 * 3600000 ? "さっき" : "昨日"}は${km}km${kcal ? `・${kcal}kcal` : ""}、おつかれさまでした。${last.maxSpeed ? `最高${Math.round(last.maxSpeed * 3.6)}km/h。` : ""}` });
    }
    const week = rides.filter((r) => now - r.startedAt < 7 * 86400000);
    if (week.length >= 3) out.push({ pri: 40, text: `📈 この1週間で${week.length}回・${Math.round(week.reduce((a, r) => a + r.distance, 0) / 1000)}km。いいペースです` });

    // 腰
    if (ctx.body && ctx.body.backPain && ctx.torso != null) {
      if (ctx.torso < 44)
        out.push({ pri: 65, text: `🩺 上体の角度が${Math.round(ctx.torso)}°と低めで、腰に負担がかかりやすい姿勢です。「フィッティング」の「腰が楽」で、ハンドルを上げる・近づける案を出せます${ctx.integrated ? "(一体型ハンドルなので、コラムスペーサーで高さを変えます)" : ""}` });
      else out.push({ pri: 30, text: `🩺 上体の角度は${Math.round(ctx.torso)}°。腰にやさしい範囲です。体幹(お腹と背中)で上体を支えると、さらに楽になります` });
    }

    // 次に替えるパーツ
    const nxt = ctx.plan && ctx.plan.items && ctx.plan.items.find((c) => !Catalog.installed(ctx.current, c.item));
    if (nxt) {
      out.push({ pri: 50, text: `🛒 次のおすすめは「${nxt.item.name}」。${nxt.item.used && ctx.plan.usedOk ? `中古なら${Catalog.yen(nxt.item.used[0])}〜くらいで` : `${Catalog.yen(nxt.item.price)}くらいで`}${nxt.saving > 0 ? `${nxt.saving}g軽く` : nxt.reason}なります` });
    } else if (!ctx.plan) {
      out.push({ pri: 55, text: "🙋 予算と、どうなりたいかを教えてもらえれば、替えるパーツの順番を考えます。私をタップしてください" });
    }

    // 重さ
    if (ctx.bikeKg && ctx.nextKg && ctx.nextKg < ctx.bikeKg - 0.05)
      out.push({ pri: 35, text: `⚖️ 今のバイクは${ctx.bikeKg.toFixed(2)}kg。NEWの構成なら${ctx.nextKg.toFixed(2)}kg(−${Math.round((ctx.bikeKg - ctx.nextKg) * 1000)}g)です` });

    // セール
    for (const s of sales(now)) {
      if (s.st === "now") out.push({ pri: 95, text: `🏷 ${s.shop}の${s.label}の時期です。${s.what}が${s.off}%オフ。狙っているパーツの展示があるか、お店で見てみましょう` });
      else if (s.st === "soon") out.push({ pri: 92, text: `🏷 あと${s.days}日くらいで${s.shop}の${s.label}(${s.what}が${s.off}%オフ)。欲しいパーツを決めて、日にちをお店で確かめておきましょう` });
    }

    // 季節
    const mo = d.getMonth() + 1;
    if (mo >= 10 || mo <= 2) out.push({ pri: 20, text: "🔦 日が短い季節です。帰りが暗くなる日は、前後のライトの充電を確かめておきましょう" });
    if (mo >= 6 && mo <= 8) out.push({ pri: 20, text: "💧 暑い日は1時間にボトル1本が目安。通勤でも、走る前に一口飲んでおくと楽です" });
    if (mo === 6) out.push({ pri: 22, text: "☔ 雨のあとはチェーンの油が流れます。拭いて注油すると、変速と音が変わります" });
    const tips = [
      "💡 タイヤの空気圧は、体重とタイヤ幅で変わります。28Cなら少し下げると腰が楽で、転がりもほとんど落ちません",
      "💡 信号で止まる前に軽いギアに落としておくと、こぎ出しが楽で膝にもやさしいです",
      "💡 ハンドルは強く握らず、手のひらを乗せるくらいで。肩の力が抜けると首・腰も楽になります",
      "💡 クイックリリースのレバーは、走る前に締まっているか手で確かめましょう",
    ];
    out.push({ pri: 10, text: tips[day % tips.length] });

    // 同じ優先度なら日替わり
    return out.sort((a, b) => b.pri - a.pri || ((a.text.length + day) % 3) - ((b.text.length + day) % 3)).map((x) => x.text);
  }

  return { GOALS, BUDGETS, MAINT, keyOf, plan, ladder, maintenance, comments, blocked, totalKm, sales };
})();

if (typeof module !== "undefined") module.exports = Clerk;

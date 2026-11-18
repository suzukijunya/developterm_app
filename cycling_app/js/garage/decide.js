// リムブレーキのまま仕上げるか、ディスクブレーキに乗り換えるか、の損得をお金で比べる。
// 3つのプランを、「その年に全部売ったら、いくら減っているか」(正味コスト)で年ごとに並べる。
//   A: リムのまま(R3にNEWのパーツを付けて乗り続ける)
//   B: 今ディスクへ(R3を売って、中古のディスクロードを買う)
//   C: リムで仕上げて、X年後にディスクへ(付けたリムのパーツとR3を、その年の相場で売る)
// 値段の下がり方などは目安。画面で変えられ、この端末に保存する。

const Decide = (() => {
  const KEY = "cycling_decide";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const yen = (n) => (n < 0 ? "−" : "") + "¥" + Math.round(Math.abs(n)).toLocaleString();
  const man = (n) => (n < 0 ? "−" : "") + (Math.abs(n) / 10000).toFixed(1) + "万";
  // 入力の項目: [キー, 表示, 単位, 最小, 最大, 刻み]
  const FIELDS = [
    ["years", "乗る年数", "年", 2, 10, 1],
    ["switchAt", "Cで乗り換える時期", "年後", 1, 6, 1],
    ["rimUp", "Aのパーツ代(NEWの中古の想定)", "円", 0, 400000, 1000],
    ["discPrice", "ディスクロード(中古)の値段", "円", 100000, 1500000, 10000],
    ["r3Now", "いまのR3を売った値段", "円", 0, 100000, 1000],
    ["rimDecay", "リムのパーツの相場の下がり方", "%/年", 0, 50, 1],
    ["discDecay", "ディスクロードの相場の下がり方", "%/年", 0, 40, 1],
    ["market", "同じ中古ディスクロードの値下がり", "%/年", 0, 25, 1],
    ["mRim", "整備代(リム)", "円/年", 0, 60000, 1000],
    ["mDisc", "整備代(ディスク)", "円/年", 0, 60000, 1000],
  ];
  const DEF = { years: 6, switchAt: 2, rimDecay: 20, discDecay: 10, market: 7, r3Now: 25000, mRim: 8000, mDisc: 14000, r3Decay: 15, rimResale: 60, discResale: 85 };

  function load(ctx) {
    let v = {};
    try {
      v = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {}
    return Object.assign({}, DEF, { rimUp: ctx.rimUp, discPrice: ctx.discPrice }, v);
  }
  function save(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {}
  }

  // 年ごとの正味コスト(払ったお金 − 受け取ったお金 − その時点で持っている物の売値 + 最初に持っていたR3の売値)
  function model(p) {
    const r = (pct) => 1 - pct / 100;
    const r3 = (t) => p.r3Now * Math.pow(r(p.r3Decay), t);
    const rimParts = (t) => p.rimUp * (p.rimResale / 100) * Math.pow(r(p.rimDecay), t);
    const disc = (price, t) => price * (p.discResale / 100) * Math.pow(r(p.discDecay), t);
    const X = Math.min(p.switchAt, p.years);
    const PX = p.discPrice * Math.pow(r(p.market), X);
    const A = [], B = [], C = [];
    for (let t = 0; t <= p.years; t++) {
      A.push(p.rimUp + p.mRim * t - (r3(t) + rimParts(t)) + p.r3Now);
      B.push(p.discPrice + p.mDisc * t - disc(p.discPrice, t));
      if (t < X) C.push(A[t]);
      else C.push(p.rimUp + p.mRim * X + PX + p.mDisc * (t - X) - (r3(X) + rimParts(X)) - disc(PX, t - X) + p.r3Now);
    }
    // 乗り換えを遅らせた場合(1〜年数): 年数の終わりの正味コスト
    const delay = [];
    for (let x = 0; x <= p.years; x++) {
      const px = p.discPrice * Math.pow(r(p.market), x), T = p.years;
      delay.push(x === 0 ? B[T] : p.rimUp + p.mRim * x + px + p.mDisc * (T - x) - (r3(x) + rimParts(x)) - disc(px, T - x) + p.r3Now);
    }
    return { A, B, C, X, PX, delay, sold: { r3: r3(X), rim: rimParts(X) } };
  }

  // ---------- 折れ線(正味コストの推移) ----------
  const SER = [
    ["A", "A リムのまま", "--dc-1"],
    ["B", "B 今ディスクへ", "--dc-2"],
    ["C", "C リム→X年後ディスク", "--dc-3"],
  ];
  function chart(m, p) {
    // スマホは描く幅を狭くして、文字が小さくなりすぎないように
    const narrow = typeof innerWidth !== "undefined" && innerWidth < 600;
    const W = narrow ? 360 : 640, H = narrow ? 240 : 250, L = narrow ? 44 : 52, R = narrow ? 70 : 112, T = 14, Bm = 30;
    const all = [...m.A, ...m.B, ...m.C];
    const lo = Math.min(0, ...all), hi = Math.max(...all) * 1.08 || 1;
    const step = niceStep((hi - lo) / 4);
    const y0 = Math.floor(lo / step) * step, y1 = Math.ceil(hi / step) * step;
    const X = (t) => L + ((W - L - R) * t) / p.years, Y = (v) => T + ((H - T - Bm) * (y1 - v)) / (y1 - y0);
    let g = "";
    for (let v = y0; v <= y1 + 1; v += step) g += `<line class="dc-grid" x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text class="dc-ax" x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${man(v)}</text>`;
    for (let t = 0; t <= p.years; t++) g += `<text class="dc-ax" x="${X(t)}" y="${H - 10}" text-anchor="middle">${t === 0 ? "今" : t + "年"}</text>`;
    // 乗り換えの時期
    g += `<line class="dc-sw" x1="${X(m.X)}" x2="${X(m.X)}" y1="${T}" y2="${H - Bm}"/><text class="dc-ax" x="${X(m.X) + 4}" y="${T + 10}">Cの乗り換え</text>`;
    // 線と、右端の名前(重ならないよう少しずらす)
    const ends = SER.map(([k]) => ({ k, y: Y(m[k][p.years]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
    for (const [k, name, c] of SER) {
      const d = m[k].map((v, t) => `${t ? "L" : "M"}${X(t).toFixed(1)},${Y(v).toFixed(1)}`).join("");
      g += `<path class="dc-line" d="${d}" style="stroke:var(${c})"${k === "C" ? ' stroke-dasharray="6 4"' : ""}/>`;
      const e = ends.find((q) => q.k === k);
      g += `<text class="dc-end" x="${W - R + 8}" y="${e.y + 4}">${esc(name.split(" ")[0])} ${man(m[k][p.years])}</text>`;
    }
    g += `<g class="dc-hover" opacity="0"><line class="dc-cross" x1="0" x2="0" y1="${T}" y2="${H - Bm}"/>${SER.map(([k, , c]) => `<circle r="4.5" data-k="${k}" style="fill:var(${c})"/>`).join("")}</g>`;
    g += `<rect class="dc-hit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - Bm}"/>`;
    return { svg: `<svg class="dc-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="プランごとの正味コストの推移">${g}</svg>`, X, Y };
  }
  function niceStep(x) {
    const p = Math.pow(10, Math.floor(Math.log10(x || 1))), f = x / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
  }

  function html(ctx) {
    const p = load(ctx);
    const m = model(p);
    const T = p.years;
    const best = SER.map(([k]) => k).sort((a, b) => m[a][T] - m[b][T])[0];
    const diffBA = m.A[T] - m.B[T];
    // 遅らせるコスト: 1年遅らせるごとの差(平均)
    const perYear = (m.delay[Math.min(T, 3)] - m.delay[0]) / Math.min(T, 3);
    const { svg } = chart(m, p);
    const sc = ctx.scores || {};
    const rows = [
      ["A", "A リムのまま", p.rimUp, m.A, sc.next],
      ["B", "B 今ディスクへ", p.discPrice - p.r3Now, m.B, sc.alt],
      ["C", `C ${m.X}年後にディスクへ`, p.rimUp, m.C, sc.alt],
    ];
    return `<section class="dc" id="dc">
      <h3>リムのまま? ディスクへ?</h3>
      <div class="dc-kpis">
        <div class="dc-kpi on"><small>${T}年でいちばん安い</small><b>${best === "B" ? "今ディスクへ" : best === "A" ? "リムのまま" : `${m.X}年後にディスク`}</b><span>${diffBA > 0 ? `リムのままより ${man(diffBA)}円 安い` : `今ディスクより ${man(-diffBA)}円 安い`}</span></div>
        <div class="dc-kpi"><small>今ディスクにした場合の上乗せ</small><b>${man((m.delay[0] - m.A[T]) / T)}円/年</b><span>走りの点 +${(sc.alt || 0) - (sc.next || 0)}</span></div>
        <div class="dc-kpi"><small>乗り換えを1年のばすごとに</small><b>${man(Math.abs(perYear))}円 ${perYear >= 0 ? "高い" : "浮く"}</b><span>そのぶんディスクの年数が減る</span></div>
        ${m.delay[1] > m.delay[0] ? `<div class="dc-kpi warn"><small>パーツを買って1年で乗り換え</small><b>+${man(m.delay[1] - m.delay[0])}円</b><span>いちばん損な選び方</span></div>` : ""}
      </div>
      <div class="dc-legend">${SER.map(([k, name, c]) => `<span><i style="background:var(${c})"${k === "C" ? ' class="dash"' : ""}></i>${esc(name)}</span>`).join("")}</div>
      <div class="dc-chart">${svg}<div class="dc-tip" hidden></div></div>
      <p class="dc-note">縦軸は「その年に全部売ったとしたら、いくら減っているか」(正味コスト)。払ったお金から、売れる値段を引いたもの。低いほど得。</p>
      <div class="dc-scroll"><table class="dc-table">
        <tr><th>プラン</th><th>最初に払う</th><th>${T}年後の正味コスト</th><th>1年あたり</th><th>走りの点</th></tr>
        ${rows.map(([k, name, first, arr, s]) => `<tr class="${k === best ? "best" : ""}"><td>${esc(name)}</td><td>${yen(first)}</td><td><b>${yen(arr[T])}</b></td><td>${yen(arr[T] / T)}</td><td>${s ? s + "点" : "—"}</td></tr>`).join("")}
      </table></div>
      <div class="dc-scroll"><table class="dc-table dc-delay">
        <tr><th>乗り換える時期</th>${m.delay.map((_, x) => `<th>${x === 0 ? "今" : x + "年後"}</th>`).join("")}</tr>
        <tr><td>${T}年後の正味コスト</td>${m.delay.map((v) => `<td>${man(v)}</td>`).join("")}</tr>
        <tr><td>ディスクに乗れる年数</td>${m.delay.map((_, x) => `<td>${T - x}年</td>`).join("")}</tr>
        <tr><td>ディスク1年あたりの上乗せ<small>(Aとの差÷年数)</small></td>${m.delay.map((v, x) => `<td>${x < T ? man((v - m.A[T]) / (T - x)) : "—"}</td>`).join("")}</tr>
      </table></div>
      <details class="dc-inputs"><summary>前提を変える(相場・整備代など)</summary>
        <div class="dc-grid-in">${FIELDS.map(([k, label, unit, mn, mx, st]) => `<label><span>${esc(label)}</span><input type="number" data-dc="${k}" min="${mn}" max="${mx}" step="${st}" value="${p[k]}" /><small>${unit}</small></label>`).join("")}</div>
        <p class="dc-note">目安: リムのパーツは売るとき買値の${p.rimResale}%から、ディスクロードは${p.discResale}%から始まり、毎年上の割合で下がる。R3は毎年${p.r3Decay}%下がる。Cでは、乗り換えるときに同じクラスの中古ディスクロードが毎年「値下がり」の分だけ安くなる。<button class="link" type="button" data-dc-reset>最初の値に戻す</button></p>
      </details>
    </section>`;
  }

  function mount(root, ctx, rerender) {
    const el = root.querySelector("#dc");
    if (!el) return;
    const p = load(ctx);
    const m = model(p);
    for (const inp of el.querySelectorAll("[data-dc]"))
      inp.addEventListener("change", () => {
        const k = inp.dataset.dc;
        const f = FIELDS.find((x) => x[0] === k);
        let v = +inp.value;
        if (!isFinite(v)) return;
        v = Math.max(f[3], Math.min(f[4], v));
        const cur = load(ctx);
        cur[k] = v;
        if (k === "years") cur.switchAt = Math.min(cur.switchAt, v);
        save(cur);
        rerender();
      });
    const rs = el.querySelector("[data-dc-reset]");
    if (rs)
      rs.addEventListener("click", () => {
        try {
          localStorage.removeItem(KEY);
        } catch (e) {}
        rerender();
      });
    // ホバー・タップで、その年の3つの値
    const svg = el.querySelector(".dc-svg"), tip = el.querySelector(".dc-tip"), hov = el.querySelector(".dc-hover");
    const { X, Y } = chart(m, p);
    const at = (ev) => {
      const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      const x = ((ev.clientX - r.left) / r.width) * vb.width;
      let t = 0, best = 1e9;
      for (let i = 0; i <= p.years; i++) if (Math.abs(X(i) - x) < best) (best = Math.abs(X(i) - x)), (t = i);
      hov.setAttribute("opacity", "1");
      hov.querySelector("line").setAttribute("x1", X(t));
      hov.querySelector("line").setAttribute("x2", X(t));
      for (const c of hov.querySelectorAll("circle")) (c.setAttribute("cx", X(t)), c.setAttribute("cy", Y(m[c.dataset.k][t])));
      tip.hidden = false;
      tip.innerHTML = `<b>${t === 0 ? "今" : t + "年後"}</b>` + SER.map(([k, name, c]) => `<div><i style="background:var(${c})"></i>${esc(name)}<span>${yen(m[k][t])}</span></div>`).join("");
      const px = (X(t) / vb.width) * r.width;
      tip.style.left = Math.min(r.width - 200, Math.max(0, px + 12)) + "px";
    };
    svg.querySelector(".dc-hit").addEventListener("pointermove", at);
    svg.querySelector(".dc-hit").addEventListener("pointerdown", at);
    svg.querySelector(".dc-hit").addEventListener("pointerleave", () => {
      hov.setAttribute("opacity", "0");
      tip.hidden = true;
    });
  }

  return { html, mount, model };
})();

if (typeof module !== "undefined") module.exports = Decide;

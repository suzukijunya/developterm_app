// 動きのしくみ(キネティックタイポグラフィ・数字のカウントアップ・グラフが伸びるインフォグラフィック・タップの波紋)。
// 画面を切り替えたときだけ登場のアニメーションをし、同じ画面の描き直し(ボタンを押したときなど)では最後の状態をすぐ出す。

const Motion = (() => {
  const reduce = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c;

  // 文字を1文字ずつに分ける(1文字ずつ時間差で動かすため)。中に要素がある見出しは分けない
  function split(el) {
    if (el.dataset.ktDone || el.children.length) return;
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = [...text].map((c, i) => `<span class="kt-c" aria-hidden="true" style="--i:${i}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");
    el.dataset.ktDone = "1";
  }

  const fmt = (el, v) => {
    const dec = +el.dataset.dec || 0;
    return v.toLocaleString("ja-JP", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  };

  // 0から目標の数まで、だんだんゆっくり増やす
  function count(el, delay = 0) {
    const to = parseFloat(el.dataset.count);
    if (!isFinite(to)) return;
    if (reduce()) return void (el.textContent = fmt(el, to));
    const dur = +el.dataset.dur || 1200;
    el.textContent = fmt(el, 0);
    setTimeout(() => {
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(el, to * (1 - Math.pow(1 - k, 4)));
        if (k < 1 && el.isConnected) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  }

  const grow = (root) => root.querySelectorAll("[data-grow]").forEach((e) => e.style.setProperty("--v", e.dataset.grow));

  function prepare(root) {
    root.querySelectorAll("[data-kt], .main h2").forEach(split);
  }

  // 画面に入るときの動き
  function enter(root) {
    prepare(root);
    root.classList.remove("anim");
    void root.offsetWidth;
    root.classList.add("anim");
    [...root.children].forEach((c, i) => c.style.setProperty("--d", `${Math.min(i, 10) * 75}ms`));
    root.querySelectorAll("[data-count]").forEach((el) => count(el, 250 + (+el.dataset.delay || 0)));
    if (reduce()) return grow(root);
    requestAnimationFrame(() => requestAnimationFrame(() => grow(root)));
  }

  // 同じ画面の描き直し: 動かさずに最後の状態を出す
  function settle(root) {
    prepare(root);
    root.classList.remove("anim");
    root.querySelectorAll("[data-count]").forEach((el) => (el.textContent = fmt(el, parseFloat(el.dataset.count) || 0)));
    root.classList.add("settled");
    grow(root);
    requestAnimationFrame(() => root.classList.remove("settled"));
  }

  // タップした所から広がる波紋
  document.addEventListener("pointerdown", (e) => {
    const b = e.target.closest && e.target.closest(".btn, .chip, .tab, .link-card");
    if (!b || reduce()) return;
    const r = b.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = "ripple";
    const d = Math.max(r.width, r.height) * 2;
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 650);
  });

  return { enter, settle, count, split };
})();

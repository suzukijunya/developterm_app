// 写真から作ったバイクの3Dモデルを、回して見る(コマ画像を切り替える)。
// もとは Tripo Studio で作った3Dモデルを1回転させた動画。48コマ(7.5度ずつ)を1枚の画像に並べてある。
// 使い方: BikeSpin.html({ auto: true, drag: true }) をHTMLに入れるだけ。画面に出ている間、自動でゆっくり回り、
// drag のものは指やマウスで左右に引くと回せる。

const BikeSpin = (() => {
  const SHEET = { src: "assets/bikes/tcr-spin.webp", n: 48, cols: 8, rows: 6, w: 480, h: 338 };
  // シティデュエルの3D用(小さめ・32コマ)
  const SMALL = { src: "assets/bikes/tcr-spin-s.webp", n: 32, cols: 8, rows: 4, w: 320, h: 226 };
  const NAME = "GIANT TCR(写真から作った3Dモデル)";
  const CREDIT = "3Dモデル: Tripo Studio で作成";

  function css() {
    if (typeof document === "undefined" || document.getElementById("bspin-css")) return;
    const st = document.createElement("style");
    st.id = "bspin-css";
    st.textContent = `
.bspin { position: relative; width: 100%; aspect-ratio: ${SHEET.w} / ${SHEET.h}; background-repeat: no-repeat; background-size: ${SHEET.cols * 100}% ${SHEET.rows * 100}%; user-select: none; -webkit-user-select: none; }
.bspin[data-drag] { cursor: grab; touch-action: pan-y; }
.bspin.grab { cursor: grabbing; }
.bspin-wrap { position: relative; border-radius: 12px; overflow: hidden; background: radial-gradient(ellipse at 50% 62%, #3a3f4a 0%, #1b1e25 55%, #101216 100%); }
.bspin-wrap::after { content: ""; position: absolute; left: 12%; right: 12%; bottom: 3%; height: 7%; border-radius: 50%; background: radial-gradient(ellipse, rgba(0, 0, 0, 0.55), transparent 70%); pointer-events: none; }
.bspin-hint { position: absolute; left: 0; right: 0; bottom: 6px; text-align: center; font-size: 0.72rem; color: rgba(255, 255, 255, 0.65); pointer-events: none; z-index: 2; }
.bspin-credit { position: absolute; right: 8px; top: 6px; font-size: 0.62rem; color: rgba(255, 255, 255, 0.45); pointer-events: none; z-index: 2; }
`;
    document.head.appendChild(st);
  }
  const pos = (i) => {
    const c = i % SHEET.cols, r = Math.floor(i / SHEET.cols);
    return `${(c / (SHEET.cols - 1)) * 100}% ${(r / (SHEET.rows - 1)) * 100}%`;
  };
  // opts: { auto: 自動で回す, drag: 引いて回せる, start: 最初のコマ, speed: 1周の秒数 }
  function html(opts = {}) {
    css();
    const i = opts.start || 0;
    return `<div class="bspin" ${opts.drag ? "data-drag" : ""} ${opts.auto === false ? "" : "data-auto"} data-speed="${opts.speed || 9}" data-f="${i}" style="background-image:url(${SHEET.src});background-position:${pos(i)}" role="img" aria-label="${NAME}"></div>`;
  }
  // 枠つき(ガレージ用)
  function card(opts = {}) {
    return `<div class="bspin-wrap">${html(Object.assign({ auto: true, drag: true }, opts))}<span class="bspin-credit">${CREDIT}</span>${opts.drag === false ? "" : `<span class="bspin-hint">← 左右に引くと回せます →</span>`}</div>`;
  }
  function set(el, f) {
    const n = SHEET.n;
    f = ((f % n) + n) % n;
    el._f = f;
    const i = Math.round(f) % n;
    if (el._i !== i) (el._i = i), (el.style.backgroundPosition = pos(i));
  }
  if (typeof document !== "undefined") {
    let drag = null, last = 0, list = [], listAt = 0;
    const tick = (t) => {
      requestAnimationFrame(tick);
      const dt = Math.min(0.1, (t - last) / 1000 || 0);
      last = t;
      if (t - listAt > 400) (list = [...document.querySelectorAll(".bspin[data-auto]")]), (listAt = t);
      for (const el of list) {
        if (!el.isConnected || (drag && drag.el === el) || (el._hold && t < el._hold)) continue;
        if (el._f == null) el._f = +el.dataset.f || 0;
        set(el, el._f + (dt * SHEET.n) / (+el.dataset.speed || 9));
      }
    };
    requestAnimationFrame(tick);
    document.addEventListener("pointerdown", (e) => {
      const el = e.target.closest && e.target.closest(".bspin[data-drag]");
      if (!el) return;
      if (el._f == null) el._f = +el.dataset.f || 0;
      drag = { el, x: e.clientX, f: el._f, w: el.getBoundingClientRect().width || 300 };
      el.classList.add("grab");
    });
    document.addEventListener("pointermove", (e) => {
      if (!drag) return;
      // 幅いっぱい引くと、だいたい1周
      set(drag.el, drag.f - ((e.clientX - drag.x) / drag.w) * SHEET.n);
    });
    const up = () => {
      if (!drag) return;
      drag.el.classList.remove("grab");
      drag.el._hold = performance.now() + 2500; // 手を離してから少し止めておく
      drag = null;
    };
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
  }
  return { html, card, SHEET, SMALL, NAME, CREDIT };
})();

if (typeof module !== "undefined") module.exports = BikeSpin;

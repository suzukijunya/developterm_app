// Duolingo 風の「動き」と効果音。タイルが飛んでいく・正解で跳ねる・不正解で揺れる・
// 進捗バーのキラキラ・問題の切り替えスライドなど、画面をまたいで使う小さな演出をまとめる
const Motion = (() => {
  function reduced() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function canAnimate(node) {
    return node && typeof node.animate === "function" && !reduced();
  }

  // toEl を「fromEl があった場所」から今の位置へ飛んでくるように動かす(ゴーストを使わない FLIP)
  function fly(fromEl, toEl, opts) {
    if (!fromEl || !toEl) return Promise.resolve();
    return arrive(toEl, fromEl.getBoundingClientRect(), opts);
  }

  function arrive(toEl, from, { duration = 280 } = {}) {
    if (!canAnimate(toEl) || !from || !from.width) return Promise.resolve();
    const to = toEl.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (!dx && !dy) return Promise.resolve();
    toEl.classList.add("mo-flying");
    const anim = toEl.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(1)` },
        { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 16}px) scale(1.07)`, offset: 0.5 },
        { transform: "translate(0, 0) scale(1)" },
      ],
      { duration, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" }
    );
    return anim.finished.catch(() => {}).then(() => toEl.classList.remove("mo-flying"));
  }

  // container の子要素の位置を覚えておき、mutate() 後の位置へなめらかに移動させる(FLIP)
  function flip(container, mutate, { duration = 200 } = {}) {
    const kids = Array.from(container.children);
    const before = new Map(kids.map((k) => [k, k.getBoundingClientRect()]));
    mutate();
    if (reduced()) return;
    Array.from(container.children).forEach((k) => {
      const b = before.get(k);
      if (!b || typeof k.animate !== "function") return;
      const a = k.getBoundingClientRect();
      const dx = b.left - a.left;
      const dy = b.top - a.top;
      if (!dx && !dy) return;
      k.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
        duration,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      });
    });
  }

  // 正解: 少しずつずらしてピョンと跳ねる
  function hop(nodes, { stagger = 60 } = {}) {
    Array.from(nodes).forEach((n, i) => {
      if (!canAnimate(n)) return;
      n.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-10px) scale(1.06)", offset: 0.4 },
          { transform: "translateY(0) scale(0.98)", offset: 0.75 },
          { transform: "translateY(0) scale(1)" },
        ],
        { duration: 420, delay: i * stagger, easing: "ease-out" }
      );
    });
  }

  // 不正解: 左右にぶるっと揺れる
  function shake(node) {
    if (!canAnimate(node)) return;
    node.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(7px)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(3px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 380, easing: "ease-out" }
    );
  }

  // ポンと膨らむ
  function pop(node, scale = 1.08) {
    if (!canAnimate(node)) return;
    node.animate([{ transform: "scale(1)" }, { transform: `scale(${scale})`, offset: 0.45 }, { transform: "scale(1)" }], {
      duration: 280,
      easing: "ease-out",
    });
  }

  // ななめに光が走る(CSS の .mo-shine::after と組み合わせる)
  function shine(node) {
    if (!node || reduced()) return;
    node.classList.remove("mo-shine");
    void node.offsetWidth;
    node.classList.add("mo-shine");
    setTimeout(() => node.classList.remove("mo-shine"), 700);
  }

  // anchor の右端あたりから小さな光の粒をはじけさせる(進捗バーの先端など)
  function sparkle(anchor, { count = 9, colors = ["#ffd23f", "#ffb020", "#ffffff", "#ff8a3d"] } = {}) {
    if (!anchor || reduced()) return;
    const r = anchor.getBoundingClientRect();
    if (!r.width) return;
    const x = r.right - 4;
    const y = r.top + r.height / 2;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "mo-spark" + (i % 3 === 0 ? " mo-spark--star" : "");
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = colors[i % colors.length];
      document.body.appendChild(p);
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      const dist = 16 + Math.random() * 22;
      const anim = p.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.4)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(1)`,
            opacity: 1,
            offset: 0.6,
          },
          {
            transform: `translate(calc(-50% + ${Math.cos(angle) * dist * 1.25}px), calc(-50% + ${Math.sin(angle) * dist * 1.25 + 6}px)) scale(0.2)`,
            opacity: 0,
          },
        ],
        { duration: 650 + Math.random() * 200, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" }
      );
      anim.finished.catch(() => {}).then(() => p.remove());
    }
  }

  // 要素を左へ流して消す(次の問題へ切り替えるとき)
  function slideOut(nodes, { duration = 170 } = {}) {
    const list = Array.from(nodes).filter(Boolean);
    if (!list.length || reduced() || typeof list[0].animate !== "function") return Promise.resolve();
    return Promise.all(
      list.map((n) =>
        n
          .animate([{ transform: "none", opacity: 1 }, { transform: "translateX(-48px)", opacity: 0 }], {
            duration,
            easing: "ease-in",
            fill: "forwards",
          })
          .finished.catch(() => {})
      )
    );
  }

  // ---------- 効果音(Web Audio で合成。音声ファイルは使わない) ----------
  const Sfx = (() => {
    let ctx = null;
    let idleTimer = null;

    function enabled() {
      return typeof AppState === "undefined" || AppState.getPref("sfx", true);
    }

    function audio() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) {
        try {
          ctx = new AC();
        } catch (e) {
          return null;
        }
      }
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      // 鳴らし終わったら止めておく(録音やマイク認識の邪魔をしないように)
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (ctx && ctx.state === "running") ctx.suspend().catch(() => {});
      }, 1500);
      return ctx;
    }

    // 1音: 周波数・開始(秒)・長さ(秒)・波形・音量
    function tone(ac, freq, start, dur, { type = "sine", gain = 0.18, slideTo = null } = {}) {
      const t0 = ac.currentTime + start;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    }

    function play(fn) {
      if (!enabled()) return;
      const ac = audio();
      if (!ac) return;
      try {
        fn(ac);
      } catch (e) {
        /* 効果音は鳴らなくても学習には影響しない */
      }
    }

    return {
      // タイルをタップしたときの「ポコッ」
      tap: () => play((ac) => tone(ac, 520, 0, 0.07, { type: "triangle", gain: 0.12, slideTo: 760 })),
      // 正解の「ピロン♪」
      correct: () =>
        play((ac) => {
          tone(ac, 880, 0, 0.14, { type: "triangle", gain: 0.16 });
          tone(ac, 1318.5, 0.09, 0.26, { type: "triangle", gain: 0.16 });
          tone(ac, 1760, 0.09, 0.22, { type: "sine", gain: 0.05 });
        }),
      // 不正解の「ブブッ」
      wrong: () =>
        play((ac) => {
          tone(ac, 220, 0, 0.13, { type: "square", gain: 0.05, slideTo: 180 });
          tone(ac, 174, 0.14, 0.22, { type: "square", gain: 0.05, slideTo: 140 });
        }),
      // ペアがそろった音。そろうたびに少しずつ音が上がる
      pair: (step = 0) =>
        play((ac) => {
          const base = 660 * Math.pow(2, Math.min(step, 8) / 12 * 2);
          tone(ac, base, 0, 0.1, { type: "triangle", gain: 0.14 });
          tone(ac, base * 1.5, 0.07, 0.16, { type: "triangle", gain: 0.12 });
        }),
      // コイン・ジェムを手に入れた「チャリン」
      coin: () =>
        play((ac) => {
          tone(ac, 1567.98, 0, 0.08, { type: "square", gain: 0.05 });
          tone(ac, 2093, 0.07, 0.22, { type: "triangle", gain: 0.12 });
        }),
      // 宝箱が開く
      chest: () =>
        play((ac) => {
          tone(ac, 196, 0, 0.12, { type: "square", gain: 0.05, slideTo: 392 });
          [783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => tone(ac, f, 0.14 + i * 0.07, 0.2, { type: "triangle", gain: 0.13 }));
        }),
      // レッスン完了のファンファーレ
      complete: () =>
        play((ac) => {
          [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ac, f, i * 0.11, 0.24, { type: "triangle", gain: 0.15 }));
          tone(ac, 1318.5, 0.46, 0.5, { type: "triangle", gain: 0.13 });
          tone(ac, 1046.5, 0.46, 0.5, { type: "sine", gain: 0.08 });
        }),
    };
  })();

  function vibrate(pattern) {
    try {
      if (navigator.vibrate && (typeof AppState === "undefined" || AppState.getPref("sfx", true))) navigator.vibrate(pattern);
    } catch (e) {
      /* 非対応端末 */
    }
  }

  return { fly, arrive, flip, hop, shake, pop, shine, sparkle, slideOut, Sfx, vibrate, reduced };
})();

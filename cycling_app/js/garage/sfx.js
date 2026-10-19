// 効果音: パーツを付けたときの「ガシャン」とレア度に応じた音。音のファイルは使わず、その場で合成する。

const Sfx = (() => {
  let ctx = null;
  const KEY = "cycling_sfx";
  let muted = false;
  try {
    muted = localStorage.getItem(KEY) === "off";
  } catch (e) {}

  function ac() {
    if (muted) return null;
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(c, freq, t0, dur, type, vol) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  // 金属がはまる音(短いノイズを低い音だけにしたもの)
  function clunk(c, t0, vol) {
    const len = Math.floor(c.sampleRate * 0.12);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 900;
    const g = c.createGain();
    g.gain.value = vol;
    src.connect(f).connect(g).connect(c.destination);
    src.start(t0);
    tone(c, 110, t0, 0.18, "square", vol * 0.25);
  }

  // lv: 0(ふつう)〜4(いちばんレア)
  function equip(lv = 0) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + 0.02;
    clunk(c, t, 0.5);
    const notes = [[], [784], [659, 988], [523, 784, 1047], [523, 659, 784, 1047, 1319]][Math.max(0, Math.min(4, lv))];
    notes.forEach((f, i) => tone(c, f, t + 0.1 + i * 0.075, 0.35 + lv * 0.08, "triangle", 0.07));
    // いちばんレア: きらきらした余韻
    if (lv >= 4) for (let i = 0; i < 8; i++) tone(c, 1568 + Math.random() * 1200, t + 0.5 + i * 0.06, 0.25, "sine", 0.025);
  }

  return {
    equip,
    get muted() {
      return muted;
    },
    setMuted(m) {
      muted = m;
      try {
        localStorage.setItem(KEY, m ? "off" : "on");
      } catch (e) {}
    },
  };
})();

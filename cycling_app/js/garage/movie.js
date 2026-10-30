// 🎬 動画を作る: いまのバイクの3Dと、パーツの写真から、映画の予告のような縦長の宣伝動画(約16秒・音つき)を作る。
// 写真はゆっくり寄ったり流れたりさせて「動く写真」のように見せ、文字はキネティックタイポグラフィ、数値はインフォグラフィックで出す。
// すべてこの端末の中で作る(どこにも送らない)。

const Movie = (() => {
  const W = 720, H = 1280, DUR = 16.5;
  const FONT = `"Anton", "Rajdhani", "Impact", sans-serif`;
  const JP = `"Hiragino Sans", "Noto Sans JP", sans-serif`;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (k) => 1 - Math.pow(1 - clamp(k), 3);
  const easeIO = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const lerp = (a, b, k) => a + (b - a) * k;

  // ---------- 音(その場で作るBGMと効果音) ----------
  function soundtrack(ac, out, t0) {
    const master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(out);
    const at = (s) => t0 + s;
    // 低いうなり(シンセのパッド)。だんだん明るく
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(220, at(0));
    lp.frequency.exponentialRampToValueAtTime(1800, at(12.5));
    lp.frequency.exponentialRampToValueAtTime(400, at(DUR));
    const pad = ac.createGain();
    pad.gain.setValueAtTime(0.0001, at(0));
    pad.gain.exponentialRampToValueAtTime(0.16, at(1.5));
    pad.gain.setValueAtTime(0.16, at(DUR - 1.2));
    pad.gain.exponentialRampToValueAtTime(0.0001, at(DUR));
    lp.connect(pad).connect(master);
    for (const [f, d] of [[55, 0], [55, 7], [82.4, -5], [110, 3]]) {
      const o = ac.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.detune.value = d;
      o.connect(lp);
      o.start(at(0));
      o.stop(at(DUR + 0.2));
    }
    const noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const noise = (s, len, from, to, vol, type = "bandpass") => {
      const n = ac.createBufferSource();
      n.buffer = noiseBuf;
      const f = ac.createBiquadFilter();
      f.type = type;
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(from, at(s));
      f.frequency.exponentialRampToValueAtTime(to, at(s + len));
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, at(s));
      g.gain.exponentialRampToValueAtTime(vol, at(s + len * 0.6));
      g.gain.exponentialRampToValueAtTime(0.0001, at(s + len));
      n.connect(f).connect(g).connect(master);
      n.start(at(s));
      n.stop(at(s + len + 0.05));
    };
    const kick = (s, vol = 0.9) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.frequency.setValueAtTime(140, at(s));
      o.frequency.exponentialRampToValueAtTime(38, at(s + 0.18));
      g.gain.setValueAtTime(vol, at(s));
      g.gain.exponentialRampToValueAtTime(0.0001, at(s + 0.32));
      o.connect(g).connect(master);
      o.start(at(s));
      o.stop(at(s + 0.35));
    };
    const impact = (s) => {
      kick(s, 1.1);
      noise(s, 0.9, 3000, 120, 0.35, "lowpass");
    };
    // 流れ: ためる → ドン(タイトル) → ビート → 区切りでシュッ → ドン(ランク) → 余韻
    noise(0.2, 1.3, 200, 6000, 0.25);
    impact(1.55);
    const beat = 60 / 124;
    for (let s = 1.55 + beat; s < 12.4; s += beat) kick(s, 0.55);
    for (let s = 1.55 + beat * 2; s < 12.4; s += beat * 2) noise(s, 0.12, 6000, 9000, 0.09, "highpass");
    for (const s of [4.7, 6.2, 7.7, 9.2]) noise(s - 0.35, 0.45, 400, 7000, 0.22);
    noise(12.0, 0.8, 300, 8000, 0.3);
    impact(12.8);
    impact(15.0);
  }

  // ---------- 文字(1文字ずつ時間差で動く) ----------
  function kText(g, text, x, y, size, t, o = {}) {
    const chars = [...String(text)];
    g.save();
    g.font = `${o.weight || "400"} ${size}px ${o.jp ? JP : FONT}`;
    // 幅に収まらなければ文字を小さくする(端末のフォントで幅が変わるため)
    const maxW = o.maxW || W - 80;
    const w0 = g.measureText(text).width + (o.spacing || 0) * chars.length;
    if (w0 > maxW) {
      size = Math.floor((size * maxW) / w0);
      g.font = `${o.weight || "400"} ${size}px ${o.jp ? JP : FONT}`;
    }
    g.textBaseline = "alphabetic";
    const widths = chars.map((c) => g.measureText(c).width + (o.spacing || 0));
    const total = widths.reduce((a, b) => a + b, 0);
    let cx = o.align === "center" ? x - total / 2 : o.align === "right" ? x - total : x;
    const stagger = o.stagger == null ? 0.035 : o.stagger;
    chars.forEach((c, i) => {
      const k = ease((t - i * stagger) / (o.dur || 0.45));
      if (k > 0) {
        g.save();
        const from = o.from || "up";
        const dx = from === "right" ? (1 - k) * size * 1.6 : from === "left" ? -(1 - k) * size * 1.6 : 0;
        const dy = from === "up" ? (1 - k) * size * 0.9 : from === "down" ? -(1 - k) * size * 0.9 : 0;
        const sc = from === "slam" ? lerp(3.2, 1, k) : 1;
        g.translate(cx + widths[i] / 2 + dx, y + dy);
        g.rotate((1 - k) * (o.rot == null ? 0.25 : o.rot));
        g.scale(sc, sc);
        g.globalAlpha = (o.alpha == null ? 1 : o.alpha) * clamp(k * 1.4);
        if (o.glow) {
          g.shadowColor = o.glow;
          g.shadowBlur = 24;
        }
        g.fillStyle = o.color || "#fff";
        g.fillText(c, -widths[i] / 2 + (o.spacing || 0) / 2, 0);
        if (o.stroke) {
          g.lineWidth = 2;
          g.strokeStyle = o.stroke;
          g.strokeText(c, -widths[i] / 2, 0);
        }
        g.restore();
      }
      cx += widths[i];
    });
    g.restore();
  }

  // 写真を、ゆっくり寄りながら少し流す(動く写真)。後ろはぼかした同じ写真
  function movingPhoto(g, img, k, dir) {
    const s0 = Math.max(W / img.width, H / img.height);
    g.save();
    g.filter = "blur(26px) brightness(0.45) saturate(1.3)";
    g.drawImage(img, (W - img.width * s0 * 1.2) / 2, (H - img.height * s0 * 1.2) / 2, img.width * s0 * 1.2, img.height * s0 * 1.2);
    g.restore();
    const fit = Math.min((W * 0.96) / img.width, (H * 0.62) / img.height);
    const sc = fit * lerp(1.0, 1.16, easeIO(k));
    const w = img.width * sc, h = img.height * sc;
    const x = (W - w) / 2 + dir * lerp(-30, 30, k);
    const y = (H - h) / 2 - 40 + lerp(18, -18, k);
    g.save();
    g.translate(x + w / 2, y + h / 2);
    g.rotate(dir * lerp(-0.025, 0.02, k));
    g.shadowColor = "rgba(0,0,0,0.6)";
    g.shadowBlur = 50;
    g.filter = "contrast(1.12) saturate(1.2)";
    g.drawImage(img, -w / 2, -h / 2, w, h);
    g.restore();
    // 光の帯が通る
    const lx = lerp(-W, W * 1.6, k);
    const grad = g.createLinearGradient(lx, 0, lx + 260, H * 0.3);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.22)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.save();
    g.globalCompositeOperation = "screen";
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    g.restore();
  }

  let grain = null;
  function film(g, t) {
    // 周辺を暗く・光漏れ・フィルムの粒
    const v = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.65)");
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);
    g.save();
    g.globalCompositeOperation = "screen";
    const lk = g.createRadialGradient(W * (0.15 + 0.1 * Math.sin(t * 0.7)), H * 0.12, 10, W * 0.15, H * 0.12, W * 0.9);
    lk.addColorStop(0, "rgba(255,120,30,0.22)");
    lk.addColorStop(1, "rgba(255,120,30,0)");
    g.fillStyle = lk;
    g.fillRect(0, 0, W, H);
    const lk2 = g.createRadialGradient(W * 0.9, H * (0.85 + 0.05 * Math.sin(t)), 10, W * 0.9, H * 0.85, W * 0.8);
    lk2.addColorStop(0, "rgba(40,140,255,0.2)");
    lk2.addColorStop(1, "rgba(40,140,255,0)");
    g.fillStyle = lk2;
    g.fillRect(0, 0, W, H);
    g.restore();
    if (!grain) {
      grain = document.createElement("canvas");
      grain.width = grain.height = 256;
      const gg = grain.getContext("2d");
      const id = gg.createImageData(256, 256);
      for (let i = 0; i < id.data.length; i += 4) {
        const n = Math.random() * 255;
        id.data[i] = id.data[i + 1] = id.data[i + 2] = n;
        id.data[i + 3] = 255;
      }
      gg.putImageData(id, 0, 0);
    }
    g.save();
    g.globalAlpha = 0.05;
    g.globalCompositeOperation = "overlay";
    const ox = Math.floor(Math.random() * 256), oy = Math.floor(Math.random() * 256);
    for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) g.drawImage(grain, x, y);
    g.restore();
  }

  function flash(g, t, at, len = 0.25) {
    const k = 1 - Math.abs(t - at) / len;
    if (k <= 0) return;
    g.fillStyle = `rgba(255,255,255,${0.85 * k})`;
    g.fillRect(0, 0, W, H);
  }

  // 区切りのシュッ(横に流れる線)
  function whip(g, t, at) {
    const k = 1 - Math.abs(t - at) / 0.22;
    if (k <= 0) return;
    g.save();
    g.globalAlpha = k * 0.8;
    for (let i = 0; i < 26; i++) {
      const y = ((i * 97) % H) + Math.sin(i) * 20;
      g.fillStyle = i % 3 ? "rgba(255,255,255,0.5)" : "rgba(255,138,31,0.7)";
      g.fillRect(((i * 53) % W) - 200, y, 300 + (i % 5) * 80, 2 + (i % 3));
    }
    g.restore();
  }

  // ---------- 作る ----------
  // d: { title, sub, kg, rank, total, rows:[{en, ja, bar}], parts:[{label, name, g, slot, img}], date }
  async function make(d, onProgress) {
    if (typeof MediaRecorder === "undefined") throw new Error("この端末のブラウザは動画の書き出しに対応していません");
    try {
      await Promise.all([document.fonts.load(`40px "Anton"`), document.fonts.load(`700 40px "Rajdhani"`)]);
    } catch (e) {}
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const g = cv.getContext("2d");
    const bike = View3D.partBox(null) || { x: 0.2, y: 0.5, z: 0, size: 1.8 };
    const boxes = {};
    for (const p of d.parts) boxes[p.slot] = View3D.partBox(p.slot);

    // 場面(秒)
    const S = { open: 0, title: 1.55, parts: 4.7, info: 9.2 + 0.3, hero: 12.0, end: 15.0 };
    const partT = (i) => S.parts + i * 1.5;
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const dest = ac.createMediaStreamDestination();
    const mix = ac.createGain();
    mix.connect(dest);
    mix.connect(ac.destination);
    const stream = cv.captureStream(30);
    for (const tr of dest.stream.getAudioTracks()) stream.addTrack(tr);
    const types = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
    const mime = types.find((x) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x)) || "";
    const recorder = new MediaRecorder(stream, Object.assign({ videoBitsPerSecond: 6000000 }, mime ? { mimeType: mime } : {}));
    const chunks = [];
    recorder.ondataavailable = (e) => e.data && e.data.size && chunks.push(e.data);

    let t0 = null;
    let exploded = false;
    const done = new Promise((resolve) => (recorder.onstop = resolve));

    const direct = (now) => {
      if (t0 == null) return null;
      const t = now - t0;
      const c = { x: bike.x, y: bike.y, z: bike.z };
      if (t < S.title) return { az: -2.2 + t * 0.05, el: 0.02, dist: 1.4, target: { x: c.x + 0.3, y: c.y - 0.15, z: c.z } };
      if (t < S.parts) {
        const k = easeIO((t - S.title) / (S.parts - S.title));
        return { az: lerp(-2.2, -0.9, k), el: lerp(0.0, 0.16, k), dist: lerp(1.6, 2.3, k), target: c };
      }
      if (t < S.info) {
        const i = Math.min(d.parts.length - 1, Math.floor((t - S.parts) / 1.5));
        const p = d.parts[i];
        const b = (p && boxes[p.slot]) || c;
        const k = ((t - S.parts) % 1.5) / 1.5;
        return { az: i % 2 ? lerp(0.25, 0.65, k) : lerp(0.75, 0.4, k), el: 0.24, dist: Math.max(0.55, ((b.size || 0.6) * 1.4)) * lerp(1.1, 0.9, k), target: b };
      }
      if (t < S.hero) {
        const k = (t - S.info) / (S.hero - S.info);
        return { az: lerp(0.05, -0.1, k), el: 0.06, dist: 2.5, target: { x: c.x, y: c.y + 0.32, z: c.z } };
      }
      const k = clamp((t - S.hero) / (DUR - S.hero));
      if (!exploded && t > S.hero + 0.1 && t < S.hero + 1.2) {
        View3D.setExploded(true);
        exploded = true;
      }
      if (exploded && t > S.hero + 1.25) {
        View3D.setExploded(false);
        exploded = "back";
      }
      return { az: lerp(0.9, 2.1, easeIO(k)), el: lerp(0.35, 0.18, k), dist: lerp(2.9, 2.2, k), target: c };
    };

    const onFrame = (src, now) => {
      if (t0 == null) {
        t0 = now;
        soundtrack(ac, mix, ac.currentTime + 0.02);
        recorder.start(250);
      }
      const t = now - t0;
      if (onProgress) onProgress(clamp(t / DUR), cv);
      g.save();
      g.fillStyle = "#000";
      g.fillRect(0, 0, W, H);
      // ---- 3D ----
      if (t >= S.open + 0.3) {
        g.filter = "contrast(1.12) saturate(1.15)";
        g.globalAlpha = t < S.title ? clamp((t - 0.3) / 1.2) * 0.55 : 1;
        g.drawImage(src, 0, 0, W, H);
        g.filter = "none";
        g.globalAlpha = 1;
      }
      // ---- 写真(パーツ) ----
      if (t >= S.parts && t < S.info) {
        const i = Math.min(d.parts.length - 1, Math.floor((t - S.parts) / 1.5));
        const p = d.parts[i];
        const k = ((t - S.parts) % 1.5) / 1.5;
        if (p && p.img) movingPhoto(g, p.img, k, i % 2 ? -1 : 1);
      }
      // 情報の場面は少し暗く
      if (t >= S.info && t < S.hero) {
        g.fillStyle = `rgba(4,8,16,${0.55 * ease((t - S.info) / 0.4)})`;
        g.fillRect(0, 0, W, H);
      }
      film(g, t);
      // ---- 文字・インフォグラフィック ----
      if (t < S.title) {
        kText(g, "THIS IS", W / 2, H * 0.44, 70, t - 0.25, { align: "center", from: "up", color: "#9fb7d8" });
        kText(g, "MY MACHINE", W / 2, H * 0.53, 108, t - 0.7, { align: "center", from: "slam", rot: 0, stagger: 0.05, glow: "#3d8bff" });
      } else if (t < S.parts) {
        const tt = t - S.title;
        g.fillStyle = "rgba(0,0,0,0.35)";
        g.fillRect(0, H * 0.7, W, H * 0.3);
        kText(g, d.title.toUpperCase(), 48, H * 0.8, d.title.length > 14 ? 64 : 84, tt - 0.15, { from: "right", stagger: 0.03, glow: "#ff8a1f" });
        kText(g, d.sub, 52, H * 0.86, 32, tt - 0.8, { jp: true, weight: "700", from: "up", stagger: 0.02, color: "#cfe0ff" });
        // 重さのカウント
        const kk = ease((tt - 1.1) / 1.2);
        if (kk > 0) {
          g.font = `400 120px ${FONT}`;
          g.fillStyle = "#fff";
          g.globalAlpha = clamp(kk * 2);
          g.fillText((d.kg * kk).toFixed(2), 48, H * 0.96);
          g.font = `400 46px ${FONT}`;
          g.fillStyle = "#ff8a1f";
          g.fillText("KG", 48 + g.measureText((d.kg).toFixed(2)).width * 2.6 + 12, H * 0.96);
          g.globalAlpha = 1;
        }
      } else if (t < S.info) {
        const i = Math.min(d.parts.length - 1, Math.floor((t - S.parts) / 1.5));
        const p = d.parts[i];
        const tt = (t - S.parts) % 1.5;
        if (p) {
          g.fillStyle = "#ff8a1f";
          g.fillRect(0, H * 0.78, lerp(0, 16, ease(tt / 0.2)), 150);
          kText(g, p.label, 44, H * 0.8, 40, tt, { from: "left", stagger: 0.02, color: "#ff8a1f", spacing: 6 });
          kText(g, p.name.length > 22 ? p.name.slice(0, 21) + "…" : p.name, 44, H * 0.85, p.name.length > 16 ? 40 : 52, tt - 0.15, { from: "right", stagger: 0.015 });
          const kg = ease((tt - 0.3) / 0.7);
          if (p.g && kg > 0) {
            g.font = `400 64px ${FONT}`;
            g.fillStyle = "#fff";
            g.fillText(`${Math.round(p.g * kg).toLocaleString()} G`, 44, H * 0.92);
          }
          kText(g, String(i + 1).padStart(2, "0"), W - 40, 150, 120, tt, { align: "right", from: "down", color: "rgba(255,255,255,0.25)" });
        }
      } else if (t < S.hero) {
        const tt = t - S.info;
        kText(g, "SPEC", 48, 190, 110, tt, { from: "up", glow: "#3d8bff" });
        g.font = `400 110px ${FONT}`;
        kText(g, "性能", 48 + g.measureText("SPEC").width + 24, 190, 44, tt - 0.2, { jp: true, weight: "800", color: "#ff8a1f" });
        d.rows.forEach((r, i) => {
          const y = 300 + i * 112;
          const k = ease((tt - 0.3 - i * 0.12) / 0.8);
          if (k <= 0) return;
          g.globalAlpha = clamp(k * 2);
          g.font = `400 34px ${FONT}`;
          g.fillStyle = "#9fb7d8";
          g.fillText(r.en, 48, y);
          g.font = `700 24px ${JP}`;
          g.fillStyle = "#cfd8e6";
          g.fillText(r.ja, 48 + g.measureText(r.en).width * 1.45 + 40, y);
          g.fillStyle = "rgba(255,255,255,0.12)";
          g.fillRect(48, y + 18, W - 96, 22);
          const bw = (W - 96) * (r.bar / 100) * k;
          const gr = g.createLinearGradient(48, 0, 48 + bw, 0);
          gr.addColorStop(0, "#1f6fe5");
          gr.addColorStop(1, r.bar >= 70 ? "#3dff8a" : "#5b9bff");
          g.fillStyle = gr;
          g.fillRect(48, y + 18, bw, 22);
          g.font = `400 40px ${FONT}`;
          g.fillStyle = "#fff";
          g.textAlign = "right";
          g.fillText(String(Math.round(r.bar * k)), W - 48, y);
          g.textAlign = "left";
          g.globalAlpha = 1;
        });
      } else if (t < S.end) {
        const tt = t - S.hero;
        kText(g, "TOTAL", W / 2, H * 0.17, 54, tt - 0.6, { align: "center", color: "#9fb7d8", spacing: 10 });
        const k = ease((tt - 0.7) / 0.9);
        if (k > 0) {
          g.font = `400 150px ${FONT}`;
          g.textAlign = "center";
          g.fillStyle = "#fff";
          g.shadowColor = "#3d8bff";
          g.shadowBlur = 30;
          g.fillText(Math.round(d.total * k).toLocaleString(), W / 2, H * 0.28);
          g.shadowBlur = 0;
          g.textAlign = "left";
        }
        // ランクの判押し
        const rk = ease((tt - 0.8) / 0.35);
        if (rk > 0) {
          g.save();
          g.translate(W / 2, H * 0.8);
          g.rotate((1 - rk) * -0.5);
          g.scale(lerp(3.5, 1, rk), lerp(3.5, 1, rk));
          g.globalAlpha = clamp(rk * 1.5);
          const col = { S: "#ffcf5a", A: "#ff9a2e", B: "#6fc3ff", C: "#b8c2cf" }[d.rank] || "#b8c2cf";
          g.strokeStyle = col;
          g.lineWidth = 8;
          g.strokeRect(-110, -130, 220, 220);
          g.font = `400 200px ${FONT}`;
          g.textAlign = "center";
          g.fillStyle = col;
          g.shadowColor = col;
          g.shadowBlur = 30;
          g.fillText(d.rank, 0, 60);
          g.restore();
          kText(g, "RANK", W / 2, H * 0.92, 48, tt - 1.0, { align: "center", color: "#fff", spacing: 14 });
        }
      } else {
        const tt = t - S.end;
        g.fillStyle = `rgba(0,0,0,${0.75 * ease(tt / 0.5)})`;
        g.fillRect(0, 0, W, H);
        kText(g, "RIDE", W / 2, H * 0.43, 150, tt - 0.1, { align: "center", from: "slam", rot: 0 });
        kText(g, "CALORIE", W / 2, H * 0.54, 150, tt - 0.3, { align: "center", from: "slam", rot: 0, color: "#5b9bff" });
        kText(g, d.date, W / 2, H * 0.61, 34, tt - 0.6, { align: "center", jp: true, weight: "700", color: "#cfd8e6", stagger: 0.02 });
      }
      for (const s of [S.parts, partT(1), partT(2), S.info, S.hero]) whip(g, t, s);
      flash(g, t, S.title, 0.3);
      flash(g, t, S.hero + 0.8, 0.2);
      flash(g, t, S.end, 0.25);
      // 映画のように上下に黒い帯
      g.fillStyle = "#000";
      g.fillRect(0, 0, W, 40);
      g.fillRect(0, H - 40, W, 40);
      g.restore();
      if (t >= DUR && recorder.state === "recording") recorder.stop();
    };

    if (!View3D.startMovie({ w: W, h: H, direct, onFrame })) throw new Error("3Dの準備ができていません");
    try {
      await done;
    } finally {
      View3D.stopMovie();
      ac.close();
    }
    const type = (chunks[0] && chunks[0].type) || mime || "video/webm";
    return { blob: new Blob(chunks, { type }), type, ext: /mp4/.test(type) ? "mp4" : "webm" };
  }

  return { make, W, H, DUR };

})();

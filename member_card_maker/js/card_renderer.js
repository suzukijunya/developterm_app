// カード JSON(card_format.js の形式)を canvas に描く。
// デザインは見本カード(1024 x 1440)を実測して再現している。座標はすべてこの論理座標で書き、
// scale で出力解像度を変える。

const CardRenderer = (() => {
  const W = 1024;
  const H = 1440;
  const SANS = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';
  // カードコード・ATK/DEF・コピーライトの欧文セリフ体
  const SERIF_LATIN = '"Noto Serif", "Times New Roman", Times, serif';

  const LAYOUT = {
    body: { x: 33, y: 31, w: 954, h: 1376 },
    nameBox: { x: 52, y: 50, w: 918, h: 112 },
    name: { x: 80, y: 106, size: 60 },
    attr: { cx: 898, cy: 106, r: 55 },
    stars: { y: 205, r: 33, gap: 66, right: 868 },
    artFrame: { x: 95, y: 240, w: 834, h: 796 },
    art: { x: 114, y: 258, w: 796, h: 760 },
    code: { x: 905, y: 1066 },
    textBox: { x: 55, y: 1072, w: 913, h: 304 },
    text: { left: 88, right: 936, header: 1092, top: 1134, rule: 1311, stats: 1354 },
    copyright: { x: 932, y: 1400 },
  };

  // 見本カードから拾った色
  const COLORS = {
    border: { base: "#555886", light: "#b4b6d8", dark: "#1a1f38", amp: 1.6 },
    parchment: { base: "#dfc3ae", light: "#f5e7dc", dark: "#bb9a84", amp: 1.3 },
    slate: { base: "#4e5e89", light: "#7684ad", dark: "#2a3458" },
    ink: "#1c1410",
  };

  // ---------------- 小物 ----------------

  function hashSeed(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hexToRgb(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgba(hex, a) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function toHsl(hex) {
    const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h / 6, s, l];
  }

  function fromHsl(h, s, l) {
    const f = (n) => {
      const k = (n + h * 12) % 12;
      const a = s * Math.min(l, 1 - l);
      return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
    };
    return "#" + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  // 彩度・明度をずらした色
  function tone(hex, ds, dl) {
    const [h, s, l] = toHsl(hex);
    return fromHsl(h, clamp01(s + ds), clamp01(l + dl));
  }

  // 雲のようなまだら模様(本体・外枠・テキスト欄の紙)。大小のぼかしたムラを重ねて作る。
  const textureCache = new Map();
  function clouds(w, h, pal, seed, scale, grain = 10) {
    const key = [w, h, pal.base, pal.light, pal.dark, pal.amp, seed, scale, grain].join("|");
    if (textureCache.has(key)) return textureCache.get(key);
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w * scale));
    c.height = Math.max(1, Math.round(h * scale));
    const g = c.getContext("2d");
    g.scale(scale, scale);
    g.fillStyle = pal.base;
    g.fillRect(0, 0, w, h);
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = "high";
    const rand = rng(seed);
    const light = hexToRgb(pal.light);
    const dark = hexToRgb(pal.dark);
    [
      [230, 0.55],
      [110, 0.45],
      [46, 0.3],
      [16, 0.18],
    ].forEach(([cell, amp]) => {
      const gw = Math.ceil(w / cell) + 3;
      const gh = Math.ceil(h / cell) + 3;
      const n = document.createElement("canvas");
      n.width = gw;
      n.height = gh;
      const ng = n.getContext("2d");
      const id = ng.createImageData(gw, gh);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = rand() * 2 - 1;
        const col = v > 0 ? light : dark;
        id.data[i] = col[0];
        id.data[i + 1] = col[1];
        id.data[i + 2] = col[2];
        id.data[i + 3] = Math.min(1, Math.abs(v) * amp * (pal.amp || 1)) * 255;
      }
      ng.putImageData(id, 0, 0);
      g.drawImage(n, -cell * 1.5, -cell * 1.5, gw * cell, gh * cell);
    });
    if (grain) {
      const img = g.getImageData(0, 0, c.width, c.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (rand() - 0.5) * grain;
        d[i] += v;
        d[i + 1] += v;
        d[i + 2] += v;
      }
      g.putImageData(img, 0, 0);
    }
    if (textureCache.size > 40) textureCache.clear();
    textureCache.set(key, c);
    return c;
  }

  function drawClouds(ctx, x, y, w, h, pal, seed, grain) {
    ctx.drawImage(clouds(w, h, pal, seed, ctx.getTransform().a, grain), x, y, w, h);
  }

  // 本体色からまだら用の明暗を作る
  function bodyPalette(frame) {
    return { base: frame, light: tone(frame, 0.02, 0.16), dark: tone(frame, 0.12, -0.16), amp: 1.9 };
  }

  // 台形(面取りした辺)を塗る
  function quad(ctx, pts, fill) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => ctx[i ? "lineTo" : "moveTo"](x, y));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // 辺ごとに明暗をつけた額縁(左上が明るく右下が暗い)。t は縁の太さ。
  function bevelSides(ctx, x, y, w, h, t, light, lightSide, darkSide, dark) {
    quad(ctx, [[x, y], [x + w, y], [x + w - t, y + t], [x + t, y + t]], light);
    quad(ctx, [[x, y], [x + t, y + t], [x + t, y + h - t], [x, y + h]], lightSide);
    quad(ctx, [[x + w, y], [x + w, y + h], [x + w - t, y + h - t], [x + w - t, y + t]], darkSide);
    quad(ctx, [[x, y + h], [x + t, y + h - t], [x + w - t, y + h - t], [x + w, y + h]], dark);
  }

  // 横幅が足りないときは横方向に縮めて描く(本物のカード名と同じ処理)
  function fitText(ctx, text, x, y, maxW, align, draw) {
    const w = ctx.measureText(text).width;
    const sx = w > maxW ? maxW / w : 1;
    ctx.save();
    const ax = align === "right" ? x - Math.min(w, maxW) : align === "center" ? x - Math.min(w, maxW) / 2 : x;
    ctx.translate(ax, y);
    ctx.scale(sx, 1);
    ctx.textAlign = "left";
    draw(0, 0);
    ctx.restore();
  }

  function starPath(ctx, cx, cy, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? inner : outer;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
  }

  // ---------------- パーツ ----------------

  // 青紫の外枠と、本体(カード種類の色)
  function drawBase(ctx, card, frame, seed) {
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 24);
    ctx.clip();
    drawClouds(ctx, 0, 0, W, H, COLORS.border, seed, 14);

    // 外周はうっすら明るく、本体に近いほど暗く(外枠の丸み)
    const b = LAYOUT.body;
    const edge = (x0, y0, x1, y1, rect, from, to) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, from);
      g.addColorStop(1, to);
      ctx.fillStyle = g;
      ctx.fillRect(...rect);
    };
    const hi = "rgba(200,202,232,0.35)";
    const clear = "rgba(0,0,0,0)";
    edge(0, 0, 10, 0, [0, 0, 10, H], hi, clear);
    edge(W, 0, W - 10, 0, [W - 10, 0, 10, H], hi, clear);
    edge(0, 0, 0, 10, [0, 0, W, 10], hi, clear);
    edge(0, H, 0, H - 10, [0, H - 10, W, 10], hi, clear);
    const sh = "rgba(8,10,28,0.8)";
    edge(b.x, 0, b.x - 22, 0, [b.x - 22, 0, 22, H], sh, clear);
    edge(b.x + b.w, 0, b.x + b.w + 22, 0, [b.x + b.w, 0, 22, H], sh, clear);
    edge(0, b.y, 0, b.y - 22, [0, b.y - 22, W, 22], sh, clear);
    edge(0, b.y + b.h, 0, b.y + b.h + 22, [0, b.y + b.h, W, 22], sh, clear);

    drawClouds(ctx, b.x, b.y, b.w, b.h, bodyPalette(frame), seed + 1, 10);
    // 本体の縁:外側に細い影線、内側の上と左に細いハイライト
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(38,26,24,0.95)";
    ctx.strokeRect(b.x - 1.25, b.y - 1.25, b.w + 2.5, b.h + 2.5);
    ctx.fillStyle = "rgba(245,212,176,0.55)";
    ctx.fillRect(b.x, b.y, b.w, 2.5);
    ctx.fillRect(b.x, b.y, 2.5, b.h);
    ctx.restore();
  }

  // 名前欄:少し濃い色の板。上と左に明るい縁、下と右に影の縁。
  function drawNameBox(ctx, card, frame, seed) {
    const n = LAYOUT.nameBox;
    const plate = tone(frame, 0.06, -0.05);
    drawClouds(ctx, n.x, n.y, n.w, n.h, bodyPalette(plate), seed + 2, 10);
    bevelSides(ctx, n.x, n.y, n.w, n.h, 8, rgba(tone(frame, -0.1, 0.2), 0.95), rgba(tone(frame, -0.1, 0.16), 0.9), rgba(tone(frame, 0, -0.33), 0.9), rgba(tone(frame, 0, -0.36), 0.92));
    // 板の下と右に落ちる影
    ctx.fillStyle = "rgba(60,32,18,0.35)";
    ctx.fillRect(n.x + 6, n.y + n.h, n.w - 4, 3);
    ctx.fillRect(n.x + n.w, n.y + 6, 3, n.h - 3);

    const name = card.name.trim() || "カード名";
    const L = LAYOUT.name;
    ctx.font = `600 ${L.size}px ${SANS}`;
    ctx.textBaseline = "middle";
    const maxW = LAYOUT.attr.cx - LAYOUT.attr.r - 18 - L.x;
    fitText(ctx, name, L.x, L.y + 2, maxW, "left", (x, y) => {
      ctx.save();
      if (card.nameColor === "black") {
        ctx.fillStyle = COLORS.ink;
      } else {
        ctx.shadowColor = "rgba(60,25,5,0.7)";
        ctx.shadowOffsetX = 1.5;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        if (card.nameColor === "white") {
          ctx.fillStyle = "#fbf8f2";
        } else {
          const g = ctx.createLinearGradient(0, y - L.size / 2, 0, y + L.size / 2);
          g.addColorStop(0, "#feee9e");
          g.addColorStop(0.5, "#fbe07a");
          g.addColorStop(1, "#f2c957");
          ctx.fillStyle = g;
        }
      }
      ctx.fillText(name, x, y);
      ctx.restore();
    });
  }

  // 属性:金の輪+つやのある玉+白い文字(上にふりがな)
  function drawAttribute(ctx, card, images) {
    const { cx, cy, r } = LAYOUT.attr;
    const def = CardFormat.ATTRIBUTES[card.attribute];
    const custom = card.attribute === "custom";
    const color = custom ? card.customAttribute.color : def.color;
    const glyph = custom ? card.customAttribute.text : card.attribute;
    const ruby = custom ? "" : def.ruby || "";
    const img = custom ? images.attribute : null;

    ctx.save();
    ctx.shadowColor = "rgba(50,25,10,0.55)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const ring = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    ring.addColorStop(0, "#fdf0b8");
    ring.addColorStop(0.35, "#f3cf6a");
    ring.addColorStop(0.65, "#d9a13a");
    ring.addColorStop(1, "#f6d98a");
    ctx.fillStyle = ring;
    ctx.fill();
    ctx.restore();

    const ri = r - 6.5;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, ri, 0, Math.PI * 2);
    ctx.clip();
    if (img) {
      const s = Math.max((ri * 2) / img.width, (ri * 2) / img.height);
      ctx.drawImage(img, cx - (img.width * s) / 2, cy - (img.height * s) / 2, img.width * s, img.height * s);
    } else {
      const g = ctx.createRadialGradient(cx - ri * 0.45, cy - ri * 0.55, ri * 0.05, cx, cy, ri * 1.05);
      g.addColorStop(0, tone(color, 0, 0.3));
      g.addColorStop(0.35, color);
      g.addColorStop(0.75, tone(color, 0, -0.3));
      g.addColorStop(1, tone(color, 0, -0.4));
      ctx.fillStyle = g;
      ctx.fillRect(cx - ri, cy - ri, ri * 2, ri * 2);
    }
    ctx.restore();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(110,60,10,0.9)";
    ctx.beginPath();
    ctx.arc(cx, cy, ri, 0, Math.PI * 2);
    ctx.stroke();

    if (glyph && !img) {
      const fill = ctx.createLinearGradient(0, cy - 30, 0, cy + 36);
      fill.addColorStop(0, "#fffaf2");
      fill.addColorStop(1, "#f0d9cb");
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(20,8,0,0.6)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = fill;
      ctx.font = `700 ${glyph.length > 1 ? 40 : 64}px ${SANS}`;
      ctx.fillText(glyph, cx, cy + (ruby ? 7 : 3));
      if (ruby) {
        ctx.font = `700 14px ${SANS}`;
        const step = Math.min(17, 60 / ruby.length);
        [...ruby].forEach((ch, i) => ctx.fillText(ch, cx + (i - (ruby.length - 1) / 2) * step, cy - 34));
      }
      ctx.restore();
    }
  }

  function drawStars(ctx, card, type) {
    const s = LAYOUT.stars;
    if (!type.monster) {
      const label = card.cardType === "spell" ? "【魔法カード】" : "【罠カード】";
      ctx.font = `700 40px ${SANS}`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.ink;
      ctx.fillText(label, s.right + s.r, s.y);
      ctx.textAlign = "left";
      return;
    }
    const xyz = card.cardType === "xyz";
    for (let i = 0; i < card.level; i++) {
      // エクシーズはランクなので左から、それ以外は右から並べる
      const cx = xyz ? LAYOUT.nameBox.x + 38 + i * s.gap : s.right - i * s.gap;
      const cy = s.y;
      ctx.save();
      ctx.shadowColor = "rgba(30,6,0,0.75)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      const g = ctx.createRadialGradient(cx - 9, cy - 11, 2, cx, cy, s.r);
      if (xyz) {
        g.addColorStop(0, "#6a6a6a");
        g.addColorStop(1, "#050505");
      } else {
        g.addColorStop(0, "#ffc83c");
        g.addColorStop(0.4, "#f99306");
        g.addColorStop(0.78, "#e2480c");
        g.addColorStop(1, "#8e2006");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      starPath(ctx, cx, cy + 1.5, s.r * 0.8, s.r * 0.36);
      const sg = ctx.createLinearGradient(0, cy - s.r, 0, cy + s.r);
      sg.addColorStop(0, "#fff3a6");
      sg.addColorStop(0.55, "#fbd565");
      sg.addColorStop(1, "#f3ad20");
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(170,70,0,0.75)";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.ellipse(cx - 9, cy - 15, 9, 4.5, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // イラスト枠:青灰色の縁を黒い細線ではさみ、本体に影を落とす
  function drawArt(ctx, card, images, seed) {
    const f = LAYOUT.artFrame;
    const a = LAYOUT.art;
    ctx.save();
    ctx.shadowColor = "rgba(45,22,8,0.75)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = "#1c1921";
    ctx.fillRect(f.x, f.y, f.w, f.h);
    ctx.restore();
    const t = a.x - f.x;
    drawClouds(ctx, f.x + 3, f.y + 3, f.w - 6, f.h - 6, COLORS.slate, seed + 4, 8);
    bevelSides(ctx, f.x + 3, f.y + 3, f.w - 6, f.h - 6, t - 5, "rgba(150,165,205,0.35)", "rgba(150,165,205,0.22)", "rgba(10,14,35,0.25)", "rgba(10,14,35,0.35)");
    ctx.fillStyle = "#1c1921";
    ctx.fillRect(a.x - 3, a.y - 3, a.w + 6, a.h + 6);

    ctx.save();
    ctx.beginPath();
    ctx.rect(a.x, a.y, a.w, a.h);
    ctx.clip();
    const img = images.art;
    if (img) {
      const art = card.art;
      const s = Math.max(a.w / img.width, a.h / img.height) * art.zoom;
      const dw = img.width * s;
      const dh = img.height * s;
      ctx.drawImage(img, a.x + (a.w - dw) / 2 + art.x * a.w, a.y + (a.h - dh) / 2 + art.y * a.h, dw, dh);
    } else {
      const g = ctx.createLinearGradient(a.x, a.y, a.x, a.y + a.h);
      g.addColorStop(0, "#2a2f45");
      g.addColorStop(1, "#11131d");
      ctx.fillStyle = g;
      ctx.fillRect(a.x, a.y, a.w, a.h);
      // 人物シルエット
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(a.x + a.w / 2, a.y + a.h * 0.4, a.w * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(a.x + a.w / 2, a.y + a.h * 0.98, a.w * 0.34, a.h * 0.38, 0, Math.PI, 0);
      ctx.fill();
      ctx.font = `500 30px ${SANS}`;
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText("写真・イラストを追加", a.x + a.w / 2, a.y + a.h * 0.72);
      ctx.textAlign = "left";
    }
    drawArtEffect(ctx, card, a, seed);
    ctx.restore();
  }

  // 写真に「カードのイラストっぽさ」を足す光の演出
  function drawArtEffect(ctx, card, a, seed) {
    const fx = CardFormat.ART_EFFECTS[card.art.effect];
    const t = card.art.intensity;
    const cx = a.x + a.w / 2;
    const cy = a.y + a.h / 2;

    // 周辺減光
    const v = ctx.createRadialGradient(cx, cy, a.w * 0.35, cx, cy, a.w * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, `rgba(0,0,0,${0.15 + 0.3 * t})`);
    ctx.fillStyle = v;
    ctx.fillRect(a.x, a.y, a.w, a.h);
    if (!fx.color || t <= 0) return;

    const rand = rng(seed + 7);
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    // 縁からにじむ光
    const glow = ctx.createRadialGradient(cx, cy, a.w * 0.3, cx, cy, a.w * 0.72);
    glow.addColorStop(0, rgba(fx.color, 0));
    glow.addColorStop(1, rgba(fx.color, 0.55 * t));
    ctx.fillStyle = glow;
    ctx.fillRect(a.x, a.y, a.w, a.h);

    // 魔法陣
    ctx.shadowColor = fx.color;
    ctx.shadowBlur = 14;
    ctx.strokeStyle = rgba(fx.color, 0.55 * t);
    const R = a.w * 0.45;
    ctx.lineWidth = 3;
    [R, R * 0.9].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.lineWidth = 2;
    for (let i = 0; i < 48; i++) {
      const ang = (i / 48) * Math.PI * 2;
      const len = i % 4 === 0 ? 14 : 6;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * R * 0.9, cy + Math.sin(ang) * R * 0.9);
      ctx.lineTo(cx + Math.cos(ang) * (R * 0.9 + len), cy + Math.sin(ang) * (R * 0.9 + len));
      ctx.stroke();
    }

    // 光の帯
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const y0 = a.y + a.h * (0.25 + rand() * 0.6);
      ctx.strokeStyle = rgba(fx.color, (0.35 + rand() * 0.3) * t);
      ctx.beginPath();
      ctx.moveTo(a.x - 20, y0);
      ctx.bezierCurveTo(a.x + a.w * 0.3, y0 - 160 * rand(), a.x + a.w * 0.7, y0 + 160 * rand(), a.x + a.w + 20, y0 - 80 + 160 * rand());
      ctx.stroke();
    }

    // 光の粒(中央の顔まわりは避ける)
    ctx.shadowBlur = 8;
    for (let i = 0; i < 170; i++) {
      const px = a.x + rand() * a.w;
      const py = a.y + rand() * a.h;
      const dx = (px - cx) / a.w;
      const dy = (py - cy + a.h * 0.08) / a.h;
      if (dx * dx + dy * dy < 0.045) continue;
      const r = 0.8 + rand() * 2.6;
      ctx.fillStyle = rand() > 0.4 ? rgba(fx.color, 0.9 * t) : `rgba(255,255,255,${0.85 * t})`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // きらめき(十字)
    for (let i = 0; i < 10; i++) {
      const px = a.x + rand() * a.w;
      const py = a.y + rand() * a.h;
      const dx = (px - cx) / a.w;
      const dy = (py - cy) / a.h;
      if (dx * dx + dy * dy < 0.06) continue;
      const L = 8 + rand() * 16;
      ctx.fillStyle = `rgba(255,255,255,${0.9 * t})`;
      ctx.beginPath();
      ctx.moveTo(px, py - L);
      ctx.lineTo(px + L * 0.18, py);
      ctx.lineTo(px, py + L);
      ctx.lineTo(px - L * 0.18, py);
      ctx.closePath();
      ctx.moveTo(px - L, py);
      ctx.lineTo(px, py + L * 0.18);
      ctx.lineTo(px + L, py);
      ctx.lineTo(px, py - L * 0.18);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // ---- 効果テキストの組版 ----

  const NO_LINE_START = "、。，．,.・：:；;？?！!」』）)】〕〉》ー―…‥ゃゅょっぁぃぅぇぉゎャュョッァィゥェォヮヵヶ々";
  const NO_LINE_END = "「『（(【〔〈《";
  const HANG_PREFIX = /^([①-⑳❶-❿]|[0-9０-９]+[.．)）])\s*[:：]?\s*/;

  function tokenize(text) {
    return text.match(/[A-Za-z0-9.,'%/+\-]+|\s+|./gu) || [];
  }

  // 1段落を幅 maxW で折り返す。indent はぶら下げ(2行目以降の字下げ)幅。
  function wrapParagraph(ctx, para, maxW) {
    const m = para.match(HANG_PREFIX);
    const indent = m ? ctx.measureText(m[0]).width : 0;
    const lines = [];
    let line = "";
    let width = maxW;
    const push = () => {
      lines.push({ text: line, indent: lines.length ? indent : 0 });
      line = "";
      width = maxW - indent;
    };
    tokenize(para).forEach((tok) => {
      if (!line && /^\s+$/.test(tok)) return;
      if (ctx.measureText(line + tok).width <= width) {
        line += tok;
        return;
      }
      if (NO_LINE_START.includes(tok[0]) && line) {
        line += tok; // 行頭禁則:はみ出しても前の行にぶら下げる
        return;
      }
      // 行末禁則:開きかっこで終わる行は、かっこを次の行へ送る
      let carry = "";
      if (line.length > 1 && NO_LINE_END.includes(line[line.length - 1])) {
        carry = line[line.length - 1];
        line = line.slice(0, -1);
      }
      if (line) push();
      line = carry;
      if (/^\s+$/.test(tok)) return;
      // 1トークンで幅を超える(長い英単語)ときは文字単位で切る
      if (ctx.measureText(tok).width > width) {
        for (const ch of tok) {
          if (ctx.measureText(line + ch).width > width && line) push();
          line += ch;
        }
      } else {
        line += tok;
      }
    });
    if (line || !lines.length) push();
    return lines;
  }

  // 収まるまで「文字サイズを下げる → 長体(横に縮める)をかける」を順に試す
  const EFFECT_FITS = [];
  for (let size = 27; size >= 21; size -= 0.5) EFFECT_FITS.push([size, 1]);
  for (let size = 23; size >= 14; size -= 0.5) EFFECT_FITS.push([size, 0.86]);

  function layoutEffect(ctx, text, maxW, maxH, font) {
    for (let i = 0; i < EFFECT_FITS.length; i++) {
      const [size, squeeze] = EFFECT_FITS[i];
      ctx.font = `500 ${size}px ${font}`;
      const lh = size * 1.34;
      const gap = size * 0.18;
      const items = [];
      let h = 0;
      text.split("\n").forEach((raw, idx) => {
        const p = raw.trim();
        if (/^[-ー―=＝]{3,}$/.test(p)) {
          items.push({ sep: true, y: h + gap });
          h += gap * 2;
          return;
        }
        if (!p) return;
        if (idx && items.length && !items[items.length - 1].sep) h += gap;
        wrapParagraph(ctx, p, maxW / squeeze).forEach((l) => {
          items.push({ text: l.text, indent: l.indent, y: h });
          h += lh;
        });
      });
      if (h <= maxH || i === EFFECT_FITS.length - 1) return { size, squeeze, lh, items };
    }
  }

  // テキスト欄の縁:オレンジの丸棒(中央が明るい)を黒い細線ではさむ
  const TUBE = [
    [0, "#3a2210"],
    [0.1, "#7a3208"],
    [0.28, "#e57f14"],
    [0.48, "#fbb444"],
    [0.66, "#f08c1c"],
    [0.86, "#a8480a"],
    [1, "#3a2210"],
  ];

  function tube(ctx, x, y, w, h, vertical) {
    const g = vertical ? ctx.createLinearGradient(x, 0, x + w, 0) : ctx.createLinearGradient(0, y, 0, y + h);
    TUBE.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }

  // 四隅の赤い角金具
  function cornerSquare(ctx, cx, cy) {
    const s = 14;
    ctx.save();
    ctx.shadowColor = "rgba(40,15,5,0.6)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1.5;
    const g = ctx.createRadialGradient(cx - 4, cy - 5, 1, cx, cy, s * 1.4);
    g.addColorStop(0, "#f0804a");
    g.addColorStop(0.55, "#cf4d1c");
    g.addColorStop(1, "#8e2c0c");
    ctx.fillStyle = g;
    ctx.fillRect(cx - s, cy - s, s * 2, s * 2);
    ctx.restore();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#3d1606";
    ctx.strokeRect(cx - s, cy - s, s * 2, s * 2);
    ctx.fillStyle = "rgba(255,190,140,0.35)";
    ctx.fillRect(cx - s + 1.5, cy - s + 1.5, s * 2 - 3, 1.5);
    // うっすらした渦の刻印
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(100,28,5,0.55)";
    ctx.beginPath();
    ctx.arc(cx + 1, cy + 1, 6, Math.PI * 0.9, Math.PI * 2.1);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,160,110,0.35)";
    ctx.beginPath();
    ctx.arc(cx, cy, 6, Math.PI * 0.9, Math.PI * 2.1);
    ctx.stroke();
  }

  function drawTextBox(ctx, card, type, seed) {
    const t = LAYOUT.textBox;
    const T = 14;
    ctx.save();
    ctx.shadowColor = "rgba(60,30,10,0.55)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#3a2412";
    ctx.fillRect(t.x, t.y, t.w, t.h);
    ctx.restore();
    drawClouds(ctx, t.x + T, t.y + T, t.w - T * 2, t.h - T * 2, COLORS.parchment, seed + 3, 9);
    // 紙のふちをほんの少し暗く
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(120,80,50,0.18)";
    ctx.strokeRect(t.x + T + 1.5, t.y + T + 1.5, t.w - T * 2 - 3, t.h - T * 2 - 3);

    tube(ctx, t.x, t.y, t.w, T, false);
    tube(ctx, t.x, t.y + t.h - T, t.w, T, false);
    tube(ctx, t.x, t.y, T, t.h, true);
    tube(ctx, t.x + t.w - T, t.y, T, t.h, true);
    const c = T / 2;
    [
      [t.x + c, t.y + c],
      [t.x + t.w - c, t.y + c],
      [t.x + c, t.y + t.h - c],
      [t.x + t.w - c, t.y + t.h - c],
    ].forEach(([x, y]) => cornerSquare(ctx, x, y));

    const L = LAYOUT.text;
    ctx.fillStyle = COLORS.ink;
    ctx.textBaseline = "top";

    let top = L.top;
    const header = CardFormat.typeLine(card);
    if (header) {
      ctx.font = `700 29px ${SANS}`;
      fitText(ctx, header, L.left - 6, L.header, L.right - L.left, "left", (x, y) => ctx.fillText(header, x, y));
    } else {
      top = L.header + 4;
    }

    const bottom = type.monster ? L.rule - 8 : t.y + t.h - T - 14;
    const text = card.effect.trim() || (type.monster ? "(効果テキストを入力)" : "(カードの効果を入力)");
    const lay = layoutEffect(ctx, text, L.right - L.left, bottom - top, SANS);
    ctx.font = `500 ${lay.size}px ${SANS}`;
    ctx.fillStyle = card.effect.trim() ? COLORS.ink : "rgba(28,20,16,0.4)";
    lay.items.forEach((it) => {
      const y = top + it.y;
      if (y + lay.size > bottom + 4) return;
      if (it.sep) {
        ctx.fillStyle = "#3b2a1e";
        ctx.fillRect(L.left - 2, y, L.right - L.left + 4, 2);
        ctx.fillStyle = COLORS.ink;
        return;
      }
      ctx.save();
      ctx.translate(L.left, y);
      ctx.scale(lay.squeeze, 1);
      ctx.fillText(it.text, it.indent, 0);
      ctx.restore();
    });

    if (type.monster) {
      ctx.fillStyle = "#3b2a1e";
      ctx.fillRect(L.left - 2, L.rule, L.right - L.left + 4, 2);
      ctx.fillStyle = COLORS.ink;
      ctx.font = `500 38px ${SERIF_LATIN}`;
      ctx.textBaseline = "alphabetic";
      const stats = `ATK/${card.atk || "?"}  DEF/${card.def || "?"}`;
      fitText(ctx, stats, L.right - 6, L.stats, L.right - L.left, "right", (x, y) => ctx.fillText(stats, x, y));
    }
  }

  function drawFooter(ctx, card, frame) {
    const ink = toHsl(frame)[2] < 0.3 ? "#f2eee6" : COLORS.ink;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "right";
    ctx.fillStyle = ink;
    if (card.cardCode.trim()) {
      ctx.font = `500 28px ${SERIF_LATIN}`;
      ctx.fillText(card.cardCode.trim(), LAYOUT.code.x, LAYOUT.code.y);
    }
    if (card.copyright.trim()) {
      ctx.font = `500 23px ${SERIF_LATIN}`;
      ctx.fillText(card.copyright.trim(), LAYOUT.copyright.x, LAYOUT.copyright.y);
    }
    ctx.textAlign = "left";
  }

  // ---------------- 公開 API ----------------

  // images: { art: HTMLImageElement|null, attribute: HTMLImageElement|null }
  function render(canvas, rawCard, images = {}, scale = 1) {
    const card = CardFormat.normalize(rawCard);
    const type = CardFormat.CARD_TYPES[card.cardType];
    const frame = card.frameColor || type.frame;
    const seed = hashSeed(card.id);
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingQuality = "high";

    drawBase(ctx, card, frame, seed);
    drawNameBox(ctx, card, frame, seed);
    drawAttribute(ctx, card, images);
    drawStars(ctx, card, type);
    drawArt(ctx, card, images, seed);
    drawTextBox(ctx, card, type, seed);
    drawFooter(ctx, card, frame);
    return canvas;
  }

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function loadFonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load(`600 60px "Noto Sans JP"`),
      document.fonts.load(`700 29px "Noto Sans JP"`),
      document.fonts.load(`500 27px "Noto Sans JP"`),
            document.fonts.load(`500 28px "Noto Serif"`),
    ]).catch(() => {});
  }

  return { W, H, LAYOUT, render, loadImage, loadFonts };
})();

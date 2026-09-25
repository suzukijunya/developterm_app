// カード JSON(card_format.js の形式)を canvas に描く。
// 座標はすべてカード1枚 = 1000 x 1460 の論理座標で書き、scale で出力解像度を変える。

const CardRenderer = (() => {
  const W = 1000;
  const H = 1460;
  const SERIF = '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif';
  const SANS = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

  const LAYOUT = {
    body: { x: 32, y: 32, w: 936, h: 1396 },
    nameBox: { x: 58, y: 58, w: 884, h: 104 },
    attr: { cx: 880, cy: 110, r: 44 },
    stars: { y: 208, r: 26, gap: 58, right: 912 },
    artFrame: { x: 100, y: 246, w: 800, h: 800 },
    art: { x: 113, y: 259, w: 774, h: 774 },
    code: { x: 886, y: 1082 },
    textBox: { x: 58, y: 1096, w: 884, h: 296 },
    copyright: { x: 880, y: 1418 },
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

  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    const f = (c) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }

  function rgba(hex, a) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  function isLight(hex) {
    const [r, g, b] = hexToRgb(hex);
    return r * 0.299 + g * 0.587 + b * 0.114 > 150;
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

  // まだらな紙・石のような質感。同じ色・大きさ・シードなら使い回す。
  const textureCache = new Map();
  function mottled(w, h, base, seed, strength, scale) {
    const key = [w, h, base, seed, strength, scale].join("|");
    if (textureCache.has(key)) return textureCache.get(key);
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w * scale));
    c.height = Math.max(1, Math.round(h * scale));
    const g = c.getContext("2d");
    g.scale(scale, scale);
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    const rand = rng(seed);
    const blobs = Math.round((w * h) / 2600);
    for (let i = 0; i < blobs; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 12 + rand() * 90;
      const light = rand() > 0.5;
      const a = rand() * 0.09 * strength;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, light ? `rgba(255,245,225,${a})` : `rgba(40,20,10,${a})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const img = g.getImageData(0, 0, c.width, c.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (rand() - 0.5) * 16 * strength;
      d[i] += n;
      d[i + 1] += n;
      d[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
    if (textureCache.size > 40) textureCache.clear();
    textureCache.set(key, c);
    return c;
  }

  function drawTexture(ctx, x, y, w, h, base, seed, strength) {
    const scale = ctx.getTransform().a;
    ctx.drawImage(mottled(w, h, base, seed, strength, scale), x, y, w, h);
  }

  // くぼんだ(または盛り上がった)枠線
  function bevel(ctx, x, y, w, h, base, depth, inset) {
    const light = shade(base, 0.45);
    const dark = shade(base, -0.55);
    ctx.lineWidth = depth;
    const o = depth / 2;
    ctx.strokeStyle = inset ? dark : light;
    ctx.beginPath();
    ctx.moveTo(x + o, y + h - o);
    ctx.lineTo(x + o, y + o);
    ctx.lineTo(x + w - o, y + o);
    ctx.stroke();
    ctx.strokeStyle = inset ? light : dark;
    ctx.beginPath();
    ctx.moveTo(x + w - o, y + o);
    ctx.lineTo(x + w - o, y + h - o);
    ctx.lineTo(x + o, y + h - o);
    ctx.stroke();
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

  function drawBase(ctx, card, frame, seed) {
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 26);
    ctx.clip();
    drawTexture(ctx, 0, 0, W, H, "#5b5876", seed, 1.4);
    const b = LAYOUT.body;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(b.x - 3, b.y - 3, b.w + 6, b.h + 6);
    drawTexture(ctx, b.x, b.y, b.w, b.h, frame, seed + 1, 1);
    ctx.restore();
  }

  function drawNameBox(ctx, card, frame, seed) {
    const n = LAYOUT.nameBox;
    drawTexture(ctx, n.x, n.y, n.w, n.h, shade(frame, 0.08), seed + 2, 0.8);
    bevel(ctx, n.x, n.y, n.w, n.h, frame, 5, true);
    bevel(ctx, n.x + 5, n.y + 5, n.w - 10, n.h - 10, frame, 2, false);

    const name = card.name.trim() || "カード名";
    ctx.font = `900 60px ${SERIF}`;
    ctx.textBaseline = "middle";
    const maxW = LAYOUT.attr.cx - LAYOUT.attr.r - 24 - (n.x + 24);
    const y = n.y + n.h / 2 + 3;
    fitText(ctx, name, n.x + 24, y, maxW, "left", (x, yy) => {
      if (card.nameColor === "gold") {
        const g = ctx.createLinearGradient(0, yy - 30, 0, yy + 30);
        g.addColorStop(0, "#fff6c9");
        g.addColorStop(0.45, "#f1cf6b");
        g.addColorStop(0.55, "#d9a83a");
        g.addColorStop(1, "#fbe7a0");
        ctx.lineJoin = "round";
        ctx.lineWidth = 7;
        ctx.strokeStyle = "rgba(60,30,10,0.85)";
        ctx.strokeText(name, x, yy);
        ctx.fillStyle = g;
      } else if (card.nameColor === "white") {
        ctx.lineJoin = "round";
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(0,0,0,0.75)";
        ctx.strokeText(name, x, yy);
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = "#1a1310";
      }
      ctx.fillText(name, x, yy);
    });
  }

  function drawAttribute(ctx, card, images) {
    const { cx, cy, r } = LAYOUT.attr;
    const def = CardFormat.ATTRIBUTES[card.attribute];
    const custom = card.attribute === "custom";
    const color = custom ? card.customAttribute.color : def.color;
    const glyph = custom ? card.customAttribute.text : card.attribute;
    const img = custom ? images.attribute : null;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = shade(color, -0.4);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.clip();
    if (img) {
      const s = Math.max((r * 2) / img.width, (r * 2) / img.height);
      ctx.drawImage(img, cx - (img.width * s) / 2, cy - (img.height * s) / 2, img.width * s, img.height * s);
    } else {
      const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      g.addColorStop(0, shade(color, 0.55));
      g.addColorStop(0.55, color);
      g.addColorStop(1, shade(color, -0.45));
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    // ガラス玉のようなハイライト
    const hl = ctx.createLinearGradient(0, cy - r, 0, cy + r * 0.2);
    hl.addColorStop(0, "rgba(255,255,255,0.55)");
    hl.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.ellipse(cx, cy - r * 0.42, r * 0.72, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,240,200,0.8)";
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
    ctx.stroke();

    if (glyph && !img) {
      ctx.font = `900 ${glyph.length > 1 ? 34 : 50}px ${SERIF}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(30,15,5,0.8)";
      ctx.strokeText(glyph, cx, cy + 3);
      ctx.fillStyle = "#fffaf0";
      ctx.fillText(glyph, cx, cy + 3);
      ctx.textAlign = "left";
    }
  }

  function drawStars(ctx, card, type) {
    const s = LAYOUT.stars;
    if (!type.monster) {
      const label = card.cardType === "spell" ? "【魔法カード】" : "【罠カード】";
      ctx.font = `700 40px ${SERIF}`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1a1310";
      ctx.fillText(label, s.right, s.y);
      ctx.textAlign = "left";
      return;
    }
    const n = card.level;
    const xyz = card.cardType === "xyz";
    for (let i = 0; i < n; i++) {
      // エクシーズはランクなので左から、それ以外は右から並べる
      const cx = xyz ? LAYOUT.nameBox.x + 30 + i * s.gap : s.right - s.r - i * s.gap;
      const cy = s.y;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      const g = ctx.createRadialGradient(cx - 8, cy - 9, 3, cx, cy, s.r);
      if (xyz) {
        g.addColorStop(0, "#5a5a5a");
        g.addColorStop(1, "#050505");
      } else {
        g.addColorStop(0, "#ffb347");
        g.addColorStop(0.6, "#e0561c");
        g.addColorStop(1, "#7a1f05");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      starPath(ctx, cx, cy + 1, s.r * 0.72, s.r * 0.3);
      const sg = ctx.createLinearGradient(0, cy - s.r, 0, cy + s.r);
      sg.addColorStop(0, "#fff7b0");
      sg.addColorStop(1, "#f2b100");
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(120,50,0,0.7)";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.ellipse(cx - 6, cy - 12, 10, 5, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawArt(ctx, card, images, seed) {
    const f = LAYOUT.artFrame;
    const a = LAYOUT.art;
    ctx.fillStyle = "#3d4a6b";
    ctx.fillRect(f.x, f.y, f.w, f.h);
    bevel(ctx, f.x, f.y, f.w, f.h, "#6a7aa3", 6, false);
    bevel(ctx, a.x - 3, a.y - 3, a.w + 6, a.h + 6, "#6a7aa3", 3, true);

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
      const lh = size * 1.38;
      const gap = size * 0.3;
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

  function drawTextBox(ctx, card, type, seed) {
    const t = LAYOUT.textBox;
    const border = "#d0671e";
    drawTexture(ctx, t.x, t.y, t.w, t.h, "#ece0c9", seed + 3, 0.7);
    ctx.lineWidth = 7;
    ctx.strokeStyle = border;
    ctx.strokeRect(t.x + 3.5, t.y + 3.5, t.w - 7, t.h - 7);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = shade(border, -0.4);
    ctx.strokeRect(t.x + 9, t.y + 9, t.w - 18, t.h - 18);
    [
      [t.x, t.y],
      [t.x + t.w, t.y],
      [t.x, t.y + t.h],
      [t.x + t.w, t.y + t.h],
    ].forEach(([x, y]) => {
      ctx.fillStyle = shade(border, -0.15);
      ctx.fillRect(x - 11, y - 11, 22, 22);
      ctx.strokeStyle = shade(border, -0.55);
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 11, y - 11, 22, 22);
      ctx.fillStyle = shade(border, 0.35);
      ctx.fillRect(x - 4, y - 4, 8, 8);
    });

    const left = t.x + 28;
    const right = t.x + t.w - 28;
    let top = t.y + 28;
    ctx.fillStyle = "#1a1310";
    ctx.textBaseline = "top";

    const header = CardFormat.typeLine(card);
    if (header) {
      ctx.font = `700 29px ${SANS}`;
      fitText(ctx, header, left - 8, top, right - left, "left", (x, y) => ctx.fillText(header, x, y));
      top += 42;
    }

    const statsY = t.y + t.h - 62;
    const bottom = type.monster ? statsY - 14 : t.y + t.h - 26;
    const text = card.effect.trim() || (type.monster ? "(効果テキストを入力)" : "(カードの効果を入力)");
    const lay = layoutEffect(ctx, text, right - left, bottom - top, SANS);
    ctx.font = `500 ${lay.size}px ${SANS}`;
    ctx.fillStyle = card.effect.trim() ? "#1a1310" : "rgba(26,19,16,0.4)";
    lay.items.forEach((it) => {
      const y = top + it.y;
      if (y + lay.size > bottom + 4) return;
      if (it.sep) {
        ctx.fillStyle = "rgba(26,19,16,0.7)";
        ctx.fillRect(left, y, right - left, 1.6);
        ctx.fillStyle = "#1a1310";
        return;
      }
      ctx.save();
      ctx.translate(left, y);
      ctx.scale(lay.squeeze, 1);
      ctx.fillText(it.text, it.indent, 0);
      ctx.restore();
    });

    if (type.monster) {
      ctx.fillStyle = "#1a1310";
      ctx.fillRect(left, statsY, right - left, 2);
      ctx.font = `600 38px ${SERIF}`;
      ctx.textBaseline = "top";
      const stats = `ATK/${card.atk || "?"}   DEF/${card.def || "?"}`;
      fitText(ctx, stats, right - 6, statsY + 12, right - left, "right", (x, y) => ctx.fillText(stats, x, y));
    }
  }

  function drawFooter(ctx, card, frame) {
    const dark = !isLight(frame) && hexToRgb(frame).reduce((s, c) => s + c, 0) < 200;
    const ink = dark ? "#f2eee6" : "#1a1310";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ink;
    if (card.cardCode.trim()) {
      ctx.font = `500 27px ${SERIF}`;
      ctx.textAlign = "right";
      ctx.fillText(card.cardCode.trim(), LAYOUT.code.x, LAYOUT.code.y);
    }
    if (card.copyright.trim()) {
      ctx.font = `500 23px ${SERIF}`;
      ctx.textAlign = "right";
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
      document.fonts.load(`900 60px "Noto Serif JP"`),
      document.fonts.load(`600 38px "Noto Serif JP"`),
      document.fonts.load(`500 26px "Noto Sans JP"`),
      document.fonts.load(`700 29px "Noto Sans JP"`),
    ]).catch(() => {});
  }

  return { W, H, LAYOUT, render, loadImage, loadFonts };
})();

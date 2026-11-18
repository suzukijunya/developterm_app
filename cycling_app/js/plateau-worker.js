// PLATEAU(国交省の3D都市モデル)の建物タイル(3D Tiles の b3dm)を、シティデュエルの座標に直すワーカー。
// 重い計算(Draco の展開・座標変換・走る道に重なる建物の除外)を、画面を止めずにここでやる。
// 入力: { type: "init", route: { xy, lat0, lon0, kx, kz }, clear }  /  { type: "tile", id, buf }
// 出力: { id, groups: [{ kind: "t"(写真)/"c"(色つき)/"p"(色なし), img(写真の番号), pos, nor, uv, col }], images: [{ bitmap | bytes, mime }], names, n, skipped }
//   壁の写真つきの版(LOD2/3/4)は、写真をそのまま貼る(大きすぎる写真は texMax の幅に縮める)

importScripts("vendor/draco/draco_wasm_wrapper.js");

const dracoP = fetch("vendor/draco/draco_decoder.wasm")
  .then((r) => r.arrayBuffer())
  .then((wasmBinary) => new Promise((res) => DracoDecoderModule({ wasmBinary, onModuleLoaded: (m) => res({ m }) })));
// ↑ モジュール自体が then を持つので、そのまま返すと Promise が待ち続ける。{ m } に包んだまま使う

let R = null; // 走るルート { xy, lat0, lon0, kx, kz, grid }
let CLEAR = 3.5;
let TEXMAX = 4096;

self.onmessage = async (e) => {
  const d = e.data;
  if (d.type === "init") {
    R = d.route;
    CLEAR = d.clear || 3.5;
    TEXMAX = d.texMax || 4096;
    R.grid = new Map();
    const xy = R.xy;
    for (let i = 0; i < xy.length - 1; i++) {
      const a = xy[i], b = xy[i + 1];
      const x0 = Math.floor((Math.min(a[0], b[0]) - CLEAR) / 50), x1 = Math.floor((Math.max(a[0], b[0]) + CLEAR) / 50);
      const z0 = Math.floor((Math.min(a[1], b[1]) - CLEAR) / 50), z1 = Math.floor((Math.max(a[1], b[1]) + CLEAR) / 50);
      for (let x = x0; x <= x1; x++)
        for (let z = z0; z <= z1; z++) {
          const k = x + ":" + z;
          if (!R.grid.has(k)) R.grid.set(k, []);
          R.grid.get(k).push(i);
        }
    }
    return;
  }
  if (d.type === "tile") {
    try {
      const out = await tile(d.buf);
      out.id = d.id;
      const tr = [];
      for (const g of out.groups) tr.push(g.pos.buffer, g.nor.buffer, g.uv.buffer, g.col.buffer);
      for (const im of out.images) tr.push(im.bitmap || im.bytes);
      self.postMessage(out, tr);
    } catch (err) {
      self.postMessage({ id: d.id, error: String((err && err.message) || err) });
    }
  }
};

// ---------- b3dm を読む ----------
async function tile(buf) {
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);
  const td = new TextDecoder();
  if (td.decode(u8.subarray(0, 4)) !== "b3dm") throw new Error("not b3dm");
  const ftj = dv.getUint32(12, true), ftb = dv.getUint32(16, true), btj = dv.getUint32(20, true), btb = dv.getUint32(24, true);
  let p = 28;
  const ft = ftj ? JSON.parse(td.decode(u8.subarray(p, p + ftj))) : {};
  p += ftj + ftb;
  const bt = btj ? JSON.parse(td.decode(u8.subarray(p, p + btj))) : {};
  p += btj + btb;
  // glb
  const glb = p;
  const jsonLen = dv.getUint32(glb + 12, true);
  const gj = JSON.parse(td.decode(u8.subarray(glb + 20, glb + 20 + jsonLen)));
  const binStart = glb + 20 + jsonLen + 8;
  const center = (gj.extensions && gj.extensions.CESIUM_RTC && gj.extensions.CESIUM_RTC.center) || ft.RTC_CENTER || [0, 0, 0];
  const draco = (await dracoP).m;

  const parts = [];
  const usedImg = new Set();
  for (const mesh of gj.meshes || [])
    for (const prim of mesh.primitives || []) {
      const ext = prim.extensions && prim.extensions.KHR_draco_mesh_compression;
      if (!ext) continue;
      const bv = gj.bufferViews[ext.bufferView];
      const arr = new Int8Array(buf, binStart + (bv.byteOffset || 0), bv.byteLength);
      const comps = (name) => {
        const a = gj.accessors[prim.attributes[name]];
        return a ? { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type] || 3 : 3;
      };
      const part = decode(draco, arr, ext.attributes, comps);
      // 材質: 写真(baseColorTexture)があれば、その写真の番号
      const mat = (gj.materials || [])[prim.material] || {};
      const pbr = mat.pbrMetallicRoughness || {};
      const tex = pbr.baseColorTexture ? (gj.textures || [])[pbr.baseColorTexture.index] : null;
      const img = tex ? (tex.source != null ? tex.source : tex.extensions && tex.extensions.EXT_texture_webp ? tex.extensions.EXT_texture_webp.source : null) : null;
      part.img = img != null && part.tex ? img : null;
      part.factor = pbr.baseColorFactor || [1, 1, 1, 1];
      if (part.img != null) usedImg.add(part.img);
      parts.push(part);
    }
  const out = build(parts, center, bt);
  // 写真を取り出して(必要なら縮めて)画像にする
  out.images = [];
  const remap = new Map();
  for (const i of usedImg) {
    const im = gj.images[i];
    if (!im || im.bufferView == null) continue;
    const bv = gj.bufferViews[im.bufferView];
    const bytes = buf.slice(binStart + (bv.byteOffset || 0), binStart + (bv.byteOffset || 0) + bv.byteLength);
    remap.set(i, out.images.length);
    out.images.push(await toBitmap(bytes, im.mimeType || "image/jpeg"));
  }
  for (const g of out.groups) if (g.kind === "t") g.img = remap.has(g.img) ? remap.get(g.img) : -1;
  out.groups = out.groups.filter((g) => g.kind !== "t" || g.img >= 0);
  return out;
}

// 写真の大きさ(WebP/PNG/JPEG の頭から読む)。わからなければ null
function imgSize(b, mime) {
  const u = new Uint8Array(b), dv = new DataView(b);
  try {
    if (/webp/.test(mime)) {
      const tag = String.fromCharCode(u[12], u[13], u[14], u[15]);
      if (tag === "VP8 ") return [dv.getUint16(26, true) & 0x3fff, dv.getUint16(28, true) & 0x3fff];
      if (tag === "VP8L") {
        const v = dv.getUint32(21, true);
        return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1];
      }
      if (tag === "VP8X") return [(u[24] | (u[25] << 8) | (u[26] << 16)) + 1, (u[27] | (u[28] << 8) | (u[29] << 16)) + 1];
    }
    if (/png/.test(mime)) return [dv.getUint32(16), dv.getUint32(20)];
    if (/jpe?g/.test(mime))
      for (let p = 2; p < u.length - 9; ) {
        if (u[p] !== 0xff) break;
        const m = u[p + 1], len = dv.getUint16(p + 2);
        if (m >= 0xc0 && m <= 0xc3) return [dv.getUint16(p + 7), dv.getUint16(p + 5)];
        p += 2 + len;
      }
  } catch (e) {}
  return null;
}
async function toBitmap(bytes, mime) {
  if (typeof createImageBitmap !== "function") return { bytes, mime };
  try {
    const blob = new Blob([bytes], { type: mime });
    const sz = imgSize(bytes, mime);
    const k = sz ? Math.min(1, TEXMAX / Math.max(sz[0], sz[1])) : 1;
    const opt = k < 1 ? { resizeWidth: Math.round(sz[0] * k), resizeHeight: Math.round(sz[1] * k), resizeQuality: "high" } : {};
    let bm = await createImageBitmap(blob, opt);
    if (bm.width > TEXMAX || bm.height > TEXMAX) {
      const k2 = TEXMAX / Math.max(bm.width, bm.height);
      const small = await createImageBitmap(bm, { resizeWidth: Math.round(bm.width * k2), resizeHeight: Math.round(bm.height * k2), resizeQuality: "high" });
      bm.close();
      bm = small;
    }
    return { bitmap: bm };
  } catch (e) {
    return { bytes, mime };
  }
}

function decode(draco, arr, ids, comps) {
  const dec = new draco.Decoder();
  const mesh = new draco.Mesh();
  const db = new draco.DecoderBuffer();
  db.Init(arr, arr.byteLength);
  const st = dec.DecodeBufferToMesh(db, mesh);
  draco.destroy(db);
  if (!st.ok() || mesh.ptr === 0) throw new Error("draco: " + st.error_msg());
  const attr = (id, comps) => {
    const a = dec.GetAttributeByUniqueId(mesh, id);
    const n = mesh.num_points() * comps, bytes = n * 4;
    const ptr = draco._malloc(bytes);
    dec.GetAttributeDataArrayForAllPoints(mesh, a, draco.DT_FLOAT32, bytes, ptr);
    const out = new Float32Array(draco.HEAPF32.buffer, ptr, n).slice();
    draco._free(ptr);
    return out;
  };
  const pos = attr(ids.POSITION, 3);
  const bid = ids._BATCHID != null ? attr(ids._BATCHID, 1) : new Float32Array(mesh.num_points());
  const tex = ids.TEXCOORD_0 != null ? attr(ids.TEXCOORD_0, 2) : null;
  const cn = ids.COLOR_0 != null ? comps("COLOR_0") : 0;
  const color = cn ? attr(ids.COLOR_0, cn) : null;
  const nIdx = mesh.num_faces() * 3, bytes = nIdx * 4;
  const ptr = draco._malloc(bytes);
  dec.GetTrianglesUInt32Array(mesh, bytes, ptr);
  const idx = new Uint32Array(draco.HEAPF32.buffer, ptr, nIdx).slice();
  draco._free(ptr);
  draco.destroy(mesh);
  draco.destroy(dec);
  return { pos, bid, idx, tex, color, cn };
}

// ---------- 座標: 地心座標(ECEF)→ アプリの平面(x=東, z=南, y=上) ----------
const A = 6378137, F = 1 / 298.257222101, E2 = F * (2 - F); // GRS80(JGD2011)
function geodetic(x, y, z) {
  const b = A * (1 - F), ep2 = (A * A - b * b) / (b * b);
  const pp = Math.hypot(x, y), th = Math.atan2(z * A, pp * b);
  const lon = Math.atan2(y, x);
  const lat = Math.atan2(z + ep2 * b * Math.sin(th) ** 3, pp - E2 * A * Math.cos(th) ** 3);
  return { lat, lon };
}

function build(parts, center, bt) {
  const { lat, lon } = geodetic(center[0], center[1], center[2]);
  const sl = Math.sin(lat), cl = Math.cos(lat), so = Math.sin(lon), co = Math.cos(lon);
  const N = A / Math.sqrt(1 - E2 * sl * sl), M = (A * (1 - E2)) / Math.pow(1 - E2 * sl * sl, 1.5);
  const D = Math.PI / 180;
  const latD = lat / D, lonD = lon / D;
  // アプリの地図(project)と同じ縮尺に合わせる
  const cx = (lonD - R.lon0) * R.kx, cz = -(latD - R.lat0) * R.kz;
  const sx = R.kx / (N * cl * D), sz = R.kz / (M * D);
  const names = bt["gml:name"] || [], usage = bt["bldg:usage"] || [];

  // 1) 全頂点をアプリ座標へ。建物(バッチ)ごとに一番低い所をそろえる(地面の起伏はならす)
  let total = 0;
  for (const pt of parts) total += pt.pos.length / 3;
  const P = new Float32Array(total * 3), B = new Int32Array(total);
  let o = 0;
  for (const pt of parts) {
    const q = pt.pos;
    for (let i = 0; i < q.length; i += 3) {
      // glTF は y が上 → 3D Tiles は z が上: (x, y, z) → (x, -z, y)
      const dx = q[i], dy = -q[i + 2], dz = q[i + 1];
      const e = -so * dx + co * dy;
      const n = -sl * co * dx - sl * so * dy + cl * dz;
      const u = cl * co * dx + cl * so * dy + sl * dz;
      P[o * 3] = cx + e * sx;
      P[o * 3 + 1] = u;
      P[o * 3 + 2] = cz - n * sz;
      B[o] = pt.bid[i / 3] | 0;
      o++;
    }
  }
  let maxB = 0;
  for (let i = 0; i < B.length; i++) if (B[i] > maxB) maxB = B[i];
  const NB = maxB + 1;
  const minY = new Float32Array(NB).fill(1e9), maxY = new Float32Array(NB).fill(-1e9);
  const bx0 = new Float32Array(NB).fill(1e9), bx1 = new Float32Array(NB).fill(-1e9), bz0 = new Float32Array(NB).fill(1e9), bz1 = new Float32Array(NB).fill(-1e9);
  for (let i = 0; i < total; i++) {
    const b = B[i], x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
    if (y < minY[b]) minY[b] = y;
    if (y > maxY[b]) maxY[b] = y;
    if (x < bx0[b]) bx0[b] = x;
    if (x > bx1[b]) bx1[b] = x;
    if (z < bz0[b]) bz0[b] = z;
    if (z > bz1[b]) bz1[b] = z;
  }
  // 2) 走る道に重なる建物を外す(建物の輪郭=頂点の凸包に、道の線が入る/近すぎる)
  const pts = Array.from({ length: NB }, () => []);
  for (let i = 0; i < total; i++) pts[B[i]].push(P[i * 3], P[i * 3 + 2]);
  const skip = new Uint8Array(NB);
  let skipped = 0;
  for (let b = 0; b < NB; b++) {
    if (!pts[b].length) continue;
    if (onRoute(pts[b], bx0[b], bx1[b], bz0[b], bz1[b])) (skip[b] = 1), skipped++;
  }
  // 3) 三角形ごとに書き出す。写真つきは写真の座標、色つきはその色、色なしは壁に窓の模様・屋根は暗い色
  const groups = new Map();
  const G = (key, kind, img, n) => {
    let g = groups.get(key);
    if (!g) groups.set(key, (g = { kind, img, cap: 0, w: 0, parts: [] }));
    g.cap += n;
    return g;
  };
  for (const pt of parts) pt.g = pt.img != null ? G("t" + pt.img, "t", pt.img, pt.idx.length) : pt.color ? G("c", "c", null, pt.idx.length) : G("p", "p", null, pt.idx.length);
  for (const g of groups.values()) Object.assign(g, { pos: new Float32Array(g.cap * 3), nor: new Int8Array(g.cap * 3), uv: new Float32Array(g.cap * 2), col: new Uint8Array(g.cap * 3) });
  let base = 0;
  const pal = (b) => {
    const us = usage[b] || "";
    const h = hash(b * 7919 + Math.round(P[0]));
    if (names[b]) return [236, 196, 120]; // 名前のある建物(駅など)は目立たせる
    if (/商業|業務|官公庁|文教|医療|運輸/.test(us)) return [[150, 170, 196], [176, 186, 204], [128, 150, 176]][Math.floor(h * 3)];
    if (/共同住宅/.test(us)) return [[204, 200, 192], [186, 190, 198], [214, 206, 190]][Math.floor(h * 3)];
    return [[222, 210, 188], [206, 198, 186], [196, 188, 176], [214, 214, 210]][Math.floor(h * 4)];
  };
  const colors = new Array(NB);
  for (const pt of parts) {
    const ix = pt.idx;
    const g = pt.g;
    const { pos, nor, uv, col } = g;
    let w = g.w;
    for (let t = 0; t < ix.length; t += 3) {
      const ia = base + ix[t], ib = base + ix[t + 1], ic = base + ix[t + 2];
      const b = B[ia];
      if (skip[b]) continue;
      const ax = P[ia * 3], ay = P[ia * 3 + 1] - minY[b], az = P[ia * 3 + 2];
      const bx = P[ib * 3], by = P[ib * 3 + 1] - minY[b], bz = P[ib * 3 + 2];
      const qx = P[ic * 3], qy = P[ic * 3 + 1] - minY[b], qz = P[ic * 3 + 2];
      // 面の向き
      const ux = bx - ax, uy = by - ay, uz = bz - az, vx = qx - ax, vy = qy - ay, vz = qz - az;
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const L = Math.hypot(nx, ny, nz) || 1;
      nx /= L;
      ny /= L;
      nz /= L;
      const c = g.kind === "p" ? colors[b] || (colors[b] = pal(b)) : null;
      const roof = Math.abs(ny) > 0.55;
      const k = roof ? 0.5 : 1;
      const vi = [ix[t], ix[t + 1], ix[t + 2]];
      const V = [ax, ay, az, bx, by, bz, qx, qy, qz];
      for (let j = 0; j < 3; j++) {
        const X = V[j * 3], Y = V[j * 3 + 1], Z = V[j * 3 + 2];
        pos[w * 3] = X;
        pos[w * 3 + 1] = Y;
        pos[w * 3 + 2] = Z;
        nor[w * 3] = Math.round(nx * 127);
        nor[w * 3 + 1] = Math.round(ny * 127);
        nor[w * 3 + 2] = Math.round(nz * 127);
        const v = vi[j];
        if (g.kind === "t") {
          uv[w * 2] = pt.tex[v * 2];
          uv[w * 2 + 1] = pt.tex[v * 2 + 1];
          col[w * 3] = col[w * 3 + 1] = col[w * 3 + 2] = 255;
        } else if (g.kind === "c") {
          const f = pt.factor, cn = pt.cn;
          for (let q = 0; q < 3; q++) col[w * 3 + q] = Math.max(0, Math.min(255, Math.round(pt.color[v * cn + q] * f[q] * 255)));
        } else {
          if (roof) (uv[w * 2] = 0.004), (uv[w * 2 + 1] = 0.004);
          else {
            // 壁にそって横に進む距離で、窓の模様を貼る
            uv[w * 2] = (-X * nz + Z * nx) / 28;
            uv[w * 2 + 1] = Y / 25.6;
          }
          col[w * 3] = c[0] * k;
          col[w * 3 + 1] = c[1] * k;
          col[w * 3 + 2] = c[2] * k;
        }
        w++;
      }
    }
    g.w = w;
    base += pt.pos.length / 3;
  }
  const lm = [];
  for (let b = 0; b < NB; b++) if (names[b] && !skip[b] && pts[b].length) lm.push({ name: String(names[b]), x: (bx0[b] + bx1[b]) / 2, z: (bz0[b] + bz1[b]) / 2, h: maxY[b] - minY[b] });
  const out = [];
  for (const g of groups.values()) if (g.w) out.push({ kind: g.kind, img: g.img, pos: g.pos.slice(0, g.w * 3), nor: g.nor.slice(0, g.w * 3), uv: g.uv.slice(0, g.w * 2), col: g.col.slice(0, g.w * 3) });
  return { groups: out, names: lm, n: NB - skipped, skipped };
}

function hash(n) {
  let x = (n ^ 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

// ---------- 道に重なるか ----------
function hull(flat) {
  const p = [];
  for (let i = 0; i < flat.length; i += 2) p.push([flat[i], flat[i + 1]]);
  p.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  up.pop();
  lo.pop();
  return lo.concat(up);
}
function segDist(a, b, c, d) {
  const pd = (p, q, r) => {
    const vx = r[0] - q[0], vz = r[1] - q[1], L = vx * vx + vz * vz;
    const t = L ? Math.max(0, Math.min(1, ((p[0] - q[0]) * vx + (p[1] - q[1]) * vz) / L)) : 0;
    return Math.hypot(p[0] - q[0] - vx * t, p[1] - q[1] - vz * t);
  };
  const cr = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  if (cr(a, b, c) * cr(a, b, d) < 0 && cr(c, d, a) * cr(c, d, b) < 0) return 0;
  return Math.min(pd(a, c, d), pd(b, c, d), pd(c, a, b), pd(d, a, b));
}
function onRoute(flat, x0, x1, z0, z1) {
  const segs = new Set();
  for (let x = Math.floor((x0 - CLEAR) / 50); x <= Math.floor((x1 + CLEAR) / 50); x++)
    for (let z = Math.floor((z0 - CLEAR) / 50); z <= Math.floor((z1 + CLEAR) / 50); z++) for (const i of R.grid.get(x + ":" + z) || []) segs.add(i);
  if (!segs.size) return false;
  const h = hull(flat);
  if (h.length < 3) return false;
  for (const i of segs) {
    const a = R.xy[i], b = R.xy[i + 1];
    // 道の点が建物の中
    for (const q of [a, b]) {
      let inside = true;
      for (let j = 0; j < h.length; j++) {
        const p0 = h[j], p1 = h[(j + 1) % h.length];
        if ((p1[0] - p0[0]) * (q[1] - p0[1]) - (p1[1] - p0[1]) * (q[0] - p0[0]) < 0) {
          inside = false;
          break;
        }
      }
      if (inside) return true;
    }
    for (let j = 0; j < h.length; j++) if (segDist(a, b, h[j], h[(j + 1) % h.length]) < CLEAR) return true;
  }
  return false;
}
